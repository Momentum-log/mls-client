import { useMutation } from "@tanstack/react-query";
import { continueToPay } from "@/api/shipments";
import { useToast } from "@/hooks/use-toast";

export const useContinueToPay = () => {
  const { addToast } = useToast();

  const mutation = useMutation({
    mutationFn: (shipmentId: string) => continueToPay(shipmentId),
    onSuccess: (data) => {
      // successful response, redirect to checkout
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        addToast({
          message: "Payment URL not found. Please contact support.",
          type: "error",
        });
      }
    },
    onError: (error: any) => {
      console.error("Continue payment error:", error);
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to initiate payment.";

      addToast({
        message,
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
