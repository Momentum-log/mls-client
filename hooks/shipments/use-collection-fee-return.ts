import { useEffect, useMemo, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { verifyPayment } from "@/api/payments";
import { useToast } from "@/hooks/use-toast";
import { extractApiError } from "@/utils/error-handler";
import { fulfillmentKeys } from "./use-fulfillment";

/** PayU can sit in PENDING for a while; give up polling after about two minutes. */
const MAX_PENDING_POLLS = 24;

/**
 * Settles a collection-fee payment when the gateway sends the customer back to
 * `/app/shipments/{id}?collection_fee=verify&…` (or `=cancelled`).
 *
 * The query string the gateway returned is passed to `verify-payment` as is:
 * `session_id` for Stripe, `gateway=payu&collection_fee_id` for PayU. A PayU
 * `PENDING` is polled, never shown as a failure, since the customer may already
 * have paid. The webhook settles the fee too, so a verify that cannot finish is
 * not lost money.
 *
 * @returns Whether a verification is in progress, for an inline notice.
 */
export const useCollectionFeeReturn = (shipmentId?: string) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const handled = useRef(false);

  const flag = searchParams.get("collection_fee");
  const verifyQuery = useMemo(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("collection_fee");
    return params.toString();
  }, [searchParams]);

  const { data, error, isFetching } = useQuery({
    queryKey: ["collection-fee-verify", verifyQuery],
    queryFn: () => verifyPayment(verifyQuery),
    enabled: flag === "verify" && Boolean(verifyQuery),
    retry: false,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchInterval: (query) => {
      const result = query.state.data;
      if (result?.status !== "PENDING") return false;
      if (query.state.dataUpdateCount >= MAX_PENDING_POLLS) return false;
      return (result.retryAfterSeconds ?? 5) * 1000;
    },
  });

  const pollCount =
    queryClient.getQueryState(["collection-fee-verify", verifyQuery])
      ?.dataUpdateCount ?? 0;
  const stillPending =
    data?.status === "PENDING" && pollCount >= MAX_PENDING_POLLS;
  const settled =
    flag === "cancelled" ||
    (flag === "verify" && !verifyQuery) ||
    Boolean(error) ||
    (data && (data.status !== "PENDING" || stillPending));

  useEffect(() => {
    if (!flag || !settled || handled.current) return;
    handled.current = true;

    if (flag === "cancelled") {
      addToast({
        title: "Collection Fee Not Paid",
        message: "You can pay it any time from this page.",
        type: "info",
      });
    } else if (error) {
      addToast({
        title: "Couldn't Confirm Payment",
        message:
          extractApiError(error).message ||
          "If you were charged, we'll confirm your collection by email.",
        type: "error",
      });
    } else if (data?.status === "SUCCESS") {
      addToast({
        title: "Collection Confirmed",
        message: "Your fee is paid. We'll be in touch to arrange the collection.",
        type: "success",
      });
    } else if (data?.status === "PENDING") {
      addToast({
        title: "Payment Still Processing",
        message: "PayU hasn't finished yet. We'll confirm your collection by email.",
        type: "info",
      });
    } else if (data) {
      addToast({
        title: "Payment Not Completed",
        message: data.message || "The collection fee wasn't paid. You can try again.",
        type: "error",
      });
    }

    if (shipmentId) {
      queryClient.invalidateQueries({
        queryKey: fulfillmentKeys.options(shipmentId),
      });
    }
    queryClient.invalidateQueries({ queryKey: ["shipment"] });
    router.replace(pathname, { scroll: false });
  }, [flag, settled, data, error, shipmentId, addToast, queryClient, router, pathname]);

  return { isVerifying: flag === "verify" && !settled && (isFetching || data?.status === "PENDING") };
};
