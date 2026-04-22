import re

with open('data.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace Bank Responses
old_bank_start = '        bank: {\n            name: "Trading Desk",'
old_bank_end = 'fallback: "Trader: Bitte spezifizieren Sie Ihr Derivat. Nennen Sie Instrument (Future, Asian Swap), das Underlying (Kupfer, Gasoil, EUA) oder Parameter, damit ich Ihnen den Handelsablauf erklaeren kann."\n        }'

new_bank_str = '''        bank: {
            name: "Trading Desk",
            role: "Financial Markets & Commodities Bank",
            avatar: "GlobalBank",
            greeting: "Guten Tag, hier spricht der Derivate-Handel. Wir koennen Ihnen Absicherungsinstrumente (Forwards, Swaps, Optionen) fuer Kupfer (LME-Quotierung), ICE Gasoil oder EUA-Zertifikate stellen. Welche Sicherungsgeschaefte moechten Sie abfragen?",
            responses: [
                {
                    keywords: ["kupfer", "copper", "vonovia", "svm", "angebot"],
                    topicSentence: "kupfer copper LME absicherung Angebot Projekt",
                    answer: "Trader: Für das Kupfer-Großprojekt mit der SVM GmbH benötigen wir zur Bepreisung genaue Parameter. Welches Volumen benötigen Sie und über welchen Zeitraum? Handelt es sich um ein einmaliges Geschäft oder um mehrere Fixings?"
                },
                {
                    keywords: ["200", "200mt", "monat", "6 monat", "sechs monat", "februar"],
                    topicSentence: "200mt 6 monate laufzeit asian style kupfer rtg monatlich",
                    answer: "Trader: Alles klar. Für 200mt monatlich über 6 Monate ab Februar 2027 ist ein Optionsgeschäft nicht notwendig, da Sie ohnehin eine Preisgleitklausel bis zur Zusage haben. Die perfekte Lösung ist ein Sammel-Rohwarentermingeschäft auf Kupfer, Asian Style mit monatlichem Settlement. (Start Februar 2027 – einschließlich Juli 2027, 200 mt pro Monat). Die Risikolinie hierfür beträgt 20% bis 1 Jahr und danach 25% (in Summe ca. 3.105.000 EUR). Die Ziel-Marge für das Geschäft berechnen wir mit 4% auf das Aval (ca. 103,5 EUR/mt Marge auf den Terminpreis)."
                },
                {
                    keywords: ["eua", "co2", "zertifikat"],
                    topicSentence: "eua emission zertifikate absicherung co2 eex",
                    answer: "Trader: Zur CO2-Absicherung (EUA) müssen wir wissen: Wie hoch ist der Gesamtbedarf und wie hoch ist die freie Zuteilung, die der Kunde erhält?"
                },
                {
                    keywords: ["30000", "30.000", "10000", "10.000", "20000", "20.000", "zuteilung"],
                    topicSentence: "30000 bedarf 10000 zuteilung 20000 eua absicherung dezember 2026",
                    answer: "Trader: Verstanden. Bei 30.000t Bedarf und 10.000t Freizuteilung müssen Sie 20.000 EUAs sichern. Wir offerieren ein Rohwarentermingeschäft auf EUAs, European Style. Lieferung Mitte Dezember 2026 für 20.000 Stück. Die Risikolinie kalkulieren wir mit 20% vom Volumen (ca. 296.000 EUR Risikolimitauslastung bei 1.48 Mio EUR Gesamtvolumen). Unsere Marge liegt zielgerichtet bei 4% auf das Aval (ca. 2,96 EUR/EUA auf den Terminpreis)."
                },
                {
                    keywords: ["diesel", "gasoil", "lkw", "flotte"],
                    topicSentence: "diesel gasoil ice abstimmung logistik",
                    answer: "Trader: Zur Absicherung der Dieselflotte (ICE Gasoil) im zweiten Halbjahr benötigen wir zuerst das genaue Volumen. Wie viel Tonnen verbraucht die Flotte im Monat?"
                },
                {
                    keywords: ["135000", "135.000", "liter", "114", "tonnen"],
                    topicSentence: "114 tonnen 135000 liter asian style gasoil absicherung",
                    answer: "Trader: Richtig kalkuliert (135.000 Liter / 1.183 = ca. 114 Tonnen p.m.). Wir offerieren ein Sammel-Rohwarentermingeschäft auf Gasoil, Asian Style mit monatlichem Settlement. Start Juli 2026 – einschließlich Dez 2026 mit 114 mt pro Monat. Unser Terminkurs ist 757 EUR/mt. Die Risikolinie beträgt 20% (ca. 103.500 EUR aus 517.788 EUR Nominal). Unsere Marge liegt bei 8% auf das Aval (ca. 12 EUR/mt auf den Terminpreis)."
                }
            ],
            fallback: "Trader: Bitte spezifizieren Sie Ihre Parameter. Wenn Sie Kupfer-Sicherungen für das Vonovia Projekt, EUAs für das Kraftwerk oder Gasoil für die Dieselflotte anfragen, benötige ich Laufzeiten, Tonnagen oder Angaben zur Zuteilung."
        }'''

# Replace questions
old_q_start = '    // ---- AUFGABENSTELLUNG ----\n    questions: ['
old_q_end = '        }\n    ]'

new_q_str = '''    // ---- AUFGABENSTELLUNG ----
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
    ]'''

def replace_between(text, start, end, new_text):
    idx1 = text.find(start)
    idx2 = text.find(end, idx1) + len(end)
    if idx1 != -1 and idx2 != -1:
        return text[:idx1] + new_text + text[idx2:]
    return text

content = replace_between(content, old_bank_start, old_bank_end, new_bank_str)
content = replace_between(content, old_q_start, old_q_end, new_q_str)

with open('data.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Replaced!")
