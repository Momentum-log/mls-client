/**
 * Error Handling Utility for Invoice Operations
 *
 * Provides centralized error handling, user-friendly error messages, and retry logic
 * for all invoice API operations including error categorization and logging.
 *
 * @module utils/error-handler
 */

import { ErrorResponse, TypedApiError } from "@/types/invoice";

/**
 * Error categories for different error types
 */
export enum ErrorCategory {
  /** Network/connection errors (4xx HTTP) */
  CLIENT_ERROR = "CLIENT_ERROR",
  /** Server errors (5xx HTTP) */
  SERVER_ERROR = "SERVER_ERROR",
  /** Validation errors (400 with specific message) */
  VALIDATION_ERROR = "VALIDATION_ERROR",
  /** Authorization errors (401/403) */
  AUTH_ERROR = "AUTH_ERROR",
  /** Resource not found (404) */
  NOT_FOUND_ERROR = "NOT_FOUND_ERROR",
  /** Conflict/state errors (409) */
  CONFLICT_ERROR = "CONFLICT_ERROR",
  /** Network timeout */
  TIMEOUT_ERROR = "TIMEOUT_ERROR",
  /** Unexpected errors */
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

/**
 * User-friendly error message structure
 */
export interface UserFriendlyError {
  /** Machine-readable category */
  category: ErrorCategory;
  /** User-facing error message */
  message: string;
  /** Technical error details (for logging) */
  details?: string;
  /** Whether error is retryable */
  isRetryable: boolean;
  /** HTTP status code if applicable */
  statusCode?: number;
}

/**
 * Default error messages for different error types
 */
const DEFAULT_ERROR_MESSAGES: Record<ErrorCategory, string> = {
  [ErrorCategory.CLIENT_ERROR]:
    "There was an issue with your request. Please check your data and try again.",
  [ErrorCategory.SERVER_ERROR]:
    "Our server is having trouble. Please try again in a moment.",
  [ErrorCategory.VALIDATION_ERROR]:
    "Please check your information and try again.",
  [ErrorCategory.AUTH_ERROR]: "You need to log in again to continue.",
  [ErrorCategory.NOT_FOUND_ERROR]: "The requested invoice could not be found.",
  [ErrorCategory.CONFLICT_ERROR]:
    "This invoice has been modified. Please refresh and try again.",
  [ErrorCategory.TIMEOUT_ERROR]: "The request took too long. Please try again.",
  [ErrorCategory.UNKNOWN_ERROR]: "Something went wrong. Please try again.",
};

/**
 * Categorize error by status code and error details
 */
const categorizeError = (
  status?: number,
  errorMessage?: string,
): ErrorCategory => {
  if (status === 400) {
    // Check if it's a validation error
    if (
      errorMessage?.toLowerCase().includes("validation") ||
      errorMessage?.toLowerCase().includes("invalid")
    ) {
      return ErrorCategory.VALIDATION_ERROR;
    }
    return ErrorCategory.CLIENT_ERROR;
  }
  if (status === 401 || status === 403) return ErrorCategory.AUTH_ERROR;
  if (status === 404) return ErrorCategory.NOT_FOUND_ERROR;
  if (status === 409) return ErrorCategory.CONFLICT_ERROR;
  if (status && status >= 400 && status < 500)
    return ErrorCategory.CLIENT_ERROR;
  if (status && status >= 500) return ErrorCategory.SERVER_ERROR;
  return ErrorCategory.UNKNOWN_ERROR;
};

/**
 * Check if error is retryable based on category and status code
 */
const isErrorRetryable = (
  category: ErrorCategory,
  status?: number,
): boolean => {
  // Retryable errors
  const retryableCategories = [
    ErrorCategory.SERVER_ERROR,
    ErrorCategory.TIMEOUT_ERROR,
  ];

  // Non-retryable status codes
  const nonRetryableStatuses = [401, 403, 404, 409];

  if (nonRetryableStatuses.includes(status || 0)) return false;
  return retryableCategories.includes(category);
};

/**
 * Get user-friendly error message based on error type
 */
const getUserFriendlyMessage = (
  category: ErrorCategory,
  errorDetails?: string,
): string => {
  // Override with specific error message if provided
  if (errorDetails && errorDetails.length > 0 && errorDetails.length < 200) {
    return errorDetails;
  }

  return DEFAULT_ERROR_MESSAGES[category];
};

/**
 * Handle API error response and return formatted error
 *
 * @param error - Error object from API or native Error
 * @returns UserFriendlyError object with categorized, retryable status
 *
 * @example
 * ```ts
 * try {
 *   await generateInvoice(data);
 * } catch (error) {
 *   const handled = handleApiError(error);
 *   console.error(handled.message);
 *   if (handled.isRetryable) {
 *     // Show retry button
 *   }
 * }
 * ```
 */
export const handleApiError = (error: unknown): UserFriendlyError => {
  // Handle typed API error
  if (error && typeof error === "object" && "response" in error) {
    const errorObj = error as any;
    const status = errorObj.response?.status;
    const errorData = errorObj.response?.data as ErrorResponse | undefined;
    const errorMessage = errorData?.message || (errorData as any)?.error;

    const category = categorizeError(status, errorMessage);
    const isRetryable = isErrorRetryable(category, status);
    const message = getUserFriendlyMessage(category, errorMessage);

    if (process.env.NODE_ENV === "development") {
      console.error("[Invoice API Error]", {
        category,
        status,
        message: errorMessage,
        details: errorData?.details,
      });
    }

    return {
      category,
      message,
      details: errorMessage,
      isRetryable,
      statusCode: status,
    };
  }

  // Handle timeout error
  if (error instanceof Error && error.name === "AbortError") {
    if (process.env.NODE_ENV === "development") {
      console.error("[Invoice Timeout Error]", error.message);
    }

    return {
      category: ErrorCategory.TIMEOUT_ERROR,
      message: DEFAULT_ERROR_MESSAGES[ErrorCategory.TIMEOUT_ERROR],
      details: "Request timeout after 30 seconds",
      isRetryable: true,
    };
  }

  // Handle network error
  if (error instanceof Error && error.message.includes("fetch")) {
    if (process.env.NODE_ENV === "development") {
      console.error("[Invoice Network Error]", error.message);
    }

    return {
      category: ErrorCategory.UNKNOWN_ERROR,
      message:
        "Network connection error. Please check your internet connection.",
      details: error.message,
      isRetryable: true,
    };
  }

  // Handle native Error
  if (error instanceof Error) {
    if (process.env.NODE_ENV === "development") {
      console.error("[Invoice Error]", error);
    }

    return {
      category: ErrorCategory.UNKNOWN_ERROR,
      message: DEFAULT_ERROR_MESSAGES[ErrorCategory.UNKNOWN_ERROR],
      details: error.message,
      isRetryable: false,
    };
  }

  // Handle unknown error
  if (process.env.NODE_ENV === "development") {
    console.error("[Invoice Unknown Error]", error);
  }

  return {
    category: ErrorCategory.UNKNOWN_ERROR,
    message: DEFAULT_ERROR_MESSAGES[ErrorCategory.UNKNOWN_ERROR],
    isRetryable: false,
  };
};

/**
 * Handle form validation errors from API
 *
 * @param error - API error response
 * @returns Map of field names to error messages
 *
 * @example
 * ```ts
 * const fieldErrors = handleValidationError(apiError);
 * // { email: "Invalid email format", amount: "Must be positive" }
 * ```
 */
export const handleValidationError = (
  error: unknown,
): Record<string, string> | null => {
  try {
    if (error && typeof error === "object" && "response" in error) {
      const errorObj = error as any;
      const errorData = errorObj.response?.data as ErrorResponse | undefined;

      // Check if it's a validation error with field-specific errors
      if (errorData?.details && typeof errorData.details === "object") {
        const fieldErrors: Record<string, string> = {};

        // Handle nested validation errors
        for (const [field, fieldError] of Object.entries(errorData.details)) {
          if (typeof fieldError === "string") {
            fieldErrors[field] = fieldError;
          } else if (Array.isArray(fieldError) && fieldError.length > 0) {
            fieldErrors[field] = fieldError[0];
          }
        }

        return Object.keys(fieldErrors).length > 0 ? fieldErrors : null;
      }
    }

    return null;
  } catch {
    return null;
  }
};

/**
 * Create error boundary component for catching React errors
 *
 * @example
 * ```tsx
 * <ErrorBoundary fallback={<ErrorFallback />}>
 *   <InvoiceList />
 * </ErrorBoundary>
 * ```
 */
export interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error) => void;
}

/**
 * Parse specific invoice API error codes
 *
 * @param statusCode - HTTP status code
 * @param message - Error message from API
 * @returns Specific error context for invoice operations
 */
export const parseInvoiceError = (
  statusCode: number,
  message: string,
): {
  userMessage: string;
  action?: "retry" | "contact_support" | "regenerate_link" | "re_authenticate";
} => {
  // Payment link expired (409)
  if (statusCode === 409 && message.toLowerCase().includes("payment link")) {
    return {
      userMessage:
        "The payment link for this invoice has expired. Please regenerate it.",
      action: "regenerate_link",
    };
  }

  // Invoice not found (404)
  if (statusCode === 404) {
    return {
      userMessage: "This invoice could not be found. It may have been deleted.",
      action: "contact_support",
    };
  }

  // Unauthorized (401)
  if (statusCode === 401) {
    return {
      userMessage: "Your session has expired. Please log in again.",
      action: "re_authenticate",
    };
  }

  // Validation error (400)
  if (statusCode === 400) {
    return {
      userMessage: message || "Please check your information and try again.",
    };
  }

  // Server error (5xx)
  if (statusCode >= 500) {
    return {
      userMessage:
        "Our server is experiencing issues. Please try again in a moment.",
      action: "retry",
    };
  }

  // Default
  return {
    userMessage: "Something went wrong. Please try again.",
  };
};

/**
 * Format error for logging/debugging in development
 */
export const formatErrorForLogging = (
  error: UserFriendlyError,
  context?: Record<string, unknown>,
): void => {
  if (process.env.NODE_ENV !== "development") return;

  console.group(`[Invoice Error] ${error.category}`);
  console.error("User Message:", error.message);
  console.error("Technical Details:", error.details);
  console.error("Retryable:", error.isRetryable);
  console.error("Status Code:", error.statusCode);
  if (context) {
    console.error("Context:", context);
  }
  console.groupEnd();
};
