# PRD: Unique Phone Number Input with Country Code Dropdown

## 1. Introduction / Overview

This feature introduces a universal `PhoneInput` component for the Momentum Logistics Service (MLS). It aims to standardize phone number entry across the application by providing a searchable country code dropdown with flags and enforcing validation rules to ensure data consistency, particularly matching phone codes with selected shipment countries.

## 2. Goals

- Standardize phone number input with a pre-selected country code.
- Enhance UX by displaying country flags and codes.
- Ensure data integrity by validating that the phone's country matches the address's country in shipment forms.
- Provide a searchable dropdown for easier country selection.

## 3. User Stories

- As a user creating a shipment, I want to select my country from a flag dropdown so that I don't have to manually type the country code.
- As a designer, I want the phone input to look modern and minimalist, consistent with the project's flat design philosophy.
- As a system administrator, I want to ensure that the phone number provided is valid for the country selected in the shipment details.

## 4. Features / Tasks

### Phone Input Component (PI)

- PI01: Install `react-phone-input-2` dependency.
- PI02: Build the `PhoneInput` component with a searchable flag dropdown.
- PI03: Apply project-wide styling (solid colors, flat design, high contrast) using existing CSS variables.
- PI04: Ensure the component works as a controlled input within Formik.

### Shipment Page Integration (SI)

- SI01: Replace standard phone `Input` with the new `PhoneInput` in `AddressForm`.
- SI02: Implement validation logic in `AddressForm` to check if `phone` country code matches the `country` field.
- SI03: Display a clear error message if the phone code doesn't match the selected country.

### Validation Rules (VR)

- VR01: Add a custom Zod validation rule for country match.
- VR02: Ensure phone number is valid according to international standards (optional/lite).

## 5. Non-Goals (Out of Scope)

- Automatic phone number formatting based on length (handled by library default).
- Integration with SMS verification services in this phase.
- Auto-correcting the phone code when country changes (user requested pure validation instead).

## 6. Design Considerations

- **Style**: Minimalist, flat design.
- **Colors**: Use `bg-brand-blue`, `text-brand-yellow`, `bg-background-color`, `text-text-color`.
- **Icons**: Use flags provided by `react-phone-input-2`.
- **Search**: The dropdown must be searchable for quick country lookup.

## 7. Technical Considerations

- Use `react-phone-input-2` for core functionality.
- Integrate with `Formik` and `Zod` as per existing project standards.
- Ensure compatibility with `global.css` variables.

## 8. Success Metrics

- 100% usage of the new `PhoneInput` for phone fields in the shipment flow.
- Reduced data mismatch between phone country and address country.

## 9. Open Questions

- None at this stage.
