import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getInvoices,
  downloadInvoicePdf,
  sendInvoiceEmail,
  getInvoice,
} from "@/api/invoices";
import { InvoiceStatus } from "@/types/invoice";

interface GetInvoicesParams {
  limit: number;
  offset: number;
  status?: InvoiceStatus | "all";
  invoiceNumber?: string;
  customerEmail?: string;
  dateFrom?: string;
  dateTo?: string;
  minAmount?: number;
  maxAmount?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export const useGetInvoices = (params: GetInvoicesParams) => {
  return useQuery({
    queryKey: ["get-invoices", params],
    queryFn: () =>
      getInvoices({
        ...params,
        status: params.status === "all" ? undefined : params.status,
      }),
  });
};

export const useGetInvoice = (invoiceId: string, enabled = true) => {
  return useQuery({
    queryKey: ["get-invoice", invoiceId],
    queryFn: () => getInvoice(invoiceId),
    enabled: !!invoiceId && enabled,
  });
};

export const useDownloadInvoicePdf = () => {
  return useMutation({
    mutationFn: (id: string) => downloadInvoicePdf(id),
  });
};

export const useEmailInvoice = () => {
  return useMutation({
    mutationFn: (data: { id: string; email: string }) =>
      sendInvoiceEmail(data.id, data.email),
  });
};
