# Technische und Organisatorische Maßnahmen (TOMs)
## gemäß Art. 32 DSGVO

**Plattform:** Azubi-App (azubi.smartbaden.de)
**Betreiber:** [Dein Name]
**Stand:** April 2026
**Nächste Überprüfung:** April 2027

---

## 1. Zutrittskontrolle
*Verhinderung des Zutritts Unbefugter zu Datenverarbeitungsanlagen*

- Server läuft in einem zertifizierten Rechenzentrum von Hostinger in Frankfurt (EU)
- Physischer Zutritt zum Rechenzentrum nur für autorisiertes Hostinger-Personal
- Kein eigener physischer Serverraum

---

## 2. Zugangskontrolle
*Verhinderung der Nutzung von Datenverarbeitungssystemen durch Unbefugte*

- SSH-Zugang zum VPS nur über Public-Key-Authentifizierung (kein Passwort-Login)
- Root-Login per SSH deaktiviert
- Firewall: nur Ports 80, 443 und SSH öffentlich erreichbar
- Automatische Sicherheitsupdates für das Betriebssystem aktiviert
- Admin-Zugang zur Weboberfläche (Coolify) nur über HTTPS

---

## 3. Zugriffskontrolle
*Zugriff nur für befugte Personen innerhalb des Systems*

- Rollenbasiertes Zugriffsmodell: Admin, Ausbilder, Azubi mit unterschiedlichen Berechtigungen
- Passwörter werden mit Argon2id gehasht gespeichert (branchenüblicher Standard)
- Passwort-Mindestlänge: 12 Zeichen
- Automatischer Logout nach 30 Minuten Inaktivität
- Zwei-Faktor-Authentifizierung (TOTP) für Admin-Accounts
- Kein Passwort oder sensibles Datum wird im Browser-Speicher (localStorage) abgelegt
- JWT-Access-Tokens nur im Arbeitsspeicher, Refresh-Token als HttpOnly-Cookie

---

## 4. Trennungskontrolle
*Getrennte Verarbeitung von Daten verschiedener Auftraggeber*

- Jede Organisation erhält eine eigene Organisations-ID; Datenzugriffe sind organisationsweit isoliert
- Kein Cross-Tenant-Datenzugriff durch Benutzer möglich (serverseitig erzwungen)
- Produktiv-, Test- und Entwicklungsumgebung sind getrennt

---

## 5. Pseudonymisierung / Verschlüsselung
*Schutz personenbezogener Daten durch technische Maßnahmen*

- Alle Verbindungen zur App ausschließlich über HTTPS/TLS (Let's Encrypt, automatische Erneuerung)
- Datenbank-Verbindung innerhalb des Docker-Netzwerks (nicht öffentlich erreichbar)
- TOTP-Secrets in der Datenbank mit AES-256-GCM verschlüsselt
- Passwörter werden niemals im Klartext gespeichert (Argon2id-Hash)

---

## 6. Eingabekontrolle
*Nachvollziehbarkeit von Dateneingaben, -änderungen und -löschungen*

- Audit-Log für sicherheitsrelevante Aktionen: Login, Logout, Passwortänderung, Account-Genehmigung, 2FA-Aktivierung
- Logs werden in der Datenbank gespeichert und sind für Admins einsehbar

---

## 7. Weitergabekontrolle
*Schutz bei Übertragung und Transport*

- Datenweitergabe ausschließlich verschlüsselt über HTTPS
- Kein unverschlüsselter Datentransport
- E-Mails (Passwort-Reset) über SMTP mit TLS

---

## 8. Verfügbarkeitskontrolle
*Schutz vor unbeabsichtigtem Datenverlust*

- Automatisches tägliches Datenbank-Backup per pg_dump (cron, 03:00 Uhr)
- Backups lokal auf dem Server gespeichert, Aufbewahrung 7 Tage
- Docker-Container mit `restart: unless-stopped` — automatischer Neustart bei Absturz
- VPS mit 95,82 GB Speicher, 38% RAM-Auslastung (Stand April 2026)

---

## 9. Belastbarkeit
*Wiederherstellbarkeit nach einem Zwischenfall*

- Backup-Restore wurde getestet (April 2026): Wiederherstellung in unter 5 Minuten möglich
- Dokumentiertes Restore-Verfahren vorhanden (siehe Runbook)
- Datenbankschema versioniert per Prisma-Migrations

---

## 10. Auftragskontrolle
*Verarbeitung nur gemäß Weisungen des Auftraggebers*

- AVV mit jedem Nutzerbetrieb wird vor Zugangseröffnung unterzeichnet
- Unterauftragsverarbeiter (Hostinger) hat eigene DSGVO-Konformität nachgewiesen
- Hostinger ist EU-basiert (Frankfurt) — kein Datentransfer in Drittländer

---

## Unterauftragsverarbeiter

| Anbieter | Leistung | Standort | Rechtsgrundlage |
|----------|----------|----------|-----------------|
| Hostinger International Ltd. | VPS-Hosting | Frankfurt, EU | Art. 28 DSGVO, Standardvertragsklauseln |

---

## Verantwortlicher für diese TOMs

**[Dein Name]**
**Datenschutzbeauftragter (betrieblich bestellt)**
E-Mail: [deine E-Mail]
Letzte Aktualisierung: April 2026
