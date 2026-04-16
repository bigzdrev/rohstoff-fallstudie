// FIREBASE CONFIGURATION PLACEHOLDER
// Dozenten-Hinweis: Kopieren Sie hier Ihre Firebase-Config hinein, 
// welche Sie im Firebase Console Web-Dashboard erhalten!

const firebaseConfig = {
    apiKey: "AIzaSyAww8ihOMiUcXFmLlq08KAPg03CBbOOuFM",
    authDomain: "rohstoffmanagement-44404.firebaseapp.com",
    projectId: "rohstoffmanagement-44404",
    storageBucket: "rohstoffmanagement-44404.firebasestorage.app",
    messagingSenderId: "235060859241",
    appId: "1:235060859241:web:6844b93cad9b15a8a4adf8"
};

// ==========================================
// INTERNE LOGIK ZUR DATENBANKANBINDUNG
// ==========================================
let db = null;
let useFirebase = false;

// Versuche Firebase zu initialisieren, falls eine Config existiert
if (firebaseConfig && firebaseConfig.apiKey) {
    try {
        firebase.initializeApp(firebaseConfig);
        db = firebase.firestore();
        useFirebase = true;
        console.log("Firebase erfolgreich initialisiert.");
    } catch (e) {
        console.warn("Firebase Konfiguration fehlerhaft, nutze reinen lokalen Modus.", e);
    }
} else {
    console.log("Keine Firebase Config gefunden. Nutze lokalen Demo-Modus.");
}

function updateConnectionStatus() {
    const dot = document.getElementById('connection-status');
    const text = document.getElementById('connection-text');
    if (useFirebase) {
        dot.className = 'status-dot online';
        text.innerText = 'Verbunden (Live)';
    } else {
        dot.className = 'status-dot offline';
        text.innerText = 'Lokal (Ohne Firebase)';
    }
}
