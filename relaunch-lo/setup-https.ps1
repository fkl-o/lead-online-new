# HTTPS Setup Script für lokale Entwicklung
# Generiert SSL-Zertifikate und konfiguriert HTTPS für localhost

Write-Host "🔒 HTTPS Setup für lokale Entwicklung" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

Write-Host "`n📋 Schritt 1: SSL-Zertifikate erstellen..." -ForegroundColor Yellow

# Erstelle certs Ordner
if (!(Test-Path "certs")) {
    New-Item -ItemType Directory -Name "certs"
    Write-Host "✅ Certs Verzeichnis erstellt" -ForegroundColor Green
}

# Prüfe ob mkcert verfügbar ist (empfohlen für lokale Entwicklung)
if (Get-Command mkcert -ErrorAction SilentlyContinue) {
    Write-Host "🔑 Erstelle vertrauenswürdige SSL-Zertifikate mit mkcert..." -ForegroundColor Yellow
    
    # Installiere mkcert CA (falls noch nicht geschehen)
    & mkcert -install
    
    # Erstelle Zertifikate für localhost
    & mkcert -key-file certs/localhost-key.pem -cert-file certs/localhost.pem localhost 127.0.0.1 ::1
    
    Write-Host "✅ Vertrauenswürdige SSL-Zertifikate erstellt!" -ForegroundColor Green
    Write-Host "📁 Dateien erstellt:" -ForegroundColor Cyan
    Write-Host "  - certs/localhost.pem (Zertifikat)" -ForegroundColor Gray
    Write-Host "  - certs/localhost-key.pem (Private Key)" -ForegroundColor Gray
    
} elseif (Get-Command openssl -ErrorAction SilentlyContinue) {
    Write-Host "🔑 Erstelle selbst-signierte SSL-Zertifikate mit OpenSSL..." -ForegroundColor Yellow
    
    # Erstelle selbst-signiertes Zertifikat
    & openssl req -x509 -newkey rsa:2048 -keyout certs/localhost-key.pem -out certs/localhost.pem -days 365 -nodes -subj "/C=DE/ST=State/L=City/O=LeadGen Pro/CN=localhost"
    
    Write-Host "✅ Selbst-signierte SSL-Zertifikate erstellt!" -ForegroundColor Green
    Write-Host "⚠️  Sie müssen das Zertifikat im Browser manuell akzeptieren" -ForegroundColor Yellow
    Write-Host "📁 Dateien erstellt:" -ForegroundColor Cyan
    Write-Host "  - certs/localhost.pem (Zertifikat)" -ForegroundColor Gray
    Write-Host "  - certs/localhost-key.pem (Private Key)" -ForegroundColor Gray
    
} else {
    Write-Host "❌ Weder mkcert noch OpenSSL gefunden!" -ForegroundColor Red
    Write-Host "💡 Bitte installieren Sie eines der Tools:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Option 1 - mkcert (empfohlen für lokale Entwicklung):" -ForegroundColor Cyan
    Write-Host "  choco install mkcert" -ForegroundColor Gray
    Write-Host "  oder download von: https://github.com/FiloSottile/mkcert/releases" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Option 2 - OpenSSL:" -ForegroundColor Cyan
    Write-Host "  choco install openssl" -ForegroundColor Gray
    Write-Host ""
    Write-Host "❌ HTTPS Setup kann nicht fortgesetzt werden ohne SSL-Tools" -ForegroundColor Red
    exit 1
}

Write-Host "`n📋 Schritt 2: Package.json Scripts aktualisieren..." -ForegroundColor Yellow

# Aktualisiere package.json für HTTPS-Scripts
$packageJsonPath = ".\package.json"
if (Test-Path $packageJsonPath) {
    $packageJson = Get-Content $packageJsonPath | ConvertFrom-Json
    
    # Füge HTTPS-Scripts hinzu (PowerShell-kompatibel)
    if (-not ($packageJson.scripts.PSObject.Properties | Where-Object {$_.Name -eq "dev:https"})) {
        $packageJson.scripts | Add-Member -Name "dev:https" -Value "vite --host --https" -Force
        Write-Host "✅ dev:https Script hinzugefügt" -ForegroundColor Green
    }
    
    if (-not ($packageJson.scripts.PSObject.Properties | Where-Object {$_.Name -eq "preview:https"})) {
        $packageJson.scripts | Add-Member -Name "preview:https" -Value "vite preview --host --https" -Force
        Write-Host "✅ preview:https Script hinzugefügt" -ForegroundColor Green
    }
    
    $packageJson | ConvertTo-Json -Depth 10 | Out-File -FilePath $packageJsonPath -Encoding UTF8
} else {
    Write-Host "⚠️  package.json nicht gefunden" -ForegroundColor Yellow
}

Write-Host "`n🎉 HTTPS Setup abgeschlossen!" -ForegroundColor Green
Write-Host "============================" -ForegroundColor Green

Write-Host "`n📝 Nächste Schritte:" -ForegroundColor Cyan
Write-Host "1. Starten Sie die HTTPS-Entwicklungsumgebung:" -ForegroundColor White
Write-Host "   npm run dev:https" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Öffnen Sie Ihren Browser und navigieren Sie zu:" -ForegroundColor White
Write-Host "   https://localhost:5173" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Falls Sie selbst-signierte Zertifikate verwenden:" -ForegroundColor White
Write-Host "   - Klicken Sie auf 'Erweitert' im Browser" -ForegroundColor Gray
Write-Host "   - Wählen Sie 'Trotzdem fortfahren'" -ForegroundColor Gray
Write-Host ""
Write-Host "🔒 Ihre lokale Entwicklungsumgebung läuft jetzt sicher mit HTTPS!" -ForegroundColor Green

Write-Host "`n💡 Tipp:" -ForegroundColor Yellow
Write-Host "Für bessere lokale HTTPS-Entwicklung installieren Sie mkcert:" -ForegroundColor White
Write-Host "choco install mkcert" -ForegroundColor Gray
