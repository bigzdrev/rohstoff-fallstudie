import re
with open('data.js', 'r', encoding='utf-8') as f:
    text = f.read()

replacements = {
    'ueber': 'über',
    'verlaesslicher': 'verlässlicher',
    'fuer': 'für',
    'Wertschoepfung': 'Wertschöpfung',
    'schaetzen': 'schätzen',
    'Faehigkeit': 'Fähigkeit',
    'Rueck': 'Rück',
    'rueck': 'rück',
    'großraeumiges': 'großräumiges',
    'ermoeglicht': 'ermöglicht',
    'Verfuegbarkeit': 'Verfügbarkeit',
    'Vermoegensgegenstaende': 'Vermögensgegenstände',
    'Vermoegen': 'Vermögen',
    'Grundstuecke': 'Grundstücke',
    'Geschaeftsausstattung': 'Geschäftsausstattung',
    'Vorraete': 'Vorräte',
    'Geschaefts': 'Geschäfts',
    'geschaeft': 'geschäft',
    'Ruecklagen': 'Rücklagen',
    'rueckstellungen': 'rückstellungen',
    'gewoehnlichen': 'gewöhnlichen',
    'Jahresueberschuss': 'Jahresüberschuss',
    'gepraegt': 'geprägt',
    'schwaechen': 'schwächen',
    'Umsatzerloese': 'Umsatzerlöse',
    'Wettbewerbsfaehigkeit': 'Wettbewerbsfähigkeit',
    'groesster': 'größter',
    'faellt': 'fällt',
    'Europaeische': 'Europäische',
    'spaetestens': 'spätestens',
    'grundsaetzlich': 'grundsätzlich',
    'moegliche': 'mögliche',
    'Termingeschafte': 'Termingeschäfte',
    'koennen': 'können',
    'Buro': 'Büro',
    'jaehrlich': 'jährlich',
    'Boerse': 'Börse',
    'Riesenthema': 'Riesenthema',
    'Waerme': 'Wärme',
    'Abwaerts': 'Abwärts',
    'Aufwaerts': 'Aufwärts',
    'groessten': 'größten',
    'schwaecher': 'schwächer',
    'abhaengig': 'abhängig',
    'muessen': 'müssen', 
    'Urspruenglichen': 'Ursprünglichen'
}

for k, v in replacements.items():
    text = text.replace(k, v)
    text = text.replace(k.capitalize(), v.capitalize())

with open('data.js', 'w', encoding='utf-8') as f:
    f.write(text)

print("Done")
