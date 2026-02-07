# Product Requirements Document: Country-Based Multi-Currency Support

## 1. Introduction / Overview

Currently, the system defaults to Polish Złoty (PLN) for all transactions. The goal of this feature is to introduce dynamic currency handling based on the user's location.

- **Poland (PL)**: Users located in Poland will continue to see and pay in **PLN**.
- **Rest of the World**: Users located anywhere else will see and pay in **EUR**.

This logic applies to **Shipping Estimates**, **Shipment Creation**, and **Stripe Checkout**.

## 2. Goals

1.  **Dynamic Currency Display**: Show prices in PLN for users in Poland and EUR for everyone else.
2.  **Accurate Conversion**: Real-time currency conversion from carrier estimates (which might be in USD, PLN, etc.) to the target currency (PLN/EUR).
3.  **Seamless Checkout**: Ensure Stripe Checkout sessions are initialized with the correct currency.
4.  **Backend Verification**: Prevent price manipulation by verifying that the submitted price in the target currency matches the server-side calculated price.

## 3. User Stories

- **US01 (User in Poland)**: As a user with an IP address/location in Poland, I want to see shipping estimates in **PLN** so that I can pay in my local currency.
- **US02 (User in Europe/Global)**: As a user in Germany (or any non-PL country), I want to see shipping estimates in **EUR** so that I can pay in a widely accepted currency.
- **US03 (Mixed Location/Origin)**: As a user physically located in Poland but creating a shipment from Germany to France, I still want to pay in **PLN** because I am the paying customer located in Poland.

## 4. Features / Tasks

### Currency Conversion Service

- **CC01**: Integrate `@everapi/freecurrencyapi-js`.
- **CC02**: Create a helper service `CurrencyService` to fetch exchange rates.
  - _Methods_: `convert(amount, fromCurrency, toCurrency)`.

### API Updates

- **API01**: Update `POST /shipments/estimate` request schema.
  - Add optional field: `userCountryCode` (string, 2 chars, ISO 3166-1 alpha-2).
- **API02**: Update `POST /shipments` request schema.
  - Add optional field: `userCountryCode` (string, 2 chars).

### Shipping Logic (Estimates)

- **SL01**: Update `getShippingEstimate` controller.
  - Determine `TargetCurrency`:
    - If `userCountryCode` == 'PL' → `PLN`.
    - Else → `EUR`.
  - Fetch rates from Carrier (e.g., FedEx returns USD).
  - Convert `carrierPrice` and `actualPrice` to `TargetCurrency` using `CurrencyService`.
  - Return the estimate with the new currency and converted amounts.

### Shipment Creation (Verification)

- **SL02**: Update `createShipment` controller.
  - Recalculate the expected price implementation:
    - Determine `TargetCurrency` based on `userCountryCode`.
    - Fetch/Calculate base price (from carrier or cache).
    - Convert to `TargetCurrency`.
  - Compare calculated price vs. payload `actualPrice`.
  - Allow a small margin of error (e.g., 0.5%) due to floating-point/conversion timing differences.
  - Store the `TargetCurrency` in the `Shipment` database record.

### Stripe Integration

- **ST01**: Ensure `stripeAdapter.createCheckoutSession` utilizes the dynamic currency passed to it, rather than hardcoded 'PLN'.

## 5. Non-Goals

- **Historical Rates**: We do not need to store historical exchange rates for this iteration.
- **Crypto Payments**: Not supported.
- **User Preference Override**: The currency is strictly determined by location (Payload), not user settings.

## 6. Design & Technical Considerations

### Currency API

- **Provider**: `freecurrencyapi.com`
- **Library**: `@everapi/freecurrencyapi-js`
- **Rate Limiting**: Be mindful of API quotas (free tier).
- **Recommendation**: Implement a simple in-memory cache (e.g., for 1 hour) for exchange rates to avoid hitting the API on every single request.

### Logic Flow

1. **Frontend** detects User Country (e.g., via IP or manual selector state).
2. **Frontend** sends `userCountryCode` to backend.
3. **Backend** decides currency (PL vs !PL).
4. **Backend** converts Carrier Rate (USD/PLN) -> Target Rate (EUR/PLN) (only when the selected currency failed and it is not PLN or EUR).

### "Mixed" Scenario

- The **Paying User's Location** (`userCountryCode`) dictates the currency, NOT the shipment origin/destination.

## 7. Success Metrics

- 100% of shipments created by users in Poland are in PLN.
- 100% of shipments created by users outside Poland are in EUR.
- Stripe sessions successfully created with non-PLN currencies.

## 8. Open Questions

- None. (Clarified: Mixed usage scenario favors User Location).
