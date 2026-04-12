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
import { AxiosError } from "axios";
import {
  Invoice,
  InvoicePaymentLink,
  ListInvoicesResponse,
  GenerateInvoiceRequest,
  GenerateInvoiceResponse,
  ConfirmInvoiceRequest,
  ConfirmInvoiceResponse,
  RegeneratePaymentLinkRequest,
  RegeneratePaymentLinkResponse,
  GetInvoiceResponse,
} from "@/types/invoice";

export interface InvoiceBusinessFilterParams {
  limit: number;
  offset: number;
  status?: string;
  invoiceNumber?: string;
  customerEmail?: string;
  dateFrom?: string;
  dateTo?: string;
  minAmount?: number;
  maxAmount?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
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
  const isExpired = Boolean(expiresAt) && new Date(expiresAt).getTime() < Date.now();

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
  const totalVATAmount = breakdown?.taxAmount ?? breakdown?.tax ?? item.tax?.taxAmount ?? 0;
  const totalGrossAmount =
    breakdown?.totalAmount ?? breakdown?.total ?? totalNetAmount + totalVATAmount;

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
    hasMore: envelope.pagination?.hasMore ?? fallback.offset + normalizedInvoices.length < total,
  };
};

/**
 * Fetches a paginated list of invoices with optional filtering by status.
 *
 * @param params - Query parameters
 * @param params.limit - Number of invoices per page
 * @param params.offset - Pagination offset
 * @param params.status - Optional invoice status filter (e.g., "PENDING", "PAID")
 * @returns Promise resolving to paginated invoices list
 *
 * @example
 * ```ts
 * const result = await getInvoices({ limit: 10, offset: 0, status: "PENDING" });
 * ```
 */
export const getInvoices = async (
  params: InvoiceBusinessFilterParams,
): Promise<ListInvoicesResponse> => {
  const query = new URLSearchParams({
    limit: String(params.limit),
    offset: String(params.offset),
    ...(params.status && params.status !== "all" && { status: params.status }),
    ...(params.invoiceNumber && { invoiceNumber: params.invoiceNumber }),
    ...(params.customerEmail && { customerEmail: params.customerEmail }),
    ...(params.dateFrom && { dateFrom: params.dateFrom }),
    ...(params.dateTo && { dateTo: params.dateTo }),
    ...(params.minAmount !== undefined && {
      minAmount: String(params.minAmount),
    }),
    ...(params.maxAmount !== undefined && {
      maxAmount: String(params.maxAmount),
    }),
    ...(params.sortBy && { sortBy: params.sortBy }),
    ...(params.sortOrder && { sortOrder: params.sortOrder }),
  });

  try {
    const response = await apiClient.get<ListInvoicesResponse | InvoiceListApiEnvelope>(
      `/invoices/business/filter?${query.toString()}`,
    );
    return normalizeInvoicesListResponse(response.data, {
      limit: params.limit,
      offset: params.offset,
    });
  } catch (error) {
    const axiosError = error as AxiosError;

    // Fallback for environments where the business filter route is not enabled yet.
    if (axiosError.response?.status === 404) {
      const response = await apiClient.get<ListInvoicesResponse | InvoiceListApiEnvelope>(
        `/invoices?${query.toString()}`,
      );
      return normalizeInvoicesListResponse(response.data, {
        limit: params.limit,
        offset: params.offset,
      });
    }

    throw error;
  }
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
export const getInvoice = async (invoiceId: string): Promise<GetInvoiceResponse> => {
  const response = await apiClient.get<GetInvoiceResponse>(`/invoices/${invoiceId}`);
  return response.data;
};

/**
 * Generates a new invoice from a shipment.
 *
 * @param data - Invoice generation request
 * @param data.shipmentId - The shipment to invoice
 * @param data.deliveryMethod - How to deliver the invoice
 * @param data.recipientEmail - Email recipient (required if delivery includes email)
 * @param data.paymentGateway - Payment gateway to use
 * @returns Promise resolving to invoice generation response
 *
 * @example
 * ```ts
 * const response = await generateInvoice({
 *   shipmentId: "ship-123",
 *   deliveryMethod: "email",
 *   recipientEmail: "customer@example.com",
 * });
 * ```
 */
export const generateInvoice = async (
  data: GenerateInvoiceRequest,
): Promise<GenerateInvoiceResponse> => {
  const response = await apiClient.post<GenerateInvoiceResponse>(
    "/invoices/generate",
    data,
  );
  return response.data;
};

/**
 * Confirms an invoice and generates a payment link.
 *
 * Called after user selects payment method before making payment.
 *
 * @param data - Invoice confirmation request
 * @param data.invoiceId - The invoice to confirm
 * @param data.paymentMethod - Selected payment method
 * @returns Promise resolving to confirmed invoice with payment link
 *
 * @example
 * ```ts
 * const response = await confirmInvoice({
 *   invoiceId: "inv-123",
 *   paymentMethod: "PAYU",
 * });
 * ```
 */
export const confirmInvoice = async (
  data: ConfirmInvoiceRequest,
): Promise<ConfirmInvoiceResponse> => {
  const response = await apiClient.post<ConfirmInvoiceResponse>(
    `/invoices/${data.invoiceId}/confirm`,
    data,
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

/**
 * Regenerates an expired payment link for an invoice.
 *
 * @param data - Payment link regeneration request
 * @param data.invoiceId - The invoice to regenerate link for
 * @returns Promise resolving to new payment link details
 *
 * @example
 * ```ts
 * const response = await regeneratePaymentLink({
 *   invoiceId: "inv-123",
 * });
 * ```
 */
export const regeneratePaymentLink = async (
  data: RegeneratePaymentLinkRequest,
): Promise<RegeneratePaymentLinkResponse> => {
  const response = await apiClient.post<RegeneratePaymentLinkResponse>(
    `/invoices/${data.invoiceId}/payment-link/regenerate`,
    data,
  );
  return response.data;
};
