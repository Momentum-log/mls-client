# Tasks: Phone Verification & Dual Login

## Relevant Files

- `types/auth.ts` - Define new payload types and update the `User` interface.
- `api/auth/index.ts` - Add `sendPhoneOTP` and `verifyPhoneOTP` API functions.
- `hooks/auth/use-auth.ts` - Implement React Query hooks for OTP management.
- `components/auth/login-form.tsx` - Update the login form to accept Email or Phone.
- `components/auth/register-form.tsx` - Add mandatory phone number field.
- `components/account/VerificationBanner.tsx` - Update to show phone verification status.
- `components/account/VerifyPhoneModal.tsx` - [NEW] Create the OTP entry modal.
- `components/ui/phone-input.tsx` - Use for consistent phone number input.
- `app/layout.tsx` (or similar global wrapper) - To catch 403 errors and trigger the modal.
- `changelog.md` - To document the changes.

### Notes

- Follow the 4-step workflow from `api-integration-guide.md`.
- Ensure all UI matches the flat, minimalist design in `global.css`.
- Use `bunx tsc --noEmit` to check types after implementation.

## Instructions for Completing Tasks

**IMPORTANT:** As you complete each task, you must check it off in this markdown file by changing `- [ ]` to `- [x]`. This helps track progress and ensures you don't skip any steps.

## Tasks

### Authentication & Identification (AI)

- [ ] AI00: Update Login and Registration flows for dual identifier and phone support
  - [ ] AI01: Update `User` interface in `types/auth.ts` to include `phone` and `is_phone_verified`.
  - [ ] AI02: Define `LoginPayload` and `RegisterPayload` in `types/auth.ts` to reflect the new API requirements.
  - [ ] AI03: Modify `components/auth/login-form.tsx` to use a single "Identifier" field with appropriate validation.
  - [ ] AI04: Modify `components/auth/register-form.tsx` to include the mandatory `phone` field using `PhoneInput`.
  - [ ] AI05: Update `useLogin` and `useRegister` hooks in `hooks/auth/use-auth.ts` to pass the correct payload structure.

### Phone Verification API & Hooks (PV)

- [ ] PV00: Implement API functions and React Query hooks for phone verification
  - [ ] PV01: Add `sendPhoneOTP` and `verifyPhoneOTP` to `api/auth/index.ts`.
  - [ ] PV02: Create `useSendPhoneOTP` and `useVerifyPhoneOTP` hooks in `hooks/auth/use-auth.ts`.
  - [ ] PV03: Ensure proper handling of loading and error states in the new hooks.

### Verification UI Components (UX)

- [ ] UX00: Build UI components for phone verification (Modal, Banner, Inputs)
  - [ ] UX01: Create `components/account/VerifyPhoneModal.tsx` based on the email verification modal design.
  - [ ] UX02: Implement a 6-digit OTP input field with auto-focus and formatting.
  - [ ] UX03: Add a "Resend Code" button with a 60-second countdown in the modal.
  - [ ] UX04: Update `components/account/VerificationBanner.tsx` to display phone verification status and trigger the modal.
  - [ ] UX05: Implement logic to handle simultaneous email and phone verification prompts.

### Shipment Restrictions & Logic Integration (SR)

- [ ] SR00: Integrate verification logic into shipment flow and handle restrictions
  - [ ] SR01: Update shipment creation logic to check `user.is_phone_verified`.
  - [ ] SR02: Implement a global error interceptor or specialized hook to catch 403 "Verification Required" errors.
  - [ ] SR03: Ensure the `VerifyPhoneModal` opens automatically when a 403 error is detected during shipment creation.

### Verification & Testing (TS)

- [ ] TS00: Verify feature functionality across different user states
  - [ ] TS01: Test login with both email and phone number.
  - [ ] TS02: Verify mandatory phone field during registration.
  - [ ] TS03: Test the full OTP verification flow (Send -> Receive -> Verify).
  - [ ] TS04: Verify that shipment creation is blocked without phone verification.
  - [ ] TS05: Run `bunx tsc --noEmit` and ESLint checks.
  - [ ] TS06: Update `changelog.md`.
