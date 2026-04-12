/**
 * Invoice Helper Utilities
 *
 * Utility functions for invoice operations including formatting, status handling,
 * and data transformation.
 *
 * @module utils/invoice-helper
 */

import {
  Invoice,
  InvoiceLineItem,
  InvoiceStatus,
  TaxBreakdown,
} from "@/types/invoice";

/**
 * Formats an invoice number for display
 *
 * @param invoiceNumber - Raw invoice number from backend (e.g., "MLS-INV-A1B2C3-2026")
 * @returns Formatted invoice number string
 *
 * @example
 * formatInvoiceNumber("MLS-INV-A1B2C3-2026") // "MLS-INV-A1B2C3-2026"
 */
export const formatInvoiceNumber = (invoiceNumber: string): string => {
  if (!invoiceNumber) return "N/A";
  return invoiceNumber.toUpperCase();
};

/**
 * Formats an amount as Polish Złoty currency
 *
 * @param amount - Amount in PLN
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted string with PLN symbol (e.g., "61,50 PLN")
 *
 * @example
 * formatInvoiceAmount(61.50) // "61,50 PLN"
 * formatInvoiceAmount(1000.123, 2) // "1 000,12 PLN"
 */
export const formatInvoiceAmount = (
  amount: number,
  decimals: number = 2,
): string => {
  if (typeof amount !== "number" || isNaN(amount)) {
    return "0,00 PLN";
  }

  const formatter = new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return formatter.format(amount);
};

/**
 * Gets the CSS variable color for an invoice status
 *
 * @param status - Invoice status
 * @returns CSS variable name for use in styles
 *
 * @example
 * getInvoiceStatusColor(InvoiceStatus.PENDING) // "var(--color-warning)"
 * getInvoiceStatusColor(InvoiceStatus.PAID) // "var(--color-success)"
 */
export const getInvoiceStatusColor = (
  status: string | InvoiceStatus,
): string => {
  switch (status) {
    case InvoiceStatus.PENDING:
      return "var(--color-warning)";
    case InvoiceStatus.EXPIRED:
      return "var(--color-muted)";
    case InvoiceStatus.PAID:
      return "var(--color-success)";
    default:
      return "var(--color-muted)";
  }
};

/**
 * Gets the display label for an invoice status
 *
 * @param status - Invoice status
 * @returns User-friendly status label
 *
 * @example
 * getInvoiceStatusLabel(InvoiceStatus.PENDING) // "Pending Payment"
 * getInvoiceStatusLabel(InvoiceStatus.PAID) // "Paid"
 */
export const getInvoiceStatusLabel = (
  status: string | InvoiceStatus,
): string => {
  switch (status) {
    case InvoiceStatus.PENDING:
      return "Pending Payment";
    case InvoiceStatus.EXPIRED:
      return "Payment Link Expired";
    case InvoiceStatus.PAID:
      return "Paid";
    default:
      return "Unknown";
  }
};

/**
 * Calculates tax breakdown summary from line items
 *
 * @param lineItems - Array of invoice line items
 * @returns Array of tax breakdowns grouped by tax rate (23% and 0%)
 *
 * @example
 * const breakdown = calculateTaxBreakdown(invoice.lineItems);
 * // [
 * //   { taxRate: 23, netAmount: 100, vatAmount: 23, grossAmount: 123, lineItemCount: 1 },
 * //   { taxRate: 0, netAmount: 50, vatAmount: 0, grossAmount: 50, lineItemCount: 1 }
 * // ]
 */
export const calculateTaxBreakdown = (
  lineItems: InvoiceLineItem[],
): TaxBreakdown[] => {
  if (!Array.isArray(lineItems) || lineItems.length === 0) {
    return [];
  }

  const taxMap = new Map<number, TaxBreakdown>();

  lineItems.forEach((item) => {
    const taxRate = item.taxRate || 0;
    const existing = taxMap.get(taxRate);

    if (existing) {
      existing.netAmount += item.netValue || 0;
      existing.vatAmount += item.vatAmount || 0;
      existing.grossAmount += item.grossValue || 0;
      existing.lineItemCount += 1;
    } else {
      taxMap.set(taxRate, {
        taxRate,
        netAmount: item.netValue || 0,
        vatAmount: item.vatAmount || 0,
        grossAmount: item.grossValue || 0,
        lineItemCount: 1,
      });
    }
  });

  // Return sorted by tax rate (higher first)
  return Array.from(taxMap.values()).sort((a, b) => b.taxRate - a.taxRate);
};

/**
 * Checks if a payment link has expired
 *
 * @param expiresAt - ISO-8601 expiration timestamp
 * @returns true if link is expired, false otherwise
 *
 * @example
 * isPaymentLinkExpired("2026-04-06T10:00:00Z") // true or false depending on current time
 */
export const isPaymentLinkExpired = (
  expiresAt: string | undefined,
): boolean => {
  if (!expiresAt) return true;

  try {
    const expirationTime = new Date(expiresAt).getTime();
    const currentTime = new Date().getTime();
    return currentTime > expirationTime;
  } catch {
    return true;
  }
};

/**
 * Checks if a payment link is expiring soon (within 24 hours)
 *
 * @param expiresAt - ISO-8601 expiration timestamp
 * @param hoursThreshold - Number of hours to consider as "soon" (default: 24)
 * @returns true if link expires within threshold, false otherwise
 *
 * @example
 * isPaymentLinkExpiringsoon("2026-04-07T10:00:00Z", 24) // true or false
 */
export const isPaymentLinkExpiringSoon = (
  expiresAt: string | undefined,
  hoursThreshold: number = 24,
): boolean => {
  if (!expiresAt) return false;

  try {
    const expirationTime = new Date(expiresAt).getTime();
    const currentTime = new Date().getTime();
    const timeDiff = expirationTime - currentTime;
    const hoursUntilExpiration = timeDiff / (1000 * 60 * 60);

    return hoursUntilExpiration > 0 && hoursUntilExpiration <= hoursThreshold;
  } catch {
    return false;
  }
};

/**
 * Calculates hours remaining until payment link expires
 *
 * @param expiresAt - ISO-8601 expiration timestamp
 * @returns Number of hours remaining, or 0 if already expired
 *
 * @example
 * getHoursUntilExpiration("2026-04-07T10:00:00Z") // 24
 */
export const getHoursUntilExpiration = (
  expiresAt: string | undefined,
): number => {
  if (!expiresAt) return 0;

  try {
    const expirationTime = new Date(expiresAt).getTime();
    const currentTime = new Date().getTime();
    const timeDiff = expirationTime - currentTime;
    const hoursUntilExpiration = Math.ceil(timeDiff / (1000 * 60 * 60));

    return Math.max(0, hoursUntilExpiration);
  } catch {
    return 0;
  }
};

/**
 * Formats a date for display in Polish locale
 *
 * @param dateString - ISO-8601 date string or Date object
 * @param format - "date" for date only, "datetime" for date and time (default: "date")
 * @returns Formatted date string
 *
 * @example
 * formatDate("2026-04-06T10:30:00Z", "date") // "6 kwietnia 2026"
 * formatDate("2026-04-06T10:30:00Z", "datetime") // "6 kwietnia 2026, 10:30"
 */
export const formatDate = (
  dateString: string | Date,
  format: "date" | "datetime" = "date",
): string => {
  try {
    const date = new Date(dateString);

    if (format === "datetime") {
      return new Intl.DateTimeFormat("pl-PL", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    }

    return new Intl.DateTimeFormat("pl-PL", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  } catch {
    return "Invalid date";
  }
};

/**
 * Gets full address as single string from atomized address fields
 *
 * @param street - Street name
 * @param buildingNumber - Building number
 * @param apartmentNumber - Apartment/suite number (optional)
 * @param postalCode - Postal code
 * @param city - City name
 * @returns Formatted full address
 *
 * @example
 * getFullAddress("ul. Marszałkowska", "10", "5", "00-001", "Warszawa")
 * // "ul. Marszałkowska 10/5, 00-001 Warszawa"
 */
export const getFullAddress = (
  street: string,
  buildingNumber: string,
  apartmentNumber: string | undefined,
  postalCode: string,
  city: string,
): string => {
  const streetPart = `${street} ${buildingNumber}${apartmentNumber ? `/${apartmentNumber}` : ""}`;
  return `${streetPart}, ${postalCode} ${city}`;
};

/**
 * Generates filename for invoice PDF
 *
 * @param invoiceNumber - Invoice number (e.g., "MLS-INV-A1B2C3-2026")
 * @returns Filename for the PDF
 *
 * @example
 * generateInvoiceFilename("MLS-INV-A1B2C3-2026") // "Invoice-MLS-INV-A1B2C3-2026.pdf"
 */
export const generateInvoiceFilename = (invoiceNumber: string): string => {
  const sanitized = invoiceNumber.replace(/[^a-zA-Z0-9-]/g, "-");
  return `Invoice-${sanitized}.pdf`;
};

/**
 * Extracts invoice number from filename
 *
 * @param filename - Filename containing invoice number
 * @returns Invoice number or null if not found
 *
 * @example
 * extractInvoiceNumber("Invoice-MLS-INV-A1B2C3-2026.pdf") // "MLS-INV-A1B2C3-2026"
 */
export const extractInvoiceNumber = (filename: string): string | null => {
  const match = filename.match(/Invoice-(.+?)\.pdf$/);
  return match ? match[1] : null;
};
