import re

with open('data.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace Bank bot logic
start_marker = "bank: {\n            name: \"Trading Desk\","
end_marker = "// ---- AUFGABENSTELLUNG ----"

new_bank_block = """bank: {
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
                    answer: "Handel: Einen direkten Diesel-Forward bieten wir standardmäßig nicht an. Underlying ist ICE Low Sulphur Gasoil. Berechnen Sie intern Ihr präzises Tonnage-Volumen (""mt"") pro Monat! Quote-Anforderung muss Instrument, Monate und mt beinhalten."
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

    """

idx1 = text.find(start_marker)
idx2 = text.find(end_marker, idx1)

if idx1 != -1 and idx2 != -1:
    content = text[:idx1] + new_bank_block + text[idx2:]
    with open('data.js', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Replaced successfully!")
else:
    print("Markers not found!")

