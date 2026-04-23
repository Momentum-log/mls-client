# PRD: Invoice Receipt UI & Shipment Update Flow

**Feature Name:** Invoice Receipt UI with Payment, Download, Email & Update Shipment  
**Version:** 1.0.0  
**Date:** 2026-04-11  
**Priority:** 🔴 Urgent (1–2 weeks)  
**Status:** Draft  

---

## 1. Introduction / Overview

After a user creates a shipment, the system generates an invoice with a payment link. Currently, the user is either redirected to a checkout URL or to an invoice page, but there is no polished, receipt-style invoice UI that clearly presents the invoice details and guides the user through their next steps.

This feature introduces a **premium receipt-style invoice viewer** that shows invoice details (line items, tax breakdown, totals, status), and provides clear calls to action: **Pay Now**, **Download PDF**, and **Send via Email**. It also introduces an **"Update Shipment"** flow for expired or pending invoices, allowing users to select a new rate without re-entering all shipment details.

### Problem Statement

- Users have no clear, visually rich invoice view after shipment creation.
- Users with expired or pending invoices cannot easily update their shipment/rate — they must re-create the entire shipment from scratch.
- The `userCountryCode` in the create-shipment payload sometimes sends `"EU"` as a fallback (which is not a valid ISO 3166-1 alpha-2 country code), though this is accepted by the backend and will remain as-is per business decision.

### Goals

- Display a receipt-style invoice UI immediately after shipment creation.
- Allow users to revisit their invoice from the shipment details page.
- Provide inline rate-update capability for pending/expired invoices.
- Handle async PDF generation gracefully with polling.

---

## 2. Goals

1. **G1:** Display a polished, receipt-style invoice UI on a dedicated page (`/app/invoices/[invoiceId]`) after shipment creation.
2. **G2:** Provide a "View Invoice" side drawer from the shipment details page (`/app/shipments/[id]`) for quick access.
3. **G3:** Implement three CTAs per invoice: **Pay Now** (prominent), **Download PDF** (prominent), **Send via Email** (secondary).
4. **G4:** Show a prominent countdown timer for payment link expiration at the top of the invoice view AND near the Pay button.
5. **G5:** Handle PDF generation polling transparently (show loading state, auto-retry, enable download once ready).
6. **G6:** Implement an inline rate-picker modal for the "Update Shipment" flow (pending/expired invoices only).
7. **G7:** Block "Update Shipment" for paid invoices — only allow for `PENDING` or `EXPIRED` statuses.
8. **G8:** Send `shipmentId` and `invoiceId` in the update payload so the backend knows to update (not create new).

---

## 3. User Stories

### US1: First-Time Invoice Viewing (Post-Creation)
> As a user who just created a shipment, I want to be redirected to a dedicated invoice page so I can review the invoice details, see the total amount with tax breakdown, and decide whether to pay, download, or email the invoice.

### US2: Returning to an Unpaid Invoice
> As a user who created a shipment but didn't pay, I want to click on that shipment in "My Shipments" and quickly view the invoice in a side drawer so I can pick up where I left off.

### US3: Downloading the Invoice PDF
> As a user viewing my invoice, I want to click "Download" and get a PDF. If the PDF is still being generated, I want to see a clear loading indicator and have the button become active once it's ready.

### US4: Paying for My Shipment
> As a user viewing my invoice, I want to click "Pay Now" to be redirected to the payment gateway (Stripe/PayU). I want to see a countdown timer showing when my payment link expires.

### US5: Emailing My Invoice
> As a user, I want to click "Send via Email" and have the invoice sent to my registered email address without needing to type it in.

### US6: Updating a Pending/Expired Shipment
> As a user whose payment link expired or whose invoice is pending, I want to click "Update Shipment" to open a rate-picker modal where I can select a new rate. The system should update my existing shipment and invoice (not create new ones) and give me a fresh payment link.

### US7: Preventing Updates on Paid Invoices
> As a user viewing a paid invoice, I should NOT see the "Update Shipment" button, since paid invoices/shipments cannot be modified.

---

## 4. Features / Tasks

### Invoice Page — `IP` (Dedicated Invoice Page)

- **IP01**: Create a dedicated invoice page at `/app/invoices/[invoiceId]/page.tsx` that fetches and displays the full invoice data.
- **IP02**: Build a receipt-style invoice layout with the following sections:
  - Header: Invoice number, status badge, creation date
  - Expiration countdown timer (prominent banner at top for PENDING/EXPIRED)
  - Seller info (MLS Logistics details)
  - Buyer info (customer details)
  - Line items table (service name, quantity, unit price, tax rate, gross amount)
  - Tax breakdown summary (net, VAT, total gross)
  - Payment link status section
- **IP03**: Implement three CTA buttons at the bottom:
  - **Pay Now** — Primary/prominent button. Links to `invoice.paymentLink`. Disabled if status is `PAID` or link is expired.
  - **Download PDF** — Primary button. Polls `GET /api/invoices/{invoiceId}/pdf` if `pdfDownloadUrl` is null. Shows spinner while generating.
  - **Send via Email** — Secondary/text-link button. Calls `POST /api/invoices/{invoiceId}/email` with no body (uses user's registered email). Shows confirmation toast.
- **IP04**: Implement a prominent expiration countdown timer at the top of the page (banner style) for PENDING invoices with an active payment link. Also show expiration text near the "Pay Now" button (e.g., "Expires in 23h 14m").
- **IP05**: Conditionally show an **"Update Shipment"** button for `PENDING` or `EXPIRED` invoice statuses. Include a note explaining: _"Updating your shipment allows you to select a new rate or renew an expired invoice. Your existing shipment and invoice will be updated."_
- **IP06**: Hide/disable "Update Shipment" and "Pay Now" when invoice status is `PAID`. Show a "Payment Received" confirmation banner instead.

### Invoice Side Drawer — `SD` (Quick View from Shipment Details)

- **SD01**: Create an `InvoiceDrawer` component that slides in from the right (similar to `SummaryDrawer`).
- **SD02**: Add a "View Invoice" button to the shipment details page sidebar (where `InvoiceCard` currently lives). Clicking it opens the `InvoiceDrawer`.
- **SD03**: The drawer should show a condensed version of the receipt UI (invoice number, status, amount, tax, line items, CTAs).
- **SD04**: Include the same three CTAs (Pay Now, Download, Email) and "Update Shipment" button in the drawer.
- **SD05**: Add a "View Full Invoice" link in the drawer that navigates to the dedicated page (`/app/invoices/[invoiceId]`).

### Update Shipment Flow — `UF` (Inline Rate Picker)

- **UF01**: Create an `UpdateShipmentModal` component that opens as a modal overlay from the invoice view.
- **UF02**: When "Update Shipment" is clicked, the modal should:
  - Fetch fresh rates using the existing shipment data (pickup/dropoff addresses, package dimensions) via the existing estimate endpoint.
  - Display the rate list using the existing `ServiceSelection` component pattern.
  - Show a payment method selector (Stripe/PayU).
- **UF03**: On rate selection and confirmation, call `POST /api/shipments` with the full shipment payload INCLUDING `shipmentId` and `invoiceId` to trigger the UPDATE flow (Flow 2 from the integration guide).
- **UF04**: The payload must include all original shipment data (addresses, package, customs) plus the new rate, plus `shipmentId` and `invoiceId`.
- **UF05**: On success (200 OK), refresh the invoice data on the page/drawer to show updated amounts, new payment link, and new expiration.
- **UF06**: Show loading state during the update process. Show success/error toasts.
- **UF07**: Only allow this flow when `invoice.status` is `PENDING` or `EXPIRED`. Programmatically prevent opening the modal for `PAID` invoices.

### Post-Shipment-Creation Redirect — `PR` (Navigation)

- **PR01**: After `performCreateShipment` succeeds in `NewShipmentPage`, redirect to `/app/invoices/{invoice.id}` (the dedicated invoice page). This is already partially implemented (line 438 of `new/page.tsx`).
- **PR02**: Store `shipmentId` and `invoiceId` in localStorage for potential use in the update flow (already partially implemented).
- **PR03**: If the response has no `invoice.id`, fall back to the `checkoutUrl` redirect (backward compatibility).

### PDF Polling — `PD` (Async PDF Handling)

- **PD01**: Use the existing `usePdfStatus` hook to poll `GET /api/invoices/{invoiceId}/pdf` when `pdfGenerationStatus` is `PENDING` or `pdfDownloadUrl` is `null`.
- **PD02**: Show a spinner/loading text on the "Download" button while PDF is generating.
- **PD03**: Once PDF is ready (status 200), update the button to "Download PDF" and enable click-to-download.
- **PD04**: Handle PDF generation failure with an error state and "Retry" button.

### Email Invoice — `EI` (Send via Email)

- **EI01**: On "Send via Email" click, call `POST /api/invoices/{invoiceId}/email` with no `recipientEmail` in the body (server defaults to user's registered email).
- **EI02**: Show a toast: "Invoice sent to your email" (200) or "Invoice will be sent when PDF is ready" (202).
- **EI03**: No email input prompt — always uses the logged-in user's email.

### Expiration Countdown — `EC` (Timer UI)

- **EC01**: Create a reusable `ExpirationCountdown` component that accepts `expiresAt` (ISO-8601 string) and renders a live countdown (hours, minutes, seconds).
- **EC02**: Three visual states:
  - **Active** (>24h remaining): Blue banner, calm styling.
  - **Expiring Soon** (<24h): Yellow/amber banner with urgency.
  - **Expired**: Red banner with "Payment link expired" message and "Update Shipment" CTA.
- **EC03**: Place the countdown banner at the top of the invoice page/drawer.
- **EC04**: Show a compact version of the countdown text near the "Pay Now" button.

### Data & API Integration — `DA` (Hooks & Services)

- **DA01**: Create or extend a hook `useInvoiceDetail(invoiceId)` that fetches `GET /api/invoices/{invoiceId}` and returns the full invoice object.
- **DA02**: Use the existing `useInvoiceDownload`, `useInvoiceEmail`, `useInvoicePaymentFlow`, and `useInvoiceUpdateFlow` hooks where applicable.
- **DA03**: For the Update Shipment flow, use `useGetShippingEstimate` to fetch rates and `useCreateShipment` to submit the update (with `shipmentId` + `invoiceId` in payload).
- **DA04**: Ensure the shipment detail API (`useGetShipment`) returns invoice data so the side drawer can access it without extra API calls.

### Shipment Details Page Integration — `SI` (Wire Up)

- **SI01**: Replace or enhance the current `InvoiceCard` in the shipment details sidebar with a "View Invoice" button that opens the `InvoiceDrawer`.
- **SI02**: Keep the existing compact `InvoiceCard` visible in the sidebar, but add an "Open Invoice" button that triggers the drawer.
- **SI03**: Pass all necessary invoice data from the shipment detail response to the drawer component.

---

## 5. Non-Goals (Out of Scope)

- **Admin invoice management UI** — Admin endpoints exist but the admin panel is not part of this feature.
- **Invoice PDF preview/render in-browser** — PDF is download-only. No in-browser PDF rendering.
- **Multi-invoice batch operations** — Users handle one invoice at a time.
- **Payment gateway integration changes** — The payment flow itself (Stripe/PayU checkout) is unchanged. We only link to the existing `paymentLink`.
- **Changing the `userCountryCode` fallback** — The current `"EU"` fallback when geolocation fails will remain as-is per business decision.
- **Full shipment form for updates** — The "Update Shipment" flow uses an inline rate-picker modal, NOT the full multi-step shipment creation form.
- **Invoice deletion or restoration UI** — Soft-delete/restore is API-only for now.
- **Changing the invoice number format** — Stays as `MLS-INV-XXXXXX-YYYY`.

---

## 6. Design Considerations

### UI Style
- **Flat, minimalist, modern** design per project standards. **No gradients.**
- All colors from `global.css` CSS variables (`bg-brand-blue`, `text-text-color`, etc.).
- Receipt-style layout inspired by clean, modern invoice designs (think Stripe receipts).

### Invoice Page Layout (Desktop)

```
┌─────────────────────────────────────────────────────────┐
│ ⏱ Payment link expires in 23h 14m 32s    [PENDING]      │  ← EC02/EC03
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Invoice #MLS-INV-933018-2026              11 Apr 2026  │
│                                                         │
│  From: MLS Logistics Sp. z o.o.                         │
│  To:   Adedotun Gabriel                                 │
│                                                         │
│  ┌─────────────────────────────────────────────────────┐│
│  │ Service                  Qty   Rate   VAT%  Gross   ││
│  │ FedEx International...   1     817.36  0%   817.36  ││
│  └─────────────────────────────────────────────────────┘│
│                                                         │
│  Net Amount:                                   817.36   │
│  VAT (0%):                                       0.00   │
│  ─────────────────────────────────                      │
│  Total:                                    EUR 817.36   │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  Send via Email     │
│  │   Pay Now     │  │  Download    │  (text link)        │
│  └──────────────┘  └──────────────┘                     │
│                    Expires in 23h 14m ← EC04             │
│                                                         │
│  ┌──────────────────────────────────────────────────┐   │
│  │ 🔄 Update Shipment                               │   │
│  │ Select a new rate or renew an expired invoice.   │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### Existing Components to Reuse
- `InvoiceStatusBadge` — Status pill (PENDING, PAID, EXPIRED)
- `InvoiceActions` — Pay, Download, Email, Update buttons (refactor/enhance)
- `InvoiceCard` — Compact card for sidebar (keep as-is)
- `ServiceSelection` — Rate list for the Update Shipment modal
- `SummaryDrawer` — Pattern reference for the InvoiceDrawer
- `Button`, `Card`, `Spinner` — UI primitives
- `usePdfStatus` — PDF polling hook
- `useInvoiceEmail`, `useInvoiceDownload`, `useInvoiceUpdateFlow` — Existing hooks
- `useDuplicateShipment` — Pattern reference for pre-filling shipment data

### Responsive Design
- **Desktop:** Two-column layout (invoice details left, actions/summary right).
- **Tablet:** Single column, stacked.
- **Mobile:** Full-width, stacked. Drawer becomes bottom-sheet style.

---

## 7. Technical Considerations

### API Endpoints Used

| Endpoint | Method | Purpose |
|---|---|---|
| `GET /api/invoices/{invoiceId}` | GET | Fetch full invoice details |
| `GET /api/invoices/{invoiceId}/pdf` | GET | Check PDF status / get download URL |
| `POST /api/invoices/{invoiceId}/email` | POST | Send invoice to user's email |
| `POST /api/shipments` | POST | Create (Flow 1) or Update (Flow 2) shipment |
| `POST /api/shipments/estimate` | POST | Fetch fresh rates for update flow |

### Key Data Flow — Update Shipment

```
User clicks "Update Shipment"
    → Open UpdateShipmentModal
    → Fetch rates via POST /api/shipments/estimate
        (using original pickup/dropoff/package from shipment)
    → User selects new rate + payment method
    → POST /api/shipments with:
        {
          ...originalShipmentData,
          rate: newSelectedRate,
          shipmentId: existingShipmentId,      // ✅ triggers UPDATE
          invoiceId: existingInvoiceId,         // ✅ triggers UPDATE
          preferredPaymentOption: "stripe",
          userCountryCode: detectedCountryCode
        }
    → Server returns 200 OK with updated invoice
    → Refresh invoice UI with new data
```

### State Management
- **Zustand** (`useShipmentStore`, `useCountryStore`) for shipment/country state.
- **React Query** for server state (invoice fetching, PDF polling, rate fetching).
- **Local component state** for modal/drawer open/close, countdown timer.

### Dependencies
- No new external dependencies required.
- Uses existing: `framer-motion` (drawer animations), `react-icons` (icons), `zustand` (state), `@tanstack/react-query` (data fetching).

### File Structure (New/Modified)

```
New files:
├── app/app/invoices/[invoiceId]/page.tsx          ← IP01: Dedicated invoice page
├── components/invoice/InvoiceDrawer.tsx            ← SD01: Side drawer component
├── components/invoice/UpdateShipmentModal.tsx      ← UF01: Rate picker modal
├── components/invoice/ExpirationCountdown.tsx      ← EC01: Countdown timer
├── components/invoice/InvoiceReceiptView.tsx       ← IP02: Receipt layout (shared)

Modified files:
├── app/app/shipments/[id]/page.tsx                ← SI01-03: Add drawer trigger
├── components/invoice/InvoiceActionsNew.tsx        ← IP03: Enhance CTAs
├── components/invoice/index.ts                     ← Export new components
├── hooks/invoices/useInvoices.ts                   ← DA01: Add/extend useInvoiceDetail
```

### `userCountryCode` Note
The current fallback of `"EU"` when geolocation fails will remain unchanged. The backend accepts this value and determines the appropriate currency. This is a conscious business decision.

---

## 8. Success Metrics

| Metric | Target | Measurement |
|---|---|---|
| Invoice view engagement | >80% of users view invoice before paying | Track page visits vs. direct checkout |
| PDF download rate | >30% of users download invoice PDF | Track download button clicks |
| Payment conversion from invoice page | >60% click "Pay Now" from invoice | Track CTA clicks |
| Update Shipment usage | >50% of expired invoices use "Update" instead of creating new | Track update flow completions |
| Time to payment | <5 minutes from shipment creation to payment | Measure timestamp delta |

---

## 9. Open Questions

1. **Shipment data availability in invoice detail API:** Does `GET /api/invoices/{invoiceId}` return enough shipment data (addresses, package, customs) for the Update Shipment modal's rate re-calculation? Or do we need to also call `GET /api/shipments/{shipmentId}` to get the full shipment details?

2. **Rate re-calculation scope:** When the user clicks "Update Shipment," should we re-fetch rates using the EXACT same addresses/package from the original shipment, or allow them to modify anything? (Current assumption: exact same data, only rate changes.)

3. **Payment link regeneration vs. full update:** If a user's payment link expired but they're happy with the same rate, should we offer a simpler "Regenerate Payment Link" option (calls `POST /api/invoices/{invoiceId}/regenerate-link`) in addition to the full "Update Shipment" flow?

4. **Invoice page access control:** Should the invoice page be accessible only to the user who created the shipment, or should guest/unauthenticated users with the invoice ID be able to view it? (Current assumption: authenticated users only.)

5. **Carrier slug availability:** The Update Shipment payload requires `carrierSlug`. Is this always available from the shipment detail API response, or do we need to derive it from the carrier name?

---

## Appendix A: Response Shape Reference

### Create Shipment Response (from user-provided data)

```json
{
  "shipmentId": "ed589dfe-e969-4293-8c0f-7824ae845e62",
  "customTrackingNumber": "MLS-TRK-A1845C5939C1",
  "checkoutUrl": "https://checkout.stripe.com/...",
  "paymentGateway": "stripe",
  "invoice": {
    "id": "03e92b53-8ae0-4216-b7cb-34d98bb130ab",
    "number": "MLS-INV-933018-2026",
    "status": "PENDING",
    "totalAmount": 817.36,
    "currency": "EUR",
    "tax": 0,
    "taxRate": { "0": { "taxRate": 0, "netTotal": 817.36, "vatTotal": 0, "grossTotal": 817.36 } },
    "lineItems": [
      {
        "id": "b30e8ee8-436e-4871-a847-c421fbfc39ae",
        "invoiceId": "03e92b53-8ae0-4216-b7cb-34d98bb130ab",
        "lineNumber": 1,
        "serviceName": "FedEx - FedEx International First®",
        "unitOfMeasure": "usługa",
        "quantity": 1,
        "unitNetPrice": 817.36,
        "netValue": 817.36,
        "taxRate": 0,
        "vatAmount": 0,
        "grossValue": 817.36,
        "gtuCode": "GTU_13",
        "shipmentOriginCountry": "NG",
        "createdAt": "2026-04-11T13:26:44.416Z"
      }
    ],
    "createdAt": "2026-04-11T13:26:44.416Z",
    "updatedAt": "2026-04-11T13:26:44.416Z",
    "paymentLink": "https://checkout.stripe.com/...",
    "paymentLinkExpiresAt": "2026-04-12T13:26:44.416Z",
    "pdfDownloadUrl": null
  },
  "pdfGenerationStatus": "PENDING"
}
```

### Create Shipment Payload (for update flow reference)

```json
{
  "carrierSlug": "fedex",
  "pickupAddress": { "streetLines": ["..."], "city": "...", "countryCode": "NG", "..." : "..." },
  "dropoffAddress": { "streetLines": ["..."], "city": "...", "countryCode": "US", "..." : "..." },
  "package": { "weight": { "value": 20, "units": "KG" }, "dimensions": { "length": 70, "width": 50, "height": 30, "units": "CM" } },
  "rate": { "serviceType": "INTERNATIONAL_FIRST", "serviceName": "FedEx International First®", "carrierPrice": 817.36, "actualPrice": 939.96, "currency": "EUR" },
  "customs": { "currency": "EUR", "firstName": "Adedotun", "secondaryName": "Gabriel", "customsType": "S", "grossWeight": 20, "categoryOfItem": "11", "customsItem": [{ "item": [{ "value": 200, "nameEn": "100% Cotton Printed T-Shirt", "namePl": "100% Cotton Printed T-Shirt", "weight": 20, "quantity": 1, "tariffCode": "52083216" }] }] },
  "userCountryCode": "IN",
  "preferredPaymentOption": "stripe",
  "shipmentId": "ed589dfe-e969-4293-8c0f-7824ae845e62",
  "invoiceId": "03e92b53-8ae0-4216-b7cb-34d98bb130ab"
}
```

---

## Appendix B: Existing Code References

| Component/Hook | Path | Relevance |
|---|---|---|
| `InvoiceCard` | `components/invoice/InvoiceCardNew.tsx` | Compact card (keep, add drawer trigger) |
| `InvoiceActions` | `components/invoice/InvoiceActionsNew.tsx` | CTAs (enhance for receipt view) |
| `InvoiceDetailModal` | `components/invoice/InvoiceDetailModal.tsx` | Reference for modal pattern |
| `InvoiceReceipt` | `components/invoice/InvoiceReceiptNew.tsx` | Post-payment receipt (reference) |
| `InvoiceStatusBadge` | `components/invoice/InvoiceStatusBadge.tsx` | Reuse directly |
| `ServiceSelection` | `components/shipment/service-selection.tsx` | Reuse in UpdateShipmentModal |
| `SummaryDrawer` | `components/shipment/summary-drawer.tsx` | Pattern reference for InvoiceDrawer |
| `usePdfStatus` | `hooks/invoices/usePdfStatus.ts` | PDF polling (reuse directly) |
| `useInvoiceEmail` | `hooks/invoices/useInvoiceEmail.ts` | Email sending (reuse directly) |
| `useInvoiceUpdateFlow` | `hooks/invoices/useInvoiceUpdateFlow.ts` | Update flow (extend/reuse) |
| `useDuplicateShipment` | `hooks/shipments/use-duplicate-shipment.ts` | Pre-fill pattern reference |
| `useCountryStore` | `store/country-store.ts` | Country/currency detection |
| `Shipment Details Page` | `app/app/shipments/[id]/page.tsx` | Integration point for drawer |
| `New Shipment Page` | `app/app/shipments/new/page.tsx` | Post-creation redirect source |
