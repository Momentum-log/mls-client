/**
 * Invoice data population utilities for auto-filling invoice fields from user and shipment context.
 *
 * Extracts user profile data and shipment information to populate invoice displays
 * without requiring manual data entry.
 *
 * @module utils/invoice-data-population
 */

import { User } from "@/types/auth";
import { Address, Package } from "@/store/shipment-store";
import { Invoice, InvoiceLineItem } from "@/types/invoice";

/**
 * Represents enriched invoice data with user and shipment context.
 */
export interface EnrichedInvoiceData extends Partial<Invoice> {
  /** User's full name for "To" recipient field */
  recipientName?: string;
  /** User's address for "To" field */
  recipientAddress?: Address | null;
  /** Number of items in shipment */
  itemQuantity?: number;
  /** Service description generated from shipment context */
  serviceDescription?: string;
}

/**
 * Populates invoice data with user profile information.
 *
 * Extracts the recipient name and address from the user object
 * to fill in the "To" section of the invoice.
 *
 * @param invoice - The base invoice object
 * @param user - The authenticated user object
 * @returns Enriched invoice data with user information populated
 *
 * @example
 * ```tsx
 * const enrichedInvoice = populateInvoiceWithUserData(invoice, user);
 * // Now enrichedInvoice contains user.name as recipientName
 * // and user.address as recipientAddress
 * ```
 */
export const populateInvoiceWithUserData = (
  invoice: Invoice | null | undefined,
  user: User | null | undefined,
): EnrichedInvoiceData => {
  if (!invoice) return {};

  const enriched: EnrichedInvoiceData = { ...invoice };

  if (user) {
    enriched.recipientName = user.name || "";
    enriched.recipientAddress = (user.address as Address | null) || null;
  }

  return enriched;
};

/**
 * Populates invoice data with shipment information.
 *
 * Extracts shipment details (items, quantity) and generates
 * descriptive text for the invoice service section.
 *
 * @param invoice - The base invoice object
 * @param packages - Array of package objects from shipment
 * @param userName - User's name for generating service description
 * @returns Enriched invoice data with shipment information populated
 *
 * @example
 * ```tsx
 * const enrichedInvoice = populateInvoiceWithShipmentData(
 *   invoice,
 *   [{ description: "Electronics", weight: 2.5 }],
 *   "John Doe"
 * );
 * ```
 */
export const populateInvoiceWithShipmentData = (
  invoice: Invoice | null | undefined,
  packages: Package[] | null | undefined,
  userName: string = "",
): EnrichedInvoiceData => {
  if (!invoice) return {};

  const enriched: EnrichedInvoiceData = { ...invoice };

  if (packages && packages.length > 0) {
    enriched.itemQuantity = packages.length;

    // Generate service description from packages
    const descriptions = packages
      .map((p) => p.description)
      .filter(Boolean)
      .slice(0, 2); // Take first 2 descriptions

    if (descriptions.length > 0) {
      enriched.serviceDescription =
        descriptions.length === 1
          ? `Logistics: ${descriptions[0]} for ${userName || "Delivery"}`
          : `Logistics: ${descriptions.join(", ")} for ${userName || "Delivery"}`;
    } else {
      enriched.serviceDescription = `Logistics for ${userName || "Delivery"}`;
    }
  } else {
    enriched.serviceDescription = "Logistics";
  }

  return enriched;
};

/**
 * Combines user and shipment data to create a fully enriched invoice.
 *
 * This is the main function to call to get a complete invoice with all
 * user and shipment context populated.
 *
 * @param invoice - The base invoice object
 * @param user - The authenticated user object
 * @param packages - Array of packages from shipment
 * @returns Fully enriched invoice data with user and shipment information
 *
 * @example
 * ```tsx
 * const fullInvoice = enrichInvoiceWithContext(invoice, user, packages);
 * // Now fullInvoice has all user data, shipment context, and descriptions populated
 * ```
 */
export const enrichInvoiceWithContext = (
  invoice: Invoice | null | undefined,
  user: User | null | undefined,
  packages: Package[] | null | undefined,
): EnrichedInvoiceData => {
  let enriched = populateInvoiceWithUserData(invoice, user);
  enriched = populateInvoiceWithShipmentData(
    enriched as Invoice,
    packages,
    user?.name,
  );

  return enriched;
};

/**
 * Extracts display information from an enriched invoice for rendering.
 *
 * Safely extracts all necessary fields for display, with fallbacks
 * for missing data. Gracefully handles partial data without errors.
 *
 * @param enrichedInvoice - The enriched invoice data
 * @returns Object with display-ready invoice information
 */
export const getInvoiceDisplayInfo = (enrichedInvoice: EnrichedInvoiceData) => {
  return {
    recipientName: enrichedInvoice.recipientName || "Customer",
    recipientAddress: enrichedInvoice.recipientAddress || null,
    itemQuantity: enrichedInvoice.itemQuantity || 1,
    serviceDescription: enrichedInvoice.serviceDescription || "Logistics",
    invoiceNumber: enrichedInvoice.invoiceNumber || "",
    status: enrichedInvoice.status || "pending",
    createdAt: enrichedInvoice.createdAt || new Date().toISOString(),
  };
};
