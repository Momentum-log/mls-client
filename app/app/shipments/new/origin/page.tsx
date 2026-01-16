"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useShipmentStore } from "@/store/shipment-store";
import { FiMapPin } from "react-icons/fi";
import { useAuthStore } from "@/store/auth-store";
import AddressForm from "@/components/shipment/address-form";

export default function OriginPage() {
  const router = useRouter();
  const { sender, setSender, setStep } = useShipmentStore();
  const { user } = useAuthStore();

  useEffect(() => {
    setStep(0); // 0 index for first step
    // Pre-fill with user data if sender is empty and user exists
    if (!sender && user) {
      setSender({
        name: user.name || "",
        phone: user.phone || "",
        street: user.address || "",
        city: "",
        postalCode: "",
        country: "PL",
        company: "",
      });
    }
  }, [setStep, sender, setSender, user]);

  const handleSubmit = (values: any) => {
    setSender(values);
    router.push("/app/shipments/new/destination");
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-brand-blue/10 rounded-full">
          <FiMapPin className="w-6 h-6 text-brand-blue" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Origin Details</h2>
          <p className="text-sm text-gray-500">
            Where are we picking up the package?
          </p>
        </div>
      </div>

      <AddressForm
        type="pickup"
        initialValues={sender}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
