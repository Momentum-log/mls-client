# Feature PRD: Shipping Estimate & Customs Flow (International)

## 1. Introduction / Overview
To accurately fetch shipping estimates from comprehensive cross-border carriers (like DHL), the frontend must transition from requesting simplistic, lightweight "Quotes" to supplying strict "Estimates" payloads before rendering service selections. When shipping internationally (where origin and destination countries differ), detailed Customs Information must explicitly be captured.

This update introduces a conditional "Customs Details" step in the shipment creation wizard (`/app/app/shipments/new/page.tsx`). It allows users to declare line items, HS tariff codes, and identify their entity type (business vs. individual) to generate fully compliant shipping estimates and labels.

---

## 2. Goals
- Capture precise Customs Information required by international shipping carriers.
- Dynamically detect when an international shipment is being evaluated and insert a "Customs Details" step seamlessly into the existing vertical timeline workflow.
- Update data flow to utilize the `POST /api/shipments/get-shipping-estimate` endpoint, guaranteeing all strictly validated `CustomsData` details are enclosed.

---

## 3. User Stories
- As a user shipping internationally, I want to declare the items inside my package so that my shipment smoothly clears customs.
- As an active user, I want the system to remember my default customs entity (Business vs. Individual) via my user settings, reducing repetitive data entry.
- As a user shipping domestically, I don't want to be distracted by customs questions, as they are not legally relevant.
- As a user, I want clear guidance to find my item's HS (Tariff) Code since I might not inherently know it.

---

## 4. Features / Tasks

### Customs Timeline UI (CU)
- **CU01**: Create a new `<CustomsForm />` component (similar to `<AddressForm />`) to gather customs data.
- **CU02**: Update `/app/app/shipments/new/page.tsx` to conditionally inject a "Customs Details" step into the `VerticalTimeline` directly following "Package Details" and preceding "Service Selection" IF `pickup.countryCode !== dropoff.countryCode`.
- **CU03**: Render the `<CustomsForm />` within a hidden/expanding `<StackedSection />` for international shipments to honor the sequential workflow.
- **CU04**: Automatically pre-populate the "Business / Individual" entity selection by querying the user’s default preferences (from Settings).

### Form Inputs & Validation (FI)
- **FI01**: Add a clearly visible Business vs. Individual toggle button/card selector at the top of the `<CustomsForm />`. "Business" aligns with `customsType: "S"` (Simplified), whereas "Individual" aligns with `customsType: "I"` (Individual).
- **FI02**: Based on the Customs Type selected, present required fields conforming to the `docs/client-shipping-endpoints-guide.md` documentation (e.g., NIP number, EORI number, Category of item).
- **FI03**: Construct a dynamic line-item builder managing the `customsItem` array. Each entry form must compile `nameEn`, `namePl`, `quantity`, `weight`, `value`, and `tariffCode` (HS Code).
- **FI04**: Render the `tariffCode` field as a standard numerical text input, paired with a small external help anchor (e.g., "Find your HS Code") beside the label.
- **FI05**: Explicitly omit file upload mechanics for the Commercial Invoice; instead, document that the backend automatically structures and converts invoice content into a Base64 format behind the scenes.

### Backend & State Integration (BI)
- **BI01**: Expand the Zustand `useShipmentStore` block (`/store/shipment-store.ts`) to initialize, store, and edit `customsData` state properties.
- **BI02**: Refactor the shipping rate request inside `/app/app/shipments/new/page.tsx` directly connecting `getEstimatePayload()` (or a new variant) to extract international `customsData` properties into the payload prior to estimating.
- **BI03**: Ensure profile settings schemas globally support defining and saving a default `preferredCustomsEntityType` flag.

---

## 5. Non-Goals (Out of Scope)
- Client-side file uploading or text-parsing of static Commercial Invoice documents (PDFs/Images).
- Creating/managing a native, internally indexed mapping database or fuzzy dropdown picker for Tariff (HS) codes.
- Comprehensive structural changes to the primary layout or logic mechanisms for Domestic Shipments.

---

## 6. Design Considerations
- Utilizing the designated **MLS styling**: Minimalist with flat, non-gradient colors using existing global.css variables.
- The Business/Individual toggle must rely on established `<Button />` variants or a custom toggle styled exactly matching existing inputs.
- Any dynamic line-item forms (for items) must incorporate a prominent, standard "Add Another Item" button.
- Ensure appropriate visual focus states and descriptive placeholder text given the strict validation requirements of the Customs endpoint.

---

## 7. Technical Considerations
- Since Timeline steps are sequentially evaluated in `page.tsx` (e.g., `isSectionVisible()`), the array of steps must dynamically adapt length when toggling an international destination. Completion indexes must account for this shift.
- Validation schemas (via `zod` and `react-hook-form` if active) inside `<CustomsForm />` must perfectly mirror the `TypeScript` requirements provided in `docs/client-shipping-endpoints-guide.md` (`CategoryOfItem` limited strings etc.).

---

## 8. Success Metrics
- 100% of International shipment estimates dispatch a conformant `customs` JSON payload avoiding 400 Bad Requests statuses.
- Zero customer service support inquiries referencing "Cannot locate HS code interface."
- Negligible backend rejection rates due to missing NIP numbers on International Individual consignments.

---

## 9. Open Questions
- What designated external reference URL should we utilize for the "Find your HS Code" hyperlink?
- For the setting implementation (user defaulting to Individual vs Business), what endpoint structure currently dictates user profile/setting updates, and will it be modified as part of this exact ticket?
