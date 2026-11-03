/**
 * Polish copy for the marketing site. Typed against the English dictionary.
 *
 * @module components/site/copy/pl
 */

import type { SiteCopy } from "./en";

const pl: SiteCopy = {
  meta: {
    home: {
      title: "Momentum Logistics - Paczki i fracht z Polski",
      description:
        "Natychmiastowe ceny do ponad 150 krajów w sieciach DPD, FedEx i DHL. Rezerwuj, płać i śledź online. Fracht drogowy, morski i lotniczy z wyceną w 24 godziny.",
    },
    ship: {
      title: "Wyślij paczkę - Momentum Logistics",
      description:
        "Krajowe i międzynarodowe przesyłki z Polski. Porównaj ceny Najszybsza, Zrównoważona i Ekonomiczna, zapłać online i nadaj paczkę tak, jak Ci wygodnie.",
    },
    freight: {
      title: "Fracht - Momentum Logistics",
      description:
        "Fracht drogowy, morski i lotniczy w Europie i na świecie, wyceniany przez specjalistę w ciągu 24 godzin.",
    },
    sustainability: {
      title: "Ekologia - Momentum Logistics",
      description:
        "Zielona logistyka z założenia: optymalizacja tras, zielona energia, ekologiczne działania i partnerzy, którzy dzielą ten cel.",
    },
    about: {
      title: "O nas i FAQ - Momentum Logistics",
      description:
        "Momentum Logistics to firma logistyczna z Łodzi, wysyłająca paczki i fracht do ponad 150 krajów.",
    },
    contact: {
      title: "Kontakt - Momentum Logistics",
      description:
        "Napisz na WhatsApp, zadzwoń lub wyślij e-mail do zespołu Momentum Logistics w Łodzi.",
    },
  },

  nav: {
    home: "Momentum Logistics, strona główna",
    services: "Usługi",
    about: "O nas",
    faq: "FAQ",
    contact: "Kontakt",
    signIn: "Zaloguj się",
    account: "Konto",
    quote: "Wycena",
    openMenu: "Otwórz menu",
    closeMenu: "Zamknij menu",
    language: "Język",
    region: "Region i waluta",
    regionButton: "Język i region",
    regionHint:
      "Język zmienia adres strony: momentumlogservices.com/en lub /pl. Region ustala walutę cen.",
    save: "Zapisz ustawienia",
    poland: "Polska",
    polandNote: "Ceny w złotych, płatność PayU lub kartą",
    international: "Międzynarodowy",
    internationalNote: "Ceny w euro",
    heavy: "Wysyłasz 70 kg lub więcej?",
    heavyLink: "Porozmawiaj z działem frachtu",
    serviceItems: [
      {
        id: "ship",
        title: "Wyślij paczkę",
        blurb: "Natychmiastowe ceny do ponad 150 krajów, rezerwacja i płatność online",
        cta: "Wyślij paczkę",
        detail:
          "Dokumenty, paczki, zamówienia internetowe i bagaż. Wybierz opcję Najszybsza, Zrównoważona lub Ekonomiczna.",
      },
      {
        id: "track",
        title: "Śledź przesyłkę",
        blurb: "Status na żywo od odbioru do doręczenia",
        cta: "Śledź przesyłkę",
        detail:
          "Jeden numer MLS, jasne komunikaty i link, który możesz udostępnić.",
      },
      {
        id: "freight",
        title: "Fracht",
        blurb: "Fracht drogowy, morski i lotniczy, wyceniany przez specjalistę",
        cta: "Zapytaj o wycenę frachtu",
        detail:
          "FTL i LTL, kontenery i drobnica, cargo lotnicze, ładunki ciężkie. Odpowiedź w ciągu 24 godzin.",
      },
      {
        id: "sustainability",
        title: "Ekologia",
        blurb: "Zielona logistyka z założenia",
        cta: "Nasze zobowiązania",
        detail:
          "Optymalizacja tras, czystsza energia i mniej odpadów opakowaniowych, w drodze do bezemisyjnej floty.",
      },
    ],
  },

  footer: {
    tagline:
      "Twój zaufany globalny partner logistyczny. Paczki i fracht z Łodzi do ponad 150 krajów.",
    shipTitle: "Wysyłka",
    quote: "Natychmiastowa wycena",
    track: "Śledź przesyłkę",
    business: "Konta firmowe",
    signIn: "Zaloguj się",
    freightTitle: "Fracht",
    road: "Fracht drogowy",
    sea: "Fracht morski",
    air: "Fracht lotniczy",
    freightQuote: "Zapytaj o wycenę frachtu",
    companyTitle: "Firma",
    about: "O Momentum",
    sustainability: "Ekologia",
    faq: "FAQ",
    contact: "Kontakt",
    talkTitle: "Porozmawiaj z nami",
    whatsapp: "Napisz na WhatsApp",
    copyright: "Momentum Logistics Service. Część grupy Applespeed.",
    terms: "Regulamin",
    privacy: "Polityka prywatności",
    cookies: "Polityka cookies",
  },

  home: {
    eyebrow: "Paczki, ekspres i fracht z Polski",
    title: "Wysyłaj na cały świat,",
    marker: "w kilka minut.",
    intro:
      "Natychmiastowe ceny do ponad 150 krajów w sieciach DPD, FedEx i DHL. Rezerwuj, płać i śledź online, bez telefonów i ukrytych opłat.",
    ctaQuote: "Natychmiastowa wycena",
    ctaFreight: "Zapytanie o fracht",
    heroImageAlt: "Ciężarówka Momentum w trasie",
    countries: "obsługiwanych krajów",
    panel: {
      tabsLabel: "Wycena lub śledzenie",
      tabQuote: "Wycena",
      tabTrack: "Śledź przesyłkę",
      currency: "Waluta",
      pickup: "Odbiór z",
      dropoff: "Doręczenie do",
      addressPlaceholder: "Zacznij wpisywać adres",
      seePrices: "Zobacz ceny",
      pickAddresses: "Wybierz oba adresy z podpowiedzi.",
      email: "E-mail",
      emailPlaceholder: "Twój adres e-mail",
      phone: "Telefon",
      phoneRequired: "Podaj numer telefonu, abyśmy mogli przesłać wycenę.",
      quickSizes: "Rozmiar paczki",
      heavy: "Ponad 70 kg?",
      heavyLink: "Zapytaj dział frachtu",
      presets: {
        envelope: "Koperta",
        small: "Małe pudełko",
        medium: "Średnie pudełko",
        large: "Duże pudełko",
      },
      trackingLabel: "Numer przesyłki",
      trackingPlaceholder: "Numer przesyłki",
      track: "Śledź paczkę",
      trackHint:
        "Konto nie jest potrzebne. Zalogowani przechodzą od razu do pełnych szczegółów przesyłki.",
    },
    partnersTitle: "Doręczamy przez sieci, którym już ufasz",
    shipEyebrow: "Wyślij paczkę",
    shipTitle: "Każda przesyłka, jeden partner",
    shipLink: "Jak działa wysyłka paczek",
    shipCards: [
      {
        title: "Dokumenty",
        text: "Umowy, certyfikaty i dokumenty, które muszą dotrzeć szybko.",
      },
      {
        title: "Paczki i zamówienia internetowe",
        text: "Kilka paczek w jednej rezerwacji, do 70 kg każda.",
      },
      {
        title: "Bagaż i rzeczy osobiste",
        text: "Przeprowadzka za granicę lub powrót do domu? Wyślij rzeczy od drzwi do drzwi.",
      },
      {
        title: "Wysyłki firmowe",
        text: "Konto firmowe z Twoim numerem NIP na każdym dokumencie.",
      },
    ],
    freightEyebrow: "Fracht i ciężkie przesyłki",
    freightTitle: "Większe ładunki wycenia człowiek, nie formularz",
    freightText:
      "Fracht drogowy, morski i lotniczy oraz wszystko powyżej 70 kg. Specjalista ds. frachtu odpowie w ciągu 24 godzin z indywidualną wyceną.",
    freightCta: "Zapytaj o wycenę frachtu",
    freightCards: [
      {
        title: "Fracht drogowy",
        text: "Całopojazdowy i drobnicowy transport w całej Europie.",
      },
      {
        title: "Fracht morski",
        text: "Pełne kontenery i wspólne ładunki drobnicowe.",
      },
      {
        title: "Fracht lotniczy",
        text: "Dla pilnych i krytycznych czasowo ładunków na całym świecie.",
      },
    ],
    howEyebrow: "Jak to działa",
    howTitle: "Od wyceny do drzwi w trzech krokach",
    howSteps: [
      {
        title: "Sprawdź cenę",
        text: "Podaj adresy i wymiary paczek. Ceny Najszybsza, Zrównoważona i Ekonomiczna pojawią się w kilka sekund.",
      },
      {
        title: "Zarezerwuj i nadaj",
        text: "Zapłać kartą lub PayU, a potem wybierz odbiór przez kuriera, punkt nadania lub etykietę do wydruku.",
      },
      {
        title: "Śledź aż do drzwi",
        text: "Jeden numer MLS i jasne informacje od odbioru do doręczenia.",
      },
    ],
    factsLabel: "Momentum w liczbach",
    facts: [
      { value: "150+", label: "krajów, do których doręczamy" },
      { value: "3", label: "sieci kurierskie: DPD, FedEx, DHL" },
      { value: "24 h", label: "odpowiedź z wyceną frachtu" },
      { value: "2", label: "waluty cen: PLN lub EUR" },
    ],
    greenEyebrow: "Ekologia",
    greenTitle: "Zielona logistyka z założenia",
    greenText:
      "Przepisy to dla nas punkt wyjścia. Wbudowujemy ekologię w trasy, flotę i współpracę z partnerami, dążąc do bezemisyjnej floty, więc wysyłka z nami wspiera także Twoje cele ESG.",
    greenImageAlt: "Ekologia w Momentum: czystsza logistyka",
    greenPoints: [
      "Mądrzejsze trasy, mniej emisji",
      "Więcej zielonej energii co roku",
      "Mniej odpadów opakowaniowych",
      "Partnerzy, którzy dzielą ten cel",
    ],
    greenCta: "Nasze zobowiązania",
    ctaTitle: "Gotowy do wysyłki? Sprawdź cenę w kilka sekund.",
    ctaText:
      "Do porównania cen nie potrzebujesz konta. Fracht? Odpowiadamy w ciągu 24 godzin.",
    ctaContact: "Porozmawiaj z nami",
  },

  ship: {
    home: "Strona główna",
    services: "Usługi",
    eyebrow: "Paczki i przesyłki ekspresowe",
    title: "Wysłać paczkę za granicę jest tak łatwo, jak",
    marker: "wysłać e-mail.",
    intro:
      "Krajowe i międzynarodowe przesyłki z Polski. Porównaj ceny od razu, zapłać online i nadaj paczkę tak, jak Ci wygodnie.",
    ctaQuote: "Natychmiastowa wycena",
    ctaTrack: "Śledź przesyłkę",
    tiersEyebrow: "Ty wybierasz cenę i szybkość",
    tiersTitle: "Trzy opcje na każdej trasie",
    tiersText:
      "Porównujemy nasze sieci kurierskie i pokazujemy do trzech cen. Ty wybierasz, my rezerwujemy przewoźnika.",
    tiers: [
      {
        badge: "Najszybsza",
        title: "Gdy musi dotrzeć na czas",
        text: "Najkrótszy czas doręczenia dostępny na Twojej trasie.",
      },
      {
        badge: "Zrównoważona",
        title: "Dobra szybkość, uczciwa cena",
        text: "Rozsądny środek dla większości paczek i zamówień.",
      },
      {
        badge: "Ekonomiczna",
        title: "Najniższa cena",
        text: "Gdy kilka dni więcej nie ma znaczenia.",
      },
    ],
    handEyebrow: "Po płatności",
    handTitle: "Nadaj paczkę po swojemu",
    handText: "Dostępne opcje zależą od tego, co przewoźnik oferuje dla Twojej przesyłki.",
    hand: [
      {
        title: "Odbiór przez kuriera",
        text: "Wybierz datę oferowaną przez przewoźnika, ustaw godziny gotowości i zamknięcia oraz zostaw krótką notatkę dla kierowcy.",
      },
      {
        title: "Punkt nadania",
        text: "Znajdź pobliskie punkty nadania z odległością i godzinami otwarcia lub dowolny sklep partnera.",
      },
      {
        title: "Wydrukuj etykietę",
        text: "Pobierz etykietę PDF i postępuj według prostych kroków: wydrukuj, naklej, nadaj.",
      },
    ],
    bizEyebrow: "Dla firm i e-commerce",
    bizTitle: "Wysyłasz co tydzień? Załóż konto firmowe",
    bizPoints: [
      "Nazwa firmy i NIP na fakturach i deklaracjach celnych",
      "Powielanie wcześniejszych przesyłek jednym kliknięciem",
      "Stały opiekun w Momentum",
    ],
    bizCta: "Załóż konto firmowe",
    insuredTitle: "Standardowe ubezpieczenie",
    insuredText: "Każda paczka jest domyślnie objęta standardowym ubezpieczeniem.",
    customsTitle: "Odprawa celna z pomocą",
    customsText:
      "Przy paczkach międzynarodowych pomagamy opisać każdy przedmiot i podpowiadamy kod HS.",
    heavyTitle: "Ponad 70 kg?",
    heavyText: "Ciężkie paczki trafiają do naszego",
    heavyLink: "działu frachtu",
    heavyTextEnd: "po indywidualną wycenę.",
  },

  freight: {
    eyebrow: "Fracht i partnerstwa B2B",
    title: "Fracht wyceniany przez ludzi, którzy przewożą go",
    marker: "na co dzień.",
    intro:
      "Fracht drogowy, morski i lotniczy w Europie i na świecie, ze stałym opiekunem od pierwszego zapytania. Powiedz nam, co przewozisz, a specjalista odpowie w ciągu 24 godzin.",
    heroImageAlt: "Ciężarówka frachtowa Momentum w trasie",
    cta: "Zapytaj o wycenę frachtu",
    whatsapp: "Napisz do działu frachtu na WhatsApp",
    modesTitle: "Jak możemy to przewieźć",
    modes: [
      {
        title: "Fracht drogowy",
        text: "Ładunki całopojazdowe (FTL) i drobnicowe (LTL) w Polsce i Europie.",
      },
      {
        title: "Fracht morski",
        text: "Pełne kontenery i ładunki portowe lub drobnica we wspólnym kontenerze.",
      },
      {
        title: "Fracht lotniczy",
        text: "Dla pilnych, cennych lub krytycznych czasowo ładunków na całym świecie.",
      },
      {
        title: "Ładunki ciężkie i door-to-door",
        text: "Maszyny, palety i wszystko od 70 kg na paczkę, obsługiwane od początku do końca.",
      },
    ],
    stepsTitle: "Od zapytania do partnerstwa w trzech krokach",
    steps: [
      {
        title: "Opisz swój fracht",
        text: "Trasy, wolumeny i rodzaj towaru. Dwie minuty.",
      },
      {
        title: "Otrzymaj indywidualną wycenę",
        text: "Specjalista ds. frachtu odpowie w ciągu 24 godzin.",
      },
      {
        title: "Rozpocznij współpracę",
        text: "Stały opiekun i wdrożenie do regularnych wysyłek.",
      },
    ],
    form: {
      eyebrow: "Zapytanie o fracht",
      title: "Powiedz nam, co trzeba przewieźć",
      text: "Im więcej szczegółów o trasach, wolumenach i towarach, tym dokładniejsza wycena.",
      fullName: "Imię i nazwisko",
      companyName: "Nazwa firmy",
      email: "E-mail",
      emailPlaceholder: "Służbowy adres e-mail",
      phone: "Telefon",
      phonePlaceholder: "Telefon z numerem kierunkowym",
      freightType: "Rodzaj frachtu",
      road: "Drogowy",
      sea: "Morski",
      air: "Lotniczy",
      description: "Twoje zapytanie",
      descriptionPlaceholder: "Trasy, wolumeny, rodzaj towaru, terminy",
      replyNote: "Specjalista ds. frachtu odpowie w ciągu 24 godzin.",
      send: "Wyślij zapytanie",
      sending: "Wysyłanie...",
      thanks: "Dziękujemy",
      success:
        "Twoje zapytanie trafiło do działu frachtu. Specjalista odpowie w ciągu 24 godzin.",
      another: "Wyślij kolejne zapytanie",
    },
  },

  sustainability: {
    eyebrow: "Ekologia i ESG",
    title: "Zielona logistyka,",
    marker: "z założenia.",
    intro:
      "Spełnianie przepisów środowiskowych to dla nas punkt wyjścia, a nie cel. Wbudowujemy ekologię w planowanie tras, zarządzanie flotą i wybór partnerów, więc każda przesyłka z Momentum wspiera także Twoje raportowanie ESG.",
    ambitionEyebrow: "Nasz cel",
    ambitionTitle: "Bezemisyjna flota",
    ambitionText: "Z mierzalnymi celami wyznaczanymi i raportowanymi co roku.",
    imageAlt: "Ekologia w Momentum: czystsza logistyka",
    commitmentsTitle: "Cztery zobowiązania",
    commitments: [
      {
        title: "Redukcja śladu węglowego",
        text: "Optymalizacja tras i energooszczędne technologie to mniej pustych kilometrów i mniej paliwa na paczkę.",
      },
      {
        title: "Zielona energia",
        text: "Rosnący z roku na rok udział czystej energii we flocie i obiektach.",
      },
      {
        title: "Ekologiczne działania",
        text: "Zrównoważone opakowania, mniej odpadów i recykling w codziennej pracy.",
      },
      {
        title: "Zrównoważone partnerstwa",
        text: "Współpracujemy z dostawcami i przewoźnikami, którzy dzielą to zobowiązanie i potrafią to wykazać.",
      },
    ],
    esgTitle: "Raportujesz własne cele ESG?",
    esgText:
      "Partnerzy biznesowi i frachtowi mogą zapytać nasz zespół, jak Momentum wspiera ich raportowanie zrównoważonego rozwoju.",
    esgCta: "Porozmawiaj z zespołem",
  },

  about: {
    eyebrow: "O Momentum",
    title: "Twój zaufany globalny partner",
    marker: "logistyczny.",
    intro:
      "Jesteśmy firmą logistyczną z Łodzi. Pomagamy ludziom i firmom każdej wielkości wysyłać paczki i fracht do ponad 150 krajów, a szybkość, przejrzystość i niezawodność to u nas standard.",
    storyEyebrow: "Nasza historia",
    storyTitle: "Logistyka dla każdego, z Łodzi w świat",
    story: [
      "Wysyłka kiedyś oznaczała ukryte opłaty, telefony i osobny portal dla każdego przewoźnika. Zbudowaliśmy Momentum, aby każdy, od studenta wysyłającego walizkę do domu po rozwijający się sklep internetowy, mógł zobaczyć cenę, zarezerwować i śledzić przesyłkę w jednym miejscu.",
      "Za platformą stoją doświadczeni logistycy. Każde konto firmowe ma stałego opiekuna, a nasz dział frachtu osobiście wycenia większe ładunki.",
    ],
    group: "Momentum jest częścią grupy Applespeed.",
    filmLabel: "Film o firmie: nasza flota i obsługa frachtu",
    filmPlay: "Odtwórz film o firmie",
    filmPause: "Pauza",
    filmMute: "Wycisz",
    filmUnmute: "Włącz dźwięk",
    filmFullscreen: "Pełny ekran",
    filmSeek: "Przewiń",
    whyTitle: "Dlaczego istniejemy",
    missionLabel: "Misja",
    mission:
      "Zapewniać firmom każdej wielkości płynną, niezawodną logistykę i usuwać bariery w handlu międzynarodowym.",
    visionLabel: "Wizja",
    vision:
      "Świat, w którym odległość nie ogranicza możliwości, a towary przemieszczają się swobodnie, sprawnie i ekologicznie ponad granicami.",
    oldTitle: "Stary sposób",
    oldPoints: [
      "Ukryte opłaty, które pojawiają się po rezerwacji",
      "Niedotrzymane terminy i brak kontaktu",
      "Osobny portal dla każdego przewoźnika",
    ],
    newTitle: "Sposób Momentum",
    newPoints: [
      "Natychmiastowe, przejrzyste ceny przed decyzją",
      "Śledzenie na żywo z aktualizacjami",
      "Jedna platforma dla przesyłek lokalnych, krajowych i międzynarodowych",
    ],
    valuesEyebrow: "Nasze wartości",
    valuesTitle: "Za czym stoimy",
    values: [
      {
        title: "Zaufanie przede wszystkim",
        text: "Przejrzyste ceny i dotrzymane obietnice.",
      },
      {
        title: "Innowacyjność",
        text: "Technologia, która usuwa kroki, a nie je dodaje.",
      },
      {
        title: "Partnerstwo",
        text: "Trwałe relacje, nie tylko przewożenie paczek.",
      },
      { title: "Globalne myślenie", text: "Myśl globalnie, działaj lokalnie." },
    ],
    faqEyebrow: "FAQ",
    faqTitle: "Najczęściej zadawane pytania",
    faqText: "Masz jeszcze pytanie? Napisz na WhatsApp: +48 579 306 288.",
    faqCta: "Kontakt",
    faqs: [
      {
        q: "Jak śledzić paczkę?",
        a: "Wpisz numer przesyłki MLS- na stronie śledzenia lub otwórz udostępniony link. Zalogowani klienci widzą pełne szczegóły na swoim koncie.",
      },
      {
        q: "Jak obliczane są ceny?",
        a: "Na podstawie adresów oraz wagi i wymiarów każdej paczki. Widzisz do trzech opcji, Najszybsza, Zrównoważona i Ekonomiczna, każdą z ceną i czasem doręczenia, zanim podejmiesz decyzję.",
      },
      {
        q: "Jak mogę zapłacić?",
        a: "Kartą lub przez PayU, które jest domyślne dla klientów w Polsce. Ceny wyświetlamy w PLN lub EUR.",
      },
      {
        q: "Czy przesyłka jest ubezpieczona?",
        a: "Każda paczka jest domyślnie objęta standardowym ubezpieczeniem.",
      },
      {
        q: "Jak paczka trafia do kuriera?",
        a: "Zależnie od trasy: zamów odbiór przez kuriera w terminie oferowanym przez przewoźnika, zostaw paczkę w pobliskim punkcie lub wydrukuj etykietę i nadaj ją.",
      },
    ],
  },

  contact: {
    eyebrow: "Kontakt",
    title: "Porozmawiaj z prawdziwym",
    marker: "człowiekiem",
    titleEnd: "w Łodzi",
    intro:
      "WhatsApp to najszybszy sposób, aby się z nami skontaktować. W sprawie paczki przygotuj numer przesyłki MLS-.",
    whatsapp: "WhatsApp",
    phone: "Telefon",
    email: "E-mail",
    hqTitle: "Siedziba",
    formTitle: "Napisz do nas",
    firstName: "Imię",
    lastName: "Nazwisko",
    emailPlaceholder: "Twój adres e-mail",
    message: "Wiadomość",
    messagePlaceholder:
      "W czym możemy pomóc? Podaj numer przesyłki, jeśli go masz.",
    replyNote: "Odpowiadamy e-mailem, zwykle w ciągu jednego dnia roboczego.",
    send: "Wyślij wiadomość",
    formDisabled:
      "Wiadomości online nie są jeszcze dostępne. Prosimy o kontakt przez WhatsApp, telefon lub e-mail.",
    directions: "Wyznacz trasę",
  },
};

export default pl;
