const companyData = {
  website_sections: {
    about: "Die KabelWerke Deutschland GmbH ist ein führender Hersteller von industriellen Hochspannungskabeln und Spezialleitungen. Mit über 35 Jahren Erfahrung beliefern wir Energieversorger, Automobilhersteller und die Telekommunikationsbranche weltweit. Unser Werk in Wuppertal vereint modernste Extrusionstechnik mit strengen Qualitätskontrollen.",
    mission: "Unsere Mission ist die sichere und effiziente Energieübertragung für eine nachhaltige Zukunft. Wir setzen auf technologische Innovation, höchste Materialreinheit und langfristige Partnerschaften mit unseren Kunden und Lieferanten.",
    production: "In unseren drei Fertigungslinien verarbeiten wir jährlich mehrere tausend Tonnen Elektrolytkupfer. Der Prozess umfasst das Drahtziehen, Verseilen, Isolieren und die abschließende Mantel-Extrusion. Jedes Kabel wird unter Hochspannung auf Durchschlagsfestigkeit geprüft.",
    logistics: "Durch unsere zentrale Lage im Bergischen Land und unseren eigenen Fuhrpark sowie die Schienenanbindung garantieren wir just-in-time Lieferungen. Wir betreiben ein automatisiertes Hochregallager für Standardtypen, um kurzfristige Bedarfe abdecken zu können.",
    warehouse: "Unser Kupfer-Lager bietet Platz für bis zu 800 Tonnen Kathoden und Drahtbarren. Aufgrund der hohen Materialwerte ist das Lager speziell gesichert. Die Bestandsführung erfolgt in Echtzeit über unser ERP-System."
  },
  products: [
    { id: "p1", name: "PowerGrid Ultra 110kV", category: "Hochspannung", description: "VPE-isoliertes Erdkabel für die Überland-Energieversorgung. Hochrein Kupferleiter.", image_emoji: "🔌" },
    { id: "p2", name: "InduFlex Multicore", category: "Industrie", description: "Hochflexible Steuerleitung für Roboterarme und Fertigungsstraßen. Ölbeständig.", image_emoji: "🤖" },
    { id: "p3", name: "DataStream FiberHybrid", category: "Telekom", description: "Kombination aus Glasfaser und Kupfer für 5G-Basisstationen. Blitzgeschützt.", image_emoji: "📡" }
  ],
  bilanz: {
    aktiva: {
      title: "Aktiva (in EUR)",
      sections: [
        {
          title: "A. Anlagevermögen",
          items: [
            { label: "I. Sachanlagen (Maschinen, Fuhrpark)", value: 42000000, bold: true },
            { label: "II. Immaterielle Vermögensgegenstände", value: 4500000 }
          ]
        },
        {
          title: "B. Umlaufvermögen",
          items: [
            { label: "I. Vorräte (Rohstoffe, Unfertige Erz.)", value: 18500000, bold: true },
            { label: "II. Forderungen aus L&L", value: 12400000 },
            { label: "III. Kassenbestand, Guthaben", value: 6800000 }
          ]
        },
        { items: [ { label: "Bilanzsumme Aktiva", value: 84200000, total: true } ] }
      ]
    },
    passiva: {
      title: "Passiva (in EUR)",
      sections: [
        {
          title: "A. Eigenkapital",
          items: [
            { label: "I. Gezeichnetes Kapital", value: 20000000 },
            { label: "II. Gewinnrücklagen", value: 15400000, bold: true },
            { label: "III. Jahresüberschuss", value: 5200000, sub: true }
          ]
        },
        {
          title: "B. Rückstellungen",
          items: [
            { label: "Rückstellungen für Pensionen / Steuern", value: 8600000 }
          ]
        },
        {
          title: "C. Verbindlichkeiten",
          items: [
            { label: "I. Verbindlichkeiten ggü. Banken", value: 24500000, bold: true },
            { label: "II. Verbindlichkeiten aus L&L", value: 10500000 }
          ]
        },
        { items: [ { label: "Bilanzsumme Passiva", value: 84200000, total: true } ] }
      ]
    }
  },
  guv: {
    items: [
      { label: "1. Umsatzerlöse", value: 145000000, bold: true },
      { label: "2. Herstellungskosten der verk. Leistungen", value: -112400000 },
      { label: "3. Bruttoergebnis vom Umsatz", value: 32600000, line: true },
      { label: null },
      { label: "4. Vertriebskosten", value: -12500000 },
      { label: "5. Allgemeine Verwaltungskosten", value: -9400000 },
      { label: "6. Sonstige betriebliche Erträge", value: 1200000 },
      { label: "7. Operatives Ergebnis (EBIT)", value: 11900000, total: true },
      { label: null },
      { label: "8. Zinsertrag / Aufwand (netto)", value: -1800000 },
      { label: "9. Ergebnis vor Steuern (EBT)", value: 10100000, line: true },
      { label: "10. Steuern vom Einkommen und Ertrag", value: -4900000 },
      { label: "11. Jahresüberschuss", value: 5200000, total: true }
    ]
  },
  lagebericht: {
    sections: [
      { title: "Marktumfeld", text: "Das Geschäftsjahr 2025 war geprägt von einer hohen Volatilität an den Rohstoffmärkten. Während die Nachfrage nach Erneuerbaren Energien und damit nach unseren Hochspannungskabeln stetig stieg, bereiteten uns die Preisschwankungen bei Kupfer und die gestiegenen Logistikkosten durch hohe Dieselpreise Sorgen. Wir konnten die Preise teilweise an die Kunden weitergeben, jedoch mit Zeitverzögerung." },
      { title: "Chancen und Risiken", text: "Die größte Chance liegt im Ausbau des deutschen Stromnetzes. Unser Auftragsbestand erreicht Rekordwerte. Das größte Risiko stellt die Preisbindung bei Kupfer dar. Da wir oft Monate zwischen Auftragseingang und Produktion haben, können ungehedgte Kupferpreissteigerungen unsere Marge vernichten." },
      { title: "Finanzlage", text: "Die Liquiditätssituation ist stabil, jedoch belasten die hohen Lagerbestände (Vorsichtskauf bei niedrigen Kursen) die Kapitalbindung. Die Bankverbindlichkeiten sind zum Teil variabel verzinst, was bei steigenden Leitzinsen ein Zinsrisiko darstellt." }
    ]
  },
  marketPrices: {
    date: "17. April 2026",
    copper: { spotUsd: 9450, spotEur: 8831, forward3m: 9510, forward6m: 9580, forward12m: 9720 },
    diesel: { spotUsd: 820, spotEur: 766, forward6m: 845, forward12m: 810 },
    eua: { spot: 78.40, forward12m: 84.15 },
    eurUsd: 1.0701
  },
  chatContacts: {
    unternehmen: {
      name: "Hr. Weber",
      role: "Leiter Einkauf & Logistik",
      avatar: "🏢",
      greeting: "Guten Tag! Ich bin zuständig für die Materialbeschaffung und unseren Fuhrpark. Wie kann ich Ihnen bei der Analyse unserer Kostenstrukturen helfen?",
      fallback: "Das ist ein interessanter Punkt. In Bezug auf unsere Materialwirtschaft kann ich sagen, dass wir besonders bei Kupfer sehr sensibel auf Weltmarktpreise reagieren. Haben Sie dazu spezifische Fragen zu unseren Beständen?",
      responses: [
        {
          topic: "kupfer_einkauf",
          topicSentence: "Wie kaufen wir Kupfer ein?",
          keywords: ["kupfer", "einkauf", "beschaffung", "kathoden", "drahtbarren"],
          answer: "Wir beziehen unser Kupfer hauptsächlich über die LME-notierten Händler in Rotterdam. Pro Monat benötigen wir ca. 450-500 Tonnen. Den Preis fixieren wir oft erst zum Zeitpunkt der physischen Lieferung, es sei denn, wir nutzen Terminkontrakte."
        },
        {
          topic: "lkw_flotte",
          topicSentence: "Frage zur LKW-Flotte.",
          keywords: ["lkw", "fuhrpark", "diesel", "transport", "logistik"],
          answer: "Wir betreiben 12 eigene 40-Tonner für den deutschlandweiten Versand. Unser Dieselverbrauch liegt im Schnitt bei 38.000 Litern pro Monat. Die Kraftstoffkosten sind ein erheblicher Teil unserer Logistik-Overheads."
        }
      ]
    },
    bank: {
      name: "Fr. Schmied",
      role: "Risk Advisor | Trading Desk",
      avatar: "🏦",
      greeting: "Willkommen beim Treasury & Risk Desk der Stadtsparkasse. Ich unterstütze die KabelWerke bei der Absicherung von Marktpreisrisiken. Welche Risk-Parameter möchten Sie besprechen?",
      fallback: "Die Marktentwicklung ist aktuell komplex. Wir sehen starke Contango-Effekte bei Kupfer und moderate Forward-Aufschläge bei der Energie. Sollten wir über spezifische Hedging-Instrumente wie Futures oder Optionen sprechen?",
      responses: [
        {
          topic: "kupfer_hedging",
          topicSentence: "Wie können wir den Kupferpreis absichern?",
          keywords: ["hedging", "absicherung", "kupferpreis", "future", "forward"],
          answer: "Für Kupfer bieten wir Forwards an, mit denen Sie den Preis für Ihre Produktion im nächsten Halbjahr heute schon festschreiben können. Aktuell sehen wir einen Aufschlag von ca. 150 USD auf die 6-Monats-Sicht."
        },
        {
          topic: "zinsrisiko",
          topicSentence: "Haben wir ein Zinsrisiko?",
          keywords: ["zinsen", "kredit", "euribor", "variabel", "zinsänderung"],
          answer: "Von den 24%2C5 Mio. € Bankverbindlichkeiten sind 10 Mio. € an den 3-Monats-Euribor gekoppelt. Ein Zinsanstieg um 1% würde das Zinsergebnis also um ca. 100.000 € pro Jahr verschlechtern."
        }
      ]
    }
  },
  questions: [
    { id: "q1", title: "Marktpreisrisiko Kupfer", prompt: "Berechnen Sie den potenziellen Einfluss eines 10%igen Kupferpreisanstiegs auf die Herstellungskosten, wenn keine Absicherung erfolgt (Annahme: 5.000t Jahresbedarf)." },
    { id: "q2", title: "Logistik & Energie", prompt: "Wie wirkt sich eine dauerhafte Steigerung der Dieselpreise um 20 Cent pro Liter auf das operative Ergebnis (EBIT) aus?" },
    { id: "q3", title: "Hedging-Strategie",
    prompt: "Welches Instrument würden Sie Hr. Weber empfehlen, um die Marge für einen Großauftrag in 9 Monaten zu sichern?" }
  ]
};
