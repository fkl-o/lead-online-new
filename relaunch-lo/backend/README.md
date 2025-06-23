# Lead Management Backend

Ein vollständiges Backend-System für Lead-Management mit Node.js, Express, MongoDB und JWT-Authentifizierung.

## Features

- **Benutzer-Management**: Registrierung, Login, Rollenverwaltung (Admin, User, Lead)
- **Lead-Management**: Automatische Lead-Erstellung aus Formularen, Status-Verfolgung, Lead-Scoring
- **Authentifizierung**: JWT-basiert mit sicherer Token-Verwaltung
- **Datenbank**: MongoDB mit Mongoose ODM
- **Validierung**: Umfassende Datenvalidierung mit Joi
- **E-Mail**: Automatische Benachrichtigungen und Welcome-E-Mails
- **API**: RESTful API mit umfassender Dokumentation

## Technologie-Stack

- **Node.js** - Runtime Environment
- **Express.js** - Web Framework
- **MongoDB** - Datenbank
- **Mongoose** - ODM für MongoDB
- **JWT** - JSON Web Tokens für Authentifizierung
- **bcryptjs** - Passwort-Hashing
- **Joi** - Datenvalidierung
- **Nodemailer** - E-Mail-Versand
- **Helmet** - Sicherheits-Middleware
- **CORS** - Cross-Origin Resource Sharing
- **Rate Limiting** - Schutz vor Missbrauch

## Installation

1. **Repository klonen und ins Backend-Verzeichnis wechseln:**
   ```bash
   cd backend
   ```

2. **Dependencies installieren:**
   ```bash
   npm install
   ```

3. **Environment-Variablen einrichten:**
   ```bash
   cp .env.example .env
   ```
   
   Bearbeiten Sie die `.env` Datei mit Ihren spezifischen Einstellungen:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/relaunch-lo-leads
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRE=30d
   ADMIN_EMAIL=admin@leadgenpro.com
   ADMIN_PASSWORD=admin123456
   ```

4. **MongoDB starten** (lokal oder Cloud-Verbindung konfigurieren)

5. **Admin-Benutzer erstellen:**
   ```bash
   node scripts/seedAdmin.js
   ```

6. **Beispiel-Leads erstellen (optional):**
   ```bash
   node scripts/seedSampleLeads.js
   ```

7. **Server starten:**
   ```bash
   npm run dev  # Entwicklung
   npm start    # Produktion
   ```

## API Endpoints

### Authentifizierung
- `POST /api/auth/register` - Benutzer registrieren
- `POST /api/auth/login` - Benutzer anmelden
- `GET /api/auth/me` - Aktueller Benutzer
- `POST /api/auth/forgot-password` - Passwort vergessen
- `PUT /api/auth/reset-password/:token` - Passwort zurücksetzen

### Lead-Management
- `POST /api/leads/create` - Lead erstellen (öffentlich für Formulare)
- `GET /api/leads` - Alle Leads abrufen
- `GET /api/leads/:id` - Einzelnen Lead abrufen
- `PUT /api/leads/:id` - Lead aktualisieren
- `DELETE /api/leads/:id` - Lead archivieren
- `GET /api/leads/stats` - Lead-Statistiken
- `POST /api/leads/:id/communication` - Kommunikation hinzufügen
- `POST /api/leads/:id/task` - Aufgabe hinzufügen

### Benutzer-Verwaltung (Admin only)
- `GET /api/users` - Alle Benutzer
- `POST /api/users` - Benutzer erstellen
- `PUT /api/users/:id` - Benutzer aktualisieren
- `DELETE /api/users/:id` - Benutzer deaktivieren

## Datenmodelle

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: ['user', 'admin', 'lead'],
  isActive: Boolean,
  profile: {
    company: String,
    phone: String,
    website: String
  },
  // ... weitere Felder
}
```

### Lead
```javascript
{
  name: String,
  email: String,
  salutation: ['herr', 'frau'],
  source: ['automation', 'digitalization', 'website', 'contact'],
  status: ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'closed-won', 'closed-lost'],
  priority: ['low', 'medium', 'high', 'urgent'],
  company: {
    name: String,
    website: String,
    industry: String,
    size: String
  },
  serviceDetails: {
    automation: { /* ROI-Daten */ },
    digitalization: { /* Bereiche, Dringlichkeit */ },
    website: { /* Ziele, Stil */ }
  },
  score: Number (0-100),
  communications: [/* Kommunikationshistorie */],
  tasks: [/* Aufgaben */],
  // ... weitere Felder
}
```

## Lead-Scoring

Das System berechnet automatisch einen Lead-Score (0-100) basierend auf:

- **Quelle**: Automation (80), Digitalization (75), Website (70), Contact (60)
- **Unternehmensgröße**: Größere Unternehmen = höherer Score
- **Geschätzter Wert**: Höherer Wert = höherer Score
- **Dringlichkeit**: "Sofort" = +15 Punkte

## Sicherheit

- **Passwort-Hashing** mit bcryptjs
- **JWT-Authentifizierung** mit sicheren Tokens
- **Rate Limiting** gegen Brute-Force-Angriffe
- **Helmet** für HTTP-Sicherheits-Header
- **CORS** Konfiguration
- **Input-Validierung** mit Joi
- **Role-based Access Control**

## Development

### Entwicklungsserver starten:
```bash
npm run dev
```

### Tests (noch zu implementieren):
```bash
npm test
```

### Code-Struktur:
```
backend/
├── controllers/     # Business Logic
├── middleware/      # Auth, Error Handling
├── models/         # Mongoose Models
├── routes/         # API Routes
├── scripts/        # Utility Scripts
├── utils/          # Helper Functions
├── .env.example    # Environment Template
├── server.js       # Main Server File
└── package.json    # Dependencies
```

## Deployment

1. **Environment Variables setzen** (Production)
2. **MongoDB Atlas** oder andere Cloud-DB konfigurieren
3. **JWT Secret** sicher generieren
4. **E-Mail Service** konfigurieren (Gmail, SendGrid, etc.)
5. **Server deployen** (Heroku, DigitalOcean, AWS, etc.)

## Default Credentials

Nach dem Seeding:
- **Admin**: admin@leadgenpro.com / admin123456
- **User**: user@leadgenpro.com / user123456

**⚠️ Wichtig**: Ändern Sie diese Credentials in Production!

## Support

Bei Fragen oder Problemen:
1. Prüfen Sie die Logs für Fehlermeldungen
2. Stellen Sie sicher, dass MongoDB läuft
3. Überprüfen Sie die Environment-Variablen
4. Kontaktieren Sie das Entwicklungsteam

## Lizenz

Privat - Lead.Online GmbH
