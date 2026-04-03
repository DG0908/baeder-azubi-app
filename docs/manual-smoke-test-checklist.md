# Manual Smoke Test Checklist

Stand: 2026-04-03 | Tag 1 des Go-Live-Sprints

---

## 0 · VPS-Vorbereitung (einmalig vor dem ersten Testlauf)

Diese Schritte nur einmal noetig, um sicherzustellen dass Datenbank und Backend auf aktuellem Stand sind.

1. SSH auf VPS, dann:
   ```
   cd /opt/azubi-app
   git pull origin main
   docker compose exec server npx prisma migrate deploy
   docker compose up -d --build server
   ```
2. Erwartung:
   - `prisma migrate deploy` meldet "20260403_add_login_attempts applied" (oder "No pending migrations" wenn schon erledigt)
   - Backend-Container startet neu ohne Fehler
3. Health-Check:
   - `https://api.smartbaden.de/api/health` → antwortet mit 200

---

## 1 · Basis-Erreichbarkeit

| # | Schritt | Erwartet | OK? |
|---|---------|----------|-----|
| 1.1 | `https://azubi.smartbaden.de` im Browser oeffnen | Seite laedt, kein White Screen | |
| 1.2 | `https://api.smartbaden.de/api/health` aufrufen | 200 OK | |
| 1.3 | Cookie-Notice erscheint beim ersten Besuch | Banner sichtbar, Schliessen speichert Entscheidung | |
| 1.4 | Seite neu laden nach Cookie-Bestaetigung | Banner erscheint nicht mehr | |

---

## 2 · Registrierung

| # | Schritt | Erwartet | OK? |
|---|---------|----------|-----|
| 2.1 | Login-Seite oeffnen, auf "Registrieren" wechseln | Formular erscheint | |
| 2.2 | Gueltigen Einladungscode eingeben | Code wird akzeptiert | |
| 2.3 | Schwaches Passwort eingeben (z.B. "123") | Passwort-Staerke-Indikator zeigt "Zu schwach" | |
| 2.4 | Starkes Passwort eingeben | Indikator zeigt OK | |
| 2.5 | Registrierung abschicken | Erfolgsmeldung, kein Konsolenfehler | |
| 2.6 | Login mit neuem Konto versuchen | Schlaegt fehl ("nicht freigeschaltet") | |

---

## 3 · Login

| # | Schritt | Erwartet | OK? |
|---|---------|----------|-----|
| 3.1 | Mit Admin-Konto anmelden | Login erfolgreich, Admin-Menue sichtbar | |
| 3.2 | Mit Ausbilder-Konto anmelden | Login erfolgreich, korrekte Rechte | |
| 3.3 | Mit Azubi-Konto anmelden | Login erfolgreich, korrekte Rechte | |
| 3.4 | Falsches Passwort 5x eingeben | Fehlermeldung nach Versuchen, kein Account-Hinweis ("Invalid credentials") | |
| 3.5 | 6. Versuch mit richtigem Passwort | Lockout-Meldung (Konto gesperrt) | |
| 3.6 | Nach Lockout-Ablauf (15 Min) erneut versuchen | Login klappt wieder | |

---

## 4 · Session-Restore

| # | Schritt | Erwartet | OK? |
|---|---------|----------|-----|
| 4.1 | Eingeloggt als Azubi: Browser-Tab schliessen | - | |
| 4.2 | Neuen Tab oeffnen, URL aufrufen | Session wird per Refresh-Cookie wiederhergestellt, kein Login-Screen | |
| 4.3 | Browser komplett schliessen und neu oeffnen | Session bleibt erhalten (HttpOnly Cookie) | |
| 4.4 | Im Browser DevTools: localStorage pruefen | Kein `baeder_rt`, kein `baeder_user` Eintrag vorhanden | |

---

## 5 · Inaktivitaets-Timeout

| # | Schritt | Erwartet | OK? |
|---|---------|----------|-----|
| 5.1 | Eingeloggt bleiben, 28 Minuten warten (oder im Code kurz auf 1 Min stellen zum Testen) | Gelbe Warn-Meldung erscheint "Sitzung lauft ab" | |
| 5.2 | Auf "Eingeloggt bleiben" klicken | Warnung verschwindet, Session aktiv | |
| 5.3 | Timeout abwarten ohne Reaktion | Automatischer Logout | |

> Hinweis: Fuer den Test den Timeout-Wert in `useInactivityTimeout.js` kurz auf 1/2 Min setzen, danach zuruecksetzen.

---

## 6 · Passwortwechsel im Profil

| # | Schritt | Erwartet | OK? |
|---|---------|----------|-----|
| 6.1 | Profil oeffnen | Passwortwechsel-Formular sichtbar | |
| 6.2 | Falsches aktuelles Passwort eingeben | Fehler, kein Wechsel | |
| 6.3 | Korrektes aktuelles Passwort + neues Passwort eingeben | Erfolgreich | |
| 6.4 | Ausloggen, mit neuem Passwort einloggen | Login klappt | |

---

## 7 · Passwort-Reset per Mail

| # | Schritt | Erwartet | OK? |
|---|---------|----------|-----|
| 7.1 | "Passwort vergessen" auf Login-Seite oeffnen | Formular sichtbar | |
| 7.2 | Existierende E-Mail eingeben | Meldung "Mail verschickt" (gleiche Meldung auch bei nicht-existierender Mail) | |
| 7.3 | Reset-Mail empfangen und Link oeffnen | Reset-Formular laedt | |
| 7.4 | Neues Passwort setzen | Erfolgsmeldung | |
| 7.5 | Mit neuem Passwort einloggen | Login klappt | |
| 7.6 | Reset-Link ein zweites Mal oeffnen | Link ungueltig (einmalig verwendbar) | |

---

## 8 · Logout

| # | Schritt | Erwartet | OK? |
|---|---------|----------|-----|
| 8.1 | Logout-Button klicken | Weiterleitung zur Login-Seite | |
| 8.2 | Browser-Zurueck-Button druecken | Kein Zugriff auf geschuetzte Seite, Redirect zu Login | |
| 8.3 | Nach Logout: DevTools → Application → Cookies pruefen | `refresh_token` Cookie ist geloescht | |

---

## 9 · Admin-Nutzerverwaltung

| # | Schritt | Erwartet | OK? |
|---|---------|----------|-----|
| 9.1 | Frisch registriertes Konto in Admin-Liste suchen | Konto unter "Ausstehend" sichtbar | |
| 9.2 | Konto freischalten | Konto aus "Ausstehend" entfernt | |
| 9.3 | Login mit freigeschaltetem Konto | Klappt jetzt | |
| 9.4 | Testkonto im Admin-Bereich loeschen | Konto verschwindet aus Liste | |
| 9.5 | Login mit geloeschtem Konto versuchen | Schlaegt fehl | |
| 9.6 | Datenexport eines aktiven Nutzers | JSON-Download, enthaelt `account` + `stats`, `meta.exportedVia = "secure-backend"` | |

---

## 10 · PWA-Neuladen

| # | Schritt | Erwartet | OK? |
|---|---------|----------|-----|
| 10.1 | App im Browser oeffnen, auf mobil simulieren (DevTools) | PWA-Installbanner erscheint (beim ersten Besuch) | |
| 10.2 | App als PWA installieren (oder Banner schliessen) | Banner verschwindet, Entscheidung gespeichert | |
| 10.3 | Nach Deploy: App neu laden | Service Worker erkennt Update, Seite laedt neue Version | |
| 10.4 | Netzwerk in DevTools deaktivieren | Offline-Banner erscheint ("Keine Verbindung") | |
| 10.5 | Netzwerk wieder aktivieren | Offline-Banner verschwindet automatisch | |

---

## Abschluss

**Wenn ein Punkt scheitert:**
- URL notieren
- Rolle notieren (Admin / Ausbilder / Azubi)
- Exakten Fehlertext sichern
- Browser-Konsole + Server-Logs pruefen (`docker compose logs server --tail=50`)
- Direkt fixen, nichts Neues nebenbei

**Erst nach gruenem Durchlauf aller 10 Bloecke:**
- Pilot-Nutzer freischalten
- Go-Live-Checkliste weiter abhaken
- Tag 2 starten
