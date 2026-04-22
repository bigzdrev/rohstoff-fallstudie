import re

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Remove the Interviews section in Sidebar
nav_remove = """                <div style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); font-weight: 700; padding: 16px 16px 4px; margin-top: 8px;">Interviews</div>
                <button class="nav-btn" onclick="switchTab('tab-chat-unternehmen')">Chat: Kundenunternehmen</button>
                <button class="nav-btn" onclick="switchTab('tab-chat-bank')">Chat: Handel (Bank)</button>"""

text = text.replace(nav_remove, "")

# 2. Add ID/class to buttons to hide them initially
text = text.replace('<button class="nav-btn" onclick="switchTab(\'tab-products\')">Produkte</button>', '<button id="nav-produkte" class="nav-btn" style="display: none;" onclick="switchTab(\'tab-products\')">Produkte</button>')
text = text.replace('<button class="nav-btn" onclick="switchTab(\'tab-bilanz\')">Jahresabschluss</button>', '<button id="nav-bilanz" class="nav-btn" style="display: none;" onclick="switchTab(\'tab-bilanz\')">Jahresabschluss</button>')
text = text.replace('<button class="nav-btn" onclick="switchTab(\'tab-lagebericht\')">Lagebericht</button>', '<button id="nav-lagebericht" class="nav-btn" style="display: none;" onclick="switchTab(\'tab-lagebericht\')">Lagebericht</button>')
text = text.replace('<button class="nav-btn" onclick="switchTab(\'tab-market\')">Marktdaten</button>', '<button id="nav-marktdaten" class="nav-btn" style="display: none;" onclick="switchTab(\'tab-market\')">Marktdaten</button>')
text = text.replace('<button class="nav-btn student-only" onclick="switchTab(\'tab-task\')">Risikoanalyse</button>', '<button id="nav-aufgaben" class="nav-btn student-only" style="display: none;" onclick="switchTab(\'tab-task\')">Risikoanalyse</button>')

# 3. Add checkboxes in admin-config-area
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
                    <label><input type="checkbox" id="check-aufgaben" onchange="saveRegieConfig()"> Reiter "Aufgaben" freischalten</label>
                </div>"""

text = text.replace(old_admin, new_admin)


# 4. Remove Chat Tabs entirely by regex
text = re.sub(r'<!-- TAB: CHAT UNTERNEHMEN -->.*?<!-- TAB: TASK / AUFGABEN -->', '<!-- TAB: TASK / AUFGABEN -->', text, flags=re.DOTALL)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)

print("HTML modified successfully")
