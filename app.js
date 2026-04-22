// ============================================================
// APP.JS – KabelWerke Fallstudie v4 (KI-Chat mit Transformers.js)
// ============================================================

let currentRole = "";
let saveTimeout = null;
let unsubBankChat = null;

// ---- KI-MODUL ----
let aiStatus = "idle"; // idle | loading | ready | error
let aiExtractor = null;
let aiEmbeddingsCache = {};

document.addEventListener("DOMContentLoaded", () => {
    try { injectCompanyWebsite(); } catch(e) { console.error("company:", e); }
    try { injectProducts(); } catch(e) { console.error("products:", e); }
    try { injectBilanz(); } catch(e) { console.error("bilanz:", e); }
    try { injectGuV(); } catch(e) { console.error("guv:", e); }
    try { injectLagebericht(); } catch(e) { console.error("lagebericht:", e); }
    try { injectMarketData(); } catch(e) { console.error("market:", e); }
    try { injectTaskQuestions(); } catch(e) { console.error("tasks:", e); }
    try { initChats(); } catch(e) { console.error("chat:", e); }
    // Firebase connection check removed (handled by listeners)
    
    // Fallback falls db noch nicht bereit ist
    setTimeout(() => { if (!window.configLoaded) renderDynamicButtons(4); }, 2000);
});

// ============================================================
// ADMIN & LOGIN LOGIK
// ============================================================
window.configLoaded = false;

function tryAdminLogin() {
    const pw = document.getElementById("admin-password").value;
    if (pw === "ZWRMSVM") {
        document.getElementById("student-login-area").style.display = "none";
        document.getElementById("admin-config-area").style.display = "block";
        document.getElementById("admin-error").style.display = "none";
    } else {
        document.getElementById("admin-error").style.display = "block";
    }
}


function saveRegieConfig() {
    if (typeof db !== 'undefined' && db !== null) {
        const payload = {
            show_produkte: document.getElementById('check-produkte').checked,
            show_bilanz: document.getElementById('check-bilanz').checked,
            show_lagebericht: document.getElementById('check-lagebericht').checked,
            show_marktdaten: document.getElementById('check-marktdaten').checked,
            show_chat: document.getElementById('check-chat').checked,
            show_aufgaben: document.getElementById('check-aufgaben').checked
        };
        db.collection("fallstudie_config").doc("settings").set(payload, { merge: true })
        .then(() => console.log("Regiepult gespeichert"))
        .catch(err => console.error(err));
    }
}

function saveGroupConfig() {
    const count = parseInt(document.getElementById("group-count-input").value) || 4;
    
    // Save to Firebase
    if (typeof db !== 'undefined' && db !== null) {
        db.collection("fallstudie_config").doc("settings").set({ group_count: count })
        .then(() => {
            renderDynamicButtons(count);
            showToast();
            // Optional: zurück zur Schüleransicht wechseln?
            // document.getElementById("admin-config-area").style.display = "none";
            // document.getElementById("student-login-area").style.display = "block";
        })
        .catch(err => console.error("Fehler beim Speichern der Config:", err));
    } else {
        // Offline Fallback
        renderDynamicButtons(count);
        showToast();
    }
}

function renderDynamicButtons(count) {
    window.configLoaded = true;
    const container = document.getElementById("dynamic-login-buttons");
    if (!container) return;
    
    container.innerHTML = "";
    for (let i = 1; i <= count; i++) {
        const btn = document.createElement("button");
        btn.className = "btn btn-secondary";
        btn.innerText = "Gruppe " + i;
        btn.onclick = () => loginAs("Gruppe " + i);
        container.appendChild(btn);
    }
}

function loginAs(role) {
    currentRole = role;
    window.currentGroup = role; // global identifier for Firebase
    document.getElementById("user-role-badge").innerText = role;
    document.getElementById("login-view").classList.remove("active");
    document.getElementById("dashboard-view").classList.add("active");
    
    // Bind Firebase chat if not Dozent
    if(role !== "Dozent" && typeof db !== 'undefined' && db !== null) {
        
        if (unsubBankChat) unsubBankChat();
        unsubBankChat = db.collection("chat_rooms").doc(role).onSnapshot(doc => {
            renderBankChat(doc.exists ? doc.data().messages || [] : []);
        });

        if (window.unsubUnternehmenChat) window.unsubUnternehmenChat();
        window.unsubUnternehmenChat = db.collection("chat_rooms_unternehmen").doc(role).onSnapshot(doc => {
            if(doc.exists) {
                renderUnternehmenChat(doc.data().messages || []);
            } else {
                renderUnternehmenChat([]);
            }
        });

        
        // Listen to per-group config
        db.collection("group_controls").doc(role).onSnapshot(doc => {
            if(doc.exists) {
                const data = doc.data();
                if(document.getElementById('nav-produkte')) document.getElementById('nav-produkte').style.display = data.show_produkte ? 'block' : 'none';
                if(document.getElementById('nav-bilanz')) document.getElementById('nav-bilanz').style.display = data.show_bilanz ? 'block' : 'none';
                if(document.getElementById('nav-lagebericht')) document.getElementById('nav-lagebericht').style.display = data.show_lagebericht ? 'block' : 'none';
                if(document.getElementById('nav-marktdaten')) document.getElementById('nav-marktdaten').style.display = data.show_marktdaten ? 'block' : 'none';
                if(document.getElementById('nav-chat-unternehmen')) document.getElementById('nav-chat-unternehmen').style.display = data.show_chat ? 'block' : 'none';
                if(document.getElementById('nav-chat-bank')) document.getElementById('nav-chat-bank').style.display = data.show_bank_chat ? 'block' : 'none';
                if(document.getElementById('nav-aufgaben')) document.getElementById('nav-aufgaben').style.display = data.show_aufgaben ? 'block' : 'none';
                
                // Zwanghafte Navigation auf Kundenwunsch deaktiviert.
            }
        });
    }
    
    document.querySelectorAll(".student-only").forEach(el => el.classList.remove("hidden"));
    document.querySelectorAll(".lecturer-only").forEach(el => el.classList.add("hidden"));
    loadSavedAnswers();
    switchTab("tab-company");
}

function logout() {
    currentRole = "";
    document.getElementById("dashboard-view").classList.remove("active");
    document.getElementById("login-view").classList.add("active");
}

function switchTab(tabId) {
    document.querySelectorAll(".nav-btn").forEach(btn => {
        btn.classList.remove("active");
        if (btn.getAttribute("onclick") && btn.getAttribute("onclick").includes(tabId)) {
            btn.classList.add("active");
            const title = btn.innerText.replace(/^[^\wäöüÄÖÜ\s]*/i, '').trim();
            document.getElementById("current-tab-title").innerText = title;
        }
    });
    document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
    document.getElementById(tabId).classList.add("active");
}

function switchSubTab(subId, btn) {
    btn.parentElement.querySelectorAll(".sub-tab").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    btn.closest(".tab-content").querySelectorAll(".sub-content").forEach(c => c.classList.remove("active"));
    document.getElementById(subId).classList.add("active");
}

// ============================================================
// INJECT: COMPANY WEBSITE
// ============================================================
function injectCompanyWebsite() {
    const ws = companyData.website_sections;
    document.getElementById("about-text").innerHTML = ws.about;
    document.getElementById("mission-text").innerHTML = ws.mission;
    document.getElementById("production-text").innerHTML = ws.production;
    document.getElementById("logistics-text").innerHTML = ws.logistics;
    document.getElementById("warehouse-text").innerHTML = ws.warehouse;
}

// ============================================================
// INJECT: PRODUCTS
// ============================================================
function injectProducts() {
    const grid = document.getElementById("products-grid");
    companyData.products.forEach(p => {
        grid.innerHTML += `<div class="product-card"><span class="product-emoji">${p.image_emoji}</span><span class="product-category">${p.category}</span><h4>${p.name}</h4><p>${p.description}</p></div>`;
    });
}

// ============================================================
// INJECT: BILANZ
// ============================================================
function injectBilanz() {
    renderBilanzSide("bilanz-aktiva", companyData.bilanz.aktiva);
    renderBilanzSide("bilanz-passiva", companyData.bilanz.passiva);
}
function renderBilanzSide(containerId, sideData) {
    const container = document.getElementById(containerId);
    let html = `<div class="bilanz-title">${sideData.title}</div>`;
    sideData.sections.forEach(section => {
        if (section.title) html += `<div class="bilanz-section-title">${section.title}</div>`;
        html += `<table class="finance-table"><tbody>`;
        section.items.forEach(item => {
            let cls = item.total ? "row-total" : item.bold ? "row-bold" : item.sub ? "row-sub" : "";
            let val = item.value ? formatEur(item.value) : "";
            let ind = item.indent ? ' class="indent"' : '';
            html += `<tr class="${cls}"><td${ind}>${item.label}</td><td>${val}</td></tr>`;
        });
        html += `</tbody></table>`;
    });
    container.innerHTML = html;
}

// ============================================================
// INJECT: GuV
// ============================================================
function injectGuV() {
    const tbody = document.getElementById("guv-table").querySelector("tbody");
    companyData.guv.items.forEach(item => {
        if (!item.label) { tbody.innerHTML += `<tr class="row-spacer"><td></td><td></td></tr>`; return; }
        let cls = item.total ? "row-total" : item.line ? "row-bold row-line" : item.bold ? "row-bold" : item.sub ? "row-sub" : "";
        let val = item.value ? formatEur(item.value) : "";
        let ind = item.indent ? ' class="indent"' : '';
        tbody.innerHTML += `<tr class="${cls}"><td${ind}>${item.label}</td><td>${val}</td></tr>`;
    });
}

// ============================================================
// INJECT: LAGEBERICHT
// ============================================================
function injectLagebericht() {
    const container = document.getElementById("lagebericht-container");
    companyData.lagebericht.sections.forEach(s => {
        container.innerHTML += `<div class="lagebericht-section glass-panel"><h3>${s.title}</h3><p>${s.text}</p></div>`;
    });
}

// ============================================================
// INJECT: MARKET DATA
// ============================================================
function injectMarketData() {
    const mp = companyData.marketPrices;
    document.getElementById("market-date").innerText = mp.date;
    const grid = document.getElementById("market-grid");
    grid.innerHTML = `
        <div class="market-card">
            <div class="market-card-header"><h3>Kupfer (LME)</h3><span class="market-card-icon"></span></div>
            <table class="market-table">
                <tr><td>Spot (Cash)</td><td class="market-spot">${mp.copper.spotUsd.toLocaleString()} USD/t</td></tr>
                <tr><td>Spot in EUR</td><td class="market-spot">${mp.copper.spotEur.toLocaleString()} EUR/t</td></tr>
                <tr><td>3M Forward</td><td>${mp.copper.forward3m.toLocaleString()} USD/t</td></tr>
                <tr><td>6M Forward</td><td>${mp.copper.forward6m.toLocaleString()} USD/t</td></tr>
                <tr><td>12M Forward</td><td>${mp.copper.forward12m.toLocaleString()} USD/t</td></tr>
            </table>
        </div>
        <div class="market-card">
            <div class="market-card-header"><h3>Gasoil (ICE)</h3><span class="market-card-icon">⛽</span></div>
            <table class="market-table">
                <tr><td>Spot (LS Gasoil)</td><td class="market-spot">${mp.diesel.spotUsd.toLocaleString()} USD/mT</td></tr>
                <tr><td>Spot in EUR</td><td class="market-spot">${mp.diesel.spotEur.toLocaleString()} EUR/mT</td></tr>
                <tr><td>6M Forward</td><td>${mp.diesel.forward6m.toLocaleString()} USD/mT</td></tr>
                <tr><td>12M Forward</td><td>${mp.diesel.forward12m.toLocaleString()} USD/mT</td></tr>
            </table>
        </div>
        <div class="market-card">
            <div class="market-card-header"><h3>EUA (ICE)</h3><span class="market-card-icon"></span></div>
            <table class="market-table">
                <tr><td>Spot</td><td class="market-spot">${mp.eua.spot.toFixed(2)} EUR/t CO₂</td></tr>
                <tr><td>12M Forward</td><td>${mp.eua.forward12m.toFixed(2)} EUR/t CO₂</td></tr>
            </table>
        </div>
        <div class="market-card">
            <div class="market-card-header"><h3>EUR/USD</h3><span class="market-card-icon"></span></div>
            <table class="market-table">
                <tr><td>Spot</td><td class="market-spot">${mp.eurUsd.toFixed(4)}</td></tr>
            </table>
        </div>
    `;
}

// ============================================================
// INJECT: TASK QUESTIONS
// ============================================================
function injectTaskQuestions() {
    const container = document.getElementById("task-questions-container");
    companyData.questions.forEach(q => {
        container.innerHTML += `<div class="task-card"><h4>${q.title}</h4><div class="task-prompt">${q.prompt}</div><textarea id="ans-${q.id}" rows="6" placeholder="Ihre Analyse..."></textarea></div>`;
    });
    setTimeout(() => {
        document.querySelectorAll("#analysis-form textarea").forEach(ta => {
            ta.addEventListener("input", () => { clearTimeout(saveTimeout); saveTimeout = setTimeout(() => saveFormData(), 3000); });
        });
    }, 100);
}

// ============================================================
// CHAT SYSTEM (Firebase-only, no AI)
// ============================================================
// CHAT SYSTEM (Firebase-only, Admin responds manually)
// ============================================================
function initChats() {
    // Only init the Unternehmen chat header (bank chat is fully Firebase-driven)
    const contact = companyData.chatContacts["unternehmen"];
    const nameEl = document.getElementById("chat-unternehmen-name");
    const roleEl = document.getElementById("chat-unternehmen-role");
    if (nameEl) nameEl.innerText = contact.name;
    if (roleEl) roleEl.innerText = contact.role;
    // Bank chat header
    const bankContact = companyData.chatContacts["bank"];
    const bankNameEl = document.getElementById("chat-bank-name");
    const bankRoleEl = document.getElementById("chat-bank-role");
    if (bankNameEl) bankNameEl.innerText = bankContact.name;
    if (bankRoleEl) bankRoleEl.innerText = bankContact.role;
}

function sendChatMessage(contactId) {
    const input = document.getElementById(`chat-${contactId}-input`);
    const message = input ? input.value.trim() : "";
    if (!message) return;
    input.value = "";
    
    // Push student message to Firebase (admin responds manually)
    const collection = contactId === "bank" ? "chat_rooms" : "chat_rooms_unternehmen";
    db.collection(collection).doc(window.currentGroup).get().then(doc => {
        let msgs = doc.exists ? doc.data().messages || [] : [];
        msgs.push({ sender: 'student', text: message, time: Date.now() });
        db.collection(collection).doc(window.currentGroup).set({ messages: msgs });
    });
}




function addChatBubble(contactId, text, sender) {
    const container = document.getElementById(`chat-${contactId}-messages`);
    if (!container) return;
    const bubble = document.createElement("div");
    bubble.className = `chat-bubble chat-${sender}`;
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    bubble.innerHTML = `<div class="bubble-text">${text}<span class="chat-time">${timeStr}</span></div>`;
    container.appendChild(bubble);
    container.scrollTop = container.scrollHeight;
}

function addTypingIndicator(contactId) {
    const container = document.getElementById(`chat-${contactId}-messages`);
    const id = "typing-" + Date.now();
    const contact = companyData.chatContacts[contactId];
    const el = document.createElement("div");
    el.className = "chat-bubble chat-contact typing-indicator";
    el.id = id;
    el.innerHTML = `<div class="bubble-text"><span class="dot-pulse"><span></span><span></span><span></span></span> <em>${contact.name} tippt...</em></div>`;
    container.appendChild(el);
    container.scrollTop = container.scrollHeight;
    return id;
}

function removeTypingIndicator(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
}

// ============================================================
// SAVE & LOAD
// ============================================================
function saveFormData() {
    const dataObj = { gruppe: currentRole, timestamp: new Date().getTime() };
    companyData.questions.forEach(q => { dataObj[q.id] = document.getElementById("ans-" + q.id).value; });
    if (typeof useFirebase !== 'undefined' && useFirebase && db) {
        db.collection("fallstudie_ergebnisse").doc(currentRole).set(dataObj).then(() => showToast()).catch(err => alert("Fehler: " + err));
    } else {
        localStorage.setItem("fallstudie_" + currentRole, JSON.stringify(dataObj));
        showToast();
    }
}

function loadSavedAnswers() {
    if (typeof useFirebase !== 'undefined' && useFirebase && db) {
        db.collection("fallstudie_ergebnisse").doc(currentRole).get().then(doc => {
            if (doc.exists) { const d = doc.data(); companyData.questions.forEach(q => { const el = document.getElementById("ans-" + q.id); if (el) el.value = d[q.id] || ""; }); }
        });
    } else {
        const local = localStorage.getItem("fallstudie_" + currentRole);
        if (local) { const d = JSON.parse(local); companyData.questions.forEach(q => { const el = document.getElementById("ans-" + q.id); if (el) el.value = d[q.id] || ""; }); }
    }
}

// ============================================================
// LECTURER (Removed)
// ============================================================
// ============================================================
// UTILITIES
// ============================================================
function formatEur(val) {
    if (val === undefined || val === null || val === "") return "";
    const isNegative = val.toString().startsWith("-");
    const num = parseFloat(val.toString().replace(/[^\d.-]/g, ''));
    if (isNaN(num)) return val + " €";
    
    // Format using German locale which uses '.' for thousands and ',' for decimal
    const formatted = num.toLocaleString("de-DE", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    return formatted + " €";
}
function showToast() {
    const t = document.getElementById("toast"); t.classList.add("show");
    setTimeout(() => t.classList.remove("show"), 2500);
}


// Check for Global Content Config
setTimeout(() => {
    if (typeof db !== 'undefined' && db !== null) {
        db.collection("fallstudie_config").doc("content").onSnapshot(doc => {
            if (doc.exists && doc.data().questions) {
                companyData.questions = doc.data().questions;
                const container = document.getElementById("task-questions-container");
                if (container) {
                    container.innerHTML = "";
                    injectTaskQuestions();
                    loadSavedAnswers(); // reload user's saved text into the new textareas
                }
            }
        });
    }
}, 1000);

// Check for Global Config on load
setTimeout(() => {
    if (typeof db !== 'undefined' && db !== null) {
        db.collection("fallstudie_config").doc("settings").onSnapshot(doc => {
            if (doc.exists && doc.data().group_count) {
                renderDynamicButtons(doc.data().group_count);
                const input = document.getElementById("group-count-input");
                if(input) input.value = doc.data().group_count;
            }
        });
        // Listen for market data updates from admin CMS
        db.collection("fallstudie_config").doc("market").onSnapshot(doc => {
            if (doc.exists) {
                companyData.marketPrices = doc.data();
                injectMarketData();
            }
        });
    }
}, 1000);


// ===================================
// BANK CHAT (FIREBASE)
// ===================================
function renderBankChat(msgs) {
    const cont = document.getElementById("bank-chat-messages");
    if(!cont) return;
    cont.innerHTML = "";
    msgs.forEach(m => {
        const isBot = m.sender === 'bank';
        const senderCls = isBot ? 'chat-contact' : 'chat-user';
        let timeStr = "";
        if (m.time) {
            timeStr = new Date(m.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        cont.innerHTML += `<div class="chat-bubble ${senderCls}"><div class="bubble-text">${m.text}<span class="chat-time">${timeStr}</span></div></div>`;
    });
    cont.scrollTo(0, cont.scrollHeight);
}

function sendBankMessage() {
    const inp = document.getElementById("bank-chat-input");
    const val = inp.value.trim();
    if(!val || typeof db === 'undefined' || !db || !window.currentGroup) return;
    inp.value = "";
    
    db.collection("chat_rooms").doc(window.currentGroup).get().then(doc => {
        let msgs = doc.exists ? doc.data().messages || [] : [];
        msgs.push({ sender: 'student', text: val, time: Date.now() });
        db.collection("chat_rooms").doc(window.currentGroup).set({ messages: msgs });
    });
}

function renderUnternehmenChat(msgs) {
    const cont = document.getElementById("chat-unternehmen-messages");
    if(!cont) return;
    cont.innerHTML = "";
    
    // Add greeting if empty
    if(msgs.length === 0) {
        addChatBubble("unternehmen", companyData.chatContacts["unternehmen"].greeting, "contact");
        return;
    }

    msgs.forEach(m => {
        const isBot = m.sender !== 'student';
        const senderCls = isBot ? 'chat-contact' : 'chat-user';
        let timeStr = "";
        if (m.time) timeStr = new Date(m.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        const bubble = document.createElement("div");
        bubble.className = `chat-bubble ${senderCls}`;
        bubble.innerHTML = `<div class="bubble-text">${m.text}<span class="chat-time">${timeStr}</span></div>`;
        cont.appendChild(bubble);
    });
    cont.scrollTo(0, cont.scrollHeight);
}
