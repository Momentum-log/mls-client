# Implementation Task List: Invoice UI & Account Verification Enhancement

**PRD Reference:** [Invoice UI & Account Verification Enhancement](../prd/prd-invoice-verification-enhancement.md)  
**Version:** 1.0  
**Status:** Not Started  
**Last Updated:** April 17, 2026

---

## Relevant Files

### Components (New & Modified)

- `components/shipment/account-verification-modal.tsx` - New non-dismissible modal for account verification
- `components/invoice/invoice-side-drawer.tsx` - Enhanced invoice UI with improved layout and spacing
- `components/shipment/customs-form.tsx` - Modified to integrate verification modal and form blocking logic
- `components/invoice/invoice-details.tsx` - Modified to auto-populate from user/shipment data (if exists)

### Hooks & Stores

- `hooks/useAuth.ts` - Reference for user authentication context
- `store/shipment-store.ts` - Reference for shipment data
- `hooks/shipments/useVerification.ts` - New hook for verification state and logic

### Utilities

- `utils/verification-helpers.ts` - New utility functions for account verification checks

### Types

- `types/verification.ts` - New types for verification modal and validation logic

### Styling

- `app/globals.css` - Reference for CSS variables and design system

---

## Tasks

### Phase 1: Foundation & Setup

- [ ] 0.0: Create feature branch
  - [ ] 0.1: Create branch `feature/invoice-verification-enhancement`
  - [ ] 0.2: Pull latest changes from main

- [ ] 1.0: Set up verification types and utilities
  - [ ] 1.1: Create `types/verification.ts` with verification state types
  - [ ] 1.2: Create `utils/verification-helpers.ts` with validation functions
  - [ ] 1.3: Create `hooks/shipments/useVerification.ts` hook for verification logic

### Phase 2: Account Verification Modal

- [ ] 2.0: Create Account Verification Modal component
  - [ ] 2.1: Create `components/shipment/account-verification-modal.tsx`
  - [ ] 2.2: Implement modal structure (non-dismissible, no close button)
  - [ ] 2.3: Add verification messaging and icon/visual context
  - [ ] 2.4: Add primary CTA button that routes to account settings
  - [ ] 2.5: Ensure responsive design (mobile & desktop)
  - [ ] 2.6: Style using design system variables (no hardcoded colors)

- [ ] 3.0: Integrate modal into Shipment Creation Flow
  - [ ] 3.1: Import modal into `components/shipment/customs-form.tsx`
  - [ ] 3.2: Add verification check logic before form render
  - [ ] 3.3: Display modal when user is unverified or missing address
  - [ ] 3.4: Block all form inputs when modal is displayed
  - [ ] 3.5: Test modal appearance and routing

### Phase 3: Invoice UI Enhancement

- [ ] 4.0: Enhance Invoice Side Drawer Layout
  - [ ] 4.1: Review current `components/invoice/invoice-side-drawer.tsx`
  - [ ] 4.2: Restructure layout with improved visual hierarchy
  - [ ] 4.3: Add consistent padding and margins using CSS variables
  - [ ] 4.4: Improve typography and font sizing (headers, labels, values)
  - [ ] 4.5: Add visual separation between sections (dividers/background colors)
  - [ ] 4.6: Ensure mobile responsiveness (test on small screens)
  - [ ] 4.7: Verify styling uses only CSS variables from `globals.css`

### Phase 4: Invoice Data Population

- [ ] 5.0: Implement Auto-Population Logic
  - [ ] 5.1: Review invoice component structure in `components/invoice/`
  - [ ] 5.2: Create or modify invoice details component to accept user/shipment data
  - [ ] 5.3: Implement user name population ("To" recipient field)
  - [ ] 5.4: Implement user address population (from user account data)
  - [ ] 5.5: Set service name to "Logistics" label
  - [ ] 5.6: Generate dynamic service description based on user name
  - [ ] 5.7: Populate quantity field from `shipment.items.length`
  - [ ] 5.8: Populate pricing fields (net, tax/VAT, total) from shipment data
  - [ ] 5.9: Handle missing user data gracefully (no errors, field omission/placeholders)

### Phase 5: Client-Side Verification & Validation

- [ ] 6.0: Implement Verification & Validation Logic
  - [ ] 6.1: Implement `useVerification` hook to check email verification status
  - [ ] 6.2: Implement address completion check logic
  - [ ] 6.3: Add client-side validation before shipment creation form submission
  - [ ] 6.4: Display modal if user is unverified or missing address
  - [ ] 6.5: Prevent form submission when verification conditions are not met
  - [ ] 6.6: Enable form submission only after verification + address completion

- [ ] 7.0: Integrate Account Page Email Verification Flow
  - [ ] 7.1: Ensure account page triggers email verification endpoint on demand
  - [ ] 7.2: Ensure OTP flow works end-to-end
  - [ ] 7.3: Ensure address update flow works end-to-end
  - [ ] 7.4: Test automatic re-validation after user completes verification

### Phase 6: Testing & Validation

- [ ] 8.0: Manual Testing
  - [ ] 8.1: Test modal display for new users (unverified email)
  - [ ] 8.2: Test modal display for returning users (incomplete address)
  - [ ] 8.3: Test non-dismissible behavior (no close button, overlay click blocked)
  - [ ] 8.4: Test CTA button routing to account page
  - [ ] 8.5: Test email verification flow from account page
  - [ ] 8.6: Test address update flow from account page
  - [ ] 8.7: Test automatic re-validation after verification completion
  - [ ] 8.8: Test invoice display with full user/shipment data
  - [ ] 8.9: Test invoice display with partial/missing user data (graceful fallback)
  - [ ] 8.10: Test invoice layout on mobile and desktop viewports
  - [ ] 8.11: Test form blocking while modal is displayed
  - [ ] 8.12: Verify no console errors or validation failures

- [ ] 9.0: Browser & Device Testing
  - [ ] 9.1: Test on Chrome/Firefox/Safari (desktop)
  - [ ] 9.2: Test on mobile devices (iOS/Android)
  - [ ] 9.3: Test responsive breakpoints for invoice and modal

### Phase 7: Documentation & Finalization

- [ ] 10.0: Update Documentation
  - [ ] 10.1: Update `changelog.md` with feature summary
  - [ ] 10.2: Add inline JSDoc comments to new components/hooks/utilities
  - [ ] 10.3: Update `README.md` if necessary with feature description

- [ ] 11.0: Code Quality & Pre-Commit
  - [ ] 11.1: Run type check: `bunx tsc --noEmit` (must pass)
  - [ ] 11.2: Run linting: `bun run lint` (must pass)
  - [ ] 11.3: Start dev server: `bun run dev` (must start without errors)
  - [ ] 11.4: Verify all tests pass (if applicable)

- [ ] 12.0: Final Review & Merge
  - [ ] 12.1: Review all changes for code quality and adherence to guidelines
  - [ ] 12.2: Ensure backward compatibility (existing invoices still work)
  - [ ] 12.3: Create PR with detailed description
  - [ ] 12.4: Address any review feedback
  - [ ] 12.5: Merge feature branch to main

---

## Implementation Notes

### Key Considerations

1. **Non-Dismissible Modal:** Use overlay click prevention and no close button (X).
2. **Form Blocking:** All inputs and submit button should be disabled while modal is displayed.
3. **Data Binding:** Use `useAuth()` hook for user profile data and shipment store for shipment details.
4. **Graceful Degradation:** Handle missing user fields without console errors or crashes.
5. **Design System:** All styling must use CSS variables from `globals.css` (no hardcoded colors or values).

### Dependencies

- Existing `useAuth()` hook for user data
- `shipment-store` for shipment context
- Email verification endpoint (already exists)
- Account page implementation (already exists)

### Backward Compatibility

- Invoice data re-population is display-only; no changes to stored data structure
- Existing invoices will gracefully degrade if user data is unavailable
- No breaking changes to API or database

---

## Progress Tracking

**Completion Rate:** 0% (0/12 parent tasks completed)

---

## Questions & Blockers

- [ ] Does account page have email verification endpoint ready?
- [ ] Is address field mandatory or optional for shipment creation?
- [ ] Should modal redirect to account page, or open settings in a nested view?
- [ ] Are there any existing email verification OTP flows to integrate with?
