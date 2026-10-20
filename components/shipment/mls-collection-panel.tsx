"use client";

import React from "react";
import { FiCheckCircle, FiCreditCard, FiInfo, FiTruck } from "react-icons/fi";
import Button from "@/components/ui/button";
import {
  useCollectionFeePaymentLink,
  useRequestCollection,
} from "@/hooks/shipments/use-fulfillment";
import { useToast } from "@/hooks/use-toast";
import { CollectionState } from "@/types/shipping";
import { formatCurrency } from "@/utils/currency-formatter";
import { extractApiError } from "@/utils/error-handler";

interface MlsCollectionPanelProps {
  shipmentId: string;
  /** The server's own wording for how this parcel reaches the carrier. */
  handoverMessage?: string;
  collection?: CollectionState;
}

/**
 * Handover for shipments MLS collects itself (DHL eCommerce exports).
 *
 * The customer cannot book a carrier pickup or drop the parcel off; they ask
 * MLS to collect it, paying a fee first when one is due. Every control here is
 * driven by `fulfillment-options.collection`, never inferred from the carrier.
 */
export default function MlsCollectionPanel({
  shipmentId,
  handoverMessage,
  collection,
}: MlsCollectionPanelProps) {
  const { addToast } = useToast();
  const { mutate: request, isPending: isRequesting } =
    useRequestCollection(shipmentId);
  const { mutate: createLink, isPending: isCreatingLink, variables: gateway } =
    useCollectionFeePaymentLink(shipmentId);

  const fee = collection?.fee;
  const feeLabel =
    fee && fee.payable ? formatCurrency(fee.amount, fee.currency) : null;

  const handleRequest = () => {
    request(undefined, {
      onSuccess: (result) => {
        addToast({
          title:
            result.collectionStatus === "CONFIRMED"
              ? "Collection Confirmed"
              : "Collection Requested",
          message:
            result.collectionStatus === "CONFIRMED"
              ? "We'll be in touch to arrange a time."
              : `Pay the ${formatCurrency(result.fee.amount, result.fee.currency)} collection fee to confirm it.`,
          type: "success",
        });
      },
      onError: (error) =>
        addToast({
          title: "Collection Not Requested",
          message:
            extractApiError(error).message || "Please try again in a moment.",
          type: "error",
        }),
    });
  };

  const handlePay = (selected: "stripe" | "payu") => {
    createLink(selected, {
      onSuccess: (result) => {
        window.location.href = result.paymentLink;
      },
      onError: (error) =>
        addToast({
          title: "Payment Unavailable",
          message:
            extractApiError(error).message || "Please try again in a moment.",
          type: "error",
        }),
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <FiTruck className="w-6 h-6 text-brand-blue shrink-0" />
        <div>
          <h3 className="font-bold text-gray-900 mb-1">We collect this parcel</h3>
          <p className="text-sm text-gray-600 font-medium">
            {handoverMessage ||
              "Our team collects the parcel from your address and hands it to the carrier at our sorting centre."}
          </p>
        </div>
      </div>

      {collection?.confirmed ? (
        <div className="flex items-start gap-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-xl p-3">
          <FiCheckCircle className="w-4 h-4 text-brand-blue shrink-0 mt-0.5" />
          <span>
            Collection confirmed
            {collection.fee.status === "PAID" && " and the fee is paid"}
            {collection.fee.status === "WAIVED" && " with no fee to pay"}.
            We&apos;ll contact you to arrange a time.
          </span>
        </div>
      ) : collection?.canPayFee ? (
        <div className="space-y-3">
          <p className="text-sm text-gray-700 font-medium">
            Collection requested. Pay the{" "}
            <strong className="text-gray-900">{feeLabel}</strong> collection
            fee to confirm it.
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="primary"
              size="sm"
              className="flex-1"
              onClick={() => handlePay("stripe")}
              disabled={isCreatingLink}
            >
              <FiCreditCard className="mr-2" />
              {isCreatingLink && gateway === "stripe"
                ? "Opening checkout..."
                : "Pay by Card"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 bg-white"
              onClick={() => handlePay("payu")}
              disabled={isCreatingLink}
            >
              {isCreatingLink && gateway === "payu"
                ? "Opening PayU..."
                : "Pay with PayU"}
            </Button>
          </div>
        </div>
      ) : collection?.canRequest ? (
        <div className="space-y-3">
          <p className="text-sm text-gray-700 font-medium">
            {feeLabel
              ? `Collection costs ${feeLabel}, paid after you request it.`
              : "Collection is free for this shipment."}
          </p>
          <Button
            variant="primary"
            size="sm"
            onClick={handleRequest}
            disabled={isRequesting}
          >
            {isRequesting ? "Requesting..." : "Request Collection"}
          </Button>
        </div>
      ) : collection?.requested ? (
        <p className="flex items-start gap-2 text-xs text-gray-600 font-medium">
          <FiInfo className="w-4 h-4 shrink-0" />
          Collection requested. We&apos;ll confirm it shortly.
        </p>
      ) : null}
    </div>
  );
}
