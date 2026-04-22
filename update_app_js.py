import re

with open('app.js', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Provide saveRegieConfig function logic and update onSnapshot
save_regie_func = """
function saveRegieConfig() {
    if (typeof db !== 'undefined' && db !== null) {
        const payload = {
            show_produkte: document.getElementById('check-produkte').checked,
            show_bilanz: document.getElementById('check-bilanz').checked,
            show_lagebericht: document.getElementById('check-lagebericht').checked,
            show_marktdaten: document.getElementById('check-marktdaten').checked,
            show_aufgaben: document.getElementById('check-aufgaben').checked
        };
        db.collection("fallstudie_config").doc("settings").set(payload, { merge: true })
        .then(() => console.log("Regiepult gespeichert"))
        .catch(err => console.error(err));
    }
}
"""

text = text.replace("function saveGroupConfig() {", save_regie_func + "\nfunction saveGroupConfig() {")

# 2. Update onSnapshot logic (end of file)
existing_snapshot = """        db.collection("fallstudie_config").doc("settings").onSnapshot(doc => {
            if (doc.exists && doc.data().group_count) {
                renderDynamicButtons(doc.data().group_count);
                window.configLoaded = true;
            }
        });"""

new_snapshot = """        db.collection("fallstudie_config").doc("settings").onSnapshot(doc => {
            if (doc.exists) {
                const data = doc.data();
                if (data.group_count) {
                    renderDynamicButtons(data.group_count);
                }
                
                // Regiepult updates für Studenten & Laptops (UI Toggle)
                if(document.getElementById('nav-produkte')) document.getElementById('nav-produkte').style.display = data.show_produkte ? 'block' : 'none';
                if(document.getElementById('nav-bilanz')) document.getElementById('nav-bilanz').style.display = data.show_bilanz ? 'block' : 'none';
                if(document.getElementById('nav-lagebericht')) document.getElementById('nav-lagebericht').style.display = data.show_lagebericht ? 'block' : 'none';
                if(document.getElementById('nav-marktdaten')) document.getElementById('nav-marktdaten').style.display = data.show_marktdaten ? 'block' : 'none';
                if(document.getElementById('nav-aufgaben')) document.getElementById('nav-aufgaben').style.display = data.show_aufgaben ? 'block' : 'none';
                
                // Admin Toggle-Buttons synchronisieren
                if (document.getElementById("check-produkte")) {
                    document.getElementById('check-produkte').checked = !!data.show_produkte;
                    document.getElementById('check-bilanz').checked = !!data.show_bilanz;
                    document.getElementById('check-lagebericht').checked = !!data.show_lagebericht;
                    document.getElementById('check-marktdaten').checked = !!data.show_marktdaten;
                    document.getElementById('check-aufgaben').checked = !!data.show_aufgaben;
                }
                
                window.configLoaded = true;
            }
        });"""

text = text.replace(existing_snapshot, new_snapshot)

# 3. Clean up old Chat AI module imports and functions to make the app lighter
# We just replace the CHAT SYSTEM LOGIC with nothing.
text = re.sub(r'// ============================================================\n// CHAT SYSTEM LOGIC \(KI \/ NLP\)\n// ============================================================.*', '', text, flags=re.DOTALL)

# Delete 'try { initChats(); } catch(e) { console.error("chat:", e); }'
text = text.replace('try { initChats(); } catch(e) { console.error("chat:", e); }', '')
text = text.replace('import { pipeline, env } from "https://cdn.jsdelivr.net/npm/@xenova/transformers@2.6.0";', '')
text = text.replace('env.allowLocalModels = false;', '')

with open('app.js', 'w', encoding='utf-8') as f:
    f.write(text)

print("App modified successfully")
