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
                // Weber - Kupfer
                {
                    keywords: ["kupfer", "rohstoff", "material", "vormaterial", "metall", "einkauf"],
                    topicSentence: "copper procurement purchasing raw material metal supply Kupfer Beschaffung Einkauf Rohstoff Metall Vormaterial woher beziehen kaufen",
                    answer: "Weber: Kupfer ist unser wichtigstes Vormaterial. Wir verarbeiten jaehrlich rund 6.500 Tonnen. Der Einkauf erfolgt am Kurs der London Metal Exchange (LME). Wir kaufen in der Regel monatlich zu den Tagespreisen ein. Eine echte Preisabsicherung betreiben wir im Moment noch nicht."
                },
                {
                    keywords: ["lme", "boerse", "preis", "preisbildung", "marktpreis", "kurs"],
                    topicSentence: "LME London Metal Exchange price pricing stock exchange Boerse Preis Preisbildung Marktpreis Kurs Dollar Notierung Schwankung",
                    answer: "Weber: Die Preise richten sich nach der LME. Unsere Einkaufspreise bewegen sich entsprechend mit dem LME-Kupferpreis in US-Dollar pro Tonne. In den letzten Monaten lag der Kupferpreis oft ueber 10.000 USD/Tonne, was erhebliche Volatilitaet mit sich bringt."
                },
                // Weber - Logistik 
                {
                    keywords: ["lkw", "flotte", "fahrzeug", "transport", "logistik", "lieferung", "spedition"],
                    topicSentence: "truck fleet vehicle transport delivery logistics LKW Flotte Fahrzeug Transport Lieferung Spedition Sattelzug",
                    answer: "Weber: Wir unterhalten eine eigene Flotte von 50 Sattelzuegen, allesamt 40-Tonner mit Dieselantrieb. Pro Tag legt ein LKW im Schnitt 450 Kilometer zurueck. Da fallen enorme Kraftstoffkosten an."
                },
                {
                    keywords: ["diesel", "kraftstoff", "tanken", "sprit", "benzin", "treibstoff"],
                    topicSentence: "diesel fuel gasoline petrol cost consumption Diesel Kraftstoff Sprit Benzin Treibstoff tanken Verbrauch Kosten",
                    answer: "Weber: Ja, Diesel ist ein Riesenthema. 50 LKW bei ca. 32 Litern auf 100km – wir verbrauchen jaehrlich gut zwei Millionen Liter! Das sind ungesichert ueber 6 Millionen Euro pro Jahr."
                },
                // Keller - Bilanz & Vorraete
                {
                    keywords: ["lager", "bestand", "vorraete", "vorrat", "fertig", "trommel", "lagerbestand"],
                    topicSentence: "warehouse inventory stock storage finished goods Lager Bestand Vorraete Fertigerzeugnisse Trommel Lagerbestand lagern",
                    answer: "Keller: Aktuell lagern wir Fertigware im Bilanzwert von knapp 26 Mio. Euro (Herstellungskosten). Der Kupferanteil am Materialwert liegt meist bei uener 70 Prozent. Wir muessen viel auf Lager halten, um schnell lieferfaehig zu sein."
                },
                {
                    keywords: ["bewertung", "niederstwert", "abschreibung", "wertminderung", "hgb", "abwertung"],
                    topicSentence: "inventory valuation write-down impairment lower of cost principle Vorraete Bewertung Niederstwertprinzip Abschreibung Wertminderung HGB",
                    answer: "Keller: Genau das ist mein groesster Sorgenpunkt. Nach dem strengen Niederstwertprinzip (§ 253 Abs. 4 HGB) drohen bei stark fallenden Kupferpreisen massive Abschreibungen auf unsere 26 Mio. Euro Vorraete, da der reale Marktwert unter die Urspruenglichen Herstellungskosten fallen koennte."
                },
                // Keller & Weber - CO2 und Energie (PDF Background)
                {
                    keywords: ["co2", "emission", "zertifikat", "eua", "emissionshandel", "ets"],
                    topicSentence: "CO2 carbon emission certificate EUA allowance trading Emission Zertifikat Emissionshandel Klimaschutz Umwelt",
                    answer: "Keller: Die CO2-Situation ist komplex. Unser Blockheizkraftwerk (Gas) faellt unter das EU-ETS 1, also freie Marktpreise ohne Maximalgrenze. Wir brauchen ca. 18.000 Tonnen (EUAs) vom Markt, und laut aktuellen Terminkurven koennten die Preise von aktuell 68 EUR auf 80 EUR pro Tonne bis 2030 steigen! Zusaetzlich faellt der Diesel unserer LKW-Flotte aktuell unter das nationale Emissionshandelsgesetz (nEHS) mit festgelegtem Preiskorridor von 55 bis 65 Euro je Tonne fuer 2026. Ab 2027 wird der Verkehrssektor dann aber dem EU-ETS 2 unterworfen, ebenfalls ohne Preisobergrenze. Die Kosten werden also massiv steigen."
                },
                {
                    keywords: ["nehs", "eu-ets", "eu-ets 2", "compliance", "markt"],
                    topicSentence: "EU-ETS nEHS national emissions trading compliance volunatry market BEHG Gesetz",
                    answer: "Keller: Wichtig zu unterscheiden: Wir sind im 'Compliance Markt', d.h. wir sind gesetzlich verpflichtet Zertifikate zu erwerben. Bis 2027 ist unsere Flotte noch im nEHS (Nationaler Emissionshandel) geschuetzt durch Preisobergrenzen (bis 65 EUR), aber danach gilt EU-ETS 2."
                },
                {
                    keywords: ["kraftwerk", "bhkw", "energie", "gas", "erdgas", "strom"],
                    topicSentence: "power plant energy gas electricity heat CHP BHKW Kraftwerk Energie Gas Erdgas Waerme",
                    answer: "Keller: Unser Blockheizkraftwerk versorgt uns mit Strom und Prozesswaerme. Es verbraucht sehr viel Gas. Aber im Emissionshandel ist es besonders teuer. Gas selbst haben wir bisher nicht gehedget."
                },
                {
                    keywords: ["risiko", "problem", "gefahr", "schwach", "absicherung", "hedging"],
                    topicSentence: "risk problem challenge concern worry hedging Risiko Problem Gefahr Absicherung Strategie Hedging",
                    answer: "Keller & Weber: Unsere groessten wirtschaftlichen Risiken sind: 1. Beschaffungspreis-Anstieg bei Kupfer (Kostenfalle). 2. Preisverfall bei Kupfer (Abwertungsrisiko auf unser gigantisches Lager gem. HGB). 3. Massive Mehrkosten durch LKW-Diesel. 4. Die steigenden und teils schwankenden CO2-Zertifikatspreise im EU-ETS und nEHS. Aktuell ist davon leider nichts strategisch abgesichert."
                }
            ],
            fallback: "KabelWerke (Team): Diese Frage koennen wir Ihnen so direkt nicht beantworten. Fragen Sie uns gerne zu Lieferketten, Kupfer, LKW, Diesel, oder aber Finanz-Themen wie HGB Bilanzierung, Niederstwertprinzip oder das Emmissionshandelssystem."
        },
        bank: {
            name: "Trading Desk",
            role: "Financial Markets & Commodities Bank",
            avatar: "GlobalBank",
            greeting: "Guten Tag, hier spricht der Derivate-Handel. Wir koennen Ihnen Absicherungsinstrumente (Forwards, Swaps, Optionen) fuer Kupfer (LME-Quotierung), ICE Gasoil oder EUA-Zertifikate stellen. Welche Sicherungsgeschaefte moechten Sie abfragen?",
            responses: [
                {
                    keywords: ["asian", "swap", "average", "durchschnitt", "termingeschaeft"],
                    topicSentence: "asian swap commodity average price termingeschaeft derivat asian style",
                    answer: "Trader: Ein Asian Style Swap auf Rohwaren macht absolut Sinn, wenn Sie fortlaufend ueber den Monat Energie oder Rohstoffe (z.B. LME Cash Settlement oder ICE Gasoil) verbrauchen und gegen den Monatsdurchschnitt hedgen wollen. Um Ihnen einen Preis zu nennen: Welches Underlying? Welche Laufzeit? Und wie hoch ist die Gesamt-Tonnage?"
                },
                {
                    keywords: ["laufzeit", "tonnage", "volumen", "menge"],
                    topicSentence: "tonnage volume tenor maturity laufzeit groesse",
                    answer: "Trader: Gut. Fuer die Preisfindung beim Hedging berechnen wir meist einen kleinen Risikoabschlag oder Aufschlag auf die Forward-Preise aus dem Markt, abhaengig von Volumen und Bonitaet. Wenn Sie laut Marktdaten einkaufen, koennen Sie davon ausgehen, dass wir die Forward-Kurve ansetzen."
                },
                {
                    keywords: ["future", "forward", "termingeschaeft", "kaufen"],
                    topicSentence: "future forward terminkontrakt kaufen absichern fix",
                    answer: "Trader: Ein klassischer Forward oder Future zielt auf einen genauen Stichtag in der Zukunft ab. Fuer Gasoil, Kupfer oder EUAs koennen wir fuer Sie an der ICE oder EEX Termin-Kontrakte (Forwards) erwerben. Schauen Sie sich einfach die Forward-Preise in Ihren Marktdaten an, um unseren Angebotspreis fuer diese Laufzeiten abzuschaetzen."
                },
                {
                    keywords: ["kupfer", "copper", "lme"],
                    topicSentence: "copper lme hedge kupfer absicherung",
                    answer: "Trader: Bei Kupfer-Termingeschaeften notieren wir ueblicherweise USD/t basierend auf LME. Denken Sie daran, dass Sie zusaetzlich das EUR/USD Waehrungsrisiko hedgen muessen, da Ihr Unternehmen in Euro bilanziert!"
                },
                {
                    keywords: ["eua", "co2", "zertifikat", "eex"],
                    topicSentence: "eua co2 eex certificate zertifikate emissionsrechte",
                    answer: "Trader: Zur CO2-Absicherung (EUA) koennen wir Forwards an der EEX oder ICE handeln. Beachten Sie, dass Sie mit EUAs nicht den Nationalen Emissionshandel (nEHS) fuer Diesel hedgen koennen, da nEHS-Zertifikate bis 2026 staatlich preisgebunden sind. Fuer den EU-ETS 1 Kraftwerks-Bedarf koennen wir aber heute schon die Preise im Forward einkaufen (ca 72 EUR fuer naechstes Jahr)."
                },
                {
                    keywords: ["diesel", "gasoil", "ice"],
                    topicSentence: "diesel gasoil ice hedge diesel absicherung swap",
                    answer: "Trader: Einen direkten Diesel-Forward gibt es fuer den Mittelstand so nicht transparent; wir nutzen hierfuer in der Regel 'ICE Low Sulphur Gasoil Futures' als Underlying fuer OTC-Swaps. Das passt durch hohe Korrelation perfekt zur Diesel-Absicherung Ihrer Flotte."
                }
            ],
            fallback: "Trader: Bitte spezifizieren Sie Ihr Derivat. Nennen Sie Instrument (Future, Asian Swap), das Underlying (Kupfer, Gasoil, EUA) oder Parameter, damit ich Ihnen den Handelsablauf erklaeren kann."
        }
    },

    // ---- AUFGABENSTELLUNG ----
    questions: [
        {
            id: "q1",
            title: "Aufgabe 1: Identifikation der Preisänderungsrisiken",
            prompt: "Analysieren Sie alle wesentlichen Preisänderungsrisiken der Fallstudie. Unterscheiden Sie Risiken aus steigenden Preisen (Beschaffung) und Risiken aus fallenden Preisen (Bestandsbewertung HGB). Vergessen Sie nicht CO2!"
        },
        {
            id: "q2",
            title: "Aufgabe 2: Quantifizierung der Risiken",
            prompt: "Nutzen Sie Bilanz/GuV und Marktdaten, um die potenzielle Ergebnisauswirkung bei einer Preisveränderung von +/- 10% zu berechnen (z.B. auf den Wert des Kupferlagers oder auf den Gasoil-Verbrauch)."
        },
        {
            id: "q3",
            title: "Aufgabe 3: Absicherungsstrategie (Hedging)",
            prompt: "Entwickeln Sie nach Gesprächen mit dem Handelsraum eine Absicherungsstrategie. Welche Produkte nutzen Sie für Kupfer, Diesel und EUAs? Warum eventuell Asian Swaps oder Forwards?"
        },
        {
            id: "q4",
            title: "Aufgabe 4: Handlungsempfehlung an die Geschäftsführung",
            prompt: "Verfassen Sie eine strukturierte Handlungsempfehlung. Welches Risiko muss zuerst gesichert werden? Skizzieren Sie den Umsetzungsplan."
        }
    ]
};
