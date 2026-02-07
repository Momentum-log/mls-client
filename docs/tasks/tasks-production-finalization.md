## Relevant Files

- `components/account/VerificationBanner.tsx` - Banner for unverified users; needs to reflect that only email verification is mandatory.
- `app/app/shipments/new/page.tsx` - Shipment creation main page; check for phone verification requirements.
- `app/app/shipments/new/verify/page.tsx` - Specific verification step; check for redundant phone prompts.
- `components/layout/header.tsx` - Site header; fix mobile navigation "Login" button logic.
- `components/ui/action-menu.tsx` - Action menu component; implement auto-sizing and left-alignment.
- `app/(marketing)/login/page.tsx` - Login page; adjust padding.
- `app/(marketing)/register/page.tsx` - Registration page; adjust padding.
- `components/layout/footer.tsx` - Site footer; add links to policy pages.
- `app/(marketing)/terms/page.tsx` - [NEW] Terms and Conditions page.
- `app/(marketing)/privacy/page.tsx` - [NEW] Privacy Policy page.
- `app/(marketing)/cookies/page.tsx` - [NEW] Cookie Policy page.
- `docs/phone-verification-client-guide.md` - Technical documentation for phone verification.

### Notes

- **Policy Pages**: Use standard legal placeholder text as requested (1A).
- **Mobile Navigation**: Remove "Login" button entirely for authenticated users (2A).
- **Action Menu**: Implement auto-sizing based on content and ensure left-alignment (4B).
- **Strict Styling**: Follow `GEMINI.md` rules - NO GRADIENTS, use solid colors from `global.css`.

## Instructions for Completing Tasks

**IMPORTANT:** As you complete each task, you must check it off in this markdown file by changing `- [ ]` to `- [x]`. This helps track progress and ensures you don't skip any steps.

Update the file after completing each sub-task.

## Tasks

### Verification Requirements

- [x] VR00: Phone verification mandate removal
  - [x] VR01: Remove `is_phone_verified` block from shipment creation flow in `app/app/shipments/new/page.tsx` and nested directories.
  - [x] VR02: Update `VerificationBanner.tsx` to only warn about email verification as a mandate to create shipments.
  - [x] VR03: Ensure the `VerifyPhoneModal` is still available in Profile or optional areas but not blocking.
  - [x] VR04: Verify the registration flow adds a phone number but doesn't force verification.

### Policy Pages

- [x] PP00: Policy pages implementation
  - [x] PP01: Create `/app/(marketing)/terms/page.tsx` with placeholder content.
  - [x] PP02: Create `/app/(marketing)/privacy/page.tsx` with placeholder content.
  - [x] PP03: Create `/app/(marketing)/cookies/page.tsx` with placeholder content.
  - [x] PP04: Add links to the footer in `components/layout/footer.tsx`.

### UI and Layout Fixes

- [ ] UI00: UI polish and navigation logic fixes
  - [ ] UI01: Reduce excessive padding in `app/(marketing)/login/page.tsx`.
  - [ ] UI02: Reduce excessive padding in `app/(marketing)/register/page.tsx`.
  - [x] UI03: Update `ActionMenu.tsx` to allow `width: auto` (or removal of `w-48`) and `text-align: left`.
  - [x] UI04: Ensure Shipment page action menu items display on a single line.
  - [x] UI05: In `components/layout/header.tsx`, hide the "Login" button in the mobile menu when `isAuthenticated` is true.

### Maintenance & Documentation

- [ ] MA00: Documentation and final checks
  - [ ] MA01: Update `docs/phone-verification-client-guide.md` to note optional status.
  - [x] MA02: Run `bunx tsc --noEmit` to verify type safety.
  - [x] MA03: Update `changelog.md` with version `1.28.0` (Minor change).
