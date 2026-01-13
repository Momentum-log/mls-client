# Changelog

All notable changes to this project "Momentum Logistics Service" will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
  - Email: `info@momentumlogisticservice.com`
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
