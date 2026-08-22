"use client";

import React from "react";
import Modal from "@/components/ui/modal";
import Button from "@/components/ui/button";
import { FulfillmentType } from "@/types/shipping";
import { FiTruck, FiMapPin, FiCheckCircle, FiClock, FiFileText } from "react-icons/fi";

interface FulfillmentInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: FulfillmentType;
  /**
   * Sourced from `/fulfillment-options`. The carrier is chosen server-side and
   * varies per shipment, so it must never be hardcoded here.
   */
  carrierDisplayName?: string;
}

/**
 * Explains what each sending option involves.
 *
 * Describes the post-payment flow: the label already exists by the time the
 * customer is choosing, so every step here starts from "print it".
 */
export default function FulfillmentInfoModal({
  isOpen,
  onClose,
  type,
  carrierDisplayName = "the carrier",
}: FulfillmentInfoModalProps) {
  const isPickup = type === "PICKUP";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isPickup ? "Book a Courier Pickup" : "Drop It Off Yourself"}
    >
      <div className="space-y-5 text-sm text-gray-600">
        <div className="flex items-center gap-3 p-3 bg-brand-blue/5 rounded-2xl border border-brand-blue/10">
          <div className="w-10 h-10 rounded-xl bg-brand-blue text-white flex items-center justify-center shrink-0">
            {isPickup ? <FiTruck className="w-5 h-5" /> : <FiMapPin className="w-5 h-5" />}
          </div>
          <div>
            <h4 className="font-bold text-gray-900">
              {isPickup
                ? `${carrierDisplayName} Courier Pickup`
                : `${carrierDisplayName} Drop-off`}
            </h4>
            <p className="text-xs text-gray-500">
              {isPickup
                ? "A driver will pick up from your specified address."
                : `Hand your parcel in at any compatible ${carrierDisplayName} location.`}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <h5 className="font-bold text-gray-900 text-xs uppercase tracking-wider">
            How It Works
          </h5>
          {isPickup ? (
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-start gap-2.5">
                <FiClock className="w-4 h-4 text-brand-blue shrink-0 mt-0.5" />
                <span>
                  <strong>Print your label:</strong> It&apos;s ready now — print it and attach it flat to the largest side of the box.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <FiFileText className="w-4 h-4 text-brand-blue shrink-0 mt-0.5" />
                <span>
                  <strong>Pick a collection slot:</strong> Choose from the dates the courier is actually available.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <FiCheckCircle className="w-4 h-4 text-brand-blue shrink-0 mt-0.5" />
                <span>
                  <strong>Hand it over:</strong> Have the parcel ready at your pickup address during the window you chose. You can cancel any time before collection.
                </span>
              </li>
            </ul>
          ) : (
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-start gap-2.5">
                <FiMapPin className="w-4 h-4 text-brand-blue shrink-0 mt-0.5" />
                <span>
                  <strong>Print your label:</strong> It&apos;s ready now — print it and attach it flat to the largest side of the box.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <FiFileText className="w-4 h-4 text-brand-blue shrink-0 mt-0.5" />
                <span>
                  <strong>Find somewhere nearby:</strong> We&apos;ll show locations close to your pickup address, nearest first.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <FiCheckCircle className="w-4 h-4 text-brand-blue shrink-0 mt-0.5" />
                <span>
                  <strong>Drop it off:</strong> Your label isn&apos;t tied to a location — use any compatible one, during its opening hours.
                </span>
              </li>
            </ul>
          )}
        </div>

        <div className="pt-2">
          <Button
            variant="primary"
            onClick={onClose}
            className="w-full justify-center"
          >
            Got It
          </Button>
        </div>
      </div>
    </Modal>
  );
}
