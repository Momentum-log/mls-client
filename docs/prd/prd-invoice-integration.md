# Product Requirements Document: Invoice System Integration

**Feature:** Invoice Generation, Display, Download, and Email Integration  
**Date:** April 6, 2026  
**Version:** 1.0  
**Status:** Ready for Development  
**Timeline:** Urgent (1-2 weeks) - MVP  
**Target Region:** Poland (PLN currency, 23% VAT rules)

---

## Table of Contents

1. [Overview](#overview)
2. [Goals](#goals)
3. [User Stories](#user-stories)
4. [Features & Tasks](#features--tasks)
5. [Non-Goals](#non-goals)
6. [Design Considerations](#design-considerations)
7. [Technical Considerations](#technical-considerations)
8. [Success Metrics](#success-metrics)
9. [Open Questions](#open-questions)

---

## Overview

The **Invoice System Integration** feature enables customers to view, download, and email invoices after selecting a payment method (PayU or Stripe) during the shipment checkout process. This feature integrates with the backend invoice generation system and provides a seamless user experience for invoice management.

### Problem Solved

Customers need a clear, professional way to view and manage invoices for their shipments. Currently, there is no frontend interface to:

- View invoice details with itemized breakdown
- Download invoices as PDFs
- Send invoices to email
- Track invoice status and payment links

### Core Flow

1. User creates a shipment and reaches the payment method selection screen
2. User selects PayU or Stripe as their payment method
3. System calls `/api/invoices/generate` to create the invoice
4. System calls `/api/invoices/{invoiceId}/confirm` with selected payment method
5. Invoice details and payment link are displayed to the user
6. User can download PDF, send via email, or proceed to payment
7. User can view their invoice history at any time

---

## Goals

1. **Enable invoice generation** as part of the payment flow without disrupting user experience
2. **Provide invoice visibility** with clear, downloadable PDF format containing all shipment and tax details
3. **Support email delivery** of invoices to customer-provided email addresses
4. **Create invoice history view** where customers can see all their past invoices
5. **Handle invoice lifecycle states** (PENDING, EXPIRED, PAID) and allow payment link regeneration
6. **Ensure data accuracy** with Polish tax rules (23% VAT for PL origin, 0% for international)
7. **Provide error handling** with clear user feedback via toast notifications
8. **Enable invoice soft-deletion** and restoration (hidden from view but recoverable)

---

## User Stories

### User Story 1: Invoice Generation During Checkout

**As a** customer completing a shipment  
**I want to** see my invoice automatically generated when I select a payment method  
**So that** I have a clear record of what I'm paying for before completing the payment

**Acceptance Criteria:**

- Invoice is generated immediately after selecting PayU or Stripe
- Invoice number (MLS-INV-XXXXXX-YYYY) is displayed to the user
- Invoice details include shipment info, rates, taxes, and total gross amount
- User sees immediate feedback (toast notification) confirming invoice generation
- User can proceed to payment or request actions (download/email)

---

### User Story 2: View Invoice Details

**As a** customer  
**I want to** view detailed invoice information including line items, tax breakdown, and amounts  
**So that** I understand the charges and have proof of the transaction

**Acceptance Criteria:**

- Invoice detail view shows all line items with descriptions, quantities, and prices
- Tax breakdown is displayed clearly (net, VAT, gross amounts)
- Seller and buyer information is visible
- Invoice status (PENDING/EXPIRED/PAID) is clearly shown
- Payment link expiration date is visible (if applicable)

---

### User Story 3: Download Invoice as PDF

**As a** customer  
**I want to** download my invoice as a PDF file to my computer  
**So that** I can save it for my records or print it if needed

**Acceptance Criteria:**

- Download button is easily accessible from invoice view
- PDF download starts automatically with proper filename (Invoice-MLS-INV-XXXXXX-YYYY.pdf)
- PDF contains all invoice details (seller, buyer, line items, totals, taxes)
- Toast notification confirms successful download
- Error toast appears if download fails with retry option

---

### User Story 4: Email Invoice to Customer

**As a** customer  
**I want to** send my invoice to an email address  
**So that** I can share it with my business partner, accountant, or save it in email

**Acceptance Criteria:**

- Email button triggers email form or modal
- User can enter/confirm recipient email address
- Invoice is sent successfully to provided email
- Toast notification confirms email delivery
- User receives clear error message if email delivery fails
- User can retry sending if initial attempt failed

---

### User Story 5: View Invoice History

**As a** customer  
**I want to** see a list of all my invoices with status and key information  
**So that** I can track my shipment history and find specific invoices

**Acceptance Criteria:**

- List page shows invoices with invoice number, date, amount, and status
- List can be filtered by status (PENDING, EXPIRED, PAID)
- List is sortable by date, amount, or invoice number
- Pagination or infinite scroll for large invoice lists
- Clicking an invoice opens the detail view
- Deleted invoices are NOT shown in the customer list (hidden completely)

---

### User Story 6: Regenerate Expired Payment Link

**As a** customer with an expired invoice  
**I want to** regenerate the payment link to extend expiration  
**So that** I can complete payment even if the original link expired

**Acceptance Criteria:**

- "Regenerate Link" button appears on expired invoice detail view
- Button is only visible if invoice status is EXPIRED
- Clicking regenerates link with 7-day expiration
- New payment link URL is displayed to user
- Toast confirms link regeneration with new expiration date
- Old link remains in audit trail but is marked expired

---

## Features & Tasks

This section outlines all tasks required to implement the invoice system integration. Tasks are organized by category with 2-letter prefixes for tracking.

### **User Interface Components (UI)**

UI components for displaying invoices and related actions.

- **UI01:** Create `InvoiceDetailModal` component
  - Display invoice details in modal/drawer format
  - Show invoice number, date, status, seller/buyer info
  - Include action buttons (Download, Email, Regenerate Link)
  - Responsive design for mobile and desktop
  - Use CSS variables from `global.css` (no inline colors)

- **UI02:** Create `InvoicePreview` component
  - Show invoice summary in shipment checkout flow
  - Display line items, tax breakdown, total amounts
  - Show payment link URL and expiration date
  - Compact format suitable for pre-payment review

- **UI03:** Create `InvoiceListPage` component
  - Full-page invoice history view
  - Table/list of all customer invoices
  - Columns: Invoice #, Date, Amount, Status
  - Sortable headers, pagination controls
  - Filter dropdown for status (PENDING/EXPIRED/PAID)
  - Click row to open detail modal

- **UI04:** Create `EmailInvoiceModal` component
  - Modal form with email input field
  - Email validation before submission
  - Loading state while sending
  - Success/error toast feedback
  - Close on success or allow retry on error

- **UI05:** Create `InvoiceStatusBadge` component
  - Small reusable badge showing invoice status
  - Color-coded: PENDING (yellow), EXPIRED (gray), PAID (green)
  - Used in list and detail views

---

### **Data Fetching & Hooks (DA)**

Custom React hooks for invoice-related API calls and state management.

- **DA01:** Create `useInvoices()` hook
  - Manages all invoice API calls
  - Methods: `generateInvoice()`, `getInvoice()`, `listInvoices()`
  - Methods: `downloadPDF()`, `regeneratePaymentLink()`
  - Handles loading, error states
  - Integrates with auth token from `useAuth()` hook
  - Implements retry logic for failed requests

- **DA02:** Create `useInvoiceDownload()` hook
  - Specialized hook for PDF download functionality
  - Handles blob download and file naming
  - Tracks download progress
  - Cleans up object URLs after download
  - Fallback for browsers that don't support direct download

- **DA03:** Create `useInvoiceEmail()` hook
  - Specialized hook for email delivery
  - Validates email before sending
  - Handles email submission to backend
  - Tracks email delivery status
  - Implements debounce to prevent double-sends

---

### **Payment Flow Integration (PF)**

Integration of invoice generation into the shipment payment flow.

- **PF01:** Integrate invoice generation into payment method selection
  - After user selects PayU or Stripe, trigger `generateInvoice()`
  - Display loading state while invoice is being created
  - Show invoice preview with payment link
  - Store `invoiceId` in shipment context for later reference

- **PF02:** Call `/api/invoices/{invoiceId}/confirm` after payment method selection
  - Confirm payment method to backend
  - Receive payment link URL and expiration date
  - Update invoice preview with confirmed payment link
  - Display new payment link to user

- **PF03:** Add "View Invoice" button to shipment detail view
  - Link to open invoice detail modal
  - Available after shipment is created (invoice exists)
  - Navigation: Dashboard → Shipments → Select Shipment → View Invoice

- **PF04:** Store invoice reference in shipment data
  - Update shipment object to include `invoiceId`
  - Persist in Zustand shipment store
  - Allow retrieval of invoice for any shipment

---

### **State Management (ST)**

Zustand store updates for invoice state.

- **ST01:** Update `shipment-store.ts` to include invoice data
  - Add `invoiceId` field to shipment object
  - Add methods: `setInvoiceId()`, `clearInvoiceId()`
  - Persist invoice reference across page navigations

- **ST02:** Create `invoice-store.ts` for invoice state
  - Track current invoice being viewed
  - Cache invoice list and details
  - Store invoice filters (status, sort)
  - Methods: `setCurrentInvoice()`, `setInvoiceList()`, `updateFilters()`

---

### **API Integration (AP)**

Backend API integration for all invoice operations.

- **AP01:** Implement `POST /api/invoices/generate` call
  - Send: `shipmentId`, `deliveryMethod`, `recipientEmail` (if email selected)
  - Receive: `invoiceId`, `invoiceNumber`, `paymentLinkUrl`, etc.
  - Handle 201 Created response
  - Handle error responses (400, 404, 409)

- **AP02:** Implement `POST /api/invoices/{invoiceId}/confirm` call
  - Send: `paymentMethod` (STRIPE or PAYU)
  - Receive: `paymentLinkUrl`, `paymentLinkExpiresAt`
  - Update invoice preview with payment link
  - Show expiration time to user

- **AP03:** Implement `GET /api/invoices/{invoiceId}` call
  - Fetch full invoice details
  - Used when opening invoice detail modal
  - Cache result to reduce redundant calls

- **AP04:** Implement `GET /api/invoices?status=X&limit=20&offset=0` call
  - Fetch paginated list of user's invoices
  - Support status filtering, sorting, pagination
  - Used on invoice list page

- **AP05:** Implement `GET /api/invoices/{invoiceId}/pdf` call
  - Fetch PDF blob for download
  - Trigger browser download with correct filename
  - Handle download progress/errors

- **AP06:** Implement `POST /api/invoices/{invoiceId}/regenerate-link` call
  - Called when user clicks "Regenerate Link" on expired invoice
  - Receive: new `paymentLinkUrl`, `paymentLinkExpiresAt`
  - Update invoice display with new link

- **AP07:** Implement `DELETE /api/invoices/{invoiceId}` call (soft delete)
  - Called by admin only (not in customer flow)
  - Backend marks invoice as soft-deleted

- **AP08:** Implement `POST /api/invoices/{invoiceId}/restore` call (admin only)
  - Called by admin to restore soft-deleted invoice
  - Backend restores invoice visibility

---

### **Error Handling & Notifications (ER)**

Error handling and user feedback mechanisms.

- **ER01:** Implement error handling for invoice generation failures
  - Catch 400, 404, 409 responses from `/generate` endpoint
  - Show user-friendly toast with error code and message
  - Provide "Retry" option for transient errors
  - Log error details to console for debugging

- **ER02:** Implement error handling for download failures
  - Catch network errors, invalid PDFs, server 500s
  - Show "Download failed. Retry?" toast
  - Provide retry button to attempt download again
  - Fallback: show download link to open in new tab

- **ER03:** Implement error handling for email delivery failures
  - Catch validation errors (invalid email)
  - Show specific error message ("Invalid email format")
  - Catch delivery errors (service unavailable)
  - Provide retry option

- **ER04:** Implement error handling for payment link regeneration
  - Show error if invoice is not expired
  - Show error if invoice is already paid
  - Provide clear next steps to user

- **ER05:** Implement retry logic with exponential backoff
  - For transient 5xx errors, retry up to 3 times
  - Wait 1s, 2s, 4s between retries
  - Show user that system is retrying
  - Fail gracefully after max retries

- **ER06:** Implement validation error display
  - Show validation errors from backend (e.g., invalid email)
  - Display all validation errors together
  - Highlight the form fields with errors

---

### **Notifications & Toast Integration (NO)**

Integration with existing react-hot-toast notification system.

- **NO01:** Display success toast on invoice generation
  - Message: "Invoice MLS-INV-XXXXXX-YYYY generated successfully"
  - Auto-dismiss after 3 seconds
  - Include invoice number for reference

- **NO02:** Display success toast on PDF download
  - Message: "Invoice downloaded successfully"
  - Auto-dismiss after 3 seconds

- **NO03:** Display success toast on email send
  - Message: "Invoice sent to example@email.com"
  - Auto-dismiss after 3 seconds

- **NO04:** Display error toasts with retry option
  - Include error code and message
  - Add "Retry" button for transient errors
  - Persist until user dismisses or retries

- **NO05:** Display info toast when payment link expires
  - Message: "Your payment link has expired. Click to regenerate."
  - Show in invoice detail view
  - Link to regeneration action

- **NO06:** Display warning toast for payment link expiration countdown
  - Show when link is expiring in < 24 hours
  - Message: "Payment link expires in {hours} hours"
  - Suggest regenerating link

---

### **Types & TypeScript Definitions (TS)**

TypeScript types for invoice-related data.

- **TS01:** Create `types/invoice.ts` file
  - Export all invoice interfaces from backend guide
  - Include: `Invoice`, `InvoiceLineItem`, `InvoicePaymentLink`
  - Include: `GenerateInvoiceRequest`, `GenerateInvoiceResponse`
  - Include: `ConfirmInvoiceRequest`, `ConfirmInvoiceResponse`
  - Include: `ErrorResponse` for error handling
  - Add JSDoc comments for each type

- **TS02:** Create invoice enums
  - `InvoiceStatus`: PENDING, EXPIRED, PAID
  - `DeliveryMethod`: download, email, both
  - `PaymentMethod`: STRIPE, PAYU
  - `SortField`: createdAt, invoiceNumber, totalGross

---

### **Utilities & Helpers (UT)**

Utility functions for invoice operations.

- **UT01:** Create `utils/invoice-helper.ts`
  - `formatInvoiceNumber()`: Format invoice number for display
  - `formatInvoiceAmount()`: Format amount with PLN currency
  - `getInvoiceStatusColor()`: Return color for status badge
  - `getInvoiceStatusLabel()`: Return display label for status
  - `calculateTaxBreakdown()`: Summarize tax info from line items
  - `isPaymentLinkExpired()`: Check if payment link expiration has passed

- **UT02:** Create `utils/pdf-helper.ts`
  - `downloadFile()`: Generic file download helper
  - `triggerDownload()`: Trigger browser download with filename
  - `handleDownloadError()`: Standardized error handling

- **UT03:** Create `utils/email-helper.ts`
  - `validateEmail()`: Email format validation
  - `formatEmailSubject()`: Generate invoice email subject
  - `formatEmailBody()`: Generate simple email body template

---

### **Local Storage & Caching (LC)**

Browser storage for invoice data caching.

- **LC01:** Cache invoice list in localStorage
  - Store with TTL (time-to-live) of 5 minutes
  - Check cache before making API call
  - Allow manual refresh to bypass cache
  - Use `secure-storage.ts` utilities if sensitive

- **LC02:** Store invoice filters in localStorage
  - Persist selected status filter
  - Persist sort preferences
  - Restore on page reload

---

### **Documentation & Comments (DO)**

Code documentation and comments.

- **DO01:** Add JSDoc comments to all invoice hooks
  - Document parameters, return types, usage examples
  - Include error handling notes
  - Document side effects

- **DO02:** Add JSDoc comments to all invoice components
  - Document props, default values, examples
  - Document keyboard shortcuts if any
  - Document accessibility features

- **DO03:** Create invoice integration README
  - Overview of invoice flow
  - How to use invoice hooks and components
  - Common error scenarios and solutions

---

## Non-Goals

The following features are **explicitly out of scope** for this MVP:

- **Admin invoice management dashboard** - Admins will use backend directly
- **Bulk invoice operations** - No bulk download, email, or delete
- **Invoice editing or modification** - Invoices are immutable once created
- **International payment methods** - PayU/Stripe only (no manual transfers, bank details)
- **Recurring/subscription invoicing** - Based on individual shipments only
- **Advanced tax configurations** - Uses fixed Polish tax rules (23% for PL, 0% international)
- **Multi-currency invoice generation** - Uses PLN or EUR as provided by backend
- **Invoice templates customization** - Uses standard MLS template
- **3D Secure / advanced payment flows** - Delegated to PayU/Stripe
- **Invoice signing or digital certification** - Not required for MVP

---

## Design Considerations

### UI/UX Flow

1. **Invoice in Shipment Checkout**
   - Invoice preview should be compact, appearing AFTER payment method selection
   - Show gross amount prominently for quick confirmation
   - "View Details" button opens full invoice modal

2. **Invoice Detail Modal**
   - Modal width: 600px on desktop, full-width on mobile
   - Use existing modal component from `components/ui/`
   - Tabs or sections: Summary, Line Items, Seller/Buyer, Payment Link
   - Action buttons: Download, Email, Regenerate Link (if expired)

3. **Invoice List Page**
   - Responsive table on desktop, card layout on mobile
   - Each row/card shows: Invoice #, Date, Amount, Status badge
   - Status badge colors: Yellow (PENDING), Gray (EXPIRED), Green (PAID)
   - Pagination: Show 20 items per page by default

4. **Email Modal**
   - Simple form with email input
   - Pre-fill with customer's email if available
   - Show "Sending..." state while request in flight
   - Close on success

### Styling & Colors

- Use CSS variables from `globals.css`
- Status badge colors:
  - PENDING: `var(--color-warning)` or yellow
  - EXPIRED: `var(--color-muted)` or gray
  - PAID: `var(--color-success)` or green
- Action buttons: Primary button for main action (Download), Secondary for alternatives
- Input fields: Standard text inputs with validation feedback
- No gradients (per project guidelines)

### Accessibility

- Add ARIA labels to all buttons
- Use semantic HTML (tables, lists, sections)
- Ensure keyboard navigation (Tab through modals)
- Color contrast: Ensure readability (no light gray text on white)
- Mobile touch targets: Minimum 44x44dp for buttons

---

## Technical Considerations

### Backend Dependencies

- Backend must have all invoice endpoints fully functional (see `invoice-client-integration-guide.md`)
- SMTP/Brevo email service must be configured for email delivery
- PDF generation service must produce valid PDFs
- Payment gateway integrations (PayU, Stripe) must be working

### Frontend Architecture

- **Auth Integration**: Use existing `useAuth()` hook to get access token for API calls
- **Store Integration**: Update `shipment-store.ts` to track `invoiceId`
- **Component Reuse**: Leverage existing UI components from `components/ui/`
- **Error Boundaries**: Wrap invoice components in error boundary to prevent full-page crashes
- **Performance**: Implement pagination to avoid loading 1000+ invoices at once

### API Response Handling

- All responses follow standard `ErrorResponse` format on errors
- Status codes: 201 (created), 200 (success), 400 (validation), 404 (not found), 409 (conflict), 500 (server error)
- Implement standardized error handler using backend guide examples
- Add request/response logging in development mode

### Security Considerations

- Do NOT store sensitive data (payment links with UUIDs) in localStorage beyond session
- Validate recipient email before sending (prevent email spoofing)
- Use Bearer token authentication on all requests
- Implement CORS headers correct (backend responsibility)
- Do NOT log full invoice data in console (contains customer PII)

### Browser Compatibility

- Support modern browsers (Chrome, Firefox, Safari, Edge latest versions)
- PDF download: Use native browser download API (not base64 rendering)
- Email links: Should open in new tab, not navigate away

### Environment Variables

```env
REACT_APP_API_URL=http://localhost:3000
REACT_APP_INVOICE_ENABLED=true
REACT_APP_INVOICE_EMAIL_ENABLED=true
```

---

## Success Metrics

1. **Feature Adoption**: 80%+ of customers viewing invoices for their shipments within first month
2. **Download Usage**: 60%+ of invoices are downloaded by customers
3. **Email Usage**: 30%+ of invoices are sent via email for accounting/sharing
4. **Error Rate**: < 2% of invoice operations result in user-facing errors
5. **Performance**: Invoice generation completes in < 2 seconds (P95)
6. **PDF Download**: 90%+ of PDF downloads complete successfully on first attempt
7. **Email Delivery**: 95%+ of emails delivered within 30 seconds
8. **User Satisfaction**: No more than 5% of invoices result in customer support tickets
9. **Page Load**: Invoice list page loads in < 1.5 seconds with full pagination
10. **Mobile Experience**: No reported issues with invoice UI on mobile devices

---

## Open Questions

1. **Invoice Schedule Clarification**
   - Should invoices be generated immediately upon payment method selection, or only after payment confirmation?
   - What if user changes their mind and doesn't proceed to payment?

2. **Payment Link Expiration UX**
   - Should we proactively warn users before link expires (e.g., 24 hours before)?
   - Should expired invoices show a prominent "Expired - Regenerate" button?

3. **Email Recipient**
   - Should we allow customers to email invoices to other email addresses (accounting department, etc.) or only to their registered email?
   - Per backend guide, `recipientEmail` is required - do we ask for this from user or use account email?

4. **Pagination Strategy**
   - Should invoice list use traditional pagination (Next/Prev buttons) or infinite scroll?
   - What's the expected number of invoices per customer (affects pagination strategy)?

5. **Invoice Restoration (Admin)**
   - Should customer-facing UI include any restoration UI, or is this admin-only?
   - Per PRD scope (3A), this is out of scope, but confirming?

6. **Performance Optimization**
   - Should we implement invoice list virtualization for customers with 1000+ invoices?
   - Should PDF generation happen on-demand or be cached server-side?

7. **Localization**
   - Should invoice detail view support Polish language for Polish customers, or English-only for MVP?
   - Should date formatting follow Polish locale (DD.MM.YYYY) or ISO (YYYY-MM-DD)?

8. **Payment Confirmation**
   - After successful payment through PayU/Stripe, should invoice status auto-update to PAID?
   - Should we poll backend or use webhook notification?

---

## Implementation Checklist

- [ ] Review backend invoice endpoints and verify all are live
- [ ] Set up TypeScript types in `types/invoice.ts`
- [ ] Create invoice-related hooks in `hooks/invoices/`
- [ ] Create invoice UI components in `components/invoice/`
- [ ] Create invoice utility helpers in `utils/`
- [ ] Integrate invoice generation into payment flow
- [ ] Add invoice link to shipment detail pages
- [ ] Create invoice list page at `/app/invoices` (or `/app/app/invoices`)
- [ ] Test all error scenarios with backend guide examples
- [ ] Performance test with large invoice lists
- [ ] Mobile responsive testing
- [ ] Accessibility audit (axe, manual ARIA testing)
- [ ] Document component usage in storybook or markdown
- [ ] Set up error tracking (Sentry or similar)
- [ ] Deploy to staging for QA testing
- [ ] Create user documentation for invoice features

---

## References

- [Invoice Client Integration Guide](./invoice-client-integration-guide.md) - Backend API specification
- [Project Structure](../../file-tree-mls-client.md) - Frontend folder organization
- [Global CSS Variables](../../globals.css) - Design tokens and colors
- [Existing Hooks](../../hooks/) - Examples of hook patterns in project
- [Existing Components](../../components/ui/) - Reusable UI components

---

**Document Status:** Ready for Development  
**Last Updated:** April 6, 2026  
**Next Steps:** Create TypeScript types and start with hooks implementation
