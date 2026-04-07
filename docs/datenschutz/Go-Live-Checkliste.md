# Go-Live-Checkliste
## Azubi-App — azubi.smartbaden.de

**Betreiber:** Dennie Gulbinski
**Stand:** April 2026

---

## 1. Infrastruktur & Deployment

- [x] VPS Frankfurt (Hostinger) läuft stabil
- [x] Docker Compose mit automatischem Neustart (`restart: unless-stopped`)
- [x] HTTPS/TLS via Let's Encrypt (automatische Erneuerung)
- [x] Domain `azubi.smartbaden.de` korrekt konfiguriert
- [x] API unter `api.smartbaden.de` erreichbar
- [x] CORS korrekt konfiguriert (nur eigene Domains)
- [x] GitHub Actions CI/CD läuft (automatisches Deployment bei Push)

---

## 2. Datenbank & Backups

- [x] PostgreSQL läuft im Docker-Container
- [x] Tägliches automatisches Backup per cron (03:00 Uhr)
- [x] Backup-Aufbewahrung: 7 Tage
- [x] Backup-Restore getestet und dokumentiert
- [x] Alle Prisma-Migrationen deployed
- [x] **Lokales PC-Backup eingerichtet** — wöchentlich (Sonntag 10:00 Uhr) via Windows Aufgabenplaner, Script: `ops/pull-backup-to-local.ps1`, gespeichert unter `C:\Users\User\Backups\azubi-app\`, 8 Wochen Verlauf

---

## 3. Authentifizierung & Sicherheit

- [x] Login mit Argon2id-Passwort-Hash
- [x] JWT Access Token (in-memory) + Refresh Token (HttpOnly Cookie)
- [x] Automatischer Logout nach 30 Minuten Inaktivität
- [x] Persistenter Brute-Force-Lockout (5 Versuche → 15 Min. Sperre)
- [x] Rate-Limiting auf allen Auth-Endpunkten
- [x] 2FA (TOTP) für Admin-Accounts eingerichtet und getestet
- [x] Passwort-Reset per E-Mail funktioniert (Link zeigt auf azubi.smartbaden.de)
- [x] Selbstlöschung des eigenen Kontos funktioniert
- [x] Admin-Löschung von Nutzerkonten funktioniert

---

## 4. Kernfunktionen getestet

- [x] Registrierung mit Einladungscode
- [x] Freischaltung durch Admin
- [x] Quiz (Solo)
- [x] Quizduell (4 Runden, alle Fragetypen inkl. WhoAmI/Schlagwort)
- [x] Quizduell aufgeben (Verlierer/Gewinner korrekt gesetzt)
- [x] Berichtsheft
- [x] Chat
- [x] Benachrichtigungen
- [x] Push-Benachrichtigungen
- [x] Admin-Export (Nutzerdaten)
- [x] PWA installierbar (iOS + Android getestet)

---

## 5. Datenschutz & Recht

- [x] Datenschutzerklärung in der App (aktuell, Stand 06.04.2026)
- [x] Impressum in der App
- [x] Nutzungsbedingungen in der App
- [x] TOMs dokumentiert (`docs/datenschutz/TOMs.md`)
- [x] AVV-Vorlage erstellt (`docs/datenschutz/AVV-Vorlage.md`)
- [x] Hostinger DPA akzeptiert (automatisch mit Vertragsabschluss)
- [x] Datenschutz-Runbook erstellt (`docs/datenschutz/Datenschutz-Runbook.md`)
- [ ] **AVV mit erstem Nutzerbetrieb unterzeichnet** ← vor Zugangseröffnung

---

## 6. Vor dem ersten echten Nutzer

- [ ] `APP_TOTP_ENCRYPTION_KEY` sicher notiert/gesichert (Verlust = alle Admin-2FA gesperrt)
- [ ] JWT-Secrets (`JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`) sicher gespeichert
- [ ] Einladungscode für ersten Betrieb generiert
- [ ] AVV mit erstem Betrieb unterzeichnet
- [ ] Admin-Account mit 2FA gesichert
- [ ] Test-Accounts gelöscht oder deaktiviert

---

## 7. Monitoring & Betrieb

- [ ] E-Mail-Adresse für Sicherheitsvorfälle bekannt und erreichbar
- [ ] Crontab läuft (prüfen: `crontab -l`)
- [ ] Server-Logs regelmäßig prüfen: `docker compose logs server --tail=50`
- [ ] Jährliche Überprüfung vormerken (April 2027): TOMs, Backups, Zugriffsrechte

---

## 8. Nice-to-have (nach Go-Live)

- [ ] Auth Smoke-Tests (automatisierte E2E-Tests mit Supertest)
- [ ] Duel-Fallback serverseitig schließen
- [ ] 2FA optional für Ausbilder
- [ ] **Monitoring/Alerting — Uptime-Kuma auf dem VPS einrichten** ← nächster Schritt
- [ ] SMTP auf professionelle Adresse umstellen (statt Gmail)

---

## Status: Bereit für Go-Live ✅

Alle kritischen Punkte (1–6) sind abgehakt bis auf:
- AVV mit erstem Betrieb unterzeichnen
- Secrets sicher notieren
- Test-Accounts aufräumen
