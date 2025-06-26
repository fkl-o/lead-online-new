# Test Suite Documentation

## 🧪 Übersicht

Diese Test-Suite verwendet **Jest** und **React Testing Library** für umfassende Tests der gesamten Anwendung.

## 📁 Test-Struktur

```
src/
├── test/
│   ├── setup.ts                # Jest-Setup und globale Mocks
│   ├── test-utils.tsx          # Custom render und Test-Utilities
│   ├── __mocks__/              # Mock-Dateien
│   └── e2e/                    # End-to-End Tests
├── components/
│   ├── ui/__tests__/           # UI-Komponenten Tests
│   ├── modals/__tests__/       # Modal-Komponenten Tests
│   └── forms/__tests__/        # Form-Komponenten Tests
├── pages/__tests__/            # Seiten-Tests
├── hooks/__tests__/            # Custom Hooks Tests
└── lib/__tests__/              # Utility-Funktionen Tests
```

## 🚀 Test-Commands

### Basis-Commands
```bash
# Alle Tests ausführen
npm test

# Tests im Watch-Modus
npm run test:watch

# Coverage-Report generieren
npm run test:coverage

# Tests für CI/CD
npm run test:ci

# Debug-Modus für problematische Tests
npm run test:debug
```

### Spezifische Tests
```bash
# Nur UI-Komponenten testen
npm test -- src/components/ui

# Nur einen Test ausführen
npm test -- Button.test.tsx

# Tests mit Pattern
npm test -- --testNamePattern="modal"
```

## 📊 Test-Kategorien

### 1. **Unit Tests** - Einzelne Komponenten/Funktionen
- ✅ UI-Komponenten (Button, Input, Dialog, etc.)
- ✅ Utility-Funktionen (cn, API-Helpers)
- ✅ Custom Hooks (useModal, useMobile)

### 2. **Integration Tests** - Komponenten-Zusammenspiel
- ✅ Modal-Komponenten mit Forms
- ✅ API-Integration
- ✅ Form-Validierung und Submission

### 3. **End-to-End Tests** - Komplette User-Flows
- ✅ Lead-Generierung über Website-Modal
- ✅ ROI-Kalkulator und Automation-Modal
- ✅ Kontaktformular-Submission
- ✅ Error-Handling

## 🔧 Test-Utilities

### Custom Render
```tsx
import { render, screen } from '@/test/test-utils';

// Automatisch mit Router und Helmet Provider
render(<MyComponent />);
```

### Mock Data
```tsx
import { mockUser, mockLead, mockFormData } from '@/test/test-utils';

// Vorgefertigte Test-Daten verwenden
const user = mockUser;
const lead = mockLead;
```

### API Mocking
```tsx
import { mockApiCall, mockApiError } from '@/test/test-utils';

// Erfolgreiche API-Calls mocken
mockCreateLead.mockImplementation(() => mockApiCall(mockLead));

// Fehler simulieren
mockCreateLead.mockImplementation(() => mockApiError('Server Error'));
```

## 🎯 Test-Patterns

### Komponenten-Tests
```tsx
describe('ComponentName', () => {
  it('renders correctly', () => {
    render(<Component />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('handles user interactions', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();
    
    render(<Component onClick={handleClick} />);
    await user.click(screen.getByRole('button'));
    
    expect(handleClick).toHaveBeenCalled();
  });
});
```

### Form-Tests
```tsx
it('submits form with valid data', async () => {
  const user = userEvent.setup();
  render(<Form />);
  
  await user.type(screen.getByLabelText(/name/i), 'Test User');
  await user.type(screen.getByLabelText(/email/i), 'test@example.com');
  await user.click(screen.getByRole('button', { name: /submit/i }));
  
  await waitFor(() => {
    expect(mockSubmit).toHaveBeenCalledWith(expectedData);
  });
});
```

### Modal-Tests
```tsx
it('opens and closes modal', async () => {
  const user = userEvent.setup();
  render(<ModalComponent open={true} onClose={onClose} />);
  
  expect(screen.getByRole('dialog')).toBeInTheDocument();
  
  await user.click(screen.getByRole('button', { name: /close/i }));
  expect(onClose).toHaveBeenCalled();
});
```

## 📈 Coverage-Ziele

- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%
- **Statements**: 70%

### Coverage-Report anzeigen
```bash
npm run test:coverage
open coverage/lcov-report/index.html
```

## 🔍 Best Practices

### 🎯 **Live-Component vs. Test-Problem Analysis**

**WICHTIG**: Wenn ein Test fehlschlägt, immer zuerst analysieren:

1. **Live-Komponente-Verhalten**: Funktioniert die Komponente in der echten Anwendung?
2. **Test-Verhalten**: Testet der Test das richtige Verhalten korrekt?

```tsx
// ❌ Test schlägt fehl - aber WAS ist das Problem?
it('handles input changes', async () => {
  await userEvent.type(input, 'test'); // Timeout-Fehler
});

// ✅ Erstmal Live-Verhalten testen
it('handles input changes', () => {
  fireEvent.change(input, { target: { value: 'test' } }); // Funktioniert!
  // => Live-Komponente ist OK, Test-Setup ist das Problem
});
```

**Analyse-Reihenfolge:**
1. 🧪 **Test vereinfachen** (z.B. fireEvent statt userEvent)
2. 🔍 **Live-Komponente analysieren** (Funktionalität, Props, Verhalten)
3. 🐛 **Root-Cause identifizieren** (Komponenten-Bug vs. Test-Bug)
4. 🔧 **Richtige Stelle fixen** (Live-Code vs. Test-Code)

### 1. **Test-Naming**
```tsx
// ✅ Beschreibend und klar
it('submits form when all required fields are filled')

// ❌ Zu vage
it('works correctly')
```

### 2. **User-Centric Tests**
```tsx
// ✅ Wie User die App nutzen
screen.getByRole('button', { name: /submit/i })
await user.click(submitButton)

// ❌ Implementation Details
wrapper.find('.submit-btn').simulate('click')
```

### 3. **Async Testing**
```tsx
// ✅ Auf Änderungen warten
await waitFor(() => {
  expect(screen.getByText('Success')).toBeInTheDocument();
});

// ❌ Hardcoded delays
await new Promise(resolve => setTimeout(resolve, 1000));
```

### 4. **Proper Cleanup**
```tsx
afterEach(() => {
  jest.clearAllMocks();
  // Reset any state
});
```

## 🐛 Debugging Tests

### Test-Debugging
```tsx
// Screen-Content ausgeben
screen.debug();

// Spezifisches Element debuggen
screen.debug(screen.getByRole('button'));

// Query-Failures analysieren
screen.getByText('Non-existent text'); // Zeigt verfügbare Texte
```

### Jest-Debugging
```bash
# Einzelnen Test mit Debug-Info
npm test -- --verbose Button.test.tsx

# Mit Node-Debugger
node --inspect-brk node_modules/.bin/jest --runInBand
```

## 🚨 Troubleshooting

### Häufige Probleme

1. **Test läuft nicht**
   ```bash
   # Node-Module und Cache löschen
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Coverage zu niedrig**
   ```bash
   # Ungetestete Dateien finden
   npm run test:coverage -- --verbose
   ```

3. **Flaky Tests**
   ```tsx
   // act() verwenden für State-Updates
   await act(async () => {
     await user.click(button);
   });
   ```

4. **Mock-Probleme**
   ```tsx
   // Mocks zwischen Tests zurücksetzen
   beforeEach(() => {
     jest.clearAllMocks();
   });
   ```

### 🎯 **Spezielle Test-Probleme**

#### **Split Text Problem**
```tsx
// ❌ Text ist über mehrere Elemente aufgeteilt
expect(screen.getByText(/wir gestalten digitales wachstum/i)).toBeInTheDocument();

// ✅ Einzelne Teile separat testen
expect(screen.getByText('Wir gestalten')).toBeInTheDocument();
expect(screen.getByText('digitales Wachstum')).toBeInTheDocument();

// 🎯 Alternative: Flexibler Text-Matcher
expect(screen.getByText((content, element) => {
  return element?.textContent === 'Wir gestalten digitales Wachstum';
})).toBeInTheDocument();
```

#### **UserEvent Timeout Problem**
```tsx
// ❌ userEvent kann zu Timeouts führen
it('test', async () => {
  const user = userEvent.setup();
  await user.click(button); // 30s Timeout!
});

// ✅ fireEvent für einfache Interaktionen
it('test', () => {
  fireEvent.click(button); // Sofort!
});

// ✅ userEvent nur für komplexe Interaktionen
it('complex interaction', async () => {
  const user = userEvent.setup({ delay: null }); // Disable delays
  await user.type(input, 'text');
});
```

#### **Modal Test Pattern**
```tsx
// ✅ Robust Modal Testing
it('handles modal interactions', () => {
  render(<Component />);
  
  // Open modal
  fireEvent.click(screen.getByRole('button', { name: /open/i }));
  expect(screen.getByTestId('modal')).toBeInTheDocument();
  
  // Close modal
  fireEvent.click(screen.getByRole('button', { name: /close/i }));
  expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
});
```
