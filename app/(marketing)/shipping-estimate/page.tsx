"use client";

import React, { useEffect, Suspense, useState } from "react";
import { FormikProvider, useFormik } from "formik";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import Container from "@/components/shared/container";
import Button from "@/components/ui/button";
import {
  FaBoxOpen,
  FaCalculator,
  FaCircleExclamation,
  FaShip,
  FaLocationDot,
} from "react-icons/fa6";

import ShippingHero from "@/components/shipping/shipping-hero";
import AddressFields from "@/components/shared/address-fields";
import { shippingFormSchema, ShippingFormValues } from "./schema";
import { useGetShippingEstimate } from "@/hooks/shipments/use-shipments";
import { useToast } from "@/hooks/use-toast";
import { transformShippingData, getEstimatePayload } from "./utils";
import { getOrSetGuestId } from "@/utils/auth-helper";
import { useAuthStore } from "@/store/auth-store";
import { useCountryStore } from "@/store/country-store";

import { formatCurrency } from "@/utils/currency-formatter";
import { useSearchParams, useRouter } from "next/navigation";
import { Rate } from "@/types/shipping";
import { SupportedCurrency } from "@/types/country";
import HeavyShipmentModal from "@/components/ui/heavy-shipment-modal";

/** Weight threshold for heavy shipment modal (in kg) */
const HEAVY_SHIPMENT_THRESHOLD = 70;

// Package Presets
const PACKAGE_PRESETS = [
  {
    id: "envelope",
    name: "Envelope",
    icon: "✉️",
    dims: { length: 35, width: 25, height: 2 },
    weight: 0.5,
  },
  {
    id: "book-box",
    name: "Book Box",
    icon: "📚",
    dims: { length: 30, width: 20, height: 15 },
    weight: 2,
  },
  {
    id: "laptop-box",
    name: "Laptop Box",
    icon: "💻",
    dims: { length: 45, width: 35, height: 10 },
    weight: 3,
  },
  {
    id: "luggage",
    name: "Luggage",
    icon: "🧳",
    dims: { length: 70, width: 50, height: 30 },
    weight: 20,
  },
  {
    id: "custom",
    name: "Custom",
    icon: "📦",
    dims: { length: 0, width: 0, height: 0 },
    weight: 0,
  },
];

/**
 * Wrapper component that provides Suspense boundary for useSearchParams.
 */
export default function ShippingEstimatePage() {
  return (
    <Suspense fallback={<ShippingEstimateLoader />}>
      <ShippingEstimateContent />
    </Suspense>
  );
}

/**
 * Loading skeleton for the shipping estimate page.
 */
function ShippingEstimateLoader() {
  return (
    <main className="bg-white min-h-screen">
      <ShippingHero />
      <div className="bg-gray-50 py-20">
        <Container>
          <div className="text-center mb-12">
            <div className="h-12 w-80 bg-gray-200 rounded-lg mx-auto mb-6 animate-pulse" />
            <div className="h-6 w-96 bg-gray-200 rounded-lg mx-auto animate-pulse" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3 space-y-6">
              <div className="bg-white rounded-3xl p-8 h-64 animate-pulse" />
              <div className="bg-white rounded-3xl p-8 h-64 animate-pulse" />
              <div className="bg-white rounded-3xl p-8 h-48 animate-pulse" />
            </div>
            <div className="lg:col-span-2">
              <div className="bg-brand-blue rounded-3xl p-8 h-80 animate-pulse" />
            </div>
          </div>
        </Container>
      </div>
    </main>
  );
}

/**
 * Main content component that uses useSearchParams.
 */
function ShippingEstimateContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToast } = useToast();
  const { countryCode: userCountryCode } = useCountryStore();
  const { user, isAuthenticated } = useAuthStore();
  const [isHeavyShipmentModalOpen, setIsHeavyShipmentModalOpen] =
    useState(false);

  const {
    mutate: estimateMutation,
    isPending: isEstimating,
    data: rawEstimateData,
  } = useGetShippingEstimate();

  const estimateData = rawEstimateData
    ? transformShippingData(rawEstimateData)
    : undefined;

  const formik = useFormik<ShippingFormValues>({
    initialValues: {
      pickup: {
        countryCode: searchParams.get("pickupCountry") || "",
        stateOrProvinceCode: searchParams.get("pickupState") || "",
        city: searchParams.get("pickupCity") || "",
        postalCode: searchParams.get("pickupZip") || "",
        street: searchParams.get("pickupStreet") || "",
        email: searchParams.get("pickupEmail") || user?.email || "",
        phoneNumber: searchParams.get("pickupPhone") || user?.phone || "",
      },

      dropoff: {
        countryCode: searchParams.get("dropoffCountry") || "",
        stateOrProvinceCode: searchParams.get("dropoffState") || "",
        city: searchParams.get("dropoffCity") || "",
        postalCode: searchParams.get("dropoffZip") || "",
        street: searchParams.get("dropoffStreet") || "",
      },
      selectedPreset: PACKAGE_PRESETS[0].id,
      package: {
        weight: PACKAGE_PRESETS[0].weight,
        dimensions: PACKAGE_PRESETS[0].dims,
      },
      isStackable: true,
    },
    validate: (values: ShippingFormValues) => {
      try {
        shippingFormSchema.parse(values);
        return {};
      } catch (error: any) {
        if (error instanceof z.ZodError) {
          const nestedErrors: any = {};
          error.issues.forEach((issue) => {
            let current = nestedErrors;
            for (let i = 0; i < issue.path.length; i++) {
              const part = issue.path[i];
              if (i === issue.path.length - 1) {
                current[part] = issue.message;
              } else {
                current[part] = current[part] || {};
                current = current[part];
              }
            }
          });
          return nestedErrors;
        }
        return {};
      }
    },
    onSubmit: async (values) => {
      // Check for heavy shipment (70kg+)
      if (values.package.weight >= HEAVY_SHIPMENT_THRESHOLD) {
        setIsHeavyShipmentModalOpen(true);
        return;
      }

      const payload = getEstimatePayload(
        {
          ...values.pickup,
          streetLines: [values.pickup.street],
        },
        {
          ...values.dropoff,
          streetLines: [values.dropoff.street],
        },
        {
          weight: {
            value: parseFloat(values.package.weight.toFixed(2)),
            units: "KG",
          },
          dimensions: {
            length: parseFloat(values.package.dimensions.length.toFixed(1)),
            width: parseFloat(values.package.dimensions.width.toFixed(1)),
            height: parseFloat(values.package.dimensions.height.toFixed(1)),
            units: "CM",
          },
        },
        getOrSetGuestId(),
        userCountryCode || undefined,
      );

      estimateMutation(payload, {
        onSuccess: () => {
          addToast({
            type: "success",
            title: "Quote Received!",
            message: "Your shipping estimate has been calculated.",
          });
        },
        onError: (error) => {
          addToast({
            type: "error",
            title: "Estimation Failed",
            message: error.message || "Failed to get estimate.",
          });
        },
      });
    },
  });

  // Handle Preset Change
  const handlePresetChange = (presetId: string) => {
    const preset = PACKAGE_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      formik.setFieldValue("selectedPreset", presetId);
      if (presetId !== "custom") {
        formik.setFieldValue("package.weight", preset.weight);
        formik.setFieldValue("package.dimensions", preset.dims);
      }
    }
  };

  // Sync URL parameters
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const { pickup, dropoff } = formik.values;

    if (pickup.countryCode) params.set("pickupCountry", pickup.countryCode);
    if (pickup.stateOrProvinceCode)
      params.set("pickupState", pickup.stateOrProvinceCode);
    if (pickup.city) params.set("pickupCity", pickup.city);
    if (pickup.postalCode) params.set("pickupZip", pickup.postalCode);
    if (pickup.street) params.set("pickupStreet", pickup.street);
    if (pickup.email) params.set("pickupEmail", pickup.email);
    if (pickup.phoneNumber) params.set("pickupPhone", pickup.phoneNumber);

    if (dropoff.countryCode) params.set("dropoffCountry", dropoff.countryCode);

    if (dropoff.stateOrProvinceCode)
      params.set("dropoffState", dropoff.stateOrProvinceCode);
    if (dropoff.city) params.set("dropoffCity", dropoff.city);
    if (dropoff.postalCode) params.set("dropoffZip", dropoff.postalCode);
    if (dropoff.street) params.set("dropoffStreet", dropoff.street);

    router.replace(`?${params.toString()}`, { scroll: false });
  }, [formik.values.pickup, formik.values.dropoff]);

  return (
    <main className="bg-white min-h-screen">
      <ShippingHero />

      <div className="bg-gray-50 py-20">
        <Container>
          <div className="text-center mb-12">
            <h1 className="font-work-sans font-black text-4xl md:text-5xl text-gray-900 mb-6">
              Estimate Your <span className="text-brand-blue">Shipping</span>
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Get an instant estimate for your international or local shipment.
            </p>
          </div>

          <FormikProvider value={formik}>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              <div className="lg:col-span-3 space-y-6">
                <form onSubmit={formik.handleSubmit} className="space-y-6">
                  <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-6">
                      <div
                        id="pickup-details"
                        className="w-10 h-10 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue"
                      >
                        <FaShip className="w-5 h-5" />
                      </div>

                      <h2 className="font-bold text-xl text-gray-900">
                        Pick-up Details
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <AddressFields prefix="pickup" />
                    </div>
                  </div>

                  <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue">
                        <FaLocationDot className="w-5 h-5" />
                      </div>
                      <h2 className="font-bold text-xl text-gray-900">
                        Drop-off Details
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <AddressFields prefix="dropoff" />
                    </div>
                  </div>

                  {/* Package Details */}
                  <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue">
                        <FaBoxOpen className="w-5 h-5" />
                      </div>
                      <h2 className="font-bold text-xl text-gray-900">
                        Package Details
                      </h2>
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Package Type
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                        {PACKAGE_PRESETS.map((preset) => (
                          <button
                            key={preset.id}
                            type="button"
                            onClick={() => handlePresetChange(preset.id)}
                            className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                              formik.values.selectedPreset === preset.id
                                ? "border-brand-blue bg-brand-blue/5 text-brand-blue ring-1 ring-brand-blue"
                                : "border-gray-200 hover:border-brand-blue/50 text-gray-600"
                            }`}
                          >
                            <span className="text-2xl mb-1">{preset.icon}</span>
                            <span className="text-xs font-medium">
                              {preset.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <label className="block text-sm font-semibold text-gray-700">
                          Dimensions (cm)
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                          <input
                            type="number"
                            name="package.dimensions.length"
                            value={formik.values.package.dimensions.length}
                            onChange={formik.handleChange}
                            placeholder="L"
                            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:border-brand-blue outline-none text-center"
                            disabled={formik.values.selectedPreset !== "custom"}
                          />
                          <input
                            type="number"
                            name="package.dimensions.width"
                            value={formik.values.package.dimensions.width}
                            onChange={formik.handleChange}
                            placeholder="W"
                            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:border-brand-blue outline-none text-center"
                            disabled={formik.values.selectedPreset !== "custom"}
                          />
                          <input
                            type="number"
                            name="package.dimensions.height"
                            value={formik.values.package.dimensions.height}
                            onChange={formik.handleChange}
                            placeholder="H"
                            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:border-brand-blue outline-none text-center"
                            disabled={formik.values.selectedPreset !== "custom"}
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <label className="block text-sm font-semibold text-gray-700">
                          Weight (kg)
                        </label>
                        <input
                          type="number"
                          name="package.weight"
                          value={formik.values.package.weight}
                          onChange={formik.handleChange}
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-brand-blue outline-none"
                          disabled={formik.values.selectedPreset !== "custom"}
                        />
                      </div>
                    </div>
                  </div>

                  <Button
                    className="w-full py-4 text-lg font-bold shadow-lg shadow-brand-blue/20"
                    disabled={formik.isSubmitting || isEstimating}
                    type="submit"
                  >
                    {isEstimating ? "Calculating..." : "Get My Quote"}
                  </Button>
                </form>
              </div>

              <div className="lg:col-span-2">
                <div className="bg-brand-blue text-white rounded-3xl p-6 md:p-8 sticky top-32">
                  <h3 className="font-bold text-xl mb-6">Quote Summary</h3>

                  {!estimateData && !isEstimating ? (
                    <div className="text-center py-8 text-white/60">
                      <FaCircleExclamation className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>
                        Fill out the form to see your estimated shipping cost.
                      </p>
                    </div>
                  ) : isEstimating ? (
                    <div className="space-y-4 animate-pulse">
                      <div className="h-24 bg-white/10 rounded-2xl"></div>
                      <div className="h-24 bg-white/10 rounded-2xl"></div>
                    </div>
                  ) : estimateData?.rates && estimateData.rates.length > 0 ? (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      {estimateData?.rates?.map((rate: Rate, index: number) => (
                        <div
                          key={`${rate.serviceType}-${index}`}
                          className="bg-white/10 rounded-2xl p-5 border border-white/10"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h4 className="font-bold text-lg text-white">
                                {rate.serviceName}
                              </h4>
                              <p className="text-sm text-brand-yellow">
                                {rate.deliveryDescription}
                              </p>
                            </div>
                            <span className="text-2xl font-black text-brand-yellow">
                              {formatCurrency(
                                rate.actualPrice,
                                (rate.currency as SupportedCurrency) || "EUR",
                              )}
                            </span>
                          </div>
                          <Button
                            variant="outline"
                            className="w-full bg-white text-brand-blue border-none font-bold"
                            onClick={() => router.push("/register")}
                          >
                            Book Now
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 animate-in fade-in duration-500">
                      <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FaCircleExclamation className="w-8 h-8 text-brand-yellow" />
                      </div>
                      <h4 className="font-bold text-xl mb-3">No Rates Found</h4>
                      <p className="text-white/70 text-sm leading-relaxed mb-6">
                        We couldn't retrieve shipping rates for this address.
                        This usually happens if the address is incomplete or
                        unrecognized by our carriers.
                      </p>
                      {estimateData?.errors &&
                        estimateData.errors.length > 0 && (
                          <div className="bg-black/20 rounded-xl p-4 mb-6 text-left">
                            <p className="text-[10px] uppercase font-bold text-white/40 mb-2">
                              Carrier Feedback
                            </p>
                            {estimateData.errors.map((err: any, i: number) => (
                              <p key={i} className="text-xs text-white/80">
                                • {err.details}
                              </p>
                            ))}
                          </div>
                        )}
                      <Button
                        variant="outline"
                        className="border-white/20 text-white hover:bg-white/10 w-full"
                        onClick={() => {
                          const element =
                            document.getElementById("pickup-details");
                          if (element) {
                            element.scrollIntoView({ behavior: "smooth" });
                          }
                        }}
                      >
                        Review Addresses
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </FormikProvider>
        </Container>
      </div>

      {/* Heavy Shipment Modal */}
      <HeavyShipmentModal
        isOpen={isHeavyShipmentModalOpen}
        onClose={() => setIsHeavyShipmentModalOpen(false)}
      />
    </main>
  );
}
