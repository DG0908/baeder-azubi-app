# Umsetzungspfad: IT-freigabefähige Azubi-App

## Ziel

Dieser Plan beschreibt die Reihenfolge, in der die Azubi-App auf ein Niveau gebracht wird, das in einem kommunalen oder unternehmensweiten Einsatz fachlich vertretbar ist. Ziel ist nicht eine theoretisch perfekte App, sondern eine App, die bei Security-, Datenschutz- und Betriebsprüfung keine typischen Ausschlussgründe mehr aufweist.

## Maßstab

- DSGVO-konforme Verarbeitung mit dokumentierten Zwecken, Rollen, Speicherfristen und Löschprozessen
- Backend-zentrierte Sicherheitsarchitektur ohne direkten Client-Datenbankzugriff
- Nachvollziehbare Administrator- und Sicherheitsereignisse
- Härtung gegen typische Web- und Betriebsrisiken
- Wiederherstellbarer Betrieb mit Backup- und Restore-Nachweis

## Arbeitsweise

- Reihenfolge strikt einhalten
- Neue Features bis Abschluss der kritischen Pakete zurückstellen
- Jedes Paket erst schließen, wenn die Abnahmekriterien erfüllt sind
- Keine Produktivfreigabe vor Abschluss von Paket 8

## Paket 1: Sofortmaßnahmen

### Ziel

Akute Risiken entfernen, damit kein weiterer Schaden durch den Prototyp entsteht.

### Aufgaben

- Alle bekannten Secrets und Tokens rotieren
- Hardcoded Secrets und Fallback-Credentials vollständig entfernen
- Direkte Client-Schreibpfade auf sicherheitsrelevante Tabellen identifizieren und sperren
- Automatische Löschlogik im Frontend außer Betrieb nehmen
- Legacy-Pfade klar als nicht produktionsfähig kennzeichnen

### Abnahmekriterien

- Kein Secret mehr im Repository
- Kein Fallback-JWT-Secret im Backend
- Keine unkontrollierte Löschroutine mehr im Frontend
- Kritische Admin-, Auth- und Ranking-Änderungen nicht mehr direkt aus dem Browser möglich

### Priorität

Critical

## Paket 2: Datenschutz- und Betriebsgrundlagen

### Ziel

Vor dem weiteren Umbau muss klar sein, welche Daten warum verarbeitet werden und wer verantwortlich ist.

### Aufgaben

- Verzeichnis der verarbeiteten Daten erstellen
- Rollen und Berechtigungen verbindlich definieren
- Aufbewahrungs- und Löschfristen festlegen
- Verantwortlichkeiten für Betrieb, Support, Incident Response und Freigaben festlegen
- Externe Dienstleister und AVV-Pflichten erfassen

### Abnahmekriterien

- Datenarten, Zweck, Rechtsgrundlage und Fristen sind dokumentiert
- Rollenmodell ist schriftlich freigegeben
- Löschung erfolgt nur nach dokumentierter Regel, nicht durch versteckte App-Logik
- Hoster- und Auftragsverarbeiterrolle ist geklärt

### Priorität

Critical

## Paket 3: Zielarchitektur festziehen

### Ziel

Eine eindeutige Systemarchitektur schaffen, die von IT und Datenschutz geprüft werden kann.

### Aufgaben

- Frontend, Backend und Datenbank technisch trennen
- PostgreSQL nur intern erreichbar betreiben
- NestJS als einzige autoritative API definieren
- Mandantenmodell für mehrere Unternehmen im Datenmodell verankern
- Dev-, Test- und Produktionsumgebungen trennen

### Abnahmekriterien

- Browser greift nicht direkt auf produktive Datenbanktabellen zu
- Alle sicherheitsrelevanten Vorgänge laufen über `/api`
- Mandantentrennung ist im Schema und in der Autorisierung abgebildet
- Separate Konfigurationen für `dev`, `test`, `prod` existieren

### Priorität

Critical

## Paket 4: Authentifizierung und Autorisierung

### Ziel

Alle Zugriffe nachvollziehbar an Benutzer, Rollen und Freigabestatus binden.

### Aufgaben

- Passwort-Hashing mit Argon2 oder bcrypt erzwingen
- Registrierung über kontrollierten Prozess mit Freigabestatus
- JWT oder sichere Session-Strategie finalisieren
- RBAC für `admin`, `ausbilder`, `azubi`, `rettungsschwimmer_azubi`
- Guards für geschützte Routen flächendeckend anwenden
- Negativtests für unzulässige Zugriffe ergänzen

### Abnahmekriterien

- Kein Passwort im Klartext
- Gesperrte oder nicht freigegebene Konten können sich nicht anmelden
- Rollenwechsel und Freigaben nur serverseitig möglich
- Jeder geschützte Endpunkt liefert bei fehlenden Rechten korrekt `401` oder `403`

### Priorität

Critical

## Paket 5: Eingaben, Chat und Fachlogik absichern

### Ziel

Manipulationen über das Frontend technisch unattraktiv und serverseitig wirkungslos machen.

### Aufgaben

- DTO-basierte Validierung für alle Endpunkte
- Sanitizing für Chat- und Freitextinhalte
- Rate Limiting für Login, Registrierung, Admin- und Duell-Endpunkte
- Duell-, Ranking- und Fortschrittslogik vollständig serverseitig berechnen
- Client nur Antworten und Eingaben senden lassen, nie Punkte oder Sieger

### Abnahmekriterien

- Ungültige Nutzereingaben werden serverseitig abgewiesen
- Chat-Nachrichten können keine schädlichen HTML-/Script-Inhalte einschleusen
- Missbrauch durch Masseneingaben ist begrenzt
- Ranglisten ändern sich nur durch serverseitig validierte Aktionen

### Priorität

Critical

## Paket 6: Datenmigration ohne Verlust

### Ziel

Bestehende Konten, Lernstände und fachliche Daten kontrolliert in die Zielarchitektur überführen.

### Aufgaben

- Bestehende Tabellen und Datensätze inventarisieren
- Migrationsmapping von Altstruktur auf Prisma/PostgreSQL-Zielmodell definieren
- Testexport und Testimport in isolierter Umgebung durchführen
- Dubletten, Pflichtfelder und Rollenfehler bereinigen
- Migrations-Checkliste und Rollback-Verfahren festlegen

### Abnahmekriterien

- Für jeden relevanten Alt-Datensatz gibt es ein Ziel im neuen Modell oder eine dokumentierte Ausnahmeregel
- Testmigration läuft vollständig durch
- Stichproben bestätigen Konten, Fortschritte und Organisationszuordnung
- Rollback ist dokumentiert und praktisch testbar

### Priorität

High

## Paket 7: Logging, Datenschutzrechte und Löschprozesse

### Ziel

Den Betrieb revisionssicher und datenschutzfähig machen.

### Aufgaben

- Audit-Log für Admin- und Sicherheitsaktionen aktivieren
- Log-Felder auf Datenschutz und Geheimnisschutz prüfen
- Exportprozess für Betroffenenanfragen schaffen
- Korrektur- und Löschprozess serverseitig abbilden
- Aufbewahrungsregeln technisch erzwingbar machen

### Abnahmekriterien

- Rollenänderungen, Freigaben, Einladungen und kritische Admin-Aktionen werden protokolliert
- Logs enthalten keine Passwörter, Tokens oder unnötige personenbezogene Daten
- Löschungen erfolgen kontrolliert und nachvollziehbar
- Export und Berichtigung sind betrieblich durchführbar

### Priorität

High

## Paket 8: Deployment und Härtung

### Ziel

Ein Setup liefern, das auf VPS oder im Rechenzentrum sauber betrieben werden kann.

### Aufgaben

- Docker- und Docker-Compose-Setup finalisieren
- Reverse Proxy mit TLS und sicheren Headern betreiben
- Minimalprinzip bei offenen Ports umsetzen
- Produktions-`.env` nur außerhalb des Repositories pflegen
- Betriebsbenutzer, Dateirechte und Adminzugänge härten
- Unautorisierte Serveränderungen über Zugriffs- und Deploy-Prozess verhindern

### Abnahmekriterien

- Nur notwendige Ports sind von außen erreichbar
- HTTPS ist Standard
- Produktive Secrets liegen nicht im Code und nicht im Image-Layer
- Deployment-Prozess ist dokumentiert und reproduzierbar
- Änderungen am Server sind nur für berechtigte Personen möglich

### Priorität

High

## Paket 9: Backup, Restore und Notfallfähigkeit

### Ziel

Sicherstellen, dass der Betrieb auch nach Fehlern oder Angriffen wiederherstellbar ist.

### Aufgaben

- Automatische Datenbank-Backups einrichten
- Restore-Skripte und Restore-Handbuch finalisieren
- Test-Restore in einer isolierten Umgebung durchführen
- Notfallkontakt, Meldeweg und Wiederanlaufplan definieren
- Datenschutzverletzungsprozess vorbereiten

### Abnahmekriterien

- Geplante Backups laufen erfolgreich
- Ein Test-Restore wurde nachweislich durchgeführt
- Wiederherstellungszeit und Verantwortlichkeiten sind dokumentiert
- Vorfallprozess für Datenschutz- und Sicherheitsereignisse ist vorhanden

### Priorität

High

## Paket 10: Prüfbarkeit und Freigabe

### Ziel

Die App so dokumentieren und testen, dass eine IT-Abteilung sie belastbar bewerten kann.

### Aufgaben

- Technische Dokumentation und Betriebsdokumentation abschließen
- Security-Tests gegen OWASP ASVS-orientierte Kriterien durchführen
- Dependency- und Container-Scans ausführen
- Offene Findings priorisieren und abarbeiten
- Pilotfreigabe und spätere Produktivfreigabe formal vorbereiten

### Abnahmekriterien

- Keine offenen Critical Findings
- Keine offenen High Findings ohne akzeptierte Risikobewertung
- Dokumentation deckt Architektur, Betrieb, Backup, Rollen und Datenschutz ab
- Pilot kann kontrolliert freigegeben werden

### Priorität

High

## Go/No-Go-Regeln

### Kein Go für Pilot

- Wenn der Browser noch produktive DB-Schreibrechte hat
- Wenn Auth oder Rollen teilweise nur im Frontend entschieden werden
- Wenn keine getesteten Backups existieren
- Wenn Secrets noch im Repo oder in Deployment-Dateien liegen

### Kein Go für Produktion

- Wenn Paket 1 bis 9 nicht abgeschlossen sind
- Wenn offene Critical Findings existieren
- Wenn Restore nicht nachgewiesen ist
- Wenn Lösch- und Auskunftsprozesse nur theoretisch beschrieben, aber nicht ausführbar sind

## Reihenfolge ohne Abschweifen

1. Paket 1 abschließen
2. Paket 2 schriftlich festziehen
3. Paket 3 bis 5 technisch umsetzen
4. Paket 6 mit Testmigration durchführen
5. Paket 7 bis 9 betrieblich absichern
6. Paket 10 zur Freigabevorbereitung nutzen

## Hinweis zu Datenverlust

Die Zielmigration darf nicht mit direkter Löschung beginnen. Richtige Reihenfolge:

1. Backup erstellen
2. Testexport erzeugen
3. Testimport in isolierter Umgebung prüfen
4. Ergebnisse fachlich abnehmen
5. Erst danach produktive Migration planen

So bleiben Konten, Fortschritte und organisatorische Zuordnungen erhalten, sofern die Alt-Daten konsistent genug sind. Falls Datenfelder in der Altstruktur fehlen oder fachlich unklar sind, müssen diese Fälle vor der Produktivmigration einzeln bereinigt werden.
