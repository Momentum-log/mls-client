/\*\*

- Invoice Components Integration Guide
-
- Comprehensive guide for developers integrating the new invoice management components
- into the MLS client application.
-
- @file docs/invoice-components-integration.md
  \*/

# Invoice Components Integration Guide

This guide covers the new invoice management components and how to integrate them into your pages and workflows.

## Components Overview

### 1. **InvoiceStatusBadge**

Displays the current invoice status with color-coded styling.

```tsx
import { InvoiceStatusBadge } from "@/components/invoice";
import { InvoiceStatus } from "@/types/invoice";

export function MyComponent({ invoice }) {
  return <InvoiceStatusBadge status={invoice.status} className="mb-2" />;
}
```

**Styling:**

- PENDING → yellow/warning
- EXPIRED → red/destructive
- PAID → green/success

### 2. **InvoiceActions**

Renders action buttons for invoice management (download, email, update, pay).

```tsx
import { InvoiceActions } from "@/components/invoice";
import { PdfGenerationStatus } from "@/types/invoice";

export function MyComponent({ invoice, shipmentId }) {
  const handleUpdate = (invoiceId: string, shipmentId: string) => {
    // Navigate to update flow: /app/shipments/new?invoiceId={id}&shipmentId={sid}
    router.push(
      `/app/shipments/new?invoiceId=${invoiceId}&shipmentId=${shipmentId}`,
    );
  };

  const handleEmail = (invoiceId: string, email?: string) => {
    // Send email request to backend
    fetch(`/api/invoices/${invoiceId}/email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email || invoice.customerEmail }),
    });
  };

  return (
    <InvoiceActions
      invoice={invoice}
      pdfGenerationStatus={shipmentResponse.pdfGenerationStatus}
      pdfDownloadUrl={invoice.pdfDownloadUrl}
      shipmentId={shipmentId}
      onUpdate={handleUpdate}
      onEmail={handleEmail}
      className="justify-start"
    />
  );
}
```

**Props:**

- `invoice`: Invoice object
- `pdfGenerationStatus`: "READY" | "PENDING"
- `pdfDownloadUrl`: URL to PDF (from shipment response)
- `shipmentId`: Related shipment ID
- `onUpdate`: Callback when update button clicked
- `onEmail`: Callback when email button clicked

**Features:**

- ✅ Download button with PDF polling (shows loading if PENDING)
- ✅ Email button (secondary styling)
- ✅ Update button (only for PENDING/EXPIRED status)
- ✅ Pay button (only for PENDING/EXPIRED status)
- ✅ Expiration countdown timer

### 3. **InvoiceCard**

Compact inline invoice card for shipment details view.

```tsx
import { InvoiceCard } from "@/components/invoice";

export function ShipmentDetails({ shipment, invoice }) {
  return (
    <InvoiceCard
      invoice={invoice}
      pdfGenerationStatus={shipment.pdfGenerationStatus}
      pdfDownloadUrl={invoice.pdfDownloadUrl}
      shipmentId={shipment.shipmentId}
      onCardClick={() => openInvoiceModal(invoice.invoiceId)}
      onUpdate={handleUpdate}
      onEmail={handleEmail}
    />
  );
}
```

**Use Case:** Display when viewing shipment details

### 4. **InvoiceSummary**

Full invoice details modal/page with comprehensive information.

```tsx
import { InvoiceSummary } from "@/components/invoice";

export function InvoiceDetailPage({ invoiceId }) {
  const [invoice, setInvoice] = useState(null);
  const [pdfStatus, setPdfStatus] = useState("PENDING");

  useEffect(() => {
    // Fetch invoice details
    fetch(`/api/invoices/${invoiceId}`)
      .then((r) => r.json())
      .then((data) => setInvoice(data));
  }, [invoiceId]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Invoice Details</h1>
      <InvoiceSummary
        invoice={invoice}
        pdfGenerationStatus={pdfStatus}
        shipmentId={invoice.shipmentId}
        onUpdate={handleUpdate}
        onEmail={handleEmail}
      />
    </div>
  );
}
```

**Displays:**

- Invoice header (number, status, dates)
- Buyer and seller information
- Line items table with pricing
- Tax breakdown
- Total amounts
- Payment information
- Action buttons

### 5. **InvoiceReceipt**

Post-payment confirmation display.

```tsx
import { InvoiceReceipt } from "@/components/invoice";

export function PaymentSuccessPage({ invoice, transaction }) {
  return (
    <InvoiceReceipt
      invoice={invoice}
      transactionId={transaction.id}
      paymentMethod={transaction.method}
      onDownload={() => downloadPDF(invoice.invoiceId)}
      onEmail={() => emailInvoice(invoice.invoiceId)}
      onViewDetails={() => router.push(`/app/invoices/${invoice.invoiceId}`)}
    />
  );
}
```

**Shows:**

- Success indicator
- Invoice summary
- Payment details
- Transaction ID
- Buyer/seller info (compact)
- Action buttons

### 6. **InvoicesList**

Paginated invoice list with filtering and sorting.

```tsx
import { InvoicesList } from "@/components/invoice";
import { useState } from "react";

export function InvoicesPage() {
  const [invoices, setInvoices] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchInvoices(page);
  };

  const handleStatusFilterChange = (status: string) => {
    setCurrentPage(1);
    fetchInvoices(1, status);
  };

  const fetchInvoices = async (page: number, status?: string) => {
    setIsLoading(true);
    try {
      const query = new URLSearchParams({
        limit: "20",
        offset: String((page - 1) * 20),
        ...(status && status !== "all" && { status }),
      });

      const response = await fetch(`/api/invoices?${query}`);
      const data = await response.json();
      setInvoices(data.invoices);
      setTotalCount(data.total);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <InvoicesList
      invoices={invoices}
      totalCount={totalCount}
      isLoading={isLoading}
      error={error}
      currentPage={currentPage}
      itemsPerPage={20}
      onPageChange={handlePageChange}
      onStatusFilterChange={handleStatusFilterChange}
      onView={(invoice) => router.push(`/app/invoices/${invoice.invoiceId}`)}
      onDownload={(invoice) => downloadPDF(invoice.invoiceId)}
      onEmail={(invoice) => emailInvoice(invoice.invoiceId)}
      onUpdate={(invoice) =>
        router.push(`/app/shipments/new?invoiceId=${invoice.invoiceId}`)
      }
    />
  );
}
```

**Features:**

- ✅ Status filtering (All, Pending, Paid, Expired)
- ✅ Sorting (Date, Invoice #, Amount)
- ✅ Pagination (20 items per page)
- ✅ Quick action buttons
- ✅ Loading and error states

## PDF Status Polling

The `usePdfStatus` hook handles intelligent polling for PDF generation:

```tsx
import { usePdfStatus } from "@/hooks/invoices/usePdfStatus";

function MyComponent({ invoice, pdfGenerationStatus, pdfDownloadUrl }) {
  const { pdfUrl, isReady, isLoading, error, retry } = usePdfStatus(
    invoice.invoiceId,
    pdfGenerationStatus,
    pdfDownloadUrl,
    10, // max retries
  );

  if (pdfUrl) {
    return <button onClick={() => window.open(pdfUrl)}>Download</button>;
  }

  if (isLoading) {
    return <span>Generating PDF...</span>;
  }

  if (error) {
    return (
      <>
        <span className="text-red-600">Failed to generate PDF</span>
        <button onClick={retry}>Retry</button>
      </>
    );
  }

  return null;
}
```

**Polling Logic:**

- If `pdfGenerationStatus === READY`: Uses URL immediately
- If `pdfGenerationStatus === PENDING`: Polls `/api/invoices/{id}/pdf` every 2-3 seconds
- Exponential backoff: delay = min(2 + retryCount, 10) seconds
- Max retries: 10 (~50 seconds total)
- Handles 200 (ready), 202 (retry), 401/403 (auth), 404 (not found), network errors

## Helper Functions

All utility helpers are available from `utils/invoice-helpers.ts`:

```tsx
import {
  formatInvoiceNumber,
  formatInvoiceDate,
  formatAmount,
  formatTaxRate,
  buildAddressString,
  getInvoiceStatusLabel,
  canUpdateInvoice,
  canPayInvoice,
  isInvoicePaid,
  getTimeRemaining,
  formatExpirationTime,
  calculateTotalVAT,
  calculateTotalNet,
  calculateTotalGross,
  validateInvoice,
} from "@/components/invoice";

// Example usage:
const formatted = formatAmount(invoice.totalGrossAmount); // "1,299.99 PLN"
const date = formatInvoiceDate(invoice.createdAt); // "10.03.2026 14:30"
const status = getInvoiceStatusLabel(invoice.status); // "Pending Payment"
const timeLeft = formatExpirationTime(invoice.paymentLinks[0].expiresAt); // "Expires in 2 hours 15 minutes"
```

## Integration Workflows

### Workflow 1: Shipment Creation with Invoice

After creating a shipment:

```tsx
const response = await fetch("/api/shipments", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(shipmentData),
});

const result = await response.json();
// result contains: { shipmentId, invoice, pdfGenerationStatus, pdfDownloadUrl }

// Display invoice immediately
<InvoiceCard
  invoice={result.invoice}
  pdfGenerationStatus={result.pdfGenerationStatus}
  pdfDownloadUrl={result.pdfDownloadUrl}
/>;
```

### Workflow 2: Invoice Update Flow

When user clicks "Update Invoice":

```tsx
// Route to: /app/shipments/new?invoiceId={id}&shipmentId={sid}
// Detect query params and pre-populate form with original data
// On submit, send updated data to: POST /api/shipments/{shipmentId}
// Backend returns new invoice with updated totals
```

### Workflow 3: Payment Flow

After payment is completed:

```tsx
// Display InvoiceReceipt:
<InvoiceReceipt
  invoice={paidInvoice}
  transactionId={payment.transactionId}
  paymentMethod="PayU"
/>

// Then redirect to invoice detail page or dashboard
```

## Error Handling

```tsx
import { useToast } from "@/hooks/use-toast";

function MyComponent() {
  const { toast } = useToast();

  const handleEmailError = (error: ErrorResponse) => {
    toast({
      title: "Email Error",
      description: error.message,
      variant: "destructive",
    });
  };

  const handlePdfError = (error: ErrorResponse) => {
    if (error.status === 404) {
      toast({
        title: "PDF Not Found",
        description: "Invoice PDF could not be found. Please try again later.",
      });
    } else if (error.status === 401) {
      toast({
        title: "Not Authorized",
        description: "You do not have permission to access this invoice.",
      });
    }
  };
}
```

## Type Definitions

All types are available from `types/invoice.ts`:

```tsx
import {
  Invoice,
  InvoiceStatus,
  InvoiceLineItem,
  InvoiceQuickInfo,
  CreateShipmentResponse,
  PdfStatusResponse,
  EmailInvoiceResponse,
  PdfGenerationStatus,
  UsePdfStatusReturn,
} from "@/types/invoice";
```

## Accessibility

All components follow WCAG AA guidelines:

- ✅ Semantic HTML structure
- ✅ ARIA labels on buttons
- ✅ Keyboard navigation support
- ✅ Color contrast ratios
- ✅ Focus indicators

## Performance Considerations

- Invoice list uses pagination (20 items per page)
- PDF polling has exponential backoff to reduce load
- Components use React.memo for optimization
- Hooks implement proper cleanup to prevent memory leaks

## Migration from Existing Components

If replacing existing invoice components, map as follows:

| Old Component      | New Component      | Notes                 |
| ------------------ | ------------------ | --------------------- |
| InvoicePreview     | InvoiceCard        | Compact view          |
| InvoiceDetailModal | InvoiceSummary     | Full details          |
| InvoiceListPage    | InvoicesList       | List with pagination  |
| -                  | InvoiceReceipt     | NEW: Post-payment     |
| -                  | InvoiceStatusBadge | NEW: Status indicator |
| -                  | InvoiceActions     | NEW: Action buttons   |

## Testing

Example test cases:

```tsx
describe("InvoiceActions", () => {
  it("shows loading when PDF is pending", () => {
    render(
      <InvoiceActions invoice={mockInvoice} pdfGenerationStatus="PENDING" />,
    );
    expect(screen.getByText("Generating PDF...")).toBeInTheDocument();
  });

  it("disables update button for paid invoices", () => {
    const paid = { ...mockInvoice, status: "PAID" };
    render(<InvoiceActions invoice={paid} />);
    expect(screen.queryByText("Update")).not.toBeInTheDocument();
  });

  it("shows expiration count down", () => {
    render(<InvoiceActions invoice={mockInvoice} />);
    expect(screen.getByText(/Expires in \d+ hours/)).toBeInTheDocument();
  });
});
```

## Next Steps

1. **Integrate into shipment details pages**
   - Add `InvoiceCard` to existing shipment detail view

2. **Create dedicated invoice pages**
   - `/app/invoices` - List page using `InvoicesList`
   - `/app/invoices/{id}` - Detail page using `InvoiceSummary`

3. **Add payment success page**
   - Use `InvoiceReceipt` component
   - Capture transaction details from payment gateway

4. **Update shipment update flow**
   - Detect `?invoiceId={id}&shipmentId={sid}` params
   - Pre-populate form and show "Update Invoice" context

5. **Testing**
   - Unit tests for each component
   - E2E tests for complete invoice workflows
   - PDF polling edge cases (timeout, network errors)

## Support & Questions

For detailed API specification, see: `docs/client-shipping-endpoints-guide.md`
For backend invoice behavior, see: `docs/invoice-integration-payment-flow.md`
