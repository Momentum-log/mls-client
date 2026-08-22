# Admin Dashboard Integration Guide — MLS API v4.1.0

Written against the capability audit dated 2026-08-09. Covers what changed on
the server, what the audit got wrong, what already exists that the dashboard
hasn't built, and what the server still owes you.

**Base URL:** `NEXT_PUBLIC_API_URL` should be `https://<host>/api`, **not**
`/api/admin`. Admin routes are mounted at `/api/admin`, so every admin path
includes that segment. See §2.

---

## 1. What's new since the audit

Ten admin endpoints landed today. None existed when the audit was written.

### 1.1 Hub routing configuration

MLS can now route international shipments through the Łódź sorting centre —
two legs, potentially two carriers, one price to the customer. Two switches
control it, both admin-managed so they change without a deploy.

| Endpoint | Purpose |
|---|---|
| `GET /api/admin/settings/hub` | Everything the hub panel needs, in one call |
| `PUT /api/admin/settings/hub/routing` | Master switch: `{ enabled: boolean }` |
| `PUT /api/admin/settings/hub/compete` | `{ enabled: boolean }` — see below |
| `POST /api/admin/settings/hub/centers` | Create a sorting centre |
| `PUT /api/admin/settings/hub/centers/:id` | Update one |
| `DELETE /api/admin/settings/hub/centers/:id` | Delete one (409 if active) |

**The two switches nest:**

```
hub routing OFF                    → every quote is direct
hub routing ON,  compete OFF       → every tier routes through Łódź  (default)
hub routing ON,  compete ON        → hub and direct compete per tier
```

`GET /settings/hub` returns `routingMode` — a plain-English sentence describing
the current combination. **Use it.** Don't reimplement the logic in the UI.

Both toggle responses return `effective: boolean` and an optional `warning`.
Enabling hub routing with no centre configured, or flipping compete while hub
routing is off, are both no-ops — and the response says so rather than letting
an admin click and see nothing happen. Surface the warning.

**Sorting centre rules the UI should reflect:**
- Exactly one is active. Activating one stands the others down, in one transaction.
- `contactName` and `contactPhone` are **required** — carriers reject a leg originating at the centre without them.
- The active centre cannot be deleted (409). Activate another, or turn routing off first.
- `activeHub.source` is `"database"` or `"environment"`. Showing `environment` tells an admin they're looking at a deploy-time fallback that any activated centre will replace.

### 1.2 Multi-leg ops queue

When a shipment routes through the hub, leg 2 is **created by a human**. The
system can see a carrier mark leg 1 delivered; it cannot see a parcel on a
shelf. Creating leg 2 off a carrier status alone sends a courier to collect
something that hasn't arrived.

| Endpoint | Purpose |
|---|---|
| `GET /api/admin/shipments/multi-leg` | The queue — defaults to shipments waiting on someone |
| `GET /api/admin/shipments/multi-leg/:id` | Detail with both legs |
| `POST /api/admin/shipments/multi-leg/:id/confirm-arrival` | Ops confirms the parcel is at the centre |
| `POST /api/admin/shipments/multi-leg/:id/create-leg-two` | Create leg 2 with its carrier |

Both list and detail return **`canConfirmArrival`** and **`canCreateLegTwo`**.
Enable the buttons from those flags — the state rules live server-side so they
can't drift.

**`create-leg-two` can return 409 Price Changed:**

```json
{ "error": "Price Changed", "code": 409,
  "details": { "message": "…", "quotedPrice": 74.00, "livePrice": 96.50,
               "resolution": "Re-submit with acceptRepricing: true to proceed at the new price." } }
```

This is a **decision, not a failure.** The customer paid a combined price
possibly days ago; leg 2 now costs more. Show both figures and let ops choose.
Re-submit with `{ "acceptRepricing": true }` to proceed.

**Never show leg 2's label to a customer.** It's printed at the centre. They
already hold leg 1's, and a parcel carrying two barcodes is a physical failure.

### 1.3 New shipment statuses

Six values were added. Any exhaustive `switch` on `shipmentStatus` needs them:

| Status | Meaning |
|---|---|
| `AWAITING_FULFILLMENT` | Label ready; customer choosing pickup vs drop-off |
| `PICKUP_SCHEDULED` | Courier confirmed |
| `AWAITING_DROPOFF` | Customer will drop off |
| `AWAITING_HUB_CONFIRMATION` | Multi-leg: at the centre, waiting on ops |
| `LEG2_PENDING` | Multi-leg: arrival confirmed |
| `LEG2_CREATED` | Multi-leg: second leg dispatched |

Also: the tracking response now separates **`shipmentStatus`** (authoritative —
branch on this) from **`carrierStatus`** (the carrier's own free-text wording —
display only). The carrier's value previously occupied the top-level `status`
key and shadowed the real one.

---

## 2. Audit findings — resolved against the live server

### D-02 · Doubled `/admin` path segment — **confirmed, client-side bug**

The server mounts admin routes at `/api/admin` and declares them as
`/shipments/bulk-delete`, `/users/:id/cascade`, `/users/bulk-delete`.

**Correct full paths:**
```
DELETE /api/admin/shipments/:id
POST   /api/admin/shipments/bulk-delete
POST   /api/admin/users/:id/cascade
POST   /api/admin/users/bulk-delete
POST   /api/admin/leads/bulk-delete
```

If `NEXT_PUBLIC_API_URL` ends in `/api`, the client should call
`/admin/shipments/bulk-delete`. If it ends in `/api/admin`, it should call
`/shipments/bulk-delete`. **The bug is the inconsistency** — some client calls
include `/admin` and some don't, so one set is always wrong.

**Recommended:** set the base to `/api` and prefix every admin path with
`/admin`. That matches the spec and keeps non-admin endpoints reachable from
the same client.

### D-04 · Safe-delete user path — **not a defect**

The client calls `DELETE /users/{id}`. The server has exactly that at
`admin.routes.ts:387`. The audit's spec copy was stale. **No change needed.**

### D-09 · Staff "Recent Activity" spinner — **the endpoint exists**

`GET /api/admin/activity-logs?adminId=<id>` returns that staff member's audit
trail, paginated. Also filters on `userId`, `actorType`, and `action`
(case-insensitive contains).

The fake spinner can become a real list today.

---

## 3. Already on the server, not yet built in the dashboard

Every one of these is live. The audit flagged them; they need client work only.

| Endpoint | What it unlocks |
|---|---|
| `GET /api/admin/emails/templates`<br>`POST /api/admin/emails/templates` | **The entire email-template module.** `EmailTemplate` model, upsert by name. The `email:read`/`email:write` permissions and the `/dashboard/settings` guard entry already exist — only the page is missing |
| `GET /api/admin/shipments/:id` | Single shipment **with audit logs**. The detail sheet currently passes list rows in, so it never sees per-shipment history |
| `POST /api/admin/shipments/:id/complete` | One-click "Mark Completed" + notify, instead of the generic override modal |
| `GET /api/admin/activity-logs` | Global audit trail, filterable. Every mutation in the app is high-consequence and currently only self-auditable |
| `GET /api/admin/settings`<br>`PUT /api/admin/settings` | System settings, including `passwordRotationFrequency` |
| `POST /api/admin/leads/bulk-delete` | Batch lead cleanup. Estimates are kept deliberately — every quote is a marketing lead until an admin deletes it, which is why there's no cron |

---

## 3b. Account type on the user record *(v4.3.0)*

Users now carry a business/individual flag captured at sign-up. Three new fields
on the `User` record: `accountType` (`"INDIVIDUAL" | "BUSINESS"`), `companyName`,
and `nip`. Full behaviour in
[account-type-and-business-profile-guide.md](../account-type-and-business-profile-guide.md).

**What the dashboard gets:**

| Endpoint | Change |
|---|---|
| `GET /api/admin/users` | List rows now include `accountType` — enough to badge or filter business accounts |
| `GET /api/admin/users/:identifier` | Detail response includes `accountType`, `companyName`, `nip` |
| `PUT /api/admin/users/:id/profile` | Accepts all three. **This is the only way `accountType` can be changed** |

**The admin is the only route for switching account type.** Users can correct
their own `companyName`/`nip` via the self-serve profile endpoint, but flipping
between business and individual is deliberately not exposed to them — it decides
which customs form they are shown at shipment time, so it goes through support.

```jsonc
PUT /api/admin/users/:id/profile
{ "accountType": "BUSINESS", "companyName": "Kowalski Sp. z o.o.", "nip": "1234563218" }
```

Setting `accountType` to `"INDIVIDUAL"` **clears `companyName` and `nip`
server-side**, so an individual account can never keep an orphaned company
identity — the dashboard does not need to null them itself. The change is
audit-logged as `USER_PROFILE_UPDATE` with the full payload, as before.

Note these routes remain among the unregistered admin surface (see §5) — they
are not in `openapi.json`, which is why they are documented here.

---

## 4. Proxy shipment — deliberately unchanged

`POST /api/admin/shipments/proxy` **still takes `carrierSlug` + `rate`.**

The customer-facing `create-shipment` moved to `estimateId` + `routingRef`
because a customer's frontend can't know which carrier is cheapest. An admin
picking a rate from a wizard is a different situation — they *are* choosing,
deliberately, on the user's behalf. So the proxy contract is unchanged.

Two consequences:

**Proxy shipments are always single-leg.** They don't go through the routing
engine, so they never produce hub-routed legs. That's correct for now — an
admin creating a shipment by hand shouldn't get a two-carrier journey they
didn't ask for.

**D-08 still applies and matters more than the audit says.** The wizard omits
`currency`, so a EUR rate is created as PLN — roughly a 4× under-charge. It
also omits `estimateId`, which is the root cause of the heuristic correlation
engine. Both are one-line client fixes.

---

## 5. What the server still owes the admin dashboard

Honest list. Nothing here exists yet.

| Gap | Why it matters |
|---|---|
| **Write-permission enforcement is unverified server-side** | The audit's D-01 is that the *client* checks no `:write` permission. The client is not a security boundary — but I have not verified that every admin mutation is gated by `requirePermission(...:write)` on the server. **Until that's confirmed, treat D-01 as potentially a real privilege-escalation hole, not just a UI gap.** Worth an explicit audit |
| **No per-staff activity endpoint under `/staff`** | `GET /staff/me/activity` is self-only. Cross-staff auditing works via `/admin/activity-logs?adminId=`, which is fine — but the two live under different prefixes with different permissions, which is confusing |
| **Carrier save is three separate writes** | Profile → commissions → thresholds, non-transactional. A mid-sequence failure leaves a mixed state. A single endpoint accepting all three would fix R-02 properly |
| **`estimateId` isn't populated on proxy shipments** | Server-side this is just accepting and storing it. Doing so lets the dashboard delete the correlation engine and its 200-row fetches (R-01) |
| **54 of 66 admin routes are unregistered in the spec** | Pre-existing. The dashboard can't discover most of the admin surface from `openapi.json`. The 10 new ones are registered; the rest is debt |

---

## 6. Where the dashboard is going to feel the change first

Ranked by how quickly it bites:

1. **Shipment status switches will fall through.** Six new values. Anything exhaustive breaks quietly.
2. **`status` vs `shipmentStatus`.** If the detail sheet reads a top-level `status` from tracking, it's now reading the carrier's wording.
3. **Hub config has no UI at all.** The toggles exist and work; there's nowhere to click them. Until then, hub routing can only be changed by an API call.
4. **The multi-leg queue has no UI.** If hub routing is turned on and a customer books a hub-routed tier, that shipment **stops at `AWAITING_HUB_CONFIRMATION` and waits forever** — because nothing in the dashboard can confirm arrival.

> **Consequence worth stating plainly:** do not enable hub routing in production
> until the multi-leg ops queue exists in the dashboard, or ops has another way
> to call those two endpoints. A parcel would reach Łódź and stay there.
