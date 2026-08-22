# PRD: Shipment Creation API Payload Fixes

**Version:** 1.44.0  
**Date:** May 26, 2026  
**Status:** In Progress

---

## Executive Summary

The shipment creation flow has two critical issues with API payload construction:

1. **userCountryCode is Incorrect** - Currently uses the user's global country setting, should use the shipment's pickup address country
2. **Missing invoiceId** - When updating an existing invoice, the `invoiceId` is not included in the payload, preventing proper invoice updates

This PRD defines fixes to ensure correct payload construction for both new shipments and invoice updates.

---

## Problems

### Issue 1: userCountryCode Always Uses User's Country Setting

**Current Behavior:**
```json
{
  "userCountryCode": "US",  // ❌ Always from useUserCountryCode() hook
  "pickupAddress": {
    "countryCode": "PL"     // ✅ Actual shipment country
  }
}
```

**Expected Behavior:**
```json
{
  "userCountryCode": "PL",  // ✅ Should match pickup address country
  "pickupAddress": {
    "countryCode": "PL"
  }
}
```

**Impact:**
- Backend receives wrong country code for currency/locale determination
- Shipping rates may be calculated for wrong region
- Example: Domestic Poland shipment shows EUR prices instead of PLN

**Root Cause:**
In `app/app/shipments/new/page.tsx`, the `handleFinalize` function uses:
```typescript
userCountryCode: countryCode,  // ❌ From useUserCountryCode() hook
```

Instead of:
```typescript
userCountryCode: sender.country,  // ✅ From pickup address
```

---

### Issue 2: Missing invoiceId When Updating Invoice

**Current Behavior:**
```json
{
  "shipmentId": "9cfa864c-0d5b-485e-9a73-849fdf47a88f",
  "invoiceId": undefined  // ❌ Missing!
}
```

**Expected Behavior:**
```json
{
  "shipmentId": "9cfa864c-0d5b-485e-9a73-849fdf47a88f",
  "invoiceId": "invoice-123"  // ✅ From URL params
}
```

**Impact:**
- Cannot update existing invoices
- New invoice created instead of updating existing one
- Duplicates invoices in system

**Root Cause:**
The `new/page.tsx` doesn't extract `invoiceId` from search params and doesn't include it in the `ShipmentMutationPayload`.

---

## Solution

### Fix 1: Use Pickup Address Country for userCountryCode

**File:** `app/app/shipments/new/page.tsx`

**Change Location:** In the `handleFinalize` function, around line 425

**Before:**
```typescript
const payload: ShipmentMutationPayload = {
  // ... other fields ...
  userCountryCode: countryCode,  // ❌ Wrong
  preferredPaymentOption: paymentMethod,
};
```

**After:**
```typescript
const payload: ShipmentMutationPayload = {
  // ... other fields ...
  userCountryCode: sender.country,  // ✅ Use pickup address country
  preferredPaymentOption: paymentMethod,
};
```

---

### Fix 2: Extract and Include invoiceId from Search Params

**File:** `app/app/shipments/new/page.tsx`

**Change Location:** Near the top of the component, after line 47

**Add this import:**
```typescript
import { useSearchParams } from "next/navigation";
```

**Add this code after destructuring useShipmentStore():**
```typescript
// Get invoiceId from URL params if updating an existing invoice
const searchParams = useSearchParams();
const invoiceId = searchParams?.get("invoiceId") || undefined;
```

**Update handleFinalize payload:**
```typescript
const payload: ShipmentMutationPayload = {
  carrierSlug: ...,
  pickupAddress: ...,
  dropoffAddress: ...,
  package: ...,
  rate: selectedRate,
  customs: customs ?? undefined,
  userCountryCode: sender.country,  // ✅ Fix 1
  preferredPaymentOption: paymentMethod,
  invoiceId: invoiceId,             // ✅ Fix 2 - NEW
};
```

---

## API Payload Impact

### Example: Domestic Poland Shipment with Invoice Update

**Before (Incorrect):**
```json
{
  "carrierSlug": "fedex",
  "pickupAddress": {
    "streetLines": ["Rewolucji 1905 roku"],
    "city": "Łódź",
    "stateOrProvinceCode": "Województwo łódzkie",
    "postalCode": "90-001",
    "countryCode": "PL",
    "residential": false,
    "contact": {
      "personName": "Adedotun gabriel",
      "phoneNumber": "48043561537"
    }
  },
  "dropoffAddress": {
    "streetLines": ["ul. Pałacowa"],
    "city": "Paszkówka",
    "stateOrProvinceCode": "Województwo małopolskie",
    "postalCode": "34-113",
    "countryCode": "PL",
    "residential": false,
    "contact": {
      "personName": "thekiwidev",
      "phoneNumber": "48906370445"
    }
  },
  "package": {
    "weight": { "value": 3, "units": "KG" },
    "dimensions": { "length": 45, "width": 35, "height": 10, "units": "CM" }
  },
  "rate": { "carrier": "FedEx", "serviceType": "FEDEX_PRIORITY", "actualPrice": 37.27, "currency": "EUR" },
  "userCountryCode": "US",          // ❌ WRONG
  "preferredPaymentOption": "payu",
  "invoiceId": undefined            // ❌ MISSING
}
```

**After (Correct):**
```json
{
  "carrierSlug": "fedex",
  "pickupAddress": {
    "streetLines": ["Rewolucji 1905 roku"],
    "city": "Łódź",
    "stateOrProvinceCode": "Województwo łódzkie",
    "postalCode": "90-001",
    "countryCode": "PL",
    "residential": false,
    "contact": {
      "personName": "Adedotun gabriel",
      "phoneNumber": "48043561537"
    }
  },
  "dropoffAddress": {
    "streetLines": ["ul. Pałacowa"],
    "city": "Paszkówka",
    "stateOrProvinceCode": "Województwo małopolskie",
    "postalCode": "34-113",
    "countryCode": "PL",
    "residential": false,
    "contact": {
      "personName": "thekiwidev",
      "phoneNumber": "48906370445"
    }
  },
  "package": {
    "weight": { "value": 3, "units": "KG" },
    "dimensions": { "length": 45, "width": 35, "height": 10, "units": "CM" }
  },
  "rate": { "carrier": "FedEx", "serviceType": "FEDEX_PRIORITY", "actualPrice": 37.27, "currency": "EUR" },
  "userCountryCode": "PL",          // ✅ CORRECT
  "preferredPaymentOption": "payu",
  "invoiceId": "inv-12345"          // ✅ INCLUDED
}
```

---

## Implementation Steps

### Step 1: Update Imports
Add `useSearchParams` import to the page component.

### Step 2: Extract invoiceId
Parse `invoiceId` from URL search params early in component.

### Step 3: Fix userCountryCode
Change from `countryCode` to `sender.country` in `handleFinalize`.

### Step 4: Include invoiceId in Payload
Add `invoiceId: invoiceId` to the `ShipmentMutationPayload` object.

### Step 5: Test
- Test creating new shipment (invoiceId should be undefined)
- Test updating invoice: `/app/shipments/new?invoiceId=inv-123` (invoiceId should be included)
- Verify userCountryCode matches pickup address

---

## Testing Scenarios

### Scenario 1: New Domestic Shipment (PL to PL)
- **URL:** `/app/shipments/new`
- **Expected:** `userCountryCode: "PL"`, `invoiceId: undefined`
- **Verify:** Correct PLN pricing

### Scenario 2: New International Shipment (PL to US)
- **URL:** `/app/shipments/new`
- **Expected:** `userCountryCode: "PL"`, `invoiceId: undefined`
- **Verify:** Rates calculated from Poland

### Scenario 3: Update Existing Invoice (Domestic)
- **URL:** `/app/shipments/new?invoiceId=inv-67890`
- **Expected:** `userCountryCode: "PL"`, `invoiceId: "inv-67890"`
- **Verify:** Invoice is updated, not duplicated

### Scenario 4: Update Existing Invoice (International)
- **URL:** `/app/shipments/new?invoiceId=inv-99999&shipmentId=ship-123`
- **Expected:** `userCountryCode: "PL"` (from pickup), `invoiceId: "inv-99999"`
- **Verify:** Invoice updated with new shipment details

---

## Backend Integration

The backend already expects:
- `userCountryCode: string` - For currency/locale determination
- `invoiceId?: string` - Optional, when updating existing invoice

No backend changes required. The backend will:
1. Use `userCountryCode` for currency formatting
2. Update the invoice if `invoiceId` is provided
3. Create new invoice if `invoiceId` is omitted

---

## Files Modified

- [app/app/shipments/new/page.tsx](../../app/app/shipments/new/page.tsx)
  - Add `useSearchParams` import
  - Extract `invoiceId` from search params
  - Fix `userCountryCode` to use pickup address country
  - Include `invoiceId` in payload

---

## Rollout Plan

1. **Phase 1:** Update `new/page.tsx` with both fixes
2. **Phase 2:** Test all scenarios (new + update flows)
3. **Phase 3:** Deploy and monitor invoice updates
4. **Phase 4:** Verify currency calculations are correct

---

## Backward Compatibility

✅ **Fully Backward Compatible**
- `invoiceId` is optional in payload
- Existing shipment creation flows continue to work
- Only adds new capability (invoice updates)

---

## Success Criteria

- ✅ `userCountryCode` matches pickup address country
- ✅ `invoiceId` is included when URL param provided
- ✅ Domestic shipments show correct currency (PLN)
- ✅ International shipments use correct origin country
- ✅ Invoice updates work correctly
- ✅ No regressions in existing flows

---

**Related:** 
- [Shipping Estimate Calculation Fix](./SHIPPING_ESTIMATE_FIX.md)
- [Address Country Override Setup](../ADDRESS_COUNTRY_OVERRIDE_SETUP.md)

