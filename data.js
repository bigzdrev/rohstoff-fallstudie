// ============================================================
// DATENSTRUKTUR: Rohstoffmanagement Fallstudie (PDF Integration & Bank Chat)
// ============================================================

const companyData = {
    // ---- UNTERNEHMENSPROFIL ----
    website_sections: {
        about: "Die KabelWerke Deutschland GmbH ist seit ueber 35 Jahren ein verlaesslicher Partner fuer hochwertige Kabel- und Leitungstechnik. Am Standort Wuppertal fertigen wir mit rund 420 Mitarbeitern ein breites Sortiment an Kupferkabeln fuer Energieversorgung, Bauwesen und Industrie. Qualitaet und Liefertreue sind die Grundpfeiler unseres Erfolgs.",
        mission: "Als mittelstaendisches Familienunternehmen stehen wir fuer nachhaltige Wertschoepfung am Standort Deutschland. Unsere Kunden schaetzen unsere hohe Produktqualitaet, individuelle Beratung und die Faehigkeit, auch kurzfristige Grossauftraege zuverlaessig zu bedienen.",
        production: "In unserer modernen Fertigungsanlage verarbeiten wir Kupfer in mehrstufigen Prozessen zu hochwertigen Kabelprodukten. Am Standort betreiben wir ein eigenes Blockheizkraftwerk zur Versorgung mit Strom und Prozesswaerme, um unsere Unabhaengigkeit von externen Energielieferanten zu sichern.",
        logistics: "Um unsere versprochenen Lieferzeiten europaweit einzuhalten, setzen wir neben Speditionspartnern verstaerkt auf unseren eigenen, unternehmenseigenen Fuhrpark. Dies gewaehrleistet maximale Flexibilitaet und Kontrolle ueber die Lieferketten.",
        warehouse: "Unser großraeumiges Zentrallager am Standort Wuppertal ermoeglicht es uns, eine hohe Verfuegbarkeit unserer Standardprodukte sicherzustellen und als Puffer zwischen Produktion und Kundenauslieferung zu dienen."
    },

    // ---- PRODUKTPORTFOLIO ----
    products: [
        {
            name: "Starkstromkabel (NYY-J)",
            category: "Energieversorgung",
            description: "Robuste Kabel zur Energieuebertragung im Netz, in der Industrie und in Gebaeuden.",
            image_emoji: "KV" 
        },
        {
            name: "Mittelspannungskabel",
            category: "Infrastruktur",
            description: "Spezialkabel fuer Stromnetze (10-30 kV) mit optimiertem Kupferquerschnitt.",
            image_emoji: "MK" 
        },
        {
            name: "Flexible Steuerleitungen (YSLY)",
            category: "Industrie & Anlagenbau",
            description: "Hochflexible Leitungen fuer Mess-, Steuer- und Regelungstechnik.",
            image_emoji: "SL"
        },
        {
            name: "Installationskabel (NYM-J)",
            category: "Bauwesen",
            description: "Der Standard fuer die Verlegung ueber, auf, im und unter Putz in trockenen, feuchten und nassen Raeumen.",
            image_emoji: "IN"
        }
    ],

    // ---- BILANZ ----
    bilanz: {
        aktiva: {
            title: "AKTIVA",
            sections: [
                {
                    title: "A. Anlagevermoegen",
                    items: [
                        { label: "I. Immaterielle Vermoegensgegenstaende", value: 1200000 },
                        { label: "II. Sachanlagen", value: 33500000, bold: true },
                        { label: "1. Grundstuecke und Bauten", value: 14000000, indent: true },
                        { label: "2. Technische Anlagen und Maschinen", value: 16500000, indent: true },
                        { label: "3. Fuhrpark und Betriebs- und Geschaeftsausstattung", value: 3000000, indent: true },
                        { label: "III. Finanzanlagen", value: 0 }
                    ]
                },
                {
                    title: "B. Umlaufvermoegen",
                    items: [
                        { label: "I. Vorraete", value: 38200000, bold: true },
                        { label: "1. Roh-, Hilfs- und Betriebsstoffe", value: 12300000, indent: true },
                        { label: "2. Fertige Erzeugnisse und Waren", value: 25900000, indent: true },
                        { label: "II. Forderungen und sonstige Vermoegensgegenstaende", value: 15400000 },
                        { label: "III. Wertpapiere", value: 500000 },
                        { label: "IV. Kassenbestand, Guthaben bei Kreditinstituten", value: 5200000 }
                    ]
                },
                {
                    title: "C. Rechnungsabgrenzungsposten",
                    items: [
                        { label: "", value: 150000 }
                    ]
                },
                {
                    title: "",
                    items: [
                        { label: "Bilanzsumme", value: 94150000, total: true }
                    ]
                }
            ]
        },
        passiva: {
            title: "PASSIVA",
            sections: [
                {
                    title: "A. Eigenkapital",
                    items: [
                        { label: "I. Gezeichnetes Kapital", value: 5000000 },
                        { label: "II. Kapitalruecklage", value: 2000000 },
                        { label: "III. Gewinnruecklagen", value: 13500000 },
                        { label: "IV. Bilanzgewinn", value: 2200000 },
                        { label: "Eigenkapital gesamt", value: 22700000, sub: true }
                    ]
                },
                {
                    title: "B. Rueckstellungen",
                    items: [
                        { label: "1. Pensionsrueckstellungen", value: 4500000 },
                        { label: "2. Steuerrueckstellungen", value: 1200000 },
                        { label: "3. Sonstige Rueckstellungen", value: 2300000 }
                    ]
                },
                {
                    title: "C. Verbindlichkeiten",
                    items: [
                        { label: "1. Verbindlichkeiten gegenueber Kreditinstituten", value: 38500000, bold: true },
                        { label: "davon mit Restlaufzeit bis zu 1 Jahr", value: 12500000, indent: true },
                        { label: "davon mit Restlaufzeit groesser 1 Jahr", value: 26000000, indent: true },
                        { label: "2. Verbindlichkeiten aus Lieferungen und Leistungen", value: 22800000, bold: true },
                        { label: "3. Sonstige Verbindlichkeiten", value: 2000000 }
                    ]
                },
                {
                    title: "D. Rechnungsabgrenzungsposten",
                    items: [
                        { label: "", value: 150000 }
                    ]
                },
                {
                    title: "",
                    items: [
                        { label: "Bilanzsumme", value: 94150000, total: true }
                    ]
                }
            ]
        }
    },

    // ---- GEWINN- UND VERLUSTRECHNUNG ----
    guv: {
        items: [
            { label: "1. Umsatzerloese", value: 98500000, bold: true },
            { label: "2. Erhoehung/Verminderung des Bestands an fertigen und unfertigen Erzeugnissen", value: 2300000 },
            { label: "3. Andere aktivierte Eigenleistungen", value: 120000 },
            { label: "4. Sonstige betriebliche Ertraege", value: 650000 },
            { label: "Gesamtleistung", value: 101570000, sub: true },
            { label: "", value: null },
            { label: "5. Materialaufwand", value: -58500000, bold: true },
            { label: "a) Aufwendungen fuer Roh-, Hilfs- und Betriebsstoffe", value: -56200000, indent: true },
            { label: "b) Aufwendungen fuer bezogene Leistungen", value: -2300000, indent: true },
            { label: "6. Personalaufwand", value: -18800000 },
            { label: "7. Abschreibungen", value: -7200000 },
            { label: "8. Sonstige betriebliche Aufwendungen", value: -13000000, bold: true },
            { label: "Rohergebnis", value: null },
            { label: "", value: null },
            { label: "Betriebsergebnis (EBIT)", value: 4070000, line: true },
            { label: "", value: null },
            { label: "9. Finanz- und Beteiligungsergebnis", value: -1150000 },
            { label: "Ergebnis der gewoehnlichen Geschaeftstaetigkeit", value: 2920000, sub: true },
            { label: "10. Steuern vom Einkommen und vom Ertrag", value: -720000 },
            { label: "Jahresueberschuss", value: 2200000, total: true }
        ]
    },

    // ---- LAGEBERICHT ----
    lagebericht: {
        sections: [
            {
                title: "1. Wirtschaftsbericht & Rahmenbedingungen",
                text: "Das Geschaeftsjahr 2025 war durch ein anhaltend anspruchsvolles Marktumfeld gepraegt. Die Nachfrage aus dem Sektor Erneuerbare Energien und Ladeinfrastruktur zeigte sich robust, waehrend der traditionelle Hochbau deutliche Schwaechen aufwies. Die Materialverfuegbarkeit war im Berichtsjahr stabil, wenngleich wir erhebliche Volatilitaeten an den internationalen Rohstoffmaerkten verzeichneten."
            },
            {
                title: "2. Geschaeftsverlauf & Ertragslage",
                text: "Die Umsatzerloese konnten leicht auf 98,5 Mio. Euro gesteigert werden. Parallel dazu stieg jedoch auch die Materialeinsatzquote. Das Betriebsergebnis (EBIT) liegt bei 4,1 Mio. Euro. Um unsere Wettbewerbsfaehigkeit und Liefertreue zu sichern, haben wir unsere Vorraete, insbesondere das Fertiglager, bewusst hoch gehalten. Dies spiegelt sich entsprechend in der Kapitalbindung wider."
            },
            {
                title: "3. Beschaffungsmarkt, Logistik und Energie & CO2",
                text: "Unser groesster Kostenblock bleibt die Beschaffung von metallischen Vormaterialien. Zur Sicherstellung unserer Lieferketten betreiben wir weiterhin unseren Eigenfuhrpark. \nEine wichtige Entwicklung ergab sich im Bereich Umweltschutz: Unser in Wuppertal betriebenes Blockheizkraftwerk faellt als energieintensive Grossanlage unter das Europaeische Emissionshandelssystem (EU-ETS 1) und wir verzeichnen wachsende Ausgaben fuer CO2-Zertifikate. Beachten Sie zusaetzlich, dass die Logistik unserer 50-LKW-Flotte spaetestens 2027 in das erweiterte System (EU-ETS 2) fallen wird. Bis dahin unterliegt der Dieselkraftstoff dem nationalen Emissionshandel (nEHS)."
            },
            {
                title: "4. Prognose- und Risikobericht",
                text: "Die Geschaeftsfuehrung sieht grundsaetzlich positive Perspektiven in den Schluesselmaerkten der Energiewende. Als wesentliche Risiken fuer das kommende Geschaeftsjahr indentifizieren wir Schwankungen der Beschaffungspreise fuer unser Kernmaterial, moegliche Bewertungsrisiken im Umlaufvermoegen aufgrund der Lagerhaltung an Fertigwaren, steigende Preise durch den nationalen und europaeischen Emissionshandel (CO2-Zertifikate) sowie allgemeine Preissteigerungen im Bereich der Logistikkraftstoffe. Die Geschaeftsfuehrung laesst derzeit pruefen, inwiefern finanzmathematische Instrumente oder Termingeschafte zur Risikoreduktion eingesetzt werden koennen."
            }
        ]
    },

    // ---- MARKTDATEN ----
    marketPrices: {
        date: "16. April 2026",
        copper: { spotUsd: 11250, spotEur: 10416, forward3m: 11300, forward6m: 11350, forward12m: 11420 },
        diesel: { spotUsd: 875.50, spotEur: 810.65, forward6m: 865.00, forward12m: 850.00 },
        eua: { spot: 68.40, forward12m: 72.10 },
        eurUsd: 1.0800
    },

    // ---- CHAT-SYSTEM: UNTERNEHMEN & BANK ----
    chatContacts: {
        unternehmen: {
            name: "Team KabelWerke",
            role: "Thomas Weber (Einkauf) & Sandra Keller (Finanzen)",
            avatar: "KabelWerke",
            greeting: "Willkommen! Thomas Weber (Beschaffung & Logistik) und Sandra Keller (Finanzen & Controlling) sind fuer Sie da. Stellen Sie Fragen zum Materialeinkauf, zur Logistik, zur Bilanz oder zum Risikomanagement.",
            responses: [
                // Weber - Kupfer (Vonovia)
                {
                    keywords: ["kupfer", "rohstoff", "material", "vormaterial", "angebot", "svm", "vonovia"],
                    topicSentence: "copper procurement raw material Vonovia SVM pricing Kupfer Beschaffung Angebot großprojekt",
                    answer: "Weber: Für unseren klassischen Kupferhandel können wir bei Gelegenheit mal über Absicherungen sprechen, aber aktuell fokussieren wir uns auf ein Großprojekt: Unser Stammkunde SVM GmbH nimmt an einer gigantischen Ausschreibung von Vonovia für Ladepunkte teil. Projektstart ist in 9 Monaten, danach liefern wir für 6 Monate monatlich 200mt Kupferkabel. Wir fakturieren strikt in EUR."
                },
                {
                    keywords: ["risiko", "gleitklausel", "option", "optionsgeschäft", "preisgleitklausel", "absichern"],
                    topicSentence: "option risk hedging Preisgleitklausel Angebot Option Sicherung Hedging",
                    answer: "Weber: Optionsgeschäfte auf Kupfer brauchen wir hierfür nicht! Wir haben mit der SVM GmbH vereinbart, dass unser Angebotspreis nur 30 Minuten gehalten werden kann. Danach greift eine Preisgleitklausel für den Kupferpreis bis zur finalen Auftragszusage. Sobald die Zusage da ist, müssen wir aber die Kupfermenge (6 x 200mt) im Terminmarkt sofort festzurren, damit unsere Marge gesichert ist."
                },
                // Weber - Gas (Neu: Gedeckt)
                {
                    keywords: ["gas", "erdgas", "energie", "bhkw", "kraftwerk", "strom"],
                    topicSentence: "gas energy power Erdgas Strom BHKW Kraftwerk",
                    answer: "Weber: Erdgas für unser Blockheizkraftwerk ist zum Glück unkritisch geworden. Die Gaspreise haben wir mittlerweile direkt über Festpreisverträge mit unserem physischen Lieferanten abgesichert. Hier ist kein derivatives Finanzgeschäft mehr nötig."
                },
                // Weber - Diesel (LKW Flotte)
                {
                    keywords: ["lkw", "flotte", "diesel", "transport", "logistik", "tank", "sprit", "kraftstoff"],
                    topicSentence: "truck fleet diesel transport Flotte LKW Diesel Transport Kraftstoff",
                    answer: "Weber: Bei der Logistik sieht es anders aus. Wir haben 50 LKWs, die im Schnitt 450 km am Tag fahren. Rechnen Sie mit rund 30 Liter Diesel pro 100km und 20 Arbeitstagen pro Monat. Im Sommer fahren wir allerdings deutlich mehr als im Winter: Von März bis November 100% Auslastung, Dezemezber bis Februar nur 50%. Unsere Fahrer tanken ganz normal an Tankstellen, aber ich brauche von der Finanzen/Bank dringend einen echten Festpreis für das zweite Halbjahr 2026!"
                },
                // Keller - EUAs
                {
                    keywords: ["co2", "eua", "emission", "zertifikat", "ets", "zuteilung"],
                    topicSentence: "CO2 rights EUA allowance certificates Zuteilung Emission ETS",
                    answer: "Keller: Unser Blockheizkraftwerk fällt unter das EU-ETS. Wir benötigen ca. 30.000 Tonnen CO2-Äquivalent p.a. an EUAs. Vom Staat erhalten wir aber nur eine Freizuteilung von 10.000 EUAs. Die verbleibende Lücke müssen wir am Markt beschaffen und ich fürchte, die Zertifikate werden massiv teurer."
                },
                {
                    keywords: ["nehs", "eu-ets 2", "compliance", "markt"],
                    topicSentence: "EU-ETS nEHS national emissions trading compliance volunatry market BEHG Gesetz",
                    answer: "Keller: Bis 2026 ist unsere Logistik durch das nEHS mit festen CO2-Kosten gedeckt. Ab 2027 fallen die LKW aber in den EU-ETS 2. Das wird die Kostenkalkulation auf den Kopf stellen!"
                }
            ],
            fallback: "Weber & Keller: Diese Frage ist zu allgemein. Wollen Sie mit uns über das SVM/Vonovia Großprojekt (Kupfer), den CO2-Zertifikate-Bedarf für unser Kraftwerk oder unsere 50 LKW große Diesel-Flotte sprechen?"
        },
        bank: {
            name: "Trading Desk",
            role: "Financial Markets & Commodities Bank",
            avatar: "GlobalBank",
            greeting: "OTC Derivate-Handel (Commodities). Bitte fordern Sie Prices unter genauer Angabe des Instruments (Forward, Asian Swap), des Underlyings (LME Kupfer, EUA, ICE Gasoil), der Tonnage/Stückzahl und des Abwicklungszeitraums an.",
            responses: [
                {
                    keywords: ["kupfer", "copper", "vonovia", "svm", "angebot"],
                    topicSentence: "kupfer copper LME absicherung Angebot Projekt",
                    answer: "Handel: Wir pricen LME Copper. Für eine Quote fehlen zwingende Parameter. Benennen Sie genau: 1. Instrument. 2. Ziel-Liefermonate (Start bis Ende). 3. Volumina pro Monat."
                },
                {
                    keywords: ["200", "200mt", "monat", "6 monat", "sechs monat", "februar"],
                    topicSentence: "200mt 6 monate laufzeit asian style kupfer rtg monatlich",
                    answer: "Handel: Quote accepted. Sammel-Rohwarentermingeschäft auf Kupfer, Asian Style (monatliches Settlement). Zeitraum: Februar 2027 bis inkl. Juli 2027, 200 mt/Monat. Terminpreis wird zur Zusage auf LME-Base gefixed in EUR. Konditionen: Risikolimitauslastung 20% (<1 Jahr) / 25% (>1 Jahr) -> Summe ca. 3.105.000 EUR. Interne Bankmarge 4% p.a. auf Aval (ca. 103,5 EUR/mt Margin-Aufschlag)."
                },
                {
                    keywords: ["eua", "co2", "zertifikat", "emission"],
                    topicSentence: "eua emission zertifikate absicherung co2 eex",
                    answer: "Handel: Wir pricen EUAs über EEX/ICE. Sie müssen Ihre Allokations/Zuteilungs-Rechnungen intern klären. Fordern Sie eine Quote an mit: 1. Instrument (European/Asian Style). 2. Exakte Stückzahl. 3. Fälligkeitsmonat."
                },
                {
                    keywords: ["20000", "20.000", "dezember"],
                    topicSentence: "20000 eua absicherung dezember 2026 european style forward",
                    answer: "Handel: Quote accepted. EUA Forward (European Style). Lieferung Mitte Dezember 2026. Volumen: 20.000 Stück. Konditionen: Risikolinie 20% auf Nominal (ca. 296.000 EUR Limitbelastung bei 1.48 Mio. Nominal). Bankmarge: 4% auf Aval (ca. 2,96 EUR/EUA Margin)."
                },
                {
                    keywords: ["diesel", "gasoil", "lkw", "flotte"],
                    topicSentence: "diesel gasoil ice abstimmung logistik",
                    answer: "Handel: Einen direkten Diesel-Forward bieten wir standardmäßig nicht an. Underlying ist ICE Low Sulphur Gasoil. Berechnen Sie intern Ihr präzises Tonnage-Volumen ('mt') pro Monat! Quote-Anforderung muss Instrument, Monate und mt beinhalten."
                },
                {
                    keywords: ["114", "tonnen", "juli", "asian"],
                    topicSentence: "114 tonnen asian style gasoil absicherung juli dezember",
                    answer: "Handel: Quote accepted. Sammel-Rohwarentermingeschäft auf ICE Gasoil, Asian Style (monatliches Settlement), Juli 2026 bis inkl. Dezember 2026. 114 mt pro Monat. Terminkurs: 757 EUR/mt. Konditionen: Risikolinie 20% auf Nominal (Standard) -> ca. 103.500 EUR (aus ca. 518k). Bankmarge: 8% auf Aval (ca. 12 EUR/mt Margin-Aufschlag)."
                }
            ],
            fallback: "Handel: Unvollständige oder irreführende Quote-Anfrage. Bitte fordern Sie Derivate-Preise nur unter präziser Nennung aller Parameter an (Underlying, Instrumententyp, Gesamt-Stückzahl/Tonnage, Monate)."
        }
    },

    // ---- AUFGABENSTELLUNG ----
    questions: [
        {
            id: "q_copper",
            title: "Fall 1: Kupfer (Großprojekt Vonovia)",
            prompt: "Analysieren Sie das Großprojekt mit der SVM GmbH. Welches Produkt bietet die Bank an und wie hoch ist der Terminkurs/Aufbau? (Tipp: Fragen Sie die Bank nach Kupfer und geben Sie die Laufzeiten und Tonnage an)."
        },
        {
            id: "q_eua",
            title: "Fall 2: Emissionszertifikate (EUA)",
            prompt: "Das Blockheizkraftwerk benötigt EUAs. Ermitteln Sie die nötige Sicherungsmenge nach Abzug der Zuteilung. Welches Produkt offeriert der Handel, wie hoch ist die Risikolinie und die Marge?"
        },
        {
            id: "q_diesel",
            title: "Fall 3: Dieselflotte (Gasoil)",
            prompt: "Berechnen Sie zuerst die monatliche Tonnage für die 50 LKWs im 2. Halbjahr 2026. Fragen Sie anschließend den Handel nach Diesel/Gasoil und nennen Sie die Tonnage. Notieren Sie sich das finale Produkt, den Terminkurs, die Risikolinie und die Marge."
        }
    ]
};
