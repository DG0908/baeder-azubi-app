# Umsetzungsplan: IT-freigabefaehige Azubi-App

Stand: 2026-03-20

## Ziel

Dieser Plan ist das verbindliche Arbeitsdokument fuer die weitere Absicherung der Azubi-App. Er haelt fest:

- was bereits technisch umgesetzt ist
- was fuer Pilot und Produktion noch offen ist
- in welcher Reihenfolge wir ohne Abschweifen weiterarbeiten

Der Massstab bleibt:

- DSGVO-tauglicher Betrieb
- backend-zentrierte Sicherheitsarchitektur
- keine sicherheitsrelevanten Browser-Schreibrechte
- nachvollziehbare Admin- und Sicherheitsaktionen
- wiederherstellbarer Betrieb mit Backup- und Restore-Nachweis

## Aktueller Gesamtstand

Die groessten Architektur- und Security-Baustellen des Prototyps wurden bereits umgebaut:

- NestJS-Backend unter `server/` als autoritativer API-Pfad
- PostgreSQL + Prisma als Ziel-Datenmodell
- Auth, Freigabestatus, RBAC und Passwort-Reset serverseitig
- Chat, Duelle, Ranking, Benachrichtigungen, Berichtsheft, Schwimmeinheiten, Trainingsplaene, Flashcards, Pruefungen, Content, Forum, Ressourcen und App-Konfiguration auf dem sicheren Backend-Pfad
- Legacy-Express-Altpfade fuer `/api/push` und `/api/admin` stillgelegt
- Docker-/Compose-, Nginx-, Backup-/Restore- und Betriebsdokumente vorhanden

Wichtige Restwahrheit:

- Die App ist noch nicht produktiv freizugeben.
- Der Schwerpunkt liegt jetzt auf Testdatenbank, Migration, Smoke-Tests, Restore-Drill und dem Entfernen der letzten Legacy-Fallbacks.

## Paketstatus

## Paket 1: Sofortmassnahmen

Status: `teilweise abgeschlossen`

Erledigt:

- Hardcoded Secrets und unsichere Fallbacks aus den relevanten App-Pfaden entfernt
- kritische Browser-Schreibpfade blockiert oder auf `/api` umgezogen
- automatische clientseitige Loeschlogik deaktiviert
- Legacy-Altpfade sichtbar als nicht produktionsfaehig markiert

Offen:

- echte Rotation aller real verwendeten Secrets in Test/Produktion
- Nachweis, dass keine Alt-Secrets mehr im Betrieb verwendet werden

Abschlusskriterium:

- reale Secrets sind ersetzt, dokumentiert und ausserhalb des Repos verwaltet

## Paket 2: Datenschutz- und Betriebsgrundlagen

Status: `teilweise abgeschlossen`

Erledigt:

- Datenschutz-/Betriebsgrundlagen in `docs/dsgvo-betriebskonzept.md`
- AVV-Basis und Betriebsdokumente angelegt
- Rollenmodell fachlich festgezogen

Offen:

- formale Freigabe von Aufbewahrungs-, Loesch- und Auskunftsprozessen durch den Betreiber
- Benennung der realen Verantwortlichen fuer Betrieb, Support, Incident Response und Datenschutz

Abschlusskriterium:

- Betreiber hat die Dokumente nicht nur im Repo, sondern organisatorisch freigegeben

## Paket 3: Zielarchitektur festziehen

Status: `weitgehend umgesetzt`

Erledigt:

- Frontend, Backend und Datenbank sind technisch getrennt
- NestJS ist die Ziel-API
- Mandantenfaehigkeit ist im Datenmodell und in den Kernmodulen verankert
- PostgreSQL ist fuer den Zielbetrieb nur intern vorgesehen

Offen:

- letzte Legacy-Fallbacks im Frontend vollstaendig entfernen
- Migrationen gegen eine echte Testdatenbank pruefen

Abschlusskriterium:

- kein produktiver Fachpfad faellt mehr auf direkte Supabase-/Legacy-Zugriffe zurueck

## Paket 4: Authentifizierung und Autorisierung

Status: `weitgehend umgesetzt`

Erledigt:

- Passwort-Hashing
- Approval-Workflow
- JWT + Refresh-Cookie-Ansatz
- RBAC fuer `admin`, `ausbilder`, `azubi`, `rettungsschwimmer_azubi`
- Guards auf dem sicheren Backend-Pfad
- Passwort-Reset

Offen:

- End-to-End-Tests gegen echte Testdatenbank
- Bestandsnutzer-/Passwortmigration spaeter sauber planen und pruefen

Abschlusskriterium:

- alle Auth- und Rollenfluesse sind auf Testsystemen erfolgreich nachgewiesen

## Paket 5: Eingaben, Chat und Fachlogik absichern

Status: `weitgehend umgesetzt`

Erledigt:

- DTO-Validierung in den neuen Backend-Modulen
- Sanitizing fuer Chat- und Freitextpfade
- serverseitige Duell-, Ranking-, Notification- und weite Teile der Fortschrittslogik
- Client sendet in den sensiblen Spielfluessen nur Eingaben, nicht autoritative Scores

Offen:

- strukturierte Smoke-Tests fuer alle Kernmodule
- Restscan auf verbliebene unsichere Legacy-Sonderpfade
- Nachweis der Rate-Limits im Testbetrieb

Abschlusskriterium:

- Kernflows sind praktisch getestet und liefern keine ungeschuetzten Browser-Schreibpfade mehr

## Paket 6: Datenmigration ohne Verlust

Status: `offen`

Erledigt:

- Zielmodell in Prisma weitgehend vorhanden
- Migrationsgrundsatz mehrfach festgelegt: `Backup -> Testexport -> Testimport -> Pruefung -> erst dann Produktivmigration`

Offen:

- Alt-Daten inventarisieren
- Feldmapping Alt -> Zielmodell dokumentieren
- Testmigration in isolierter Umgebung bauen
- Rollback-Plan praktisch vorbereiten

Abschlusskriterium:

- Testmigration laeuft durch und Stichproben bestaetigen Konten, Rollen und Fortschritte

## Paket 7: Logging, Datenschutzrechte und Loeschprozesse

Status: `teilweise abgeschlossen`

Erledigt:

- Audit-Logs fuer viele Admin-/Sicherheitsaktionen vorhanden
- unkontrollierte clientseitige Loeschlogik entfernt

Offen:

- Exportprozess fuer Betroffenenanfragen technisch und betrieblich vervollstaendigen
- serverseitige Berichtigungs-/Loeschprozesse vollstaendig dokumentieren
- Retention-Regeln in echtem Betrieb pruefen

Abschlusskriterium:

- Auskunft, Berichtigung und kontrollierte Loeschung sind praktisch durchfuehrbar

## Paket 8: Deployment und Haertung

Status: `teilweise abgeschlossen`

Erledigt:

- Dockerfile fuer Web und Server
- Docker Compose
- Nginx-Reverse-Proxy
- `.env.example`
- Operations-Runbook und Go-Live-Checkliste
- Push-/Mail-/TLS-relevante Konfigurationsparameter dokumentiert

Offen:

- echte Produktions-Secrets setzen
- TLS im Zielbetrieb pruefen
- Compose-Deployment mit realer `.env` einmal komplett durchtesten
- Betriebsrechte und Deploy-Zugriffe organisatorisch absichern

Abschlusskriterium:

- reproduzierbarer Test-/Produktivdeploy mit echten Secrets und minimaler Aussenflaeche

## Paket 9: Backup, Restore und Notfallfaehigkeit

Status: `teilweise abgeschlossen`

Erledigt:

- Backup- und Restore-Skripte vorhanden
- Runbook fuer Restore-Drill vorhanden

Offen:

- echter Backup-Lauf auf Testsystem
- echter Restore-Drill auf isolierter Datenbank
- Wiederanlaufzeit und Verantwortlichkeiten dokumentiert verifizieren

Abschlusskriterium:

- Restore wurde praktisch getestet und dokumentiert

## Paket 10: Pruefbarkeit und Freigabe

Status: `offen`

Erledigt:

- Security-Audit, Roadmap, Go-Live-Checkliste und Betriebsdokumente liegen vor

Offen:

- Smoke-Tests aller Kernflows
- Dependency-/Container-Scans
- interner Security-Abschlusscheck
- optional externer Pentest
- formale Pilot- und spaetere Produktivfreigabe

Abschlusskriterium:

- keine offenen Critical Findings und keine unbewerteten High Findings

## Naechste konkrete Reihenfolge

Diese Schritte sind jetzt die richtige Arbeitsreihenfolge:

1. Testdatenbank bereitstellen.
2. Alle Prisma-Migrationen gegen die Testdatenbank anwenden.
3. Smoke-Tests fuer Login, Rollen, Chat, Forum, Duelle, Ranking, Berichtsheft, Schwimmeinheiten, Trainingsplaene, Flashcards, Pruefungen, Content und Push fahren.
4. Backup erstellen und Restore-Drill in isolierter Umgebung durchfuehren.
5. Letzte Legacy-Fallbacks im Frontend entfernen.
6. Abschlussreview mit neuer Sicherheitsbewertung und Pilotfreigabe vorbereiten.

## Go/No-Go

Kein Go fuer Pilot:

- wenn Migrationen auf Testdatenbank nicht sauber laufen
- wenn Kernflows nur im Code gut aussehen, aber nicht praktisch getestet sind
- wenn Secrets weiter unkontrolliert verteilt sind

Kein Go fuer Produktion:

- wenn Paket 1 bis 9 nicht praktisch abgeschlossen sind
- wenn Restore nicht nachgewiesen ist
- wenn letzte Legacy-Fallbacks noch produktiv aktiv sind
- wenn offene Critical Findings bestehen

## Kurzfazit

Die App ist nicht mehr auf Prototyp-Niveau. Der grosse Architekturumbau ist weitgehend erledigt. Der Engpass ist jetzt nicht mehr primar Entwicklung, sondern belastbarer Betriebsnachweis.
