# PRD: Quick Shipment Redesign (Single-Page Stacked Layout)

## 1. Introduction / Overview

The goal is to redesign the Quick Shipment creation flow from a multi-page step-by-step process into a single-page, vertically stacked layout. This improves user experience by providing a consolidated view of the shipment progress and reducing page loads.

## 2. Goals

- Convert multi-page navigation to a single-page vertical scroll experience.
- Implement a vertical timeline on the left for navigation and progress tracking.
- Enhance UI consistency using "Get a Quote" design patterns (custom inputs, double-fitting selectors).
- Update terminology: "Origin" -> "Pick-up Details", "Destination" -> "Drop-off Details".
- Implement conditional loading: steps load sequentially as previous ones are validated.
- Ensure data persistence while on the page, but clear data on successful creation or navigation away.

## 3. User Stories

- As a user, I want to see all my shipment details in one place so I can review my progress easily.
- As a user, I want the UI to guide me top-to-bottom so I don't feel overwhelmed.
- As a user, I want my data to be saved as I type, but cleared once I'm done or if I leave, to keep the form fresh.

## 4. Features / Tasks

### UI/UX Foundation (UF)

- UF01: Create a new single-page container and layout for `/app/shipments/new`.
- UF02: Implement a vertical timeline component on the left side.
- UF03: Implement sticky headers for sections on mobile (replacing the timeline).
- UF04: Implement "Pick-up Details" (formerly Origin) section with custom inputs.
- UF05: Implement "Drop-off Details" (formerly Destination) section with custom inputs.
- UF06: Implement "Package Details" section using "Get a Quote" style selectors.
- UF07: Implement "Service Selection" and "Summary/Verify" sections.

### Logic & State (LS)

- LS01: Refactor `useShipmentStore` to handle single-page validation and visibility.
- LS02: Implement sequential loading: next section loads only when current section is valid.
- LS03: Add "Manual Toggle" to allow users to collapse/expand completed sections (summarized view).
- LS04: Implement "Read-only" mode for completed steps with a checkmark in the timeline.
- LS05: Update persistence logic: clear store on successful creation or when component unmounts (leaving the page).

### Components (CP)

- CP01: Port "Double-fitting" select fields and dropdowns from `shipping-estimate/page.tsx`.
- CP02: Ensure consistent border-radius, colors (CSS variables), and typography across all fields.

## 5. Non-Goals (Out of Scope)

- Implementing new backend API endpoints (use existing ones).
- Redesigning the Dashboard or My Shipments pages.

## 6. Design Considerations

- **Timeline**: Thin vertical line with circle indicators. Completed steps show a checkmark.
- **Section Transitions**: Smooth scroll to the next section when it loads.
- **Form Fields**: High contrast, following `global.css` variables.
- **Mobile**: Timeline hidden; current section header sticks to the top.

## 7. Technical Considerations

- Use Framer Motion or simple CSS transitions for section loading/unfolding.
- Ensure Formik or React Hook Form integration for validation across the stack.

## 8. Success Metrics

- Reduction in "drop-off" during shipment creation.
- Improved user feedback on the "Pick-up/Drop-off" clarity.

## 9. Open Questions

- Should there be a "Back" button, or does the user just scroll up to edit? (A: Manual toggle/Scroll up)
