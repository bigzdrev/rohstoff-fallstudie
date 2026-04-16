const companyData = {
    name: "KabelWerke Deutschland GmbH",
    revenue: "100.000.000 EUR",
    description: "Die KabelWerke Deutschland GmbH ist ein führendes mittelständisches Unternehmen in der Herstellung und Logistik von Premium-Kupferkabeln für den industriellen und privaten Bedarf.",
    operations: [
        {
            title: "Produktion & Energiebedarf",
            text: "Für unsere energieintensive Herstellung operieren wir als eines der wenigen Unternehmen ein eigenes 22 MW Kraftwerk. Dadurch decken wir den enormen Strom- und Wärmebedarf, der durch die Schmelze, den Zug und die Ummantelung der Kabel entsteht."
        },
        {
            title: "Rohstoffbeschaffung LME",
            text: "Als Primärrohstoff verarbeiten wir monatlich große Tonnagen an hochreinem Kupfer. Unser Einkauf sichert sich die Mengen direkt am Großmarkt zu den tagesaktuellen LME-Preisen (London Metal Exchange). Nach der Produktion werden die fertigen Kabel aufwendig in unserem Zentrallager aufgewickelt und klimatisch geschützt zwischengelagert, bis sie auf Abruf stehen."
        },
        {
            title: "Bundesweite Logistik",
            text: "Ein Alleinstellungsmerkmal ist unsere bundesweite 'Just-in-Time'-Auslieferung. Mit unserer großen LKW-Flotte liefern wir tausende Tonnen Kabelmaterial von unserem Zentrallager direkt zu den Baustellen tief in Deutschland. Dies verursacht einen sehr hohen kontinuierlichen Dieselverbrauch in unserem Unternehmen."
        }
    ],
    financials: [
        { category: "Umsatzerlöse", value: "100.000.000 €" },
        { category: "Materialaufwand (v.a. Kupfer zu LME)", value: "58.500.000 €" },
        { category: "Energieaufwand (Brennstoffbeschaffung 22 MW Kraftwerk)", value: "12.000.000 €" },
        { category: "Personalaufwand", value: "14.200.000 €" },
        { category: "Logistikaufwand (Kraftstoffe, Diesel)", value: "6.800.000 €" },
        { category: "Sonstige betriebliche Aufwendungen", value: "3.500.000 €" },
        { category: "Betriebsergebnis (EBIT)", value: "5.000.000 €" }
    ],
    balance: [
        { category: "Anlagevermögen (Kraftwerk, Maschinen, LKW-Flotte)", value: "45.000.000 €" },
        { category: "Umlaufvermögen (Extremer Lagerbestand fertiger Kabel)", value: "28.000.000 €" },
        { category: "Kassenbestand / Bankguthaben", value: "4.000.000 €" },
        { category: "Eigenkapital", value: "32.000.000 €" },
        { category: "Fremdkapital (Kredite & Verbindlichkeiten)", value: "45.000.000 €" }
    ],
    questions: [
        "1. Identifizieren Sie alle Preisänderungsrisiken aus dem Einkauf (Rohstoffe).",
        "2. Identifizieren Sie Preisänderungsrisiken im Bereich der Produktion und Lagerung.",
        "3. Identifizieren Sie Risiken in der Auslieferung/Logistik.",
        "4. Welche Absicherungsstrategien (Hedging, Derivate, Verträge) würden Sie dem Unternehmen vorschlagen?"
    ]
};
