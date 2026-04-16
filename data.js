// ============================================================
// FIKTIVE UNTERNEHMENSDATEN: KabelWerke Deutschland GmbH
// Version 3 – Realistische Darstellung ohne offensichtliche Hinweise
// ============================================================

const companyData = {

    name: "KabelWerke Deutschland GmbH",
    slogan: "Verbindungen, die Deutschland bewegen.",

    // ---- WEBSITE (Marketingsprache, keine internen Details) ----
    website_sections: {
        about: `Die KabelWerke Deutschland GmbH ist seit über 35 Jahren ein verlässlicher Partner für hochwertige Kabel- und Leitungstechnik. Am Standort Wuppertal fertigen wir mit rund 420 Mitarbeitern ein breites Sortiment an Kupferkabeln für Energieversorgung, Bauwesen und Industrie. Qualität und Liefertreue sind die Grundpfeiler unseres Erfolgs.`,

        mission: `Als mittelständisches Familienunternehmen stehen wir für nachhaltige Wertschöpfung am Standort Deutschland. Unsere Kunden schätzen unsere hohe Produktqualität, individuelle Beratung und die Fähigkeit, auch kurzfristige Großaufträge zuverlässig zu bedienen.`,

        production: `In unserer modernen Fertigungsanlage verarbeiten wir Kupfer in mehrstufigen Prozessen zu hochwertigen Kabelprodukten. Am Standort betreiben wir ein eigenes Blockheizkraftwerk zur Versorgung mit Strom und Prozesswärme, um unsere Unabhängigkeit von externen Energielieferanten zu sichern.`,

        logistics: `Unser Versprechen: Bundesweite Lieferung innerhalb von 48 Stunden. Mit unserer eigenen LKW-Flotte bringen wir Ihr Material direkt auf die Baustelle – zuverlässig und termingerecht, von Flensburg bis Garmisch.`,

        warehouse: `Durch unser großzügiges Zentrallager in Wuppertal können wir eine außergewöhnlich hohe Lieferbereitschaft garantieren. Unsere Kunden profitieren von sofort verfügbaren Standardprodukten und kurzen Vorlaufzeiten bei Sonderkonfektionen.`
    },

    // ---- PRODUKTE ----
    products: [
        { name: "NYY-J Starkstromkabel", category: "Niederspannung", description: "Für die feste Verlegung in Gebäuden, Außenanlagen und Erdreich.", image_emoji: "⚡" },
        { name: "H07V-K Aderleitung", category: "Installation", description: "Flexible Aderleitung für Gebäudeinstallation und Renovierung.", image_emoji: "🏠" },
        { name: "NYCWY Mittelspannungskabel", category: "Mittelspannung", description: "Für Energieverteilnetze und kommunale Infrastruktur.", image_emoji: "🏗️" },
        { name: "ÖLFLEX® CLASSIC Steuerleitung", category: "Industrie", description: "Steuer- und Anschlussleitung für Maschinenbau und Automatisierung.", image_emoji: "🏭" }
    ],

    // ---- MARKTDATEN (S-International Daily 16.04.2026) ---- 
    marketPrices: {
        date: "16.04.2026",
        source: "S-International Daily / LME / ICE",
        eurUsd: 1.1806,
        copper: { spotUsd: 13248, spotEur: 11221, forward3m: 13100, forward6m: 12800, forward12m: 12500, unit: "USD/t bzw. EUR/t" },
        diesel: { spotUsd: 1160, spotEur: 983, forward6m: 900, forward12m: 800, unit: "USD/mT (Low Sulphur Gasoil ICE)" },
        eua: { spot: 68.50, forward12m: 72.00, unit: "EUR/t CO₂" }
    },

    // ---- BILANZ (clean, ohne erklärende Hinweise) ----
    bilanz: {
        stichtag: "31.12.2025",
        aktiva: {
            title: "AKTIVA",
            sections: [
                {
                    title: "A. Anlagevermögen",
                    items: [
                        { label: "I. Immaterielle Vermögensgegenstände", value: "850.000" },
                        { label: "II. Sachanlagen", sub: true },
                        { label: "1. Grundstücke und Gebäude", value: "12.500.000", indent: true },
                        { label: "2. Technische Anlagen und Maschinen", value: "18.200.000", indent: true },
                        { label: "3. Kraft- und Wärmeerzeugungsanlage", value: "6.800.000", indent: true },
                        { label: "4. Fuhrpark", value: "5.500.000", indent: true },
                        { label: "5. Betriebs- und Geschäftsausstattung", value: "1.200.000", indent: true },
                        { label: "Summe Anlagevermögen", value: "45.050.000", bold: true }
                    ]
                },
                {
                    title: "B. Umlaufvermögen",
                    items: [
                        { label: "I. Vorräte", sub: true },
                        { label: "1. Roh-, Hilfs- und Betriebsstoffe", value: "8.200.000", indent: true },
                        { label: "2. Unfertige Erzeugnisse", value: "3.800.000", indent: true },
                        { label: "3. Fertige Erzeugnisse und Waren", value: "22.000.000", indent: true },
                        { label: "II. Forderungen aus Lieferungen und Leistungen", value: "11.500.000" },
                        { label: "III. Kassenbestand, Bankguthaben", value: "3.450.000" },
                        { label: "Summe Umlaufvermögen", value: "48.950.000", bold: true }
                    ]
                },
                { title: "", items: [{ label: "Bilanzsumme", value: "94.000.000", bold: true, total: true }] }
            ]
        },
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
                        { label: "3. Sonstige Rückstellungen", value: "2.300.000" },
                        { label: "Summe Rückstellungen", value: "8.300.000", bold: true }
                    ]
                },
                {
                    title: "C. Verbindlichkeiten",
                    items: [
                        { label: "1. Verbindlichkeiten ggü. Kreditinstituten", value: "38.000.000" },
                        { label: "2. Verbindlichkeiten aus Lieferungen und Leistungen", value: "18.500.000" },
                        { label: "3. Sonstige Verbindlichkeiten", value: "6.500.000" },
                        { label: "Summe Verbindlichkeiten", value: "63.000.000", bold: true }
                    ]
                },
                { title: "", items: [{ label: "Bilanzsumme", value: "94.000.000", bold: true, total: true }] }
            ]
        }
    },

    // ---- GuV (clean, ohne erklärende Hinweise) ----
    guv: {
        period: "01.01.2025 – 31.12.2025",
        items: [
            { label: "1. Umsatzerlöse", value: "100.000.000", bold: true },
            { label: "2. Bestandsveränderungen", value: "+1.200.000" },
            { label: "Gesamtleistung", value: "101.200.000", bold: true, line: true },
            { label: "" },
            { label: "3. Materialaufwand", sub: true },
            { label: "a) Aufwendungen für Roh-, Hilfs- und Betriebsstoffe", value: "-54.800.000", indent: true },
            { label: "b) Aufwendungen für bezogene Leistungen", value: "-3.700.000", indent: true },
            { label: "Summe Materialaufwand", value: "-58.500.000", bold: true },
            { label: "" },
            { label: "4. Personalaufwand", value: "-16.800.000" },
            { label: "5. Abschreibungen", value: "-5.200.000" },
            { label: "" },
            { label: "6. Sonstige betriebliche Aufwendungen", value: "-16.700.000" },
            { label: "" },
            { label: "Betriebsergebnis (EBIT)", value: "4.000.000", bold: true, line: true },
            { label: "" },
            { label: "7. Zinsen und ähnliche Aufwendungen", value: "-1.300.000" },
            { label: "" },
            { label: "Ergebnis vor Steuern (EBT)", value: "2.700.000", bold: true, line: true },
        ]
    },

    // ---- LAGEBERICHT (wie ein echter Geschäftsbericht, subtile Hinweise) ----
    lagebericht: {
        sections: [
            {
                title: "1. Geschäftsverlauf und Lage der Gesellschaft",
                text: `Das Geschäftsjahr 2025 war geprägt von einer soliden Nachfrageentwicklung im Bereich der Kabel- und Leitungstechnik. Die Umsatzerlöse konnten auf 100,0 Mio. EUR gesteigert werden. Die Auftragslage blieb über das gesamte Jahr stabil, insbesondere im Bereich der Infrastrukturprojekte und des Wohnungsbaus. Der Materialaufwand stellt mit 58,5 Mio. EUR (57,8% der Gesamtleistung) den mit Abstand größten Kostenblock dar und wird maßgeblich durch die Entwicklung der internationalen Metallpreise beeinflusst.`
            },
            {
                title: "2. Beschaffung und Produktion",
                text: `Der Einkauf unseres wesentlichen Vormaterials erfolgt zu marktüblichen Konditionen an internationalen Rohstoffmärkten. Die Beschaffungspreise unterliegen teils erheblichen Schwankungen, die sich unmittelbar auf unsere Herstellungskosten auswirken. Im Berichtsjahr konnte die Fertigungskapazität unserer Produktionsanlagen durch gezielte Investitionen weiter optimiert werden. Unsere unternehmenseigene Kraft-Wärme-Kopplungsanlage zur Eigenversorgung ist seit 2008 in Betrieb und sichert die energetische Unabhängigkeit der Fertigungsprozesse. Das Unternehmen unterliegt den Regularien des europäischen Emissionshandels und beschafft die erforderlichen Zertifikate am Markt.`
            },
            {
                title: "3. Logistik und Vertrieb",
                text: `Unsere Vertriebsstrategie basiert auf einer hohen Lieferbereitschaft und bundesweiter Distribution. Die Auslieferung erfolgt über eine eigene Fahrzeugflotte, die eine Just-in-Time-Belieferung unserer Kunden ermöglicht. Die Kraftstoffkosten stellen einen wesentlichen Bestandteil der Distributionskosten dar und sind von der allgemeinen Preisentwicklung am Energiemarkt abhängig.`
            },
            {
                title: "4. Vermögens- und Finanzlage",
                text: `Die Bilanzsumme beläuft sich zum Stichtag auf 94,0 Mio. EUR. Die Eigenkapitalquote liegt bei 24,1% und dokumentiert eine solide, wenn auch ausbaufähige finanzielle Basis. Die Vorräte an fertigen und unfertigen Erzeugnissen stellen mit 25,8 Mio. EUR den wertmäßig bedeutendsten Posten des Umlaufvermögens dar. Die Bewertung erfolgt zu Herstellungskosten unter Beachtung des strengen Niederstwertprinzips gemäß § 253 Abs. 4 HGB. Bei einem anhaltenden Rückgang der Materialpreise bestünde das Risiko einer Wertminderung auf den niedrigeren beizulegenden Wert.`
            },
            {
                title: "5. Risiko- und Chancenbericht",
                text: `<strong>Beschaffungsmarktrisiken:</strong> Die Gesellschaft ist in erheblichem Umfang von der Preisentwicklung auf den internationalen Rohstoffmärkten abhängig. Insbesondere die Entwicklung des Preises für unser Kernvormaterial stellt ein wesentliches Ergebnisrisiko dar. Derzeit verfügt die Gesellschaft nicht über systematische Sicherungsstrategien für Rohstoffpreise.<br><br><strong>Energiekosten und regulatorische Risiken:</strong> Die Kosten für den Betrieb unserer Eigenversorgungsanlage sowie die mit dem europäischen Emissionshandel verbundenen Aufwendungen unterliegen marktpreislichen Schwankungen. Die schrittweise Reduktion der kostenlosen Zuteilung von Emissionsrechten wird die Beschaffungskosten in den kommenden Jahren voraussichtlich weiter erhöhen.<br><br><strong>Logistikkosten:</strong> Die Kosten für den Betrieb unserer Fahrzeugflotte sind von der allgemeinen Kraftstoffpreisentwicklung abhängig. Angesichts der hohen Fahrleistung stellt dies ein nicht unerhebliches Kostenrisiko dar.<br><br><strong>Bestandsbewertungsrisiken:</strong> Die hohe Kapitalbindung in Fertigerzeugnissen birgt bei rückläufigen Materialpreisen das Risiko bilanzwirksamer Wertminderungen.`
            },
            {
                title: "6. Prognosebericht",
                text: `Für das laufende Geschäftsjahr 2026 rechnet die Geschäftsführung mit einer weiterhin stabilen Nachfragesituation. Die Ergebnisentwicklung wird maßgeblich davon abhängen, inwieweit es gelingt, Schwankungen der Einkaufspreise an die Kunden weiterzugeben oder anderweitig abzufangen. Die Geschäftsführung prüft derzeit die Einführung eines systematischen Rohstoff-Risikomanagements.`
            }
        ]
    },

    // ---- CHAT-SYSTEM: ANSPRECHPARTNER UND IHRE ANTWORTEN ----
    chatContacts: {
        einkauf: {
            name: "Thomas Weber",
            role: "Leiter Einkauf & Logistik",
            avatar: "👔",
            greeting: "Guten Tag! Thomas Weber, Leiter Einkauf und Logistik. Wie kann ich Ihnen weiterhelfen? Fragen Sie mich gerne zu unseren Beschaffungsprozessen, der Logistik oder unserer Lagerhaltung.",
            responses: [
                {
                    keywords: ["kupfer", "rohstoff", "material", "vormaterial", "metall"],
                    answer: "Kupfer ist unser mit Abstand wichtigstes Vormaterial. Wir verarbeiten jährlich rund 6.500 Tonnen Kupferkathoden der Güteklasse Cu-ETP. Der Einkauf erfolgt über unsere Handelspartner zu Preisen, die sich am Kurs der London Metal Exchange – der LME – orientieren. Wir kaufen in der Regel monatlich zu den jeweils gültigen Tagespreisen ein. Eine langfristige Preisfixierung betreiben wir derzeit nicht."
                },
                {
                    keywords: ["lme", "börse", "preis", "preisbildung", "marktpreis", "kurs"],
                    answer: "Die Preise richten sich nach der LME, der Londoner Metallbörse. Das ist der internationale Referenzmarkt für Industriemetalle. Unsere Einkaufspreise bewegen sich entsprechend mit dem LME-Kupferpreis, der in US-Dollar pro Tonne notiert wird. Dazu kommt natürlich das Währungsrisiko EUR/USD. In den letzten Monaten lag der LME-Kupferpreis zwischen 10.000 und 14.000 USD pro Tonne – das sind schon erhebliche Schwankungen."
                },
                {
                    keywords: ["lkw", "flotte", "fahrzeug", "transport", "lieferung", "spedition"],
                    answer: "Wir unterhalten eine eigene Flotte von 50 Sattelzügen, allesamt 40-Tonner mit Dieselantrieb. Die Fahrzeuge sind im Durchschnitt 280 Tage im Jahr auf der Straße und legen pro Tag etwa 450 Kilometer zurück. Das sind natürlich erhebliche Fahrleistungen, die sich auch in den Kraftstoffkosten niederschlagen."
                },
                {
                    keywords: ["diesel", "kraftstoff", "tankst", "sprit", "benzin", "treibstoff"],
                    answer: "Ja, die Dieselkosten sind ein großes Thema bei uns. Bei 50 LKW mit durchschnittlich 32 Litern auf 100 Kilometer kommen Sie auf einen jährlichen Verbrauch von gut zwei Millionen Litern. Das summiert sich auf über sechs Millionen Euro pro Jahr. Wir tanken über Rahmenverträge mit großen Mineralölkonzernen, aber der Preis orientiert sich letztlich am Markt."
                },
                {
                    keywords: ["lager", "bestand", "vorräte", "vorrat", "fertig", "trommel", "lagerbestand"],
                    answer: "Unser Zentrallager umfasst über 12.000 Quadratmeter. Aktuell lagern dort fertige Kabeltrommeln im Wert von etwa 22 Millionen Euro – Bilanzwert zu Herstellungskosten. Der Kupferanteil am Materialwert liegt je nach Kabeltyp zwischen 48 und 72 Prozent. Das ist schon eine erhebliche Kapitalbindung. Wir brauchen diese Bestände aber, um unsere 48-Stunden-Liefergarantie halten zu können."
                },
                {
                    keywords: ["absicherung", "hedging", "sicherung", "forward", "future", "termin", "derivat"],
                    answer: "Ehrlich gesagt: Wir haben derzeit keine systematische Rohstoffpreisabsicherung. Wir kaufen zu Tagespreisen und versuchen, Preisänderungen über Anpassungen unserer Verkaufspreise weiterzugeben. Das gelingt aber nicht immer zeitnah – unsere Kundenverträge haben oft Laufzeiten von drei bis sechs Monaten mit festen Preisen. Die Geschäftsführung hat uns beauftragt, das Thema Hedging zu prüfen."
                },
                {
                    keywords: ["kunde", "vertrag", "verkaufspreis", "preisanpassung", "weitergabe"],
                    answer: "Unsere Kundenverträge laufen meist über drei bis sechs Monate mit fixen Preisen. Preisanpassungen können wir daher nicht sofort weitergeben. Bei starken Kupferpreisschwankungen entsteht dadurch ein zeitlicher Versatz – wenn die Rohstoffpreise steigen, tragen wir das Risiko bis zur nächsten Preisanpassung. Das kann bei 6.500 Tonnen im Jahr schon ins Geld gehen."
                },
                {
                    keywords: ["risiko", "problem", "schwierig", "herausforderung", "sorge"],
                    answer: "Unsere größten Herausforderungen? Ganz klar die Volatilität auf der Beschaffungsseite. Wenn der Kupferpreis innerhalb eines Quartals um 10 Prozent steigt, reden wir schnell über mehrere Millionen Mehrkosten. Und auf der Lagerseite ist es genau umgekehrt: Fällt der Kupferpreis, dann steht unser gesamter Lagerbestand mit zu hohen Herstellungskosten in den Büchern. Frau Keller aus dem Controlling kann Ihnen da mehr zu den bilanziellen Auswirkungen sagen."
                }
            ],
            fallback: "Da bin ich nicht der richtige Ansprechpartner. Fragen Sie mich gerne zu unseren Einkaufsprozessen, der Rohstoffbeschaffung, unserer LKW-Flotte, dem Diesel, oder unserem Lagermanagement. Für Finanzfragen empfehle ich Ihnen Fr. Keller."
        },
        finanzen: {
            name: "Sandra Keller",
            role: "Leiterin Finanzen & Controlling",
            avatar: "👩‍💼",
            greeting: "Sandra Keller, Finanzen und Controlling. Schön, dass Sie sich die Zeit nehmen. Ich stehe Ihnen für Fragen zur Bilanz, den Finanzkennzahlen und unserem Risikomanagement zur Verfügung.",
            responses: [
                {
                    keywords: ["bilanz", "bilanzsumme", "vermögen", "aktiva", "passiva"],
                    answer: "Unsere Bilanzsumme liegt bei 94 Millionen Euro. Was mich als Controllerin beschäftigt: Die Vorräte an fertigen und unfertigen Erzeugnissen machen mit knapp 26 Millionen Euro den größten Einzelposten im Umlaufvermögen aus. Das ist eine enorme Kapitalbindung, deren Wert unmittelbar von der Rohstoffpreisentwicklung abhängt."
                },
                {
                    keywords: ["vorräte", "bestand", "bewertung", "niederstwert", "abschreibung", "wertminderung"],
                    answer: "Die Vorräte bewerten wir zu Herstellungskosten – das schreibt das HGB vor. Aber nach dem strengen Niederstwertprinzip gemäß § 253 Abs. 4 HGB müssen wir zum Bilanzstichtag prüfen, ob der Marktpreis unter die Herstellungskosten gefallen ist. Wenn ja, müssen wir auf den niedrigeren Wert abschreiben. Bei unserem Lagerbestand von 22 Millionen Euro Fertigerzeugnissen, wovon gut 70 Prozent des Materialwerts auf Kupfer entfallen – das sind rund 17 bis 18 Millionen Euro reiner Kupferwert – wäre ein Kupferpreisverfall von 10 Prozent potenziell ein Abwertungsbedarf von fast 2 Millionen Euro. Das geht direkt ins Ergebnis."
                },
                {
                    keywords: ["materialaufwand", "kostenstruktur", "kosten", "aufwand"],
                    answer: "Der Materialaufwand ist mit 58,5 Millionen Euro unser größter Kostenblock und macht fast 58 Prozent der Gesamtleistung aus. Davon entfallen allein rund 48 Millionen auf den Kupfereinkauf. Der Rest sind Kunststoffgranulate, Isoliermaterialien und Verpackung. Im Bereich der sonstigen betrieblichen Aufwendungen stecken unter anderem die Energiekosten für unser Blockheizkraftwerk, die Kraftstoffkosten für die LKW-Flotte, und die Aufwendungen für CO₂-Zertifikate – zusammen rund 13 Millionen Euro. Das sind alles marktpreisabhängige Positionen."
                },
                {
                    keywords: ["co2", "emission", "zertifikat", "eua", "emissionshandel", "ets"],
                    answer: "Unser Blockheizkraftwerk fällt mit seiner Feuerungswärmeleistung unter den EU-Emissionshandel. Wir stoßen jährlich rund 26.300 Tonnen CO₂ aus. Davon erhalten wir noch etwa 8.000 Tonnen als kostenlose Zuteilung – die sinkt aber Jahr für Jahr. Den Rest, also gut 18.000 Tonnen, müssen wir am Markt als EU Allowances zukaufen. Bei aktuellen Preisen um die 68 Euro pro Tonne sind das knapp 1,3 Millionen Euro nur für den Zukauf. Tendenz steigend."
                },
                {
                    keywords: ["kraftwerk", "bhkw", "energie", "gas", "erdgas", "wärme", "strom"],
                    answer: "Unser Blockheizkraftwerk hat eine elektrische Leistung von 22 Megawatt und versorgt uns mit Strom und Prozesswärme für die Schmelz- und Ziehprozesse. Wir verbrauchen jährlich rund 45 Gigawattstunden Erdgas. Die Gaskosten belaufen sich auf etwa 5,4 Millionen Euro pro Jahr. Aber wie gesagt – das Thema Erdgaspreisabsicherung steht bei uns gerade nicht ganz oben auf der Agenda, obwohl man darüber nachdenken sollte."
                },
                {
                    keywords: ["eigenkapital", "quote", "verschuldung", "fremdkapital"],
                    answer: "Die Eigenkapitalquote liegt bei 24,1 Prozent. Das ist für unsere Branche nicht unüblich, aber auch kein Polster für große Überraschungen. Von unseren 38 Millionen Bankverbindlichkeiten sind etwa 12 Millionen kurzfristig – die hängen teils an variablen Zinssätzen. Was mir mehr Sorgen macht, ist die hohe Kapitalbindung in unseren Vorräten. Wenn da Wertberichtigungen nötig werden, schlägt das direkt auf die Eigenkapitalquote durch."
                },
                {
                    keywords: ["absicherung", "hedging", "sicherung", "strategie", "risikomanagement"],
                    answer: "Ich sage es ganz offen: Wir haben aktuell kein systematisches Absicherungskonzept für unsere Rohstoffpreisrisiken. Weder für Kupfer, noch für Diesel, noch für die CO₂-Zertifikate. Die Geschäftsführung hat das Thema jetzt auf die Agenda gesetzt – deshalb sind Sie ja hier. Meine Einschätzung: Die drei größten Risikopositionen sind erstens der Kupfereinkauf mit 48 Millionen Jahresvolumen, zweitens der Lagerbestand mit dem Abwertungsrisiko, und drittens die Diesel- und CO₂-Kosten in Kombination."
                },
                {
                    keywords: ["risiko", "problem", "gefahr", "schwach"],
                    answer: "Aus Sicht des Controllings sehe ich mehrere Risiken: Erstens die direkte Abhängigkeit unserer Einkaufskosten von internationalen Rohstoffpreisen. Zweitens das Bestandsbewertungsrisiko – bei fallenden Preisen drohen Wertminderungen auf unser Fertiglager. Drittens die regulatorischen Kosten aus dem EU-Emissionshandel, die jedes Jahr steigen. Und viertens die Kraftstoffkosten für unsere Flotte, die wir aktuell gar nicht absichern."
                },
                {
                    keywords: ["guv", "gewinn", "verlust", "ergebnis", "ebit", "marge"],
                    answer: "Unser EBIT liegt bei 4 Millionen Euro – das entspricht einer EBIT-Marge von gerade mal 4 Prozent. Bei einem Materialaufwand von 58,5 Millionen braucht es nur eine vergleichsweise geringe Schwankung der Einkaufspreise, um unser gesamtes Betriebsergebnis aufzuzehren. Anders gesagt: Wenn der Kupferpreis nur um 8-9 Prozent steigt und wir das nicht weitergeben können, wäre unser Gewinn praktisch null."
                },
                {
                    keywords: ["rückstellung", "sonstige"],
                    answer: "In den sonstigen Rückstellungen von 2,3 Millionen stecken unter anderem Rückstellungen für ausstehende CO₂-Zertifikate des laufenden Jahres, Garantierückstellungen und Rechtskosten. Der CO₂-Anteil macht davon den größten einzelnen Posten aus."
                }
            ],
            fallback: "Das liegt eher im Bereich von Herrn Weber aus dem Einkauf. Ich kann Ihnen vor allem zu unserer Bilanz, GuV, Kostenstruktur, Bewertungsfragen und dem finanziellen Risikomanagement Auskunft geben."
        }
    },

    // ---- AUFGABENSTELLUNG (offen, ohne vorweggenommene Antworten) ----
    questions: [
        {
            id: "q1",
            title: "Aufgabe 1: Identifikation der Preisänderungsrisiken",
            prompt: "Analysieren Sie anhand der verfügbaren Informationen (Unternehmenswebsite, Bilanz, GuV, Lagebericht, Marktdaten und Gespräche mit den Ansprechpartnern) alle wesentlichen Preisänderungsrisiken der KabelWerke Deutschland GmbH. Unterscheiden Sie dabei zwischen Risiken aus steigenden und Risiken aus fallenden Preisen."
        },
        {
            id: "q2",
            title: "Aufgabe 2: Quantifizierung der Risiken",
            prompt: "Quantifizieren Sie die identifizierten Preisänderungsrisiken so weit wie möglich. Nutzen Sie die verfügbaren Kennzahlen aus Bilanz und GuV sowie die aktuellen Marktdaten, um die potenzielle Ergebnisauswirkung bei einer Preisveränderung von +/- 10% zu berechnen."
        },
        {
            id: "q3",
            title: "Aufgabe 3: Absicherungsstrategie",
            prompt: "Entwickeln Sie eine ganzheitliche Absicherungsstrategie für die identifizierten Risiken. Berücksichtigen Sie dabei die am Markt verfügbaren Instrumente und begründen Sie Ihre Empfehlung. Priorisieren Sie die Maßnahmen nach Wesentlichkeit."
        },
        {
            id: "q4",
            title: "Aufgabe 4: Handlungsempfehlung an die Geschäftsführung",
            prompt: "Verfassen Sie eine strukturierte Handlungsempfehlung an die Geschäftsführung der KabelWerke Deutschland GmbH. Fassen Sie die Risikosituation zusammen, priorisieren Sie die dringendsten Maßnahmen und skizzieren Sie einen Umsetzungsplan."
        }
    ]
};
