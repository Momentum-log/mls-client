# Product Requirements Document: Shipment Enhancements & Fixes

## 1. Introduction / Overview

This PRD outlines a set of enhancements and fixes for the Momentum Logistics Service (MLS) shipment flow. The primary goals are to resolve a critical crash on the payment verification page, improve data validation for shipping addresses, introduce a "Re-create Shipment" workflow for better user efficiency, and redesign the verification page for a visual and functional upgrade.

## 2. Goals

- **Eliminate Verify Page Crash**: Prevent the "500 Internal Server Error" by handling null tracking data for failed shipments.
- **Enhance User Efficiency**: Allow users to quickly duplicate/re-create previous shipments.
- **Improve Data Integrity**: Enforce a 36-character limit on address street lines to comply with carrier constraints.
- **Elevate UX**: Redesign the generic `VerifyPage` into a premium, informative, and branded experience.

## 3. User Stories

- **As a user**, I want to see a clear error message instead of a crash if my payment fails, so I know what went wrong.
- **As a user**, I want to click "Ship Again" on a past shipment, so I can quickly create a new label without re-typing all the details.
- **As a user**, I want to be warned if my address is too long, so I can fix it before submitting and avoid carrier rejection.
- **As a user**, I want a beautiful and informative confirmation page after paying, so I feel confident my shipment is being processed.

## 4. Features / Tasks

### Verify Page Fixes (VP)

- [VP01]: **Defensive Rendering**: Update `VerifyPage` to check if `result.status` is "FAILED" or if `result.trackingNumber` is null before attempting to render tracking details.
- [VP02]: **Conditional Display**: Hide the "Tracking Number" and "Download Label" sections entirely if the shipment creation failed.

### Re-create Shipment (RS)

- [RS01]: **Entry Points**:
  - Add a "Ship Again" button to the **Shipment Details** page (`/shipments/[id]`).
  - Add a "Duplicate" option to the kebab menu in the **Shipment History** list (`/shipments`).
- [RS02]: **Logic Implementation**:
  - Create a handler (e.g., `handleDuplicateShipment`) that retrieves the shipment's `sender`, `recipient`, and `package` data.
  - Map this data to the `useShipmentStore` format.
  - Redirect the user to `/shipments/new` with the store pre-filled.
  - **Note**: Ensure the "step" is set to the last review step or the first step, depending on UX preference (Start with Review seems optimal, but let's default to Step 1 so they can review easily). _Decision: Pre-fill and send to Step 1._

### Address Validation (AV)

- [AV01]: **Validation Logic**: Update `AddressForm` (and any Zod schemas used) to enforce a max length of **36 characters** for `street`.
- [AV02]: **UI Feedback**: Show a red validation error message below the input field if the user exceeds 36 characters (do not block typing, just block submission/next).

### Verify Page Redesign (VR)

- [VR01]: **Visual Overhaul**: Redesign `app/app/shipments/new/verify/page.tsx` to use the system's "premium" aesthetic (Clean cards, `brand-blue` accents, no generic borders).
- [VR02]: **Success State**:
  - Show a large, animated checkmark or confetti.
  - Display key info: Tracking Number (copyable), Carrier, Estimated Delivery (if available).
  - Primary Action: "Download Label".
  - Secondary Action: "Track Shipment", "Go to Dashboard".
- [VR03]: **Failure State**:
  - Clear red error icon.
  - Friendly but precise error message (e.g., "We couldn't generate your label. Your payment was not charged.").
  - Primary Action: "Retry Shipment" (goes back to Summary).
  - Secondary Action: "Contact Support".

## 5. Non-Goals

- We are not changing the backend logic for _why_ the shipment fails (500 error root cause), only handling the frontend response to it.
- We are not adding new fields to the shipment object, only reusing existing ones.

## 6. Success Metrics

- Zero client-side crashes on the `/verify` page.
- "Ship Again" feature used in >10% of new shipment creations.
- No carrier errors related to address length > 35 chars.

## 7. Technical Considerations

- **Store Persistence**: When "Re-creating", we must ensure we clear any _existing_ dirty state in `useShipmentStore` before populating the new data.
- **Routing**: `router.push('/shipments/new')` should happen _after_ the store is updated.

## 8. Open Questions

- None.
