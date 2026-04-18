## Relevant Files

- `docs/prd/prd-codebase-quality-stabilization.md` - Source requirements and acceptance criteria for this hardening effort.
- `docs/lint-errors-reference.md` - Master reference of current lint findings by file and rule family.
- `changelog.md` - Release notes for the remediation work.
- `api/index.ts` - API client typing and unused import cleanup.
- `app/app/layout.tsx` - Explicit type hardening in app shell props/state.
- `app/(marketing)/shipping-estimate/page.tsx` - Mixed issues: explicit `any`, hook dependencies, and unescaped entities.
- `app/app/shipments/new/verify/page.tsx` - Explicit `any`, hook deps, and unescaped entities.
- `app/app/shipments/payment-success/page.tsx` - Unescaped entity cleanup.
- `components/about/global-network-showcase.tsx` - React purity fixes (`Math.random` in render).
- `components/invoice/InvoicesListNew.tsx` - Static component extraction from render path.
- `components/invoice/InvoiceReceiptView.tsx` - Purity fix (`Date.now`) and typing/unused cleanup.
- `components/account/VerifyPhoneModal.tsx` - Access-before-declaration and deps stabilization.
- `hooks/invoices/usePdfStatus.ts` - Hook immutability and callback freshness fixes.
- `components/providers/toast-provider.tsx` - set-state-in-effect compliance.
- `components/ui/select.tsx` - set-state-in-effect compliance and unused import cleanup.
- `components/ui/toast.tsx` - set-state-in-effect refactor.
- `components/ui/input.tsx` - `no-empty-object-type` remediation.
- `components/ui/password-input.tsx` - `no-empty-object-type` remediation.
- `types/auth.ts` - Core auth type hardening to eliminate downstream `any` usage.
- `utils/error-handler.ts` - Error narrowing/type-guard cleanup for `unknown` handling.
- `patch_page.js` - `no-require-imports` and unused symbol remediation.
- `hooks/useNotification.ts` - Hook type hardening and explicit `any` removal.
- `components/shared/address-fields.tsx` - Form typing and unused variable cleanup.
- `components/shipment/customs-form.tsx` - Form typing and `prefer-const` cleanup.
- `components/shipment/address-form.tsx` - Form typing and `prefer-const` cleanup.
- `components/ui/select.test.tsx` - Add/update tests for select closing/reset behavior if effect logic is refactored.
- `components/ui/toast.test.tsx` - Add/update tests for computed duration behavior after state/effect refactor.
- `hooks/invoices/usePdfStatus.test.ts` - Add/update tests for polling recursion and callback freshness.
- `components/invoice/InvoicesListNew.test.tsx` - Add/update tests for stable sort indicator rendering behavior.

### Notes

- This task list intentionally skips branch creation per user request.
- Scope is limited to files currently reported by the latest lint output and reflected in `docs/lint-errors-reference.md`.
- Keep `docs/prd/*`, `docs/tasks/*`, and `docs/lint-errors-reference.md` out of the final commit.
- Use Bun commands for verification: `bun run lint`, `bunx tsc --noEmit`, `bun run build`.
- If `bun run lint -- --fix` changes many files, re-run full lint and validate each changed rule family before proceeding.

## Instructions for Completing Tasks

**IMPORTANT:** As you complete each task, you must check it off in this markdown file by changing `- [ ]` to `- [x]`.

Update this file after completing each sub-task, not only after finishing a full parent task.

## Tasks

### Baseline and Scope Lock

- [ ] QS00: Lock remediation scope and baseline metrics from current lint output
  - [ ] QS01: Re-run `bun run lint` and capture current totals (errors and warnings) as the implementation baseline.
  - [ ] QS02: Confirm in-scope file set using `docs/lint-errors-reference.md` and latest lint output; flag any drift.
  - [ ] QS03: Create a working remediation checklist grouped by rule family (`no-unused-vars`, `no-explicit-any`, `react-hooks/*`, etc.).
  - [ ] QS04: Prioritize fixes by risk level (low-risk autofix first, then type and architectural changes).

### Auto-fix and Low-Risk Cleanup

- [ ] QS10: Apply safe auto-fixes and clear straightforward unused import/variable findings
  - [ ] QS11: Run `bun run lint -- --fix` and record which findings were auto-resolved.
  - [ ] QS12: Resolve remaining `@typescript-eslint/no-unused-vars` in `api/` and `app/(marketing)/` files.
  - [ ] QS13: Resolve remaining `@typescript-eslint/no-unused-vars` in `app/app/` shipment and invoice pages.
  - [ ] QS14: Resolve remaining `@typescript-eslint/no-unused-vars` in `components/`, `hooks/`, `store/`, `utils/`, and `patch_page.js`.
  - [ ] QS15: Re-run lint and ensure no behavior-affecting code paths were removed accidentally.

### Type Safety Hardening

- [ ] QS20: Eliminate all explicit any usage with strict typed interfaces, unknown narrowing, and shared type utilities
  - [ ] QS21: Replace explicit `any` in `api/` and `app/` route/page files with concrete types or `unknown` + narrowing.
  - [ ] QS22: Replace Formik-related `any` with `FormikHelpers<T>`, `FormikErrors<T>`, and `FormikTouched<T>` where applicable.
  - [ ] QS23: Harden account/auth/invoice/shared/shipment component types listed in lint scope.
  - [ ] QS24: Harden hook and utility types in `hooks/useNotification.ts`, `hooks/invoices/useInvoiceUpdateFlow.ts`, `hooks/shipments/use-duplicate-shipment.ts`, `utils/error-handler.ts`, and `utils/shipment-helper.ts`.
  - [ ] QS25: Update foundational auth and domain types in `types/auth.ts` (and related shared interfaces) to prevent downstream fallback to `any`.
  - [ ] QS26: Re-run lint and `bunx tsc --noEmit` and verify explicit `any` count is zero.

### JSX Entity Compliance

- [ ] QS30: Resolve all JSX unescaped entity violations and verify no UI text regressions
  - [ ] QS31: Fix apostrophe entity violations in marketing, shipment, invoice, about, account, and home components from lint report.
  - [ ] QS32: Fix quote entity violations in `cookies`, `privacy`, `terms`, and shipment verify pages.
  - [ ] QS33: Manually review updated UI copy to ensure readability and no accidental text changes.

### React Rule Stabilization

- [ ] QS40: Fix React purity, static-components, immutability, set-state-in-effect, and exhaustive-deps violations
  - [ ] QS41: Resolve `react-hooks/purity` by removing impure calls from render in `components/about/global-network-showcase.tsx` and `components/invoice/InvoiceReceiptView.tsx`.
  - [ ] QS42: Resolve `react-hooks/static-components` in `components/invoice/InvoicesListNew.tsx` by hoisting render-defined components.
  - [ ] QS43: Resolve `react-hooks/immutability` and declaration-order issues in `components/account/VerifyPhoneModal.tsx` and `hooks/invoices/usePdfStatus.ts`.
  - [ ] QS44: Resolve `react-hooks/set-state-in-effect` in `components/providers/toast-provider.tsx`, `components/ui/select.tsx`, and `components/ui/toast.tsx`.
  - [ ] QS45: Resolve `react-hooks/exhaustive-deps` findings in all listed pages/components and stabilize callbacks with `useCallback` where needed.

### Rule-Specific Remediation

- [ ] QS50: Resolve remaining rule violations (prefer-const, no-empty-object-type, no-require-imports, unused eslint-disable)
  - [ ] QS51: Fix `prefer-const` in `components/shipment/address-form.tsx` and `components/shipment/customs-form.tsx`.
  - [ ] QS52: Fix `@typescript-eslint/no-empty-object-type` in `components/ui/input.tsx` and `components/ui/password-input.tsx`.
  - [ ] QS53: Remove unused eslint-disable directives in tracking pages under `app/(marketing)/track-shipment/`.
  - [ ] QS54: Fix `@typescript-eslint/no-require-imports` and related unused symbol issues in `patch_page.js`.
  - [ ] QS55: Update stale baseline data package (`baseline-browser-mapping`) and confirm warning is cleared.

### Validation Gate 1

- [ ] QS60: Pass lint with zero errors and zero warnings
  - [ ] QS61: Run `bun run lint` and confirm output is exactly zero problems.
  - [ ] QS62: If lint is non-zero, iterate by rule family until it reaches zero.
  - [ ] QS63: Capture final lint summary in implementation notes for handoff.

### Validation Gate 2

- [ ] QS70: Pass TypeScript no-emit checks and production build
  - [ ] QS71: Run `bunx tsc --noEmit` and resolve any regressions.
  - [ ] QS72: Run `bun run build` and resolve any compile/runtime build warnings.
  - [ ] QS73: Re-run lint and type-check after build fixes to ensure no regression.

### Runtime Flow Verification

- [ ] QS80: Execute smoke checks for auth, shipments, invoices, and tracking with no runtime warnings/errors
  - [ ] QS81: Smoke-test auth flows: register, login, forgot password.
  - [ ] QS82: Smoke-test shipments flows: origin/destination/package/service/summary/verify.
  - [ ] QS83: Smoke-test invoice flows: list, detail, pay, PDF download, send email.
  - [ ] QS84: Smoke-test tracking flows: track entry and detail page.
  - [ ] QS85: Verify browser console is free from warnings/errors in all checked flows.

### Commit and Handoff

- [ ] QS90: Commit remediation changes while excluding PRD, tasks, and lint-reference documentation files from commit scope
  - [ ] QS91: Update `changelog.md` with remediation release notes and validation outcomes.
  - [ ] QS92: Stage all remediation code files while explicitly excluding `docs/prd/*`, `docs/tasks/*`, and `docs/lint-errors-reference.md`.
  - [ ] QS93: Verify staged diff does not include excluded docs.
  - [ ] QS94: Commit with a quality-remediation message that references zero-lint/zero-warning completion.
  - [ ] QS95: Prepare handoff summary with commands run and final gate results.
