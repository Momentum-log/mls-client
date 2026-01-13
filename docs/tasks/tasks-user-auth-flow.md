## Relevant Files

- `api/auth.ts` - Centralized auth API calls.
- `app/app/account/page.tsx` - Main page for the account stack.
- `components/account/ProfileCard.tsx` - Social-media style user information card.
- `components/account/VerificationBanner.tsx` - Persistent notice for unverified accounts.
- `components/account/AccountStack.tsx` - Container for grouping account actions.
- `app/auth/forgot-password/page.tsx` - Unified forgot/reset password flow.
- `hooks/useAuth.ts` - Hook for managing auth state and user data.

### Notes

- Use custom CSS variables from `global.css` for styling (e.g., `bg-brand-blue`, `text-text-color`).
- Follow the flat, minimalist, modern design philosophy (No gradients).
- Ensure high contrast for readability.

## Instructions for Completing Tasks

**IMPORTANT:** As you complete each task, you must check it off in this markdown file by changing `- [ ]` to `- [x]`. This helps track progress and ensures you don't skip any steps.

## Tasks

### Phase 1: Authentication & Setup

- [x] AT00: Create feature branch and setup environment
  - [x] AT01: Create branch `feature/user-auth-flow`
  - [x] AT02: Verify or add auth client functions in `api/auth.ts` (mapping to `openapi.json`)
  - [x] AT03: Initialize component structure in `components/account/`

### Phase 2: Profile & Account UI

- [x] UP00: Implement User Profile & Account Stack UI
  - [x] UP01: Create `ProfileCard.tsx` (Social media style profile overview)
  - [x] UP02: Create `AccountStack.tsx` (Card-based layout for grouping settings)
  - [x] UP03: Implement `app/app/account/page.tsx` with unified stack layout
  - [x] UP04: Connect Update Profile form to `PATCH /auth/update-user-profile`
  - [x] UP05: Add static alerts/instructions for profile fields

### Phase 3: Email & Verification

- [x] EM00: Implement Email Change & Verification System
  - [x] EM01: Create `VerificationBanner.tsx` (Persistent banner for unverified status)
  - [x] EM02: Implement Initiate Email Change modal pop-up
  - [x] EM03: Implement Verify Email modal pop-up (for account verification)
  - [x] EM04: Handle code entry and API submission for both flows
  - [x] EM05: Show Toasts for API responses
  - [x] EM06: Refinement: Auto-trigger code sending on "Verify Now" click

### Phase 4: Password Management

- [x] PM00: Implement Password Management
  - [x] PM01: Implement Password Change form (Logged-in) in the Account Stack
  - [x] PM02: Implement `app/auth/forgot-password/page.tsx` (Logged-out)
  - [x] PM03: Handle state transition from "Email Request" to "Code/Reset" on the same page
  - [x] PM04: Add client-side validation for password matching
  - [x] PM05: Refinement: Add password visibility toggles (eyeball button)

### Phase 5: Session & Cleanup

- [x] SM00: Implement Session & Logout Workflow
  - [x] SM01: Implement Logout logic in `components/account/LogoutAction.tsx`
  - [x] SM02: Clear local auth state and redirect to login
  - [x] SM03: Verify Refresh Token rotation lifecycle

### Phase 6: Quality Assurance

- [x] TS00: Verification & Quality Checks
  - [x] TS01: Run `bunx tsc --noEmit`
  - [x] TS02: Run `bun run lint`
  - [x] TS03: Update `changelog.md` with SemVer and summary
