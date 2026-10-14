import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getInvoices,
  downloadInvoicePdf,
  sendInvoiceEmail,
  getInvoice,
  InvoiceListParams,
} from "@/api/invoices";

/** One page of invoices. Status and search filtering happen in the caller. */
export const useGetInvoices = (params: InvoiceListParams) => {
  return useQuery({
    queryKey: ["get-invoices", params],
    queryFn: () => getInvoices(params),
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
