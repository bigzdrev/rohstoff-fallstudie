// Globale State-Variablen
let currentRole = "";
let saveTimeout = null;

// Initialisierung bei Ladevorgang
document.addEventListener("DOMContentLoaded", () => {
    injectCompanyData();
    updateConnectionStatus(); // Aus firebase-config.js
});

// -- LOGIN & NAVIGATION --
function loginAs(role) {
    currentRole = role;
    
    // UI Updates
    document.getElementById("user-role-badge").innerText = role;
    document.getElementById("login-view").classList.remove("active");
    document.getElementById("dashboard-view").classList.add("active");
    
    // Layout basierend auf Rolle anpassen
    let tabsToHide = [];
    let tabsToShow = [];
    
    if (role === "Dozent") {
        document.querySelectorAll(".student-only").forEach(el => el.classList.add("hidden"));
        document.querySelectorAll(".lecturer-only").forEach(el => el.classList.remove("hidden"));
        switchTab("tab-lecturer"); // Dozent startet direkt in der Übersicht
    } else {
        document.querySelectorAll(".student-only").forEach(el => el.classList.remove("hidden"));
        document.querySelectorAll(".lecturer-only").forEach(el => el.classList.add("hidden"));
        loadLocalAnswers(); // Lade bisherige Antworten der Gruppe
        switchTab("tab-website"); // Gruppen starten bei Recherche
    }
}

function logout() {
    currentRole = "";
    document.getElementById("dashboard-view").classList.remove("active");
    document.getElementById("login-view").classList.add("active");
    
    // Reset tabs
    document.querySelectorAll(".nav-btn").forEach(btn => btn.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
}

function switchTab(tabId) {
    // Update Navigation highlighting
    document.querySelectorAll(".nav-btn").forEach(btn => {
        btn.classList.remove("active");
        if(btn.getAttribute("onclick").includes(tabId)) {
            btn.classList.add("active");
            document.getElementById("current-tab-title").innerText = btn.innerText.replace(/[^\w\s-]/gi, '').trim();
        }
    });
    
    // Switch Content
    document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
    document.getElementById(tabId).classList.add("active");
}

// -- DATEN INJEZIEREN --
function injectCompanyData() {
    // 1. Operations (Website Tab)
    const opContainer = document.getElementById("company-operations");
    companyData.operations.forEach(op => {
        opContainer.innerHTML += `
            <div class="operation-card">
                <h3>${op.title}</h3>
                <p>${op.text}</p>
            </div>
        `;
    });
    
    // 2. Financials & Balance
    const guvTable = document.getElementById("guv-table").querySelector("tbody");
    companyData.financials.forEach(item => {
        guvTable.innerHTML += `<tr><td>${item.category}</td><td>${item.value}</td></tr>`;
    });
    
    const balanceTable = document.getElementById("balance-table").querySelector("tbody");
    companyData.balance.forEach(item => {
        balanceTable.innerHTML += `<tr><td>${item.category}</td><td>${item.value}</td></tr>`;
    });
}

// -- DATEN SPEICHERN & LADEN (STUDENT) --
function saveFormData() {
    const dataObj = {
        gruppe: currentRole,
        q1: document.getElementById("ans-q1").value,
        q2: document.getElementById("ans-q2").value,
        q3: document.getElementById("ans-q3").value,
        q4: document.getElementById("ans-q4").value,
        timestamp: new Date().getTime()
    };

    if (useFirebase && db) {
        db.collection("fallstudie_ergebnisse").doc(currentRole).set(dataObj)
        .then(() => showToast())
        .catch(err => alert("Fehler beim Speichern in Firebase: " + err));
    } else {
        // Lokaler Fallback
        localStorage.setItem("fallstudie_" + currentRole, JSON.stringify(dataObj));
        showToast();
    }
}

// Event Listeners für Auto-Save beim Tippen
document.querySelectorAll("#analysis-form textarea").forEach(ta => {
    ta.addEventListener("input", () => {
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(() => {
            saveFormData();
        }, 3000); // Speichere 3 Sek nach letzter Eingabe
    });
});

function loadLocalAnswers() {
    if (useFirebase && db) {
        db.collection("fallstudie_ergebnisse").doc(currentRole).get().then((doc) => {
            if (doc.exists) {
                let d = doc.data();
                document.getElementById("ans-q1").value = d.q1 || "";
                document.getElementById("ans-q2").value = d.q2 || "";
                document.getElementById("ans-q3").value = d.q3 || "";
                document.getElementById("ans-q4").value = d.q4 || "";
            }
        });
    } else {
        const local = localStorage.getItem("fallstudie_" + currentRole);
        if (local) {
            const d = JSON.parse(local);
            document.getElementById("ans-q1").value = d.q1 || "";
            document.getElementById("ans-q2").value = d.q2 || "";
            document.getElementById("ans-q3").value = d.q3 || "";
            document.getElementById("ans-q4").value = d.q4 || "";
        }
    }
}

// -- DOZENTEN PRÄSENTATION --
function loadGroupAnswers(groupName) {
    document.getElementById("presentation-group-name").innerText = groupName;
    document.getElementById("presentation-board").classList.remove("hidden");
    
    const fields = ['q1', 'q2', 'q3', 'q4'];
    
    if (useFirebase && db) {
        db.collection("fallstudie_ergebnisse").doc(groupName).get().then((doc) => {
            if (doc.exists) {
                let d = doc.data();
                fields.forEach(f => {
                    document.getElementById("pres-" + f).innerText = d[f] || "Keine Antwort hinterlegt.";
                });
            } else {
                fields.forEach(f => {
                    document.getElementById("pres-" + f).innerText = "Noch nicht begonnen.";
                });
            }
        });
    } else {
        const local = localStorage.getItem("fallstudie_" + groupName);
        if (local) {
            const d = JSON.parse(local);
            fields.forEach(f => {
                document.getElementById("pres-" + f).innerText = d[f] || "Keine Antwort hinterlegt.";
            });
        } else {
            fields.forEach(f => {
                document.getElementById("pres-" + f).innerText = "Noch nicht begonnen.";
            });
        }
    }
}

// -- UTILS --
function showToast() {
    const toast = document.getElementById("toast");
    toast.classList.add("show");
    setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}
