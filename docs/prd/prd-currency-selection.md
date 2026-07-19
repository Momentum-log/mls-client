# PRD - Client-Side Currency Selection and Persistence

## 1. Introduction / Overview

In Momentum Logistics Service (MLS), users need the ability to obtain shipping estimates and complete checkouts in their preferred currency (either Polish Złoty - PLN, or Euros - EUR). Currently, the application resolves the currency based on detected browser country codes. However, users should have explicit control to switch the currency directly from the Service Selection interface.

This feature introduces a persistent, user-controlled currency switcher in the Service Selection view of the new shipment creation page. The selected currency preference is saved to local storage, ensuring that returning users see checkout rates in their preferred currency. Changing the currency will dynamically trigger a re-fetch of rates from the backend.

---

## 2. Goals

- Provide a clear, intuitive currency switcher (PLN / EUR) directly on the Service Selection card.
- Persist the user's currency preference locally on the device (using `localStorage` via Zustand store persistence).
- Support optional root-level `currency` field overrides in both the Shipping Estimate (`POST /shipments/estimate`) and Create Shipment (`POST /shipments`) payloads.
- Dynamically refresh rates via API calls when the currency is changed in the Service Selection state.

---

## 3. User Stories

- **As a customer,** I want to view my shipping estimates in my preferred currency (EUR or PLN) so that I understand exactly how much I am being charged.
- **As a customer,** I want to switch between EUR and PLN on the fly when comparing carrier rates so that I can decide which payment currency is more convenient for me.
- **As a returning customer,** I want my currency selection to be remembered on my device so that I don't have to switch it manually every time I create a shipment.

---

## 4. Features / Tasks

### Currency Switcher (CS)

- **Zustand & Persistence Integration**:
  - CS01: Update `useCountryStore` to persist using `localStorage` (via `createJSONStorage(() => localStorage)`) rather than `sessionStorage`.
  - CS02: Configure `useCountryStore` default currency to fallback to `EUR` when no preference is saved.

- **API Integration**:
  - CS03: Include the active `currency` in the estimate payload constructed by `getEstimatePayload` and sent to `POST /shipments/estimate`.
  - CS04: Include the active `currency` in the shipment creation payload sent to `POST /shipments` to enforce the user's chosen currency for the checkout transaction.

- **UI & Interaction**:
  - CS05: Design and implement a flat, minimalist currency toggle switcher (EUR / PLN) in the header of the Service Selection card, aligned to the right.
  - CS06: Bind the switcher to `useCountryStore`'s setter so that toggling the currency updates the store, persists the value to `localStorage`, and triggers a new estimate API call.
  - CS07: Ensure the Service Selection list and selected rates are formatted correctly and displayed in the newly retrieved currency.

---

## 5. Non-Goals (Out of Scope)

- Displaying the currency switcher in other places such as the Summary Drawer or the Address forms.
- Adding additional currencies beyond PLN and EUR.
- Support for server-side persistence of user currency preference (entirely client-side).

---

## 6. Design Considerations

- **Design Style**: Flat, minimalist, modern. No gradients.
- **Placement**: Placed at the top right of the Service Selection container header.
- **Visuals**: A tab-style or pill toggle button with distinct, high-contrast states using theme colors (e.g., `bg-brand-blue` / `text-white` for active, and standard neutral styles for inactive).
- **Responsiveness**: Ensure the switcher adjusts cleanly on mobile viewport sizes without overlapping the card title.

---

## 7. Technical Considerations

- The backend expects the optional root-level `currency` field in both `POST /shipments/estimate` and `POST /shipments`.
- The `useCountryStore` store (defined in `store/country-store.ts`) currently uses `sessionStorage`. Changing this to `localStorage` will automatically persist other detected values (like `countryCode` and `isManualOverride`), which is acceptable and desired.
- When the active currency is changed, `lastFetchedEstimateSignatureRef.current` must be invalidated or updated so that the `useEffect` hook in the New Shipment page successfully triggers a re-fetch of rates.

---

## 8. Success Metrics

- 100% of user-initiated currency changes successfully re-fetch rates in the target currency.
- 100% of shipments created after switching currency use the chosen currency in the payload.
- Returning users have their preferred currency correctly loaded from `localStorage` on subsequent visits.
