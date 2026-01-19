# Product Requirements Document: Custom 404 Page

## 1. Introduction

High-quality, branded 404 page ("Not Found") that retains the users' context (Marketing vs. App) while offering helpful navigation and a "Lost Shipment" theme.

## 2. Goals

- **Minimize Frustration**: Provide a helpful and visually pleasing experience when users hit a dead end.
- **Context Awareness**: Users in the "App" (Dashboard) should stay in the dashboard shell; users on the public site should see the public navigation.
- **Brand Alignment**: Use the "Lost Shipment" metaphor with a driving truck animation, consistent with MLS branding.
- **Functionality**: Allow users to try tracking a package directly from the 404 page if that's what they were looking for.

## 3. User Stories

- **As a Public Visitor**, if I mistype a URL (e.g., `/pricingo`), I want to see the 404 page with the Marketing Header/Footer so I can easily navigate back to the Home or Contact page.
- **As a Logged-in User**, if I click a broken link inside the dashboard (e.g., `/app/old-page`), I want to see the 404 page _inside_ the dashboard layout (keeping the sidebar) so I don't lose my session context.
- **As a User**, I want to see a fun "Lost Shipment" animation (truck driving) to lighten the mood.
- **As a User**, I want to be able to enter a tracking number on the 404 page and be redirected to the tracking page.

## 4. Key Features

### 4.1. "Lost Shipment" Theme

- **Animation**: Use the existing `@drive` keyframe animation from `globals.css` with a truck icon (`FaTruck` or similar).
- **Visuals**: Clean, flat design using `brand-blue` and `brand-yellow` tokens.
- **Message**: "Shipment Not Found" or similar playful text.

### 4.2. Context-Aware Layouts

- **Marketing Site**: 404 page appears wrapped in the Public Navigation (Header & Footer).
- **App Dashboard**: 404 page appears wrapped in the App Shell (Sidebar & Mobile Header).

### 4.3. Interactive Tracking (Hybrid)

- **Input**: A search bar meant for "Tracking ID".
- **Action**: A generic "Track" button that, when clicked with a value, redirects the user to `/track-shipment?trackingId=...`.
- **Search Simulation**: Shows a visual indicator or tool tip like "Searching..." before redirecting (optional enhancement).

### 4.4. Navigation

- **Primary CTA**: "Return Home" (or "Return to Dashboard" if in App).
- **Secondary**: "Contact Support".

## 5. Technical Requirements

- **Technology**: Next.js App Router (React).
- **Files**:
  - `components/ui/not-found-view.tsx` (Shared Logic & UI).
  - `app/not-found.tsx` (Global Fallback -> Marketing Style).
  - `app/app/not-found.tsx` (App Scope -> Dashboard Style).
  - `app/(marketing)/not-found.tsx` (Marketing Scope -> Marketing Style).
- **Styling**: Tailwind CSS using `globals.css` variables (`var(--color-brand-blue)`, etc.).

## 6. Success Metrics

- Visual consistency across both scopes.
- Zero broken layout issues on 404 occurrences.
