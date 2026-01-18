# PRD: Continue to Pay Feature

## 1. Introduction / Overview

This feature allows users to complete the payment process for shipments that were successfully created but not yet paid for (Status: `CREATED`, Payment Status: `PENDING`). Currently, these shipments sit in a limbo state. This feature introduces a direct "Pay Now" action on both the Shipment Details and Tracking pages, streamlining the revenue collection and user fulfillment process.

## 2. Goals

- Check for shipments with `CREATED` status and `PENDING` payment.
- specific Allow users to initiate payment directly from the Shipment Details and Tracking pages.
- Redirect users to the Stripe Checkout page immediately upon clicking the payment button.
- Clean up the UI to ensure users know exactly what action to take when a shipment is pending payment.

## 3. User Stories

- **As a User**, I want to see a clear "Pay Now" button for my unpaid shipments so that I can quickly complete the transaction.
- **As a User**, I want to be redirected to the payment gateway immediately after clicking "Pay Now" so that I generally don't have to re-enter info or navigate through multiple screens.
- **As a User**, I want this functionality to be available on the Tracking page too, just in case I am tracking a shipment I haven't paid for yet.

## 4. Features / Tasks

### API Integration (FE)

- **FE01**: Implement `continueToPay` API function in `api/shipments/index.ts` calling `POST /shipments/:id/pay`.
- **FE02**: Create `useContinueToPay` mutation hook using React Query, handling the response (Shipment ID + proper Checkout URL).

### Shipment Details Page (UI)

- **UI01**: Locate the existing "Complete Payment" button logic (currently using `duplicateShipment`).
- **UI02**: Replace `duplicateShipment` call with `useContinueToPay` mutation.
- **UI03**: Ensure button loading state is handled during the API call.

### Tracking Page (UI)

- **UI04**: Locate the "Pay for Shipment" button in the "Payment Required" state.
- **UI05**: Remove the `Link` redirect to the shipment page.
- **UI06**: Attach `useContinueToPay` mutation to the button to trigger payment flow directly.

## 5. Non-Goals

- Modifying the backend logic (API endpoint is assumed to be ready).
- Changing payment providers or core checkout logic.
- Handling statuses other than `CREATED`/`PENDING` (e.g., `FAILED` shipments are out of scope for _this_ direct payment flow unless explicitly requested, but user specified scope includes `CREATED` shipments matching the pending payment state).

## 6. Success Metrics

- Successful redirection to Stripe Checkout for unpaid shipments.
- Reduction in "Created but Unpaid" shipments in the database.
