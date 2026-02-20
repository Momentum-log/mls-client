## Relevant Files

- `store/country-store.ts` - Contains the IP-based location logic to remove.
- `hooks/useLocationPermission.ts` - Hook to check location permission status.
- `components/ui/LocationPermissionOverlay.tsx` - The blocking UI overlay.
- `components/forms/AddressForm.tsx` (or whichever file handles Places Autocomplete) - Where the Autocomplete logic needs fixing.

## Instructions for Completing Tasks

**IMPORTANT:** As you complete each task, you must check it off in this markdown file by changing `- [ ]` to `- [x]`. This helps track progress and ensures you don't skip any steps.

Example:

- `- [ ] <PREFIX>00: <Parent Task Title>` → `- [x] <PREFIX>00: <Parent Task Title>` (after completing)

Update the file after completing each sub-task, not just after completing an entire parent task.

## Tasks

### Location Permission Enforcement

- [ ] LO00: Implement Location Permission Check & Blocking Overlay UI
  - [ ] LO01: Create a React hook (e.g., `useLocationPermission.ts`) to query and request geolocation permission, returning the current permission state (`granted`, `denied`, or `prompt`).
  - [ ] LO02: Build the `LocationPermissionOverlay` component (using Tailwind and brand colors) to show a full-screen block when permission is denied, instructing the user on how to allow it.
  - [ ] LO03: Integrate the permission check into the global layout (or main entry point) so it prompts for location upon opening the site, and blocks the view if denied.

### Storage & Code Cleanup

- [ ] CC00: Remove IP-based location fallback logic
  - [ ] CC01: Open `store/country-store.ts`.
  - [ ] CC02: Delete the IP fallback block (`if (ipInfo?.country_code) { ... } else { ... }`) around lines 124-136, as exact device location is now mandatory.

### Address Autocomplete Fixes

- [ ] AD00: Implement Autocomplete Fallback & Ensure Field Editability
  - [ ] AD01: Locate where the Google Places Autocomplete data is processed (e.g., in an Address form component).
  - [ ] AD02: Update the logic so that if the structured data (`address_components`) misses the street line or city, it extracts them from the comma-separated `formatted_address` string instead.
  - [ ] AD03: Verify and ensure that after autocomplete populates the fields, those fields remain fully editable by the user without any restrictions.
