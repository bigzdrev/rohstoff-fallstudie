import re

with open('admin.html', 'r') as f:
    content = f.read()

# 1. Include html2pdf.js
if 'html2pdf.bundle.min.js' not in content:
    content = content.replace('</body>', '    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>\n</body>')

# 2. Add Bank Chat Name input in Globale Settings
if 'id="bank-chat-name-input"' not in content:
    target_settings = '''<label style="font-size: 0.8rem; color: var(--admin-text-muted); display: block; margin-top: 16px;">Gruppenanzahl</label>
                        <div style="display: flex; gap: 8px; margin-top: 8px;">
                            <input type="number" id="group-count-input" min="1" max="12" value="4" style="width: 65px; padding: 10px; background: #f1f5f9; border: 1px solid var(--admin-border); border-radius: 8px; color: var(--admin-text);">
                            <button class="btn btn-secondary" style="padding: 10px 14px; font-size:0.8rem;" onclick="updateTotalGroups()">SET</button>
                        </div>'''
    
    replacement_settings = '''<label style="font-size: 0.8rem; color: var(--admin-text-muted); display: block; margin-top: 16px;">Gruppenanzahl</label>
                        <div style="display: flex; gap: 8px; margin-top: 8px;">
                            <input type="number" id="group-count-input" min="1" max="12" value="4" style="width: 65px; padding: 10px; background: #f1f5f9; border: 1px solid var(--admin-border); border-radius: 8px; color: var(--admin-text);">
                            <button class="btn btn-secondary" style="padding: 10px 14px; font-size:0.8rem;" onclick="updateTotalGroups()">SET</button>
                        </div>
                        
                        <label style="font-size: 0.8rem; color: var(--admin-text-muted); display: block; margin-top: 16px;">Bank-Chat Name</label>
                        <div style="display: flex; gap: 8px; margin-top: 8px;">
                            <input type="text" id="bank-chat-name-input" value="Handel (Bank)" style="flex: 1; padding: 10px; background: #f1f5f9; border: 1px solid var(--admin-border); border-radius: 8px; color: var(--admin-text);">
                            <button class="btn btn-secondary" style="padding: 10px 14px; font-size:0.8rem;" onclick="updateBankChatName()">SET</button>
                        </div>'''
    content = content.replace(target_settings, replacement_settings)

# 3. Add Custom Group Name input in Regie Sidebar
if 'id="custom-group-name-input"' not in content:
    target_regie = '''<h3 id="current-group-title" style="color: var(--brand-red); font-size: 1.1rem; font-weight: 800; margin-bottom: 16px;">Regie: Gruppe X</h3>'''
    
    replacement_regie = '''<h3 id="current-group-title" style="color: var(--brand-red); font-size: 1.1rem; font-weight: 800; margin-bottom: 8px;">Regie: Gruppe X</h3>
                        <div style="display: flex; gap: 8px; margin-bottom: 16px;">
                            <input type="text" id="custom-group-name-input" placeholder="Gruppenname ändern" style="flex: 1; padding: 6px 10px; font-size: 0.85rem; background: #f1f5f9; border: 1px solid var(--admin-border); border-radius: 6px; color: var(--admin-text);" onkeydown="if(event.key==='Enter') saveCustomGroupName()">
                            <button class="btn btn-secondary" style="padding: 6px 10px; font-size:0.8rem;" onclick="saveCustomGroupName()">SET</button>
                        </div>'''
    content = content.replace(target_regie, replacement_regie)

# 4. Add Export active session button
if 'id="btn-export-session"' not in content:
    target_session_bar = '''<button class="btn btn-secondary" onclick="openSessionManager()">Sessions</button>'''
    replacement_session_bar = '''<button class="btn btn-secondary" onclick="openSessionManager()">Sessions</button>\n                <button class="btn btn-secondary" id="btn-export-session" onclick="exportActiveSessionPDF()" style="display:none; color: var(--brand-red); border-color: rgba(185, 28, 28, 0.2);">PDF Export</button>'''
    content = content.replace(target_session_bar, replacement_session_bar)


with open('admin.html', 'w') as f:
    f.write(content)

