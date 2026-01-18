"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FiPackage,
  FiChevronRight,
  FiCopy,
  FiEye,
  FiLayers,
} from "react-icons/fi";
import Button from "@/components/ui/button";
import { useGetShipmentHistory } from "@/hooks/shipments/use-shipments";
import { formatStatus, getShipmentDisplayName } from "@/utils/shipment-helper";
import CopyButton from "@/components/ui/copy-button";
import { useDuplicateShipment } from "@/hooks/shipments/use-duplicate-shipment";
import ActionMenu from "@/components/ui/action-menu";
import { useToast } from "@/hooks/use-toast";

export default function ShipmentHistoryPage() {
  const { data: shipments, isLoading, error } = useGetShipmentHistory();
  const { duplicateShipment } = useDuplicateShipment();
  const router = useRouter();
  const { addToast } = useToast();

  const handleCopyTracking = (trackingNumber: string) => {
    navigator.clipboard.writeText(trackingNumber);
    addToast({
      message: "Tracking number copied to clipboard",
      type: "success",
    });
  };

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
                href={`/app/shipments/${shipment.customTrackingNumber}`}
                className="block hover:bg-gray-50 transition-colors"
              >
                <div className="p-6 flex items-center gap-6 relative group">
                  {/* Column 1: Package Info (Main Content) */}
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="p-3 bg-brand-blue/10 rounded-lg text-brand-blue shrink-0">
                      <FiPackage className="w-6 h-6" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-gray-900 truncate">
                        {getShipmentDisplayName(shipment)}
                      </p>
                      <p className="text-xs text-gray-500 font-medium capitalize truncate">
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

                  {/* Column 2: Tracking (Fixed Width) */}
                  <div className="hidden lg:block w-64 shrink-0 border-l border-gray-50 pl-6">
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider mb-1">
                      {shipment.carrier.name} Shipment
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-gray-900 truncate">
                        {shipment.shipmentStatus === "FAILED" ||
                        shipment.shipmentStatus === "CANCELLED"
                          ? "Tracking Unavailable"
                          : shipment.customTrackingNumber || "N/A"}
                      </p>
                      {shipment.customTrackingNumber &&
                        shipment.shipmentStatus !== "FAILED" &&
                        shipment.shipmentStatus !== "CANCELLED" && (
                          <div
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                          >
                            <CopyButton
                              text={shipment.customTrackingNumber}
                              tooltipText="Copy Tracking #"
                            />
                          </div>
                        )}
                    </div>
                  </div>

                  {/* Column 3: Status & Action (Fixed Width) */}
                  <div className="flex items-center gap-4 w-40 shrink-0 justify-end">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-black tracking-tight ${
                        shipment.shipmentStatus === "DELIVERED"
                          ? "bg-green-100 text-green-700 font-bold"
                          : shipment.shipmentStatus === "FAILED" ||
                            shipment.shipmentStatus === "CANCELLED"
                          ? "bg-red-100 text-red-700 font-bold"
                          : "bg-blue-100 text-blue-700 font-bold"
                      }`}
                    >
                      {formatStatus(shipment.shipmentStatus)}
                    </span>
                    <FiChevronRight className="text-gray-400 shrink-0" />
                  </div>

                  {/* Action Menu (Absolute Positioned) */}
                  <div className="absolute right-4 bottom-4 md:static md:w-auto">
                    <ActionMenu
                      actions={[
                        {
                          label: "View Shipment",
                          icon: FiEye,
                          onClick: () =>
                            router.push(
                              `/app/shipments/${shipment.customTrackingNumber}`
                            ),
                        },
                        {
                          label: "Copy Tracking Number",
                          icon: FiCopy,
                          onClick: () =>
                            handleCopyTracking(
                              shipment.customTrackingNumber || ""
                            ),
                        },
                        {
                          label: "Duplicate Shipment",
                          icon: FiLayers,
                          onClick: () => duplicateShipment(shipment),
                        },
                      ]}
                    />
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
