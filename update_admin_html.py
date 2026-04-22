import re

with open('admin.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Add group tabs navigation
old_header = """        <header class="topbar">
            <h1>Regiepult & Monitoring</h1>
            <button class="btn btn-secondary" onclick="window.location.reload()">Abmelden</button>
        </header>"""

new_header = """        <header class="topbar">
            <h1 style="margin-right: 20px;">Dozenten-Cockpit</h1>
            <div id="admin-group-tabs" style="display: flex; gap: 4px; overflow-x: auto; flex: 1; padding: 0 10px;">
                <!-- Group tabs injected here -->
            </div>
            <button class="btn btn-secondary" onclick="window.location.reload()">Abmelden</button>
        </header>"""

text = text.replace(old_header, new_header)

# Modify left layout to add "active group" title and remove dropdown for chat (because chat is inherently tied to the active group tab)
old_left = """            <!-- LEFT: Regiepult & Settings -->
            <div style="flex: 1; display: flex; flex-direction: column; gap: 24px; overflow-y: auto;">
                <div class="glass-panel" style="padding: 24px;">
                    <h3>Allgemeine Einstellungen</h3>
                    <div style="margin-top: 16px;">
                        <label style="font-size: 0.85rem; color: var(--text-primary);">Anzahl Kleingruppen (1-12)</label>
                        <div style="display: flex; gap: 8px; margin-top: 8px;">
                            <input type="number" id="group-count-input" min="1" max="12" value="4" class="sidebar-input" style="width: 80px;">
                            <button class="btn btn-secondary" onclick="updateTotalGroups()">Übernehmen</button>
                        </div>
                    </div>
                </div>

                <div class="glass-panel" style="padding: 24px;">
                    <h3>Live-Übertragung (Menü-Tabs der Studenten)</h3>
                    <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 16px;">Decken Sie durch Anhaken die Reiter bei allen Gruppen auf.</p>
                    <div style="display: flex; flex-direction: column; gap: 12px; font-size: 0.95rem;">
                        <label><input type="checkbox" id="check-produkte" onchange="saveGroupSettings()"> Produkte</label>
                        <label><input type="checkbox" id="check-bilanz" onchange="saveGroupSettings()"> Jahresabschluss</label>
                        <label><input type="checkbox" id="check-lagebericht" onchange="saveGroupSettings()"> Lagebericht</label>
                        <label><input type="checkbox" id="check-marktdaten" onchange="saveGroupSettings()"> Marktdaten</label>
                        <label><input type="checkbox" id="check-chat" onchange="saveGroupSettings()"> Chat: Kundenunternehmen</label>
                        <label><input type="checkbox" id="check-bank-chat" onchange="saveGroupSettings()"> Chat: Handel (Bank)</label>
                        <label><input type="checkbox" id="check-aufgaben" onchange="saveGroupSettings()"> Aufgaben (Risikoanalyse)</label>
                    </div>
                </div>

                <div class="glass-panel" style="padding: 24px; flex: 1; display: flex; flex-direction: column;">
                    <h3>Bank-Händler Chat</h3>
                    <div style="margin: 16px 0;">
                        <label style="font-size: 0.85rem;">Gruppe auswählen:</label>
                        <select id="chat-group-selector" class="sidebar-input" onchange="switchAdminChat()"></select>
                    </div>
                    <div class="chat-container" style="flex: 1; margin-top: 0; min-height: 250px;">
                        <div class="chat-messages" id="admin-chat-messages"></div>
                        <div class="chat-input-area">
                            <input type="text" id="admin-chat-input" placeholder="Nachricht..." onkeydown="if(event.key==='Enter') sendAdminMessage()">
                            <button onclick="sendAdminMessage()">Senden</button>
                        </div>
                    </div>
                </div>
            </div>"""

new_left = """            <!-- LEFT: Settings -->
            <div style="width: 320px; display: flex; flex-direction: column; gap: 24px; overflow-y: auto;">
                <div class="glass-panel" style="padding: 24px;">
                    <h3>Globale Settings</h3>
                    <label style="font-size: 0.85rem; color: var(--text-primary); display: block; margin-top: 12px;">Anzahl der Gruppen (1-12)</label>
                    <div style="display: flex; gap: 8px; margin-top: 4px;">
                        <input type="number" id="group-count-input" min="1" max="12" value="4" class="sidebar-input" style="width: 80px;">
                        <button class="btn btn-secondary" style="padding: 4px 8px; font-size:0.8rem;" onclick="updateTotalGroups()">Speichern</button>
                    </div>
                </div>
                
                <div class="glass-panel" style="padding: 24px; flex: 1; border-color: var(--brand-red);">
                    <h3 id="current-group-title" style="color: var(--brand-red);">Regiepult: Gruppe X</h3>
                    <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 16px;">Setzen Sie Hooks, um für diese Gruppe Menü-Tabs freizuschalten. Die Schüler werden sofort zum aktivierten Tab "gezwungen".</p>
                    <div style="display: flex; flex-direction: column; gap: 12px; font-size: 0.95rem;">
                        <label><input type="checkbox" id="check-produkte" onchange="saveGroupSettings('tab-products')"> Produkte</label>
                        <label><input type="checkbox" id="check-bilanz" onchange="saveGroupSettings('tab-bilanz')"> Jahresabschluss</label>
                        <label><input type="checkbox" id="check-lagebericht" onchange="saveGroupSettings('tab-lagebericht')"> Lagebericht</label>
                        <label><input type="checkbox" id="check-marktdaten" onchange="saveGroupSettings('tab-market')"> Marktdaten</label>
                        <label><input type="checkbox" id="check-chat" onchange="saveGroupSettings('tab-chat-unternehmen')"> Chat: Kunden</label>
                        <label><input type="checkbox" id="check-bank-chat" onchange="saveGroupSettings('tab-chat-bank')"> Chat: Handel (Bank)</label>
                        <label><input type="checkbox" id="check-aufgaben" onchange="saveGroupSettings('tab-task')"> Aufgaben / Risiko</label>
                    </div>
                </div>
            </div>
            
            <!-- MIDDLE: Chat -->
            <div style="flex: 1.2; display: flex; flex-direction: column;" class="glass-panel">
                <h3 style="padding: 16px 24px 0 24px; margin: 0;">Bank-Händler Chat</h3>
                <p style="padding: 0 24px 16px 24px; font-size: 0.8rem; color: var(--text-muted); border-bottom: 1px solid rgba(255,255,255,0.1);">Live-Chat mit <span class="active-group-name">Gruppe X</span></p>
                <div class="chat-container" style="flex: 1; margin: 16px; min-height: 250px;">
                    <div class="chat-messages" id="admin-chat-messages"></div>
                    <div class="chat-input-area">
                        <input type="text" id="admin-chat-input" placeholder="Nachricht an die Gruppe..." onkeydown="if(event.key==='Enter') sendAdminMessage()">
                        <button onclick="sendAdminMessage()">Senden</button>
                    </div>
                </div>
            </div>"""

text = re.sub(r'            <!-- LEFT: Regiepult & Settings -->.*?                </div>\n            </div>', new_left, text, flags=re.DOTALL)


# Update right container to only show specific group
old_right = """            <!-- RIGHT: Monitoring Table -->
            <div style="flex: 2; overflow-y: auto;" class="glass-panel">
                <h3>Live-Erfassungen (Studenten-Eingaben)</h3>
                <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 16px;">Hier erscheinen sofort die Eingaben aus dem Aufgaben-Tab der Gruppen.</p>
                <div id="monitoring-container">
                    <!-- Dynamic monitoring cards will be generated here -->
                </div>
            </div>"""

new_right = """            <!-- RIGHT: Monitoring Table -->
            <div style="flex: 1.5; overflow-y: auto; display: flex; flex-direction: column;" class="glass-panel">
                <h3 style="padding: 16px 24px 0 24px; margin: 0;">Aufgaben-Erfassungen</h3>
                <p style="padding: 0 24px 16px 24px; font-size: 0.8rem; color: var(--text-muted); border-bottom: 1px solid rgba(255,255,255,0.1);">Live-Mitschrift von <span class="active-group-name">Gruppe X</span></p>
                <div id="monitoring-container" style="padding: 24px; white-space: pre-wrap; font-size: 0.85rem; line-height: 1.5; flex: 1;">
                    Wacht auf Eingaben der Gruppe...
                </div>
            </div>"""

text = text.replace(old_right, new_right)


with open('admin.html', 'w', encoding='utf-8') as f:
    f.write(text)

