/**
 * Custom hook for polling PDF generation status
 *
 * Handles asynchronous PDF generation with smart polling logic.
 * If PDF is ready immediately (READY status), returns URL without polling.
 * If still generating (PENDING status), polls GET /api/invoices/{invoiceId}/pdf
 * until ready or max retries exceeded.
 *
 * @module hooks/invoices/usePdfStatus
 */

"use client";

import { useCallback, useEffect, useState } from "react";
import {
  PdfGenerationStatus,
  PdfStatusResponse,
  ErrorResponse,
  UsePdfStatusReturn,
} from "@/types/invoice";

/**
 * Hook for polling PDF generation status
 *
 * @param invoiceId - The invoice ID to poll for
 * @param initialStatus - Initial PDF generation status (READY or PENDING)
 * @param pdfDownloadUrl - Initial PDF download URL (if status is READY)
 * @param maxRetries - Maximum number of retry attempts (default 10)
 * @returns Status and retry function
 */
export function usePdfStatus(
  invoiceId: string,
  initialStatus: PdfGenerationStatus | string = PdfGenerationStatus.PENDING,
  pdfDownloadUrl?: string | null,
  maxRetries: number = 10,
): UsePdfStatusReturn {
  const [pdfUrl, setPdfUrl] = useState<string | null>(pdfDownloadUrl || null);
  const [isReady, setIsReady] = useState(
    initialStatus === PdfGenerationStatus.READY,
  );
  const [isLoading, setIsLoading] = useState(
    initialStatus === PdfGenerationStatus.PENDING && !pdfDownloadUrl,
  );
  const [error, setError] = useState<ErrorResponse | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  /**
   * Poll PDF status from the server
   */
  const pollPdfStatus = useCallback(async () => {
    if (isReady || retryCount >= maxRetries) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/invoices/${invoiceId}/pdf`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAccessToken()}`,
        },
      });

      if (response.status === 200) {
        // PDF is ready
        const data = (await response.json()) as PdfStatusResponse;
        setPdfUrl(data.downloadUrl || null);
        setIsReady(true);
        setIsLoading(false);
      } else if (response.status === 202) {
        // PDF still generating, retry
        const data = (await response.json()) as PdfStatusResponse;
        const retryAfter = data.retryAfter || 2 + retryCount; // Exponential backoff

        setRetryCount((prev) => prev + 1);

        // Schedule next retry with backoff
        setTimeout(
          () => {
            pollPdfStatus();
          },
          Math.min(retryAfter * 1000, 10000),
        ); // Cap at 10 seconds
      } else if (response.status === 401 || response.status === 403) {
        // Auth error
        setError({
          status: response.status,
          code: "AUTH_ERROR",
          message:
            response.status === 401 ? "Not authenticated" : "Permission denied",
          timestamp: new Date().toISOString(),
        });
        setIsLoading(false);
      } else if (response.status === 404) {
        // Invoice not found
        setError({
          status: 404,
          code: "INVOICE_NOT_FOUND",
          message: "Invoice not found",
          timestamp: new Date().toISOString(),
        });
        setIsLoading(false);
      } else {
        // Other error
        const errorData = await response.json();
        setError(errorData as ErrorResponse);
        setIsLoading(false);
      }
    } catch (err) {
      // Network error
      const errorMessage = err instanceof Error ? err.message : "Network error";
      setError({
        status: 0,
        code: "NETWORK_ERROR",
        message: errorMessage,
        timestamp: new Date().toISOString(),
      });
      setIsLoading(false);
    }
  }, [invoiceId, isReady, maxRetries, retryCount]);

  /**
   * Start polling when status is PENDING
   */
  useEffect(() => {
    if (initialStatus === PdfGenerationStatus.PENDING && !isReady) {
      const timer = setTimeout(() => {
        pollPdfStatus();
      }, 1000); // Wait 1 second before first poll

      return () => clearTimeout(timer);
    }
  }, [initialStatus, isReady, pollPdfStatus]);

  /**
   * Manual retry function
   */
  const retry = useCallback(async () => {
    setRetryCount(0);
    setError(null);
    setIsReady(false);
    await pollPdfStatus();
  }, [pollPdfStatus]);

  return {
    pdfUrl,
    isReady,
    isLoading: isLoading && !isReady,
    error,
    retry,
  };
}

/**
 * Get access token from auth context or local storage
 * @internal
 */
function getAccessToken(): string {
  // Try to get from localStorage (fallback for server-side auth)
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("authToken");
    if (token) return token;
  }

  // Fallback - in real app, would use auth context
  return "";
}
