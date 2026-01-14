# PRD - Copy-to-Clipboard & Shipment Layout Alignment

## 1. Introduction / Overview
This document outlines the requirements for adding a subtle copy-to-clipboard feature for sensitive/important user data (Email, User ID, Tracking Numbers) and refining the layout of the "My Shipments" page to ensure consistent vertical alignment regardless of content length.

## 2. Goals
- Provide a consistent, reusable `CopyButton` component.
- Enhance UX by allowing easy copying of IDs and tokens.
- Fix layout shifts on the Shipments page using a fixed-width Flexbox approach.
- Maintain the project's minimalist and modern design aesthetic.

## 3. User Stories
- As a user, I want to easily copy my User ID or Email from my account page without manually selecting text.
- As a user, I want to copy tracking numbers from my shipment history with a single click.
- As a user, I want the shipment history list to look organized and aligned, even when some names or tracking numbers are long.

## 4. Features / Tasks

- **Reusable Component**:
    - CP01: Create a `<CopyButton />` component in `components/ui/`.
    - CP02: Implement subtle hover effect (low opacity to high opacity).
    - CP03: Add a tooltip ("Copy to clipboard").
    - CP04: Implement feedback logic (icon changes to checkmark temporarily on success).

- **Account Page Integration**:
    - AC01: Add `CopyButton` next to User ID in `ProfileCard`.
    - AC02: Add `CopyButton` next to Email in `ProfileCard`.

- **Shipments Page Integration**:
    - SH01: Add `CopyButton` next to Tracking Number in `ShipmentHistoryPage`.
    - SH02: Refactor shipment list row layout using Flexbox with fixed `flex-basis`.
    - SH03: Ensure all columns (Package Icon/Info, Carrier/Tracking, Status/Arrow) have allocated widths to prevent shifting.

- **Refinement**:
    - RF01: Ensure tooltips are styled according to the brand's minimalist aesthetic.
    - RF02: Verify responsiveness on mobile (hide/reposition buttons if necessary).

## 5. Non-Goals (Out of Scope)
- Adding copy buttons to all text elements in the app (only IDs, Emails, and Tracking codes).
- Changing the overall color scheme of the app.

## 6. Design Considerations
- **Copy Button**: Use `react-icons/fi` (FiCopy, FiCheck). Use `text-gray-400` as default, `text-brand-blue` or `text-gray-900` on hover.
- **Tooltip**: Small, dark background with white text, positioned above the button.
- **Shipments Layout**:
    - Column 1 (Info): `flex-grow` or fixed large width.
    - Column 2 (Carrier/Tracking): Fixed basis (e.g., `w-48` or `basis-48`).
    - Column 3 (Status): Fixed basis (e.g., `w-32` or `basis-32`).

## 7. Technical Considerations
- Use `navigator.clipboard.writeText` for copying.
- Use `framer-motion` or CSS transitions for the icon swap and tooltip animation if available, otherwise standard React state.
- Ensure the `CopyButton` doesn't trigger parent link clicks (use `e.stopPropagation()`).

## 8. Success Metrics
- Copy buttons are functional and provide visual feedback.
- Shipment list items are vertically aligned regardless of title length.
- No layout breakage on mobile devices.

## 9. Open Questions
- Should we use a global toast as well, or is the icon-swap sufficient? (User preferred icon-swap + tooltip).
