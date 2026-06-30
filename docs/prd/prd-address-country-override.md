# PRD: Address-Based Country Override Feature

**Version:** 1.44.0  
**Date:** May 26, 2026  
**Status:** In Implementation  
**Related:** [Shipment Creation Payload Fixes](./prd-shipment-creation-fixes.md)

---

## Executive Summary

This PRD defines the **Address-Based Country Override** feature which allows the system to use a user's verified address country (e.g., Poland) instead of their browser-detected country (e.g., US) when:

1. Calculating shipping rates
2. Determining pricing currency
3. Applying localization/formatting
4. Creating shipments

The feature respects user address verification status and provides fallback behavior when addresses are unavailable.

---

## Problem Statement

### Current Behavior

Users get incorrect pricing and shipping rates based on their browser location, not their actual business location:

- **Example:** User in US (traveling) with verified Poland address gets:
  - ❌ Shipping rates calculated from US
  - ❌ Prices in USD/EUR instead of PLN
  - ❌ Shipping estimate shows US-based carriers

- **Issue:** System ignores the verified address on file

### Desired Behavior

- **Example:** Same user with verified Poland address should get:
  - ✅ Shipping rates calculated from Poland
  - ✅ Prices in PLN (user's home country)
  - ✅ Appropriate carriers for Poland operations

---

## Feature Overview

### Three Modes of Operation

The feature is controlled by `USE_ADDRESS_COUNTRY` environment variable:

#### Mode 1: DISABLED (Default)
```
USE_ADDRESS_COUNTRY=DISABLED
```
- **Behavior:** Always use browser-detected country
- **Fallback:** Used if environment variable is invalid
- **Use Case:** Legacy behavior, testing

#### Mode 2: ENABLED (Strict)
```
USE_ADDRESS_COUNTRY=ENABLED
```
- **Behavior:** Always use verified address country
- **Fallback:** Throw error if user has no verified address
- **Use Case:** When address verification is mandatory

#### Mode 3: AUTO (Recommended)
```
USE_ADDRESS_COUNTRY=AUTO
```
- **Behavior:** Use verified address country if available, fall back to browser country
- **Fallback:** Seamless fallback to browser detection
- **Use Case:** Best user experience, no errors

---

## Implementation Components

### 1. Feature Flags (`utils/feature-flags.ts`)

Centralized management of the feature:

```typescript
/**
 * Gets the current USE_ADDRESS_COUNTRY mode
 * @returns "ENABLED" | "DISABLED" | "AUTO" (default is DISABLED)
 */
export function getUseAddressCountryMode(): UseAddressCountryMode

/**
 * Check if address country override feature is active
 * @returns true if ENABLED or AUTO mode
 */
export function isAddressCountryFeatureActive(): boolean

/**
 * Check if ENABLED mode requires address
 * @returns true if ENABLED mode (throws error required)
 */
export function doesAddressCountryRequireAddress(): boolean
```

---

### 2. Country Resolution (`utils/address-country-helper.ts`)

Core logic for resolving which country code to use:

```typescript
/**
 * Resolves the country code for an operation
 * 
 * @param user - User with optional address
 * @param browserCountryCode - Fallback browser-detected country
 * @returns Resolved country code based on mode
 * @throws MissingAddressError if ENABLED mode and no address
 * 
 * Logic:
 * - DISABLED: return browserCountryCode
 * - ENABLED: return user.address.country (throw if missing)
 * - AUTO: return user.address.country || browserCountryCode
 */
export function getUserCountryCode(
  user: User | null,
  browserCountryCode: string
): string
```

---

### 3. React Hook (`hooks/use-user-country-code.ts`)

Frontend integration for getting the correct country code:

```typescript
/**
 * Hook to get the appropriate country code for the current user
 * 
 * Uses:
 * - User's verified address country (if feature enabled & address exists)
 * - Falls back to US as default
 * - Respects USE_ADDRESS_COUNTRY environment variable
 * 
 * @returns { countryCode: string }
 */
export function useUserCountryCode()
```

---

### 4. Shipment API Integration (`api/shipments/index.ts`)

Apply country override to all shipment operations:

```typescript
/**
 * Resolves the country code for shipment operations
 * 
 * Applied to:
 * - getShippingEstimate()
 * - getShippingQuote()
 * - createShipment()
 * 
 * Errors:
 * - MissingAddressError → UserFriendlyError with details
 */
export function resolveShipmentCountryCode(
  browserDetectedCountryCode: string
): string
```

---

## API Integration Points

### Shipping Estimate Endpoint

**Current Request:**
```json
{
  "pickup": { "countryCode": "PL", ... },
  "dropoff": { "countryCode": "US", ... },
  "userCountryCode": "US"  // ❌ Wrong (browser country)
}
```

**Fixed Request:**
```json
{
  "pickup": { "countryCode": "PL", ... },
  "dropoff": { "countryCode": "US", ... },
  "userCountryCode": "PL"  // ✅ Correct (verified address country)
}
```

### Create Shipment Endpoint

**Current Request:**
```json
{
  "pickupAddress": { "countryCode": "PL", ... },
  "dropoffAddress": { "countryCode": "US", ... },
  "userCountryCode": "US",          // ❌ Wrong (browser country)
  "invoiceId": null                 // ❌ Missing
}
```

**Fixed Request:**
```json
{
  "pickupAddress": { "countryCode": "PL", ... },
  "dropoffAddress": { "countryCode": "US", ... },
  "userCountryCode": "PL",          // ✅ Correct (pickup country)
  "invoiceId": "inv-123"            // ✅ Included (if updating)
}
```

---

## User Journey

### 1. User Registration/Login

- Browser detects country: `US`
- User has no verified address yet
- Feature mode: `AUTO`
- **System uses:** `US` (fallback)

### 2. User Submits Address Verification

- User from Poland submits verified address: `PL`
- Address approved by admin
- Feature mode: `AUTO`
- **System uses:** `PL` (from address)

### 3. User Creates Shipment

- Browser location: `US` (user traveling)
- Verified address: `PL`
- Feature mode: `AUTO`
- Pickup address: `PL`
- **System uses:** `PL` (verified address)
- **Result:** Correct Polish rates and PLN pricing

### 4. Invoice Update

- User updates existing invoice with new shipment
- URL: `/app/shipments/new?invoiceId=inv-123`
- `userCountryCode`: `PL` (from pickup)
- `invoiceId`: `inv-123` (from URL)
- **Result:** Invoice properly updated with new data

---

## Configuration

### Environment Variables

```bash
# .env.local

# Address country override mode
# Options: ENABLED | DISABLED | AUTO
# Default: DISABLED
USE_ADDRESS_COUNTRY=AUTO
```

### Feature Activation by Environment

| Environment | Mode | Behavior |
|---|---|---|
| Production | `AUTO` | Use address if verified, fallback to browser |
| Staging | `AUTO` | Same as production |
| Development | `AUTO` or `ENABLED` | For testing both flows |
| Local Testing | `DISABLED` | Use browser detection only |

---

## Error Handling

### MissingAddressError

Thrown when:
- Feature mode is `ENABLED`
- User has no verified address
- Operation requires address

**Example:**
```typescript
try {
  const rate = getShippingEstimate(payload);
} catch (error) {
  if (error instanceof MissingAddressError) {
    // User must verify address first
    router.push('/app/account?openAddressVerification=1');
  }
}
```

### UserFriendlyError

Returned to frontend when:
- Address validation fails
- Address required but missing
- Backend returns ADDRESS_REQUIRED

**Message Format:**
```json
{
  "category": "VALIDATION_ERROR",
  "message": "Address verification required",
  "details": "Your profile requires a verified address to create shipments",
  "isRetryable": false,
  "statusCode": 400
}
```

---

## Logging & Debugging

### Address Resolution Logging

Every country resolution is logged with:
- Timestamp
- Log level (debug/info/warn)
- Message
- Context (user ID, mode, addresses)

**Stored in:** Session storage (survives page reloads within session)

**Access via:**
```javascript
import { printAddressResolutionLogs } from '@/utils/address-country-helper.ts';
printAddressResolutionLogs();
```

### Debug Tools

Available in development via browser console:

```javascript
// Full diagnosis
import { runAddressHelp } from '@/utils/address-help.ts';
await runAddressHelp();

// Check auth store
import { debugAuthStore } from '@/utils/auth-debug.ts';
debugAuthStore();

// Validate address
import { validateUserAddressComplete } from '@/utils/auth-debug.ts';
validateUserAddressComplete();
```

---

## Testing Scenarios

### Test 1: Domestic Shipment with Address Override (AUTO mode)

**Setup:**
- User in US (browser)
- Verified address: Poland
- Feature mode: AUTO

**Steps:**
1. User navigates to create shipment
2. Enters pickup: Poland, dropoff: Germany
3. Submits form

**Expected:**
- ✅ `userCountryCode`: "PL" (from verified address)
- ✅ Rates calculated from Poland
- ✅ Prices in PLN
- ✅ Polish carriers shown

---

### Test 2: International Shipment, No Address (AUTO mode)

**Setup:**
- User in Europe
- No verified address
- Feature mode: AUTO

**Steps:**
1. User creates shipment
2. Enters pickup: Poland, dropoff: US

**Expected:**
- ✅ `userCountryCode`: "EU" (fallback to browser)
- ✅ Rates calculated from Europe
- ✅ No errors (AUTO has fallback)

---

### Test 3: Strict Mode Without Address (ENABLED mode)

**Setup:**
- User in US (browser)
- No verified address
- Feature mode: ENABLED

**Steps:**
1. User tries to create shipment
2. System requests country code

**Expected:**
- ❌ Error: "Address verification required"
- 📍 Direct user to: `/app/account?openAddressVerification=1`
- ℹ️ Message: "Your verified address is required to create shipments"

---

### Test 4: Invoice Update with Correct Country

**Setup:**
- Existing invoice with outdated data
- User updating with new shipment
- Verified address: Poland

**URL:**
```
/app/shipments/new?invoiceId=inv-123
```

**Expected:**
- ✅ `invoiceId`: "inv-123" (from URL)
- ✅ `userCountryCode`: "PL" (from pickup)
- ✅ Invoice updated (not duplicated)

---

## Related Components

### Account Page - Address Verification

Users can view/update their verified address:
- `components/account/AddressVerificationSection.tsx`
- Shows approval status
- Allows address updates
- Displays verification feedback

### Shipment Form - Address Pre-fill

Form automatically pre-fills from verified address:
- `components/shipping/estimate-form.tsx`
- Uses `user.address.country` for country code
- Uses `user.name`, `user.phone`, `user.email` for contact

### Address Validation Hook

Pre-flight validation before shipment operations:
- `hooks/shipments/useAddressValidation.ts`
- Checks completeness
- Detects missing fields
- Suggests actions

---

## Success Criteria

### Feature Implementation
- ✅ Feature flags utility created and working
- ✅ Country resolution logic implemented
- ✅ React hook for country code created
- ✅ API integration applied to all endpoints
- ✅ Error handling with proper messages

### User Experience
- ✅ Correct pricing shown for user's address
- ✅ Appropriate carriers displayed
- ✅ Clear error messages if address missing
- ✅ Seamless fallback to browser country
- ✅ Invoice updates work correctly

### Operations
- ✅ Domestic shipments use correct currency
- ✅ International rates calculated from address
- ✅ Address verification enforced in ENABLED mode
- ✅ Debug tools available in development
- ✅ Logging captures all resolutions

---

## Rollout Plan

### Phase 1: Foundation (v1.43.0-1.43.1)
- ✅ Feature flags utility
- ✅ Country resolution logic
- ✅ Address validation tools
- ✅ Debug infrastructure

### Phase 2: Integration (v1.43.2)
- ✅ Shipping estimate form fixes
- ✅ Shipment creation flow updates
- ✅ userCountryCode fix
- ✅ API integration

### Phase 3: Completion (v1.44.0)
- ✅ invoiceId support
- ✅ Payload corrections
- ✅ Full end-to-end testing
- ✅ Production deployment

---

## Backwards Compatibility

✅ **Fully Backwards Compatible**
- Default mode is DISABLED (existing behavior)
- Feature flag controls activation
- Fallback chains ensure no breaking changes
- AUTO mode provides safe default

---

## Documentation

- [QUICK_START_ADDRESS_ERROR.md](../QUICK_START_ADDRESS_ERROR.md) - User quick fix
- [DEBUG_ADDRESS_NOT_FOUND.md](../DEBUG_ADDRESS_NOT_FOUND.md) - Troubleshooting
- [DEBUGGING_TOOLS_REFERENCE.md](../DEBUGGING_TOOLS_REFERENCE.md) - Tool guide
- [ADDRESS_COUNTRY_OVERRIDE_SETUP.md](../ADDRESS_COUNTRY_OVERRIDE_SETUP.md) - Setup guide
- [SHIPPING_ESTIMATE_FIX.md](../SHIPPING_ESTIMATE_FIX.md) - Form fixes
- [ADDRESS_DEBUG_TOOLS_INDEX.md](../ADDRESS_DEBUG_TOOLS_INDEX.md) - Quick reference

---

## Future Enhancements

### Potential Improvements
1. **Admin Override:** Allow admins to force country for specific users
2. **Multi-Location Support:** Users with multiple addresses
3. **Smart Fallback:** Use address city/state for more granular location
4. **Analytics:** Track which mode provides better conversions
5. **Caching:** Cache address verification status to reduce queries

---

**Version:** 1.44.0  
**Last Updated:** May 26, 2026  
**Status:** ✅ Ready for Implementation

