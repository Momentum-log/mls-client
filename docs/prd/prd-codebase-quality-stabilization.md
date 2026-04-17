# PRD: Codebase Quality Stabilization (Zero Lint, Zero Warnings)

**Feature Name:** Codebase Quality Stabilization  
**Version:** 1.0.0  
**Date:** 2026-04-12  
**Priority:** Urgent  
**Status:** Draft for Implementation

---

## 1. Introduction / Overview

This PRD defines a complete remediation plan to make the currently lint-reported codebase clean and stable: no ESLint errors, no ESLint warnings, no TypeScript errors, successful production build, and no key runtime warnings in major user flows.

The current baseline (from latest attached lint output) is **175 problems**: **109 errors** and **66 warnings**. The target is to resolve every issue in the currently reported file scope.

This work is a quality hardening initiative, not a feature delivery effort. It focuses on correctness, type safety, React rule compliance, and prevention of future regressions.

---

## 2. Goals

1. Reduce ESLint findings from 175 to 0 (`bun run lint` passes with no warnings or errors).
2. Ensure `bunx tsc --noEmit` passes with zero errors.
3. Ensure `bun run build` succeeds.
4. Validate core flows (auth, shipments, invoices, tracking) without console/runtime warnings.
5. Remove existing `any` usage in current lint scope and enforce strict typing patterns for future changes.
6. Add regression guardrails so new warnings fail checks early.

---

## 3. User Stories

- As a developer, I want lint and type checks to be clean so I can merge confidently.
- As a developer, I want consistent type-safe patterns instead of `any` so I can change code without hidden breakage.
- As a developer, I want React hook and purity rules satisfied so UI behavior is stable across renders.
- As a product team member, I want key user flows to run without console/runtime warnings so releases are reliable.
- As a maintainer, I want CI and standards to prevent reintroducing warnings after cleanup.

---

## 4. Features / Tasks

### Baseline & Execution Strategy

- **BS01:** Treat the latest `bun run lint` output as source of truth for scope (Option 2A: currently reported files only).
- **BS02:** Execute fixes in risk-ordered phases with hard validation gates after each phase (Option 7D).
- **BS03:** Keep behavior-preserving refactors as default; allow deeper refactor only when required to satisfy rules cleanly (Option 4B + 4D).
- **BS04:** Create a remediation checklist artifact mapping each file/rule pair to done status.

### Unused Variables / Imports Cleanup (`UV`)

- **UV01:** Resolve `@typescript-eslint/no-unused-vars` in `api/index.ts`, `app/(marketing)/contact/page.tsx`, `app/(marketing)/login/page.tsx`, `app/(marketing)/register/page.tsx`.
- **UV02:** Resolve unused warnings in marketing shipping and tracking files: `app/(marketing)/shipping-estimate/page.tsx`, `app/(marketing)/shipping-estimate/utils.ts`, `app/(marketing)/track-shipment/[id]/page.tsx`, `app/(marketing)/track-shipment/page.tsx`.
- **UV03:** Resolve unused warnings in app-area shipment/invoice files: `app/app/invoices/[id]/page.tsx`, `app/app/shipments/new/package/page.tsx`, `app/app/shipments/new/service/page.tsx`, `app/app/shipments/new/summary/page.tsx`, `app/app/shipments/new/verify/page.tsx`, `app/app/track/page.tsx`.
- **UV04:** Resolve unused warnings in account/auth/home/about components: `components/about/vision-showcase.tsx`, `components/account/ChangePasswordForm.tsx`, `components/account/LogoutAction.tsx`, `components/account/ProfileForm.tsx`, `components/account/VerificationBanner.tsx`, `components/auth/login-form.tsx`, `components/auth/register-form.tsx`, `components/home/heavy-freight-section.tsx`.
- **UV05:** Resolve unused warnings in invoice/shared/shipment/ui/hooks/store/utils files: `components/invoice/InvoiceListPage.tsx`, `components/invoice/InvoicePreview.tsx`, `components/invoice/InvoiceReceiptView.tsx`, `components/invoice/InvoiceSummaryNew.tsx`, `components/invoice/InvoicesSidebar.tsx`, `components/shared/address-fields.tsx`, `components/shared/country-detector.tsx`, `components/shipment/customs-form.tsx`, `components/shipment/package-form.tsx`, `components/shipment/service-selection.tsx`, `components/shipping/estimate-form.tsx`, `components/ui/select.tsx`, `hooks/invoices/use-invoices.ts`, `hooks/shipments/use-duplicate-shipment.ts`, `store/shipment-store.ts`, `utils/error-handler.ts`, `utils/invoice-helper.ts`, `patch_page.js`.

### Explicit `any` Elimination & Type Hardening (`TY`)

- **TY01:** Replace all lint-reported `any` usages with concrete types, `unknown`, or type guards in API and app route files: `api/index.ts`, `app/app/layout.tsx`, `app/app/shipments/new/destination/page.tsx`, `app/app/shipments/new/origin/page.tsx`, `app/app/shipments/new/summary/page.tsx`, `app/app/shipments/new/verify/page.tsx`, `app/app/track/page.tsx`, `app/auth/forgot-password/page.tsx`, `app/(marketing)/shipping-estimate/page.tsx`.
- **TY02:** Remove `any` from account and auth components using typed form helpers and typed error handling: `components/account/ChangePasswordForm.tsx`, `components/account/EmailChangeModal.tsx`, `components/account/ProfileForm.tsx`, `components/account/VerificationBanner.tsx`, `components/account/VerifyEmailModal.tsx`, `components/account/VerifyPhoneModal.tsx`, `components/auth/login-form.tsx`, `components/auth/profile-form.tsx`, `components/auth/register-form.tsx`.
- **TY03:** Remove `any` from invoice/shared/shipment/ui components using typed interfaces and formik types: `components/invoice/InvoiceListPage.tsx`, `components/shared/address-fields.tsx`, `components/shipment/address-form.tsx`, `components/shipment/customs-form.tsx`, `components/shipment/package-form.tsx`, `components/shipping/estimate-form.tsx`, `components/ui/phone-input.tsx`.
- **TY04:** Remove `any` from hooks/types/utils: `hooks/invoices/useInvoiceUpdateFlow.ts`, `hooks/shipments/use-duplicate-shipment.ts`, `hooks/useNotification.ts`, `types/auth.ts`, `utils/error-handler.ts`, `utils/shipment-helper.ts`.
- **TY05:** Introduce or refine shared type utilities and domain interfaces in `types/` and `utils/` to prevent repeated local `any` reintroduction.
- **TY06:** Enforce project policy: no new `any` without explicit justification and review exception.

### JSX Unescaped Entities Cleanup (`JE`)

- **JE01:** Auto-fix and manually verify all `react/no-unescaped-entities` violations in marketing pages: `app/(marketing)/contact/page.tsx`, `app/(marketing)/cookies/page.tsx`, `app/(marketing)/privacy/page.tsx`, `app/(marketing)/terms/page.tsx`, `app/(marketing)/shipping-estimate/page.tsx`.
- **JE02:** Resolve unescaped entities in shipment and invoice app pages: `app/app/shipments/new/verify/page.tsx`, `app/app/shipments/payment-success/page.tsx`, `components/invoice/InvoiceReceiptNew.tsx`.
- **JE03:** Resolve unescaped entities in about/account/home/shipment components: `components/about/about-hero.tsx`, `components/about/mission-vision.tsx`, `components/account/EmailChangeModal.tsx`, `components/account/VerifyEmailModal.tsx`, `components/home/heavy-freight-section.tsx`, `components/shipment/package-form.tsx`, `components/shipment/service-selection.tsx`.

### React Rules & Architectural Compliance (`RH`)

- **RH01:** Fix render purity errors (`react-hooks/purity`) by removing impure runtime calls from render path in `components/about/global-network-showcase.tsx` and `components/invoice/InvoiceReceiptView.tsx`.
- **RH02:** Fix static component creation during render (`react-hooks/static-components`) in `components/invoice/InvoicesListNew.tsx` by extracting render-time component declarations.
- **RH03:** Fix access-before-declaration/immutability issues (`react-hooks/immutability`) in `components/account/VerifyPhoneModal.tsx` and `hooks/invoices/usePdfStatus.ts`.
- **RH04:** Fix synchronous setState-in-effect rule violations (`react-hooks/set-state-in-effect`) in `components/providers/toast-provider.tsx`, `components/ui/select.tsx`, and `components/ui/toast.tsx`.
- **RH05:** Resolve exhaustive dependency warnings (`react-hooks/exhaustive-deps`) in `app/(marketing)/shipping-estimate/page.tsx`, `app/app/shipments/new/verify/page.tsx`, `components/shipment/package-form.tsx`, `components/account/VerifyPhoneModal.tsx`, `components/invoice/InvoicesSidebar.tsx`.

### Other Rule Fixes (`OR`)

- **OR01:** Resolve `prefer-const` in `components/shipment/address-form.tsx` and `components/shipment/customs-form.tsx`.
- **OR02:** Resolve `@typescript-eslint/no-empty-object-type` in `components/ui/input.tsx` and `components/ui/password-input.tsx` by replacing empty interfaces with type aliases or meaningful props.
- **OR03:** Remove unused eslint-disable directives in `app/(marketing)/track-shipment/[id]/page.tsx` and `app/(marketing)/track-shipment/page.tsx`.
- **OR04:** Resolve `@typescript-eslint/no-require-imports` and unused symbol issues in `patch_page.js` via ESM migration or controlled lint-compliant strategy.
- **OR05:** Handle baseline mapping warning (`baseline-browser-mapping`) by refreshing dev dependency and verifying no side effects.

### Validation Gates & Definition of Done (`VG`)

- **VG01:** Phase gate 1 (low risk): remove auto-fixable entities, `prefer-const`, obvious unused imports/vars.
- **VG02:** Phase gate 2 (medium risk): explicit typing replacements and shared type extraction.
- **VG03:** Phase gate 3 (higher risk): React architectural rule remediation (purity, static-components, effect rules).
- **VG04:** Run validation after each phase: `bun run lint`, `bunx tsc --noEmit`, `bun run build`.
- **VG05:** Run smoke checks for key flows (Option 8D): auth, shipment creation/update, invoice actions (pay/download/email), tracking.
- **VG06:** Completion criterion: all checks pass and lint output is exactly zero warnings and zero errors.

### Regression Prevention & Standards (`RP`)

- **RP01:** Update CI or pre-merge checks to fail on warnings (not only errors).
- **RP02:** Add a short internal coding standard note for error typing (`unknown` + narrowing), form helper typing, and React effect patterns.
- **RP03:** Add a remediation summary in documentation with before/after metrics and recurring anti-pattern examples.

---

## 5. Non-Goals (Out of Scope)

User selection for this PRD is effectively no exclusions within the scoped lint-reported files. To keep delivery focused, the following remain non-goals unless directly required to clear an in-scope lint/type issue:

- Net-new product features.
- UI redesign unrelated to lint/type/react rule remediation.
- Backend contract redesigns not required for type correctness in current scope.
- Repository-wide refactors outside currently reported lint files.

---

## 6. Design Considerations (Optional)

- Preserve existing user-facing behavior and visual output while remediating quality issues.
- Keep edits localized and minimal where possible.
- For unavoidable refactors (React architecture rules), prefer the least disruptive structure that satisfies lint and runtime stability.

---

## 7. Technical Considerations (Optional)

- Package manager and scripts must use Bun (`bun run ...`, `bunx ...`).
- All local imports should continue to use `@/` alias conventions where applicable.
- Use strong typing patterns:
  - `unknown` for catch errors + type narrowing.
  - `FormikHelpers<T>`, `FormikErrors<T>`, `FormikTouched<T>` where applicable.
  - Domain interfaces in `types/` for API and UI payloads.
- React lint rules in scope are correctness-sensitive and should not be bypassed with broad disable comments.
- Any necessary lint disable must be narrowly scoped and justified in code comments.

---

## 8. Success Metrics

- `bun run lint` returns 0 problems.
- `bunx tsc --noEmit` returns exit code 0.
- `bun run build` returns exit code 0.
- Smoke test checklist passes for:
  - Auth: login, register, forgot password.
  - Shipments: create, verify, summary, update where applicable.
  - Invoices: list, detail, pay, download PDF, send email.
  - Tracking: search and details routes.
- No runtime console warnings/errors in these key flows.

---

## 9. Open Questions

1. Should lint warnings be enforced as hard CI failures immediately, or in two steps (advisory first, then hard fail after remediation merge)?
2. For `patch_page.js`, do we standardize on ESM conversion now, or keep CommonJS with narrowly scoped lint exception?
3. Should smoke checks be manual QA scripts only, or converted into automated E2E coverage in a follow-up quality epic?

---

## Appendix A: In-Scope Rule Families (From Current Lint Output)

- `@typescript-eslint/no-unused-vars`
- `@typescript-eslint/no-explicit-any`
- `react/no-unescaped-entities`
- `react-hooks/purity`
- `react-hooks/static-components`
- `react-hooks/immutability`
- `react-hooks/set-state-in-effect`
- `react-hooks/exhaustive-deps`
- `prefer-const`
- `@typescript-eslint/no-empty-object-type`
- `@typescript-eslint/no-require-imports`
- `unused eslint-disable directive`

This appendix is intentionally aligned to the current lint-reported scope only.
