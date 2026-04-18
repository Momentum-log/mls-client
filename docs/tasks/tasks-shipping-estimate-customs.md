## Relevant Files
- `app/app/shipments/new/page.tsx` - Main wizard page to conditionally include Customs step.
- `components/shipment/customs-form.tsx` - New form component for Customs Details.
- `store/shipment-store.ts` - Zustand store for managing customs data state.
- `hooks/shipments/use-shipments.ts` - Custom hook for `get-shipping-estimate` payload handling.
- `app/(marketing)/shipping-estimate/utils.ts` - Utility to compile the estimation payload.

### Notes
- Ensure strict adherence to the Business/Individual customs schema provided in `docs/client-shipping-endpoints-guide.md`.
- No file upload logic is needed for invoices as per PRD.

## Instructions for Completing Tasks
**IMPORTANT:** As you complete each task, you must check it off in this markdown file by changing `- [ ]` to `- [x]`. Update the file after completing each sub-task.

## Tasks

### State Management
- [x] SM00: Setup customs state in `useShipmentStore`
  - [x] SM01: Define `CustomsData` types (or import from `types/shipping.ts`) in `store/shipment-store.ts`.
  - [x] SM02: Add `customs: CustomsData | null` to the store's state interface.
  - [x] SM03: Implement `setCustoms(customs: CustomsData)` action to update the state.
  - [x] SM04: Extend the `reset` action to clear `customs` data.

### Customs UI
- [x] CU00: Develop `<CustomsForm />` component
  - [x] CU01: Create new component `components/shipment/customs-form.tsx` using `react-hook-form` and `zod` for validation matching the strict endpoint specifications.
  - [x] CU02: Add a toggle/tab selector for "Business" (Simplified) vs "Individual" entity types.
  - [x] CU03: Render conditional fields based on Entity Type: e.g., `nipNr`, `categoryOfItem`, `grossWeight`, `firstName`, `secondaryName`.
  - [x] CU04: Implement a dynamic list (using `useFieldArray` or state) to add/remove multiple `customsItem` entries (`nameEn`, `namePl`, `quantity`, `weight`, `value`, `tariffCode`).
  - [x] CU05: Add an external help link component next to the `tariffCode` field for finding HS codes.
  - [x] CU06: Pre-populate the default "Business/Individual" toggle state from the user's settings profile if available.

### Wizard Integration
- [x] WI00: Integrate Customs step into `/app/app/shipments/new/page.tsx`
  - [x] WI01: Update the `steps` array in the `VerticalTimeline` to dynamically inject `id: "customs"` between `package` and `service` IF `pickup.countryCode !== dropoff.countryCode`.
  - [x] WI02: Adjust `isSectionVisible` helper to conditionally display the customs step based on completion of the `package` step and international route.
  - [x] WI03: Add `<StackedSection>` for "Customs Details", rendering the new `<CustomsForm />` component.
  - [x] WI04: Create `handleCustomsSubmit` function to save data to the Zustand store and trigger section transition to "Service Selection".

### API Integration
- [x] AP00: Update estimate payload construction and handle strict response
  - [x] AP01: Update `getEstimatePayload` (in `utils.ts` or directly within `page.tsx`) to map and append the `customs` store object securely into the final payload.
  - [x] AP02: Adjust `handleFinalize` in `page.tsx` to include the `customs` payload object for creating the physical shipment.
  - [x] AP03: Ensure any 400 Bad Request errors resulting from mismatched customs data surface cleanly via the Toast notifications.

### User Profile Settings
- [x] US00: Add default customs type selection to user settings
  - [x] US01: Update User profile store/settings UI to define and persist a `defaultCustomsType` (Business vs Individual) value.
  - [x] US02: Ensure settings are loaded early so that `<CustomsForm />` can query it on initial mount.
