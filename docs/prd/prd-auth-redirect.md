# Product Requirements Document: Authentication Redirect

## 1. Introduction / Overview

This feature implements automatic redirection for authenticated users who attempt to access authentication-related pages (Login, Register, Forgot Password). The system will detect the active session and redirect the user to the Dashboard, preventing redundant login attempts.

## 2. Goals

- Eliminate the ability for logged-in users to access the login/registration pages.
- Streamline the user experience by automatically directing authenticated users to their dashboard.
- Prevent user confusion caused by seeing login forms while already authenticated.

## 3. User Stories

- **As a logged-in user**, if I accidentally navigate to `/login`, I should be immediately redirected to `/app/dashboard` without seeing the login form.
- **As a logged-in user**, if I click a link to `/register`, I should be redirected to `/app/dashboard`.
- **As a non-logged-in user**, I should still be able to access Login, Register, and Forgot Password pages normally.

## 4. Features / Tasks

### Middleware Configuration

- MW01: Create `middleware.ts` in the project root.
- MW02: Implement logic to check for the session cookie (e.g., `sb-access-token` or project equivalent).
- MW03: Define `authRoutes` array containing: `['/login', '/register', '/forgot-password']`.
- MW04: Implement redirect condition: `if (isAuthenticated && authRoutes.includes(path)) return NextResponse.redirect(new URL('/app/dashboard', req.url))`.
- MW05: Ensure the middleware matcher excludes static files (`_next/static`, `favicon.ico`, images) to avoid performance overhead.

### Verification

- VE01: Manual test: Log in, manually modify URL to `/login`, confirm redirect.
- VE02: Manual test: Log out, visit `/login`, confirm access.

## 5. Non-Goals (Out of Scope)

- Role-based specific redirects (e.g. Admin -> `/admin`). Dashboard is the single destination for now.
- Client-side redirects (useEffect solutions).

## 6. Success Metrics

- Zero instances of logged-in users landing on auth pages.
