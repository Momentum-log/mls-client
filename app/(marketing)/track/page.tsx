"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import Button from "@/components/ui/button";
import apiClient from "@/api";
import { deepTransformData } from "@/utils/data-transform";
import { FiPackage, FiTruck, FiCheckCircle, FiSearch } from "react-icons/fi";

export default function TrackPage() {
  const [trackingId, setTrackingId] = useState("");
  const [trackingData, setTrackingData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId) return;

    setLoading(true);
    setError(null);
    setTrackingData(null);

    try {
      const response = await apiClient.get(`/shipments/${trackingId}/track`);
      // Transform the entire response for branding
      const cleanedData = deepTransformData(response.data);
      setTrackingData(cleanedData);
    } catch (err: any) {
      setError(err.response?.data?.error || "Tracking information not found.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-2">
          Track Your Shipment
        </h1>
        <p className="text-center text-gray-500 mb-8">
          Enter your tracking number below
        </p>

        <form onSubmit={handleTrack} className="flex gap-2 mb-8">
          <Input
            placeholder="MLS-xxxxxxxx"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            className="text-lg"
          />
          <Button type="submit" disabled={loading || !trackingId}>
            {loading ? "..." : <FiSearch className="w-5 h-5" />}
          </Button>
        </form>

        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-lg text-center">
            {error}
          </div>
        )}

        {trackingData && (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-100">
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="text-lg font-bold text-brand-blue">
                  {trackingData.status || "In Transit"}
                </p>
              </div>
              <FiTruck className="w-8 h-8 text-brand-blue" />
            </div>

            {/* Simplified Status Timeline */}
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="mt-1">
                  <FiCheckCircle className="text-green-500" />
                </div>
                <div>
                  <p className="font-semibold">Shipment Created</p>
                  <p className="text-sm text-gray-500">
                    {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>
              {/* Add dynamic events if API returns them */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
