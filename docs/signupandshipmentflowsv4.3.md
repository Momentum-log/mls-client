# Sign-Up & Create-Shipment Flows — Implementation Guide

**API v4.3.0.** Written for the frontend team. Every step names the endpoint, the
OpenAPI section that defines its exact payload, the checks to run before calling
it, and what to do with the response.

**Authoritative source:** `openapi.json`. If this guide and the spec ever
disagree, the spec is right — it is generated from the Zod schemas the server
actually enforces.

---

## 0. How to read the OpenAPI pointers

The spec declares `"servers": [{ "url": "/api" }]`, so **every path below is
prefixed with `/api` in real requests**. The spec says `/auth/register-user`;
you call `POST /api/auth/register-user`.

Each step cites a **JSON pointer** like `paths./auth/register-user.post`. That
is stable across regenerations. To pull one out:

```bash
jq '.paths."/auth/register-user".post' openapi.json
```

Just the request body, which is usually what you want:

```bash
jq '.paths."/shipments/create-shipment".post.requestBody.content."application/json".schema' openapi.json
```

Line numbers are given as a convenience for scrolling. **They shift whenever the
spec is regenerated** — trust the pointer, not the line.

---

## 1. Sign-up flow

### The shape of it

```flow
Screen 1: Sign-up form  ──►  POST /auth/register-user   → 201, user object (NO tokens)
                                    │
Screen 2: Log in        ──►  POST /auth/login-user      → 200, accessToken + refreshToken
                                    │
Screen 3: Verify email  ──►  POST /auth/send-verification-code
                             POST /auth/verify-email    → is_verified: true
                                    │
                              Account can now create shipments
```

Three things that trip people up, all confirmed against the server:

1. **Register does not return tokens.** You must call login separately.
2. **Register does not send a verification code.** It sends a *welcome* email
   only. You must explicitly call `send-verification-code`.
3. **Login does not require verification.** An unverified user gets valid tokens
   and can browse. The wall is at shipment creation, not login.

### Step 1.1 — Register

| | |
| --- | --- |
| **Endpoint** | `POST /api/auth/register-user` |
| **OpenAPI** | `paths./auth/register-user.post` — ~L25 |
| **Request schema** | `…post.requestBody.content."application/json".schema` |
| **Auth** | None |

```bash
jq '.paths."/auth/register-user".post.requestBody.content."application/json".schema' openapi.json
```

**Payload:**

```jsonc
{
  "email": "owner@example.com",       // required, unique
  "password": "secret123",            // required, min 6
  "name": "Jan Kowalski",             // required
  "phone": "+48123456789",            // required, unique, E.164

  "accountType": "BUSINESS",          // optional — defaults to "INDIVIDUAL"
  "companyName": "Kowalski Sp. z o.o.", // optional, BUSINESS only, ≤100
  "nip": "1234563218"                 // optional, BUSINESS only, ≤20
}
```

**The toggle.** Render one switch — *"I'm signing up as a business"*.

- **Off** → send `"INDIVIDUAL"`, or omit the field entirely. Hide the company inputs.
- **On** → send `"BUSINESS"` and reveal `companyName` + `nip`.

Both company fields are **optional even when BUSINESS**. Capturing `nip` here is
what lets you skip asking for it on every future shipment — worth prompting for,
not worth blocking on.

**Checks before calling:**

| Check | Why |
| --- | --- |
| `password.length >= 6` | Server minimum. Enforce more on the client if you like |
| `phone` matches `^\+?[1-9]\d{1,14}$` | Server regex, min 11 chars |
| `companyName`/`nip` sent **only** when `accountType === "BUSINESS"` | Otherwise 400 |

**Responses:**

| Code | Meaning | Do |
| --- | --- | --- |
| `201` | Created | Store `user`, go to login |
| `400` | Validation. `details.issues[].path` names the field | Highlight that field |
| `409` | Email or phone already exists | Offer login instead |

The 400 you can actually cause:

```json
{ "error": "Validation Error", "code": 400,
  "details": { "issues": [ { "path": ["nip"],
    "message": "Only allowed when accountType is BUSINESS." } ] } }
```

If your toggle controls field visibility, you will never see it. It exists so a
wiring bug is loud instead of silent.

### Step 1.2 — Log in

| | |
| --- | --- |
| **Endpoint** | `POST /api/auth/login-user` |
| **OpenAPI** | `paths./auth/login-user.post` — ~L336 |

```jsonc
{ "identifier": "owner@example.com",  // email OR phone
  "password": "secret123" }
```

Returns `accessToken`, `refreshToken`, and the full `user` object — **including
`accountType`, `companyName`, `nip`**. Store the whole user; you need
`accountType` later.

Only a `BANNED` + `FULL` account is refused (403). Unverified accounts log in
fine.

### Step 1.3 — Verify email

Required before the account can create shipments. Two calls:

| Step | Endpoint | OpenAPI |
| --- | --- | --- |
| Send the code | `POST /api/auth/send-verification-code` | `paths./auth/send-verification-code.post` — ~L1679 |
| Submit the code | `POST /api/auth/verify-email` | `paths./auth/verify-email.post` — ~L1783 |

On success `is_verified` flips to `true`. **Gate your "Create shipment" CTA on
`user.is_verified`** — see §2.0 for why.

### Step 1.4 — Verify phone *(optional)*

| Step | Endpoint | OpenAPI |
| --- | --- | --- |
| Send OTP | `POST /api/auth/send-phone-otp` | `paths./auth/send-phone-otp.post` — ~L2434 |
| Submit OTP | `POST /api/auth/verify-phone-otp` | `paths./auth/verify-phone-otp.post` — ~L2573 |

`is_phone_verified` is **not gated anywhere** in the shipment path. It is
informational. Do not block shipment creation on it.

### Step 1.5 — Rehydrating the session

| | |
| --- | --- |
| **Endpoint** | `GET /api/auth/get-current-user` |
| **OpenAPI** | `paths./auth/get-current-user.get` — ~L886 |
| **Auth** | Bearer |

**Call this on every app open.** It is the source of truth for `accountType` —
an admin can change it between sessions, and a stale cached value puts the user
in front of the wrong customs form.

The user object, identical on register / login / get-current-user / update-profile:

```jsonc
{
  "user": {
    "id": "…", "userCode": "MLS-U-…",
    "email": "owner@example.com", "name": "Jan Kowalski",
    "phone": "+48123456789", "address": null,

    "accountType": "BUSINESS",              // ← drives the customs form
    "companyName": "Kowalski Sp. z o.o.",   // null on individual accounts
    "nip": "1234563218",                    // null on individual accounts

    "is_verified": true,                    // ← gates shipment creation
    "is_phone_verified": true,
    "lastActive": "…", "lastLogin": "…",
    "createdAt": "…", "updatedAt": "…"
  }
}
```

`companyName` and `nip` are `null`, never absent, on an individual account.

### Step 1.6 — Editing it later

| | |
| --- | --- |
| **Endpoint** | `PATCH /api/auth/update-user-profile` |
| **OpenAPI** | `paths./auth/update-user-profile.patch` — ~L1064 |

Accepts `name`, `phone`, `address`, `companyName`, `nip`.

**It does not accept `accountType`** — switching between business and individual
is admin-only, because it decides which customs path the user is shown. Do not
build that control. Point the user at support.

Sending `companyName` or `nip` on a non-business account:

```json
{ "error": "Update Failed", "code": 400,
  "details": "Company details can only be set on a business account. Contact support to change your account type." }
```

---

## 2. Create-shipment flow

### 2.0 Preconditions — check these first

Run both before showing the shipment wizard. Neither is expensive; both save a
confusing failure deep in the flow.

| Check | Source | If it fails |
| --- | --- | --- |
| `user.is_verified === true` | `GET /auth/get-current-user` | Block the CTA, route to email verification |
| Not banned | Login/any call returning 403 | Show a support message |

> **Known rough edge.** If an unverified account reaches `create-shipment`, the
> server answers **`500`**, not `403` — the check lives in the service layer and
> the throw is not specially mapped. The body carries
> `"Email verification required to create shipments"`. **Match on that message
> before showing a generic "something went wrong".** Gating the CTA on
> `is_verified` avoids it entirely, which is the real fix on your side.

### 2.0 The shape of it

```flow
Screen 1: Quote form
   │   pickup + dropoff + packages  (+ customs if cross-border)
   ├─► POST /shipments/get-shipping-estimate   → estimateId, tiers{fastest,balanced,economy}
   │
   │   user picks a tier → keep that tier's routingRef
   │
Screen 2: Checkout
   ├─► POST /shipments/create-shipment          → 201 checkoutUrl
   │        { estimateId, routingRef, addresses, packages, customs, billingAddress }
   │
   ├─► redirect to checkoutUrl → customer pays
   │
Screen 3: Return
   └─► GET /payments/verify-payment
```

### Step 2.1 — Get an estimate

| | |
| --- | --- |
| **Endpoint** | `POST /api/shipments/get-shipping-estimate` |
| **OpenAPI** | `paths./shipments/get-shipping-estimate.post` — ~L4508 |
| **Auth** | Optional (guest-compatible) |
| **Required** | `pickup`, `dropoff`, `packages` |

```bash
jq '.paths."/shipments/get-shipping-estimate".post.requestBody.content."application/json".schema.properties' openapi.json
```

**`customs` is accepted here too**, and is required on cross-border just as it is
at create time. So the account-type branch (§2.2) applies at *this* step, not
only at checkout.

Response `200` gives `estimateId`, `rates`, `tiers`, `errors`, `guestId`.
`tiers` has `fastest` / `balanced` / `economy` — **any of them may be missing.
Render what you get.** Store `estimateId` and the chosen tier's `routingRef`.

### Step 2.2 — Build `customs` — detect, never ask

**Delete the "Are you shipping as a business or an individual?" step.**

`customs` is required **only** when
`pickupAddress.countryCode !== dropoffAddress.countryCode`. On a domestic
shipment, skip this whole section.

**The derivation — one line, and it is total:**

```ts
const customsType = user.accountType === "BUSINESS" ? "S" : "I";
```

| `user.accountType` | `customsType` | Declaration |
| --- | --- | --- |
| `"BUSINESS"` | `"S"` | Simplified / business |
| `"INDIVIDUAL"` | `"I"` | Individual |

Inspect either branch directly:

```bash
jq '.paths."/shipments/create-shipment".post.requestBody.content."application/json".schema.properties.customs.oneOf[0]' openapi.json  # "S"
jq '.paths."/shipments/create-shipment".post.requestBody.content."application/json".schema.properties.customs.oneOf[1]' openapi.json  # "I"
```

**Shared by both** — all required: `currency` (`PLN`|`EUR`), `grossWeight`,
`firstName` (≤30), `secondaryName` (≤30), `customsItem`, `categoryOfItem`.
Optional: `costsOfShipment`, `countryOfOrigin` (`"PL"`), `additionalInfo` (≤100),
`vatRegistrationNumber` (server fills from env).

`customsItem` is `{ item: ItemDetail | ItemDetail[] }[]`, where `ItemDetail` is
`nameEn`, `namePl?`, `quantity`, `weight`, `value`, `tariffCode`. Omit `namePl`
and the server auto-translates it from `nameEn`.

**Where the two differ:**

| | Business `"S"` | Individual `"I"` |
| --- | --- | --- |
| `nipNr` | **Required** | Not accepted — a private person has no NIP |
| `categoryOfItem` | `9, 11, 21, 31, 32, 91` | `9, 11, 21, 32` — **no `31`, no `91`** |
| `customAgreements` | 4 keys: `notExceedValue`, `notProhibitedGoods`, `notRestrictedGoods`, `invoiceContent` | 2 keys: `notProhibitedGoods`, `notRestrictedGoods` |
| EORI / invoice | — | `eoriNr`, `eoriNrReceiver`, `vatRegistrationNumberReceiver`, `invoiceNr`, `invoiceDate` (`YYYY-MM-DD`), `invoice` (base64) — **all optional** |

> `notProhibitedGoods` and `notRestrictedGoods` must literally be `true`. The
> schema rejects `false` — they are attestations, not toggles. Block submit
> rather than sending `false`. `customAgreements` as a whole is optional, but if
> you send it, every key in that branch is required.
> Older copies of `client-shipping-endpoints-guide.md` typed `invoiceNr`,
> `invoiceDate`, and `invoice` as **required** on the individual branch. They
> never were. The spec's `required` array for that branch is the proof.

**Prefill the NIP.** If the user gave one at sign-up, use it:

```ts
nipNr: user.nip ?? form.nipNr   // only prompt when the profile has none
```

**Worked example:**

```ts
const base = { currency, grossWeight, firstName, secondaryName,
               customsItem, categoryOfItem };

const customs = user.accountType === "BUSINESS"
  ? { ...base, customsType: "S",
      nipNr: user.nip ?? form.nipNr,
      customAgreements: { notExceedValue: true, notProhibitedGoods: true,
                          notRestrictedGoods: true, invoiceContent: true } }
  : { ...base, customsType: "I",
      eoriNr: form.eoriNr, invoiceNr: form.invoiceNr,
      invoiceDate: form.invoiceDate, invoice: form.invoiceBase64,
      customAgreements: { notProhibitedGoods: true, notRestrictedGoods: true } };
```

### Step 2.3 — Create the shipment

| | |
| --- | --- |
| **Endpoint** | `POST /api/shipments/create-shipment` |
| **OpenAPI** | `paths./shipments/create-shipment.post` — ~L3105 |
| **Auth** | Bearer, **required** |
| **Required** | `estimateId`, `routingRef`, `pickupAddress`, `dropoffAddress`, `packages` |

```jsonc
{
  "estimateId": "9b1deb4d-…",     // from step 2.1
  "routingRef": "rt_01HQ8X…",     // the chosen tier's ref, echoed unmodified
  "pickupAddress":  { … },
  "dropoffAddress": { … },
  "packages":       [ … ],
  "customs":        { … },        // required only when countries differ
  "billingAddress": { … },        // optional
  "preferredPaymentOption": "stripe"   // "stripe" | "payu"
}
```

**Never send** `carrierSlug`, `rate`, `actualPrice`, `fulfillmentType`,
`pickupDetails`, or `dropoffCenterId`. The server recovers carrier, service, and
price from the stored estimate. Fulfillment is chosen *after* payment.

**Responses** — all six are now documented in the spec:

| Code | Meaning | Do |
| --- | --- | --- |
| `201` | Created | Redirect to `checkoutUrl` |
| `400` | Validation | Highlight `details.issues[].path` |
| `401` | No / invalid token | Re-auth |
| `403` | Banned, or updating another user's shipment | Support message |
| `409` | **Quote Expired** or **Quote Unavailable** | Re-quote from step 2.1. **Do not retry the same `routingRef`** — it will keep failing |
| `500` | Server error **or** unverified account — check the message | See §2.0 |

**`201` body:**

```jsonc
{
  "shipmentId": "…",
  "customTrackingNumber": "…",
  "checkoutUrl": "https://…",      // ← redirect the customer here
  "paymentGateway": "stripe",
  "fallbackApplied": false,
  "fallbackMessage": "",
  "pdfGenerationStatus": "PENDING", // "READY" | "PENDING"
  "invoice": {
    "id": "…", "number": "…", "status": "…",
    "totalAmount": 123.45, "currency": "PLN",
    "tax": 23.05, "taxRate": { … },
    "lineItems": [ … ],
    "paymentLink": "…", "paymentLinkExpiresAt": "…",
    "pdfDownloadUrl": null          // null while pdfGenerationStatus is PENDING
  }
}
```

> Passing `shipmentId` + `invoiceId` puts the endpoint in **UPDATE mode**, which
> returns **`200`** instead of `201`. Accept both.

### Step 2.4 — After payment

| | |
| --- | --- |
| **Endpoint** | `GET /api/payments/verify-payment` |
| **OpenAPI** | `paths./payments/verify-payment.get` — ~L5735 |

Then the shipment page takes over: `GET /shipments/{id}/fulfillment-options`
lets the customer pick courier pickup or drop-off. That flow is unchanged and
documented in `frontend-integration-guide-v4.md` §4.

---

## 3. Quick reference

| Need | Call | OpenAPI pointer |
| --- | --- | --- |
| Create the account | `POST /auth/register-user` | `paths./auth/register-user.post` |
| Get tokens | `POST /auth/login-user` | `paths./auth/login-user.post` |
| Send email code | `POST /auth/send-verification-code` | `paths./auth/send-verification-code.post` |
| Confirm email | `POST /auth/verify-email` | `paths./auth/verify-email.post` |
| **Read `accountType`** | `GET /auth/get-current-user` | `paths./auth/get-current-user.get` |
| Edit company details | `PATCH /auth/update-user-profile` | `paths./auth/update-user-profile.patch` |
| Quote | `POST /shipments/get-shipping-estimate` | `paths./shipments/get-shipping-estimate.post` |
| Book | `POST /shipments/create-shipment` | `paths./shipments/create-shipment.post` |
| Confirm payment | `GET /payments/verify-payment` | `paths./payments/verify-payment.get` |

### Checks, in order

1. **Before the shipment CTA** — `user.is_verified === true`. Otherwise route to email verification.
2. **Before building `customs`** — is it cross-border? `pickupAddress.countryCode !== dropoffAddress.countryCode`. If not, omit `customs` entirely.
3. **Choosing the branch** — `user.accountType === "BUSINESS" ? "S" : "I"`. Never ask.
4. **Business branch** — `nipNr` required; prefill from `user.nip`.
5. **On 409** — re-quote. Never retry the same `routingRef`.
6. **On 500** — read the message before blaming the server; unverified accounts land here.

### Related documents

| Doc | Covers |
| --- | --- |
| `docs/account-type-and-business-profile-guide.md` | Account type in full — field tables, admin override |
| `docs/api/frontend-integration-guide-v4.md` | The v4 breaking changes, fulfillment, tracking |
| `docs/client-shipping-endpoints-guide.md` | Customs TypeScript interfaces |
| `docs/api/admin-integration-guide-v4.md` | Admin-side account type control |
