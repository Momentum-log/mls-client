import { useMutation, useQuery } from "@tanstack/react-query";
import {
  downloadPaymentInvoicePdf,
  getPaymentInvoice,
  sendPaymentInvoiceEmail,
  verifyPayment,
} from "@/api/payments";
import {
  PaymentInvoiceModel,
  SendPaymentInvoiceEmailRequest,
  SendPaymentInvoiceEmailResponse,
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
 * Downloads a payment invoice PDF.
 *
 * @returns Mutation for downloading invoice PDF blob
 */
export const useDownloadPaymentInvoicePdf = () => {
  return useMutation<Blob, Error, string>({
    mutationFn: downloadPaymentInvoicePdf,
  });
};

/**
 * Sends payment invoice receipt email.
 *
 * @returns Mutation for sending receipt email
 */
export const useSendPaymentInvoiceEmail = () => {
  return useMutation<
    SendPaymentInvoiceEmailResponse,
    Error,
    SendPaymentInvoiceEmailRequest
  >({
    mutationFn: sendPaymentInvoiceEmail,
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
