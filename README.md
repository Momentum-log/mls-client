# Momentum Logistics Service (MLS) - Client

A comprehensive, modern logistics management system designed to streamline operations for logistics companies. This is the **client application** built with Next.js, React, and TypeScript, providing a powerful user interface for shipment tracking, inventory management, route optimization, and real-time analytics.

**Project Status**: Active Development  
**Last Updated**: May 18, 2026  
**Repository**: `/Users/adedotungabriel/work/me/mls/mls-client`

---

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Regional Configuration](#regional-configuration)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Available Commands](#available-commands)
- [Development Workflow](#development-workflow)
- [Coding Standards & Philosophy](#coding-standards--philosophy)
- [Security Standards](#security-standards)
- [Pre-Commit Checklist](#pre-commit-checklist)
- [API Integration](#api-integration)
- [Directory Structure Details](#directory-structure-details)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)

---

## Project Overview

**Momentum Logistics Service (MLS)** is a comprehensive logistics management platform optimized for **Poland** and European logistics operations. The system provides end-to-end solutions for shipment management, real-time tracking, invoice generation, payment processing, and route optimization.

### Key Objectives

- Streamline logistics operations with an intuitive user interface
- Provide real-time shipment tracking and visibility
- Enable secure payment processing and invoice management
- Support multi-carrier integrations (FedEx, DHL, local carriers)
- Deliver analytics and reporting capabilities
- Ensure compliance with regional (Polish) requirements

---

## Features

### Core Features

✅ **Shipment Management**

- Create and manage shipments with detailed package information
- Support for standard and heavy freight shipments
- Customs form generation and management
- Shipment verification and validation

✅ **Real-Time Tracking**

- Live shipment status updates
- Public tracking for customers (without authentication)
- Authenticated tracking for registered users
- Timeline view of shipment events
- Tracking history and analytics

✅ **Invoice System**

- Automated invoice generation and management
- Invoice preview and PDF export
- Invoice email functionality
- Multiple invoice statuses and lifecycle management
- Invoice payment integration

✅ **Payment Processing**

- PayU integration for secure payment handling
- Continue-to-pay workflows
- Payment verification and status tracking
- Multiple payment status states

✅ **Shipping Quotes & Estimates**

- Real-time shipping cost estimation
- Volumetric weight calculations
- Multiple shipping service options
- Rate comparison and selection

✅ **User Authentication & Verification**

- Email verification
- Phone number verification
- Address verification (with Google Places integration)
- Profile management and account settings
- Secure password reset flow

✅ **Location Services**

- Google Places API integration for address autocomplete
- Geolocation services
- Location-based country detection
- Address field validation

✅ **Dashboard & Analytics**

- User dashboard with key metrics
- Shipment statistics and summaries
- Invoice summaries and payment tracking
- Account management interface

---

## Technology Stack

### Frontend & Runtime

- **Runtime**: [Bun](https://bun.sh) (fast JavaScript runtime, package manager)
- **Framework**: [Next.js](https://nextjs.org) (App Router)
- **UI Library**: [React 18+](https://react.dev)
- **Language**: [TypeScript](https://www.typescriptlang.org)

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **API Design**: RESTful with OpenAPI documentation

### Database

- **Primary**: PostgreSQL
- **ORM**: Prisma (recommended for schema management)

### Styling & UI

- **CSS**: CSS Variables (see `globals.css`)
- **Design System**: Custom flat, minimalist components
- **UI Components**: Custom primitive components in `components/ui/`

### Key Libraries & Integrations

- **Forms**: React Hook Form (validation with Zod schemas)
- **HTTP**: Fetch API / TanStack Query
- **Notifications**: React Hot Toast
- **Address Input**: Google Places API, International Phone Input
- **PDF**: PDF generation utilities
- **Storage**: Secure local storage (with encryption utilities)
- **State Management**: Zustand (global stores)

### Dev Tools

- **Type Checking**: TypeScript
- **Linting**: ESLint
- **Build**: Next.js built-in build system

---

## Regional Configuration

### Poland Focus

The system is optimized for **Poland** with the following regional settings:

- **Primary Region**: Poland
- **Timezone**: Central European Time (CET) / Central European Summer Time (CEST)
- **Currency**: Polish Złoty (PLN)
- **Locale**: `pl-PL` (for date/number formatting), `en-US` (codebase language)
- **Language**: English (codebase), Polish-ready (i18n support)

### Supported Countries

The system is designed to support international shipping with Poland as the primary hub, supporting multiple destination countries.

---

## Project Structure

```
mls-client/
├── api/                    # Backend API routes and logic
│   ├── auth/              # Authentication endpoints
│   ├── invoices/          # Invoice management
│   ├── location/          # Location services
│   ├── payments/          # Payment processing
│   ├── shipments/         # Shipment operations
│   └── utils/             # API utilities and helpers
│
├── app/                   # Next.js App Router
│   ├── (marketing)/       # Public routes (no authentication)
│   │   ├── about/
│   │   ├── contact/
│   │   ├── login/
│   │   ├── register/
│   │   ├── shipping-estimate/
│   │   └── track-shipment/
│   │
│   ├── app/               # Authenticated routes (protected)
│   │   ├── account/
│   │   ├── dashboard/
│   │   ├── invoices/
│   │   ├── shipments/
│   │   └── track/
│   │
│   ├── auth/              # Auth-specific routes
│   ├── globals.css        # Global styles & CSS variables
│   ├── layout.tsx         # Root layout
│   └── not-found.tsx      # 404 page
│
├── components/            # Reusable React components
│   ├── ui/               # Primitive UI components
│   ├── about/            # About page components
│   ├── account/          # Account management components
│   ├── auth/             # Authentication components
│   ├── dashboard/        # Dashboard components
│   ├── invoice/          # Invoice-related components
│   ├── shipment/         # Shipment form components
│   ├── shipping/         # Shipping estimate components
│   ├── tracking/         # Tracking page components
│   └── shared/           # Shared/common components
│
├── hooks/                # Custom React hooks
│   ├── auth/            # Authentication hooks
│   ├── invoices/        # Invoice management hooks
│   ├── location/        # Location service hooks
│   ├── payments/        # Payment processing hooks
│   ├── shipments/       # Shipment operation hooks
│   └── utilities/       # Utility hooks
│
├── store/               # Zustand global state stores
│   ├── auth-store.ts
│   ├── country-store.ts
│   ├── invoice-store.ts
│   ├── shipment-store.ts
│   └── utils-store.ts
│
├── types/              # TypeScript type definitions
│   ├── address-verification.ts
│   ├── auth.ts
│   ├── country.ts
│   ├── invoice.ts
│   ├── location.ts
│   ├── payments.ts
│   ├── shipping.ts
│   └── verification.ts
│
├── utils/              # Helper functions and utilities
│   ├── address-*.ts    # Address-related helpers
│   ├── auth-helper.ts
│   ├── invoice-*.ts    # Invoice-related helpers
│   ├── currency-formatter.ts
│   ├── error-handler.ts
│   └── ...
│
├── public/             # Static assets
│   ├── images/
│   ├── fonts/
│   └── favicons/
│
├── docs/               # Documentation
│   ├── prd/           # Product Requirements Documents
│   ├── tasks/         # Task lists for features
│   └── guides/        # Integration & setup guides
│
├── __tests__/          # Test files
│   ├── shipments/
│   └── utils/
│
├── next.config.ts     # Next.js configuration
├── tsconfig.json      # TypeScript configuration
├── eslint.config.mjs  # ESLint configuration
├── postcss.config.mjs # PostCSS configuration
├── package.json       # Dependencies and scripts
├── bun.lock          # Bun lockfile
├── changelog.md      # Version history
└── README.md         # This file
```

---

## Getting Started

### Prerequisites

- **Bun** (v1.0+) - [Install Bun](https://bun.sh)
- **Node.js** (v18+) - for compatibility
- **Git** - for version control
- **Environment variables** - see `.env.local.example`

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd mls-client
   ```

2. **Install dependencies**

   ```bash
   bun install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.local.example .env.local
   ```

   Then edit `.env.local` with your actual values:

   ```env
   # API Configuration
   NEXT_PUBLIC_API_URL=http://localhost:3001

   # Authentication
   NEXT_PUBLIC_AUTH_DOMAIN=your-domain.com

   # Third-party APIs
   NEXT_PUBLIC_GOOGLE_PLACES_KEY=your-google-places-key
   NEXT_PUBLIC_PAYU_API_KEY=your-payu-key

   # Feature Flags
   NEXT_PUBLIC_FEATURE_HEAVY_FREIGHT=true
   ```

4. **Start the development server**

   ```bash
   bun run dev
   ```

5. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## Available Commands

### Development

```bash
# Start dev server with hot reload
bun run dev

# Start dev server on specific port
bun run dev --port 3001

# Type check
bunx tsc --noEmit

# Lint code
bun run lint

# Fix lint issues
bun run lint --fix
```

### Building & Production

```bash
# Build for production
bun run build

# Start production server
bun run start

# Preview production build locally
bun run build && bun run start
```

### Testing

```bash
# Run tests
bun run test

# Run tests in watch mode
bun run test --watch

# Run tests with coverage
bun run test --coverage
```

### Other Utilities

```bash
# Prisma migrations (if using Prisma)
bun run prisma migrate dev --name migration_name

# Format code
bun run format

# Clean build artifacts
bun run clean
```

---

## Development Workflow

### 1. Feature Development

1. Create a feature branch: `git checkout -b feature/feature-name`
2. Implement the feature following [Coding Standards](#coding-standards--philosophy)
3. Add/update tests
4. Run type checking and linting
5. Commit with descriptive messages
6. Push to remote and create a Pull Request

### 2. Version Control & Changelog

**Semantic Versioning (SemVer)**: `MAJOR.MINOR.PATCH`

- **Major (X.0.0)**: Breaking API changes or major architectural shifts
- **Minor (0.X.0)**: New features that are backward compatible
- **Patch (0.0.X)**: Bug fixes and minor adjustments

**Changelog Format** (`changelog.md`):

```markdown
### [version code: 1.0.0] - YYYY-MM-DD - Short description

- Added: Feature X
- Changed: Refactored Y
- Fixed: Bug Z
```

### 3. Commit Message Convention

```
type(scope): subject

body

footer
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

**Example**:

```
feat(shipments): add bulk shipment upload

Added ability to upload multiple shipments via CSV.
Includes validation and error handling.

Closes #123
```

---

## Coding Standards & Philosophy

### 3.1 Modularity & Reusable Code (Strict)

**Principle**: Code **MUST** be modular and reusable.

✅ **Do This:**

- Extract distinct logic into separate files
- Keep components focused on single responsibility
- Create reusable hooks for complex logic
- Use types to define interfaces clearly

❌ **Don't Do This:**

- 500+ line components with mixed concerns
- Duplicating logic across files
- Inline styles with hardcoded values
- Monolithic API route handlers

**Best Practices:**

- Check `components/` and `utils/` before creating new code
- Use the `@/` alias for all local imports: `import { Button } from '@/components/ui/button'`
- Extract constants into separate files
- Create custom hooks for stateful logic

**Example - Shipping Calculator:**

```
hooks/
  ├── useShippingCalculator.ts    (logic)
types/
  └── shipping.ts                 (types & interfaces)
components/
  └── ShippingForm.tsx            (UI)
utils/
  └── shipping-helpers.ts         (utilities)
```

### 3.2 Documentation (Strict)

**Requirement**: All exported functions, components, interfaces, and complex logic **MUST** be documented using JSDoc/TSDoc.

**Documentation Template:**

```typescript
/**
 * Calculates the estimated shipping cost based on volumetric weight.
 *
 * Uses the greater of actual weight or volumetric weight (L×W×H÷5000)
 * and applies regional Polish shipping rates.
 *
 * @param length - Package length in centimeters
 * @param width - Package width in centimeters
 * @param height - Package height in centimeters
 * @param weight - Actual package weight in kilograms
 * @returns The calculated shipping cost in PLN (Polish Złoty)
 *
 * @example
 * const cost = calculateShippingCost(50, 40, 30, 5);
 * // Returns: 125.50 (example value)
 */
export const calculateShippingCost = (
  length: number,
  width: number,
  height: number,
  weight: number,
): number => {
  // implementation
};
```

**Component Documentation:**

```typescript
/**
 * ShippingForm - Allows users to enter package details and get shipping quotes.
 *
 * Validates input using Zod schema, communicates with shipping API,
 * and displays available carrier options with prices.
 *
 * @component
 * @param onQuoteSelect - Callback when user selects a shipping option
 * @returns JSX.Element
 *
 * @example
 * <ShippingForm onQuoteSelect={(quote) => console.log(quote)} />
 */
export const ShippingForm: React.FC<ShippingFormProps> = ({
  onQuoteSelect,
}) => {
  // component code
};
```

### 3.3 Design & Styling (Strict)

**Design System:**

- **Style**: Flat, minimalist, modern
- **Gradients**: **FORBIDDEN** - not part of design system
- **Theme**: Light and dark mode support (using CSS variables)

**Color Usage:**
✅ **Use CSS Variables:**

```tsx
<div className="bg-brand-blue text-text-primary">
```

❌ **Don't Use Tailwind Colors:**

```tsx
<div className="bg-blue-500 text-slate-800"> {/* ❌ WRONG */}
```

❌ **Don't Use Inline Colors:**

```tsx
<div style={{ backgroundColor: '#3b82f6' }}> {/* ❌ WRONG */}
```

**Contrast Requirements:**

- Light text on dark backgrounds
- Dark text on light backgrounds
- WCAG AA standards minimum (4.5:1 contrast ratio)

**CSS Variables** (in `globals.css`):

```css
:root {
  --brand-blue: #0066ff;
  --text-primary: #1a1a1a;
  --text-secondary: #666666;
  --bg-light: #ffffff;
  --bg-gray: #f5f5f5;
  --border: #e0e0e0;
}
```

---

## Security Standards

### Input Validation (Critical)

**Requirement**: ALL API endpoints and form inputs **MUST** be validated using schemas (Zod).

**Client-Side Example:**

```typescript
import { z } from "zod";

const shipmentSchema = z.object({
  origin: z.string().min(1, "Origin is required"),
  destination: z.string().min(1, "Destination is required"),
  weight: z.number().positive("Weight must be positive"),
  dimensions: z.object({
    length: z.number().positive(),
    width: z.number().positive(),
    height: z.number().positive(),
  }),
});

type ShipmentInput = z.infer<typeof shipmentSchema>;
```

**Server-Side Example:**

```typescript
export async function POST(request: Request) {
  const body = await request.json();

  const validated = shipmentSchema.safeParse(body);
  if (!validated.success) {
    return Response.json(
      { errors: validated.error.flatten() },
      { status: 400 },
    );
  }

  // Process validated data
}
```

### Secrets Management

**Rules:**

- ❌ **NEVER** commit secrets, API keys, or credentials to version control
- ✅ Use `.env.local` for local development (git-ignored)
- ✅ Use `.env.example` for documentation of required variables
- ✅ Use environment variables in deployment (platform-specific)

**Environment Variables:**

```env
# Public (safe to expose)
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_GOOGLE_PLACES_KEY=key_here

# Private (server-side only)
DATABASE_URL=postgresql://user:pass@localhost/db
PAYPAL_SECRET=secret_key
JWT_SECRET=secret_token_key
```

### Authentication & Authorization

**Requirements:**

- Protect all private routes with authentication checks
- Verify user authorization for resources (e.g., users can only view their own shipments)
- Use secure session management
- Implement rate limiting on auth endpoints

**Route Protection Example:**

```typescript
import { getSession } from "@/api/auth";

export async function GET(request: Request) {
  const session = await getSession(request);

  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.id !== userId) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  // Process request
}
```

### Dependencies & Vulnerabilities

```bash
# Check for vulnerabilities
bun audit

# Update dependencies safely
bun update

# Review lock file changes before committing
git diff bun.lock
```

---

## Pre-Commit Checklist

Before committing and pushing, complete these checks:

- [ ] **Type Checking**: `bunx tsc --noEmit` ✅ (Must pass)
- [ ] **Linting**: `bun run lint` ✅ (No errors)
- [ ] **Tests**: `bun run test` ✅ (All passing, if applicable)
- [ ] **Dev Server**: `bun run dev` ✅ (Starts without errors)
- [ ] **Changelog Updated**: `changelog.md` ✅ (For significant changes)
- [ ] **Documentation**: JSDoc comments ✅ (For new exports)
- [ ] **Environment**: `.env.local` ✅ (Not committed)
- [ ] **Code Review**: Self-review changes ✅ (Follows standards)

---

## API Integration

### Backend API

The client communicates with a backend API at `NEXT_PUBLIC_API_URL`.

**API Endpoints Overview:**

```
POST /api/auth/login          - User login
POST /api/auth/register       - User registration
POST /api/auth/logout         - User logout
GET  /api/auth/profile        - Get user profile

POST /api/shipments           - Create shipment
GET  /api/shipments           - List user's shipments
GET  /api/shipments/:id       - Get shipment details
PUT  /api/shipments/:id       - Update shipment
DELETE /api/shipments/:id     - Delete shipment

POST /api/invoices            - Create invoice
GET  /api/invoices            - List invoices
GET  /api/invoices/:id        - Get invoice details

POST /api/payments            - Process payment
GET  /api/payments/status     - Check payment status

POST /api/location/autocomplete - Address autocomplete
GET  /api/location/verify      - Verify address

GET  /api/shipping/quotes      - Get shipping estimates
GET  /api/shipping/carriers    - List available carriers
```

See `docs/api-integration-guide.md` for detailed API documentation.

### Third-Party Integrations

- **Google Places API**: Address autocomplete and verification
- **PayU**: Payment processing
- **FedEx**: Shipping carrier integration
- **Local Polish Carriers**: Regional shipping options

---

## Directory Structure Details

### `/api`

Backend API routes and logic. Organized by feature (auth, shipments, invoices, etc.).

### `/app`

Next.js App Router pages. Organized into:

- `(marketing)`: Public pages (about, login, register, tracking)
- `app/`: Authenticated user pages (dashboard, shipments, invoices)
- `auth/`: Authentication-related pages

### `/components`

Reusable React components:

- `ui/`: Primitive components (buttons, inputs, modals)
- Feature-specific folders: organized by business domain

### `/hooks`

Custom React hooks for managing state and side effects:

- `useAuth`: Authentication state
- `useShipments`: Shipment operations
- `useInvoices`: Invoice management
- `useLocation`: Location services

### `/store`

Global state management using Zustand:

- `auth-store`: User authentication state
- `shipment-store`: Shipment-related state
- `invoice-store`: Invoice-related state
- `country-store`: Regional/country settings

### `/types`

TypeScript type definitions organized by domain:

- Clear interfaces for data models
- API request/response types
- Component prop types

### `/utils`

Utility functions and helpers:

- `*-helper.ts`: Domain-specific helpers
- `error-handler.ts`: Error handling utilities
- `currency-formatter.ts`: Formatting utilities
- `form-submission-validation.ts`: Form validation

### `/docs`

Documentation:

- `prd/`: Product Requirements Documents
- `tasks/`: Task lists for features
- Integration guides and troubleshooting

---

## Contributing

### Code Contributions

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Follow [Coding Standards](#coding-standards--philosophy)
4. Make your changes and test thoroughly
5. Commit with clear messages
6. Update `changelog.md`
7. Push to your fork
8. Create a Pull Request

### Bug Reports

Include:

- Clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Environment info (browser, OS, Node version)
- Screenshots if applicable

### Feature Requests

Include:

- Clear description of the feature
- Use cases and benefits
- Proposed implementation approach
- Any related issues

---

## Troubleshooting

### Common Issues

#### Port 3000 Already in Use

```bash
# Use a different port
bun run dev --port 3001

# Or kill the process using port 3000
lsof -ti:3000 | xargs kill -9
```

#### Dependency Installation Issues

```bash
# Clear cache and reinstall
rm -rf node_modules bun.lock
bun install

# Or use Bun's clean install
bun clean
bun install
```

#### Type Errors

```bash
# Check for type errors
bunx tsc --noEmit

# Generate type definitions
bun run build
```

#### Environment Variables Not Loading

- Ensure `.env.local` exists and has correct format
- Restart dev server after changing `.env.local`
- Prefix public variables with `NEXT_PUBLIC_`

#### Build Failures

```bash
# Clean and rebuild
bun run clean
bun run build

# Check for lint errors
bun run lint

# Review error logs
```

### Need More Help?

- Check [docs/dev-server-troubleshooting.md](docs/dev-server-troubleshooting.md)
- Review related documentation in `docs/` folder
- Check GitHub issues and discussions
- Review API integration guide for backend issues

---

## Resources & Documentation

### Official Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Bun Documentation](https://bun.sh/docs)
- [Zod Documentation](https://zod.dev)

### Project Documentation

- [API Integration Guide](docs/api-integration-guide.md)
- [Client Shipping Endpoints Guide](docs/client-shipping-endpoints-guide.md)
- [Invoice System Guide](docs/invoice-system-complete-guide.md)
- [Google Places Integration](docs/google-places-integration-guide.md)
- [Phone Verification Guide](docs/phone-verification-client-guide.md)
- [Location Services Guide](docs/location-services-guide.md)

### Product Requirements Documents

See `docs/prd/` for detailed feature specifications.

---

## License

[Add your license here]

---

## Support & Contact

For questions or support:

- Open an issue on GitHub
- Check existing documentation
- Review prior discussions

---

**Happy Coding! 🚀**

Built with ❤️ for streamlined logistics operations in Poland and beyond.
