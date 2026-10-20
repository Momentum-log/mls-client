import {
  Invoice,
  InvoiceApiResponse,
  InvoiceDetailsApiResponse,
} from "./invoice";
import { Shipment } from "./shipping";

/**
 * Response payload for `GET /payments/verify-payment`.
 *
 * `PENDING` is PayU-only: the order is still processing and the customer may
 * already have paid, so it must never be shown as a failure. Call again after
 * `retryAfterSeconds`.
 */
export interface VerifyPaymentResponse {
  status: "SUCCESS" | "PENDING" | "FAILED";
  paymentStatus: string;
  shipmentStatus: string;
  trackingNumber?: string;
  labelUrl?: string;
  message?: string;
  retryAfterSeconds?: number;
  /** Set when the payment was a collection fee rather than the shipment. */
  purpose?: "COLLECTION_FEE";
  paymentGateway?: string;
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
