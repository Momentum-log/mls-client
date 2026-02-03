"use client";

import React, { useEffect, useMemo, useState } from "react";
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
import SummaryDrawer from "@/components/shipment/summary-drawer";
import { FiMapPin, FiPackage, FiTruck, FiCheckCircle } from "react-icons/fi";
import { useToast } from "@/hooks/use-toast";
import Button from "@/components/ui/button";
import {
  useGetShippingEstimate,
  useCreateShipment,
} from "@/hooks/shipments/use-shipments";
import { getOrSetGuestId } from "@/utils/auth-helper";
import { Rate, ShippingEstimatePayload } from "@/types/shipping";
import { getEstimatePayload } from "@/app/(marketing)/shipping-estimate/utils";
import { useCountryStore } from "@/store/country-store";

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
    selectedRate,
    setSelectedRate,
  } = useShipmentStore();

  const { countryCode } = useCountryStore();

  const [rates, setRates] = useState<Rate[]>([]);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const { addToast } = useToast();

  // Rate calculation mutation
  const { mutate: getRates, isPending: isCalculatingRates } =
    useGetShippingEstimate();

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
    if (
      expandedSection === "service" &&
      rates.length === 0 &&
      !isCalculatingRates &&
      sender &&
      recipient &&
      packages.length > 0
    ) {
      const payload = getEstimatePayload(
        {
          city: sender.city,
          postalCode: sender.postalCode,
          countryCode: sender.country,
          residential: false,
          streetLines: [sender.street],
          stateOrProvinceCode: sender.stateOrProvinceCode || "",
        },
        {
          city: recipient.city,
          postalCode: recipient.postalCode,
          countryCode: recipient.country,
          residential: false,
          streetLines: [recipient.street],
          stateOrProvinceCode: recipient.stateOrProvinceCode || "",
        },
        {
          weight: { units: "KG", value: packages[0].weight },
          dimensions: {
            units: "CM",
            width: packages[0].width,
            height: packages[0].height,
            length: packages[0].length,
          },
        },
        getOrSetGuestId(),
        countryCode,
      );

      getRates(payload, {
        onSuccess: (data) => {
          setRates(data.rates);
        },
      });
    }
  }, [
    expandedSection,
    rates.length,
    isCalculatingRates,
    sender,
    recipient,
    packages,
    getRates,
  ]);

  const steps: TimelineStep[] = useMemo(
    () => [
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
        id: "service",
        label: "Service Selection",
        status:
          expandedSection === "service"
            ? "current"
            : completedSteps.includes("service")
              ? "completed"
              : "pending",
      },
    ],
    [expandedSection, completedSteps],
  );

  const isSectionVisible = (id: string) => {
    if (id === "pickup") return true;
    if (id === "dropoff") return completedSteps.includes("pickup");
    if (id === "package") return completedSteps.includes("dropoff");
    if (id === "service") return completedSteps.includes("package");
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
    addPackage(pkg);
    markSectionCompleted("package");
    setExpandedSection("service");

    // Trigger Rate Calculation
    if (sender && recipient) {
      const payload = getEstimatePayload(
        {
          city: sender.city,
          postalCode: sender.postalCode,
          countryCode: sender.country,
          residential: false,
          streetLines: [sender.street],
          stateOrProvinceCode: sender.stateOrProvinceCode || "",
        },
        {
          city: recipient.city,
          postalCode: recipient.postalCode,
          countryCode: recipient.country,
          residential: false,
          streetLines: [recipient.street],
          stateOrProvinceCode: recipient.stateOrProvinceCode || "",
        },
        {
          weight: { units: "KG", value: pkg.weight },
          dimensions: {
            units: "CM",
            width: pkg.width,
            height: pkg.height,
            length: pkg.length,
          },
        },
        getOrSetGuestId(),
        countryCode,
      );

      getRates(payload, {
        onSuccess: (data) => {
          setRates(data.rates);
        },
        onError: (error) => {
          addToast({
            title: "Calculation Failed",
            message:
              "Unable to calculate shipping rates. Please check address details.",
            type: "error",
          });
        },
      });
    }

    addToast({
      title: "Success",
      message: "Package details confirmed.",
      type: "success",
    });
    document
      .getElementById("service")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const handleServiceSelect = (rate: Rate) => {
    setSelectedRate(rate);
    markSectionCompleted("service");
    setIsSummaryOpen(true);
    addToast({
      title: "Service Selected",
      message: `${rate.serviceName} chosen. Review your shipment to continue.`,
      type: "success",
    });
  };

  const handleFinalize = () => {
    if (!sender || !recipient || !packages[0] || !selectedRate) {
      addToast({
        title: "Missing Information",
        message: "Please ensure all steps are completed before finalizing.",
        type: "error",
      });
      return;
    }

    const payload = {
      carrierName: "FedEx", // Default for now
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
          companyName: sender.company,
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
          companyName: recipient.company,
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
      rate: {
        serviceType: selectedRate.serviceType,
        serviceName: selectedRate.serviceName,
        carrierPrice: selectedRate.carrierPrice,
        actualPrice: selectedRate.actualPrice,
        currency: selectedRate.currency,
      },
      customs: {
        contentsDescription: packages[0].description,
        declaredValue: packages[0].value,
        currency: packages[0].currency,
      },
      userCountryCode: countryCode,
    };

    performCreateShipment(payload, {
      onSuccess: (data) => {
        addToast({
          title: "Shipment Initialized",
          message: "Redirecting to secure payment page...",
          type: "success",
        });

        // Small delay to let the user see the toast
        setTimeout(() => {
          if (data.checkoutUrl) {
            window.location.href = data.checkoutUrl;
          } else {
            addToast({
              title: "Error",
              message: "Checkout URL not found. Please try again.",
              type: "error",
            });
          }
        }, 1000);
      },
      onError: (error: any) => {
        addToast({
          title: "Creation Failed",
          message:
            error.response?.data?.error ||
            "Unable to create shipment. Please try again.",
          type: "error",
        });
      },
    });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
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
            initialValues={sender}
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
              initialValues={recipient}
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
            />
          </StackedSection>
        )}

        {/* 4. Service Selection */}
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
                      {selectedRate.serviceName}
                    </p>
                    <p className="text-xs text-brand-blue font-bold tracking-tight">
                      {selectedRate.price || selectedRate.actualPrice}{" "}
                      {selectedRate.currency}
                    </p>
                  </div>
                </div>
              )
            }
          >
            <ServiceSelection
              rates={rates}
              selectedRateId={selectedRate?.serviceType || null}
              onSelect={handleServiceSelect}
              isLoading={isCalculatingRates}
              onBack={() => setExpandedSection("package")}
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
        rate={selectedRate}
        onFinalize={handleFinalize}
        isLoading={isCreatingShipment}
      />
    </div>
  );
}
