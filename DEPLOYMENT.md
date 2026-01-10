# Deployment-Anleitung: Baeder-Azubi-App

## PWA Features

Die App ist jetzt als **Progressive Web App (PWA)** konfiguriert:
- ✅ **Offline-Fähigkeit**: Service Worker cached die App
- ✅ **Installierbar**: Als native App auf Smartphones installierbar
- ✅ **App-ähnliches Erlebnis**: Vollbild ohne Browser-UI
- ✅ **Intelligentes Caching**: Optimierte Performance

## Voraussetzungen
- Node.js (Version 18 oder hoeher)
- npm (kommt mit Node.js)
- Ein Hosting-Konto (Hostinger, Vercel, Netlify, etc.)

## Schritt 1: Projekt lokal bauen

1. Oeffne ein Terminal/Kommandozeile
2. Navigiere zum Projektordner:
   ```
   cd C:\Users\User\baeder-azubi-app
   ```

3. Installiere die Abhängigkeiten:
   ```
   npm install
   ```

4. Baue das Projekt fuer Produktion:
   ```
   npm run build
   ```

   Dies erstellt einen `dist` Ordner mit allen statischen Dateien.

## Schritt 2: Dateien auf Hostinger hochladen

### Option A: Per FTP (empfohlen)
1. Logge dich bei Hostinger ein
2. Gehe zu "Dateien" > "Dateimanager" oder verwende einen FTP-Client wie FileZilla
3. FTP-Zugangsdaten findest du unter "Hosting" > "FTP-Konten"
4. Lade den gesamten Inhalt des `dist` Ordners hoch in den `public_html` Ordner

### Option B: Per Hostinger File Manager
1. Logge dich bei Hostinger ein
2. Gehe zu "Hosting" > waehle deine Domain > "Dateimanager"
3. Navigiere zu `public_html`
4. Loesche vorhandene Dateien (falls gewünscht)
5. Lade alle Dateien aus dem `dist` Ordner hoch

## Schritt 3: Konfiguration auf Hostinger

### .htaccess fuer Single Page App (wichtig!)
Erstelle eine `.htaccess` Datei im `public_html` Ordner mit folgendem Inhalt:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

Dies stellt sicher, dass alle Routen korrekt zur `index.html` weitergeleitet werden.

## Dateien die hochgeladen werden muessen

Nach `npm run build` findest du im `dist` Ordner:
- `index.html` - Die Hauptdatei
- `assets/` - Ordner mit JavaScript und CSS Dateien
- Eventuell weitere statische Ressourcen

## Testen der App

1. Oeffne deine Domain im Browser (z.B. https://deine-domain.de)
2. Die App sollte mit dem Login-Bildschirm erscheinen
3. Registriere einen neuen Benutzer oder logge dich ein

## Troubleshooting

### App lädt nicht
- Pruefe ob alle Dateien korrekt hochgeladen wurden
- Pruefe die Browser-Konsole (F12) auf Fehler
- Stelle sicher dass die .htaccess Datei vorhanden ist

### Weisse Seite / 404 Fehler
- Die .htaccess Datei fehlt oder ist falsch konfiguriert
- mod_rewrite ist moeglicherweise nicht aktiviert (kontaktiere Hostinger Support)

### Daten werden nicht gespeichert
- Die App verwendet localStorage - pruefe ob Cookies/Storage im Browser erlaubt sind
- localStorage funktioniert nur wenn die Seite ueber HTTPS aufgerufen wird

## SSL/HTTPS aktivieren (wichtig!)

1. Gehe zu Hostinger > Hosting > Deine Domain > SSL
2. Aktiviere "Free SSL" oder lade ein eigenes Zertifikat hoch
3. Warte bis das SSL-Zertifikat aktiv ist (kann einige Minuten dauern)
4. Aktiviere "Force HTTPS" in den Einstellungen

## Updates deployen

Bei Änderungen an der App:
1. Aendere den Code lokal
2. Fuehre `npm run build` aus
3. Lade die neuen Dateien aus dem `dist` Ordner hoch (überschreibe die alten)

## PWA nach Deployment testen

### Installation testen
1. Öffne die deployed App auf einem Smartphone (Chrome/Safari)
2. Du solltest einen "Zum Startbildschirm hinzufügen"-Banner sehen
3. Installiere die App
4. Die App öffnet sich im Vollbildmodus wie eine native App

### Offline-Funktionalität testen
1. Öffne die App im Browser
2. Aktiviere den Flugmodus
3. Die App sollte weiterhin funktionieren (gecachte Inhalte)

### PWA-Qualität prüfen
1. Öffne Chrome DevTools (F12)
2. Gehe zum "Lighthouse"-Tab
3. Wähle "Progressive Web App"
4. Klicke auf "Generate report"
5. Ziel: 90+ PWA Score

## Alternative Deployment-Plattformen

### Option 1: Vercel (Empfohlen für einfaches Deployment)

**Vorteile:**
- Automatisches Deployment bei Git Push
- Kostenlos für private Projekte
- Sehr schnell
- Automatische HTTPS

**Schritte:**
1. Pushe Code zu GitHub
2. Gehe zu [vercel.com](https://vercel.com) und importiere das Repo
3. Vercel erkennt Vite automatisch
4. Klick auf "Deploy"
5. Fertig! App ist in 1-2 Minuten live

**Konfiguration:** Die Datei `vercel.json` ist bereits vorhanden.

### Option 2: Netlify

**Vorteile:**
- Einfache Bedienung
- Kostenlos
- Automatisches Deployment

**Schritte:**
1. Pushe Code zu GitHub
2. Gehe zu [netlify.com](https://netlify.com)
3. "Add new site" → "Import from Git"
4. Wähle Repository
5. Klick auf "Deploy"

**Konfiguration:** Die Datei `netlify.toml` ist bereits vorhanden.

### Option 3: GitHub Pages

**Vorteile:**
- Komplett kostenlos
- Direkt in GitHub integriert

**Schritte:**
1. Aktiviere GitHub Pages in Repo Settings
2. Wähle "GitHub Actions" als Source
3. Pushe Code
4. Automatisches Deployment läuft

**Konfiguration:** Der Workflow `.github/workflows/deploy.yml` ist bereits vorhanden.

## Hinweise zur App

- **Datenspeicherung**: Verwendet Supabase für Backend (wenn konfiguriert)
- **PWA**: Funktioniert offline dank Service Worker
- **HTTPS erforderlich**: PWA-Features funktionieren nur über HTTPS (alle Plattformen bieten automatisches SSL)

## Icon-Generierung (Optional)

Die App verwendet aktuell ein einfaches SVG-Icon. Für professionellere Icons:

1. Nutze [realfavicongenerator.net](https://realfavicongenerator.net)
2. Lade dein Logo hoch
3. Generiere alle benötigten Icon-Größen
4. Ersetze die Icons in `public/`:
   - `pwa-192x192.png`
   - `pwa-512x512.png`

## Supabase-Konfiguration (falls verwendet)

Wenn du Supabase nutzt, setze die Umgebungsvariablen:

**Vercel/Netlify:**
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

**GitHub Pages:**
- Erstelle eine `.env.production` Datei (nicht ins Git committen!)

## Support & Dokumentation

- Vite PWA: https://vite-pwa-org.netlify.app/
- Vercel: https://vercel.com/docs
- Netlify: https://docs.netlify.com/
- Hostinger: Kontaktiere Hostinger-Support
