"use client";

import React from "react";
import Link from "next/link";
import Button from "@/components/ui/button";
import {
  FiBox,
  FiCheckCircle,
  FiDollarSign,
  FiChevronRight,
} from "react-icons/fi";
import { FaFileCirclePlus, FaArrowRight, FaEuroSign } from "react-icons/fa6";
import { useShipmentStats } from "@/hooks/shipments/use-shipments";

export default function DashboardPage() {
  const {
    activeCount,
    completedCount,
    totalSpentMonth,
    recentShipments,
    currency,
    isLoading,
  } = useShipmentStats();

  // Basic responsive limit implementation
  const displayCount = 5; // Simplified for now, or use a hook if needed
  const recentItems = recentShipments.slice(0, displayCount);

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-10 w-48 bg-gray-200 rounded" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 bg-gray-100 rounded-xl" />
          ))}
        </div>
        <div className="h-64 bg-gray-100 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500">
            Overview of your logistics activities
          </p>
        </div>
        <Link href="/app/shipments/new">
          <Button variant="primary" className="gap-2">
            <FaFileCirclePlus className="w-5 h-5" />
            Create Shipment
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Active Shipments - Brand Blue */}
        <div className="bg-brand-blue p-6 rounded-xl shadow-sm text-white relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-white/10 rounded-lg">
                <FiBox className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-4xl font-bold mb-1">{activeCount}</h3>
            <p className="text-lg font-medium">Active Shipments</p>
            <p className="text-sm text-white/70 mt-1">
              Packages currently in transit
            </p>
          </div>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full group-hover:scale-110 transition-transform"></div>
        </div>

        {/* Completed Deliveries - Brand Yellow */}
        <div className="bg-brand-yellow p-6 rounded-xl shadow-sm text-brand-blue relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-brand-blue/10 rounded-lg">
                <FiCheckCircle className="w-6 h-6 text-brand-blue" />
              </div>
            </div>
            <h3 className="text-4xl font-bold mb-1">{completedCount}</h3>
            <p className="text-lg font-medium">Completed</p>
            <p className="text-sm text-brand-blue/70 mt-1">
              Successfully delivered items
            </p>
          </div>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-brand-blue/5 rounded-full group-hover:scale-110 transition-transform"></div>
        </div>

        {/* Total Spend - Accent Light */}
        <div className="bg-accent-light p-6 rounded-xl shadow-sm text-brand-blue relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-brand-blue/10 rounded-lg">
                <FaEuroSign className="w-6 h-6 text-brand-blue" />
              </div>
            </div>
            <h3 className="text-4xl font-bold mb-1">
              {totalSpentMonth.toFixed(2)}{" "}
              <span className="text-xl">{currency}</span>
            </h3>
            <p className="text-lg font-medium">Total Spend</p>
            <p className="text-sm text-brand-blue/70 mt-1">
              Expenses this month
            </p>
          </div>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-brand-blue/5 rounded-full group-hover:scale-110 transition-transform"></div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="font-semibold text-gray-900">Recent Shipments</h2>
          {recentShipments.length > 0 && (
            <Link href="/app/shipments">
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-brand-blue hover:text-brand-yellow hover:bg-brand-blue/5"
              >
                View All <FaArrowRight />
              </Button>
            </Link>
          )}
        </div>

        {recentItems.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {recentItems.map((shipment) => (
              <Link
                key={shipment.id}
                href={`/app/shipments/${shipment.id}`}
                className="block hover:bg-gray-50 transition-colors"
              >
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-brand-blue/5 rounded-lg text-brand-blue">
                      <FiBox className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">
                        {shipment.displayName || shipment.id}
                      </p>
                      <p className="text-xs text-brand-blue/70 font-mono">
                        {shipment.customTrackingNumber ||
                          shipment.carrierTrackingNumber}
                      </p>
                      <p className="text-[10px] text-gray-400">
                        {new Date(shipment.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        (shipment.shipmentStatus || "").toUpperCase() ===
                        "DELIVERED"
                          ? "bg-green-100 text-green-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {shipment.formattedStatus}
                    </span>
                    <FiChevronRight className="text-gray-400" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          /* Colorful Empty State */
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 bg-brand-blue/5 rounded-full flex items-center justify-center mb-6 animate-pulse">
              <FiBox className="w-10 h-10 text-brand-blue" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              No recent shipments found
            </h3>
            <p className="text-gray-500 max-w-sm mx-auto mb-8">
              You haven&apos;t created any shipments yet. Create your first
              shipment to see real-time updates and tracking details here.
            </p>
            <Link href="/app/shipments/new">
              <Button
                variant="outline"
                className="gap-2 border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white"
              >
                <FaFileCirclePlus className="w-4 h-4" />
                Create New Shipment
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
