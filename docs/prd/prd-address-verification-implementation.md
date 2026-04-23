# PRD: Address Verification Implementation (Client-Side)

## 1. Introduction / Overview

The address verification feature enables users to submit and verify their address with proof documentation as part of the account setup and shipment creation flow. This implementation aligns with the backend address verification system and ensures users cannot create shipments without an approved address.

**Goal:** Provide a seamless, intuitive UI for users to submit address information with supporting documentation during onboarding, check their current verified address, and request address updates with required proof files.

---

## 2. Goals

- Allow users to provide and verify their address during initial account setup (onboarding).
- Enable users to update their address with proof documentation at any time.
- Display current verified address and update request status to users.
- Prevent shipment creation without an approved address, with clear guidance to complete address verification.
- Provide drag-and-drop file upload for proof documents (PDF, PNG, JPG, max 10MB).
- Seamlessly integrate with the backend address verification API endpoints.

---

## 3. User Stories

### US-AV-001: User Completes Address During Onboarding

**As a** new user creating an account  
**I want to** submit my address with proof documentation during signup  
**So that** I can immediately be eligible to create shipments (pending admin approval)

**Acceptance Criteria:**

- Address fields populate during account setup flow.
- User can upload proof file via drag-and-drop or file picker.
- User sees confirmation after submission.
- User is redirected to dashboard with message about pending admin review.

### US-AV-002: User Updates Address with Proof

**As a** registered user  
**I want to** update my address and resubmit proof documentation if my address changes  
**So that** my shipments are sent to the correct location

**Acceptance Criteria:**

- User can access address update form from account settings.
- Form pre-fills with current address.
- User can change address fields and upload new proof.
- User sees submission confirmation.
- User can see the status of their address update request.

### US-AV-003: User Views Current Address Status

**As a** registered user  
**I want to** see my current verified address and any pending address update requests  
**So that** I know if my address is approved for shipments

**Acceptance Criteria:**

- User sees current active address displayed clearly.
- User sees status of latest address update request (PENDING, APPROVED, REJECTED).
- If rejected, user sees admin feedback and option to resubmit.
- User can initiate new address update from this view.

### US-AV-004: User Is Prevented from Creating Shipment Without Address

**As a** user  
**I want to** be guided to complete address verification when attempting to create a shipment without an approved address  
**So that** I understand why I cannot create a shipment

**Acceptance Criteria:**

- When user tries to create shipment without approved address, a modal appears.
- Modal explains address is required and shows address update form.
- User can submit address + proof directly from modal.
- After submission, user is redirected to address settings page.
- User sees confirmation that address is pending admin review.

---

## 4. Features / Tasks

### Address Form Component

- **AF01:** Create reusable `AddressForm` component with fields: street, city, postal code, country.
- **AF02:** Add real-time form validation for address fields (non-empty checks, postal code format for Poland).
- **AF03:** Implement country field as read-only for initial version (default: Poland).

### Proof File Upload

- **PF01:** Create `FileUploadZone` component with drag-and-drop functionality.
- **PF02:** Implement file picker fallback for drag-and-drop.
- **PF03:** Add file type validation (PDF, PNG, JPG only).
- **PF04:** Add file size validation (max 10MB).
- **PF05:** Implement Base64 encoding of file for API submission.
- **PF06:** Display upload progress and file preview before submission.

### Address Verification Modal

- **AM01:** Create `AddressVerificationModal` component for shipment creation guard.
- **AM02:** Implement modal trigger logic when ADDRESS_REQUIRED error is received.
- **AM03:** Show clear explanation why address is required.
- **AM04:** Embed address form + file upload in modal.
- **AM05:** Add "Submit" and "Cancel" actions with appropriate handlers.

### Address Update Flow

- **AU01:** Create `AddressUpdatePage` component in account settings.
- **AU02:** Fetch current address via `GET /api/auth/address/status`.
- **AU03:** Display current active address and latest request status.
- **AU04:** Show admin feedback if request was REJECTED.
- **AU05:** Implement address form submission to `POST /api/auth/address/update-request`.
- **AU06:** Handle validation errors from API with field-level feedback.
- **AU07:** Show success confirmation after submission.

### Address Status Display

- **AS01:** Create `AddressStatusBadge` component to show address verification status.
- **AS02:** Display in account/profile section showing: current address + status + option to update.
- **AS03:** Show rejection feedback if applicable.
- **AS04:** Add "Update Address" CTA button.

### Onboarding Integration

- **OI01:** Add address section to account setup flow (after email verification, before dashboard).
- **OI02:** Make address submission required before user can proceed to dashboard.
- **OI03:** Show loading state and confirmation after address submission.
- **OI04:** Allow user to skip to dashboard with pending status (with clear messaging).

### User Schema Updates

- **US01:** Add `addressVerifiedAt` field to user object (timestamp or null).
- **US02:** Add `currentAddressRequestId` field to track pending requests.
- **US03:** Add `addressRequestStatus` field (PENDING | APPROVED | REJECTED | null).
- **US04:** Add `addressRejectionFeedback` field to store admin feedback.

### API Integration

- **API01:** Implement hook `useAddressVerification()` for address status queries.
- **API02:** Implement hook `useAddressUpdate()` for address submission.
- **API03:** Add error handling for `ADDRESS_REQUIRED` in shipment creation flow.
- **API04:** Implement polling or refetch mechanism to update address status after submission.

### Error Handling & Validation

- **EH01:** Show inline field-level validation errors for address form.
- **EH02:** Display user-friendly file upload errors (type, size).
- **EH03:** Handle API validation errors (country code, address format).
- **EH04:** Show retry mechanism if file upload fails during submission.
- **EH05:** Handle session/auth errors gracefully (e.g., token expired).

### UI / UX Enhancements

- **UI01:** Use consistent styling with CSS variables (no hardcoded colors).
- **UI02:** Ensure responsive design for mobile address form.
- **UI03:** Add loading spinners during file upload and form submission.
- **UI04:** Show success toast notifications after successful submission.
- **UI05:** Display clear, actionable error messages for rejections.

---

## 5. Non-Goals (Out of Scope)

- Address history/timeline view (only current + latest request status shown).
- Admin approval interface (handled by backend/admin panel).
- Automatic address validation against third-party databases.
- Multiple addresses per user (only one active address at a time).
- Address proof file deletion UI (handled automatically by backend).
- Email notification UI (handled automatically by backend).
- Support for countries other than Poland in MVP.

---

## 6. Design Considerations

### Components to Create

1. **AddressForm** - Reusable form for address submission
2. **FileUploadZone** - Drag-and-drop file upload
3. **AddressVerificationModal** - Guard modal for shipment creation
4. **AddressUpdatePage** - Full address management page
5. **AddressStatusBadge** - Status display component

### Design System

- Use CSS variables from `app/globals.css` for colors.
- Follow existing component patterns from `components/ui/`.
- Ensure high contrast for accessibility.
- Mobile-first responsive design.

### Integration Points

- Account settings page should have address management section.
- Onboarding flow should include address verification step.
- Shipment creation should check address status and show modal if needed.

---

## 7. Technical Considerations

### Dependencies

- Existing API structure with Bearer token authentication.
- Backend endpoints fully implemented and documented in address verification integration guide.
- Assumes `useAuth()` hook provides current user and token.

### Data Flow

1. **Address Submission:** Form → Base64 file encoding → API POST → State update → Toast notification.
2. **Address Status Check:** On page load/periodic polling → API GET → Update user store.
3. **Address Update:** Current status → Show current address → Form pre-fill → Submit → Confirmation.

### Storage

- Address data stored in user store/auth context.
- Proof files never stored client-side (always sent Base64 to server).
- Address request status persisted in user object via backend.

### API Endpoints Used

- `POST /api/auth/address/update-request` (submit address + proof)
- `GET /api/auth/address/status` (fetch current address & status)
- `GET /api/auth/address/requests` (optional: fetch request history)

### Error Scenarios to Handle

- **Validation Errors:** Field-level feedback from API
- **File Upload Errors:** Type/size validation, backend file upload failures
- **Network Errors:** Retry mechanism, offline detection
- **Auth Errors:** Token expiry, redirect to login
- **ADDRESS_REQUIRED Guard:** Trigger modal, show in shipment creation flow

### Browser Compatibility

- Modern browsers supporting File API and Fetch API.
- Drag-and-drop support for file upload.

---

## 8. Success Metrics

- 95%+ of new users complete address verification during onboarding.
- 100% of shipment creation requests are blocked if no approved address exists.
- Address update requests submitted successfully with proof files.
- Average time to complete address verification flow: < 2 minutes.
- Zero failed API submissions due to client-side validation gaps.

---

## 9. Open Questions

1. Should address history be visible to users (all past requests), or only current status?
2. Should users be able to check their proof file upload status/preview proof?
3. Should there be a timeout/expiry on address requests (e.g., re-submit if pending >30 days)?
4. Should address be updateable for existing approved addresses, or just for initial setup?
5. Should rejected addresses show a timestamp of rejection?

---

## 10. Implementation Notes

- **Timeline:** Urgent (1-2 weeks) - prioritize core features first.
- **Scope Approach:** Start with address form + file upload, then add status display, then shipment guard.
- **Testing:** Unit test form validation, integration test API calls, E2E test full flow.
- **Code Style:** Follow project standards (modular components, JSDoc comments, CSS variables only, `@/` imports).
