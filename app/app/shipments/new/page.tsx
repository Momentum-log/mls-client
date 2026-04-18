"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useShipmentStore, Address, Package } from "@/store/shipment-store";
import {
  VerticalTimeline,
  TimelineStep,
} from "@/components/shipment/vertical-timeline";
import { StackedSection } from "@/components/shipment/stacked-section";
import AddressForm from "@/components/shipment/address-form";
import PackageForm from "@/components/shipment/package-form";
import ServiceSelection from "@/components/shipment/service-selection";
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
import { Rate, CustomsData, ShipmentMutationPayload } from "@/types/shipping";
import { getEstimatePayload } from "@/app/(marketing)/shipping-estimate/utils";
import { useCountryStore } from "@/store/country-store";
import HeavyShipmentModal from "@/components/ui/heavy-shipment-modal";
import { deepTransformData } from "@/utils/data-transform";

import { useLocationPermission } from "@/hooks/use-location-permission";
import { LocationPermissionOverlay } from "@/components/ui/location-permission-overlay";
import { AccountVerificationModal } from "@/components/shipment/account-verification-modal";
import { useVerification } from "@/hooks/shipments/useVerification";

/** Weight threshold for heavy shipment modal (in kg) */
const HEAVY_SHIPMENT_THRESHOLD = 70;

/**
 * NewShipmentPage provides a single-page, vertically-stacked flow for shipment creation.
 * It integrates the VerticalTimeline and StackedSection components for a streamlined UX.
 */
export default function NewShipmentPage() {
  const router = useRouter();
  const {
    completedSteps,
    expandedSection,
    setExpandedSection,
    markSectionCompleted,
    reset,
    sender,
    setSender,
    recipient,
    setRecipient,
    packages,
    addPackage,
    updatePackage,
    customs,
    setCustoms,
    selectedRate,
    setSelectedRate,
  } = useShipmentStore();

  const isInternational =
    sender?.country &&
    recipient?.country &&
    sender.country !== recipient.country;

  const { countryCode } = useCountryStore();
  const activeCurrency = countryCode === "PL" ? "PLN" : "EUR";

  const [rates, setRates] = useState<Rate[]>([]);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [isHeavyShipmentModalOpen, setIsHeavyShipmentModalOpen] =
    useState(false);
  const { addToast } = useToast();

  const { permission, requestPermission } = useLocationPermission();
  const { isVerificationRequired, error } = useVerification();

  // Create memoized transformed rates for UI display only
  const transformedRates = useMemo(() => deepTransformData(rates), [rates]);
  const hasFetchedRatesRef = useRef(false);
  const [isFetchingRates, setIsFetchingRates] = useState(false);

  // Transform selectedRate for UI display only
  const displaySelectedRate = useMemo(
    () => (selectedRate ? deepTransformData(selectedRate) : null),
    [selectedRate],
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
        hasFetchedRatesRef.current = false;
        console.log("Fetched rates on load:", data);
        setRates(data.rates);
      },
      onError: () => {
        hasFetchedRatesRef.current = false;
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
  const searchParams = useSearchParams();
  const source = searchParams.get("source");
  const verificationRequiredParam =
    searchParams.get("verificationRequired") === "1";
  const guardParam = searchParams.get("guard");

  const requiresEmailVerification =
    error?.type === "EMAIL_NOT_VERIFIED" ||
    error?.type === "BOTH" ||
    guardParam === "email" ||
    guardParam === "both";

  const requiresAddressUpdate =
    error?.type === "ADDRESS_INCOMPLETE" ||
    error?.type === "BOTH" ||
    guardParam === "address" ||
    guardParam === "both";

  const shouldShowVerificationModal =
    isVerificationRequired || verificationRequiredParam;

  const handleVerifyEmail = () => {
    router.push("/app/account?openVerifyEmail=1&next=/app/shipments/new");
  };

  const handleUpdateAddress = () => {
    router.push("/app/account?focusAddress=1&next=/app/shipments/new");
  };

  useEffect(() => {
    if (source === "duplicate") {
      // Preservation Mode: Don't reset. Just clean the URL.
      router.replace("/app/shipments/new");
    } else {
      // Clean Entry Mode: Reset everything.
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run ONCE on mount

  // Navigation warning for unsaved changes

  // Auto-fetch rates if we land on Service Selection (e.g. from Duplicate functionality)

  useEffect(() => {
    console.log("🔥 effect entered", {
      expandedSection,
      hasFetched: hasFetchedRatesRef.current,
      isCalculatingRates,
      sender: !!sender,
      recipient: !!recipient,
      packagesLength: packages.length,
    });

    if (
      expandedSection !== "service" ||
      hasFetchedRatesRef.current || // ← hard guard: only ever fire once per mount
      isCalculatingRates ||
      !sender ||
      !recipient ||
      packages.length === 0
    ) {
      console.log("Early Return - Not all conditions met");
      return;
    }

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
      {
        weight: {
          value: parseFloat(packages[0].weight.toFixed(2)),
          units: "KG",
        },
        dimensions: {
          length: parseFloat(packages[0].length.toFixed(1)),
          width: parseFloat(packages[0].width.toFixed(1)),
          height: parseFloat(packages[0].height.toFixed(1)),
          units: "CM",
        },
      },
      getOrSetGuestId(),
      countryCode || undefined,
      customs || undefined,
    );

    hasFetchedRatesRef.current = true;
    setIsFetchingRates(true);
    getRates(payload);
  }, [
    expandedSection,
    isCalculatingRates,
    sender,
    recipient,
    packages,
    getRates,
    countryCode,
    customs,
    addToast,
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
    if (id === "customs") return completedSteps.includes("package");
    if (id === "service") return completedSteps.includes("customs");
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

  const handlePackageSubmit = (pkg: Package) => {
    // Check for heavy shipment (70kg+)
    if (pkg.weight >= HEAVY_SHIPMENT_THRESHOLD) {
      setIsHeavyShipmentModalOpen(true);
      return;
    }

    addPackage(pkg);
    markSectionCompleted("package");
    setRates([]); // Clear previous rates to trigger re-fetch in useEffect

    if (isInternational) {
      setExpandedSection("customs");
    } else {
      setExpandedSection("service");
    }

    addToast({
      title: "Success",
      message: "Package details confirmed.",
      type: "success",
    });
    document
      .getElementById("customs")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const handleCustomsSubmit = (data: CustomsData) => {
    setCustoms(data);
    markSectionCompleted("customs");
    setRates([]); // Clear previous rates
    setExpandedSection("service");

    addToast({
      title: "Success",
      message: "Customs details confirmed.",
      type: "success",
    });
    document
      .getElementById("service")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });

    hasFetchedRatesRef.current = false;
    setRates([]);
  };

  const handleServiceSelect = (rate: Rate) => {
    // Find matching original rate to preserve raw carrier data for the backend
    const originalRate =
      rates.find((r) => r.serviceType === rate.serviceType) || rate;
    setSelectedRate(originalRate);
    markSectionCompleted("service");
    setIsSummaryOpen(true);
    addToast({
      title: "Service Selected",
      message: `${deepTransformData(originalRate.serviceName)} chosen. Review your shipment to continue.`,
      type: "success",
    });
  };

  const handleFinalize = (paymentMethod: "stripe" | "payu") => {
    if (
      !sender ||
      !recipient ||
      !packages[0] ||
      !selectedRate ||
      (isInternational && !customs)
    ) {
      addToast({
        title: "Missing Information",
        message: "Please ensure all steps are completed before finalizing.",
        type: "error",
      });
      return;
    }

    const payload: ShipmentMutationPayload = {
      carrierSlug:
        selectedRate.carrierSlug ||
        selectedRate.carrier?.toLowerCase().replace(/\s+/g, "-") ||
        "fedex", // Use slug if available, else derive from name
      pickupAddress: {
        streetLines: [sender.street],
        city: sender.city,
        stateOrProvinceCode: sender.stateOrProvinceCode || "",
        postalCode: sender.postalCode,
        countryCode: sender.country,
        residential: false,
        contact: {
          personName: sender.name,
          phoneNumber: sender.phone,
          companyName: sender.company ?? "",
        },
      },
      dropoffAddress: {
        streetLines: [recipient.street],
        city: recipient.city,
        stateOrProvinceCode: recipient.stateOrProvinceCode || "",
        postalCode: recipient.postalCode,
        countryCode: recipient.country,
        residential: false,
        contact: {
          personName: recipient.name,
          phoneNumber: recipient.phone,
          companyName: recipient.company ?? "",
        },
      },
      package: {
        weight: {
          value: packages[0].weight,
          units: "KG",
        },
        dimensions: {
          length: packages[0].length,
          width: packages[0].width,
          height: packages[0].height,
          units: "CM",
        },
      },
      rate: selectedRate,
      customs: customs ?? undefined,
      userCountryCode: countryCode,
      preferredPaymentOption: paymentMethod,
    };

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
        if (error && typeof error === "object" && "response" in error) {
          const res = (error as { response?: { data?: { error?: string } } })
            .response;
          if (res?.data?.error) msg = res.data.error;
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
        requiresAddressUpdate={requiresAddressUpdate}
        onVerifyEmail={handleVerifyEmail}
        onUpdateAddress={handleUpdateAddress}
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
                        Dimensions
                      </p>
                      <p className="font-bold text-gray-900 leading-tight">
                        {packages[0].length}x{packages[0].width}x
                        {packages[0].height} cm
                      </p>
                      <p className="text-xs text-gray-500 font-medium">
                        {packages[0].weight} kg | {packages[0].value}{" "}
                        {packages[0].currency}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest font-black text-gray-400 mb-1">
                        Description
                      </p>
                      <p className="font-bold text-gray-900 leading-tight line-clamp-1">
                        {packages[0].description}
                      </p>
                    </div>
                  </div>
                )
              }
            >
              <PackageForm
                initialValue={packages[0] || null}
                onSubmit={handlePackageSubmit}
                onSync={updatePackage}
                onBack={() => setExpandedSection("dropoff")}
                submitLabel="Customs Details"
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
                pkg={packages[0] || null}
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
              summary={
                selectedRate && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-brand-blue/10 flex items-center justify-center text-brand-blue">
                      <FiCheckCircle className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-900 leading-tight">
                        {displaySelectedRate?.serviceName}
                      </p>
                      <p className="text-xs text-brand-blue font-bold tracking-tight">
                        {displaySelectedRate?.price ||
                          displaySelectedRate?.actualPrice}{" "}
                        {displaySelectedRate?.currency}
                      </p>
                    </div>
                  </div>
                )
              }
            >
              <ServiceSelection
                rates={transformedRates}
                selectedRateId={selectedRate?.serviceType || null}
                onSelect={handleServiceSelect}
                isLoading={isFetchingRates}
                onBack={() => setExpandedSection("customs")}
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
          pkg={packages[0] || null}
          rate={displaySelectedRate}
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
