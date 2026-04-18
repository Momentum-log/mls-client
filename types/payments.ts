import {
  Invoice,
  InvoiceApiResponse,
  InvoiceDetailsApiResponse,
} from "./invoice";
import { Shipment } from "./shipping";

/**
 * Response payload for payment verification.
 */
export interface VerifyPaymentResponse {
  status: "SUCCESS" | "FAILED";
  paymentStatus: string;
  shipmentStatus: string;
  trackingNumber?: string;
  labelUrl?: string;
  message?: string;
}

/**
 * Nested data payload returned by invoice fetch endpoint.
 */
export interface PaymentInvoiceResponseData {
  /** Raw invoice data from backend. */
  invoice: InvoiceApiResponse;
  /** Extended invoice details from backend. */
  details: InvoiceDetailsApiResponse;
  /** Optional shipment snapshot associated with invoice. */
  shipment?: Shipment;
}

/**
 * Response wrapper for invoice retrieval in payment flows.
 */
export interface PaymentInvoiceResponse {
  status: "success" | "error";
  data: PaymentInvoiceResponseData;
  message: string;
}

/**
 * Request payload to request a shipment invoice.
 */
export interface RequestShipmentInvoiceRequest {
  shipmentId: string;
}

/**
 * Response payload for shipment invoice request endpoint.
 */
export interface RequestShipmentInvoiceResponse {
  status?: string;
  message?: string;
}

/**
 * Query params/state for payment success invoice retrieval.
 */
export interface PaymentInvoiceQuery {
  invoiceId: string;
  enabled?: boolean;
}

/**
 * Normalized invoice model used by UI components.
 */
export type PaymentInvoiceModel = Invoice;
