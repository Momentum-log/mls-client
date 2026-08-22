# Account Type & Business Profile — Client Guide

**Added in v4.3.0.**

Sign-up now records whether an account belongs to a **business** or a **private
individual**. The answer is stored on the user profile and returned on every
user-shaped response, so the shipment flow already knows which customs form to
render — it never has to ask again.

---

> **Building the screens?** [signup-and-shipment-flows-v4.3.md](./api/signup-and-shipment-flows-v4.3.md)
> walks the sign-up and create-shipment flows end to end with OpenAPI pointers,
> preconditions, and error handling. This document is the reference for the
> account-type field itself.

## 1. The problem this removes

Customs on a shipment is a discriminated union on `customsType`:

| `customsType` | Meaning | Distinguishing requirement |
|---|---|---|
| `"S"` | Simplified clearance — **business** | `nipNr` is **required** |
| `"I"` | Individual clearance — **private person** | no `nipNr`; optional `eoriNr`, `invoiceNr`, `invoice` |

Two consequences of that living only on the shipment:

- Every single shipment had to open with "are you shipping as a business or an
  individual?", and the answer was thrown away afterwards.
- Customs is only required when the origin and destination countries differ, so
  a domestic **PL → PL** shipment carried no business signal at all. Nothing in
  the system knew a Polish company was a Polish company.

The account type fixes both by answering the question once, at sign-up.

---

## 2. Sign-up

`POST /api/auth/register-user`

```jsonc
{
  "email": "owner@example.com",
  "password": "secret123",
  "name": "Jan Kowalski",
  "phone": "+48123456789",

  "accountType": "BUSINESS",              // "BUSINESS" | "INDIVIDUAL"
  "companyName": "Kowalski Sp. z o.o.",   // optional, business only
  "nip": "1234563218"                     // optional, business only
}
```

### The three fields

| Field | Type | Rules |
|---|---|---|
| `accountType` | `"INDIVIDUAL"` \| `"BUSINESS"` | Optional. **Defaults to `"INDIVIDUAL"`** when omitted |
| `companyName` | string, 1–100 chars | Optional. Trimmed. Rejected unless `accountType` is `"BUSINESS"` |
| `nip` | string, 1–20 chars | Optional. Trimmed. Rejected unless `accountType` is `"BUSINESS"` |

Back it with a single toggle — *"I'm signing up as a business"*. Toggle off,
send nothing (or `"INDIVIDUAL"`). Toggle on, send `"BUSINESS"` and reveal the
company name and NIP inputs.

Because `accountType` defaults, **existing clients that never send it keep
working unchanged** and their users land as individuals.

### The one error to handle

Sending `companyName` or `nip` while `accountType` is `"INDIVIDUAL"` is a `400`,
attributed to the offending field:

```json
{ "error": "Validation Error", "code": 400,
  "details": { "issues": [ { "path": ["nip"], "message": "Only allowed when accountType is BUSINESS." } ] } }
```

This is a contradictory payload rather than a user mistake — if the toggle
controls field visibility, you will never hit it. It is rejected rather than
silently dropped so a wiring bug surfaces immediately.

> **Why not silently ignore it?** Sign-up already accepts an `address` it never
> persists, and that silent drop has cost debugging time before. Not repeating it.

---

## 3. Reading it back

All three fields appear on **every** endpoint that returns a user — register,
login, `GET /api/auth/get-current-user`, and `PATCH /api/auth/update-user-profile`:

```jsonc
{
  "user": {
    "id": "…",
    "userCode": "MLS-U-…",
    "email": "owner@example.com",
    "name": "Jan Kowalski",
    "accountType": "BUSINESS",
    "companyName": "Kowalski Sp. z o.o.",
    "nip": "1234563218",
    "is_verified": true,
    "is_phone_verified": true
  }
}
```

`companyName` and `nip` are `null` — never absent — on an individual account.

---

## 4. Using it on the shipment screen

This is the part that changes your UI. **Delete the "Are you shipping as a
business or an individual?" step.** You already know.

### 4.1 Where to read it

`accountType` arrives on every user response, so you almost never need a
dedicated call. In practice:

| Moment | Call | Why |
|---|---|---|
| Right after login | `POST /api/auth/login-user` | The response already contains the full user — store it |
| On app open / refresh | `GET /api/auth/get-current-user` | Rehydrating the session; authoritative if an admin changed the type |
| After a profile edit | `PATCH /api/auth/update-user-profile` | Returns the updated user |

Treat `GET /api/auth/get-current-user` as the source of truth on app open. An
admin can change `accountType` between sessions, and a cached value would put
the user in front of the wrong customs form.

```ts
// On app open
const { user } = await api.get("/api/auth/get-current-user");
session.set(user);          // { accountType, companyName, nip, … }
```

### 4.2 Deriving the customs type

The mapping is one line, and it is total — there is no third case:

```ts
const customsType = user.accountType === "BUSINESS" ? "S" : "I";
```

| `user.accountType` | `customs.customsType` | Form to render |
|---|---|---|
| `"BUSINESS"` | `"S"` — simplified clearance | Business form (§4.4) |
| `"INDIVIDUAL"` | `"I"` — individual clearance | Individual form (§4.5) |

### 4.3 Fields both forms share

Render these regardless of account type. All are required unless marked.

| Field | Type | Notes |
|---|---|---|
| `currency` | `"PLN" \| "EUR"` | |
| `grossWeight` | number | |
| `firstName` | string, ≤30 | Sender first name |
| `secondaryName` | string, ≤30 | Sender surname |
| `customsItem` | `{ item: ItemDetail \| ItemDetail[] }[]` | The goods |
| `categoryOfItem` | enum | **Options differ by type** — see below |
| `costsOfShipment` | number | *optional* |
| `countryOfOrigin` | `"PL"` | *optional* |
| `additionalInfo` | string, ≤100 | *optional* |
| `vatRegistrationNumber` | string | *optional*, server fills from env |

`ItemDetail` is identical in both: `nameEn`, `namePl?`, `quantity`, `weight`,
`value`, `tariffCode`. (`namePl` is auto-translated server-side from `nameEn` if
you omit it.)

### 4.4 Business form — `customsType: "S"`

**One extra required field:**

| Field | Type | Notes |
|---|---|---|
| `nipNr` | string | **Required.** Prefill from `user.nip` if captured at sign-up |

**Wider category list** — 6 options instead of 4:

```
"9" | "11" | "21" | "31" | "32" | "91"
```

`"31"` and `"91"` are **business-only**. Do not offer them on the individual form.

**Four agreement checkboxes** (`customAgreements` is optional as a whole, but if
you send it, all four keys are required):

```jsonc
{ "notExceedValue": true, "notProhibitedGoods": true,
  "notRestrictedGoods": true, "invoiceContent": true }
```

> `notProhibitedGoods` and `notRestrictedGoods` must literally be `true` — the
> schema rejects `false`. They are attestations, not toggles. Block submit
> instead of sending `false`.

### 4.5 Individual form — `customsType: "I"`

**No `nipNr`.** A private person does not have one — sending it is a validation
error. This is the whole point of the split.

**Six optional fields the business form does not have:**

| Field | Type | Notes |
|---|---|---|
| `eoriNr` | string | *optional* |
| `eoriNrReceiver` | string | *optional* |
| `vatRegistrationNumberReceiver` | string | *optional* |
| `invoiceNr` | string | *optional* |
| `invoiceDate` | string | *optional*, `YYYY-MM-DD` |
| `invoice` | string | *optional*, base64 document |

> All six are genuinely optional. An older copy of
> `client-shipping-endpoints-guide.md` typed the last three as required — that
> was never true of the server. `openapi.json` is authoritative.

**Narrower category list** — 4 options:

```
"9" | "11" | "21" | "32"
```

**Two agreement checkboxes**, not four:

```jsonc
{ "notProhibitedGoods": true, "notRestrictedGoods": true }
```

### 4.6 Putting it together

```ts
const base = {
  currency, grossWeight, firstName, secondaryName, customsItem, categoryOfItem,
};

const customs = user.accountType === "BUSINESS"
  ? {
      ...base,
      customsType: "S",
      nipNr: user.nip ?? form.nipNr,     // prefilled if captured at sign-up
      customAgreements: {
        notExceedValue: true, notProhibitedGoods: true,
        notRestrictedGoods: true, invoiceContent: true,
      },
    }
  : {
      ...base,
      customsType: "I",
      eoriNr: form.eoriNr,               // all optional
      invoiceNr: form.invoiceNr,
      invoiceDate: form.invoiceDate,
      invoice: form.invoiceBase64,
      customAgreements: {
        notProhibitedGoods: true, notRestrictedGoods: true,
      },
    };

await api.post("/api/shipments/create-shipment", {
  estimateId, routingRef, pickupAddress, dropoffAddress, packages, customs,
});
```

Remember `customs` is only required when
`pickupAddress.countryCode !== dropoffAddress.countryCode`. On a domestic
shipment, skip the whole block — including the account-type branch.

### 4.7 What the server does *not* do

Deliberately, `POST /api/shipments/create-shipment` is **unchanged**:

- It does **not** reject a `customsType` that disagrees with the account type.
  A business owner shipping a personal parcel is legitimate.
- It does **not** infer or auto-fill `customs` from the profile. You still send
  the whole block.
- It does **not** change VAT. Tax classification still resolves B2B/B2C from
  `customs.customsType` in `src/services/tax-engine.ts`, exactly as before.

`accountType` is a **profile signal that drives your UI**, not a server-side
gate. Nothing about existing shipment or invoice behaviour changed — which
means you can adopt this at your own pace without a coordinated release.

## 5. Changing it later

| Change | Who | How |
|---|---|---|
| `companyName`, `nip` | The user | `PATCH /api/auth/update-user-profile` |
| `accountType` | **Admin only** | `PUT /api/admin/users/:id/profile` |

A user can correct their own company details, but cannot flip between business
and individual — that decides which customs path they are shown, so it goes
through support.

Sending `companyName` or `nip` on an account that is not `BUSINESS` returns:

```json
{ "error": "Update Failed", "code": 400,
  "details": "Company details can only be set on a business account. Contact support to change your account type." }
```

On the admin side, switching an account **to** `INDIVIDUAL` clears
`companyName` and `nip`, so an individual account can never retain an orphaned
company identity. The change is audit-logged as `USER_PROFILE_UPDATE`.

---

## 6. Where it lives

| Concern | File |
|---|---|
| Enum + columns | `prisma/schema.prisma` — `enum AccountType`, `model User` |
| Migration | `prisma/migrations/20260821120000_add_account_type_to_user/` |
| Sign-up + self-serve update | `src/controllers/auth.controller.ts` |
| Documented response shape | `src/routes/auth.routes.ts` — `PublicUserSchema` |
| Admin override | `src/controllers/admin-user.controller.ts` |
| Verification | `scripts/test-account-type-flow.ts` (`bun run test:account-type`) |

---

## 7. Known follow-up

`Invoice.buyerNip` exists in the schema, is documented "B2B only", and is still
written as `null` on every generated invoice (`src/services/invoice.service.ts`).
Now that a NIP can live on the profile, populating it is a natural next step —
but it changes invoice output, so it belongs in its own release rather than
riding along with this one.
