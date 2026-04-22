// ============================================================
// ADMIN.JS – Dozenten-Cockpit (v5.6 Light Pro)
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
    const sidebar = document.getElementById("settings-sidebar");
    
    if (navItem) navItem.classList.add("active");
    if (tabContent) tabContent.classList.add("active");

    // "Aufgaben-Erfassung" should be a separate full window view
    if (tab === "aufgaben") {
        if(sidebar) sidebar.style.display = "none";
    } else {
        if(sidebar) sidebar.style.display = "flex";
    }
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
        const isActive = name === currentAdminGroup;
        const activeStyle = isActive ? 'background: var(--brand-red); color: white; border-color: var(--brand-red); box-shadow: 0 4px 8px rgba(185, 28, 28, 0.2);' : 'background: white; border-color: var(--admin-border); color: var(--admin-text);';
        container.innerHTML += `<button class="btn" style="white-space: nowrap; font-size: 0.85rem; padding: 10px 18px; border-radius: 10px; font-weight: 700; ${activeStyle}" onclick="switchGroupContext('${name}')">${name}</button>`;
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
    mon.innerHTML = "<p style='color:var(--admin-text-muted); font-style:italic;'>Warten auf Live-Übertragung...</p>";

    unsubTasks = db.collection("fallstudie_ergebnisse").doc(currentAdminGroup).onSnapshot(doc => {
        if(doc.exists) {
            const d = doc.data();
            let html = "";
            let keys = Object.keys(d).sort();
            keys.forEach(k => {
                if (k === "gruppe" || k === "timestamp") return;
                html += `<div style="background: white; padding: 32px; margin-bottom: 24px; border-radius: 20px; border: 1px solid var(--admin-border); box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
                    <span style="color:var(--brand-red); font-size:0.9rem; font-weight:900; text-transform:uppercase; display:block; margin-bottom:16px; letter-spacing:0.1em;">${k.toUpperCase()}</span>
                    <div style="font-size:1.2rem; line-height:1.8; color:var(--admin-text); white-space:pre-wrap; font-weight:500;">${d[k] || "-"}</div>
                </div>`;
            });
            mon.innerHTML = html || "<p style='color:var(--admin-text-muted);'>Keine aktiven Ergebnisse vorhanden.</p>";
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

    // Create a single shared tooltip element
    let sharedTooltip = document.getElementById("tpl-shared-tooltip");
    if (!sharedTooltip) {
        sharedTooltip = document.createElement("div");
        sharedTooltip.id = "tpl-shared-tooltip";
        sharedTooltip.className = "tpl-tooltip";
        document.body.appendChild(sharedTooltip);
    }

    filtered.forEach((t) => {
        const actualIndex = allTemplates.indexOf(t);
        const div = document.createElement("div");
        div.className = "tpl-btn";
        div.innerHTML = `
            <span class="tpl-title-row">${escapeHtml(t.title)}</span>
            <div class="tpl-snippet">${escapeHtml(t.text)}</div>
            <span class="tpl-edit" title="Bearbeiten" onclick="event.stopPropagation(); openTemplateEditor(${actualIndex})">✎</span>
            <span class="tpl-del" title="Löschen" onclick="event.stopPropagation(); deleteTemplate(${actualIndex})">✕</span>
        `;
        // Tooltip: follow mouse, always visible
        div.addEventListener("mouseenter", (e) => {
            sharedTooltip.innerText = t.text;
            sharedTooltip.style.display = "block";
            positionTooltip(e, sharedTooltip);
        });
        div.addEventListener("mousemove", (e) => {
            positionTooltip(e, sharedTooltip);
        });
        div.addEventListener("mouseleave", () => {
            sharedTooltip.style.display = "none";
        });
        div.onclick = () => { 
            const inp = document.getElementById("admin-chat-input");
            if (inp) { inp.value = t.text; inp.focus(); }
        };
        cont.appendChild(div);
    });
}

function positionTooltip(e, tooltip) {
    const margin = 16;
    const tw = 460;
    const th = tooltip.offsetHeight || 300;
    let x = e.clientX + margin;
    let y = e.clientY + margin;
    if (x + tw > window.innerWidth) x = e.clientX - tw - margin;
    if (y + th > window.innerHeight) y = window.innerHeight - th - margin;
    if (y < 0) y = margin;
    tooltip.style.left = x + "px";
    tooltip.style.top = y + "px";
}

function switchTemplateTab(cat) {
    activeTemplateTab = cat;
    loadTemplates();
}

function deleteCategory(cat) {
    if(!confirm(`Kategorie "${cat}" und alle zugehörigen Vorlagen löschen?`)) return;
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
    if(!confirm("Vorlage löschen?")) return;
    allTemplates.splice(index, 1);
    db.collection("admin_settings").doc("templates").set({ items: allTemplates });
}

function escapeHtml(text) {
    const d = document.createElement('div');
    d.textContent = text;
    return d.innerHTML;
}

// ============================================================
// SESSIONS
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
        if(!confirm("Session beenden?")) return;
        saveSessionData(activeSessionId).then(() => {
            db.collection("admin_settings").doc("active_session").set({ active: false });
            alert("Session archiviert.");
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
        sessionData[groupName] = { bankChat: bankChat.data(), unternehmenChat: unterChat.data(), ergebnisse: ergebnisse.data() };
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
    db.collection("archived_sessions").orderBy("startTime", "desc").get().then(snap => {
        list.innerHTML = "";
        snap.forEach(doc => {
            const d = doc.data();
            const div = document.createElement("div");
            div.style.cssText = "display:flex; justify-content:space-between; align-items:center; padding:16px; background:#f8fafc; border-radius:12px; border: 1px solid var(--admin-border);";
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
    if(!confirm("Live-Daten überschreiben?")) return;
    const doc = await db.collection("archived_sessions").doc(sessionId).get();
    const sessionData = doc.data().data;
    const promises = [];
    for (const groupName of Object.keys(sessionData)) {
        const gd = sessionData[groupName];
        promises.push(db.collection("chat_rooms").doc(groupName).set(gd.bankChat || {}));
        promises.push(db.collection("chat_rooms_unternehmen").doc(groupName).set(gd.unternehmenChat || {}));
        promises.push(db.collection("fallstudie_ergebnisse").doc(groupName).set(gd.ergebnisse || {}));
    }
    await Promise.all(promises);
    alert("Geladen!");
}

function deleteSession(sid) {
    if(confirm("Löschen?")) db.collection("archived_sessions").doc(sid).delete().then(() => loadSessionList());
}

// CMS simplified
function openCMS() { 
    document.getElementById("cms-modal").style.display = "flex";
    switchCmsTab("aufgaben");
    loadCmsQuestions();
    loadCmsMarketData();
}

function switchCmsTab(tab) {
    document.getElementById("cms-tab-aufgaben").className = tab === "aufgaben" ? "btn btn-primary" : "btn btn-secondary";
    document.getElementById("cms-tab-marktdaten").className = tab === "marktdaten" ? "btn btn-primary" : "btn btn-secondary";
    document.getElementById("cms-aufgaben-view").style.display = tab === "aufgaben" ? "block" : "none";
    document.getElementById("cms-marktdaten-view").style.display = tab === "marktdaten" ? "block" : "none";
}

let cmsQuestions = [];

function loadCmsQuestions() {
    db.collection("fallstudie_config").doc("content").get().then(doc => {
        if (doc.exists && doc.data().questions) {
            cmsQuestions = doc.data().questions;
        } else if (typeof companyData !== 'undefined' && companyData.questions) {
            cmsQuestions = JSON.parse(JSON.stringify(companyData.questions));
        } else {
            cmsQuestions = [];
        }
        renderCmsQuestions();
    }).catch(err => console.error("CMS load error:", err));
}

function renderCmsQuestions() {
    const list = document.getElementById("cms-questions-list");
    if (!list) return;
    list.innerHTML = "";
    cmsQuestions.forEach((q, i) => {
        const div = document.createElement("div");
        div.className = "cms-card";
        div.style.marginBottom = "16px";
        div.innerHTML = `
            <button onclick="cmsDelete(${i})" style="position:absolute; top:12px; right:12px; background: none; border: 1px solid #fecaca; color: #dc2626; border-radius: 6px; padding: 4px 10px; cursor: pointer; font-size: 0.8rem;">Löschen</button>
            <label>ID (intern)</label>
            <input type="text" value="${escapeHtml(q.id)}" onchange="cmsQuestions[${i}].id=this.value" style="width:100%; padding:10px; background:white; border:1px solid #e2e8f0; border-radius:8px; color:#2D3748; font-family:inherit; font-size:0.9rem; margin-bottom:8px;">
            <label>Titel</label>
            <input type="text" value="${escapeHtml(q.title)}" onchange="cmsQuestions[${i}].title=this.value" style="width:100%; padding:10px; background:white; border:1px solid #e2e8f0; border-radius:8px; color:#2D3748; font-family:inherit; font-size:0.9rem; margin-bottom:8px;">
            <label>Aufgaben-Text / Prompt</label>
            <textarea onchange="cmsQuestions[${i}].prompt=this.value" style="width:100%; padding:10px; background:white; border:1px solid #e2e8f0; border-radius:8px; color:#2D3748; font-family:inherit; font-size:0.9rem; min-height:80px; resize:vertical;">${escapeHtml(q.prompt)}</textarea>
        `;
        list.appendChild(div);
    });
    if (cmsQuestions.length === 0) {
        list.innerHTML = "<p style='color:var(--admin-text-muted); font-style:italic;'>Noch keine Aufgaben konfiguriert.</p>";
    }
}

function cmsAddQuestion() { 
    cmsQuestions.push({ id: "q_" + Date.now(), title: "Neue Aufgabe", prompt: "Beschreibung..." }); 
    renderCmsQuestions(); 
}

function cmsDelete(i) { 
    if(confirm("Aufgabe entfernen?")) {
        cmsQuestions.splice(i, 1); 
        renderCmsQuestions();
    }
}

function cmsSave() {
    db.collection("fallstudie_config").doc("content").set({ questions: cmsQuestions }, { merge: true }).then(() => {
        alert("Aufgaben gespeichert und live geschaltet!");
    }).catch(err => alert("Fehler: " + err.message));
}

let cmsMarket = {};

function loadCmsMarketData() {
    db.collection("fallstudie_config").doc("market").get().then(doc => {
        if (doc.exists) {
            cmsMarket = doc.data();
        } else if (typeof companyData !== 'undefined') {
            cmsMarket = JSON.parse(JSON.stringify(companyData.marketPrices || {}));
        }
        renderCmsMarketForm();
    });
}

function renderCmsMarketForm() {
    const f = document.getElementById("cms-market-form");
    if (!f) return;
    const m = cmsMarket;
    const inp = (label, val, path) => `
        <label style="display:block; font-size:0.8rem; font-weight:700; color:#718096; text-transform:uppercase; margin-bottom:4px; margin-top:10px;">${label}</label>
        <input type="number" step="any" value="${val || 0}" onchange="setNestedValue(cmsMarket, '${path}', +this.value)" style="width:100%; padding:10px; background:white; border:1px solid #e2e8f0; border-radius:8px; color:#2D3748; font-family:inherit; font-size:0.95rem;">
    `;
    f.innerHTML = `
        <div class="cms-card">
            <label>Datum / Stand</label>
            <input type="text" value="${m.date || ''}" onchange="cmsMarket.date=this.value" style="width:100%; padding:10px; background:white; border:1px solid #e2e8f0; border-radius:8px; color:#2D3748; font-family:inherit; font-size:0.95rem;">
        </div>
        <div class="cms-card">
            <strong style="color:var(--brand-red);">Kupfer (LME)</strong>
            ${inp("Spot USD/t", (m.copper||{}).spotUsd, "copper.spotUsd")}
            ${inp("Spot EUR/t", (m.copper||{}).spotEur, "copper.spotEur")}
            ${inp("3M Forward USD/t", (m.copper||{}).forward3m, "copper.forward3m")}
            ${inp("6M Forward USD/t", (m.copper||{}).forward6m, "copper.forward6m")}
            ${inp("12M Forward USD/t", (m.copper||{}).forward12m, "copper.forward12m")}
        </div>
        <div class="cms-card">
            <strong style="color:var(--brand-red);">Gasoil (ICE)</strong>
            ${inp("Spot USD/mT", (m.diesel||{}).spotUsd, "diesel.spotUsd")}
            ${inp("Spot EUR/mT", (m.diesel||{}).spotEur, "diesel.spotEur")}
            ${inp("6M Forward USD/mT", (m.diesel||{}).forward6m, "diesel.forward6m")}
            ${inp("12M Forward USD/mT", (m.diesel||{}).forward12m, "diesel.forward12m")}
        </div>
        <div class="cms-card">
            <strong style="color:var(--brand-red);">EUA (ICE)</strong>
            ${inp("Spot EUR/t CO₂", (m.eua||{}).spot, "eua.spot")}
            ${inp("12M Forward EUR/t CO₂", (m.eua||{}).forward12m, "eua.forward12m")}
        </div>
        <div class="cms-card">
            <strong style="color:var(--brand-red);">EUR/USD</strong>
            ${inp("Spot-Kurs", m.eurUsd, "eurUsd")}
        </div>
    `;
}

function setNestedValue(obj, path, value) {
    const parts = path.split('.');
    let cur = obj;
    for (let i = 0; i < parts.length - 1; i++) {
        if (!cur[parts[i]]) cur[parts[i]] = {};
        cur = cur[parts[i]];
    }
    cur[parts[parts.length - 1]] = value;
}

function cmsMarketSave() {
    db.collection("fallstudie_config").doc("market").set(cmsMarket).then(() => {
        alert("Marktdaten aktualisiert!");
    }).catch(err => alert("Fehler: " + err.message));
}
