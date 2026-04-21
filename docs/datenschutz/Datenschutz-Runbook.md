# Datenschutz-Runbook
## Azubi-App — Betriebshandbuch für Datenschutzvorfälle

**Betreiber:** [Dein Name]
**Stand:** April 2026

---

## 1. Auskunftsanfrage (Art. 15 DSGVO)

**Wann:** Eine Person fragt, welche Daten über sie gespeichert sind.

**Frist:** Antwort innerhalb von **1 Monat** nach Eingang der Anfrage.

**Vorgehen:**
1. Identität der anfragenden Person verifizieren (E-Mail-Abgleich)
2. In der App als Admin: Benutzerprofil aufrufen → alle Daten einsehen
3. Daten exportieren:
   ```sql
   -- In der DB (docker compose exec postgres psql -U azubi_app azubi_app)
   SELECT * FROM "User" WHERE email = 'anfragende@email.de';
   ```
4. Antwort per E-Mail mit allen gespeicherten Daten (Name, E-Mail, Rolle, Registrierungsdatum, letzte Anmeldung)
5. Vorgang dokumentieren (Datum, Anfragender, Antwortdatum)

---

## 2. Löschungsanfrage (Art. 17 DSGVO — "Recht auf Vergessenwerden")

**Wann:** Eine Person verlangt die Löschung ihrer Daten.

**Frist:** Löschung innerhalb von **1 Monat**.

**Vorgehen:**
1. Identität verifizieren
2. Prüfen ob Aufbewahrungspflichten entgegenstehen (z.B. Berichtshefte können arbeitsrechtliche Relevanz haben → mit Betrieb abklären)
3. In der App: Admin → Benutzer → Account löschen (Soft-Delete)
4. Für vollständige Löschung:
   ```sql
   -- Achtung: Irreversibel!
   DELETE FROM "User" WHERE email = 'betroffene@email.de';
   ```
5. Bestätigung der Löschung per E-Mail senden
6. Vorgang dokumentieren

---

## 3. Berichtigungsanfrage (Art. 16 DSGVO)

**Wann:** Eine Person verlangt die Korrektur falscher Daten.

**Frist:** Berichtigung unverzüglich, spätestens **1 Monat**.

**Vorgehen:**
1. Identität verifizieren
2. In der App: Admin → Benutzer bearbeiten → Daten korrigieren
3. Bestätigung per E-Mail
4. Vorgang dokumentieren

---

## 3a. Einschränkung der Verarbeitung (Art. 18 DSGVO)

**Wann:** Eine Person bestreitet die Richtigkeit ihrer Daten oder die Rechtmäßigkeit der Verarbeitung, eine sofortige Löschung soll aber nicht erfolgen (z. B. weil die Daten als Beweismittel benötigt werden).

**Frist:** Unverzüglich, spätestens **1 Monat**.

**Vorgehen:**
1. Identität verifizieren
2. In der App: Admin → Benutzer auf Status `DISABLED` setzen (kein Login mehr möglich, Daten bleiben erhalten)
3. Notiz im Audit-Log: „Verarbeitung eingeschränkt gemäß Art. 18 DSGVO, Grund: ..."
4. Bestätigung per E-Mail
5. Vorgang dokumentieren, Wiederaufnahme oder Löschung nach Klärung

---

## 3b. Datenübertragbarkeit (Art. 20 DSGVO)

**Wann:** Eine Person verlangt ihre personenbezogenen Daten in einem strukturierten, gängigen und maschinenlesbaren Format.

**Frist:** Unverzüglich, spätestens **1 Monat**.

**Vorgehen:**
1. Identität verifizieren
2. In der App als Admin: DSGVO-Export für den Nutzer auslösen (JSON-Export mit allen Nutzerdaten inkl. Berichtshefte, Quiz-Historie, Badges)
3. Export als Datei (JSON, optional ZIP) per sicher versandter E-Mail oder Download-Link (zeitlich begrenzt, TLS-geschützt)
4. Vorgang dokumentieren

---

## 3c. Widerspruch (Art. 21 DSGVO)

**Wann:** Eine Person widerspricht einer auf berechtigtes Interesse (Art. 6 Abs. 1 lit. f DSGVO) gestützten Verarbeitung — z. B. gegen die Protokollierung in Audit-Logs über das gesetzlich Erforderliche hinaus.

**Frist:** Unverzüglich, spätestens **1 Monat**.

**Vorgehen:**
1. Identität verifizieren
2. Abwägung: zwingende schutzwürdige Gründe des Verantwortlichen vs. Interessen der betroffenen Person
3. Bei Stattgabe: Betroffene Verarbeitung beenden (z. B. Entfernung aus Newsletter, Einschränkung von Auswertungen)
4. Bei Ablehnung: begründete Antwort mit Verweis auf überwiegendes Interesse
5. Vorgang dokumentieren

---

## 4. Datenpanne / Datenschutzverletzung (Art. 33 DSGVO)

**Wann:** Unbefugter Zugriff auf Daten, Datenverlust, Datenleck.

**Frist:** Meldung an Aufsichtsbehörde innerhalb von **72 Stunden** nach Bekanntwerden.

**Vorgehen:**

### Sofortmaßnahmen (erste Stunde):

**Wichtig vor Aktionen:** Forensik schützen. Laufende Prozesse, RAM-Inhalte und aktuelle Logs sind oft beweisrelevant — einen Server komplett offline zu nehmen zerstört diese Beweise.

1. **Netzwerk-Isolation statt Offline-Nehmen:** Eingehende Verbindungen per Firewall-Regel blocken (alle Ports außer SSH für Admin-Zugriff), Prozesse weiterlaufen lassen:
   ```bash
   # auf dem VPS als root:
   ufw default deny incoming
   ufw allow from <deine-IP> to any port 22
   ufw reload
   ```
2. Log-Snapshot sichern (vor weiteren Aktionen, damit Beweiskette erhalten bleibt):
   ```bash
   docker compose logs server > /opt/azubi-app/incident-$(date +%Y%m%d-%H%M)-server.log
   docker compose logs postgres > /opt/azubi-app/incident-$(date +%Y%m%d-%H%M)-db.log
   journalctl --since "24 hours ago" > /opt/azubi-app/incident-$(date +%Y%m%d-%H%M)-system.log
   ```
3. Angriffsvektor identifizieren (Logs, ungewöhnliche Requests, neue User, veränderte Dateien mit `find /opt/azubi-app -newer /tmp/reference -type f`)
4. Betroffene Nutzerkonten sperren (siehe Abschnitt 5)
5. Alle Admin-Passwörter und Secrets rotieren (JWT-Secrets, TOTP-Encryption-Key, DB-Passwort, SSH-Keys)
6. Erst nach Abschluss von 1–5 und dokumentierter Beweissicherung: betroffene Services bei Bedarf stoppen

### Meldung an Aufsichtsbehörde:
- **Zuständig:** Landesbeauftragter für Datenschutz des Bundeslandes des Verantwortlichen (Nutzerbetrieb)
- **Online-Meldung:** https://www.bfdi.bund.de (Bundesbeauftragter, falls unklar welches Bundesland)
- **Inhalt der Meldung:**
  - Art der Verletzung
  - Betroffene Datenkategorien und ca. Anzahl betroffener Personen
  - Wahrscheinliche Folgen
  - Ergriffene Gegenmaßnahmen

### Benachrichtigung der Betroffenen (Art. 34 DSGVO):
- Wenn hohes Risiko für Betroffene → direkte Benachrichtigung per E-Mail
- Inhalt: Was ist passiert, welche Daten betroffen, was wurde unternommen, Kontaktmöglichkeit

### Dokumentation:
- Alle Vorfälle dokumentieren — auch wenn keine Meldepflicht besteht
- Datei: `/docs/datenschutz/Vorfallsprotokoll.md` (bei erstem Vorfall anlegen)
- Mindestangaben pro Eintrag: Datum/Uhrzeit der Entdeckung, Art der Verletzung, Kategorie und Anzahl betroffener Datensätze, Ursache, ergriffene Maßnahmen, Meldung an Aufsichtsbehörde (ja/nein, wann), Benachrichtigung der Betroffenen (ja/nein, wann)

### Muster-Mail an Betroffene (Art. 34 DSGVO):
Im Verzeichnis `/docs/datenschutz/Muster-Benachrichtigung-Datenpanne.md` (bei Bedarf anlegen). Pflichtinhalte: Art der Verletzung, wahrscheinliche Folgen, ergriffene Maßnahmen, Kontakt DSB, Empfehlungen zur Eigen-Absicherung (z. B. Passwortwechsel).

---

## 5. Nutzerkonto sperren (bei Verdacht auf Missbrauch)

```bash
# In der DB:
docker compose exec postgres psql -U azubi_app azubi_app -c \
  "UPDATE \"User\" SET status = 'DISABLED' WHERE email = 'verdacht@email.de';"
```

---

## 6. Backup wiederherstellen

```bash
cd /opt/azubi-app

# Neuestes Backup finden:
ls -lt backups/

# Wiederherstellen:
docker compose exec -T postgres psql -U azubi_app azubi_app < backups/backup_DATEINAME.sql
```

---

## 7. Kontakte

| Rolle | Name | Kontakt |
|-------|------|---------|
| Betreiber / DSB | [Dein Name] | [deine E-Mail] |
| Hosting (Hostinger) | Support | support@hostinger.com |
| Datenschutz-Aufsichtsbehörde (DE) | BfDI | https://www.bfdi.bund.de |

---

## 8. Jährliche Überprüfungscheckliste

- [ ] TOMs auf Aktualität prüfen
- [ ] Backup-Restore testen
- [ ] Zugriffsrechte der Admin-Accounts überprüfen
- [ ] Server-Sicherheitsupdates einspielen (`apt update && apt upgrade`)
- [ ] AVVs mit allen Nutzerbetrieben auf Aktualität prüfen
- [ ] Passwörter rotieren (DB, SSH-Keys, JWT-Secrets)
- [ ] Hostinger-Vereinbarung prüfen (DSGVO-Konformität noch gegeben?)
