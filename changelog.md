# Changelog

All notable changes to this project "Momentum Logistics Service" will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

### [version code: 1.2.0] - 2025-11-10 - How It Works section with interactive step showcases

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

### [version code: 1.1.0] - 2025-11-08 - Value Proposition section with interactive showcases

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

### [version code: 1.0.1] - 2025-11-07 - Button component update

- Changed: Updated button component hover states to include a ring effect and improved color contrast for better visibility.

### [version code: 1.0.0] - 2025-11-06 - Hero section and footer casing/styling

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
