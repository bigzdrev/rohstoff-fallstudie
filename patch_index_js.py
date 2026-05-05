import re

with open('index.html', 'r') as f:
    content = f.read()

# Update dynamic login buttons to use custom names if available, but for index.html we wait for app.js to handle it

with open('app.js', 'r') as f:
    app_content = f.read()

# Variables for custom names in app.js
if 'let groupNames = {};' not in app_content:
    app_content = app_content.replace('let companyData = {};', 'let companyData = {};\nlet groupNames = {};\nlet bankChatName = "Handel (Bank)";')


# loadConfig in app.js to get settings
target_load_config = '''function loadConfig() {
    if(!db) return;
    
    // Globale Settings (Gruppenanzahl etc)
    db.collection("fallstudie_config").doc("settings").onSnapshot(doc => {
        if(doc.exists) {
            totalGroups = doc.data().group_count || 4;
            generateLoginButtons();
        }
    });'''
replacement_load_config = '''function loadConfig() {
    if(!db) return;
    
    // Globale Settings (Gruppenanzahl etc)
    db.collection("fallstudie_config").doc("settings").onSnapshot(doc => {
        if(doc.exists) {
            totalGroups = doc.data().group_count || 4;
            groupNames = doc.data().groupNames || {};
            bankChatName = doc.data().bankChatName || "Handel (Bank)";
            
            const bankNav = document.getElementById("nav-chat-bank");
            if(bankNav) bankNav.innerText = "Chat: " + bankChatName;
            
            const bankHeader = document.getElementById("chat-bank-name");
            if(bankHeader) bankHeader.innerText = bankChatName;
            
            generateLoginButtons();
        }
    });'''
if 'groupNames = doc.data().groupNames' not in app_content:
    app_content = app_content.replace(target_load_config, replacement_load_config)

# generateLoginButtons
target_generate_login = '''function generateLoginButtons() {
    const container = document.getElementById("dynamic-login-buttons");
    if (!container) return;
    container.innerHTML = "";
    
    for (let i = 1; i <= totalGroups; i++) {
        const groupName = `Gruppe ${i}`;
        const btn = document.createElement("button");
        btn.className = "btn";
        btn.innerText = `Login als ${groupName}`;
        btn.onclick = () => loginStudent(groupName);
        container.appendChild(btn);
    }
}'''
replacement_generate_login = '''function generateLoginButtons() {
    const container = document.getElementById("dynamic-login-buttons");
    if (!container) return;
    container.innerHTML = "";
    
    for (let i = 1; i <= totalGroups; i++) {
        const groupName = `Gruppe ${i}`;
        const displayName = groupNames[groupName] || groupName;
        const btn = document.createElement("button");
        btn.className = "btn";
        btn.innerText = `Login als ${displayName}`;
        btn.onclick = () => loginStudent(groupName);
        container.appendChild(btn);
    }
}'''
app_content = app_content.replace(target_generate_login, replacement_generate_login)

# update login flow user info
target_login = '''function loginStudent(groupName) {
    currentUserGroup = groupName;
    document.getElementById("user-role-badge").innerText = groupName;
    document.getElementById("login-view").classList.remove("active");
    document.getElementById("dashboard-view").classList.add("active");
    
    bindGroupControls();
    loadStudentData();
}'''
replacement_login = '''function loginStudent(groupName) {
    currentUserGroup = groupName;
    const displayName = groupNames[groupName] || groupName;
    document.getElementById("user-role-badge").innerText = displayName;
    document.getElementById("login-view").classList.remove("active");
    document.getElementById("dashboard-view").classList.add("active");
    
    bindGroupControls();
    loadStudentData();
}'''
app_content = app_content.replace(target_login, replacement_login)

# chat names
target_chat = '''m.sender === "bank" ? "Handel (Bank)" : "Du";'''
replacement_chat = '''m.sender === "bank" ? bankChatName : "Du";'''
app_content = app_content.replace(target_chat, replacement_chat)


with open('app.js', 'w') as f:
    f.write(app_content)

