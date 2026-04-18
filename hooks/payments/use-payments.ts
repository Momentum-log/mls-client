import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getPaymentInvoice,
  requestShipmentInvoice,
  verifyPayment,
} from "@/api/payments";
import {
  PaymentInvoiceModel,
  RequestShipmentInvoiceRequest,
  RequestShipmentInvoiceResponse,
  VerifyPaymentResponse,
} from "@/types/payments";

const paymentKeys = {
  all: ["payments"] as const,
  invoice: (invoiceId: string) =>
    [...paymentKeys.all, "invoice", invoiceId] as const,
};

/**
 * Retrieves a normalized invoice for payment success flows.
 *
 * @param invoiceId - Invoice identifier from URL/query params
 * @param enabled - Optional query enable flag
 * @returns Query result containing invoice model and request state
 */
export const usePaymentInvoice = (invoiceId: string, enabled = true) => {
  return useQuery<PaymentInvoiceModel, Error>({
    queryKey: paymentKeys.invoice(invoiceId),
    queryFn: () => getPaymentInvoice(invoiceId),
    enabled,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
};

/**
 * Requests shipment invoice processing.
 *
 * @returns Mutation for shipment invoice request
 */
export const useRequestShipmentInvoice = () => {
  return useMutation<
    RequestShipmentInvoiceResponse,
    Error,
    RequestShipmentInvoiceRequest
  >({
    mutationFn: requestShipmentInvoice,
  });
};

/**
 * Verifies a Stripe payment session.
 *
 * @returns Mutation for payment verification response
 */
export const useVerifyPayment = () => {
  return useMutation<VerifyPaymentResponse, Error, string>({
    mutationFn: verifyPayment,
  });
};
