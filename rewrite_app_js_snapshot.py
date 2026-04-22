import re

with open('app.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace the old onSnapshot in app.js
old_snapshot_block_regex = r'// Regiepult updates für Studenten.*?window\.configLoaded = true;\n\s*}\n\s*}\);'
old_snapshot_match = re.search(old_snapshot_block_regex, text, flags=re.DOTALL)

# Re-structuring the login event to bind the newly minted listener
old_loginA = """    if(role !== "Dozent" && typeof db !== 'undefined' && db !== null) {
        db.collection("chat_rooms").doc(role).onSnapshot(doc => {
            if(doc.exists) {
                renderBankChat(doc.data().messages || []);
            }
        });
    }"""

new_loginA = """    if(role !== "Dozent" && typeof db !== 'undefined' && db !== null) {
        db.collection("chat_rooms").doc(role).onSnapshot(doc => {
            if(doc.exists) renderBankChat(doc.data().messages || []);
        });
        
        // Listen to per-group config
        db.collection("group_controls").doc(role).onSnapshot(doc => {
            if(doc.exists) {
                const data = doc.data();
                if(document.getElementById('nav-produkte')) document.getElementById('nav-produkte').style.display = data.show_produkte ? 'block' : 'none';
                if(document.getElementById('nav-bilanz')) document.getElementById('nav-bilanz').style.display = data.show_bilanz ? 'block' : 'none';
                if(document.getElementById('nav-lagebericht')) document.getElementById('nav-lagebericht').style.display = data.show_lagebericht ? 'block' : 'none';
                if(document.getElementById('nav-marktdaten')) document.getElementById('nav-marktdaten').style.display = data.show_marktdaten ? 'block' : 'none';
                if(document.getElementById('nav-chat-unternehmen')) document.getElementById('nav-chat-unternehmen').style.display = data.show_chat ? 'block' : 'none';
                if(document.getElementById('nav-chat-bank')) document.getElementById('nav-chat-bank').style.display = data.show_bank_chat ? 'block' : 'none';
                if(document.getElementById('nav-aufgaben')) document.getElementById('nav-aufgaben').style.display = data.show_aufgaben ? 'block' : 'none';
                
                // Force Navigation
                if (data.force_tab && data.force_time && data.force_time > (window.lastForceTime || 0)) {
                    window.lastForceTime = data.force_time;
                    switchTab(data.force_tab);
                }
            }
        });
    }"""
text = text.replace(old_loginA, new_loginA)

# Remove the old global settings snapshot config layout in app.js
text = re.sub(r'// Regiepult updates für Studenten.*?window\.configLoaded = true;\n\s*}\n\s*}\);', 'window.configLoaded = true;\n            }\n        });', text, flags=re.DOTALL)

with open('app.js', 'w', encoding='utf-8') as f:
    f.write(text)

print("App.js changed")
