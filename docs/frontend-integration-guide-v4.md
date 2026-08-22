# Frontend Integration Guide — MLS API v4.0.0

Everything the frontend needs to move to the current API. Written against
`openapi.json`, which is generated from the schemas the server actually
enforces — if this guide and the spec ever disagree, the spec is right.

**This is a breaking release.** Two endpoints changed shape and one flow moved.
Nothing else in the API was touched.

> **Implementing sign-up or the shipment wizard from scratch?** Start with
> [signup-and-shipment-flows-v4.3.md](./signup-and-shipment-flows-v4.3.md) — it
> walks both flows step by step, names the OpenAPI section defining each payload,
> and lists the checks to run before each call. This document covers what
> *changed*; that one covers how to *build* it.

---

## 1. What changed, in one table

| Area | Before | Now |
|---|---|---|
| Choosing a rate | Read `rates[]`, send the whole `rate` object back | Read `tiers`, send back its `routingRef` |
| Naming the carrier | `carrierSlug` in the payload | **Never sent.** The server picks |
| Asserting a price | `rate.actualPrice` in the payload | **Never sent.** The server knows it |
| Pickup vs drop-off | `fulfillmentType` at create time | Chosen **after paying**, on the shipment page |
| Shipment state | Top-level `status` from tracking | `shipmentStatus` — `carrierStatus` is separate |
| Business vs individual | Asked again on every shipment | Captured once at sign-up as `accountType` *(v4.3.0)* |

The through-line: **the client stops telling the server things the server
already knows.** A frontend cannot know which carrier is cheapest for a route,
and on a shipment routed through our sorting centre there is no single carrier
to name. Removing those fields is what makes multi-carrier routing possible.

---

## 1b. Call sequence — screen by screen

What to call, when, and what to do with it.

### Screen 0 — Sign-up *(v4.3.0)*

```
User fills email / password / name / phone
   ↓
Toggle: "I'm signing up as a business"  → accountType: "BUSINESS" (+ optional companyName, nip)
   ↓
POST /api/auth/register-user
   ↓
Store user.accountType — it decides the customs form on Screen 2
```

`accountType` defaults to `"INDIVIDUAL"`, so omitting it is safe. It comes back
on every user response, including `GET /api/auth/get-current-user`.
See [account-type-and-business-profile-guide.md](../account-type-and-business-profile-guide.md).

### Screen 1 — Quote form

```
User fills addresses + packages
   ↓
POST /api/shipments/get-shipping-estimate
   ↓
Store estimateId. Render tiers.fastest / .balanced / .economy
   ↓
User taps a tier → store that tier's routingRef
```

Any tier key may be missing. Render what you get.

### Screen 2 — Checkout

```
POST /api/shipments/create-shipment
     { estimateId, routingRef, addresses, packages, customs, billingAddress }
   ↓
201 → redirect to checkoutUrl
409 → quote expired: re-quote, send user back to Screen 1
   ↓
User pays → returns to your success URL
   ↓
GET /api/payments/verify-payment
```

**No fulfillment questions on this screen.** No carrier, no price.

### Screen 3 — Shipment details (the new one)

```
GET /api/shipments/get-shipment/:id
   ↓
shipmentStatus === "AWAITING_FULFILLMENT"?
   ↓
GET /api/shipments/:id/fulfillment-options    ← always call first
   ↓
   ├── pickupSupported  → show "Request courier"
   └── dropoffSupported → show "I'll drop it off"
```

**Courier path:**
```
GET  /api/shipments/:id/pickup-availability   → restrict date picker
POST /api/shipments/:id/request-pickup        → confirmation code
DELETE /api/shipments/:id/pickup              → user changed their mind
```

**Drop-off path:**
```
GET /api/shipments/:id/dropoff-centers?radiusKm=25
```

Both are reversible until collection. A failed pickup is **not** fatal — the label still works for drop-off, so keep both buttons on screen.

### Screen 4 — Tracking

```
GET /api/shipments/track-shipment/:trackingNumber
   ↓
shipmentStatus  → branch UI on this
carrierStatus   → display only, next to the timeline
```

---

## 2. Getting rates

`POST /api/shipments/get-shipping-estimate` — unchanged request.

```jsonc
{
  "estimateId": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",

  "rates": [ /* unchanged — every direct rate, same shape as before */ ],

  "tiers": {
    "fastest": {
      "routingRef": "rt_01HQ8X2M4K7P9R3T5V6W8Y0Z",
      "label": "Fastest",
      "actualPrice": 412.00,
      "currency": "PLN",
      "transitDaysMin": 1,
      "transitDaysMax": 2,
      "deliveryDescription": "1-2 Business Days",
      "warnings": ["Estimate does not include VAT, duties, or extra customs taxes."]
    },
    "balanced": { "routingRef": "rt_…", "label": "Balanced", "…": "…" },
    "economy":  { "routingRef": "rt_…", "label": "Economy",  "…": "…" }
  },

  "errors": [ /* unchanged */ ],
  "guestId": null
}
```

### Three rules

**Any tier key may be missing.** A route with one viable service returns one
tier. Render what you get — don't assume three, and don't pad the gap.

**`routingRef` is opaque.** Echo it back byte-for-byte. Don't parse it, cache
it across quotes, or infer anything from it.

**Don't show the customer how it's routed.** Some options are one carrier end
to end; some pass through our facility with two. That's ours to manage. Show
the price and the delivery window.

`rates[]` still works exactly as before if you want to ship the tier UI later.

---

## 3. Creating a shipment

`POST /api/shipments/create-shipment`

```jsonc
{
  "estimateId": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
  "routingRef": "rt_01HQ8X2M4K7P9R3T5V6W8Y0Z",

  "pickupAddress":  { /* unchanged */ },
  "dropoffAddress": { /* unchanged */ },
  "packages":       [ /* unchanged */ ],
  "customs":        { /* unchanged, required when countries differ — see below */ },
  "billingAddress": { /* unchanged */ },
  "preferredPaymentOption": "stripe"
}
```

### Stop asking "business or individual?" *(v4.3.0)*

`customs` is still a discriminated union on `customsType` — `"S"` for a business
(requires `nipNr`), `"I"` for a private individual. **The payload has not
changed.** What changed is that you no longer have to ask which one to use:

```ts
const customs = user.accountType === "BUSINESS"
  ? { customsType: "S", nipNr: user.nip ?? askForNip(), /* … */ }
  : { customsType: "I", /* … */ };
```

Read `accountType` from the signed-in user and render the matching form
directly. If the user supplied a `nip` at sign-up, prefill `customs.nipNr` from
`user.nip` rather than asking again.

**What actually differs between the two forms**, so you know which inputs to show:

| | Business (`"S"`) | Individual (`"I"`) |
|---|---|---|
| `nipNr` | **Required** | Not accepted at all |
| `categoryOfItem` | `9, 11, 21, 31, 32, 91` | `9, 11, 21, 32` — no `31`/`91` |
| `customAgreements` | 4 keys (adds `notExceedValue`, `invoiceContent`) | 2 keys |
| EORI / invoice fields | — | `eoriNr`, `eoriNrReceiver`, `vatRegistrationNumberReceiver`, `invoiceNr`, `invoiceDate`, `invoice` — all optional |

Everything else — `currency`, `grossWeight`, `firstName`, `secondaryName`,
`customsItem`, and the optional `costsOfShipment` / `countryOfOrigin` /
`additionalInfo` — is identical on both. Field-by-field tables and a full
worked payload are in
[account-type-and-business-profile-guide.md §4](../account-type-and-business-profile-guide.md).

Where to read the field: it comes back on login and on
`GET /api/auth/get-current-user`. Refresh it on app open rather than trusting a
cached copy — an admin can change the account type between sessions.

The server does **not** enforce agreement between the two — a business owner
shipping a personal parcel is legitimate, and VAT is still resolved from
`customsType`, not from the profile. Nothing breaks if you adopt this late.

### Remove these — they are now rejected

```diff
- "carrierSlug": "fedex",
- "rate": { "serviceType": …, "carrierPrice": …, "actualPrice": …, "currency": … },
- "fulfillmentType": "PICKUP",
- "pickupDetails": { "scheduledDate": …, "readyTime": …, "closeTime": … },
- "dropoffCenterId": "…"
```

### New error to handle: `409 Quote Expired`

```json
{ "error": "Quote Expired", "code": 409,
  "details": "This quote is more than 24 hours old and carrier pricing may have changed. Please request a new quote." }
```

Carrier prices move. Rather than booking at a stale figure, a `routingRef`
older than the TTL is refused. **Request a fresh estimate and let the customer
re-pick** — do not retry the same ref, it will keep failing.

`400 Price Mismatch` no longer exists. You aren't sending a price.

---

## 4. Fulfillment — after payment, on the shipment page

This is the biggest UX change. The customer pays first, then chooses how the
parcel gets to the carrier.

**Why:** the carrier isn't known until a rate is picked, and on a hub-routed
shipment pickup concerns only the first leg. Asking before that meant asking
the client to name a carrier it couldn't know — which is what produced the
`address.streetLines: expected array, received undefined` errors.

**None of these endpoints take a carrier or an address.** Both are already on
the shipment.

### 4.1 Start here

`GET /api/shipments/:id/fulfillment-options`

```json
{
  "shipmentId": "9b1deb4d-…",
  "currentFulfillment": "NONE",
  "pickupSupported": true,
  "dropoffSupported": true,
  "pickupStatus": "NONE",
  "canCancelPickup": false,
  "carrierDisplayName": "FedEx"
}
```

Render only the controls it reports as supported. **Don't infer capability from
the carrier name** — it varies per carrier and changes as carriers are added.
`carrierDisplayName` is for display only; never send it back.

### 4.2 Courier pickup

`GET /api/shipments/:id/pickup-availability`

```json
{
  "availableDates": ["2026-08-07", "2026-08-10"],
  "cutoffTime": "16:00:00",
  "accessTime": "PT2H",
  "defaultReadyTime": "12:00:00",
  "residentialAvailable": true
}
```

Restrict the date picker to `availableDates`. **`accessTime` is a duration** —
the minimum window the courier needs, ISO-8601. Don't render it on a clock.

`POST /api/shipments/:id/request-pickup`

```json
{ "scheduledDate": "2026-08-07", "readyTime": "13:00:00",
  "closeTime": "18:00:00", "remarks": "Reception desk, ring bell 2B" }
```

`remarks` is capped at **60 characters** — a carrier limit, rejected rather
than truncated, because silently dropping half an instruction the customer
believes was passed on is worse than telling them.

```json
{ "pickupConfirmationCode": "3001", "pickupLocationCode": "LCJA",
  "scheduledDate": "2026-08-07", "pickupStatus": "CONFIRMED",
  "pickupFee": 0, "currency": "PLN" }
```

**If this fails, the shipment is fine.** The label already exists and stays
valid for drop-off. Show the error and keep both options on screen — don't
treat it as terminal.

`pickupFee` is currently always `0`. It exists so a surcharge can be added
later without a breaking change; render it if non-zero.

### 4.3 Drop-off

`GET /api/shipments/:id/dropoff-centers?radiusKm=25`

Returns the same `LocationResult[]` you already render, nearest first.
`radiusKm` is 1–50, default 25.

Selecting one is **informational**. Labels aren't location-locked — the
customer can use any compatible location. Present it as guidance, not a
commitment.

### 4.4 Cancelling

`DELETE /api/shipments/:id/pickup`

Returns the shipment to `AWAITING_FULFILLMENT`.

**Don't optimistically clear the UI.** Carriers refuse cancellation once the
courier is dispatched. If the call fails, the pickup is still live — showing it
as cancelled means a driver arrives at an address the customer thinks is
settled.

### 4.5 Preconditions — the 409s

All five endpoints share these, checked in order:

| Status | Meaning |
|---|---|
| `401` | Not authenticated |
| `404` | Not found, **or not yours** — we don't distinguish, deliberately |
| `409 Not Paid` | Payment hasn't completed |
| `409 Label Pending` | Label still generating — retry shortly |
| `409 Already In Transit` | Parcel has moved; fulfillment is settled |
| `403 Not Supported` | This shipment's carrier doesn't offer that mode |

---

## 5. Status

`GET /api/shipments/get-shipment/:id`

**Branch on `shipmentStatus`.** It's where the shipment is in the MLS
lifecycle.

**`carrierStatus` is different** — the carrier's own free-text wording. Good to
show beside a timeline, not a state to switch on. It previously occupied the
top-level `status` key and shadowed the real one, which is why shipments looked
"in transit" the moment they were paid for.

A shipment with no carrier tracking number yet returns
`carrierStatus: "TRACKING_NOT_AVAILABLE"` and an empty timeline, rather than an
unrelated parcel's history.

### The full set

| `shipmentStatus` | Show |
|---|---|
| `CREATED` | Awaiting payment |
| `PAID` | Paid, label generating |
| `AWAITING_FULFILLMENT` | **Label ready — show both fulfillment controls** |
| `PICKUP_SCHEDULED` | Confirmation code + cancel action |
| `AWAITING_DROPOFF` | Drop-off list + label |
| `IN_TRANSIT` | Tracking timeline |
| `DELIVERED` / `COMPLETED` | Done |
| `CREATION_FAILED` | Paid but label failed — contact support |
| `CANCELLED` / `FAILED` / `PAYMENT_FAILED` | Terminal |

### Three you can ignore

`AWAITING_HUB_CONFIRMATION`, `LEG2_PENDING`, `LEG2_CREATED` appear only on
shipments routed through our facility, and only when that's switched on. Treat
them as "in progress" — the customer doesn't need to know the difference. Just
don't let an exhaustive `switch` fall through on them.

---

## 6. Labels

`labelUrl` is the label to print. On a multi-leg shipment it is **only the
first leg's** — the second is printed at our facility. The server enforces
this; a parcel with two barcodes on it is a physical problem.

---

## 7. Migration checklist

- [ ] Read `tiers` from the estimate response; handle fewer than three
- [ ] Store `routingRef` with the customer's choice
- [ ] Send `estimateId` + `routingRef` at create-shipment
- [ ] Delete `carrierSlug`, `rate`, `fulfillmentType`, `pickupDetails`, `dropoffCenterId` from the payload
- [ ] Handle `409 Quote Expired` → re-quote, don't retry
- [ ] Move the pickup/drop-off UI to the shipment details page
- [ ] Call `/fulfillment-options` before rendering fulfillment controls
- [ ] Switch state logic from `status` to `shipmentStatus`
- [ ] Add the three new statuses to any exhaustive switch
- [ ] Cap the `remarks` field at 60 characters client-side
- [ ] Stop treating a failed pickup request as fatal

---

## 8. Still available, but deprecated

`POST /api/shipments/pickup-availability` and
`POST /api/locations/dropoff-centers` still work and still take `carrierSlug`
and an address. They're marked `deprecated: true` in the spec and superseded by
the shipment-scoped versions above.

They'll be removed on request — say the word once nothing calls them.
