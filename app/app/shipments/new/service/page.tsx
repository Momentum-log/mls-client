"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useShipmentStore } from "@/store/shipment-store";
import Button from "@/components/ui/button";
import {
  FiArrowRight,
  FiArrowLeft,
  FiTruck,
  FiAlertCircle,
} from "react-icons/fi";
import { useToast } from "@/hooks/use-toast";
import { useGetShippingEstimate } from "@/hooks/shipments/use-shipments";
import { ShippingEstimatePayload, Rate } from "@/types/shipping";
import { v4 as uuidv4 } from "uuid";
import { getOrSetGuestId } from "@/utils/auth-helper";
import { getEstimatePayload } from "@/app/(marketing)/shipping-estimate/utils";
import { useCountryStore } from "@/store/country-store";

export default function ServicePage() {
  const router = useRouter();
  const {
    sender,
    recipient,
    packages,
    setSelectedRate,
    selectedRate,
    setStep,
  } = useShipmentStore();
  const { countryCode } = useCountryStore();
  const { addToast: toast } = useToast();

  // Use React Query Mutation hook
  const {
    mutate: getEstimate,
    isPending: loading,
    error: apiError,
  } = useGetShippingEstimate();

  const [rates, setRates] = useState<Rate[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setStep(3); // 3 index for fourth step

    // Redirect if missing data
    if (!sender) router.push("/app/shipments/new/origin");
    else if (!recipient) router.push("/app/shipments/new/destination");
    else if (packages.length === 0) router.push("/app/shipments/new/package");
    else {
      // Fetch rates on mount if we have data
      fetchRates();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setStep, sender, recipient, packages, router]);

  const fetchRates = () => {
    setError(null);
    setRates([]);

    if (!sender || !recipient || packages.length === 0) return;

    // Construct valid payload matching ShippingEstimatePayload interface
    const payload = getEstimatePayload(
      {
        countryCode: sender.country,
        stateOrProvinceCode: sender.stateOrProvinceCode || "",
        city: sender.city,
        postalCode: sender.postalCode,
        streetLines: [sender.street],
      },
      {
        countryCode: recipient.country,
        stateOrProvinceCode: recipient.stateOrProvinceCode || "",
        city: recipient.city,
        postalCode: recipient.postalCode,
        streetLines: [recipient.street],
      },
      {
        weight: {
          value: Number(packages[0].weight),
          units: "KG",
        },
        dimensions: {
          length: Number(packages[0].length),
          width: Number(packages[0].width),
          height: Number(packages[0].height),
          units: "CM",
        },
      },
      getOrSetGuestId(),
      countryCode || undefined,
    );

    console.log("Fetching rates payload:", JSON.stringify(payload, null, 2));

    getEstimate(payload, {
      onSuccess: (data) => {
        setRates(data.rates || []);
        if (data.rates.length === 0) {
          setError("No rates available for this route.");
        }
      },
      onError: (err: Error) => {
        console.error(err);
        setError(err.message || "Failed to fetch rates. Please try again.");
        toast({
          title: "Error",
          message: "Failed to fetch shipping rates.",
          type: "error",
        });
      },
    });
  };

  const handleSelect = (rate: Rate) => {
    setSelectedRate(rate);
  };

  const handleNext = () => {
    if (!selectedRate) return;
    router.push("/app/shipments/new/summary");
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-brand-blue/10 rounded-full">
          <FiTruck className="w-6 h-6 text-brand-blue" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Select Service</h2>
          <p className="text-sm text-gray-500">
            Choose the best shipping option.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-24 bg-gray-100 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : error ? (
          <div className="p-6 bg-red-50 text-red-600 rounded-xl flex flex-col items-center text-center">
            <FiAlertCircle className="w-8 h-8 mb-2" />
            <p>{error}</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={fetchRates}
            >
              Retry
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {rates.map((rate, index) => {
              // Assuming serviceType is unique enough for key/selection logic
              // Default store expects 'selectedRate' to be compatible with what we verify in summary
              const isSelected = selectedRate?.serviceType === rate.serviceType;

              return (
                <div
                  key={index}
                  onClick={() => handleSelect(rate)}
                  className={`relative p-5 border-2 rounded-xl cursor-pointer transition-all duration-200 flex justify-between items-center group
                                ${
                                  isSelected
                                    ? "border-brand-blue bg-blue-50/50 shadow-md ring-1 ring-brand-blue"
                                    : "border-gray-200 hover:border-brand-blue/60 hover:shadow-sm bg-white"
                                }
                            `}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-2 rounded-lg ${
                        isSelected
                          ? "bg-brand-blue text-white"
                          : "bg-gray-100 text-gray-500 group-hover:bg-brand-blue/10 group-hover:text-brand-blue"
                      }`}
                    >
                      <FiTruck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">
                        {/* Some rates might not have 'carrier' property if interface Rate defines it differently? 
                            Checking Rate interface: has serviceType, serviceName, price, currency.
                            Doesn't explicitly have 'carrier' property in the interface shown in context unless 'serviceType' includes it?
                            Wait, Rate interface from context: 
                            export interface Rate { ... serviceType: string; serviceName: string; ... price?: number; currency?: string; }
                            It MISSES 'carrier' property in the provided context for Rate interface, 
                            but ShippingRate interface has it. 
                            Let's assume backend returns it or we infer it. 
                            For now, using serviceName.
                        */}
                        <span className="text-brand-blue">
                          {rate.serviceName}
                        </span>
                      </h4>
                      <p className="text-sm text-gray-500">
                        {rate.deliveryDescription || "Standard Delivery"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-900">
                      {rate.actualPrice}{" "}
                      <span className="text-sm font-normal text-gray-500">
                        {rate.currency}
                      </span>
                    </p>
                  </div>

                  {/* Radio Circle */}
                  <div
                    className={`absolute top-5 right-5 w-4 h-4 rounded-full border-2 transition-colors hidden sm:block
                                ${
                                  isSelected
                                    ? "border-brand-blue bg-brand-blue"
                                    : "border-gray-300"
                                }
                            `}
                  ></div>
                </div>
              );
            })}
          </div>
        )}

        <div className="flex justify-between pt-6 mt-8 border-t border-gray-100">
          <Button
            type="button"
            variant="ghost"
            size="lg"
            onClick={handleBack}
            className="text-gray-500 hover:text-gray-900"
          >
            <FiArrowLeft className="mr-2" /> Back
          </Button>
          <Button
            type="button"
            variant="primary"
            size="lg"
            className="min-w-[150px] ml-auto"
            onClick={handleNext}
            disabled={!selectedRate || loading}
          >
            Next Step <FiArrowRight className="ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
