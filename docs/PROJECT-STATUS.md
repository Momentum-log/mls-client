# MLS — What the Product Can and Cannot Do

**As of:** 2026-10-12
**Covers:** the whole product. That means the customer side (`mls-client`), the admin side (`mls-admin`) and the engine behind both (`mls-server`).
**Measured against:** the original plan (`mls-client/docs/mls-dev-plan.md`), the admin spec (`mls-admin/docs/admin-comprehensive-spec.md`, `admin-workflow.md`), and every PRD since.

**Key:** **Can** = built and working · **In progress** = written but not finished, committed or switched on · **Cannot yet** = planned but not built · **Dropped** = deliberately removed or changed from the plan.

> The old task files in `mls-client/docs/tasks/` are not reliable. Some show unticked boxes for work that has shipped (for example phone verification) or was later reversed (for example the mandatory location prompt). This document goes by the code and the changelogs.

---

## The product in one paragraph

Momentum Logistics Service (MLS) is a shipping platform based in Poland. Customers get a price, book and pay for a shipment, then track it. MLS chooses the carrier behind the scenes (FedEx today, DHL about to be switched on) and can route parcels through its own sorting centre in Łódź. It also issues Polish VAT invoices. MLS staff run the business from a separate admin dashboard.

---

## Part 1 — Customers

### What a customer CAN do

| Area | Capability |
|---|---|
| **Account** | Sign up as an individual or a business (with company name and NIP); log in with email or phone; verify email and phone; reset a forgotten password; edit their profile; change their password |
| **Get a price** | Get a quote without an account. It includes address autocomplete, customs details for international parcels, several packages in one shipment, and three options (Fastest / Balanced / Economy). The customer picks the price and speed, and MLS picks the carrier |
| **Book** | Book a shipment through a step-by-step form (addresses, packages, customs, summary). Heavy parcels are flagged, and an expired quote is re-priced automatically |
| **Pay** | Pay by Stripe or PayU, in PLN or EUR; come back later to pay an unpaid shipment; be redirected straight to the shipment after paying |
| **After payment** | Book a courier pickup or find a drop-off point from the shipment page, cancel a pickup (where the carrier allows it), download the label, and follow the packing instructions |
| **Track** | Track any shipment from a public page without logging in (personal details are hidden), track by link, and see the full timeline when signed in |
| **Manage** | Use a dashboard with stats and recent shipments, a shipments list and details, and invoices (list, detail and receipt) |
| **Other** | Use the bilingual EN/PL landing page, send a freight-partnership enquiry, and read the About, Contact and legal pages |

### What a customer CANNOT do yet

| Missing capability | Plan source | Notes |
|---|---|---|
| Ask MLS to collect a DHL export and pay the collection fee | DHL activation PRD | Server ready; customer screens not built |
| Ship with DHL at all | GTM plan, Phase 2 | Server built; not yet switched on for customers |
| Get a suggested customs (HS) code from a description | HS Code Finder PRD | Server ready; customer screen not built |
| Book and pay as a guest, then claim the shipment into an account later | Original plan §1 | Quotes work without an account, but booking needs one |
| Cancel a whole shipment, rebook, request a return, or open a claim | Original plan §2 | Only cancelling a pickup exists |
| Get SMS updates on shipment events | Original plan §2 | SMS is used for phone verification only; event alerts by SMS are not confirmed |
| Sign out of every device, and get a clear message when signed out | Server v7 | **In progress**: written, uncommitted |

### Dropped or changed from the plan (customer side)

- **Address verification at sign-up and before shipping:** removed. Addresses are now taken per shipment.
- **Forced browser location prompt:** removed (v1.47.1).
- **The customer choosing a carrier by name:** replaced by price tiers. Carrier names are hidden on purpose.
- **Asking "business or individual?" on every shipment:** replaced by the account type chosen at sign-up.

---

## Part 2 — Admins (MLS staff)

### What an admin CAN do

| Area | Capability |
|---|---|
| **Sign-in & security** | Staff log in with a password. The Super Admin logs in with an email code, an authenticator app or backup codes, and can manage their authenticator and sessions. Each admin has one active session, which ends after an hour of inactivity |
| **Staff & roles** | Create staff, assign roles, and control exactly what each role can see and do |
| **Users** | Search and filter users; view their shipments and quotes; flag, warn, ban, un-ban or restore them; verify them manually; review address requests |
| **Shipments** | List and filter shipments, view details, override a status, mark as paid (for bank transfers), create a shipment on a customer's behalf, and bulk delete |
| **Hub & routing** | Turn sorting-centre routing on or off, let it compete on best price, and add, edit or remove sorting centres |
| **Multi-leg operations** | See parcels heading to the hub, confirm their arrival, and create the second leg (with re-pricing if needed) |
| **Carriers** | Add and edit carriers, set commissions and thresholds per carrier and globally, and watch carrier health |
| **Marketing** | View every quote ever generated as a lead, filtered for follow-up |
| **Profile** | View their own details, change their password (staff), see their own activity, read the built-in docs |

### What an admin CANNOT do yet

| Missing capability | Plan source | Server ready? |
|---|---|---|
| Run DHL collections: the queue, the steps, waiving fees, DHL settings | DHL activation PRD | Yes |
| View and send invoices; issue refunds | Original plan (Finance) and admin spec | Invoices yes; refunds to be confirmed |
| See the full activity log of all staff | Admin spec §3.2 | Yes |
| Edit email templates | Admin forward plan | Yes |
| Change system settings | Admin forward plan | Yes |
| Read and answer partner enquiries from the landing page | Admin forward plan | Yes |
| Manage tax rules | Admin forward plan | Yes |
| Mark a shipment completed in one click; see one shipment's own history | 2026-08 audit | Yes |
| Toggle Developer Mode | Admin workflow §2 | Yes (no screen) |
| Send the customer a payment link for a shipment created on their behalf | Admin workflow §4 | Not confirmed |
| Finance views: carrier payables, commission earned, daily profit and loss, CSV export for accounting | Original plan (Finance) | No |
| Support console: search by phone or email, reply templates, escalations, claims | Original plan (Support) | No |
| Schedule pickups for local drivers, print pickup manifests, buy or reprint labels | Original plan (Operations) | No |
| Test carrier API keys from the dashboard | Original plan (Partners) | No |
| Bulk CSV import of shipments; bulk status updates | Admin spec §4.4 | No |
| Save carrier settings in one step (today it is three separate saves that can end half-done) | 2026-08 audit | No |

### Dropped or changed from the plan (admin side)

- **Daily automatic Super Admin password rotation:** removed and replaced with a stronger sign-in (email code, authenticator app, backup codes). This also delivers the planned multi-factor login for the Super Admin.
- **Clerk for logins:** not used; MLS has its own sign-in.

### Long-term vision (in the admin spec, not part of the current plan)

AI delay alerts and route reliability scores, demand forecasting, carbon footprint tracking, cost-to-serve analysis, blockchain audit logs, digital proof of delivery, and live chat with customers.

---

## Part 3 — Behind the scenes (server)

**Can:**

- Price shipments with tiers, hub routing and multi-leg journeys.
- Run FedEx end to end.
- Take payments through Stripe and PayU, with automatic failover.
- Calculate Polish VAT and issue invoices through Faktura.pl.
- Send email through Brevo (with an SMTP fallback) and SMS through Twilio.
- Run hardened security (v7).
- Run the HS code finder (built, not yet released).
- Run the DHL integration (phases 0–4 built on a branch, not merged).

**Cannot yet:**

- InPost as a third carrier.
- DHL phase 5 (nightly DHL data cache, customer drop-off for exports) and phase 6 (DHL docs and contract).
- Automatic hub arrival scanning (needs hardware).

**Known problems:**

- PayU payments sometimes hang in production; the cause is still open.
- Links in 7 customer emails are broken because the site address is filled in as blank.
- It is unconfirmed that the server blocks every admin action by permission. This is a possible security hole and needs an audit.
- 54 admin routes are missing from the API spec.

---

## Part 4 — In progress right now

| Where | What | State |
|---|---|---|
| Customer site | Session security: automatic token refresh, a clear "you were signed out because…" message, sign out of all devices, and a session card on the Account page | Written, uncommitted |
| Admin | v1.7.1: the Super Admin email code is tied to the server's `challengeId` | Uncommitted |
| Server | DHL phases 0–4 | Done on a branch; waiting for the owner to check the carrier rows, then switch DHL on |
| Server | PayU production hang | Partial fixes on the DHL branch, not deployed; root cause open |

**Waiting on others:** the DHL account holder (PRD §10 items 1, 3, 5, 7, 8 and 9), accounting (input VAT, and how the collection fee appears on the invoice), and operations (a hub contact person).

---

## Part 5 — What it takes to call the product complete

**Must have**

1. Finish and commit the in-progress work in all three repos.
2. Fix the PayU hang and deploy.
3. Merge the DHL branch and switch DHL on.
4. Build the DHL collection screens: the customer side (request collection, pay the fee) and the admin side (collections queue, waivers, DHL settings).
5. Audit the server's admin permission checks.
6. Fix the broken email links and release server 7.1.0.

**Should have**

7. Admin: invoices, refunds, activity log, email templates, settings, enquiries.
8. Customer: HS code suggestions; cancelling a shipment, or at least requesting it.
9. Quality: clean up lint on the customer site (113 problems; typecheck passes), add tests and CI to the customer site and admin, and make the carrier save a single step.

**Later**

- Finance and support consoles, guest booking, claims and returns, bulk import, InPost.
- The long-term vision items above.

**Start here:** test and commit the customer-site session work, commit admin 1.7.1, then fix PayU and activate DHL.
