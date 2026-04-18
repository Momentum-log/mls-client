# PRD: Invoice UI & Account Verification Enhancement

**Version:** 1.0  
**Priority:** Urgent (1–2 weeks)  
**Status:** In Development  
**Last Updated:** April 17, 2026

---

## 1. Introduction / Overview

This feature improves the invoice presentation and user account completeness by:

1. **Enhancing the Invoice Side Drawer UI** – The current invoice receipt displayed in the side drawer has poor visual hierarchy and cramped spacing. This update will improve layout, readability, and overall aesthetics.

2. **Enforcing Account Verification** – New and returning users with unverified emails or incomplete addresses will encounter a mandatory, non-dismissible modal when attempting to create a shipment. This ensures data completeness and email verification before they proceed.

3. **Populating Invoice Data from User & Shipment Context** – The invoice will intelligently merge user profile data (name, address) and shipment data (items, quantities, costs) to display a complete, professional invoice without requiring additional data entry.

**Goal:** Deliver a polished invoice experience while ensuring users have verified accounts and complete profiles before engaging in shipment creation.

---

## 2. Goals

- Improve invoice visual presentation and reduce visual clutter in the side drawer
- Enforce email verification and address completion for all users before shipment creation
- Populate invoice details automatically using available user and shipment data
- Prevent form interaction until account verification requirements are met
- Maintain backward compatibility with existing invoice data structures

---

## 3. User Stories

**US1: New User Account Setup**  
_As a new user, I want to verify my email and add my address before creating a shipment, so that my account is complete and my invoice displays accurate sender information._

**US2: Invoice Professional Presentation**  
_As a user viewing an invoice, I want the invoice to display clearly with proper spacing and hierarchy, so that I can easily read and understand the shipment details._

**US3: Invoice Data Completeness**  
_As a user, I want my invoice to automatically show my name, address, and shipment item details without manual entry, so that the invoice is accurate and professional._

**US4: Account Compliance Reminder**  
_As a returning user with an unverified email, I want a clear, non-dismissible prompt to verify my email before proceeding, so that my account remains secure and compliant._

---

## 4. Features / Tasks

### 4.1 Invoice UI Enhancement (IU)

- **IU01:** Restructure the invoice side drawer layout to improve visual hierarchy (add consistent padding, margins, and spacing)
- **IU02:** Improve typography and font sizing for better readability (header, labels, values should have clear visual distinction)
- **IU03:** Add visual separation between invoice sections (header, line items, totals, footer) using dividers or background colors
- **IU04:** Ensure mobile responsiveness – invoice should not appear cramped on small screens

### 4.2 Account Verification Modal (AV)

- **AV01:** Create a non-dismissible modal that appears when users with unverified emails or incomplete addresses attempt to create a shipment
- **AV02:** Display clear messaging: "Email verification and account address update required"
- **AV03:** Add a primary CTA button that routes the user to the account settings page
- **AV04:** Automatically trigger the email verification endpoint on the account page (user receives OTP)
- **AV05:** Block all form interaction on the create shipment page until the modal is closed (requires verification + address completion)
- **AV06:** Update form state to reflect verification and address completion (disable submit until both conditions are met)

### 4.3 Invoice Data Population (DP)

- **DP01:** Populate the "To" / recipient section of the invoice with the user's full name (from user account data)
- **DP02:** Populate the "To" / recipient address section with the user's address (from user account data, if provided)
- **DP03:** Set the service name to "Logistics" as a generic label
- **DP04:** Generate a dynamic service description: "Logistics for [User Full Name]"
- **DP05:** Populate quantity field based on the total number of items in the shipment (`shipment.items.length`)
- **DP06:** Populate net price, tax (VAT), and total price from the shipment/invoice data (no manual entry required)
- **DP07:** Ensure missing user data (e.g., no address yet) results in field omission or placeholder, not display errors

### 4.4 Verification & Validation (VV)

- **VV01:** Implement client-side validation to check for unverified email and missing address before allowing shipment creation
- **VV02:** On shipment creation attempt, verify the user's email verification status against the backend
- **VV03:** If unverified or incomplete, trigger the modal and prevent form submission
- **VV04:** After user completes verification and address update, automatically re-check validation and allow form submission

---

## 5. Non-Goals (Out of Scope)

- Changing the underlying invoice data structure or database schema
- Modifying the invoice generation backend logic
- Adding new fields to the invoice beyond what's already available
- Creating new user profile fields or data types
- Redesigning the entire invoice system (only enhancing existing UI)
- Multi-language localization for invoice content (use existing locale settings)

---

## 6. Design Considerations

### Invoice Side Drawer Layout

The invoice should follow the existing design system:

- Use CSS variables for spacing (gap, padding, margins)
- Maintain flat, minimalist aesthetic (no gradients)
- Use high contrast typography for readability
- Ensure consistent border-radius and rounded corners with existing components
- Reference existing invoice components in `/components/invoice/` for styling consistency

### Account Verification Modal

- Modal should be center-aligned, non-dismissible (no close button)
- Use primary CTA button styling (`bg-brand-blue`, `text-white`)
- Display icon/illustration for context (e.g., lock icon, verification badge)
- Responsive on mobile (full-width on small screens, centered on larger screens)

### Data Binding

- Invoice should read user data from the `useAuth()` hook or user context
- Shipment data should be pulled from `shipment-store` or component props
- Display logic should gracefully handle missing fields (no console errors)

---

## 7. Technical Considerations

### Dependencies

- Existing `useAuth()` hook for user profile data
- `shipment-store` for shipment details
- `CustomsForm` and related components for form state
- Email verification endpoint (already exists)

### Data Flow

1. User attempts to create shipment → Form component checks `user.email_verified` and `user.address`
2. If either is missing → Display non-dismissible modal
3. Modal CTA routes to account page + triggers email verification
4. Account page handles OTP flow and address update
5. On completion, shipment form becomes interactive again
6. Invoice side drawer auto-populates from merged user + shipment data

### Backward Compatibility

- Invoice data re-population is display-only; no changes to stored invoice structure
- Existing invoices without user data will gracefully degrade (show partial info)
- No breaking changes to API or database

### Known Constraints

- Users may have incomplete addresses (e.g., address line 2 optional) – handle gracefully
- Email verification may already be sent; modal should not re-send unless user requests
- Address update should be non-blocking; if incomplete, show inline validation errors

---

## 8. Success Metrics

- **UI Improvement:** Invoice display receives no complaints about cramped or unclear layout (subjective, but measurable via feedback)
- **Verification Compliance:** 100% of new users complete email verification and address entry before first shipment
- **Data Population Accuracy:** Invoice displays correct user name, address, and item quantities in 99%+ of cases
- **No Breaking Changes:** Existing invoice functionality remains stable; no regression in invoice generation or export

---

## 9. Acceptance Criteria

- [ ] Invoice side drawer displays with improved spacing, hierarchy, and mobile responsiveness
- [ ] Non-dismissible modal appears for all users with unverified emails before shipment creation
- [ ] Modal routes to account page; verification flow works end-to-end
- [ ] Shipment form is blocked (all inputs disabled, submit disabled) until verification is complete
- [ ] Invoice automatically populates: user name, address, service name ("Logistics"), description, quantity, pricing
- [ ] Missing user data (e.g., no address) does not cause display errors; fields are omitted or show placeholders
- [ ] Existing invoices without user data still display correctly (backward compatibility)
- [ ] No console errors or failed validation messages during testing
- [ ] Changes are tested on mobile and desktop viewports

---

## 10. Open Questions

1. Should the address be optional or mandatory? (Currently treating as mandatory before shipment)
2. Is there a secondary email or backup contact field that should also be displayed on the invoice?
3. Should the invoice include business/company name if the user has one, or only display personal name?
4. After user verifies email and adds address, should they be automatically redirected back to the shipment form?
5. Should the email verification OTP be resent if the user already requested one, or only allow verification of an existing OTP?

---

## 11. Implementation Notes

- Start with the account verification modal to unblock the shipment form workflow
- Follow the existing design system (see `/global.css` for color variables)
- Use Formik for form state management (already integrated)
- Test with users who have and without addresses to ensure graceful fallbacks
- Coordinate with backend to confirm email verification and address validation endpoints

---

## Related Files

- [Customs Form Component](../../components/shipment/customs-form.tsx) – Reference for form structure
- [Invoice Components](../../components/invoice/) – Reference for existing invoice styling
- [User Store](../../store/shipment-store.ts) – Data source for user context
- [Global Styles](../../app/globals.css) – Design system reference
