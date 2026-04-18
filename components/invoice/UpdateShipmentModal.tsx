/**
 * Update Shipment Modal Component
 *
 * Inline rate-picker modal for updating a pending/expired shipment.
 * Fetches fresh rates using the original shipment data, lets the user
 * select a new rate and payment method, then submits the update payload
 * with shipmentId and invoiceId to trigger the UPDATE flow.
 *
 * @module components/invoice/UpdateShipmentModal
 */

"use client";

import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiTruck, FiCreditCard, FiCheck, FiLoader } from "react-icons/fi";
import { CreateShipmentResponse, Invoice } from "@/types/invoice";
import { CustomsData, Rate } from "@/types/shipping";
import { useCountryStore } from "@/store/country-store";
import {
  useGetShippingEstimate,
  useCreateShipment,
} from "@/hooks/shipments/use-shipments";
import { getEstimatePayload } from "@/app/(marketing)/shipping-estimate/utils";
import { getOrSetGuestId } from "@/utils/auth-helper";
import { useToast } from "@/hooks/use-toast";
import { deepTransformData } from "@/utils/data-transform";
import { formatCurrencyCompact } from "@/utils/currency-formatter";
import { SupportedCurrency } from "@/types/country";
import Button from "@/components/ui/button";

interface ShipmentModalAddress {
  city?: string;
  countryCode?: string;
  country?: string;
  stateOrProvinceCode?: string;
  postalCode?: string;
  streetLines?: string[];
  street?: string;
  name?: string;
  phone?: string;
  company?: string;
  contact?: {
    personName?: string;
    phoneNumber?: string;
    companyName?: string;
  };
}

interface ShipmentModalPackage {
  weight?: { value?: number; units?: string } | number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
    units?: string;
  };
}

interface ShipmentUpdateSource {
  pickupAddress?: ShipmentModalAddress;
  dropoffAddress?: ShipmentModalAddress;
  sender?: ShipmentModalAddress;
  recipient?: ShipmentModalAddress;
  package?: ShipmentModalPackage;
  weight?: { value?: number; units?: string };
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
    units?: string;
  };
  customs?: CustomsData;
  invoice?: Invoice;
}

/**
 * Props for UpdateShipmentModal component
 */
interface UpdateShipmentModalProps {
  /** Whether the modal is visible */
  isOpen: boolean;
  /** Callback to close the modal */
  onClose: () => void;
  /** The original shipment data used to re-calculate rates */
  shipment: ShipmentUpdateSource;
  /** Existing shipment ID for the UPDATE flow */
  shipmentId: string;
  /** Existing invoice ID for the UPDATE flow */
  invoiceId: string;
  /** Callback when the update succeeds, receives updated response data */
  onUpdateSuccess?: (data: CreateShipmentResponse) => void;
}

/**
 * UpdateShipmentModal Component
 *
 * Shows fresh shipping rates for the original shipment's addresses
 * and package. User picks a new rate + payment method, then confirms
 * to trigger the server-side update (same shipment/invoice IDs reused).
 *
 * @example
 * ```tsx
 * <UpdateShipmentModal
 *   isOpen={showUpdate}
 *   onClose={() => setShowUpdate(false)}
 *   shipment={rawShipmentData}
 *   shipmentId="ed589dfe-..."
 *   invoiceId="03e92b53-..."
 *   onUpdateSuccess={(data) => refetchInvoice()}
 * />
 * ```
 */
export const UpdateShipmentModal: React.FC<UpdateShipmentModalProps> = ({
  isOpen,
  onClose,
  shipment,
  shipmentId,
  invoiceId,
  onUpdateSuccess,
}) => {
  const { countryCode } = useCountryStore();
  const { addToast } = useToast();

  const [rates, setRates] = useState<Rate[]>([]);
  const [selectedRate, setSelectedRate] = useState<Rate | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "payu">(
    countryCode === "PL" ? "payu" : "stripe",
  );

  const isPolishUser = countryCode === "PL";

  // Rate estimation
  const { mutate: getRates, isPending: isCalculatingRates } =
    useGetShippingEstimate();

  // Create/update shipment
  const { mutate: performUpdate, isPending: isUpdating } = useCreateShipment();

  // Transformed rates for display
  const displayRates = useMemo(() => deepTransformData(rates), [rates]);

  /**
   * Extracts address and package data from the original shipment
   * and fetches fresh rates
   */
  useEffect(() => {
    if (!isOpen || !shipment) return;

    // Reset state
    setRates([]);
    setSelectedRate(null);

    // Extract shipment data for rate calculation
    const pickupAddress = shipment.pickupAddress || shipment.sender;
    const dropoffAddress = shipment.dropoffAddress || shipment.recipient;
    const pkg = shipment.package || {
      weight: shipment.weight,
      dimensions: shipment.dimensions,
    };

    if (!pickupAddress || !dropoffAddress || !pkg) {
      addToast({
        title: "Missing Data",
        message: "Could not extract shipment details for rate calculation.",
        type: "error",
      });
      return;
    }

    const weightValue =
      typeof pkg.weight === "number" ? pkg.weight : (pkg.weight?.value ?? 1);
    const weightUnits =
      typeof pkg.weight === "number" ? "KG" : (pkg.weight?.units ?? "KG");

    const payload = getEstimatePayload(
      {
        city: pickupAddress.city || "",
        countryCode: pickupAddress.countryCode || pickupAddress.country || "",
        stateOrProvinceCode: pickupAddress.stateOrProvinceCode || "",
        postalCode: pickupAddress.postalCode,
        streetLines: pickupAddress.streetLines || [pickupAddress.street || ""],
      },
      {
        city: dropoffAddress.city || "",
        countryCode: dropoffAddress.countryCode || dropoffAddress.country || "",
        stateOrProvinceCode: dropoffAddress.stateOrProvinceCode || "",
        postalCode: dropoffAddress.postalCode,
        streetLines: dropoffAddress.streetLines || [
          dropoffAddress.street || "",
        ],
      },
      {
        weight: {
          value: weightValue,
          units: weightUnits,
        },
        dimensions: {
          length: pkg.dimensions?.length || 10,
          width: pkg.dimensions?.width || 10,
          height: pkg.dimensions?.height || 10,
          units: pkg.dimensions?.units || "CM",
        },
      },
      getOrSetGuestId(),
      countryCode || undefined,
      shipment.customs || undefined,
    );

    getRates(payload, {
      onSuccess: (data) => {
        setRates(data.rates || []);
      },
      onError: () => {
        addToast({
          title: "Rate Calculation Failed",
          message: "Unable to fetch fresh rates. Please try again.",
          type: "error",
        });
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, shipment]);

  /**
   * Submits the update payload with the new rate + existing IDs
   */
  const handleConfirmUpdate = () => {
    if (!selectedRate || !shipment) return;

    const pickupAddress = shipment.pickupAddress || shipment.sender;
    const dropoffAddress = shipment.dropoffAddress || shipment.recipient;
    const pkg = shipment.package || {
      weight: shipment.weight,
      dimensions: shipment.dimensions,
    };

    if (!pickupAddress || !dropoffAddress || !pkg) {
      addToast({
        title: "Missing Data",
        message: "Could not prepare shipment update payload.",
        type: "error",
      });
      return;
    }

    const weightValue =
      typeof pkg.weight === "number" ? pkg.weight : (pkg.weight?.value ?? 1);
    const weightUnits =
      typeof pkg.weight === "number" ? "KG" : (pkg.weight?.units ?? "KG");

    const isInternational =
      (pickupAddress?.countryCode || pickupAddress?.country) !==
      (dropoffAddress?.countryCode || dropoffAddress?.country);

    const payload = {
      carrierSlug:
        selectedRate.carrierSlug ||
        selectedRate.carrier?.toLowerCase().replace(/\s+/g, "-") ||
        "fedex",
      pickupAddress: {
        streetLines: pickupAddress.streetLines || [pickupAddress.street || ""],
        city: pickupAddress.city || "",
        stateOrProvinceCode: pickupAddress.stateOrProvinceCode || "",
        postalCode: pickupAddress.postalCode || "",
        countryCode: pickupAddress.countryCode || pickupAddress.country || "",
        residential: false,
        contact: {
          personName:
            pickupAddress.contact?.personName || pickupAddress.name || "",
          phoneNumber:
            pickupAddress.contact?.phoneNumber || pickupAddress.phone || "",
          companyName:
            pickupAddress.contact?.companyName || pickupAddress.company || "",
        },
      },
      dropoffAddress: {
        streetLines: dropoffAddress.streetLines || [
          dropoffAddress.street || "",
        ],
        city: dropoffAddress.city || "",
        stateOrProvinceCode: dropoffAddress.stateOrProvinceCode || "",
        postalCode: dropoffAddress.postalCode || "",
        countryCode: dropoffAddress.countryCode || dropoffAddress.country || "",
        residential: false,
        contact: {
          personName:
            dropoffAddress.contact?.personName || dropoffAddress.name || "",
          phoneNumber:
            dropoffAddress.contact?.phoneNumber || dropoffAddress.phone || "",
          companyName:
            dropoffAddress.contact?.companyName || dropoffAddress.company || "",
        },
      },
      package: {
        weight: {
          value: weightValue,
          units: weightUnits,
        },
        dimensions: {
          length: pkg.dimensions?.length || 10,
          width: pkg.dimensions?.width || 10,
          height: pkg.dimensions?.height || 10,
          units: pkg.dimensions?.units || "CM",
        },
      },
      rate: {
        carrier: selectedRate.carrier,
        serviceType: selectedRate.serviceType,
        serviceName: selectedRate.serviceName,
        carrierPrice: selectedRate.carrierPrice,
        actualPrice: selectedRate.actualPrice,
        currency: selectedRate.currency,
      },
      customs: isInternational ? shipment.customs : undefined,
      userCountryCode: countryCode,
      preferredPaymentOption: paymentMethod,
      // ✅ These trigger the UPDATE flow
      shipmentId,
      invoiceId,
    };

    performUpdate(payload, {
      onSuccess: (data) => {
        addToast({
          title: "Shipment Updated",
          message:
            "Your shipment has been updated with the new rate. A fresh payment link is available.",
          type: "success",
        });
        onClose();
        onUpdateSuccess?.(data);
      },
      onError: (error: unknown) => {
        let msg = "Unable to update shipment. Please try again.";
        if (error && typeof error === "object" && "response" in error) {
          const res = (error as { response?: { data?: { error?: string } } })
            .response;
          if (res?.data?.error) msg = res.data.error;
        }
        addToast({
          title: "Update Failed",
          message: msg,
          type: "error",
        });
      },
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-70"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-71 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
              {/* Header */}
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black text-gray-900 tracking-tight">
                    Update Shipment
                  </h3>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-0.5">
                    Select a new rate
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:border-gray-900 transition-all"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              {/* Rates List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                {/* Loading */}
                {isCalculatingRates && (
                  <div className="py-16 flex flex-col items-center gap-4">
                    <FiLoader className="w-8 h-8 text-brand-blue animate-spin" />
                    <p className="text-sm text-gray-500 font-medium">
                      Calculating fresh rates…
                    </p>
                  </div>
                )}

                {/* Empty state */}
                {!isCalculatingRates && displayRates.length === 0 && (
                  <div className="py-16 text-center">
                    <FiTruck className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-sm text-gray-500 font-medium">
                      No rates available. Please try again later.
                    </p>
                  </div>
                )}

                {/* Rate Cards */}
                {!isCalculatingRates && displayRates.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                      Available Services
                    </p>
                    {displayRates.map((rate: Rate) => {
                      const isSelected =
                        selectedRate?.serviceType === rate.serviceType;
                      // Find original (non-transformed) rate for payload
                      const originalRate =
                        rates.find((r) => r.serviceType === rate.serviceType) ||
                        rate;

                      return (
                        <button
                          key={rate.serviceType}
                          onClick={() => setSelectedRate(originalRate)}
                          className={`w-full text-left p-5 rounded-2xl border-2 transition-all ${
                            isSelected
                              ? "border-brand-blue bg-brand-blue/5 ring-1 ring-brand-blue"
                              : "border-gray-100 hover:border-brand-blue/30 bg-white"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                  isSelected
                                    ? "bg-brand-blue text-white"
                                    : "bg-gray-100 text-gray-500"
                                }`}
                              >
                                {isSelected ? (
                                  <FiCheck className="w-5 h-5" />
                                ) : (
                                  <FiTruck className="w-5 h-5" />
                                )}
                              </div>
                              <div>
                                <p className="font-bold text-gray-900 text-sm">
                                  {rate.serviceName}
                                </p>
                                <p className="text-xs text-gray-500 font-medium mt-0.5">
                                  {rate.deliveryDescription || "Standard"}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-black text-gray-900 text-lg">
                                {formatCurrencyCompact(
                                  rate.actualPrice,
                                  rate.currency as SupportedCurrency,
                                )}
                              </p>
                              <p className="text-[10px] text-gray-400 font-bold uppercase">
                                {rate.currency}
                              </p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Payment Method Selector */}
                {selectedRate && (
                  <div className="space-y-3">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                      <FiCreditCard className="w-3.5 h-3.5" />
                      Payment Method
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <label
                        className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                          paymentMethod === "stripe"
                            ? "border-brand-blue bg-brand-blue/5 ring-1 ring-brand-blue"
                            : "border-gray-200 hover:border-brand-blue/50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="updatePaymentMethod"
                          value="stripe"
                          className="w-4 h-4 text-brand-blue border-gray-300 focus:ring-brand-blue"
                          checked={paymentMethod === "stripe"}
                          onChange={() => setPaymentMethod("stripe")}
                        />
                        <div className="ml-3">
                          <span className="block text-sm font-bold text-gray-900">
                            Stripe
                          </span>
                          {!isPolishUser && (
                            <span className="text-[10px] text-green-700 font-bold">
                              Recommended
                            </span>
                          )}
                        </div>
                      </label>
                      <label
                        className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                          paymentMethod === "payu"
                            ? "border-brand-blue bg-brand-blue/5 ring-1 ring-brand-blue"
                            : "border-gray-200 hover:border-brand-blue/50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="updatePaymentMethod"
                          value="payu"
                          className="w-4 h-4 text-brand-blue border-gray-300 focus:ring-brand-blue"
                          checked={paymentMethod === "payu"}
                          onChange={() => setPaymentMethod("payu")}
                        />
                        <div className="ml-3">
                          <span className="block text-sm font-bold text-gray-900">
                            PayU
                          </span>
                          {isPolishUser && (
                            <span className="text-[10px] text-green-700 font-bold">
                              Recommended
                            </span>
                          )}
                        </div>
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-100 bg-white rounded-b-3xl">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full h-14 rounded-2xl text-base font-black shadow-lg shadow-brand-blue/20"
                  onClick={handleConfirmUpdate}
                  isLoading={isUpdating}
                  disabled={!selectedRate || isUpdating || isCalculatingRates}
                >
                  {isUpdating ? (
                    "Updating…"
                  ) : selectedRate ? (
                    <>
                      Confirm Update <FiCheck className="ml-2" />
                    </>
                  ) : (
                    "Select a rate to continue"
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

UpdateShipmentModal.displayName = "UpdateShipmentModal";
