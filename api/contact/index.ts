/**
 * Contact form API: `POST /contact` (public). The message is saved on the
 * server, emailed to the company mailbox and answered from the admin dashboard.
 *
 * @module api/contact
 */

import apiClient from "../index";

export interface ContactPayload {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  locale?: "en" | "pl";
  /** Honeypot: always sent empty by real visitors. */
  website?: string;
}

export const sendContactMessage = async (data: ContactPayload): Promise<void> => {
  await apiClient.post("/contact", data);
};
