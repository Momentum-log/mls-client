/**
 * useInvoiceUpdateFlow
 *
 * Hook to handle the invoice update flow:
 * - Detect invoice ID and shipment ID in URL params
 * - Fetch original shipment data
 * - Pre-populate form with original data
 * - Handle form submission for update
 */

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Invoice } from "@/types/invoice";

export interface InvoiceUpdateFlowState {
  invoiceId: string | null;
  shipmentId: string | null;
  originalShipment: any | null;
  invoice: Invoice | null;
  isLoading: boolean;
  error: string | null;
}

interface UseInvoiceUpdateFlowReturn extends InvoiceUpdateFlowState {
  isUpdateFlow: boolean;
  fetchData: () => Promise<void>;
}

/**
 * Hook to manage invoice update flow
 *
 * @returns Object with update flow state and data
 */
export const useInvoiceUpdateFlow = (): UseInvoiceUpdateFlowReturn => {
  const searchParams = useSearchParams();
  const invoiceId = searchParams.get("invoiceId");
  const shipmentId = searchParams.get("shipmentId");

  const [state, setState] = useState<
    Omit<InvoiceUpdateFlowState, "invoiceId" | "shipmentId">
  >({
    originalShipment: null,
    invoice: null,
    isLoading: false,
    error: null,
  });

  /**
   * Fetch original shipment and invoice data
   */
  const fetchData = useCallback(async () => {
    if (!invoiceId || !shipmentId) return;

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const token = localStorage.getItem("authToken") || "";

      // Fetch original shipment
      const shipmentResponse = await fetch(`/api/shipments/${shipmentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!shipmentResponse.ok) {
        throw new Error("Failed to fetch original shipment");
      }

      const shipmentData = await shipmentResponse.json();

      // Fetch invoice
      const invoiceResponse = await fetch(`/api/invoices/${invoiceId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!invoiceResponse.ok) {
        throw new Error("Failed to fetch invoice");
      }

      const invoiceData = await invoiceResponse.json();

      setState((prev) => ({
        ...prev,
        originalShipment: shipmentData,
        invoice: invoiceData,
        isLoading: false,
      }));
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setState((prev) => ({ ...prev, error: message, isLoading: false }));
    }
  }, [invoiceId, shipmentId]);

  /**
   * Auto-fetch data when component mounts and IDs are available
   */
  useEffect(() => {
    if (invoiceId && shipmentId) {
      fetchData();
    }
  }, [invoiceId, shipmentId, fetchData]);

  return {
    invoiceId,
    shipmentId,
    isUpdateFlow: Boolean(invoiceId && shipmentId),
    fetchData,
    ...state,
  };
};
