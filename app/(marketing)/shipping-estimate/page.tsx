"use client";

import { BookOpen, Laptop, Luggage, Mail, Package } from "lucide-react";
import React, { useEffect, Suspense, useState } from "react";
import { FormikErrors, FormikProvider, useFormik, FieldArray } from "formik";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import Link from "next/link";
import { SiteContainer } from "@/components/site/ui";
import Button from "@/components/ui/button";
import {
  FaBoxOpen,
  FaShip,
  FaLocationDot,
} from "react-icons/fa6";

import MarkerHeading from "@/components/landing/marker-heading";
import QuoteResults from "@/components/shipping/quote-results";
import QuoteHowItWorks from "@/components/shipping/quote-how-it-works";
import AddressFields from "@/components/shared/address-fields";
import { shippingFormSchema, ShippingFormValues } from "./schema";
import { useGetShippingQuote } from "@/hooks/shipments/use-shipments";
import { useToast } from "@/hooks/use-toast";
import { transformShippingData, getEstimatePayload } from "./utils";
import { getOrSetGuestId } from "@/utils/auth-helper";
import { useAuthStore } from "@/store/auth-store";
import { useCountryStore } from "@/store/country-store";

import { useSearchParams, useRouter } from "next/navigation";
import HeavyShipmentModal from "@/components/ui/heavy-shipment-modal";

/** Weight threshold for heavy shipment modal (in kg) */
const HEAVY_SHIPMENT_THRESHOLD = 70;

// Package Presets
const PACKAGE_PRESETS = [
  {
    id: "envelope",
    name: "Envelope",
    icon: Mail,
    dims: { length: 35, width: 25, height: 2 },
    weight: 0.5,
  },
  {
    id: "book-box",
    name: "Book Box",
    icon: BookOpen,
    dims: { length: 30, width: 20, height: 15 },
    weight: 2,
  },
  {
    id: "laptop-box",
    name: "Laptop Box",
    icon: Laptop,
    dims: { length: 45, width: 35, height: 10 },
    weight: 3,
  },
  {
    id: "luggage",
    name: "Luggage",
    icon: Luggage,
    dims: { length: 70, width: 50, height: 30 },
    weight: 20,
  },
  {
    id: "custom",
    name: "Custom",
    icon: Package,
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
    <main className="min-h-screen bg-gray-50 font-satoshi">
      <SiteContainer className="pb-24 pt-10">
        <div className="mb-8 flex flex-col gap-4">
          <div className="h-12 w-80 max-w-full animate-pulse rounded-lg bg-gray-200" />
          <div className="h-6 w-96 max-w-full animate-pulse rounded-lg bg-gray-200" />
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          <div className="space-y-6 lg:col-span-3">
            <div className="h-64 animate-pulse rounded-3xl bg-white" />
            <div className="h-64 animate-pulse rounded-3xl bg-white" />
          </div>
          <div className="lg:col-span-2">
            <div className="h-80 animate-pulse rounded-3xl bg-white" />
          </div>
        </div>
      </SiteContainer>
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
  const { user } = useAuthStore();
  const [isHeavyShipmentModalOpen, setIsHeavyShipmentModalOpen] =
    useState(false);

  const {
    mutate: estimateMutation,
    isPending: isEstimating,
    data: rawEstimateData,
  } = useGetShippingQuote();

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
      globalWeightUnit: "KG",
      globalDimUnit: "CM",
      packages: [
        {
          id: "pkg-1",
          selectedPreset: PACKAGE_PRESETS[0].id,
          weight: PACKAGE_PRESETS[0].weight,
          dimensions: PACKAGE_PRESETS[0].dims,
        }
      ],
      isStackable: true,
    },
    validate: (values: ShippingFormValues) => {
      try {
        shippingFormSchema.parse(values);
        return {};
      } catch (error: unknown) {
        if (error instanceof z.ZodError) {
          const nestedErrors: FormikErrors<ShippingFormValues> = {};
          error.issues.forEach((issue) => {
            let current: Record<string, unknown> = nestedErrors as Record<
              string,
              unknown
            >;
            for (let i = 0; i < issue.path.length; i++) {
              const part = String(issue.path[i]);
              if (i === issue.path.length - 1) {
                current[part] = issue.message;
              } else {
                const next = current[part];
                if (!next || typeof next !== "object" || Array.isArray(next)) {
                  current[part] = {};
                }
                current = current[part] as Record<string, unknown>;
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
      const hasHeavy = values.packages.some(pkg => pkg.weight >= HEAVY_SHIPMENT_THRESHOLD);
      if (hasHeavy) {
        setIsHeavyShipmentModalOpen(true);
        return;
      }

      const formattedPackages = values.packages.map(pkg => ({
        weight: {
          value: parseFloat(pkg.weight.toFixed(2)),
          units: values.globalWeightUnit,
        },
        dimensions: {
          length: parseFloat(pkg.dimensions.length.toFixed(1)),
          width: parseFloat(pkg.dimensions.width.toFixed(1)),
          height: parseFloat(pkg.dimensions.height.toFixed(1)),
          units: values.globalDimUnit,
        },
      }));

      const payload = getEstimatePayload(
        {
          ...values.pickup,
          streetLines: [values.pickup.street],
        },
        {
          ...values.dropoff,
          streetLines: [values.dropoff.street],
        },
        formattedPackages,
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

  // Sync URL parameters
  useEffect(() => {
    const currentQuery = searchParams.toString();
    const params = new URLSearchParams(currentQuery);
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

    const nextQuery = params.toString();

    // Avoid navigation loops by only replacing when query values actually changed.
    if (nextQuery !== currentQuery) {
      router.replace(`?${nextQuery}`, { scroll: false });
    }
  }, [
    formik.values.pickup,
    formik.values.dropoff,
    formik.values,
    searchParams,
    router,
  ]);

  return (
    <main className="pattern-grid min-h-screen bg-gray-50 font-satoshi">
      <SiteContainer className="flex flex-col gap-8 pb-24 pt-10">
          <div className="flex flex-col gap-2.5">
            <nav aria-label="Breadcrumb" className="text-sm font-medium text-gray-500">
              <Link href="/" className="text-brand-blue no-underline">
                Home
              </Link>{" "}
              / Instant quote
            </nav>
            <MarkerHeading
              marker="shipping"
              after="options"
              brush={2}
              className="m-0 text-[38px] font-medium leading-[42px] text-gray-900 md:text-5xl md:leading-[52px]"
            >
              Your
            </MarkerHeading>
            <p className="m-0 max-w-[680px] text-lg font-medium leading-7 text-gray-600">
              Pick the balance of price and speed that suits you. We choose the
              courier; you pay one price to Momentum.
            </p>
          </div>

          <FormikProvider value={formik}>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
              <div className="lg:col-span-3 space-y-6">
                <form onSubmit={formik.handleSubmit} className="space-y-6">
                  <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-200">
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

                  <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-200">
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
                  <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-200">
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue">
                          <FaBoxOpen className="w-5 h-5" />
                        </div>
                        <h2 className="font-bold text-xl text-gray-900">
                          Package Details
                        </h2>
                      </div>
                      <div className="flex gap-2 p-1 bg-gray-50 border border-gray-200 rounded-xl">
                        <button
                          type="button"
                          onClick={() => {
                            formik.setFieldValue("globalWeightUnit", "KG");
                            formik.setFieldValue("globalDimUnit", "CM");
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            formik.values.globalWeightUnit === "KG"
                              ? "bg-brand-blue text-white shadow-sm"
                              : "text-gray-500 hover:text-gray-900"
                          }`}
                        >
                          Metric (KG/CM)
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            formik.setFieldValue("globalWeightUnit", "LB");
                            formik.setFieldValue("globalDimUnit", "IN");
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            formik.values.globalWeightUnit === "LB"
                              ? "bg-brand-blue text-white shadow-sm"
                              : "text-gray-500 hover:text-gray-900"
                          }`}
                        >
                          Imperial (LB/IN)
                        </button>
                      </div>
                    </div>

                    <FieldArray
                      name="packages"
                      render={(arrayHelpers) => (
                        <div className="space-y-6">
                          {formik.values.packages.map((pkg, index) => (
                            <div key={pkg.id || index} className="p-5 border border-gray-200 rounded-2xl relative bg-gray-50/50 space-y-4">
                              <div className="flex justify-between items-center">
                                <span className="text-[10px] uppercase tracking-widest font-black text-gray-400">
                                  Package #{index + 1}
                                </span>
                                {formik.values.packages.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => arrayHelpers.remove(index)}
                                    className="w-8 h-8 flex items-center justify-center bg-red-100 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                  >
                                    <FiTrash2 className="w-4 h-4" />
                                  </button>
                                )}
                              </div>

                              <div>
                                <label className="block text-xs font-bold text-gray-700 mb-2">
                                  Package Type
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                                  {PACKAGE_PRESETS.map((preset) => (
                                    <button
                                      key={preset.id}
                                      type="button"
                                      onClick={() => {
                                        formik.setFieldValue(`packages.${index}.selectedPreset`, preset.id);
                                        if (preset.id !== "custom") {
                                          formik.setFieldValue(`packages.${index}.weight`, preset.weight);
                                          formik.setFieldValue(`packages.${index}.dimensions`, preset.dims);
                                        }
                                      }}
                                      className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                                        pkg.selectedPreset === preset.id
                                          ? "border-brand-blue bg-brand-blue/5 text-brand-blue ring-1 ring-brand-blue"
                                          : "border-gray-200 hover:border-brand-blue/50 text-gray-600 bg-white"
                                      }`}
                                    >
                                      <preset.icon className="mb-1 h-6 w-6" aria-hidden="true" />
                                      <span className="text-xs font-medium">
                                        {preset.name}
                                      </span>
                                    </button>
                                  ))}
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                  <label className="block text-xs font-bold text-gray-700">
                                    Dimensions ({formik.values.globalDimUnit})
                                  </label>
                                  <div className="grid grid-cols-3 gap-3">
                                    <input
                                      type="number"
                                      name={`packages.${index}.dimensions.length`}
                                      value={pkg.dimensions.length}
                                      onChange={formik.handleChange}
                                      placeholder="L"
                                      className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:border-brand-blue outline-none text-center bg-white"
                                      disabled={pkg.selectedPreset !== "custom"}
                                    />
                                    <input
                                      type="number"
                                      name={`packages.${index}.dimensions.width`}
                                      value={pkg.dimensions.width}
                                      onChange={formik.handleChange}
                                      placeholder="W"
                                      className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:border-brand-blue outline-none text-center bg-white"
                                      disabled={pkg.selectedPreset !== "custom"}
                                    />
                                    <input
                                      type="number"
                                      name={`packages.${index}.dimensions.height`}
                                      value={pkg.dimensions.height}
                                      onChange={formik.handleChange}
                                      placeholder="H"
                                      className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:border-brand-blue outline-none text-center bg-white"
                                      disabled={pkg.selectedPreset !== "custom"}
                                    />
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <label className="block text-xs font-bold text-gray-700">
                                    Weight ({formik.values.globalWeightUnit})
                                  </label>
                                  <input
                                    type="number"
                                    name={`packages.${index}.weight`}
                                    value={pkg.weight}
                                    onChange={formik.handleChange}
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-brand-blue outline-none bg-white"
                                    disabled={pkg.selectedPreset !== "custom"}
                                  />
                                </div>
                              </div>
                            </div>
                          ))}

                          <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                              arrayHelpers.push({
                                id: uuidv4(),
                                selectedPreset: "envelope",
                                weight: PACKAGE_PRESETS[0].weight,
                                dimensions: PACKAGE_PRESETS[0].dims,
                              })
                            }
                            className="w-full h-12 border-dashed border-2 border-brand-blue/30 text-brand-blue font-bold hover:bg-brand-blue/5 rounded-xl flex items-center justify-center gap-2 bg-white"
                          >
                            <FiPlus /> Add Another Package
                          </Button>
                        </div>
                      )}
                    />
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
                <div className="lg:sticky lg:top-8">
                  <QuoteResults
                    rates={estimateData?.rates}
                    errors={estimateData?.errors}
                    hasResult={!!estimateData}
                    isLoading={isEstimating}
                    onReviewAddresses={() =>
                      document
                        .getElementById("pickup-details")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                  />
                </div>
              </div>
            </div>
          </FormikProvider>

          <QuoteHowItWorks />
      </SiteContainer>

      {/* Heavy Shipment Modal */}
      <HeavyShipmentModal
        isOpen={isHeavyShipmentModalOpen}
        onClose={() => setIsHeavyShipmentModalOpen(false)}
      />
    </main>
  );
}
