# Changelog

All notable changes to this project "Momentum Logistics Service" will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.42.3] - 2026-04-23 - Dashboard Currency Display

- Fixed: **Dashboard Currency Display** (`app/app/dashboard/page.tsx`)
  - Displayed currency in the dashboard to be Euros.

## [1.42.2] - 2026-04-22 - Invoice UI Data Population and Currency Formatting

- Fixed: **Invoice Receipt Population** (`app/app/invoices/[id]/page.tsx`, `components/invoice/InvoiceReceiptView.tsx`)
  - Passed current customer profile data into the invoice page so the buyer/customer section is filled from the active account.
  - Populated service description and item quantity from the shipment payload when invoice line items are missing.
  - Synthesized a fallback service row so service, description, quantity, net price, VAT, and gross render consistently.

- Fixed: **Currency Display** (`components/invoice/InvoiceReceiptView.tsx`, `components/invoice/InvoiceReceiptNew.tsx`, `components/invoice/InvoiceDetailModal.tsx`)
  - Rendered amounts with the invoice currency symbol instead of appending a plain currency code.
  - Kept PLN/EUR formatting consistent across receipt, modal, and payment-success invoice views.

- Fixed: **Invoice Address Formatting** (`utils/invoice-helpers.ts`)
  - Made address formatting tolerant of profile addresses that do not include building or apartment numbers.

## [1.42.1] - 2026-04-22 - Shipment Flow and Rate Fetch Stability

- Fixed: **Shipment Step Progression** (`app/app/shipments/new/page.tsx`)
  - Routed domestic package submissions directly to service selection.
  - Kept customs step conditional for international shipments only.
  - Updated service back-navigation to return to package for domestic flows and customs for international flows.
  - Corrected timeline and section visibility so the next step stays open instead of collapsing into a dead end.

- Fixed: **Rate Estimate Request Loop** (`app/app/shipments/new/page.tsx`)
  - Replaced the one-shot fetch guard with a payload signature check.
  - Prevented repeated `/shipments/get-shipping-estimate` calls after each successful response.
  - Preserved automatic fetching when shipment inputs actually change.

## [1.42.0] - Address Verification Implementation (Client-Side)

- Added: **Address Verification Types** (`types/auth.ts`, `types/address-verification.ts`)
  - New `AddressRequestStatus` type for tracking request states (PENDING | APPROVED | REJECTED)
  - New address metadata fields on User: `addressVerifiedAt`, `currentAddressRequestId`, `addressRequestStatus`, `addressRejectionFeedback`
  - New address verification API types: `AddressUpdateRequestPayload`, `AddressStatusResponse`, `AddressProofFilePayload`

- Added: **Address Verification API Integration** (`api/auth/index.ts`)
  - `submitAddressUpdateRequest()` - Submit address with proof file for admin review
  - `getAddressStatus()` - Fetch current active address and latest request status
  - Payload normalization for backend response shape variations

- Added: **Address Verification Hooks** (`hooks/auth/use-address-verification.ts`)
  - `useAddressVerificationStatus()` - Query hook with automatic polling when request is PENDING
  - `useSubmitAddressUpdateRequest()` - Mutation hook for submitting address update requests

- Added: **Address Verification UI Component** (`components/account/AddressVerificationSection.tsx`)
  - Display current active address with status badge (Approved/Pending/Rejected/Not Submitted)
  - Modal form for submitting address updates with proof file
  - Drag-and-drop file upload with validation (PDF, PNG, JPG, max 10MB)
  - Base64 encoding of proof files for backend transmission
  - Real-time form validation for address fields (street, city, postal code, country)
  - Error handling with field-level feedback
  - Auto-open via search params (`?openAddressVerification=1`)
  - Display of admin feedback for rejected requests

- Added: **Account Page Integration** (`app/app/account/page.tsx`)
  - New "Address Verification" card section with address update submission UI
  - Positioned after "Personal Information" section for logical flow

- Changed: **Verification Helper Logic** (`utils/verification-helpers.ts`)
  - Added `hasApprovedAddress()` to check backend approval status via `addressVerifiedAt` and `addressRequestStatus` metadata
  - Updated `getVerificationStatus()` to use approved address check instead of just completeness check
  - Enables shipment creation guard based on actual admin-approved status

- Changed: **Shipment Creation Guard** (`app/app/shipments/new/page.tsx`)
  - Added detection of `ADDRESS_REQUIRED` error from backend during shipment creation
  - When ADDRESS_REQUIRED is caught, shows verification modal with specific guidance
  - Routes "Update Address" CTA to new address verification form (`?openAddressVerification=1`)
  - Prevents infinite loops by managing modal state separately from verification status

- Fixed: **Infinite Loop in Address Verification** (`components/account/AddressVerificationSection.tsx`)
  - Separated form initialization (runs once on mount) from status update polling
  - Narrowed effect dependencies to specific data fields to prevent re-triggers during polling
  - Only updates user store when address status metadata changes (not on every refetch)

- Fixed: **Address Status Placeholder Handling** (`api/auth/index.ts`, `components/account/AddressVerificationSection.tsx`)
  - Normalized backend placeholder active address (`country: Poland` with empty street/city/zip) to be treated as no approved address.
  - Prevented "Current Active Address" from rendering country-only placeholder values while request status is pending.
  - Added manual `Check Status` action and removed automatic periodic polling from address status query.

- Fixed: **Address Status Effect + Refetch Control** (`components/account/AddressVerificationSection.tsx`, `hooks/auth/use-address-verification.ts`)
  - Stabilized `useEffect` dependency shape to resolve runtime warning about dependency array size changes.
  - Disabled automatic query refetch triggers (window focus, reconnect, interval, retries) so status refresh is user-driven.

- Changed: **Country Detection Strategy** (`store/country-store.ts`)
  - Removed external reverse-geocoding call to BigDataCloud.
  - Removed browser geolocation dependency for country detection.
  - Country is now detected from browser locale metadata only, with `EU` fallback when region is unavailable.

## [1.41.4] - 2026-04-20 - Shipping Quote Endpoint and Hero CTA Update

- Changed: **Shipping Quote API Integration** (`api/shipments/index.ts`, `hooks/shipments/use-shipments.ts`, `app/(marketing)/shipping-estimate/page.tsx`)
  - Kept `/shipments/get-shipping-estimate` for existing shipment creation and service-selection estimate flows.
  - Added a separate quote integration for marketing flow via `/shipments/get-shipping-quote`.
  - Added `useGetShippingQuote` hook and moved only the marketing shipping estimate page to the new quote endpoint.

- Changed: **Homepage Hero CTA Hierarchy** (`components/home/hero.tsx`)
  - Swapped CTA priority so **Get a Quote** is now the primary action.
  - Primary CTA now routes to `/shipping-estimate`.
  - Secondary CTA is now **Get Started** and routes to `/register`.

- Fixed: **Marketing Shipping Estimate Stability** (`app/(marketing)/shipping-estimate/page.tsx`)
  - Removed explicit `any` usage from Formik validation error mapping and replaced it with typed `FormikErrors` construction.
  - Fixed URL sync feedback loop by only calling `router.replace` when query params actually changed.

## [1.41.3] - 2026-04-18 - Remove PDF/Invoice Email Flows

- Changed: **Payments Types** (`types/payments.ts`)
  - Removed invoice-email payload types.
  - Added shipment invoice request payload/response types.

- Changed: **Payments API** (`api/payments/index.ts`)
  - Removed payment PDF download API integration.
  - Removed payment invoice email API integration.
  - Added `requestShipmentInvoice({ shipmentId })` API call for shipment invoice requests.

- Changed: **Payments Hooks** (`hooks/payments/use-payments.ts`)
  - Removed PDF download mutation hook.
  - Removed invoice-email mutation hook.
  - Added `useRequestShipmentInvoice` mutation hook.

- Changed: **Payment Success UI Flow** (`app/app/shipments/payment-success/page.tsx`, `components/invoice/InvoiceReceiptNew.tsx`)
  - Removed download/email action wiring and related handlers.
  - Replaced with shipment invoice request action.
  - Updated action labels and footer copy to reflect new behavior.

- Fixed: **TypeScript Strictness Issues** (tracking & shipping components)
  - Added null guards for optional `shipment` in `TrackingResponse` across tracking components.
  - Fixed `TrackingDetails.tsx` to use `categoryOfItem` instead of non-existent `contentsDescription` field.
  - Fixed `TrackingOverview.tsx` and `TrackingTimelineView.tsx` with proper shipment type narrowing.

## [1.41.2] - 2026-04-18 - Payment Success API Integration Refactor

- Added: **Payments Types Layer** (`types/payments.ts`)
  - Added payment-specific request/response interfaces for payment verification, invoice fetch payload, and invoice email payload.
  - Added normalized payment invoice model typing used by payment UI hooks.

- Changed: **Payments API Layer** (`api/payments/index.ts`)
  - Added `getPaymentInvoice(invoiceId)` to fetch invoice data through the shared `apiClient`.
  - Added `downloadPaymentInvoicePdf(invoiceId)` for PDF retrieval as Blob.
  - Added `sendPaymentInvoiceEmail({ invoiceId, email })` for receipt delivery.
  - Added internal response normalization for consistent UI invoice model usage.

- Added: **Payments Hooks Layer** (`hooks/payments/use-payments.ts`, `hooks/payments/index.ts`)
  - Added `usePaymentInvoice` query hook for payment-success invoice retrieval.
  - Added `useDownloadPaymentInvoicePdf` mutation hook for PDF downloads.
  - Added `useSendPaymentInvoiceEmail` mutation hook for sending receipts.
  - Added `useVerifyPayment` mutation hook for payment verification flows.

- Changed: **Payment Success Page Integration** (`app/app/shipments/payment-success/page.tsx`)
  - Replaced direct invoice/integration logic with payment-dedicated hooks.
  - Removed in-page API response transformation and direct data mapping logic.
  - Updated icon imports and lint-safe text escaping for JSX content.

## [1.41.1] - 2026-04-18 - Shipment Guard Flow Refinement

- Changed: **Middleware Guard Behavior** (`proxy.ts`)
  - Updated shipment creation guard flow to keep users on `/app/shipments/new` instead of redirecting to account.
  - Middleware now computes missing requirements (`email`, `address`, or `both`) and passes guard state via query params.
  - Added stale guard cleanup once the account is compliant.

- Changed: **Shipment Creation Blocking UX** (`app/app/shipments/new/page.tsx`)
  - Added page-level, non-dismissible verification modal shown directly on shipment page.
  - Background page remains visible but fully non-interactive while blocked.
  - Modal now conditionally shows required actions based on what is missing.

- Changed: **Account Verification Modal CTAs** (`components/shipment/account-verification-modal.tsx`, `types/verification.ts`)
  - Added separate CTA handlers for `Verify Email` and `Update Address`.
  - Added conditional checklist and messaging for missing email, missing address, or both.

- Changed: **Account Page Auto-Assist Flow** (`components/account/VerificationBanner.tsx`, `components/account/ProfileForm.tsx`)
  - Added auto-trigger for sending verification code and opening email verification modal when arriving with `openVerifyEmail=1`.
  - Added automatic profile edit mode when arriving with `focusAddress=1` for quick address updates.

- Fixed: **Address Completeness Detection** (`utils/verification-helpers.ts`)
  - Address validation now accepts both `postalCode` and legacy `zip` fields to avoid false checks.

- Changed: **Verification Navigation Target** (`hooks/shipments/useVerification.ts`)
  - Updated verification CTA route params to open the account email verification flow directly.

## [1.41.0] - 2026-04-18 - Invoice UI & Account Verification Enhancement

- Added: **Account Verification Modal** (`components/shipment/account-verification-modal.tsx`)
  - Non-dismissible modal with lock icon and verification checklist
  - Prompts users to verify email and complete address before shipment creation
  - Click-outside and Escape key are disabled (non-dismissible)
  - Primary CTA routes users to account settings page
  - Responsive design for mobile and desktop viewports
  - Animated entrance/exit with Framer Motion

- Added: **Verification Types & Interfaces** (`types/verification.ts`)
  - `VerificationStatus` interface for tracking email and address verification states
  - `VerificationError` interface for detailed error messaging
  - `AccountVerificationModalProps` interface for modal component props

- Added: **Verification Utilities** (`utils/verification-helpers.ts`)
  - `isEmailVerified()` - Check if user email is verified
  - `hasCompleteAddress()` - Validate user address completeness (street, city, postal, country)
  - `getVerificationStatus()` - Get overall verification state
  - `needsVerification()` - Determine if verification is required
  - `getVerificationError()` - Generate user-friendly error messages
  - `formatUserAddress()` - Format address for display
  - `extractUserInfoForInvoice()` - Extract name and address for invoice population

- Added: **Verification Hook** (`hooks/shipments/useVerification.ts`)
  - `useVerification()` hook for managing verification state
  - Provides real-time verification status, error details, and status change detection
  - `canProceed()` callback to check if user can proceed with shipment
  - `triggerVerification()` callback to navigate to account settings

- Added: **Form Submission Validation** (updates to `utils/form-submission-validation.ts`)
  - `hasVerificationStatusChanged()` - Detect when user completes verification

- Changed: **Customs Form Integration** (`components/shipment/customs-form.tsx`)
  - Integrated `AccountVerificationModal` component
  - Added verification status checks on component mount
  - Form is disabled (opacity-50, pointer-events-none) while modal is open
  - Modal closes automatically when verification status changes to complete
  - Submit button blocked until verification requirements are met

- Changed: **Invoice Drawer Enhanced** (`components/invoice/InvoiceDrawer.tsx`)
  - Added optional props for user data population:
    - `recipientName`: User name from profile
    - `recipientAddress`: User address from profile
    - `itemQuantity`: Count of items in shipment
    - `serviceDescription`: Auto-generated description from shipment service name
  - All props passed to `InvoiceReceiptView` for display

- Changed: **Invoice Receipt View Enhanced** (`components/invoice/InvoiceReceiptView.tsx`)
  - Added optional props for user data population
  - Recipient name populated from user profile when available
  - Recipient address populated from user profile (graceful fallback if missing)
  - Service name set to "Logistics"
  - Service description auto-generated from shipment context
  - Item quantity auto-populated from shipment data

- Added: **Invoice Data Population Utilities** (`utils/invoice-data-population.ts`)
  - Added helpers to enrich invoice display data from user and shipment context
  - Added safe fallbacks for missing recipient/address/service fields
  - Added display-oriented extraction utility for consistent invoice rendering

- Changed: **Shipment Details Page** (`app/app/shipments/[id]/page.tsx`)
  - Integrated `useAuth()` hook for user data access
  - Passes user name, address, and item quantity to `InvoiceDrawer`
  - Auto-generates service description from shipment data
  - Enables automatic invoice data population

- Fixed: **JSX Syntax Errors** in Customs Form
  - Fixed missing closing `>` on form element
  - Corrected indentation for proper JSX nesting
  - Resolved all JSX structure issues

- Fixed: **TypeScript Type Errors** in Verification Helpers
  - Cast `Address` objects to `Record<string, any>` for bracket notation access
  - Resolved index signature errors in helper functions

## [1.40.2] - 2026-04-12 - PRD for Codebase Quality Stabilization

- Added: New PRD `docs/prd/prd-codebase-quality-stabilization.md` for full lint/type/react quality hardening in currently reported lint scope.
- Added: Risk-phased remediation plan with strict validation gates:
  - `bun run lint` must pass with zero warnings and zero errors.
  - `bunx tsc --noEmit` must pass.
  - `bun run build` must pass.
  - Smoke checks for auth, shipments, invoices, and tracking must pass without runtime warnings.
- Added: Task categories covering all current rule families and in-scope files, including explicit `any` elimination policy and regression-prevention guardrails.

## [1.40.1] - 2026-04-12 - Invoice List Mapping and Payment Flow Alignment

- Fixed: Invoice list rendering with wrapped API responses
  - Normalized `/invoices/business/filter` and fallback `/invoices` responses from backend envelope format (`status/data/pagination`) into frontend `ListInvoicesResponse`.
  - Added mapper for list items (`id/date/breakdown.base`) to frontend invoice fields (`invoiceId/createdAt/totalNetAmount/totalGrossAmount`).
  - Restored invoice visibility in both the invoices table and invoice sidebar navigation.
- Changed: Invoice page table readability and consistency
  - Enforced light-surface styles for invoices layout and table cards to prevent dark unreadable combinations.
  - Standardized border radii and improved contrast for headers, rows, and pagination controls.
- Fixed: Carrier masking in user-facing invoice views
  - Applied carrier display transformation in invoice receipt line items so strings like "FedEx International ..." render as "MLS International ...".
  - Updated shipment invoice drawer to pass display-transformed invoice data.
- Fixed: Invoice totals normalization in receipt drawer
  - Added robust fallbacks for amount fields across API variants (`base/basePrice`, `tax/taxAmount`, `total/totalAmount`).
  - Corrected net and total values when older/newer invoice payload shapes are returned.
- Changed: Shipment details payment behavior
  - Removed standalone "Complete Payment" action from shipment status banner.
  - Payment is now driven by invoice status and invoice actions (View Invoice -> Pay Now/Update).

## [1.40.0] - 2026-04-11 - Invoice Receipt UI

- Added: **Receipt-Style Invoice View** (`InvoiceReceiptView.tsx`)
  - Premium receipt-style layout with invoice header, seller/buyer info, line items table, tax breakdown, and gross total
  - Shared component used by both the dedicated invoice page and the invoice side drawer
  - Supports condensed mode for drawer views and full mode for the dedicated page
  - Integrated Pay Now, Download PDF, and Send via Email action buttons
  - PDF generation polling via `usePdfStatus` hook with retry logic
- Added: **Expiration Countdown Timer** (`ExpirationCountdown.tsx`)
  - Live countdown updating every second with three visual states:
    - **Active** (>24h): Calm blue banner
    - **Expiring Soon** (<24h): Amber/warning banner with urgency
    - **Expired** (0): Red banner with "Update Shipment" CTA
  - Two layout variants: `banner` (full-width top bar) and `inline` (compact near Pay button)
- Added: **Invoice Side Drawer** (`InvoiceDrawer.tsx`)
  - Slides in from right via framer-motion animation
  - Shows condensed InvoiceReceiptView with all actions
  - "View Full Invoice" footer link navigates to dedicated page
  - Triggered from "Open Invoice" button on shipment details page
- Added: **Update Shipment Modal** (`UpdateShipmentModal.tsx`)
  - Inline rate-picker modal for PENDING/EXPIRED invoices
  - Fetches fresh rates from original shipment data
  - Payment method selector (Stripe/PayU) with country-aware defaults
  - Sends update payload with `shipmentId` + `invoiceId` to trigger server UPDATE flow
- Changed: **Invoice Detail Page** (`app/app/invoices/[id]/page.tsx`)
  - Complete rewrite using `InvoiceReceiptView` instead of legacy `InvoiceSummary`
  - Integrated `UpdateShipmentModal` for inline rate updates
  - Premium loading skeleton and error state with branded styling
- Changed: **Shipment Details Page** (`app/app/shipments/[id]/page.tsx`)
  - InvoiceCard click now opens `InvoiceDrawer` instead of navigating away
  - Added "Open Invoice" button below InvoiceCard
  - Integrated `InvoiceDrawer` and `UpdateShipmentModal` overlay components
  - Update flow redirects to refreshed invoice page on success
- Changed: Component exports updated in `components/invoice/index.ts`

## [1.39.1] - 2026-04-09 - Invoice Pages and Shipment Integration

- Changed: Shipment Creation redirect updates
  - Updated the application so that after shipment creation, the user is redirected to the invoice details page (`/app/invoices/[id]`) instead of immediately going to the payment options. This honors the invoice preview flow before payment, where users can choose to 'Pay', 'Download PDF' or 'Email Invoice'.

- Added: Complete invoice pages and routes
  - `/app/invoices` - List page with pagination, filtering (All, Pending, Paid, Expired), and sorting
  - `/app/invoices/[id]` - Detail page showing full invoice with all sections and actions
  - `/app/shipments/payment-success` - Post-payment success page with InvoiceReceipt and next steps
- Added: Invoice card integration to shipment details
  - Invoice card now appears in shipment details sidebar when invoice exists
  - Clickable invoice card opens full invoice detail page
  - Quick action buttons (download, email, update, pay) in card
- Added: Update invoice flow hook
  - `useInvoiceUpdateFlow.ts`: Detects `?invoiceId={id}&shipmentId={sid}` params
  - Automatically fetches original shipment and invoice data for editing
  - Enables form pre-population for invoice updates
- Changed: Shipment details page
  - Added InvoiceCard component to sidebar
  - Added router import for navigation to invoice pages
  - Integrated invoice-related actions
- Fixed: Component exports
  - Updated `components/invoice/index.ts` to export all new components
  - Updated `hooks/invoices/index.ts` to export new hooks

## [1.39.0] - 2026-03-24 - Invoice Management System Client Implementation

- Added: Complete invoice management UI components library
  - `InvoiceStatusBadge.tsx`: Status display with color-coded badges (Pending→Yellow, Expired→Red, Paid→Green)
  - `InvoiceActionsNew.tsx`: Action buttons for download, email, update, and payment with PDF polling
  - `InvoiceCardNew.tsx`: Compact inline invoice card for shipment details view
  - `InvoiceSummaryNew.tsx`: Full invoice details modal/page with buyer/seller info, line items, and totals
  - `InvoiceReceiptNew.tsx`: Post-payment confirmation with transaction details
  - `InvoicesListNew.tsx`: Paginated invoice list with status filtering, sorting, and bulk actions
- Added: PDF status polling hook
  - `hooks/invoices/usePdfStatus.ts`: Smart polling with exponential backoff for async PDF generation (max 10 retries)
- Added: Comprehensive invoice utility functions
  - `utils/invoice-helpers.ts`: 23+ helpers for formatting, validation, and business logic (23% tax rate, PLN currency)
- Added: Enhanced invoice type definitions
  - `types/invoice.ts`: New interfaces for `PdfGenerationStatus`, `InvoiceQuickInfo`, `CreateShipmentResponse`, `PdfStatusResponse`
- Changed: Invoice data flow alignment
  - Updated types to distinguish between server-side `pdfGenerationStatus` flag and actual `pdfDownloadUrl`
  - Clarified async PDF generation: backend generates, client polls via GET `/api/invoices/{id}/pdf`
- Fixed: Payment link handling
  - Filters active payment links from `invoice.paymentLinks` array
  - Shows expiration countdown with formatting (e.g., "Expires in 1 hour 23 minutes")

## [1.38.2] - 2026-03-23 - Shipping Estimate Customs Fine-tuning

- Changed: Package Details Enhancements
  - Made "Declared Value" strictly required (must be > 0) when the shipment route is international.
  - Dynamically updates the displayed currency (PLN vs EUR) based on the user's detected country code.
- Changed: Intelligent Defaults for Customs
  - The Customs Form now automatically extracts the `sender.name` from the pick-up details and splits it cleanly into `First Name` and `Last Name`.
  - Automatically imports the total package weight into the "Total Gross Weight" field to eliminate manual re-entry.

## [1.38.1] - 2026-03-23 - Shipping Estimate Customs UX Improvements

- Changed: Unified Package and Customs Data Flow
  - Streamlined `CustomsForm.tsx` by removing redundant inputs for item weight, value, and quantity.
  - Automatically derives and evenly splits `weight` and `value` proportionally across declared customs items based on the data entered in the `Package Details` step.
  - Pre-fills `nameEn` (Item Description) globally and reuses it for the required `namePl` in the background payload.
- Changed: Shipment Timeline & Buttons Optimization
  - Promoted "Customs Details" from a fractional step (3.5) to a full step (4), making "Service Selection" step 5.
  - Made the `Package Details` submit button label dynamic: displays "Customs Details" for international shipments to properly indicate the next step, while remaining "Calculate Rates" for domestic.
  - Changed the `Customs Details` submit button to "Calculate Rates" reflecting its position right before rate fetching.

## [1.38.0] - 2026-03-23 - Shipping Estimate Customs Integration

- Added: Strict Customs Information Flow for International Shipments
  - Created `<CustomsForm />` to explicitly collect standard `CustomsData` (`customsType`, `nipNr`, item `tariffCode`, etc.).
  - Added conditional rendering of "Customs Details" step in the new shipment `VerticalTimeline` when pickup country deviates from dropoff country.
  - Implemented Business (Simplified) and Individual clearance entity tabs mapped to strict logic.
- Changed: Payload & API Enhancements
  - Upgraded payload utility `getEstimatePayload()` to append nested `customs` properties conditionally for international costs.
  - Retained lightweight quoting mechanism by bypassing customs declarations for domestic shipments.
- Added: User Settings Persistence
  - Extended `User` schema and `ProfileForm` to include `defaultCustomsType` (Business/Individual) for future defaults.

## [1.37.0] - 2026-02-28 - Payment Gateway Selection for Checkout

- Added: Preferred Payment Method UI
  - Introduced an interactive payment selector allowing users to choose between Stripe (Credit/Debit Card) and PayU.
  - Automatically recommends "PayU" for Polish users (`PL` origin/user profile) and "Stripe" for international users.
  - Payment method state seamlessly integrates into the shipment payload.
- Changed: Shipment Creation Payload Upgrades
  - Extended `CreateShipmentPayload`, `LocalShipmentPayload`, and `InternationalShipmentPayload` types to include the `preferredPaymentOption` property.
  - The API submission (`getPayload` and `createShipment`) incorporates the selected intent natively.
- Fixed: Payment Reliability & UI Polish
  - Persisted the gateway returned by the API (`paymentGateway`) into localStorage ensuring verification flows work effortlessly upon user return.
  - Cleaned up React hooks violations caused by synchronous effect updates in the summary form.

## [1.36.0] - 2026-02-25 - Shipment Creation Payload Update

- Changed: Shipment Creation Payload Requirements
  - Renamed `carrierName` to `carrierSlug` across all shipment creation flows and types.
  - Standardized on lowercase slugs (e.g., "fedex", "mls") for better backend compatibility.
  - Fixed: Carrier slug manipulation where spaces were being preserved instead of using the provided slug from rates (e.g., "dhl-ecommerce" was becoming "dhl ecommerce").
  - Fixed: Branding logic where data transformation was incorrectly overwriting original carrier data in payloads; moved transformation to a UI-only layer (`transformedRates`, `displaySelectedRate`) while strictly retaining raw identifiers for backend submissions.
  - Updated `CreateShipmentPayload`, `LocalShipmentPayload`, and `InternationalShipmentPayload` interfaces.
- Fixed: Payment Verification Reliability
  - Ensured consistent carrier slug usage in `SummaryPage` and `NewShipmentPage` to resolve "Carrier not found" errors during payment initialization.
- Fixed: Shipment Details Runtime Error
  - Resolved `TypeError: Cannot read properties of null (reading 'trackingNumber')` in the Shipment Details page by adding a safety check for the existence of tracking data.
- Changed: Compact Verify Page UI
  - Reduced excessive vertical padding and removed redundant `min-h-screen` containers on the payment verification page.
  - Optimized card dimensions and internal padding for a more streamlined appearance during verifying, success, and failure states.

- Fixed: Redundant API Calls
  - Unified shipping estimate logic in `NewShipmentPage` to prevent double calls. Fetching is now centrally managed by a `useEffect` triggered by section transitions and data resets.
- Fixed: Authentication Stability & Network Errors
  - Added initialization guards to `AppLayout` to prevent race conditions during auth checks.
  - Improved error handling for `Network Error` with descriptive troubleshooting logs.
  - Optimized local API connectivity by switching `localhost` to `127.0.0.1` in environment configuration.

## [1.35.0] - 2026-02-20 - Location Permission Enforcement & Address Autocomplete Fixes

- Added: Strict Location Permission Requirement
  - Implemented `useLocationPermission` custom hook for tracking Geolocation and Permissions API states.
  - Created `LocationPermissionOverlay` component to provide clear instructions and retry logic for blocked location access.
  - Integrated mandatory location checks into the "Create Shipment" flow to ensure accurate regional service availability.
- Added: Enhanced City Selection Flexibility
  - Updated the `Select` component with `allowCustom` support.
  - Users can now manually enter city names if they are not provided in the standard autocomplete suggestions.
- Changed: Resilient Address Autocomplete Parsing
  - Refactored `handlePlaceSelect` in `AddressFields` to systematically extract street and city data from the `formatted_address` string when structured Google Places data is missing.
- Removed: IP-Based Location Tracking
  - Eliminated all legacy IP-detecting logic (`ipInfo`, etc.) from `country-store.ts`.
  - Migrated the application to use the Browser Geolocation API exclusively for device-level location accuracy.
- Fixed: Code Quality & Type Safety
  - Resolved multiple ESLint and TypeScript issues across location hooks, UI overlays, and address form components.
  - Fixed sync `setState` violations in `useEffect` and unescaped entity warnings.

## [1.34.3] - 2026-02-14 - Development Environment Stability

- Fixed: Development Server Hangs
  - Resolved an issue where the development server would hang indefinitely or fail to compile due to zombie Node.js/Bun processes.
  - Added comprehensive troubleshooting documentation at `docs/dev-server-troubleshooting.md`.
  - Established a clear protocol for clearing stuck processes (`pkill -f "bun|node|next"`) to restore the dev environment.

## [1.34.2] - 2026-02-14 - Fix Hydration Error in Phone Input

- Fixed: Hydration Mismatch in `PhoneInputComponent`
  - Replaced `styled-jsx` global styles with a standard CSS file import.
  - Resolved server/client class name mismatches caused by dynamic class generation.
  - Validated fix with `bunx tsc --noEmit` and lint checks.

## [1.34.1] - 2026-02-13 - API Authentication Fixes

- Fixed: Google Places API Authentication
  - Renamed `MLS_KEY` to `NEXT_PUBLIC_MLS_KEY` in `.env.local` to correctly expose the key to the client-side application.
  - Added request interceptor logic in `api/index.ts` to automatically inject the `X-MLS-Key` header when the key is present.
  - This ensures guest users can access location autosuggest services without 401 Unauthorized errors.

## [1.34.0] - 2026-02-12 - Shipping Estimate Enhancements & Pickup Contact Fields

- Added: Pickup Contact Fields in Shipping Estimate
  - Added mandatory Email and Phone Number fields to the Pick-up Details section.
  - Integrated `PhoneInput` component for robust phone number capture.
  - Implemented automatic pre-population of contact fields for authenticated users.
  - Updated `ShippingEstimatePayload` to include contact information for pickup.
- Added: Enhanced Rate Error Handling
  - Implemented a user-friendly "No Rates Found" state in the Quote Summary.
  - Added display of carrier-specific error details to help users troubleshoot address issues.
  - Added "Review Addresses" CTA to guide users back to the form when errors occur.
- Fixed: Restored missing address fields (Street, Country, State, City, Zip) that were accidentally removed during form updates.
- Changed: Schema & Type Safety
  - Refactored `shippingFormSchema` to include strict validation for new contact fields.
  - Updated `ShippingEstimateResponse` and `Rate` types to support error reporting.

## [1.33.0] - 2026-02-10 - Google Places Autocomplete & Street-First Layout for search friendly.

- Added: Google Places Autocomplete Integration
  - Integrated Google Places Autocomplete into all address forms (Origin, Destination, Shipping Estimate).
  - Implemented debounced search (300ms) to optimize API calls.
  - Added automatic population of City, State, Country, and Zip Code upon address selection.
  - Ensured all auto-populated fields remain editable for manual adjustments.
  - Implemented `sessiontoken` logic using `uuid` v4 for billing optimization.
- Added: Reusable `LocationAutocomplete` Component
  - Created a custom input component with high-contrast suggestions and minimalist design.
  - Built-in debounce and click-outside handling.
- Added: API & React Query Integration
  - Added `getAutocomplete` and `getPlaceDetails` to `api/location/index.ts`.
  - Created `useAutocomplete` and `usePlaceDetails` hooks.
  - Added reusable `useDebounce` hook.
- Changed: Street-First Address Layout
  - Rearranged `AddressFields` component to place "Street Address" at the top of all forms.
  - Standardized visual hierarchy for better accessibility and user experience.

## [1.32.0] - 2026-02-09 - Shipping Estimate Redirect

- Changed: 'Book Now' button on Shipping Estimate page
  - Replaced "Coming Soon" toast message with a redirect to the registration page (`/register`).
  - This allows users to immediately start the shipment process after getting a quote.

## [1.31.0] - 2026-02-09 - Address Form City Fallback

- Added: City Fallback Logic in `AddressFields`
  - Implemented automatic detection of empty city responses for selected states.
  - Added logic to automatically populate the city field with the state name when no cities are available.
  - Switched the city dropdown to a manual text input when cities are missing, allowing for manual entry.
  - Preserved standard dropdown behavior for regions with available city data.

## [1.30.0] - 2026-02-09 - API Base URL Configuration

- Changed: API Base URL Configuration
  - Updated `api/index.ts` to use `NEXT_PUBLIC_BASE_URL` environment variable for API base URL.
  - This allows for flexible API URL configuration without code changes.

### [1.29.0] - 2026-02-08 - Heavy Shipment Handling & Region Toggle

- Added: Heavy Shipment Modal (70kg+ threshold)
  - Created `HeavyShipmentModal` component displaying contact information for heavy freight services.
  - Integrated modal into Shipping Estimate page (`/shipping-estimate`).
  - Integrated modal into Shipment Creation flow (`/app/shipments/new`).
  - Modal triggers automatically when package weight is 70kg or above.
  - Displays information about FTL, LTL, Port Load, Groupage, and Door-to-Door freight.
  - Includes WhatsApp, phone, and email contact CTAs.
- Added: Heavy Freight Section on Homepage
  - Created `HeavyFreightSection` component for marketing homepage.
  - Added interactive `HeavyFreightShowcase` with animated weight counter and service selector.
  - Section placed after "How It Works" to highlight heavy cargo services.
- Added: Header Region Toggle
  - Created `HeaderCountrySelector` component showing only flag icon (🇵🇱/🌍) in header.
  - Dropdown reveals full region names ("Poland" / "International") with currency info.
  - Integrated into both desktop header navigation and mobile menu.

### [1.28.0] - 2026-02-07 - Production Finalization

- Changed: Phone Verification is Now Optional
  - Users can now create shipments after email verification only.
  - Removed `is_phone_verified` enforcement from `AddressForm` in shipment creation.
  - Updated `VerificationBanner.tsx` to only display when email is unverified.
  - Phone verification remains available as an optional feature in the user profile.
- Added: Policy Pages
  - Created `/terms` (Terms and Conditions) page with placeholder content.
  - Created `/privacy` (Privacy Policy) page with placeholder content.
  - Created `/cookies` (Cookie Policy) page with placeholder content.
  - Added a "Legal" section to the footer with links to all policy pages.
- Fixed: UI and Layout Improvements
  - `ActionMenu.tsx`: Changed width from fixed `w-48` to auto-sizing (`min-w-max`) and ensured left-aligned, single-line text.
  - `Header.tsx`: Mobile navigation now hides the "Login" button when user is authenticated.
  - `ShipmentHistoryPage`: Removed `overflow-hidden` from container to prevent ActionMenu dropdown from being clipped.
- Fixed: Next.js 16 Build Compatibility
  - Wrapped `useSearchParams()` in Suspense boundary on `/shipping-estimate` page.
  - Added loading skeleton component for better UX during hydration.
- **Details**:
  - Updated task documentation and PRD for production finalization.
  - Verified all changes pass TypeScript type checking (`bunx tsc --noEmit`) and production build (`bun run build`).

### [1.27.0] - 2026-02-03 - Phone Verification & Dual Login

- Added: Dual Login Support
  - Updated login form to accept either Email or Phone Number as a single identifier.
- Added: Mandatory Phone Number for Registration
  - Integrated `PhoneInputComponent` into the registration flow.
  - Enhanced `RegisterData` types to require a phone number.
- Added: SMS OTP Verification Flow
  - Implemented `VerifyPhoneModal` with a 6-digit OTP entry and resend cooldown.
  - Added `sendPhoneOTP` and `verifyPhoneOTP` API functions and hooks.
- Added: Global Verification Interceptor
  - Created `VerificationProvider` to manage global verification triggers.
  - Configured API interceptor to automatically open the verification modal on 403 "Verification Required" errors.
- Added: Shipment Creation Restrictions
  - Updated `AddressForm` to disable shipment creation for unverified accounts, providing clear UI feedback.
- Changed: Enhanced Verification Banner
  - Refactored `VerificationBanner` to handle both email and phone verification status simultaneously.

### [1.26.0] - 2026-02-03 - Phone Input Standards & Cross-Field Validation

- Added: Universal `PhoneInput` Component
  - Integrated `react-phone-input-2` with custom flat design styling.
  - Implemented searchable country flag dropdown using project-standard HSL colors.
  - Standardized phone number input behavior to include automatic country code selection.
- Changed: Enhanced `AddressForm` Validation
  - Implemented cross-field validation rule: selected phone country code must match the address country.
  - Added hidden `phoneCountry` state tracking for robust ISO-level validation via Zod `.refine`.
  - Replaced standard phone number input with the new universal component in the shipment creation flow.
- Changed: `PhoneInput` UX Refinements
  - **Scrollable Dropdown**: Optimized the country list with a fixed max-height and auto-scroll for better navigation.
  - **Minimalist Search**: Removed unnecessary search icons and expanded the layout to a full-width, clean search bar.
  - **Typing Support**: Fixed input focus and cursor management to allow seamless manual typing and number editing.
- **Details**:
  - Ensured no gradients and solid color usage in the `PhoneInput` dropdown to maintain project aesthetics.
  - Passed all TypeScript and ESLint checks for the new implementation.

### [1.25.0] - 2026-02-03 - Global Location Services & Shipping Estimate Refactor

- Added: Unified `AddressFields` Component
  - Created a single, reusable component for Country, State, City, Zip Code, and Street Address.
  - Replaced legacy `LocationSelector` with this new, comprehensive component.
  - Implemented searchable dropdowns (via `Select` component) for all location levels.
  - Replaced emojis with professional icons (FaGlobe, FaMapLocationDot, FaCity).
- Added: Enhanced Shipping Estimate Flow
  - Integrated `postalCode` (Zip Code) and `street` fields into the marketing estimate page.
  - Replaced legacy local/import/export modes with a unified global pickup/dropoff selector.
  - Added URL state persistence for all form values including newly added fields.
- Fixed: "Invalid input: expected string, received undefined" validation error
  - Migrated validation logic on Shipping Estimate, Login, and Register forms to manual Zod validation for robust error handling.
  - Ensured all required fields have explicit default values.
- Changed: Refactored Dashboard Shipment Creation
  - Migrated `AddressForm` to use the unified `AddressFields` component.
  - Enabled searchableDropdown functionality for Country, State, and City in the shipment wizard for improved UX.
  - Restored original section-based layout (Contact Person, Physical Address) in `AddressForm.tsx`.

- Removed: Legacy location handling
  - Deleted `components/shipping/location-selector.tsx`.
  - Deleted legacy JSON-based location data files.

  - Standardized `getEstimatePayload` utility for consistent payload construction across the app.
  - Updated `NewShipmentPage` and `ServicePage` to support the new nested location structure.

- Removed: Legacy Location Data
  - Deleted `lib/countries.json` and `lib/countries.iso.json` in favor of the dynamic API.
- Fixed: TypeScript Build Reliability
  - Resolved all type errors related to nested object access and payload interfaces.
- **Details**:
  - Enforced strict 4-step API integration process for the new location selectors.
  - Verified cross-page compatibility for shipping estimates in both marketing and application sections.

- Added: Country-Based Currency Detection & Display
  - **Updated**: Switched from IP-based detection to **Browser Geolocation API** for higher accuracy
  - **Enhanced**: Service Selection now displays formatted price with symbol AND ISO code (e.g., `1 498,95 zł PLN`)
  - Created `useCountryStore` Zustand store with sessionStorage persistence for currency preferences
  - Poland (PL) users see Polish Złoty (zł) formatting, all others see Euro (€)
  - Added `CountryDetector` component to root layout for automatic detection on page load
- Added: Currency Formatting Utility (`utils/currency-formatter.ts`)
  - `formatCurrency()` with locale-aware formatting (Polish: symbol after, Euro: symbol before)
  - `formatCurrencyCompact()` for compact display without trailing decimals on whole numbers
  - `getCurrencyForCountry()` helper for currency determination
- Changed: Homepage Hero Section Updates
  - Primary CTA changed from "Get a Quote →" to "Get Started →" linking to `/register`
  - Card 1 (Shipment Tracking) buttons now link to `/track-shipment`
  - Card 2 (Delivery Quote) displays dynamic currency based on user's detected country
  - Card 3 (International Shipping) buttons link to `/shipping-estimate` and `/about`
  - Marked hero component as client component for dynamic rendering
- Changed: Interactive Showcases & Components
  - Updated `QuoteEstimatorShowcase`, `ShipmentShowcase`, `ReceiptShowcase`, and `SimplifiedLogisticsShowcase` to use dynamic currency formatting
  - Implemented multiplier logic (4x) for PLN pricing in showcases to maintain realistic values
- Changed: Shipping Estimate Integration
  - Integrated `useCountryStore` to pass `userCountryCode` to API for currency-aware pricing
  - Updated rate display to use locale-formatted currency via `formatCurrency()`
  - Updated `ShippingEstimatePayload` type to include optional `userCountryCode`
- **Details**:
  - Removed server-side IP detection route (`/api/geo/detect`) in favor of client-side geolocation
  - Edge runtime used for geo detection API for optimal performance (Deprecated)
  - Fallback to EUR if country detection fails or permission denied

### [1.23.0] - 2026-01-19 - Custom 404 Page

- Added: Unified Custom 404 Page
  - Implemented "Lost Shipment" theme with truck animation.
  - Context-aware navigation: Redirects to Dashboard if in App, or Home if on Marketing site.
  - Interactive Tracking: Users can search for a shipment directly from the 404 page.
- **Details**:
  - Created shared `NotFoundView` component for consistent UI.
  - Configured specific `not-found.tsx` handlers for Global, App, and Marketing routes.

### [1.22.0] - 2026-01-18 - URL Tracking & Unpaid Redirect

- Added: URL-based Tracking
  - Support for direct tracking via URL: `/track-shipment/[tracking_id]`
  - Auto-tracks the shipment on page load.
- Added: Authentication & Unpaid Redirection
  - **Authenticated Users**: Auto-redirected from public tracking to the comprehensive dashboard view (`/app/shipments/[id]`) if logged in.
  - **Unpaid Shipments**: Improved "CREATED" status handling. Now displays a clear "Payment Required" card with a "Log in to Pay" button instead of a generic tracking error.
  - **Redirect Logic**: Login form now supports a `redirect` query parameter to return users to their intended destination after login.
  - **Download Label**: Added a button to download the shipment label on the shipment details page (authenticated view).
- **Details**:
  - **Middleware**: Updated `proxy.ts` with regex support to intercept `/track-shipment/[id]` and redirect authenticated users server-side.
  - **Error Handling**: Patched `trackShipment` pages to catch `status: "CREATED"` in both error responses (4xx) and successful responses (200 OK) to render the "Payment Required" UI.
  - **Consistency**: Applied authenticated redirection logic to both the direct URL access and the manual search form.
  - Implemented `TrackShipmentByIdPage` with `useAuthStore` check.
  - Enhanced `PublicTrackingResult` to handle `CREATED` status.
  - Updated `LoginForm` to handle `redirect` param.

### [1.21.0] - 2026-01-18 - Continue to Pay Feature & Tracking Enhancements

- Added: "Continue to Pay" Functionality
  - Implemented logic to allow users to pay for shipments that are in `CREATED` status.
  - Added "Complete Payment" button to the Tracking Page for untracked (unpaid) shipments.
  - Integrated `get-shipment` retrieval in the Tracking Page to resolve Shipment IDs for untracked shipments, ensuring payment flow works even with minimal tracking data.
  - Added proper loading states and user feedback during the payment resolution and redirection process.
- **Details**:
  - Leveraged `getShipment` API to robustly handle missing IDs in tracking responses.
  - Updated `TrackShipmentPage` to fallback to ID resolution when necessary.

### [1.20.0] - 2026-01-18 - Shipment Tracking & List Improvements

- Added: "Payment Required" Prompt for Unpaid Shipments
  - Implemented specific handling for `CREATED` shipments in the Tracking page.
  - Replaced misleading "Tracking Unavailable" errors with a clear call-to-action to pay for the shipment.
  - Hides standard tracking timeline until payment is completed to avoid confusion.
- Added: Enhanced Shipment List Actions
  - Replaced the single "Duplicate Shipment" button with a sleek "Three Dots" context menu.
  - **New Actions**:
    - **View Shipment**: Quick navigation to details.
    - **Copy Tracking Number**: One-click clipboard copy.
    - **Duplicate Shipment**: Existing functionality moved to menu to prevent accidental clicks.
  - Implemented reusable `ActionMenu` component with smooth framer-motion animations.
- **Details**:
  - Improved UX for new users who track shipments immediately after creation.
  - Reduced UI clutter on the shipment list.
  - Verified logic ensuring correct status handling across the application.

### [1.19.0] - 2026-01-17 - Authentication Redirect Implementation

- Added: Middleware-Based Authentication Redirect
  - Implemented `proxy.ts` (formerly `middleware.ts`) to intercept requests to auth pages (`/login`, `/register`, `/forgot-password`).
  - Automatically redirects authenticated users (with valid `mls_access_token`) to the Dashboard (`/app/dashboard`).
  - Improves user experience by preventing redundant login attempts.
- Changed: Middleware Architecture to "Proxy"
  - Migrated `middleware.ts` to `proxy.ts` to align with Next.js 16 conventions and deprecation warnings.
  - Renamed exported function from `middleware` to `proxy`.
- **Details**:
  - Used Edge Runtime for zero-latency redirects.
  - Configured matcher to strictly exclude API, static files, and Next.js internals for performance.
  - Verified stability of backend connections during implementation.

### [1.18.0] - 2026-01-16 - Unauthenticated Tracking Page & Privacy Enhancements

- Added: Public Tracking Page (`/track-shipment`)
  - Implemented a dedicated marketing tracking page accessible to all users.
  - Designed a high-impact Hero section with a prominent tracking ID search bar.
  - Integrated `PublicTrackingResult` component for privacy-focused data display.
- Added: Privacy & Security Logic
  - **Data Filtering**: strict stripping of sensitive data (exact addresses, contact info, documents) for unauthenticated users.
  - **Guard Clauses**: Robust handling of missing or malformed tracking data to prevent runtime crashes.
- Added: Navigation Updates
  - Added "Track Shipment" link to the Marketing Footer for easy access.
- Fixed: Runtime Stability
  - Resolved `TypeError` crash in tracking results by implementing safe data access patterns.
  - Added formatted date/time display (e.g., "May 19, 2023 at 7:03 PM") for better user readability.
- **Details**:
  - Reused existing `trackShipment` API with frontend-side privacy transformation.
  - Aligned UI with the "Momentum Blue" marketing aesthetic.

### [1.17.0] - 2026-01-16 - Enhanced Shipment Status Handling & Form Refinements

- Added: "Complete Payment" workflow for Created Shipments
  - Implemented logic to handle `CREATED` (unpaid) shipments in the details view.
  - Added a prominent status banner for unpaid shipments with a "Complete Payment" action.
  - Reused the duplication logic to facilitate seamless payment completion for these shipments.
- Added: Enhanced Status Feedback
  - Added specific status banners for `FAILED` and `CANCELLED` shipments in the details page.
  - Implemented specific error messaging for `FAILED` shipments in the Tracking page (`/track`) to guide users to support.
- Changed: Refined Form & State Management
  - **Removed Email**: Eliminated email fields from `AddressForm` and logic as per user feedback.
  - **Duplication Logic**: switched to URL-based (`?source=duplicate`) state preservation to correctly handle resets vs. persistence on page load.
  - **Strict State Clearing**: Shipment form data now clears immediately upon reload or navigation to ensure a clean slate for new users.
- Changed: Shipment Visibility Rules
  - Hiding tracking history timeline for `CREATED`, `FAILED`, or `CANCELLED` shipments to prevent misleading empty states.
  - Hiding tracking number display and copy actions for `FAILED` and `CANCELLED` shipments in the history list.
- **Details**:
  - Validated that `source=duplicate` param is automatically cleaned from URL after mounting.
  - ensured `AddressForm` Zod schemas and Formik initial values no longer require email.
  - Verified correct status banners appear for all non-standard shipment states.

### [1.16.0] - 2026-01-16 - Mobile Experience & Shipment Flow Enhancements

- Added: Mobile-First Navigation System
  - Implemented `MobileHeader` with brand logo and hamburger menu toggle.
  - Updated `SidebarNav` to support a "push" effect overlay on mobile devices.
  - Added backdrop and scroll locking for improved mobile drawer UX.
- Changed: Optimized Shipment Creation & Payment Flow
  - Integrated `createShipment` API in `NewShipmentPage` to initialize real shipments.
  - Implemented automatic redirection to Stripe secure checkout upon shipment creation.
  - Added high-fidelity loading states to the "Create Shipment" finalize button.
- Changed: Layout & Branding Refinement
  - Optimized mobile layout with ultra-minimal horizontal padding (8px / `px-2`).
  - Removed redundant company logos from Login and Register marketing pages for a cleaner aesthetic.
- Fixed: Design System Consistency
  - Enhanced `Button` component with built-in `isLoading` support and spin animations.
  - Standardized shipment creation payload to align with Stripe and backend requirements.
- **Details**:
  - Validated push-to-side behavior for mobile sidebar.
  - Confirmed immediate redirect flow to Stripe using the provided `checkoutUrl`.
  - Passed all TypeScript compiler checks using `bunx tsc --noEmit`.

### [1.15.1] - 2026-01-16 - Shipping Estimate Payload & Customs Refinement

- Fixed: Package Preview & Persistence Bugs
  - Resolved auto-submission regression where the package section would close immediately upon opening. Separated real-time store synchronization from section completion logic.
  - Updated `addPackage` in `shipment-store.ts` to perform an upsert (update if ID exists) instead of a simple append.
  - Added `updatePackage` action for explicit non-transitional store updates.
  - Implemented real-time store updates in `PackageForm` via `onSync` to ensure previews stay in sync without jumping sections.
  - Improved preset detection in `PackageForm` to correctly identify active presets when editing.
  - Fixed decimal dot stripping by restoring native change handling with numeric coercion.
- Changed: Standardized Shipping Estimate Payload
  - Simplified the `ShippingEstimatePayload` structure to strictly match API requirements (removed `customs` and `contact` data).
- Fixed: Customs Handling for Local vs International
  - Implemented conditional logic to remove the `customs` object from payloads for local shipments (same country) during creation.
- Added: Centralized Payload Helpers
  - Created `getEstimatePayload` and `checkIfInternational` utilities in `shipping-estimate/utils.ts` for consistent payload construction across the app.
  - Updated `NewShipmentPage`, `ServicePage`, and `ShippingEstimatePage` to use the standardized helpers.
- Changed: Type Safety Improvements
  - Updated `ShippingEstimatePayload` interface in `@/types/shipping.ts` to reflect the optional nature of customs for estimates.
  - Refined `getPayload` in `utils.ts` to strictly enforce the absence of customs for local shipment creation.
- **Details**:
  - Verified that local shipments no longer send unnecessary customs data to the API.
  - Confirmed that international shipments correctly include mandatory customs declarations for accurate rate calculation and shipment creation.
  - Passed all TypeScript compiler checks using `bunx tsc --noEmit`.

### [1.15.0] - 2026-01-16 - Quick Shipment Page Redesign

- Added: Single-Page Stacked Layout
  - Replaced multi-page navigation with a vertically stacked section design.
  - Interactive **Vertical Timeline** for progress tracking and section navigation.
  - **Summary Drawer**: Side/bottom drawer for final review before shipment creation.
  - Sequential section loading: steps reveal only as previous data is validated.
- Added: Package Details Enhancements
  - **Declared Value**: New field for insurance and customs purposes.
  - Refined **Content Description**: Full-width input with proper labeling.
  - **Label Separation**: Weight and Declared Value now have dedicated labels and columns.
- Fixed: Rate Calculation & Compatibility
  - Corrected `ShippingEstimatePayload` structure to include required `customs` field.
  - Standardized system currency to **USD** for custom shipping flows.
  - Resolved build error in `NewShipmentPage` related to payload syntax.
  - Restored missing `ServiceSelection` and `SummaryDrawer` components.
- Changed: Terminology & Styling
  - Updated "Origin/Destination" to "Pick-up Details" and "Drop-off Details".
  - Integrated "Get a Quote" design patterns (double-fitting selectors, high-contrast inputs).
- Added: Navigation & Persistence Safety
  - **Unsaved Changes Notice**: On-page alert and `beforeunload` dialog to prevent data loss.
  - Selective persistence: Form state clears automatically upon navigation or completion.
- **Details**:
  - Implemented `StackedSection` and `VerticalTimeline` modular components.
  - Refactored `useShipmentStore` to manage multi-step state within a single page.
  - Ensured mobile responsiveness with sticky headers and adaptive drawer positioning.

### [1.14.6] - 2026-01-16 - Shipment Detail Page Fix & Type Safety Improvements

- Changed: Shipment Details Page Architecture
  - Migrated `app/app/shipments/[id]/page.tsx` to use the `useGetShipment` hook for unified data fetching.
  - Integrated modular tracking components: `TrackingOverview`, `TrackingDetails`, and `TrackingTimelineView`.
  - **Enhanced**: Now displays the **full tracking timeline** rather than a truncated view on the details page.
  - **Enhanced**: Added **Pickup Information** (Origin) to the tracking details view for a 360-degree journey overview.
  - Applied `deepTransformData` for consistent "MLS" branding across all shipment details.
- Fixed: Application-Wide Type Checking
  - Resolved multiple property errors in `utils/shipment-helper.ts` relating to the `Shipment` interface.
  - Fixed incorrect property usage in `app/app/dashboard/page.tsx` (`trackingNumber` -> `carrierTrackingNumber`).
  - Added mandatory `contact` property to all `Address` objects in `ServicePage` and `ShippingEstimatePage`.
- **Details**:
  - Improved the visual hierarchy of the shipment detail page with a clean sidebar for physical specifications.
  - Ensured all addresses in the shipping flow now include required contact metadata.
  - Verified full type safety of the client application with `bunx tsc --noEmit`.

### [1.14.5] - 2026-01-15 - Tracking Page Enhancement & Code Refactor

- Added: Modular Tracking Components
  - `TrackingSearch`: Unified search input and logic.
  - `TrackingOverview`: High-level status and tracking number display.
  - `TrackingDetails`: Consolidates drop-off and package content info.
  - `TrackingTimelineView`: Efficient timeline rendering with Top 2 + Gap + Bottom 1 logic.
  - `RecentShipments`: Cleaned up history buttons for the empty state.
- Changed: Enhanced Date & Time Formatting
  - Strictly following user requirement: `"15 may, 2026, 09:29pm"`.
  - Integrated year into all tracking dates.
  - Standardized 12-hour time format with lowercase am/pm.
- Changed: Refactored Tracking Page Architecture
  - Cleaned up `/app/track/page.tsx` to be more readable and efficient.
  - Strictly using `TrackingResponse` interface as the data source.
  - Added comprehensive comments and JSDoc documentation.
- **Details**:
  - Optimized timeline sorting and filtering logic.
  - Improved error handling and loading states with consistent UI feedback.

### [1.14.4] - 2026-01-14 - Implementation of Track Shipment Page

- Added: Dedicated Track Shipment Page (`/app/track`)
  - Minimalist search interface for MLS tracking IDs.
  - Enhanced empty state showing the user's latest 5 shipments from history.
  - Interactive "Recent Shipments" buttons for quick re-tracking.
  - Detailed shipment timeline with status cards, location markers, and event timestamps.
  - Tailwind pulse skeleton loaders for a smooth data-fetching experience.
- Changed: Updated Sidebar Navigation
  - Corrected the "Track Shipment" link to point to the new internal route.
  - Ensured active state highlighting works correctly in the sidebar.
- **Details**:
  - Integrated with the backend `trackShipment` and `getShipmentHistory` endpoints.
  - Enforced authentication protection via the `app/app` directory layout.
  - Standardized design using brand colors and icons from `react-icons/fi`.

### [1.14.3] - 2026-01-14 - Copy-to-Clipboard Feature & Layout Refinement

- Added: Subtle Copy-to-Clipboard Feature
  - Created reusable `<CopyButton />` with tooltip and visual success feedback.
  - **Enhanced Feedback**: Tooltip automatically changes to "Copied!" during the success state.
  - Integrated copy buttons into Account page (Email, User ID) and Shipments page (Tracking Numbers).
- Changed: Shipment History Layout Optimization
  - Refactored the shipment list rows to use fixed-width Flexbox columns.
  - Ensured consistent vertical alignment of status badges and action icons regardless of recipient name or tracking code length.
- **Details**:
  - Implemented logic to prevent parent link triggers when clicking copy buttons.
  - Standardized the visual hierarchy on the Shipments page using `shrink-0` and `basis` utilities.

### [1.14.2] - 2026-01-14 - Fix Authentication Refresh Endpoint

- Fixed: Updated incorrect refresh token endpoint from `/auth/refresh` to `/auth/refresh-token` in `api/index.ts`.
- Fixed: Resolved documentation inconsistencies in `openapi.json` regarding the refresh endpoint.
- **Details**:
  - This fix ensures that users who select "Remember me" during login stay authenticated as their access tokens can now be correctly refreshed.
  - Verified that the persistence preference is correctly handled in `LoginForm.tsx` and `setTokens`.

### [1.14.1] - 2026-01-14 - Fix Metadata Base Warning

- Fixed: Resolved Next.js metadata warning by adding `metadataBase` to root metadata in `app/layout.tsx`.
- **Details**:
  - Configured `metadataBase` to use `NEXT_PUBLIC_APP_URL` environment variable with a fallback to `http://localhost:3000`.
  - Verified fix via TypeScript compiler and local development logs.

### [1.14.0] - 2026-01-13 - Comprehensive User Authentication & Profile Flow

- Added: Unified "Profile Stack" UI
  - Implemented a card-based layout in `app/app/account/page.tsx` for grouped account actions.
  - **ProfileCard**: Social-media style user overview with verification status.
  - **AccountStack/AccountCard**: Scalable containers for categorizing settings.
- Added: Enhanced Email Management
  - **VerificationBanner**: Persistent call-to-action for unverified accounts.
  - **VerifyEmailModal**: Pop-up code entry flow for account verification.
  - **EmailChangeModal**: Two-step modal flow (Request -> Confirm) for secure email updates.
- Added: Password Security Features
  - **ChangePasswordForm**: Secure in-app password updates for authenticated users.
  - **ForgotPasswordPage**: Unified public flow for password recovery via 6-digit codes.
- Changed: API Client Modernization
  - Updated `api/auth/index.ts` to fully map all endpoints from `openapi.json`.
  - Implemented refresh token revocation in `logout` handler.
  - Integrated project-standard `useToast` for real-time feedback on all operations.
- **Details**:
  - Refactored `ProfileForm` to include detailed address management.
  - Optimized modal architecture using React Portals for consistent UI layering.
  - Enforced strict client-side validation for all sensitive inputs.
  - **Refinement**: Integrated `PasswordInput` with visibility toggles for all password fields.
  - **Refinement**: Automated verification code generation upon clicking "Verify Now" in the banner.

### [1.13.0] - 2026-01-13 - API Refactoring and Dashboard Data Integration

- Added: Real-time Dashboard Statistics
  - Implemented `useShipmentStats` hook for frontend-side calculation of active/completed shipments and monthly spend.
  - Replaced mock dashboard data with live API data from `get-shipment-history`.
- Added: Enhanced Shipment Identification
  - **New Title Logic**: Priority given to `Recipient Name • City` (e.g., "Adedotun Gabriel • New York City") for better identification.
  - **Custom Tracking Numbers**: Standardized display of `MLS-TRK-...` custom identifiers across all shipment lists.
  - **Subtitles**: Added concise subtitles showing `Creation Date • Price` (e.g., "13 Jan 2026 • 1658.01 PLN") for quick context.
- Changed: Comprehensive API Route Refactoring
  - Migrated all frontend API calls to use new descriptive backend routes (e.g., `/auth/login-user`, `/shipments/get-shipment-history`).
  - Consolidated shipping and shipments APIs into a single `api/shipments` service.
- Fixed: Dashboard & Statistics Refinements
  - **Robust Spend Calculation**: Improved monthly/lifetime spend logic to be case-insensitive for payment statuses (e.g., matching "PAID", "succeeded").
  - **Human-Readable Statuses**: Integrated a status formatter to convert enums like `IN_TRANSIT` to "In Transit".
- Added: Centralized `shipment-helper` Utility
  - Created `utils/shipment-helper.ts` to unify status formatting and display name generation logic across the application.
- **Details**:
  - Unified data presentation between the Dashboard "Recent Shipments" list and the "Shipment History" page.
  - Optimized statistics aggregation to happen during the data fetching layer for zero-latency UI updates.
  - Updated `Shipment` type definitions to include expanded address and tracking metadata.

### [1.12.0] - 2026-01-05 - Shipment Creation Flow Refinements and Fixes

- Added: Payment Verification Page
  - Created `/app/shipments/new/verify` to handle Stripe redirects.
  - Displays shipment status (tracking number, label) or failure messages.
  - Automatically verifies payment session with backend.
- Added: State/Province Code Enforcement
  - Integrated `country-state-city` library for dynamic state dropdowns.
  - Enforced mandatory state codes for countries that require them (e.g., US, Canada).
  - Updated `AddressForm` to dynamically validate state presence.
- Changed: Shipment Payload Refinement
  - Implemented strict shipment types (`LocalShipmentPayload` vs `InternationalShipmentPayload`).
  - Ensured `customs` data is only sent for international shipments.
  - Mapped package details (Value, Description, Currency) to Customs Declaration automatically.
- Fixed: Carrier Name Transformation
  - Updated logic to correctly transform "FedEx" (case-insensitive) to "MLS" in all views.
- Fixed: Pricing Display
  - Updated Service Selection and Summary pages to use `actualPrice` from API response.
- Added: SEO Enhancements
  - Configured Open Graph image in `app/layout.tsx` using `public/images/og-image.png`.
- **Details**:
  - Refactored `getPayload` helper to ensure strict type safety before submission.
  - Resolved `RECIPIENTS.STATEORPROVINCECODE.INVALID` errors by ensuring 2-digit state codes are sent.

### [1.11.0] - 2026-01-04 - Dashboard UI Refresh

- Changed: Dashboard UI Enhancements
  - **Stats Cards**: Redesigned with solid brand colors (Blue, Yellow, Lavender) and added icons.
  - **Create Shipment Button**: Added "Plus" icon for better visibility.
  - **Recent Shipments**: Added distinctive "View All" button with arrow icon.
  - **Empty State**: Created colorful, illustrated empty state for new accounts.

### [1.10.0] - 2026-01-04 - App Structure Refactor and Authentication Enhancements

- Changed: Major Application Restructuring (`/app` separation)
  - Public marketing pages moved to `app/(marketing)` group (Home, About, Contact, Login, Register, Tracking, Estimator)
  - Authenticated application pages moved to `app/app` segment (Dashboard, Shipments, Account)
  - **URL Changes**: Dashboard is now `/app/dashboard`, Shipments `/app/shipments`, Account `/app/account`
- Changed: Layout Architecture
  - Created `MarketingLayout` (`app/(marketing)/layout.tsx`) for public pages (includes Header/Footer)
  - Created `AppLayout` (`app/app/layout.tsx`) for authenticated pages (includes SidebarNav, auto-login check)
  - Updated Root Layout `app/layout.tsx` to only handle global providers
- Changed: Authentication System Refactor
  - Replaced local storage usage with persistent Zustand store (`persist` middleware)
  - Created cleaner API abstraction layer in `api/auth`
  - Updated hooks (`useLogin`, `useRegister`, `useLogout`) to manage store state and API calls
  - Removed aggressive 401 logging from console to reduce noise
- Added: Enhanced User Feedback
  - Integrated `useToast` for Login and Registration flows
  - Added specific error messages extracted from API responses (e.g., "Invalid Credentials", "Account Exists")
  - Added "Signing in..." and "Creating Account..." loading toasts
- **Details**:
  - Updated `SidebarNav` to link to new `/app` routes
  - Updated `DashboardPage` and `ShipmentsPage` internal links
  - Login redirects successful users to `/app/dashboard`

### [1.9.0] - 2025-12-16 - Enhanced Shipping Estimate Page

- Added: Display of all available shipping rates in estimate results
- Added: Skeleton loading state for better user experience during estimation
- Changed: Updated API types to include `deliveryDescription` and `warnings`
- **Details**:
  - Implemented a list view for rates showing service name, delivery description, and price.
  - Replaced "Type" section with Price display.
  - Removed Warnings display as per user request.
  - Fixed: Updated `Rate` type and display logic to correctly show price and currency from new API structure.
  - Added a "Book" button placeholder for each rate.

### [1.8.1] - 2025-12-11 - Guest ID Integration Refinement

- Changed: Renamed `GuestIDInitializer` to `guest-id-initializer.tsx` for file naming consistency
- Fixed: Integrated dynamic `guestId` into Shipping Estimate payload (replaced hardcoded value)
- **Details**:
  - Validated that shipping estimates now correctly associate with the anonymous guest session.

### [1.8.0] - 2025-12-11 - Shipping Estimate Rebranding and Contact Updates

- Changed: Rebranded all FedEx shipping estimates to MLS
  - Replaced "FedEx" with "MLS" in all shipping rates and service descriptions
  - Simplified service names (e.g., "International Connect Plus" -> "MLS Connect+")
- Changed: Updated contact information
  - Address: ul. kpt pilota zwirki 17, 90-539 Łódź
- Changed: Updated social media links
  - Added X (Twitter) link pointing to `@momentumlogserv`
  - Removed placeholder Facebook link
- Added: Anonymous Guest Tracking
  - Implemented persistent `mls_guest_id` cookie for tracking unauthenticated sessions
  - Added Axios interceptor to automatically inject `X-Guest-ID` header into API requests
- **Details**:
  - Implemented `transformShippingData` utility for deep recursive cleaning of shipping API responses to ensure consistent branding.
  - Verified social links and address in Footer and Contact page.
  - Guest ID format: `mls_guest_[uuid]`

### [1.7.0] - 2025-12-04 - Shipping Estimate page redesign and geolocation enhancements

- Added: Redesigned Shipping Estimate Hero Section
  - New `ShippingHero` component with 2-column layout (Text + Showcase)
  - New `ShippingProcessShowcase` component with animated steps (Enter Details -> Get Quote -> Ship It)
  - Replaced fixed background hero with contained, interactive layout for better usability
- Added: Enhanced Geolocation Features
  - Implemented Reverse Geocoding using OpenStreetMap Nominatim API
  - "Use current location" now fills the input with the full, building-level address instead of coordinates
  - Improved error handling with specific alerts for permission denial and timeouts
- Changed: Navigation Updates
  - Updated "Get a Quote" buttons in Header, How It Works, and CTA sections to link to `/shipping-estimate`
- Fixed: Hydration Mismatch Error
  - Replaced `styled-jsx` animations with Tailwind utilities in `ShippingProcessShowcase` to resolve server/client class name mismatches
- **Details**:
  - Configured geocoding with `zoom=18` for maximum address precision
  - Preserved existing form layout while improving the visual hierarchy above it

### [1.6.0] - 2025-12-03 - Social links and contact information update

- Changed: Updated social media links in Footer and Contact page
  - Removed Facebook and Twitter (X)
  - Added Instagram and LinkedIn
  - Added WhatsApp link
- Changed: Updated contact information
  - Email: `info@momentumlogservices.com`
  - Phone: `+48 795 069 276`
- Changed: Updated FAQ support link to direct to WhatsApp
- **Details**:
  - Commented out unused social links in code instead of deleting them
  - Ensured "Contact Us" buttons and links point to the correct new channels

### [1.5.0] - 2025-11-22 - Mobile experience overhaul and brand assets

- Added: Enhanced Mobile Navigation
  - Full-screen immersive overlay with `brand-blue` background
  - Smooth slide-in and fade-in animations for menu and links
  - Dynamic logo switching: Shows white logo (`logo-landscape-white.svg`) when menu is open
  - Auto-collapse functionality when a link is clicked
  - Active state highlighting with pulsing arrow indicator
  - Abstract background artifacts (glowing orbs, grid pattern) for premium feel
- Added: Brand Assets
  - `public/og-image.svg`: Custom Open Graph image for social sharing (1200x630)
  - `docs/og-image-prompt.md`: Detailed AI prompt for generating future brand images
  - Updated Favicon: Now using `public/favicon.svg` in `app/layout.tsx`
- Changed: FAQ Section Refactor
  - Moved `FAQSection` to `components/shared/` for reusability
  - Added `FAQSection` to the bottom of the Contact page
- **Details**:
  - Improved mobile close button visibility (switches to white on dark background)
  - Prevented body scrolling when mobile menu is open
  - Verified all assets use correct brand colors (`#005db1`, `#fcb417`)

### [1.4.0] - 2025-11-21 - About Us page with interactive showcases and core values

- Added: `AboutPage` (`/about`) with comprehensive company information and interactive storytelling
  - **Hero Section**:
    - Light-themed design with subtle animated background elements
    - Two-column layout featuring text on the left and interactive showcase on the right
    - "Revolutionizing Logistics" headline with brand color gradients
  - **Mission & Vision Section**:
    - Zig-zag layout alternating between text and visual showcases
    - Distinct styling for Mission (White bg) and Vision (Gray bg)
    - Interactive `MissionShowcase` visualizing "Instant Logistics" with automated process steps
    - Interactive `VisionShowcase` visualizing "Global Connectivity" with abstract network animations
  - **Core Values Section**:
    - Bento Grid layout for dynamic visual hierarchy
    - Four distinct value cards: Trust First, Innovation, Partnership, Global Mindset
    - Interactive `TrustShowcase`: Glassmorphic card displaying security verifications and trust score
    - Interactive `InnovationShowcase`: Tech-focused card with AI optimization stats and auto-routing visuals
    - `PartnershipShowcase`: Subtle background animation with connecting rings and dots
    - `GlobalMindsetShowcase`: Abstract map background with floating location markers
  - **Problem vs Solution Section**:
    - Comparative layout highlighting "The Old Way" vs "The Momentum Way"
    - Visual cues using red/cross and brand-yellow/check icons
  - **Integration**:
    - Reused `CTASection` and `FaqSection` for consistent user journey
- **Details**:
  - All new components follow the strict design system (flat, minimalist, custom CSS variables)
  - Responsive design ensuring optimal viewing on all devices
  - "use client" directive used for all interactive components

### [1.3.0] - 2025-11-21 - Home page enhancements, Contact page, and global navigation updates

- Added: `CTASection` to Home page
  - High-impact dark theme (`bg-brand-blue`) with split-screen layout
  - Interactive `DashboardShowcase` component simulating user dashboard
  - Floating animated elements and social proof indicators
- Added: `FAQSection` to Home page
  - Clean, light-themed accordion interface
  - Expandable/collapsible questions about tracking, quotes, and services
- Added: `ContactPage` (`/contact`)
  - Split layout with contact information and form
  - Disabled form state managed by global Zustand store (`utils-store.ts`)
  - "Form Temporarily Unavailable" overlay guiding users to alternative channels
- Added: Custom 404 Not Found page (`/not-found.tsx`)
  - "Lost Shipment" theme with driving truck animation
  - Interactive "Track Package" simulation
  - Clear actions to return home or contact support
- Changed: Footer redesign
  - Updated background to `bg-brand-blue` with high-contrast text
  - Added social media icons (Facebook, Twitter, Instagram, LinkedIn)
  - Removed "Services" column and links for streamlined navigation
- Changed: Global Navigation
  - Removed "Services" link from Header and Footer menus
- **Details**:
  - Implemented `zustand` for global state management of UI utilities
  - Enhanced accessibility with proper contrast ratios and semantic HTML
  - Consistent use of `react-icons/fa6` for iconography

### [1.2.1] - 2025-11-11 - Logo assets and branding updates

- Added: SVG logo assets for consistent branding across the application
  - `logo-landscape.svg`: Horizontal logo for header navigation
  - `logo-footer.svg`: Compact logo for footer section
  - `logo-square.svg`: Square version for potential future use
  - `logo-white.svg`: White variant for dark backgrounds
- Changed: Header component updated to include landscape logo
  - Imported `logo-landscape.svg` as React component using Next.js Image
  - Positioned logo on the left side of the navigation bar
  - Maintained responsive design with appropriate sizing
- Changed: Footer component updated to include footer logo
  - Added `logo-footer.svg` using Next.js Image component
  - Integrated logo with existing footer layout and styling
  - Ensured proper alt text and accessibility
- Removed: Temporary logo placeholder `logo-temp.jpg`
  - Replaced with proper SVG logo assets

### [1.2.0] - 2025-11-10 - How It Works section with interactive step showcases

- Added: `HowItWorks` section component with three-step interactive workflow
  - Section heading with brand color highlight ("Momentum Moves")
  - Call-to-action button with clipboard icon for quote requests
  - Responsive spacing and layout using Container component
  - "use client" directive for Next.js App Router compatibility
- Added: `HowItWorksStep` component for reusable step layouts
  - Flexible grid layout with alternating image/text positions (left/right)
  - Dynamic primary and accent color system using CSS variables
  - Helper functions for color resolution (supports hex, CSS variables, and custom color names)
  - Background color opacity calculation for accent colors (10% opacity backgrounds)
  - Numbered step titles with color-coded styling
  - Feature points with bullet indicators matching accent colors
  - Responsive design (1-column mobile, 2-column tablet/desktop)
  - Rounded borders and proper spacing for visual hierarchy
- Added: `QuoteEstimatorShowcase` component showcasing the quote process
  - Four-step timeline interface (Package Type → Dimensions → Pickup → Destination)
  - Interactive package type selector with price information
  - Dimension input display with checkboxes for fragile/special handling options
  - Pickup time slot selection with interactive buttons
  - Delivery option radio buttons with pricing tiers
  - Estimated timeline progress bar
  - Dashed border container with offset card design
  - Scrollable content area with hidden scrollbar
  - Header (blue background) and footer (yellow background) sections
  - "use client" directive for Next.js App Router compatibility
- Added: `ShipmentShowcase` component showcasing the shipment confirmation flow
  - Five-step timeline (Account Created → Shipment Details → Price Breakdown → Delivery Options → Total)
  - Pricing breakdown with individual fee line items (Base Rate, Service Fee, Fuel Surcharge, Insurance, Signature Fee)
  - Delivery options display with selected options highlighted
  - Account status and membership information
  - Order ID and payment confirmation footer
  - Rotated card effect (rotate-2 sm:rotate-3) for visual interest
  - Responsive sizing for mobile and desktop
  - "use client" directive for Next.js App Router compatibility
- Added: `TrackingStepShowcase` component showcasing real-time tracking
  - Five-checkpoint timeline (Confirmed → Picked Up → In Transit → Out for Delivery → Delivered)
  - Current active state highlighting for "In Transit" checkpoint
    - Ring effect on current checkpoint icon
    - Dedicated background styling with left border
    - Progress bar showing transit progress (65%)
    - ETA display with real-time status message
  - Completed checkpoints with check icons
  - Pending checkpoints in disabled state (gray)
  - Tracking ID display with current status badge
  - Split vertical timeline line (active portion in accent-dark, inactive in gray)
  - Live location update information
  - "use client" directive for Next.js App Router compatibility
- Added: Integration of all showcases into homepage `page.tsx`
  - `HowItWorks` section added after `ValueProp` section
  - Proper component import with '@/' alias
  - Appropriate section ordering and spacing
- Changed: Color system utilization across all showcase components
  - All components use custom CSS variables (`brand-blue`, `brand-yellow`, `accent-dark`, `accent-light`)
  - No raw Tailwind color classes used
  - Proper contrast ratios maintained for accessibility
- **Details**:
  - All showcase components follow the flat, minimalist design philosophy
  - No gradients used; solid colors only
  - Interactive elements include proper hover states and visual feedback
  - Hidden scrollbars maintained across scrollable areas using `.scrollbar-hide` utility
  - Responsive design tested across mobile (sm), tablet (md), and desktop (lg) breakpoints
  - Font stack uses `font-work-sans` for headings and proper weight hierarchy

### [1.1.0] - 2025-11-08 - Value Proposition section with interactive showcases

- Added: `ValueProp` section component showcasing three core value propositions
  - Multi-color bento grid layout (Instant Quotes, Live Tracking, Simplified Logistics)
  - Section heading with multi-tone text treatment for visual emphasis
  - Integration of three interactive showcase components into each value prop card
- Added: Interactive `TrackingShowcase` component with real-time features
  - Clickable copy button for tracking number with clipboard integration
  - Toast notification ("Copied!") that appears in center of screen for 2 seconds
  - Notification bell icon on "Get notified" button
  - Hidden scrollbar in timeline while maintaining scroll functionality
  - "use client" directive for Next.js App Router compatibility
- Added: Interactive `SimplifiedLogisticsShowcase` component with multi-step logistics flow
  - Stateful checkboxes for "Signature Required" and "Insurance" options
  - Stateful radio buttons for delivery preferences (Leave at door / Meet at door)
  - Interactive buttons with cursor-pointer effect
  - Hidden scrollbar in content area
  - Full-width responsive layout on mobile
  - "use client" directive for Next.js App Router compatibility
- Added: CSS utility class `.scrollbar-hide` in `globals.css` for cross-browser scrollbar hiding
  - Supports Chrome, Safari, Opera, Firefox, and Edge
- Changed: Both showcase components now use React hooks (`useState`) for interactive state management
- Fixed: Mobile responsiveness for `SimplifiedLogisticsShowcase` component
  - Changed from absolute positioning to normal flow layout
  - Added proper spacing with `pt-4` and responsive padding
  - Converted fixed heights to max-heights for flexible content

### [1.0.1] - 2025-11-07 - Button component update

- Changed: Updated button component hover states to include a ring effect and improved color contrast for better visibility.

### [1.0.0] - 2025-11-06 - Hero section and footer casing/styling

- Added: Homepage hero section matching product context
  - Bold headline with yellow highlight treatment
  - Subtitle and dual CTAs (Get a Quote, Learn more)
  - Three feature cards (Tracking, Quotes, International Shipping)
  - Uses existing `Container` and `Button` components and project color variables
- Changed: Default hero text color set to dark via `text-foreground` to match white background
- Changed: `components/layout/footer.tsx` styling updated to use CSS variables (`bg-background`, `text-foreground`, `text-brand-blue`) instead of raw Tailwind colors
- Fixed: Case-only rename warning from TypeScript by removing `components/layout/Footer.tsx` and keeping lowercase `components/layout/footer.tsx`; verified imports use lowercase path in `app/layout.tsx`
- Removed: Uppercase `components/layout/Footer.tsx`
- **Details**:
  - Case-only rename process for macOS/Windows (case-insensitive FS):
    - Use: `git mv -f Footer.tsx footer.tsx`
    - If TS keeps warning, restart TS server in VS Code and re-run `bunx tsc --noEmit`
    - Ensure imports match casing and `git status` shows the rename
