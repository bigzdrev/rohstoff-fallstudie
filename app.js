let currentRole = "";
let saveTimeout = null;
let aiStatus = "idle";
let aiExtractor = null;
let aiEmbeddingsCache = {};

document.addEventListener("DOMContentLoaded", () => {
        try { injectCompanyWebsite(); } catch(e) {}
        try { injectProducts(); } catch(e) {}
        try { injectBilanz(); } catch(e) {}
        try { injectGuV(); } catch(e) {}
        try { injectLagebericht(); } catch(e) {}
        try { injectMarketData(); } catch(e) {}
        try { injectTaskQuestions(); } catch(e) {}
        try { initChats(); } catch(e) {}
});

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
                    switchTab("tab-company");
        }
}
function logout() { location.reload(); }
function switchTab(tabId) {
        document.querySelectorAll(".nav-btn").forEach(btn => {
                    btn.classList.remove("active");
                    if (btn.getAttribute("onclick") && btn.getAttribute("onclick").includes(tabId)) {
                                    btn.classList.add("active");
                                    document.getElementById("current-tab-title").innerText = btn.innerText.trim();
                    }
        });
        document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
        document.getElementById(tabId).classList.add("active");
        if (tabId.startsWith("tab-chat-") && aiStatus === "idle") { initAI(); }
}
function switchSubTab(subId, btn) {
        btn.parentElement.querySelectorAll(".sub-tab").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        btn.closest(".tab-content").querySelectorAll(".sub-content").forEach(c => c.classList.remove("active"));
        document.getElementById(subId).classList.add("active");
}
function injectCompanyWebsite() {
        const ws = companyData.website_sections;
        document.getElementById("about-text").innerHTML = ws.about;
        document.getElementById("mission-text").innerHTML = ws.mission;
}
function injectProducts() {
        const grid = document.getElementById("products-grid");
        if(grid) {
                    grid.innerHTML = "";
                    companyData.products.forEach(p => {
                                    grid.innerHTML += `<div class="product-card"><h4>${p.name}</h4><p>${p.description}</p></div>`;
                    });
        }
}
function injectBilanz() {
        renderBilanzSide("bilanz-aktiva", companyData.bilanz.aktiva);
        renderBilanzSide("bilanz-passiva", companyData.bilanz.passiva);
}
function renderBilanzSide(containerId, sideData) {
        const container = document.getElementById(containerId);
        if(!container) return;
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
function injectGuV() {
        const tbody = document.getElementById("guv-table") ? document.getElementById("guv-table").querySelector("tbody") : null;
        if(tbody) {
                    tbody.innerHTML = "";
                    companyData.guv.items.forEach(item => {
                                    if (!item.label) { tbody.innerHTML += `<tr class="row-spacer"><td></td><td></td></tr>`; return; }
                                    let cls = item.total ? "row-total" : item.line ? "row-bold row-line" : item.bold ? "row-bold" : item.sub ? "row-sub" : "";
                                    let val = item.value ? formatEur(item.value) : "";
                                    let ind = item.indent ? ' class="indent"' : '';
                                    tbody.innerHTML += `<tr class="${cls}"><td${ind}>${item.label}</td><td>${val}</td></tr>`;
                    });
        }
}
function injectLagebericht() {
        const container = document.getElementById("lagebericht-container");
        if(container) {
                    container.innerHTML = "";
                    companyData.lagebericht.sections.forEach(s => {
                                    container.innerHTML += `<div class="lagebericht-section glass-panel"><h3>${s.title}</h3><p>${s.text}</p></div>`;
                    });
        }
}
function injectMarketData() {
        const mp = companyData.marketPrices;
        const mdate = document.getElementById("market-date");
        if(mdate) mdate.innerText = mp.date;
        const grid = document.getElementById("market-grid");
        if(grid) {
                    grid.innerHTML = `<div class="market-card"><h3>Kupfer</h3><p>${mp.copper.spotUsd} USD</p></div>`;
        }
}
function formatEur(val) { return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(val); }
function injectTaskQuestions() {
        const container = document.getElementById('task-questions-container');
        if(container) {
                    container.innerHTML = '';
                    companyData.questions.forEach(q => {
                                    container.innerHTML += `<div class="task-card"><h4>${q.title}</h4><div class="task-prompt">${q.prompt}</div><textarea id="ans-${q.id}" rows="6" placeholder="Ihre Analyse..."></textarea></div>`;
                    });
                    setTimeout(() => {
                                    document.querySelectorAll("textarea").forEach(ta => {
                                                        ta.addEventListener("input", () => {
                                                                                clearTimeout(saveTimeout);
                                                                                saveTimeout = setTimeout(() => saveFormData(), 3000);
                                                        });
                                    });
                    }, 100);
        }
}
async function initAI() {
        aiStatus = "loading"; updateAIBadges();
        try {
                    const { pipeline, env } = await import("https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2");
                    env.allowLocalModels = false;
                    aiExtractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
                    aiStatus = "ready";
        } catch (e) { aiStatus = "error"; }
        updateAIBadges();
}
function updateAIBadges() {
        document.querySelectorAll(".ai-status-badge").forEach(badge => {
                    if (aiStatus === "loading") badge.innerText = "'Lade KI...';
                                else if (aiStatus === "ready") badge.innerText = 'KI aktiv';
                    else badge.innerText = 'Smart-Matching';
        });
}
function findChatResponseSmart(contactId, question) {
        const contact = companyData.chatContacts[contactId];
        const q = question.toLowerCase();
        let bestMatch = null; let bestScore = 0;
        contact.responses.forEach(r => {
                    let score = 0;
                    r.keywords.forEach(kw => { if (q.includes(kw.toLowerCase())) score += 2; });
                    if (score > bestScore) { bestScore = score; bestMatch = r; }
        });
        return { match: bestMatch, score: bestScore };
}
function initChats() {
        ['unternehmen', 'bank'].forEach(id => {
                    const contact = companyData.chatContacts[id];
                    document.getElementById('chat-' + id + '-name').innerText = contact.name;
                    document.getElementById('chat-' + id + '-role').innerText = contact.role;
                    addChatMessage(id, contact.avatar, contact.greeting, false);
        });
}
function sendChatMessage(contactId) {
        const input = document.getElementById('chat-' + contactId + '-input');
        const text = input.value.trim();
        if (!text) return;
        addChatMessage(contactId, 'User', text, true);
        input.value = '';
        setTimeout(() => {
                    const result = findChatResponseSmart(contactId, text);
                    const contact = companyData.chatContacts[contactId];
                    const response = result.match ? result.match.answer : contact.fallback;
                    addChatMessage(contactId, contact.avatar, response, false);
        }, 800);
}
function addChatMessage(contactId, avatar, text, isUser) {
        const container = document.getElementById('chat-' + contactId + '-messages');
        const bubble = document.createElement('div');
        bubble.className = 'chat-bubble' + (isUser ? ' chat-user' : '');
        bubble.innerHTML = '<div class="bubble-avatar">' + avatar + '</div><div class="bubble-text">' + text + '</div>';
        container.appendChild(bubble);
        container.scrollTop = container.scrollHeight;
}
function saveFormData() {
        const answers = {};
        companyData.questions.forEach(q => {
                    answers[q.id] = document.getElementById('ans-' + q.id).value;
        });
        localStorage.setItem('kabelwerke_answers_' + currentRole, JSON.stringify(answers));
        const t = document.getElementById('toast');
        t.classList.add('show');
        setTimeout(() => t.classList.remove('show'), 3000);
}
function loadSavedAnswers() {
        const saved = localStorage.getItem('kabelwerke_answers_' + currentRole);
        if (saved) {
                    const answers = JSON.parse(saved);
                    Object.keys(answers).forEach(id => {
                                    const el = document.getElementById('ans-' + id);
                                    if (el) el.value = answers[id];
                    });
        }
}
function loadGroupAnswers(group) {
        currentRole = group;
        const saved = localStorage.getItem('kabelwerke_answers_' + group);
        document.getElementById('presentation-board').classList.remove('hidden');
        document.getElementById('presentation-group-name').innerText = group;
        const container = document.getElementById('presentation-answers');
        container.innerHTML = '';
        if (saved) {
                    const answers = JSON.parse(saved);
                    companyData.questions.forEach(q => {
                                    container.innerHTML += '<div class="pres-item"><h4>' + q.title + '</h4><div class="pres-item-text">' + (answers[q.id] || 'Keine Antwort.') + '</div></div>';
                    });
        }
}
function updateConnectionStatus() {}
// ============================================================
// APP.JS (restored)
// ============================================================
let currentRole = "";
let saveTimeout = null;
let aiStatus = "idle";
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
    try { updateConnectionStatus(); } catch(e) { console.error("firebase:", e); }
});
















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
    if (tabId.startsWith("tab-chat-") && aiStatus === "idle") {
        initAI();
    }
}
function switchSubTab(subId, btn) {
    btn.parentElement.querySelectorAll(".sub-tab").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    btn.closest(".tab-content").querySelectorAll(".sub-content").forEach(c => c.classList.remove("active"));
    document.getElementById(subId).classList.add("active");
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
            const title = btn.innerText.replace(/^[^\\\\wäöüÄÖÜ\\\\s]*/i, '').trim();
            document.getElementById("current-tab-title").innerText = title;
        }
    });
    document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
    document.getElementById(tabId).classList.add("active");
    if (tabId.startsWith("tab-chat-") && aiStatus === "idle") {
        initAI();
    }
}
function switchSubTab(subId, btn) {
    btn.parentElement.querySelectorAll(".sub-tab").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    btn.closest(".tab-content").querySelectorAll(".sub-content").forEach(c => c.classList.remove("active"));
    document.getElementById(subId).classList.add("active");
}
