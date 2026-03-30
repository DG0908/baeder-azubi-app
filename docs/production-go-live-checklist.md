# Production Go-Live Checklist

## Technische Freigabe

- [ ] `docker compose build` erfolgreich
- [ ] `docker compose up -d` erfolgreich
- [ ] `docker compose exec server npx prisma migrate deploy` erfolgreich
- [ ] `/healthz` erreichbar
- [ ] `/api/health` erreichbar
- [ ] `VITE_ENABLE_SECURE_BACKEND_API=true` gesetzt
- [ ] Kritische Kernpfade laufen produktiv ueber Backend-API
- [ ] Verbleibende Legacy-Sonderpfade sind dokumentiert und fuer Go-Live bewertet

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
- [ ] `docs/privacy-rights-runbook.md` freigegeben
- [ ] Auskunfts-/Datenexport-Prozess technisch und organisatorisch freigegeben
- [ ] Backup erfolgreich erstellt
- [ ] Restore-Drill erfolgreich dokumentiert

## Fachliche Stichprobe

- [ ] `docs/manual-smoke-test-checklist.md` einmal gruener Durchlauf
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
