/**
 * Email Helper Utilities
 *
 * Utility functions for email validation, formatting, and template generation.
 *
 * @module utils/email-helper
 */

/**
 * Validates email format using a robust regex pattern
 *
 * Based on a simplified RFC 5322 standard. Not checking DNS or sending test emails.
 *
 * @param email - Email address to validate
 * @returns true if email format is valid, false otherwise
 *
 * @example
 * validateEmail("user@example.com") // true
 * validateEmail("invalid.email") // false
 * validateEmail("") // false
 */
export const validateEmail = (email: string): boolean => {
  if (!email || typeof email !== "string") return false;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim()) && email.length <= 254;
};

/**
 * Sanitizes email address for use in URLs or as parameter
 *
 * @param email - Email address to sanitize
 * @returns Sanitized email address
 *
 * @example
 * sanitizeEmail("User+test@example.com") // "user+test@example.com"
 */
export const sanitizeEmail = (email: string): string => {
  return email.toLowerCase().trim();
};

/**
 * Generates email subject line for invoice delivery
 *
 * @param invoiceNumber - Invoice number (e.g., "MLS-INV-A1B2C3-2026")
 * @param companyName - Company name (default: "MLS Logistics")
 * @returns Email subject line
 *
 * @example
 * formatEmailSubject("MLS-INV-A1B2C3-2026")
 * // "Invoice MLS-INV-A1B2C3-2026 from MLS Logistics"
 */
export const formatEmailSubject = (
  invoiceNumber: string,
  companyName: string = "MLS Logistics",
): string => {
  return `Invoice ${invoiceNumber} from ${companyName}`;
};

/**
 * Formats a simple email signature for invoice emails
 *
 * @param companyName - Company name (default: "MLS Logistics")
 * @param supportEmail - Support email address (default: "support@mlslogistics.pl")
 * @returns Email signature text
 *
 * @example
 * formatEmailSignature()
 * // "Best regards,\nMLS Logistics\nsupport@mlslogistics.pl"
 */
export const formatEmailSignature = (
  companyName: string = "MLS Logistics",
  supportEmail: string = "support@mlslogistics.pl",
): string => {
  return `Best regards,\n${companyName}\n${supportEmail}`;
};

/**
 * Generates a plain text email body for invoice delivery
 *
 * @param recipientName - Recipient's name
 * @param invoiceNumber - Invoice number
 * @param invoiceAmount - Invoice gross amount in PLN
 * @param invoiceDate - Invoice date (ISO-8601 string)
 * @returns Plain text email body
 *
 * @example
 * formatEmailBody("Jan Kowalski", "MLS-INV-A1B2C3-2026", 61.50, "2026-04-06")
 */
export const formatEmailBody = (
  recipientName: string,
  invoiceNumber: string,
  invoiceAmount: number,
  invoiceDate: string,
): string => {
  const formattedAmount = invoiceAmount.toFixed(2).replace(".", ",");
  const formattedDate = new Date(invoiceDate).toLocaleDateString("pl-PL");

  return `Dear ${recipientName},

We're attaching your invoice for shipment services.

Invoice Number: ${invoiceNumber}
Invoice Date: ${formattedDate}
Amount: ${formattedAmount} PLN

If you have any questions about this invoice, please contact our support team.

${formatEmailSignature()}`;
};

/**
 * Generates an HTML email body for invoice delivery
 *
 * @param recipientName - Recipient's name
 * @param invoiceNumber - Invoice number
 * @param invoiceAmount - Invoice gross amount in PLN
 * @param invoiceDate - Invoice date (ISO-8601 string)
 * @param paymentLinkUrl - Payment link URL (optional)
 * @returns HTML email body
 *
 * @example
 * formatEmailBodyHtml("Jan Kowalski", "MLS-INV-A1B2C3-2026", 61.50, "2026-04-06")
 */
export const formatEmailBodyHtml = (
  recipientName: string,
  invoiceNumber: string,
  invoiceAmount: number,
  invoiceDate: string,
  paymentLinkUrl?: string,
): string => {
  const formattedAmount = invoiceAmount.toFixed(2).replace(".", ",");
  const formattedDate = new Date(invoiceDate).toLocaleDateString("pl-PL");

  const paymentSection = paymentLinkUrl
    ? `
    <p style="margin-top: 24px; margin-bottom: 24px;">
      <a href="${paymentLinkUrl}" style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">
        Pay Invoice
      </a>
    </p>`
    : "";

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { border-bottom: 2px solid #007bff; padding-bottom: 20px; margin-bottom: 30px; }
    .header h1 { margin: 0; color: #007bff; }
    .details { background-color: #f5f5f5; padding: 20px; border-radius: 4px; margin: 20px 0; }
    .details-row { display: flex; justify-content: space-between; padding: 8px 0; }
    .details-label { font-weight: bold; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Invoice Attachment</h1>
    </div>

    <p>Dear ${recipientName},</p>

    <p>We're attaching your invoice for shipment services. Please find the details below:</p>

    <div class="details">
      <div class="details-row">
        <span class="details-label">Invoice Number:</span>
        <span>${invoiceNumber}</span>
      </div>
      <div class="details-row">
        <span class="details-label">Invoice Date:</span>
        <span>${formattedDate}</span>
      </div>
      <div class="details-row">
        <span class="details-label">Amount:</span>
        <span style="font-weight: bold; color: #007bff;">${formattedAmount} PLN</span>
      </div>
    </div>

    ${paymentSection}

    <p>If you have any questions about this invoice, please don't hesitate to contact our support team.</p>

    <div class="footer">
      <p>Best regards,<br>
      MLS Logistics<br>
      support@mlslogistics.pl</p>
    </div>
  </div>
</body>
</html>`;
};

/**
 * Validates multiple email addresses (for CC/BCC fields)
 *
 * @param emails - Array of email addresses or comma-separated string
 * @returns Array of valid email addresses
 *
 * @example
 * validateEmails("user1@example.com, user2@example.com")
 * // ["user1@example.com", "user2@example.com"]
 */
export const validateEmails = (emails: string | string[]): string[] => {
  const emailArray = Array.isArray(emails) ? emails : emails.split(",");

  return emailArray
    .map((email) => sanitizeEmail(email))
    .filter((email) => validateEmail(email));
};

/**
 * Formats email address for display
 *
 * Shows full email, but truncates very long addresses
 *
 * @param email - Email address
 * @param maxLength - Maximum length before truncating (default: 50)
 * @returns Formatted email address for display
 *
 * @example
 * formatEmailForDisplay("very.long.email.address@example.com") // "very.long.email.address@exam..."
 */
export const formatEmailForDisplay = (
  email: string,
  maxLength: number = 50,
): string => {
  if (email.length <= maxLength) return email;
  return email.substring(0, maxLength - 3) + "...";
};

/**
 * Extracts domain from email address
 *
 * @param email - Email address
 * @returns Domain name or null if invalid
 *
 * @example
 * getEmailDomain("user@example.com") // "example.com"
 */
export const getEmailDomain = (email: string): string | null => {
  try {
    const domain = email.split("@")[1];
    return domain || null;
  } catch {
    return null;
  }
};

/**
 * Checks if email is from a known corporate domain
 *
 * @param email - Email address
 * @param corporateDomains - List of corporate domains (default: ["company.com"])
 * @returns true if email is from corporate domain, false otherwise
 *
 * @example
 * isCorporateEmail("user@company.com", ["company.com"]) // true
 */
export const isCorporateEmail = (
  email: string,
  corporateDomains: string[] = [],
): boolean => {
  const domain = getEmailDomain(email);
  return domain ? corporateDomains.includes(domain.toLowerCase()) : false;
};

/**
 * Validates email against common problematic patterns
 *
 * Checks for common typos and invalid email patterns
 *
 * @param email - Email address to validate
 * @returns Object with validation status and suggestions if invalid
 *
 * @example
 * validateEmailWithSuggestions("user@gmial.com")
 * // { isValid: false, suggestions: ["user@gmail.com"] }
 */
export const validateEmailWithSuggestions = (
  email: string,
): {
  isValid: boolean;
  suggestions: string[];
} => {
  if (validateEmail(email)) {
    return { isValid: true, suggestions: [] };
  }

  const commonTypos: Record<string, string> = {
    "gmial.com": "gmail.com",
    "gmai.com": "gmail.com",
    "yahooo.com": "yahoo.com",
    "yaho.com": "yahoo.com",
    "hotmial.com": "hotmail.com",
    "outolook.com": "outlook.com",
  };

  const suggestions: string[] = [];
  const [localPart, domainPart] = email.split("@");

  if (domainPart && commonTypos[domainPart.toLowerCase()]) {
    suggestions.push(`${localPart}@${commonTypos[domainPart.toLowerCase()]}`);
  }

  return { isValid: false, suggestions };
};
