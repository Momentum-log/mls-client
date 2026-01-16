"use client";

import React from "react";

export default function NewShipmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-6xl mx-auto py-8 px-4 md:py-12">
      <div className="mb-12 text-center space-y-3">
        <h1 className="text-3xl md:text-4xl font-black text-gray-900 font-work-sans">
          Create New <span className="text-brand-blue">Shipment</span>
        </h1>
        <p className="text-gray-500 max-w-xl mx-auto text-lg">
          Complete the details below to book your shipment. Your progress is
          tracked in real-time.
        </p>
      </div>

      <div>{children}</div>
    </div>
  );
}
