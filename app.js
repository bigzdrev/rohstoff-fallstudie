// ============================================================
// APP.JS – KabelWerke Fallstudie v4 (KI-Chat mit Transformers.js)
// ============================================================

let currentRole = "";
let saveTimeout = null;

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
    try { updateConnectionStatus(); } catch(e) { console.error("firebase:", e); }
    
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
        db.collection("chat_rooms").doc(role).onSnapshot(doc => {
            if(doc.exists) renderBankChat(doc.data().messages || []);
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

    // Lazy-load KI wenn ein Chat-Tab geöffnet wird
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
// KI-MODUL: Transformers.js (Open-Source, läuft im Browser)
// ============================================================
async function initAI() {
    aiStatus = "loading";
    updateAIBadges();

    try {
        // Dynamischer Import von Transformers.js (Hugging Face, Open Source)
        const { pipeline, env } = await import("https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2");
        
        // Modelle aus HuggingFace CDN laden, kein lokaler Server nötig
        env.allowLocalModels = false;

        // Kleines, effizientes Embedding-Modell laden (~23 MB, wird im Browser gecacht)
        aiExtractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2", {
            progress_callback: (progress) => {
                if (progress.status === "progress" && progress.progress) {
                    const pct = Math.round(progress.progress);
                    document.querySelectorAll(".ai-progress-text").forEach(el => {
                        el.innerText = `KI lädt: ${pct}%`;
                    });
                }
            }
        });

        // Embeddings für alle Themen-Sätze vorberechnen
        for (const contactId of ["unternehmen", "bank"]) {
            const contact = companyData.chatContacts[contactId];
            aiEmbeddingsCache[contactId] = [];
            for (const r of contact.responses) {
                if (r.topicSentence) {
                    const output = await aiExtractor(r.topicSentence, { pooling: "mean", normalize: true });
                    aiEmbeddingsCache[contactId].push({
                        response: r,
                        embedding: Array.from(output.data)
                    });
                }
            }
        }

        aiStatus = "ready";
        console.log("✅ KI-Modell geladen und Embeddings berechnet!");
    } catch (e) {
        console.warn("⚠️ KI konnte nicht geladen werden, verwende intelligentes Keyword-Matching:", e);
        aiStatus = "error";
    }
    updateAIBadges();
}

function updateAIBadges() {
    document.querySelectorAll(".ai-status-badge").forEach(badge => {
        badge.className = "ai-status-badge";
        if (aiStatus === "loading") {
            badge.classList.add("ai-loading");
            badge.innerHTML = `<span class="ai-spinner"></span><span class="ai-progress-text">KI lädt...</span>`;
        } else if (aiStatus === "ready") {
            badge.classList.add("ai-ready");
            badge.innerHTML = ` KI aktiv`;
        } else if (aiStatus === "error") {
            badge.classList.add("ai-fallback");
            badge.innerHTML = `⚡ Smart-Matching`;
        } else {
            badge.classList.add("ai-idle");
            badge.innerHTML = `⏳ KI bereit`;
        }
    });
}

// Kosinus-Ähnlichkeit für Embedding-Vektoren
function cosineSimilarity(a, b) {
    let dot = 0, normA = 0, normB = 0;
    for (let i = 0; i < a.length; i++) {
        dot += a[i] * b[i];
        normA += a[i] * a[i];
        normB += b[i] * b[i];
    }
    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

// ============================================================
// DEUTSCHES NLP: Erweitertes Keyword-Matching als Fallback
// ============================================================

// Deutsche Synonyme und verwandte Begriffe
const germanSynonyms = {
    "metall": ["kupfer", "rohstoff", "material"],
    "rohstoff": ["kupfer", "material", "metall", "vormaterial"],
    "beschaffung": ["unternehmen", "kupfer", "kaufen", "beziehen"],
    "unternehmenen": ["kupfer", "beschaffung", "kaufen"],
    "beziehen": ["kupfer", "beschaffung", "unternehmen"],
    "truck": ["lkw", "fahrzeug", "flotte"],
    "lastwagen": ["lkw", "fahrzeug", "flotte"],
    "sattelzug": ["lkw", "fahrzeug", "flotte"],
    "treibstoff": ["diesel", "kraftstoff", "sprit"],
    "sprit": ["diesel", "kraftstoff", "treibstoff"],
    "tanken": ["diesel", "kraftstoff"],
    "kraftstoffverbrauch": ["diesel", "verbrauch"],
    "inventur": ["lager", "bestand", "vorräte"],
    "bestandsbewertung": ["vorräte", "bewertung", "niederstwert"],
    "wertberichtigung": ["abschreibung", "wertminderung", "niederstwert"],
    "versand": ["transport", "lieferung", "lkw"],
    "liefern": ["transport", "lieferung", "lkw"],
    "auslieferung": ["transport", "lieferung", "lkw"],
    "bank": ["bilanz", "guv", "ergebnis"],
    "buchführung": ["bilanz", "guv"],
    "kennzahlen": ["bilanz", "eigenkapital", "ebit", "marge"],
    "rendite": ["marge", "ebit", "ergebnis", "gewinn"],
    "profitabilität": ["marge", "ebit", "gewinn"],
    "umwelt": ["co2", "emission", "zertifikat"],
    "klima": ["co2", "emission", "zertifikat"],
    "emissionsrechte": ["co2", "eua", "zertifikat", "emissionshandel"],
    "strom": ["energie", "kraftwerk", "bhkw"],
    "heizung": ["wärme", "energie", "kraftwerk", "bhkw"],
    "erdgas": ["gas", "bhkw", "kraftwerk"],
    "schulden": ["verbindlichkeiten", "fremdkapital", "verschuldung"],
    "kredit": ["verbindlichkeiten", "fremdkapital", "bank"],
    "bank": ["verbindlichkeiten", "fremdkapital", "eigenkapital"],
    "schutz": ["absicherung", "hedging", "sicherung"],
    "absichern": ["absicherung", "hedging", "sicherung"],
    "option": ["absicherung", "hedging", "derivat", "future"],
    "swap": ["absicherung", "hedging", "derivat"],
    "preisrisiko": ["risiko", "absicherung", "preis"],
    "volatilität": ["risiko", "schwankung", "preis"],
    "kabel": ["kupfer", "material", "fertig"],
    "produktion": ["material", "kupfer", "kosten"]
};

// Deutsche Kompositum-Zerlegung (vereinfacht)
function decomposeGermanCompound(word) {
    const parts = [];
    const prefixes = ["kupfer", "diesel", "energie", "kraft", "stoff", "markt", "preis", "lager", "bestands", 
                       "eigen", "kapital", "material", "risiko", "absicherungs", "emissions", "handels", 
                       "wert", "gas", "erdgas", "fahrzeug", "transport", "kosten"];
    
    const lw = word.toLowerCase();
    for (const prefix of prefixes) {
        if (lw.startsWith(prefix) && lw.length > prefix.length + 2) {
            parts.push(prefix.replace(/s$/, ''));  // Remove Fugen-s
            const rest = lw.substring(prefix.length).replace(/^s/, ''); // Remove Fugen-s
            parts.push(rest);
        }
    }
    return parts.length > 0 ? parts : [lw];
}

// Erweitertes deutsches Keyword-Matching
function findChatResponseSmart(contactId, question) {
    const contact = companyData.chatContacts[contactId];
    const q = question.toLowerCase();
    const qWords = q.split(/[\s,;.!?]+/).filter(w => w.length > 2);
    
    // Alle Wörter aus der Frage + Compound-Zerlegung + Synonyme sammeln
    const expandedTerms = new Set();
    qWords.forEach(word => {
        expandedTerms.add(word);
        // Compound-Zerlegung
        decomposeGermanCompound(word).forEach(part => expandedTerms.add(part));
        // Synonyme nachschlagen
        if (germanSynonyms[word]) {
            germanSynonyms[word].forEach(syn => expandedTerms.add(syn));
        }
    });

    let bestMatch = null;
    let bestScore = 0;

    contact.responses.forEach(r => {
        let score = 0;
        r.keywords.forEach(kw => {
            // Exakte Treffer (doppelt gewichtet)
            if (q.includes(kw.toLowerCase())) {
                score += 2;
            }
            // Treffer über expandierte Terme
            else if (expandedTerms.has(kw.toLowerCase())) {
                score += 1.5;
            }
            // Fuzzy-Match (Teilstring)
            else {
                for (const term of expandedTerms) {
                    if (term.length > 3 && kw.includes(term)) {
                        score += 0.5;
                        break;
                    }
                }
            }
        });
        if (score > bestScore) {
            bestScore = score;
            bestMatch = r;
        }
    });

    return { match: bestMatch, score: bestScore };
}

// ============================================================
// CHAT SYSTEM (KI + Smart-Matching Hybrid)
// ============================================================
function initChats() {
    ["unternehmen", "bank"].forEach(contactId => {
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

    // Tipp-Animation
    const typingId = addTypingIndicator(contactId);

    // Asynchron antworten (KI oder Fallback)
    (async () => {
        const delay = 800 + Math.random() * 1200;
        await new Promise(resolve => setTimeout(resolve, delay));

        let response;
        let method = "keyword";

        if (aiStatus === "ready" && aiEmbeddingsCache[contactId]) {
            try {
                // KI-basierte semantische Suche
                const questionOutput = await aiExtractor(message, { pooling: "mean", normalize: true });
                const qVec = Array.from(questionOutput.data);

                let bestAIMatch = null;
                let bestAIScore = -1;

                aiEmbeddingsCache[contactId].forEach(item => {
                    const sim = cosineSimilarity(qVec, item.embedding);
                    if (sim > bestAIScore) {
                        bestAIScore = sim;
                        bestAIMatch = item.response;
                    }
                });

                // Auch Smart-Matching parallel ausführen
                const smartResult = findChatResponseSmart(contactId, message);

                // Hybrid-Entscheidung: KI UND Keyword-Scores kombinieren
                if (bestAIScore > 0.45) {
                    // KI ist sich sicher → KI-Ergebnis nehmen
                    response = bestAIMatch.answer;
                    method = "ki";
                } else if (bestAIScore > 0.30 && smartResult.score > 0) {
                    // KI hat eine Tendenz UND Keywords passen → KI gewinnt
                    response = bestAIMatch.answer;
                    method = "ki+keyword";
                } else if (smartResult.score > 0 && smartResult.match) {
                    // Nur Keywords matchen
                    response = smartResult.match.answer;
                    method = "keyword";
                } else {
                    response = companyData.chatContacts[contactId].fallback;
                    method = "fallback";
                }

                console.log(`[Chat ${contactId}] Methode: ${method} | KI-Score: ${bestAIScore.toFixed(3)} | Keyword-Score: ${smartResult.score}`);
            } catch (e) {
                console.warn("KI-Fehler, Fallback auf Smart-Matching:", e);
                const smartResult = findChatResponseSmart(contactId, message);
                response = (smartResult.score > 0 && smartResult.match) ? smartResult.match.answer : companyData.chatContacts[contactId].fallback;
            }
        } else {
            // Kein KI-Modell → Smart-Matching
            const smartResult = findChatResponseSmart(contactId, message);
            response = (smartResult.score > 0 && smartResult.match) ? smartResult.match.answer : companyData.chatContacts[contactId].fallback;
            method = smartResult.score > 0 ? "smart" : "fallback";
        }

        removeTypingIndicator(typingId);
        addChatBubble(contactId, response, "contact");
    })();
}

function addChatBubble(contactId, text, sender) {
    const container = document.getElementById(`chat-${contactId}-messages`);
    const bubble = document.createElement("div");
    bubble.className = `chat-bubble chat-${sender}`;
    const avatar = sender === "contact" ? companyData.chatContacts[contactId].avatar : "";
    bubble.innerHTML = `<span class="bubble-avatar">${avatar}</span><div class="bubble-text">${text}</div>`;
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
    el.innerHTML = `<span class="bubble-avatar">${contact.avatar}</span><div class="bubble-text"><span class="dot-pulse"><span></span><span></span><span></span></span> <em>${contact.name} tippt...</em></div>`;
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
        cont.innerHTML += `<div class="msg-bubble ${isBot ? 'bot-msg' : 'user-msg'}">${m.text}</div>`;
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
