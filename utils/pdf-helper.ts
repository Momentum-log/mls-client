/**
 * PDF Download Helper Utilities
 *
 * Utility functions for handling PDF downloads, including blob management,
 * filename handling, and error handling.
 *
 * @module utils/pdf-helper
 */

/**
 * Downloads a file from a blob or base64 data
 *
 * @param data - Blob or base64 string containing file data
 * @param filename - Name for the downloaded file
 * @param mimeType - MIME type of the file (default: "application/pdf")
 * @throws Error if download fails
 *
 * @example
 * const blob = new Blob([pdfData], { type: "application/pdf" });
 * downloadFile(blob, "invoice.pdf");
 */
export const downloadFile = (
  data: Blob | string,
  filename: string,
  mimeType: string = "application/pdf",
): void => {
  try {
    let blob: Blob;

    // Convert base64 string to Blob if necessary
    if (typeof data === "string") {
      const byteCharacters = atob(data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      blob = new Blob([byteArray], { type: mimeType });
    } else {
      blob = data;
    }

    triggerDownload(blob, filename);
  } catch (error) {
    console.error("Error downloading file:", error);
    throw new Error(`Failed to download file: ${filename}`);
  }
};

/**
 * Triggers browser download of a blob
 *
 * Creates a temporary link element and triggers a click to download the blob.
 * Cleans up the object URL after download.
 *
 * @param blob - Blob containing file data
 * @param filename - Name for the downloaded file
 *
 * @example
 * const blob = new Blob([data], { type: "application/pdf" });
 * triggerDownload(blob, "invoice.pdf");
 */
export const triggerDownload = (blob: Blob, filename: string): void => {
  try {
    // Create object URL from blob
    const url = URL.createObjectURL(blob);

    // Create temporary anchor element
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;

    // Append to body (required for some browsers)
    document.body.appendChild(link);

    // Trigger click to start download
    link.click();

    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error triggering download:", error);
    // Fallback: try opening in new window
    try {
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
      // Note: revokeObjectURL should be called after the blob is used
      setTimeout(() => URL.revokeObjectURL(url), 100);
    } catch (fallbackError) {
      console.error("Fallback download also failed:", fallbackError);
      throw new Error("Failed to download file. Please try again.");
    }
  }
};

/**
 * Fetches a PDF blob from a URL and triggers download
 *
 * @param url - URL to PDF file
 * @param filename - Name for the downloaded file
 * @param options - Optional configuration
 * @param options.headers - Custom HTTP headers
 * @param options.timeout - Request timeout in milliseconds (default: 30000)
 * @throws Error if fetch or download fails
 *
 * @example
 * const response = await downloadFromUrl(
 *   "https://example.com/invoice.pdf",
 *   "invoice.pdf",
 *   { headers: { "Authorization": "Bearer token" } }
 * );
 */
export const downloadFromUrl = async (
  url: string,
  filename: string,
  options?: {
    headers?: Record<string, string>;
    timeout?: number;
  },
): Promise<void> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      options?.timeout || 30000,
    );

    const response = await fetch(url, {
      method: "GET",
      headers: options?.headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const blob = await response.blob();
    triggerDownload(blob, filename);
  } catch (error) {
    if (
      error instanceof TypeError &&
      error.message.includes("Failed to fetch")
    ) {
      throw new Error("Network error. Please check your connection.");
    }
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("Download timeout. Please try again.");
    }
    console.error("Error downloading from URL:", error);
    throw new Error(
      `Failed to download file: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
};

/**
 * Validates if a blob is a valid PDF
 *
 * Checks the blob's MIME type and verifies the first few bytes match PDF signature.
 *
 * @param blob - Blob to validate
 * @returns true if blob appears to be valid PDF, false otherwise
 *
 * @example
 * const isValid = isValidPDF(blob);
 */
export const isValidPDF = async (blob: Blob): Promise<boolean> => {
  try {
    // Check MIME type
    if (blob.type !== "application/pdf" && blob.type !== "") {
      console.warn("Invalid MIME type:", blob.type);
    }

    // Check PDF signature (first 4 bytes should be "%PDF")
    const header = await blob.slice(0, 4).text();
    return header.startsWith("%PDF");
  } catch (error) {
    console.error("Error validating PDF:", error);
    return false;
  }
};

/**
 * Formats file size in human-readable format
 *
 * @param bytes - File size in bytes
 * @returns Formatted file size string
 *
 * @example
 * formatFileSize(45678) // "44.6 KB"
 * formatFileSize(1048576) // "1.0 MB"
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 B";

  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const size = (bytes / Math.pow(k, i)).toFixed(1);

  return `${size} ${sizes[i]}`;
};

/**
 * Handles download errors and provides user-friendly messages
 *
 * @param error - Error that occurred during download
 * @returns User-friendly error message
 *
 * @example
 * try {
 *   await downloadFile(blob, "invoice.pdf");
 * } catch (error) {
 *   const message = handleDownloadError(error);
 *   showToast(message, "error");
 * }
 */
export const handleDownloadError = (error: unknown): string => {
  if (error instanceof Error) {
    if (error.message.includes("Network error")) {
      return "Network error. Please check your internet connection and try again.";
    }
    if (error.message.includes("timeout")) {
      return "Download timed out. Please try again.";
    }
    if (error.message.includes("Failed to download")) {
      return "Failed to download the invoice. Please try again or contact support.";
    }
    return error.message;
  }

  console.error("Unknown download error:", error);
  return "An unexpected error occurred. Please try again.";
};

/**
 * Checks if browser supports downloading files
 *
 * @returns true if browser supports downloading, false otherwise
 */
export const isDownloadSupported = (): boolean => {
  try {
    // Check if we can access the document and create elements
    const link = document.createElement("a");
    return typeof link.download !== "undefined";
  } catch {
    return false;
  }
};

/**
 * Creates a retry wrapper for download operations
 *
 * @param downloadFn - Async function that performs the download
 * @param maxRetries - Maximum number of retry attempts (default: 3)
 * @param delayMs - Delay between retries in milliseconds (default: 1000)
 * @returns Promise that resolves when download succeeds or rejects after max retries
 *
 * @example
 * await retryDownload(
 *   () => downloadFromUrl(url, filename),
 *   3,
 *   1000
 * );
 */
export const retryDownload = async (
  downloadFn: () => Promise<void>,
  maxRetries: number = 3,
  delayMs: number = 1000,
): Promise<void> => {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      await downloadFn();
      return;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.warn(`Download attempt ${attempt + 1} failed:`, lastError);

      if (attempt < maxRetries - 1) {
        // Exponential backoff: 1s, 2s, 4s (if default delayMs is 1000)
        const delay = delayMs * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw new Error(
    `Download failed after ${maxRetries} attempts: ${lastError?.message || "Unknown error"}`,
  );
};
