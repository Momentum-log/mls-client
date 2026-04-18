/**
 * Notification/Toast Hook for Invoice Operations
 *
 * Provides React hooks and utilities for displaying toast notifications for invoice
 * operations success, error, and warning states. Integrates with react-hot-toast.
 *
 * @module hooks/useNotification
 */

import { useCallback } from "react";
import toast from "react-hot-toast";

/**
 * Notification types
 */
export type NotificationType = "success" | "error" | "info" | "warning";

/**
 * Notification options
 */
export interface NotificationOptions {
  /** Duration in milliseconds (0 = never auto-close) */
  duration?: number;
  /** Custom icon */
  icon?: string;
  /** Toast position on screen */
  position?:
    | "top-left"
    | "top-center"
    | "top-right"
    | "bottom-left"
    | "bottom-center"
    | "bottom-right";
  /** Additional class names */
  className?: string;
  /** Whether to show action button for retry */
  showRetryButton?: boolean;
  /** Callback for retry action */
  onRetry?: () => void | Promise<void>;
}

/**
 * Invoice-specific notification messages
 */
export const INVOICE_NOTIFICATIONS = {
  // Success messages
  INVOICE_GENERATED: "Invoice generated successfully",
  INVOICE_CONFIRMED: "Invoice confirmed successfully",
  INVOICE_DOWNLOADED: "Invoice downloaded successfully",
  INVOICE_EMAIL_SENT: "Invoice email sent successfully",
  INVOICE_DELETED: "Invoice deleted successfully",
  INVOICE_RESTORED: "Invoice restored successfully",
  PAYMENT_LINK_REGENERATED: "Payment link regenerated successfully",

  // Error messages
  INVOICE_GENERATION_FAILED: "Failed to generate invoice. Please try again.",
  INVOICE_CONFIRMATION_FAILED: "Failed to confirm invoice. Please try again.",
  INVOICE_DOWNLOAD_FAILED: "Failed to download invoice. Please try again.",
  INVOICE_EMAIL_FAILED: "Failed to send invoice email. Please try again.",
  INVOICE_DELETE_FAILED: "Failed to delete invoice. Please try again.",
  INVOICE_RESTORE_FAILED: "Failed to restore invoice. Please try again.",
  PAYMENT_LINK_REGENERATION_FAILED:
    "Failed to regenerate payment link. Please try again.",

  // Warning messages
  PAYMENT_LINK_EXPIRING: (hours: number) =>
    `Payment link expires in ${hours} hour(s)`,
  PAYMENT_LINK_EXPIRED:
    "Payment link has expired. Please regenerate to continue.",
  INVOICE_NOT_FOUND: "Invoice not found. It may have been deleted.",
} as const;

/**
 * Hook for displaying toast notifications
 *
 * @returns Object with notification methods
 *
 * @example
 * ```tsx
 * const { success, error, info, warning } = useNotification();
 *
 * const handleDownload = async () => {
 *   try {
 *     await downloadInvoice();
 *     success(INVOICE_NOTIFICATIONS.INVOICE_DOWNLOADED);
 *   } catch (err) {
 *     error(INVOICE_NOTIFICATIONS.INVOICE_DOWNLOAD_FAILED, {
 *       showRetryButton: true,
 *       onRetry: handleDownload,
 *     });
 *   }
 * };
 * ```
 */
export const useNotification = () => {
  /**
   * Show success notification
   */
  const success = useCallback(
    (message: string, options?: NotificationOptions) => {
      const toastOptions = {
        duration: options?.duration ?? 3000,
        position: options?.position ?? ("top-right" as const),
        className: options?.className,
      };

      return toast.success(message, toastOptions);
    },
    [],
  );

  /**
   * Show error notification with optional retry button
   */
  const error = useCallback(
    (message: string, options?: NotificationOptions) => {
      const toastOptions = {
        duration: options?.duration ?? 5000,
        position: options?.position ?? ("top-right" as const),
        className: options?.className,
      };

      if (options?.showRetryButton && options?.onRetry) {
        return toast.error(message, {
          ...toastOptions,
          action: {
            label: "Retry",
            onClick: async () => {
              await options.onRetry?.();
            },
          },
        } as any);
      }

      return toast.error(message, toastOptions);
    },
    [],
  );

  /**
   * Show info notification
   */
  const info = useCallback((message: string, options?: NotificationOptions) => {
    const toastOptions = {
      duration: options?.duration ?? 4000,
      position: options?.position ?? ("top-right" as const),
      className: options?.className,
    };

    return toast(message, toastOptions);
  }, []);

  /**
   * Show warning notification
   */
  const warning = useCallback(
    (message: string, options?: NotificationOptions) => {
      const toastOptions = {
        duration: options?.duration ?? 4000,
        position: options?.position ?? ("top-right" as const),
        className: options?.className,
      };

      return toast(message, toastOptions);
    },
    [],
  );

  /**
   * Show loading toast (useful for long operations)
   */
  const loading = useCallback((message: string) => {
    return toast.loading(message, {
      position: "top-right",
    });
  }, []);

  /**
   * Update existing toast
   */
  const update = useCallback(
    (toastId: string, message: string, type: NotificationType = "info") => {
      if (type === "success") {
        toast.success(message, { id: toastId });
      } else if (type === "error") {
        toast.error(message, { id: toastId });
      } else {
        toast(message, { id: toastId });
      }
    },
    [],
  );

  /**
   * Dismiss specific toast or all toasts
   */
  const dismiss = useCallback((toastId?: string) => {
    if (toastId) {
      toast.dismiss(toastId);
    } else {
      toast.dismiss();
    }
  }, []);

  return {
    success,
    error,
    info,
    warning,
    loading,
    update,
    dismiss,
  };
};

/**
 * Notification utilities for invoice operations
 */
export const invoiceNotifications = {
  /**
   * Notify successful invoice generation
   */
  notifyInvoiceGenerated: (invoiceNumber: string) => {
    toast.success(`Invoice ${invoiceNumber} generated successfully`, {
      duration: 3000,
    });
  },

  /**
   * Notify successful invoice download
   */
  notifyInvoiceDownloaded: (invoiceNumber: string) => {
    toast.success(`Invoice ${invoiceNumber} downloaded`, {
      duration: 3000,
    });
  },

  /**
   * Notify successful email send
   */
  notifyEmailSent: (recipientCount: number) => {
    toast.success(
      `Invoice sent to ${recipientCount} recipient${recipientCount !== 1 ? "s" : ""}`,
      {
        duration: 3000,
      },
    );
  },

  /**
   * Notify payment link expiring soon
   */
  notifyPaymentLinkExpiringSoon: (
    hoursRemaining: number,
    onRegenerate?: () => void,
  ) => {
    toast(
      `⚠️ Payment link expires in ${hoursRemaining} hour${hoursRemaining !== 1 ? "s" : ""}`,
      {
        duration: 0,
        position: "top-center",
        action: onRegenerate
          ? {
              label: "Regenerate",
              onClick: onRegenerate,
            }
          : undefined,
      } as any,
    );
  },

  /**
   * Notify error with retry option
   */
  notifyError: (message: string, onRetry?: () => Promise<void>) => {
    return toast.error(message, {
      duration: 0,
      position: "top-right",
      action: onRetry
        ? {
            label: "Retry",
            onClick: onRetry,
          }
        : undefined,
    } as any);
  },
};
