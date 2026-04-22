import re

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Remove Bank Chat Navigation Button
text = text.replace('<button class="nav-btn" onclick="switchTab(\'tab-chat-bank\')">Chat: Handel (Bank)</button>', '')

# 2. Add ID/class to buttons to hide them initially, including Unternehmens-Chat
text = text.replace('<button class="nav-btn" onclick="switchTab(\'tab-products\')">Produkte</button>', '<button id="nav-produkte" class="nav-btn" style="display: none;" onclick="switchTab(\'tab-products\')">Produkte</button>')
text = text.replace('<button class="nav-btn" onclick="switchTab(\'tab-bilanz\')">Jahresabschluss</button>', '<button id="nav-bilanz" class="nav-btn" style="display: none;" onclick="switchTab(\'tab-bilanz\')">Jahresabschluss</button>')
text = text.replace('<button class="nav-btn" onclick="switchTab(\'tab-lagebericht\')">Lagebericht</button>', '<button id="nav-lagebericht" class="nav-btn" style="display: none;" onclick="switchTab(\'tab-lagebericht\')">Lagebericht</button>')
text = text.replace('<button class="nav-btn" onclick="switchTab(\'tab-market\')">Marktdaten</button>', '<button id="nav-marktdaten" class="nav-btn" style="display: none;" onclick="switchTab(\'tab-market\')">Marktdaten</button>')
text = text.replace('<button class="nav-btn" onclick="switchTab(\'tab-chat-unternehmen\')">Chat: Kundenunternehmen</button>', '<button id="nav-chat-unternehmen" class="nav-btn" style="display: none;" onclick="switchTab(\'tab-chat-unternehmen\')">Chat: Kundenunternehmen</button>')
text = text.replace('<button class="nav-btn student-only" onclick="switchTab(\'tab-task\')">Risikoanalyse</button>', '<button id="nav-aufgaben" class="nav-btn student-only" style="display: none;" onclick="switchTab(\'tab-task\')">Risikoanalyse</button>')


# 3. Add checkboxes in admin-config-area (again)
old_admin = """                <h3 style="color: var(--brand-red); font-size: 1rem; margin-bottom: 12px;">Gruppenkonfiguration</h3>
                <label style="font-size: 0.85rem; color: var(--text-primary); display: block; margin-bottom: 8px;">Wie viele Gruppen nehmen teil (1-12)?</label>
                <div style="display: flex; gap: 8px;">
                    <input type="number" id="group-count-input" min="1" max="12" value="4" style="width: 80px; padding: 8px; border: 1px solid var(--border); border-radius: var(--radius-md);">
                    <button class="btn btn-primary" onclick="saveGroupConfig()">Übernehmen & Speichern</button>
                </div>"""

new_admin = """                <h3 style="color: var(--brand-red); font-size: 1rem; margin-bottom: 12px;">Gruppenkonfiguration</h3>
                <label style="font-size: 0.85rem; color: var(--text-primary); display: block; margin-bottom: 8px;">Wie viele Gruppen nehmen teil (1-12)?</label>
                <div style="display: flex; gap: 8px;">
                    <input type="number" id="group-count-input" min="1" max="12" value="4" style="width: 80px; padding: 8px; border: 1px solid var(--border); border-radius: var(--radius-md);">
                    <button class="btn btn-primary" onclick="saveGroupConfig()">Übernehmen & Speichern</button>
                </div>
                
                <hr style="border: none; border-top: 1px solid #FED7D7; margin: 16px 0;">
                <h3 style="color: var(--brand-red); font-size: 1rem; margin-bottom: 12px;">Regiepult (Live-Freischaltung)</h3>
                <div style="display: flex; flex-direction: column; gap: 8px; font-size: 0.9rem;">
                    <label><input type="checkbox" id="check-produkte" onchange="saveRegieConfig()"> Reiter "Produkte" freischalten</label>
                    <label><input type="checkbox" id="check-bilanz" onchange="saveRegieConfig()"> Reiter "Jahresabschluss" freischalten</label>
                    <label><input type="checkbox" id="check-lagebericht" onchange="saveRegieConfig()"> Reiter "Lagebericht" freischalten</label>
                    <label><input type="checkbox" id="check-marktdaten" onchange="saveRegieConfig()"> Reiter "Marktdaten" freischalten</label>
                    <label><input type="checkbox" id="check-chat" onchange="saveRegieConfig()"> Reiter "Chat (Kundenunternehmen)" freischalten</label>
                    <label><input type="checkbox" id="check-aufgaben" onchange="saveRegieConfig()"> Reiter "Aufgaben" freischalten</label>
                </div>"""

text = text.replace(old_admin, new_admin)

# 4. Remove Bank Chat DOM element entirely
text = re.sub(r'<!-- TAB: CHAT BANK -->.*?<!-- TAB: TASK / AUFGABEN -->', '<!-- TAB: TASK / AUFGABEN -->', text, flags=re.DOTALL)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)

with open('app.js', 'r', encoding='utf-8') as f:
    app_text = f.read()

# Modify App.js to handle Bank Chat removal but keep initChats
save_regie_func = """
function saveRegieConfig() {
    if (typeof db !== 'undefined' && db !== null) {
        const payload = {
            show_produkte: document.getElementById('check-produkte').checked,
            show_bilanz: document.getElementById('check-bilanz').checked,
            show_lagebericht: document.getElementById('check-lagebericht').checked,
            show_marktdaten: document.getElementById('check-marktdaten').checked,
            show_chat: document.getElementById('check-chat').checked,
            show_aufgaben: document.getElementById('check-aufgaben').checked
        };
        db.collection("fallstudie_config").doc("settings").set(payload, { merge: true })
        .then(() => console.log("Regiepult gespeichert"))
        .catch(err => console.error(err));
    }
}
"""
app_text = app_text.replace("function saveGroupConfig() {", save_regie_func + "\nfunction saveGroupConfig() {")

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
                if(document.getElementById('nav-chat-unternehmen')) document.getElementById('nav-chat-unternehmen').style.display = data.show_chat ? 'block' : 'none';
                if(document.getElementById('nav-aufgaben')) document.getElementById('nav-aufgaben').style.display = data.show_aufgaben ? 'block' : 'none';
                
                // Admin Toggle-Buttons synchronisieren
                if (document.getElementById("check-produkte")) {
                    document.getElementById('check-produkte').checked = !!data.show_produkte;
                    document.getElementById('check-bilanz').checked = !!data.show_bilanz;
                    document.getElementById('check-lagebericht').checked = !!data.show_lagebericht;
                    document.getElementById('check-marktdaten').checked = !!data.show_marktdaten;
                    document.getElementById('check-chat').checked = !!data.show_chat;
                    document.getElementById('check-aufgaben').checked = !!data.show_aufgaben;
                }
                
                window.configLoaded = true;
            }
        });"""

app_text = app_text.replace(existing_snapshot, new_snapshot)

# Update initChats to avoid errors on missing Bank UI while keeping Unternehmen UI init
init_chats_replacement = """function initChats() {
    const ucContainer = document.getElementById('unternehmen-chat-messages');
    
    // Fill initial contact details
    ['unternehmen'].forEach(contactId => {
        const d = companyData.chatContacts[contactId];
        document.getElementById(contactId+'-chat-name').innerText = d.name;
        document.getElementById(contactId+'-chat-role').innerText = d.role;
        document.getElementById(contactId+'-chat-avatar').innerText = d.avatar;
    });

    addMessage('unternehmen', companyData.chatContacts.unternehmen.greeting, 'bot-msg');
}

function processChatData(contactId, userMsg) {
    if (contactId === 'bank') return; // Bank disabled
"""
app_text = app_text.replace("""function initChats() {
    const ucContainer = document.getElementById('unternehmen-chat-messages');
    const bcContainer = document.getElementById('bank-chat-messages');
    
    // Fill initial contact details
    ['unternehmen', 'bank'].forEach(contactId => {
        const d = companyData.chatContacts[contactId];
        document.getElementById(contactId+'-chat-name').innerText = d.name;
        document.getElementById(contactId+'-chat-role').innerText = d.role;
        document.getElementById(contactId+'-chat-avatar').innerText = d.avatar;
    });

    addMessage('unternehmen', companyData.chatContacts.unternehmen.greeting, 'bot-msg');
    addMessage('bank', companyData.chatContacts.bank.greeting, 'bot-msg');
}

function processChatData(contactId, userMsg) {""", init_chats_replacement)


with open('app.js', 'w', encoding='utf-8') as f:
    f.write(app_text)

print("Restored successfully")

