# Changelog

All notable changes to this project "Momentum Logistics Service" will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
