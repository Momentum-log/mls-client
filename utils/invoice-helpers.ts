/**
 * Invoice utility functions for formatting, validation, and common operations
 *
 * Provides helpers for:
 * - Formatting invoice numbers, dates, and amounts
 * - Validating invoice data
 * - Checking invoice status conditions
 * - Building address strings
 * - Calculating time remaining
 *
 * @module utils/invoice-helpers
 */

import { Invoice, InvoiceStatus, InvoiceLineItem } from "@/types/invoice";

/**
 * Format invoice number for display (e.g., MLS-INV-ABC123-2026 → MLS-INV-ABC123-2026)
 *
 * @param invoiceNumber - The invoice number from API
 * @returns Formatted invoice number
 */
export const formatInvoiceNumber = (invoiceNumber: string): string => {
  return invoiceNumber;
};

/**
 * Format date to localized string (Polish locale by default)
 *
 * @param date - ISO-8601 date string or Date object
 * @param includeTime - Whether to include time (default: true)
 * @returns Formatted date string, or "N/A" if date is invalid or missing
 */
export const formatInvoiceDate = (
  date: string | Date | null | undefined,
  includeTime = true,
): string => {
  // Handle null/undefined
  if (!date) {
    return "N/A";
  }

  const dateObj = typeof date === "string" ? new Date(date) : date;

  // Validate date is valid
  if (isNaN(dateObj.getTime())) {
    return "N/A";
  }

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    ...(includeTime && {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };

  return dateObj.toLocaleDateString("pl-PL", options);
};

/**
 * Format amount as Polish currency (PLN)
 *
 * @param amount - Amount in PLN
 * @param showCurrency - Whether to show 'PLN' suffix (default: true)
 * @returns Formatted amount string (e.g., "99,99 PLN")
 */
export const formatAmount = (amount: number, showCurrency = true): string => {
  const formatted = Intl.NumberFormat("pl-PL", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  return showCurrency ? `${formatted} PLN` : formatted;
};

/**
 * Format tax percentage for display
 *
 * @param taxRate - Tax rate as number (23 or 0)
 * @returns Formatted tax percentage (e.g., "23%")
 */
export const formatTaxRate = (taxRate: number): string => {
  return `${taxRate}%`;
};

/**
 * Build full address string from atomized fields
 *
 * @param street - Street name
 * @param buildingNumber - Building number
 * @param city - City name
 * @param postalCode - Postal code
 * @param apartmentNumber - Apartment/suite number (optional)
 * @returns Full address string
 */
export const buildAddressString = (
  street: string,
  buildingNumber?: string,
  city: string,
  postalCode: string,
  apartmentNumber?: string,
): string => {
  const addressParts = [
    [street, buildingNumber].filter(Boolean).join(" "),
    apartmentNumber && `apt ${apartmentNumber}`,
    `${postalCode} ${city}`,
  ].filter(Boolean);

  return addressParts.join(", ");
};

/**
 * Get invoice status display label
 *
 * @param status - Invoice status
 * @returns User-friendly status label
 */
export const getInvoiceStatusLabel = (
  status: InvoiceStatus | string,
): string => {
  switch (status) {
    case InvoiceStatus.PENDING:
      return "Pending Payment";
    case InvoiceStatus.EXPIRED:
      return "Link Expired";
    case InvoiceStatus.PAID:
      return "Paid";
    default:
      return status;
  }
};

/**
 * Check if invoice can be updated (status must be PENDING or EXPIRED)
 *
 * @param status - Invoice status
 * @returns Whether invoice can be updated
 */
export const canUpdateInvoice = (status: InvoiceStatus | string): boolean => {
  return status === InvoiceStatus.PENDING || status === InvoiceStatus.EXPIRED;
};

/**
 * Check if invoice can be paid (status must be PENDING or EXPIRED)
 *
 * @param status - Invoice status
 * @returns Whether invoice can be paid
 */
export const canPayInvoice = (status: InvoiceStatus | string): boolean => {
  return status === InvoiceStatus.PENDING || status === InvoiceStatus.EXPIRED;
};

/**
 * Check if invoice is paid
 *
 * @param status - Invoice status
 * @returns Whether invoice is paid
 */
export const isInvoicePaid = (status: InvoiceStatus | string): boolean => {
  return status === InvoiceStatus.PAID;
};

/**
 * Calculate time remaining until expiration
 *
 * @param expiresAt - ISO-8601 expiration timestamp
 * @returns Object with hours and minutes remaining, or null if expired or invalid
 */
export const getTimeRemaining = (
  expiresAt: string | null | undefined,
): { hours: number; minutes: number } | null => {
  if (!expiresAt) {
    return null;
  }

  const now = new Date();
  const expiration = new Date(expiresAt);

  // Validate date is valid
  if (isNaN(expiration.getTime())) {
    return null;
  }

  const diff = expiration.getTime() - now.getTime();

  if (diff <= 0) {
    return null; // Already expired
  }

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return { hours, minutes };
};

/**
 * Format expiration time for display
 *
 * @param expiresAt - ISO-8601 expiration timestamp
 * @returns Formatted time remaining or "Expired" message
 */
export const formatExpirationTime = (expiresAt: string): string => {
  const timeRemaining = getTimeRemaining(expiresAt);

  if (!timeRemaining) {
    return "Expired";
  }

  const { hours, minutes } = timeRemaining;

  if (hours === 0) {
    return `Expires in ${minutes} minute${minutes !== 1 ? "s" : ""}`;
  }

  return `Expires in ${hours} hour${hours !== 1 ? "s" : ""} ${minutes} minute${minutes !== 1 ? "s" : ""}`;
};

/**
 * Calculate total VAT from line items
 *
 * @param lineItems - Array of invoice line items
 * @returns Total VAT amount
 */
export const calculateTotalVAT = (lineItems: InvoiceLineItem[]): number => {
  return lineItems.reduce((sum, item) => sum + item.vatAmount, 0);
};

/**
 * Calculate total net amount from line items
 *
 * @param lineItems - Array of invoice line items
 * @returns Total net amount
 */
export const calculateTotalNet = (lineItems: InvoiceLineItem[]): number => {
  return lineItems.reduce((sum, item) => sum + item.netValue, 0);
};

/**
 * Calculate total gross amount from line items
 *
 * @param lineItems - Array of invoice line items
 * @returns Total gross amount
 */
export const calculateTotalGross = (lineItems: InvoiceLineItem[]): number => {
  return lineItems.reduce((sum, item) => sum + item.grossValue, 0);
};

/**
 * Validate invoice object for required fields
 *
 * @param invoice - Invoice to validate
 * @returns Object with validation result and error messages
 */
export const validateInvoice = (
  invoice: Partial<Invoice>,
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!invoice.invoiceId) errors.push("Invoice ID is required");
  if (!invoice.invoiceNumber) errors.push("Invoice number is required");
  if (!invoice.status) errors.push("Invoice status is required");
  if (invoice.totalGrossAmount === undefined)
    errors.push("Total amount is required");
  if (!invoice.lineItems || invoice.lineItems.length === 0)
    errors.push("Line items are required");

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Get CSS class name for invoice status badge
 *
 * @param status - Invoice status
 * @returns CSS class name for badge styling
 */
export const getStatusBadgeClass = (status: InvoiceStatus | string): string => {
  switch (status) {
    case InvoiceStatus.PENDING:
      return "badge-warning";
    case InvoiceStatus.EXPIRED:
      return "badge-error";
    case InvoiceStatus.PAID:
      return "badge-success";
    default:
      return "badge-default";
  }
};

/**
 * Shorten invoice number for display in compact layouts
 *
 * @param invoiceNumber - Full invoice number
 * @returns Shortened invoice number
 */
export const shortenInvoiceNumber = (invoiceNumber: string): string => {
  // MLS-INV-ABC123-2026 → INV-ABC123-2026
  const parts = invoiceNumber.split("-");
  if (parts.length >= 2) {
    return parts.slice(1).join("-");
  }
  return invoiceNumber;
};

/**
 * Extract invoice year from invoice number
 *
 * @param invoiceNumber - Invoice number (e.g., MLS-INV-ABC123-2026)
 * @returns Year as number
 */
export const extractYearFromInvoiceNumber = (
  invoiceNumber: string,
): number | null => {
  const match = invoiceNumber.match(/-(\d{4})$/);
  return match ? parseInt(match[1], 10) : null;
};
