export const POLAND_CITIES = [
  {
    id: "pl-waw",
    name: "Warsaw",
    zip: "00-001",
    state: "Mazovia",
    country: "PL",
    street: "Marszałkowska 1",
  },
  {
    id: "pl-krk",
    name: "Kraków",
    zip: "30-001",
    state: "Lesser Poland",
    country: "PL",
    street: "Rynek Główny 1",
  },
  {
    id: "pl-gdn",
    name: "Gdańsk",
    zip: "80-001",
    state: "Pomerania",
    country: "PL",
    street: "Długa 1",
  },
  {
    id: "pl-wro",
    name: "Wrocław",
    zip: "50-001",
    state: "Lower Silesia",
    country: "PL",
    street: "Rynek 1",
  },
  {
    id: "pl-poz",
    name: "Poznań",
    zip: "60-001",
    state: "Greater Poland",
    country: "PL",
    street: "Stary Rynek 1",
  },
  {
    id: "pl-lod",
    name: "Łódź",
    zip: "90-001",
    state: "Łódź Voivodeship",
    country: "PL",
    street: "Piotrkowska 1",
  },
  {
    id: "pl-szc",
    name: "Szczecin",
    zip: "70-001",
    state: "West Pomerania",
    country: "PL",
    street: "Wały Chrobrego 1",
  },
];

export const SUPPORTED_COUNTRIES = [
  {
    id: "UK",
    name: "United Kingdom",
    zip: "SW1A 1AA",
    country: "UK", // United Kingdom (GB is iso, but API might use UK or GB? FedEx usually wants GB... sticking to current if it worked for Import)
    capital: "London",
    state: "", // UK doesn't use state codes for FedEx usually, or just "EN"
    street: "Downing Street 10",
  },
  {
    id: "US",
    name: "United States",
    zip: "10001",
    country: "US",
    capital: "New York",
    state: "NY", // Valid State Code
    street: "5th Avenue",
  },
  {
    id: "CN",
    name: "China",
    zip: "100000",
    country: "CN",
    capital: "Beijing",
    state: "",
    street: "Wangfujing St",
  },
  {
    id: "NG",
    name: "Nigeria",
    zip: "100001",
    country: "NG",
    capital: "Lagos",
    state: "LA", // Lagos
    street: "Broad Street",
  },
  {
    id: "DE",
    name: "Germany",
    zip: "10115",
    country: "DE",
    capital: "Berlin",
    state: "",
    street: "Unter den Linden",
  },
];

export const SHIPPING_MODES = [
  { id: "local", label: "Local (Poland)", icon: "🇵🇱" },
  { id: "import", label: "Import to Poland", icon: "🛬" },
  { id: "export", label: "Export from Poland", icon: "🛫" },
] as const;

export type ShippingMode = (typeof SHIPPING_MODES)[number]["id"];
