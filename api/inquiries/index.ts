/**
 * Inquiry API Functions
 *
 * Pure API functions for customer freight inquiries using the shared apiClient
 * instance. Each function is focused on a single API endpoint and returns raw
 * response data.
 *
 * @module api/inquiries
 * @see hooks/inquiries for React Query wrapped versions
 */

import apiClient from "../index";
import { InquiryPayload, InquiryResponse } from "@/types/inquiry";

/**
 * Submits a customer logistics/freight inquiry from the marketing site.
 *
 * Goes through the shared `apiClient` so the request picks up the configured
 * base URL along with the `X-Guest-ID` and `X-MLS-Key` headers applied by the
 * request interceptor.
 *
 * @param data - Contact details, freight modes and free-text description
 * @returns The persisted inquiry, including its generated id and status
 */
export const submitInquiry = async (
  data: InquiryPayload,
): Promise<InquiryResponse> => {
  const response = await apiClient.post<InquiryResponse>("/inquiries", data);
  return response.data;
};
