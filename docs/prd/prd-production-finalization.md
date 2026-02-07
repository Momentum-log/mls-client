# PRD: Production Finalization

## Introduction / Overview

This document outlines the final requirements to transition Momentum Logistics Service (MLS) into the production phase. The focus is on streamlining user onboarding by making phone verification optional, fulfilling legal requirements with policy pages, and resolving critical UI/UX issues in navigation and shipment management.

## Goals

- Remove friction in the shipment creation flow by making phone verification optional.
- Ensure legal compliance by providing standard Terms, Privacy, and Cookie policies.
- Polish the user interface for consistency and production readiness.
- Fix navigation logic bugs for authenticated users.

## User Stories

- As a user, I want to create a shipment after verifying my email, without being forced to verify my phone number.
- As a user, I want to see a clean and professional shipment list with an easy-to-use action menu.
- As a user, I want to access legal policies to understand how my data is handled.
- As a logged-in user, I expect the mobile navigation to show relevant links and hide the "Login" button.

## Features / Tasks

### Verification Requirements (VR)

- **VR01**: Remove the mandatory phone verification check from the shipment creation flow.
- **VR02**: Ensure email verification remains the sole mandate for creating shipments.
- **VR03**: Update the sign-up flow to include a phone number field but skip the verification requirement at that stage.
- **VR04**: Update the `VerificationBanner` to only prompt for email verification as a requirement for shipments, while keeping phone verification as a secondary/optional suggestion.

### Policy Pages (PP)

- **PP01**: Create a `Terms and Conditions` page at `/terms` using standard legal placeholder text.
- **PP02**: Create a `Privacy Policy` page at `/privacy` using standard legal placeholder text.
- **PP03**: Create a `Cookie Policy` page at `/cookies` using standard legal placeholder text.
- **PP04**: Add links to these pages in the website footer.

### UI and Layout Fixes (UI)

- **UI01**: Fix spacing/padding on login and sign-up pages to ensure they look minimalist and modern (as per project standards).
- **UI02**: Adjust the `ActionMenu` component to support auto-sizing width based on content.
- **UI03**: Realign `ActionMenu` text to the left.
- **UI04**: Update `ActionMenu` on the Shipments page to ensure items ("View Shipment", "Copy Tracking Number", etc.) are on a single line.
- **UI05**: Update the mobile hamburger menu logic in `Header.tsx` to hide the "Login" button when `isAuthenticated` is true.

### Maintenance (MA)

- **MA02**: Run type checks and linting before final commit.

## Non-Goals (Out of Scope)

- Redesigning the entire authentication system.
- Implementing complex legal logic for policies (placeholder text only).
- Manual padding adjustments for verification/payment pages (User will handle manually).

## Design Considerations

- Adhere strictly to the **flat, minimalist, and modern** style.
- Use only CSS variables from `global.css`.
- Ensure high contrast for all UI elements.

## Success Metrics

- 100% completion of listed tasks.
- Successful shipment creation with verified email but unverified phone.
- No "Login" button visible in mobile navigation for authenticated users.

## Open Questions

- None at this stage.
