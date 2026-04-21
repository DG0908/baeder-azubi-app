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
- [x] **Lokales PC-Backup eingerichtet** — **täglich** (18:00 Uhr) via Windows Aufgabenplaner, Script: `ops/pull-backup-to-local.ps1`, gespeichert unter `C:\Users\User\Backups\azubi-app\`, **30 Tage Verlauf**, verpasste Läufe werden automatisch nachgeholt. Damit anbieterunabhängiges Sekundärbackup mit max. 24 h Datenverlust.
- [ ] **Hostinger Daily Backup-Addon** (~2 €/Monat) — optional, für 1-Klick-Restore des kompletten VPS
- [ ] **Cloud-Off-Site** (Hetzner Storage Box o. ä.) — PC-unabhängig, erst ab Skalierungsphase
- [ ] **NAS mit Snapshot-Versionierung** als Ersatz für PC-Pull — geplant für Ausbauphase, Ransomware-Schutz durch read-only Snapshots

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
- [ ] **E-Mail-Reputation geprüft** — SPF-, DKIM- und DMARC-Records für `smartbaden.de` gesetzt; Mail-Tester-Score ≥ 9/10 (https://www.mail-tester.com). Verhindert, dass Passwort-Reset-Mails im Spam landen.

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
- [ ] **Muster-Benachrichtigung Datenpanne** vorbereitet (`docs/datenschutz/Muster-Benachrichtigung-Datenpanne.md`) — Pflichtinhalte nach Art. 34 DSGVO (Art der Verletzung, Folgen, Maßnahmen, Kontakt, Empfehlungen)

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

## 7a. Kaufmännische Vorbereitung (für bezahlten Betrieb)

- [ ] **Unternehmensform geklärt** (Einzelunternehmen / UG / GmbH) — beeinflusst Haftung und Impressum
- [ ] **AGB / SaaS-Nutzungsvertrag** erstellt (ggf. mit Anwalt) — Regelt Leistungsumfang, Verfügbarkeit, Zahlung, Kündigung
- [ ] **Stripe-Konto** angelegt und verifiziert, Testzahlung erfolgreich durchgeführt
- [ ] **Rechnungs-Workflow** geklärt (automatisiert via Stripe oder manuell)
- [ ] **Cyber-Versicherung** geprüft — deckt Datenschutzvorfälle, Betriebsunterbrechung, Cyberangriffe. Angebote z. B. Hiscox, Markel, CyberDirekt. Ab erstem zahlenden Betrieb dringend empfohlen.

---

## 8. Nice-to-have (nach Go-Live)

- [ ] Auth Smoke-Tests (automatisierte E2E-Tests mit Supertest)
- [ ] Duel-Fallback serverseitig schließen
- [ ] 2FA optional für Ausbilder
- [x] **Monitoring/Alerting — Uptime-Kuma läuft** auf Port 3002 (http://187.124.9.172:3002), überwacht API + Web, E-Mail-Alarm eingerichtet
- [x] SMTP läuft bereits über noreply@smartbaden.de (Hostinger)
- [ ] Uptime-Kuma Alarm auf noreply@smartbaden.de umstellen — wenn Diensthandy vorhanden

---

## Status: Bereit für Go-Live ✅

Alle kritischen Punkte (1–6) sind abgehakt bis auf:
- AVV mit erstem Betrieb unterzeichnen
- Secrets sicher notieren
- Test-Accounts aufräumen

**Für bezahlten Betrieb zusätzlich erforderlich (Abschnitt 7a):**
- Unternehmensform, AGB, Stripe, Cyber-Versicherung
- Off-Site-Backup (Abschnitt 2)
- E-Mail-Reputation/DMARC (Abschnitt 3)
