import re

with open('admin.html', 'r') as f:
    html = f.read()

# Add Chat Type Toggle to the Chat panel
chat_header_replacement = """                <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px 24px 0 24px;">
                    <div style="display: flex; gap: 8px;">
                        <button id="btn-chat-bank" class="btn btn-primary" style="padding: 4px 10px; font-size: 0.8rem;" onclick="switchAdminChatType('bank')">Bank</button>
                        <button id="btn-chat-unternehmen" class="btn btn-secondary" style="padding: 4px 10px; font-size: 0.8rem;" onclick="switchAdminChatType('unternehmen')">Unternehmen</button>
                    </div>
                    <button class="btn btn-secondary" style="padding: 4px 10px; font-size: 0.8rem; color: var(--brand-red); border-color: var(--brand-red);" onclick="clearAdminChat()">Chat leeren</button>
                </div>"""

html = re.sub(r'                <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px 24px 0 24px;">\n                    <h3 style="margin: 0;">Bank-Händler Chat</h3>\n                    <button class="btn btn-secondary" style="padding: 4px 10px; font-size: 0.8rem; color: var(--brand-red); border-color: var(--brand-red);" onclick="clearAdminChat\(\)">Chat leeren</button>\n                </div>', chat_header_replacement, html)


# Add Templates area next to the Chat input (or inside the chat panel)
templates_ui = """
                    <div class="chat-templates" style="padding: 12px 24px; background: #F0F4F8; border-top: 1px solid var(--border);">
                        <strong style="font-size:0.8rem;">Vorlagen (Schnellantworten):</strong>
                        <div id="admin-templates-container" style="display:flex; gap:8px; margin-top:8px; overflow-x:auto;">
                            <button class="btn btn-secondary" style="font-size:0.7rem; padding:4px 8px;" onclick="addTemplate()">+ Neue Vorlage</button>
                        </div>
                    </div>
                    <div class="chat-input-area">"""

html = re.sub(r'                    <div class="chat-input-area">', templates_ui, html)


# Add Archive Button to topbar
html = re.sub(r'<button class="btn btn-secondary" onclick="window\.location\.reload\(\)">Abmelden</button>', '<button class="btn btn-secondary" onclick="archiveSession()" style="margin-right: 8px;">Session speichern</button>\n            <button class="btn btn-secondary" onclick="window.location.reload()">Abmelden</button>', html)

with open('admin.html', 'w') as f:
    f.write(html)
print("admin.html patched")
