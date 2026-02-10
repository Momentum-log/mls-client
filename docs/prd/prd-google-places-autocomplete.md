# PRD: Google Places Autocomplete Integration

## 1. Introduction / Overview
This feature introduces Google Places Autocomplete to the address fields across the MLS application. It aims to improve user experience by providing predictive address suggestions, reducing manual entry errors and ensuring high-quality address data.

## 2. Goals
- Implement a debounced Google Places Autocomplete input for the street address field.
- Rearrange address forms to place the Street Address field at the top.
- Auto-populate City, State, Country, and Zip Code upon address selection.
- Ensure all fields remain editable after auto-population.
- Support worldwide address search.
- Optimize billing using `sessiontoken`.

## 3. User Stories
- As a user, I want to start typing my street address and see relevant suggestions so I can fill out forms faster.
- As a user, I want the street address to be the first field I see, as it's the primary way I identify my location.
- As a user, I want the system to automatically fill in my city, state, zip, and country once I pick an address, but still let me fix them if needed.

## 4. Features / Tasks

### Shared Components (SC)
- SC01: Create `useDebounce` hook for reusable debouncing logic.
- SC02: Implement `LocationAutocomplete` component using Google Places API.
- SC03: Update [AddressFields](file:///Users/adedotungabriel/work/me/mls/mls-client/components/shared/address-fields.tsx#25-275) to move `Street Address` to the top.

### API Integration (AI)
- AI01: Add `getAutocompleteSuggestions` to `api/location`.
- AI02: Add `getPlaceDetails` to `api/location`.

### Form Updates (FU)
- FU01: Integrate `LocationAutocomplete` into `AddressFields`.
- FU02: Update `@/components/shipment/address-form.tsx` and other consumers to support the new layout.

## 5. Non-Goals
- Real-time address validation (only autocomplete).
- Geocoding/Mapping of selected addresses in the current phase.

## 6. Design Considerations
- Follow the **flat, minimalist, and modern** design philosophy.
- Use solid colors from `global.css`.
- Ensure high contrast for selected suggestions.

## 7. Technical Considerations
- Use `uuid` for `sessiontoken` generation.
- Implement debounce (300-500ms).
- Ensure compatibility with `Formik` as used in existing address forms.

## 8. Success Metrics
- Reduction in manual typing for address fields.
- 100% usage of Google-provided data for address entry.

## 9. Open Questions
- None at this time.
