/**
 * Types for customer freight inquiries submitted from the marketing landing page.
 *
 * Mirrors `POST /inquiries` in `openapi.json`.
 *
 * @module types/inquiry
 */

/** Transport modes a prospect can enquire about. */
export type FreightType = "ROAD" | "SEA" | "AIR";

/** Lifecycle of an inquiry, as managed by the admin console. */
export type InquiryStatus = "PENDING" | "CONTACTED" | "RESOLVED";

/**
 * Request body for `POST /inquiries`.
 *
 * Every field is required by the API. `description` in particular must be sent
 * even when the prospect leaves the textarea empty — send `""`, never omit it.
 */
export interface InquiryPayload {
  /** Contact's full name. */
  name: string;
  /** Company the enquiry is on behalf of. */
  companyName: string;
  /** Reply-to email address. */
  email: string;
  /** Contact phone number, including country code. */
  phone: string;
  /** Transport modes of interest. The API expects uppercase enum values. */
  freightTypes: FreightType[];
  /** Free-text detail: routes, volumes, type of goods. */
  description: string;
}

/** The persisted inquiry returned by `POST /inquiries` on success (201). */
export interface InquiryResponse extends InquiryPayload {
  id: string;
  status: InquiryStatus;
  createdAt: string;
  updatedAt: string;
}
