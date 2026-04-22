import re

with open('app.js', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Provide sendBankMessage / renderBankChat
bank_logic = """
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
"""

if "function sendBankMessage" not in text:
    text += "\n" + bank_logic

# 2. Prevent the AI from hijacking Bank
ai_block_search = r'function processChatData\(contactId, userMsg\)\s*\{'
ai_block_replace = r'function processChatData(contactId, userMsg) {\n    if (contactId === "bank") return; // Bank is manual via Firebase!\n'
text = re.sub(ai_block_search, ai_block_replace, text)

# 3. Remove "force navigation" from onSnapshot in app.js
force_nav_regex = r'// Force Navigation.*?switchTab\(data\.force_tab\);\s*\}'
text = re.sub(force_nav_regex, '// Zwanghafte Navigation auf Kundenwunsch deaktiviert.', text, flags=re.DOTALL)

with open('app.js', 'w', encoding='utf-8') as f:
    f.write(text)

print("App patched")
