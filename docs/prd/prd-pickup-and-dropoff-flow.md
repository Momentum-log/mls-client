# PRD: Pickup & Drop-off Flow Enhancements

## 1. Introduction / Overview

The `mls-client` logistics application is enhancing its shipment creation wizard and shipment details management page to support two fulfillment options:

1. **Request Courier Pickup**: Shippers schedule on-call carrier courier pickups at their address for a future business date and time window.
2. **Drop-off at Center**: Shippers drop packages off at nearby authorized FedEx sorting/drop-off centers.

This PRD defines the **frontend user interface, component architecture, state management, and API integration** required for `mls-client` based on the backend API specification ([openapi.json](file:///Users/thekiwidev/work/mls/mls-client/openapi.json)) and backend PRD ([server-prd-pickup-and-dropoff-flow.md](file:///Users/thekiwidev/work/mls/mls-client/docs/server-prd-pickup-and-dropoff-flow.md)).

---

## 2. Goals

- **Intuitive Fulfillment Selection**: Provide a minimalist segmented toggle UI (styled similarly to the PLN/EUR currency selector) allowing users to switch seamlessly between "Request Pickup" and "Drop-off at Center".
- **Contextual Tooltips & Explanatory Modals**: Include info triggers next to each fulfillment option that display tooltips and modal popups explaining how each mode works and what actions are required post-creation.
- **Dynamic Pickup Scheduling**: Fetch carrier pickup availability via `POST /api/shipments/pickup-availability` to enforce valid future business dates (Mon–Fri only, excluding past dates) and standard ready/close time windows.
- **Drop-off Center Discovery**: Query nearby FedEx centers via `POST /api/locations/dropoff-centers` based on the sender's origin address, showing operating hours, address, and distance in km.
- **Post-Creation Guidance**: Present clear instructions on label download, printing, package attachment, and handover guidelines on payment completion/verification.
- **Dynamic Shipment Details UI**: Display fulfillment status on the Shipment Details page, featuring an intuitive "View Available Drop-off Centers" action for drop-off shipments that automatically hides once the package status changes to `IN_TRANSIT` or `PICKED_UP`.

---

## 3. User Stories

- **US01 (Shipper - Mode Selection)**: As a shipper, I want to toggle between requesting a pickup and dropping off at a center using a clean segmented control with explanatory tooltips/modals so I understand how my package will be collected.
- **US02 (Shipper - Pickup Scheduling)**: As a shipper requesting a pickup, I want to pick from valid carrier business dates and specify a ready/close time window so a courier visits my address when convenient.
- **US03 (Shipper - Drop-off Discovery)**: As a shipper dropping off a package, I want to view nearby FedEx centers sorted by distance with full operating hours so I can plan my visit.
- **US04 (Shipper - Post-Creation & Label Instructions)**: As a user who just created a shipment, I want clear instructions on downloading, printing, and attaching the shipping label to my package.
- **US05 (Shipper - Shipment Details Management)**: As a user viewing my shipment details, I want to see expected pickup dates or toggle available drop-off centers until my package is collected/in transit.
- **US06 (Shipper - Missed Pickup Resolution)**: As a user whose courier pickup was missed, I want to see a clear warning banner with a "Contact Support" action button to resolve the issue.

---

## 4. Features / Tasks

### Fulfillment Selection & Toggle UI (`FT`)

- **FT01**: Create `FulfillmentTypeToggle` component in `components/shipment/`:
  - Segmented control supporting `PICKUP` ("Request Courier Pickup") and `DROPOFF` ("Drop off at Center").
  - Styled with flat, minimalist design matching existing currency toggle (PLN/EUR) using CSS variables from `global.css`.
- **FT02**: Add info trigger icons (`<Info />`) with Tooltip & Modal popups for both modes:
  - **Pickup Modal**: Explains courier pickup process, date/time ready window requirements, and driver handover expectations.
  - **Drop-off Modal**: Explains center handover procedure, label placement, and operating hours guidelines.
- **FT03**: Integrate `FulfillmentTypeToggle` into the sender/pickup address step of shipment creation.

### Pickup Scheduling & Validation (`PK`)

- **PK01**: Integrate `POST /api/shipments/pickup-availability` endpoint:
  - Trigger query when pickup address is selected and fulfillment mode is `PICKUP`.
  - Handle response fields: `availableDates`, `cutoffTime`, `accessTime`, `defaultReadyTime`.
- **PK02**: Create `PickupDatePicker` component:
  - Display available dates returned by backend (future business days Mon–Fri only).
  - Disable past dates, weekends, and unavailable carrier dates.
- **PK03**: Create `PickupTimePicker` component:
  - Input fields for `readyTime` (default `09:00:00`) and `closeTime` (default `17:00:00`).
  - Validate `readyTime < closeTime` and minimum window duration (e.g. at least 2 hours).
- **PK04**: Pass `fulfillmentType` and `pickupDetails` object in payload when invoking `POST /api/shipments/create-shipment`:
  ```json
  {
    "fulfillmentType": "PICKUP",
    "pickupDetails": {
      "scheduledDate": "2026-08-03",
      "readyTime": "09:00:00",
      "closeTime": "17:00:00",
      "remarks": "Ring bell at front gate"
    }
  }
  ```

### Drop-off Center Discovery (`DO`)

- **DO01**: Integrate `POST /api/locations/dropoff-centers` endpoint:
  - Trigger query when origin address is set and `fulfillmentType === 'DROPOFF'`.
  - Send request body: `{ "carrierSlug": "fedex", "address": { ... }, "radiusKm": 50 }`.
- **DO02**: Create `DropoffCenterList` component:
  - Display list of nearby centers sorted by `distanceKm`.
  - Render center name, street lines, city, postal code, distance (km), and formatted operating hours.
- **DO03**: Add optional center bookmarking/selection allowing shippers to reference a specific center on their shipment.

### Post-Creation & Label Instructions (`LB`)

- **LB01**: Build `ShipmentPreparationCard` component displayed on post-payment verification screen (`/payments/verify-payment`):
  - Primary CTA: "Download Shipping Label" button.
  - Step 1: Print label on standard A4 / adhesive shipping paper.
  - Step 2: Affix label flatly on top of package (avoid folds over barcodes).
  - Step 3 (Fulfillment specific):
    - For `PICKUP`: Display confirmed scheduled date, ready time window, and driver instructions.
    - For `DROPOFF`: Display instructions for presenting package at FedEx center counter.

### Shipment Details Page (`SD`)

- **SD01**: Update Shipment Details page (`/shipments/[id]`):
  - Display `fulfillmentType` badge (`Courier Pickup` or `Drop-off at Center`) and `pickupStatus` badge (`PENDING`, `CONFIRMED`, `MISSED`, `CANCELLED`).
- **SD02**: For `PICKUP` shipments:
  - Show scheduled pickup date (`scheduledPickupDate`), ready window (`pickupReadyTime` - `pickupCloseTime`), and confirmation code if available.
- **SD03**: For `DROPOFF` shipments:
  - Render an intuitive action button: **"View Available Drop-off Centers"**.
  - Clicking button toggles an expandable view/modal containing nearby FedEx centers, operating hours, and drop-off instructions.
- **SD04**: Implement automatic hiding condition for drop-off centers view:
  - Drop-off centers section/button is visible **only while** `shipmentStatus` is `PENDING`, `LABEL_CREATED`, or `CREATED`.
  - Automatically hide the section once `shipmentStatus` updates to `IN_TRANSIT`, `PICKED_UP`, `DELIVERED`, or `COMPLETED`.
- **SD05**: Render Missed Pickup Warning Banner:
  - Triggered when `pickupStatus === 'MISSED'` or response includes `supportAction: 'CONTACT_SUPPORT_FOR_RESCHEDULE'`.
  - Prominently displays support notice with a direct "Contact Support" action button.

---

## 5. Non-Goals (Out of Scope)

- Modifying backend APIs or database schema (handled by backend PRD).
- Automatic rescheduling without support agent involvement.
- Hard location locking (packages can be dropped off at any authorized FedEx center regardless of selected preference).

---

## 6. Design Considerations

- **Design System**: Strict adherence to flat, minimalist, modern design.
- **No Gradients**: Use solid background colors only.
- **Color Variables**: All styling MUST use CSS variables defined in `global.css` (e.g. `bg-brand-blue`, `text-text-color`, `bg-background-color`).
- **Reusable UI Components**: Use primitive components from `@/components/ui/` (Button, Card, Input, Modal, Badge, Tooltip).
- **Typography & Layout**: Modern, high-contrast typography with intuitive responsive grid/flex layouts.

---

## 7. Technical Considerations

- **API Integration**:
  - `POST /api/shipments/pickup-availability` (Bearer Auth)
  - `POST /api/locations/dropoff-centers` (Bearer Auth / X-MLS-Key)
  - `POST /api/shipments/create-shipment` (Extended schema with `fulfillmentType` & `pickupDetails`)
  - `GET /api/shipments/get-shipment/:id` (Returns fulfillment metadata, `pickupStatus`, `supportAction`)
- **Type Safety**: Define TypeScript interfaces in `types/shipment.ts` and `types/location.ts` matching OpenAPI definitions.
- **Validation**: Client-side validation using Zod for pickup date & time windows before submitting creation form.

---

## 8. Success Metrics

- **Zero Past-Date Errors**: 100% of pickup requests use valid, future business dates.
- **High UX Clarity**: Users easily understand pickup vs drop-off via explanatory tooltips/modals.
- **Clean Details Page Lifecycle**: Drop-off center display automatically hides once package transitions to `IN_TRANSIT` / `PICKED_UP`.
- **Label Preparation Compliance**: Clear guidance reduces label attachment errors and support inquiries.

---

## 9. Open Questions

*All requirements clarified and finalized.*
