# Manual Smoke Test Checklist

Stand: 2026-03-30

## Vorbedingungen

- Frontend ist auf dem aktuellen `main`-Stand deployed.
- Backend `https://api.smartbaden.de` ist erreichbar.
- Mindestens ein Testkonto je Rolle vorhanden:
  - Admin
  - Ausbilder
  - Azubi
- Ein gueltiger Einladungscode fuer Registrierung liegt vor.

## Deploy-Pruefung

1. `docker compose build web`
2. `docker compose up -d web`
3. `https://smartbaden.de/healthz` oder die produktive Frontend-URL laedt ohne White Screen.
4. `https://api.smartbaden.de/api/health` antwortet erfolgreich.

## Auth

### Registrierung

1. Login-Seite oeffnen.
2. Gueltigen Einladungscode eingeben.
3. Neues Testkonto registrieren.
4. Erwartung:
   - Erfolgsmeldung erscheint.
   - Keine Browser-Fehler in der Konsole.
   - Konto ist noch nicht freigeschaltet.

### Login

1. Mit Admin-Testkonto anmelden.
2. Mit Ausbilder-Testkonto anmelden.
3. Mit Azubi-Testkonto anmelden.
4. Erwartung:
   - Login erfolgreich.
   - Richtige Menues/Rollenrechte sichtbar.
   - Nach Reload bleibt Session erhalten.

### Passwort-Reset

1. "Passwort vergessen" oeffnen.
2. Reset-Mail anfordern.
3. Reset-Link oeffnen.
4. Neues Passwort setzen.
5. Mit neuem Passwort erneut anmelden.
6. Erwartung:
   - Reset-Link fuehrt in den Reset-View.
   - Passwortwechsel erfolgreich.
   - Login mit neuem Passwort funktioniert.

## Admin / Nutzerverwaltung

### Freischaltung

1. Frisch registriertes Testkonto im Admin-Bereich suchen.
2. Konto freischalten.
3. Erwartung:
   - Konto verschwindet aus "pending".
   - Login mit dem neuen Konto ist danach moeglich.

### Admin-Loeschung

1. Testkonto im Admin-Bereich loeschen.
2. Erwartung:
   - Konto ist nicht mehr in der Nutzerliste sichtbar.
   - Login mit dem geloeschten Konto funktioniert nicht mehr.

### Admin-Datenexport

1. Im Admin-Bereich einen aktiven Testnutzer exportieren.
2. JSON-Datei herunterladen.
3. Erwartung:
   - Download startet ohne Fehler.
   - Datei enthaelt `account`, `stats` und weitere Datenbereiche.
   - `meta.exportedVia` steht auf `secure-backend`.

## Profil / Selbstbedienung

### Passwortwechsel im Profil

1. Mit normalem Nutzer anmelden.
2. Profil oeffnen.
3. Passwortwechsel mit aktuellem Passwort ausfuehren.
4. Erwartung:
   - Ohne aktuelles Passwort kein Erfolg.
   - Mit korrektem aktuellem Passwort erfolgreich.

### Kontoloeschung

1. Testkonto oeffnen.
2. Kontoloeschung ausfuehren.
3. Erwartung:
   - Nutzer wird ausgeloggt oder verliert Zugriff.
   - Konto ist danach nicht erneut nutzbar.

## Quizduell

### Duel-Ergebnis

1. Duel zwischen zwei Testkonten starten.
2. Duel vollstaendig zu Ende spielen.
3. Erwartung:
   - Ergebnis-Screen erscheint.
   - Sieger/Verlierer/Unentschieden werden korrekt angezeigt.
   - Statistikwerte sind plausibel.

## Berichtsheft

### Draft

1. Azubi-Profil fuer Berichtsheft fuellen.
2. Berichtsheft fuer aktuelle Woche beginnen.
3. Entwurf speichern oder View wechseln.
4. Seite neu laden.
5. Erwartung:
   - Draft wird wieder geladen.
   - Profilwerte werden uebernommen.

### Freigabe

1. Berichtsheft abschliessen.
2. Ausbilder/Admin oeffnet Signatur-/Freigabeansicht.
3. Erwartung:
   - Eintrag erscheint in den offenen Berichten.
   - Zuweisung/Freigabe funktioniert.

## Abschluss

- Wenn einer der Punkte scheitert:
  - URL notieren
  - Nutzerrolle notieren
  - exakten Fehlertext sichern
  - Browser-Konsole und Server-Logs pruefen
- Erst nach gruenem Durchlauf:
  - Pilot-Nutzer freischalten
  - Go-Live-Checkliste weiter abhaken
