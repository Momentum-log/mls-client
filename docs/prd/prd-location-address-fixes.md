# Product Requirements Document: Location Requirement & Address Autocomplete Fixes

## 1. Introduction / Overview

This feature introduces a strict location permission requirement for users attempting to create a shipment on the web platform. If permission is denied, a blocking overlay will explain how to enable it, alongside providing a way to try triggering the request again.

Additionally, this PRD addresses specific bugs with the Google Places Autocomplete integration. When a user selects a valid suggestion, the application currently fails to extract the street line or city in certain cases. This update ensures that missing details are correctly parsed from the `formatted_address` string, while also allowing users to manually edit these fields without being blocked. Finally, any IP-based location detection logic will be completely removed as exact device location is now a prerequisite.

## 2. Goals

- Enforce device-level browser location permission as a strict prerequisite to access the "Create Shipment" functionality.
- Provide clear, actionable guidance to users who have denied location access on how to re-enable it.
- Fix Google Places Autocomplete address extraction to correctly parse missing fields (street line, city) using the full formatted address string.
- Grant users the ability to manually input or correct address details if the autocomplete data is incomplete or slightly off.
- Remove redundant IP-based location detection code entirely.

## 3. User Stories

- As a user, when I open the web application, I am prompted for my location so that the system correctly identifies my region and allows me to create shipments.
- As a user who accidentally denied location permission, I see a full-screen overlay guiding me on how to grant permission, preventing me from proceeding until I do.
- As a user filling out an address, when I select a suggested place, my street address and city are automatically and accurately filled in, even if they aren't part of Google's structured data.
- As a user, if the autocomplete misses my street or city, I can easily type them in manually without the form blocking my input.

## 4. Features / Tasks

- **Location Permission Enforcement**:
  - LO01: Implement a location permission check (`navigator.permissions.query({ name: 'geolocation' })`) when the site loads and when accessing the "Create Shipment" page.
  - LO02: If permission is `prompt`, request the location via `navigator.geolocation.getCurrentPosition()`.
  - LO03: Create a full-screen, blocking overlay component displaying if permission is `denied`.
  - LO04: The overlay must include text explaining _why_ location is required, visual or written instructions on how to use the browser UI (e.g., URL bar padlock) to allow it, and a "Check Permission Again" button.

- **Storage / Code Cleanup**:
  - CC01: Remove any IP-based location detection logic, specifically the `ipInfo` block in `store/country-store.ts` (lines 124-136) and any related API calls or states.

- **Address Autocomplete Fixes**:
  - AD01: Update the Google Places `onPlaceSelected` callback logic. If `address_components` is missing `route`/`street_number` or `locality` (city), parse and extract these values from the comma-separated `formatted_address` string as a fallback.
  - AD02: Ensure all address input fields (especially Street Address and City) remain completely editable after autocomplete runs. The user must be able to overwrite or append to the autocompleted data freely.

## 5. Non-Goals (Out of Scope)

- Making changes to the Mobile App (React Native/Expo). This PRD is specifically targeting the Web Client (React/Next.js).
- Changing the overall UI design or layout of the address form beyond fixing field population and editability.

## 6. Design Considerations

- The blocking overlay should match the application's clean, flat, and modern design (using Brand colors as specified in `global.css`). No gradients.
- Clear and friendly instructions on the overlay helping the user locate their browser's "Site Settings" to unblock the location.

## 7. Technical Considerations

- The Geolocation API natively handles permissions, but once `denied`, calling `getCurrentPosition` will instantly fail without prompting the user. Therefore, the overlay must instruct the user to change their browser settings manually.
- You may use the `Permissions API` to listen for permission status changes so the overlay can automatically disappear if the user changes the setting to `granted`.

## 8. Success Metrics

- 100% of shipments created contain valid location data.
- Reduced drop-off or validation errors at the address entry stage due to missing street or city data.

## 9. Open Questions

- None.
