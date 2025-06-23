# LeadGen Pro Frontend - Integration mit Backend

Das Frontend wurde erfolgreich für die Integration mit dem Backend-API angepasst. Hier sind die wichtigsten Änderungen und Anweisungen:

## Neue Funktionen

### 1. API Integration (`src/lib/api.js`)
- Zentrale API-Konfiguration mit automatischer Token-Verwaltung
- Lead-API Funktionen für CRUD-Operationen
- Auth-API für Login/Logout
- Health Check für Backend-Status

### 2. Aktualisierte Modals
Alle Modal-Komponenten senden jetzt echte Leads an die Datenbank:

- **WebsiteModal**: Erstellt Leads für Website-Anfragen
- **DigitalizationModal**: Erstellt Leads für Digitalisierungs-Anfragen  
- **AutomationModal**: Erstellt Leads für Marketing Automation mit ROI-Daten
- **LoginModal**: Authentifizierung mit dem Backend

### 3. Dashboard (`/dashboard`)
- Übersicht aller Leads aus der Datenbank
- Lead-Status Management
- Statistiken und Conversion-Rates
- Benutzer-Authentifizierung erforderlich

### 4. Test-Seite (`/test`)
- Backend-Verbindungstest
- API-Status-Überprüfung
- Debugging-Informationen

## Anweisungen zum Testen

### 1. Backend starten
```bash
cd backend
npm install
node scripts/seedAdmin.js  # Admin-Benutzer erstellen
npm run dev                # Backend auf Port 5000 starten
```

### 2. Frontend starten
```bash
npm run dev  # Frontend auf Port 5173 starten
```

### 3. Testen der Integration

#### a) Backend-Status prüfen
- Gehe zu: `http://localhost:5173/test`
- Überprüfe, ob das Backend verbunden ist

#### b) Lead erstellen
- Gehe zur Startseite: `http://localhost:5173`
- Öffne eines der Modals (z.B. "Website Design anfordern")
- Fülle das Formular aus und sende ab
- Du solltest eine Erfolgsmeldung sehen

#### c) Dashboard testen
- Gehe zu: `http://localhost:5173/login`
- Logge dich mit Admin-Daten ein:
  - E-Mail: `admin@leadgenpro.de`
  - Passwort: `admin123`
- Nach erfolgreichem Login wirst du zum Dashboard weitergeleitet
- Du solltest die erstellten Leads sehen können

### 4. Lead-Management
- Im Dashboard kannst du:
  - Alle Leads anzeigen
  - Lead-Status ändern (Neu → Kontaktiert → Qualifiziert → etc.)
  - Statistiken einsehen
  - Leads nach verschiedenen Kriterien filtern

## API-Konfiguration

### Development
- Backend URL: `http://localhost:5000/api`
- Frontend URL: `http://localhost:5173`

### Production
- Backend URL: Aktualisiere in `src/lib/api.js` die Production URL
- Environment Variable: `NODE_ENV=production`

## Debugging

### Häufige Probleme:

1. **"API call failed"**
   - Backend ist nicht gestartet
   - Falsche API URL
   - CORS-Probleme

2. **"Lead konnte nicht erstellt werden"**
   - MongoDB-Verbindung prüfen
   - Validierung in Backend-Logs überprüfen

3. **"Login fehlgeschlagen"**
   - Admin-Benutzer mit `node scripts/seedAdmin.js` erstellen
   - JWT-Secret konfiguriert?

### Browser-Entwicklertools
- Network-Tab überprüfen für API-Calls
- Console für Fehler-Logs
- Application-Tab für localStorage (Auth-Token)

## Nächste Schritte

1. **Backend deployen** (z.B. auf Render)
2. **Production API URL** in Frontend konfigurieren
3. **Erweiterte Features** hinzufügen:
   - E-Mail-Benachrichtigungen
   - Lead-Zuweisungen
   - Erweiterte Filterung
   - Bulk-Operationen

## Support

Bei Problemen überprüfe:
1. Backend-Logs (`npm run dev` im backend-Ordner)
2. Browser-Konsole für Frontend-Fehler
3. Network-Tab für API-Calls
4. MongoDB Atlas Verbindung

Das System ist jetzt vollständig funktional und kann echte Leads von den Frontend-Formularen in die MongoDB-Datenbank speichern!
