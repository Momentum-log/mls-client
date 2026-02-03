## Relevant Files

- `types/location.ts` - New interface definitions for Country, State, and City data.
- `api/location/index.ts` - API functions to fetch data from `/api/locations`.
- `hooks/location/use-location.ts` - Unified React Query hooks for fetching location data.
- `components/ui/select.tsx` - Updated component to support search/filtering.
- `components/shipping/location-selector.tsx` - New reusable component for rendering the Country -> State -> City flow.
- `app/(marketing)/shipping-estimate/page.tsx` - The main page being refactored.
- `lib/countries.json` & `lib/countries.iso.json` - Files to be deleted.

### Notes

- All location data will now come from the backend API.
- We are skipping the feature branch creation as requested.
- Hooks will be consolidated into a single file `hooks/location/use-location.ts`.

## Instructions for Completing Tasks

**IMPORTANT:** As you complete each task, you must check it off in this markdown file by changing `- [ ]` to `- [x]`. This helps track progress and ensures you don't skip any steps.

Example:

- `- [ ] <PREFIX>00: <Parent Task Title>` → `- [x] <PREFIX>00: <Parent Task Title>` (after completing)

## Tasks

### Location API & Types (LS)

- [ ] LS00: Location API & Types Setup
  - [x] LS01: Create `types/location.ts` with interfaces for `Country`, `State`, and `City` based on the backend response.
  - [x] LS02: Create `api/location/index.ts` and implement functions: `getCountries`, `getStates(countryCode)`, and `getCities(countryCode, stateCode)`.
  - [x] LS03: Implement the unified `hooks/location/use-location.ts` containing `useCountries`, `useStates`, and `useCities` hooks.

### UI Component Enhancements (UI)

- [x] UI00: Select Component Upgrade
  - [x] UI01: Modify `components/ui/select.tsx` to accept a `searchable` prop.
  - [x] UI02: Implement an input field inside the Select dropdown to filter options by label.
  - [x] UI03: Ensure keyboard navigation and focus management work with the search input.

### Shipping Estimate Page Refactor (SE)

- [ ] SE00: Page & Form Refactor
  - [ ] SE01: Create `components/shipping/location-selector.tsx` that uses `useLocation` hooks and the new `Select` component. It should handle the dependent logic (resetting State when Country changes, etc.).
  - [ ] SE02: Update `app/(marketing)/shipping-estimate/page.tsx` to remove the "Local/Import/Export" toggles and logic.
  - [ ] SE03: Integrate two instances of `<LocationSelector />` (one for Pickup, one for Dropoff) into the main form.
  - [ ] SE04: Update `getEstimatePayload` in `utils.ts` (or creating a new helper) to map the new form values to the backend payload.

### State Persistence & Cleanup (CL)

- [ ] CL00: Persistence & Cleanup
  - [ ] CL01: Add `useEffect` logic in the page to sync form values with URL query parameters (e.g., `?pickupCountry=PL&dropoffCountry=NG`).
  - [ ] CL02: Update form initialization to read from these URL parameters if present.
  - [ ] CL03: Delete legacy files: `lib/countries.json` and `lib/countries.iso.json`.
  - [ ] CL04: Verify `address-form.tsx` or other components are not broken by the `Select` or `lib` file changes (update imports if needed).

### Validation (VE)

- [ ] VE00: Final Validation
  - [ ] VE01: Test the full flow: Select Country -> Select State -> Select City -> Get Quote.
  - [ ] VE02: Verify that changing a Country clears the State/City selection.
