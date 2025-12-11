Below are concise, development-ready user and admin flows. Each step lists UI screens, backend actions, DB updates, webhooks, and edge cases to implement.

# User flows

## 1 — Marketing visitor → Create shipment (guest)

1. Screen: Marketing page with CTA button “Create shipment”.
2. Action: Click → open Create Shipment form (single-page wizard).
3. UI steps: Package presets → Dimensions & weight → Pickup address (auto-detect optional) → Dropoff address → Service preferences (speed, insurance) → Contact & email (optional) → “Get rates”.
4. Backend: POST /api/quote.

   * If local route → compute local price algorithm.
   * Else → call aggregator(s) for rates, normalize responses, apply commission, return options.
5. UI: Show rate cards (price with commission, ETA, service-code). No carrier names. Allow selection.
6. Action: Choose rate → Checkout.
7. Checkout UI: collect minimal payer info. If user supplies email, create GuestUser row. Set secure guest cookie with guest_id.
8. Backend: create Shipment, Package rows, Rate record, tracking_code (your slug), shipment.status = CREATED. Create Stripe PaymentIntent or Checkout session.
9. After payment success: update Shipment.status = PAID. If label purchased automatically call /purchase-label. Otherwise set status = AWAITING_FULFILLMENT. Send confirmation email with tracking_code.
10. Guest experience: show success page with tracking input and option “Save this shipment to account” (email-based claim link). Guest can return and view via cookie + tracking_code input. Without cookie or login they can only view single shipment via tracking_code.

## 2 — Authenticated user flow

1. If user signs up (Clerk) before or during checkout, associate guest_id shipments with user_id.
2. UI: User dashboard (dropdown or /dashboard). Lists all shipments, filter by status, search by tracking_code. Each item shows summary card (status, ETA, last event). Click → Shipment detail.
3. Shipment detail UI: timeline of canonical events, package info, rates, invoices, labels (download), actionable buttons (Cancel, Request Pickup, Rebook, Open Claim).
4. Backend actions:

   * GET /api/shipments?user_id=... for list.
   * GET /api/shipments/:id for detail.
   * Allow user-initiated actions: cancel (if allowed), request pickup, schedule return. Each triggers DB update, webhook to fulfillment, and notifications.
5. Notifications: email + optional SMS on key events (PAID, PICKED_UP, OUT_FOR_DELIVERY, DELIVERED, EXCEPTION).

## 3 — Tracking-only flow

1. Public page /track. User enters tracking_code.
2. Backend: map tracking_code → shipment_id. Return canonical status and event timeline. Show last-updated timestamp. If multiple providers linked, aggregate events into canonical timeline.

# Admin flows

## Roles & access

* Roles: SuperAdmin, Operations, PartnerManager, Finance, Support.
* Admin UI protected by Clerk with role checks. Admin domain admin.example.com.

## Admin home

* Dashboard widgets: live shipments count, pickups scheduled today, exceptions, unpaid/failed payments, pending labels to buy.

## Shipment management (Operations)

1. List view with filters (status, date range, pickup center, partner).
2. Detail view: full shipment record, event timeline, provider raw events, billing breakdown, assigned hub, assigned courier (local pickup).
3. Actions:

   * Update status manually (with reason + timestamp).
   * Assign to local driver or to partner for handoff.
   * Purchase or reprint label via aggregator.
   * Refund or adjust invoice (Finance role).
   * Open incident/claim.
4. Backend: changes create CarrierEvents, send webhooks to external partners if needed, and push notifications to user.

## Fulfillment & Pickup flow

1. Admin schedules pickup or approves auto-scheduled pickup.
2. Driver app or pickup manifest generated (CSV / printable).
3. Admin marks pickup completed → Shipment.status = IN_TRANSIT_LOCAL → if handoff required, create Handoff record with partner_service_code and transfer_time.

## Partner management (PartnerManager)

1. UI to add/update partner credentials (API keys), enable/disable providers, set commission overrides per partner and service_code.
2. Test keys sandbox button runs a test request and shows capability (rates, labels, tracking).
3. Business rules:

   * Weight/country restrictions per partner.
   * Fallback partner order for unavailable routes.
4. Backend: store encrypted credentials, feature flags, and per-partner pricing multiplier.

## Reconciliation & finance (Finance)

1. Billing dashboard: expected payables to carriers, commissions earned, per-day P&L.
2. Sync labels purchased via aggregator and map to supplier invoices. Provide CSV export for accounting.
3. Refund flows: allow prorated refunds, update Stripe refunds, and adjust bookkeeping entries.

## Support

1. Support console: search by tracking_code, phone, email. Quick actions: send manual update, escalate, create claim.
2. Template responses for common inquiries. Logs of support actions saved to shipment timeline.

# Backend responsibilities & events

## Key endpoints (recap)

* POST /api/quote
* POST /api/shipments
* POST /api/shipments/:id/purchase-label
* GET /api/shipments/:id
* GET /api/shipments (admin filters)
* POST /api/webhooks/carrier (and /webhooks/stripe)
* POST /api/admin/shipments/:id/status

## Canonical shipment statuses

CREATED → PAID → AWAITING_PICKUP → PICKED_UP → IN_TRANSIT → HANDED_OFF → OUT_FOR_DELIVERY → DELIVERED → RETURNED → EXCEPTION → CANCELLED → REFUNDED.

Map provider-specific events into these. Store both canonical event and raw provider payload.

## Webhooks & idempotency

* Verify signatures.
* Use idempotency keys.
* Deduplicate events by external_event_id.
* On webhook, update CarrierEvents, recalc shipment.status, push websocket or push-notification to users.

# Data privacy & auth rules

* Only authenticated users can list all shipments for their user_id.
* Support and Operations can view shipments but only Finance can see cost breakdowns with supplier costs. Fine-grained role permissions enforced in backend.
* Guest access: invoice and shipment detail view only if the request has valid guest cookie OR matches tracking_code and email OTP. Do not expose supplier internal IDs to guests.

# Edge cases & error handling

* Rates expired between quote and purchase: lock quote on create for short TTL or recalc with user confirmation.
* Partial pickups: multiple packages under same shipment with separate handoffs. Support per-package events.
* Carrier downtime: fallback to alternative partner. Notify ops if all providers fail.
* Payment failures: quarantine shipment, notify user to retry, auto-cancel after configurable timeout.
* Customs holds and long exceptions: escalate to Support with auto-email templates.

# Developer expectations (what to build first)

1. Guest create-shipment wizard with /api/quote and guest cookie.
2. Persistent DB records and tracking_code generation.
3. Minimal checkout flow with Stripe test keys.
4. Public /track endpoint and timeline UI.
5. Admin list + manual status update endpoints.
6. Integrate one aggregator sandbox and webhook processing.
7. Add role-based auth and partner management.

# Deliverables you can ask me to produce next (pick one)

* Detailed sequence diagrams for user and admin flows.
* Prisma schema + SQL migrations matching data model.
* API contract (OpenAPI) for endpoints above.
* Minimal Next.js scaffold for Create Shipment, /track, and admin list.

State which deliverable you want.
