#!/usr/bin/env python3
import os
import urllib.request
import urllib.error
import base64
import json
import ssl

ssl._create_default_https_context = ssl._create_unverified_context

# Konstanten für das Repo
REPO_OWNER = "bigzdrev"
REPO_NAME = "rohstoff-fallstudie"
BRANCH = "main"

print("="*50)
print("🚀 GITHUB API UPLOAD TOOL (RAW MATERIALS APP)")
print("="*50)

# Den API Token aus der Umgebungsvariable auslesen
GITHUB_TOKEN = os.environ.get("GITHUB_TOKEN")

if not GITHUB_TOKEN:
    print("FEHLER: Der Sicherheitsschlüssel (GITHUB_TOKEN) wurde nicht gefunden!")
    print("Haben Sie den export-Befehl im Terminal ausgeführt?")
    exit(1)

def push_file_to_api(filepath):
    filename = os.path.basename(filepath)
    url = f"https://api.github.com/repos/{REPO_OWNER}/{REPO_NAME}/contents/{filename}"
    
    headers = {
        "Authorization": f"token {GITHUB_TOKEN}",
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "Rohstoff-API-Deployer"
    }
    
    # 1. PRÜFUNG: Gibt es die Datei schon? 
    # Wenn ja, brauchen wir von der API die Tracking-Nummer (SHA), 
    # um die Datei überschreiben zu dürfen.
    sha = None
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
            sha = data.get("sha")
            print(f"[API CHECK] '{filename}' existiert auf GitHub (SHA: {sha[:6]}...). Bereite Überschreiben vor.")
    except urllib.error.HTTPError as e:
        if e.code == 404:
            print(f"[API CHECK] '{filename}' ist neu. Wird komplett neu angelegt.")
        else:
            print(f"[FEHLER] Die API hat den Leseversuch abgelehnt. Stimmt der Token? Code: {e.code}")
            return
            
    # 2. DATEI LESEN & VERSCHLÜSSELN (API erwartet Base64)
    with open(filepath, "rb") as f:
        content = f.read()
    b64_content = base64.b64encode(content).decode()
    
    # 3. HTTP PUT REQUEST (Der eigentliche Upload)
    body = {
        "message": f"API Upload: {filename} automatisch aktualisiert",
        "content": b64_content,
        "branch": BRANCH
    }
    if sha:
        body["sha"] = sha
        
    data = json.dumps(body).encode("utf-8")
    
    put_req = urllib.request.Request(url, data=data, headers=headers, method="PUT")
    try:
        with urllib.request.urlopen(put_req) as response:
            if response.status in [200, 201]:
                print(f"👉 [ERFOLG] '{filename}' wurde erfolgreich über die API geladen!")
    except urllib.error.HTTPError as e:
        print(f"❌ [FEHLER] Upload von '{filename}' gescheitert. Code: {e.code}. Grund: {e.read().decode()}")

if __name__ == "__main__":
    files_to_upload = ["index.html", "style.css", "app.js", "data.js", "firebase-config.js"]
    
    for f in files_to_upload:
        if os.path.exists(f):
            push_file_to_api(f)
        else:
            print(f"⚠️ [WARNUNG] Die lokale Datei {f} fehlt im Ordner.")
            
    print("="*50)
    print("Fertig! Die API-Kommunikation ist abgeschlossen.")
