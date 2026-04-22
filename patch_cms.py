import re

# 1. Update app.js for CMS syncing
with open('app.js', 'r') as f:
    app_js = f.read()

cms_sync = """
// Check for Global Content Config
setTimeout(() => {
    if (typeof db !== 'undefined' && db !== null) {
        db.collection("fallstudie_config").doc("content").onSnapshot(doc => {
            if (doc.exists && doc.data().questions) {
                companyData.questions = doc.data().questions;
                const container = document.getElementById("task-questions-container");
                if (container) {
                    container.innerHTML = "";
                    injectTaskQuestions();
                    loadSavedAnswers(); // reload user's saved text into the new textareas
                }
            }
        });
    }
}, 1000);
"""
# Insert before "Check for Global Config on load"
app_js = app_js.replace('// Check for Global Config on load', cms_sync + '\n// Check for Global Config on load')

with open('app.js', 'w') as f:
    f.write(app_js)

# 2. Update admin.js for Templates
with open('admin.js', 'r') as f:
    admin_js = f.read()

templates_logic = """
// ===================================
// TEMPLATES
// ===================================
function loadTemplates() {
    if(!db) return;
    db.collection("admin_settings").doc("templates").onSnapshot(doc => {
        const cont = document.getElementById("admin-templates-container");
        if(!cont) return;
        cont.innerHTML = `<button class="btn btn-secondary" style="font-size:0.7rem; padding:4px 8px; flex-shrink:0;" onclick="addTemplate()">+ Neue Vorlage</button>`;
        if(doc.exists && doc.data().items) {
            doc.data().items.forEach((t, index) => {
                const btn = document.createElement("button");
                btn.className = "btn btn-secondary";
                btn.style.cssText = "font-size:0.75rem; padding:4px 8px; flex-shrink:0; max-width: 150px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;";
                btn.innerText = t.title;
                btn.onclick = () => { document.getElementById("admin-chat-input").value = t.text; };
                btn.oncontextmenu = (e) => { e.preventDefault(); deleteTemplate(index); };
                cont.appendChild(btn);
            });
        }
    });
}

function addTemplate() {
    const title = prompt("Titel der Vorlage (kurz):");
    if(!title) return;
    const text = prompt("Text der Vorlage (wird in den Chat eingefügt):");
    if(!text) return;

    db.collection("admin_settings").doc("templates").get().then(doc => {
        let items = doc.exists ? doc.data().items || [] : [];
        items.push({ title, text });
        db.collection("admin_settings").doc("templates").set({ items });
    });
}

function deleteTemplate(index) {
    if(!confirm("Vorlage löschen?")) return;
    db.collection("admin_settings").doc("templates").get().then(doc => {
        if(doc.exists) {
            let items = doc.data().items || [];
            items.splice(index, 1);
            db.collection("admin_settings").doc("templates").set({ items });
        }
    });
}

// Call loadTemplates in initAdminData
"""
admin_js += templates_logic
admin_js = admin_js.replace('function initAdminData() {', 'function initAdminData() {\n    loadTemplates();\n')

with open('admin.js', 'w') as f:
    f.write(admin_js)

print("CMS and templates patched")
