/**
 * Invoice System TypeScript Types & Interfaces
 *
 * This module contains all TypeScript definitions for the invoice system integration.
 * It includes data models, request/response DTOs, and enums based on the backend
 * invoice API specification.
 *
 * @module types/invoice
 * @see invoice-client-integration-guide.md for API details
 */

import { Shipment } from "./shipping";

/**
 * Invoice status enumeration
 */
export enum InvoiceStatus {
  PENDING = "PENDING",
  EXPIRED = "EXPIRED",
  PAID = "PAID",
}

/**
 * Delivery method enumeration for invoice delivery
 */
export enum DeliveryMethod {
  DOWNLOAD = "download",
  EMAIL = "email",
  BOTH = "both",
}

/**
 * Payment method enumeration
 */
export enum PaymentMethod {
  STRIPE = "STRIPE",
  PAYU = "PAYU",
}

/**
 * Sort field enumeration for invoice list
 */
export enum SortField {
  CREATED_AT = "createdAt",
  INVOICE_NUMBER = "invoiceNumber",
  TOTAL_GROSS = "totalGross",
}

/**
 * Payment link status enumeration
 */
export enum PaymentLinkStatus {
  ACTIVE = "active",
  EXPIRED = "expired",
  PAID = "paid",
}

/**
 * Action enumeration for audit logs
 */
export enum AuditAction {
  CREATED = "created",
  SENT = "sent",
  EXPIRED = "expired",
  REGENERATED = "regenerated",
  PAID = "paid",
  RESENT = "resent",
}

/**
 * PDF generation status enumeration
 */
export enum PdfGenerationStatus {
  READY = "READY",
  PENDING = "PENDING",
}

// ============================================================================
// Core Data Models
// ============================================================================

/**
 * Line item in an invoice
 */
export interface InvoiceLineItem {
  /** Unique identifier for the line item (UUID) */
  lineItemId: string;
  /** Invoice ID this line item belongs to */
  invoiceId: string;
  /** Sequential line number (1, 2, 3, etc.) */
  lineNumber: number;

  // Service details
  /** Name of the service (e.g., "Domestic Shipping", "Express Delivery") */
  serviceName: string;
  /** Unit of measure (e.g., "pcs", "kg", "shipment") */
  unitOfMeasure: string;
  /** Quantity of units */
  quantity: number;

  // Pricing (net)
  /** Price per unit in PLN (net, before VAT) */
  unitNetPrice: number;
  /** Total net value (quantity * unitNetPrice) */
  netValue: number;

  // Tax
  /** Tax rate percentage (23 for 23% VAT or 0 for 0% VAT) */
  taxRate: number;
  /** Calculated VAT amount */
  vatAmount: number;

  // Pricing (gross)
  /** Total gross value (net + VAT) */
  grossValue: number;

  // KSeF compliance
  /** GTU code for KSeF (e.g., "GTU_13" for logistics) */
  gtuCode: string;
  /** Country code of shipment origin (determines tax rate) */
  shipmentOriginCountry: string;

  // Metadata
  /** ISO-8601 timestamp when created */
  createdAt: string;
}

/**
 * Payment link for invoice payment
 */
export interface InvoicePaymentLink {
  /** Unique identifier for the payment link (UUID) */
  paymentLinkId: string;
  /** Invoice ID this payment link belongs to */
  invoiceId: string;

  // Payment URL
  /** Complete payment URL (e.g., https://pay.mls.system/{invoiceId}/{uniqueUUID}) */
  paymentLinkUrl: string;

  // Status lifecycle
  /** Current status of the payment link */
  status: PaymentLinkStatus | string; // "active" | "expired" | "paid"

  // Expiration
  /** ISO-8601 timestamp when this link expires (7 days from creation/regeneration) */
  expiresAt: string;

  // Regeneration tracking
  /** ISO-8601 timestamp when this link was regenerated from a previous link */
  regeneratedAt?: string;
  /** Count of how many times this link has been regenerated */
  regenerationCount: number;

  // Metadata
  /** ISO-8601 timestamp when created */
  createdAt: string;
}

/**
 * Audit log entry for invoice actions
 */
export interface InvoiceAuditLogEntry {
  /** Unique identifier for the audit log entry (UUID) */
  auditLogId: string;
  /** Invoice ID this audit entry relates to */
  invoiceId: string;

  // Action details
  /** Type of action performed */
  action: AuditAction | string;
  /** "SYSTEM" or user ID who performed the action */
  performedBy: string;
  /** How invoice was delivered (if applicable) */
  deliveryMethod?: DeliveryMethod | string;

  // State tracking
  /** Previous invoice state before action */
  beforeState?: Record<string, unknown>;
  /** New invoice state after action */
  afterState?: Record<string, unknown>;

  // Request details
  /** IP address of admin (for audit trail) */
  ipAddress?: string;
  /** Additional notes about the action */
  details?: string;

  // Timestamp
  /** ISO-8601 timestamp when action occurred */
  timestamp: string;
}

/**
 * Tax breakdown summary for invoice totals
 */
export interface TaxBreakdown {
  /** Tax rate percentage (23 or 0) */
  taxRate: number;
  /** Total net amount for this tax rate */
  netAmount: number;
  /** Total VAT amount for this tax rate */
  vatAmount: number;
  /** Total gross amount for this tax rate */
  grossAmount: number;
  /** Number of line items with this tax rate */
  lineItemCount: number;
}

/**
 * Customer invoice data - what customers see
 */
export interface Invoice {
  /** Unique identifier (UUID) */
  invoiceId: string;
  /** User-friendly invoice number (MLS-INV-XXXXXX-YYYY format) */
  invoiceNumber: string;
  /** Customer user ID */
  customerId: string;
  /** Customer full name */
  customerName: string;
  /** Customer email address */
  customerEmail: string;

  // Seller (MLS Logistics) - atomized fields
  /** Seller company name */
  sellerCompanyName: string;
  /** Seller street name */
  sellerStreet: string;
  /** Seller building number */
  sellerBuildingNumber: string;
  /** Seller apartment/suite number (optional) */
  sellerApartmentNumber?: string;
  /** Seller city */
  sellerCity: string;
  /** Seller postal code */
  sellerPostalCode: string;
  /** Seller country code (e.g., "PL") */
  sellerCountryCode: string;
  /** Seller VAT ID (NIP) */
  sellerNIP: string;

  // Buyer (Customer) - atomized fields
  /** Buyer full name */
  buyerName: string;
  /** Buyer street name */
  buyerStreet: string;
  /** Buyer building number */
  buyerBuildingNumber: string;
  /** Buyer apartment/suite number (optional) */
  buyerApartmentNumber?: string;
  /** Buyer city */
  buyerCity: string;
  /** Buyer postal code */
  buyerPostalCode: string;
  /** Buyer country code */
  buyerCountryCode: string;
  /** Buyer VAT ID (optional) */
  buyerNIP?: string;

  // Line items (services)
  /** Array of line items on this invoice */
  lineItems: InvoiceLineItem[];

  // Totals
  /** Sum of all line items net amounts */
  totalNetAmount: number;
  /** Sum of all line items VAT amounts */
  totalVATAmount: number;
  /** Total net + VAT */
  totalGrossAmount: number;

  // Currency and exchange rate
  /** Invoice currency (PLN or EUR) */
  currency: "PLN" | "EUR";
  /** EUR to PLN exchange rate (if currency is EUR) */
  exchangeRate?: number;
  /** Date of the exchange rate */
  exchangeRateDate?: string;

  // Payment links (history)
  /** Array of payment links for this invoice */
  paymentLinks: InvoicePaymentLink[];

  // Status
  /** Current invoice status */
  status: InvoiceStatus | string;

  // Soft delete fields
  /** ISO-8601 timestamp when soft-deleted (null = active) */
  deletedAt?: string;
  /** User ID who deleted the invoice */
  deletedBy?: string;
  /** ISO-8601 timestamp of last restoration */
  restoredAt?: string;

  // Metadata
  /** ISO-8601 timestamp when created */
  createdAt: string;
  /** ISO-8601 timestamp of last update */
  updatedAt: string;
  /** ISO-8601 timestamp when marked as paid */
  paidAt?: string;
}

// ============================================================================
// Request/Response DTOs
// ============================================================================

/**
 * Request to generate invoice
 */
export interface GenerateInvoiceRequest {
  /** UUID of shipment to invoice */
  shipmentId: string;
  /** How to deliver invoice (download, email, or both) */
  deliveryMethod: DeliveryMethod | string;
  /** Email address (required if deliveryMethod includes "email") */
  recipientEmail?: string;
  /** Payment gateway to use (defaults to configured gateway) */
  paymentGateway?: PaymentMethod | string;
}

/**
 * Response from invoice generation
 */
export interface GenerateInvoiceResponse {
  /** Unique invoice identifier */
  invoiceId: string;
  /** User-friendly invoice number */
  invoiceNumber: string;
  /** Operation status */
  status: "success" | "partial_success" | "error";

  // Delivery results
  /** Pre-signed URL to download PDF (if download selected) */
  downloadUrl?: string;
  /** Base64-encoded PDF (if needed for immediate display) */
  pdfBase64?: string;
  /** PDF file size in bytes */
  pdfSize: number;

  // Payment link (not yet generated - requires confirm call)
  /** Payment link URL (note: may be null until confirm is called) */
  paymentLinkUrl?: string;
  /** ISO-8601 when payment link expires */
  paymentLinkExpiresAt?: string;

  // Notifications
  /** ISO-8601 timestamp when email was sent (if email delivery) */
  emailSentAt?: string;
  /** Email address where email was sent */
  emailAddress?: string;

  // Message
  /** User-friendly message */
  message: string;
  /** Invoice creation timestamp */
  createdAt: string;
}

/**
 * Request to confirm invoice and generate payment link
 * Called after user selects payment method, before making payment
 */
export interface ConfirmInvoiceRequest {
  /** Invoice ID to confirm */
  invoiceId: string;
  /** Payment gateway to use */
  paymentMethod: PaymentMethod | string;
}

/**
 * Response from confirm invoice
 */
export interface ConfirmInvoiceResponse {
  /** Invoice ID confirmed */
  invoiceId: string;
  /** Newly generated payment link URL */
  paymentLinkUrl: string;
  /** ISO-8601 when this payment link expires */
  paymentLinkExpiresAt: string;
  /** Confirmed payment platform */
  selectedPaymentPlatform: PaymentMethod | string;
  /** Confirmation message */
  message: string;
  /** Last update timestamp */
  updatedAt: string;
}

/**
 * Request to delete invoice (soft delete)
 */
export interface DeleteInvoiceRequest {
  /** Invoice ID to delete */
  invoiceId: string;
}

/**
 * Response from delete invoice
 */
export interface DeleteInvoiceResponse {
  /** Invoice ID that was deleted */
  invoiceId: string;
  /** ISO-8601 timestamp when deleted */
  deletedAt: string;
  /** User ID who performed deletion */
  deletedBy: string;
  /** Confirmation message */
  message: string;
  /** Whether invoice can still be restored (within 30-day window) */
  canRestore: boolean;
}

/**
 * Request to restore soft-deleted invoice
 */
export interface RestoreInvoiceRequest {
  /** Invoice ID to restore */
  invoiceId: string;
}

/**
 * Response from restore invoice
 */
export interface RestoreInvoiceResponse {
  /** Invoice ID that was restored */
  invoiceId: string;
  /** ISO-8601 timestamp when restored */
  restoredAt: string;
  /** Current status after restoration */
  status: InvoiceStatus | string;
  /** Confirmation message */
  message: string;
  /** Last update timestamp */
  updatedAt: string;
}

/**
 * Request to regenerate payment link for expired invoice
 */
export interface RegeneratePaymentLinkRequest {
  /** Invoice ID to regenerate link for */
  invoiceId: string;
}

/**
 * Response from payment link regeneration
 */
export interface RegeneratePaymentLinkResponse {
  /** Invoice ID */
  invoiceId: string;
  /** New payment link URL with new UUID */
  paymentLinkUrl: string;
  /** ISO-8601 when new link expires (7 days from now) */
  paymentLinkExpiresAt: string;
  /** How many times this invoice has had link regenerated */
  regenerationCount: number;
  /** Previous payment link URL (now expired) */
  oldPaymentLinkUrl?: string;
  /** Confirmation message */
  message: string;
  /** Last update timestamp */
  updatedAt: string;
}

/**
 * Admin request to resend invoice
 */
export interface AdminResendInvoiceRequest {
  /** Invoice ID to resend */
  invoiceId: string;
  /** How to deliver the invoice */
  deliveryMethod: DeliveryMethod | string;
  /** Email address (required if includes "email") */
  recipientEmail?: string;
  /** Optional admin note about why resending */
  note?: string;
}

/**
 * Admin response for resend
 */
export interface AdminResendInvoiceResponse {
  /** Whether resend was successful */
  success: boolean;
  /** Response message */
  message: string;
  /** Timestamp of resend */
  resendAt: string;
  /** Delivery method used */
  deliveryMethod: DeliveryMethod | string;
}

// ============================================================================
// Query/Filter Types
// ============================================================================

/**
 * Customer invoice list query filters
 */
export interface ListInvoicesQuery {
  /** Optional status filter */
  status?: InvoiceStatus | string;
  /** Number of results (default 20, max 100) */
  limit?: number;
  /** Number of results to skip (default 0) */
  offset?: number;
  /** Which field to sort by */
  sortBy?: SortField | string;
  /** Sort direction */
  sortOrder?: "asc" | "desc";
}

/**
 * Customer invoice list response
 */
export interface ListInvoicesResponse {
  /** Array of invoice objects matching filters */
  invoices: Invoice[];
  /** Total count of invoices matching filters */
  total: number;
  /** Limit used in request */
  limit: number;
  /** Offset used in request */
  offset: number;
  /** Whether more invoices exist beyond current page */
  hasMore: boolean;
}

/**
 * Admin invoice list query filters
 */
export interface AdminListInvoicesQuery {
  /** Optional status filter */
  status?: InvoiceStatus | string;
  /** Filter by customer ID */
  customerId?: string;
  /** Filter by customer email */
  customerEmail?: string;
  /** Search by invoice number */
  invoiceNumber?: string;
  /** From date (ISO-8601) */
  dateFrom?: string;
  /** To date (ISO-8601) */
  dateTo?: string;
  /** Minimum total gross amount */
  minAmount?: number;
  /** Maximum total gross amount */
  maxAmount?: number;
  /** Number of results (default 20, max 100) */
  limit?: number;
  /** Number of results to skip (default 0) */
  offset?: number;
  /** Which field to sort by */
  sortBy?: SortField | string | "customerName";
  /** Sort direction */
  sortOrder?: "asc" | "desc";
}

/**
 * Admin invoice list response
 */
export interface AdminListInvoicesResponse {
  /** Array of full invoice objects */
  invoices: Invoice[];
  /** Total count */
  total: number;
  /** Limit used */
  limit: number;
  /** Offset used */
  offset: number;
  /** Whether more invoices exist */
  hasMore: boolean;
}

// ============================================================================
// API Response Types (Backend Response Format)
// ============================================================================

/**
 * Breakdown structure in invoice API response
 */
export interface InvoiceBreakdown {
  /** Base price without tax or surcharges */
  base: number;
  /** Tax amount */
  tax: number;
  /** Total amount (base + tax) */
  total: number;
}

/**
 * Tax information in invoice API response
 */
export interface InvoiceTaxInfo {
  /** Tax rate percentage (e.g., 0, 23) */
  rate: number;
  /** Tax rule applied (e.g., "Default rule") */
  ruleApplied: string;
  /** Calculate tax amount */
  taxAmount: number;
  /** Whether reverse charge was applied */
  isReverseCharge: boolean;
}

/**
 * Invoice data structure from GET /invoices/{id} API response
 */
export interface InvoiceApiResponse {
  /** Unique invoice identifier (UUID) */
  id: string;
  /** User-friendly invoice number (MLS-INV-XXXXXX-YYYY) */
  invoiceNumber: string;
  /** Invoice creation date (ISO-8601) */
  date: string;
  /** Invoice status (PENDING, EXPIRED, PAID) */
  status: string;
  /** Payment platform used (STRIPE, PAYU, etc.) */
  paymentPlatform: string;
  /** Payment link URL or null */
  paymentLink: string | null;
  /** Breakdown of pricing */
  breakdown: InvoiceBreakdown;
  /** Tax details */
  tax: InvoiceTaxInfo;
  /** VAT registration ID or null */
  vatId: string | null;
  /** URL to download invoice PDF */
  pdfUrl: string;
  /** ISO-8601 expiration timestamp */
  expiresAt: string;
  /** Time remaining until expiration in milliseconds */
  timeRemainingMs: number;
}

/**
 * Invoice details structure from GET /invoices/{id} API response
 */
export interface InvoiceDetailsApiResponse {
  /** Unique invoice identifier (UUID) */
  id: string;
  /** User-friendly invoice number */
  invoiceNumber: string;
  /** Invoice status */
  status: string;
  /** Whether invoice has expired */
  isExpired: boolean;
  /** Time remaining in milliseconds */
  timeRemainingMs: number;
  /** Detailed breakdown of amounts */
  breakdown: {
    /** Base price */
    basePrice: number;
    /** Tax amount */
    taxAmount: number;
    /** Tax rate percentage */
    taxRate: number;
    /** Total amount */
    totalAmount: number;
    /** Tax rule applied */
    appliedRule: string;
    /** Whether reverse charge applied */
    isReversedCharge: boolean;
  };
  /** Payment platform used */
  paymentPlatform: string;
  /** Payment link URL or null */
  paymentLink: string | null;
  /** URL to invoice PDF */
  fakturaUrl: string;
  /** Expiration timestamp */
  expiresAt: string;
  /** Payment timestamp or null */
  paidAt: string | null;
  /** Creation timestamp */
  createdAt: string;
  /** Last update timestamp */
  updatedAt: string;
}

/**
 * Get invoice response wrapper from GET /invoices/{id}
 */
export interface GetInvoiceResponse {
  /** Response status (success, error) */
  status: "success" | "error";
  /** Response data containing invoice and details */
  data: {
    /** Main invoice data */
    invoice: InvoiceApiResponse;
    /** Detailed invoice information */
    details: InvoiceDetailsApiResponse;
    /** Associated shipment (included in full invoice response) */
    shipment?: Shipment; // Shipment type from shipping.ts
  };
  /** Response message */
  message: string;
}

/**
 * Embedded invoice data from shipment response
 * Represents the invoice object nested within a Shipment object
 */
export interface ShipmentInvoice {
  /** Unique invoice identifier (UUID) */
  id: string;
  /** User-friendly invoice number (MLS-INV-XXXXXX-YYYY) */
  invoiceNumber: string;
  /** User ID who created the invoice */
  userId: string;
  /** Associated shipment ID */
  shipmentId: string;
  /** Invoice status (PENDING, EXPIRED, PAID) */
  status: string;
  /** Base price before tax */
  basePrice: number;
  /** Tax amount */
  taxAmount: number;
  /** Total amount (base + tax) */
  totalAmount: number;
  /** Tax rule reference ID or null */
  taxRuleId: string | null;
  /** Selected payment platform */
  selectedPaymentPlatform: string;
  /** Payment link URL or null */
  paymentLink: string | null;
  /** URL to generated PDF invoice */
  fakturaUrl: string;
  /** Faktura job ID or null */
  fakturaJobId: string | null;
  /** Invoice currency (EUR, PLN, USD, etc.) */
  currency: string;
  /** Exchange rate date ISO-8601 */
  exchangeRateDate: string;
  /** Exchange rate value (e.g., EUR to local currency) */
  exchangeRateValue: number;
  /** Seller company name */
  sellerCompanyName: string;
  /** Seller street */
  sellerStreet: string;
  /** Seller building number */
  sellerBuildingNumber: string;
  /** Seller apartment/suite number or null */
  sellerApartmentNumber: string | null;
  /** Seller city */
  sellerCity: string;
  /** Seller postal code */
  sellerPostalCode: string;
  /** Seller country code */
  sellerCountryCode: string;
  /** Seller NIP/tax ID or null */
  sellerNip: string | null;
  /** Buyer/customer name */
  buyerName: string;
  /** Buyer street or null */
  buyerStreet: string | null;
  /** Buyer building number or null */
  buyerBuildingNumber: string | null;
  /** Buyer apartment/suite number or null */
  buyerApartmentNumber: string | null;
  /** Buyer city or null */
  buyerCity: string | null;
  /** Buyer postal code or null */
  buyerPostalCode: string | null;
  /** Buyer country code */
  buyerCountryCode: string;
  /** Buyer NIP or null */
  buyerNip: string | null;
  /** Total net amount */
  totalNet: number;
  /** Total VAT */
  totalVat: number;
  /** Total gross amount */
  totalGross: number;
  /** Tax breakdown as JSON string */
  taxBreakdown: string;
  /** Invoice date ISO-8601 */
  invoiceDate: string;
  /** Service delivery date ISO-8601 */
  serviceDeliveryDate: string;
  /** Expiration timestamp ISO-8601 */
  expiresAt: string;
  /** Payment timestamp or null */
  paidAt: string | null;
  /** Refund request timestamp or null */
  refundRequestedAt: string | null;
  /** Refund approval timestamp or null */
  refundApprovedAt: string | null;
  /** Refund completion timestamp or null */
  refundedAt: string | null;
  /** Audit notes or null */
  auditNotes: string | null;
  /** Soft delete timestamp or null */
  deletedAt: string | null;
  /** User ID who deleted or null */
  deletedBy: string | null;
  /** Restore timestamp or null */
  restoredAt: string | null;
  /** Creation timestamp */
  createdAt: string;
  /** Last update timestamp */
  updatedAt: string;
  /** Array of line items */
  lineItems: InvoiceLineItem[];
  /** Array of payment links */
  paymentLinks: string[];
}

// ============================================================================
// Error Types
// ============================================================================

/**
 * Standard API error response
 */
export interface ErrorResponse {
  /** HTTP status code */
  status: number;
  /** Error code identifier (e.g., "INVOICE_NOT_FOUND", "VALIDATION_ERROR") */
  code: string;
  /** User-friendly error message */
  message: string;
  /** Validation errors by field name (can be string or array of strings) */
  details?: Record<string, string | string[]>;
  /** ISO-8601 timestamp when error occurred */
  timestamp: string;
  /** API endpoint that returned the error */
  path?: string;
}

/**
 * API error with typed details for handling
 */
export interface TypedApiError extends ErrorResponse {
  // TypedApiError is now just an alias; details already supports string | string[]
  someSpecificFieldErrors?: Record<string, string | string[]>;
}

// ============================================================================
// Shipment Integration Types
// ============================================================================

/**
 * Quick invoice information embedded in shipment response
 */
export interface InvoiceQuickInfo {
  /** Invoice unique identifier */
  id: string;
  /** Invoice number (MLS-INV-XXXXXX-YYYY) */
  number: string;
  /** Invoice status */
  status: InvoiceStatus | string;
  /** Total amount in PLN (gross, including tax) */
  totalAmount: number;
  /** Currency (PLN or EUR) */
  currency: string;
  /** Total VAT amount */
  tax: number;
  /** Tax rate (23 or 0) */
  taxRate: number;
  /** Line items on the invoice */
  lineItems: InvoiceLineItem[];
  /** Invoice creation timestamp */
  createdAt: string;
  /** Invoice last update timestamp */
  updatedAt: string;
  /** Payment link URL (active, expires in 24h) */
  paymentLink: string;
  /** When this payment link expires */
  paymentLinkExpiresAt: string;
  /** URL to download PDF (null if still generating) */
  pdfDownloadUrl?: string;
}

/**
 * Shipment creation/update response (unified endpoint)
 * Returned after POST /api/shipments (with status 201 for CREATE, 200 for UPDATE)
 */
export interface CreateShipmentResponse {
  /** Shipment unique identifier */
  shipmentId: string;
  /** Custom tracking number */
  customTrackingNumber: string;
  /** Payment checkout URL (same as paymentLink for backward compatibility) */
  checkoutUrl: string;
  /** Payment gateway used (stripe or payu) */
  paymentGateway: "stripe" | "payu";

  /** Invoice data embedded in response */
  invoice: InvoiceQuickInfo;

  /** PDF generation status (READY or PENDING) */
  pdfGenerationStatus: PdfGenerationStatus | string;
}

/**
 * PDF status check response from GET /api/invoices/{invoiceId}/pdf
 */
export interface PdfStatusResponse {
  /** Current status of PDF generation (READY or PENDING) */
  status: PdfGenerationStatus | string;
  /** Download URL (only when status is READY) */
  downloadUrl?: string;
  /** User-friendly message */
  message?: string;
  /** Recommended retry delay in seconds (HTTP 202 response) */
  retryAfter?: number;
  /** Invoice number for reference */
  invoiceNumber: string;
}

/**
 * Email sending response from POST /api/invoices/{invoiceId}/email
 */
export interface EmailInvoiceResponse {
  /** Operation status */
  status: "success" | "accepted" | "error";
  /** Response message */
  message: string;
  /** Invoice number for reference */
  invoiceNumber: string;
  /** Email address invoice was sent/queued to */
  sentTo: string;
  /** PDF status at time of email (READY or PENDING) */
  pdfStatus?: PdfGenerationStatus | string;
}

/**
 * Hook return type for usePdfStatus
 */
export interface UsePdfStatusReturn {
  /** Downloaded PDF URL (null until ready) */
  pdfUrl: string | null;
  /** Whether PDF is ready for download */
  isReady: boolean;
  /** Whether currently checking PDF status */
  isLoading: boolean;
  /** Error that occurred (null if none) */
  error: ErrorResponse | null;
  /** Function to manually trigger retry */
  retry: () => Promise<void>;
}
