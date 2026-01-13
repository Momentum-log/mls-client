# PRD: User & Authentication Flow

## 1. Introduction / Overview

This document outlines the implementation of a comprehensive user profile and authentication flow for Momentum Logistics Service (MLS). It covers profile management, email verification/changes, and password security (both logged-in and logged-out).

## 2. Goals

- Provide a unified, stack-based account management interface for logged-in users.
- Implement secure email change and verification workflows.
- Provide a seamless forgot/reset password flow for logged-out users.
- Ensure high visibility of account verification status.

## 3. User Stories

- **As a logged-in user**, I want to see my profile information in a "social media style" card and update my details easily.
- **As a logged-in user**, I want to change my email or password securely within my account settings.
- **As an unverified user**, I want to be reminded to verify my account so I can access all features.
- **As a logged-out user**, I want to recover my account if I forget my password using an email-based reset code.

## 4. Features / Tasks

### User Profile (UP)

- **UP01**: Implement Get User Profile (`GET /auth/get-current-user`) on app initialization.
- **UP02**: Create a "Profile Stack" layout on a single page for all account actions.
- **UP03**: Implement "Social Media" style user info card as the top item in the stack.
- **UP04**: Implement Update User Profile (`PATCH /auth/update-user-profile`) for name, phone, and address.

### Email Management (EM)

- **EM01**: Implement "Persistent Verification Banner" for unverified accounts visible across the account tab.
- **EM02**: Implement Initiate Email Change (`POST /auth/initiate-email-change`) with a pop-up modal for code entry.
- **EM03**: Implement Confirm Email Change (`POST /auth/confirm-email-change`) within the modal.
- **EM04**: Implement Verify Email (`POST /auth/verify-email`) using a pop-up modal triggered from the persistent banner.

### Password Management (PM)

- **PM01**: Implement "Change Password" (logged-in) as a single form with fields for Current, New, and Confirm New password.
- **PM02**: Implement "Forgot/Reset Password" (logged-out) as a single-page flow:
  - Phase 1: Input email to request code (`POST /auth/forgot-password`).
  - Phase 2: Success state on the same page to input code and new password (`POST /auth/reset-password`).

### Session Management (SM)

- **SM01**: Implement Logout (`POST /auth/logout-user`) calling the backend to revoke the refresh token and clear local storage.

## 5. Non-Goals

- Social login (Google/Apple) implementation (out of scope for this task).
- Multi-factor authentication (MFA) beyond email verification.

## 6. Design Considerations

- **Architecture**: Single-page "Profile Stack" with vertical cards/sections.
- **Verification UI**: Persistent banner at the top of the account tab + persistent buttons on information cards.
- **Modals**: Use pop-ups for verification/email change code entry to keep the user in context.
- **Feedback**:
  - Use **Toast notifications** for API success/error responses.
  - Use **Static Alerts/Instructions** (subtle text) for directional info (e.g., "Enter the code sent to your inbox").

## 7. Technical Considerations

- Integration with existing `openapi.json` definitions.
- Coordinate with the "Account Stack" UI for Polish regional settings (PLN, CET).
- Ensure the refresh token rotation is maintained during logout/login cycles.

## 8. Success Metrics

- 100% completion of documented endpoints from `openapi.json`.
- Positive user feedback on the "stack-based" account UI.
- Reduced friction for email verification (measured by verification rate).
