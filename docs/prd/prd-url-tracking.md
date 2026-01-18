# Product Requirements Document (PRD): URL-based Tracking & Unpaid Shipment Redirect

## 1. Introduction / Overview

This feature enhances the public tracking page to support URL-based tracking (e.g., `/track-shipment/MLS-TRK-123`). This allows users to share tracking links directly. Additionally, it addresses the issue where unpaid shipments return a generic "Carrier tracking not yet available" message. Instead, user should be guided to complete their payment.

## 2. Goals

- **Seamless Tracking**: Users can track a shipment directly via URL without manually entering the code.
- **Actionable Unpaid Status**: Replace the dead-end "Carrier tracking not yet available" message with a clear path to payment.
- **Improved UX for Logged-in Users**: Automatically redirect logged-in users to the comprehensive dashboard view.

## 3. User Stories

- **US01**: As a user, I can visit `/track-shipment/MLS-TRK-XP829` and immediately see the tracking results without typing the ID being required.
- **US02**: As a guest user tracking an unpaid shipment, I see a message explaining that payment is incomplete and a prompt to "Log in to Pay".
- **US03**: As a logged-in user visiting the public tracking link, I am automatically redirected to the dashboard shipment details page (`/app/shipments/[id]`).

## 4. Features / Tasks

### URL & Routing

- [UR01]: Create a new dynamic route `app/(marketing)/track-shipment/[id]/page.tsx`.
- [UR02]: Implement logic to extract `id` from the URL and automatically trigger the tracking API call on component mount.
- [UR03]: Ensure the existing `/track-shipment` page remains accessible for manual entry.

### Unpaid Shipment Handling ("CREATED" Status)

- [UH01]: In `PublicTrackingResult` (or the page logic), check if the tracking response status is `CREATED`.
- [UH02]: If `CREATED`, display a user-friendly message: "This shipment is awaiting payment. Please log in to complete the shipment."
- [UH03]: Add a "Log in to Complete Payment" button that redirects to `/auth/login` (or the dashboard if we suspect they might be logged in but the session check failed).
  - _Note_: The user prefers a specific redirect to `/app/shipments/[tracking_id]`.

### Authentication & Redirection

- [AR01]: Implement a check for user authentication status on the `/track-shipment/[id]` page.
- [AR02]: If the user is **logged in**, immediately redirect them to `/app/shipments/[tracking_number]`.
- [AR03]: If the user clicks the "Complete Payment" button (from UH03), ensure they are directed to `/app/shipments/[tracking_number]`. If they need to login first, the auth flow should ideally handle the redirect back (standard auth behavior).

## 5. Non-Goals

- Changing the backend shipping status logic.
- Implementing guest checkout/payment (users must log in).

## 6. Technical Considerations

- **Route Structure**: Next.js App Router dynamic segments.
- **Auth Detection**: Use the existing auth hooks (e.g., `useAuth` or session tokens) to detect login status client-side.
- **Redirects**: Use `next/navigation` `router.push` or `redirect`.
- **API Response**: The backend returns `{ status: "CREATED", message: "..." }` for unpaid shipments. We need to catch this specific state.

## 7. Success Metrics

- Users successfully track shipments via direct links.
- "CREATED" status shipments result in user navigation to the payment flow instead of confusion.
