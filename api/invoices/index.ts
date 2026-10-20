/**
 * Invoice API Functions
 *
 * Pure API functions for invoice operations using the shared apiClient instance.
 * Each function is focused on a single API endpoint and returns raw response data.
 *
 * @module api/invoices
 * @see hooks/invoices for React Query wrapped versions
 */

import apiClient from "../index";
import {
  Invoice,
  InvoicePaymentLink,
  ListInvoicesResponse,
  GetInvoiceResponse,
} from "@/types/invoice";

/**
 * `GET /invoices` paginates only. It has no status, amount or sort filters, so
 * those are applied client-side on the returned page.
 */
export interface InvoiceListParams {
  limit: number;
  offset: number;
}

interface InvoiceListApiItem {
  id: string;
  invoiceNumber: string;
  date: string;
  status: string;
  paymentLink?: string | null;
  expiresAt?: string | null;
  breakdown?: {
    base?: number;
    basePrice?: number;
    tax?: number;
    taxAmount?: number;
    total?: number;
    totalAmount?: number;
  };
  tax?: {
    taxAmount?: number;
  };
  shipment?: {
    id?: string;
    createdAt?: string;
  };
}

interface InvoiceListApiEnvelope {
  status: string;
  data?: {
    invoices?: InvoiceListApiItem[];
  };
  pagination?: {
    limit?: number;
    offset?: number;
    total?: number;
    hasMore?: boolean;
  };
}

const toPaymentLinks = (item: InvoiceListApiItem): InvoicePaymentLink[] => {
  if (!item.paymentLink) {
    return [];
  }

  const expiresAt = item.expiresAt || item.date;
  const isExpired =
    Boolean(expiresAt) && new Date(expiresAt).getTime() < Date.now();

  return [
    {
      paymentLinkId: `payment-link-${item.id}`,
      invoiceId: item.id,
      paymentLinkUrl: item.paymentLink,
      status: isExpired ? "expired" : "active",
      expiresAt,
      regenerationCount: 0,
      createdAt: item.date,
    },
  ];
};

const normalizeInvoiceListItem = (item: InvoiceListApiItem): Invoice => {
  const breakdown = item.breakdown;
  const totalNetAmount = breakdown?.basePrice ?? breakdown?.base ?? 0;
  const totalVATAmount =
    breakdown?.taxAmount ?? breakdown?.tax ?? item.tax?.taxAmount ?? 0;
  const totalGrossAmount =
    breakdown?.totalAmount ??
    breakdown?.total ??
    totalNetAmount + totalVATAmount;

  return {
    invoiceId: item.id,
    invoiceNumber: item.invoiceNumber,
    customerId: "",
    customerName: "",
    customerEmail: "",
    sellerCompanyName: "Momentum Logistics Service",
    sellerStreet: "",
    sellerBuildingNumber: "",
    sellerCity: "",
    sellerPostalCode: "",
    sellerCountryCode: "PL",
    sellerNIP: "",
    buyerName: "",
    buyerStreet: "",
    buyerBuildingNumber: "",
    buyerCity: "",
    buyerPostalCode: "",
    buyerCountryCode: "",
    lineItems: [],
    totalNetAmount,
    totalVATAmount,
    totalGrossAmount,
    currency: "PLN",
    paymentLinks: toPaymentLinks(item),
    status: item.status,
    createdAt: item.date,
    updatedAt: item.shipment?.createdAt || item.date,
  };
};

const normalizeInvoicesListResponse = (
  payload: ListInvoicesResponse | InvoiceListApiEnvelope,
  fallback: { limit: number; offset: number },
): ListInvoicesResponse => {
  if (Array.isArray((payload as ListInvoicesResponse).invoices)) {
    return payload as ListInvoicesResponse;
  }

  const envelope = payload as InvoiceListApiEnvelope;
  const normalizedInvoices = (envelope.data?.invoices || []).map(
    normalizeInvoiceListItem,
  );
  const total = envelope.pagination?.total ?? normalizedInvoices.length;

  return {
    invoices: normalizedInvoices,
    total,
    limit: envelope.pagination?.limit ?? fallback.limit,
    offset: envelope.pagination?.offset ?? fallback.offset,
    hasMore:
      envelope.pagination?.hasMore ??
      fallback.offset + normalizedInvoices.length < total,
  };
};

/**
 * Fetches a page of the signed-in customer's invoices.
 *
 * @param params.limit - Number of invoices per page (the server caps it at 100)
 * @param params.offset - Pagination offset
 * @returns Promise resolving to paginated invoices list
 */
export const getInvoices = async (
  params: InvoiceListParams,
): Promise<ListInvoicesResponse> => {
  const response = await apiClient.get<
    ListInvoicesResponse | InvoiceListApiEnvelope
  >("/invoices", { params: { limit: params.limit, offset: params.offset } });
  return normalizeInvoicesListResponse(response.data, params);
};

/**
 * Fetches a single invoice by ID.
 *
 * @param invoiceId - The unique invoice identifier
 * @returns Promise resolving to invoice response with data containing invoice and details
 *
 * @example
 * ```ts
 * const response = await getInvoice("inv-123");
 * console.log(response.data.invoice);
 * console.log(response.data.details);
 * ```
 */
export const getInvoice = async (
  invoiceId: string,
): Promise<GetInvoiceResponse> => {
  const response = await apiClient.get<GetInvoiceResponse>(
    `/invoices/${invoiceId}`,
  );
  return response.data;
};

/**
 * Downloads the invoice PDF as a blob.
 *
 * @param invoiceId - The invoice to download
 * @returns Promise resolving to PDF blob
 *
 * @example
 * ```ts
 * const blob = await downloadInvoicePdf("inv-123");
 * const url = URL.createObjectURL(blob);
 * // Download or display PDF
 * ```
 */
export const downloadInvoicePdf = async (invoiceId: string): Promise<Blob> => {
  const response = await apiClient.get(`/invoices/${invoiceId}/pdf`, {
    responseType: "blob",
  });
  return response.data;
};

/**
 * Sends an invoice via email.
 *
 * @param invoiceId - The invoice to send
 * @param email - Email recipient address
 * @returns Promise resolving to send confirmation
 *
 * @example
 * ```ts
 * const result = await sendInvoiceEmail("inv-123", "customer@example.com");
 * ```
 */
export const sendInvoiceEmail = async (
  invoiceId: string,
  email: string,
): Promise<Record<string, unknown>> => {
  const response = await apiClient.post(`/invoices/${invoiceId}/email`, {
    email,
  });
  return response.data;
};

