let currentAdminGroup = "Gruppe 1";
let activeAdminChatType = "bank";
let totalGroups = 4;
let unsubSettings = null;
let unsubGlobal = null;
let unsubChat = null;
let unsubTasks = null;

document.addEventListener("DOMContentLoaded", () => {
    // Hide dashboard initially
    document.getElementById("dashboard-view").style.display = "none";
});

function loginAdmin() {
    const pw = document.getElementById("admin-password").value;
    if (pw === "ZWRMSVM") {
        document.getElementById("login-view").classList.remove("active");
        document.getElementById("dashboard-view").style.display = "flex";
        initAdminData();
    } else {
        document.getElementById("admin-error").style.display = "block";
    }
}

function initAdminData() {
    loadTemplates();

    if (!db) return alert("Firebase ist nicht geladen/konfiguriert!");

    unsubGlobal = db.collection("fallstudie_config").doc("settings").onSnapshot(doc => {
        if (doc.exists) {
            totalGroups = doc.data().group_count || 4;
            document.getElementById("group-count-input").value = totalGroups;
            renderGroupTabs();
            if(!unsubChat) switchGroupContext(currentAdminGroup);
        } else {
            renderGroupTabs();
            if(!unsubChat) switchGroupContext(currentAdminGroup);
        }
    });
}

function updateTotalGroups() {
    if(!db) return;
    const count = parseInt(document.getElementById("group-count-input").value) || 4;
    db.collection("fallstudie_config").doc("settings").set({ group_count: count }, { merge: true });
}

function renderGroupTabs() {
    const container = document.getElementById("admin-group-tabs");
    container.innerHTML = "";
    
    // Safety check if active group doesn't exist anymore
    let groupNum = parseInt(currentAdminGroup.replace("Gruppe ", "")) || 1;
    if (groupNum > totalGroups) currentAdminGroup = "Gruppe 1";

    for (let i = 1; i <= totalGroups; i++) {
        const name = `Gruppe ${i}`;
        const active = name === currentAdminGroup ? 'background: var(--brand-red); color: white; border-color: var(--brand-red);' : 'background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.2);';
        container.innerHTML += `<button class="btn" style="white-space: nowrap; font-size: 0.8rem; padding: 6px 12px; ${active}" onclick="switchGroupContext('${name}')">${name}</button>`;
    }


}

function switchGroupContext(groupName) {
    currentAdminGroup = groupName;
    renderGroupTabs(); // repopulate styling
    
    document.getElementById("current-group-title").innerText = `Regiepult: ${groupName}`;
    document.querySelectorAll(".active-group-name").forEach(el => el.innerText = groupName);

    bindSettings();
    bindChat();
    bindTasks();
}

function bindSettings() {
    if (unsubSettings) unsubSettings();
    
    // Clear checks
    document.getElementById("check-produkte").checked = false;
    document.getElementById("check-bilanz").checked = false;
    document.getElementById("check-lagebericht").checked = false;
    document.getElementById("check-marktdaten").checked = false;
    document.getElementById("check-chat").checked = false;
    document.getElementById("check-bank-chat").checked = false;
    document.getElementById("check-aufgaben").checked = false;

    unsubSettings = db.collection("group_controls").doc(currentAdminGroup).onSnapshot(doc => {
        if(doc.exists) {
            const d = doc.data();
            document.getElementById("check-produkte").checked = !!d.show_produkte;
            document.getElementById("check-bilanz").checked = !!d.show_bilanz;
            document.getElementById("check-lagebericht").checked = !!d.show_lagebericht;
            document.getElementById("check-marktdaten").checked = !!d.show_marktdaten;
            document.getElementById("check-chat").checked = !!d.show_chat;
            document.getElementById("check-bank-chat").checked = !!d.show_bank_chat;
            document.getElementById("check-aufgaben").checked = !!d.show_aufgaben;
        }
    });
}

function saveGroupSettings(forceTabTarget = null) {
    if(!db) return;
    const payload = {
        show_produkte: document.getElementById("check-produkte").checked,
        show_bilanz: document.getElementById("check-bilanz").checked,
        show_lagebericht: document.getElementById("check-lagebericht").checked,
        show_marktdaten: document.getElementById("check-marktdaten").checked,
        show_chat: document.getElementById("check-chat").checked,
        show_bank_chat: document.getElementById("check-bank-chat").checked,
        show_aufgaben: document.getElementById("check-aufgaben").checked
    };
    
    // Only force navigation if the triggered checkbox is actually ACTIVED (checked).
    // We check this by scanning which key is associated with the forceTabTarget and if it is true.
    let isChecked = false;
    if (forceTabTarget === 'tab-products' && payload.show_produkte) isChecked = true;
    if (forceTabTarget === 'tab-bilanz' && payload.show_bilanz) isChecked = true;
    if (forceTabTarget === 'tab-lagebericht' && payload.show_lagebericht) isChecked = true;
    if (forceTabTarget === 'tab-market' && payload.show_marktdaten) isChecked = true;
    if (forceTabTarget === 'tab-chat-unternehmen' && payload.show_chat) isChecked = true;
    if (forceTabTarget === 'tab-chat-bank' && payload.show_bank_chat) isChecked = true;
    if (forceTabTarget === 'tab-task' && payload.show_aufgaben) isChecked = true;

    if (forceTabTarget && isChecked) {
        payload.force_tab = forceTabTarget;
        payload.force_time = Date.now();
    }

    db.collection("group_controls").doc(currentAdminGroup).set(payload, { merge: true });
}

function bindChat() {
    if (unsubChat) unsubChat();
    const cont = document.getElementById("admin-chat-messages");
    cont.innerHTML = "";

    unsubChat = db.collection("chat_rooms").doc(currentAdminGroup).onSnapshot(doc => {
        if(doc.exists) {
            const msgs = doc.data().messages || [];
            cont.innerHTML = "";
            msgs.forEach(m => {
                const isBot = m.sender === 'bank';
                const senderCls = isBot ? 'chat-user' : 'chat-contact'; // From admin's perspective, they are the 'user' (bank), student is 'contact'
                let timeStr = "";
                if (m.time) {
                    timeStr = new Date(m.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                }
                cont.innerHTML += `<div class="chat-bubble ${senderCls}"><div class="bubble-text">${m.text}<span class="chat-time">${timeStr}</span></div></div>`;
            });
            cont.scrollTo(0, cont.scrollHeight);
        } else {
            cont.innerHTML = "";
        }
    });
}

function sendAdminMessage(templateText = null) {
    const inp = document.getElementById("admin-chat-input");
    const text = templateText || inp.value.trim();
    if(!text || !db) return;
    if(!templateText) inp.value = "";

    const collectionName = activeAdminChatType === "bank" ? "chat_rooms" : "chat_rooms_unternehmen";
    const senderName = activeAdminChatType === "bank" ? "bank" : "unternehmen";

    db.collection(collectionName).doc(currentAdminGroup).get().then(doc => {
        let msgs = doc.exists ? doc.data().messages || [] : [];
        msgs.push({ sender: senderName, text: text, time: Date.now() });
        db.collection(collectionName).doc(currentAdminGroup).set({ messages: msgs });
    });
}

function switchAdminChatType(type) {
    activeAdminChatType = type;
    document.getElementById("btn-chat-bank").className = type === "bank" ? "btn btn-primary" : "btn btn-secondary";
    document.getElementById("btn-chat-unternehmen").className = type === "unternehmen" ? "btn btn-primary" : "btn btn-secondary";
    bindChat();
}

function clearAdminChat() {
    if(!db) return;
    const collectionName = activeAdminChatType === "bank" ? "chat_rooms" : "chat_rooms_unternehmen";
    if(confirm(`Möchtest du den Chat für ${currentAdminGroup} wirklich löschen?`)) {
        db.collection(collectionName).doc(currentAdminGroup).set({ messages: [] }, { merge: true });
    }
}

function bindTasks() {
    if (unsubTasks) unsubTasks();
    const mon = document.getElementById("monitoring-container");
    mon.innerHTML = "Wacht auf Eingaben der Gruppe...";

    unsubTasks = db.collection("fallstudie_ergebnisse").doc(currentAdminGroup).onSnapshot(doc => {
        if(doc.exists) {
            const d = doc.data();
            let html = "";
            let keys = Object.keys(d).sort();
            keys.forEach(k => {
                html += `<div style="background: rgba(0,0,0,0.2); padding: 8px; margin-bottom: 8px; border-radius: 4px;">
                    <span style="color:var(--brand-red); font-weight:600; display:block; margin-bottom:4px;">${k.toUpperCase()}</span>
                    ${d[k] || "-"}
                </div>`;
            });
            mon.innerHTML = html || "Die Gruppe hat noch nichts in den Risiko-Formularen abgespeichert.";
        }
    });
}

function archiveSession() {
    if(!db) return;
    const sessionName = prompt("Name für diese Session (z.B. Kurs vom 22.04.):", "Session " + new Date().toLocaleDateString());
    if(!sessionName) return;

    db.collection("archived_sessions").add({
        name: sessionName,
        date: Date.now(),
        data: "Session data placeholder"
    }).then(() => {
        alert("Session wurde archiviert!");
    });
}

// ===================================
// TEMPLATES
// ===================================
function loadTemplates() {
    if(!db) return;
    db.collection("admin_settings").doc("templates").onSnapshot(doc => {
        const cont = document.getElementById("admin-templates-container");
        if(!cont) return;
        cont.innerHTML = `<button class="btn btn-secondary" style="font-size:0.7rem; padding:4px 8px; flex-shrink:0;" onclick="addTemplate()">+ Neue Vorlage</button>`;
        if(doc.exists && doc.data().items) {
            doc.data().items.forEach((t, index) => {
                const btn = document.createElement("button");
                btn.className = "btn btn-secondary";
                btn.style.cssText = "font-size:0.75rem; padding:4px 8px; flex-shrink:0; max-width: 150px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;";
                btn.innerText = t.title;
                btn.onclick = () => { document.getElementById("admin-chat-input").value = t.text; };
                btn.oncontextmenu = (e) => { e.preventDefault(); deleteTemplate(index); };
                cont.appendChild(btn);
            });
        }
    });
}

function addTemplate() {
    const title = prompt("Titel der Vorlage (kurz):");
    if(!title) return;
    const text = prompt("Text der Vorlage (wird in den Chat eingefügt):");
    if(!text) return;

    db.collection("admin_settings").doc("templates").get().then(doc => {
        let items = doc.exists ? doc.data().items || [] : [];
        items.push({ title, text });
        db.collection("admin_settings").doc("templates").set({ items });
    });
}

function deleteTemplate(index) {
    if(!confirm("Vorlage löschen?")) return;
    db.collection("admin_settings").doc("templates").get().then(doc => {
        if(doc.exists) {
            let items = doc.data().items || [];
            items.splice(index, 1);
            db.collection("admin_settings").doc("templates").set({ items });
        }
    });
}

// Call loadTemplates in initAdminData

// ===================================
// CMS
// ===================================
let cmsQuestions = [];

function openCMS() {
    document.getElementById("cms-modal").style.display = "flex";
    if (!db) return;
    db.collection("fallstudie_config").doc("content").get().then(doc => {
        if (doc.exists && doc.data().questions) {
            cmsQuestions = doc.data().questions;
        } else {
            // Load defaults from data.js if no firebase config yet (assuming companyData is available)
            if (typeof companyData !== 'undefined') {
                cmsQuestions = JSON.parse(JSON.stringify(companyData.questions));
            } else {
                cmsQuestions = [];
            }
        }
        renderCMS();
    });
}

function renderCMS() {
    const list = document.getElementById("cms-questions-list");
    list.innerHTML = "";
    cmsQuestions.forEach((q, i) => {
        const div = document.createElement("div");
        div.style.cssText = "padding: 16px; border: 1px solid var(--border); border-radius: 8px; background: #F7FAFC; position:relative;";
        div.innerHTML = `
            <button class="btn btn-secondary" style="position:absolute; top:16px; right:16px; padding:4px 8px; font-size:0.7rem; color:var(--danger);" onclick="cmsDelete(${i})">Löschen</button>
            <label style="font-size:0.8rem; font-weight:bold;">ID (intern, darf keine Leerzeichen haben):</label>
            <input type="text" class="sidebar-input" value="${q.id}" onchange="cmsUpdate(${i}, 'id', this.value)" style="width:100%; margin-bottom:8px;">
            <label style="font-size:0.8rem; font-weight:bold;">Titel:</label>
            <input type="text" class="sidebar-input" value="${q.title}" onchange="cmsUpdate(${i}, 'title', this.value)" style="width:100%; margin-bottom:8px;">
            <label style="font-size:0.8rem; font-weight:bold;">Fragestellung / Prompt:</label>
            <textarea class="sidebar-input" onchange="cmsUpdate(${i}, 'prompt', this.value)" style="width:100%; min-height:80px;">${q.prompt}</textarea>
        `;
        list.appendChild(div);
    });
}

function cmsUpdate(index, field, value) {
    cmsQuestions[index][field] = value;
}

function cmsAddQuestion() {
    cmsQuestions.push({
        id: "q_neu_" + Date.now(),
        title: "Neue Aufgabe",
        prompt: "Beschreiben Sie die Aufgabe hier..."
    });
    renderCMS();
}

function cmsDelete(index) {
    if(confirm("Aufgabe entfernen?")) {
        cmsQuestions.splice(index, 1);
        renderCMS();
    }
}

function cmsSave() {
    if(!db) return;
    db.collection("fallstudie_config").doc("content").set({
        questions: cmsQuestions
    }, { merge: true }).then(() => {
        alert("Inhalte gespeichert!");
        document.getElementById("cms-modal").style.display = "none";
    });
}
