# Task List: Invoice System Integration

**Feature:** Invoice Generation, Display, Download, and Email Integration  
**Date Created:** April 6, 2026  
**PRD Reference:** [prd-invoice-integration.md](../prd/prd-invoice-integration.md)  
**Backend Guide:** [invoice-client-integration-guide.md](../invoice-client-integration-guide.md)

---

## Relevant Files

- `types/invoice.ts` - TypeScript interfaces and types for all invoice-related data
- `utils/invoice-helper.ts` - Helper functions for invoice operations (formatting, status, etc.)
- `utils/pdf-helper.ts` - PDF download utility functions
- `utils/email-helper.ts` - Email validation and formatting utilities
- `hooks/invoices/useInvoices.ts` - Main hook for invoice API operations
- `hooks/invoices/useInvoiceDownload.ts` - Specialized hook for PDF downloads
- `hooks/invoices/useInvoiceEmail.ts` - Specialized hook for email delivery
- `store/invoice-store.ts` - Zustand store for invoice state management
- `store/shipment-store.ts` - Update existing store to include invoiceId
- `components/invoice/InvoiceDetailModal.tsx` - Modal for viewing invoice details
- `components/invoice/InvoicePreview.tsx` - Invoice summary in checkout flow
- `components/invoice/InvoiceListPage.tsx` - Full-page invoice history view
- `components/invoice/EmailInvoiceModal.tsx` - Email delivery form/modal
- `components/invoice/InvoiceStatusBadge.tsx` - Status indicator component
- `components/shipment/PaymentMethodSelector.tsx` - Update to integrate invoice generation
- `app/app/invoices/page.tsx` - Invoice history page route
- `hooks/invoices/useInvoices.test.ts` - Unit tests for invoice hooks
- `components/invoice/InvoiceDetailModal.test.tsx` - Tests for modal component
- `utils/invoice-helper.test.ts` - Tests for utility functions

### Notes

- All invoice components should be placed in `components/invoice/` (new directory)
- All invoice hooks should be placed in `hooks/invoices/` (new directory)
- Use existing `@/` import aliases per project standards
- All components should use CSS variables from `globals.css` (no inline colors)
- Follow project documentation standards with JSDoc comments

---

## Tasks

### Setup & Types

- [x] IN01: Setup TypeScript types and interfaces
  - [x] IN01.1: Create `types/invoice.ts` file with Invoice interface
  - [x] IN01.2: Add InvoiceLineItem interface to types/invoice.ts
  - [x] IN01.3: Add InvoicePaymentLink interface to types/invoice.ts
  - [x] IN01.4: Add request DTOs (GenerateInvoiceRequest, ConfirmInvoiceRequest, etc.)
  - [x] IN01.5: Add response DTOs (GenerateInvoiceResponse, ConfirmInvoiceResponse, etc.)
  - [x] IN01.6: Add ErrorResponse interface for standardized error handling
  - [x] IN01.7: Create invoice enums (InvoiceStatus, DeliveryMethod, PaymentMethod, SortField)
  - [x] IN01.8: Add JSDoc comments to all types and interfaces

### Utilities & Helpers

- [x] IN02: Create utility helpers and supporting functions
  - [x] IN02.1: Create `utils/invoice-helper.ts` with formatting functions
  - [x] IN02.2: Implement `formatInvoiceNumber()` function
  - [x] IN02.3: Implement `formatInvoiceAmount()` with PLN currency formatting
  - [x] IN02.4: Implement `getInvoiceStatusColor()` function
  - [x] IN02.5: Implement `getInvoiceStatusLabel()` function
  - [x] IN02.6: Implement `calculateTaxBreakdown()` function
  - [x] IN02.7: Implement `isPaymentLinkExpired()` function
  - [x] IN02.8: Create `utils/pdf-helper.ts` with download functions
  - [x] IN02.9: Implement `downloadFile()` generic download helper
  - [x] IN02.10: Implement `triggerDownload()` browser download function
  - [x] IN02.11: Implement `handleDownloadError()` error handler
  - [x] IN02.12: Create `utils/email-helper.ts` with email utilities
  - [x] IN02.13: Implement `validateEmail()` email validation function
  - [x] IN02.14: Implement `formatEmailSubject()` function
  - [x] IN02.15: Add JSDoc comments to all helper functions

### Hooks & API Integration

- [x] IN03: Create React hooks for API operations
  - [x] IN03.1: Create `hooks/invoices/` directory structure
  - [x] IN03.2: Create `hooks/invoices/useInvoices.ts` main hook
  - [x] IN03.3: Implement `generateInvoice()` method in useInvoices hook
  - [x] IN03.4: Implement `getInvoice()` method in useInvoices hook
  - [x] IN03.5: Implement `listInvoices()` method with filtering/pagination
  - [x] IN03.6: Implement `downloadPDF()` method in useInvoices hook
  - [x] IN03.7: Implement `regeneratePaymentLink()` method
  - [x] IN03.8: Add loading and error state management to useInvoices
  - [x] IN03.9: Integrate authentication token from `useAuth()` hook
  - [x] IN03.10: Implement exponential backoff retry logic
  - [x] IN03.11: Create `hooks/invoices/useInvoiceDownload.ts` specialized hook
  - [x] IN03.12: Implement PDF blob handling and cleanup in useInvoiceDownload
  - [x] IN03.13: Create `hooks/invoices/useInvoiceEmail.ts` specialized hook
  - [x] IN03.14: Implement email validation and debounce in useInvoiceEmail
  - [x] IN03.15: Add JSDoc comments and usage examples to all hooks

### State Management

- [x] IN04: Implement state management (Zustand stores)
  - [x] IN04.1: Update `store/shipment-store.ts` to include invoiceId field
  - [x] IN04.2: Add `setInvoiceId()` and `clearInvoiceId()` methods to shipment store
  - [x] IN04.3: Create `store/invoice-store.ts` for invoice state
  - [x] IN04.4: Implement `setCurrentInvoice()` method in invoice store
  - [x] IN04.5: Implement `setInvoiceList()` method for list caching
  - [x] IN04.6: Implement `updateFilters()` method for status/sort preferences
  - [x] IN04.7: Add localStorage persistence for invoice filters
  - [x] IN04.8: Implement cache invalidation logic (5-minute TTL)
  - [x] IN04.9: Add JSDoc comments to store actions

### UI Components

- [x] IN05: Create UI components for invoice display
  - [x] IN05.1: Create `components/invoice/` directory structure
  - [x] IN05.2: Create `components/invoice/InvoiceStatusBadge.tsx` component
  - [x] IN05.3: Implement status badge styling with color-coded states
  - [x] IN05.4: Create `components/invoice/InvoicePreview.tsx` component
  - [x] IN05.5: Implement invoice preview layout with summary info
  - [x] IN05.6: Add line items summary to InvoicePreview
  - [x] IN05.7: Add payment link display and expiration to preview
  - [x] IN05.8: Create `components/invoice/InvoiceDetailModal.tsx` component
  - [x] IN05.9: Implement modal layout with invoice details tabs
  - [x] IN05.10: Implement seller/buyer information display
  - [x] IN05.11: Implement line items table in detail modal
  - [x] IN05.12: Add action buttons (Download, Email, Regenerate) to modal
  - [x] IN05.13: Implement responsive design (mobile/tablet/desktop)
  - [x] IN05.14: Create `components/invoice/EmailInvoiceModal.tsx` component
  - [x] IN05.15: Implement email form with validation and submission
  - [x] IN05.16: Add loading and error states to email modal
  - [x] IN05.17: Create `components/invoice/InvoiceListPage.tsx` component
  - [x] IN05.18: Implement invoice table/list layout
  - [x] IN05.19: Add sorting, filtering, and pagination controls
  - [x] IN05.20: Implement row click to open detail modal
  - [x] IN05.21: Add responsive card layout for mobile
  - [x] IN05.22: Implement keyboard accessibility (Tab, Enter, Escape)
  - [x] IN05.23: Add ARIA labels to all interactive elements
  - [x] IN05.24: Add JSDoc/prop documentation to all components

### Payment Flow Integration

- [x] IN06: Integrate invoice generation into payment flow
  - [x] IN06.1: Locate existing payment method selector component
  - [x] IN06.2: Add invoice generation trigger after payment method selection
  - [x] IN06.3: Implement loading state UI while invoice is being created
  - [x] IN06.4: Display invoice preview after successful generation
  - [x] IN06.5: Call `/api/invoices/{invoiceId}/confirm` endpoint
  - [x] IN06.6: Update preview with confirmed payment link and expiration
  - [x] IN06.7: Store invoiceId in Zustand shipment store
  - [x] IN06.8: Add "View Invoice" button to shipment detail view
  - [x] IN06.9: Implement navigation from shipment view to invoice detail
  - [x] IN06.10: Add error recovery flow (retry generate if user wants)

### Error Handling

- [x] IN07: Implement comprehensive error handling
  - [x] IN07.1: Create centralized error handling utility function
  - [x] IN07.2: Implement 400 error handling for invoice generation
  - [x] IN07.3: Implement 404 error handling (invoice not found)
  - [x] IN07.4: Implement 409 error handling (invoice already exists)
  - [x] IN07.5: Implement 500 error handling with retry logic
  - [x] IN07.6: Add validation error display for form submissions
  - [x] IN07.7: Implement error boundary component for invoice components
  - [x] IN07.8: Add fallback UI when error boundary catches error
  - [x] IN07.9: Implement retry mechanism with exponential backoff
  - [x] IN07.10: Add detailed error logging in development mode

### Notifications & Toast

- [x] IN08: Add notifications and toast feedback
  - [x] IN08.1: Integrate existing react-hot-toast library
  - [x] IN08.2: Display success toast on invoice generation
  - [x] IN08.3: Display success toast on PDF download
  - [x] IN08.4: Display success toast on email send
  - [x] IN08.5: Display error toasts with retry option
  - [x] IN08.6: Display info toast for expired payment links
  - [x] IN08.7: Display warning toast for payment link expiration countdown
  - [x] IN08.8: Implement toast message templating with invoice numbers
  - [x] IN08.9: Add toast positioning and styling consistency
  - [x] IN08.10: Test all toast scenarios

### Testing & Documentation

- [ ] IN09: Testing and documentation
  - [ ] IN09.1: Create unit tests for `utils/invoice-helper.ts`
  - [ ] IN09.2: Create unit tests for `utils/pdf-helper.ts`
  - [ ] IN09.3: Create unit tests for `utils/email-helper.ts`
  - [ ] IN09.4: Create unit tests for `hooks/invoices/useInvoices.ts`
  - [ ] IN09.5: Create unit tests for `hooks/invoices/useInvoiceDownload.ts`
  - [ ] IN09.6: Create unit tests for `hooks/invoices/useInvoiceEmail.ts`
  - [ ] IN09.7: Create component tests for InvoiceDetailModal
  - [ ] IN09.8: Create component tests for InvoiceListPage
  - [ ] IN09.9: Create component tests for EmailInvoiceModal
  - [ ] IN09.10: Add integration test for payment flow with invoice generation
  - [ ] IN09.11: Run all tests and achieve 80%+ code coverage
  - [ ] IN09.12: Create README in `/docs/` for invoice feature overview
  - [ ] IN09.13: Document hook usage with code examples
  - [ ] IN09.14: Document component props and usage
  - [ ] IN09.15: Document error scenarios and solutions

### Code Review & Validation

- [ ] IN10: Code review and final validation
  - [ ] IN10.1: Run type check: `bunx tsc --noEmit`
  - [ ] IN10.2: Run linter: `bun run lint`
  - [ ] IN10.3: Run all tests: `bun run test`
  - [ ] IN10.4: Verify dev server starts: `bun run dev`
  - [ ] IN10.5: Test invoice generation flow end-to-end
  - [ ] IN10.6: Test invoice list page with pagination
  - [ ] IN10.7: Test PDF download functionality
  - [ ] IN10.8: Test email sending functionality
  - [ ] IN10.9: Test payment link regeneration on expired invoices
  - [ ] IN10.10: Test error handling for all error scenarios
  - [ ] IN10.11: Test mobile responsive design (all components)
  - [ ] IN10.12: Test keyboard accessibility (Tab, Enter, Escape)
  - [ ] IN10.13: Performance test with large invoice lists (1000+ items)
  - [ ] IN10.14: Update changelog.md with feature description
  - [ ] IN10.15: Final code review by team lead

---

## Implementation Notes

### Task Tracking

As you complete each sub-task, check it off by changing `- [ ]` to `- [x]`. For example:

- `- [ ] IN01.1: Task description` → `- [x] IN01.1: Task description` (after completing)

### Development Commands

- **Type Check:** `bunx tsc --noEmit`
- **Lint:** `bun run lint`
- **Run Tests:** `bun run test`
- **Dev Server:** `bun run dev`
- **Build:** `bun run build`

### Key Implementation Points

1. **Auth Integration:** All hooks use `useAuth()` to get access token automatically
2. **Store Integration:** Update shipment store with `invoiceId` field
3. **Error Handling:** Use centralized error handler for consistency
4. **Styling:** Use only CSS variables from `globals.css` (no hardcoded colors)
5. **Accessibility:** All components must be keyboard navigable and have ARIA labels
6. **Performance:** Implement pagination for invoice lists (max 20 items per page)
7. **Security:** Never log full invoice data (contains customer PII)

### Testing Strategy

- Unit tests for utilities and hooks (80%+ coverage target)
- Component tests for modals and pages
- Integration test for payment flow
- End-to-end manual testing before deployment

---

## Status

**Phase:** 3 - IN01-IN08 Complete, Testing & Review Pending  
**Last Updated:** April 7, 2026  
**Completed:** 88 sub-tasks (IN01-IN08 fully implemented)  
**Remaining:** 62 sub-tasks (IN09-IN10 testing and validation)  
**Total Tasks:** 150 sub-tasks across 10 parent categories  
**Progress:** 59% Complete - MVP Core Features Ready  
**Estimated Timeline:** 1-2 days for testing and final validation
