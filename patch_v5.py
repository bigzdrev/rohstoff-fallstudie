import re

# 1. Update app.js
with open('app.js', 'r') as f:
    app_js = f.read()

# Remove avatar from addChatBubble
app_js = re.sub(r'const avatar = sender === "contact" \? companyData\.chatContacts\[contactId\]\.avatar : "";\n\s*', '', app_js)
app_js = re.sub(r'<span class="bubble-avatar">\$\{avatar\}</span>', '', app_js)

# Remove avatar from renderBankChat
app_js = re.sub(r"const avatar = isBot \? '🏦' : '';\n\s*", '', app_js)
app_js = re.sub(r'<span class="bubble-avatar">\$\{avatar\}</span>', '', app_js)

# Remove Dozent logic
app_js = re.sub(r'if \(role === "Dozent"\) \{.*?} else \{', 'if (true) {', app_js, flags=re.DOTALL)
app_js = re.sub(r'function loadGroupAnswers\(groupName\) \{.*?\}\n', '', app_js, flags=re.DOTALL)

with open('app.js', 'w') as f:
    f.write(app_js)

# 2. Update admin.js
with open('admin.js', 'r') as f:
    admin_js = f.read()

admin_js = re.sub(r"const avatar = isBot \? '🏦' : '🧑‍💻';\n\s*", '', admin_js)
admin_js = re.sub(r'<span class="bubble-avatar">\$\{avatar\}</span>', '', admin_js)

with open('admin.js', 'w') as f:
    f.write(admin_js)

# 3. Update style.css
with open('style.css', 'r') as f:
    style_css = f.read()

style_css = re.sub(r'\.bubble-avatar \{[^}]+\}\n?', '', style_css)
style_css = re.sub(r'\.chat-avatar \{[^}]+\}\n?', '', style_css)

with open('style.css', 'w') as f:
    f.write(style_css)

# 4. Update index.html
with open('index.html', 'r') as f:
    index_html = f.read()

# Remove Dozent button
index_html = re.sub(r'<button class="btn btn-secondary" onclick="loginAs\(\'Dozent\'\)">Als Dozent \(Auswertung\)</button>', '', index_html)

# Remove Dozent tab
index_html = re.sub(r'<!-- LECTURER BOARD -->.*?</div>\s*<!-- COMPANY MAIN -->', '<!-- COMPANY MAIN -->', index_html, flags=re.DOTALL)

# Remove Lecturer nav button
index_html = re.sub(r'<button class="nav-btn lecturer-only hidden" onclick="switchTab\(\'tab-lecturer\'\)">📊 Ergebnisse</button>', '', index_html)

with open('index.html', 'w') as f:
    f.write(index_html)

print("Patch v5 part 1 complete.")
