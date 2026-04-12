# Client Integration Guide — User App (v3.3.0)

> **Audience:** Frontend developers building the user-facing shipping application (React Native / React Web).
> **Scope:** PayU payment gateway selection, checkout flow, and payment verification.

---

## Table of Contents

1. [Payment Gateway Selection](#1-payment-gateway-selection)
2. [Checkout Flow (Create Shipment)](#2-checkout-flow)
3. [Payment Verification](#3-payment-verification)
4. [Continue Payment (Retry)](#4-continue-payment)
5. [UI Recommendations](#5-ui-recommendations)
6. [Error Handling](#6-error-handling)

---

## 1. Payment Gateway Selection

### What Changed

The `POST /api/shipments/create-shipment` endpoint now accepts a new optional field: **`preferredPaymentOption`**.

| Value      | Description                                               | Default |
| ---------- | --------------------------------------------------------- | ------- |
| `"stripe"` | Standard Stripe checkout (cards, Google Pay, Apple Pay)   | ✅ Yes  |
| `"payu"`   | PayU Poland checkout (BLIK, Polish bank transfers, cards) | No      |

### Where to Add the Selection UI

Add a payment method selector **before** the user confirms&pays. This should appear after the rate selection step and before calling `create-shipment`.

```
Rate Selection → Payment Method Selection → Confirm & Pay
```

### Example UI Component Logic

```javascript
// State
const [paymentMethod, setPaymentMethod] = useState("stripe"); // default

// Determine recommendation based on user's country
const userCountryCode = user?.countryCode || pickupAddress?.countryCode;
const isPolishUser = userCountryCode?.toUpperCase() === "PL";
const recommendedMethod = isPolishUser ? "payu" : "stripe";

// Options to display
const paymentOptions = [
  {
    id: "stripe",
    label: "Credit/Debit Card",
    description: "Visa, Mastercard, Google Pay, Apple Pay",
    recommended: !isPolishUser,
  },
  {
    id: "payu",
    label: "PayU",
    description: "BLIK, Polish bank transfers, cards",
    recommended: isPolishUser,
  },
];
```

> **Important:** The recommendation logic is purely a UI concern. The backend accepts either option from any user regardless of location.

---

## 2. Checkout Flow

### Request — `POST /api/shipments/create-shipment`

**Headers:**

```
Authorization: Bearer <auth_token>
Content-Type: application/json
```

**Body (new field highlighted):**

```json
{
  "carrierSlug": "fedex",
  "pickupAddress": { ... },
  "dropoffAddress": { ... },
  "package": { ... },
  "rate": {
    "serviceType": "FEDEX_INTERNATIONAL_PRIORITY",
    "serviceName": "FedEx International Priority",
    "carrierPrice": 120.50,
    "actualPrice": 145.00,
    "currency": "PLN"
  },
  "userCountryCode": "PL",
  "estimateId": "abc-123",
  "preferredPaymentOption": "payu"
}
```

### Response (201 Created)

```json
{
  "shipmentId": "clxyz-uuid-here",
  "checkoutUrl": "https://secure.payu.com/pay?orderId=...",
  "customTrackingNumber": "MLS-TRK-ABC123",
  "paymentGateway": "payu"
}
```

| Field                  | Type   | Description                                    |
| ---------------------- | ------ | ---------------------------------------------- |
| `shipmentId`           | string | Internal shipment ID                           |
| `checkoutUrl`          | string | **Redirect the user here** to complete payment |
| `customTrackingNumber` | string | MLS tracking number                            |
| `paymentGateway`       | string | Which gateway was used: `"stripe"` or `"payu"` |

### What to Do with the Response

1. **Store** `paymentGateway` in local state or AsyncStorage — you'll need it for verification.
2. **Redirect** or open `checkoutUrl`:

```javascript
const response = await api.post("/shipments/create-shipment", payload);
const { checkoutUrl, paymentGateway, shipmentId } = response.data;

// Store gateway for verification step
await AsyncStorage.setItem("lastPaymentGateway", paymentGateway);
await AsyncStorage.setItem("lastShipmentId", shipmentId);

// Redirect to checkout
if (Platform.OS === "web") {
  window.location.href = checkoutUrl;
} else {
  // React Native: open in WebBrowser or InAppBrowser
  const result = await WebBrowser.openBrowserAsync(checkoutUrl);
  // Handle result...
}
```

---

## 3. Payment Verification

After the user completes payment, the gateway redirects them back to your app. You **must** call the verify endpoint to confirm the payment and retrieve shipment details.

### Endpoint — `GET /api/payments/verify-payment`

### For Stripe Payments

The redirect URL contains a `session_id` query parameter:

```
https://yourapp.com/app/shipments/new/verify?session_id=cs_test_abc123
```

**Call:**

```
GET /api/payments/verify-payment?session_id=cs_test_abc123
```

### For PayU Payments

The redirect URL may contain the order details. You need to extract the `order_id`:

```
https://yourapp.com/app/shipments/new/verify?gateway=payu&order_id=ABCD1234
```

**Call:**

```
GET /api/payments/verify-payment?gateway=payu&order_id=ABCD1234
```

### Unified Response Shape

All responses return this structure regardless of gateway:

```json
{
  "status": "SUCCESS",
  "paymentStatus": "PAID",
  "shipmentStatus": "IN_TRANSIT",
  "trackingNumber": "MLS-TRK-ABC123",
  "labelUrl": "https://...",
  "paymentGateway": "payu"
}
```

| Field            | Type    | Values                               | Description                             |
| ---------------- | ------- | ------------------------------------ | --------------------------------------- |
| `status`         | string  | `SUCCESS`, `PENDING`, `FAILED`       | Overall verification result             |
| `paymentStatus`  | string  | `PAID`, `PENDING`, `COMPLETED`, etc. | Raw status from gateway                 |
| `shipmentStatus` | string  | `IN_TRANSIT`, `CREATED`, `FAILED`    | Current shipment state                  |
| `trackingNumber` | string? | —                                    | Available on SUCCESS                    |
| `labelUrl`       | string? | —                                    | Shipping label PDF URL (on SUCCESS)     |
| `message`        | string? | —                                    | Descriptive message (on PENDING/FAILED) |
| `paymentGateway` | string  | `stripe`, `payu`                     | Which gateway processed this            |

### Frontend Verification Logic

```javascript
async function verifyPayment(urlParams) {
  const sessionId = urlParams.get("session_id");
  const gateway = urlParams.get("gateway");
  const orderId = urlParams.get("order_id");

  let url = "/api/payments/verify-payment";

  if (gateway === "payu" || orderId) {
    url += `?gateway=payu&order_id=${orderId}`;
  } else if (sessionId) {
    url += `?session_id=${sessionId}`;
  }

  const response = await api.get(url);
  const result = response.data;

  switch (result.status) {
    case "SUCCESS":
      // Navigate to success screen
      navigation.navigate("ShipmentSuccess", {
        trackingNumber: result.trackingNumber,
        labelUrl: result.labelUrl,
      });
      break;

    case "PENDING":
      // PayU only: payment is still processing
      // Show a "processing" screen with a retry button
      showPendingScreen(result.message);
      break;

    case "FAILED":
      // Show error and offer retry
      showErrorScreen(result.message || "Payment failed. Please try again.");
      break;
  }
}
```

> **PayU-Specific:** Unlike Stripe, PayU can return `PENDING` status. This means the payment is being processed (e.g., BLIK confirmation pending). You should show a loading/waiting screen and optionally poll the verify endpoint every 3–5 seconds until you get `SUCCESS` or `FAILED`.

### Polling for PENDING (PayU Only)

```javascript
async function pollPayuPayment(orderId, maxAttempts = 10) {
  for (let i = 0; i < maxAttempts; i++) {
    const response = await api.get(
      `/api/payments/verify-payment?gateway=payu&order_id=${orderId}`,
    );

    if (response.data.status === "SUCCESS") {
      return response.data; // Payment complete
    }

    if (response.data.status === "FAILED") {
      throw new Error(response.data.message || "Payment failed");
    }

    // Still PENDING — wait 3 seconds and retry
    await new Promise((resolve) => setTimeout(resolve, 3000));
  }

  throw new Error("Payment verification timed out");
}
```

---

## 4. Continue Payment (Retry)

If a user's shipment is in `PENDING` or `FAILED` payment status and they want to retry, use:

### Endpoint — `POST /api/shipments/:shipmentId/pay`

**Headers:**

```
Authorization: Bearer <auth_token>
```

**Response (200):**

```json
{
  "shipmentId": "clxyz-uuid-here",
  "checkoutUrl": "https://checkout.stripe.com/..."
}
```

> **Note:** The continue-payment endpoint currently creates a new Stripe session. If the original payment was PayU, the retry will use Stripe. This is by design — retries always use Stripe as the reliable fallback.

---

## 5. UI Recommendations

### Payment Method Selector Design

```
┌─────────────────────────────────────┐
│  How would you like to pay?         │
│                                     │
│  ┌─ ● ─────────────────────────┐   │
│  │ 💳 Credit/Debit Card        │   │
│  │    Visa, Mastercard,        │   │
│  │    Google Pay, Apple Pay    │   │
│  │                  Recommended│   │  ← Show for non-PL users
│  └─────────────────────────────┘   │
│                                     │
│  ┌─ ○ ─────────────────────────┐   │
│  │ 🏦 PayU                     │   │
│  │    BLIK, Bank transfer,     │   │
│  │    Polish cards             │   │
│  │                  Recommended│   │  ← Show for PL users
│  └─────────────────────────────┘   │
│                                     │
│  [ Continue to Payment ]            │
└─────────────────────────────────────┘
```

### Key UX Considerations

1. **Pre-select** the recommended option based on country code, but always let the user change it.
2. **PayU logo**: Use the official PayU logo from their brand assets for recognition.
3. **PENDING state**: PayU payments (especially BLIK) may take a few seconds. Show an animated loading indicator with "Confirming your payment..." text.
4. **Fallback**: If the backend returns a Stripe `checkoutUrl` even when the user selected PayU (because PayU is not configured), handle it gracefully — the user still gets to pay, just via a different gateway.

---

## 6. Error Handling

### Possible Errors During Checkout

| Error                     | Status | Scenario                          | User Action        |
| ------------------------- | ------ | --------------------------------- | ------------------ |
| `Validation Error`        | 400    | Missing/invalid fields in payload | Fix form fields    |
| `Price Mismatch`          | 400    | Rate changed since estimate       | Re-fetch estimates |
| `Authentication required` | 401    | Token expired                     | Re-login           |
| `Account Restricted`      | 403    | User is banned                    | Contact support    |

### Possible Verification Errors

| Error                 | Status | Scenario                     | User Action        |
| --------------------- | ------ | ---------------------------- | ------------------ |
| `Missing session_id`  | 400    | Stripe: No session_id in URL | Re-enter checkout  |
| `Missing order_id`    | 400    | PayU: No order_id in URL     | Re-enter checkout  |
| `Not Found`           | 404    | Payment record missing       | Contact support    |
| `Verification Failed` | 500    | Gateway API error            | Retry verification |

---

## Quick Reference — API Endpoints (User)

| Method | Path                             | Auth   | Description                         |
| ------ | -------------------------------- | ------ | ----------------------------------- |
| POST   | `/api/shipments/create-shipment` | Bearer | Create shipment + initiate checkout |
| GET    | `/api/payments/verify-payment`   | None   | Verify payment after redirect       |
| POST   | `/api/shipments/:id/pay`         | Bearer | Retry payment for existing shipment |
