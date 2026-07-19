# Product Requirements Document: Multiple Packages Support (MPS)

## 1. Introduction / Overview

Momentum Logistics Service (MLS) Polish region is introducing Multiple Packages Support (MPS). This feature allows users to ship multiple physical boxes/packages within a single shipment or quote request. 

This PRD outlines the frontend changes required to support MPS. To maintain compatibility with backend updates, we are transitioning from a single `package` object to a `packages` array across all estimate, quote, and shipment creation payloads.

---

## 2. Goals

- Enable users to define and send multiple packages in quote requests and shipment creation.
- Keep the user interface clean and minimal, following a flat design philosophy.
- Automate customs declaration line-item creation based directly on the package list to reduce manual data entry.
- Prevent carrier validation errors by enforcing consistent units of measure across all defined packages.

---

## 3. User Stories

- **US01:** As a logistics customer, I want to input the dimensions, weight, and description of multiple boxes in my quote request so that I can see the total shipping cost for my entire shipment.
- **US02:** As an international shipper, I want my package details (description and weight) to automatically sync to the customs clearance section so that I only have to search and fill in the HS / Tariff code for each item.
- **US03:** As a user, I want a single units toggle to control the units of all my packages simultaneously so that I don't accidentally mix KG/LB or CM/IN and trigger API errors.

---

## 4. Features / Tasks

### Package Input Interface (PI)
- **PI01:** Refactor the Package Details step UI to support a dynamic list of packages using a fields array.
- **PI02:** Implement a global unit selector (Metric: `KG` & `CM` vs. Imperial: `LB` & `IN`) at the top of the package form. All packages in the list must automatically use the active global units.
- **PI03:** Provide an "Add Another Package" button to dynamically append a new package details card to the list.
- **PI04:** Provide a delete button (trash icon) for each package card when the package list contains more than 1 item.
- **PI05:** Include quick preset buttons (Envelope, Book Box, Laptop Box, Luggage, Custom) per package card, auto-filling the length, width, height, and weight for that package.
- **PI06:** Add real-time sync functionality to update the Zustand shipment store as packages are added, edited, or removed.

### Customs Integration (CI)
- **CI01:** Lock the customs declarations array to the packages list.
- **CI02:** Automatically generate one customs item card for each defined package, pre-populating the item name/description and gross weight.
- **CI03:** Leave only the Tariff / HS Code field empty and require the user to input it for each customs card.
- **CI04:** Display a "Find HS Code" link (pointing to the tariff search utility) next to each customs item's HS Code input field.
- **CI05:** Disable manual adding or deleting of customs items inside the customs details step to keep it fully synchronized with the package list.

### API & Payload Migration (AP)
- **AP01:** Update TypeScript schemas in `types/shipping.ts` to replace the `package` object with a `packages` array in `ShippingEstimatePayload`, `LocalShipmentPayload`, `InternationalShipmentPayload`, and `Shipment`.
- **AP02:** Refactor the shipping estimate hook `useGetShippingEstimate` and utility helper `getEstimatePayload` to construct the `packages` array payload.
- **AP03:** Refactor the shipment creation mutation `useCreateShipment` and `handleFinalize` payload formatting in the shipment page to output the `packages` array.

---

## 5. Non-Goals (Out of Scope)

- Mixed unit shipments (e.g., sending one box in KG and another in LB) is strictly out of scope due to carrier and backend limitations.
- Custom pricing models for multi-package shipments on the client-side (rates are fully calculated and returned by the backend).

---

## 6. Design Considerations

- **Visual Style:** Maintain the flat, minimalist design. No gradients.
- **Form Layout:** Each package item in the fields array should be encapsulated in a card with subtle borders (using variables from `global.css`).
- **Interactive Elements:** Transition effects should be smooth when adding or removing package items.
- **Buttons:** Custom UI `<Button>` elements must be utilized.

---

## 7. Technical Considerations

- **State Management:** Use Zustand (`store/shipment-store.ts`) to manage the state of the packages list.
- **Form Libraries:** Formik and Zod should be used to manage and validate the packages fields array and customs details array.
- **Unique Identifiers:** Generate a unique `uuid` (using `uuidv4`) for each package to key components properly.

---

## 8. Success Metrics

- 100% of multi-package shipments successfully pass frontend validation.
- Zero `400 Bad Request` validation errors on the backend due to mixed units of measure.
- Customs clearance form completion time is reduced since package specifications are automatically synchronized.

---

## 9. Open Questions

- None at this stage. All requirements have been aligned.
