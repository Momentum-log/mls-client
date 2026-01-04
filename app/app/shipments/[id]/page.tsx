"use client";

import React, { useEffect, useState } from "react";
// import { useParams } from "next/navigation"; // params prop in Next 13+ app dir
import apiClient from "@/api";
import { FiBox, FiTruck, FiMapPin } from "react-icons/fi";
import { useParams } from "next/navigation";

export default function ShipmentDetailsPage() {
  const params = useParams();
  const id = params?.id as string;

  const [tracking, setTracking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      setLoading(true);
      // We use the tracking endpoint to show details, since we don't have a GET /shipments/{id} details endpoint
      // (OpenAPI only shows /shipments/{trackingNumber}/track)
      // Assuming ID is Tracking Number for now.
      apiClient
        .get(`/shipments/${id}/track`)
        .then((res) => setTracking(res.data))
        .catch((err) => setError("Could not load tracking info."))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading)
    return (
      <div className="p-8 text-center bg-gray-50 min-h-screen pt-20">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="p-8 text-center text-red-500 bg-gray-50 min-h-screen pt-20">
        {error}
      </div>
    );

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Shipment {id}</h1>
        <p className="text-gray-500">Real-time status updates</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Status Card */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-4 bg-brand-blue rounded-full text-white">
                <FiTruck className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Current Status</p>
                <h2 className="text-2xl font-bold text-brand-blue">
                  {tracking?.status || "Unknown"}
                </h2>
              </div>
            </div>

            {/* Timeline Mockup if no detailed events in API */}
            <div className="border-l-2 border-gray-200 ml-7 pl-8 space-y-8 py-2">
              <div className="relative">
                <div className="absolute -left-[37px] bg-green-500 w-4 h-4 rounded-full border-2 border-white"></div>
                <p className="font-semibold text-gray-900">Shipment Created</p>
                <p className="text-xs text-gray-500">Details received</p>
              </div>
              {tracking?.status === "Delivered" && (
                <div className="relative">
                  <div className="absolute -left-[37px] bg-brand-blue w-4 h-4 rounded-full border-2 border-white"></div>
                  <p className="font-semibold text-gray-900">Delivered</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Details Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FiBox /> Package Details
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Tracking Code</span>
                <span className="font-mono">{id}</span>
              </div>
              {/* Mocked extra details since tracking API might not return dims/weight */}
              <div className="flex justify-between">
                <span className="text-gray-500">Service</span>
                <span>Standard Ground</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
