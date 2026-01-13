import apiClient from "..";
import { VerifyPaymentResponse } from "@/types/shipping";

/**
 * Verifies a Stripe payment session.
 * @param sessionId - Stripe checkout session ID.
 */
export const verifyPayment = async (sessionId: string) => {
  const response = await apiClient.get<VerifyPaymentResponse>(
    `/payments/verify-payment?session_id=${sessionId}`
  );
  return response.data;
};
