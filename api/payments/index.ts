import apiClient from "..";
import {
  PaymentInvoiceModel,
  PaymentInvoiceResponse,
  RequestShipmentInvoiceRequest,
  RequestShipmentInvoiceResponse,
  VerifyPaymentResponse,
} from "@/types/payments";

/**
 * Normalizes payment invoice API payload to the shared Invoice model.
 *
 * @param payload - Raw payment invoice API response
 * @returns Invoice model used throughout the UI
 */
const normalizePaymentInvoice = (
  payload: PaymentInvoiceResponse,
): PaymentInvoiceModel => {
  const invoice = payload.data.invoice;
  const details = payload.data.details;

  return {
    invoiceId: invoice.id,
    invoiceNumber: invoice.invoiceNumber,
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
    totalNetAmount: invoice.breakdown?.base || 0,
    totalVATAmount: invoice.tax?.taxAmount || 0,
    totalGrossAmount:
      invoice.breakdown?.total ||
      (invoice.breakdown?.base || 0) + (invoice.tax?.taxAmount || 0),
    currency: "PLN",
    paymentLinks: [],
    status: invoice.status,
    createdAt: details.createdAt || invoice.date,
    updatedAt: details.updatedAt || invoice.date,
    paidAt: details.paidAt || undefined,
  };
};

/**
 * Verifies a payment session.
 * @param queryParams - The query string parameters (e.g. "?session_id=..." or "?gateway=payu&shipment_id=...").
 */
export const verifyPayment = async (queryParams: string) => {
  const queryString = queryParams.startsWith("?") ? queryParams : `?${queryParams}`;
  const response = await apiClient.get<VerifyPaymentResponse>(
    `/payments/verify-payment${queryString}`,
  );
  return response.data;
};

/**
 * Fetches invoice details for payment success page.
 *
 * @param invoiceId - Invoice identifier
 * @returns Normalized invoice model for UI consumption
 */
export const getPaymentInvoice = async (
  invoiceId: string,
): Promise<PaymentInvoiceModel> => {
  const response = await apiClient.get<PaymentInvoiceResponse>(
    `/invoices/${invoiceId}`,
  );
  return normalizePaymentInvoice(response.data);
};

/**
 * Requests shipment invoice processing.
 *
 * @param payload - Shipment identifier payload
 * @returns API response envelope
 */
export const requestShipmentInvoice = async (
  payload: RequestShipmentInvoiceRequest,
): Promise<RequestShipmentInvoiceResponse> => {
  const response = await apiClient.post<RequestShipmentInvoiceResponse>(
    `/shipments/${payload.shipmentId}/request-invoice`,
  );

  return response.data;
};
