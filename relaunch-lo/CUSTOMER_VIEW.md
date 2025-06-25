# Kundenansicht - Dashboard

## Übersicht

Die Kundenansicht ist eine spezielle, vereinfachte Dashboard-Ansicht für Benutzer mit der Rolle "kunde". Diese Ansicht bietet eine benutzerfreundliche Oberfläche, über die Kunden ihre Anfragen einsehen und mit dem Team kommunizieren können.

## Features

### 🎯 Für Kunden optimiert
- **Einfache Navigation**: Nur relevante Menüpunkte
- **Übersichtliche Darstellung**: Fokus auf eigene Anfragen
- **Klare Kommunikation**: Direkter Nachrichtenaustausch

### 📋 Funktionen

1. **Anfragen Übersicht**
   - Anzeige aller eigenen Anfragen
   - Erstellungsdatum
   - Service-Typ (Marketing Automatisierung, Digitalisierung, Website)
   - Anzahl der Nachrichten
   - Anzahl der Dateien

2. **Detailansicht**
   - Vollständige Anfrage-Informationen
   - Unternehmensdaten
   - Service-Details
   - Notizen

3. **Dateianhänge**
   - Übersicht aller hochgeladenen Dateien
   - Download-Funktion für jede Datei
   - Dateigröße und Upload-Datum
   - Datei-Icons je nach Typ

4. **Kommunikation**
   - Nachrichtenverlauf anzeigen
   - Neue Nachrichten senden
   - Echtzeit-Updates
   - Zeitstempel

## Datenschutz & Kundenfreundlichkeit

### ❌ Nicht sichtbar für Kunden:
- **Lead-Status** (neu, kontaktiert, qualifiziert, etc.)
- **Prioritätsstufen** (niedrig, mittel, hoch, dringend)
- **Interne Bewertungen** oder Verkaufspipeline-Details

### ✅ Sichtbar für Kunden:
- **Eigene Anfragen** und deren Details
- **Kommunikationsverlauf** mit dem Team
- **Dateianhänge** zum Download
- **Service-Informationen** die sie betreffen

## Implementierung

### Komponenten

#### `CustomerView.tsx`
Die Hauptkomponente für die Kundenansicht:
- Lädt automatisch nur die Leads des angemeldeten Kunden
- Bietet intuitive Auswahl und Detailansicht
- Ermöglicht direkte Kommunikation

#### Angepasste Sidebar
- Vereinfachtes Menü nur mit "Meine Anfragen"
- Kundenspezifische Navigation

#### Dashboard Integration
- Automatische Weiterleitung zur Kundenansicht
- Rollenbasierte Anzeige
- Lazy Loading für Performance

### API Integration

Das System nutzt die bestehende API-Infrastruktur:
- `leadApi.getLeads()` - Filtert automatisch nach Benutzer
- `leadApi.addComment()` - Für neue Nachrichten
- Backend-Filterung nach Benutzerrolle

### Benutzerrollen

- **kunde**: Sieht nur eigene Anfragen, kann kommunizieren
- **admin/vertrieb**: Vollzugriff auf alle Dashboard-Features

## Status-Übersicht

### Service-Typen für Kunden:
- `automation` → "Marketing Automatisierung"
- `digitalization` → "Digitalisierung" 
- `website` → "Website Entwicklung"
- `contact` → "Kontaktformular"

### Dateiformate:
- **PDF-Dateien** (rot)
- **Bilder** (blau)
- **Word-Dokumente** (dunkelblau)
- **Excel-Tabellen** (grün)
- **Andere Dateien** (standard)

## Sicherheit

- Rollenbasierte Zugriffskontrolle
- Backend-Filterung der Daten
- Authentifizierung erforderlich
- Benutzer sehen nur eigene Daten

## Zukünftige Erweiterungen

### Geplante Features:
- [ ] Datei-Uploads für Kunden
- [ ] Terminbuchung-System
- [ ] Push-Benachrichtigungen
- [ ] Mobile App Integration
- [ ] Bewertungssystem
- [ ] FAQ-Bereich
- [ ] Datei-Vorschau im Browser

### Technische Verbesserungen:
- [ ] Real-time Updates via WebSocket
- [ ] Offline-Modus
- [ ] Erweiterte Filteroptionen
- [ ] Export-Funktionen

## Verwendung

1. **Kunde meldet sich an** mit Rolle "kunde"
2. **Automatische Weiterleitung** zur Kundenansicht
3. **Anfragen auswählen** aus der Liste
4. **Details einsehen** und **kommunizieren**
5. **Status verfolgen** in Echtzeit

## Code-Beispiel

```typescript
// Automatische Rollenprüfung im Dashboard
if (user?.role === 'kunde') {
  setCurrentView('customer-requests');
}

// Backend-API filtert automatisch
const response = await leadApi.getLeads(); // Nur eigene Leads
```

Diese Implementierung bietet Kunden eine professionelle, benutzerfreundliche Schnittstelle zu ihren Anfragen, während gleichzeitig die Komplexität des vollständigen CRM-Systems verborgen bleibt.
