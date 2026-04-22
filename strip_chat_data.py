import re

with open('data.js', 'r', encoding='utf-8') as f:
    text = f.read()

text = re.sub(r'// ---- CHAT-SYSTEM: UNTERNEHMEN & BANK ----.*?// ---- AUFGABENSTELLUNG ----', '// ---- AUFGABENSTELLUNG ----', text, flags=re.DOTALL)

with open('data.js', 'w', encoding='utf-8') as f:
    f.write(text)

