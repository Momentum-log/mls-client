/**
 * Bilingual copy for the marketing landing page.
 *
 * Ported from the standalone campaign bundle (`docs/new-landing-page/index.html`),
 * whose sections were originally driven by a `window.TRANSLATIONS` global.
 *
 * The original scattered additional copy through inline `lang === "pl" ? … : …`
 * ternaries and a `getCtaLabel()` helper duplicated across three components.
 * Those are folded in here as first-class keys (`heroMarker`, `instant`,
 * `ctaPrimary`, `videoHeading`, …) so the section components stay declarative
 * and every user-visible string lives in exactly one place.
 *
 * @module components/landing/translations
 */

/** Languages offered by the landing page toggle. */
export type Language = "en" | "pl";

/**
 * English copy. This object is the source of truth for the key set — the Polish
 * dictionary is type-checked against it, so adding a key here without a Polish
 * translation is a compile error rather than a runtime `undefined`.
 */
const en = {
  // ---------- Navigation / chrome ----------
  navPartners: "Partners",
  navSustainability: "Sustainability",
  mainSite: "Main site",

  // ---------- Hero ----------
  heroWhoWeAre: "Who we are",
  heroHeading: "Your trusted partner for",
  heroMarker: "global freight.",
  heroText:
    "From full truck loads to sea freight, we move shipments of 70 kg and up — door to door, across 150+ countries. Partner with Momentum and we handle the heavy lifting, so you don't have to.",
  ctaPrimary: "Get instant quotes",
  contactUs: "Contact us",
  countriesServed: "countries served",
  heavyFreightSpecialist: "heavy-freight specialist",
  quoteTurnaround: "quote turnaround",
  instant: "Instant",
  liveShipment: "Live shipment",
  inTransit: "In transit",
  etaDays: "26-tonne FTL · ETA 2 days",

  // ---------- Partners ----------
  partnersTitle: "Official carrier partners",
  partnersText: "We move your freight through the networks you already trust.",

  // ---------- Video ----------
  videoTitle: "Watch",
  videoHeading: "See Momentum in motion",
  videoText:
    "A short look at our company, our fleet, and how we handle freight from pickup to delivery.",

  // ---------- Company ----------
  aboutMomentum: "About Momentum",
  aboutHeading: "Logistics built around your business.",
  aboutText:
    "Momentum Logistics Service is a Łódź-based freight partner moving cargo across 150+ countries. We pair experienced logistics people with modern tracking technology to keep your shipments moving — and keep you informed every step of the way.",
  point1: "Heavy-freight specialists for shipments of 70 kg and up",
  point2: "One partner for road, sea and air — managed end to end",
  point3: "Real-time tracking and a named contact on every account",
  countriesServedLabel: "Countries served",
  heavyFreight: "Heavy freight",
  quoteTurnaroundLabel: "Quote turnaround",
  onTimeDelivery: "On-time delivery",
  globalFreightReach: "Global freight reach",
  ourSpecialty: "Our specialty",
  fastTransparent: "Fast, transparent pricing",
  acrossRoutes: "Across managed routes",

  // ---------- Sustainability ----------
  sustainabilityTitle: "Sustainability & ESG",
  sustainabilityHeading: "Greener logistics, by design.",
  sustainabilityText:
    "Meeting eco-friendly regulations is the baseline. We go further — building sustainability into how we move freight, so partnering with us supports your own ESG goals.",
  goal1Title: "Carbon footprint reduction",
  goal1Desc:
    "Advanced route optimization and energy-efficient technology to cut emissions across every shipment.",
  goal2Title: "Green energy adoption",
  goal2Desc:
    "Transitioning our fleet and facilities toward renewable energy, increasing green usage year on year.",
  goal3Title: "Eco-friendly operations",
  goal3Desc:
    "Sustainable packaging, waste reduction and recycling initiatives throughout the supply chain.",
  goal4Title: "Sustainable partnerships",
  goal4Desc:
    "Working with suppliers and carriers who share our commitment to ethical, low-impact logistics.",
  netZero: "Net-zero",
  netZeroSub: "fleet ambition, with measurable yearly targets",

  // ---------- Inquiry form ----------
  becomePartner: "Become a partner",
  moveFreight: "Let's move your freight.",
  formIntro:
    "Share a few details about your shipping needs and our team will get back to you with a tailored quote.",
  step1Title: "Tell us about your freight",
  step1Desc: "Routes, volumes and the type of goods you move.",
  step2Title: "Get a tailored quote",
  step2Desc: "Transparent pricing back to you instantly.",
  step3Title: "Start the partnership",
  step3Desc: "A named contact and onboarding for ongoing shipments.",
  fullName: "Full name *",
  companyName: "Company name *",
  emailAddress: "Email address *",
  phoneNumber: "Phone number *",
  freightType: "Freight type *",
  selectFreight: "Select freight type",
  roadFreight: "Road freight",
  seaFreight: "Sea freight",
  airFreight: "Air freight",
  freightRequired: "Please select a freight type.",
  description: "Description",
  placeholderDesc:
    "Tell us about your transport inquiry — routes, volumes, type of goods…",
  namePlaceholder: "Jan Kowalski",
  companyPlaceholder: "Acme Inc.",
  emailPlaceholder: "jan@acme.com",
  phonePlaceholder: "+1 555 000 0000",
  sending: "Sending…",
  privacyNotice: "We'll only use your details to respond to this enquiry.",
  thanks: "Thanks",
  requestSuccess:
    "Your request is in. A freight specialist will reach out within 24 hours with a tailored quote.",
  submitAnother: "Submit another request",
} as const;

/**
 * The full key set every language must provide.
 * Derived from {@link en} so the two dictionaries cannot drift apart.
 */
export type LandingCopy = Record<keyof typeof en, string>;

/** Polish copy, ported verbatim from the campaign bundle. */
const pl: LandingCopy = {
  // ---------- Navigation / chrome ----------
  navPartners: "Partnerzy",
  navSustainability: "Zrównoważony rozwój",
  mainSite: "Strona główna",

  // ---------- Hero ----------
  heroWhoWeAre: "Kim jesteśmy",
  heroHeading: "Twój zaufany partner w",
  heroMarker: "globalnym transporcie.",
  heroText:
    "Od ładunków całopojazdowych po transport morski, przewozimy przesyłki od 70 kg wzwyż – od drzwi do drzwi, w ponad 150 krajach. Zostaw nam ciężką pracę, abyś nie musiał się tym martwić.",
  ctaPrimary: "Uzyskaj natychmiastową wycenę",
  contactUs: "Kontakt",
  countriesServed: "obsługiwanych krajów",
  heavyFreightSpecialist: "specjalista od ciężkich ładunków",
  quoteTurnaround: "czas przygotowania wyceny",
  instant: "Natychmiast",
  liveShipment: "Aktywny transport",
  inTransit: "W drodze",
  etaDays: "26-tonowy FTL · ETA 2 dni",

  // ---------- Partners ----------
  partnersTitle: "Oficjalni partnerzy przewozowi",
  partnersText:
    "Przewozimy Twoje ładunki za pośrednictwem sieci, którym już ufasz.",

  // ---------- Video ----------
  videoTitle: "Oglądaj",
  videoHeading: "Zobacz Momentum w akcji",
  videoText:
    "Krótki rzut oka na naszą firmę, naszą flotę i sposób, w jak obsługujemy ładunki od odbioru do dostawy.",

  // ---------- Company ----------
  aboutMomentum: "O Momentum",
  aboutHeading: "Logistyka dostosowana do Twojego biznesu.",
  aboutText:
    "Momentum Logistics Service to partner spedycyjny z siedzibą w Łodzi, przewożący ładunki w ponad 150 krajach. Łączymy doświadczonych logistyków z nowoczesną technologią śledzenia, aby Twoje przesyłki były stale w ruchu – informując Cię na każdym kroku.",
  point1: "Specjaliści od ciężkich ładunków dla przesyłek od 70 kg wzwyż",
  point2:
    "Jeden partner dla transportu drogowego, morskiego i lotniczego – kompleksowa obsługa",
  point3:
    "Śledzenie w czasie rzeczywistym i dedykowany opiekun dla każdego konta",
  countriesServedLabel: "Obsługiwane kraje",
  heavyFreight: "Ciężki transport",
  quoteTurnaroundLabel: "Czas na wycenę",
  onTimeDelivery: "Terminowość dostaw",
  globalFreightReach: "Globalny zasięg",
  ourSpecialty: "Nasza specjalność",
  fastTransparent: "Szybka, przejrzysta wycena",
  acrossRoutes: "Na zarządzanych trasach",

  // ---------- Sustainability ----------
  sustainabilityTitle: "Zrównoważony rozwój i ESG",
  sustainabilityHeading: "Ekologiczna logistyka z założenia.",
  sustainabilityText:
    "Spełnianie norm ekologicznych to podstawa. Idziemy o krok dalej – wprowadzamy zrównoważony rozwój do transportu ładunków, dzięki czemu partnerstwo z nami wspiera Twoje własne cele ESG.",
  goal1Title: "Redukcja śladu węglowego",
  goal1Desc:
    "Zaawansowana optymalizacja tras i energooszczędna technologia w celu redukcji emisji w każdym transporcie.",
  goal2Title: "Wdrażanie zielonej energii",
  goal2Desc:
    "Przejście naszej floty i placówek na energię odnawialną, zwiększając udział zielonej energii z roku na rok.",
  goal3Title: "Ekologiczne operacje",
  goal3Desc:
    "Ekologiczne opakowania, redukcja odpadów i inicjatywy recyklingowe w całym łańcuchu dostaw.",
  goal4Title: "Zrównoważone partnerstwa",
  goal4Desc:
    "Współpraca z dostawcami i przewoźnikami podzielającymi nasze zaangażowanie w etyczną i niskomisyjną logistykę.",
  netZero: "Zero netto",
  netZeroSub: "ambicje dla floty, z mierzalnymi rocznymi celami",

  // ---------- Inquiry form ----------
  becomePartner: "Zostań partnerem",
  moveFreight: "Przetransportujmy Twój ładunek.",
  formIntro:
    "Podaj kilka szczegółów na temat swoich potrzeb transportowych, a nasz zespół skontaktuje się z Tobą z dopasowaną wyceną.",
  step1Title: "Opowiedz nam o swoim ładunku",
  step1Desc: "Trasy, wolumen i rodzaj przewożonych towarów.",
  step2Title: "Otrzymaj dopasowaną wycenę",
  step2Desc: "Przejrzysta wycena przesyłana natychmiast.",
  step3Title: "Rozpocznij współpracę",
  step3Desc: "Dedykowany opiekun i wdrożenie dla regularnych wysyłek.",
  fullName: "Imię i nazwisko *",
  companyName: "Nazwa firmy *",
  emailAddress: "Adres e-mail *",
  phoneNumber: "Numer telefonu *",
  freightType: "Rodzaj transportu *",
  selectFreight: "Wybierz rodzaj transportu",
  roadFreight: "Transport drogowy",
  seaFreight: "Transport morski",
  airFreight: "Transport lotniczy",
  freightRequired: "Wybierz rodzaj transportu.",
  description: "Opis",
  placeholderDesc:
    "Opisz swoje zapytanie transportowe — trasy, wolumen, rodzaj towaru…",
  namePlaceholder: "Jan Kowalski",
  companyPlaceholder: "Acme Sp. z o.o.",
  emailPlaceholder: "jan@acme.com",
  phonePlaceholder: "+48 600 000 000",
  sending: "Wysyłanie…",
  privacyNotice:
    "Użyjemy Twoich danych wyłącznie w celu odpowiedzi na to zapytanie.",
  thanks: "Dziękujemy",
  requestSuccess:
    "Twoje zgłoszenie zostało wysłane. Specjalista ds. spedycji skontaktuje się z Tobą w ciągu 24 godzin z dopasowaną wyceną.",
  submitAnother: "Wyślij kolejne zapytanie",
};

/** Every landing-page string, keyed by language. */
export const LANDING_COPY: Record<Language, LandingCopy> = { en, pl };
