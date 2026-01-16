# PRD: Mobile Layout & Shipment Payment Flow Enhancements

## 1. Introduction / Overview

This document outlines enhancements to the Momentum Logistics Service (MLS) to improve mobile usability and finalize the shipment creation flow. Key updates include a mobile-responsive header with sidebar integration, a complete payment-to-verification workflow for shipments, and layout optimizations for better mobile display.

## 2. Goals

- Provide mobile users with a global header and access to the navigation sidebar via a hamburger menu.
- Complete the "Create Shipment" integration by redirecting users to the Stripe payment URL and then to a verification page.
- Optimize the layout by reducing excessive horizontal padding on mobile devices.
- Refine the branding by removing redundant logos on marketing pages.

## 3. User Stories

- As a mobile user, I want to access the app's navigation sidebar easily through a hamburger menu so I can move between sections.
- As a customer, I want to be redirected to a secure payment page after creating a shipment so I can finalize my order.
- As a customer, I want to see a clear verification status after my payment is complete so I know my shipment is confirmed.
- As a mobile user, I want the content to use the available screen width efficiently so I don't have to scroll excessively or see narrow text.

## 4. Features / Tasks

### Mobile Navigation (MN)

- **MN01**: Create a `MobileHeader` component for the authenticated application (`/app`).
- **MN02**: Integrate a hamburger menu in the `MobileHeader` that toggles the `SidebarNav`.
- **MN03**: Sidebar should **push content** on mobile (User Preference 1B).
- **MN04**: Update the main layout in `app/app/layout.tsx` to include the `MobileHeader` and handle the sidebar toggle state.

### Shipment Creation (SC)

- **SC01**: Update `handleFinalize` in `app/app/shipments/new/page.tsx` to call the `createShipment` API.
- **SC02**: Automatically open the Stripe `checkoutUrl` returned by the API (User Preference 2).
- **SC03**: Ensure the existing `app/app/shipments/new/verify/page.tsx` correctly handles the return from Stripe using the `session_id`.
- **SC04**: API endpoint path: `/shipments/create-shipment`.

### Layout & UI (LU)

- **LU01**: Adjust horizontal padding in `app/app/layout.tsx` for mobile view to **8px / `px-2`** (User Preference 3B).
- **LU02**: Remove redundant logo sections from `app/(marketing)/login/page.tsx`.
- **LU03**: Remove redundant logo sections from `app/(marketing)/register/page.tsx`.

## 5. Non-Goals

- Redesigning the entire sidebar content or marketing landing pages.
- Implementing new payment methods beyond the existing Stripe flow.

## 6. Design Considerations

- **Header**: Flat design, minimalist, using `bg-white` or `bg-brand-blue` variables.
- **Sidebar Drawer**: Needs smooth transitions and an overlay to dim the background when open.
- **Padding**: Minimal horizontal padding (16px/1rem) to maximize readability on small screens.

## 7. Technical Considerations

- **State Management**: Use a local state or a slice in `useShipmentStore` if needed to manage the mobile menu's open/close status.
- **API Consistency**: Ensure `customTrackingNumber` from the response is displayed or stored if necessary during the verification step.

## 8. Success Metrics

- 100% of mobile users can access the sidebar via the hamburger menu.
- Successfully completed payment flow from creation to verification without manual navigation.
- Improved mobile readability scores (qualitative).

## 9. Open Questions

1. **Sidebar Mobile Behavior**: Should the sidebar become a sliding drawer that covers the content when toggled?
2. **Verify Page Flow**: Should the "Verify" page be shown _before_ redirecting to Stripe (to show a "Redirecting to payment..." message) or should the redirect happen immediately after clicking finalize?
3. **Stripe Redirect**: Does the `checkoutUrl` already handle the `success_url` and `cancel_url` pointing back to our verify page? (Assuming yes, per `openapi.json`).
4. **API Path**: Confirm if the endpoint is `/shipments/create-shipment` or `/shipments/create-shipments`.
