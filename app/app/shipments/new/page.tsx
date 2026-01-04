"use client";

import React, { useState } from "react";
import EstimateForm from "@/components/shipping/estimate-form";
import RateSelection from "@/components/shipping/rate-selection";

export default function NewShipmentPage() {
  const [step, setStep] = useState(1);
  const [estimateData, setEstimateData] = useState<any>(null);
  const [shipmentPayload, setShipmentPayload] = useState<any>(null);

  const handleEstimateSuccess = (estimate: any, payload: any) => {
    setEstimateData(estimate);
    setShipmentPayload(payload);
    setStep(2);
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Create New Shipment
        </h1>
        <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
          <span className={step >= 1 ? "text-brand-blue font-semibold" : ""}>
            1. Details
          </span>
          <span>&rarr;</span>
          <span className={step >= 2 ? "text-brand-blue font-semibold" : ""}>
            2. Select Rate
          </span>
          <span>&rarr;</span>
          <span>3. Payment</span>
        </div>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        {step === 1 && (
          <EstimateForm onEstimateSuccess={handleEstimateSuccess} />
        )}
        {step === 2 && (
          <RateSelection
            estimate={estimateData}
            shipmentData={shipmentPayload}
          />
        )}
      </div>
    </div>
  );
}
