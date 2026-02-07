# PRD: Shipping Estimate & Location API Integration

## 1. Introduction / Overview

This feature aims to overhaul the **Shipping Estimate** flow on the marketing site (`/shipping-estimate`) to be more direct and global-ready. We will remove the legacy "Local / Import / Export" toggle logic and instead provide a unified form where users can select any **Pickup** and **Dropoff** location using real-time API data.

Additionally, we will integrate the new **Location Services API** (`/api/locations`) to populate Country, State, and City dropdowns dynamically, replacing any hardcoded lists or heavy client-side libraries.

## 2. Goals

1.  **Refactor Estimate Flow**: Remove arbitrary "shipping modes" (Local/Import/Export). Allow any-to-any country routing.
2.  **Integrate Location API**: Connect the frontend to the new backend endpoints for Countries, States, and Cities.
3.  **Improve Data Accuracy**: Ensure users select valid, standard location data (ISO codes) to prevent downstream shipping errors.
4.  **Enhance UX**: Provide searchable dropdowns for high-volume lists (e.g., Cities) while maintaining the design system.
5.  **Persist State**: Allow users to share or refresh quote pages without losing their selected criteria (via URL parameters).

## 3. User Stories

- **As a User**, I want to select my Pickup country, then state, then city from a list so that I don't have to type them manually and risk spelling errors.
- **As a User**, I want to search for my city by typing its name because scrolling through hundreds of cities is tedious.
- **As a User**, I want to get a shipping quote without providing my personal phone number or email yet.
- **As a User**, I want to send a link of my quote to a colleague, preserving the selected origin and destination.

## 4. Features / Tasks

### **Location Services (LS)**

- **LS01**: Create a client-side API service (`services/location-service.ts`) to fetch:
  - `GET /api/locations/countries`
  - `GET /api/locations/countries/:code/states`
  - `GET /api/locations/countries/:code/states/:code/cities`
- **LS02**: Create a React Hook `useLocationData` to manage the dependent fetching logic (e.g., clearing State/City when Country changes).
- **LS03**: Enhance the Shared `Select` component (`components/ui/select.tsx`) or create `SearchableSelect` to support **text filtering/searching** for options (critical for City selection).

### **Shipping Estimate Page (SE)**

- **SE01**: Remove `SHIPPING_MODES` constant and the "Local / Import / Export" toggle UI from `app/(marketing)/shipping-estimate/page.tsx`.
- **SE02**: Create a reusable `LocationSelector` layout that mimics the style of `AddressForm` (Grid layout, Bold labels) but uses the new `SearchableSelect`.
  - _Fields_: Country (Select), State (Select), City (Select), Postal Code (Input), Street Address (Input).
- **SE03**: Integrate `LocationSelector` for both **Pickup** and **Dropoff** sections on the Estimate page.
- **SE04**: Update `getEstimatePayload` utility to map the new form values to the backend payload structure (including generic "Guest User" contact defaults).
- **SE05**: Implement URL query parameter synchronization (e.g., `?origin=US&dest=PL&weight=5`) to persist form state.
- **SE06**: Remove client-side location libraries (e.g., `country-state-city` package) if no longer used.

### **Validation & Error Handling (VE)**

- **VE01**: Update Zod schema (`schema.ts`) to validate that `countryCode`, `stateOrProvinceCode`, and `city` are present.
- **VE02**: Ensure the UI handles "Empty States" gracefully (e.g., if a country has no states, the State dropdown should be hidden or disabled).

## 5. Non-Goals

- **Booking**: This PRD focuses only on the _Estimate_ (Quote) phase. Booking flow updates are out of scope.
- **User Accounts**: We are not changing how guest vs. logged-in user identification works.
- **Complex Address Validation**: We are not validating the _Street Address_ via an external mapping service (Google Maps) at this stage, only ensuring the fields are filled.

## 6. Design Considerations

- **Style**: Must match `components/shipment/address-form.tsx`.
  - Labels: `text-xs font-black uppercase tracking-tight text-gray-700`
  - Inputs: Rounded corners (`rounded-2xl`), large padding (`px-5 py-4`), specific border/focus states.
- **Component**: Use the custom `Select` UI logic (Tailwind + Framer Motion) but add an input field inside the dropdown trigger (or a search bar inside the dropdown menu) for filtering.

## 7. Technical Considerations

- **API Performance**: Cache location responses (React Query) to avoid re-fetching countries on every render.
- **State Defaults**: If a country has no states (e.g., Singapore sometimes), the API returns an empty array. The frontend must allow the form to proceed with just Country + City in these cases.

## 8. Success Metrics

- User can generate a quote successfully for a route like "Nigeria -> Poland" or "Germany -> France" without UI errors.
- "City not found" errors in the backend logs decrease (due to standardized dropdown selection).
- Page load bundle size decreases (due to removal of large JSON datasets).

## 9. Open Questions

- _None. All clarified by user._
