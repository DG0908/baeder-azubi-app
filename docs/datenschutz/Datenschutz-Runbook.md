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

## 4. Datenpanne / Datenschutzverletzung (Art. 33 DSGVO)

**Wann:** Unbefugter Zugriff auf Daten, Datenverlust, Datenleck.

**Frist:** Meldung an Aufsichtsbehörde innerhalb von **72 Stunden** nach Bekanntwerden.

**Vorgehen:**

### Sofortmaßnahmen (erste Stunde):
1. Angriffsvektor identifizieren und sofort schließen (ggf. Server offline nehmen)
2. Betroffene Nutzerkonten sperren
3. Alle Admin-Passwörter und Secrets rotieren
4. Server-Logs sichern:
   ```bash
   docker compose logs server > /opt/azubi-app/incident-$(date +%Y%m%d).log
   ```

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
- Datei: `/docs/datenschutz/Vorfallsprotokoll.md`

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
