# mls-client Lint Error Reference

> Generated from `bun run lint` output on `feature/invoice-receipt-ui`
> Total: **178 problems** (110 errors, 68 warnings)

---

## Quick Wins — Run This First

```bash
bun run lint -- --fix
```

Auto-fixes most unescaped entity errors (`'` → `&apos;`, `"` → `&quot;`) and `prefer-const` issues.

---

## Table of Contents

1. [Unused Variables & Imports](#1-unused-variables--imports)
2. [Explicit `any` Types](#2-explicit-any-types)
3. [Unescaped Entities](#3-unescaped-entities)
4. [React Architectural Errors](#4-react-architectural-errors)
5. [Other Errors](#5-other-errors)

---

## 1. Unused Variables & Imports

> Rule: `@typescript-eslint/no-unused-vars`
> All fixes are simple: remove the import/variable from the destructure or import statement.

---

### `api/index.ts`

| Line | Issue | Fix |
|------|-------|-----|
| L17 | `clearTokens` is imported but never used | Remove `clearTokens` from the import |

---

### `app/(marketing)/contact/page.tsx`

| Line | Issue | Fix |
|------|-------|-----|
| L14 | `FaFacebookF` is imported but never used | Remove `FaFacebookF` from the icon import |

---

### `app/(marketing)/login/page.tsx`

| Line | Issue | Fix |
|------|-------|-----|
| L6 | `Link` is imported but never used | Remove `Link` import |
| L7 | `Image` is imported but never used | Remove `Image` import |
| L8 | `logoLandscape` is imported but never used | Remove `logoLandscape` import |

---

### `app/(marketing)/register/page.tsx`

| Line | Issue | Fix |
|------|-------|-----|
| L7 | `Image` is imported but never used | Remove `Image` import |
| L8 | `logoLandscape` is imported but never used | Remove `logoLandscape` import |

---

### `app/(marketing)/shipping-estimate/page.tsx`

| Line | Issue | Fix |
|------|-------|-----|
| L6 | `toFormikValidationSchema` is imported but never used | Remove import |
| L11 | `FaCalculator` is imported but never used | Remove import |
| L123 | `isAuthenticated` is assigned but never used | Remove from destructure, or prefix with `_isAuthenticated` |

---

### `app/(marketing)/shipping-estimate/utils.ts`

| Line | Issue | Fix |
|------|-------|-----|
| L137 | `customs` is assigned but never used | Remove or prefix with `_customs` if from a destructure |

---

### `app/(marketing)/track-shipment/[id]/page.tsx`

| Line | Issue | Fix |
|------|-------|-----|
| L7 | `FiSearch` is imported but never used | Remove import |

---

### `app/app/invoices/[id]/page.tsx`

| Line | Issue | Fix |
|------|-------|-----|
| L60 | `setShipmentData` is destructured but never used | Use `const [shipmentData] = ...` without the setter |

---

### `app/app/invoices/page.tsx`

| Line | Issue | Fix |
|------|-------|-----|
| L17 | `addToast` is assigned but never used | Remove from destructure |

---

### `app/app/shipments/new/package/page.tsx`

| Line | Issue | Fix |
|------|-------|-----|
| L5 | `Package` type is imported but never used | Remove type import |
| L30 | `setPackages` is assigned but never used | Change to `const [packages] = useState(...)` |

---

### `app/app/shipments/new/service/page.tsx`

| Line | Issue | Fix |
|------|-------|-----|
| L15 | `ShippingEstimatePayload` is imported but never used | Remove import |
| L16 | `uuidv4` is imported but never used | Remove import |
| L38 | `apiError` is assigned but never used | Remove or prefix with `_apiError` |

---

### `app/app/shipments/new/summary/page.tsx`

| Line | Issue | Fix |
|------|-------|-----|
| L27 | `reset` is assigned but never used | Remove from destructure |
| L29 | `user` is assigned but never used | Remove from destructure |
| L115 | `sessionId` is assigned but never used | Remove from destructure |

---

### `app/app/shipments/new/verify/page.tsx`

| Line | Issue | Fix |
|------|-------|-----|
| L25 | `toast` is assigned but never used | Remove from destructure |

---

### `app/app/track/page.tsx`

| Line | Issue | Fix |
|------|-------|-----|
| L28 | `Link` is imported but never used | Remove import |

---

### `components/about/vision-showcase.tsx`

| Line | Issue | Fix |
|------|-------|-----|
| L4 | `FaSignal` is imported but never used | Remove import |

---

### `components/account/ChangePasswordForm.tsx`

| Line | Issue | Fix |
|------|-------|-----|
| L7 | `Input` is imported but never used | Remove import |

---

### `components/account/LogoutAction.tsx`

| Line | Issue | Fix |
|------|-------|-----|
| L30 | `error` defined in catch block but never used | Change `catch (error)` to `catch` or `catch (_error)` |

---

### `components/account/ProfileForm.tsx`

| Line | Issue | Fix |
|------|-------|-----|
| L101 | `handleSave` is assigned but never used | Remove the assignment or wire it to a button's `onClick` |

---

### `components/account/VerificationBanner.tsx`

| Line | Issue | Fix |
|------|-------|-----|
| L22 | `isSendingPhone` is assigned but never used | Remove from destructure |
| L50 | `handleVerifyPhone` is assigned but never used | Remove from destructure |
| L68 | `handleResendCode` is assigned but never used | Remove from destructure |
| L76 | `error` defined but never used | Change `catch (error)` to `catch` or `catch (_error)` |

---

### `components/auth/login-form.tsx`

| Line | Issue | Fix |
|------|-------|-----|
| L6 | `toFormikValidationSchema` is imported but never used | Remove import |

---

### `components/auth/register-form.tsx`

| Line | Issue | Fix |
|------|-------|-----|
| L6 | `toFormikValidationSchema` is imported but never used | Remove import |

---

### `components/invoice/InvoiceListPage.tsx`

| Line | Issue | Fix |
|------|-------|-----|
| L17 | `getInvoiceStatusColor` is imported but never used | Remove import |

---

### `components/invoice/InvoicePreview.tsx`

| Line | Issue | Fix |
|------|-------|-----|
| L56 | `showPaymentLinkWarning` is assigned but never used | Remove the assignment |
| L91 | `idx` (map parameter) is defined but never used | Replace with `_` e.g. `.map((item, _) =>` |

---

### `components/invoice/InvoiceReceiptView.tsx`

| Line | Issue | Fix |
|------|-------|-----|
| L80 | `shipmentId` is defined but never used | Remove from destructure or prefix with `_` |
| L116 | `invoiceId` is assigned but never used | Remove from destructure or prefix with `_` |

---

### `components/invoice/InvoiceSummaryNew.tsx`

| Line | Issue | Fix |
|------|-------|-----|
| L13 | `InvoiceLineItem` type is imported but never used | Remove type import |

---

### `components/invoice/InvoicesSidebar.tsx`

| Line | Issue | Fix |
|------|-------|-----|
| L13 | `Link` is imported but never used | Remove import |

---

### `components/shared/address-fields.tsx`

| Line | Issue | Fix |
|------|-------|-----|
| L18 | `FaPhone` is imported but never used | Remove import |
| L51 | `isLoadingCountries` is assigned but never used | Remove from destructure |
| L53 | `isLoadingStates` is assigned but never used | Remove from destructure |
| L55 | `isLoadingCities` is assigned but never used | Remove from destructure |

---

### `components/shared/country-detector.tsx`

| Line | Issue | Fix |
|------|-------|-----|
| L12 | `isDetected` is assigned but never used | Remove from destructure |
| L12 | `isManualOverride` is assigned but never used | Remove from destructure |

---

### `components/shipment/customs-form.tsx`

| Line | Issue | Fix |
|------|-------|-----|
| L58 | `user` is assigned but never used | Remove from destructure |

---

### `components/shipment/package-form.tsx`

| Line | Issue | Fix |
|------|-------|-----|
| L7 | `FiBox` is imported but never used | Remove import |

---

### `components/shipment/service-selection.tsx`

| Line | Issue | Fix |
|------|-------|-----|
| L5 | `FiCheck` is imported but never used | Remove import |

---

### `components/shipping/estimate-form.tsx`

| Line | Issue | Fix |
|------|-------|-----|
| L4 | `toFormikValidationSchema` is imported but never used | Remove import |
| L29 | `estimateFormSchema` is assigned but never used | Remove the entire declaration |

---

### `components/ui/select.tsx`

| Line | Issue | Fix |
|------|-------|-----|
| L4 | `VariantProps` is imported but never used | Remove import |

---

### `hooks/invoices/use-invoices.ts`

| Line | Issue | Fix |
|------|-------|-----|
| L22 | `Invoice` type is imported but never used | Remove type import |

---

### `hooks/shipments/use-duplicate-shipment.ts`

| Line | Issue | Fix |
|------|-------|-----|
| L4 | `CustomsData` type is imported but never used | Remove type import |

---

### `store/shipment-store.ts`

| Line | Issue | Fix |
|------|-------|-----|
| L2 | `persist` is imported but never used | Remove import |
| L2 | `createJSONStorage` is imported but never used | Remove import |
| L3 | `secureStorage` is imported but never used | Remove import |

---

### `utils/error-handler.ts`

| Line | Issue | Fix |
|------|-------|-----|
| L10 | `TypedApiError` is imported but never used | Remove import |

---

### `utils/invoice-helper.ts`

| Line | Issue | Fix |
|------|-------|-----|
| L11 | `Invoice` type is imported but never used | Remove import |

---

### `patch_page.js`

| Line | Issue | Fix |
|------|-------|-----|
| L2 | `path` is assigned but never used | Remove the `path` require (also has a separate error — see Section 5) |

---

## 2. Explicit `any` Types

> Rule: `@typescript-eslint/no-explicit-any`

**Common fix patterns:**

- **Catch blocks** → use `unknown` and narrow with `instanceof Error`
  ```ts
  catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
  }
  ```
- **Formik submit handlers** → use `FormikHelpers<YourValuesType>` from `'formik'`
  ```ts
  onSubmit(values: LoginValues, helpers: FormikHelpers<LoginValues>)
  ```
- **API responses** → define a typed interface per endpoint
- **`formikErrors`** → use `FormikErrors<YourFormType>` from `'formik'`
- **Event handlers** → use `React.ChangeEvent<HTMLInputElement | HTMLSelectElement>`

---

### `api/index.ts` — L53, L55

Use `unknown` for catch params. For response data, use `Record<string, unknown>` or a typed interface.

---

### `app/(marketing)/shipping-estimate/page.tsx` — L167, L169, L490

For event handlers: `React.ChangeEvent<HTMLInputElement>`. For API responses: define a typed interface. For catch blocks: `unknown`.

---

### `app/app/layout.tsx` — L36

If it's children: `React.ReactNode`. If it's a session object, define a `Session` interface.

---

### `app/app/shipments/new/destination/page.tsx` — L17
### `app/app/shipments/new/origin/page.tsx` — L31

Likely `setFieldValue` from Formik. Type it as:
```ts
setFieldValue: (field: keyof FormValues, value: FormValues[keyof FormValues]) => void
```

---

### `app/app/shipments/new/summary/page.tsx` — L131
### `app/app/shipments/new/verify/page.tsx` — L41

Use `unknown` in catch blocks. For API responses, define a typed return interface.

---

### `app/app/track/page.tsx` — L111

Define a `TrackingResult` interface and use it instead of `any`.

---

### `app/auth/forgot-password/page.tsx` — L41, L74

Use `unknown` in catch blocks and narrow with `instanceof Error`.

---

### `components/account/ChangePasswordForm.tsx` — L55
### `components/account/EmailChangeModal.tsx` — L44, L71
### `components/account/ProfileForm.tsx` — L42, L86, L102, L116
### `components/account/VerificationBanner.tsx` — L38, L59
### `components/account/VerifyEmailModal.tsx` — L51
### `components/account/VerifyPhoneModal.tsx` — L59, L93

All catch blocks: use `unknown`. All API calls: define response interfaces. All Formik handlers: use `FormikHelpers<YourFormType>`.

---

### `components/auth/login-form.tsx` — L40
### `components/auth/profile-form.tsx` — L40
### `components/auth/register-form.tsx` — L57

Use `FormikHelpers<YourValuesType>` for submit handler second param.

---

### `components/invoice/InvoiceListPage.tsx` — L150
### `components/invoice/InvoiceReceiptView.tsx` — L308

Define `Invoice` or `InvoiceDetail` interfaces and use them.

---

### `components/shared/address-fields.tsx` — L26, L126, L128, L133, L135

Define `Country`, `State`, `City` interfaces. For Formik props: use `FormikProps<YourFormType>`.

---

### `components/shipment/address-form.tsx` — L80
### `components/shipment/customs-form.tsx` — L65, L88, L97, L98, L310, L311
### `components/shipment/package-form.tsx` — L117

Use `FormikErrors<YourType>` and `FormikTouched<YourType>`. For events: `React.ChangeEvent<HTMLInputElement | HTMLSelectElement>`.

---

### `components/shipping/estimate-form.tsx` — L36, L48, L97

Define a typed form values interface and use it throughout.

---

### `components/ui/phone-input.tsx` — L47

Extend `React.InputHTMLAttributes<HTMLInputElement>` for the props interface.

---

### `hooks/invoices/useInvoiceUpdateFlow.ts` — L18
### `hooks/shipments/use-duplicate-shipment.ts` — L25, L26, L32
### `hooks/useNotification.ts` — L132, L268, L285

Define typed return interfaces for these hooks.

---

### `types/auth.ts` — L7

Define the exact shape of the auth object — this is foundational. Getting this right will eliminate many downstream `any` usages.

---

### `utils/error-handler.ts` — L151, L154, L250

Use `unknown` and narrow with `instanceof Error` or a type guard helper.

---

### `utils/shipment-helper.ts` — L53

Define a `Shipment` (or equivalent) typed interface.

---

## 3. Unescaped Entities

> Rule: `react/no-unescaped-entities`
> Most of these are **auto-fixable** with `bun run lint -- --fix`.

**Manual replacements:**

| Character | JSX-safe version | Alternative |
|-----------|-----------------|-------------|
| `'` | `&apos;` | `{"it's"}` |
| `"` | `&quot;` | `{'"text"'}` |

---

### Apostrophe `'` errors

| File | Line |
|------|------|
| `app/(marketing)/contact/page.tsx` | L35 |
| `app/(marketing)/shipping-estimate/page.tsx` | L480 |
| `app/(marketing)/terms/page.tsx` | L60 |
| `app/app/shipments/payment-success/page.tsx` | L243, L256 (×2) |
| `components/about/about-hero.tsx` | L33 |
| `components/about/mission-vision.tsx` | L61, L137 |
| `components/invoice/InvoiceReceiptNew.tsx` | L246 |
| `components/shipment/package-form.tsx` | L171 |
| `components/shipment/service-selection.tsx` | L52 |
| `components/account/EmailChangeModal.tsx` | L88 |
| `components/account/VerifyEmailModal.tsx` | L93 |
| `components/home/heavy-freight-section.tsx` | L62, L69 |

---

### Double-quote `"` errors

| File | Line |
|------|------|
| `app/(marketing)/cookies/page.tsx` | L83 (×2) |
| `app/(marketing)/privacy/page.tsx` | L25 (×6), L104 (×2) |
| `app/(marketing)/terms/page.tsx` | L25 (×6) |
| `app/app/shipments/new/verify/page.tsx` | L164 (×2) |

---

## 4. React Architectural Errors

These require careful fixes — they affect rendering correctness.

---

### `components/about/global-network-showcase.tsx` — L43, L44

**Rule:** `react-hooks/purity`
**Issue:** `Math.random()` is called directly during render — produces different values on every re-render.

**Fix:** Pre-compute positions once with `useMemo`:

```tsx
const dots = useMemo(
  () => Array.from({ length: N }, () => ({
    top: Math.random() * 100,
    left: Math.random() * 100,
  })),
  []
);

// In JSX:
// style={{ top: `${dot.top}%`, left: `${dot.left}%` }}
```

---

### `components/invoice/InvoiceReceiptView.tsx` — L197

**Rule:** `react-hooks/purity`
**Issue:** `Date.now()` is called during render to check if a payment link is expired.

**Fix:** Move into `useMemo`:

```tsx
const isLinkExpired = useMemo(
  () => paymentLinkExpiresAt && new Date(paymentLinkExpiresAt).getTime() < Date.now(),
  [paymentLinkExpiresAt]
);
```

---

### `components/invoice/InvoicesListNew.tsx` — L178, L270, L284, L300

**Rule:** `react-hooks/static-components`
**Issue:** `SortIndicator` is defined inside the parent component body — React treats it as a new component on every render, losing its state.

**Fix:** Move `SortIndicator` outside the parent component. Pass `sortField` and `sortOrder` as props:

```tsx
// Outside the parent component:
type SortIndicatorProps = {
  field: "createdAt" | "invoiceNumber" | "totalGross";
  sortField: string;
  sortOrder: "asc" | "desc";
};

const SortIndicator = ({ field, sortField, sortOrder }: SortIndicatorProps) => {
  if (sortField !== field)
    return <span className="text-muted-foreground ml-1">⇅</span>;
  return <span className="ml-1">{sortOrder === "asc" ? "↑" : "↓"}</span>;
};

// Usage inside the parent:
// <SortIndicator field="invoiceNumber" sortField={sortField} sortOrder={sortOrder} />
```

---

### `components/account/VerifyPhoneModal.tsx` — L38, L40

**Rule:** `react-hooks/immutability`
**Issue:** `handleSendOTP` is called in a `useEffect` at L38, but declared later at L50. `const` arrow functions are not hoisted.

**Fix:**
1. Move the `handleSendOTP` declaration to **before** the `useEffect` that calls it.
2. Add missing dependencies to the `useEffect` array:

```tsx
const handleSendOTP = async () => { /* ... */ };

useEffect(() => {
  if (isOpen && tempPhone) {
    handleSendOTP();
  }
}, [isOpen, tempPhone, handleSendOTP]);
```

If `handleSendOTP` causes the effect to fire too often, wrap it in `useCallback`.

---

### `hooks/invoices/usePdfStatus.ts` — L83

**Rule:** `react-hooks/immutability`
**Issue:** `pollPdfStatus` (a `useCallback`) is called recursively inside itself via `setTimeout`, but the closure captures a stale reference.

**Fix:** Use a ref to hold the latest version of the function:

```tsx
const pollPdfStatusRef = useRef<() => void>(() => {});

const pollPdfStatus = useCallback(async () => {
  // ...existing logic...
  setTimeout(() => {
    pollPdfStatusRef.current(); // call via ref, always fresh
  }, Math.min(retryAfter * 1000, 10000));
}, [invoiceId, isReady, maxRetries, retryCount]);

// Keep ref in sync:
useEffect(() => {
  pollPdfStatusRef.current = pollPdfStatus;
}, [pollPdfStatus]);
```

---

### `components/providers/toast-provider.tsx` — L11

**Rule:** `react-hooks/set-state-in-effect`
**Issue:** `setIsMounted(true)` is called synchronously inside a `useEffect`, causing an immediate cascade re-render.

**Fix:** If `isMounted` is only used to skip SSR rendering, consider initializing lazily or using `useLayoutEffect`. For most cases, the pattern is fine but can be simplified to avoid the warning by deriving the mounted state from a ref instead:

```tsx
const isMounted = useRef(false);
useEffect(() => { isMounted.current = true; }, []);
```

Or if you truly need reactive state, accept the warning with a targeted disable comment if the linter rule is too strict here.

---

### `components/ui/select.tsx` — L75

**Rule:** `react-hooks/set-state-in-effect`
**Issue:** `setSearchTerm("")` is called synchronously in an effect when `isOpen` becomes false.

**Fix:** Reset `searchTerm` in the event handler that closes the dropdown, not in an effect:

```tsx
const handleClose = () => {
  setIsOpen(false);
  setSearchTerm(""); // reset here instead
};
```

---

### `components/ui/toast.tsx` — L54

**Rule:** `react-hooks/set-state-in-effect`
**Issue:** `setMsgDuration(calcDuration)` is called synchronously in an effect.

**Fix:** Compute `msgDuration` during render — no `useState` or `useEffect` needed:

```tsx
const msgDuration = toast.duration ?? Math.max(5000, (toast.message?.length || 0) * 50);
```

---

### Missing `useEffect` dependencies

**Rule:** `react-hooks/exhaustive-deps`

| File | Line | Missing deps |
|------|------|-------------|
| `app/(marketing)/shipping-estimate/page.tsx` | L273 | `formik.values`, `router`, `searchParams` |
| `app/app/shipments/new/verify/page.tsx` | L66 | `handleVerify` |
| `components/shipment/package-form.tsx` | L152 | `onSync` |
| `components/account/VerifyPhoneModal.tsx` | L40 | `handleSendOTP`, `tempPhone` |

**Fix for each:** Add the missing values to the dependency array. For functions (`handleVerify`, `onSync`, `handleSendOTP`) that may change on every render, wrap their definitions in `useCallback` first to stabilize them, then include in deps.

---

### `components/invoice/InvoicesSidebar.tsx` — L47

**Rule:** `react-hooks/exhaustive-deps`
**Issue:** The `invoices` logical expression causes `useMemo` dependencies to change on every render.

**Fix:** Move the `invoices` initialization inside the `useMemo` callback, or wrap it in its own `useMemo` first:

```tsx
const invoices = useMemo(() => rawInvoices ?? [], [rawInvoices]);
// then use `invoices` as a dep in the second useMemo
```

---

## 5. Other Errors

---

### `components/shipment/address-form.tsx` — L81
### `components/shipment/customs-form.tsx` — L98

**Rule:** `prefer-const`
**Issue:** `formikErrors` is declared with `let` but never reassigned.

**Fix:** Change `let formikErrors` to `const formikErrors` in both files.

---

### `components/ui/input.tsx` — L5
### `components/ui/password-input.tsx` — L8

**Rule:** `@typescript-eslint/no-empty-object-type`
**Issue:** An interface declaring no members is equivalent to its supertype.

**Fix:** Replace the empty interface with a type alias:

```ts
// Before:
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

// After:
type InputProps = React.InputHTMLAttributes<HTMLInputElement>;
```

Or add at least one custom prop to justify keeping the interface.

---

### `app/(marketing)/track-shipment/[id]/page.tsx` — L82
### `app/(marketing)/track-shipment/page.tsx` — L67

**Rule:** `unused eslint-disable directive`
**Issue:** A `// eslint-disable-next-line @typescript-eslint/no-explicit-any` comment exists, but there is no `any` violation on the following line anymore.

**Fix:** Delete the `// eslint-disable-next-line` comment in both files.

---

### `patch_page.js` — L1, L2

**Rule:** `@typescript-eslint/no-require-imports`
**Issue:** `require()` style imports are forbidden by the ESLint config.

**Fix:** Convert to ES module imports. Either:
- Rename the file to `patch_page.mjs` and use `import` syntax, or
- Add `"type": "module"` to `package.json`, or
- Add a targeted disable comment if this is intentionally a legacy CommonJS script:

```js
// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require('fs');
```
