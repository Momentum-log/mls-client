# Client-Side Implementation Plan (Next.js)

This document outlines the phased development plan for the Client-Facing Frontend (Next.js) application. The primary goal is a "marketing-first" rollout, prioritizing public-facing pages and the quotation engine to begin attracting and converting customers before authenticated user accounts are required.

This plan focuses only on the client-side application. It assumes all backend endpoints (e.g., /api/quote, /api/shipments) are being developed in parallel as per the mls-dev-plan.md.

## Phase 1: The Marketing Foundation (Weeks 1-3)

Goal: Launch the public "brochure" website. This establishes the brand online and provides a destination for marketing efforts. This aligns with the 2-3 week "Early Milestone" in the Agreement.

Pages to Build (from Quotation...pdf):

### Homepage

Purpose: Attract and engage visitors.

Key Components:
- Hero Section: A strong headline ("Logistics, Simplified."), brief value proposition, and a primary Call-to-Action (CTA) button: "Get an Estimate."
- "How It Works": A simple 3 or 4-step visual guide (e.g., 1. Get Quote, 2. Book Shipment, 3. Track).
- Services Overview: A brief section with icons linking to the Services Page.
- Trust Signals: (If available) Logos of partners or "As Seen On" media.
- Footer: Standard links (About, Services, Contact, Tracking).

### About Us Page

Purpose: Build trust and tell the brand story.

Key Components: Mission statement, company values, and (optional) team bios.

### Services Page

Purpose: Detail what you do.

Key Components: In-depth descriptions of each service offering (e.g., "Local Courier," "International Freight," "Warehousing").

### Contact Page

Purpose: Capture inbound leads.

Key Components:
- Static information: Phone number, email address, physical address.
- A simple contact form (Name, Email, Message). This will require a minimal API endpoint or a third-party service (like Formspree) to forward submissions.

Technical Implementation:
- Initialize the Next.js project with TailwindCSS for styling.
- Create reusable components (Navbar, Footer, Button, PageHeader).
- All pages in this phase will be built as Static Pages (SSG) for maximum performance and SEO.
- The "Get an Estimate" CTA will initially link to the (coming soon) /estimates page.

Client Responsibility (Critical): Provide all final text, high-quality logos, and any brand images for these pages.

## Phase 2: The Core Funnel - Estimation & Tracking (Weeks 4-7)

Goal: Convert anonymous visitors into customers. This phase builds the "guest" flow, which is the heart of the business.

Pages to Build (from Quotation...pdf & mls-dev-plan.md):

### Estimates Page (/estimates)

Purpose: To provide instant, public quotes, as you requested.

Key Components:
- The "Wizard" Form: A multi-step form (as described in mls-dev-plan.md):
  - Step 1: Package Details (presets, dimensions, weight).
  - Step 2: Addresses (Pickup & Dropoff). Suggestion: Integrate Google Maps Autocomplete (requires a client-paid Google API key) for a much better UX.
  - Step 3: Service Preferences (e.g., speed, insurance).
  - Step 4: Contact Info (minimal: email, phone for guest checkout).
- API Call (The "Payload"):
  - On form submission, the client app will show a loading spinner.
  - It will construct a JSON payload with all the form data.
  - It will POST this payload to the backend's /api/quote endpoint.
- The "Response" Display (Rate Cards):
  - The backend will respond with a JSON array of rate options (e.g., [{ service_name: "Standard", price: 5000, eta: "2 days" }, ...]).
  - The client app will parse this response and display each option as a clear, comparable "Rate Card."
  - Each card must have a "Select This Rate" button.

### Bookings Page (The "Guest Checkout")

Purpose: To capture payment for a selected quote.

Key Components:
- This page is triggered after a user "Selects" a rate.
- It will show a summary of the selected shipment and price.
- It will require the Stripe Payment Integration on the client side (using stripe.js).
- The backend will create a PaymentIntent, and the client-side app will use it to display the secure Stripe payment form (e.g., Stripe Elements).
- Handle onSuccess and onError states from Stripe.

### Success Page

Purpose: Confirm a successful booking and payment.

Key Components: A "Thank You" message, a summary of the order, and—most importantly—the tracking_code for the new shipment.

### Public Tracking Page (/track)

Purpose: Allow anyone (guest or member) to track a shipment.

Key Components:
- A single input field for the tracking_code.
- On submit, the client app will GET data from /api/shipments/[tracking_code].
- It will display the shipment's current status and event timeline (e.g., "Picked Up," "In Transit").

## Phase 3: The Authenticated Experience (Weeks 8-12)

Goal: Build customer retention by allowing users to create accounts and manage their own shipments. This is the functionality you correctly identified as coming after the marketing push.

Pages to Build (from Quotation...pdf):

### User Account Pages

Purpose: Standard authentication.

Key Components:
- Sign-Up Page: Form to call the /api/auth/register endpoint.
- Login Page: Form to call the /api/auth/login endpoint.
- Password Reset Page: Form to call the /api/auth/forgot-password endpoint.

Technical Implementation: The client app will handle storing session tokens (likely in httpOnly cookies set by the backend) and managing a global "auth state" (e.g., using React Context).

### Shipping History Page (The "User Dashboard")

Purpose: The main hub for a logged-in user.

Key Components:
- On page load, GET data from the /api/shipments?user_id=... endpoint.
- Display a table or list of all the user's past and current shipments.
- Include search and filtering (e.g., by status).
- Each item will link to a detailed shipment view (a private, more detailed version of the public tracking page).

### Profile Management Page

Purpose: Allow user self-service.

Key Components:
- A form to update personal details (Name, Phone).
- A "Saved Addresses" manager (create, read, update, delete addresses) to speed up future bookings. This will interact with new backend endpoints (e.g., /api/users/me/addresses).

## Phase 4: Finalization & Go-Live (Weeks 13-18)

Goal: Polish, test, and deploy the complete client-side application.

- Responsive Polish: Rigorously test every page and component from Phase 1-3 on mobile, tablet, and desktop.
- Content Integration: Replace any placeholder "lorem ipsum" text with the client's final, approved content (as per the Agreement).
- End-to-End Testing:
  - Guest Flow: Test the entire funnel: Homepage CTA -> Estimates Page -> Booking/Payment -> Success Page -> Tracking Page.
  - Auth Flow: Test: Sign-Up -> Login -> View Dashboard -> Book as User -> View in History -> Logout.
- Deployment:
  - Configure the Next.js app to be deployed to the client's Truehost cPanel (as per the Required Services...pdf).
  - Set all environment variables (e.g., NEXT_PUBLIC_API_URL to point to the live backend).
  - Configure the domain and ensure SSL is active.

## Folder Structure

The project follows a standard Next.js App Router structure:

```
mls-client/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Homepage
│   ├── globals.css         # Global styles
│   ├── shipping-estimate/
│   │   └── page.tsx        # Estimates page
│   ├── about/
│   │   └── page.tsx        # About Us page
│   ├── services/
│   │   └── page.tsx        # Services page
│   ├── contact/
│   │   └── page.tsx        # Contact page
│   ├── track/
│   │   └── page.tsx        # Public Tracking page
│   ├── booking/
│   │   └── page.tsx        # Bookings page
│   ├── success/
│   │   └── page.tsx        # Success page
│   ├── auth/
│   │   ├── login/
│   │   │   └── page.tsx    # Login page
│   │   ├── signup/
│   │   │   └── page.tsx    # Sign-Up page
│   │   └── reset/
│   │       └── page.tsx    # Password Reset page
│   ├── dashboard/
│   │   └── page.tsx        # Shipping History page
│   └── profile/
│       └── page.tsx        # Profile Management page
├── components/
│   ├── shared/
│   │   ├── Button.tsx
│   │   └── ... (other shared components used across the project)
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── PageHeader.tsx
│   ├── home/
│   │   └── ... (components used only in the home page)
│   └── ... (other page-specific component folders)
├── docs/
│   └── client-side-implementation-plan.md
├── public/
│   ├── favicon.ico
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── README.md
└── tsconfig.json
```
