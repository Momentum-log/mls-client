# PRD: Tracking Page Fixes & Enhancements

## 1. Overview

The current tracking page (`/track`) has issues with data display, search logic, and visual hierarchy. This update aims to strictly enforce usage of **Custom Tracking Numbers** (e.g., `MLS-TRK-...`), improve the shipment summary with specific details, and refine the timeline visualization with proper "FedEx" -> "MLS" name transformation.

## 2. Goals

- **Search Logic**: Enforce Custom Tracking Number as the primary identifier in URL and API calls.
- **Summary Display**: Show rich, specific shipment details (Recipient, Address, Contents, Dates).
- **Timeline Visuals**: Improve hierarchy for Status vs Description and apply "First + Last 2" truncation logic.
- **Data Transformation**: Ensure all "FedEx" mentions are replaced with "MLS" in the UI.

## 3. Features & Requirements

### 3.1 Search & URL Logic

- **Input**: The search bar should focus on **Custom Tracking Numbers** (`MLS-TRK-...`).
- **URL**: The URL must reflect the custom tracking number: `/track/MLS-TRK-XXXX`.
- **API Strategy**:
  - Use the custom tracking number to query the tracking endpoint.
  - Do **NOT** use internal UUIDs (`03bf...`) in the browser URL bar.

### 3.2 Shipment Summary Display

The summary section (top card) must display the following fields from the `shipment` object:

1.  **Custom Tracking Number**: Display prominently (e.g., `MLS-TRK-4AAEA989618B`).
2.  **Recipient Information** (Label: "Drop-off Information"):
    - **Drop-off Address**: `dropoffAddress` (e.g., `streetLines`, `city`, `stateOrProvinceCode`, `countryCode`).
    - **Note**: Ensure address is formatted logically.
3.  **Shipment Content**: Display `customs.contentsDescription` as the **Title** or prominent header.
4.  **Dates**: Display `createdAt` or `lastUpdate` as relevant.
5.  **Status**: Current status + "Last Updated" date.

### 3.3 Timeline Visualization

- **Truncation Logic**:
  - Show **Latest Two Events** (Indices 0 & 1).
  - Show **Earliest Event** (Index 15/Last).
  - **Middle**: "See full shipment information" button (if total > 3).
    - Action: Navigate to Shipment Details Page (`/shipments/MLS-TRK-...`).
- **Visual Hierarchy**:
  - **Status**: **Bold**, Primary Color (Dark).
  - **Description**: Lightweight, Gray/Faint color. Distinct from status.
  - **Location**: If undefined, show "Location could not be determined".
- **Date/Time**: Ensure proper formatting.

### 3.4 Name Transformation (Data Cleaning)

- **Requirement**: "FedEx" must **NEVER** appear in the UI.
- **Transformation Logic**: Apply `transformShippingData` or equivalent logic from `app/(marketing)/shipping-estimate/utils.ts`.
  - `FedEx` -> `MLS`
  - `International First` -> `First Class`
  - etc.
- **Scope**: Apply this to **Status**, **Description**, **Service Names**, and any other visible text.

## 4. Technical Implementation Tasks

### Client-Side

- [ ] **Data Utility**: Port or import `deepClean` / `transformShippingData` to be usable in the Tracking Page.
- [ ] **Track Page (`page.tsx`)**:
  - Update `handleTrack` to push Custom Tracking Number to URL.
  - Refactor **Summary Card** to show the 4 required fields.
  - Refactor **Timeline** mapping to apply:
    1.  Name Transformation (Clean Data).
    2.  Truncation (First + Last 2).
    3.  Visual Styles (Bold Status, Light Description).

### API Interactions

- Ensure `trackShipment(id)` can handle the Custom Tracking Number or that the frontend handles the lookup correctly if the backend is strict. (Assuming backend supports it or returns it in the payload).

## 5. Success Metrics

- URL is always `/track/MLS-TRK...`.
- No "FedEx" text visible on the page.
- Summary clearly shows "To: [Name], [Address]" and "Contents: [Description]".
- Timeline shows Top 2 + Bottom 1 + "See full info" button.
- "See full info" button navigates to detail page with Custom Tracking Number ID.
