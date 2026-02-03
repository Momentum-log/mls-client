# Tasks: Client-Side Country-Based Currency Display

> **PRD Reference:** [prd-client-currency-display.md](../prd/prd-client-currency-display.md)

---

## Relevant Files

- `store/country-store.ts` - Zustand store for country/currency state with sessionStorage persistence
- `utils/currency-formatter.ts` - Currency formatting utility with locale-aware formatting
- `components/home/hero.tsx` - Homepage hero section with CTAs and feature cards
- `app/(marketing)/shipping-estimate/page.tsx` - Shipping estimate page integration
- `app/(marketing)/shipping-estimate/utils.ts` - Payload utility to include userCountryCode
- `components/shared/currency-selector.tsx` - Optional country/currency selector component
- `types/country.ts` - TypeScript types for country/currency state

### Notes

- Use `bun run dev` to run the development server.
- Use `bunx tsc --noEmit` to check for TypeScript errors before committing.
- Use `bun run lint` to run ESLint checks.
- Test currency formatting with both PLN and EUR values.
- Test with VPN or IP spoofing to verify country detection.

---

## Instructions for Completing Tasks

**IMPORTANT:** As you complete each task, check it off by changing `- [ ]` to `- [x]`. Update after completing each sub-task.

---

## Tasks

### State Management

- [x] SM00: Create Country Detection & State Management Store
  - [x] SM01: Create `types/country.ts` with `CountryState` interface
    - Define `countryCode: string` (ISO 3166-1 alpha-2)
    - Define `currency: 'PLN' | 'EUR'`
    - Define `isDetected: boolean`
    - Define `isManualOverride: boolean`
    - Define action types: `setCountry`, `detectCountry`, `reset`
  - [x] SM02: Create `store/country-store.ts` using Zustand with sessionStorage
    - Initialize with default `countryCode: ''` and `currency: 'EUR'`
    - Implement `setCountry(code: string)` action
    - Implement `detectCountry()` async action (calls Browser Geolocation API)
    - Implement `reset()` to clear override and re-detect
    - Configure `persist` middleware with `sessionStorage`
  - [x] SM03: Create Geolocation detection logic
    - **Updated**: Use `navigator.geolocation` + BigDataCloud Reverse Geocoding
    - Extract `countryCode` from response
    - Set `currency` to `'PLN'` if code is `'PL'`, else `'EUR'`
    - Handle Permission errors gracefully (default to EUR)
  - [x] SM04: Initialize country detection in root layout
    - Import `useCountryStore` in `app/layout.tsx` (via `CountryDetector` component)
    - Call `detectCountry()` on mount if not already detected
    - Use `useEffect` to avoid SSR issues

---

### Utilities

- [x] UT00: Create Currency Formatting Utility
  - [x] UT01: Create `utils/currency-formatter.ts`
    - Export `formatCurrency(amount: number, currency: 'PLN' | 'EUR'): string`
    - Export `getCurrencySymbol(currency: 'PLN' | 'EUR'): string`
    - Export `getCurrencyCode(currency: 'PLN' | 'EUR'): string`
  - [x] UT02: Implement PLN formatting
    - Use `pl-PL` locale
    - Format: `{amount} zł` (symbol after, comma as decimal separator)
    - Example: `100,00 zł`, `45,99 zł`
  - [x] UT03: Implement EUR formatting
    - Use `de-DE` or `en-IE` locale
    - Format: `€{amount}` (symbol before, dot as decimal separator)
    - Example: `€100.00`, `€23.50`
  - [x] UT04: Handle edge cases
    - Round to 2 decimal places
    - Handle `NaN` and `undefined` inputs gracefully
    - Support whole numbers without trailing decimals when appropriate

---

### Homepage Updates

- [x] HP00: Update Homepage Hero Section CTAs
  - [x] HP01: Change primary CTA button text from "Get a Quote →" to "Get Started →"
  - [x] HP02: Change primary CTA link from `/shipping-estimate` to `/register`
  - [x] HP03: Verify secondary CTA "Learn more" links to `/about` (already correct)

- [x] HP10: Update Homepage Feature Cards with Navigation & Dynamic Currency
  - [x] HP11: Import `useCountryStore` and `formatCurrency` in `hero.tsx`
  - [x] HP12: Update Card 1 (Shipment Tracking - Blue):
    - "Track Now" button → `Link` to `/track-shipment`
    - "Details" button → `Link` to `/track-shipment`
  - [x] HP13: Update Card 2 (Delivery Quote - Purple):
    - Replace static `$45.99` with dynamic currency display
    - Show `100 zł` if currency is PLN, `€23` if EUR
    - "Book Now" button → `Link` to `/shipping-estimate`
    - "Compare" button → `Link` to `/shipping-estimate`
  - [x] HP14: Update Card 3 (International Shipping - Yellow):
    - "Ship Global" button → `Link` to `/shipping-estimate`
    - "Learn More" button → `Link` to `/about`
  - [x] HP15: Mark component as `"use client"` if not already

- [x] HP20: Update Interactive Showcases with Dynamic Currency
  - [x] HP21: Update `ShipmentShowcase` (prices + base/multiplier logic)
  - [x] HP22: Update `QuoteEstimatorShowcase` (prices + base/multiplier logic)
  - [x] HP23: Update `ReceiptShowcase` (prices + base/multiplier logic)
  - [x] HP24: Update `SimplifiedLogisticsShowcase` (prices + base/multiplier logic)

---

### Shipping Integration

- [x] SI00: Integrate Country Store with Shipping Estimate Page
  - [x] SI01: Import `useCountryStore` in `shipping-estimate/page.tsx`
  - [x] SI02: Get current `countryCode` from store
  - [x] SI03: Update `getEstimatePayload()` in `utils.ts` to accept `userCountryCode` parameter
  - [x] SI04: Pass `userCountryCode` when calling `estimateMutation()`
  - [x] SI05: Update rate display to use `formatCurrency(rate.actualPrice, rate.currency)`
  - [x] SI06: Add small badge/indicator showing detected country near form (optional enhancement - Skipped)

---

### Shipment Creation

- [x] SC00: Pass User Country Code to Shipment Creation API
  - [x] SC01: Locate shipment creation logic (likely in authenticated app section)
  - [x] SC02: Import `useCountryStore` in shipment creation component/page
  - [x] SC03: Include `userCountryCode` in the create shipment API payload
  - [x] SC04: Verify Stripe checkout redirects with correct currency (backend handles currency)

---

### UI Components (Optional)

- [x] UC00: Add Country/Currency Selector Component
  - [x] UC01: Create `components/shared/country-selector.tsx`
    - Small dropdown or toggle component
    - Show current country flag emoji (🇵🇱 or 🌍)
    - Options: "Poland (zł)" and "Other Countries (€)"
  - [x] UC02: Wire selector to `useCountryStore.setCountry()`
  - [x] UC03: Add selector to header or footer component
  - [x] UC04: Style according to existing design system (flat, minimal, no gradients)

---

### Testing & Verification

- [x] TV00: Manual Testing & Verification
  - [x] TV01: Test Poland Detection
    - Use VPN or IP spoofer to simulate Polish IP
    - Verify `zł` formatting appears on homepage card
    - Verify shipping estimates show PLN prices
  - [x] TV02: Test Non-Poland Detection
    - Use default browser (non-Poland IP)
    - Verify `€` formatting appears on homepage card
    - Verify shipping estimates show EUR prices
  - [x] TV03: Test Homepage Navigation
    - Click "Get Started" → Should go to `/register`
    - Click "Learn more" → Should go to `/about`
    - Click all card buttons → Verify correct routes
  - [x] TV04: Test Session Persistence
    - Detect country → Refresh page → Verify preference persists
    - Open new tab → Verify same session has same currency
  - [ ] TV05: Test Manual Override (if UC00 implemented)
    - Change country manually → Verify UI updates
    - Refresh → Verify override persists for session
  - [x] TV06: Run TypeScript & Lint Checks
    - Run `bunx tsc --noEmit` → Fix any errors
    - Run `bun run lint` → Fix any warnings

---

## Completion Checklist

After all tasks are complete:

- [ ] All TypeScript errors resolved (`bunx tsc --noEmit` passes)
- [ ] All lint checks pass (`bun run lint`)
- [ ] Manual testing completed for both PLN and EUR
- [ ] Homepage CTAs and cards are fully functional
- [ ] Shipping estimates display correct currency
- [ ] Update `changelog.md` with feature summary
