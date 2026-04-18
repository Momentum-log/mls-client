/**
 * Email Invoice Modal Component
 *
 * Modal form for sending invoices via email with validation, multiple recipients,
 * and confirmation. Handles email validation, deduplication, and error handling.
 *
 * @module components/invoice/EmailInvoiceModal
 */

import React, { useState } from "react";
import {
  validateEmail,
  formatEmailSubject,
  validateEmailWithSuggestions,
  sanitizeEmail,
} from "@/utils/email-helper";
import { cn } from "@/utils/cn";

/**
 * Props for EmailInvoiceModal component
 */
interface EmailInvoiceModalProps {
  /** Invoice number for email subject line */
  invoiceNumber: string;
  /** Callback when form is submitted */
  onSend: (emails: string[]) => Promise<void> | void;
  /** Callback when modal is closed */
  onClose: () => void;
  /** Whether modal is open */
  isOpen?: boolean;
  /** Loading state during submission */
  isLoading?: boolean;
  /** Error message to display */
  error?: string | null;
  /** Optional additional CSS classes */
  className?: string;
}

interface EmailInput {
  id: string;
  value: string;
  error?: string;
  suggestion?: string;
}

/**
 * Modal component for sending invoice via email
 *
 * Features:
 * - Multiple email input fields with add/remove
 * - Real-time email validation with typo suggestions
 * - Deduplication of email addresses
 * - Subject line preview
 * - Accessibility support (ARIA labels)
 *
 * @example
 * ```tsx
 * <EmailInvoiceModal
 *   invoiceNumber="INV-2024-001"
 *   isOpen={isModalOpen}
 *   onClose={() => setIsModalOpen(false)}
 *   onSend={async (emails) => await sendEmails(emails)}
 * />
 * ```
 */
export const EmailInvoiceModal: React.FC<EmailInvoiceModalProps> = ({
  invoiceNumber,
  onSend,
  onClose,
  isOpen = true,
  isLoading = false,
  error = null,
  className,
}) => {
  const [emails, setEmails] = useState<EmailInput[]>([
    { id: "email-0", value: "", error: undefined, suggestion: undefined },
  ]);

  if (!isOpen) return null;

  /**
   * Validate single email and update state with error/suggestion
   */
  const validateSingleEmail = (input: EmailInput): EmailInput => {
    const sanitized = sanitizeEmail(input.value);

    if (!sanitized) {
      return {
        ...input,
        value: sanitized,
        error: undefined,
        suggestion: undefined,
      };
    }

    if (!validateEmail(sanitized)) {
      const validated = validateEmailWithSuggestions(sanitized);
      const suggestion = validated.suggestions?.[0];
      if (suggestion && suggestion !== sanitized) {
        return {
          ...input,
          value: sanitized,
          error: validated.isValid ? undefined : "Invalid email format",
          suggestion,
        };
      }
      return {
        ...input,
        value: sanitized,
        error: "Invalid email format",
        suggestion: undefined,
      };
    }

    return {
      ...input,
      value: sanitized,
      error: undefined,
      suggestion: undefined,
    };
  };

  /**
   * Add new email input field
   */
  const handleAddEmail = () => {
    const newId = `email-${emails.length}`;
    setEmails([
      ...emails,
      { id: newId, value: "", error: undefined, suggestion: undefined },
    ]);
  };

  /**
   * Remove email input field
   */
  const handleRemoveEmail = (id: string) => {
    setEmails(emails.filter((e) => e.id !== id));
  };

  /**
   * Update email input value
   */
  const handleEmailChange = (id: string, value: string) => {
    setEmails(
      emails.map((e) =>
        e.id === id
          ? { ...e, value, error: undefined, suggestion: undefined }
          : e,
      ),
    );
  };

  /**
   * Handle email blur - validate on blur
   */
  const handleEmailBlur = (id: string) => {
    setEmails(emails.map((e) => (e.id === id ? validateSingleEmail(e) : e)));
  };

  /**
   * Apply suggestion and clear error
   */
  const handleApplySuggestion = (id: string) => {
    setEmails(
      emails.map((e) =>
        e.id === id && e.suggestion
          ? {
              ...e,
              value: e.suggestion,
              error: undefined,
              suggestion: undefined,
            }
          : e,
      ),
    );
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all emails
    const validatedEmails = emails.map(validateSingleEmail);
    setEmails(validatedEmails);

    // Filter out errors
    const validEmails = validatedEmails
      .filter((e) => e.value && !e.error)
      .map((e) => e.value);

    // Deduplicate
    const uniqueEmails = Array.from(new Set(validEmails));

    if (uniqueEmails.length === 0) {
      return;
    }

    try {
      await onSend(uniqueEmails);
    } catch (err) {
      // Error handled by parent component
      console.error("Error sending emails:", err);
    }
  };

  // Get valid email count
  const validEmailCount = emails.filter((e) => e.value && !e.error).length;
  const subjectLine = formatEmailSubject(invoiceNumber, "Momentum Logistics");

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
        role="presentation"
      />

      {/* Modal */}
      <div
        className={cn(
          "fixed inset-0 z-50 flex items-center justify-center p-4",
          className,
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="email-modal-title"
      >
        <div className="w-full max-w-md rounded-lg bg-white shadow-lg">
          {/* Header */}
          <div className="border-b border-gray-200 px-6 py-4">
            <h2
              id="email-modal-title"
              className="text-lg font-semibold text-gray-900"
            >
              Send Invoice via Email
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Invoice: {invoiceNumber}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 px-6 py-4">
            {/* Subject Preview */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email Subject
              </label>
              <div className="mt-1 rounded-md bg-gray-50 px-3 py-2 text-sm text-gray-600 truncate">
                {subjectLine}
              </div>
            </div>

            {/* Email Inputs */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recipients
              </label>
              <div className="space-y-3">
                {emails.map((email, index) => (
                  <div key={email.id} className="space-y-1">
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <input
                          type="email"
                          value={email.value}
                          onChange={(e) =>
                            handleEmailChange(email.id, e.target.value)
                          }
                          onBlur={() => handleEmailBlur(email.id)}
                          placeholder="recipient@example.com"
                          className={cn(
                            "w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500",
                            email.error
                              ? "border-red-300 bg-red-50"
                              : "border-gray-300 bg-white",
                          )}
                          aria-label={`Email recipient ${index + 1}`}
                          disabled={isLoading}
                        />
                      </div>
                      {emails.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveEmail(email.id)}
                          className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                          aria-label={`Remove email ${index + 1}`}
                          disabled={isLoading}
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    {/* Error Message */}
                    {email.error && (
                      <p className="text-xs text-red-600 flex items-center gap-1">
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 12 12"
                          fill="currentColor"
                        >
                          <circle cx="6" cy="6" r="6" />
                        </svg>
                        {email.error}
                      </p>
                    )}

                    {/* Suggestion */}
                    {email.suggestion && !email.error && (
                      <div className="flex items-center gap-2 rounded-md bg-blue-50 px-3 py-2">
                        <p className="flex-1 text-xs text-blue-800">
                          Did you mean{" "}
                          <span className="font-medium">
                            {email.suggestion}
                          </span>
                          ?
                        </p>
                        <button
                          type="button"
                          onClick={() => handleApplySuggestion(email.id)}
                          className="shrink-0 text-xs font-medium text-blue-600 hover:text-blue-800 disabled:opacity-50"
                          disabled={isLoading}
                        >
                          Use
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Add Email Button */}
              <button
                type="button"
                onClick={handleAddEmail}
                className="mt-3 rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                disabled={isLoading}
              >
                + Add Another Email
              </button>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="rounded-md bg-red-50 p-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* Info */}
            {validEmailCount > 0 && (
              <p className="text-xs text-gray-500">
                Will send to {validEmailCount} recipient
                {validEmailCount !== 1 ? "s" : ""}
              </p>
            )}
          </form>

          {/* Footer */}
          <div className="flex gap-3 border-t border-gray-200 px-6 py-4">
            <button
              onClick={onClose}
              className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading || validEmailCount === 0}
              className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {isLoading ? "Sending..." : "Send Invoice"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

EmailInvoiceModal.displayName = "EmailInvoiceModal";
