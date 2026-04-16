// ============================================================
// APP.JS – KabelWerke Fallstudie v3 (mit Chat-System)
// ============================================================

let currentRole = "";
let saveTimeout = null;

document.addEventListener("DOMContentLoaded", () => {
    try { injectCompanyWebsite(); } catch(e) { console.error("company:", e); }
    try { injectProducts(); } catch(e) { console.error("products:", e); }
    try { injectBilanz(); } catch(e) { console.error("bilanz:", e); }
    try { injectGuV(); } catch(e) { console.error("guv:", e); }
    try { injectLagebericht(); } catch(e) { console.error("lagebericht:", e); }
    try { injectMarketData(); } catch(e) { console.error("market:", e); }
    try { injectTaskQuestions(); } catch(e) { console.error("tasks:", e); }
    try { initChats(); } catch(e) { console.error("chat:", e); }
    try { updateConnectionStatus(); } catch(e) { console.error("firebase:", e); }
});

// ============================================================
// LOGIN & NAV
// ============================================================
function loginAs(role) {
    currentRole = role;
    document.getElementById("user-role-badge").innerText = role;
    document.getElementById("login-view").classList.remove("active");
    document.getElementById("dashboard-view").classList.add("active");
    if (role === "Dozent") {
        document.querySelectorAll(".student-only").forEach(el => el.classList.add("hidden"));
        document.querySelectorAll(".lecturer-only").forEach(el => el.classList.remove("hidden"));
        switchTab("tab-lecturer");
    } else {
        document.querySelectorAll(".student-only").forEach(el => el.classList.remove("hidden"));
        document.querySelectorAll(".lecturer-only").forEach(el => el.classList.add("hidden"));
        loadSavedAnswers();
        switchTab("tab-company");
    }
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
            <div class="market-card-header"><h3>Kupfer (LME)</h3><span class="market-card-icon">🔶</span></div>
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
            <div class="market-card-header"><h3>EUA (ICE)</h3><span class="market-card-icon">🌍</span></div>
            <table class="market-table">
                <tr><td>Spot</td><td class="market-spot">${mp.eua.spot.toFixed(2)} EUR/t CO₂</td></tr>
                <tr><td>12M Forward</td><td>${mp.eua.forward12m.toFixed(2)} EUR/t CO₂</td></tr>
            </table>
        </div>
        <div class="market-card">
            <div class="market-card-header"><h3>EUR/USD</h3><span class="market-card-icon">💱</span></div>
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
// CHAT SYSTEM
// ============================================================
function initChats() {
    ["einkauf", "finanzen"].forEach(contactId => {
        const contact = companyData.chatContacts[contactId];
        document.getElementById(`chat-${contactId}-name`).innerText = contact.name;
        document.getElementById(`chat-${contactId}-role`).innerText = contact.role;
        addChatBubble(contactId, contact.greeting, "contact");
    });
}

function sendChatMessage(contactId) {
    const input = document.getElementById(`chat-${contactId}-input`);
    const message = input.value.trim();
    if (!message) return;
    input.value = "";

    addChatBubble(contactId, message, "user");

    // Simulate typing delay
    setTimeout(() => {
        const response = findChatResponse(contactId, message);
        addChatBubble(contactId, response, "contact");
    }, 600 + Math.random() * 800);
}

function findChatResponse(contactId, question) {
    const contact = companyData.chatContacts[contactId];
    const q = question.toLowerCase();

    // Suche nach passenden Keywords
    let bestMatch = null;
    let bestScore = 0;

    contact.responses.forEach(r => {
        let score = 0;
        r.keywords.forEach(kw => {
            if (q.includes(kw.toLowerCase())) score++;
        });
        if (score > bestScore) {
            bestScore = score;
            bestMatch = r;
        }
    });

    if (bestMatch && bestScore > 0) {
        return bestMatch.answer;
    }
    return contact.fallback;
}

function addChatBubble(contactId, text, sender) {
    const container = document.getElementById(`chat-${contactId}-messages`);
    const bubble = document.createElement("div");
    bubble.className = `chat-bubble chat-${sender}`;

    const avatar = sender === "contact" ? companyData.chatContacts[contactId].avatar : "👤";
    bubble.innerHTML = `<span class="bubble-avatar">${avatar}</span><div class="bubble-text">${text}</div>`;

    container.appendChild(bubble);
    container.scrollTop = container.scrollHeight;
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
// LECTURER
// ============================================================
function loadGroupAnswers(groupName) {
    document.getElementById("presentation-group-name").innerText = groupName;
    document.getElementById("presentation-board").classList.remove("hidden");
    const container = document.getElementById("presentation-answers");
    const render = (data) => {
        container.innerHTML = "";
        companyData.questions.forEach(q => {
            const answer = data ? (data[q.id] || "Noch nicht bearbeitet.") : "Noch nicht bearbeitet.";
            container.innerHTML += `<div class="pres-item"><h4>${q.title}</h4><div class="pres-item-text">${answer}</div></div>`;
        });
    };
    if (typeof useFirebase !== 'undefined' && useFirebase && db) {
        db.collection("fallstudie_ergebnisse").doc(groupName).get().then(doc => { render(doc.exists ? doc.data() : null); });
    } else {
        const local = localStorage.getItem("fallstudie_" + groupName);
        render(local ? JSON.parse(local) : null);
    }
}

// ============================================================
// UTILITIES
// ============================================================
function formatEur(val) {
    if (!val) return "";
    const str = val.toString().replace(/[+\-]/g, '').trim();
    const prefix = val.toString().startsWith("-") ? "- " : (val.toString().startsWith("+") ? "+ " : "");
    return prefix + str + " €";
}
function showToast() {
    const t = document.getElementById("toast"); t.classList.add("show");
    setTimeout(() => t.classList.remove("show"), 2500);
}
