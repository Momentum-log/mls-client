# Invoice System - Quick Start Guide

## 🚀 Quick Links

- **List Page**: `/app/invoices`
- **Detail Page**: `/app/invoices/{id}`
- **Payment Success**: `/app/shipments/payment-success`
- **Update Flow**: `/app/shipments/new?invoiceId={id}&shipmentId={id}`

## 📦 Components

### Import Any Component

```tsx
import {
  InvoicesList,
  InvoiceSummary,
  InvoiceReceipt,
  InvoiceCard,
  InvoiceActions,
  InvoiceStatusBadge,
} from "@/components/invoice";
```

### Quick Example: Display Invoice List

```tsx
import { InvoicesList } from "@/components/invoice";

export function MyInvoicePage() {
  const [invoices, setInvoices] = useState([]);

  return (
    <InvoicesList
      invoices={invoices}
      totalCount={100}
      onView={(inv) => router.push(`/app/invoices/${inv.invoiceId}`)}
      onDownload={(inv) => downloadPdf(inv)}
      onEmail={(inv) => emailInvoice(inv)}
      onUpdate={(inv) =>
        router.push(`/app/shipments/new?invoiceId=${inv.invoiceId}`)
      }
    />
  );
}
```

## 🪝 Hooks

### PDF Status Polling

```tsx
import { usePdfStatus } from "@/hooks/invoices";

const { pdfUrl, isReady, isLoading, error } = usePdfStatus(
  invoiceId,
  pdfGenerationStatus,
  pdfDownloadUrl,
);

if (pdfUrl) window.open(pdfUrl, "_blank");
```

### Update Flow Detection

```tsx
import { useInvoiceUpdateFlow } from "@/hooks/invoices";

const { isUpdateFlow, originalShipment, invoice } = useInvoiceUpdateFlow();

if (isUpdateFlow) {
  // Pre-populate form with originalShipment
}
```

## 🛠️ Utilities

### Formatting (All Polish Locale)

```tsx
import {
  formatAmount, // "1,299.99 PLN"
  formatInvoiceDate, // "10.03.2026"
  formatExpirationTime, // "Expires in 2 hours"
  buildAddressString, // "ul. Marszałkowska 1, Warszawa"
} from "@/components/invoice";
```

### Validation

```tsx
import {
  canUpdateInvoice, // true if PENDING/EXPIRED
  canPayInvoice, // true if PENDING/EXPIRED
  isInvoicePaid, // true if PAID
} from "@/components/invoice";
```

## 📋 Types

```tsx
import {
  Invoice,
  InvoiceStatus,
  InvoiceLineItem,
  PdfGenerationStatus,
  CreateShipmentResponse,
} from "@/types/invoice";
```

## 🔌 API Endpoints

### Fetch Invoice

```tsx
GET / api / invoices / { invoiceId };
Headers: {
  Authorization: `Bearer ${token}`;
}
Response: Invoice;
```

### List Invoices

```tsx
GET /api/invoices?status=PENDING&limit=20&offset=0
Response: { invoices: Invoice[], total: number }
```

### Check PDF Status

```tsx
GET /api/invoices/{invoiceId}/pdf
Response (200): { status: "READY", downloadUrl: "..." }
Response (202): { status: "PENDING", retryAfter: 3 }
```

### Send Invoice Email

```tsx
POST /api/invoices/{invoiceId}/email
Body: { email: "customer@example.com" }
Response: { status: "success", message: "..." }
```

### Create Shipment (with Invoice)

```tsx
POST /api/shipments
Body: { pickupLocation, dropoffLocation, ... }
Response: {
  shipmentId: "xyz",
  invoice: Invoice,
  pdfGenerationStatus: "PENDING" | "READY",
  pdfDownloadUrl: "..."
}
```

## 🎨 Styling

All components use CSS variables from `global.css`:

```css
--brand-blue         /* Primary color */
--foreground         /* Text */
--background         /* Background */
--muted-foreground   /* Disabled text */
--destructive        /* Error/Red */
```

## 🧪 Testing Template

```tsx
describe("InvoicesList", () => {
  it("displays invoices", () => {
    render(<InvoicesList invoices={mockInvoices} totalCount={2} />);
    expect(screen.getByText("INV-001")).toBeInTheDocument();
  });

  it("filters by status", () => {
    const handleFilter = jest.fn();
    render(
      <InvoicesList
        invoices={mockInvoices}
        onStatusFilterChange={handleFilter}
      />,
    );
    fireEvent.click(screen.getByText("Pending Payment"));
    expect(handleFilter).toHaveBeenCalledWith("PENDING");
  });

  it("downloads invoice", async () => {
    render(<InvoicesList invoices={mockInvoices} onDownload={jest.fn()} />);
    fireEvent.click(screen.getByText("Download"));
    // Verify download was triggered
  });
});
```

## 🐛 Common Errors & Fixes

| Error                                     | Cause           | Fix                                        |
| ----------------------------------------- | --------------- | ------------------------------------------ |
| Cannot find module '@/components/invoice' | Missing exports | Check `components/invoice/index.ts`        |
| PDF never loads                           | Polling timeout | Increase `maxRetries` in `usePdfStatus`    |
| 401 on all requests                       | No auth token   | Verify `localStorage.getItem('authToken')` |
| Component has no display name             | React issue     | Wrap in `React.memo()`                     |

## 📱 Mobile Responsive

All components are responsive:

- **Desktop**: Full layout with sidebar
- **Tablet**: Stacked layout, adjusted spacing
- **Mobile**: Single column, touch-optimized buttons

```tsx
// Components use Tailwind responsive classes
className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
```

## ♿ Accessibility

All components meet WCAG AA:

- ✅ Color contrast (4.5:1 minimum)
- ✅ Keyboard navigation
- ✅ ARIA labels
- ✅ Focus indicators
- ✅ Semantic HTML

## 🚦 Best Practices

### DO

✅ Use destructuring for imports  
✅ Handle errors with try/catch  
✅ Show loading states  
✅ Log to console in development  
✅ Use TypeScript types

### DON'T

❌ Hardcode URLs  
❌ Store sensitive data in localStorage  
❌ Skip error handling  
❌ Forget loading states  
❌ Mix styled-components with Tailwind

## 🔗 Integration Checklist

- [ ] Components imported in pages
- [ ] Routes created and linked
- [ ] Auth token configured
- [ ] Toast notifications working
- [ ] PDF downloads tested
- [ ] Mobile layout verified
- [ ] Accessibility audit passed
- [ ] Error handling tested
- [ ] Logged to Google Analytics (if applicable)

## 📞 Support

For issues or questions:

1. Check [docs/invoice-system-complete-guide.md](./invoice-system-complete-guide.md)
2. Review [docs/invoice-components-integration.md](./invoice-components-integration.md)
3. Search codebase for similar usage
4. Consult type definitions in `types/invoice.ts`

---

**Version**: 1.39.1  
**Last Updated**: April 9, 2026
