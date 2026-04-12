# Client-Side Implementation Guide: Shipping Quotes & Estimates

This document details the new architectural split for fetching shipping prices. The robust backend design exposes two distinct endpoints tailored to different stages of the user's shipment journey.

## Quick Overview

| Feature                   | `POST /api/shipments/get-shipping-quote`             | `POST /api/shipments/get-shipping-estimate`     |
| ------------------------- | ---------------------------------------------------- | ----------------------------------------------- |
| **Purpose**               | Landing pages, calculators, quick pre-checks         | Checkout, shipment creation wizard              |
| **Data Requirements**     | **Minimal / Lightweight**. Bypass customs questions. | **Strict**. Requires full customs data.         |
| **International Routing** | Uses automatically generated fallback data.          | Validates and verifies exact HS/Customs values. |

---

## 1. Get Shipping Quote (Lightweight)

**Endpoint:** `POST /api/shipments/get-shipping-quote`
**Auth:** Optional (Guest compatible)

This endpoint is heavily optimized for speed and simplicity. It is designed to ask the user "as few questions as possible". It **safely ignores** missing contact names or customs declarations for international shipments and instead injects dummy data internally on the server so carriers return prices.

### TypeScript Interfaces

```typescript
export interface ShippingQuotePayload {
  pickup: {
    countryCode: string; // e.g., "PL", "US"
    postalCode: string;
    city: string;
    streetLines: string[]; // At least 1 item
    stateOrProvinceCode?: string;
    residential: boolean; // True if it's a home address
    // 'contact' block is fully ignored here.
  };
  dropoff: {
    countryCode: string;
    postalCode: string;
    city: string;
    streetLines: string[];
    stateOrProvinceCode?: string;
    residential: boolean;
  };
  package: {
    weight: {
      value: number;
      units: "KG" | "LB";
    };
    dimensions?: {
      length: number;
      width: number;
      height: number;
      units: "CM" | "IN";
    };
  };
  guestId?: string; // Essential for anonymous user tracking
  userCountryCode?: string; // 2 Letters, used to determine display Currency (PLN vs EUR)
  email?: string; // Required if Guest
  phone?: string; // Required if Guest
}
```

### JSON Example

```json
{
  "pickup": {
    "countryCode": "PL",
    "stateOrProvinceCode": "LD",
    "city": "Łódź",
    "postalCode": "63-940",
    "streetLines": ["ul. Ks. Pilawskiego"],
    "residential": false
  },
  "dropoff": {
    "countryCode": "US",
    "stateOrProvinceCode": "CT",
    "city": "West Haven",
    "postalCode": "06516",
    "streetLines": ["127 Canton Street"],
    "residential": false
  },
  "package": {
    "weight": { "value": 3, "units": "KG" },
    "dimensions": { "length": 45, "width": 35, "height": 10, "units": "CM" }
  },
  "guestId": "mls_guest_8b4...",
  "userCountryCode": "NG",
  "email": "customer@example.com",
  "phone": "09043561537"
}
```

> **Note:** Even if you accidentally send a `contact` object nested inside `pickup` or `dropoff` here, Zod validation smartly ignores it to keep the payload lightweight.

---

## 2. Get Shipping Estimate (Strict)

**Endpoint:** `POST /api/shipments/get-shipping-estimate`
**Auth:** Optional (Guest compatible)

This endpoint must be invoked when the user transitions from checking prices to actively creating a shipment wizard. DHL and cross-border carriers have strict international rules regarding business vs individual declarations.

### TypeScript Interfaces

```typescript
export interface ItemDetail {
  nameEn: string;
  namePl: string;
  quantity: number;
  weight: number;
  value: number;
  tariffCode: string;
}

export type CustomsData =
  | {
      customsType: "S"; // Simplified clearance
      costsOfShipment?: number;
      currency: "PLN" | "EUR";
      vatRegistrationNumber?: string;
      categoryOfItem: "9" | "11" | "21" | "31" | "32" | "91";
      grossWeight: number;
      firstName: string;
      secondaryName: string;
      countryOfOrigin?: "PL";
      additionalInfo?: string;
      customsItem: { item: ItemDetail | ItemDetail[] }[];
      customAgreements?: {
        notExceedValue: boolean;
        notProhibitedGoods: true;
        notRestrictedGoods: true;
        invoiceContent: boolean;
      };
    }
  | {
      customsType: "I"; // Individual clearance
      costsOfShipment?: number;
      currency: "PLN" | "EUR";
      vatRegistrationNumber?: string;
      categoryOfItem: "9" | "11" | "21" | "32";
      grossWeight: number;
      firstName: string;
      secondaryName: string;
      countryOfOrigin?: "PL";
      additionalInfo?: string;
      customsItem: { item: ItemDetail | ItemDetail[] }[];
      // Required specific individual items
      nipNr: string;
      eoriNr?: string;
      eoriNrReceiver?: string;
      vatRegistrationNumberReceiver?: string;
      invoiceNr: string;
      invoiceDate: string; // YYYY-MM-DD
      invoice: string; // Base64
      customAgreements?: {
        notProhibitedGoods: true;
        notRestrictedGoods: true;
      };
    };

export interface ShippingEstimatePayload {
  // Base details ...
  pickup: AddressPayload;
  dropoff: AddressPayload;
  package: PackagePayload;

  guestId?: string;
  userCountryCode?: string;
  email?: string;
  phone?: string;

  // ⭐️ Strict Additions for international.
  customs?: CustomsData;
}
```

### Business Validation Rules:

- If `pickup.countryCode == dropoff.countryCode` (Domestic): `customs` is fully optional.
- If `pickup.countryCode != dropoff.countryCode` (International): **`customs` is absolutely mandatory**. Ensure you collect inputs from the user regarding `customsType` (business Nip vs simplified declarations).

> **Best Practices for the Frontend**:
>
> - Hide the complex questions (like HS Codes and NIP numbers) behind an "International Details" toggle/wizard screen.
> - Fields like `vatRegistrationNumber` and `customAgreements` are currently marked optional as they are injected via backend API defaults, but your frontend must definitely provide exact arrays of `customsItem` (the cart) and their respective `tariffCode`.

### JSON Example (Strict Individual Clearance)

```json
{
  "pickup": {
    "countryCode": "PL",
    "city": "Łódź",
    "postalCode": "63-940",
    "streetLines": ["ul. Ks. Pilawskiego"],
    "residential": false
  },
  "dropoff": {
    "countryCode": "US",
    "city": "West Haven",
    "postalCode": "06516",
    "streetLines": ["127 Canton Street"],
    "residential": true
  },
  "package": {
    "weight": { "value": 3, "units": "KG" },
    "dimensions": { "length": 45, "width": 35, "height": 10, "units": "CM" }
  },
  "customs": {
    "customsType": "I",
    "currency": "USD",
    "categoryOfItem": "11",
    "grossWeight": 3,
    "firstName": "John",
    "secondaryName": "Doe",
    "nipNr": "1234567890",
    "invoiceNr": "INV-2026-001",
    "invoiceDate": "2026-03-22",
    "invoice": "JVBERi0xLjQK...",
    "customsItem": [
      {
        "item": [
          {
            "nameEn": "Cotton T-Shirt",
            "namePl": "Koszulka bawełniana",
            "quantity": 3,
            "weight": 0.5,
            "value": 20,
            "tariffCode": "610910"
          }
        ]
      }
    ]
  },
  "email": "customer@example.com",
  "phone": "09043561537"
}
```
