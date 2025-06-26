# AutomationModal Component Test Results

Datum: 26. Juni 2025

Insgesamt wurden 8 Tests definiert und erfolgreich ausgeführt. Alle Tests haben bestanden.

## Testübersicht

1. **renders modal when open is true**
   - Szenario: `open`-Prop ist `true`.
   - Vorgehen: Komponente rendern und alle `setTimeout`-Timer mit `jest.runAllTimers()` abarbeiten.
   - Überprüfungen:
     - Titel "ROI-Prognose für Marketing Automation" ist im Dokument vorhanden.
     - Zwei Vorkommen des Labels „Werbebudget“ (Label + Tabelle).
     - Vorkommen von "Abschlussquote".
   - Ergebnis: ✓

2. **does not render modal when open is false**
   - Szenario: `open`-Prop ist `false`.
   - Vorgehen: Komponente rendern, Timer abarbeiten.
   - Überprüfungen:
     - Query nach Text "ROI-Kalkulator" ergibt kein Element.
   - Ergebnis: ✓

3. **calculates ROI correctly**
   - Szenario: Standardzustand mit default-Werten.
   - Vorgehen: Komponente rendern, Timer abarbeiten.
   - Überprüfungen:
     - Mindestens ein `slider`-Element vorhanden (`getAllByRole('slider')`).
     - Mehrere Elemente mit "€" im Text vorhanden.
   - Ergebnis: ✓

4. **shows contact form after ROI calculation**
   - Szenario: Nach Berechnung der ROI.
   - Vorgehen: Komponente rendern, Timer abarbeiten.
   - Überprüfungen:
     - Button-Text „Strategiegespräch anfordern" ist sichtbar.
   - Ergebnis: ✓

5. **validates contact form fields**
   - Szenario: Formular-Submit ohne Pflichtfelder.
   - Vorgehen: Komponente rendern, Timer abarbeiten, Submit-Button klicken.
   - Überprüfungen:
     - Mock `leadApi.createLead` wurde nicht aufgerufen.
   - Ergebnis: ✓

6. **submits contact form with valid data**
   - Szenario: Formular ausfüllen mit gültigen Werten.
   - Vorgehen: Komponente rendern, Timer abarbeiten,
     - Anrede "Herr" auswählen,
     - Name und E-Mail eingeben,
     - Datenschutz-Checkbox klicken,
     - Submit-Button klicken,
     - Timer erneut abarbeiten.
   - Überprüfungen:
     - Mock `leadApi.createLead` wurde mindestens einmal aufgerufen.
   - Ergebnis: ✓

7. **closes modal when close button is clicked**
   - Szenario: Close-Icon im Modal-Header klicken.
   - Vorgehen: Komponente rendern, Timer abarbeiten,
     - Erstes `button`-Element klicken (Close-Button),
     - mit `jest.advanceTimersByTime(300)` das Unmount-Timeout simulieren.
   - Überprüfungen:
     - `onClose` Callback wurde aufgerufen.
   - Ergebnis: ✓

8. **handles slider interactions**
   - Szenario: Interaktion mit allen Schiebereglern.
   - Vorgehen: Komponente rendern, Timer abarbeiten,
     - Alle `slider`-Elemente abfragen,
     - Auf jedes ein `fireEvent.click` ausführen.
   - Überprüfungen:
     - Keine Fehlermeldungen und alle Slider reagieren auf Klick.
   - Ergebnis: ✓
