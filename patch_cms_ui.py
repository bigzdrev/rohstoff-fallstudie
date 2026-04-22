import re

with open('admin.html', 'r') as f:
    html = f.read()

# Add CMS button to topbar
html = html.replace('onclick="archiveSession()" style="margin-right: 8px;">Session speichern</button>', 
                    'onclick="archiveSession()" style="margin-right: 8px;">Session speichern</button>\n            <button class="btn btn-secondary" onclick="openCMS()" style="margin-right: 8px; color: var(--brand-red);">Inhalte bearbeiten</button>')

# Add Modal
modal_html = """
    <!-- CMS MODAL -->
    <div id="cms-modal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:1000; align-items:center; justify-content:center;">
        <div class="glass-panel" style="background:var(--surface); width:90%; max-width:800px; max-height:90vh; overflow-y:auto; padding:32px; display:flex; flex-direction:column; gap:16px;">
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border); padding-bottom:16px;">
                <h2>Inhalte bearbeiten (Aufgaben)</h2>
                <button class="btn btn-secondary" onclick="document.getElementById('cms-modal').style.display='none'">Schließen</button>
            </div>
            <p style="font-size:0.85rem; color:var(--text-muted);">Änderungen hier überschreiben die Standardaufgaben bei allen Studenten sofort.</p>
            <div id="cms-questions-list" style="display:flex; flex-direction:column; gap:16px;"></div>
            <div style="display:flex; gap:8px; margin-top:16px;">
                <button class="btn btn-secondary" onclick="cmsAddQuestion()">+ Neue Frage hinzufügen</button>
                <button class="btn btn-primary" onclick="cmsSave()" style="margin-left:auto;">Speichern & Veröffentlichen</button>
            </div>
        </div>
    </div>
"""
html = html.replace('</body>', modal_html + '\n</body>')

with open('admin.html', 'w') as f:
    f.write(html)

with open('admin.js', 'r') as f:
    admin_js = f.read()

cms_js = """
// ===================================
// CMS
// ===================================
let cmsQuestions = [];

function openCMS() {
    document.getElementById("cms-modal").style.display = "flex";
    if (!db) return;
    db.collection("fallstudie_config").doc("content").get().then(doc => {
        if (doc.exists && doc.data().questions) {
            cmsQuestions = doc.data().questions;
        } else {
            // Load defaults from data.js if no firebase config yet (assuming companyData is available)
            if (typeof companyData !== 'undefined') {
                cmsQuestions = JSON.parse(JSON.stringify(companyData.questions));
            } else {
                cmsQuestions = [];
            }
        }
        renderCMS();
    });
}

function renderCMS() {
    const list = document.getElementById("cms-questions-list");
    list.innerHTML = "";
    cmsQuestions.forEach((q, i) => {
        const div = document.createElement("div");
        div.style.cssText = "padding: 16px; border: 1px solid var(--border); border-radius: 8px; background: #F7FAFC; position:relative;";
        div.innerHTML = `
            <button class="btn btn-secondary" style="position:absolute; top:16px; right:16px; padding:4px 8px; font-size:0.7rem; color:var(--danger);" onclick="cmsDelete(${i})">Löschen</button>
            <label style="font-size:0.8rem; font-weight:bold;">ID (intern, darf keine Leerzeichen haben):</label>
            <input type="text" class="sidebar-input" value="${q.id}" onchange="cmsUpdate(${i}, 'id', this.value)" style="width:100%; margin-bottom:8px;">
            <label style="font-size:0.8rem; font-weight:bold;">Titel:</label>
            <input type="text" class="sidebar-input" value="${q.title}" onchange="cmsUpdate(${i}, 'title', this.value)" style="width:100%; margin-bottom:8px;">
            <label style="font-size:0.8rem; font-weight:bold;">Fragestellung / Prompt:</label>
            <textarea class="sidebar-input" onchange="cmsUpdate(${i}, 'prompt', this.value)" style="width:100%; min-height:80px;">${q.prompt}</textarea>
        `;
        list.appendChild(div);
    });
}

function cmsUpdate(index, field, value) {
    cmsQuestions[index][field] = value;
}

function cmsAddQuestion() {
    cmsQuestions.push({
        id: "q_neu_" + Date.now(),
        title: "Neue Aufgabe",
        prompt: "Beschreiben Sie die Aufgabe hier..."
    });
    renderCMS();
}

function cmsDelete(index) {
    if(confirm("Aufgabe entfernen?")) {
        cmsQuestions.splice(index, 1);
        renderCMS();
    }
}

function cmsSave() {
    if(!db) return;
    db.collection("fallstudie_config").doc("content").set({
        questions: cmsQuestions
    }, { merge: true }).then(() => {
        alert("Inhalte gespeichert!");
        document.getElementById("cms-modal").style.display = "none";
    });
}
"""
admin_js += cms_js

with open('admin.js', 'w') as f:
    f.write(admin_js)

print("CMS Modal patched")
