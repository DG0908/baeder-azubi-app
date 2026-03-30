# Runbook Betroffenenrechte und Kontoloeschung

Stand: 2026-03-30

## Zweck

Dieses Runbook beschreibt den operativen Mindestprozess fuer Auskunft, Berichtigung und Loeschung in der Azubi-App.

Es ist bewusst technisch ehrlich gehalten:

- was heute belastbar ueber den Produktcode abbildbar ist
- was noch nicht freigegeben werden darf
- welche Nachweise fuer spaetere Streitfaelle gesichert werden muessen

## Geltungsbereich

- produktiver Self-Hosted-Betrieb mit NestJS-Backend
- Mandantenbetrieb fuer Baeder, Unternehmen oder Kommunen
- Anfragen von Azubis, Ausbildern und Admins zu eigenen oder verwalteten Konten

## Technischer Ist-Stand

- Berichtigung des eigenen Profils ist ueber `PATCH /users/me` serverseitig vorhanden.
- Selbstloeschung ist ueber `DELETE /users/me` serverseitig vorhanden.
- Admin-Loeschung ist ueber `DELETE /users/:id` serverseitig vorhanden.
- Loeschung ist aktuell eine kontrollierte Soft-Delete-Deaktivierung:
  - `isDeleted = true`
  - `status = DISABLED`
  - `refreshTokenHash = null`
- Relevante Admin- und Loeschaktionen werden ueber Audit-Logs protokolliert.
- Wichtige Einschraenkung:
  - Der Datenexport ist noch nicht ueber einen dedizierten Secure-Backend-Endpunkt umgesetzt.
  - Der aktuelle Admin-Export im Frontend nutzt noch einen Legacy-Supabase-Lesepfad in `src/lib/dataService.js`.
  - Damit ist der Exportprozess fuer einen finalen DSGVO-/B2B-Go-Live noch nicht freigegeben.

## Rollen und Verantwortung

- Verantwortlicher:
  - der jeweilige Betreiber der Instanz
  - entscheidet ueber Rechtsgrundlage, Aufbewahrung und Freigabe der Prozesse
- Technischer Betreiber:
  - fuehrt die technischen Schritte aus
  - sichert Logs, Screenshots, Exportdateien und Zeitpunkte
- Fachliche Ansprechperson:
  - bestaetigt betroffene Person, Mandant und gewuenschten Umfang
- Datenschutz/DSB oder juristische Pruefung:
  - gibt Fristen, Antworttexte und Sonderfaelle frei

## Mindestnachweise pro Anfrage

Vor Abschluss einer Anfrage muessen mindestens diese Nachweise vorliegen:

- Ticket oder Vorgangsnummer
- anfragende Person und betroffener Mandant
- Art der Anfrage:
  - Auskunft
  - Berichtigung
  - Loeschung
- Zeitpunkt des Eingangs
- verantwortlicher Bearbeiter
- technischer Nachweis der Durchfuehrung
  - Audit-Log
  - Screenshot
  - Exportdatei
  - Systemlog

## Prozess: Berichtigung

1. Identitaet und Mandant bestaetigen.
2. Pruefen, ob die Aenderung selbst durch den Nutzer im Profil moeglich ist.
3. Wenn ja:
   - Nutzer aendert die Daten ueber das Profil.
4. Wenn nein:
   - Admin fuehrt die Aenderung ueber den freigegebenen Backend-/Admin-Pfad aus.
5. Abschluss dokumentieren:
   - alter Wert
   - neuer Wert
   - Zeitpunkt
   - Bearbeiter

## Prozess: Kontoloeschung

1. Identitaet und Mandant bestaetigen.
2. Pruefen, ob es sich um ein normales Nutzerkonto oder ein Admin-Konto handelt.
3. Normales Nutzerkonto:
   - Selbstbedienung ueber Profil-Loeschung oder
   - Admin-Loeschung ueber Nutzerverwaltung
4. Erwarteter technischer Zustand danach:
   - Konto ist deaktiviert
   - Refresh-Session ist ungueltig
   - Login darf nicht mehr funktionieren
5. Abschluss dokumentieren:
   - betroffene User-ID
   - Rolle
   - Bearbeiter
   - Audit-Log-Eintrag

## Wichtige Einschraenkung zur Loeschung

- Die aktuelle Produktlogik ist eine Soft-Delete-Deaktivierung, keine sofortige physische Vollentfernung aus allen Speichern.
- Backup-Aufbewahrung, spaetere Purge-Laeufe und Fristen muessen pro Instanz separat freigegeben werden.
- Fuer Admin-Konten ist keine normale Selbstloeschung freigegeben; hier gilt ein eigener Break-Glass-Prozess.

## Prozess: Auskunft / Datenexport

Aktueller Stand:

- Ein technischer Export ist im Frontend vorhanden.
- Dieser Export basiert aber noch auf einem Legacy-Supabase-Lesepfad.
- Deshalb gilt:
  - kein final freigegebener Standardprozess fuer produktive Betroffenenanfragen
  - vor Pilot/Produktion muss entweder ein Secure-Backend-Export gebaut oder ein kontrolliertes Operator-Verfahren schriftlich freigegeben werden

Bis zur finalen Freigabe:

- Auskunftsanfragen nicht als "voll automatisiert gelost" darstellen.
- Jede Auskunftsanfrage als Sonderfall behandeln.
- Nur mit dokumentierter Betreiberfreigabe und Nachweisbearbeitung ausfuehren.

## No-Go fuer produktive Freigabe

Kein datenschutzsauberer Produktiv-Go-Live, wenn einer dieser Punkte offen bleibt:

- kein freigegebener Auskunfts-/Exportprozess
- keine freigegebenen Aufbewahrungs- und Purge-Regeln
- keine benannte verantwortliche Stelle fuer Incident- und Datenschutzthemen
- keine praktische Pruefung von Selbstloeschung und Admin-Loeschung

## Verknuepfte Dokumente

- `docs/dsgvo-betriebskonzept.md`
- `docs/operations-runbook.md`
- `docs/production-go-live-checklist.md`
- `docs/manual-smoke-test-checklist.md`
