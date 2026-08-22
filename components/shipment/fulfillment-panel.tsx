"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FiTruck,
  FiMapPin,
  FiLoader,
  FiCheckCircle,
  FiAlertTriangle,
  FiInfo,
} from "react-icons/fi";
import Button from "@/components/ui/button";
import PickupScheduleForm from "./pickup-schedule-form";
import DropoffCenterList from "./dropoff-center-list";
import FulfillmentInfoModal from "./fulfillment-info-modal";
import {
  useCancelPickup,
  useFulfillmentOptions,
  usePickupAvailability,
  useRequestPickup,
} from "@/hooks/shipments/use-fulfillment";
import {
  FulfillmentType,
  RequestPickupPayload,
  ShipmentStatus,
} from "@/types/shipping";
import { extractApiError, parseFulfillmentError } from "@/utils/error-handler";
import { formatCurrency } from "@/utils/currency-formatter";
import { SupportedCurrency } from "@/types/country";
import { isLabelPending, isUnpaid, needsSupport } from "@/utils/shipment-status";
import { useToast } from "@/hooks/use-toast";

interface FulfillmentPanelProps {
  shipmentId: string;
  shipmentStatus: ShipmentStatus;
  invoiceId?: string;
  /** Pickup schedule already on the shipment record, for the confirmed view. */
  scheduledPickupDate?: string | null;
  pickupReadyTime?: string | null;
  pickupCloseTime?: string | null;
  pickupConfirmationCode?: string | null;
  pickupLocationCode?: string | null;
}

const Shell = ({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "info" | "danger";
}) => (
  <section
    id="fulfillment"
    className={`p-6 rounded-2xl border scroll-mt-24 ${
      tone === "danger"
        ? "bg-red-50 border-red-100"
        : tone === "info"
          ? "bg-brand-blue/5 border-brand-blue/15"
          : "bg-gray-50 border-gray-100"
    }`}
  >
    {children}
  </section>
);

/**
 * Lets the customer choose how their parcel reaches the carrier, after payment.
 *
 * The choice moved here because before payment there is no carrier to ask
 * about — it is selected server-side during rating, and on a hub-routed
 * shipment the collection concerns only the first leg.
 *
 * Drop-off is the resting state: there is no "choose drop-off" call, only an
 * opt-in to a courier pickup and a cancellation that returns you here.
 */
export default function FulfillmentPanel({
  shipmentId,
  shipmentStatus,
  invoiceId,
  scheduledPickupDate,
  pickupReadyTime,
  pickupCloseTime,
  pickupConfirmationCode,
  pickupLocationCode,
}: FulfillmentPanelProps) {
  const { addToast } = useToast();
  const [view, setView] = useState<"none" | "pickup" | "dropoff">("none");
  const [infoType, setInfoType] = useState<FulfillmentType | null>(null);

  const labelPending = isLabelPending(shipmentStatus);
  const unpaid = isUnpaid(shipmentStatus);

  const {
    data: options,
    isPending: optionsLoading,
    error: optionsError,
  } = useFulfillmentOptions(shipmentId, {
    // Unpaid shipments have nothing to arrange, and the endpoint 409s.
    enabled: !unpaid,
    // `PAID` means "paid, label still generating" — it resolves on its own.
    pollWhilePending: labelPending,
  });

  const pickupSupported = options?.pickupSupported ?? false;
  const carrierName = options?.carrierDisplayName ?? "the carrier";
  const isPickupConfirmed = options?.currentFulfillment === "PICKUP";

  const { data: availability, error: availabilityError } = usePickupAvailability(
    shipmentId,
    { enabled: view === "pickup" && pickupSupported && !isPickupConfirmed },
  );

  const { mutate: bookPickup, isPending: isBooking } =
    useRequestPickup(shipmentId);
  const { mutate: cancel, isPending: isCancelling } =
    useCancelPickup(shipmentId);

  const availabilityErrorMessage = React.useMemo(() => {
    if (!availabilityError) return null;
    const { statusCode, message } = extractApiError(availabilityError);
    return parseFulfillmentError(statusCode, message).userMessage;
  }, [availabilityError]);

  const handleBookPickup = (payload: RequestPickupPayload) => {
    bookPickup(payload, {
      onSuccess: (result) => {
        setView("none");
        // `pickupFee` is currently always 0. It exists so a surcharge can be
        // introduced without a breaking change — surface it only if charged.
        const fee =
          result.pickupFee > 0
            ? ` Pickup fee: ${formatCurrency(result.pickupFee, result.currency as SupportedCurrency)}.`
            : "";

        addToast({
          title: "Pickup Confirmed",
          message: `Confirmation code ${result.pickupConfirmationCode}.${fee}`,
          type: "success",
        });
      },
      onError: (error) => {
        // The label already exists and stays valid for drop-off, so a refusal
        // is not terminal — leave both routes open.
        const { statusCode, message } = extractApiError(error);
        addToast({
          title: "Pickup Not Booked",
          message: `${parseFulfillmentError(statusCode, message).userMessage} Your label is unaffected — you can retry or drop the parcel off instead.`,
          type: "error",
        });
      },
    });
  };

  const handleCancel = () => {
    cancel(undefined, {
      onSuccess: () => {
        addToast({
          title: "Pickup Cancelled",
          message: "You can book another pickup or drop the parcel off.",
          type: "success",
        });
      },
      onError: (error) => {
        // Never clear local state here. If the carrier refused because a
        // courier is already dispatched, the pickup is still live.
        const { statusCode, message } = extractApiError(error);
        addToast({
          title: "Could Not Cancel",
          message: `${parseFulfillmentError(statusCode, message).userMessage} Your pickup is still scheduled.`,
          type: "error",
        });
      },
    });
  };

  if (unpaid) {
    return (
      <Shell>
        <h3 className="font-bold text-gray-900 mb-1">Awaiting Payment</h3>
        <p className="text-sm text-gray-600 font-medium">
          Once payment completes we&apos;ll create your label, and you can
          choose how to send the parcel.
        </p>
        {invoiceId && (
          <Link href={`/app/invoices/${invoiceId}`} className="inline-block mt-4">
            <Button variant="primary" className="text-xs py-2 px-4">
              Complete Payment
            </Button>
          </Link>
        )}
      </Shell>
    );
  }

  if (needsSupport(shipmentStatus)) {
    return (
      <Shell tone="danger">
        <div className="flex items-start gap-3">
          <FiAlertTriangle className="w-6 h-6 text-red-600 shrink-0" />
          <div>
            <h3 className="font-bold text-red-900 mb-1">
              We couldn&apos;t create your label
            </h3>
            <p className="text-sm text-red-700 font-medium">
              Your payment went through, but the carrier didn&apos;t return a
              label. Our team has been alerted — please contact support and
              we&apos;ll sort this out.
            </p>
          </div>
        </div>
      </Shell>
    );
  }

  if (labelPending || (optionsLoading && !options)) {
    return (
      <Shell tone="info">
        <div className="flex items-center gap-3">
          <FiLoader className="w-5 h-5 text-brand-blue animate-spin shrink-0" />
          <div>
            <h3 className="font-bold text-gray-900">Preparing your label</h3>
            <p className="text-sm text-gray-600 font-medium">
              This usually takes a moment. We&apos;ll show your sending options
              as soon as it&apos;s ready.
            </p>
          </div>
        </div>
      </Shell>
    );
  }

  if (optionsError || !options) {
    const { statusCode, message } = extractApiError(optionsError);
    const parsed = parseFulfillmentError(statusCode, message);

    // A parcel already moving is a settled outcome, not an error.
    return (
      <Shell tone={parsed.reason === "IN_TRANSIT" ? "neutral" : "danger"}>
        <h3 className="font-bold text-gray-900 mb-1">
          {parsed.reason === "IN_TRANSIT"
            ? "Collection Settled"
            : "Sending Options Unavailable"}
        </h3>
        <p className="text-sm text-gray-600 font-medium">{parsed.userMessage}</p>
      </Shell>
    );
  }

  if (isPickupConfirmed) {
    return (
      <Shell tone="info">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <FiCheckCircle className="w-6 h-6 text-brand-blue shrink-0" />
            <div className="space-y-1">
              <h3 className="font-bold text-gray-900">Courier Pickup Booked</h3>
              <p className="text-sm text-gray-600 font-medium">
                {scheduledPickupDate
                  ? new Date(scheduledPickupDate).toLocaleDateString("en-GB", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : "Date confirmed"}
                {pickupReadyTime && pickupCloseTime && (
                  <>
                    {" "}
                    between {pickupReadyTime.slice(0, 5)} and{" "}
                    {pickupCloseTime.slice(0, 5)}
                  </>
                )}
              </p>
              {pickupConfirmationCode && (
                <p className="text-xs text-gray-500 font-medium">
                  Confirmation code:{" "}
                  <strong className="text-gray-900">
                    {pickupConfirmationCode}
                  </strong>
                  {pickupLocationCode && ` • Location ${pickupLocationCode}`}
                </p>
              )}
            </div>
          </div>

          {options.canCancelPickup && (
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isCancelling}
              className="bg-white text-xs py-2 px-3 shrink-0"
            >
              {isCancelling ? "Cancelling..." : "Cancel Pickup"}
            </Button>
          )}
        </div>

        <p className="flex items-start gap-1.5 text-[11px] text-gray-500 font-medium mt-4">
          <FiInfo className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          Changed your mind? Cancel the pickup and drop the parcel off instead —
          your label works either way.
        </p>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="space-y-4">
        <div>
          <h3 className="font-bold text-gray-900 mb-1">
            How would you like to send this?
          </h3>
          <p className="text-sm text-gray-600 font-medium">
            Print your label, then either drop the parcel off or have a courier
            collect it. You can change your mind any time before collection.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setView(view === "dropoff" ? "none" : "dropoff")}
            className={`flex items-center gap-3 p-4 rounded-2xl border text-left transition-all ${
              view === "dropoff"
                ? "border-brand-blue bg-brand-blue/5 ring-1 ring-brand-blue"
                : "border-gray-200 bg-white hover:border-brand-blue/40"
            }`}
          >
            <FiMapPin className="w-5 h-5 text-brand-blue shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-900">
                I&apos;ll drop it off
              </p>
              <p className="text-[11px] text-gray-500 font-medium">
                Find nearby locations
              </p>
            </div>
            <span
              role="button"
              tabIndex={0}
              aria-label="Learn about dropping off"
              onClick={(e) => {
                e.stopPropagation();
                setInfoType("DROPOFF");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.stopPropagation();
                  setInfoType("DROPOFF");
                }
              }}
              className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 shrink-0"
            >
              <FiInfo className="w-4 h-4" />
            </span>
          </button>

          {/*
            Rendered strictly from what the carrier reports. Capability varies
            per carrier and changes as carriers are added, so it must never be
            inferred from the carrier's name.
          */}
          {pickupSupported && (
            <button
              type="button"
              onClick={() => setView(view === "pickup" ? "none" : "pickup")}
              className={`flex items-center gap-3 p-4 rounded-2xl border text-left transition-all ${
                view === "pickup"
                  ? "border-brand-blue bg-brand-blue/5 ring-1 ring-brand-blue"
                  : "border-gray-200 bg-white hover:border-brand-blue/40"
              }`}
            >
              <FiTruck className="w-5 h-5 text-brand-blue shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-900">
                  Send a courier
                </p>
                <p className="text-[11px] text-gray-500 font-medium">
                  Book a collection slot
                </p>
              </div>
              <span
                role="button"
                tabIndex={0}
                aria-label="Learn about courier pickup"
                onClick={(e) => {
                  e.stopPropagation();
                  setInfoType("PICKUP");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.stopPropagation();
                    setInfoType("PICKUP");
                  }
                }}
                className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 shrink-0"
              >
                <FiInfo className="w-4 h-4" />
              </span>
            </button>
          )}
        </div>

        {view === "dropoff" && (
          <DropoffCenterList
            shipmentId={shipmentId}
            carrierDisplayName={carrierName}
          />
        )}

        {view === "pickup" &&
          (availabilityError ? (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-800">
              <p className="font-bold">Couldn&apos;t load collection dates</p>
              <p className="text-amber-700">{availabilityErrorMessage}</p>
            </div>
          ) : availability ? (
            <PickupScheduleForm
              availability={availability}
              onSubmit={handleBookPickup}
              onCancel={() => setView("none")}
              isSubmitting={isBooking}
            />
          ) : (
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl text-center">
              <FiLoader className="w-4 h-4 text-brand-blue animate-spin mx-auto" />
            </div>
          ))}

        {infoType && (
          <FulfillmentInfoModal
            isOpen={Boolean(infoType)}
            onClose={() => setInfoType(null)}
            type={infoType}
            carrierDisplayName={carrierName}
          />
        )}

        {options.pickupStatus === "MISSED" && (
          <div className="flex items-start gap-2 text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-xl p-3">
            <FiAlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              A previous pickup wasn&apos;t collected. You can book another slot
              or drop the parcel off — your label is still valid.
            </span>
          </div>
        )}
      </div>
    </Shell>
  );
}
