import re

with open('app.js', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Update loginAs
login_old = """function loginAs(role) {
    currentRole = role;
    document.getElementById("user-role-badge").innerText = role;
    document.getElementById("login-view").classList.remove("active");
    document.getElementById("dashboard-view").classList.add("active");
    if (role === "Dozent") {"""

login_new = """function loginAs(role) {
    currentRole = role;
    window.currentGroup = role; // global identifier for Firebase
    document.getElementById("user-role-badge").innerText = role;
    document.getElementById("login-view").classList.remove("active");
    document.getElementById("dashboard-view").classList.add("active");
    
    // Bind Firebase chat if not Dozent
    if(role !== "Dozent" && typeof db !== 'undefined' && db !== null) {
        db.collection("chat_rooms").doc(role).onSnapshot(doc => {
            if(doc.exists) {
                renderBankChat(doc.data().messages || []);
            }
        });
    }
    
    if (role === "Dozent") {"""

text = text.replace(login_old, login_new)

# 2. Add sendBankMessage and renderBankChat
chat_logic = """
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
    if(!val || !window.db || !window.currentGroup) return;
    inp.value = "";
    
    db.collection("chat_rooms").doc(window.currentGroup).get().then(doc => {
        let msgs = doc.exists ? doc.data().messages || [] : [];
        msgs.push({ sender: 'student', text: val, time: Date.now() });
        db.collection("chat_rooms").doc(window.currentGroup).set({ messages: msgs });
    });
}
"""
# Append at the end before snapshot
text = text.replace("// Regiepult updates für Studenten", chat_logic + "\n                // Regiepult updates für Studenten")

# 3. Modify saveTaskInput to push to Firebase
task_save_old = """function saveTaskInput(id) {
    const el = document.getElementById(id);
    if (!el) return;
    localStorage.setItem(id + "_" + currentRole, el.value);
    
    const status = document.getElementById('status-' + id);
    if (status) {
        status.innerText = "Gespeichert (" + new Date().toLocaleTimeString() + ")";
        status.style.opacity = 1;
        setTimeout(() => { status.style.opacity = 0; }, 2000);
    }
}"""

task_save_new = """function saveTaskInput(id) {
    const el = document.getElementById(id);
    if (!el) return;
    localStorage.setItem(id + "_" + currentRole, el.value);
    
    // Save to Firebase for Admin Monitoring
    if (currentRole !== "Dozent" && typeof db !== 'undefined' && db !== null) {
        let payload = {};
        payload[id] = el.value;
        db.collection("student_tasks").doc(currentRole).set(payload, { merge: true });
    }

    const status = document.getElementById('status-' + id);
    if (status) {
        status.innerText = "Gespeichert (" + new Date().toLocaleTimeString() + ")";
        status.style.opacity = 1;
        setTimeout(() => { status.style.opacity = 0; }, 2000);
    }
}"""

text = text.replace(task_save_old, task_save_new)

with open('app.js', 'w', encoding='utf-8') as f:
    f.write(text)

