"use client";

import React from "react";
import Link from "next/link";
import { FiPackage, FiTruck, FiChevronRight } from "react-icons/fi";
import Button from "@/components/ui/button";

const mockShipments = [
  {
    id: "MLS-7482910",
    created: "2025-05-12",
    status: "In Transit",
    recipient: "John Doe",
    origin: "Warsaw",
    destination: "New York",
  },
  {
    id: "MLS-9283710",
    created: "2025-05-10",
    status: "Delivered",
    recipient: "Alice Smith",
    origin: "Krakow",
    destination: "London",
  },
];

export default function ShipmentHistoryPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Shipments</h1>
        <Link href="/app/shipments/new">
          <Button variant="primary">New Shipment</Button>
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Note: The backend API currently does not support listing all shipments. This is a mockup. */}
        {mockShipments.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {mockShipments.map((shipment) => (
              <Link
                key={shipment.id}
                href={`/app/shipments/${shipment.id}`}
                className="block hover:bg-gray-50 transition-colors"
              >
                <div className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-brand-blue/10 rounded-lg text-brand-blue">
                      <FiPackage className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{shipment.id}</p>
                      <p className="text-sm text-gray-500">
                        {shipment.created}
                      </p>
                    </div>
                  </div>

                  <div className="hidden md:block">
                    <p className="text-sm font-medium text-gray-900">
                      {shipment.origin} &rarr; {shipment.destination}
                    </p>
                    <p className="text-xs text-gray-500">
                      To {shipment.recipient}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        shipment.status === "Delivered"
                          ? "bg-green-100 text-green-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {shipment.status}
                    </span>
                    <FiChevronRight className="text-gray-400" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-gray-500">
            <p>No shipments found.</p>
          </div>
        )}
      </div>

      <p className="text-center text-xs text-gray-400 mt-8">
        * Displaying mock data (Backend listing not implemented)
      </p>
    </div>
  );
}
