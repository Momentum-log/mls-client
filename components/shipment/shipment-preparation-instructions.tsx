"use client";

import React from "react";
import { FiPrinter, FiDownload, FiPackage } from "react-icons/fi";

interface ShipmentPreparationInstructionsProps {
  labelUrl?: string | null;
}

/**
 * How to get the parcel ready once a label exists.
 *
 * Deliberately stops short of the handover itself — choosing between drop-off
 * and a courier pickup belongs to FulfillmentPanel, which reads the carrier's
 * actual capabilities rather than assuming them.
 */
export default function ShipmentPreparationInstructions({
  labelUrl,
}: ShipmentPreparationInstructionsProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div>
          <h3 className="text-lg font-black text-gray-900 tracking-tight flex items-center gap-2">
            <FiPackage className="w-5 h-5 text-brand-blue" />
            Shipment Preparation Instructions
          </h3>
          <p className="text-xs text-gray-500">
            Follow these steps to prepare your package for courier handling.
          </p>
        </div>

        {labelUrl && (
          <a
            href={labelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-blue text-white text-xs font-bold shadow-sm hover:bg-brand-blue/90 transition-colors"
          >
            <FiDownload className="w-4 h-4" /> Download Label
          </a>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Step 1 */}
        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-brand-blue text-white font-black text-xs flex items-center justify-center">
              1
            </span>
            <h4 className="font-bold text-xs text-gray-900 flex items-center gap-1.5">
              <FiPrinter className="w-3.5 h-3.5 text-gray-600" />
              Print Shipping Label
            </h4>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">
            Download your label PDF and print it on standard A4 paper or adhesive shipping label paper. Ensure barcodes are clean and unblurred.
          </p>
        </div>

        {/* Step 2 */}
        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-brand-blue text-white font-black text-xs flex items-center justify-center">
              2
            </span>
            <h4 className="font-bold text-xs text-gray-900 flex items-center gap-1.5">
              <FiPackage className="w-3.5 h-3.5 text-gray-600" />
              Attach Label Securely
            </h4>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">
            Affix the printed label flatly to the largest side of the box. Do not fold paper across box edges or cover barcodes with dark tape.
          </p>
        </div>

      </div>
    </div>
  );
}
