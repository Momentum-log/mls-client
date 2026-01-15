import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getShippingEstimate,
  getShipmentHistory,
  getShipmentStats,
  createShipment,
  trackShipment,
  getShipment,
} from "@/api/shipments";
import {
  ShippingEstimatePayload,
  ShippingEstimateResponse,
  Shipment,
  ShipmentStats,
} from "@/types/shipping";
import { useMemo } from "react";
import { formatStatus, getShipmentDisplayName } from "@/utils/shipment-helper";

/**
 * Hook to get shipping estimates (rates).

 */
export const useGetShippingEstimate = () => {
  return useMutation<ShippingEstimateResponse, Error, ShippingEstimatePayload>({
    mutationFn: getShippingEstimate,
  });
};

/**
 * Hook to create a new shipment.
 */
export const useCreateShipment = () => {
  return useMutation<any, Error, any>({
    mutationFn: createShipment,
  });
};

/**
 * Hook to track a shipment.
 */
export const useTrackShipment = (trackingNumber: string) => {
  return useQuery({
    queryKey: ["shipment-track", trackingNumber],
    queryFn: () => trackShipment(trackingNumber),
    enabled: !!trackingNumber.trim(),
  });
};

/**
 * Hook to fetch all user shipments.
 */
export const useGetShipmentHistory = () => {
  return useQuery<Shipment[], Error>({
    queryKey: ["shipment-history"],
    queryFn: getShipmentHistory,
  });
};

/**
 * Hook to fetch a specific shipment.
 */
export const useGetShipment = (trackingNumber: string) => {
  return useQuery({
    queryKey: ["shipment", trackingNumber],
    queryFn: () => getShipment(trackingNumber),
    enabled: !!trackingNumber.trim(),
  });
};

/**
 * Hook for Dashboard Statistics.
 * Calculates detailed metrics from shipment history as the backend stats endpoint is limited.
 */
export const useShipmentStats = () => {
  const { data: shipments, isLoading, error } = useGetShipmentHistory();
  const { data: backendStats } = useQuery<ShipmentStats>({
    queryKey: ["shipment-stats-basic"],
    queryFn: getShipmentStats,
  });

  const stats = useMemo(() => {
    if (!shipments) {
      return {
        activeCount: 0,
        completedCount: 0,
        totalSpentLifetime: backendStats?.totalSpent || 0,
        totalSpentMonth: 0,
        recentShipments: [],
        currency: backendStats?.currency || "PLN",
      };
    }

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    let activeCount = 0;
    let completedCount = 0;
    let totalSpentLifetime = 0;
    let totalSpentMonth = 0;

    // Filter and sort for recent shipments
    const sortedShipments = [...shipments].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    shipments.forEach((shipment) => {
      // Logic for status counts
      if (shipment.shipmentStatus === "DELIVERED") {
        completedCount++;
      } else if (shipment.shipmentStatus !== "CANCELLED") {
        activeCount++;
      }

      // Logic for spend (only count successful/paid) - case insensitive
      const pStatus = (shipment.paymentStatus || "").toLowerCase();
      if (pStatus === "paid" || pStatus === "succeeded") {
        totalSpentLifetime += shipment.actualPrice || 0;

        const shipmentDate = new Date(shipment.createdAt);
        if (
          shipmentDate.getMonth() === currentMonth &&
          shipmentDate.getFullYear() === currentYear
        ) {
          totalSpentMonth += shipment.actualPrice || 0;
        }
      }
    });

    const enrichedRecentShipments = sortedShipments.map((s) => ({
      ...s,
      displayName: getShipmentDisplayName(s),
      formattedStatus: formatStatus(s.shipmentStatus),
    }));

    return {
      activeCount,
      completedCount,
      totalSpentLifetime,
      totalSpentMonth,
      recentShipments: enrichedRecentShipments,
      currency: shipments[0]?.currency || backendStats?.currency || "PLN",
    };
  }, [shipments, backendStats]);

  return {
    ...stats,
    isLoading,
    error,
  };
};
