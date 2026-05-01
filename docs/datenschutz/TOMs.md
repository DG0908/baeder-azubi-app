# Technische und Organisatorische Maßnahmen (TOMs)
## gemäß Art. 32 DSGVO

**Plattform:** Bäder-Azubi App / SmartBaden (`azubi.smartbaden.de`, `api.smartbaden.de`)
**Betreiber:** Dennie Gulbinski, Zeitstraße 108, 53721 Siegburg
**Stand:** 26.04.2026
**Nächste planmäßige Überprüfung:** Oktober 2026 (halbjährlich)

Diese TOMs dokumentieren die technischen und organisatorischen Maßnahmen gemäß Art. 32 DSGVO und sind **Anlage 1 zum Auftragsverarbeitungsvertrag (AVV)**.

---

## 1. Zutrittskontrolle
*Verhinderung des Zutritts Unbefugter zu Datenverarbeitungsanlagen*

- Server läuft in einem zertifizierten Rechenzentrum von Hostinger in Frankfurt am Main (EU)
- Physischer Zutritt zum Rechenzentrum nur für autorisiertes Hostinger-Personal (gemäß DPA des Anbieters)
- Kein eigener physischer Serverraum beim Betreiber
- Sekundärbackup-Speicherort: privater Arbeitsplatz des Betreibers in Siegburg, separater physischer Standort

---

## 2. Zugangskontrolle
*Verhinderung der Nutzung von Datenverarbeitungssystemen durch Unbefugte*

- SSH-Zugang zum VPS ausschließlich über Public-Key-Authentifizierung; Passwort-Login deaktiviert
- Firewall: nur Ports 80 (HTTP-Redirect), 443 (HTTPS) und SSH öffentlich erreichbar
- Datenbank-Port (5432) ist **nicht** öffentlich erreichbar — Zugriff nur innerhalb des Docker-Netzwerks
- Automatische Sicherheitsupdates für das Betriebssystem aktiviert
- Coolify (Deployment-Pipeline für das Frontend) nur über HTTPS und eigenes Admin-Konto erreichbar
- Anwendungs-Login (`azubi.smartbaden.de`) nur über HTTPS, eigene Authentifizierung mit verpflichtender TOTP-2FA für Administratoren
- Ungenutzte Sitzungen werden automatisch beendet
- Persistenter Lockout nach mehrfachen Fehlversuchen auf Authentifizierungs-Endpunkten

---

## 3. Zugriffskontrolle
*Zugriff nur für befugte Personen innerhalb des Systems*

- Rollenbasiertes Zugriffsmodell (RBAC): Administrator, Ausbilder/Trainer, Auszubildender mit getrennten Berechtigungen
- **Default-Deny-Logik:** Jeder API-Endpunkt erfordert explizite Rollenzuweisung; nicht zugewiesene Endpunkte sind standardmäßig gesperrt
- Passwörter ausschließlich in gehashter Form (Argon2id) gespeichert — branchenüblicher Standard
- Passwort-Komplexität: 12+ Zeichen, Großbuchstabe, Kleinbuchstabe, Ziffer, Sonderzeichen
- Zwei-Faktor-Authentifizierung (TOTP) für Administrator-Konten verpflichtend
- Optionaler Geräte-Trust (`trusted_device`-Cookie, 30 Tage) zur 2FA-Erleichterung auf vertrauten Geräten
- JWT-Access-Tokens nur im Speicher des Browsers; Refresh-Token als HttpOnly-Cookie mit `Secure` und `SameSite`-Schutz
- Kein Passwort oder sensibles Datum wird im LocalStorage abgelegt
- Multi-Tenant-Isolation: Datenzugriffe sind serverseitig auf die Organisation des angemeldeten Nutzers beschränkt

---

## 4. Trennungskontrolle
*Getrennte Verarbeitung von Daten verschiedener Auftraggeber*

- Jede Organisation (Ausbildungsbetrieb) erhält eine eigene Organisations-ID; Datenzugriffe sind organisationsweit isoliert
- Cross-Tenant-Datenzugriff durch Benutzer ist serverseitig ausgeschlossen
- Trennung von Produktiv-, Test- und Entwicklungsumgebungen (lokale Entwicklung gegen separate Datenbasis)
- Logische Trennung der Datenarten in der Datenbank (eigene Tabellen pro Domäne)

---

## 5. Pseudonymisierung und Verschlüsselung
*Schutz personenbezogener Daten durch technische Maßnahmen*

**Verschlüsselung in Übertragung:**
- Sämtliche Verbindungen ausschließlich über HTTPS/TLS (Let's Encrypt, automatische Erneuerung)
- E-Mail-Versand über SMTP mit TLS-Verbindung zu Hostinger-Mailservern
- Push-Benachrichtigungen mit VAPID-Schlüsselpaar Ende-zu-Ende verschlüsselt

**Verschlüsselung in Ruhe:**
- Datenbank-Zugang ausschließlich über internes Docker-Netzwerk; Datenbank ist nicht öffentlich erreichbar
- TOTP-Secrets in der Datenbank mit AES-256-GCM verschlüsselt
- Passwörter werden niemals im Klartext gespeichert (Argon2id-Hash)

**Pseudonymisierung:**
- Audit-Logs verwenden technische User-IDs, nicht Klarnamen
- Bei Soft-Deletion eines Kontos: Login wird gesperrt, Refresh-Token entfernt, Account-Status auf `DISABLED` gesetzt, `isDeleted=true`. **Stamm- und Inhaltsdaten (E-Mail, Anzeigename, Beiträge) bleiben relational erhalten**, soweit dies für Audit-Pflichten, Forum-Diskussionsfäden, Quizduell-Historie und ausbildungsrechtliche Nachweispflichten erforderlich ist. Eine vollständige Anonymisierung erfolgt nach Ablauf der Aufbewahrungsfristen oder auf ausdrückliche Anforderung der betroffenen Person bzw. des Verantwortlichen, soweit keine entgegenstehende Aufbewahrungspflicht besteht.

---

## 6. Eingabekontrolle
*Nachvollziehbarkeit von Dateneingaben, -änderungen und -löschungen*

- Audit-Log für sicherheitsrelevante Aktionen: Login, Logout, Passwortänderung, Account-Genehmigung, 2FA-Aktivierung/-Deaktivierung, Rollenänderung, administrative Datenlöschung
- Audit-Logs werden in einer separaten Tabelle in der Datenbank gespeichert
- Aufbewahrungsdauer Audit-Logs: bis zu **3 Jahre** (Rechtsgrundlage Art. 6 Abs. 1 lit. f DSGVO — berechtigtes Interesse Sicherheit)
- Logs sind für Administratoren der jeweiligen Organisation einsehbar

---

## 7. Weitergabekontrolle
*Schutz bei Übertragung und Transport*

- Datenweitergabe ausschließlich verschlüsselt über HTTPS
- Kein unverschlüsselter Datentransport
- E-Mail-Versand (Anmeldung, Passwort-Reset, Inaktivitätswarnung) über SMTP mit TLS
- Server-seitige Eingabevalidierung und Sanitization von Chat- und Forenbeiträgen (XSS-Schutz)
- CSRF-Schutz auf allen state-changing API-Endpunkten (`X-Requested-With`-Header-Check)
- SSRF-Schutz bei Verarbeitung externer URLs (Blockade privater IPs, Cloud-Metadaten-Endpunkte)
- Rate-Limiting auf 58+ schreibenden Endpunkten zum Schutz vor automatisierten Angriffen

---

## 8. Verfügbarkeitskontrolle
*Schutz vor unbeabsichtigtem Datenverlust*

**Backup-Strategie (Stand 26.04.2026):**
- **Tägliches automatisches Datenbank-Backup** per `pg_dump` (Cron, 03:00 Uhr UTC)
- Speicherort Primär: lokal auf dem VPS unter `/opt/backups/postgres/`
- **Aufbewahrung Primär: 14 Tage** (rotierend, ältere Stände werden überschrieben)
- **Sekundäres Workstation-Backup:** täglicher automatischer Pull auf einen separaten Arbeitsplatz-Rechner an einem zweiten physischen Standort, Aufbewahrung 30 Tage Historie, mit automatischer Nachholung verpasster Läufe
- Restore-Verfahren ist dokumentiert und in einem Drill geprüft (`docs/restore-drill-runbook.md`)

**Verfügbarkeit:**
- Docker-Container mit `restart: unless-stopped` — automatischer Neustart bei Absturz
- VPS-Ressourcenauslastung wird quartalsweise überprüft und ggf. dimensioniert
- Health-Check-Endpunkt (`/api/health`) für externes Monitoring verfügbar

**Bekannte Lücke (im Rahmen der Risikoabwägung akzeptiert):**
Ein vollautomatisches, PC-unabhängiges Cloud-Off-Site-Backup (z. B. Hetzner Storage Box, Backblaze B2) ist für die Skalierungsphase geplant. Der tägliche Workstation-Pull auf einen zweiten physischen Standort deckt derzeit das Risiko „Hoster-Komplettausfall" mit max. 24 h Datenverlust ab. Geplanter Ausbau: NAS mit Snapshot-Versionierung zum Schutz vor Ransomware-Szenarien.

---

## 9. Belastbarkeit und Wiederherstellbarkeit
*Wiederherstellung nach einem Zwischenfall (Art. 32 Abs. 1 lit. c DSGVO)*

- Backup-Restore wurde getestet (April 2026): Wiederherstellung der Datenbank in unter 5 Minuten möglich
- Dokumentiertes Restore-Verfahren vorhanden (`docs/restore-drill-runbook.md`)
- Datenbankschema versioniert per Prisma-Migrations — definierte Migration- und Rollback-Wege
- Nächster geplanter Restore-Drill: Oktober 2026

---

## 10. Auftragskontrolle
*Verarbeitung nur gemäß Weisungen des Auftraggebers (Art. 32 Abs. 1 lit. b DSGVO i.V.m. Art. 28 DSGVO)*

- AVV mit jedem Nutzerbetrieb wird vor Zugangseröffnung unterzeichnet (Vorlage: `docs/datenschutz/AVV-Vorlage.md`)
- Verarbeitung erfolgt ausschließlich auf dokumentierte Weisung des Verantwortlichen
- Unterauftragsverarbeiter (Hostinger) hat eigene DSGVO-Konformität nachgewiesen (DPA)
- Alle Auftragsverarbeiter sind im AVV § 5 transparent gelistet

---

## 11. Datenschutz durch Technikgestaltung und durch datenschutzfreundliche Voreinstellungen (Art. 25 DSGVO)

- **Datensparsamkeit:** Es werden nur Daten erhoben, die für die Funktion zwingend erforderlich sind. Geburtsdatum ist optional.
- **Privacy by Default:** Push-Benachrichtigungen sind standardmäßig deaktiviert; Geräte-Trust-Cookie wird nur nach aktiver Auswahl gesetzt.
- **Keine Tracker, keine Werbe-Cookies, keine Analyse durch Dritte.**
- **Keine besonderen Kategorien personenbezogener Daten** gemäß Art. 9 DSGVO werden verarbeitet.
- **Keine automatisierte Entscheidungsfindung** gemäß Art. 22 DSGVO.

---

## 12. Verantwortlicher Ansprechpartner

**Datenschutzbeauftragter (DSB):**
Dennie Gulbinski (Betreiber, ausgebildeter DSB mit Berufserfahrung in der Bäderbranche)
E-Mail: kontakt@smartbaden.de (Betreff: „Datenschutz")

---

## 13. Liste der Unterauftragsverarbeiter

| # | Anbieter | Leistung | Standort | Rechtsgrundlage |
|---|----------|----------|----------|-----------------|
| 1 | Hostinger International Ltd. | VPS-Hosting (Backend, Datenbank), E-Mail-Versand (SMTP/IMAP), Mailspeicherung | Frankfurt, EU (Unternehmenssitz Vilnius/Litauen, Niederlassung Zypern) | Art. 28 DSGVO, DPA von Hostinger akzeptiert (`hostinger.com/legal`) |

**Optional aktivierbare Drittdienste mit Drittlandbezug** (nur bei Einwilligung des einzelnen Nutzers, siehe AVV § 5 Abs. 3):

| Push-Dienst | Anbieter | Standort | Rechtsgrundlage |
|-------------|----------|----------|-----------------|
| Firebase Cloud Messaging (FCM) | Google LLC | USA | Art. 49 Abs. 1 lit. a DSGVO (Einwilligung) |
| Apple Push Notification service (APNs) | Apple Inc. | USA | Art. 49 Abs. 1 lit. a DSGVO (Einwilligung) |
| Mozilla Push Service | Mozilla Foundation | USA | Art. 49 Abs. 1 lit. a DSGVO (Einwilligung) |

Inhalt der Push-Benachrichtigungen wird mittels VAPID Ende-zu-Ende verschlüsselt; Push-Dienste sehen keine Klartext-Inhalte.

---

*Letzte Aktualisierung: 26.04.2026*
*Diese TOMs werden überprüft und bei wesentlichen Änderungen der technischen oder organisatorischen Verhältnisse aktualisiert. Halbjährliche Routineprüfung.*
