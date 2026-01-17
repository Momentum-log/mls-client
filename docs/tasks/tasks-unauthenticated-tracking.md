# Tasks: Unauthenticated Tracking Page

## Relevant Files

- `app/(marketing)/track-shipment/page.tsx` - New location for the public tracking page.
- `app/(marketing)/track/page.tsx` - Current file to be moved/renamed.
- `components/layout/footer.tsx` - To add the "Track Shipment" link.
- `api/shipments/index.ts` - For `trackShipment` function usage.
- `types/shipping.ts` - For type definitions (checking `TrackingResponse`).

### Notes

- **Privacy First**: Ensure strict client-side filtering of sensitive data (addresses, payments) before display.
- **Hybrid Design**: Page must use Marketing Layout but contain functional tracking elements.

## Tasks

### Setup & Routing

- [x] SR00: Configure public route and file structure
  - [x] SR01: Move/Rename `app/(marketing)/track/page.tsx` to `app/(marketing)/track-shipment/page.tsx` to establish the `/track-shipment` route.
  - [x] SR02: Import and wrap the page with `components/shared/container` if needed for consistent spacing.

### UI Implementation

- [x] UI00: Implement Tracking Page Components (Hero, Search, Results)
  - [x] UI01: Create a **Hero Section** with the title "Track Your Shipment" and a subtitle (e.g., "See where your package is in real-time").
  - [x] UI02: Implement a large, centered **Search Input** component with a search icon and action button.
  - [x] UI03: Build the **Result Card** to display Status (with icon), Origin/Destination (City/Country codes ONLY), and the latest event.
  - [x] UI04: Implement a **Progress Bar** visualization for the shipment journey (Created -> In Transit -> Out for Delivery -> Delivered).
  - [x] UI05: Design an "Empty State" or "Ready to Track" state for when no ID is entered.

### Logic & Integration

- [ ] LI00: Integrate API and implement Privacy Filtering
  - [ ] LI01: Connect the `trackShipment` function from `api/shipments/index.ts` to the search form.
  - [ ] LI02: Implement a `privacyFilter` utility function (or inline logic) to strip exact street addresses, contact info, and documents from the API response before setting state.
  - [ ] LI03: Handle API errors gracefully (e.g., "Shipment not found" for 404s, "Service unavailable" for 500s).

### Navigation & Polish

- [x] NV00: Update Navigation and Verify UX
  - [x] NV01: Add a "Track Shipment" link to the **Marketing Footer** in `components/layout/footer.tsx`.
  - [x] NV02: Verify mobile responsiveness of the search bar and result card.
