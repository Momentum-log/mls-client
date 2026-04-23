/**
 * Main Invoice Hook
 *
 * Comprehensive hook for managing all invoice-related API operations including
 * generation, retrieval, downloading, and payment link management.
 *
 * @module hooks/invoices/useInvoices
 */

import { useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import type {
  Invoice,
  GenerateInvoiceRequest,
  GenerateInvoiceResponse,
  ConfirmInvoiceRequest,
  ConfirmInvoiceResponse,
  ListInvoicesQuery,
  ListInvoicesResponse,
  RegeneratePaymentLinkResponse,
  ErrorResponse,
} from "@/types/invoice";

/**
 * Configuration for API calls
 */
interface ApiConfig {
  maxRetries?: number;
  timeoutMs?: number;
}

/**
 * State and methods returned by useInvoices hook
 */
interface UseInvoicesReturn {
  // State
  loading: boolean;
  error: ErrorResponse | null;

  // Methods
  generateInvoice: (
    request: GenerateInvoiceRequest,
  ) => Promise<GenerateInvoiceResponse | null>;
  getInvoice: (invoiceId: string) => Promise<Invoice | null>;
  listInvoices: (
    query?: ListInvoicesQuery,
  ) => Promise<ListInvoicesResponse | null>;
  confirmInvoice: (
    request: ConfirmInvoiceRequest,
  ) => Promise<ConfirmInvoiceResponse | null>;
  downloadPDF: (invoiceId: string) => Promise<Blob | null>;
  regeneratePaymentLink: (
    invoiceId: string,
  ) => Promise<RegeneratePaymentLinkResponse | null>;
  deleteInvoice: (invoiceId: string) => Promise<boolean>;
  restoreInvoice: (invoiceId: string) => Promise<boolean>;
  clearError: () => void;
}

/**
 * Hook for managing invoice API operations
 *
 * Provides methods to interact with the backend invoice API including:
 * - Generating invoices
 * - Retrieving invoice details and lists
 * - Downloading PDF files
 * - Confirming payment methods
 * - Regenerating payment links
 * - Managing invoice lifecycle (delete, restore)
 *
 * @param config - Optional API configuration
 * @returns Object containing loading state, error state, and API methods
 *
 * @example
 * ```tsx
 * const { generateInvoice, downloadPDF, loading, error } = useInvoices();
 *
 * const handleGenerateInvoice = async () => {
 *   const result = await generateInvoice({
 *     shipmentId: "shipment-123",
 *     deliveryMethod: "download",
 *   });
 *   if (result) {
 *     console.log("Invoice generated:", result.invoiceNumber);
 *   }
 * };
 * ```
 */
export const useInvoices = (config?: ApiConfig): UseInvoicesReturn => {
  const { accessToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorResponse | null>(null);

  const maxRetries = config?.maxRetries ?? 3;
  const timeoutMs = config?.timeoutMs ?? 30000;
  const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:3000";
  const apiUrl = `${baseUrl}/api`;

  /**
   * Exponential backoff retry logic for transient errors
   */
  const executeWithRetry = useCallback(
    async <T>(
      fn: () => Promise<T>,
      operationName: string,
    ): Promise<T | null> => {
      let lastError: Error | null = null;

      for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
          return await fn();
        } catch (err) {
          lastError = err instanceof Error ? err : new Error(String(err));
          console.warn(
            `${operationName} attempt ${attempt + 1} failed:`,
            lastError.message,
          );

          if (attempt < maxRetries - 1) {
            // Exponential backoff: wait 1s, 2s, 4s
            const delay = Math.pow(2, attempt) * 1000;
            await new Promise((resolve) => setTimeout(resolve, delay));
          }
        }
      }

      throw lastError;
    },
    [maxRetries],
  );

  /**
   * Generic API call handler
   */
  const callApi = useCallback(
    async <T>(url: string, options: RequestInit = {}): Promise<T> => {
      if (!accessToken) {
        throw new Error("Not authenticated. Please log in.");
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      try {
        const response = await fetch(url, {
          ...options,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            ...options.headers,
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorData: ErrorResponse = await response.json().catch(() => ({
            status: response.status,
            code: "API_ERROR",
            message: response.statusText,
            timestamp: new Date().toISOString(),
          }));
          throw new Error(JSON.stringify(errorData));
        }

        const data: T = await response.json();
        return data;
      } catch (err) {
        clearTimeout(timeoutId);

        if (err instanceof DOMException && err.name === "AbortError") {
          throw new Error("Request timeout");
        }

        throw err;
      }
    },
    [accessToken, timeoutMs],
  );

  /**
   * Generates an invoice for a shipment
   */
  const generateInvoice = useCallback(
    async (
      request: GenerateInvoiceRequest,
    ): Promise<GenerateInvoiceResponse | null> => {
      setLoading(true);
      setError(null);

      try {
        const result = await executeWithRetry(
          () =>
            callApi<GenerateInvoiceResponse>(`${apiUrl}/invoices/generate`, {
              method: "POST",
              body: JSON.stringify(request),
            }),
          "Generate Invoice",
        );

        if (result) {
          console.log("Invoice generated:", result.invoiceNumber);
        }
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to generate invoice";
        let errorData: ErrorResponse;

        try {
          errorData = JSON.parse(errorMessage);
        } catch {
          errorData = {
            status: 500,
            code: "GENERATION_ERROR",
            message: errorMessage,
            timestamp: new Date().toISOString(),
          };
        }

        setError(errorData);
        console.error("Invoice generation error:", errorData);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [executeWithRetry, callApi, apiUrl],
  );

  /**
   * Retrieves full invoice details
   */
  const getInvoice = useCallback(
    async (invoiceId: string): Promise<Invoice | null> => {
      setLoading(true);
      setError(null);

      try {
        const result = await executeWithRetry(
          () =>
            callApi<Invoice>(`${apiUrl}/invoices/${invoiceId}`, {
              method: "GET",
            }),
          "Get Invoice",
        );

        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch invoice";
        let errorData: ErrorResponse;

        try {
          errorData = JSON.parse(errorMessage);
        } catch {
          errorData = {
            status: 500,
            code: "FETCH_ERROR",
            message: errorMessage,
            timestamp: new Date().toISOString(),
          };
        }

        setError(errorData);
        console.error("Invoice fetch error:", errorData);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [executeWithRetry, callApi, apiUrl],
  );

  /**
   * Fetches paginated list of invoices
   */
  const listInvoices = useCallback(
    async (query?: ListInvoicesQuery): Promise<ListInvoicesResponse | null> => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        if (query?.status) params.append("status", query.status);
        if (query?.limit) params.append("limit", String(query.limit));
        if (query?.offset) params.append("offset", String(query.offset));
        if (query?.sortBy) params.append("sortBy", query.sortBy);
        if (query?.sortOrder) params.append("sortOrder", query.sortOrder);

        const url = `${apiUrl}/invoices${params.toString() ? `?${params.toString()}` : ""}`;

        const result = await executeWithRetry(
          () =>
            callApi<ListInvoicesResponse>(url, {
              method: "GET",
            }),
          "List Invoices",
        );

        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch invoices";
        let errorData: ErrorResponse;

        try {
          errorData = JSON.parse(errorMessage);
        } catch {
          errorData = {
            status: 500,
            code: "LIST_ERROR",
            message: errorMessage,
            timestamp: new Date().toISOString(),
          };
        }

        setError(errorData);
        console.error("Invoice list fetch error:", errorData);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [executeWithRetry, callApi, apiUrl],
  );

  /**
   * Confirms invoice and generates payment link
   */
  const confirmInvoice = useCallback(
    async (
      request: ConfirmInvoiceRequest,
    ): Promise<ConfirmInvoiceResponse | null> => {
      setLoading(true);
      setError(null);

      try {
        const result = await executeWithRetry(
          () =>
            callApi<ConfirmInvoiceResponse>(
              `${apiUrl}/invoices/${request.invoiceId}/confirm`,
              {
                method: "POST",
                body: JSON.stringify({
                  paymentMethod: request.paymentMethod,
                }),
              },
            ),
          "Confirm Invoice",
        );

        if (result) {
          console.log(
            "Invoice confirmed with payment method:",
            request.paymentMethod,
          );
        }
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to confirm invoice";
        let errorData: ErrorResponse;

        try {
          errorData = JSON.parse(errorMessage);
        } catch {
          errorData = {
            status: 500,
            code: "CONFIRM_ERROR",
            message: errorMessage,
            timestamp: new Date().toISOString(),
          };
        }

        setError(errorData);
        console.error("Invoice confirmation error:", errorData);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [executeWithRetry, callApi, apiUrl],
  );

  /**
   * Downloads invoice as PDF blob
   */
  const downloadPDF = useCallback(
    async (invoiceId: string): Promise<Blob | null> => {
      setLoading(true);
      setError(null);

      try {
        if (!accessToken) {
          throw new Error("Not authenticated");
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

        const response = await fetch(`${apiUrl}/invoices/${invoiceId}/pdf`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorData: ErrorResponse = await response.json().catch(() => ({
            status: response.status,
            code: "DOWNLOAD_ERROR",
            message: response.statusText,
            timestamp: new Date().toISOString(),
          }));
          throw new Error(JSON.stringify(errorData));
        }

        const blob = await response.blob();
        return blob;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to download PDF";
        let errorData: ErrorResponse;

        try {
          errorData = JSON.parse(errorMessage);
        } catch {
          errorData = {
            status: 500,
            code: "DOWNLOAD_ERROR",
            message: errorMessage,
            timestamp: new Date().toISOString(),
          };
        }

        setError(errorData);
        console.error("PDF download error:", errorData);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [accessToken, apiUrl, timeoutMs],
  );

  /**
   * Regenerates payment link for expired invoice
   */
  const regeneratePaymentLink = useCallback(
    async (
      invoiceId: string,
    ): Promise<RegeneratePaymentLinkResponse | null> => {
      setLoading(true);
      setError(null);

      try {
        const result = await executeWithRetry(
          () =>
            callApi<RegeneratePaymentLinkResponse>(
              `${apiUrl}/invoices/${invoiceId}/regenerate-link`,
              {
                method: "POST",
              },
            ),
          "Regenerate Payment Link",
        );

        if (result) {
          console.log("Payment link regenerated for invoice:", invoiceId);
        }
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to regenerate payment link";
        let errorData: ErrorResponse;

        try {
          errorData = JSON.parse(errorMessage);
        } catch {
          errorData = {
            status: 500,
            code: "REGENERATE_ERROR",
            message: errorMessage,
            timestamp: new Date().toISOString(),
          };
        }

        setError(errorData);
        console.error("Payment link regeneration error:", errorData);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [executeWithRetry, callApi, apiUrl],
  );

  /**
   * Soft deletes an invoice
   */
  const deleteInvoice = useCallback(
    async (invoiceId: string): Promise<boolean> => {
      setLoading(true);
      setError(null);

      try {
        await executeWithRetry(
          () =>
            callApi<{ success: boolean }>(`${apiUrl}/invoices/${invoiceId}`, {
              method: "DELETE",
            }),
          "Delete Invoice",
        );

        console.log("Invoice deleted:", invoiceId);
        return true;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to delete invoice";
        let errorData: ErrorResponse;

        try {
          errorData = JSON.parse(errorMessage);
        } catch {
          errorData = {
            status: 500,
            code: "DELETE_ERROR",
            message: errorMessage,
            timestamp: new Date().toISOString(),
          };
        }

        setError(errorData);
        console.error("Invoice deletion error:", errorData);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [executeWithRetry, callApi, apiUrl],
  );

  /**
   * Restores a soft-deleted invoice
   */
  const restoreInvoice = useCallback(
    async (invoiceId: string): Promise<boolean> => {
      setLoading(true);
      setError(null);

      try {
        await executeWithRetry(
          () =>
            callApi<{ success: boolean }>(
              `${apiUrl}/invoices/${invoiceId}/restore`,
              {
                method: "POST",
              },
            ),
          "Restore Invoice",
        );

        console.log("Invoice restored:", invoiceId);
        return true;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to restore invoice";
        let errorData: ErrorResponse;

        try {
          errorData = JSON.parse(errorMessage);
        } catch {
          errorData = {
            status: 500,
            code: "RESTORE_ERROR",
            message: errorMessage,
            timestamp: new Date().toISOString(),
          };
        }

        setError(errorData);
        console.error("Invoice restoration error:", errorData);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [executeWithRetry, callApi, apiUrl],
  );

  /**
   * Clears current error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    generateInvoice,
    getInvoice,
    listInvoices,
    confirmInvoice,
    downloadPDF,
    regeneratePaymentLink,
    deleteInvoice,
    restoreInvoice,
    clearError,
  };
};
