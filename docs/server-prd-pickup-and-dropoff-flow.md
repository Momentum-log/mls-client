# PRD: Shipment Pickup Request & Drop-off Center Selection

## 1. Introduction / Overview

The `mls-server` logistics platform is enhancing its shipment creation flow to support two fulfillment modes:

1. **Request Courier Pickup**: Shippers schedule on-call carrier courier pickups at their origin/pickup address for a future date/time window.
2. **Drop-off at Center**: Shippers physically drop off packages at nearby authorized carrier drop-off locations, discovered via the carrier's Locations API.

A UI toggle (frontend concern, out-of-scope for this backend PRD) will let users switch between these modes. This PRD defines the **backend-only** changes to `mls-server` — adapter interface extensions, service-layer logic, database schema, API endpoints, payment flow integration, and background jobs.

---

## 2. Goals

- **Extend `ICarrierAdapter`**: Add optional pickup and location methods to the universal carrier contract so any future carrier (DHL, InPost, etc.) can implement them without breaking existing adapters.
- **FedEx Adapter Implementation**: Implement pickup availability, create pickup, cancel pickup, and location search inside `FedExAdapter`, following the existing adapter pattern in `src/adapters/fedex.adapter.ts`.
- **Payment-Triggered Pickup Dispatch**: Collect pickup details during `POST /api/shipments/create-shipment`, store them on the `Shipment` record, and execute the carrier pickup API call inside `finalizeShipment()` — the same method already called by **both** Stripe webhook (`handleStripeWebhook`) and PayU webhook (`handlePayuWebhook`) and sync verification (`verifyPayment`).
- **Drop-off Center Discovery**: Provide an endpoint to query nearby carrier locations (up to 50 km radius), sorted by distance in kilometers.
- **Missed Pickup Detection**: Add a `node-cron` background job following the existing `email-reminder.job.ts` pattern to flag shipments with expired pickup dates.

---

## 3. User Stories

- **US01 (Shipper - Pickup)**: As a shipper, I can include pickup scheduling details (date, ready time, close time) when creating a shipment so a courier is dispatched after my payment succeeds.
- **US02 (Shipper - Drop-off)**: As a shipper, I can query nearby drop-off centers based on my pickup address so I can choose where to take my package.
- **US03 (Shipper - Preferred Centers)**: As a shipper, I can bookmark preferred drop-off centers for quick reuse in future shipments.
- **US04 (Shipper - Missed Pickup)**: As a shipper whose pickup date has passed without collection, I can see a `MISSED` status and contact support for resolution.
- **US05 (Support Agent)**: As a support agent, I can manually update a shipment's fulfillment type or cancel/reschedule a pickup through internal tools.

---

## 4. Features / Tasks

### Carrier Adapter Interface (`CA`)

- **CA01**: Extend `ICarrierAdapter` in [types.ts](file:///Users/thekiwidev/work/mls/mls-server/src/carriers/types.ts) with optional pickup and location methods. Methods are optional (`?`) so existing adapters (DHL eCommerce) don't break.
  ```typescript
  // New interfaces added to src/carriers/types.ts
  export interface PickupAvailabilityParams {
    address: Address;
    pickupRequestType: "SAME_DAY" | "FUTURE_DAY";
    carrierType?: string; // e.g. "FDXE" (Express), "FDXG" (Ground)
    domestic: boolean;
  }

  export interface PickupAvailabilityResult {
    availableDates: string[];
    cutoffTime: string;
    accessTime: string;
    defaultReadyTime: string;
    raw: unknown;
  }

  export interface CreatePickupParams {
    accountNumber: string;
    pickupAddress: Address;
    carrierType?: string;
    readyTime: string;       // ISO datetime or HH:MM:SS
    customerCloseTime: string; // HH:MM:SS
    scheduledDate: string;    // YYYY-MM-DD
    remarks?: string;
  }

  export interface PickupResult {
    pickupConfirmationCode: string;
    locationCode: string;
    message: string;
    raw: unknown;
  }

  export interface LocationSearchParams {
    address: Address;
    radiusKm: number;
    locationTypes?: string[];
    capabilities?: string[];
  }

  export interface LocationResult {
    centerName: string;
    address: Address;
    distanceKm: number;
    operatingHours: Record<string, string>;
    carrierCapabilities: string[];
    locationType: string;
  }

  // Added to ICarrierAdapter
  export interface ICarrierAdapter {
    readonly capability: CarrierCapability;
    getRates(...): Promise<any>;
    createShipment(...): Promise<ShipmentResult>;
    trackShipment(...): Promise<MLSTrackingResponse>;
    isHealthy(): Promise<boolean>;

    // Optional pickup & location methods (carrier-specific)
    checkPickupAvailability?(params: PickupAvailabilityParams): Promise<PickupAvailabilityResult>;
    createPickup?(params: CreatePickupParams): Promise<PickupResult>;
    cancelPickup?(confirmationCode: string, scheduledDate: string, locationCode: string, carrierType?: string): Promise<any>;
    searchLocations?(params: LocationSearchParams): Promise<LocationResult[]>;
  }
  ```

- **CA02**: Implement `checkPickupAvailability()`, `createPickup()`, `cancelPickup()`, and `searchLocations()` in [fedex.adapter.ts](file:///Users/thekiwidev/work/mls/mls-server/src/adapters/fedex.adapter.ts), following the same patterns used by `getRates()` and `createShipment()` (token-based auth, `fetchWithRetry`, `sanitizeAddress`, `env.FEDEX_API_URL`).
  - `checkPickupAvailability` → `POST ${baseUrl}/pickup/v1/pickups/availabilities`
  - `createPickup` → `POST ${baseUrl}/pickup/v1/pickups`
  - `cancelPickup` → `PUT ${baseUrl}/pickup/v1/pickups/cancel`
  - `searchLocations` → `POST ${baseUrl}/locations/v1/locations` (transform distances to km)

- **CA03**: No changes to [dhl.adapter.ts](file:///Users/thekiwidev/work/mls/mls-server/src/adapters/dhl.adapter.ts) — these methods remain unimplemented (optional interface methods). When DHL/InPost support is added later, their adapters implement the same methods.

---

### Database Schema (`DB`)

- **DB01**: Add `FulfillmentType` and `PickupStatus` enums to [schema.prisma](file:///Users/thekiwidev/work/mls/mls-server/prisma/schema.prisma):
  ```prisma
  enum FulfillmentType {
    PICKUP
    DROPOFF
  }

  enum PickupStatus {
    NONE
    PENDING
    CONFIRMED
    MISSED
    CANCELLED
    COMPLETED
  }
  ```

- **DB02**: Add pickup metadata fields to the existing `Shipment` model:
  ```prisma
  model Shipment {
    // ... existing fields ...
    fulfillmentType        FulfillmentType  @default(DROPOFF)
    pickupStatus           PickupStatus     @default(NONE)
    pickupConfirmationCode String?
    pickupLocationCode     String?
    scheduledPickupDate    DateTime?
    pickupReadyTime        String?          // HH:MM:SS format
    pickupCloseTime        String?          // HH:MM:SS format
    pickupRemarks          String?
    dropoffCenterId        String?          // Optional reference, not hard-locked
  }
  ```
  > **Naming convention**: Uses `scheduledPickupDate` (consistent with existing `createdAt`/`updatedAt` DateTime naming) and `pickupReadyTime`/`pickupCloseTime` as `String` to store time-only values.

- **DB03**: Add new `UserPreferredLocation` model:
  ```prisma
  model UserPreferredLocation {
    id                   String   @id @default(uuid())
    userId               String
    user                 User     @relation(fields: [userId], references: [id], onDelete: Cascade)
    centerName           String
    streetLines          String[]
    city                 String
    stateOrProvinceCode  String?
    postalCode           String
    countryCode          String   @db.Char(2)
    carrierCode          String   // e.g., "FEDEX", "DHL_ECOMMERCE"
    createdAt            DateTime @default(now())

    @@index([userId])
  }
  ```
  > Add `preferredLocations UserPreferredLocation[]` relation to the existing `User` model.

- **DB04**: Run Prisma migration for all environments (local → staging → production) and update [setup-instructions.md](file:///Users/thekiwidev/work/mls/mls-server/docs/setup-instructions.md).

---

### Shipment Service Integration (`SS`)

- **SS01**: Extend [initializeShipment()](file:///Users/thekiwidev/work/mls/mls-server/src/services/shipment.service.ts#L22-L84) in `ShipmentService` to accept and persist pickup metadata:
  ```typescript
  async initializeShipment(data: {
    // ... existing params ...
    fulfillmentType?: "PICKUP" | "DROPOFF";
    scheduledPickupDate?: string;
    pickupReadyTime?: string;
    pickupCloseTime?: string;
    pickupRemarks?: string;
  })
  ```
  Store `fulfillmentType` (default `DROPOFF`), `pickupStatus` (`PENDING` if `PICKUP`, `NONE` if `DROPOFF`), and time fields on the `Shipment` record.

- **SS02**: Extend [finalizeShipment()](file:///Users/thekiwidev/work/mls/mls-server/src/services/shipment.service.ts#L89-L276) to execute pickup dispatch **after** successful carrier shipment creation. This is the same insertion point used by both payment flows:
  - Stripe: `handleStripeWebhook` → `shipmentService.finalizeShipment(shipmentId)` ([payment.controller.ts:42](file:///Users/thekiwidev/work/mls/mls-server/src/controllers/payment.controller.ts#L42))
  - PayU: `handlePayuWebhook` → `shipmentService.finalizeShipment(invoice.shipmentId)` ([payment.controller.ts:163](file:///Users/thekiwidev/work/mls/mls-server/src/controllers/payment.controller.ts#L163))
  - Sync verify: `verifyPayment` → `shipmentService.finalizeShipment(shipmentId)` ([payment.controller.ts:250](file:///Users/thekiwidev/work/mls/mls-server/src/controllers/payment.controller.ts#L250) and [payment.controller.ts:312](file:///Users/thekiwidev/work/mls/mls-server/src/controllers/payment.controller.ts#L312))

  **Logic within `finalizeShipment()`** (after carrier `createShipment()` succeeds and label is stored):
  ```
  if (currentShipment.fulfillmentType === "PICKUP") {
    // 1. Resolve the adapter (fedexAdapter, dhlAdapter, etc.)
    // 2. Check if adapter supports createPickup (optional method)
    // 3. Call adapter.createPickup() with stored pickup params
    // 4. Store pickupConfirmationCode, pickupLocationCode on Shipment
    // 5. Update pickupStatus to CONFIRMED
    // 6. If pickup creation fails, set pickupStatus to NONE, log error
    //    (shipment itself is still valid — user can drop off instead)
  }
  ```
  > **Critical**: Pickup failure does NOT fail the shipment. The label is already created. The shipment remains valid for drop-off as a fallback.

- **SS03**: Update the `pickupType` field in `FedExAdapter.createShipment()` dynamically:
  - Currently hardcoded to `"DROPOFF_AT_FEDEX_LOCATION"` ([fedex.adapter.ts:243](file:///Users/thekiwidev/work/mls/mls-server/src/adapters/fedex.adapter.ts#L243) and [fedex.adapter.ts:420](file:///Users/thekiwidev/work/mls/mls-server/src/adapters/fedex.adapter.ts#L420))
  - Should be conditionally set based on fulfillment type:
    - `PICKUP` → `"USE_SCHEDULED_PICKUP"` or `"CONTACT_FEDEX_TO_SCHEDULE"`
    - `DROPOFF` → `"DROPOFF_AT_FEDEX_LOCATION"` (current default)
  - This requires passing `fulfillmentType` to `createShipment()` — either extend the method signature or add an optional `options` parameter.

---

### API Endpoints (`EP`)

All endpoints follow existing codebase routing conventions: `/api/shipments/...` and `/api/locations/...` (no `/v1` prefix).

- **EP01**: `POST /api/shipments/pickup-availability`
  - **Controller**: New handler in [shipment.controller.ts](file:///Users/thekiwidev/work/mls/mls-server/src/controllers/shipment.controller.ts)
  - **Route**: Register in [shipment.routes.ts](file:///Users/thekiwidev/work/mls/mls-server/src/routes/shipment.routes.ts)
  - **Auth**: `authenticate` middleware (same as `create-shipment`)
  - **Logic**: Resolve carrier adapter via `carrierRegistry.getByCode()`, call `adapter.checkPickupAvailability()`, return available dates/times
  - **Zod schema**: Validate pickup address + carrier slug

- **EP02**: Extend `POST /api/shipments/create-shipment`
  - **Schema change**: Add optional fields to `CreateShipmentSchema` in [shipment.controller.ts](file:///Users/thekiwidev/work/mls/mls-server/src/controllers/shipment.controller.ts#L239-L286):
    ```typescript
    fulfillmentType: z.enum(["PICKUP", "DROPOFF"]).default("DROPOFF"),
    pickupDetails: z.object({
      scheduledDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      readyTime: z.string(),     // HH:MM:SS
      closeTime: z.string(),     // HH:MM:SS
      remarks: z.string().max(200).optional(),
    }).optional(),
    ```
  - **Validation**: If `fulfillmentType === "PICKUP"`, require `pickupDetails`. Validate `scheduledDate` is a future date.
  - **Pass through**: Forward these fields to `shipmentService.initializeShipment()`.

- **EP03**: `POST /api/locations/dropoff-centers`
  - **Controller**: New handler in [location.controller.ts](file:///Users/thekiwidev/work/mls/mls-server/src/controllers/location.controller.ts) (extends the existing `LocationController` class)
  - **Route**: Register in [location.routes.ts](file:///Users/thekiwidev/work/mls/mls-server/src/routes/location.routes.ts)
  - **Auth**: `semiAuthenticate` middleware (consistent with existing location routes)
  - **Logic**: Resolve carrier adapter, call `adapter.searchLocations()`, return sorted results with distance in km
  - **Zod schema**: Validate address fields + `radiusKm` (max 50) + `carrierSlug`

- **EP04**: `GET /api/locations/preferred-centers`
  - **Controller**: New handler in `LocationController`
  - **Auth**: `authenticate` middleware
  - **Logic**: Query `UserPreferredLocation` where `userId = req.user.userId`

- **EP05**: `POST /api/locations/preferred-centers`
  - **Controller**: New handler in `LocationController`
  - **Auth**: `authenticate` middleware
  - **Logic**: Create `UserPreferredLocation` record for the authenticated user

- **EP06**: `DELETE /api/locations/preferred-centers/:id`
  - **Controller**: New handler in `LocationController`
  - **Auth**: `authenticate` middleware
  - **Logic**: Delete `UserPreferredLocation` by ID where `userId = req.user.userId`

---

### Background Job (`BJ`)

- **BJ01**: Create `src/jobs/pickup-status-check.job.ts` following the `email-reminder.job.ts` pattern:
  - Use `node-cron` with schedule `"0 */6 * * *"` (every 6 hours)
  - Export `startPickupStatusCheckJob()`, `stopPickupStatusCheckJob()`, `isPickupStatusCheckJobRunning()`
  - **Logic**: Query shipments where:
    ```
    fulfillmentType = PICKUP
    AND pickupStatus = CONFIRMED
    AND scheduledPickupDate < NOW()
    AND shipmentStatus NOT IN [IN_TRANSIT, DELIVERED, COMPLETED]
    ```
    Update matching shipments to `pickupStatus = MISSED`.
  - Register in [app.ts](file:///Users/thekiwidev/work/mls/mls-server/src/app.ts) alongside existing job imports (`startPasswordRotationJob`, `startEmailReminderJob`).

---

### Support & Exception Handling (`SP`)

- **SP01**: When `pickupStatus === MISSED`, the shipment response from `GET /api/shipments/get-shipment/:id` should include a `supportAction: "CONTACT_SUPPORT_FOR_RESCHEDULE"` flag so the frontend can render a "Contact Support" button.
- **SP02**: Support agents handle reschedule/drop-off switch manually:
  - Use existing admin shipment management endpoints to update `fulfillmentType` to `DROPOFF` and `pickupStatus` to `CANCELLED`.
  - Or call `cancelPickup` + `createPickup` through an internal admin endpoint (future implementation).
- **SP03**: No automated rescheduling — support communicates resolution to the user directly.

---

## 5. Non-Goals (Out of Scope)

- **Frontend / UI Components**: This is a backend-only project. Toggle, date pickers, tooltips, and center list UI are frontend concerns.
- **Hard Location Locking**: FedEx labels are valid at any compatible drop-off center. The `dropoffCenterId` on `Shipment` is informational only.
- **Immediate Unpaid Pickup Dispatch**: Pickup is dispatched only inside `finalizeShipment()` after payment confirmation.
- **Same-Day Past-Time Scheduling**: Backend validates `scheduledDate` is a future date. Time cutoff enforcement is handled by the carrier API itself.
- **Automated Support Rescheduling**: Missed pickups are resolved via manual support workflow.

---

## 6. Technical Considerations

### Execution Flow

```
[Frontend] → POST /api/shipments/create-shipment
              (includes fulfillmentType + pickupDetails)
                    │
                    ▼
         shipmentService.initializeShipment()
         → Stores shipment with fulfillmentType=PICKUP,
           pickupStatus=PENDING, pickup time fields
         → Returns Stripe/PayU checkoutUrl
                    │
                    ▼
         User completes payment (Stripe or PayU)
                    │
            ┌───────┴───────┐
            │               │
    Stripe webhook    PayU webhook
    (payment.controller)  (payment.controller)
            │               │
            └───────┬───────┘
                    │
                    ▼
         shipmentService.finalizeShipment(shipmentId)
                    │
                    ▼
         1. Update paymentStatus → PAID
         2. Call adapter.createShipment() → label
         3. IF fulfillmentType === PICKUP:
              Call adapter.createPickup()
              Store confirmationCode + locationCode
              Set pickupStatus → CONFIRMED
            ELSE:
              pickupStatus stays NONE
         4. Notify user (email)
```

### Multi-Carrier Ready

- `ICarrierAdapter` methods are **optional** (`?`). Only carriers that support pickup/locations implement them.
- `carrierRegistry.getByCode()` already exists in [registry.ts](file:///Users/thekiwidev/work/mls/mls-server/src/carriers/registry.ts#L50-L52) for resolving adapters by code.
- Endpoints accept `carrierSlug` param so they work with any registered carrier.
- `finalizeShipment()` already branches per carrier slug (`fedex`, `dhl-ecommerce`). Pickup dispatch follows the same branching pattern, but checks for method existence first:
  ```typescript
  if (adapter.createPickup) {
    await adapter.createPickup(params);
  }
  ```

### Files Modified / Created

| Action | File |
|--------|------|
| MODIFY | `src/carriers/types.ts` — extend `ICarrierAdapter` + add new interfaces |
| MODIFY | `src/adapters/fedex.adapter.ts` — implement 4 new methods |
| MODIFY | `prisma/schema.prisma` — add enums + Shipment fields + UserPreferredLocation model |
| MODIFY | `src/services/shipment.service.ts` — extend `initializeShipment()` + `finalizeShipment()` |
| MODIFY | `src/controllers/shipment.controller.ts` — extend `CreateShipmentSchema` + add `pickupAvailability` handler |
| MODIFY | `src/routes/shipment.routes.ts` — register new pickup-availability route |
| MODIFY | `src/controllers/location.controller.ts` — add dropoff-centers + preferred-centers handlers |
| MODIFY | `src/routes/location.routes.ts` — register new location routes |
| MODIFY | `src/app.ts` — import and start new cron job |
| NEW    | `src/jobs/pickup-status-check.job.ts` — missed pickup detection job |

---

## 7. Success Metrics

- **Zero Past-Date Errors**: Backend rejects `scheduledDate` values that are not future dates.
- **Post-Payment Reliability**: 100% of paid PICKUP shipments trigger `createPickup()` inside `finalizeShipment()` — same path for both Stripe and PayU.
- **Pickup Failure Resilience**: If carrier pickup API fails, shipment remains valid (label exists). User can fall back to drop-off.
- **Distance Accuracy**: Drop-off center results display distance in km, sorted nearest-first.
- **Missed Pickup Detection**: Background job flags expired pickups within 6 hours.

---

## 8. Open Questions

All major questions resolved:

- **Endpoints** follow existing `/api/shipments/...` and `/api/locations/...` conventions (no `/v1`).
- **Pickup execution** deferred to `finalizeShipment()`, which is the single point called by Stripe webhook, PayU webhook, and sync verify — all three payment paths are covered.
- **Adapter interface** uses optional methods — no breaking changes to DHL adapter.
- **Schema naming** follows existing codebase patterns (`scheduledPickupDate`, `pickupStatus`).
- **Background job** follows `node-cron` + `logStructured` pattern from `email-reminder.job.ts`.
- **Support workflow** is manual (support contacts user, updates shipment metadata directly).
