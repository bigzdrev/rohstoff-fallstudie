// ============================================================
// FIKTIVE UNTERNEHMENSDATEN: KabelWerke Deutschland GmbH
// Alle Daten sind fiktiv, aber wirtschaftlich plausibel für
// ein mittelständisches Kupferkabel-Unternehmen mit 100 Mio. Umsatz.
// ============================================================

const companyData = {

    // ---- ALLGEMEIN ----
    name: "KabelWerke Deutschland GmbH",
    slogan: "Verbindungen, die Deutschland bewegen.",
    founded: "1987",
    hq: "Wuppertal, Nordrhein-Westfalen",
    employees: 420,
    ceo: "Dr. Markus Heinemann",
    cfo: "Sandra Keller",
    website_sections: {
        about: `Die KabelWerke Deutschland GmbH zählt seit über 35 Jahren zu den führenden mittelständischen Herstellern von Kupferkabeln und -leitungen in Deutschland. Vom Standort Wuppertal aus beliefern wir Kunden in der Energieversorgung, im Bauwesen, in der Automobilindustrie und im Maschinenbau. Unsere Produkte reichen von Niederspannungskabeln bis zu hochkomplexen Spezialkabeln für die Industrie.`,
        
        mission: `Unser Ziel ist es, mit höchster Qualität und Liefertreue die Infrastruktur Deutschlands zu sichern. Wir verarbeiten ausschließlich hochwertiges Elektrolyt-Kupfer (Cu-ETP, 99,99% Reinheit), das wir am internationalen Rohstoffmarkt beschaffen.`,

        production: `In unserer hochmodernen Fertigungsstraße in Wuppertal verarbeiten wir jährlich rund <strong>6.500 Tonnen Kupferkathoden</strong>. Diese werden in einem mehrstufigen Prozess zu Kupferstangen gegossen, auf Kupferdrähte gezogen und schließlich zu fertigen Kabelkonfektionen verarbeitet. Für die energieintensiven Schmelz- und Ziehprozesse betreiben wir ein eigenes <strong>gasbetriebenes 22 MW Blockheizkraftwerk (BHKW)</strong>, das uns mit Strom und Prozesswärme versorgt. Der jährliche Erdgasverbrauch des Kraftwerks beläuft sich auf ca. <strong>45 GWh</strong>. Als Betreiber einer Anlage mit einer Feuerungswärmeleistung über 20 MW unterliegen wir dem <strong>EU-Emissionshandelssystem (EU ETS)</strong> und müssen jährlich eine entsprechende Menge an <strong>EU Allowances (EUAs)</strong> einreichen, um unsere CO₂-Emissionen zu decken.`,

        logistics: `Ein Alleinstellungsmerkmal der KabelWerke Deutschland ist unsere bundesweite Direktlogistik. Mit einer eigenen <strong>Flotte von 50 Diesel-LKW</strong> (40-Tonner) liefern wir unsere Kabelprodukte just-in-time an Baustellen, Energieversorger und OEM-Kunden in ganz Deutschland. Unsere Fahrzeuge sind im Durchschnitt <strong>280 Tage pro Jahr</strong> im Einsatz und legen dabei im Schnitt <strong>450 km pro Fahrzeug und Tag</strong> zurück. Bei einem Durchschnittsverbrauch von <strong>32 Litern Diesel pro 100 km</strong> ergibt sich ein erheblicher jährlicher Kraftstoffbedarf.`,

        warehouse: `Unser Zentrallager in Wuppertal umfasst über <strong>12.000 m² Lagerfläche</strong>. Hier werden fertig konfektionierte Kabeltrommeln klimatisiert gelagert, bevor sie ausgeliefert werden. Aufgrund der hohen Lieferbereitschaft, die unsere Kunden von uns erwarten, halten wir stets einen <strong>erheblichen Bestand an Fertigerzeugnissen</strong> vor. Zum Bilanzstichtag 31.12.2025 betrug der Buchwert unserer Vorräte an fertigen und unfertigen Erzeugnissen rund <strong>22 Mio. EUR</strong>. Der Kupfergehalt macht dabei den weitaus größten Anteil des Materialwerts aus. Bei sinkenden Kupferpreisen besteht die Gefahr, dass der Marktwert des eingelagerten Materials unter den Buchwert (Herstellungskosten) fällt und <strong>außerplanmäßige Abschreibungen</strong> erforderlich werden.`
    },

    // ---- PRODUKTE ----
    products: [
        {
            name: "NYY-J Starkstromkabel",
            category: "Niederspannung",
            description: "Kunststoff-Starkstromkabel für die feste Verlegung in Gebäuden, Außenanlagen und Erdreich. Standardprodukt für Elektriker, Bauunternehmen und Energieversorger.",
            copper_content: "65% Kupfer nach Gewicht",
            image_emoji: "⚡"
        },
        {
            name: "H07V-K Aderleitung",
            category: "Installation",
            description: "Flexible Aderleitung für die Gebäudeinstallation. Meistverkauftes Produkt im Bereich privater Hausbau und Renovierung.",
            copper_content: "58% Kupfer nach Gewicht",
            image_emoji: "🏠"
        },
        {
            name: "NYCWY Mittelspannungskabel",
            category: "Mittelspannung",
            description: "Konzentrisch aufgebautes Kabel für Energieverteilnetze. Hauptkunde: kommunale Energieversorger und Stadtwerke.",
            copper_content: "72% Kupfer nach Gewicht",
            image_emoji: "🏗️"
        },
        {
            name: "ÖLFLEX® CLASSIC Steuerleitung",
            category: "Industrie / Maschinen",
            description: "Hochflexible Steuer- und Anschlussleitung für den Maschinenbau und die Automatisierungstechnik.",
            copper_content: "48% Kupfer nach Gewicht",
            image_emoji: "🏭"
        }
    ],

    // ---- AKTUELLE MARKTPREISE (S-International Daily 16.04.2026) ----
    marketPrices: {
        date: "16.04.2026",
        source: "S-International Daily / LME / ICE",
        eurUsd: 1.1806,
        copper: {
            spotUsd: 13248,
            spotEur: 11221,
            forward3m: 13100,
            forward6m: 12800,
            forward12m: 12500,
            unit: "USD/t bzw. EUR/t"
        },
        diesel: {
            spotUsd: 1160,
            spotEur: 983,
            forward6m: 900,
            forward12m: 800,
            unit: "USD/mT (Low Sulphur Gasoil ICE)"
        },
        eua: {
            spot: 68.50,
            forward12m: 72.00,
            unit: "EUR/t CO₂"
        }
    },

    // ---- BILANZ nach HGB (vereinfacht, aber realistisch) ----
    bilpianz: {
        stichtag: "31.12.2025",
        // AKTIVA
        aktiva: {
            title: "AKTIVA",
            sections: [
                {
                    title: "A. Anlagevermögen",
                    items: [
                        { label: "I. Immaterielle Vermögensgegenstände", value: "850.000", note: "Softwarelizenzen, ERP-System" },
                        { label: "II. Sachanlagen", value: "", sub: true },
                        { label: "   1. Grundstücke und Gebäude (Werk Wuppertal)", value: "12.500.000" },
                        { label: "   2. Technische Anlagen und Maschinen", value: "18.200.000", note: "Gießerei, Ziehstraßen, Extruder" },
                        { label: "   3. 22 MW BHKW (Gasbetrieben)", value: "6.800.000", note: "EU-ETS-pflichtige Anlage" },
                        { label: "   4. Fuhrpark (50 Diesel-LKW)", value: "5.500.000", note: "Buchwert nach AfA" },
                        { label: "   5. Betriebs- und Geschäftsausstattung", value: "1.200.000" },
                        { label: "Summe Anlagevermögen", value: "45.050.000", bold: true }
                    ]
                },
                {
                    title: "B. Umlaufvermögen",
                    items: [
                        { label: "I. Vorräte", value: "", sub: true },
                        { label: "   1. Roh-, Hilfs- und Betriebsstoffe", value: "8.200.000", note: "v.a. Kupferkathoden (LME-Preisbindung)" },
                        { label: "   2. Unfertige Erzeugnisse", value: "3.800.000", note: "Kabel in Produktion" },
                        { label: "   3. Fertige Erzeugnisse & Waren", value: "22.000.000", note: "Kabeltrommeln im Zentrallager (Kupferwert!)" },
                        { label: "II. Forderungen aus Lieferungen und Leistungen", value: "11.500.000" },
                        { label: "III. Kassenbestand, Bankguthaben", value: "3.450.000" },
                        { label: "Summe Umlaufvermögen", value: "48.950.000", bold: true }
                    ]
                },
                {
                    title: "",
                    items: [
                        { label: "SUMME AKTIVA", value: "94.000.000", bold: true, total: true }
                    ]
                }
            ]
        },
        // PASSIVA
        passiva: {
            title: "PASSIVA",
            sections: [
                {
                    title: "A. Eigenkapital",
                    items: [
                        { label: "I. Gezeichnetes Kapital", value: "5.000.000" },
                        { label: "II. Kapitalrücklage", value: "3.000.000" },
                        { label: "III. Gewinnrücklagen", value: "12.000.000" },
                        { label: "IV. Jahresüberschuss", value: "2.700.000" },
                        { label: "Summe Eigenkapital", value: "22.700.000", bold: true }
                    ]
                },
                {
                    title: "B. Rückstellungen",
                    items: [
                        { label: "1. Pensionsrückstellungen", value: "4.800.000" },
                        { label: "2. Steuerrückstellungen", value: "1.200.000" },
                        { label: "3. Sonstige Rückstellungen", value: "2.300.000", note: "u.a. Rückstellung für CO₂-Zertifikate" },
                        { label: "Summe Rückstellungen", value: "8.300.000", bold: true }
                    ]
                },
                {
                    title: "C. Verbindlichkeiten",
                    items: [
                        { label: "1. Verbindlichkeiten gegenüber Kreditinstituten", value: "38.000.000", note: "davon kurzfr. 12 Mio." },
                        { label: "2. Verbindlichkeiten aus L&L", value: "18.500.000" },
                        { label: "3. Sonstige Verbindlichkeiten", value: "6.500.000" },
                        { label: "Summe Verbindlichkeiten", value: "63.000.000", bold: true }
                    ]
                },
                {
                    title: "",
                    items: [
                        { label: "SUMME PASSIVA", value: "94.000.000", bold: true, total: true }
                    ]
                }
            ]
        }
    },

    // ---- GEWINN- UND VERLUSTRECHNUNG (GuV) nach Gesamtkostenverfahren ----
    guv: {
        period: "01.01.2025 – 31.12.2025",
        items: [
            { label: "1. Umsatzerlöse", value: "100.000.000", bold: true },
            { label: "2. Bestandsveränderungen (Fertig- /Unfertige Erz.)", value: "+1.200.000" },
            { label: "Gesamtleistung", value: "101.200.000", bold: true, line: true },
            { label: "" },
            { label: "3. Materialaufwand", value: "", sub: true },
            { label: "   a) Aufwendungen für Roh-, Hilfs- und Betriebsstoffe", value: "-54.800.000", note: "davon Kupfer: 48.200.000 (LME-Preisbindung)" },
            { label: "   b) Aufwendungen für bezogene Leistungen", value: "-3.700.000" },
            { label: "Summe Materialaufwand", value: "-58.500.000", bold: true },
            { label: "" },
            { label: "4. Personalaufwand", value: "-16.800.000" },
            { label: "5. Abschreibungen", value: "-5.200.000" },
            { label: "" },
            { label: "6. Sonstige betriebliche Aufwendungen", value: "", sub: true },
            { label: "   a) Energiekosten (Erdgas BHKW, 45 GWh)", value: "-5.400.000", note: "Gaspreis-Marktexposition" },
            { label: "   b) Kraftstoffkosten (Diesel, 50 LKW)", value: "-6.100.000", note: "ca. 2.016.000 Liter/Jahr" },
            { label: "   c) CO₂-Zertifikate (EUA)", value: "-1.800.000", note: "ca. 26.300 t CO₂/Jahr" },
            { label: "   d) Sonstige (Miete, Versicherung, IT, etc.)", value: "-3.400.000" },
            { label: "Summe sonst. betr. Aufwendungen", value: "-16.700.000", bold: true },
            { label: "" },
            { label: "Betriebsergebnis (EBIT)", value: "4.000.000", bold: true, line: true },
            { label: "" },
            { label: "7. Zinsen und ähnliche Aufwendungen", value: "-1.300.000", note: "Bankverbindlichkeiten" },
            { label: "" },
            { label: "Ergebnis vor Steuern (EBT)", value: "2.700.000", bold: true, line: true },
        ]
    },

    // ---- BERECHNUNGSGRUNDLAGEN (für verifizierbare Plausibilität) ----
    calculations: {
        copper: {
            annualTonnage: 6500,
            avgPurchasePrice: "7.415 EUR/t (gewichteter Durchschnitt 2025)",
            totalSpend: "48.200.000 EUR",
            inventoryTonnes: "ca. 2.400 t in Fertigerzeugnissen (Kupferanteil)",
            inventoryValue: "ca. 17.800.000 EUR des Lagerbestands = Kupfer",
            riskExplain: "Bei 10% Kupferpreisanstieg: +4.820.000 EUR Mehrkosten p.a. | Bei 10% Kupferpreisverfall: bis zu 1.780.000 EUR Abwertungsbedarf auf Lagerbestand"
        },
        diesel: {
            trucks: 50,
            daysPerYear: 280,
            kmPerDay: 450,
            consumptionPer100km: 32,
            totalLiters: "50 × 280 × 450 × 0.32 = 2.016.000 Liter/Jahr",
            costPerLiter: "ca. 3,03 EUR (Großabnehmerpreis inkl. Energiesteuer)",
            totalCost: "6.100.000 EUR",
            riskExplain: "Bei 10% Dieselpreisanstieg: +610.000 EUR Mehrkosten p.a."
        },
        co2: {
            annualEmissions: "ca. 26.300 t CO₂ (aus Erdgasverbrennung BHKW)",
            freeAllocation: "ca. 8.000 t (kostenlose Zuteilung, sinkt jährlich)",
            purchaseNeed: "ca. 18.300 t EUAs am Markt zu kaufen",
            avgPrice2025: "68,50 EUR/t (Stichtag 16.04.2026)",
            totalCost: "ca. 1.800.000 EUR (inkl. freie Zuteilung und Zukauf)",
            riskExplain: "Bei 10% Anstieg der EUA-Preise: +125.000 EUR Mehrkosten p.a."
        },
        gas: {
            note: "Erdgas-Preisabsicherung ist NICHT Gegenstand dieser Fallstudie. Der Fokus liegt auf Kupfer, Diesel und CO₂/EUA."
        }
    },

    // ---- AUFGABENSTELLUNG (für das Formular) ----
    questions: [
        {
            id: "q1",
            title: "Kupfer – Einkaufspreisrisiko",
            prompt: "Analysieren Sie das Preisänderungsrisiko, das sich aus dem Einkauf von ca. 6.500 t Kupfer pro Jahr zu LME-Preisen ergibt. Quantifizieren Sie das Risiko und schlagen Sie geeignete Absicherungsinstrumente vor (z.B. Forwards, Futures, Optionen).",
            hint: "Hinweis: Beachten Sie die aktuellen Spot- und Terminpreise im Marktdaten-Tab."
        },
        {
            id: "q2",
            title: "Kupfer – Lagerbestandsrisiko (Fallende Preise)",
            prompt: "Im Zentrallager lagern fertige Kabel mit einem Kupferwert von ca. 17,8 Mio. EUR. Welches Risiko entsteht bei fallenden Kupferpreisen? Erläutern Sie den bilanziellen Effekt (strenges Niederstwertprinzip nach HGB) und schlagen Sie Absicherungsmaßnahmen vor.",
            hint: "Hinweis: Prüfen Sie den Lagerbestand in der Bilanz und die Kupfer-Terminkurve."
        },
        {
            id: "q3",
            title: "Diesel – Logistikkosten-Absicherung",
            prompt: "Die 50 Diesel-LKW verbrauchen ca. 2.016.000 Liter/Jahr. Analysieren Sie das Dieselpreisrisiko und entwickeln Sie eine Absicherungsstrategie. Beziehen Sie die aktuellen Terminpreise für Gasoil (ICE) ein.",
            hint: "Hinweis: Rechnen Sie Gasoil (USD/mT) in EUR/Liter um. 1 mT ≈ 1.183 Liter."
        },
        {
            id: "q4",
            title: "CO₂-Zertifikate (EUA) – Emissionshandel",
            prompt: "Das BHKW stößt ca. 26.300 t CO₂/Jahr aus. Nach Abzug der kostenlosen Zuteilung müssen ca. 18.300 EUAs am Markt erworben werden. Analysieren Sie das Preisrisiko und schlagen Sie eine Beschaffungsstrategie vor.",
            hint: "Hinweis: Die freie Zuteilung sinkt in den nächsten Jahren gemäß EU-ETS-Vorgaben weiter."
        },
        {
            id: "q5",
            title: "Gesamtfazit: Risikomanagement-Strategie",
            prompt: "Fassen Sie alle identifizierten Preisänderungsrisiken zusammen und erstellen Sie eine Handlungsempfehlung für die Geschäftsführung. Priorisieren Sie die Risiken nach Wesentlichkeit und skizzieren Sie ein ganzheitliches Hedging-Konzept.",
            hint: ""
        }
    ]
};
