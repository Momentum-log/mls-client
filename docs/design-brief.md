# Design Brief: Momentum Logistics Service website

Prepared: 2 November 2026
Purpose: input for the design system and full redesign of the customer website (`mls-client`).

This brief describes what the website is, who it serves, and everything it does. It deliberately says nothing about visual style or how pages are laid out; those are the designer's decisions. Where the client has stated a priority (what matters most to visitors), it is recorded as a requirement, not as a layout.

It draws on every version of the site: the original homepage (later hidden at `/legacy-home`), the freight-partnership landing page that replaced it (August 2026), the About, Contact, quote and tracking pages, the signed-in customer app, and the client meeting of 21 October 2026.

---

## 1. The business

**Momentum Logistics Service (MLS)** is a logistics company headquartered in Łódź, Poland (ul. kpt. pilota Żwirki 17, 90-539 Łódź). Its parent company is Applespeed, which the client uses as a benchmark.

What Momentum does, in the client's own order of importance:

1. **Parcels and express courier.** Domestic and international parcel shipping from Poland, sold online with instant quotes, online payment and tracking. This is the core product and must be what a first-time visitor understands Momentum to be.
2. **Freight.** Road freight (full truck load and less-than-truck-load), sea freight (container/port loads, groupage/consolidated shipments), air freight, heavy equipment, door-to-door freight management. Freight is quoted by a person, not online.
3. **Heavy shipments.** Anything 70 kg or more per package cannot be booked online; it is handed to the freight team.

Key facts used across the site:

- Reach: 150+ countries.
- Courier partners: **DPD, FedEx, DHL**. Customers book with Momentum and pay Momentum; the system picks the carrier.
- One office today. More offices (drop-off points) may open; the system already supports adding them.
- Contact: email `info@momentumlogservices.com`; phone and WhatsApp `+48 579 306 288` (the client's WhatsApp, which replaces the older `+48 795 069 276`). Social: X (@momentumlogserv), Instagram (@momentumlogservices), LinkedIn (momentum-logistics-services).

## 2. Who the website serves

| Audience | What they come to do |
| --- | --- |
| **Returning customers** | Track a parcel. The client considers this the first thing a returning visitor wants. |
| **New individual senders** | Find out what shipping a parcel costs, then book and pay without talking to anyone. |
| **Small businesses and e-commerce brands** | Ship regularly under a business account, with company name and tax number on their documents and customs declarations. Some are registered in Poland, some elsewhere in the EU and beyond. |
| **Freight and B2B partners** | Ask for a tailored freight quote (road, sea, air) and start an ongoing partnership with a named contact. |
| **Polish-speaking visitors** | Read the company and freight content in Polish (EN and PL are offered today). |

## 3. Brand story and messaging themes

These are the ideas the existing pages communicate. The designer decides where and how they appear.

- **Positioning line:** "Your trusted logistics partner" (the client prefers "Your trusted global logistics partner" over "partner for global freight").
- **Logistics for everyone:** shipping made as easy as sending an email; speed, transparency and reliability as standard.
- **Mission:** empower businesses of all sizes with seamless, reliable, innovative logistics, removing friction from global trade.
- **Vision:** a world where distance is no barrier to opportunity; goods moving freely, efficiently and sustainably across borders.
- **Core values:** Trust first (transparency, keeping promises); Innovation (challenging the status quo, using technology); Partnership (lasting relationships, not just moving boxes); Global mindset (think big, act locally).
- **The old way vs. the Momentum way:** traditional logistics has hidden fees and missed deadlines; Momentum has instant transparent pricing, live tracking and one platform.
- **Value propositions:**
  - Instant, accurate quotes in seconds, no hidden fees, know the cost before committing.
  - Live, unbroken tracking from pickup to delivery, with proactive status updates.
  - Simplified logistics: one platform and one dashboard for local, national and international shipping.
  - Experienced logistics people paired with modern tracking technology; a named contact on every business account.
- **How it works (three steps):** get started and get a quote; create and confirm the shipment; track from pickup to delivery.
- **Company video:** a short film of the company, fleet and freight handling (`public/videos/`, 6.4 MB, loads only on play).

### Sustainability and ESG

A full theme on the current site, to be carried into the redesign:

- Headline idea: greener logistics, by design. Meeting eco regulations is the baseline; Momentum builds sustainability into how it moves freight, so working with Momentum supports the customer's own ESG goals.
- Four commitments:
  1. **Carbon footprint reduction** through route optimisation and energy-efficient technology.
  2. **Green energy adoption** across fleet and facilities, increasing year on year.
  3. **Eco-friendly operations:** sustainable packaging, waste reduction, recycling.
  4. **Sustainable partnerships** with suppliers and carriers that share the commitment.
- Ambition: a **net-zero fleet**, with measurable yearly targets.

### Proof points available

- 150+ countries served.
- Courier partner logos (DPD, FedEx, DHL). FedEx and DHL logo files exist; an official DPD logo is still needed.
- Google Maps reviews of the Momentum listing. The client wants these on the site; no reviews are imported yet, and the listing's share link is still needed.
- Claims on older pages that need the client to confirm before reuse: "Trusted by 500+ companies", "on-time delivery" percentage, "instant quote turnaround".

## 4. What the website does: public (no account needed)

### 4.1 Track a shipment
- Enter a tracking number (format `MLS-…`) and see status and a timeline of events. Works without signing in, and as a direct link `/track-shipment/<number>` that can be shared.
- Signed-in customers are taken to the full shipment page in their account instead; a `?view=public` link forces the public view.
- Unpaid shipments show as "awaiting payment" rather than an error.
- Statuses come from a fixed list of 15: created (unpaid), paid, awaiting fulfilment, pickup scheduled, awaiting drop-off, awaiting hub confirmation, awaiting collection, at hub, in transit, delivered, completed, cancelled, failed, payment failed, creation failed. Customers see friendly labels for these. Momentum's status is the source of truth; the carrier's own wording is shown separately.

### 4.2 Get an instant shipping quote
- Visitor enters pick-up and delivery addresses (with Google Places address suggestions; street, city, postcode, state and country), pick-up contact email and phone, and one or more packages.
- Packages: weight and dimensions, metric or imperial for the whole shipment, quick-select size presets, add and remove packages, stackable or not.
- Result: up to three price tiers, **Fastest, Balanced, Economy**, each with a price and delivery window, plus any warnings. The customer chooses price and speed; the system chooses the carrier.
- International shipments add a customs step (see 5.2).
- Prices show in **EUR or PLN**. Currency is detected from the visitor's country and can be switched.
- A package of **70 kg or more** stops the online flow and shows a "heavy shipment" message with ways to reach the freight team (WhatsApp, phone, email).
- Quote form can be pre-filled from a link (addresses passed in the URL), so a short address entry elsewhere can hand over to the full quote.
- Guests can quote; booking requires an account.

### 4.3 Request a freight quote / become a partner
- Form: full name, company name, email, phone, freight type (road, sea or air), description of the enquiry (routes, volumes, goods).
- Submits to Momentum (`POST /inquiries`); confirmation says a freight specialist replies within 24 hours.
- Presented as a three-step journey: tell us about your freight; get a tailored quote; start the partnership (named contact and onboarding).

### 4.4 Learn about Momentum
- Company story, mission, vision, values, sustainability, the video, partners, FAQ (see section 3).

### 4.5 Contact
- Headquarters address, phone, email, WhatsApp, office hours.
- A contact form (first name, last name, email, message). **It is not wired to anything today**; the redesign should either connect it or remove it.

### 4.6 FAQ
Current questions: how to track; how quotes are calculated; payment methods; insurance; scheduling a pickup. **Several current answers are inaccurate** and must be rewritten with the client before reuse: they mention PayPal, Amex, bank transfer, "Standard / Express / Overnight" services and same-day pickup, none of which the system offers. Accurate facts are in sections 4 to 6.

### 4.7 Language and region
- EN / PL toggle for the company and freight content. The quote, tracking and account screens are English only today.
- Country/region selector (Poland with PLN, or International with EUR), which sets currency.

### 4.8 Legal
Terms and Conditions, Privacy Policy, Cookie Policy.

## 5. What the website does: customer account

### 5.1 Account and sign-in
- Register as **Individual** or **Company** (a tab at the top of sign-up). Company accounts add company name and **NIP / Tax Number** (the label must read "NIP / Tax Number", since many companies are not Polish).
- The account type decides which customs declaration the customer files; it cannot be changed per shipment.
- Sign in, sign out, forgot password.
- Email verification and phone verification. An unverified account is asked to verify before booking.
- Account page: profile (name, phone, company details), change email, change password, session security (sign out other sessions).

### 5.2 Book a shipment
A multi-step flow:
1. **Addresses:** pick-up and delivery, with contact details. A gentle, non-blocking reminder asks the customer to double-check name, street, postcode and city.
2. **Packages:** as in the quote (multiple packages, presets, units). 70 kg+ goes to the heavy-shipment route.
3. **Customs** (international): one declaration line per package; description, weight and value; **HS code** with a "Suggest a code" helper that proposes a six-digit code and up to three alternatives (vague descriptions get tips instead). A link to the official HS code finder is offered for those who know it. Business accounts give their NIP / Tax Number; both types tick shipper declarations (not prohibited goods, not restricted goods, and others).
4. **Rate:** choose Fastest, Balanced or Economy.
5. **Review and pay:** summary of every package and the price; pay by card (**Stripe**) or **PayU** (default for Polish customers; PayU has currency rules for EUR).
6. **Payment confirmation:** the system confirms with the gateway, waits patiently if PayU is still processing (and tells the customer not to pay twice), then takes them to the shipment.

Quotes expire; if one does, the system re-quotes rather than booking an outdated price.

### 5.3 After payment: getting the parcel to the carrier
Options depend on what the carrier allows for that shipment:
- **Courier pickup:** choose a date the carrier actually offers, ready and close times, notes for the driver (60 characters). Missed-pickup warning if it lapses.
- **Drop-off:** find nearby drop-off centres with distance and opening hours (FedEx); for DPD, any DPD pickup point or parcel shop.
- **Momentum collection** (DHL eCommerce exports): Momentum collects; a collection fee may apply, paid by card or PayU.
- **Label:** download the shipping label (PDF, named `MLS-<tracking number>.pdf`), with step-by-step instructions: print, attach, hand over.

Business rule from the client: a carrier only appears when it can offer direct pickup to the customer. DHL is currently hidden where it would require the customer to bring the parcel to the single office. This is switchable per carrier in the admin system for when more offices open.

### 5.4 Manage shipments
- **Dashboard:** overview counts (active shipments and others) and recent activity.
- **My shipments:** list and detail pages with status, timeline, packages, fulfilment details and label.
- **Track** inside the account.
- **Duplicate** a past shipment to book a similar one.
- **Cancel:** unpaid shipments cancel at once; paid ones not yet handed over raise a cancellation request with an optional reason, which can be withdrawn; staff approve or reject (with a note).
- **Support from a shipment:** email and WhatsApp open pre-filled with the tracking number; a call option.
- **Update a shipment** before payment from its invoice.

### 5.5 Invoices
- List of invoices with status (paid, unpaid, expired and others) and search/filter.
- Invoice detail as a receipt (seller and buyer details including NIP / VAT ID), PDF download.
- Unpaid invoices show a countdown to expiry and can continue to payment.

### 5.6 Insurance
- Every package carries standard insurance by default (coverage up to €200,000).
- Planned: an "additional insurance" button for higher-value goods. The customer re-declares the item value; Momentum arranges cover with its insurer behind the scenes; a flat fee of about €30–€50 applies. **Not built yet**; the design should allow for it in booking.

## 6. Rules the design must respect

- **Placeholders never show sample personal data.** Name fields say "Full name" (or "First name" / "Last name"), never "John Doe", "Jan Kowalski" or similar. Email fields describe the field rather than showing a fake address.
- **Carrier names in service details** are shown as Momentum (MLS) branding; the customer buys a Momentum service. Partner logos may still appear as proof of the networks used.
- **Two currencies** (EUR, PLN) everywhere prices appear.
- **Two languages** (EN, PL) for marketing content at minimum.
- **Two account types** (Individual, Company) with different customs paths.
- **The 70 kg threshold** separates online parcels from freight enquiries.
- **Mobile first:** the client's main complaint about the current homepage is endless scrolling on a phone. Visitors must reach tracking and quoting immediately.
- Header and footer are shared by all public pages; the signed-in area has its own navigation (Dashboard, New Shipment, Track Shipment, My Shipments, Invoices, Account).

## 7. Client priorities from the 21 October meeting

Recorded as content priorities for the designer to interpret:

- The front door should promote **parcels and express courier**, not heavy freight. "70 kg and up" must not be the first impression.
- In order of importance on arrival: **track a package**, **get a quote** (pick-up and delivery address), **courier partners** (DPD, FedEx, DHL), **other services** (road, sea, air freight), **Google Maps reviews**. "That's enough for the homepage."
- Company story, vision, video and similar content belong on About Us. The client said the current homepage "looks more about us".
- Contact details belong on Contact Us, not the homepage.
- The quote page ("seamless shipping solution, get instant quotes") is closer to what the client wants as a front door than the current homepage.
- Keep it simple, relevant and organised. The parent company Applespeed is a reference for priorities, not something to copy.

## 8. Planned, not built (design for later, do not promise now)

- AI-assisted HS code selection that picks the right code automatically (today's helper only suggests).
- Direct link into the HS code portal landing on the exact product.
- A pricing engine in which margin adjusts to monthly shipment targets, with discounts after break-even (the client has this in a spreadsheet today).
- Additional insurance (5.6).
- More Momentum offices as drop-off points.

## 9. Open items for the client

1. Official DPD logo file.
2. Google Business listing link, and which reviews to show.
3. Confirmation or removal of numeric claims (500+ companies, on-time percentage).
4. Correct FAQ answers (payment methods, services, pickup options, insurance).
5. Whether the contact form should send messages, and to whom.
6. Whether the quote and account screens need Polish too.
