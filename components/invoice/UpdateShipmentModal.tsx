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

import React, { useCallback, useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiCreditCard, FiCheck } from "react-icons/fi";
import { CreateShipmentResponse, Invoice } from "@/types/invoice";
import {
  CustomsData,
  ShippingEstimateResponse,
  ShippingTier,
  TIER_KEYS,
} from "@/types/shipping";
import {
  buildCreateShipmentPayload,
  type FlatAddress,
} from "@/utils/create-shipment-payload";
import TierSelection from "@/components/shipment/tier-selection";
import useUserCountryCode from "@/hooks/use-user-country-code";
import {
  useGetShippingEstimate,
  useCreateShipment,
} from "@/hooks/shipments/use-shipments";
import { getEstimatePayload } from "@/app/(marketing)/shipping-estimate/utils";
import { getOrSetGuestId } from "@/utils/auth-helper";
import { useToast } from "@/hooks/use-toast";
import { deepTransformData } from "@/utils/data-transform";
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

/**
 * Collapses either address shape this modal receives — canonical (from a
 * fetched shipment) or flat (from a form) — into the flat shape the shared
 * payload builder expects.
 */
const toFlatAddress = (address: ShipmentModalAddress): FlatAddress => ({
  name: address.contact?.personName || address.name || "",
  company: address.contact?.companyName || address.company || "",
  phone: address.contact?.phoneNumber || address.phone || "",
  street: address.streetLines?.[0] || address.street || "",
  city: address.city || "",
  postalCode: address.postalCode || "",
  country: address.countryCode || address.country || "",
  stateOrProvinceCode: address.stateOrProvinceCode || "",
});

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
  packages?: ShipmentModalPackage[];
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
  const pickupCountry = shipment
    ? (shipment.pickupAddress?.countryCode ||
       shipment.pickupAddress?.country ||
       shipment.sender?.countryCode ||
       shipment.sender?.country)
    : undefined;
  const { countryCode } = useUserCountryCode(pickupCountry);
  const { addToast } = useToast();

  const [estimate, setEstimate] = useState<ShippingEstimateResponse | null>(
    null,
  );
  const [selectedTier, setSelectedTier] = useState<ShippingTier | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "payu">(
    countryCode === "PL" ? "payu" : "stripe",
  );

  const isPolishUser = countryCode === "PL";
  // PayU settles in PLN only, so a EUR quote must not offer it. The
  // new-shipment drawer already enforces this; without it here the same
  // shipment could be re-submitted through a gateway that cannot take it.
  const isEUR = selectedTier?.currency === "EUR";

  // Rate estimation
  const { mutate: getRates, isPending: isCalculatingRates } =
    useGetShippingEstimate();

  // Create/update shipment
  const { mutate: performUpdate, isPending: isUpdating } = useCreateShipment();

  // Branding is display-only; routingRef is on the skip list and stays intact.
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

  /**
   * Re-quotes the original shipment's route.
   *
   * Called on open, and again when the server refuses a stale quote — the
   * price may have moved since the modal was opened.
   */
  const refreshRates = useCallback(() => {
    if (!shipment) return;

    setEstimate(null);
    setSelectedTier(null);

    // Extract shipment data for rate calculation
    const pickupAddress = shipment.pickupAddress || shipment.sender;
    const dropoffAddress = shipment.dropoffAddress || shipment.recipient;

    if (!pickupAddress || !dropoffAddress) {
      addToast({
        title: "Missing Data",
        message: "Could not extract shipment details for rate calculation.",
        type: "error",
      });
      return;
    }

    const shipmentPackages = shipment.packages || (shipment.package ? [shipment.package] : []);
    const finalPackages = shipmentPackages.length > 0 ? shipmentPackages : [
      {
        weight: typeof shipment.weight === "number" ? { value: shipment.weight, units: "KG" } : shipment.weight,
        dimensions: shipment.dimensions,
      }
    ];

    const formattedPackages = finalPackages.map((p: ShipmentModalPackage) => {
      const wVal = typeof p.weight === "number" ? p.weight : (p.weight?.value ?? 1);
      const wUnits = typeof p.weight === "number" ? "KG" : (p.weight?.units ?? "KG");
      return {
        weight: {
          value: wVal,
          units: wUnits,
        },
        dimensions: {
          length: p.dimensions?.length || 10,
          width: p.dimensions?.width || 10,
          height: p.dimensions?.height || 10,
          units: p.dimensions?.units || "CM",
        },
      };
    });

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
      formattedPackages,
      getOrSetGuestId(),
      countryCode || undefined,
      shipment.customs || undefined,
    );

    getRates(payload, {
      onSuccess: (data) => {
        setEstimate(data);
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
  }, [shipment, countryCode]);

  useEffect(() => {
    if (!isOpen) return;
    refreshRates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, shipment]);

  /**
   * Resolves the branded tier the user clicked back to the raw one, so the
   * routingRef reaches the server exactly as it was issued.
   */
  const handleTierSelect = (tier: ShippingTier) => {
    const rawTier =
      TIER_KEYS.map((key) => estimate?.tiers?.[key]).find(
        (candidate) => candidate?.routingRef === tier.routingRef,
      ) ?? tier;

    setSelectedTier(rawTier);

    if (rawTier.currency === "EUR" && paymentMethod === "payu") {
      setPaymentMethod("stripe");
    }
  };

  /**
   * Submits the update payload with the new tier + existing IDs
   */
  const handleConfirmUpdate = () => {
    if (!selectedTier || !shipment || !estimate) return;

    const pickupAddress = shipment.pickupAddress || shipment.sender;
    const dropoffAddress = shipment.dropoffAddress || shipment.recipient;

    if (!pickupAddress || !dropoffAddress) {
      addToast({
        title: "Missing Data",
        message: "Could not prepare shipment update payload.",
        type: "error",
      });
      return;
    }

    const shipmentPackages = shipment.packages || (shipment.package ? [shipment.package] : []);
    const finalPackages = shipmentPackages.length > 0 ? shipmentPackages : [
      {
        weight: typeof shipment.weight === "number" ? { value: shipment.weight, units: "KG" } : shipment.weight,
        dimensions: shipment.dimensions,
      }
    ];

    const formattedPackages = finalPackages.map((p: ShipmentModalPackage) => {
      const wVal = typeof p.weight === "number" ? p.weight : (p.weight?.value ?? 1);
      const wUnits = typeof p.weight === "number" ? "KG" : (p.weight?.units ?? "KG");
      return {
        weight: {
          value: wVal,
          units: wUnits,
        },
        dimensions: {
          length: p.dimensions?.length || 10,
          width: p.dimensions?.width || 10,
          height: p.dimensions?.height || 10,
          units: p.dimensions?.units || "CM",
        },
      };
    });

    const isInternational =
      (pickupAddress?.countryCode || pickupAddress?.country) !==
      (dropoffAddress?.countryCode || dropoffAddress?.country);

    const payload = buildCreateShipmentPayload({
      estimateId: estimate.estimateId,
      routingRef: selectedTier.routingRef,
      sender: toFlatAddress(pickupAddress),
      recipient: toFlatAddress(dropoffAddress),
      packages: formattedPackages,
      customs: isInternational ? shipment.customs : undefined,
      userCountryCode: countryCode,
      preferredPaymentOption: paymentMethod,
      // These trigger the UPDATE flow
      shipmentId,
      invoiceId,
    });

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
        let status: number | undefined;

        if (error && typeof error === "object" && "response" in error) {
          const res = (
            error as {
              response?: { status?: number; data?: { error?: string } };
            }
          ).response;
          status = res?.status;
          if (res?.data?.error) msg = res.data.error;
        }

        // The quote aged out while the modal was open. Re-run the estimate the
        // modal already fetches on open; retrying the same routingRef cannot
        // succeed.
        if (status === 409) {
          setSelectedTier(null);
          refreshRates();
          addToast({
            title: "Prices Have Changed",
            message:
              "That quote expired. We're fetching current prices — please choose again.",
            type: "error",
          });
          return;
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
                <TierSelection
                  tiers={displayTiers}
                  hasRates={(estimate?.rates?.length ?? 0) > 0}
                  errors={displayErrors}
                  selectedRoutingRef={selectedTier?.routingRef ?? null}
                  onSelect={handleTierSelect}
                  isLoading={isCalculatingRates}
                  onBack={onClose}
                />

                {/* Payment Method Selector */}
                {selectedTier && (
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
                        className={`flex items-center p-4 border-2 rounded-xl transition-all ${
                          isEUR
                            ? "border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed"
                            : paymentMethod === "payu"
                              ? "border-brand-blue bg-brand-blue/5 ring-1 ring-brand-blue cursor-pointer"
                              : "border-gray-200 hover:border-brand-blue/50 cursor-pointer"
                        }`}
                      >
                        <input
                          type="radio"
                          name="updatePaymentMethod"
                          value="payu"
                          disabled={isEUR}
                          className="w-4 h-4 text-brand-blue border-gray-300 focus:ring-brand-blue disabled:cursor-not-allowed"
                          checked={paymentMethod === "payu"}
                          onChange={() => setPaymentMethod("payu")}
                        />
                        <div className="ml-3">
                          <span className="block text-sm font-bold text-gray-900">
                            PayU
                          </span>
                          {isEUR ? (
                            <span className="text-[10px] text-gray-500 font-bold">
                              PayU only supports PLN payments
                            </span>
                          ) : (
                            isPolishUser && (
                              <span className="text-[10px] text-green-700 font-bold">
                                Recommended
                              </span>
                            )
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
                  disabled={!selectedTier || isUpdating || isCalculatingRates}
                >
                  {isUpdating ? (
                    "Updating…"
                  ) : selectedTier ? (
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
