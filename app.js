// ============================================================
// APP.JS – Frontend Logic für KabelWerke Fallstudie
// ============================================================

let currentRole = "";
let saveTimeout = null;

// ---- INIT ----
document.addEventListener("DOMContentLoaded", () => {
    try { injectCompanyWebsite(); } catch(e) { console.error("injectCompanyWebsite:", e); }
    try { injectProducts(); } catch(e) { console.error("injectProducts:", e); }
    try { injectBilanz(); } catch(e) { console.error("injectBilanz:", e); }
    try { injectGuV(); } catch(e) { console.error("injectGuV:", e); }
    try { injectMarketData(); } catch(e) { console.error("injectMarketData:", e); }
    try { injectTaskQuestions(); } catch(e) { console.error("injectTaskQuestions:", e); }
    try { updateConnectionStatus(); } catch(e) { console.error("updateConnectionStatus:", e); }
});

// ============================================================
// LOGIN & NAVIGATION
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
    document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
}

function switchTab(tabId) {
    document.querySelectorAll(".nav-btn").forEach(btn => {
        btn.classList.remove("active");
        if (btn.getAttribute("onclick") && btn.getAttribute("onclick").includes(tabId)) {
            btn.classList.add("active");
            const title = btn.innerText.replace(/^[^\w\säöüÄÖÜ]*/i, '').trim();
            document.getElementById("current-tab-title").innerText = title;
        }
    });
    document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
    document.getElementById(tabId).classList.add("active");
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
        grid.innerHTML += `
            <div class="product-card">
                <span class="product-emoji">${p.image_emoji}</span>
                <span class="product-category">${p.category}</span>
                <h4>${p.name}</h4>
                <p>${p.description}</p>
                <span class="copper-badge">🔶 ${p.copper_content}</span>
            </div>
        `;
    });
}

// ============================================================
// INJECT: BILANZ (HGB)
// ============================================================
function injectBilanz() {
    renderBilanzSide("bilanz-aktiva", companyData.bilpianz.aktiva);
    renderBilanzSide("bilanz-passiva", companyData.bilpianz.passiva);
}

function renderBilanzSide(containerId, sideData) {
    const container = document.getElementById(containerId);
    let html = `<div class="bilanz-title">${sideData.title}</div>`;

    sideData.sections.forEach(section => {
        if (section.title) {
            html += `<div class="bilanz-section-title">${section.title}</div>`;
        }
        html += `<table class="finance-table"><tbody>`;
        section.items.forEach(item => {
            let rowClass = "";
            if (item.total) rowClass = "row-total";
            else if (item.bold) rowClass = "row-bold";
            else if (item.sub) rowClass = "row-sub";

            const note = item.note ? `<span class="row-note">→ ${item.note}</span>` : "";
            const val = item.value ? formatEur(item.value) : "";

            html += `<tr class="${rowClass}"><td>${item.label}${note}</td><td>${val}</td></tr>`;
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
        if (!item.label) {
            tbody.innerHTML += `<tr class="row-spacer"><td></td><td></td></tr>`;
            return;
        }
        let rowClass = "";
        if (item.total) rowClass = "row-total";
        else if (item.line) rowClass = "row-bold row-line";
        else if (item.bold) rowClass = "row-bold";
        else if (item.sub) rowClass = "row-sub";

        const note = item.note ? `<span class="row-note">→ ${item.note}</span>` : "";
        const val = item.value ? formatEur(item.value) : "";
        const indent = item.label.startsWith("   ") ? ' class="indent"' : '';

        tbody.innerHTML += `<tr class="${rowClass}"><td${indent}>${item.label.trim()}${note}</td><td>${val}</td></tr>`;
    });
}

// ============================================================
// INJECT: MARKET DATA
// ============================================================
function injectMarketData() {
    const mp = companyData.marketPrices;
    document.getElementById("market-date").innerText = mp.date;

    const grid = document.getElementById("market-grid");

    // Copper
    grid.innerHTML += `
        <div class="market-card">
            <div class="market-card-header"><h3>Kupfer (LME)</h3><span class="market-card-icon">🔶</span></div>
            <table class="market-table">
                <tr><td>Spot (Cash Settlement)</td><td class="market-spot">${mp.copper.spotUsd.toLocaleString()} USD/t</td></tr>
                <tr><td>Spot in EUR</td><td class="market-spot">${mp.copper.spotEur.toLocaleString()} EUR/t</td></tr>
                <tr><td>Forward 3 Monate</td><td>${mp.copper.forward3m.toLocaleString()} USD/t</td></tr>
                <tr><td>Forward 6 Monate</td><td>${mp.copper.forward6m.toLocaleString()} USD/t</td></tr>
                <tr><td>Forward 12 Monate</td><td>${mp.copper.forward12m.toLocaleString()} USD/t</td></tr>
            </table>
        </div>
    `;

    // Diesel / Gasoil
    grid.innerHTML += `
        <div class="market-card">
            <div class="market-card-header"><h3>Diesel / Gasoil (ICE)</h3><span class="market-card-icon">⛽</span></div>
            <table class="market-table">
                <tr><td>Spot (Low Sulphur Gasoil)</td><td class="market-spot">${mp.diesel.spotUsd.toLocaleString()} USD/mT</td></tr>
                <tr><td>Spot in EUR</td><td class="market-spot">${mp.diesel.spotEur.toLocaleString()} EUR/mT</td></tr>
                <tr><td>Forward 6 Monate</td><td>${mp.diesel.forward6m.toLocaleString()} USD/mT</td></tr>
                <tr><td>Forward 12 Monate</td><td>${mp.diesel.forward12m.toLocaleString()} USD/mT</td></tr>
                <tr><td class="row-note" style="padding-top:8px">1 metr. Tonne ≈ 1.183 Liter Diesel</td><td></td></tr>
            </table>
        </div>
    `;

    // EUA
    grid.innerHTML += `
        <div class="market-card">
            <div class="market-card-header"><h3>CO₂-Zertifikate (EUA)</h3><span class="market-card-icon">🌍</span></div>
            <table class="market-table">
                <tr><td>Spot (ICE EUA)</td><td class="market-spot">${mp.eua.spot.toFixed(2)} EUR/t CO₂</td></tr>
                <tr><td>Forward 12 Monate</td><td>${mp.eua.forward12m.toFixed(2)} EUR/t CO₂</td></tr>
            </table>
        </div>
    `;

    // EUR/USD
    grid.innerHTML += `
        <div class="market-card">
            <div class="market-card-header"><h3>Wechselkurs</h3><span class="market-card-icon">💱</span></div>
            <table class="market-table">
                <tr><td>EUR/USD</td><td class="market-spot">${mp.eurUsd.toFixed(4)}</td></tr>
                <tr><td class="row-note" style="padding-top:8px">Relevant für USD-denominierte Rohstoffe (Kupfer, Gasoil)</td><td></td></tr>
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
        const hint = q.hint ? `<div class="task-hint">${q.hint}</div>` : '';
        container.innerHTML += `
            <div class="task-card">
                <h4>${q.title}</h4>
                <div class="task-prompt">${q.prompt}</div>
                ${hint}
                <textarea id="ans-${q.id}" rows="5" placeholder="Ihre Analyse..."></textarea>
            </div>
        `;
    });

    // Auto-save listeners
    setTimeout(() => {
        document.querySelectorAll("#analysis-form textarea").forEach(ta => {
            ta.addEventListener("input", () => {
                clearTimeout(saveTimeout);
                saveTimeout = setTimeout(() => saveFormData(), 3000);
            });
        });
    }, 100);
}

// ============================================================
// SAVE & LOAD (Firebase + LocalStorage Fallback)
// ============================================================
function saveFormData() {
    const dataObj = { gruppe: currentRole, timestamp: new Date().getTime() };
    companyData.questions.forEach(q => {
        dataObj[q.id] = document.getElementById("ans-" + q.id).value;
    });

    if (useFirebase && db) {
        db.collection("fallstudie_ergebnisse").doc(currentRole).set(dataObj)
            .then(() => showToast())
            .catch(err => alert("Fehler: " + err));
    } else {
        localStorage.setItem("fallstudie_" + currentRole, JSON.stringify(dataObj));
        showToast();
    }
}

function loadSavedAnswers() {
    if (useFirebase && db) {
        db.collection("fallstudie_ergebnisse").doc(currentRole).get().then(doc => {
            if (doc.exists) {
                const d = doc.data();
                companyData.questions.forEach(q => {
                    const el = document.getElementById("ans-" + q.id);
                    if (el) el.value = d[q.id] || "";
                });
            }
        });
    } else {
        const local = localStorage.getItem("fallstudie_" + currentRole);
        if (local) {
            const d = JSON.parse(local);
            companyData.questions.forEach(q => {
                const el = document.getElementById("ans-" + q.id);
                if (el) el.value = d[q.id] || "";
            });
        }
    }
}

// ============================================================
// LECTURER PRESENTATION
// ============================================================
function loadGroupAnswers(groupName) {
    document.getElementById("presentation-group-name").innerText = groupName;
    document.getElementById("presentation-board").classList.remove("hidden");

    const container = document.getElementById("presentation-answers");

    const renderAnswers = (data) => {
        container.innerHTML = "";
        companyData.questions.forEach(q => {
            const answer = data ? (data[q.id] || "Noch nicht bearbeitet.") : "Noch nicht bearbeitet.";
            container.innerHTML += `
                <div class="pres-item">
                    <h4>${q.title}</h4>
                    <div class="pres-item-text">${answer}</div>
                </div>
            `;
        });
    };

    if (useFirebase && db) {
        db.collection("fallstudie_ergebnisse").doc(groupName).get().then(doc => {
            renderAnswers(doc.exists ? doc.data() : null);
        });
    } else {
        const local = localStorage.getItem("fallstudie_" + groupName);
        renderAnswers(local ? JSON.parse(local) : null);
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
    const toast = document.getElementById("toast");
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2500);
}
