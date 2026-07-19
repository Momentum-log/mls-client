# Client Integration Guide: Multiple Packages Support (MPS)

This guide documents the changes made to the MLS APIs to support multiple package shipments (MPS).

## Summary of Changes

To allow shipping multiple boxes in a single order, the request payloads have transitioned from a single `package` object to a `packages` array.

> [!WARNING]
> **Breaking Change:** The single `package` object field has been completely removed from `/shipping-estimates`, `/shipping-quotes`, and `/create-shipment` payloads. You must update your request schemas to use the `packages` array.

---

## 1. API Changes

### Get Shipping Estimates / Quotes
- **Old Payload:**
  ```json
  {
    "pickup": { ... },
    "dropoff": { ... },
    "package": {
      "weight": { "value": 3, "units": "KG" },
      "dimensions": { "length": 45, "width": 35, "height": 10, "units": "CM" }
    }
  }
  ```
- **New Payload:**
  ```json
  {
    "pickup": { ... },
    "dropoff": { ... },
    "packages": [
      {
        "weight": { "value": 3, "units": "KG" },
        "dimensions": { "length": 45, "width": 35, "height": 10, "units": "CM" }
      }
    ]
  }
  ```

### Create Shipment
- **Old Payload:**
  ```json
  {
    "carrierSlug": "fedex",
    "pickupAddress": { ... },
    "dropoffAddress": { ... },
    "package": {
      "weight": { "value": 3, "units": "KG" },
      "dimensions": { "length": 45, "width": 35, "height": 10, "units": "CM" }
    },
    "rate": { ... }
  }
  ```
- **New Payload:**
  ```json
  {
    "carrierSlug": "fedex",
    "pickupAddress": { ... },
    "dropoffAddress": { ... },
    "packages": [
      {
        "weight": { "value": 3, "units": "KG" },
        "dimensions": { "length": 45, "width": 35, "height": 10, "units": "CM" }
      }
    ],
    "rate": { ... }
  }
  ```

---

## 2. API Validation Constraints

- **Minimum packages count:** The `packages` array must contain at least 1 package.
- **Identical Units of Measure:** To prevent carrier-side errors, the API enforces that all packages in the array must use the exact same units of measure.
  - All package weights must use either all `KG` or all `LB`.
  - All package dimensions (if provided) must use either all `CM` or all `IN`.
  - Mixing units (e.g., Package 1 uses `KG` and Package 2 uses `LB`) will trigger a `400 Bad Request` validation error early in the API.

---

## 3. Database & Response Mapping

- **Aggregated Weight:** The database continues to store consolidated shipment weight (sum of all package weights converted to `KG`) to maintain compatibility with invoicing, commissions, and tax engines.
- **Master Tracking Number:** The primary tracking number returned is the master tracking number.
- **Package-Level Tracking:** Individual packages will have their assigned tracking numbers updated inside the `packages` list stored in the database.
