# PRD: Invoice Client-Side UI Implementation

**Version:** 1.0  
**Date:** April 9, 2026  
**Status:** Ready for Development  
**Priority:** Urgent (Complete this week)  
**Target Audience:** Junior Developer

---

## Table of Contents

1. [Introduction](#introduction)
2. [Goals](#goals)
3. [User Stories](#user-stories)
4. [Features & Tasks](#features--tasks)
5. [Non-Goals](#non-goals)
6. [Design Considerations](#design-considerations)
7. [Technical Considerations](#technical-considerations)
8. [Success Metrics](#success-metrics)
9. [Open Questions](#open-questions)

---

## Introduction

This PRD defines the client-side UI implementation for the **unified invoice system** integrated with shipment management. Based on the server's new unified shipment-to-invoice flow (documented in `invoice-client-integration-guide.md`), this implementation will display invoices, enable invoice management actions (download, email, update), and provide seamless integration with the shipment workflow.

### Key Concept

The invoice system now works in two flows:

1. **CREATE Flow**: When a user creates a new shipment, an invoice is automatically generated in the same transaction. The server **generates the PDF asynchronously in the background** and immediately returns: `shipmentId`, `invoiceId`, `paymentLink`, `pdfGenerationStatus` (READY or PENDING), and `pdfDownloadUrl` (null if still generating).
   - If `pdfGenerationStatus` is `READY`: PDF is ready, `pdfDownloadUrl` contains the link
   - If `pdfGenerationStatus` is `PENDING`: Client should poll `GET /api/invoices/{invoiceId}/pdf` to check when ready

2. **UPDATE Flow**: When an invoice is **PENDING or EXPIRED** (not yet paid), users can click "Update Invoice Now" to change rates and regenerate a payment link. This flow includes `invoiceId` and `shipmentId` in the request. After update, `pdfGenerationStatus` will typically be `READY` immediately.

---

## Goals

1. Display invoice information clearly in multiple contexts (shipment details, invoice list, receipts).
2. Provide users with intuitive CTAs for invoice management (download, email, pay, update).
3. Conditionally show "Update Invoice Now" button only when invoice status is PENDING or EXPIRED.
4. Handle asynchronous PDF generation with appropriate loading states and retry logic.
5. Integrate invoice display into existing shipment detail pages with minimal disruption.
6. Ensure all invoice actions are accessible from dashboard and shipment views.

---

## User Stories

### Story 1: View Invoice After Shipment Creation

**As a** customer who just created a shipment  
**I want to** see my invoice details immediately after creation  
**So that** I understand the total cost and can proceed to payment

**Acceptance Criteria:**

- Invoice summary displays: number, total amount, tax breakdown
- Payment link button is prominent and ready to click
- Download button is available (shows loading state if PDF still generating)
- Email button is available for alternate delivery
- User can see countdown or indication of payment link expiration

### Story 2: Download Invoice PDF

**As a** customer  
**I want to** download my invoice as a PDF  
**So that** I can save it locally or send it to others

**Acceptance Criteria:**

- Download button shows loading state while PDF is generating
- Once ready, clicking download initiates file download
- If PDF takes longer than expected, user sees "try again" message
- User can retry downloading if initial attempt fails

### Story 3: Email Invoice

**As a** customer  
**I want to** email my invoice to a recipient  
**So that** I don't have to manually forward it

**Acceptance Criteria:**

- Email button is less prominent than Download (secondary styling)
- Clicking email shows recipient confirmation or toast notification
- If PDF is still generating, user sees message: "Invoice will be sent when ready"
- Email is sent with invoice attachment and payment link

### Story 4: Update Expired Invoice

**As a** customer with an expired invoice  
**I want to** update my invoice with new rates without creating a new shipment  
**So that** I can keep using the same shipment but with fresh pricing and payment link

**Acceptance Criteria:**

- "Update Invoice Now" button appears ONLY when invoice status is PENDING or EXPIRED
- Button is hidden when invoice is PAID or in other terminal states
- Clicking button takes me to estimates page with all previous data pre-populated
- I can select new rates and payment method (Stripe or PayU)
- Clicking "Create Shipment" actually UPDATES the existing shipment with new rate
- After update, new payment link is returned and I can pay again

### Story 5: View Invoice in Shipment Details

**As a** customer viewing a shipment  
**I want to** see invoice details inline without navigating away  
**So that** I have quick access to cost and payment status

**Acceptance Criteria:**

- Small inline receipt/card displays in shipment details view
- Shows invoice number, status, total amount, and tax
- Displays appropriate CTA based on status:
  - If PENDING/EXPIRED: "Update Invoice Now" button
  - If PAID: "Download Invoice" button (or similar)
  - None if still processing
- Clicking invoice card opens full invoice modal/page
- Context menu includes "View Invoice" option

### Story 6: View Paid Invoice

**As a** customer with a paid invoice  
**I want to** view my paid invoice details  
**So that** I have a record of my transaction

**Acceptance Criteria:**

- Invoice displays all details: buyer, seller, line items, totals, tax
- Status clearly shows "PAID"
- Download button is available
- No "Update" or "Pay" buttons are shown
- Optional: Show payment confirmation details (payment method, timestamp)

---

## Features & Tasks

### Invoice Display Components

- **ID01**: Create `InvoiceCard` component for inline display (shipment details view)
  - Shows: invoice # , status badge, total amount, tax rate
  - Conditionally displays CTA buttons based on invoice status
  - Mobile responsive with truncated text where needed

- **ID02**: Create `InvoiceSummary` component for detailed view (full invoice modal/page)
  - Shows: all invoice details (buyer, seller, line items, totals, tax, payment info)
  - Displays payment link with expiration countdown
  - Shows seller/buyer address atomized fields
  - Shows line item details (service name, quantity, unit price, VAT)

- **ID03**: Create `InvoiceReceipt` component for post-payment confirmation
  - Compact summary of paid invoice
  - Shows payment confirmation details
  - Displays invoice number, date, total

### Invoice Actions

- **IA01**: Implement "Download Invoice" button with PDF status checking
  - Check `pdfGenerationStatus` from shipment creation response
  - If status is `"PENDING"`: Show disabled button with loading spinner and message: "PDF is being generated, please wait..."
  - If status is `"READY"`: Fetch `pdfDownloadUrl` and enable button for download
  - On button click, call `GET /api/invoices/{invoiceId}/pdf` to check latest status
  - If status is still `"PENDING"` (202 response), retry every 2-3 seconds (max 10 retries)
  - If status becomes `"READY"` (200 response), show download link
  - If timeout after 10 retries, show error: "PDF generation is taking longer than expected. Please try again."
  - Display `pdfDownloadUrl` directly from response once available

- **IA02**: Implement "Email Invoice" button
  - Secondary button styling (less prominent than Download)
  - On click, show optional recipient email input or confirm current email
  - Call `POST /api/invoices/{invoiceId}/email` with recipient
  - Show toast: "Invoice sent!" (200 OK) or "Email queued, will send when ready" (202)
  - Disable button during request

- **IA03**: Implement "Update Invoice Now" button (conditional)
  - Only visible when `invoice.status === "PENDING" || "EXPIRED"`
  - Hidden when `invoice.status === "PAID"`
  - On click, navigate to estimates/shipment creation page with pre-populated data
  - Pass `shipmentId` and `invoiceId` in query params or state
  - Display message: "Update your shipment with new rates and regenerate payment link"

- **IA04**: Implement "Pay Now" button
  - Prominent CTA button
  - Only visible when `invoice.status === "PENDING"` or `"EXPIRED"`
  - Links to `invoice.paymentLink`
  - Opens in new tab
  - Show expiration countdown near button

- **IA05**: Implement payment link expiration countdown
  - Display time until `invoice.paymentLinkExpiresAt`
  - Format: "Expires in X hours Y minutes"
  - If expired, show "Link expired" and hide "Pay Now" button
  - Show "Update Invoice Now" button instead

### Invoice List & Management

- **IL01**: Create `InvoicesList` component for dashboards
  - Displays table/list of all user invoices
  - Columns: Invoice #, Date, Total, Status, Actions
  - Filter by status (All, Pending, Paid, Expired)
  - Pagination (limit 20 per page, configurable)
  - Sort by date, number, or amount

- **IL02**: Add context menu to invoice list items
  - Options: "View Invoice", "Download", "Email", "Update (if eligible)"
  - "Update" only appears for PENDING/EXPIRED invoices
  - Clicking "View Invoice" opens full invoice modal

- **IL03**: Create invoice status badge component
  - **PENDING**: Yellow/orange badge "Pending Payment"
  - **EXPIRED**: Red badge "Link Expired"
  - **PAID**: Green badge "Paid ✓"
  - Add tooltips explaining what user can do in each state

### Shipment Details Integration

- **SD01**: Add invoice section to shipment detail page/modal
  - Display as small inline receipt card below shipment info
  - Show: invoice #, status badge, total amount, tax rate
  - Include "View Invoice" link to open full invoice modal
  - Add "Update Invoice Now" button if PENDING/EXPIRED
  - Add "Download Invoice" and "Email" quick actions

- **SD02**: Add context menu option to shipment details
  - Add "View Invoice" to existing context menu (alongside "Duplicate", "Delete", etc.)
  - Clicking opens full invoice modal with all details

- **SD03**: Handle edge case: shipment without invoice
  - If shipment has no invoiceId, show placeholder: "Invoice generating..."
  - Add retry button if invoice fetch fails
  - Show error message if invoice not found

### Update Invoice Flow

- **UF01**: Create update flow integration with existing "Ship Again" page
  - Detect when navigating WITH `invoiceId` and `shipmentId` params
  - Pre-populate form with original pickup/dropoff data
  - Disable editing of pickup/dropoff address fields (read-only or grayed out)
  - Show notice: "You're updating your invoice with new rates"
  - When user selects new rates and clicks "Create Shipment", include `invoiceId` and `shipmentId` in request body

- **UF02**: Handle "Create Shipment" response during update
  - Verify response has same `shipmentId` and `invoiceId` (not a new creation)
  - Show updated totals with visual diff (old vs new)
  - Display message: "Invoice updated! Your payment link has been refreshed."
  - Extract new `paymentLink` and display with fresh expiration
  - Navigate to invoice payment view or back to shipment details

- **UF03**: Add validation to prevent unauthorized updates
  - If shipment status is COMPLETED or PAID, disable update flow
  - Show error message: "You cannot update a completed or paid shipment"
  - If invoice is not found, show error and prevent navigation

### PDF Availability Checking

- **PG01**: Implement PDF status polling utility hook
  - Custom hook: `usePdfStatus(invoiceId, initialStatus, maxRetries=10)`
  - Returns: `{ pdfUrl, isReady, isLoading, error, retry }`
  - Accepts initial `pdfGenerationStatus` from shipment response (READY or PENDING)
  - If initial status is READY: Set `pdfUrl` immediately, skip polling
  - If initial status is PENDING: Call `GET /api/invoices/{invoiceId}/pdf` to check
  - Polls with 2-3 second intervals until status is READY (200 OK) or max retries exceeded
  - Returns `pdfUrl` from successful response
  - Handles 202 Accepted (still generating) by retrying
  - Handles network errors gracefully with exponential backoff

- **PG02**: Create loading/pending state UI for PDF
  - Show spinner + message: "PDF is being generated, please wait..."
  - Display "Download" button in disabled state
  - Add estimated time: "Usually ready in 5-10 seconds"
  - Show retry button after 20 seconds if still pending: "Still generating? Click to try again"
  - Once ready, button becomes enabled with actual download link

- **PG03**: Create error UI for PDF availability failure
  - Show error message: "Could not retrieve PDF. PDF generation took longer than expected."
  - Provide "Retry" button to re-trigger polling
  - Fallback: Allow user to view invoice details in UI
  - Link to support: "Contact support if problem persists"

### Error Handling & Edge Cases

- **EH01**: Handle 403 Forbidden (ownership check)
  - Show: "You don't have permission to access this invoice"
  - Redirect to invoices list

- **EH02**: Handle 404 Not Found
  - Show: "Invoice not found"
  - Redirect to invoices list or dashboard

- **EH03**: Handle network errors
  - Retry logic with exponential backoff
  - After 3 retries, show: "Network error. Please check connection and try again."

- **EH04**: Handle missing invoiceId on shipment
  - Show loading placeholder while invoice is being generated
  - Retry fetch after 5 seconds
  - If not found after 3 retries, show error with option to contact support

---

## Non-Goals

- **Invoice editing after creation**: Users cannot modify invoice details (line items, addresses) after creation. They can only update rates via the "Update Invoice Now" flow.
- **Bulk invoice actions**: No bulk download, bulk email, or bulk delete features in this phase.
- **Invoice filtering by date range**: Only status-based filtering in initial implementation.
- **Custom branding on invoices**: Invoice PDF design is fixed by server.
- **Multi-currency support**: All invoices in PLN initially.
- **Admin invoice management UI**: Admin features are handled separately.

---

## Design Considerations

### Layout & Styling

1. **Invoice Card** (inline in shipment details):
   - Simple, clean card layout with icon for invoice
   - Light background (utilize CSS variable `--background-secondary`)
   - Flex layout: icon | [invoice # + status + total] | [CTA buttons]
   - Mobile: Stack vertically or use collapse/expand
   - Max-width: ~500px on desktop

2. **Invoice Modal/Page** (full invoice details):
   - Use existing modal component from UI library
   - Two-column or single-column layout on mobile
   - Left: Invoice details (buyer, seller, line items)
   - Right: Payment section (status, link, CTAs)
   - Actions sticky at bottom or floating

3. **Invoice List**:
   - Table on desktop, condensed list on mobile
   - Alternating row background for readability
   - Columns aligned right for numbers
   - Actions column (3-dot menu) on right

4. **Status Badges**:
   - Use existing badge component with status-based colors
   - PENDING: `--color-warning` (yellow/amber)
   - EXPIRED: `--color-error` (red)
   - PAID: `--color-success` (green)

5. **Buttons**:
   - **Primary CTAs**: "Pay Now", "Download Invoice", "Update Invoice Now"
   - **Secondary CTAs**: "Email Invoice", "View Invoice"
   - **Tertiary**: Context menu items
   - Use consistent button sizes from UI library

### Color & Typography

- All colors from `global.css` CSS variables (NO inline hex colors)
- Invoice numbers use monospace font (e.g., `font-family: monospace`)
- Amounts use larger font size with bold weight
- Tax rate as smaller, muted text below net amount

### Accessibility

- All buttons have proper `aria-label` for screen readers
- Invoice status badges have `title` attribute with explanation
- Links to payment gateway open in new tab with `rel="noopener noreferrer"`
- Form inputs for email field have proper labels
- Keyboard navigation for all modals and menus

---

## Technical Considerations

### Dependencies & Integration

1. **API Integration**:
   - Uses unified `POST /api/shipments` endpoint (CREATE and UPDATE flows)
   - Uses `GET /api/invoices/{invoiceId}` for fetching invoice details
   - Uses `GET /api/invoices/{invoiceId}/pdf` for PDF polling
   - Uses `POST /api/invoices/{invoiceId}/email` for email delivery
   - Uses `POST /api/invoices/{invoiceId}/regenerate-link` (optional, for manual regeneration)

2. **State Management**:
   - Store current invoice in component state or global store (Zustand/Redux)
   - Cache invoice list to avoid redundant API calls
   - Invalidate cache on update (refresh after shipment creation or invoice update)

3. **Hooks & Utilities**:
   - `useUnifiedShipmentFlow()` - for handling CREATE/UPDATE shipment API calls (already defined in integration guide)
   - `usePdfStatus(invoiceId, initialStatus, maxRetries)` - NEW custom hook for PDF availability checking
   - `useFetch()` or API client utility for GET/POST invoice endpoints
   - Existing auth hook for access token

4. **TypeScript Types**:
   - Extend/use types from `types/invoice.ts`:
     - `Invoice`, `InvoiceLineItem`, `InvoicePaymentLink`, `ErrorResponse`
   - Create new types for component props:
     - `InvoiceCardProps`, `InvoiceSummaryProps`, `InvoiceListProps`, etc.

5. **Existing Components to Reuse**:
   - Button component from `components/ui/button` (for CTAs)
   - Modal component from `components/ui/modal` (for invoice details)
   - Badge component from `components/ui/badge` (for status)
   - Toast/Notification component (for email, download confirmations)
   - Spinner/Loader from `components/ui/spinner`
   - Table component from `components/ui/table` (for invoice list)

6. **File Structure**:
   - New folder: `components/invoice/` with sub-components:
     - `InvoiceCard.tsx` - inline card for shipment details
     - `InvoiceSummary.tsx` - full invoice modal/page
     - `InvoiceReceipt.tsx` - post-payment receipt
     - `InvoicesList.tsx` - dashboard invoice list
     - `InvoiceStatusBadge.tsx` - reusable status badge
     - `InvoiceActions.tsx` - download, email, update buttons
   - New hook: `hooks/invoices/usePdfStatus.ts`
   - New utilities: `utils/invoice-helpers.ts` (formatting, validation)

7. **Routing**:
   - Invoices list page: `/app/invoices` or tab in dashboard
   - Invoice detail modal: can be overlay on existing page or at `/app/invoices/{invoiceId}`
   - Update invoice flow: redirect to `/app/shipments/new?invoiceId={}&shipmentId={}`

### Styling Notes

- Use **only CSS variables** from `global.css` for colors and spacing
- **NO gradients**, no inline `#hex` colors, no Tailwind `bg-blue-500`
- Flat, minimalist design matching project brand
- High contrast for accessibility (light text on dark, dark text on light)

### Performance Considerations

- Memoize invoice list components to prevent unnecessary re-renders
- Debounce status filter changes on invoice list
- Cache invoice data locally to reduce API calls
- Lazy-load invoice details modal content
- Implement virtual scrolling for large invoice lists (100+ items)

### Error & Edge Cases

- Handle `pdfGenerationStatus === "PENDING"` on initial response (show loading, then poll)
- Handle `pdfDownloadUrl === null` when status is PENDING (defer until ready)
- Handle 202 responses from PDF endpoint (retry with backoff)
- Handle 200 responses from PDF endpoint with `downloadUrl` (update button)
- Handle payment link expiration (show expired state, offer "Update" button)
- Handle network timeouts during PDF polling (max 10 retries, then error)
- Handle 403 Forbidden (user doesn't own invoice)
- Handle shipment without invoice (show loading or placeholder)
- Prevent updating PAID or COMPLETED invoices (validate on client + server)

---

## Success Metrics

1. ✅ Users can view invoice details within 2 seconds of shipment creation
2. ✅ PDF download success rate ≥ 95% (only 5% timeout failures)
3. ✅ Email delivery success rate ≥ 98%
4. ✅ "Update Invoice Now" flow completion rate ≥ 80% (when available)
5. ✅ Zero 403/404 errors related to invoice access (ownership/permissions)
6. ✅ Invoice UI loads in < 1 second (after data is fetched)
7. ✅ All invoice actions accessible from both shipment details and invoices list
8. ✅ Mobile responsiveness: All invoice components usable on devices ≥ 375px width
9. ✅ Accessibility: 95%+ WCAG AA compliance (tested with axe, Lighthouse)

---

## Open Questions

1. Should the "Update Invoice Now" button be positioned on the same card as the invoice, or as a separate prominent button above/below?
2. Do we need to show an expiration countdown timer that updates in real-time, or just a static "Expires at" timestamp?
3. Should users be able to edit the recipient email for invoice delivery, or default to their account email?
4. For the update invoice flow, should we show a visual diff (old rate vs new rate) or just the updated total?
5. Should we implement "Resend Invoice" functionality (for already sent invoices), or only initial send?
6. Do we need a "Print Invoice" option in addition to download and email?
7. Should invoice PDFs include payment receipt details if already paid, or only show unpaid state?
8. Should we hide "Email" and "Download" buttons if PDF generation fails, or show them with helper text?

---

## Implementation Timeline

- **Phase 1 (Days 1-2)**: Core invoice display components (Card, Summary, List)
- **Phase 2 (Days 2-3)**: Invoice actions (download, email, pay buttons)
- **Phase 3 (Days 3-4)**: Update invoice flow + shipment details integration
- **Phase 4 (Day 4-5)**: Error handling, edge cases, polish
- **Phase 5 (Day 5)**: Testing, accessibility audit, QA

---

## Related Documentation

- [Invoice Client Integration Guide](../invoice-client-integration-guide.md) - Complete API and flow documentation
- [Project Coding Standards](../../copilot-instructions.md) - Code style and architecture guidelines
- [Existing Component Library](../../components/ui/) - Reusable UI components
