# PRD: Tracking Feature Improvement

## 1. Introduction / Overview
This feature aims to revamp the shipment tracking experience for Momentum Logistics Service (MLS). The goal is to provide a user-friendly, secure, and informative tracking interface that separates static shipment details from real-time tracking events. It involves updates to the public tracking page and the authenticated shipment details page.

## 2. Goals
- **Improve User Experience**: Provide clear, concise tracking summaries and detailed views where appropriate.
- **Secure Tracking Data**: Ensure the internal carrier tracking number is hidden from the user, exposing only the custom MLS tracking number.
- **Performance**: Optimize data loading by separating static shipment data (DB) from real-time tracking data (Carrier API).
- **Clarity**: Implement specific timeline visualization rules (minimal vs. full) to avoid information overload.

## 3. User Stories
- **US01**: As a user, I want to track a package using my MLS Tracking ID so I can see its current status without logging in (or while logged in on the track page).
- **US02**: As a user, I want to see a summarized timeline on the tracking page (First event + Last 2 events) to quickly grasp the progress.
- **US03**: As a logged-in user, I want to view full shipment details (addresses, package info) on a dedicated page.
- **US04**: As a logged-in user viewing detailed shipment info, I want to see the *complete* tracking timeline in reverse chronological order (newest first).

## 4. Features / Tasks

### Frontend - Tracking Page (`FE`)
- **FE01**: Update [app/app/track/page.tsx](file:///Users/adedotungabriel/work/me/mls/mls-client/app/app/track/page.tsx) to use the **Minimal Timeline** logic.
    - **Logic**: Display ONLY the *First* event (Shipment Created/Picked up) and the *Last 2* events (most recent).
    - **Gap Indication**: Visually indicate skipped events (e.g., dotted line or "..." between first and last 2).
    - **Ordering**: Reverse Chronological (Newest at top).
    - **Summary**: Ensure the header summary (Status, estimated delivery) remains prominent.

### Frontend - Shipment Details Page (`FE`)
- **FE02**: Update [app/app/shipments/[id]/page.tsx](file:///Users/adedotungabriel/work/me/mls/mls-client/app/app/shipments/%5Bid%5D/page.tsx) to fetch and display **Full Shipment Data**.
    - **Data Source**: Call a backend endpoint (e.g., `GET /shipments/:id`) to get static DB data (Origin, Destination, Package Specs).
    - **Display**: Show Pickup/Dropoff addresses, Package dimensions/weight, and Service type.
- **FE03**: Integrate **Full Real-Time Timeline**.
    - **Data Source**: Call [trackShipment(trackingNumber)](file:///Users/adedotungabriel/work/me/mls/mls-client/api/shipments/index.ts#27-37) to get live events.
    - **Ordering**: Reverse Chronological (Newest at top).
    - **Display**: Show ALL events returned by the carrier.

### Backend - API (`BE`)
- **BE01**: Verify/Implement `GET /shipments/:id` endpoint.
    - Ensure it returns full shipment details (addresses, package info) from the database.
    - *Note*: [api/shipments/index.ts](file:///Users/adedotungabriel/work/me/mls/mls-client/api/shipments/index.ts) currently lacks this specific function.
- **BE02**: Verify `GET /shipments/track-shipment/:trackingNumber` endpoint.
    - Ensure it returns the live tracking object from the carrier.
    - Ensure internal `carrierTrackingNumber` is NOT exposed in the response if possible, or filtered on frontend.

### Data & Logic (`DL`)
- **DL01**: **Timeline Formatting**:
    - Use `date-fns` (or existing utils) to format dates (e.g., "15 Jan, 10:30 AM").
    - Status Strings: Ensure clean, user-friendly status messages (map technical statuses if needed).
- **DL02**: **Access Control**:
    - [track/page.tsx](file:///Users/adedotungabriel/work/me/mls/mls-client/app/app/track/page.tsx): Authenticated (per user request 2A).
    - `shipments/[id]/page.tsx`: Authenticated (Owner only).

## 5. Non-Goals
- **Public Tracking**: The tracking page will NOT be public; it requires login.
- **Carrier Switching**: This feature does not involve changing carriers, only displaying existing data.

## 6. Design considerations
- **Minimal Timeline**: 
    - [Newest Event]
    - [2nd Newest Event]
    - ... (vertical dotted line) ...
    - [First Event]
- **Full Timeline**: Standard vertical list, newest at top.

## 7. Success Metrics
- Users can successfully track shipments using MLS IDs.
- Shipment details page loads static data instantly, with tracking timeline loading asynchronously.
- No "undefined" or raw data leaks (e.g., raw carrier IDs) in the UI.

## 8. Open Questions
- None. (Clarified: Timeline order = Reverse Chronological, Access = Auth).
