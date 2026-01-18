# PRD: Unauthenticated Marketing Tracking Page

## 1. Introduction / Overview

This feature creates a public-facing, unauthenticated shipment tracking page on the marketing site. It allows users to track shipments using their MLS Tracking ID (`MLS-XXXXXXXX`) without logging in. The page will provide limited shipment details to protect privacy while offering a premium, branded experience consistent with the marketing site.

## 2. Goals

- **Accessibility**: Allow anyone with a tracking number to view shipment status.
- **Privacy**: Display only essential non-sensitive information (City/State, Status) for unauthenticated users.
- **Experience**: Provide a visually appealing, responsive "Hybrid" design that integrates with the marketing site's header and footer.
- **Routing**: Serve the page at `/track-shipment` to distinguish it from the authenticated app.

## 3. User Stories

- As an **unauthenticated user**, I want to enter my tracking ID so that I can see where my package is.
- As a **user**, I want to see the current status (e.g., "In Transit") and location (City/State) without logging in.
- As a **user**, I do NOT want strangers to see my full address, payment history, or documents just by guessing my tracking number.
- As a **marketing visitor**, I want to easily find the "Track Shipment" link in the footer.

## 4. Features / Tasks

### Setup & Routing

- [ ] **TR01**: Rename/Move `app/(marketing)/track/page.tsx` to `app/(marketing)/track-shipment/page.tsx` to enable the `/track-shipment` route.
- [ ] **TR02**: Ensure the page leverages `app/(marketing)/layout.tsx` for the Marketing Header and Footer.

### UI Implementation (Hybrid Design)

- [ ] **UI01**: Implement a **Hero Section** similar to `ShippingEstimatePage` but focused on Tracking (e.g., "Track Your Shipment" title).
- [ ] **UI02**: Create a large, centered **Search Input** with a search icon and button.
- [ ] **UI03**: Design a **Result Card** that displays:
  - Current Status (e.g., "In Transit" with icon).
  - Origin & Destination (City/Country ONLY).
  - Latest Event (Status + Date/Time).
  - **Progress Bar** (Visual indicator of journey).
- [ ] **UI04**: Implement **Privacy Filtering**:
  - Hide exact street addresses.
  - Hide payment information.
  - Hide links to documents.
  - Show only "City, State/Province, Country".

### Integration

- [ ] **IN01**: Integrate with `api/shipments/index.ts` -> `trackShipment` function.
  - _Note_: Ensure the frontend handles any error states (404 Not Found) gracefully.
- [ ] **IN02**: Add a "Track Shipment" link to the **Marketing Footer** component (`components/layout/footer.tsx`).

### Backend Note

- **BE01**: Use existing backend endpoints. Frontend must responsibly filter data before rendering, as the backend may return full details.
  - _Risk_: Data is technically available in the network response. (Accepted trade-off per requirements).

## 5. Non-Goals

- Full authentication flow implementation (User remains logged out).
- modification of backend API (Use existing).
- Detailed map views or exact coordinates.

## 6. Success Metrics

- Page loads successfully at `/track-shipment`.
- Valid tracking numbers return restricted status information.
- Invalid numbers show a user-friendly error.
- Footer link correctly navigates to the tracking page.

## 7. Open Questions

- None. (Requirements clarified by user: 2B Privacy, 3C Design, `/track-shipment` URL).
