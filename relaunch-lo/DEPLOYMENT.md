# 🚀 Deployment-Anleitung für Render.com

## 📋 Vorbereitung

### 1. Cloudinary Account erstellen
1. Gehe zu [Cloudinary.com](https://cloudinary.com)
2. Erstelle einen kostenlosen Account
3. Notiere dir aus dem Dashboard:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

### 2. Environment Variables für Render.com

Folgende Variablen müssen in Render.com gesetzt werden:

```bash
# Database
MONGODB_URI=mongodb+srv://leadgenpro:asdfk213dsLKHDFJLKH%22%C2%A7%21%22%C2%A7@leadgenpro.8fhm8.mongodb.net/leadgenpro?retryWrites=true&w=majority

# JWT
JWT_SECRET=your_super_secret_jwt_key_min_32_chars_long_12345678
JWT_EXPIRE=7d

# Cloudinary (WICHTIG für File-Uploads!)
CLOUDINARY_CLOUD_NAME=dein_cloud_name
CLOUDINARY_API_KEY=dein_api_key
CLOUDINARY_API_SECRET=dein_api_secret

# Admin User
ADMIN_EMAIL=admin@leadgenpro.de
ADMIN_PASSWORD=admin123
ADMIN_NAME=Admin User

# Server
NODE_ENV=production
PORT=5000
```

## 🌐 Render.com Deployment

### Backend Deployment

1. **Repository verbinden**
   - Gehe zu [Render.com](https://render.com)
   - Erstelle neuen "Web Service"
   - Verbinde dein GitHub Repository
   - Wähle den `backend` Ordner als Root Directory

2. **Build & Deploy Settings**
   ```bash
   # Build Command:
   npm install
   
   # Start Command:
   npm start
   
   # Root Directory:
   backend
   ```

3. **Environment Variables setzen**
   - Füge alle oben genannten Variablen hinzu
   - ⚠️ **WICHTIG**: Cloudinary-Variablen sind essentiell für File-Uploads!

### Frontend Deployment

1. **Neue Static Site erstellen**
   - Erstelle "Static Site" auf Render.com
   - Verbinde dasselbe Repository
   - Root Directory: `./` (Frontend-Root)

2. **Build Settings**
   ```bash
   # Build Command:
   npm install && npm run build
   
   # Publish Directory:
   dist
   ```

3. **Environment Variable für Frontend**
   ```bash
   # API URL setzen (ersetze mit deiner Backend-URL)
   VITE_API_URL=https://dein-backend-name.onrender.com/api
   ```

## 🔧 API URL Konfiguration

Nach dem Backend-Deployment, aktualisiere die Frontend API-Konfiguration:

**In `src/lib/api.ts`:**
```typescript
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://dein-backend-name.onrender.com/api'  // ← Hier deine Backend-URL eintragen
  : 'http://localhost:5000/api';
```

## ✅ Features nach Deployment

Nach erfolgreichem Deployment funktionieren:

✅ **Lead-Erstellung** über alle Modals  
✅ **Dashboard** mit Authentifizierung  
✅ **Lead-Management** (Status ändern, bearbeiten)  
✅ **Kommentare** zu Leads hinzufügen  
✅ **File-Uploads** über Cloudinary (Cloud-basiert)  
✅ **Responsive Design** auf allen Geräten  

## 🔒 Sicherheit

- ✅ JWT-basierte Authentifizierung
- ✅ CORS konfiguriert für Frontend-Domain
- ✅ Rate Limiting aktiv
- ✅ Input-Validierung
- ✅ Sichere File-Uploads über Cloudinary

## 📁 File-Upload Details

**Unterstützte Dateitypen:**
- PDF, DOC, DOCX, TXT
- JPG, JPEG, PNG
- Max. 10MB pro Datei

**Cloudinary Vorteile:**
- ✅ Persistent storage (Dateien bleiben nach Deployment erhalten)
- ✅ CDN-optimiert (schnelle Ladezeiten weltweit)
- ✅ Automatische Bildoptimierung
- ✅ Kostenloser Plan: 25GB Speicher, 25GB Bandbreite/Monat

## 🐛 Troubleshooting

### File-Upload funktioniert nicht
1. Prüfe Cloudinary Environment Variables
2. Teste Cloudinary Dashboard-Zugriff
3. Checke Browser-Konsole für Fehler

### Backend-Verbindung fehlschlägt
1. Prüfe MongoDB URI
2. Checke JWT_SECRET (mindestens 32 Zeichen)
3. Verifiziere alle Environment Variables

### Frontend zeigt alte API-URL
1. Neue Version deployen nach API-URL-Änderung
2. Browser-Cache leeren
3. Umgebungsvariablen prüfen

## 🎯 Next Steps

Nach erfolgreichem Deployment:
1. **DNS Setup**: Custom Domain konfigurieren
2. **SSL**: Render.com bietet automatisch HTTPS
3. **Monitoring**: Render.com Dashboard für Logs nutzen
4. **Backup**: MongoDB Atlas automatische Backups aktivieren

---

**🚀 Viel Erfolg beim Deployment!**
