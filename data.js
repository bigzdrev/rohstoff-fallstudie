// ============================================================
// DATENSTRUKTUR: Rohstoffmanagement Fallstudie (PDF Integration & Bank Chat)
// ============================================================

const companyData = {
    // ---- UNTERNEHMENSPROFIL ----
    website_sections: {
        about: "Die KabelWerke Deutschland GmbH ist seit über 35 Jahren ein verlässlicher Partner für hochwertige Kabel- und Leitungstechnik. Am Standort Wuppertal fertigen wir mit rund 420 Mitarbeitern ein breites Sortiment an Kupferkabeln für Energieversorgung, Bauwesen und Industrie. Qualitaet und Liefertreue sind die Grundpfeiler unseres Erfolgs.",
        mission: "Als mittelstaendisches Familienunternehmen stehen wir für nachhaltige Wertschöpfung am Standort Deutschland. Unsere Kunden schätzen unsere hohe Produktqualitaet, individuelle Beratung und die Fähigkeit, auch kurzfristige Grossauftraege zuverlaessig zu bedienen.",
        production: "In unserer modernen Fertigungsanlage verarbeiten wir Kupfer in mehrstufigen Prozessen zu hochwertigen Kabelprodukten. Am Standort betreiben wir ein eigenes Blockheizkraftwerk zur Versorgung mit Strom und Prozesswaerme, um unsere Unabhängigkeit von externen Energielieferanten zu sichern.",
        logistics: "Um unsere versprochenen Lieferzeiten europaweit einzuhalten, setzen wir neben Speditionspartnern verstaerkt auf unseren eigenen, unternehmenseigenen Fuhrpark. Dies gewaehrleistet maximale Flexibilitaet und Kontrolle über die Lieferketten.",
        warehouse: "Unser großräumiges Zentrallager am Standort Wuppertal ermöglicht es uns, eine hohe Verfügbarkeit unserer Standardprodukte sicherzustellen und als Puffer zwischen Produktion und Kundenauslieferung zu dienen."
    },

    // ---- PRODUKTPORTFOLIO ----
    products: [
        {
            name: "Starkstromkabel (NYY-J)",
            category: "Energieversorgung",
            description: "Robuste Kabel zur Energieübertragung im Netz, in der Industrie und in Gebaeuden.",
            image_emoji: "KV" 
        },
        {
            name: "Mittelspannungskabel",
            category: "Infrastruktur",
            description: "Spezialkabel für Stromnetze (10-30 kV) mit optimiertem Kupferquerschnitt.",
            image_emoji: "MK" 
        },
        {
            name: "Flexible Steuerleitungen (YSLY)",
            category: "Industrie & Anlagenbau",
            description: "Hochflexible Leitungen für Mess-, Steuer- und Regelungstechnik.",
            image_emoji: "SL"
        },
        {
            name: "Installationskabel (NYM-J)",
            category: "Bauwesen",
            description: "Der Standard für die Verlegung über, auf, im und unter Putz in trockenen, feuchten und nassen Raeumen.",
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
                        { label: "I. Immaterielle Vermögensgegenstände", value: 1200000 },
                        { label: "II. Sachanlagen", value: 33500000, bold: true },
                        { label: "1. Grundstücke und Bauten", value: 14000000, indent: true },
                        { label: "2. Technische Anlagen und Maschinen", value: 16500000, indent: true },
                        { label: "3. Fuhrpark und Betriebs- und Geschäftsausstattung", value: 3000000, indent: true },
                        { label: "III. Finanzanlagen", value: 0 }
                    ]
                },
                {
                    title: "B. Umlaufvermoegen",
                    items: [
                        { label: "I. Vorräte", value: 38200000, bold: true },
                        { label: "1. Roh-, Hilfs- und Betriebsstoffe", value: 12300000, indent: true },
                        { label: "2. Fertige Erzeugnisse und Waren", value: 25900000, indent: true },
                        { label: "II. Forderungen und sonstige Vermögensgegenstände", value: 15400000 },
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
                        { label: "II. Kapitalrücklage", value: 2000000 },
                        { label: "III. Gewinnrücklagen", value: 13500000 },
                        { label: "IV. Bilanzgewinn", value: 2200000 },
                        { label: "Eigenkapital gesamt", value: 22700000, sub: true }
                    ]
                },
                {
                    title: "B. Rückstellungen",
                    items: [
                        { label: "1. Pensionsrückstellungen", value: 4500000 },
                        { label: "2. Steuerrückstellungen", value: 1200000 },
                        { label: "3. Sonstige Rückstellungen", value: 2300000 }
                    ]
                },
                {
                    title: "C. Verbindlichkeiten",
                    items: [
                        { label: "1. Verbindlichkeiten gegenüber Kreditinstituten", value: 38500000, bold: true },
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
            { label: "1. Umsatzerlöse", value: 98500000, bold: true },
            { label: "2. Erhoehung/Verminderung des Bestands an fertigen und unfertigen Erzeugnissen", value: 2300000 },
            { label: "3. Andere aktivierte Eigenleistungen", value: 120000 },
            { label: "4. Sonstige betriebliche Ertraege", value: 650000 },
            { label: "Gesamtleistung", value: 101570000, sub: true },
            { label: "", value: null },
            { label: "5. Materialaufwand", value: -58500000, bold: true },
            { label: "a) Aufwendungen für Roh-, Hilfs- und Betriebsstoffe", value: -56200000, indent: true },
            { label: "b) Aufwendungen für bezogene Leistungen", value: -2300000, indent: true },
            { label: "6. Personalaufwand", value: -18800000 },
            { label: "7. Abschreibungen", value: -7200000 },
            { label: "8. Sonstige betriebliche Aufwendungen", value: -13000000, bold: true },
            { label: "Rohergebnis", value: null },
            { label: "", value: null },
            { label: "Betriebsergebnis (EBIT)", value: 4070000, line: true },
            { label: "", value: null },
            { label: "9. Finanz- und Beteiligungsergebnis", value: -1150000 },
            { label: "Ergebnis der gewöhnlichen Geschäftstaetigkeit", value: 2920000, sub: true },
            { label: "10. Steuern vom Einkommen und vom Ertrag", value: -720000 },
            { label: "Jahresüberschuss", value: 2200000, total: true }
        ]
    },

    // ---- LAGEBERICHT ----
    lagebericht: {
        sections: [
            {
                title: "1. Wirtschaftsbericht & Rahmenbedingungen",
                text: "Das Geschäftsjahr 2025 war durch ein anhaltend anspruchsvolles Marktumfeld geprägt. Die Nachfrage aus dem Sektor Erneuerbare Energien und Ladeinfrastruktur zeigte sich robust, waehrend der traditionelle Hochbau deutliche Schwächen aufwies. Die Materialverfuegbarkeit war im Berichtsjahr stabil, wenngleich wir erhebliche Volatilitaeten an den internationalen Rohstoffmaerkten verzeichneten."
            },
            {
                title: "2. Geschäftsverlauf & Ertragslage",
                text: "Die Umsatzerlöse konnten leicht auf 98,5 Mio. Euro gesteigert werden. Parallel dazu stieg jedoch auch die Materialeinsatzquote. Das Betriebsergebnis (EBIT) liegt bei 4,1 Mio. Euro. Um unsere Wettbewerbsfähigkeit und Liefertreue zu sichern, haben wir unsere Vorräte, insbesondere das Fertiglager, bewusst hoch gehalten. Dies spiegelt sich entsprechend in der Kapitalbindung wider."
            },
            {
                title: "3. Beschaffungsmarkt, Logistik und Energie & CO2",
                text: "Unser größter Kostenblock bleibt die Beschaffung von metallischen Vormaterialien. Zur Sicherstellung unserer Lieferketten betreiben wir weiterhin unseren Eigenfuhrpark. \nEine wichtige Entwicklung ergab sich im Bereich Umweltschutz: Unser in Wuppertal betriebenes Blockheizkraftwerk fällt als energieintensive Grossanlage unter das Europäische Emissionshandelssystem (EU-ETS 1) und wir verzeichnen wachsende Ausgaben für CO2-Zertifikate. Beachten Sie zusaetzlich, dass die Logistik unserer 50-LKW-Flotte spätestens 2027 in das erweiterte System (EU-ETS 2) fallen wird. Bis dahin unterliegt der Dieselkraftstoff dem nationalen Emissionshandel (nEHS)."
            },
            {
                title: "4. Prognose- und Risikobericht",
                text: "Die Geschäftsfuehrung sieht grundsätzlich positive Perspektiven in den Schluesselmaerkten der Energiewende. Als wesentliche Risiken für das kommende Geschäftsjahr indentifizieren wir Schwankungen der Beschaffungspreise für unser Kernmaterial, mögliche Bewertungsrisiken im Umlaufvermoegen aufgrund der Lagerhaltung an Fertigwaren, steigende Preise durch den nationalen und europaeischen Emissionshandel (CO2-Zertifikate) sowie allgemeine Preissteigerungen im Bereich der Logistikkraftstoffe. Die Geschäftsfuehrung laesst derzeit pruefen, inwiefern finanzmathematische Instrumente oder Termingeschäfte zur Risikoreduktion eingesetzt werden können."
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
