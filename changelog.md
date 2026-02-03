# Changelog

All notable changes to this project "Momentum Logistics Service" will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
  - Email: `info@momentumlogservice.com`
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
