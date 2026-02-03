# Product Requirements Document: Global Shipping Expansion & UX Enhancements

## 1. Introduction / Overview

The Momentum Logistics Service (MLS) is evolving from a Poland-centric platform to a global shipping solution. This initiative involves removing regional restrictions ("Local", "Import", "Export") and allowing users to book shipments between any two countries. Additionally, the project will implement dynamic currency configuration via environment variables and enhance the Homepage and Form UX to support these changes.

## 2. Goals

1.  **Enable Global Shipping**: Allow users to select _any_ Origin and _any_ Destination country without pre-selecting a shipment type (Local/Import/Export).
2.  **Configurable Currency**: Replace hardcoded "PLN" references with a configurable environment variable (supporting USD, EUR, PLN, etc.).
3.  **Improve Data Entry UX**: Implement robust Country/City selection logic (dependent dropdowns) and a Phone Number country code selector.
4.  **Actionable Homepage**: Ensure all Hero section buttons ("Track Now", "Book Now", "Ship Global") route to the correct functional pages.

## 3. User Stories

- **As a User**, I want to create a shipment from the USA to the UK without having to categorize it as "Import" or "Export" manually.
- **As a User**, I want to see pricing in the currency relevant to the platform's current configuration (e.g., USD or EUR).
- **As a User**, I want to select my country first, and then only see relevant cities in the next dropdown, to avoid searching through thousands of irrelevant cities.
- **As a User**, I want to select my phone country code from a list so I don't have to guess the format.
- **As a Visitor**, clicking "Track Now" on the homepage should immediately take me to the tracking tool.

## 4. Features / Tasks

### Global Shipping Logic (GS)

- **GS01**: Update the "Shipment Estimate" and "Create Shipment" pages to remove the "Local", "Import", "Export" tabs.
- **GS02**: Implement a unified "Origin" and "Destination" selection flow. The interface should allow selecting any supported country for both fields.
- **GS03**: detailed shipping types (Local/Import/Export) needs to be inferred or removed in favor of direct Origin/Destination payloads to the backend.

### Currency Configuration (CU)

- **CU01**: Define new environment variables `NEXT_PUBLIC_CURRENCY_CODE` (e.g., "USD", "EUR", "PLN") and `NEXT_PUBLIC_CURRENCY_SYMBOL` (e.g., "$", "€", "zł").
- **CU02**: Refactor the codebase to replace all hardcoded "PLN" and "zł" strings with the new configuration variables.

### Homepage Enhancements (HP)

- **HP01**: Link "Track Now" button to `/tracking` (or the specific tracking section).
- **HP02**: Link "Book Now" and "Ship Global" buttons to the Shipping Estimate/Calculator page (`/shipment/estimate` or equivalent).

### Form UX: Location & Phone (UX)

- **UX01**: Update `AddressForm` Country Select to have an empty default state ("Select Country") instead of pre-selecting "Poland".
- **UX02**: Implement logic where the **City** dropdown is disabled or empty until a Country and State (if applicable) are selected.
- **UX03**: meaningful "Select" default state for City and State dropdowns.
- **UX04**: **Phone Input**: Add a visual Country Code selector (dropdown with flags/codes) before the phone number input field. (Note: Visual selection only, no deep validation required yet).
- **UX05**: **Location Data**: Maintain current client-side data source (e.g., `country-state-city` or JSON) for now, but structure the code to easily swap the data fetching mechanism to an API call in the future.

## 5. Non-Goals (Out of Scope)

- Creating the Backend API for cities (postponed to a future task).
- Real-time carrier rate fetching for global routes (existing API logic remains).
- Deep phone number validation (libphonenumber) – visual selector only.

## 6. Technical Considerations

- **Location Data**: While an API is preferred for performance, we will continue using the client-side library/JSON for this iteration as requested, until the backend microservice is ready.
- **Env Vars**: Ensure `.env.local` is updated and documented. default fallback should likely be USD if variable is missing.

## 7. Success Metrics

- Users can successfully book a shipment from Non-Poland Origin to Non-Poland Destination.
- Currency displays consistently as configured in `.env`.
- City list updates immediately upon changing the Country.

## 8. Open Questions

- None.
