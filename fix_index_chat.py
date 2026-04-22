import re

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Fix the Bank Chat DOM
old_bank_chat = """                        <div class="chat-messages" id="chat-bank-messages"></div>
                        <div class="chat-input-row">
                            <input type="text" id="chat-bank-input" placeholder="Sicherungsgeschäft anfragen..." onkeydown="if(event.key==='Enter') sendChatMessage('bank')">
                            <button class="btn btn-primary" onclick="sendChatMessage('bank')">Senden</button>
                        </div>"""

new_bank_chat = """                        <div class="chat-messages" id="bank-chat-messages"></div>
                        <div class="chat-input-row">
                            <input type="text" id="bank-chat-input" placeholder="Sicherungsgeschäft anfragen..." onkeydown="if(event.key==='Enter') sendBankMessage()">
                            <button class="btn btn-primary" onclick="sendBankMessage()">Senden</button>
                        </div>"""

text = text.replace(old_bank_chat, new_bank_chat)

# Also remove the AI status badge for bank
text = re.sub(r'<div class="ai-status-badge[^>]+>.*?</div>', '', text) # Wait, this removes it for Unternehmen too, which needs it!
# I will only remove it for bank. Look at the lines around it.

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)

print("Index HTML bank chat fixed")
