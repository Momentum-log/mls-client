# PRD: Dashboard Stats & Recent Shipments

## 1. Introduction / Overview

This feature aims to enhance the user dashboard by providing a quick overview of shipment activities and expenses. It introduces a statistics section displaying the count of active and completed shipments, along with total spending. Additionally, it improves the "Recent Shipments" section to display a responsive list of the most recent shipments.

**Goal:** Provide users with immediate visibility into their shipping activity and financial summary without needing to navigate deep into history.

## 2. Goals

- **Performance:** Efficiently calculate statistics on the frontend using existing data to avoid new backend overhead.
- **Visibility:** Show "Total Spent" for both the current month and lifetime.
- **Tracking:** Clearly differentiate between "Active" and "Completed" shipments.
- **Responsiveness:** Ensure the "Recent Shipments" list adapts its length based on the screen size.

## 3. User Stories

- **US01:** As a user, I want to see how many shipments are currently in transit ("Active") so I can track pending deliveries.
- **US02:** As a user, I want to see the total amount I have spent on shipping this month to manage my budget.
- **US03:** As a user, I want to see my lifetime total spend to understand my overall usage.
- **US04:** As a user, I want to see a count of my successfully delivered packages ("Completed") for historical reference.
- **US05:** As a user, I want to see a list of my most recent shipments directly on the dashboard to quickly check their status.

## 4. Features / Tasks

### **Frontend Implementation (FE)**

- **FE01:** Create `useShipmentStats` Hook
  - Fetch all shipments using the new `GET /shipments/get-shipment-history` endpoint.
  - Implement calculation logic:
    - **Active Count:** Count shipments where status is NOT `DELIVERED` or `CANCELLED`.
    - **Completed Count:** Count shipments where status is `DELIVERED`.
    - **Total Spent (Lifetime):** Sum `actualPrice` of all non-cancelled, paid shipments.
    - **Total Spent (This Month):** Sum `actualPrice` of non-cancelled, paid shipments created in the current month.
- **FE02:** Implement Stats UI Component
  - Design 3 cards/widgets:
    1.  **Active Shipments**: Big number count.
    2.  **Completed Shipments**: Big number count.
    3.  **Total Spent**: Display "This Month" value primarily, with "Lifetime" value in smaller text or labelled clearly.
- **FE03:** Implement Responsive Recent Shipments List
  - Fetch all shipments (re-use data from `useShipmentStats` if possible to minimize requests).
  - Sort by `createdAt` (descending).
  - Determine display count based on breakpoint (e.g., 5 for Mobile, 8 for Tablet, 10 for Desktop).
  - Render the list items with Status, ID, Date, and Label link.

### **Integration (IN)**

- **IN01:** Integrate Stats Component into Dashboard Page.
- **IN02:** Replace/Update existing "Recent Shipments" section with the new responsive component.

## 5. Non-Goals (Out of Scope)

- **Backend Aggregation:** We will NOT implement new backend endpoints for stats aggregation in this iteration (User decision 1B).
- **Date Range Picker:** Users cannot select custom date ranges for stats at this time (scope limited to Month/Lifetime).

## 6. Success Metrics

- **Dashboard Load Time:** Should not increase significantly despite fetching full shipment history (monitor for users with < 100 shipments).
- **User Engagement:** Increased clicks on "Recent Shipments" items.
- **Clarity:** Users can distinguish between "Active" and "Completed" without confusion.

## 7. Open Questions

- None. (Clarified: Frontend calculation selected, Active = !DELIVERED/!CANCELLED, Variable recent items).
