import re

with open('app.js', 'r') as f:
    app_js = f.read()

# In loginAs, bind the unternehmen chat too
bind_unternehmen_chat = """
        if (unsubBankChat) unsubBankChat();
        unsubBankChat = db.collection("chat_rooms").doc(role).onSnapshot(doc => {
            renderBankChat(doc.exists ? doc.data().messages || [] : []);
        });

        if (window.unsubUnternehmenChat) window.unsubUnternehmenChat();
        window.unsubUnternehmenChat = db.collection("chat_rooms_unternehmen").doc(role).onSnapshot(doc => {
            if(doc.exists) {
                renderUnternehmenChat(doc.data().messages || []);
            } else {
                renderUnternehmenChat([]);
            }
        });
"""
app_js = re.sub(r'if \(unsubBankChat\) unsubBankChat\(\);\n\s*unsubBankChat = db\.collection\("chat_rooms"\)\.doc\(role\)\.onSnapshot\(doc => \{\n\s*renderBankChat.*?\n\s*\}\);', bind_unternehmen_chat, app_js, flags=re.DOTALL)


# Create renderUnternehmenChat
unternehmen_render = """
function renderUnternehmenChat(msgs) {
    const cont = document.getElementById("chat-unternehmen-messages");
    if(!cont) return;
    cont.innerHTML = "";
    
    // Add greeting if empty
    if(msgs.length === 0) {
        addChatBubble("unternehmen", companyData.chatContacts["unternehmen"].greeting, "contact");
        return;
    }

    msgs.forEach(m => {
        const isBot = m.sender !== 'student';
        const senderCls = isBot ? 'chat-contact' : 'chat-user';
        let timeStr = "";
        if (m.time) timeStr = new Date(m.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        const bubble = document.createElement("div");
        bubble.className = `chat-bubble ${senderCls}`;
        bubble.innerHTML = `<div class="bubble-text">${m.text}<span class="chat-time">${timeStr}</span></div>`;
        cont.appendChild(bubble);
    });
    cont.scrollTo(0, cont.scrollHeight);
}
"""
app_js += unternehmen_render

send_unternehmen_chat = """function sendChatMessage(contactId) {
    const input = document.getElementById(`chat-${contactId}-input`);
    const message = input.value.trim();
    if (!message) return;
    input.value = "";
    
    // Push to Firebase
    db.collection("chat_rooms_unternehmen").doc(window.currentGroup).get().then(doc => {
        let msgs = doc.exists ? doc.data().messages || [] : [];
        msgs.push({ sender: 'student', text: message, time: Date.now() });
        db.collection("chat_rooms_unternehmen").doc(window.currentGroup).set({ messages: msgs }).then(() => {
            // Trigger AI response after saving
            triggerAIResponse(contactId, message);
        });
    });
}

function triggerAIResponse(contactId, message) {
    const typingId = addTypingIndicator(contactId);

    // Asynchron antworten (KI oder Fallback)
    setTimeout(async () => {
        let response;
        if (aiStatus === "ready" && aiEmbeddingsCache[contactId]) {
            try {
                const questionOutput = await aiExtractor(message, { pooling: "mean", normalize: true });
                const qVec = Array.from(questionOutput.data);
                let bestAIMatch = null;
                let bestAIScore = -1;
                aiEmbeddingsCache[contactId].forEach(item => {
                    const sim = cosineSimilarity(qVec, item.embedding);
                    if (sim > bestAIScore) { bestAIScore = sim; bestAIMatch = item.response; }
                });
                const smartResult = findChatResponseSmart(contactId, message);
                if (bestAIScore > 0.45) response = bestAIMatch.answer;
                else if (bestAIScore > 0.30 && smartResult.score > 0) response = bestAIMatch.answer;
                else if (smartResult.score > 0 && smartResult.match) response = smartResult.match.answer;
                else response = companyData.chatContacts[contactId].fallback;
            } catch (e) {
                const smartResult = findChatResponseSmart(contactId, message);
                response = (smartResult.score > 0 && smartResult.match) ? smartResult.match.answer : companyData.chatContacts[contactId].fallback;
            }
        } else {
            const smartResult = findChatResponseSmart(contactId, message);
            response = (smartResult.score > 0 && smartResult.match) ? smartResult.match.answer : companyData.chatContacts[contactId].fallback;
        }

        removeTypingIndicator(typingId);
        
        // Push AI response to Firebase
        db.collection("chat_rooms_unternehmen").doc(window.currentGroup).get().then(doc => {
            let msgs = doc.exists ? doc.data().messages || [] : [];
            msgs.push({ sender: 'unternehmen', text: response, time: Date.now() });
            db.collection("chat_rooms_unternehmen").doc(window.currentGroup).set({ messages: msgs });
        });
    }, 1500);
}
"""
app_js = re.sub(r'function sendChatMessage.*?\}\)\(\);\n\}', send_unternehmen_chat, app_js, flags=re.DOTALL)

with open('app.js', 'w') as f:
    f.write(app_js)

print("patch app js chat complete")
