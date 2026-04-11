# AVV-Vorlage Self-Hosted

Diese Vorlage ist fuer den geplanten Self-Hosted-Betrieb der Azubi-App gedacht. Sie ersetzt **nicht** die juristische Pruefung.

## Vertragsparteien

- Auftraggeber: einsetzende Kommune / Unternehmen / Badbetreiber
- Auftragnehmer: Betreiber der Azubi-App / SmartBaden

## Gegenstand der Verarbeitung

Bereitstellung und Betrieb der webbasierten Azubi-App fuer Ausbildung, Lernfortschritt, Kommunikation, Rankings, Duelle und Dokumentationsfunktionen.

## Datenkategorien

- Kontodaten: Anzeigename, E-Mail, Rolle, Status, Organisationszuordnung
- Lerndaten: Fortschritte, Quiz- und Duelldaten, Trainings- und Pruefungsdaten
- Kommunikationsdaten: Chat- und Foreninhalte
- Dokumentationsdaten: Berichtsheft, Kontrollkarte, Schwimmeinheiten
- Sicherheitsdaten: Audit-Logs, Login-Zeitpunkte, Admin-Aktionen

## Betroffene Personen

- Azubis
- Ausbilder
- Administratoren

## Technische Betriebsform

- Self-Hosted VPS oder Root-Server
- Docker Compose mit getrennten Diensten fuer `web`, `server`, `postgres`
- TLS ueber Reverse Proxy / vorgeschalteten Load Balancer
- PostgreSQL ohne direkte Client-Erreichbarkeit

## Unterauftragsverarbeiter

Vom Auftragnehmer im Einzelfall auszufuellen, z. B.:

- VPS-/Hosting-Anbieter
- SMTP-/Mail-Relay-Anbieter
- externer Backup-Speicher
- Monitoring-/Alerting-Dienst

Nicht mehr passend fuer diese Vorlage:

- Supabase als Primärdatenbank
- Frontend-Hosting als getrennte Vercel-/Netlify-Produktivarchitektur

## Sicherheitsmassnahmen

- Passwoerter nur gehasht
- Rollen und Freigaben serverseitig erzwungen
- Audit-Logging fuer sicherheitsrelevante Admin-Aktionen
- Backups und Restore-Drills
- Secrets nur ueber Umgebungsvariablen
- Keine direkte Browser-Datenbankanbindung

## Loeschung und Rueckgabe

- Nach Vertragsende nach Weisung des Auftraggebers:
  - Rueckgabe exportierbarer Daten
  - anschliessende Loeschung innerhalb der vereinbarten Frist
- Konkrete Aufbewahrungsfristen mandantenbezogen festlegen

## Meldung von Vorfaellen

- Sicherheits- oder Datenschutzvorfaelle unverzueglich melden
- Eskalations- und Kontaktwege im Betriebsprozess hinterlegen

## Anlagen

- `docs/dsgvo-betriebskonzept.md`
- `docs/operations-runbook.md`
- `docs/production-go-live-checklist.md`
