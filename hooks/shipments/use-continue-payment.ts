import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { continueToPay } from "@/api/shipments";
import { useToast } from "@/hooks/use-toast";
import { ContinueToPayResponse } from "@/types/shipping";

interface ApiErrorResponse {
  message?: string;
}

export const useContinueToPay = () => {
  const { addToast } = useToast();

  const mutation = useMutation({
    mutationFn: (shipmentId: string) => continueToPay(shipmentId),
    onSuccess: (data: ContinueToPayResponse) => {
      // successful response, redirect to invoice or checkout
      const invoiceId = data.invoice?.invoiceId || data.invoice?.id;
      if (invoiceId) {
        window.location.href = `/app/invoices/${invoiceId}`;
      } else if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        addToast({
          message: "Payment URL not found. Please contact support.",
          type: "error",
        });
      }
    },
    onError: (error: AxiosError<ApiErrorResponse> | Error) => {
      console.error("Continue payment error:", error);
      const message =
        error instanceof AxiosError
          ? (error.response?.data?.message ?? error.message)
          : error.message;

      addToast({
        message: message || "Failed to initiate payment.",
        type: "error",
      });
    },
  });

  return {
    continueToPay: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
};
