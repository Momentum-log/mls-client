/**
 * Invoice React Query Hooks
 *
 * Consolidated hooks for all invoice operations using TanStack Query.
 * Wraps API functions from @/api/invoices with proper caching and state management.
 *
 * @module hooks/invoices/use-invoices
 * @see api/invoices for underlying API functions
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getInvoices,
  getInvoice,
  generateInvoice,
  confirmInvoice,
  downloadInvoicePdf,
  sendInvoiceEmail,
  regeneratePaymentLink,
} from "@/api/invoices";
import {
  Invoice,
  ListInvoicesResponse,
  GenerateInvoiceRequest,
  GenerateInvoiceResponse,
  ConfirmInvoiceRequest,
  ConfirmInvoiceResponse,
  RegeneratePaymentLinkRequest,
  RegeneratePaymentLinkResponse,
  GetInvoiceResponse,
} from "@/types/invoice";

// Query keys for cache management
const invoiceKeys = {
  all: ["invoices"] as const,
  lists: () => [...invoiceKeys.all, "list"] as const,
  list: (params: { limit: number; offset: number; status?: string }) =>
    [...invoiceKeys.lists(), params] as const,
  details: () => [...invoiceKeys.all, "detail"] as const,
  detail: (id: string) => [...invoiceKeys.details(), id] as const,
};

/**
 * Hook for fetching paginated list of invoices.
 *
 * Automatically handles caching and refetching based on parameters.
 *
 * @param params - Pagination and filter parameters
 * @param params.limit - Number of invoices per page
 * @param params.offset - Pagination offset
 * @param params.status - Optional status filter
 * @returns Query result with invoices data and state
 *
 * @example
 * ```tsx
 * const { data, isLoading, error } = useInvoicesList({
 *   limit: 10,
 *   offset: 0,
 *   status: "PENDING",
 * });
 *
 * if (isLoading) return <div>Loading...</div>;
 * if (error) return <div>Error: {error.message}</div>;
 * return <div>{data?.invoices.length} invoices found</div>;
 * ```
 */
export const useInvoicesList = (params: {
  limit: number;
  offset: number;
  status?: string;
}) => {
  return useQuery<ListInvoicesResponse>({
    queryKey: invoiceKeys.list(params),
    queryFn: () => getInvoices(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
};

/**
 * Hook for fetching a single invoice by ID.
 *
 * @param invoiceId - The invoice ID to fetch
 * @param enabled - Optional flag to disable query (defaults to true)
 * @returns Query result with invoice data and state
 *
 * @example
 * ```tsx
 * const { data: invoice, isLoading } = useInvoice("inv-123");
 *
 * if (isLoading) return <div>Loading...</div>;
 * return <div>{invoice?.invoiceNumber}</div>;
 * ```
 */
export const useInvoice = (invoiceId: string, enabled = true) => {
  return useQuery<GetInvoiceResponse>({
    queryKey: invoiceKeys.detail(invoiceId),
    queryFn: () => getInvoice(invoiceId),
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
};

/**
 * Hook for generating a new invoice from a shipment.
 *
 * @returns Mutation object with mutate/mutateAsync function
 *
 * @example
 * ```tsx
 * const { mutateAsync: generate, isPending } = useGenerateInvoice();
 *
 * const handleGenerate = async () => {
 *   const response = await generate({
 *     shipmentId: "ship-123",
 *     deliveryMethod: "email",
 *     recipientEmail: "customer@example.com",
 *   });
 *   console.log("Invoice created:", response.invoiceId);
 * };
 * ```
 */
export const useGenerateInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation<GenerateInvoiceResponse, Error, GenerateInvoiceRequest>({
    mutationFn: generateInvoice,
    onSuccess: () => {
      // Invalidate invoice lists to trigger refetch
      queryClient.invalidateQueries({ queryKey: invoiceKeys.lists() });
    },
  });
};

/**
 * Hook for confirming an invoice and generating payment link.
 *
 * @returns Mutation object with mutate/mutateAsync function
 *
 * @example
 * ```tsx
 * const { mutateAsync: confirm, isPending } = useConfirmInvoice();
 *
 * const handleConfirm = async () => {
 *   const response = await confirm({
 *     invoiceId: "inv-123",
 *     paymentMethod: "PAYU",
 *   });
 *   console.log("Payment link:", response.paymentLinkUrl);
 * };
 * ```
 */
export const useConfirmInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation<ConfirmInvoiceResponse, Error, ConfirmInvoiceRequest>({
    mutationFn: confirmInvoice,
    onSuccess: (data) => {
      // Update the invoice detail cache with new data
      queryClient.invalidateQueries({
        queryKey: invoiceKeys.detail(data.invoiceId),
      });
    },
  });
};

/**
 * Hook for downloading an invoice PDF.
 *
 * @returns Mutation object with mutate/mutateAsync function
 *
 * @example
 * ```tsx
 * const { mutateAsync: download, isPending } = useDownloadInvoicePdf();
 *
 * const handleDownload = async () => {
 *   const blob = await download("inv-123");
 *   const url = URL.createObjectURL(blob);
 *   const a = document.createElement("a");
 *   a.href = url;
 *   a.download = "invoice.pdf";
 *   a.click();
 * };
 * ```
 */
export const useDownloadInvoicePdf = () => {
  return useMutation<Blob, Error, string>({
    mutationFn: downloadInvoicePdf,
  });
};

/**
 * Hook for sending an invoice via email.
 *
 * @returns Mutation object with mutate/mutateAsync function
 *
 * @example
 * ```tsx
 * const { mutateAsync: sendEmail, isPending } = useSendInvoiceEmail();
 *
 * const handleSendEmail = async () => {
 *   await sendEmail({
 *     invoiceId: "inv-123",
 *     email: "customer@example.com",
 *   });
 *   toast.success("Invoice sent!");
 * };
 * ```
 */
export const useSendInvoiceEmail = () => {
  const queryClient = useQueryClient();

  return useMutation<
    Record<string, unknown>,
    Error,
    { invoiceId: string; email: string }
  >({
    mutationFn: ({ invoiceId, email }) => sendInvoiceEmail(invoiceId, email),
    onSuccess: () => {
      // Optionally invalidate lists if audit logs show new entries
      queryClient.invalidateQueries({ queryKey: invoiceKeys.lists() });
    },
  });
};

/**
 * Hook for regenerating an expired payment link.
 *
 * @returns Mutation object with mutate/mutateAsync function
 *
 * @example
 * ```tsx
 * const { mutateAsync: regenerate, isPending } = useRegeneratePaymentLink();
 *
 * const handleRegenerate = async () => {
 *   const response = await regenerate({
 *     invoiceId: "inv-123",
 *   });
 *   console.log("New link:", response.paymentLinkUrl);
 * };
 * ```
 */
export const useRegeneratePaymentLink = () => {
  const queryClient = useQueryClient();

  return useMutation<
    RegeneratePaymentLinkResponse,
    Error,
    RegeneratePaymentLinkRequest
  >({
    mutationFn: regeneratePaymentLink,
    onSuccess: (data) => {
      // Update the invoice detail cache
      queryClient.invalidateQueries({
        queryKey: invoiceKeys.detail(data.invoiceId),
      });
    },
  });
};
