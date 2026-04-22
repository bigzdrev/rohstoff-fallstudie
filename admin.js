// ============================================================
// ADMIN.JS – Dozenten-Cockpit (v5.3 Clean)
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
    document.getElementById("dashboard-view").style.display = "none";
});

// ============================================================
// LOGIN
// ============================================================
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

// ============================================================
// DASHBOARD NAVIGATION (TABS)
// ============================================================
function switchMainTab(tab) {
    document.querySelectorAll(".dashboard-nav-item").forEach(el => el.classList.remove("active"));
    document.querySelectorAll(".main-tab-content").forEach(el => el.classList.remove("active"));
    
    document.getElementById(`nav-item-${tab}`).classList.add("active");
    document.getElementById(`tab-${tab}-view`).classList.add("active");
}

// ============================================================
// GROUP TABS
// ============================================================
function renderGroupTabs() {
    const container = document.getElementById("admin-group-tabs");
    container.innerHTML = "";
    
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
    renderGroupTabs();
    
    document.getElementById("current-group-title").innerText = `Regiepult: ${groupName}`;
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
// CHAT (Bank + Unternehmen toggle)
// ============================================================
function bindChat() {
    if (unsubChat) unsubChat();
    const cont = document.getElementById("admin-chat-messages");
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
    });
}

function sendAdminMessage() {
    const inp = document.getElementById("admin-chat-input");
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
    const chatType = activeAdminChatType === "bank" ? "Bank" : "Unternehmens";
    if(confirm(`${chatType}-Chat für ${currentAdminGroup} wirklich löschen?`)) {
        db.collection(collectionName).doc(currentAdminGroup).set({ messages: [] }, { merge: true });
    }
}

// ============================================================
// MONITORING (Tasks)
// ============================================================
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
                if (k === "gruppe" || k === "timestamp") return;
                html += `<div style="background: rgba(0,0,0,0.2); padding: 20px; margin-bottom: 16px; border-radius: 12px; border-left: 4px solid var(--brand-red);">
                    <span style="color:var(--brand-red); font-size:0.75rem; font-weight:700; text-transform:uppercase; display:block; margin-bottom:8px; opacity:0.8;">${k.toUpperCase()}</span>
                    <div style="font-size:1rem; line-height:1.6; color:var(--text-primary); white-space:pre-wrap;">${d[k] || "-"}</div>
                </div>`;
            });
            mon.innerHTML = html || "Die Gruppe hat noch nichts abgespeichert.";
        }
    });
}

// ============================================================
// TEMPLATES (Grouping & Grid)
// ============================================================
function loadTemplates() {
    if(!db) return;
    db.collection("admin_settings").doc("templates").onSnapshot(doc => {
        const cont = document.getElementById("admin-templates-container");
        const tabCont = document.getElementById("admin-template-tabs");
        if(!cont || !tabCont) return;

        allTemplates = [];
        if(doc.exists && doc.data().items && doc.data().items.length > 0) {
            allTemplates = doc.data().items;
        } else {
            // Fallback: Default templates from data.js
            if(typeof companyData !== 'undefined') {
                const unternehmen = companyData.chatContacts.unternehmen.responses.map(r => ({ category: "Kunde", title: r.keywords[0], text: r.answer }));
                const bank = companyData.chatContacts.bank.responses.map(r => ({ category: "Handel", title: r.keywords[0], text: r.answer }));
                allTemplates = [...unternehmen, ...bank];
                db.collection("admin_settings").doc("templates").set({ items: allTemplates });
            }
        }

        // Generate Category Tabs
        const categories = ["Alle", ...new Set(allTemplates.map(t => t.category || "Allgemein"))];
        tabCont.innerHTML = "";
        categories.forEach(cat => {
            const cls = activeTemplateTab === cat ? "tpl-tab active" : "tpl-tab";
            tabCont.innerHTML += `<div class="${cls}" onclick="switchTemplateTab('${cat}')">${cat}</div>`;
        });

        renderTemplates();
    });
}

function renderTemplates() {
    const cont = document.getElementById("admin-templates-container");
    cont.innerHTML = "";
    
    const filtered = activeTemplateTab === "Alle" 
        ? allTemplates 
        : allTemplates.filter(t => (t.category || "Allgemein") === activeTemplateTab);

    filtered.forEach((t, index) => {
        // Find actual index in allTemplates for edit/delete
        const actualIndex = allTemplates.indexOf(t);
        
        const div = document.createElement("div");
        div.className = "tpl-btn";
        div.innerHTML = `
            ${escapeHtml(t.title)}
            <span class="tpl-tooltip">${escapeHtml(t.text)}</span>
            <span class="tpl-edit" onclick="event.stopPropagation(); openTemplateEditor(${actualIndex})">✎</span>
            <span class="tpl-del" onclick="event.stopPropagation(); deleteTemplate(${actualIndex})">✕</span>
        `;
        div.onclick = () => { document.getElementById("admin-chat-input").value = t.text; };
        cont.appendChild(div);
    });
}

function switchTemplateTab(cat) {
    activeTemplateTab = cat;
    loadTemplates();
}

function openTemplateEditor(index = -1) {
    document.getElementById("tpl-modal").style.display = "flex";
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

    if (!title || !text) return alert("Bitte Titel und Text ausfüllen.");

    if (idx >= 0) {
        allTemplates[idx] = { category, title, text };
    } else {
        allTemplates.push({ category, title, text });
    }

    db.collection("admin_settings").doc("templates").set({ items: allTemplates }).then(() => {
        document.getElementById("tpl-modal").style.display = "none";
    });
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
        if(doc.exists && doc.data().active) {
            activeSessionId = doc.data().sessionId;
            document.getElementById("session-indicator").className = "session-indicator active";
            document.getElementById("session-indicator").innerText = doc.data().name || "Session aktiv";
            document.getElementById("btn-session-toggle").innerText = "Session beenden";
            document.getElementById("btn-session-toggle").style.color = "var(--danger)";
        } else {
            activeSessionId = null;
            document.getElementById("session-indicator").className = "session-indicator inactive";
            document.getElementById("session-indicator").innerText = "Keine Session";
            document.getElementById("btn-session-toggle").innerText = "Session starten";
            document.getElementById("btn-session-toggle").style.color = "";
        }
    });
}

function toggleSession() {
    if (activeSessionId) {
        // Stop session: save all data to the session
        if(!confirm("Session beenden und alle aktuellen Daten speichern?")) return;
        saveSessionData(activeSessionId).then(() => {
            db.collection("admin_settings").doc("active_session").set({ active: false });
            alert("Session wurde gespeichert und beendet.");
        });
    } else {
        // Start new session
        const name = prompt("Name für die neue Session:", "Seminar " + new Date().toLocaleDateString("de-DE"));
        if(!name) return;
        const sessionRef = db.collection("archived_sessions").doc();
        sessionRef.set({
            name: name,
            startTime: Date.now(),
            endTime: null,
            data: {}
        }).then(() => {
            db.collection("admin_settings").doc("active_session").set({
                active: true,
                sessionId: sessionRef.id,
                name: name
            });
        });
    }
}

async function saveSessionData(sessionId) {
    // Collect all group data
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
    return db.collection("archived_sessions").doc(sessionId).update({
        endTime: Date.now(),
        data: sessionData
    });
}

function openSessionManager() {
    document.getElementById("session-modal").style.display = "flex";
    loadSessionList();
}

function loadSessionList() {
    const list = document.getElementById("session-list");
    list.innerHTML = "<p style='color:var(--text-muted);'>Lade...</p>";
    
    db.collection("archived_sessions").orderBy("startTime", "desc").get().then(snap => {
        if (snap.empty) {
            list.innerHTML = "<p style='color:var(--text-muted);'>Noch keine Sessions vorhanden.</p>";
            return;
        }
        list.innerHTML = "";
        snap.forEach(doc => {
            const d = doc.data();
            const date = d.startTime ? new Date(d.startTime).toLocaleString("de-DE") : "—";
            const endDate = d.endTime ? new Date(d.endTime).toLocaleString("de-DE") : "läuft noch";
            const div = document.createElement("div");
            div.style.cssText = "display:flex; justify-content:space-between; align-items:center; padding:14px 16px; background:rgba(255,255,255,0.04); border:1px solid var(--border); border-radius:10px;";
            div.innerHTML = `
                <div>
                    <strong style="font-size:0.95rem;">${escapeHtml(d.name || "Unbenannt")}</strong>
                    <div style="font-size:0.8rem; color:var(--text-muted); margin-top:4px;">${date} → ${endDate}</div>
                </div>
                <div style="display:flex; gap:6px;">
                    <button class="btn btn-secondary" style="font-size:0.75rem; padding:4px 10px;" onclick="loadSession('${doc.id}')">Laden</button>
                    <button class="btn btn-secondary" style="font-size:0.75rem; padding:4px 10px; color:var(--danger);" onclick="deleteSession('${doc.id}')">Löschen</button>
                </div>
            `;
            list.appendChild(div);
        });
    });
}

async function loadSession(sessionId) {
    if(!confirm("Achtung: Alle aktuellen Daten werden mit den Session-Daten überschrieben! Fortfahren?")) return;
    const doc = await db.collection("archived_sessions").doc(sessionId).get();
    if(!doc.exists || !doc.data().data) { alert("Session enthält keine Daten."); return; }
    
    const sessionData = doc.data().data;
    const promises = [];
    for (const groupName of Object.keys(sessionData)) {
        const gd = sessionData[groupName];
        if (gd.bankChat) promises.push(db.collection("chat_rooms").doc(groupName).set(gd.bankChat));
        if (gd.unternehmenChat) promises.push(db.collection("chat_rooms_unternehmen").doc(groupName).set(gd.unternehmenChat));
        if (gd.ergebnisse) promises.push(db.collection("fallstudie_ergebnisse").doc(groupName).set(gd.ergebnisse));
    }
    await Promise.all(promises);
    alert("Session erfolgreich geladen!");
    document.getElementById("session-modal").style.display = "none";
}

function deleteSession(sessionId) {
    if(!confirm("Session unwiderruflich löschen?")) return;
    db.collection("archived_sessions").doc(sessionId).delete().then(() => loadSessionList());
}

// ============================================================
// CMS: Aufgaben
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
        if (doc.exists && doc.data().questions) {
            cmsQuestions = doc.data().questions;
        } else if (typeof companyData !== 'undefined') {
            cmsQuestions = JSON.parse(JSON.stringify(companyData.questions));
        } else {
            cmsQuestions = [];
        }
        renderCmsQuestions();
    });
}

function renderCmsQuestions() {
    const list = document.getElementById("cms-questions-list");
    list.innerHTML = "";
    cmsQuestions.forEach((q, i) => {
        const div = document.createElement("div");
        div.className = "cms-card";
        div.innerHTML = `
            <button class="btn btn-secondary" style="position:absolute; top:16px; right:16px; padding:4px 8px; font-size:0.7rem; color:var(--danger);" onclick="cmsDelete(${i})">Löschen</button>
            <label>ID (intern):</label>
            <input type="text" value="${escapeHtml(q.id)}" onchange="cmsUpdate(${i}, 'id', this.value)">
            <label>Titel:</label>
            <input type="text" value="${escapeHtml(q.title)}" onchange="cmsUpdate(${i}, 'title', this.value)">
            <label>Fragestellung / Prompt:</label>
            <textarea onchange="cmsUpdate(${i}, 'prompt', this.value)">${escapeHtml(q.prompt)}</textarea>
        `;
        list.appendChild(div);
    });
}

function cmsUpdate(index, field, value) { cmsQuestions[index][field] = value; }

function cmsAddQuestion() {
    cmsQuestions.push({ id: "q_neu_" + Date.now(), title: "Neue Aufgabe", prompt: "Beschreiben Sie die Aufgabe hier..." });
    renderCmsQuestions();
}

function cmsDelete(index) {
    if(confirm("Aufgabe entfernen?")) { cmsQuestions.splice(index, 1); renderCmsQuestions(); }
}

function cmsSave() {
    if(!db) return;
    db.collection("fallstudie_config").doc("content").set({ questions: cmsQuestions }, { merge: true }).then(() => {
        alert("Aufgaben gespeichert!");
    });
}

// ============================================================
// CMS: Marktdaten
// ============================================================
let cmsMarket = {};

function loadCmsMarketData() {
    db.collection("fallstudie_config").doc("market").get().then(doc => {
        if (doc.exists) {
            cmsMarket = doc.data();
        } else if (typeof companyData !== 'undefined') {
            cmsMarket = JSON.parse(JSON.stringify(companyData.marketPrices));
        } else {
            cmsMarket = {};
        }
        renderCmsMarketForm();
    });
}

function renderCmsMarketForm() {
    const form = document.getElementById("cms-market-form");
    const mp = cmsMarket;
    
    form.innerHTML = `
        <div class="cms-card">
            <label>Datum / Stand:</label>
            <input type="text" id="cms-market-date" value="${mp.date || ''}" onchange="cmsMarket.date = this.value">
        </div>
        <div class="cms-card">
            <h4 style="margin: 0 0 12px 0; color:var(--brand-red);">Kupfer (LME)</h4>
            <label>Spot USD/t:</label><input type="number" value="${(mp.copper||{}).spotUsd||0}" onchange="if(!cmsMarket.copper)cmsMarket.copper={}; cmsMarket.copper.spotUsd=+this.value">
            <label>Spot EUR/t:</label><input type="number" value="${(mp.copper||{}).spotEur||0}" onchange="if(!cmsMarket.copper)cmsMarket.copper={}; cmsMarket.copper.spotEur=+this.value">
            <label>3M Forward USD/t:</label><input type="number" value="${(mp.copper||{}).forward3m||0}" onchange="if(!cmsMarket.copper)cmsMarket.copper={}; cmsMarket.copper.forward3m=+this.value">
            <label>6M Forward USD/t:</label><input type="number" value="${(mp.copper||{}).forward6m||0}" onchange="if(!cmsMarket.copper)cmsMarket.copper={}; cmsMarket.copper.forward6m=+this.value">
            <label>12M Forward USD/t:</label><input type="number" value="${(mp.copper||{}).forward12m||0}" onchange="if(!cmsMarket.copper)cmsMarket.copper={}; cmsMarket.copper.forward12m=+this.value">
        </div>
        <div class="cms-card">
            <h4 style="margin: 0 0 12px 0; color:var(--brand-red);">Gasoil (ICE)</h4>
            <label>Spot USD/mT:</label><input type="number" step="0.01" value="${(mp.diesel||{}).spotUsd||0}" onchange="if(!cmsMarket.diesel)cmsMarket.diesel={}; cmsMarket.diesel.spotUsd=+this.value">
            <label>Spot EUR/mT:</label><input type="number" step="0.01" value="${(mp.diesel||{}).spotEur||0}" onchange="if(!cmsMarket.diesel)cmsMarket.diesel={}; cmsMarket.diesel.spotEur=+this.value">
            <label>6M Forward USD/mT:</label><input type="number" step="0.01" value="${(mp.diesel||{}).forward6m||0}" onchange="if(!cmsMarket.diesel)cmsMarket.diesel={}; cmsMarket.diesel.forward6m=+this.value">
            <label>12M Forward USD/mT:</label><input type="number" step="0.01" value="${(mp.diesel||{}).forward12m||0}" onchange="if(!cmsMarket.diesel)cmsMarket.diesel={}; cmsMarket.diesel.forward12m=+this.value">
        </div>
        <div class="cms-card">
            <h4 style="margin: 0 0 12px 0; color:var(--brand-red);">EUA (ICE)</h4>
            <label>Spot EUR/t CO₂:</label><input type="number" step="0.01" value="${(mp.eua||{}).spot||0}" onchange="if(!cmsMarket.eua)cmsMarket.eua={}; cmsMarket.eua.spot=+this.value">
            <label>12M Forward EUR/t CO₂:</label><input type="number" step="0.01" value="${(mp.eua||{}).forward12m||0}" onchange="if(!cmsMarket.eua)cmsMarket.eua={}; cmsMarket.eua.forward12m=+this.value">
        </div>
        <div class="cms-card">
            <h4 style="margin: 0 0 12px 0; color:var(--brand-red);">EUR/USD</h4>
            <label>Spot-Kurs:</label><input type="number" step="0.0001" value="${mp.eurUsd||0}" onchange="cmsMarket.eurUsd=+this.value">
        </div>
    `;
}

function cmsMarketSave() {
    if(!db) return;
    db.collection("fallstudie_config").doc("market").set(cmsMarket).then(() => {
        alert("Marktdaten gespeichert!");
    });
}
