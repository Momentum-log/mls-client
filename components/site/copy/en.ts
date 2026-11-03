/**
 * English copy for the marketing site (header, footer and the localized pages).
 *
 * This object is the source of truth for the key set: the Polish dictionary is
 * typed against it, so a key added here without a translation fails to compile.
 *
 * @module components/site/copy/en
 */

const en = {
  meta: {
    home: {
      title: "Momentum Logistics - Ship parcels and freight from Poland",
      description:
        "Instant prices to 150+ countries through the DPD, FedEx and DHL networks. Book, pay and track online. Road, sea and air freight quoted within 24 hours.",
    },
    ship: {
      title: "Ship a parcel - Momentum Logistics",
      description:
        "Domestic and international parcel shipping from Poland. Compare Fastest, Balanced and Economy prices, pay online and hand your parcel over your way.",
    },
    freight: {
      title: "Freight - Momentum Logistics",
      description:
        "Road, sea and air freight across Europe and beyond, quoted by a specialist within 24 hours.",
    },
    sustainability: {
      title: "Sustainability - Momentum Logistics",
      description:
        "Greener logistics, by design: route optimisation, green energy, eco-friendly operations and partners who share the goal.",
    },
    about: {
      title: "About us and FAQ - Momentum Logistics",
      description:
        "Momentum Logistics is a logistics company in Łódź, Poland, shipping parcels and freight to 150+ countries.",
    },
    contact: {
      title: "Contact - Momentum Logistics",
      description:
        "WhatsApp, phone or email the Momentum Logistics team in Łódź.",
    },
  },

  nav: {
    home: "Momentum Logistics home",
    services: "Services",
    about: "About us",
    faq: "FAQ",
    contact: "Contact",
    signIn: "Sign in",
    account: "Account",
    quote: "Get a quote",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    language: "Language",
    region: "Region and currency",
    regionButton: "Language and region",
    regionHint:
      "Language changes the address: momentumlogservices.com/en or /pl. Region sets the currency your prices show in.",
    save: "Save preferences",
    poland: "Poland",
    polandNote: "Prices in złoty, pay with PayU or card",
    international: "International",
    internationalNote: "Prices in euro",
    heavy: "Sending 70 kg or more?",
    heavyLink: "Talk to our freight team",
    serviceItems: [
      {
        id: "ship",
        title: "Ship a parcel",
        blurb: "Instant prices to 150+ countries, book and pay online",
        cta: "Ship a parcel",
        detail:
          "Documents, parcels, online orders and luggage. Pick Fastest, Balanced or Economy.",
      },
      {
        id: "track",
        title: "Track a parcel",
        blurb: "Live status from pickup to delivery",
        cta: "Track a parcel",
        detail:
          "One MLS tracking number, plain-language updates, a link you can share.",
      },
      {
        id: "freight",
        title: "Freight",
        blurb: "Road, sea and air freight, quoted by a specialist",
        cta: "Request a freight quote",
        detail:
          "FTL and LTL, containers and groupage, air cargo, heavy equipment. Reply within 24 hours.",
      },
      {
        id: "sustainability",
        title: "Sustainability",
        blurb: "Greener logistics, by design",
        cta: "Our commitments",
        detail:
          "Route optimisation, cleaner energy and less packaging waste, towards a lower-emission fleet.",
      },
    ],
  },

  footer: {
    tagline:
      "Your trusted global logistics partner. Parcels and freight from Łódź to 150+ countries.",
    shipTitle: "Ship",
    quote: "Get an instant quote",
    track: "Track a parcel",
    business: "Business accounts",
    signIn: "Sign in",
    freightTitle: "Freight",
    road: "Road freight",
    sea: "Sea freight",
    air: "Air freight",
    freightQuote: "Request a freight quote",
    companyTitle: "Company",
    about: "About Momentum",
    sustainability: "Sustainability",
    faq: "FAQ",
    contact: "Contact us",
    talkTitle: "Talk to us",
    whatsapp: "WhatsApp us",
    copyright: "Momentum Logistics Services Sp. z o.o.",
    legalIds: "KRS 0001197173 · NIP 7272893300 · REGON 542847107",
    terms: "Terms and Conditions",
    privacy: "Privacy Policy",
    cookies: "Cookie Policy",
  },

  home: {
    eyebrow: "Parcels, express and freight from Poland",
    title: "Ship globally,",
    marker: "in minutes.",
    intro:
      "Instant prices to 150+ countries through the DPD, FedEx and DHL networks. Book, pay and track online, with no calls and no hidden fees.",
    ctaQuote: "Get an instant quote",
    ctaFreight: "Freight enquiry",
    heroImageAlt: "A Momentum truck on the road",
    countries: "countries served",
    panel: {
      tabsLabel: "Quote or track",
      tabQuote: "Get a quote",
      tabTrack: "Track a parcel",
      currency: "Currency",
      pickup: "Pick up from",
      dropoff: "Drop off to",
      addressPlaceholder: "Start typing a street address",
      seePrices: "See prices",
      pickAddresses: "Choose both addresses from the suggestions.",
      email: "Email",
      emailPlaceholder: "Your email address",
      phone: "Phone",
      phoneRequired: "Enter your phone number so we can send the quote.",
      quickSizes: "Package size",
      heavy: "Over 70 kg?",
      heavyLink: "Ask our freight team",
      presets: {
        envelope: "Envelope",
        small: "Small box",
        medium: "Medium box",
        large: "Large box",
      },
      trackingLabel: "Tracking number",
      trackingPlaceholder: "Tracking number",
      track: "Track parcel",
      trackHint:
        "No account needed. Signed in? You will go straight to the full shipment page.",
    },
    partnersTitle: "Delivered through the networks you already trust",
    freightEyebrow: "Freight and heavy shipments",
    freightTitle: "Bigger loads get a person, not a form",
    freightText:
      "Road, sea and air freight, and anything over 70 kg. A freight specialist replies within 24 hours with a tailored quote.",
    freightCta: "Request a freight quote",
    freightCards: [
      { title: "Road freight", text: "Full and part truck loads across Europe." },
      { title: "Sea freight", text: "Full containers and shared groupage loads." },
      {
        title: "Air freight",
        text: "For urgent and time-critical cargo, worldwide.",
      },
    ],
    howEyebrow: "How it works",
    howTitle: "From quote to doorstep in three steps",
    howSteps: [
      {
        title: "Get a quote",
        text: "Enter addresses and package sizes. Fastest, Balanced and Economy prices appear in seconds.",
      },
      {
        title: "Book and hand over",
        text: "Pay by card or PayU, then choose a courier pickup, a drop-off point or a label to print.",
      },
      {
        title: "Track to the door",
        text: "One MLS tracking number with clear updates from pickup to delivery.",
      },
    ],
    factsLabel: "Momentum at a glance",
    facts: [
      { value: "150+", label: "countries we deliver to" },
      { value: "3", label: "courier networks: DPD, FedEx, DHL" },
      { value: "24 h", label: "freight quote reply" },
      { value: "2", label: "prices in PLN or EUR" },
    ],
    greenEyebrow: "Sustainability",
    greenTitle: "Greener logistics, by design",
    greenText:
      "Regulations are our baseline. We build sustainability into routes, fleet and partners, working towards a lower-emission fleet, so shipping with us supports your own ESG goals.",
    greenImageAlt: "Momentum sustainability: cleaner logistics",
    greenPoints: [
      "Smarter routes, lower emissions",
      "More green energy every year",
      "Less packaging waste",
      "Partners who share the goal",
    ],
    greenCta: "Our commitments",
    ctaTitle: "Ready to ship? See your price in seconds.",
    ctaText: "No account needed to compare. Freight? We reply within 24 hours.",
    ctaContact: "Talk to us",
  },

  ship: {
    home: "Home",
    services: "Services",
    eyebrow: "Parcels and express courier",
    title: "Sending a parcel abroad, as easy as",
    marker: "sending an email.",
    intro:
      "Domestic and international shipping from Poland. Compare prices instantly, pay online, and hand your parcel over the way that suits you.",
    ctaQuote: "Get an instant quote",
    ctaTrack: "Track a parcel",
    tiersEyebrow: "You choose price and speed",
    tiersTitle: "Three options on every route",
    tiersText:
      "We compare our courier networks and show you up to three prices. You pick; we book the carrier behind it.",
    tiers: [
      {
        badge: "Fastest",
        title: "When it has to be there",
        text: "The quickest delivery window available on your route.",
      },
      {
        badge: "Balanced",
        title: "Good speed, fair price",
        text: "The sensible middle for most parcels and orders.",
      },
      {
        badge: "Economy",
        title: "Lowest price",
        text: "For when a few extra days don’t matter.",
      },
    ],
    handEyebrow: "After you pay",
    handTitle: "Hand it over your way",
    handText: "The options depend on what the carrier offers for your shipment.",
    hand: [
      {
        title: "Courier pickup",
        text: "Choose a date the carrier offers, set ready and close times, and leave a short note for the driver.",
      },
      {
        title: "Drop-off point",
        text: "Find nearby drop-off centres with distance and opening hours, or any partner parcel shop.",
      },
      {
        title: "Print your label",
        text: "Download the PDF label with simple steps: print it, attach it, hand it over.",
      },
    ],
    bizEyebrow: "For businesses and e-commerce",
    bizTitle: "Ship every week? Open a company account",
    bizPoints: [
      "Company name and NIP / Tax Number on invoices and customs forms",
      "Duplicate past shipments in one click",
      "A named contact at Momentum",
    ],
    bizCta: "Create a company account",
    insuredTitle: "Insured as standard",
    insuredText: "Every package carries standard insurance by default.",
    customsTitle: "Customs, guided",
    customsText:
      "For international parcels we help you describe each item and suggest an HS code.",
    heavyTitle: "Over 70 kg?",
    heavyText: "Heavy packages go to our",
    heavyLink: "freight team",
    heavyTextEnd: "for a personal quote.",
  },

  freight: {
    eyebrow: "Freight and B2B partnerships",
    title: "Freight, quoted by people who move it",
    marker: "every day.",
    intro:
      "Road, sea and air freight across Europe and beyond, with a named contact from your first enquiry. Tell us what you move and a specialist replies within 24 hours.",
    heroImageAlt: "A Momentum freight truck on the road",
    cta: "Request a freight quote",
    whatsapp: "WhatsApp the freight team",
    modesTitle: "How we can move it",
    modes: [
      {
        title: "Road freight",
        text: "Full truck loads (FTL) and less-than-truck-load (LTL) across Poland and Europe.",
      },
      {
        title: "Sea freight",
        text: "Full containers and port loads, or groupage when you share a container.",
      },
      {
        title: "Air freight",
        text: "For urgent, high-value or time-critical cargo, worldwide.",
      },
      {
        title: "Heavy and door-to-door",
        text: "Machinery, pallets and anything 70 kg or more per package, managed end to end.",
      },
    ],
    stepsTitle: "From enquiry to partnership in three steps",
    steps: [
      {
        title: "Tell us about your freight",
        text: "Routes, volumes and what you are moving. Two minutes.",
      },
      {
        title: "Get a tailored quote",
        text: "A freight specialist replies within 24 hours.",
      },
      {
        title: "Start the partnership",
        text: "A named contact and onboarding for ongoing shipments.",
      },
    ],
    form: {
      eyebrow: "Freight enquiry",
      title: "Tell us what needs to move",
      text: "The more detail you give about routes, volumes and goods, the faster the quote.",
      fullName: "Full name",
      companyName: "Company name",
      email: "Email",
      emailPlaceholder: "Work email address",
      phone: "Phone",
      phonePlaceholder: "Phone with country code",
      freightType: "Freight type",
      road: "Road",
      sea: "Sea",
      air: "Air",
      description: "Your enquiry",
      descriptionPlaceholder: "Routes, volumes, type of goods, timing",
      replyNote: "A freight specialist replies within 24 hours.",
      send: "Send enquiry",
      sending: "Sending...",
      thanks: "Thank you",
      success:
        "Your enquiry is with our freight team. A specialist will reply within 24 hours.",
      another: "Send another enquiry",
    },
  },

  sustainability: {
    eyebrow: "Sustainability and ESG",
    title: "Greener logistics,",
    marker: "by design.",
    intro:
      "Meeting eco regulations is our baseline, not our goal. We build sustainability into how we plan routes, run our fleet and choose our partners, so every shipment with Momentum also supports your own ESG reporting.",
    ambitionEyebrow: "Our ambition",
    ambitionTitle: "Working towards a lower-emission fleet",
    ambitionText:
      "We are taking practical steps to cut emissions, from smarter routes that reduce empty kilometres to choosing efficient vehicles and partners who share our goals. As our fleet grows, we will set clear targets and share our progress.",
    imageAlt: "Momentum sustainability: cleaner logistics",
    commitmentsTitle: "Four commitments",
    commitments: [
      {
        title: "Carbon footprint reduction",
        text: "Route optimisation and energy-efficient technology mean fewer empty kilometres and less fuel per parcel.",
      },
      {
        title: "Green energy adoption",
        text: "A growing share of clean energy across our fleet and facilities, increasing year on year.",
      },
      {
        title: "Eco-friendly operations",
        text: "Sustainable packaging, less waste and recycling built into daily operations.",
      },
      {
        title: "Sustainable partnerships",
        text: "We work with suppliers and carriers who share the commitment and can show it.",
      },
    ],
    esgTitle: "Reporting on your own ESG goals?",
    esgText:
      "Business and freight partners can ask our team how Momentum supports their sustainability reporting.",
    esgCta: "Talk to our team",
  },

  about: {
    eyebrow: "About Momentum",
    title: "Your trusted global logistics",
    marker: "partner.",
    intro:
      "We are a logistics company based in Łódź, Poland, helping people and businesses of every size ship parcels and freight to 150+ countries, with speed, transparency and reliability as standard.",
    storyEyebrow: "Our story",
    storyTitle: "Logistics for everyone, from Łódź outwards",
    story: [
      "Shipping used to mean hidden fees, phone calls and a different portal for every carrier. We built Momentum so anyone, from a student sending a suitcase home to a growing online shop, can see the price, book it and follow it in one place.",
      "Behind the platform are experienced logistics people. Every business account gets a named contact, and our freight team quotes the bigger loads personally.",
    ],
    filmLabel: "Company film: our fleet and freight handling",
    filmPlay: "Play the company film",
    filmPause: "Pause",
    filmMute: "Mute",
    filmUnmute: "Unmute",
    filmFullscreen: "Full screen",
    filmSeek: "Seek",
    whyTitle: "Why we exist",
    missionLabel: "Mission",
    mission:
      "To be Europe's most trusted integrated logistics partner, taking the friction out of global trade.",
    visionLabel: "Vision",
    vision:
      "A world where distance is no barrier to opportunity, and goods move freely, efficiently and sustainably across borders.",
    oldTitle: "The old way",
    oldPoints: [
      "Hidden fees that appear after you book",
      "Missed deadlines and silence",
      "A different portal for every carrier",
    ],
    newTitle: "The Momentum way",
    newPoints: [
      "Instant, transparent prices before you commit",
      "Live tracking with proactive updates",
      "One platform for local, national and international",
    ],
    valuesEyebrow: "Our values",
    valuesTitle: "What we stand for",
    values: [
      { title: "Trust first", text: "Transparent pricing and promises we keep." },
      {
        title: "Innovation",
        text: "Technology that removes steps, not adds them.",
      },
      {
        title: "Partnership",
        text: "Lasting relationships, not just moving boxes.",
      },
      { title: "Reliability", text: "Think big, act locally." },
    ],
    faqEyebrow: "FAQ",
    faqTitle: "Frequently asked questions",
    faqText: "Still have a question? WhatsApp us on +48 579 306 288.",
    faqCta: "Contact us",
    faqs: [
      {
        q: "How do I track my parcel?",
        a: "Enter your MLS- tracking number on the Track page, or open the shared tracking link. Signed-in customers see full details in their account.",
      },
      {
        q: "How are prices calculated?",
        a: "From your addresses and each package’s weight and size. You see up to three options, Fastest, Balanced and Economy, each with its price and delivery window before you commit.",
      },
      {
        q: "How can I pay?",
        a: "By card, or with PayU, which is the default for customers in Poland. Prices show in PLN or EUR.",
      },
      {
        q: "Is my shipment insured?",
        a: "Every package carries standard insurance by default.",
      },
      {
        q: "How does my parcel get to the courier?",
        a: "Depending on the route: book a courier pickup on a date the carrier offers, drop it at a nearby point, or print your label and hand it over.",
      },
    ],
  },

  contact: {
    eyebrow: "Contact us",
    title: "Talk to a real",
    marker: "person",
    titleEnd: "in Łódź",
    intro:
      "WhatsApp is the fastest way to reach us. For a parcel, have your MLS- tracking number ready.",
    whatsapp: "WhatsApp",
    phone: "Phone",
    email: "Email",
    hqTitle: "Headquarters",
    formTitle: "Send us a message",
    firstName: "First name",
    lastName: "Last name",
    emailPlaceholder: "Your email address",
    message: "Message",
    messagePlaceholder:
      "How can we help? Include a tracking number if you have one.",
    replyNote: "We reply by email, usually within one business day.",
    send: "Send message",
    formDisabled:
      "Online messages are not open yet. Please WhatsApp, call or email us for now.",
    directions: "Get directions",
  },
};

export type SiteCopy = typeof en;

export default en;
