"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useShipmentStore, Address, Package } from "@/store/shipment-store";
import {
  VerticalTimeline,
  TimelineStep,
} from "@/components/shipment/vertical-timeline";
import { StackedSection } from "@/components/shipment/stacked-section";
import AddressForm from "@/components/shipment/address-form";
import PackageForm from "@/components/shipment/package-form";
import TierSelection from "@/components/shipment/tier-selection";
import CustomsForm from "@/components/shipment/customs-form";
import SummaryDrawer from "@/components/shipment/summary-drawer";
import {
  FiMapPin,
  FiPackage,
  FiTruck,
  FiCheckCircle,
  FiClipboard,
} from "react-icons/fi";
import { useToast } from "@/hooks/use-toast";
import Button from "@/components/ui/button";
import {
  useGetShippingEstimate,
  useCreateShipment,
} from "@/hooks/shipments/use-shipments";
import { getOrSetGuestId } from "@/utils/auth-helper";
import {
  CustomsData,
  ShippingEstimateResponse,
  ShippingTier,
  TIER_KEYS,
} from "@/types/shipping";
import { formatCurrency } from "@/utils/currency-formatter";
import { SupportedCurrency } from "@/types/country";
import { getEstimatePayload } from "@/app/(marketing)/shipping-estimate/utils";
import { useCountryStore } from "@/store/country-store";
import CurrencySwitcher from "@/components/shipment/currency-switcher";
import HeavyShipmentModal from "@/components/ui/heavy-shipment-modal";
import { deepTransformData } from "@/utils/data-transform";
import { buildCreateShipmentPayload } from "@/utils/create-shipment-payload";

import { useLocationPermission } from "@/hooks/use-location-permission";
import { LocationPermissionOverlay } from "@/components/ui/location-permission-overlay";
import { AccountVerificationModal } from "@/components/shipment/account-verification-modal";
import { useVerification } from "@/hooks/shipments/useVerification";
import { extractApiError } from "@/utils/error-handler";
import useUserCountryCode from "@/hooks/use-user-country-code";

/** Weight threshold for heavy shipment modal (in kg) */
const HEAVY_SHIPMENT_THRESHOLD = 70;

/**
 * NewShipmentPage provides a single-page, vertically-stacked flow for shipment creation.
 * It integrates the VerticalTimeline and StackedSection components for a streamlined UX.
 */
export default function NewShipmentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const invoiceId = searchParams?.get("invoiceId") || undefined;

  const {
    completedSteps,
    expandedSection,
    setExpandedSection,
    markSectionCompleted,
    markSectionIncomplete,
    reset,
    sender,
    setSender,
    recipient,
    setRecipient,
    packages,
    setPackages,
    customs,
    setCustoms,
    estimateId,
    setEstimateId,
    selectedTier,
    setSelectedTier,
    clearEstimate,
  } = useShipmentStore();

  const isInternational =
    sender?.country &&
    recipient?.country &&
    sender.country !== recipient.country;

  const { countryCode } = useUserCountryCode(sender?.country);
  const { currency: activeCurrency, setCurrency } = useCountryStore();

  const [estimate, setEstimate] = useState<ShippingEstimateResponse | null>(
    null,
  );
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [isHeavyShipmentModalOpen, setIsHeavyShipmentModalOpen] =
    useState(false);
  const { addToast } = useToast();

  const { permission, requestPermission } = useLocationPermission();
  const { isVerificationRequired, error, triggerVerification } =
    useVerification();

  const lastFetchedEstimateSignatureRef = useRef<string | null>(null);
  const [isFetchingRates, setIsFetchingRates] = useState(false);

  // Branding is a display concern only. `routingRef` and `estimateId` are on
  // the skip list, so the copy is rewritten while the handles stay intact.
  const displayTiers = useMemo(
    () => (estimate?.tiers ? deepTransformData(estimate.tiers) : undefined),
    [estimate],
  );

  // Carrier errors are customer-facing too, and carry the carrier's real name
  // in their text ("FedEx Rate Error: 400"). Brand them like everything else.
  const displayErrors = useMemo(
    () => (estimate?.errors ? deepTransformData(estimate.errors) : undefined),
    [estimate],
  );
  const displaySelectedTier = useMemo(
    () => (selectedTier ? deepTransformData(selectedTier) : null),
    [selectedTier],
  );

  // Auto-request location permission if in prompt state
  useEffect(() => {
    if (permission === "prompt") {
      requestPermission();
    }
  }, [permission, requestPermission]);

  // Rate calculation mutation
  const { mutate: getRates, isPending: isCalculatingRates } =
    useGetShippingEstimate({
      onSuccess: (data) => {
        setIsFetchingRates(false);
        setEstimate(data);
        setEstimateId(data.estimateId);
      },
      onError: () => {
        setIsFetchingRates(false);
        addToast({
          title: "Calculation Failed",
          message:
            "Unable to calculate shipping rates. Please check address details.",
          type: "error",
        });
      },
    });

  // Create shipment mutation
  const { mutate: performCreateShipment, isPending: isCreatingShipment } =
    useCreateShipment();

  // Cleanup / Reset Logic (Fixed for Duplication & Strict Mode)
  // 1. If we arrive with ?source=duplicate, we KEEP the store data (it was just set).
  // 2. If we arrive cleanly (reload, nav), we RESET the store.
  // 3. We remove duplication flag immediately so reload works as expected.
  // 4. We do NOT use cleanup on unmount because Strict Mode triggers it prematurely.
  const source = searchParams.get("source");
  const verificationRequiredParam =
    searchParams.get("verificationRequired") === "1";
  const guardParam = searchParams.get("guard");

  const requiresEmailVerification =
    error?.type === "EMAIL_NOT_VERIFIED" ||
    error?.type === "BOTH" ||
    guardParam === "email" ||
    guardParam === "both";

  const shouldShowVerificationModal =
    isVerificationRequired ||
    verificationRequiredParam;

  const handleVerifyEmail = () => {
    router.push("/app/account?openVerifyEmail=1&next=/app/shipments/new");
  };

  useEffect(() => {
    lastFetchedEstimateSignatureRef.current = null;
    if (source === "duplicate") {
      // Preservation Mode: Don't reset. Just clean the URL.
      router.replace("/app/shipments/new");
    } else {
      // Clean Entry Mode: Reset everything.
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run ONCE on mount

  /**
   * Everything that changes what is being shipped, or what it should cost.
   * Used both to skip redundant re-quotes and to detect a stale one.
   */
  const shipmentSignature = useMemo(
    () =>
      JSON.stringify({
        sender,
        recipient,
        packages,
        countryCode: countryCode || null,
        customs: customs || null,
        isInternational,
        currency: activeCurrency,
      }),
    [
      sender,
      recipient,
      packages,
      countryCode,
      customs,
      isInternational,
      activeCurrency,
    ],
  );

  const invalidateQuote = useCallback(() => {
    setEstimate(null);
    clearEstimate();
    lastFetchedEstimateSignatureRef.current = null;
    markSectionIncomplete("service");
  }, [clearEstimate, markSectionIncomplete]);

  /**
   * Discard a quote that no longer describes this shipment.
   *
   * The server still resolves a stale `estimateId`, so keeping one around
   * books the previous quote — a different parcel, at a price the customer
   * never saw — instead of failing. Deriving this from the signature rather
   * than from individual change handlers means a new form field cannot forget
   * to invalidate.
   */
  useEffect(() => {
    if (lastFetchedEstimateSignatureRef.current === null) return;
    if (lastFetchedEstimateSignatureRef.current === shipmentSignature) return;
    invalidateQuote();
  }, [shipmentSignature, invalidateQuote]);

  // Auto-fetch rates if we land on Service Selection (e.g. from Duplicate functionality)
  useEffect(() => {
    if (
      expandedSection !== "service" ||
      isCalculatingRates ||
      !sender ||
      !recipient ||
      packages.length === 0
    ) {
      return;
    }

    const formattedPackages = packages.map((pkg) => ({
      weight: {
        value: parseFloat(pkg.weight.toFixed(2)),
        units: "KG",
      },
      dimensions: {
        length: parseFloat(pkg.length.toFixed(1)),
        width: parseFloat(pkg.width.toFixed(1)),
        height: parseFloat(pkg.height.toFixed(1)),
        units: "CM",
      },
    }));

    const payload = getEstimatePayload(
      {
        city: sender.city,
        countryCode: sender.country,
        stateOrProvinceCode: sender.stateOrProvinceCode || "",
        postalCode: sender.postalCode,
        streetLines: [sender.street],
      },
      {
        city: recipient.city,
        countryCode: recipient.country,
        stateOrProvinceCode: recipient.stateOrProvinceCode || "",
        postalCode: recipient.postalCode,
        streetLines: [recipient.street],
      },
      formattedPackages,
      getOrSetGuestId(),
      countryCode || undefined,
      customs || undefined,
      activeCurrency,
    );

    if (lastFetchedEstimateSignatureRef.current === shipmentSignature) {
      return;
    }

    lastFetchedEstimateSignatureRef.current = shipmentSignature;
    setIsFetchingRates(true);
    getRates(payload);
  }, [
    shipmentSignature,
    expandedSection,
    isCalculatingRates,
    sender,
    recipient,
    packages,
    getRates,
    countryCode,
    customs,
    addToast,
    isInternational,
    activeCurrency,
  ]);

  const steps: TimelineStep[] = useMemo(() => {
    const arr: TimelineStep[] = [
      {
        id: "pickup",
        label: "Pick-up Details",
        status:
          expandedSection === "pickup"
            ? "current"
            : completedSteps.includes("pickup")
              ? "completed"
              : "pending",
      },
      {
        id: "dropoff",
        label: "Drop-off Details",
        status:
          expandedSection === "dropoff"
            ? "current"
            : completedSteps.includes("dropoff")
              ? "completed"
              : "pending",
      },
      {
        id: "package",
        label: "Package Details",
        status:
          expandedSection === "package"
            ? "current"
            : completedSteps.includes("package")
              ? "completed"
              : "pending",
      },
      {
        id: "customs",
        label: "Customs Details",
        status:
          expandedSection === "customs"
            ? "current"
            : completedSteps.includes("customs")
              ? "completed"
              : "pending",
      },
    ];

    arr.push({
      id: "service",
      label: "Service Selection",
      status:
        expandedSection === "service"
          ? "current"
          : completedSteps.includes("service")
            ? "completed"
            : "pending",
    });

    return arr;
  }, [expandedSection, completedSteps]);

  const isSectionVisible = (id: string) => {
    if (id === "pickup") return true;
    if (id === "dropoff") return completedSteps.includes("pickup");
    if (id === "package") return completedSteps.includes("dropoff");
    if (id === "customs")
      return isInternational && completedSteps.includes("package");
    if (id === "service") {
      return isInternational
        ? completedSteps.includes("customs")
        : completedSteps.includes("package");
    }
    return false;
  };

  const handlePickupSubmit = (values: Address) => {
    setSender(values);
    markSectionCompleted("pickup");
    setExpandedSection("dropoff");
    addToast({
      title: "Success",
      message: "Pick-up details saved successfully.",
      type: "success",
    });
    document
      .getElementById("dropoff")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const handleDropoffSubmit = (values: Address) => {
    setRecipient(values);
    markSectionCompleted("dropoff");
    setExpandedSection("package");
    addToast({
      title: "Success",
      message: "Drop-off details saved successfully.",
      type: "success",
    });
    document
      .getElementById("package")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const handlePackageSubmit = (pkgs: Package[]) => {
    // Check for heavy shipment (70kg+)
    const hasHeavy = pkgs.some((pkg) => pkg.weight >= HEAVY_SHIPMENT_THRESHOLD);
    if (hasHeavy) {
      setIsHeavyShipmentModalOpen(true);
      return;
    }

    setPackages(pkgs);
    markSectionCompleted("package");
    invalidateQuote();

    const nextSection = isInternational ? "customs" : "service";
    setExpandedSection(nextSection);

    addToast({
      title: "Success",
      message: "Package details confirmed.",
      type: "success",
    });
    document
      .getElementById(nextSection)
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const handleCustomsSubmit = (data: CustomsData) => {
    setCustoms(data);
    markSectionCompleted("customs");
    invalidateQuote();
    setExpandedSection("service");

    addToast({
      title: "Success",
      message: "Customs details confirmed.",
      type: "success",
    });
    document
      .getElementById("service")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const handleTierSelect = (tier: ShippingTier) => {
    // Resolve back to the raw tier. The list renders branded copy, and the
    // routingRef must reach the server exactly as it was issued.
    const rawTier =
      TIER_KEYS.map((key) => estimate?.tiers?.[key]).find(
        (candidate) => candidate?.routingRef === tier.routingRef,
      ) ?? tier;

    setSelectedTier(rawTier);
    markSectionCompleted("service");
    setIsSummaryOpen(true);
    addToast({
      title: "Service Selected",
      message: `${tier.label} chosen. Review your shipment to continue.`,
      type: "success",
    });
  };

  const handleFinalize = (paymentMethod: "stripe" | "payu") => {
    if (
      !sender ||
      !recipient ||
      packages.length === 0 ||
      !estimateId ||
      !selectedTier ||
      (isInternational && !customs)
    ) {
      addToast({
        title: "Missing Information",
        message: "Please ensure all steps are completed before finalizing.",
        type: "error",
      });
      return;
    }

    const payload = buildCreateShipmentPayload({
      estimateId,
      routingRef: selectedTier.routingRef,
      sender,
      recipient,
      packages: packages.map((pkg) => ({
        weight: {
          value: pkg.weight,
          units: "KG",
        },
        dimensions: {
          length: pkg.length,
          width: pkg.width,
          height: pkg.height,
          units: "CM",
        },
      })),
      customs: customs ?? undefined,
      userCountryCode: countryCode,
      preferredPaymentOption: paymentMethod,
      invoiceId,
      currency: activeCurrency,
    });

    performCreateShipment(payload, {
      onSuccess: (data) => {
        if (data?.paymentGateway) {
          localStorage.setItem("lastPaymentGateway", data.paymentGateway);
        }
        if (data?.shipmentId) {
          localStorage.setItem("lastShipmentId", data.shipmentId);
        }

        addToast({
          title: "Shipment Initialized",
          message: "Redirecting to invoice...",
          type: "success",
        });

        // Small delay to let the user see the toast
        setTimeout(() => {
          if (data.invoice?.id) {
            router.push(`/app/invoices/${data.invoice.id}`);
          } else if (data.checkoutUrl) {
            window.location.href = data.checkoutUrl;
          } else {
            addToast({
              title: "Error",
              message: "Invoice or Checkout URL not found. Please try again.",
              type: "error",
            });
          }
        }, 1000);
      },
      onError: (error: unknown) => {
        let msg = "Unable to create shipment. Please try again.";
        let isAddressRequired = false;
        let status: number | undefined;

        if (error && typeof error === "object" && "response" in error) {
          const res = (
            error as {
              response?: {
                status?: number;
                data?: {
                  error?: string;
                  details?: string;
                };
              };
            }
          ).response;

          status = res?.status;

          if (res?.data?.error) msg = res.data.error;
          isAddressRequired = res?.data?.error === "ADDRESS_REQUIRED";

          if (isAddressRequired && res?.data?.details) {
            msg = res?.data.details as string;
          }
        }

        // An unverified account is refused in the service layer, and the throw
        // is not mapped — so it arrives as a 500 rather than a 403, carrying
        // only its message. Match on that before blaming the server. The CTA
        // gate on `is_verified` normally prevents reaching this at all.
        const { message: apiMessage } = extractApiError(error);
        if (/email verification required/i.test(apiMessage || msg)) {
          addToast({
            title: "Verify Your Email",
            message:
              "Please verify your email address before creating a shipment.",
            type: "error",
          });
          triggerVerification();
          return;
        }

        // Carrier pricing moved on. The quote is refused rather than honoured
        // at a stale figure, so re-quote and let the customer re-pick — the
        // same routingRef will keep failing.
        if (status === 409) {
          invalidateQuote();
          setIsSummaryOpen(false);
          setExpandedSection("service");
          addToast({
            title: "Prices Have Changed",
            message:
              "This quote has expired. We're fetching current prices — please choose again.",
            type: "error",
          });
          return;
        }

        addToast({
          title: "Creation Failed",
          message: msg,
          type: "error",
        });
      },
    });
  };

  if (permission === "denied") {
    return <LocationPermissionOverlay onRetry={requestPermission} />;
  }

  if (permission !== "granted") {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center p-8 text-center animate-in fade-in duration-300">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-blue border-t-transparent mb-4"></div>
        <p className="text-gray-500 font-medium">
          Waiting for location permission...
        </p>
      </div>
    );
  }

  return (
    <>
      <AccountVerificationModal
        isOpen={shouldShowVerificationModal}
        requiresEmailVerification={requiresEmailVerification}
        requiresAddressUpdate={false}
        onVerifyEmail={handleVerifyEmail}
      />

      <div
        className={`flex flex-col lg:flex-row gap-8 items-start transition-all ${
          shouldShowVerificationModal ? "pointer-events-none select-none" : ""
        }`}
      >
        {/* Left Sidebar: Timeline */}
        <div className="hidden lg:block w-64 sticky top-24">
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <h4 className="text-[10px] uppercase tracking-widest text-gray-400 font-black mb-6">
              Shipment Journey
            </h4>
            <VerticalTimeline steps={steps} />
          </div>
        </div>

        {/* Main Content: Stacked Sections */}
        <div className="flex-1 w-full space-y-4">
          {/* Navigation Warning Notice */}

          {/* 1. Pick-up Details */}
          <StackedSection
            id="pickup"
            title="Pick-up Details"
            icon={<FiMapPin className="w-5 h-5" />}
            isExpanded={expandedSection === "pickup"}
            isCompleted={completedSteps.includes("pickup")}
            onEdit={() => setExpandedSection("pickup")}
            summary={
              sender && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-black text-gray-400 mb-1">
                      Contact
                    </p>
                    <p className="font-bold text-gray-900 leading-tight">
                      {sender.name}
                    </p>
                    <p className="text-xs text-gray-500 font-medium">
                      {sender.phone}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-black text-gray-400 mb-1">
                      Location
                    </p>
                    <p className="font-bold text-gray-900 leading-tight">
                      {sender.city}
                    </p>
                    <p className="text-xs text-gray-500 font-medium line-clamp-1">
                      {sender.street}
                    </p>
                  </div>
                </div>
              )
            }
          >
            {/*
              No fulfillment questions here. Courier pickup and drop-off are
              chosen after payment, on the shipment page, once the carrier and
              the leg are known — before that there is no carrier to ask about.
            */}
            <AddressForm
              type="pickup"
              initialValues={sender || undefined}
              onSubmit={handlePickupSubmit}
            />
          </StackedSection>

          {/* 2. Drop-off Details */}
          {isSectionVisible("dropoff") && (
            <StackedSection
              id="dropoff"
              title="Drop-off Details"
              icon={<FiMapPin className="w-5 h-5" />}
              isExpanded={expandedSection === "dropoff"}
              isCompleted={completedSteps.includes("dropoff")}
              onEdit={() => setExpandedSection("dropoff")}
              summary={
                recipient && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest font-black text-gray-400 mb-1">
                        Contact
                      </p>
                      <p className="font-bold text-gray-900 leading-tight">
                        {recipient.name}
                      </p>
                      <p className="text-xs text-gray-500 font-medium">
                        {recipient.phone}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest font-black text-gray-400 mb-1">
                        Location
                      </p>
                      <p className="font-bold text-gray-900 leading-tight">
                        {recipient.city}
                      </p>
                      <p className="text-xs text-gray-500 font-medium line-clamp-1">
                        {recipient.street}
                      </p>
                    </div>
                  </div>
                )
              }
            >
              <AddressForm
                type="dropoff"
                initialValues={recipient || undefined}
                onSubmit={handleDropoffSubmit}
                onBack={() => setExpandedSection("pickup")}
              />
            </StackedSection>
          )}

          {/* 3. Package Details */}
          {isSectionVisible("package") && (
            <StackedSection
              id="package"
              title="Package Details"
              icon={<FiPackage className="w-5 h-5" />}
              isExpanded={expandedSection === "package"}
              isCompleted={completedSteps.includes("package")}
              onEdit={() => setExpandedSection("package")}
              summary={
                packages.length > 0 && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest font-black text-gray-400 mb-1">
                        Packages
                      </p>
                      <p className="font-bold text-gray-900 leading-tight">
                        {packages.length} package{packages.length > 1 ? "s" : ""}
                      </p>
                      <p className="text-xs text-gray-500 font-medium">
                        Total weight: {packages.reduce((acc, p) => acc + p.weight, 0).toFixed(2)} kg
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest font-black text-gray-400 mb-1">
                        Descriptions
                      </p>
                      <p className="font-bold text-gray-900 leading-tight line-clamp-2">
                        {packages.map((p) => p.description).filter(Boolean).join(", ")}
                      </p>
                    </div>
                  </div>
                )
              }
            >
              <PackageForm
                initialValues={packages.length > 0 ? packages : null}
                onSubmit={handlePackageSubmit}
                onSync={setPackages}
                onBack={() => setExpandedSection("dropoff")}
                submitLabel={isInternational ? "Customs Details" : "Get Rates"}
                isInternational={Boolean(isInternational)}
                currency={activeCurrency}
              />
            </StackedSection>
          )}

          {/* 4. Customs Details */}
          {isSectionVisible("customs") && (
            <StackedSection
              id="customs"
              title="Customs Details"
              icon={<FiClipboard className="w-5 h-5" />}
              isExpanded={expandedSection === "customs"}
              isCompleted={completedSteps.includes("customs")}
              onEdit={() => setExpandedSection("customs")}
              summary={
                customs && (
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-black text-gray-400 mb-1">
                      Declaration Type
                    </p>
                    <p className="font-bold text-gray-900 leading-tight">
                      {customs.customsType === "S" ? "Business" : "Individual"}{" "}
                      - {customs.customsItem?.length} items
                    </p>
                  </div>
                )
              }
            >
              <CustomsForm
                initialValues={customs}
                packages={packages}
                sender={sender}
                currency={activeCurrency}
                onSubmit={handleCustomsSubmit}
                onBack={() => setExpandedSection("package")}
              />
            </StackedSection>
          )}

          {/* 5. Service Selection */}
          {isSectionVisible("service") && (
            <StackedSection
              id="service"
              title="Service Selection"
              icon={<FiTruck className="w-5 h-5" />}
              isExpanded={expandedSection === "service"}
              isCompleted={completedSteps.includes("service")}
              onEdit={() => setExpandedSection("service")}
              headerAction={
                <CurrencySwitcher
                  currency={activeCurrency}
                  onChange={setCurrency}
                  disabled={isFetchingRates}
                />
              }
              summary={
                displaySelectedTier && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-brand-blue/10 flex items-center justify-center text-brand-blue">
                      <FiCheckCircle className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-900 leading-tight">
                        {displaySelectedTier.label}
                      </p>
                      <p className="text-xs text-brand-blue font-bold tracking-tight">
                        {formatCurrency(
                          displaySelectedTier.actualPrice,
                          displaySelectedTier.currency as SupportedCurrency,
                        )}
                      </p>
                    </div>
                  </div>
                )
              }
            >
              <TierSelection
                tiers={displayTiers}
                hasRates={(estimate?.rates?.length ?? 0) > 0}
                errors={displayErrors}
                selectedRoutingRef={selectedTier?.routingRef ?? null}
                onSelect={handleTierSelect}
                isLoading={isFetchingRates}
                onBack={() =>
                  setExpandedSection(isInternational ? "customs" : "package")
                }
              />
            </StackedSection>
          )}

          {/* Action Button for Summary (if not already open) */}
          {completedSteps.includes("service") && !isSummaryOpen && (
            <Button
              variant="primary"
              size="lg"
              className="w-full h-16 rounded-3xl text-lg font-black shadow-2xl shadow-brand-blue/30 mt-8 animate-in fade-in zoom-in-95 duration-500"
              onClick={() => setIsSummaryOpen(true)}
            >
              Review & Create Shipment <FiCheckCircle className="ml-2" />
            </Button>
          )}
        </div>

        {/* Summary Drawer */}
        <SummaryDrawer
          isOpen={isSummaryOpen}
          onClose={() => setIsSummaryOpen(false)}
          sender={sender}
          recipient={recipient}
          packages={packages}
          tier={displaySelectedTier}
          onFinalize={handleFinalize}
          isLoading={isCreatingShipment}
        />

        {/* Heavy Shipment Modal */}
        <HeavyShipmentModal
          isOpen={isHeavyShipmentModalOpen}
          onClose={() => setIsHeavyShipmentModalOpen(false)}
        />
      </div>
    </>
  );
}
