import re

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Add Bank Chat Navigation Button (hidden)
old_chat_nav = '<button id="nav-chat-unternehmen" class="nav-btn" style="display: none;" onclick="switchTab(\'tab-chat-unternehmen\')">Chat: Kundenunternehmen</button>'
new_chat_nav = old_chat_nav + '\n                <button id="nav-chat-bank" class="nav-btn" style="display: none;" onclick="switchTab(\'tab-chat-bank\')">Chat: Handel (Bank)</button>'
text = text.replace(old_chat_nav, new_chat_nav)

# 2. Add the actual Tab for Bank Chat
old_unternehmen_tab_end = '</div>\n                </div>'
# We have to be careful with replace not to replace all instances. Let's use regex based on the ID.
bank_tab_html = """
                <!-- TAB: CHAT BANK -->
                <div id="tab-chat-bank" class="tab-content" style="display: none;">
                    <h2>Trading Desk (Handel)</h2>
                    <p>Hier können Sie Derivate direkt bei der Bank (Dozent) anfragen.</p>
                    <div class="chat-container">
                        <div class="chat-header">
                            <div class="chat-avatar" id="bank-chat-avatar">GlobalBank</div>
                            <div class="chat-contact-info">
                                <h3 id="bank-chat-name">Trading Desk</h3>
                                <p id="bank-chat-role">Financial Markets & Commodities Bank</p>
                            </div>
                        </div>
                        <div class="chat-messages" id="bank-chat-messages">
                            <!-- Messages go here -->
                        </div>
                        <div class="chat-input-area">
                            <input type="text" id="bank-chat-input" placeholder="Nachricht an den Handel..." onkeydown="if(event.key==='Enter') sendBankMessage()">
                            <button onclick="sendBankMessage()">Senden</button>
                        </div>
                    </div>
                </div>
"""
# Insert before <!-- TAB: TASK / AUFGABEN -->
text = text.replace('<!-- TAB: TASK / AUFGABEN -->', bank_tab_html + '\n                <!-- TAB: TASK / AUFGABEN -->')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)

with open('app.js', 'r', encoding='utf-8') as f:
    app_text = f.read()

# Update window.db listener to also show BANK tab
app_text = app_text.replace(
    "if(document.getElementById('nav-chat-unternehmen')) document.getElementById('nav-chat-unternehmen').style.display = data.show_chat ? 'block' : 'none';",
    "if(document.getElementById('nav-chat-unternehmen')) document.getElementById('nav-chat-unternehmen').style.display = data.show_chat ? 'block' : 'none';\n                if(document.getElementById('nav-chat-bank')) document.getElementById('nav-chat-bank').style.display = data.show_bank_chat ? 'block' : 'none';"
)
with open('app.js', 'w', encoding='utf-8') as f:
    f.write(app_text)

print("HTML and UI modified successfully")
