"use client";

import React, { useState } from "react";
import { FiAlertTriangle, FiClock, FiXCircle } from "react-icons/fi";
import Button from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import {
  useCancelShipment,
  useWithdrawCancellation,
} from "@/hooks/shipments/use-shipments";
import { useToast } from "@/hooks/use-toast";
import { ShipmentCancellation as CancellationSummary } from "@/types/shipping";
import { extractApiError } from "@/utils/error-handler";
import { canRequestCancellation } from "@/utils/shipment-status";

/** Server limit on the optional reason. */
const REASON_MAX_LENGTH = 500;

interface ShipmentCancellationProps {
  /** Shipment ID. The cancel endpoints do not accept a tracking number. */
  shipmentId: string;
  shipmentStatus: string;
  cancellation?: CancellationSummary | null;
}

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

/**
 * Lets the customer cancel a shipment, or ask for it to be cancelled.
 *
 * An unpaid shipment cancels at once. A paid one still with the customer opens
 * a request that staff approve (refund follows) or reject; the customer is
 * emailed either way. Once the parcel is with the carrier nothing is offered,
 * because the server refuses it.
 */
export default function ShipmentCancellation({
  shipmentId,
  shipmentStatus,
  cancellation,
}: ShipmentCancellationProps) {
  const { addToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState("");

  const { mutate: cancel, isPending: isCancelling } =
    useCancelShipment(shipmentId);
  const { mutate: withdraw, isPending: isWithdrawing } =
    useWithdrawCancellation(shipmentId);

  const unpaid = shipmentStatus === "CREATED";
  const requestOpen = cancellation?.status === "OPEN";
  const canAct = unpaid || (canRequestCancellation(shipmentStatus) && !requestOpen);

  const showError = (title: string, error: unknown) => {
    // 409 messages are written for the customer ("already with the carrier",
    // "a request is already open"), so they are shown as they come.
    const { message } = extractApiError(error);
    addToast({
      title,
      message: message || "Something went wrong. Please try again.",
      type: "error",
    });
  };

  const handleConfirm = () => {
    cancel(reason.trim() || undefined, {
      onSuccess: (result) => {
        setIsOpen(false);
        setReason("");
        addToast({
          title:
            result.outcome === "CANCELLED"
              ? "Shipment Cancelled"
              : "Cancellation Requested",
          message:
            result.outcome === "CANCELLED"
              ? "Nothing was charged for this shipment."
              : "Our team will review it and email you the decision.",
          type: "success",
        });
      },
      onError: (error) => showError("Could Not Cancel", error),
    });
  };

  const handleWithdraw = () => {
    withdraw(undefined, {
      onSuccess: () =>
        addToast({
          title: "Request Withdrawn",
          message: "Your shipment goes ahead as booked.",
          type: "success",
        }),
      onError: (error) => showError("Could Not Withdraw", error),
    });
  };

  if (shipmentStatus === "CANCELLED") {
    if (cancellation?.status !== "APPROVED") return null;
    return (
      <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <h4 className="font-bold text-gray-900 mb-1">Cancelled at your request</h4>
        <p className="text-sm text-gray-600 font-medium">
          Approved
          {cancellation.decidedAt ? ` on ${formatDate(cancellation.decidedAt)}` : ""}.
          Your refund is being processed to the original payment method.
        </p>
      </section>
    );
  }

  if (requestOpen) {
    return (
      <section className="bg-amber-50 p-6 rounded-3xl border border-amber-200">
        <div className="flex items-start gap-3 mb-4">
          <FiClock className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-amber-900 mb-1">
              Cancellation requested
            </h4>
            <p className="text-sm text-amber-800 font-medium">
              Sent {formatDate(cancellation.requestedAt)}. Our team will email
              you the decision. Please don&apos;t hand the parcel to the
              carrier in the meantime.
            </p>
            {cancellation.reason && (
              <p className="text-xs text-amber-800 mt-2">
                Your reason: {cancellation.reason}
              </p>
            )}
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full bg-white"
          onClick={handleWithdraw}
          disabled={isWithdrawing}
        >
          {isWithdrawing ? "Withdrawing..." : "Withdraw Request"}
        </Button>
      </section>
    );
  }

  if (!canAct) return null;

  return (
    <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
      {cancellation?.status === "REJECTED" && (
        <div className="flex items-start gap-2 text-xs text-red-800 bg-red-50 border border-red-100 rounded-xl p-3 mb-4">
          <FiAlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>
            Your last cancellation request was declined
            {cancellation.decidedAt ? ` on ${formatDate(cancellation.decidedAt)}` : ""}.
            {cancellation.decisionNotes && ` ${cancellation.decisionNotes}`}
          </span>
        </div>
      )}
      <h4 className="font-bold text-gray-900 mb-1">
        {unpaid ? "Don't need this shipment?" : "Need to cancel?"}
      </h4>
      <p className="text-sm text-gray-600 font-medium mb-4">
        {unpaid
          ? "It hasn't been paid for, so you can cancel it straight away."
          : "While the parcel is still with you, you can ask us to cancel it. If we approve, your payment is refunded."}
      </p>
      <Button
        variant="outline"
        size="sm"
        className="w-full border-red-600 text-red-600 hover:bg-red-600 hover:ring-red-600"
        onClick={() => setIsOpen(true)}
      >
        <FiXCircle className="mr-2" />
        {unpaid ? "Cancel Shipment" : "Request Cancellation"}
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => !isCancelling && setIsOpen(false)}
        title={unpaid ? "Cancel this shipment?" : "Request cancellation"}
        disableBackdropDismiss={isCancelling}
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600 font-medium">
            {unpaid
              ? "The shipment is cancelled immediately. Nothing has been charged, and it can't be undone."
              : "Our team reviews every request and emails you the decision. If it's approved, the shipment is cancelled and your payment is refunded to the original method."}
          </p>
          <div>
            <label
              htmlFor="cancellation-reason"
              className="text-xs font-black uppercase tracking-tight text-gray-700 block mb-2"
            >
              Reason (optional)
            </label>
            <textarea
              id="cancellation-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              maxLength={REASON_MAX_LENGTH}
              rows={3}
              className="w-full rounded-xl border border-gray-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
              placeholder="Tell us why, if you'd like"
            />
            <p className="text-[11px] text-gray-400 text-right">
              {reason.length}/{REASON_MAX_LENGTH}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="default"
              className="flex-1"
              onClick={() => setIsOpen(false)}
              disabled={isCancelling}
            >
              Keep Shipment
            </Button>
            <Button
              variant="danger"
              className="flex-1"
              onClick={handleConfirm}
              disabled={isCancelling}
            >
              {isCancelling
                ? "Sending..."
                : unpaid
                  ? "Cancel Shipment"
                  : "Send Request"}
            </Button>
          </div>
        </div>
      </Modal>
    </section>
  );
}
