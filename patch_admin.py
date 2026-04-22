import re

# Patch Admin.js
with open('admin.js', 'r') as f:
    admin_js = f.read()

# Fix tasks listening to fallstudie_ergebnisse instead of student_tasks
admin_js = admin_js.replace('db.collection("student_tasks")', 'db.collection("fallstudie_ergebnisse")')

# Add Unternehmens-Chat binding
# We need to toggle between Bank Chat and Unternehmen Chat in Admin
# Let's add a global variable for activeAdminChatType = "bank"
admin_js = re.sub(r'let currentAdminGroup = "Gruppe 1";', 'let currentAdminGroup = "Gruppe 1";\nlet activeAdminChatType = "bank";', admin_js)

# Replace bindChat
bind_chat_replacement = """function bindChat() {
    if (unsubChat) unsubChat();
    const cont = document.getElementById("admin-chat-messages");
    cont.innerHTML = "";

    const collectionName = activeAdminChatType === "bank" ? "chat_rooms" : "chat_rooms_unternehmen";
    
    unsubChat = db.collection(collectionName).doc(currentAdminGroup).onSnapshot(doc => {
        if(doc.exists) {
            const msgs = doc.data().messages || [];
            cont.innerHTML = "";
            msgs.forEach(m => {
                const isBot = m.sender !== 'student';
                const senderCls = isBot ? 'chat-user' : 'chat-contact'; // Admin is user
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
    });
}"""

admin_js = re.sub(r'function bindChat\(\) \{.*?\n\}\n(?=function sendAdminMessage)', bind_chat_replacement + '\n', admin_js, flags=re.DOTALL)

# Replace sendAdminMessage
send_msg_replacement = """function sendAdminMessage(templateText = null) {
    const inp = document.getElementById("admin-chat-input");
    const text = templateText || inp.value.trim();
    if(!text || !db) return;
    if(!templateText) inp.value = "";

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
    document.getElementById("btn-chat-bank").className = type === "bank" ? "btn btn-primary" : "btn btn-secondary";
    document.getElementById("btn-chat-unternehmen").className = type === "unternehmen" ? "btn btn-primary" : "btn btn-secondary";
    bindChat();
}

function clearAdminChat() {
    if(!db) return;
    const collectionName = activeAdminChatType === "bank" ? "chat_rooms" : "chat_rooms_unternehmen";
    if(confirm(`Möchtest du den Chat für ${currentAdminGroup} wirklich löschen?`)) {
        db.collection(collectionName).doc(currentAdminGroup).set({ messages: [] }, { merge: true });
    }
}
"""
admin_js = re.sub(r'function sendAdminMessage\(\) \{.*?\n\}\n\nfunction clearAdminChat\(\) \{.*?\n\}\n', send_msg_replacement, admin_js, flags=re.DOTALL)


# Session Archiving
session_archiving = """
function archiveSession() {
    if(!db) return;
    const sessionName = prompt("Name für diese Session (z.B. Kurs vom 22.04.):", "Session " + new Date().toLocaleDateString());
    if(!sessionName) return;

    db.collection("archived_sessions").add({
        name: sessionName,
        date: Date.now(),
        data: "Session data placeholder"
    }).then(() => {
        alert("Session wurde archiviert!");
    });
}
"""
admin_js += session_archiving

with open('admin.js', 'w') as f:
    f.write(admin_js)

print("admin.js patched")
