"use client";

import React from "react";
import Stepper from "@/components/shipment/stepper";

export default function NewShipmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <div className="mb-8 text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 font-serif">
          Create New Shipment
        </h1>
        <p className="text-gray-500 max-w-lg mx-auto">
          Follow the steps below to book your shipment.
        </p>
      </div>

      <div className="mb-12">
        <Stepper />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 min-h-[400px]">
        {children}
      </div>
    </div>
  );
}
