/**
 * React Query hooks for customer freight inquiries.
 *
 * @module hooks/inquiries/use-inquiries
 * @see api/inquiries for the underlying API functions
 */

import { useMutation } from "@tanstack/react-query";
import { submitInquiry } from "@/api/inquiries";
import { InquiryPayload, InquiryResponse } from "@/types/inquiry";

/**
 * Hook to submit a freight inquiry from the marketing landing page.
 *
 * Kept side-effect free — the calling component owns the success panel and the
 * error banner so the copy can stay bilingual.
 *
 * @returns A mutation whose `mutateAsync` posts an {@link InquiryPayload}
 */
export const useSubmitInquiry = () => {
  return useMutation<InquiryResponse, Error, InquiryPayload>({
    mutationFn: (payload: InquiryPayload) => submitInquiry(payload),
  });
};
