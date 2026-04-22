let currentAdminGroup = "Gruppe 1";
let totalGroups = 4;
let unsubSettings = null;
let unsubGlobal = null;
let unsubChat = null;
let unsubTasks = null;

document.addEventListener("DOMContentLoaded", () => {
    // Hide dashboard initially
    document.getElementById("dashboard-view").style.display = "none";
});

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

function initAdminData() {
    if (!db) return alert("Firebase ist nicht geladen/konfiguriert!");

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

function renderGroupTabs() {
    const container = document.getElementById("admin-group-tabs");
    container.innerHTML = "";
    
    // Safety check if active group doesn't exist anymore
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
    renderGroupTabs(); // repopulate styling
    
    document.getElementById("current-group-title").innerText = `Regiepult: ${groupName}`;
    document.querySelectorAll(".active-group-name").forEach(el => el.innerText = groupName);

    bindSettings();
    bindChat();
    bindTasks();
}

function bindSettings() {
    if (unsubSettings) unsubSettings();
    
    // Clear checks
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
    
    // Only force navigation if the triggered checkbox is actually ACTIVED (checked).
    // We check this by scanning which key is associated with the forceTabTarget and if it is true.
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

function bindChat() {
    if (unsubChat) unsubChat();
    const cont = document.getElementById("admin-chat-messages");
    cont.innerHTML = "";

    unsubChat = db.collection("chat_rooms").doc(currentAdminGroup).onSnapshot(doc => {
        if(doc.exists) {
            const msgs = doc.data().messages || [];
            cont.innerHTML = "";
            msgs.forEach(m => {
                const isBot = m.sender === 'bank';
                const senderCls = isBot ? 'chat-user' : 'chat-contact'; // From admin's perspective, they are the 'user' (bank), student is 'contact'
                const avatar = isBot ? '🏦' : '🧑‍💻';
                let timeStr = "";
                if (m.time) {
                    timeStr = new Date(m.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                }
                cont.innerHTML += `<div class="chat-bubble ${senderCls}"><span class="bubble-avatar">${avatar}</span><div class="bubble-text">${m.text}<span class="chat-time">${timeStr}</span></div></div>`;
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

    db.collection("chat_rooms").doc(currentAdminGroup).get().then(doc => {
        let msgs = doc.exists ? doc.data().messages || [] : [];
        msgs.push({ sender: 'bank', text: text, time: Date.now() });
        db.collection("chat_rooms").doc(currentAdminGroup).set({ messages: msgs });
    });
}

function clearAdminChat() {
    if(!db) return;
    if(confirm(`Möchtest du den gesamten Bank-Chat für ${currentAdminGroup} wirklich löschen?`)) {
        db.collection("chat_rooms").doc(currentAdminGroup).set({ messages: [] }, { merge: true });
    }
}

function bindTasks() {
    if (unsubTasks) unsubTasks();
    const mon = document.getElementById("monitoring-container");
    mon.innerHTML = "Wacht auf Eingaben der Gruppe...";

    unsubTasks = db.collection("student_tasks").doc(currentAdminGroup).onSnapshot(doc => {
        if(doc.exists) {
            const d = doc.data();
            let html = "";
            let keys = Object.keys(d).sort();
            keys.forEach(k => {
                html += `<div style="background: rgba(0,0,0,0.2); padding: 8px; margin-bottom: 8px; border-radius: 4px;">
                    <span style="color:var(--brand-red); font-weight:600; display:block; margin-bottom:4px;">${k.toUpperCase()}</span>
                    ${d[k] || "-"}
                </div>`;
            });
            mon.innerHTML = html || "Die Gruppe hat noch nichts in den Risiko-Formularen abgespeichert.";
        }
    });
}
