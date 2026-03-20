# DSGVO- und Betriebskonzept

## Zweck

Dieses Dokument definiert den minimalen Datenschutz- und Betriebsrahmen fuer die Azubi-App im kommunalen oder unternehmensweiten Einsatz.

## Rollen im Betrieb

- Verantwortlicher: die einsetzende Kommune, das Bad oder das Unternehmen
- Auftragsverarbeiter: Hoster/VPS-Anbieter, Mail-/Push-/Backup-Dienstleister, sofern eingesetzt
- Administrator: technische Betriebs- und Berechtigungsverwaltung
- Ausbilder: fachliche Betreuung, Freigabe von Lern- und Organisationsprozessen
- Azubi: Nutzung von Lern-, Chat-, Fortschritts- und Duelldaten im freigegebenen Umfang

## Verarbeitete Daten

| Datenart | Beispiele | Zweck | Minimalprinzip |
| --- | --- | --- | --- |
| Kontodaten | E-Mail, Anzeigename, Rolle, Status | Anmeldung, Freigabe, Rechte | Keine privaten Zusatzdaten ohne Zweck |
| Organisationsdaten | Betrieb, Zuordnung, Einladungscode | Mandantentrennung, Registrierung | Nur dienstliche Zuordnung speichern |
| Lerndaten | Fortschritte, Quiz-/Duellergebnisse, Trainingsdaten | Lernstand, Auswertung, Rankings | Keine rohen Client-Scores als Wahrheit |
| Kommunikationsdaten | Chatnachrichten, Forenbeitraege | Zusammenarbeit und Rueckfragen | Inhalte auf erforderliches Maß begrenzen |
| Sicherheitsdaten | Audit-Logs, Loginzeitpunkte, Admin-Aktionen | Nachvollziehbarkeit, Missbrauchserkennung | Keine Passwoerter oder Tokens in Logs |

## Rechts- und Betriebsgrundlagen

- Rechtsgrundlage ist je Einsatzkontext vom Verantwortlichen festzulegen.
- Nicht verifizierbar aus aktuellem Codebestand: konkrete Rechtsgrundlage je Mandant.
- Nicht verifizierbar aus aktuellem Codebestand: abgeschlossene AVV mit allen eingesetzten Dienstleistern.

## Zugriff und Rollen

- `admin`: Mandanten-, Freigabe-, Rollen- und Sicherheitsverwaltung
- `ausbilder`: fachliche Betreuung innerhalb des eigenen Betriebs
- `azubi`: Nutzung der eigenen Lern- und Kommunikationsfunktionen
- `rettungsschwimmer_azubi`: Azubi mit zusaetzlicher fachlicher Zuordnung, keine impliziten Admin-Rechte

## Speicher- und Loeschkonzept

- Keine clientseitige automatische Loeschung
- Loeschung nur ueber dokumentierte serverseitige Prozesse
- Vor jeder Produktivmigration: Backup, Testexport, Testimport, fachliche Pruefung
- Betroffenenrechte muessen Export, Berichtigung, Sperrung und Loeschung praktisch ermoeglichen
- Nicht verifizierbar aus aktuellem Codebestand: final freigegebene Aufbewahrungsfristen je Mandant

## Technische und organisatorische Maßnahmen

- Trennung von Frontend, Backend und Datenbank
- TLS/HTTPS verpflichtend
- Passwoerter nur gehasht
- RBAC und Freigabestatus serverseitig
- Audit-Logging fuer Admin- und Sicherheitsereignisse
- Backups mit Restore-Nachweis
- Keine Secrets im Repository
- Deployment nur ueber dokumentierten Freigabeprozess

## Vorfall- und Meldeprozess

- Sicherheitsvorfall dokumentieren
- Verantwortliche Stelle informieren
- Zugriff sichern, Beweise erhalten, Auswirkungen bewerten
- Datenschutzverletzung anhand Art. 33 DSGVO pruefen
- Nicht verifizierbar aus aktuellem Codebestand: finaler Incident-Response-Prozess der betreibenden Organisation

## Freigabekriterien

- Paket 1 bis 9 der Roadmap abgeschlossen
- Keine offenen Critical Findings
- Keine offenen High Findings ohne dokumentierte Risikoentscheidung
- Restore-Test durchgefuehrt
- AVV-, Rollen-, Loesch- und Logging-Prozess dokumentiert
