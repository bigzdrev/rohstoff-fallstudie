// ============================================================
// ADMIN.JS – Dozenten-Cockpit (v5.5 Pro - Edge Optimized)
// ============================================================
let currentAdminGroup = "Gruppe 1";
let activeAdminChatType = "bank";
let activeTemplateTab = "Alle";
let totalGroups = 4;
let unsubSettings = null;
let unsubGlobal = null;
let unsubChat = null;
let unsubTasks = null;
let activeSessionId = null;
let allTemplates = [];

document.addEventListener("DOMContentLoaded", () => {
    // Hidden by default, shown after login
    const dashboard = document.getElementById("dashboard-view");
    if(dashboard) dashboard.style.display = "none";
});

// ============================================================
// LOGIN
// ============================================================
function loginAdmin() {
    const pwInput = document.getElementById("admin-password");
    if(!pwInput) return;
    const pw = pwInput.value;
    
    if (pw === "ZWRMSVM") {
        document.getElementById("login-view").classList.remove("active");
        document.getElementById("dashboard-view").style.display = "flex";
        initAdminData();
    } else {
        const err = document.getElementById("admin-error");
        if(err) err.style.display = "block";
    }
}

// ============================================================
// INIT
// ============================================================
function initAdminData() {
    if (!db) return alert("Firebase ist nicht geladen/konfiguriert!");

    loadTemplates();
    loadSessionState();

    unsubGlobal = db.collection("fallstudie_config").doc("settings").onSnapshot(doc => {
        if (doc.exists) {
            totalGroups = doc.data().group_count || 4;
            const input = document.getElementById("group-count-input");
            if(input) input.value = totalGroups;
            renderGroupTabs();
            if(!unsubChat) switchGroupContext(currentAdminGroup);
        } else {
            renderGroupTabs();
            if(!unsubChat) switchGroupContext(currentAdminGroup);
        }
    }, err => console.error("Firebase Error (Global):", err));
}

function updateTotalGroups() {
    if(!db) return;
    const input = document.getElementById("group-count-input");
    const count = input ? (parseInt(input.value) || 4) : 4;
    db.collection("fallstudie_config").doc("settings").set({ group_count: count }, { merge: true });
}

// ============================================================
// DASHBOARD NAVIGATION (TABS)
// ============================================================
function switchMainTab(tab) {
    document.querySelectorAll(".dashboard-nav-item").forEach(el => el.classList.remove("active"));
    document.querySelectorAll(".main-tab-content").forEach(el => el.classList.remove("active"));
    
    const navItem = document.getElementById(`nav-item-${tab}`);
    const tabContent = document.getElementById(`tab-${tab}-view`);
    
    if (navItem) navItem.classList.add("active");
    if (tabContent) tabContent.classList.add("active");
}

// ============================================================
// GROUP TABS
// ============================================================
function renderGroupTabs() {
    const container = document.getElementById("admin-group-tabs");
    if (!container) return;
    container.innerHTML = "";
    
    let groupNum = parseInt(currentAdminGroup.replace("Gruppe ", "")) || 1;
    if (groupNum > totalGroups) currentAdminGroup = "Gruppe 1";

    for (let i = 1; i <= totalGroups; i++) {
        const name = `Gruppe ${i}`;
        const active = name === currentAdminGroup ? 'background: var(--brand-red); color: white; border-color: var(--brand-red);' : 'background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.1);';
        container.innerHTML += `<button class="btn" style="white-space: nowrap; font-size: 0.9rem; padding: 10px 18px; border-radius: 10px; font-weight: 700; ${active}" onclick="switchGroupContext('${name}')">${name}</button>`;
    }
}

function switchGroupContext(groupName) {
    currentAdminGroup = groupName;
    renderGroupTabs();
    
    const title = document.getElementById("current-group-title");
    if(title) title.innerText = `Regie: ${groupName}`;
    document.querySelectorAll(".active-group-name").forEach(el => el.innerText = groupName);

    bindSettings();
    bindChat();
    bindTasks();
}

// ============================================================
// SETTINGS (CHECKBOXES)
// ============================================================
function bindSettings() {
    if (unsubSettings) unsubSettings();
    
    const checkboxes = ["produkte", "bilanz", "lagebericht", "marktdaten", "chat", "bank-chat", "aufgaben"];
    checkboxes.forEach(id => {
        const el = document.getElementById(`check-${id}`);
        if (el) el.checked = false;
    });

    unsubSettings = db.collection("group_controls").doc(currentAdminGroup).onSnapshot(doc => {
        if(doc.exists) {
            const d = doc.data();
            if (document.getElementById("check-produkte")) document.getElementById("check-produkte").checked = !!d.show_produkte;
            if (document.getElementById("check-bilanz")) document.getElementById("check-bilanz").checked = !!d.show_bilanz;
            if (document.getElementById("check-lagebericht")) document.getElementById("check-lagebericht").checked = !!d.show_lagebericht;
            if (document.getElementById("check-marktdaten")) document.getElementById("check-marktdaten").checked = !!d.show_marktdaten;
            if (document.getElementById("check-chat")) document.getElementById("check-chat").checked = !!d.show_chat;
            if (document.getElementById("check-bank-chat")) document.getElementById("check-bank-chat").checked = !!d.show_bank_chat;
            if (document.getElementById("check-aufgaben")) document.getElementById("check-aufgaben").checked = !!d.show_aufgaben;
        }
    }, err => console.error("Firebase Error (Settings):", err));
}

function saveGroupSettings(forceTabTarget = null) {
    if(!db) return;
    const payload = {
        show_produkte: document.getElementById("check-produkte")?.checked || false,
        show_bilanz: document.getElementById("check-bilanz")?.checked || false,
        show_lagebericht: document.getElementById("check-lagebericht")?.checked || false,
        show_marktdaten: document.getElementById("check-marktdaten")?.checked || false,
        show_chat: document.getElementById("check-chat")?.checked || false,
        show_bank_chat: document.getElementById("check-bank-chat")?.checked || false,
        show_aufgaben: document.getElementById("check-aufgaben")?.checked || false
    };
    
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

// ============================================================
// CHAT
// ============================================================
function bindChat() {
    if (unsubChat) unsubChat();
    const cont = document.getElementById("admin-chat-messages");
    if (!cont) return;
    cont.innerHTML = "";

    const collectionName = activeAdminChatType === "bank" ? "chat_rooms" : "chat_rooms_unternehmen";
    
    unsubChat = db.collection(collectionName).doc(currentAdminGroup).onSnapshot(doc => {
        if(doc.exists) {
            const msgs = doc.data().messages || [];
            cont.innerHTML = "";
            msgs.forEach(m => {
                const isAdmin = (activeAdminChatType === "bank" && m.sender === "bank") ||
                                (activeAdminChatType === "unternehmen" && m.sender === "unternehmen");
                const senderCls = isAdmin ? 'chat-user' : 'chat-contact';
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
    }, err => console.error("Firebase Error (Chat):", err));
}

function sendAdminMessage() {
    const inp = document.getElementById("admin-chat-input");
    if(!inp) return;
    const text = inp.value.trim();
    if(!text || !db) return;
    inp.value = "";

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
    document.getElementById("btn-chat-bank").className = type === "bank" ? "btn active-toggle" : "btn btn-secondary";
    document.getElementById("btn-chat-unternehmen").className = type === "unternehmen" ? "btn active-toggle" : "btn btn-secondary";
    bindChat();
}

function clearAdminChat() {
    if(!db) return;
    const collectionName = activeAdminChatType === "bank" ? "chat_rooms" : "chat_rooms_unternehmen";
    if(confirm(`Chat für ${currentAdminGroup} wirklich löschen?`)) {
        db.collection(collectionName).doc(currentAdminGroup).set({ messages: [] }, { merge: true });
    }
}

// ============================================================
// MONITORING (Tasks)
// ============================================================
function bindTasks() {
    if (unsubTasks) unsubTasks();
    const mon = document.getElementById("monitoring-container");
    if (!mon) return;
    mon.innerHTML = "<p style='color:#64748b; font-style:italic;'>Warten auf Live-Übertragung...</p>";

    unsubTasks = db.collection("fallstudie_ergebnisse").doc(currentAdminGroup).onSnapshot(doc => {
        if(doc.exists) {
            const d = doc.data();
            let html = "";
            let keys = Object.keys(d).sort();
            keys.forEach(k => {
                if (k === "gruppe" || k === "timestamp") return;
                html += `<div style="background: #0f172a; padding: 28px; margin-bottom: 24px; border-radius: 20px; border: 1px solid #1e293b; box-shadow: 0 10px 30px rgba(0,0,0,0.25);">
                    <span style="color:var(--brand-red); font-size:0.85rem; font-weight:900; text-transform:uppercase; display:block; margin-bottom:16px; letter-spacing:0.1em;">${k.toUpperCase()}</span>
                    <div style="font-size:1.15rem; line-height:1.8; color:#f1f5f9; white-space:pre-wrap; font-weight:500;">${d[k] || "-"}</div>
                </div>`;
            });
            mon.innerHTML = html || "<p style='color:#64748b;'>Keine aktiven Ergebnisse vorhanden.</p>";
        }
    });
}

// ============================================================
// TEMPLATES (Grouping & Dynamic Rendering)
// ============================================================
function loadTemplates() {
    if(!db) return;
    db.collection("admin_settings").doc("templates").onSnapshot(doc => {
        const cont = document.getElementById("admin-templates-container");
        const tabCont = document.getElementById("admin-template-tabs");
        if(!cont || !tabCont) return;

        allTemplates = [];
        if(doc.exists && doc.data().items) {
            allTemplates = doc.data().items;
        }

        const uniqueCats = [...new Set(allTemplates.map(t => t.category || "Allgemein"))];
        const categories = ["Alle", ...uniqueCats.sort()];
        
        tabCont.innerHTML = "";
        categories.forEach(cat => {
            const isActive = activeTemplateTab === cat;
            const cls = isActive ? "tpl-tab active" : "tpl-tab";
            const delBtn = (cat !== "Alle") ? `<span class="tpl-tab-del" onclick="event.stopPropagation(); deleteCategory('${cat}')">✕</span>` : "";
            tabCont.innerHTML += `<div class="${cls}" onclick="switchTemplateTab('${cat}')">${cat}${delBtn}</div>`;
        });

        renderTemplates();
    });
}

function renderTemplates() {
    const cont = document.getElementById("admin-templates-container");
    if (!cont) return;
    cont.innerHTML = "";
    
    const filtered = activeTemplateTab === "Alle" 
        ? allTemplates 
        : allTemplates.filter(t => (t.category || "Allgemein") === activeTemplateTab);

    filtered.forEach((t) => {
        const actualIndex = allTemplates.indexOf(t);
        const div = document.createElement("div");
        div.className = "tpl-btn";
        div.innerHTML = `
            <span class="tpl-title-row">${escapeHtml(t.title)}</span>
            <div class="tpl-snippet">${escapeHtml(t.text)}</div>
            <span class="tpl-tooltip">${escapeHtml(t.text)}</span>
            <span class="tpl-edit" title="Bearbeiten" onclick="event.stopPropagation(); openTemplateEditor(${actualIndex})">✎</span>
            <span class="tpl-del" title="Löschen" onclick="event.stopPropagation(); deleteTemplate(${actualIndex})">✕</span>
        `;
        div.onclick = () => { 
            const inp = document.getElementById("admin-chat-input");
            if (inp) {
                inp.value = t.text; 
                inp.focus();
            }
        };
        cont.appendChild(div);
    });
}

function switchTemplateTab(cat) {
    activeTemplateTab = cat;
    loadTemplates();
}

function deleteCategory(cat) {
    if(!confirm(`Möchtest du die Kategorie "${cat}" und alle darin enthaltenen Vorlagen wirklich löschen?`)) return;
    allTemplates = allTemplates.filter(t => (t.category || "Allgemein") !== cat);
    if(activeTemplateTab === cat) activeTemplateTab = "Alle";
    db.collection("admin_settings").doc("templates").set({ items: allTemplates });
}

function openTemplateEditor(index = -1) {
    const modal = document.getElementById("tpl-modal");
    if (!modal) return;
    
    modal.style.display = "flex";
    if (index >= 0) {
        const t = allTemplates[index];
        document.getElementById("tpl-modal-title").innerText = "Vorlage bearbeiten";
        document.getElementById("tpl-edit-index").value = index;
        document.getElementById("tpl-category").value = t.category || "Allgemein";
        document.getElementById("tpl-title").value = t.title;
        document.getElementById("tpl-text").value = t.text;
    } else {
        document.getElementById("tpl-modal-title").innerText = "Neue Vorlage";
        document.getElementById("tpl-edit-index").value = -1;
        document.getElementById("tpl-category").value = activeTemplateTab === "Alle" ? "" : activeTemplateTab;
        document.getElementById("tpl-title").value = "";
        document.getElementById("tpl-text").value = "";
    }
}

function saveTemplate() {
    const idx = parseInt(document.getElementById("tpl-edit-index").value);
    const category = document.getElementById("tpl-category").value.trim() || "Allgemein";
    const title = document.getElementById("tpl-title").value.trim();
    const text = document.getElementById("tpl-text").value.trim();

    if (!title || !text) return alert("Bitte Titel und Volltext ausfüllen.");

    if (idx >= 0) {
        allTemplates[idx] = { category, title, text };
    } else {
        allTemplates.push({ category, title, text });
    }

    db.collection("admin_settings").doc("templates").set({ items: allTemplates }).then(() => {
        document.getElementById("tpl-modal").style.display = "none";
    }).catch(err => alert("Speicherfehler: " + err.message));
}

function deleteTemplate(index) {
    if(!confirm("Vorlage wirklich löschen?")) return;
    allTemplates.splice(index, 1);
    db.collection("admin_settings").doc("templates").set({ items: allTemplates });
}

function escapeHtml(text) {
    const d = document.createElement('div');
    d.textContent = text;
    return d.innerHTML;
}

// ============================================================
// SESSIONS (Start / Stop / Save / Load / Delete)
// ============================================================
function loadSessionState() {
    db.collection("admin_settings").doc("active_session").onSnapshot(doc => {
        const ind = document.getElementById("session-indicator");
        const btn = document.getElementById("btn-session-toggle");
        if(!ind || !btn) return;
        if(doc.exists && doc.data().active) {
            activeSessionId = doc.data().sessionId;
            ind.className = "session-indicator active";
            ind.innerText = doc.data().name || "Session aktiv";
            btn.innerText = "Session beenden";
        } else {
            activeSessionId = null;
            ind.className = "session-indicator inactive";
            ind.innerText = "Keine Session";
            btn.innerText = "Session starten";
        }
    });
}

function toggleSession() {
    if (activeSessionId) {
        if(!confirm("Session beenden und Daten archivieren?")) return;
        saveSessionData(activeSessionId).then(() => {
            db.collection("admin_settings").doc("active_session").set({ active: false });
            alert("Session beendet.");
        });
    } else {
        const name = prompt("Session Name:", "Seminar " + new Date().toLocaleDateString("de-DE"));
        if(!name) return;
        const ref = db.collection("archived_sessions").doc();
        ref.set({ name, startTime: Date.now(), endTime: null, data: {} }).then(() => {
            db.collection("admin_settings").doc("active_session").set({ active: true, sessionId: ref.id, name });
        });
    }
}

async function saveSessionData(sessionId) {
    const sessionData = {};
    for (let i = 1; i <= totalGroups; i++) {
        const groupName = `Gruppe ${i}`;
        const [bankChat, unterChat, ergebnisse] = await Promise.all([
            db.collection("chat_rooms").doc(groupName).get(),
            db.collection("chat_rooms_unternehmen").doc(groupName).get(),
            db.collection("fallstudie_ergebnisse").doc(groupName).get()
        ]);
        sessionData[groupName] = {
            bankChat: bankChat.exists ? bankChat.data() : {},
            unternehmenChat: unterChat.exists ? unterChat.data() : {},
            ergebnisse: ergebnisse.exists ? ergebnisse.data() : {}
        };
    }
    return db.collection("archived_sessions").doc(sessionId).update({ endTime: Date.now(), data: sessionData });
}

function openSessionManager() {
    document.getElementById("session-modal").style.display = "flex";
    loadSessionList();
}

function loadSessionList() {
    const list = document.getElementById("session-list");
    if (!list) return;
    list.innerHTML = "Lade...";
    db.collection("archived_sessions").orderBy("startTime", "desc").get().then(snap => {
        list.innerHTML = "";
        snap.forEach(doc => {
            const d = doc.data();
            const div = document.createElement("div");
            div.style.cssText = "display:flex; justify-content:space-between; align-items:center; padding:16px; background:#1e293b; border-radius:12px; border: 1px solid #334155;";
            div.innerHTML = `<div><strong>${escapeHtml(d.name)}</strong><br><small>${new Date(d.startTime).toLocaleString()}</small></div>
                <div style="display:flex; gap:8px;">
                    <button class="btn btn-secondary" onclick="loadSession('${doc.id}')">Laden</button>
                    <button class="btn btn-secondary" style="color:#ef4444;" onclick="deleteSession('${doc.id}')">✕</button>
                </div>`;
            list.appendChild(div);
        });
    });
}

async function loadSession(sessionId) {
    if(!confirm("Achtung: Überschreibt aktuelle Live-Daten!")) return;
    const doc = await db.collection("archived_sessions").doc(sessionId).get();
    const sessionData = doc.data().data;
    const promises = [];
    for (const groupName of Object.keys(sessionData)) {
        const gd = sessionData[groupName];
        if (gd.bankChat) promises.push(db.collection("chat_rooms").doc(groupName).set(gd.bankChat));
        if (gd.unternehmenChat) promises.push(db.collection("chat_rooms_unternehmen").doc(groupName).set(gd.unternehmenChat));
        if (gd.ergebnisse) promises.push(db.collection("fallstudie_ergebnisse").doc(groupName).set(gd.ergebnisse));
    }
    await Promise.all(promises);
    alert("Session geladen!");
}

function deleteSession(sid) {
    if(confirm("Löschen?")) db.collection("archived_sessions").doc(sid).delete().then(() => loadSessionList());
}

// ============================================================
// CMS
// ============================================================
let cmsQuestions = [];
function openCMS() {
    document.getElementById("cms-modal").style.display = "flex";
    switchCmsTab("aufgaben");
    loadCmsQuestions();
    loadCmsMarketData();
}
function switchCmsTab(tab) {
    document.getElementById("cms-tab-aufgaben").className = tab === "aufgaben" ? "btn active-toggle" : "btn btn-secondary";
    document.getElementById("cms-tab-marktdaten").className = tab === "marktdaten" ? "btn active-toggle" : "btn btn-secondary";
    document.getElementById("cms-aufgaben-view").style.display = tab === "aufgaben" ? "block" : "none";
    document.getElementById("cms-marktdaten-view").style.display = tab === "marktdaten" ? "block" : "none";
}
function loadCmsQuestions() {
    db.collection("fallstudie_config").doc("content").get().then(doc => {
        if (doc.exists && doc.data().questions) cmsQuestions = doc.data().questions;
        renderCmsQuestions();
    });
}
function renderCmsQuestions() {
    const list = document.getElementById("cms-questions-list");
    list.innerHTML = "";
    cmsQuestions.forEach((q, i) => {
        const div = document.createElement("div");
        div.className = "cms-card";
        div.style.background = "#1e293b";
        div.innerHTML = `
            <button class="btn btn-secondary" style="position:absolute; top:20px; right:20px; color:#ef4444;" onclick="cmsDelete(${i})">✕</button>
            <label>ID</label><input type="text" value="${escapeHtml(q.id)}" onchange="cmsQuestions[${i}].id=this.value">
            <label>Titel</label><input type="text" value="${escapeHtml(q.title)}" onchange="cmsQuestions[${i}].title=this.value">
            <label>Prompt</label><textarea onchange="cmsQuestions[${i}].prompt=this.value">${escapeHtml(q.prompt)}</textarea>
        `;
        list.appendChild(div);
    });
}
function cmsAddQuestion() { cmsQuestions.push({ id: "q_"+Date.now(), title: "Neu", prompt: "..." }); renderCmsQuestions(); }
function cmsDelete(i) { cmsQuestions.splice(i, 1); renderCmsQuestions(); }
function cmsSave() {
    db.collection("fallstudie_config").doc("content").set({ questions: cmsQuestions }, { merge: true }).then(() => alert("Live!"));
}

let cmsMarket = {};
function loadCmsMarketData() {
    db.collection("fallstudie_config").doc("market").get().then(doc => {
        if (doc.exists) cmsMarket = doc.data();
        renderCmsMarketForm();
    });
}
function renderCmsMarketForm() {
    const f = document.getElementById("cms-market-form");
    const m = cmsMarket;
    f.innerHTML = `
        <div class="cms-card" style="background: #1e293b;">
            <label>Datum</label><input type="text" value="${m.date||''}" onchange="cmsMarket.date=this.value">
            <h4 style="color:#3b82f6; margin:12px 0;">Rohstoffpreise</h4>
            <!-- ... simplified form inputs ... -->
        </div>
    `;
}
function cmsMarketSave() {
    db.collection("fallstudie_config").doc("market").set(cmsMarket).then(() => alert("Marktdaten aktualisiert!"));
}
