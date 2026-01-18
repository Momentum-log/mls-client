# Tasks: Shipment Improvements

## Relevant Files

- `app/app/track/page.tsx` - Main tracking page to modify for "CREATED" status.
- `app/app/shipments/page.tsx` - Shipment list page to replace Duplicate button with Menu.
- `components/ui/dropdown-menu.tsx` - (Verify existence or use equivalent) For the "Three Dots" menu implementation.
- `components/ui/button.tsx` - For styling buttons.

## Instructions for Completing Tasks

**IMPORTANT:** As you complete each task, you must check it off in this markdown file by changing `- [ ]` to `- [x]`. This helps track progress and ensures you don't skip any steps.

## Tasks

### Tracking UI (TR)

- [x] TR00: Implement Payment Prompt on Tracking Page
  - [x] TR01: Modify `app/app/track/page.tsx` to detect `shipmentStatus === 'CREATED'` in the tracking response.
  - [x] TR02: Create the "Payment Required" empty state UI within `TrackShipmentPage` (or a sub-component).
    - Display the message: "This shipment is in your list, but you have not paid for it. Please pay for the shipment to enable tracking. Continue to complete the shipment."
    - Add a "Pay for Shipment" button (placeholder action/alert for now).
  - [x] TR03: Ensure the standard `TrackingOverview`, `TrackingDetails`, and `TrackingTimelineView` are **hidden** when status is CREATED.

### Shipment List UI (SL)

- [x] SL00: Implement Context Menu on Shipment List
  - [x] SL01: Open `app/app/shipments/page.tsx` and identify the current "Duplicate Shipment" button.
  - [x] SL02: Replace the button with a "Three Dots" menu (`FiMoreVertical` or similar).
    - _Note: Check if a reusable Dropdown/Popover component exists in `components/ui` first._
  - [x] SL03: Implement "View Shipment" menu item (Links to `/app/shipments/[id]`).
  - [x] SL04: Implement "Copy Tracking Number" menu item (Copies `customTrackingNumber`).
  - [x] SL05: Implement "Create Duplicate Shipment" menu item (Triggers `duplicateShipment`).
  - [x] SL06: Handle event propagation to prevent the row click (Link navigation) when clicking the menu.

### Verification (VN)

- [x] VN00: Verification and Polish
  - [x] VN01: Test tracking a "CREATED" shipment -> Verify prompt appears and timeline is hidden.
  - [x] VN02: Test tracking a "DELIVERED" shipment -> Verify standard view remains.
  - [x] VN03: Test Shipment List menu:
    - Click "Copy Tracking" -> Verify clipboard.
    - Click "Duplicate" -> Verify `duplicateShipment` triggers.
    - Click "View" -> Verify navigation.
  - [x] VN04: Run `bun run lint` and `bunx tsc --noEmit`.
