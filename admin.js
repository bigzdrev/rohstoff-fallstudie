let currentGroupChat = "Gruppe 1";
let totalGroups = 4;
let unsubChat = null;
let unsubTasks = [];

document.addEventListener("DOMContentLoaded", () => {
    // Hide dashboard initially
    document.getElementById("dashboard-view").style.display = "none";
});

function loginAdmin() {
    const pw = document.getElementById("admin-password").value;
    if (pw === "ZWRMSVM") {
        document.getElementById("login-view").style.display = "none";
        document.getElementById("dashboard-view").style.display = "flex";
        initAdminData();
    } else {
        document.getElementById("admin-error").style.display = "block";
    }
}

function initAdminData() {
    if (!db) {
        alert("Firebase ist nicht geladen/konfiguriert!");
        return;
    }

    // 1. Listen to global configuration
    db.collection("fallstudie_config").doc("settings").onSnapshot(doc => {
        if (doc.exists) {
            const d = doc.data();
            document.getElementById("group-count-input").value = d.group_count || 4;
            document.getElementById("check-produkte").checked = !!d.show_produkte;
            document.getElementById("check-bilanz").checked = !!d.show_bilanz;
            document.getElementById("check-lagebericht").checked = !!d.show_lagebericht;
            document.getElementById("check-marktdaten").checked = !!d.show_marktdaten;
            document.getElementById("check-chat").checked = !!d.show_chat;
            document.getElementById("check-bank-chat").checked = !!d.show_bank_chat;
            document.getElementById("check-aufgaben").checked = !!d.show_aufgaben;

            if (d.group_count !== totalGroups) {
                totalGroups = d.group_count;
                updateGroupSelector();
                bindTaskListeners();
            }
        } else {
            updateGroupSelector();
            bindTaskListeners();
        }
    });

}

function saveAdminSettings() {
    if(!db) return;
    const payload = {
        group_count: parseInt(document.getElementById("group-count-input").value) || 4,
        show_produkte: document.getElementById("check-produkte").checked,
        show_bilanz: document.getElementById("check-bilanz").checked,
        show_lagebericht: document.getElementById("check-lagebericht").checked,
        show_marktdaten: document.getElementById("check-marktdaten").checked,
        show_chat: document.getElementById("check-chat").checked,
        show_bank_chat: document.getElementById("check-bank-chat").checked,
        show_aufgaben: document.getElementById("check-aufgaben").checked
    };
    db.collection("fallstudie_config").doc("settings").set(payload, { merge: true });
}

function updateGroupSelector() {
    const sel = document.getElementById("chat-group-selector");
    const currentVal = sel.value || "Gruppe 1";
    sel.innerHTML = "";
    for(let i=1; i<=totalGroups; i++) {
        sel.innerHTML += `<option value="Gruppe ${i}">Gruppe ${i}</option>`;
    }
    sel.value = currentVal;
    switchAdminChat();
}

function switchAdminChat() {
    const sel = document.getElementById("chat-group-selector");
    currentGroupChat = sel.value;
    
    if (unsubChat) unsubChat();
    const cont = document.getElementById("admin-chat-messages");
    cont.innerHTML = "";

    if (!db) return;
    unsubChat = db.collection("chat_rooms").doc(currentGroupChat).onSnapshot(doc => {
        if(doc.exists) {
            triggerChatRender(doc.data().messages || []);
        }
    });
}

function triggerChatRender(msgs) {
    const cont = document.getElementById("admin-chat-messages");
    cont.innerHTML = "";
    msgs.forEach(m => {
        const isBot = m.sender === 'bank';
        cont.innerHTML += `<div class="msg-bubble ${isBot ? 'bot-msg' : 'user-msg'}">${m.text}</div>`;
    });
    cont.scrollTo(0, cont.scrollHeight);
}

function sendAdminMessage() {
    const inp = document.getElementById("admin-chat-input");
    const text = inp.value.trim();
    if(!text || !db) return;
    inp.value = "";

    db.collection("chat_rooms").doc(currentGroupChat).get().then(doc => {
        let msgs = doc.exists ? doc.data().messages || [] : [];
        msgs.push({ sender: 'bank', text: text, time: Date.now() });
        db.collection("chat_rooms").doc(currentGroupChat).set({ messages: msgs });
    });
}

// Monitoring Tasks
function bindTaskListeners() {
    // Clear old unsubs
    unsubTasks.forEach(u => u());
    unsubTasks = [];

    const container = document.getElementById("monitoring-container");
    container.innerHTML = "";

    for(let i=1; i<=totalGroups; i++) {
        const groupName = `Gruppe ${i}`;
        const card = document.createElement("div");
        card.className = "info-card";
        card.style.marginBottom = "16px";
        card.innerHTML = `<h4 style="margin-bottom:8px; color:var(--brand-red);">${groupName}</h4>
                          <div id="mon-${i}" style="font-size:0.8rem; white-space:pre-wrap; color:var(--text-secondary);">Wartet auf Eingabe...</div>`;
        container.appendChild(card);

        if(db) {
            const u = db.collection("student_tasks").doc(groupName).onSnapshot(doc => {
                const tg = document.getElementById(`mon-${i}`);
                if(doc.exists) {
                    const d = doc.data();
                    let html = "";
                    Object.keys(d).forEach(k => {
                        html += `<b>${k}:</b>\n` + (d[k] || "---") + "\n\n";
                    });
                    tg.innerHTML = html || "Leeres Dokument gesichert.";
                }
            });
            unsubTasks.push(u);
        }
    }
}
