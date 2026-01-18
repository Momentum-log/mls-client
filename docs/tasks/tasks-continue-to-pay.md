# Tasks: Continue to Pay Feature

## Relevant Files

- `api/shipments/index.ts` - New API function `continueToPay`.
- `hooks/shipments/use-continue-payment.ts` - New Mutation hook.
- `app/app/shipments/[id]/page.tsx` - Shipment Details Page UI updates.
- `app/app/track/page.tsx` - Tracking Page UI updates.

### Notes

- Unit tests should typically be placed alongside the code files they are testing.
- Ensure to handle loading states for a better UX.

## Instructions for Completing Tasks

**IMPORTANT:** As you complete each task, you must check it off in this markdown file by changing `- [ ]` to `- [x]`. This helps track progress and ensures you don't skip any steps.

## Tasks

### Backend API Integration (Frontend)

- [x] FE00: Implement Frontend API & Hooks
  - [x] FE01: Add `continueToPay` function to `api/shipments/index.ts` calling `POST /shipments/:id/pay`.
  - [x] FE02: Create `useContinueToPay` mutation hook in `hooks/shipments/use-continue-payment.ts`.
  - [x] FE03: Ensure hook handles success (redirect) and error states (toast notifications).

### UI Implementation - Shipment Details

- [x] SD00: Update Shipment Details Page
  - [x] SD01: Import `useContinueToPay` hook in `app/app/shipments/[id]/page.tsx`.
  - [x] SD02: Locate "Complete Payment" button (currently using `duplicateShipment`).
  - [x] SD03: Replace `duplicateShipment` with `continueToPay` mutation trigger.
  - [x] SD04: Add loading spinner/state to the button during API call.

### UI Implementation - Tracking Page

- [x] TP00: Update Tracking Page
  - [x] TP01: Import `useContinueToPay` hook in `app/app/track/page.tsx`.
  - [x] TP02: Locate "Pay for Shipment" button in the "Payment Required" state.
  - [x] TP03: Remove `Link` wrapper and add `onClick` handler to call `continueToPay`.
  - [x] TP04: Ensure proper shipment ID is passed to the mutation.
  - [x] TP05: Add loading state to the button.

### Verification

- [x] VF00: Verify Payment Flow
  - [x] VF01: Verify "Complete Payment" on Shipment Details page redirects to Stripe.
  - [x] VF02: Verify "Pay for Shipment" on Tracking page redirects to Stripe.
  - [x] VF03: Check error handling (e.g., network error).
