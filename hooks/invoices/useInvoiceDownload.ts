/**
 * PDF Download Hook
 *
 * Specialized hook for handling PDF download operations with progress tracking,
 * error handling, and retry logic.
 *
 * @module hooks/invoices/useInvoiceDownload
 */

import { useState, useCallback } from "react";
import {
  downloadFile,
  retryDownload,
  handleDownloadError,
} from "@/utils/pdf-helper";
import { generateInvoiceFilename } from "@/utils/invoice-helper";

/**
 * State and methods returned by useInvoiceDownload hook
 */
interface UseInvoiceDownloadReturn {
  // State
  downloading: boolean;
  downloadProgress: number; // 0-100
  downloadError: string | null;

  // Methods
  downloadInvoicePDF: (blob: Blob, invoiceNumber: string) => Promise<void>;
  downloadFromURL: (url: string, invoiceNumber: string) => Promise<void>;
  retryDownload: (blob: Blob, invoiceNumber: string) => Promise<void>;
  clearError: () => void;
}

/**
 * Hook for managing invoice PDF downloads
 *
 * Provides methods to:
 * - Download PDF blobs to user's computer
 * - Download from URLs with proper headers
 * - Handle download errors with retry logic
 * - Track download progress
 *
 * @returns Object containing download state and methods
 *
 * @example
 * ```tsx
 * const { downloadInvoicePDF, downloading, downloadError } = useInvoiceDownload();
 *
 * const handleDownload = async () => {
 *   const blob = await fetchPDF();
 *   await downloadInvoicePDF(blob, "MLS-INV-A1B2C3-2026");
 * };
 * ```
 */
export const useInvoiceDownload = (): UseInvoiceDownloadReturn => {
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  /**
   * Downloads invoice PDF blob to user's computer
   */
  const downloadInvoicePDF = useCallback(
    async (blob: Blob, invoiceNumber: string): Promise<void> => {
      setDownloading(true);
      setDownloadProgress(0);
      setDownloadError(null);

      try {
        setDownloadProgress(25);

        const filename = generateInvoiceFilename(invoiceNumber);

        setDownloadProgress(50);

        downloadFile(blob, filename, "application/pdf");

        setDownloadProgress(100);
        console.log("Invoice downloaded successfully:", filename);

        // Reset progress after brief delay
        setTimeout(() => {
          setDownloadProgress(0);
        }, 1000);
      } catch (error) {
        const errorMessage = handleDownloadError(error);
        setDownloadError(errorMessage);
        console.error("Download error:", errorMessage);
      } finally {
        setDownloading(false);
      }
    },
    [],
  );

  /**
   * Downloads invoice PDF from a URL
   */
  const downloadFromURL = useCallback(
    async (url: string, invoiceNumber: string): Promise<void> => {
      setDownloading(true);
      setDownloadProgress(0);
      setDownloadError(null);

      try {
        setDownloadProgress(25);

        const controller = new AbortController();
        const response = await fetch(url, {
          signal: controller.signal,
          headers: {
            Accept: "application/pdf",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        setDownloadProgress(50);

        const blob = await response.blob();

        setDownloadProgress(75);

        const filename = generateInvoiceFilename(invoiceNumber);
        downloadFile(blob, filename, "application/pdf");

        setDownloadProgress(100);
        console.log("Invoice downloaded successfully from URL:", filename);

        // Reset progress after brief delay
        setTimeout(() => {
          setDownloadProgress(0);
        }, 1000);
      } catch (error) {
        const errorMessage = handleDownloadError(error);
        setDownloadError(errorMessage);
        console.error("Download from URL error:", errorMessage);
      } finally {
        setDownloading(false);
      }
    },
    [],
  );

  /**
   * Retries download with exponential backoff
   */
  const retryDownloadWithBackoff = useCallback(
    async (blob: Blob, invoiceNumber: string): Promise<void> => {
      setDownloading(true);
      setDownloadProgress(0);
      setDownloadError(null);

      try {
        const filename = generateInvoiceFilename(invoiceNumber);

        await retryDownload(
          () => {
            setDownloadProgress(75);
            downloadFile(blob, filename, "application/pdf");
            return Promise.resolve();
          },
          3,
          1000,
        );

        setDownloadProgress(100);
        console.log("Invoice downloaded successfully after retry:", filename);

        // Reset progress after brief delay
        setTimeout(() => {
          setDownloadProgress(0);
        }, 1000);
      } catch (error) {
        const errorMessage = handleDownloadError(error);
        setDownloadError(errorMessage);
        console.error("Download retry error:", errorMessage);
      } finally {
        setDownloading(false);
      }
    },
    [],
  );

  /**
   * Clears error state
   */
  const clearError = useCallback(() => {
    setDownloadError(null);
  }, []);

  return {
    downloading,
    downloadProgress,
    downloadError,
    downloadInvoicePDF,
    downloadFromURL,
    retryDownload: retryDownloadWithBackoff,
    clearError,
  };
};
