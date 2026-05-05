import re

with open('admin.js', 'r') as f:
    content = f.read()

# Variables for custom names
if 'let groupNames = {};' not in content:
    content = content.replace('let totalGroups = 4;', 'let totalGroups = 4;\nlet bankChatName = "Handel (Bank)";\nlet groupNames = {};')

# initAdminData to load new settings
target_init = '''unsubGlobal = db.collection("fallstudie_config").doc("settings").onSnapshot(doc => {
        if (doc.exists) {
            totalGroups = doc.data().group_count || 4;'''
replacement_init = '''unsubGlobal = db.collection("fallstudie_config").doc("settings").onSnapshot(doc => {
        if (doc.exists) {
            totalGroups = doc.data().group_count || 4;
            bankChatName = doc.data().bankChatName || "Handel (Bank)";
            groupNames = doc.data().groupNames || {};
            
            const btnBank = document.getElementById("btn-chat-bank");
            if (btnBank) btnBank.innerText = bankChatName;
            
            const bankInput = document.getElementById("bank-chat-name-input");
            if(bankInput) bankInput.value = bankChatName;
            
            const checkBankChat = document.getElementById("check-bank-chat");
            if(checkBankChat) checkBankChat.nextSibling.textContent = " Chat: " + bankChatName;
'''
content = content.replace(target_init, replacement_init)

# updateTotalGroups to include bankChatName and updateBankChatName function
target_update_groups = '''function updateTotalGroups() {
    if(!db) return;
    const input = document.getElementById("group-count-input");
    const count = input ? (parseInt(input.value) || 4) : 4;
    db.collection("fallstudie_config").doc("settings").set({ group_count: count }, { merge: true });
}'''
replacement_update_groups = '''function updateTotalGroups() {
    if(!db) return;
    const input = document.getElementById("group-count-input");
    const count = input ? (parseInt(input.value) || 4) : 4;
    db.collection("fallstudie_config").doc("settings").set({ group_count: count }, { merge: true });
}

function updateBankChatName() {
    if(!db) return;
    const input = document.getElementById("bank-chat-name-input");
    if(input) {
        db.collection("fallstudie_config").doc("settings").set({ bankChatName: input.value }, { merge: true });
    }
}

function saveCustomGroupName() {
    if(!db) return;
    const input = document.getElementById("custom-group-name-input");
    if(input) {
        const customName = input.value.trim();
        groupNames[currentAdminGroup] = customName || currentAdminGroup;
        db.collection("fallstudie_config").doc("settings").set({ groupNames: groupNames }, { merge: true });
    }
}
'''
if 'function updateBankChatName()' not in content:
    content = content.replace(target_update_groups, replacement_update_groups)

# Update renderGroupTabs
target_render_tabs = '''for (let i = 1; i <= totalGroups; i++) {
        const name = `Gruppe ${i}`;
        const isActive = name === currentAdminGroup;'''
replacement_render_tabs = '''for (let i = 1; i <= totalGroups; i++) {
        const name = `Gruppe ${i}`;
        const displayName = groupNames[name] || name;
        const isActive = name === currentAdminGroup;'''
content = content.replace(target_render_tabs, replacement_render_tabs)
content = content.replace('''${name}</button>`;''', '''${displayName}</button>`;''')

# Update switchGroupContext
target_switch_context = '''const title = document.getElementById("current-group-title");
    if(title) title.innerText = `Regie: ${groupName}`;
    document.querySelectorAll(".active-group-name").forEach(el => el.innerText = groupName);'''
replacement_switch_context = '''const displayName = groupNames[groupName] || groupName;
    const title = document.getElementById("current-group-title");
    if(title) title.innerText = `Regie: ${displayName}`;
    document.querySelectorAll(".active-group-name").forEach(el => el.innerText = displayName);
    
    const input = document.getElementById("custom-group-name-input");
    if(input) input.value = groupNames[groupName] && groupNames[groupName] !== groupName ? groupNames[groupName] : "";'''
content = content.replace(target_switch_context, replacement_switch_context)


# Update loadSessionState to show/hide export button
target_session_state = '''btn.innerText = "Session beenden";
        } else {
            activeSessionId = null;'''
replacement_session_state = '''btn.innerText = "Session beenden";
            const exportBtn = document.getElementById("btn-export-session");
            if(exportBtn) exportBtn.style.display = "inline-block";
        } else {
            activeSessionId = null;
            const exportBtn = document.getElementById("btn-export-session");
            if(exportBtn) exportBtn.style.display = "none";'''
content = content.replace(target_session_state, replacement_session_state)


# Add PDF Export function to loadSessionList
target_load_session_list = '''<button class="btn btn-secondary" onclick="loadSession('${doc.id}')">Laden</button>
                    <button class="btn btn-secondary" style="color:#ef4444;" onclick="deleteSession('${doc.id}')">✕</button>'''
replacement_load_session_list = '''<button class="btn btn-secondary" onclick="loadSession('${doc.id}')">Laden</button>
                    <button class="btn btn-secondary" onclick="exportArchivedSessionPDF('${doc.id}', '${escapeHtml(d.name)}')">PDF</button>
                    <button class="btn btn-secondary" style="color:#ef4444;" onclick="deleteSession('${doc.id}')">✕</button>'''
content = content.replace(target_load_session_list, replacement_load_session_list)


# Add PDF generation functions
pdf_functions = '''

async function exportActiveSessionPDF() {
    if(!activeSessionId) return alert("Keine aktive Session.");
    const ind = document.getElementById("session-indicator");
    const sessionName = ind ? ind.innerText : "Active_Session";
    
    // Save current state first to ensure we have latest data
    await saveSessionData(activeSessionId);
    exportArchivedSessionPDF(activeSessionId, sessionName);
}

async function exportArchivedSessionPDF(sessionId, sessionName) {
    const btn = event ? event.target : null;
    if(btn) btn.innerText = "Exporting...";
    
    try {
        const doc = await db.collection("archived_sessions").doc(sessionId).get();
        if(!doc.exists) {
            alert("Session nicht gefunden.");
            if(btn) btn.innerText = "PDF";
            return;
        }
        
        const data = doc.data().data;
        if(!data) {
            alert("Keine Daten in Session.");
            if(btn) btn.innerText = "PDF";
            return;
        }

        // Create invisible container
        const container = document.createElement("div");
        container.style.padding = "40px";
        container.style.fontFamily = "Inter, sans-serif";
        container.style.color = "#2D3748";
        
        let html = `<h1 style="color:#E60000; border-bottom:2px solid #E2E8F0; padding-bottom:10px;">Session Report: ${sessionName}</h1>`;
        
        for (let i = 1; i <= totalGroups; i++) {
            const gName = `Gruppe ${i}`;
            const dispName = groupNames[gName] || gName;
            const gData = data[gName];
            if(!gData) continue;
            
            html += `<h2 style="margin-top:40px; background:#F4F5F7; padding:10px; border-radius:8px;">${dispName}</h2>`;
            
            // Aufgaben
            html += `<h3>Aufgaben-Erfassung</h3>`;
            const erg = gData.ergebnisse || {};
            let hasErg = false;
            for (let k in erg) {
                if(k === "gruppe" || k === "timestamp") continue;
                hasErg = true;
                html += `<div><strong>${k.toUpperCase()}:</strong><p style="white-space:pre-wrap; margin-top:5px; background:#fff; border:1px solid #E2E8F0; padding:10px; border-radius:6px;">${erg[k] || "-"}</p></div>`;
            }
            if(!hasErg) html += `<p><i>Keine Ergebnisse</i></p>`;
            
            // Bank Chat
            html += `<h3>Chat: ${bankChatName}</h3>`;
            const bMsgs = (gData.bankChat || {}).messages || [];
            if(bMsgs.length > 0) {
                html += `<div style="border:1px solid #E2E8F0; border-radius:6px; padding:10px;">`;
                bMsgs.forEach(m => {
                    const time = m.time ? new Date(m.time).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : "";
                    const sender = m.sender === "bank" ? bankChatName : dispName;
                    html += `<p style="margin:5px 0;"><strong>${sender} <span style="font-size:0.8em; color:#718096;">[${time}]</span>:</strong> ${m.text}</p>`;
                });
                html += `</div>`;
            } else {
                html += `<p><i>Keine Nachrichten</i></p>`;
            }
            
            // Unternehmen Chat
            html += `<h3>Chat: Kundenunternehmen</h3>`;
            const uMsgs = (gData.unternehmenChat || {}).messages || [];
            if(uMsgs.length > 0) {
                html += `<div style="border:1px solid #E2E8F0; border-radius:6px; padding:10px;">`;
                uMsgs.forEach(m => {
                    const time = m.time ? new Date(m.time).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : "";
                    const sender = m.sender === "unternehmen" ? "Kunde" : dispName;
                    html += `<p style="margin:5px 0;"><strong>${sender} <span style="font-size:0.8em; color:#718096;">[${time}]</span>:</strong> ${m.text}</p>`;
                });
                html += `</div>`;
            } else {
                html += `<p><i>Keine Nachrichten</i></p>`;
            }
            
            html += `<hr style="border:0; border-top:1px dashed #E2E8F0; margin-top:30px;">`;
        }
        
        container.innerHTML = html;
        document.body.appendChild(container);
        
        const opt = {
            margin:       10,
            filename:     `Session_Report_${sessionName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2 },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        
        await html2pdf().set(opt).from(container).save();
        
        document.body.removeChild(container);
        if(btn) btn.innerText = "PDF";
        
    } catch(err) {
        console.error("PDF Export Error:", err);
        alert("Fehler beim PDF Export: " + err.message);
        if(btn) btn.innerText = "PDF";
    }
}
'''
if 'function exportArchivedSessionPDF' not in content:
    content += pdf_functions

with open('admin.js', 'w') as f:
    f.write(content)

