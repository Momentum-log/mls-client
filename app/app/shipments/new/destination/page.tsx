"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useShipmentStore } from "@/store/shipment-store";
import { FiNavigation } from "react-icons/fi";
import AddressForm from "@/components/shipment/address-form";

export default function DestinationPage() {
  const router = useRouter();
  const { recipient, setRecipient, setStep } = useShipmentStore();

  useEffect(() => {
    setStep(1); // 1 index for second step
  }, [setStep]);

  const handleSubmit = (values: any) => {
    setRecipient(values);
    router.push("/app/shipments/new/package");
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-brand-blue/10 rounded-full">
          <FiNavigation className="w-6 h-6 text-brand-blue" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Destination Details
          </h2>
          <p className="text-sm text-gray-500">Where are we shipping to?</p>
        </div>
      </div>

      <AddressForm
        type="dropoff"
        initialValues={recipient || undefined}
        onSubmit={handleSubmit}
        onBack={handleBack}
      />
    </div>
  );
}
