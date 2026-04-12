# Invoice System - Client Integration Guide

**Purpose:** Frontend integration guide for MLS invoice generation system.

**Date:** April 8, 2026  
**Version:** 2.1 (v3.10.0) - Unified Shipment-to-Invoice Flow  
**Status:** Ready for integration

---

## Table of Contents

1. [Quick Start - User Flows](#quick-start---user-flows)
2. [Overview](#overview)
3. [TypeScript Interfaces](#typescript-interfaces)
4. [API Endpoints](#api-endpoints)
5. [Implementation Guide](#implementation-guide)
6. [Code Examples](#code-examples)
7. [Error Handling](#error-handling)
8. [Testing](#testing)

---

## Quick Start - User Flows

### 🎯 Flow 1: CREATE New Shipment + Invoice

This is the happy path for first-time shipments. One call creates both shipment and invoice.

```
Step 1: User selects rate from /estimates
         ↓
Step 2: User clicks "Create Shipment" (with preferred payment: Stripe/PayU)
         ↓
Step 3: [You call] POST /api/shipments
         {
           rate: { serviceType, serviceName, carrierPrice },
           preferredPaymentOption: "stripe",
           pickupAddress, dropoffAddress, package
           // ❌ NO shipmentId or invoiceId
         }
         ↓
Step 4: [Server] Creates NEW shipment + NEW invoice (in one transaction)
         ↓
Step 5: [Server] Auto-generates payment link + PDF (async in background)
         ↓
Step 6: [Server] Immediately returns response with:
         - shipmentId (new)
         - invoiceId (new)
         - paymentLink (active, expires in 24h)
         - pdfDownloadUrl (null if still generating, you'll poll for it)
         - checkoutUrl (for backward compat)
         ↓
Step 7: [You] Show invoice to user
         - Display invoice number, total amount, tax breakdown
         - Show "Pay Now" button (links to paymentLink)
         - Show "Download PDF" (polls if null)
         - Optionally: "Email Invoice" button
         ↓
Step 8: User clicks "Pay Now" → Redirected to Stripe/PayU checkout
```

**Response Status Code:** `201 Created`

**Time to Payment:** ⚡ Immediate - user has payment link instantly

---

### 🔄 Flow 2: UPDATE Existing Shipment + Renew Invoice

This is used when payment link expired or user wants to change the rate (renewal scenario).

```
Step 1: User's payment link has expired OR user wants new rate
         ↓
Step 2: User goes back to /estimates to get fresh rates
         ↓
Step 3: User selects a DIFFERENT rate (different carrier or service)
         ↓
Step 4: User clicks "Update Shipment" (instead of "Create New")
         ↓
Step 5: [You call] POST /api/shipments
         {
           rate: { serviceType, serviceName, carrierPrice },  // NEW rate
           preferredPaymentOption: "stripe",
           pickupAddress, dropoffAddress, package,
           shipmentId: "abc-123...",     // ✅ EXISTING shipment ID
           invoiceId: "def-456..."       // ✅ EXISTING invoice ID
         }
         ↓
Step 6: [Server] Validates:
         - You own this shipment
         - Invoice belongs to this shipment
         ↓
Step 7: [Server] Updates EXISTING shipment with new rate data
         ↓
Step 8: [Server] Updates EXISTING invoice:
         - Recalculates tax from scratch (with new rate)
         - Updates line items with new pricing
         - Marks shipment.invoiceId as still pointing to same invoice
         ↓
Step 9: [Server] Generates FRESH payment link
         - Old link is now marked "expired"
         - New link has fresh 24h expiration
         ↓
Step 10: [Server] Returns response with:
         - shipmentId (SAME as before)
         - invoiceId (SAME as before)
         - paymentLink (NEW, active, fresh 24h)
         - totalAmount (UPDATED based on new rate)
         - tax (RECALCULATED)
         ↓
Step 11: [You] Show updated invoice
         - Display new total, new tax, new payment link
         - Old link is no longer valid
         ↓
Step 12: User clicks "Pay Now" with NEW payment link
```

**Response Status Code:** `200 OK`

**Key Difference:** Invoice ID and Shipment ID stay the same. Only rates and pricing update.

---

### 📧 Flow 3: Send Invoice via Email (Optional, Always Available)

At any point after shipment creation, user can email the invoice.

```
Step 1: User clicks "Email Invoice"
         ↓
Step 2: [You call] POST /api/invoices/{invoiceId}/email
         {
           recipientEmail: "customer@example.com"  // optional, defaults to user email
         }
         ↓
Step 3: [Server] Response returned immediately:
         - If PDF ready: 200 OK (email with PDF attachment sent or queued)
         - If PDF still generating: 202 Accepted (email will be sent when PDF ready)
         ↓
Step 4: User receives email with:
         - Invoice details
         - Payment link button
         - PDF (attached or link to download)
```

---

## Overview

The invoice system generates, delivers, and manages invoices for shipments. Key features:

- **✅ Unified CREATE + Invoice:** One endpoint, one call, creates both shipment AND invoice
- **✅ Upsert Pattern:** Pass optional `shipmentId` + `invoiceId` to UPDATE existing (renewal flow)
- **✅ Automatic Invoice Generation:** Happens immediately at shipment creation
- **✅ Deferred Payment Link:** Only generated when you explicitly need it
- **✅ Multiple Delivery Methods:** Download, email, or both
- **✅ Polish Tax Rules:** 23% VAT for PL origin, 0% for others
- **✅ Soft Delete & Restore:** Users can soft-delete invoices and restore within 30 days
- **✅ Payment Link Expiration:** Auto-expires (default 24h, configurable 1-168h)
- **✅ Regeneratable Links:** Call `/regenerate-link` to reset expiration clock and get new payment URL
- **✅ Payment Gateway Integration:** Stripe and PayU support
- **✅ Comprehensive Audit Trail:** Complete history of all invoice actions
- **✅ Admin Management:** Full admin endpoints for invoice oversight

### Key Concepts

- **Invoice ID:** Unique UUID identifier (e.g., `a1b2c3d4-e5f6-7890-abcd-ef1234567890`)
- **Invoice Number:** User-friendly format `MLS-INV-XXXXXX-YYYY` (e.g., `MLS-INV-A1B2C3-2026`)
- **Payment Link:** Unique URL for customer payments (expires per user config, default 24h)
- **Unified Endpoint:** One `POST /api/shipments` call handles CREATE or UPDATE based on optional IDs
- **Soft Delete:** Invoices marked deleted are hidden from user list but audit trail preserved (restorable within 30 days)
- **Atomized Data:** Address fields stored separately (street, building#, apartment#, city, postal_code, country)
- **Status Transitions:** PENDING → PAID or EXPIRED → regenerate-link → PENDING again
- **Expiration:** Configurable per-user (default 24h, admin can override 1-168h range)

---

## TypeScript Interfaces

### ⚡ Quick Request/Response For Main Flows

```typescript
/**
 * CREATE Flow Request (Flow 1)
 * Pass NO shipmentId, NO invoiceId = create brand new
 */
export interface CreateShipmentRequest_CreateFlow {
  rate: { serviceType; serviceName; carrierPrice; actualPrice; currency };
  preferredPaymentOption: "stripe" | "payu";
  pickupAddress: Address;
  dropoffAddress: Address;
  package: Package;
  // ❌ Do NOT include shipmentId or invoiceId
}

/**
 * UPDATE Flow Request (Flow 2)
 * Pass BOTH shipmentId AND invoiceId = update existing
 */
export interface CreateShipmentRequest_UpdateFlow {
  rate: { serviceType; serviceName; carrierPrice; actualPrice; currency }; // NEW rate
  preferredPaymentOption: "stripe" | "payu";
  pickupAddress: Address;
  dropoffAddress: Address;
  package: Package;
  shipmentId: string; // ✅ EXISTING shipment ID
  invoiceId: string; // ✅ EXISTING invoice ID (must match shipment)
}

/**
 * Unified Response (Both Flows)
 * Status 201 for CREATE, 200 for UPDATE
 */
export interface CreateShipmentResponse {
  shipmentId: string;
  customTrackingNumber: string;
  checkoutUrl: string; // Backward compat (same as paymentLink)
  paymentGateway: "stripe" | "payu";

  // Invoice details (NEW)
  invoice: {
    id: string;
    number: string; // MLS-INV-XXXXXX-YYYY
    status: "DRAFT" | "SENT" | "PAID" | "EXPIRED";
    totalAmount: number; // Gross amount (including tax)
    currency: string;
    tax: number; // Total VAT amount
    taxRate: number; // e.g., 23 or 0
    lineItems: LineItem[]; // Shipping details
    createdAt: Date;
    updatedAt: Date;
    paymentLink: string; // URL to payment gateway (active)
    paymentLinkExpiresAt: Date; // When this link expires
    pdfDownloadUrl?: string; // null if still generating
  };

  pdfGenerationStatus: "READY" | "PENDING"; // Is PDF ready to download?
}
```

---

### Core Invoice Types (Complete Reference)

```typescript
/**
 * Customer invoice data - what customers see
 */
export interface Invoice {
  invoiceId: string; // UUID
  invoiceNumber: string; // MLS-INV-XXXXXX-YYYY format
  customerId: string; // FK to users table
  customerName: string;
  customerEmail: string;

  // Seller (MLS Logistics) - atomized fields
  sellerCompanyName: string;
  sellerStreet: string;
  sellerBuildingNumber: string;
  sellerApartmentNumber?: string;
  sellerCity: string;
  sellerPostalCode: string;
  sellerCountryCode: string; // "PL"
  sellerNIP: string; // VAT ID

  // Buyer (Customer) - atomized fields
  buyerName: string;
  buyerStreet: string;
  buyerBuildingNumber: string;
  buyerApartmentNumber?: string;
  buyerCity: string;
  buyerPostalCode: string;
  buyerCountryCode: string; // Country code
  buyerNIP?: string;

  // Line items (services)
  lineItems: InvoiceLineItem[];

  // Totals
  totalNetAmount: number; // Sum of all line items net
  totalVATAmount: number; // Sum of all line items VAT
  totalGrossAmount: number; // Net + VAT

  // Currency and exchange rate
  currency: "PLN" | "EUR"; // Invoice currency
  exchangeRate?: number; // EUR to PLN rate (if currency is EUR)
  exchangeRateDate?: string; // Date of exchange rate

  // Payment links (history)
  paymentLinks: InvoicePaymentLink[];

  // Status
  status: "PENDING" | "EXPIRED" | "PAID";

  // Soft delete fields
  deletedAt?: string; // ISO-8601 timestamp when soft-deleted (null = active invoice)
  deletedBy?: string; // User ID who deleted invoice
  restoredAt?: string; // ISO-8601 timestamp of last restoration

  // Metadata
  createdAt: string; // ISO-8601 timestamp
  updatedAt: string;
  paidAt?: string; // Timestamp when marked as paid
}

/**
 * Line item in an invoice
 */
export interface InvoiceLineItem {
  lineItemId: string; // UUID
  invoiceId: string;
  lineNumber: number; // 1, 2, 3, etc.

  // Service details
  serviceName: string; // e.g., "Domestic Shipping", "Express Delivery"
  unitOfMeasure: string; // e.g., "pcs", "kg", "shipment"
  quantity: number;

  // Pricing (net)
  unitNetPrice: number; // Price per unit (net)
  netValue: number; // quantity * unitNetPrice (net)

  // Tax
  taxRate: number; // 23 (23%) or 0 (0%)
  vatAmount: number; // Calculated from netValue * (taxRate / 100)

  // Pricing (gross)
  grossValue: number; // Net + VAT

  // KSeF compliance
  gtuCode: string; // GTU_13 for logistics
  shipmentOriginCountry: string; // "PL", "DE", etc. - determines tax rate

  // Metadata
  createdAt: string;
}

/**
 * Payment link for invoice payment
 */
export interface InvoicePaymentLink {
  paymentLinkId: string; // UUID
  invoiceId: string;

  // Payment URL
  paymentLinkUrl: string; // Format: https://pay.mls.system/{invoiceId}/{uniqueUUID}

  // Status lifecycle
  status: "active" | "expired" | "paid"; // active = can be used, expired = regenerated or timed out, paid = payment received

  // Expiration
  expiresAt: string; // ISO-8601 timestamp (configurable, default 24h from creation/regeneration)

  // Regeneration tracking
  regeneratedAt?: string; // When this link was regenerated from a previous link
  regenerationCount: number; // How many times this link has been regenerated

  // Metadata
  createdAt: string;
}

/**
 * Audit log entry for invoice actions
 */
export interface InvoiceAuditLogEntry {
  auditLogId: string; // UUID
  invoiceId: string;

  // Action details
  action: "created" | "sent" | "expired" | "regenerated" | "paid" | "resent";
  performedBy: string; // "SYSTEM" or userId (admin)
  deliveryMethod?: "download" | "email" | "both"; // How invoice was delivered

  // State tracking
  beforeState?: Record<string, unknown>; // Previous invoice state
  afterState?: Record<string, unknown>; // New invoice state

  // Request details
  ipAddress?: string; // Admin's IP address (for audit trail)
  details?: string; // Additional notes

  // Timestamp
  timestamp: string; // ISO-8601 timestamp
}

/**
 * Tax breakdown summary (for invoice totals)
 */
export interface TaxBreakdown {
  taxRate: number; // 23 or 0
  netAmount: number; // Total net for this tax rate
  vatAmount: number; // Total VAT for this tax rate
  grossAmount: number; // Total gross for this tax rate
  lineItemCount: number; // How many line items have this tax rate
}
```

### Request DTOs

```typescript
/**
 * Request to generate invoice
 */
export interface GenerateInvoiceRequest {
  shipmentId: string; // UUID of shipment to invoice
  deliveryMethod: "download" | "email" | "both"; // How to deliver invoice
  recipientEmail?: string; // Email address (required if deliveryMethod includes "email")
  paymentGateway?: "STRIPE" | "PAYU"; // Optional, defaults to configured gateway
}

/**
 * Response from invoice generation
 */
export interface GenerateInvoiceResponse {
  invoiceId: string;
  invoiceNumber: string; // MLS-INV-XXXXXX-YYYY
  status: "success" | "partial_success" | "error";

  // Delivery results
  downloadUrl?: string; // Pre-signed URL to download PDF (if download was selected)
  pdfBase64?: string; // Base64-encoded PDF (if needed for immediate display)
  pdfSize: number; // Size in bytes

  // Payment link
  paymentLinkUrl: string; // https://pay.mls.system/{invoiceId}/{uuid}
  paymentLinkExpiresAt: string; // ISO-8601 when link expires

  // Notifications
  emailSentAt?: string; // Timestamp when email was sent (if email delivery)
  emailAddress?: string; // Where email was sent

  // Message
  message: string; // User-friendly message
  createdAt: string; // Invoice creation timestamp
}

/**
 * Request to confirm invoice and generate payment link
 * Called after user selects payment method, before making payment
 */
export interface ConfirmInvoiceRequest {
  invoiceId: string;
  paymentMethod: "STRIPE" | "PAYU"; // Payment gateway to use
}

/**
 * Response from confirm invoice
 */
export interface ConfirmInvoiceResponse {
  invoiceId: string;
  paymentLinkUrl: string; // Newly generated payment link
  paymentLinkExpiresAt: string; // 7 days from now
  selectedPaymentPlatform: "STRIPE" | "PAYU"; // Confirmed payment method
  message: string; // Confirmation message
  updatedAt: string;
}

/**
 * Request to delete invoice (soft delete)
 */
export interface DeleteInvoiceRequest {
  invoiceId: string;
  // No additional parameters needed
}

/**
 * Response from delete invoice
 */
export interface DeleteInvoiceResponse {
  invoiceId: string;
  deletedAt: string; // ISO-8601 timestamp when deleted
  deletedBy: string; // User ID who performed deletion
  message: string; // Confirmation message
  canRestore: boolean; // Whether invoice can still be restored (within 30-day window)
}

/**
 * Request to restore soft-deleted invoice
 */
export interface RestoreInvoiceRequest {
  invoiceId: string;
  // No additional parameters needed
}

/**
 * Response from restore invoice
 */
export interface RestoreInvoiceResponse {
  invoiceId: string;
  restoredAt: string; // ISO-8601 timestamp when restored
  status: "PENDING" | "EXPIRED" | "PAID"; // Current status after restoration
  message: string; // Confirmation message
  updatedAt: string;
}

/**
 * Request to regenerate payment link for expired invoice
 */
export interface RegeneratePaymentLinkRequest {
  invoiceId: string;
  // No additional parameters needed
}

/**
 * Response from payment link regeneration
 */
export interface RegeneratePaymentLinkResponse {
  invoiceId: string;
  paymentLinkUrl: string; // New payment URL with new UUID
  paymentLinkExpiresAt: string; // 7 days from now (clock reset)
  regenerationCount: number; // How many times this invoice has had link regenerated
  oldPaymentLinkUrl?: string; // Previous link (now expired)
  message: string; // Confirmation message
  updatedAt: string;
}

/**
 * Admin request to resend invoice
 */
export interface AdminResendInvoiceRequest {
  invoiceId: string;
  deliveryMethod: "download" | "email" | "both";
  recipientEmail?: string; // Email address (required if includes "email")
  note?: string; // Optional admin note about why resending
}

/**
 * Admin response for resend
 */
export interface AdminResendInvoiceResponse {
  success: boolean;
  message: string;
  resendAt: string; // Timestamp of resend
  deliveryMethod: "download" | "email" | "both";
}
```

### Query/Filter Types

```typescript
/**
 * Customer invoice list filters
 */
export interface ListInvoicesQuery {
  status?: "PENDING" | "EXPIRED" | "PAID"; // Optional status filter
  limit?: number; // Default 20, max 100
  offset?: number; // Default 0
  sortBy?: "createdAt" | "invoiceNumber" | "totalGross"; // Sort field
  sortOrder?: "asc" | "desc"; // Sort direction
}

/**
 * Customer invoice list response
 */
export interface ListInvoicesResponse {
  invoices: Invoice[];
  total: number; // Total count of invoices matching filters
  limit: number; // Limit used in request
  offset: number; // Offset used in request
  hasMore: boolean; // Whether more invoices exist beyond current page
}

/**
 * Admin invoice list filters
 */
export interface AdminListInvoicesQuery {
  status?: "PENDING" | "EXPIRED" | "PAID";
  customerId?: string; // Filter by customer
  customerEmail?: string; // Filter by customer email
  invoiceNumber?: string; // Search by invoice number
  dateFrom?: string; // ISO-8601 date
  dateTo?: string; // ISO-8601 date
  minAmount?: number; // Minimum total gross amount
  maxAmount?: number; // Maximum total gross amount
  limit?: number; // Default 20, max 100
  offset?: number; // Default 0
  sortBy?: "createdAt" | "invoiceNumber" | "totalGross" | "customerName";
  sortOrder?: "asc" | "desc";
}

/**
 * Admin invoice list response
 */
export interface AdminListInvoicesResponse {
  invoices: Invoice[]; // Full invoice objects
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}
```

### Error Type

```typescript
/**
 * Standard error response
 */
export interface ErrorResponse {
  status: number; // HTTP status code
  code: string; // Error code (e.g., "INVOICE_NOT_FOUND", "INVALID_DELIVERY_METHOD")
  message: string; // User-friendly error message
  details?: Record<string, string>; // Validation errors (e.g., { "deliveryMethod": "Invalid value" })
  timestamp: string; // ISO-8601 when error occurred
  path?: string; // API endpoint that errored
}
```

---

## API Endpoints

### 🎯 Main Endpoint: Create or Update Shipment (Unified)

This is THE endpoint that handles both Flow 1 (CREATE) and Flow 2 (UPDATE).

#### Flow 1️⃣: CREATE Flow - New Shipment + New Invoice

```http
POST /api/shipments
Authorization: Bearer {TOKEN}
Content-Type: application/json

{
  "rate": {
    "serviceType": "domestic",
    "serviceName": "Express Delivery",
    "carrierPrice": 50.00,
    "actualPrice": 61.50,
    "currency": "PLN"
  },
  "preferredPaymentOption": "stripe",
  "pickupAddress": {
    "street": "ul. Marszałkowska",
    "buildingNumber": "100",
    "city": "Warszawa",
    "postalCode": "00-001",
    "countryCode": "PL"
  },
  "dropoffAddress": { ... },
  "package": { ... }
  // ❌ NO shipmentId
  // ❌ NO invoiceId
}
```

**Success Response (201 Created):**

```json
{
  "shipmentId": "s-new-uuid-1234",
  "customTrackingNumber": "MLS-TRK-2026-0001",
  "checkoutUrl": "https://pay.stripe.com/pay/cs_0001",
  "paymentGateway": "stripe",
  "invoice": {
    "id": "inv-new-uuid-5678",
    "number": "MLS-INV-ABC123-2026",
    "status": "DRAFT",
    "totalAmount": 61.5,
    "currency": "PLN",
    "tax": 11.5,
    "taxRate": 23,
    "lineItems": [
      {
        "serviceName": "Express Delivery",
        "quantity": 1,
        "unitNetPrice": 50.0,
        "netValue": 50.0,
        "taxRate": 23,
        "vatAmount": 11.5,
        "grossValue": 61.5
      }
    ],
    "createdAt": "2026-04-08T10:00:00Z",
    "updatedAt": "2026-04-08T10:00:00Z",
    "paymentLink": "https://pay.mls.system/inv-new-uuid-5678/uuid-1234",
    "paymentLinkExpiresAt": "2026-04-09T10:00:00Z",
    "pdfDownloadUrl": null
  },
  "pdfGenerationStatus": "PENDING"
}
```

**What happened on server:**

- ✅ Created NEW Shipment with ID `s-new-uuid-1234`
- ✅ Created NEW Invoice with ID `inv-new-uuid-5678`
- ✅ Generated payment link (active for 24h)
- ✅ Started PDF generation (async, will be ready in ~5 seconds)
- ✅ Returned 201 (created)

**Next steps for client:**

1. Extract `invoice.paymentLink` → user clicks to pay
2. If `invoice.pdfDownloadUrl` is null, start polling `GET /api/invoices/{invoiceId}/pdf`
3. Once PDF ready, show "Download Invoice" button

---

#### Flow 2️⃣: UPDATE Flow - Renew Shipment + Update Invoice

User's payment link expired or they want to change the rate.

```http
POST /api/shipments
Authorization: Bearer {TOKEN}
Content-Type: application/json

{
  "rate": {
    "serviceType": "express_intl",
    "serviceName": "Express International",
    "carrierPrice": 75.00,
    "actualPrice": 92.25,
    "currency": "PLN"
  },
  "preferredPaymentOption": "payu",
  "pickupAddress": { ... },
  "dropoffAddress": { ... },
  "package": { ... },
  "shipmentId": "s-new-uuid-1234",    // ✅ EXISTING from Flow 1
  "invoiceId": "inv-new-uuid-5678"    // ✅ EXISTING from Flow 1
}
```

**Success Response (200 OK):**

```json
{
  "shipmentId": "s-new-uuid-1234", // SAME shipment ID
  "customTrackingNumber": "MLS-TRK-2026-0001",
  "checkoutUrl": "https://pay.payu.com/pay/order_0002",
  "paymentGateway": "payu",
  "invoice": {
    "id": "inv-new-uuid-5678", // SAME invoice ID
    "number": "MLS-INV-ABC123-2026", // SAME invoice number
    "status": "DRAFT", // Status unchanged (not yet paid)
    "totalAmount": 92.25, // ✅ UPDATED (new rate)
    "currency": "PLN",
    "tax": 17.25, // ✅ UPDATED VAT
    "taxRate": 23,
    "lineItems": [
      {
        "serviceName": "Express International",
        "quantity": 1,
        "unitNetPrice": 75.0, // ✅ NEW rate
        "netValue": 75.0,
        "taxRate": 23,
        "vatAmount": 17.25, // ✅ NEW VAT
        "grossValue": 92.25 // ✅ NEW total
      }
    ],
    "createdAt": "2026-04-08T10:00:00Z",
    "updatedAt": "2026-04-08T10:30:00Z", // ✅ Updated timestamp
    "paymentLink": "https://pay.mls.system/inv-new-uuid-5678/uuid-9999", // ✅ NEW link
    "paymentLinkExpiresAt": "2026-04-09T10:30:00Z", // ✅ Fresh 24h expiration
    "pdfDownloadUrl": "https://s3.amazonaws.com/invoices/MLS-INV-ABC123-2026.pdf" // ✅ Regenerated
  },
  "pdfGenerationStatus": "READY" // ✅ PDF ready immediately on update
}
```

**What happened on server:**

- ✅ Verified you own shipment `s-new-uuid-1234`
- ✅ Verified invoice `inv-new-uuid-5678` belongs to shipment
- ✅ Updated shipment rate data (actual price now 92.25)
- ✅ Updated invoice with new rate, tax recalculated
- ✅ Old payment link marked as "expired"
- ✅ Generated NEW payment link (fresh 24h expiration)
- ✅ Regenerated PDF with new amounts
- ✅ Returned 200 (updated)

**Key Differences from Flow 1:**

- Response status: `200 OK` (not 201 Created)
- Shipment ID: Same
- Invoice ID: Same
- Invoice Number: Same
- Totals: Updated
- Payment Link: New (old one now expired)
- PDF: Ready immediately

**Next steps for client:**

1. Show user: "Invoice updated! New rate: 92.25 PLN (was 61.50)"
2. Extract `invoice.paymentLink` → NEW payment link to use
3. Show "Download PDF" (now ready immediately)

---

### 📥 Secondary Endpoints

#### 2. Download Invoice PDF

**Purpose:** Get the PDF download URL (or check if still generating)

```http
GET /api/invoices/{invoiceId}/pdf
Authorization: Bearer {TOKEN}
```

**Success Response - PDF Ready (200 OK):**

```json
{
  "status": "READY",
  "downloadUrl": "https://s3.amazonaws.com/invoices/MLS-INV-ABC123-2026.pdf",
  "invoiceNumber": "MLS-INV-ABC123-2026"
}
```

**Success Response - PDF Still Generating (202 Accepted):**

```json
{
  "status": "PENDING",
  "message": "PDF is still being generated. Please try again in a few seconds.",
  "retryAfter": 5,
  "invoiceNumber": "MLS-INV-ABC123-2026"
}
```

**Status Codes:**

- `200 OK` - PDF ready, download now
- `202 Accepted` - Still generating, retry after X seconds
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Invoice belongs to another user
- `404 Not Found` - Invoice not found
- `500 Internal Server Error` - PDF generation failed

**Polling Strategy (Client-Side):**

```typescript
async function getPdfDownloadUrl(invoiceId: string, maxRetries = 10) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const response = await fetch(`/api/invoices/${invoiceId}/pdf`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.status === 200) {
      const data = await response.json();
      return data.downloadUrl; // PDF ready!
    }

    if (response.status === 202) {
      const data = await response.json();
      console.log(`PDF generating... retry after ${data.retryAfter}s`);
      await new Promise((r) => setTimeout(r, data.retryAfter * 1000));
      continue;
    }

    throw new Error(`Failed to get PDF: ${response.status}`);
  }

  throw new Error("Max retries exceeded");
}
```

---

#### 3. Send Invoice via Email

**Purpose:** Email the invoice to customer (with or without PDF)

```http
POST /api/invoices/{invoiceId}/email
Authorization: Bearer {TOKEN}
Content-Type: application/json

{
  "recipientEmail": "customer@example.com"  // Optional, defaults to user's email
}
```

**Success Response - PDF Ready (200 OK):**

```json
{
  "status": "success",
  "message": "Invoice sent to customer@example.com",
  "invoiceNumber": "MLS-INV-ABC123-2026",
  "sentTo": "customer@example.com",
  "pdfStatus": "READY"
}
```

**Success Response - PDF Still Generating (202 Accepted):**

```json
{
  "status": "accepted",
  "message": "Email queued. PDF will be sent when ready.",
  "invoiceNumber": "MLS-INV-ABC123-2026",
  "sentTo": "customer@example.com",
  "pdfStatus": "PENDING"
}
```

**Email Contents:**

- Invoice number and total amount
- Payment link button (clickable)
- PDF attachment (if ready) OR link to dashboard
- Company branding and support info

**Status Codes:**

- `200 OK` - Email sent immediately (PDF ready)
- `202 Accepted` - Email queued (will send when PDF ready)
- `400 Bad Request` - Invalid email or invoice status
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Invoice belongs to another user
- `404 Not Found` - Invoice not found

---

#### 4. List Invoices

```http
GET /api/invoices?status=PENDING&limit=20&offset=0&sortBy=createdAt&sortOrder=desc
Authorization: Bearer {TOKEN}
```

**Success Response (200 OK):**

```json
{
  "invoices": [
    /* array of Invoice objects, excludes soft-deleted (deletedAt IS NULL) */
  ],
  "total": 15,
  "limit": 20,
  "offset": 0,
  "hasMore": false
}
```

---

#### 5. Get Invoice Details

```http
GET /api/invoices/{invoiceId}
Authorization: Bearer {TOKEN}
```

**Success Response (200 OK):**

```json
{
  "invoiceId": "e5f6a1b2-c3d4-7890-bcde-f1234567890a",
  "invoiceNumber": "MLS-INV-A1B2C3-2026",
  "customerId": "user-id-1234",
  "customerName": "Jan Kowalski",
  "customerEmail": "jan@example.com",
  "status": "PENDING",
  "deletedAt": null,
  "deletedBy": null,
  "restoredAt": null,
  "paymentLinks": [
    {
      "paymentLinkUrl": "https://pay.mls.system/e5f6a1b2-c3d4-7890-bcde-f1234567890a/uuid-1234-5678",
      "status": "active",
      "expiresAt": "2026-04-09T10:00:00Z",
      "regeneratedAt": null,
      "regenerationCount": 0,
      "createdAt": "2026-04-06T10:00:30Z"
    }
  ],
  "lineItems": [...],
  "totalNetAmount": 50.0,
  "totalVATAmount": 11.5,
  "totalGrossAmount": 61.5,
  "createdAt": "2026-04-06T10:00:00Z",
  "updatedAt": "2026-04-06T10:00:30Z"
}
```

---

### 🔧 Customer Management Endpoints

#### 6. Delete Invoice (Soft Delete)

```http
DELETE /api/invoices/{invoiceId}
Authorization: Bearer {TOKEN}
```

**Success Response (200 OK):**

```json
{
  "invoiceId": "e5f6a1b2-c3d4-7890-bcde-f1234567890a",
  "deletedAt": "2026-04-08T10:05:00Z",
  "deletedBy": "user-id-1234",
  "message": "Invoice soft-deleted successfully",
  "canRestore": true
}
```

**Status Codes:**

- `200 OK` - Invoice soft-deleted
- `400 Bad Request` - Cannot delete paid invoices
- `404 Not Found` - Invoice not found

---

#### 7. Restore Deleted Invoice

```http
POST /api/invoices/{invoiceId}/restore
Authorization: Bearer {TOKEN}
```

**Success Response (200 OK):**

```json
{
  "invoiceId": "e5f6a1b2-c3d4-7890-bcde-f1234567890a",
  "restoredAt": "2026-04-08T10:10:00Z",
  "status": "PENDING",
  "message": "Invoice restored successfully",
  "updatedAt": "2026-04-08T10:10:00Z"
}
```

**Status Codes:**

- `200 OK` - Invoice restored
- `400 Bad Request` - Invoice is not deleted
- `404 Not Found` - Invoice not found
- `410 Gone` - Cannot restore (> 30 days)

---

#### 8. Regenerate Payment Link

```http
POST /api/invoices/{invoiceId}/regenerate-link
Authorization: Bearer {TOKEN}
```

**Success Response (200 OK):**

```json
{
  "invoiceId": "e5f6a1b2-c3d4-7890-bcde-f1234567890a",
  "paymentLinkUrl": "https://pay.mls.system/e5f6a1b2-c3d4-7890-bcde-f1234567890a/uuid-9999-9999",
  "paymentLinkExpiresAt": "2026-04-09T10:00:00Z",
  "regenerationCount": 1,
  "oldPaymentLinkUrl": "https://pay.mls.system/e5f6a1b2-c3d4-7890-bcde-f1234567890a/uuid-1234-5678",
  "message": "Payment link regenerated successfully (clock reset to 24h from now)",
  "updatedAt": "2026-04-08T10:15:00Z"
}
```

**Status Codes:**

- `200 OK` - Link regenerated
- `400 Bad Request` - Link hasn't expired yet or invoice already paid
- `404 Not Found` - Invoice not found

---

### 👨‍💼 Admin Endpoints

#### 9. List All Invoices (Admin)

```http
GET /admin/invoices?customerId=user-123&status=PENDING&limit=20
Authorization: Bearer {ADMIN_TOKEN}
```

**Success Response (200 OK):**

```json
{
  "invoices": [
    /* all invoices, including soft-deleted */
  ],
  "total": 42,
  "limit": 20,
  "offset": 0,
  "hasMore": true
}
```

---

#### 10. Get Invoice Detail (Admin)

```http
GET /admin/invoices/{invoiceId}
Authorization: Bearer {ADMIN_TOKEN}
```

**Success Response (200 OK):**

```json
{
  "invoiceId": "...",
  "auditLog": [
    {
      "auditLogId": "uuid-audit-1",
      "action": "created",
      "performedBy": "SYSTEM",
      "timestamp": "2026-04-08T10:00:00Z"
    },
    {
      "auditLogId": "uuid-audit-2",
      "action": "soft_deleted",
      "performedBy": "user-id-1234",
      "timestamp": "2026-04-08T10:05:00Z"
    }
  ]
  /* ... rest of invoice fields ... */
}
```

---

#### 11. Resend Invoice (Admin)

```http
POST /admin/invoices/{invoiceId}/resend
Authorization: Bearer {ADMIN_TOKEN}
Content-Type: application/json

{
  "deliveryMethod": "email",
  "recipientEmail": "customer@example.com",
  "note": "Customer requested resend"
}
```

**Success Response (200 OK):**

```json
{
  "success": true,
  "message": "Invoice resent successfully",
  "resendAt": "2026-04-08T10:10:00Z",
  "deliveryMethod": "email"
}
```

---

### ⚠️ Common Errors

#### 409 Conflict - Shipment Already Has Invoice (CREATE Flow)

If you try to create a shipment that already has an invoice:

```json
{
  "status": 409,
  "code": "SHIPMENT_ALREADY_INVOICED",
  "message": "This shipment was already invoiced. Use invoice ID to manage existing invoice.",
  "details": {
    "shipmentId": "s-new-uuid-1234",
    "invoiceId": "inv-new-uuid-5678"
  }
}
```

**Fix:** Use Flow 2 (UPDATE) instead. Pass both `shipmentId` and `invoiceId`.

---

#### 403 Forbidden - Ownership Check (UPDATE Flow)

If you try to update someone else's shipment:

```json
{
  "status": 403,
  "code": "FORBIDDEN",
  "message": "You do not have permission to access this shipment",
  "details": {
    "shipmentId": "other-user-shipment",
    "reason": "Shipment belongs to another customer"
  }
}
```

**Fix:** Make sure you're using the correct `shipmentId` and `invoiceId` from YOUR shipment.

---

## Implementation Guide

### Step 1: Check Your Response Format

When you create a shipment, you now get an invoice object immediately:

```typescript
interface CreateShipmentResponse {
  shipmentId: string;
  invoice: {
    id: string;
    number: string;
    totalAmount: number;
    paymentLink: string;
    pdfDownloadUrl?: string; // May be null if PDF still generating
  };
  pdfGenerationStatus: "READY" | "PENDING";
}
```

### Step 2: Implement Flow 1 (CREATE)

```typescript
// User selects rate and clicks "Create Shipment"
async function createNewShipment(rate, pickupAddress, dropoffAddress) {
  const response = await fetch("/api/shipments", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      rate,
      pickupAddress,
      dropoffAddress,
      package: {...},
      preferredPaymentOption: "stripe",
      // ❌ NO shipmentId or invoiceId
    })
  });

  const data = await response.json();

  // Store for later (Flow 2 - UPDATE)
  localStorage.setItem("lastShipmentId", data.shipmentId);
  localStorage.setItem("lastInvoiceId", data.invoice.id);

  // Show invoice
  displayInvoice(data.invoice);
}
```

### Step 3: Implement Flow 2 (UPDATE)

```typescript
// User's payment link expired, they select new rate
async function renewShipment(newRate) {
  const shipmentId = localStorage.getItem("lastShipmentId");
  const invoiceId = localStorage.getItem("lastInvoiceId");

  const response = await fetch("/api/shipments", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      rate: newRate,
      pickupAddress,
      dropoffAddress,
      package: {...},
      preferredPaymentOption: "stripe",
      shipmentId: shipmentId,    // ✅ EXISTING
      invoiceId: invoiceId       // ✅ EXISTING
    })
  });

  const data = await response.json();

  // Same IDs, updated totals
  console.log("Shipment ID:", data.shipmentId, "- Same as before");
  console.log("Invoice ID:", data.invoice.id, "- Same as before");
  console.log("New total:", data.invoice.totalAmount);
  console.log("New payment link:", data.invoice.paymentLink);
}
```

### Step 4: Handle PDF Generation (May Be Async)

```typescript
async function getPdfUrl(invoiceId, maxRetries = 10) {
  for (let i = 0; i < maxRetries; i++) {
    const response = await fetch(`/api/invoices/${invoiceId}/pdf`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.status === 200) {
      return (await response.json()).downloadUrl;
    }

    if (response.status === 202) {
      // Still generating, wait and retry
      await new Promise((r) => setTimeout(r, 2000));
      continue;
    }

    throw new Error("Failed to get PDF");
  }
}
```

### Step 5: Implement Email Option

```typescript
async function emailInvoice(invoiceId) {
  const response = await fetch(`/api/invoices/${invoiceId}/email`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      recipientEmail: "customer@example.com", // optional
    }),
  });

  const data = await response.json();
  if (response.status === 200) {
    alert("Invoice emailed!");
  } else if (response.status === 202) {
    alert("Email queued. PDF will be sent once ready.");
  }
}
```

---

## Code Examples

### React Hook for Unified Shipment Flow

```typescript
import { useState, useCallback } from "react";

/**
 * Custom hook for handling both Flow 1 (CREATE) and Flow 2 (UPDATE)
 * through the single /api/shipments endpoint
 */
export function useUnifiedShipmentFlow(accessToken: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  /**
   * Flow 1: Create new shipment + invoice
   * NO shipmentId or invoiceId provided
   */
  const createShipment = useCallback(
    async (
      rate,
      pickupAddress,
      dropoffAddress,
      packageData,
      preferredPaymentOption: "stripe" | "payu",
    ) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/shipments`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              rate,
              pickupAddress,
              dropoffAddress,
              package: packageData,
              preferredPaymentOption,
              // ❌ NO shipmentId or invoiceId
            }),
          },
        );

        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData);
          return null;
        }

        const data = await response.json();

        // Status should be 201 (Created)
        if (response.status !== 201) {
          console.warn(`Expected 201, got ${response.status}`);
        }

        return data; // { shipmentId, invoice, ... }
      } catch (err) {
        const apiError = {
          status: 0,
          code: "NETWORK_ERROR",
          message: err instanceof Error ? err.message : "Network error",
          timestamp: new Date().toISOString(),
        };
        setError(apiError);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [accessToken],
  );

  /**
   * Flow 2: Update shipment with new rate (renewal)
   * BOTH shipmentId and invoiceId provided
   */
  const renewShipment = useCallback(
    async (
      shipmentId: string,
      invoiceId: string,
      newRate,
      pickupAddress,
      dropoffAddress,
      packageData,
      preferredPaymentOption: "stripe" | "payu",
    ) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/shipments`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              rate: newRate,
              pickupAddress,
              dropoffAddress,
              package: packageData,
              preferredPaymentOption,
              shipmentId: shipmentId, // ✅ EXISTING
              invoiceId: invoiceId, // ✅ EXISTING
            }),
          },
        );

        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData);
          return null;
        }

        const data = await response.json();

        // Status should be 200 (Updated)
        if (response.status !== 200) {
          console.warn(`Expected 200, got ${response.status}`);
        }

        return data; // { shipmentId (same), invoice (updated), ... }
      } catch (err) {
        const apiError = {
          status: 0,
          code: "NETWORK_ERROR",
          message: err instanceof Error ? err.message : "Network error",
          timestamp: new Date().toISOString(),
        };
        setError(apiError);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [accessToken],
  );

  /**
   * Get PDF download URL (with polling for async generation)
   */
  const getPdfDownloadUrl = useCallback(
    async (invoiceId: string) => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/invoices/${invoiceId}/pdf`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          },
        );

        if (response.status === 200) {
          const data = await response.json();
          return data.downloadUrl; // Ready!
        }

        if (response.status === 202) {
          const data = await response.json();
          console.log(`PDF generating... retry after ${data.retryAfter}s`);
          return null; // Still generating
        }

        throw new Error(`HTTP ${response.status}`);
      } catch (err) {
        console.error("Error getting PDF:", err);
        return null;
      }
    },
    [accessToken],
  );

  /**
   * Send invoice via email
   */
  const emailInvoice = useCallback(
    async (invoiceId: string, recipientEmail?: string) => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/invoices/${invoiceId}/email`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ recipientEmail }),
          },
        );

        return await response.json();
      } catch (err) {
        console.error("Error emailing invoice:", err);
        return null;
      }
    },
    [accessToken],
  );

  return {
    loading,
    error,
    createShipment, // Flow 1
    renewShipment, // Flow 2
    getPdfDownloadUrl, // PDF polling
    emailInvoice, // Email delivery
  };
}
```

### React Component Example - Full Workflow

```typescript
import React, { useState, useEffect } from "react";
import { useUnifiedShipmentFlow } from "./useUnifiedShipmentFlow";

export function ShipmentWorkflow({ accessToken }) {
  const { createShipment, renewShipment, getPdfDownloadUrl, emailInvoice, loading, error } = useUnifiedShipmentFlow(accessToken);

  const [currentShipment, setCurrentShipment] = useState(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);

  /**
   * Step 1: User selects rate and creates shipment (Flow 1)
   */
  const handleCreateShipment = async () => {
    const result = await createShipment(
      selectedRate,  // e.g., { serviceType: "express", carrierPrice: 50 }
      pickupAddr,
      dropoffAddr,
      packageInfo,
      "stripe"
    );

    if (result) {
      setCurrentShipment(result);
      console.log("✅ Shipment created:", result.shipmentId);
      console.log("✅ Invoice created:", result.invoice.id);
      console.log("✅ Payment link:", result.invoice.paymentLink);
    }
  };

  /**
   * Step 2a: Poll for PDF if it's still generating
   */
  const handleGetPdf = async () => {
    if (!currentShipment) return;

    setPdfLoading(true);

    // Poll until ready
    for (let attempt = 0; attempt < 10; attempt++) {
      const pdfDownloadUrl = await getPdfDownloadUrl(currentShipment.invoice.id);

      if (pdfDownloadUrl) {
        setPdfUrl(pdfDownloadUrl);
        break;
      }

      // Wait before retry
      await new Promise((r) => setTimeout(r, 2000));
    }

    setPdfLoading(false);
  };

  /**
   * Step 2b: Send invoice email
   */
  const handleEmailInvoice = async () => {
    if (!currentShipment) return;

    const result = await emailInvoice(
      currentShipment.invoice.id,
      "customer@example.com"
    );

    if (result?.status === "success") {
      alert("Email sent!");
    } else if (result?.status === "accepted") {
      alert("Email queued (will send when PDF is ready)");
    }
  };

  /**
   * Step 3: User's payment link expired, select new rate (Flow 2 - UPDATE)
   */
  const handleRenewShipment = async () => {
    if (!currentShipment) return;

    const result = await renewShipment(
      currentShipment.shipmentId,        // ✅ EXISTING
      currentShipment.invoice.id,        // ✅ EXISTING
      newSelectedRate,                   // NEW rate
      pickupAddr,
      dropoffAddr,
      packageInfo,
      "stripe"
    );

    if (result) {
      setCurrentShipment(result); // Update with new totals
      setPdfUrl(null); // Reset PDF URL (regenerated)
      console.log("✅ Shipment updated");
      console.log("✅ Invoice updated (same ID, new rate)");
      console.log("✅ Fresh payment link:", result.invoice.paymentLink);
    }
  };

  return (
    <div className="shipment-workflow">
      <h2>Unified Shipment → Invoice → Payment Flow</h2>

      {error && (
        <div className="error" role="alert">
          <strong>{error.code}:</strong> {error.message}
        </div>
      )}

      {/* Step 1: Create Shipment */}
      {!currentShipment && (
        <section className="step-1">
          <h3>Step 1: Create Shipment</h3>
          <button onClick={handleCreateShipment} disabled={loading}>
            {loading ? "Creating..." : "Create Shipment"}
          </button>
        </section>
      )}

      {/* Step 2: Invoice Details + Actions */}
      {currentShipment && (
        <section className="step-2">
          <h3>Step 2: Invoice & Payment</h3>

          <div className="invoice-summary">
            <p>
              <strong>Invoice:</strong> {currentShipment.invoice.number}
            </p>
            <p>
              <strong>Total:</strong> {currentShipment.invoice.totalAmount} PLN
            </p>
            <p>
              <strong>Tax (23%):</strong> {currentShipment.invoice.tax} PLN
            </p>
          </div>

          {/* Payment Button */}
          <a
            href={currentShipment.invoice.paymentLink}
            target="_blank"
            className="btn-primary"
          >
            💳 Pay Now ({currentShipment.paymentGateway})
          </a>

          {/* PDF Download */}
          <button onClick={handleGetPdf} disabled={pdfLoading}>
            {pdfLoading ? "Getting PDF..." : "📄 Download Invoice"}
          </button>

          {pdfUrl && (
            <a href={pdfUrl} download className="btn-secondary">
              Download PDF
            </a>
          )}

          {/* Email Option */}
          <button onClick={handleEmailInvoice}>
            📧 Email Invoice
          </button>

          {/* Renewal Option (Flow 2) */}
          <button
            onClick={handleRenewShipment}
            className="btn-secondary"
            title="Select new rate to renew payment link"
          >
            🔄 Renew (New Rate)
          </button>
        </section>
      )}

      {/* Step 3: Renewal (if user clicks "Renew") */}
      {currentShipment && showRenewalForm && (
        <section className="step-3">
          <h3>Step 3: Renew with New Rate</h3>
          <p>
            This will update your shipment with the new rate and generate a fresh
            payment link (same shipment/invoice ID, updated totals).
          </p>
          <button onClick={handleRenewShipment} disabled={loading}>
            {loading ? "Updating..." : "Confirm & Renew"}
          </button>
        </section>
      )}
    </div>
  );
}
```

---

## Error Handling

### Understanding the Different Error Scenarios

#### Scenario 1: Trying Flow 2 (UPDATE) When invoiceId Is Invalid

```json
{
  "status": 400,
  "code": "INVALID_INVOICE_ID",
  "message": "Invoice ID is invalid or missing",
  "details": { "invoiceId": "invoice does not exist" }
}
```

**Why:** You passed `invoiceId` but it doesn't exist or doesn't match the shipment.

**Fix:** Make sure you're using the correct `invoiceId` from the earlier CREATE response.

---

#### Scenario 2: Network Timeout While Polling PDF

```typescript
// After 10 retries, still no PDF
console.error("PDF generation timeout - giving up after 10 attempts");
```

**Why:** PDF generation is taking longer than expected (< 1% chance).

**Fix:** Show user message: "PDF is taking longer than expected. Please refresh to try again or email us."

---

#### Scenario 3: User Tries to Access Another User's Invoice

```json
{
  "status": 403,
  "code": "FORBIDDEN",
  "message": "You do not have permission to access this invoice",
  "details": { "invoiceId": "other-user-invoice" }
}
```

**Fix:** Ensure your app only passes invoice IDs that belong to the logged-in user.

---

### Generic Error Handling Pattern

```typescript
async function handleApiCall<T>(
  fetch: () => Promise<Response>,
  context: string,
): Promise<T | null> {
  try {
    const response = await fetch();

    if (!response.ok) {
      const error = await response.json();
      console.error(`${context} failed:`, error.code, error.message);

      if (response.status === 401) {
        // Redirect to login
        window.location.href = "/login";
        return null;
      }

      if (response.status === 403) {
        // Show permission error
        alert("You don't have permission to do this");
        return null;
      }

      if (response.status === 404) {
        // Resource not found
        alert(`${context}: Resource not found`);
        return null;
      }

      if (response.status >= 500) {
        // Server error - show generic message
        alert("Something went wrong. Please try again later.");
        return null;
      }

      // Other errors
      alert(`Error: ${error.message}`);
      return null;
    }

    return await response.json();
  } catch (err) {
    console.error(`${context} network error:`, err);
    alert("Network error. Please check your connection.");
    return null;
  }
}
```

---

## Testing

### ✅ Test Scenarios

#### Test 1: CREATE Flow (Happy Path)

```typescript
test("CREATE flow: new shipment + invoice", async () => {
  // Setup
  const rate = { serviceType: "domestic", carrierPrice: 50 };

  // Execute
  const result = await createShipment(
    rate,
    pickupAddr,
    dropoffAddr,
    pkg,
    "stripe",
  );

  // Assert
  expect(result.shipmentId).toBeDefined();
  expect(result.invoice.id).toBeDefined();
  expect(result.invoice.paymentLink).toBeDefined();
  expect(result.invoice.totalAmount).toBe(61.5); // 50 + 23% tax

  // Save for Flow 2 test
  lastShipmentId = result.shipmentId;
  lastInvoiceId = result.invoice.id;
});
```

#### Test 2: UPDATE Flow (Renewal with New Rate)

```typescript
test("UPDATE flow: renew with new rate", async () => {
  // Setup (use IDs from Test 1)
  const newRate = { serviceType: "express_intl", carrierPrice: 75 };

  // Execute
  const result = await renewShipment(
    lastShipmentId, // ✅ SAME
    lastInvoiceId, // ✅ SAME
    newRate, // ✅ NEW
    pickupAddr,
    dropoffAddr,
    pkg,
    "payu",
  );

  // Assert
  expect(result.shipmentId).toBe(lastShipmentId); // Unchanged
  expect(result.invoice.id).toBe(lastInvoiceId); // Unchanged
  expect(result.invoice.totalAmount).toBe(92.25); // 75 + 23% tax (NEW)
  expect(result.invoice.paymentLink).not.toBe(lastPaymentLink); // NEW link
});
```

#### Test 3: PDF Polling

```typescript
test("PDF generation polling", async () => {
  // First call returns 202 (still generating)
  let pdfUrl = await getPdfDownloadUrl(invoiceId);
  expect(pdfUrl).toBeNull();

  // Wait and retry
  await new Promise((r) => setTimeout(r, 3000));

  // Second call returns 200 (ready)
  pdfUrl = await getPdfDownloadUrl(invoiceId);
  expect(pdfUrl).toBeDefined();
  expect(pdfUrl).toContain("s3.amazonaws.com");
});
```

#### Test 4: Email Delivery

```typescript
test("Email invoice delivery", async () => {
  const result = await emailInvoice(invoiceId, "test@example.com");

  expect(result.status).toMatch(/^(success|accepted)$/);
  expect(result.sentTo).toBe("test@example.com");
});
```

#### Test 5: Ownership Validation

```typescript
test("Ownership validation prevents access", async () => {
  // Try to access another user's shipment
  const result = await renewShipment(
    otherUserShipmentId,
    otherUserInvoiceId,
    newRate,
    pickupAddr,
    dropoffAddr,
    pkg,
    "stripe",
  );

  expect(result).toBeNull();
  expect(error.status).toBe(403);
  expect(error.code).toBe("FORBIDDEN");
});
```

### 🎯 Complete Integration Test Checklist

- [ ] CREATE flow creates shipment + invoice with 201 status
- [ ] UPDATE flow updates with same IDs and 200 status
- [ ] Invalid shipmentId is handled gracefully (silent fallback to CREATE)
- [ ] Invalid invoiceId is handled gracefully (silent fallback to CREATE)
- [ ] Ownership check prevents access to other users' shipments (403)
- [ ] PDF generation is async (returns 202 on first call)
- [ ] PDF polling works (eventually returns 200 with URL)
- [ ] Email endpoint sends immediately when PDF ready (200)
- [ ] Email endpoint queues when PDF pending (202)
- [ ] Tax recalculation works on UPDATE (new rate → new tax)
- [ ] Payment link changes on UPDATE (fresh expiration)
- [ ] Payment link format is correct (https://pay.mls.system/...)
- [ ] Backward compatibility: checkoutUrl still in response

---

## Changelog

- **v2.1** (2026-04-08): **MAJOR RESTRUCTURING** - Complete flow clarity overhaul
  - ✨ Added "Quick Start - User Flows" section with 3 visual flow diagrams
  - 🎯 Flows clearly labeled: CREATE (Flow 1), UPDATE (Flow 2), EMAIL (Flow 3)
  - 📝 Added inline code comments (❌ NO, ✅ YES) for flow discrimination
  - 🔧 Reorganized API Endpoints with side-by-side CREATE vs UPDATE examples
  - 📋 Added step-by-step flow execution guides (what happens at each step)
  - 💡 Enhanced TypeScript Interfaces with quick reference section
  - 🧪 Added comprehensive testing section with 13 test scenarios
  - 📊 Added complete integration test checklist
  - 🎓 Improved Implementation Guide with concrete examples

- **v2.0** (2026-04-06): Unified Shipment-to-Invoice Flow Implementation
  - Consolidated shipment + invoice creation into single `POST /api/shipments` endpoint
  - Optional `shipmentId` and `invoiceId` parameters for renewal/update flow
  - Auto-generated invoices with payment links on shipment creation
  - Async PDF generation with polling endpoints (GET /invoices/{id}/pdf)
  - Email delivery endpoint (POST /invoices/{id}/email)
  - Soft delete and restore functionality for invoices
  - Payment link regeneration for expired invoices

- **v1.0** (2026-04-06): Initial Invoice System Release
  - Core invoice generation and management
  - Customer and admin endpoints
  - PDF download and email delivery
  - Tax calculation and payment gateway integration
