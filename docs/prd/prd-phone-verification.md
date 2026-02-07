# PRD: Phone Verification & Dual Login

## 1. Introduction / Overview

This document outlines the requirements for implementing phone verification and dual login (email or phone) within the Momentum Logistics Service (MLS). The goal is to enhance security, provide flexible login options, and ensure that all shipment-creating users have a verified phone number for delivery coordination.

## 2. Goals

- Enable users to log in using either their email address or phone number.
- Make phone number capture mandatory during registration.
- Implement a robust phone verification flow using One-Time Passwords (OTP).
- Restrict shipment creation to users with verified phone numbers.
- Provide a clear UI for users to complete verification.

## 3. User Stories

- **As a user**, I want to log in using my phone number or email so that I can choose the most convenient method.
- **As a new user**, I want to provide my phone number during registration so it can be verified for future shipments.
- **As an unverified user**, I want to see a reminder to verify my phone number so I can start creating shipments.
- **As a user creating a shipment**, I want to be prompted to verify my phone number if I haven't done so already, so I can complete my order.

## 4. Features / Tasks

Tasks are grouped by component/area and follow the format `[Prefix][Number]`.

### Authentication & Identification (AI)

- **AI01**: Update `LoginForm` to use a single "Identifier" field labeled "Email or Phone Number".
- **AI02**: Update `RegisterForm` to include a mandatory `phone` number field with the `PhoneInput` component.
- **AI03**: Update Auth schemas (Zod) to validate both `email` and `phone` according to backend requirements.
- **AI04**: Update `useLogin` and `useRegister` hooks to handle the new payload structure (Identifier for login/Phone for register).

### Phone Verification Flow (PV)

- **PV01**: Implement `useSendPhoneOTP` and `useVerifyPhoneOTP` hooks following the `api-integration-guide.md`.
- **PV02**: Create a `PhoneVerificationModal` component for entering the 6-digit OTP code, styled similarly to the existing email verification modal.
- **PV03**: Integrate `PhoneVerificationModal` with the verification banner and shipment creation flow.
- **PV04**: Implement "Resend Code" logic with a 60-second cooldown timer.

### User Interface & Experience (UX)

- **UX01**: Create a "Persistent Verification Banner" on the dashboard that shows if either email or phone is unverified.
- **UX02**: Trigger verification modals (Email and Phone) when their respective "Verify" buttons are clicked in the banner or profile.
- **UX03**: Implement simultaneous prompting for both email and phone verification if neither is verified.
- **UX04**: Ensure all UI follows the flat, minimalist design philosophy with high contrast and solid colors.

### Shipment Restrictions (SR)

- **SR01**: Update the "Create Shipment" logic to check `user.is_phone_verified`.
- **SR02**: Intercept 403 "Verification Required" errors from the backend and automatically open the `PhoneVerificationModal`.
- **SR03**: Disable or show a "Verification Required" tooltip on the shipment creation button for unverified users.

## 5. Non-Goals (Out of Scope)

- International roaming SMS cost management.
- WhatsApp-based verification (SMS only).
- Changing phone numbers after verification (Phase 2).

## 6. Design Considerations

- **Style**: Minimalist, flat design (no gradients).
- **Colors**: Use predefined variables like `bg-brand-blue`, `text-brand-yellow`, `bg-background-color`, `text-text-color`.
- **Feedback**: Use Toasts for OTP send/success/error.
- **Modal**: Centered pop-up with auto-focus on the first digit of the OTP input.

## 7. Technical Considerations

- **API Integration**: Follow the 4-step workflow (Types -> API -> Hook -> Component).
- **Store**: Update the `useAuthStore` or equivalent to include `is_phone_verified` and `phone` in the user object.
- **Error Handling**: Use Axios interceptors or specialized hooks to handle the 403 shipment restriction error.

## 8. Success Metrics

- 100% of new registrations include a validated phone number.
- 90% of active users complete phone verification within 24 hours of first shipment attempt.
- Zero support tickets regarding "unable to login with phone".

## 9. Open Questions

- Should we allow users to skip phone verification until they actually try to ship, or enforce it immediately on dashboard entry? (Currently planned as a persistent banner + shipment intercept).
