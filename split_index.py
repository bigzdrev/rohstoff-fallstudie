import re
with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Remove the Admin Area from index.html
start_marker = "            <div style=\"margin-top: 32px; padding-top: 16px; border-top: 1px solid var(--border);\">"
end_marker = "        </div>\n    </div>\n\n    <!-- ===================== DASHBOARD ===================== -->"

idx1 = text.find(start_marker)
idx2 = text.find(end_marker, idx1)

if idx1 != -1 and idx2 != -1:
    text = text[:idx1] + text[idx2:]
    
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)

