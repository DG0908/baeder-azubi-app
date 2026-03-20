# Production Go-Live Checklist

## Technische Freigabe

- [ ] `docker compose build` erfolgreich
- [ ] `docker compose up -d` erfolgreich
- [ ] `docker compose exec server npx prisma migrate deploy` erfolgreich
- [ ] `/healthz` erreichbar
- [ ] `/api/health` erreichbar
- [ ] `VITE_ENABLE_SECURE_BACKEND_API=true` gesetzt
- [ ] Keine produktiven Direktzugriffe des Frontends auf die Datenbank mehr erforderlich

## Sicherheitsfreigabe

- [ ] Alle Secrets ersetzt und dokumentiert rotiert
- [ ] `APP_COOKIE_SECURE=true` in Produktion
- [ ] TLS aktiv
- [ ] Nur Port 80/443 extern freigegeben
- [ ] Datenbank nicht direkt aus dem Internet erreichbar
- [ ] Mindestens ein Admin-Zugang getestet
- [ ] Audit-Log fuer Admin-Aktion verifiziert

## Datenschutz und Betrieb

- [ ] Verantwortlicher benannt
- [ ] AVV-/Dienstleisterliste aktualisiert
- [ ] Loesch- und Aufbewahrungsregeln freigegeben
- [ ] Incident-Kontakt benannt
- [ ] Backup erfolgreich erstellt
- [ ] Restore-Drill erfolgreich dokumentiert

## Fachliche Stichprobe

- [ ] Login
- [ ] Rollenpruefung Admin/Ausbilder/Azubi
- [ ] Chat
- [ ] Forum
- [ ] Duellstart, Antwortabgabe, Ranking
- [ ] Berichtsheft
- [ ] Schwimmeinheiten / Trainingsplaene
- [ ] Materialien / Ressourcen / News / Klausuren

## Nicht verifizierbar aus aktuellem Codebestand

- [ ] Externer Penetrationstest
- [ ] Formale kommunale oder unternehmensweite Freigabe
