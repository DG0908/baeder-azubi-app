# Operations Runbook

## Zweck

Dieses Runbook beschreibt den minimalen Betriebsstandard fuer einen produktiven Self-Hosted-Einsatz der Azubi-App.

## Zielarchitektur

- `web`: Nginx als Reverse Proxy und Auslieferung des Frontends
- `server`: NestJS-API mit Auth, RBAC, Audit-Log und Fachlogik
- `postgres`: interne PostgreSQL-Datenbank ohne direkte Internet-Freigabe

## Mindestanforderungen vor Go-Live

- `VITE_ENABLE_SECURE_BACKEND_API=true`
- Keine produktiven Secrets im Repository, in Images oder in Shell-History
- TLS vor dem `web`-Service aktiv
- Migrationen erfolgreich auf Testumgebung angewendet
- Backup erstellt und Restore-Drill erfolgreich nachgewiesen
- Mindestens ein `admin`-Konto mit dokumentiertem Verantwortlichen vorhanden
- Logging, Incident-Kontakt und Patch-Prozess benannt

## Rollen und Zugriffe

- Root-/Sudo-Zugang auf dem VPS nur fuer benannte Betriebsverantwortliche
- Deploy-Zugriff nur fuer definierte Maintainer
- Kein direkter Datenbankzugriff fuer Endnutzer
- Admin-Zugriff in der App nur fuer freigegebene Konten mit dokumentiertem Zweck

## Secrets

- Vor erstem Produktivstart muessen alle Werte aus `.env.example` ersetzt werden
- JWT-Secrets, DB-Passwort, Invitation-Pepper und Password-Reset-Pepper getrennt erzeugen
- SMTP-Credentials separat verwalten
- Secrets nie per Chat, Ticket oder Repo teilen

## Deployment-Ablauf

1. Wartungsfenster festlegen
2. Backup ausfuehren
3. Images neu bauen: `docker compose build`
4. Dienste starten: `docker compose up -d`
5. Migrationen anwenden: `docker compose exec server npx prisma migrate deploy`
6. Health pruefen:
   - `http://<host>/healthz`
   - `http://<host>/api/health`
7. Admin-Login und Kernfunktionen pruefen
8. Ergebnis im Change-Log dokumentieren

## Backup

- Backup vor jedem Deployment
- Zusaetzlich regelmaessiger geplanter Backup-Job
- Script: `./ops/backup-postgres.sh`
- Backups verschluesselt und ausserhalb des Laufwerks der Produktivinstanz ablegen

## Restore-Drill

- Restore niemals blind zuerst auf Produktion testen
- Erst in separater Drill-/Staging-Umgebung pruefen
- Restore nur mit ausdruecklicher Bestaetigung:
  - `RESTORE_CONFIRM=YES ./ops/restore-postgres.sh <backup-file>`
- Nach Restore pruefen:
  - Health-Endpunkt
  - Admin-Login
  - Stichprobe auf Nutzer, Fortschritte, Duelldaten, Chat und Audit-Logs

## Monitoring und Logs

- Docker-Logs mit Rotation sind Pflicht
- API-Health und Reverse-Proxy-Health regelmaessig pruefen
- Fehler bei Login, Migration, Backup und Restore gesondert dokumentieren
- Keine Tokens, Passwoerter oder Reset-Links in Logs speichern

## Patch- und Update-Prozess

- Sicherheitsupdates fuer OS, Docker, Node und NPM-Abhaengigkeiten regelmaessig einspielen
- Keine `npm audit fix`-Blindlaeufe in Produktion
- Updates zuerst in Testumgebung pruefen

## Incident Response

1. Betroffene Instanz eingrenzen
2. Logs und Zeitpunkte sichern
3. Verdacht auf Secret-Leak: Secrets sofort rotieren
4. Verdacht auf Datenschutzvorfall dokumentieren und an Verantwortliche eskalieren
5. Wiederanlauf erst nach Ursachenanalyse und dokumentierter Freigabe

## Nicht verifizierbar aus aktuellem Codebestand

- Externer Pentest
- SIEM-/Alarmierungsanbindung
- Zentrale revisionssichere Log-Ablage
- Formale Freigabe durch Datenschutz, Informationssicherheit und Betriebsverantwortung
