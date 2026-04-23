/**
 * Invoice Hooks Barrel Export
 *
 * Central export point for all invoice-related hooks.
 * Exports consolidated React Query hooks following best practices.
 *
 * @module hooks/invoices
 * @see use-invoices for main hooks
 */

// Main consolidated hooks (following best practices)
export {
  useInvoicesList,
  useInvoice,
  useGenerateInvoice,
  useConfirmInvoice,
  useDownloadInvoicePdf,
  useSendInvoiceEmail,
  useRegeneratePaymentLink,
} from "./use-invoices";

// Legacy hooks (for backward compatibility - consider deprecating)
export { useInvoices } from "./useInvoices";
export { useInvoiceDownload } from "./useInvoiceDownload";
export { useInvoiceEmail } from "./useInvoiceEmail";
export { useInvoicePaymentFlow } from "./useInvoicePaymentFlow";
export { usePdfStatus } from "./usePdfStatus";
export { useInvoiceUpdateFlow } from "./useInvoiceUpdateFlow";
