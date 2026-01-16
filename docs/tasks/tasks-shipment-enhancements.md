# Tasks: Shipment Enhancements & Fixes

## Relevant Files

- `app/app/shipments/new/verify/page.tsx` - Main page for payment verification and redesign.
- `app/app/shipments/new/page.tsx` - Shipment creation page (target for re-create).
- `store/shipment-store.ts` - Store for pre-filling shipment data.
- `components/shipment/address-form.tsx` - Address form for validation logic.
- `app/app/shipments/[id]/page.tsx` - Shipment details (source for re-create).
- `app/app/shipments/columns.tsx` - Shipment history columns (source for duplicate action).
- `utils/shipment-helper.ts` - Helper utilities.
- `utils/schemas.ts` - Validation schemas (if centralized).

## Instructions for Completing Tasks

**IMPORTANT:** As you complete each task, you must check it off in this markdown file by changing `- [ ]` to `- [x]`. This helps track progress and ensures you don't skip any steps.

## Tasks

### Verify Page Fixes (VP)

- [/] VP00: Fix Verify Page Crash (500 Error Handling)
  - [/] VP01: Update `VerifyPage` to safely check `result.status` (handle "FAILED" explicitly).
  - [/] VP02: Add null verification for `result.trackingNumber` before rendering tracking sections.
  - [/] VP03: Conditionally hide "Tracking Number" and "Download Label" sections if shipment creation failed.

### Re-create Shipment (RS)

- [x] RS00: Implement Re-create / Duplicate Shipment Workflow
  - [x] RS01: Create data mapping utility `mapShipmentToStore`.
  - [x] RS02: Implement duplicate hook.
  - [x] RS03: Add "Ship Again" button to Details.
  - [x] RS04: Add "Duplicate" action to History.

### Address Validation (AV)

- [x] AV00: Enforce Address Line Character Limits
  - [x] AV01: Update Zod schema for Address (in `AddressForm` or shared schema) to `max(36)`.
  - [x] AV02: Update `AddressForm` UI to display validation error for long street addresses.

### Verify Page Redesign (VR)

- [ ] VR00: Redesign Verify Page UI & UX
  - [ ] VR01: Rebuild `VerifyPage` layout using premium styling (centered card, brand colors).
  - [ ] VR02: Implement "Success" state with animated checkmark, copyable tracking number, and clear "Download Label" CTA.
  - [ ] VR03: Implement "Failure" state with friendly error message and "Retry" (back to summary) button.
  - [ ] VR04: Add secondary navigation actions ("Track Shipment", "Return to Dashboard").

### Testing (TS)

- [x] TS00: Final Verification & Testing
  - [x] TS01: Verify graceful handling of failed payments (no crash).
  - [x] TS02: Test "Ship Again" flow from both Details page and History list.
  - [x] TS03: Verify address validation blocks >36 character inputs.
  - [x] TS04: Review Verify Page redesign on mobile and desktop.
