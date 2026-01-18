# PRD: Shipment Tracking & List Improvements

## 1. Introduction / Overview

This feature focuses on improving the user experience for shipments that have been **created but not yet paid for**, and refining the **shipment duplication** workflow.
Currently, tracking an unpaid shipment displays a confusing "Tracking not available" message. We want to replace this with a clear call-to-action to complete the payment.
Additionally, the "Duplicate Shipment" button on the shipment list is too prominent and prone to accidental clicks. We will move this to a contextual menu to prevent errors and add utility functions like copying tracking numbers.

## 2. Goals

1.  **Clearer Tracking Status**: Prevent users from seeing technical tracking errors for shipments that simply need payment.
2.  **Conversion**: Guide users directly from the tracking page to the payment flow for unpaid shipments.
3.  **Better List UX**: Reduce UI clutter and prevent accidental shipment duplication by moving actions to a menu.
4.  **Efficiency**: Allow users to copy tracking numbers directly from the shipment list.

## 3. User Stories

1.  **Unpaid Shipment Tracking**: "As a user, when I track a shipment I just created, I want to see a message telling me to pay for it, so I know why tracking isn't available yet."
2.  **Payment Navigation**: "As a user, I want a button on the tracking page to pay for my shipment immediately, so I can complete the process."
3.  **Shipment List Actions**: "As a user, I want to access shipment actions (like Copy Tracking, Duplicate) through a menu, so the interface looks cleaner and I don't accidentally duplicate items."
4.  **Copy Tracking**: "As a user, I want to copy a shipment's tracking number without opening the full details page."

## 4. Features / Tasks

### Tracking UI Integrations (TR)

- **TR01**: Detect `shipmentStatus === 'CREATED'` on the Tracking Page (`app/app/track/page.tsx`).
- **TR02**: **Hide** the standard tracking timeline and details for "CREATED" shipments.
- **TR03**: **Display** a specific "Payment Required" empty state for "CREATED" shipments.
  - **Message**: "This shipment is in your list, but you have not paid for it. Please pay for the shipment to enable tracking. Continue to complete the shipment."
  - **Action**: Add a "Pay for Shipment" button.
    - _Note_: Since the complete payment endpoint is in progress, this button should currently alert or redirect to the relevant payment section (or be a placeholder ready for the backend integration).

### Shipment List UI (SL)

- **SL01**: Remove the existing "Duplicate Shipment" (copy icon) button from the Shipment List (`app/app/shipments/page.tsx`).
- **SL02**: Implement a **"Three Dots" (Kebab) Menu** for each shipment row.
- **SL03**: Add the following actions to the menu:
  1.  **View shipment**: Navigates to shipment details.
  2.  **Copy tracking number**: Copies the `customTrackingNumber` to clipboard.
  3.  **Create duplicate shipment**: Triggers the existing `duplicateShipment` logic.
- **SL04**: Ensure the menu UI uses distinctive icons and avoids distinct row clicks interfering with the menu interactions.

### Shipment Details Page (SD)

- **SD01**: _No Changes Required_. The "Ship Again" button and "CREATED" status display on the details page remain as they are.

## 5. Non-Goals

- We are **not** changing the shipment status on the backend. It remains `CREATED`.
- We are **not** removing the "Ship Again" button from the Shipment Details page (single view).
- We are **not** implementing the full backend payment logic in this task, only the UI entry point.

## 6. Success Metrics

- Reduction in user confusion regarding "Tracking not available" for new shipments.
- Zero accidental "Duplicate Shipment" clicks reported.
- Successful use of the "Copy Tracking Number" feature from the list view.

## 7. Open Questions

- _None. All clarified._
