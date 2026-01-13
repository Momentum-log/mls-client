"use client";

import React from "react";
import Link from "next/link";
import { FiPackage, FiChevronRight } from "react-icons/fi";
import Button from "@/components/ui/button";
import { useGetShipmentHistory } from "@/hooks/shipments/use-shipments";
import { formatStatus, getShipmentDisplayName } from "@/utils/shipment-helper";

export default function ShipmentHistoryPage() {
  const { data: shipments, isLoading, error } = useGetShipmentHistory();

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 space-y-4 animate-pulse">
        <div className="h-10 w-48 bg-gray-200 rounded" />
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-20 bg-gray-100 rounded-xl" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 text-center text-red-500">
        <p>Error loading shipments. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Shipments</h1>
        <Link href="/app/shipments/new">
          <Button variant="primary">New Shipment</Button>
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {shipments && shipments.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {shipments.map((shipment) => (
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
                      <p className="font-bold text-gray-900">
                        {getShipmentDisplayName(shipment)}
                      </p>
                      <p className="text-xs text-gray-500 font-medium capitalize">
                        {new Date(shipment.createdAt).toLocaleDateString(
                          "en-GB",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                        {" • "}
                        {shipment.actualPrice} {shipment.currency}
                      </p>
                    </div>
                  </div>

                  <div className="hidden md:block">
                    <p className="text-sm font-medium text-gray-900">
                      {shipment.carrierName} Shipment
                    </p>
                    <p className="text-xs text-gray-500">
                      Tracking: {shipment.customTrackingNumber || "N/A"}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        shipment.shipmentStatus === "DELIVERED"
                          ? "bg-green-100 text-green-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {formatStatus(shipment.shipmentStatus)}
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
    </div>
  );
}
