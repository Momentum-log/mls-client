/\*\*

- IN06: Invoice Integration Guide - Payment Flow Integration
-
- Comprehensive guide for integrating invoice generation and management
- into the shipment payment flow.
-
- @module docs/invoice-integration-payment-flow.md
  \*/

// This is a documentation file explaining the implementation pattern

/\*

# Invoice Integration into Payment Flow - IN06 Implementation Guide

## Overview

Invoice generation is now integrated into the shipment creation/payment flow. When a user selects a payment method (PayU or Stripe) and finalizes their shipment, an invoice is automatically generated and the user can preview it before proceeding to payment.

## Architecture

### Integration Point: Summary Drawer → Payment Finalization

The integration happens in the shipment creation flow:

1. **User completes shipment details** → Sender, recipient, package, rate selected
2. **Summary drawer opens** → Shows shipment summary and payment method selector
3. **User selects payment method** → PayU or Stripe
4. **User clicks "Create Shipment"** → Calls `handleFinalize(paymentMethod)`
5. **NEW: After shipment creation succeeds** → Generate invoice with shipment ID
6. **NEW: Show invoice preview** → User can download PDF, send email, or proceed to payment
7. **NEW: Confirm invoice with payment method** → Store payment method link
8. **Proceed to payment gateway** → Old behavior continues (PayU checkout or Stripe)

## Key Components

### 1. Hook: `useInvoicePaymentFlow`

Located in: `hooks/invoices/useInvoicePaymentFlow.ts`

**Main Methods:**

- `generateInvoiceFromShipment(shipmentId)`: Generate invoice from shipment
  - Called after `performCreateShipment` succeeds with shipmentId
  - Returns `Invoice` object or `null` if failed
  - Automatically stores invoiceId in shipment store

- `confirmInvoicePayment(invoiceId, paymentMethod)`: Confirm invoice payment method
  - Called when user proceeds to payment
  - Stores payment method link for invoice tracking
  - Returns confirmed `Invoice` object

**State:**

```typescript
{
  loading: boolean; // Invoice generation in progress
  confirming: boolean; // Invoice confirmation in progress
  invoice: Invoice | null; // Current generated invoice
  invoiceError: UserFriendlyError | null;
  confirmError: UserFriendlyError | null;
}
```

### 2. Component: `InvoicePreview`

Located in: `components/invoice/InvoicePreview.tsx`

**Props:**

- `invoice`: Invoice object to display
- `onViewDetails`: Callback to open full details modal
- `showPaymentLinkWarning`: Show expiration warning if true
- `className`: Optional CSS classes

**Display Features:**

- Invoice number and status badge
- Line items summary with quantities
- Tax breakdown (net + VAT)
- Total gross amount
- Payment link status with expiration countdown
- "View Details" button for full modal

### 3. Component: `InvoiceDetailModal`

Located in: `components/invoice/InvoiceDetailModal.tsx`

**Props:**

- `invoice`: Full invoice data
- `onClose`: Callback when modal closed
- `onDownload`: Callback for download button
- `onEmail`: Callback for email button
- `onRegeneratePaymentLink`: Callback to regenerate expired link
- `isOpen`: Whether modal is visible
- `isDownloading`, `isSendingEmail`: Loading states

**Display Features:**

- Three tabs: Details, Payments, Audit Trail
- Full line items table with rates and amounts
- Customer and vendor information
- Payment link history
- Audit log of all changes
- Action buttons: Download, Email, Regenerate Link, Close

### 4. Component: `EmailInvoiceModal`

Located in: `components/invoice/EmailInvoiceModal.tsx`

**Props:**

- `invoiceNumber`: For email subject line
- `onSend`: Callback with email array
- `onClose`: Close callback
- `isOpen`: Visibility
- `isLoading`: Submission state
- `error`: Error message to display

**Features:**

- Multiple email input fields (add/remove)
- Real-time email validation with typo suggestions
- Auto-deduplication of emails
- Subject line preview
- Retry buttons on errors

### 5. Component: `InvoiceListPage`

Located in: `components/invoice/InvoiceListPage.tsx`

Full-page component for invoice management (IN09, later implementation).

## Implementation Steps for Payment Flow Integration

### Step 1: Update the NewShipmentPage Component

File: `app/app/shipments/new/page.tsx`

**Add imports:**

```typescript
import { useInvoicePaymentFlow } from "@/hooks/invoices/useInvoicePaymentFlow";
import { InvoicePreview } from "@/components/invoice/InvoicePreview";
import { InvoiceDetailModal } from "@/components/invoice/InvoiceDetailModal";
import { useNotification } from "@/hooks/useNotification";
```

**Add state:**

```typescript
const [showInvoicePreview, setShowInvoicePreview] = useState(false);
const [showInvoiceDetails, setShowInvoiceDetails] = useState(false);

const {
  generateInvoiceFromShipment,
  confirmInvoicePayment,
  state: invoiceState,
  isLoading: isGeneratingInvoice,
} = useInvoicePaymentFlow();

const { success, error } = useNotification();
```

**Modify handleFinalize:**

```typescript
const handleFinalize = (paymentMethod: "stripe" | "payu") => {
  // ... existing validation code ...

  performCreateShipment(payload, {
    onSuccess: async (data) => {
      if (data?.shipmentId) {
        localStorage.setItem("lastShipmentId", data.shipmentId);

        success("Shipment created. Generating invoice...");

        // NEW: Generate invoice for this shipment
        const invoice = await generateInvoiceFromShipment(data.shipmentId);

        if (invoice) {
          success("Invoice generated successfully!");
          setShowInvoicePreview(true);

          // Confirm invoice with payment method
          await confirmInvoicePayment(invoice.id, paymentMethod);
        } else {
          error("Invoice generation failed. Please try again.");
          return;
        }
      }

      // ... rest of existing success code (redirect to payment) ...
    },
    // ... error handler ...
  });
};
```

### Step 2: Add Invoice Preview UI

Add between SummaryDrawer and existing footer:

```typescript
{showInvoicePreview && invoiceState.invoice && (
  <>
    <InvoicePreview
      invoice={invoiceState.invoice}
      onViewDetails={() => {
        setShowInvoiceDetails(true);
      }}
      className="mb-6"
    />

    {/* Buttons to proceed to payment or manage invoice */}
    <div className="flex gap-3 mb-6">
      <Button
        variant="secondary"
        onClick={() => {
          setShowInvoicePreview(false);
          setIsSummaryOpen(true);
        }}
      >
        Back to Shipment
      </Button>
      <Button
        variant="primary"
        onClick={() => {
          // Proceed to payment with confirmed invoice
          if (data?.checkoutUrl) {
            window.location.href = data.checkoutUrl;
          }
        }}
      >
        Proceed to Payment
      </Button>
    </div>
  </>
)}

{showInvoiceDetails && invoiceState.invoice && (
  <InvoiceDetailModal
    invoice={invoiceState.invoice}
    isOpen={showInvoiceDetails}
    onClose={() => setShowInvoiceDetails(false)}
    onDownload={() => downloadInvoicePDF(invoiceState.invoice!.id)}
    onEmail={() => setShowEmailModal(true)}
  />
)}
```

### Step 3: Integrate Email and Download

```typescript
const { downloadInvoicePDF } = useInvoiceDownload();
const { sendInvoiceEmail } = useInvoiceEmail();
const [showEmailModal, setShowEmailModal] = useState(false);

// In render:
{showEmailModal && (
  <EmailInvoiceModal
    invoiceNumber={invoiceState.invoice?.invoiceNumber || ""}
    isOpen={showEmailModal}
    onClose={() => setShowEmailModal(false)}
    onSend={async (emails) => {
      for (const email of emails) {
        await sendInvoiceEmail(invoiceState.invoice!.id, email);
      }
      setShowEmailModal(false);
      success("Invoice emails sent successfully!");
    }}
  />
)}
```

## Data Flow Diagram

```
┌─────────────────────────────────────┐
│   User Completes Shipment Details   │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│   Summary Drawer: Select Payment     │
│   Method (PayU or Stripe)           │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│   performCreateShipment(payload)    │
│   [POST /shipments]                 │
└────────┬────────────────────────────┘
         │
         ▼ (onSuccess)
┌─────────────────────────────────────┐
│  generateInvoiceFromShipment()       │
│  [POST /invoices/generate]          │
│  Returns: Invoice object            │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│   Show InvoicePreview Component      │
│   User sees invoice details         │
└────────┬────────────────────────────┘
         │
    ┌────┴────────────┬──────────────────┐
    │                 │                  │
    ▼                 ▼                  ▼
 Download         Send Email       Proceed to
  PDF            (EmailModal)       Payment
    │                 │                  │
    │                 │                  ▼
    │                 │        ┌──────────────────────┐
    │                 │        │ confirmInvoicePayment│
    │                 │        │ [POST /invoices/{id} │
    │                 │        │  /confirm]           │
    │                 │        │ Stores payment method│
    │                 │        └──────┬───────────────┘
    │                 │               │
    │                 │               ▼
    │                 │        ┌──────────────────────┐
    │                 │        │Redirect to Payment   │
    │                 │        │Gateway (PayU/Stripe) │
    │                 │        └──────────────────────┘
    └─────────────────┴────────────────────────────────┘
```

## Error Handling

All invoice operations use centralized error handling:

```typescript
import { handleApiError } from "@/utils/error-handler";

// Errors automatically categorized:
// - VALIDATION_ERROR (400) → Show form errors
// - NOT_FOUND_ERROR (404) → Invoice deleted
// - CONFLICT_ERROR (409) → Payment link expired
// - AUTH_ERROR (401/403) → Re-authenticate
// - SERVER_ERROR (5xx) → Show retry button
// - TIMEOUT_ERROR → Show retry button

// Usage:
try {
  await generateInvoiceFromShipment(shipmentId);
} catch (error) {
  const handled = handleApiError(error);
  console.error(handled.message); // User-friendly message
  if (handled.isRetryable) {
    // Show retry button
  }
}
```

## Notifications

All invoice operations trigger notifications:

```typescript
import { useNotification } from "@/hooks/useNotification";
import { INVOICE_NOTIFICATIONS } from "@/hooks/useNotification";

const { success, error } = useNotification();

// Show success
success(INVOICE_NOTIFICATIONS.INVOICE_GENERATED);

// Show error with retry
error(INVOICE_NOTIFICATIONS.INVOICE_GENERATION_FAILED, {
  showRetryButton: true,
  onRetry: () => generateInvoiceFromShipment(shipmentId),
});

// Show warning about expiring link
invoiceNotifications.notifyPaymentLinkExpiringSoon(hoursRemaining, () =>
  regeneratePaymentLink(invoiceId),
);
```

## Testing Checklist

- [ ] Shipment creation succeeds
- [ ] Invoice is generated with correct shipment ID
- [ ] Invoice preview shows correct items and amounts
- [ ] InvoiceDetailModal displays all tabs correctly
- [ ] Download PDF works and triggers notification
- [ ] Email modal validates email addresses
- [ ] Email with typo suggestions works (e.g., gmial → gmail)
- [ ] Confirm invoice stores payment method
- [ ] Redirect to payment gateway happens after confirmation
- [ ] Error handling shows user-friendly messages
- [ ] Retry buttons appear for retryable errors
- [ ] Toast notifications appear for all operations
- [ ] Payment link expiration warning shows when < 24 hours

## State Management

### Zustand Stores Integration

**invoice-store.ts:**

- `setCurrentInvoice(invoice)`: Set invoice being viewed
- `cacheInvoice(invoice)`: Cache with 5-min TTL
- `getCachedInvoice(id)`: Retrieve if cache fresh

**shipment-store.ts:**

- `setInvoiceId(invoiceId)`: Store invoice ID for this shipment
- `clearInvoiceId()`: Clear when navigating away

## Environment Variables

Required for invoice operations:

```env
REACT_APP_API_URL=http://localhost:3000          # API base URL
REACT_APP_INVOICE_ENABLED=true                   # Enable invoice system
REACT_APP_INVOICE_EMAIL_ENABLED=true             # Enable email sending
```

## Performance Considerations

1. **Invoice caching**: 5-minute TTL to reduce API calls
2. **Debounced email send**: 1 second debounce prevents rapid re-sends
3. **Exponential backoff retry**: 1s, 2s, 4s delays for transient failures
4. **Memoized components**: Prevent unnecessary re-renders
5. **Lazy modal loading**: Modals only mount when needed

## Security Considerations

1. **Bearer token**: All requests include JWT from auth store
2. **No PII logging**: Sensitive data not logged in production
3. **Email validation**: Prevents injection attacks
4. **HTTPS enforcement**: API calls via Fetch API with proper headers
5. **Session timeout**: 30-second timeout with AbortController

## Future Enhancements (IN09+)

- Invoice list page with pagination/filtering
- Invoice history and archiving
- Bulk download invoices as ZIP
- Recurring invoice templates
- Custom invoice numbering schemes
- Multi-language invoice support
  \*/

export const INVOICE_PAYMENT_FLOW_DOCUMENTATION = `This module contains the implementation guidelines for integrating invoice
generation into the shipment payment flow. See the comments in this file for
detailed integration patterns and examples.`;
