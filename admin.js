// ============================================================
// ADMIN.JS – Dozenten-Cockpit (v5.4 Pro)
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
    }, err => console.error("Snapshot error (Global):", err));
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
        const active = name === currentAdminGroup ? 'background: var(--brand-red); color: white; border-color: var(--brand-red); box-shadow: 0 4px 12px rgba(185, 28, 28, 0.3);' : 'background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.1);';
        container.innerHTML += `<button class="btn" style="white-space: nowrap; font-size: 0.85rem; padding: 8px 16px; border-radius: 8px; font-weight: 600; ${active}" onclick="switchGroupContext('${name}')">${name}</button>`;
    }
}

function switchGroupContext(groupName) {
    currentAdminGroup = groupName;
    renderGroupTabs();
    
    document.getElementById("current-group-title").innerText = `Regie: ${groupName}`;
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
    }, err => console.error("Snapshot error (Settings):", err));
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
// CHAT (Bank + Unternehmen toggle)
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
    }, err => console.error("Snapshot error (Chat):", err));
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
    }).catch(err => console.error("Error sending message:", err));
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
    if (!mon) return;
    mon.innerHTML = "<p style='color:var(--text-muted); font-style:italic;'>Warte auf Eingaben der Gruppe...</p>";

    unsubTasks = db.collection("fallstudie_ergebnisse").doc(currentAdminGroup).onSnapshot(doc => {
        if(doc.exists) {
            const d = doc.data();
            let html = "";
            let keys = Object.keys(d).sort();
            keys.forEach(k => {
                if (k === "gruppe" || k === "timestamp") return;
                html += `<div style="background: rgba(0,0,0,0.3); padding: 24px; margin-bottom: 20px; border-radius: 16px; border-left: 5px solid var(--brand-red); box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
                    <span style="color:var(--brand-red); font-size:0.8rem; font-weight:800; text-transform:uppercase; display:block; margin-bottom:12px; letter-spacing:0.05em; opacity:0.9;">${k.toUpperCase()}</span>
                    <div style="font-size:1.05rem; line-height:1.7; color:var(--text-primary); white-space:pre-wrap;">${d[k] || "-"}</div>
                </div>`;
            });
            mon.innerHTML = html || "<p style='color:var(--text-muted);'>Die Gruppe hat noch nichts abgespeichert.</p>";
        }
    }, err => console.error("Snapshot error (Tasks):", err));
}

// ============================================================
// TEMPLATES (Grouping & Grid)
// ============================================================
function loadTemplates() {
    if(!db) return;
    db.collection("admin_settings").doc("templates").onSnapshot(doc => {
        const cont = document.getElementById("admin-templates-container");
        const tabCont = document.getElementById("admin-template-tabs");
        const datalist = document.getElementById("category-list");
        if(!cont || !tabCont) return;

        allTemplates = [];
        if(doc.exists && doc.data().items && doc.data().items.length > 0) {
            allTemplates = doc.data().items;
        } else {
            // Initial Fallback from data.js
            if(typeof companyData !== 'undefined') {
                const unternehmen = companyData.chatContacts.unternehmen.responses.map(r => ({ category: "Kunde", title: r.keywords[0], text: r.answer }));
                const bank = companyData.chatContacts.bank.responses.map(r => ({ category: "Handel", title: r.keywords[0], text: r.answer }));
                allTemplates = [...unternehmen, ...bank];
                db.collection("admin_settings").doc("templates").set({ items: allTemplates });
            }
        }

        // Categories list for tabs & datalist
        const uniqueCats = [...new Set(allTemplates.map(t => t.category || "Allgemein"))];
        const categories = ["Alle", ...uniqueCats.sort()];
        
        // Update Tabs
        tabCont.innerHTML = "";
        categories.forEach(cat => {
            const cls = activeTemplateTab === cat ? "tpl-tab active" : "tpl-tab";
            tabCont.innerHTML += `<div class="${cls}" onclick="switchTemplateTab('${cat}')">${cat}</div>`;
        });

        // Update Datalist for Modal
        if (datalist) {
            datalist.innerHTML = "";
            uniqueCats.forEach(cat => {
                datalist.innerHTML += `<option value="${cat}">`;
            });
        }

        renderTemplates();
    }, err => console.error("Snapshot error (Templates):", err));
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
        div.title = t.text; // Native tooltip as fallback
        div.innerHTML = `
            ${escapeHtml(t.title)}
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
    renderTemplates();
    // Update active class on tabs
    document.querySelectorAll(".tpl-tab").forEach(t => {
        t.classList.toggle("active", t.innerText === cat);
    });
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
    const idxInput = document.getElementById("tpl-edit-index");
    const idx = idxInput ? parseInt(idxInput.value) : -1;
    const category = document.getElementById("tpl-category").value.trim() || "Allgemein";
    const title = document.getElementById("tpl-title").value.trim();
    const text = document.getElementById("tpl-text").value.trim();

    if (!title || !text) return alert("Bitte Titel und Antwort-Text ausfüllen.");

    // Ensure allTemplates is up to date before saving
    if (idx >= 0) {
        allTemplates[idx] = { category, title, text };
    } else {
        allTemplates.push({ category, title, text });
    }

    db.collection("admin_settings").doc("templates").set({ items: allTemplates }).then(() => {
        document.getElementById("tpl-modal").style.display = "none";
        // If it was a new category, maybe switch to it
        if (activeTemplateTab !== "Alle" && activeTemplateTab !== category) {
            activeTemplateTab = category;
        }
    }).catch(err => {
        console.error("Error saving template:", err);
        alert("Fehler beim Speichern in Firebase: " + err.message);
    });
}

function deleteTemplate(index) {
    if(!confirm("Vorlage wirklich unwiderruflich löschen?")) return;
    allTemplates.splice(index, 1);
    db.collection("admin_settings").doc("templates").set({ items: allTemplates }).catch(err => alert("Löschfehler: " + err.message));
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
            btn.style.color = "var(--danger)";
        } else {
            activeSessionId = null;
            ind.className = "session-indicator inactive";
            ind.innerText = "Keine Session";
            btn.innerText = "Session starten";
            btn.style.color = "";
        }
    }, err => console.error("Snapshot error (Session):", err));
}

function toggleSession() {
    if (activeSessionId) {
        if(!confirm("Session beenden und alle aktuellen Daten sichern?")) return;
        saveSessionData(activeSessionId).then(() => {
            db.collection("admin_settings").doc("active_session").set({ active: false });
            alert("Session erfolgreich archiviert.");
        });
    } else {
        const name = prompt("Name der Session (z.B. Kurs 2026):", "Seminar " + new Date().toLocaleDateString("de-DE"));
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
    if (!list) return;
    list.innerHTML = "<p style='color:var(--text-muted);'>Lade Sessions...</p>";
    
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
            div.style.cssText = "display:flex; justify-content:space-between; align-items:center; padding:16px; background:rgba(255,255,255,0.04); border:1px solid var(--border); border-radius:12px;";
            div.innerHTML = `
                <div>
                    <strong style="font-size:1rem;">${escapeHtml(d.name || "Unbenannt")}</strong>
                    <div style="font-size:0.8rem; color:var(--text-muted); margin-top:4px;">${date} → ${endDate}</div>
                </div>
                <div style="display:flex; gap:8px;">
                    <button class="btn btn-secondary" style="font-size:0.8rem; padding:6px 12px;" onclick="loadSession('${doc.id}')">Laden</button>
                    <button class="btn btn-secondary" style="font-size:0.8rem; padding:6px 12px; color:var(--danger);" onclick="deleteSession('${doc.id}')">Löschen</button>
                </div>
            `;
            list.appendChild(div);
        });
    });
}

async function loadSession(sessionId) {
    if(!confirm("Achtung: Überschreibt alle aktuellen Daten der Gruppen! Fortfahren?")) return;
    const doc = await db.collection("archived_sessions").doc(sessionId).get();
    if(!doc.exists || !doc.data().data) return alert("Session-Daten unvollständig.");
    
    const sessionData = doc.data().data;
    const promises = [];
    for (const groupName of Object.keys(sessionData)) {
        const gd = sessionData[groupName];
        if (gd.bankChat) promises.push(db.collection("chat_rooms").doc(groupName).set(gd.bankChat));
        if (gd.unternehmenChat) promises.push(db.collection("chat_rooms_unternehmen").doc(groupName).set(gd.unternehmenChat));
        if (gd.ergebnisse) promises.push(db.collection("fallstudie_ergebnisse").doc(groupName).set(gd.ergebnisse));
    }
    await Promise.all(promises);
    alert("Session erfolgreich wiederhergestellt!");
    document.getElementById("session-modal").style.display = "none";
}

function deleteSession(sessionId) {
    if(!confirm("Session wirklich löschen?")) return;
    db.collection("archived_sessions").doc(sessionId).delete().then(() => loadSessionList());
}

// ============================================================
// CMS (Aufgaben & Marktdaten)
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
        else if (typeof companyData !== 'undefined') cmsQuestions = JSON.parse(JSON.stringify(companyData.questions));
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
            <button class="btn btn-secondary" style="position:absolute; top:20px; right:20px; color:var(--danger);" onclick="cmsDelete(${i})">Löschen</button>
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
    db.collection("fallstudie_config").doc("content").set({ questions: cmsQuestions }, { merge: true }).then(() => alert("Gespeichert!"));
}

let cmsMarket = {};
function loadCmsMarketData() {
    db.collection("fallstudie_config").doc("market").get().then(doc => {
        if (doc.exists) cmsMarket = doc.data();
        else if (typeof companyData !== 'undefined') cmsMarket = JSON.parse(JSON.stringify(companyData.marketPrices));
        renderCmsMarketForm();
    });
}
function renderCmsMarketForm() {
    const f = document.getElementById("cms-market-form");
    const m = cmsMarket;
    f.innerHTML = `
        <div class="cms-card">
            <label>Datum</label><input type="text" value="${m.date||''}" onchange="cmsMarket.date=this.value">
            <h4 style="color:var(--brand-red); margin:12px 0;">Kupfer</h4>
            <label>Spot USD</label><input type="number" value="${(m.copper||{}).spotUsd||0}" onchange="if(!cmsMarket.copper)cmsMarket.copper={};cmsMarket.copper.spotUsd=+this.value">
            <label>3M USD</label><input type="number" value="${(m.copper||{}).forward3m||0}" onchange="if(!cmsMarket.copper)cmsMarket.copper={};cmsMarket.copper.forward3m=+this.value">
        </div>
        <div class="cms-card">
            <h4 style="color:var(--brand-red); margin:0 0 12px 0;">Gasoil</h4>
            <label>Spot USD</label><input type="number" step="0.01" value="${(m.diesel||{}).spotUsd||0}" onchange="if(!cmsMarket.diesel)cmsMarket.diesel={};cmsMarket.diesel.spotUsd=+this.value">
        </div>
    `;
}
function cmsMarketSave() {
    db.collection("fallstudie_config").doc("market").set(cmsMarket).then(() => alert("Marktdaten live!"));
}
