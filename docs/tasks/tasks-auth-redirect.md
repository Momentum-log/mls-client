# Task List: Authentication Redirect

## Relevant Files

- `proxy.ts` - Main proxy file (formerly middleware) to handle session checks and redirects.
- `utils/auth-helper.ts` - Reference for cookie names (Caution: contains client-side imports).

### Notes

- **Cookie Name**: `mls_access_token`.
- **Middleware Runtime**: `proxy.ts` runs in the Edge runtime.
- **Migration**: Renamed to `proxy.ts` for Next.js 16 compatibility.

## Instructions for Completing Tasks

**IMPORTANT:** As you complete each task, you must check it off in this markdown file by changing `- [ ]` to `- [x]`. This helps track progress and ensures you don't skip any steps.

## Tasks

### Middleware Implementation

- [x] MW00: Create and Configure Middleware
  - [x] MW01: Create `proxy.ts` in the root (same level as `app/`).
  - [x] MW02: Define `authRoutes` constant: `['/login', '/register', '/forgot-password']`.
  - [x] MW03: Implement `proxy` function to check for `mls_access_token` in `request.cookies`.
  - [x] MW04: Add redirect logic: If token exists AND path is in `authRoutes` -> redirect to `/app/dashboard`.
  - [x] MW05: Configure `config.matcher` to exclude static files, `_next`, images, and `favicon.ico`.

### Verification

- [x] VE00: Manual Verification
  - [x] VE01: Log in to the application (ensure `mls_access_token` cookie is set).
  - [x] VE02: Manually navigate to `/login` and verify redirect to `/app/dashboard`.
  - [x] VE03: Manually navigate to `/register` and verify redirect to `/app/dashboard`.
  - [x] VE04: Log out and verify `/login` is accessible again.
