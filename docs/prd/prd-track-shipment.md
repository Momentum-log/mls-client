# PRD: Track Shipment Page

## 1. Introduction / Overview

The Track Shipment page provides logged-in users with a dedicated interface to check the real-time status of their shipments using internal MLS Tracking IDs. This page aims to improve transparency and reduce support queries by giving users direct access to their shipment's full timeline.

## 2. Goals

- Provide a simple, centralized location for tracking.
- Enhance the empty state with user context (recent shipments).
- Display a comprehensive timeline of shipment events based on API data.
- Ensure the feature is only accessible to authenticated users.

## 3. User Stories

- **As a customer**, I want to enter my MLS Tracking ID to see where my package is right now.
- **As a customer**, I want to see a history of events for my shipment so I can understand any delays.
- **As a customer**, I want to see my recent shipments when I open the tracking page so I don't have to look for IDs manually.

## 4. Features / Tasks

### Track Shipment UI (TS)

- **TS01**: Create the page layout at `/app/app/track/page.tsx`.
- **TS02**: Implement a minimalist tracking form:
  - Input field for MLS Tracking ID (UUID format).
  - "Track Shipment" button (Solid brand blue).
- **TS03**: Implement "Empty State" (before search):
  - Centered icon and instructional text.
  - "Recent Shipments" section showing 3-5 latest items from user history.
- **TS04**: Implement "Loading State":
  - Tailwind pulse skeleton for the timeline and status card.
- **TS05**: Implement "Display Area" (after successful search):
  - Current status card (Large status label, carrier name).
  - Detailed shipment timeline (Vertical list of events with timestamps).
  - Empty state fallback if no events are found.
- **TS06**: Implement "Error handling":
  - Feedback for "Shipment not found" or "Unauthorized" (tracking IDs not owned by the user).

### Integration (IN)

- **IN01**: Connect the form to the `trackShipment` API utility.
- **IN02**: Fetch user shipment history to populate the empty state using `getShipmentHistory`.
- **IN03**: Handle API errors and display appropriate toast notifications or inline messages.

## 5. Non-Goals (Out of Scope)

- Tracking for non-MLS numbers (external carrier numbers only).
- Tracking without logging in (page will be protected by auth).
- Editing shipment details from the track page.

## 6. Design Considerations

- **Theme**: Flat, minimalist, modern.
- **Colors**: `bg-brand-blue` for primary buttons, `text-brand-blue` for status highlights.
- **Spacing**: Use `Container` components for consistent padding.
- **Icons**: Use `react-icons/fi` (FiPackage, FiTruck, FiMapPin, etc.).

## 7. Technical Considerations

- Use existing `apiClient` for requests.
- Protect the route using the existing auth middleware/sidebar logic.
- Ensure the `trackingNumber` input is validated (basic length/format check).

## 8. Success Metrics

- 100% of tracked shipments display correct status information.
- Users can track their own shipments successfully via internal IDs.
- "Recent Shipments" successfully drives repeat tracking actions.

## 9. Open Questions

- _None at this stage following user clarification._
