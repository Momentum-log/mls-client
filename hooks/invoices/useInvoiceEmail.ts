/**
 * Email Invoice Hook
 *
 * Specialized hook for handling invoice email delivery with validation,
 * debouncing, and error handling.
 *
 * @module hooks/invoices/useInvoiceEmail
 */

import { useState, useCallback, useRef } from "react";
import { validateEmail } from "@/utils/email-helper";
import { useAuth } from "@/hooks/useAuth";

/**
 * Response from email send operation
 */
interface EmailSendResponse {
  success: boolean;
  message: string;
  sentAt: string;
}

/**
 * State and methods returned by useInvoiceEmail hook
 */
interface UseInvoiceEmailReturn {
  // State
  sendingEmail: boolean;
  emailError: string | null;
  lastSentEmail: string | null;
  lastSentTime: Date | null;

  // Methods
  sendInvoiceEmail: (
    invoiceId: string,
    recipientEmail: string,
  ) => Promise<boolean>;
  validateAndSend: (
    invoiceId: string,
    recipientEmail: string,
  ) => Promise<boolean>;
  clearError: () => void;
  clearLastSent: () => void;
}

/**
 * Hook for managing invoice email delivery
 *
 * Provides methods to:
 * - Send invoices via email to customer
 * - Validate email addresses before sending
 * - Debounce rapid send attempts
 * - Handle email delivery errors
 *
 * @returns Object containing email state and methods
 *
 * @example
 * ```tsx
 * const { sendInvoiceEmail, sendingEmail, emailError } = useInvoiceEmail();
 *
 * const handleSendEmail = async () => {
 *   const success = await sendInvoiceEmail("invoice-123", "customer@example.com");
 *   if (success) {
 *     toast.success("Invoice sent successfully!");
 *   }
 * };
 * ```
 */
export const useInvoiceEmail = (): UseInvoiceEmailReturn => {
  const { accessToken } = useAuth();
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [lastSentEmail, setLastSentEmail] = useState<string | null>(null);
  const [lastSentTime, setLastSentTime] = useState<Date | null>(null);

  // Debounce tracking
  const lastSendAttemptRef = useRef<number>(0);
  const debounceDelayMs = 1000; // Prevent sending more than once per second

  const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:3000";
  const apiUrl = `${baseUrl}/api`;

  /**
   * Sends invoice email to specified recipient
   */
  const sendInvoiceEmail = useCallback(
    async (invoiceId: string, recipientEmail: string): Promise<boolean> => {
      setSendingEmail(true);
      setEmailError(null);

      try {
        if (!accessToken) {
          throw new Error("Not authenticated. Please log in.");
        }

        if (!invoiceId || !recipientEmail) {
          throw new Error("Invoice ID and recipient email are required.");
        }

        // Check debounce
        const now = Date.now();
        if (now - lastSendAttemptRef.current < debounceDelayMs) {
          throw new Error("Please wait before attempting to send again.");
        }
        lastSendAttemptRef.current = now;

        const response = await fetch(
          `${apiUrl}/invoices/${invoiceId}/send-email`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              recipientEmail,
              deliveryMethod: "email",
            }),
          },
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({
            message: response.statusText,
          }));
          throw new Error(
            errorData.message ||
              `HTTP ${response.status}: Failed to send email`,
          );
        }

        const data: EmailSendResponse = await response.json();
        setLastSentEmail(recipientEmail);
        setLastSentTime(new Date());

        console.log("Invoice email sent successfully:", data.message);
        return true;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to send email";
        setEmailError(errorMessage);
        console.error("Email send error:", errorMessage);
        return false;
      } finally {
        setSendingEmail(false);
      }
    },
    [accessToken, apiUrl],
  );

  /**
   * Validates email and then sends invoice
   */
  const validateAndSend = useCallback(
    async (invoiceId: string, recipientEmail: string): Promise<boolean> => {
      setEmailError(null);

      // Trim and normalize email
      const normalizedEmail = recipientEmail.trim().toLowerCase();

      // Validate email format
      if (!validateEmail(normalizedEmail)) {
        const errorMessage = "Please enter a valid email address.";
        setEmailError(errorMessage);
        console.warn("Email validation failed:", normalizedEmail);
        return false;
      }

      // Check if already sent to this email recently (within 5 seconds)
      if (
        lastSentEmail === normalizedEmail &&
        lastSentTime &&
        Date.now() - lastSentTime.getTime() < 5000
      ) {
        const errorMessage =
          "Invoice was just sent to this email. Please wait and try again.";
        setEmailError(errorMessage);
        return false;
      }

      // Proceed with sending
      return sendInvoiceEmail(invoiceId, normalizedEmail);
    },
    [lastSentEmail, lastSentTime, sendInvoiceEmail],
  );

  /**
   * Clears error state
   */
  const clearError = useCallback(() => {
    setEmailError(null);
  }, []);

  /**
   * Clears last sent tracking
   */
  const clearLastSent = useCallback(() => {
    setLastSentEmail(null);
    setLastSentTime(null);
  }, []);

  return {
    sendingEmail,
    emailError,
    lastSentEmail,
    lastSentTime,
    sendInvoiceEmail,
    validateAndSend,
    clearError,
    clearLastSent,
  };
};
