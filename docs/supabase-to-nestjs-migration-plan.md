# Migrationsplan: Supabase -> NestJS Backend

Stand: 2026-03-20

## Zweck

Dieser Plan beschreibt den sicheren, schrittweisen Umstieg der Azubi-App von direktem Browserzugriff auf Supabase hin zu einem autoritativen NestJS-Backend unter `server/`.

Ziel ist kein Big-Bang-Umbau, sondern ein kontrollierter Wechsel mit:

- klarer Rueckfallmoeglichkeit
- testbarem Zwischenstand
- moeglichst geringem Risiko fuer Bestandsdaten

## Aktueller Ist-Stand im Repository

Der aktuelle Branch ist noch nicht auf dem Zielzustand:

- `src/supabase.js` erzeugt aktuell immer einen Supabase-Client und enthaelt noch harte Fallback-Werte fuer URL und Anon-Key.
- `src/context/AuthContext.jsx` ist derzeit voll auf Supabase Auth und Supabase-Tabellen ausgerichtet.
- `src/App.jsx` und mehrere Views greifen weiterhin direkt auf Supabase zu.
- Ein sicherer Frontend-API-Pfad existiert bereits in `src/lib/secureApi.js` und `src/lib/secureApiClient.js`.
- Das NestJS-Backend in `server/` existiert bereits, ist aber laut aktuellem Stand noch nicht als produktiver API-Pfad aktiviert.

Wichtig:

- Der Commit `df7bd38` kann als Referenz fuer die Frontend-Migration dienen.
- Er soll nicht blind komplett uebernommen werden, weil genau dieser Migrationsversuch bereits einen Production-Build-Fehler ausgeloest hat.
- Deshalb werden die Aenderungen daraus nur schrittweise und dateiweise uebernommen.

## Architekturentscheidungen

- Das NestJS-Backend bekommt eine eigene PostgreSQL-Datenbank.
- Die Supabase-Datenbank wird nicht mit Prisma geteilt.
- Das Frontend wird ueber `VITE_ENABLE_SECURE_BACKEND_API` kontrolliert umgeschaltet.
- Die API wird ueber die bestehende Reverse-Proxy-/Traefik-Umgebung unter `api.smartbaden.de` bereitgestellt.
- Fuer Bestandsnutzer wird ein Passwort-Reset erzwungen, statt bestehende Supabase-Passworthashes direkt zu uebernehmen.

## Phase 0: Frontend-Bootstrap sicher machen

Ziel:

- Der Frontend-Build darf nicht mehr an Supabase-Credentials haengen.
- Gleichzeitig muessen harte Fallback-Secrets aus dem Browser entfernt werden.

Massnahmen:

1. `src/supabase.js` so umbauen, dass ohne `VITE_SUPABASE_URL` und `VITE_SUPABASE_ANON_KEY` kein harter Fehler und kein harter Fallback entsteht.
2. Statt eines erzwungenen Clients soll `supabase` im Nicht-Supabase-Modus kontrolliert `null` sein.
3. Alle Stellen, die `supabase` direkt verwenden, muessen im Secure-Backend-Modus sauber guarden.
4. `src/context/AuthContext.jsx` fuer Dual-Mode vorbereiten, ohne einen Build- oder Laufzeitabbruch zu verursachen.

Betroffene Dateien:

- `src/supabase.js`
- `src/context/AuthContext.jsx`
- danach schrittweise `src/App.jsx` und Views mit direkten Supabase-Zugriffen

Verifikation:

- `VITE_ENABLE_SECURE_BACKEND_API=true`
- `VITE_SUPABASE_URL=""`
- `VITE_SUPABASE_ANON_KEY=""`
- `npm run build`

Erfolgskriterium:

- der Build laeuft durch
- kein Modul bricht wegen fehlender Supabase-Credentials
- keine harten Supabase-Secrets mehr im Frontend-Bootstrap

## Phase 1: NestJS-Backend auf dem VPS deployen

Ziel:

- Das Backend muss als echter Laufzeitdienst verfuegbar sein, bevor das Frontend darauf umgeschaltet wird.

Schritte:

1. Repository auf dem VPS bereitstellen, zum Beispiel unter `/opt/azubi-app`.
2. `server/.env.example` als Grundlage fuer eine echte produktive Server-Konfiguration nutzen.
3. JWT-Secrets, SMTP, CORS, Cookie-Domain und `APP_PUBLIC_URL` sauber setzen.
4. PostgreSQL starten.
5. Prisma-Migrationen ausfuehren.
6. NestJS-Server starten.
7. Reverse-Proxy-/Traefik-Route fuer `api.smartbaden.de` auf den Server-Container legen.
8. Health-Check pruefen.

Beispielpruefung:

- `curl https://api.smartbaden.de/api/health`

Erfolgskriterium:

- die API antwortet stabil
- Migrationen sind sauber angewendet
- Logs zeigen keine Konfigurations- oder CORS-Fehler

## Phase 2: Datenmigration Supabase -> NestJS-DB

Ziel:

- Bestehende fachliche Daten kontrolliert in das neue Datenmodell ueberfuehren, ohne sich auf die alte Runtime zu verlassen.

Schritte:

1. Migrationsskript anlegen, zum Beispiel `server/scripts/migrate-from-supabase.mjs`.
2. Daten aus der Supabase-PostgreSQL-Datenbank lesen.
3. Feldnamen und Datenformate auf das Prisma-Zielmodell abbilden.
4. Eine Organization fuer den Altbestand sauber definieren.
5. Alte IDs auf neue IDs mappen, inklusive Lookup-Tabelle fuer Folgebeziehungen.
6. Passwoerter nicht migrieren.
7. Migrationslauf zuerst in isolierter Testumgebung durchfuehren.
8. User-Count, fachliche Stichproben und Referenzen pruefen.

Wichtig:

- Keine Produktivmigration ohne Backup.
- Keine Passwortmigration aus Supabase Auth in das neue Backend.
- Alle Bestandsnutzer muessen spaeter den Passwort-Reset nutzen.

Erfolgskriterium:

- User-Anzahl und Kernobjekte stimmen
- Beziehungen sind intakt
- Stichproben fuer Chat, Duelle, Flashcards, Forum und Berichtsheft sind konsistent

## Phase 3: Frontend dateiweise auf Dual-Mode ziehen

Ziel:

- Das Frontend soll im gleichen Build entweder noch Supabase oder schon die sichere API nutzen koennen.

Vorgehen:

1. Phase-0-Fix fuer `src/supabase.js` umsetzen.
2. Den Commit `df7bd38` nur als Referenz verwenden.
3. Die Frontend-Dateien nacheinander migrieren und nicht als Massen-Commit.
4. Nach jeder Datei oder kleinem Paket bauen und lokal testen.

Empfohlene Reihenfolge:

1. `src/context/AuthContext.jsx`
2. `src/components/auth/LoginScreen.jsx`
3. `src/App.jsx`
4. `src/components/views/AdminView.jsx`
5. `src/components/views/ChatView.jsx`
6. weitere Views schrittweise

Grundregel:

- `if (isSecureBackendApiEnabled()) { ...secureApi... } else { ...supabase... }`

Verifikation:

- `VITE_ENABLE_SECURE_BACKEND_API=true npm run build`
- lokaler Test mit Preview-Server

Erfolgskriterium:

- kein TDZ- oder Importfehler
- kein direkter Supabase-Zwang im Secure-Backend-Modus
- Login, Navigation und Kernscreens laufen

## Phase 4: Staged Rollout

Ziel:

- Das neue Backend wird erst mit kleinem Nutzerkreis geprueft, bevor alle Nutzer umgeschaltet werden.

Schritte:

1. Produktive Frontend-Umgebung mit Flag `OFF` belassen.
2. Preview- oder Testdeployment mit Flag `ON` bereitstellen.
3. Ein Admin oder kleiner Tester-Kreis prueft die Kernfunktionen.
4. Gefundene Fehler in CORS, Cookies, Datenmapping oder Antwortformaten beheben.
5. Erst danach den Flag fuer alle Nutzer aktivieren.

Beispiel-Variablen:

- `VITE_ENABLE_SECURE_BACKEND_API=true`
- `VITE_API_BASE_URL=https://api.smartbaden.de/api`
- `VITE_SUPABASE_URL=https://db.smartbaden.de`

Wichtig:

- Der Supabase-Fallback bleibt in dieser Phase nur als Rueckfallweg bestehen.
- Er ist kein Zielzustand.

## Phase 5: Umschalten mit kurzer Maintenance

Ziel:

- Kontrollierter Wechsel auf das NestJS-Backend als produktive Laufzeit.

Schritte:

1. Neue Registrierungen im alten Supabase-Pfad sperren.
2. Letzten Datensync aus Supabase in die neue Datenbank durchfuehren.
3. Feature-Flag fuer Produktion auf `true` setzen.
4. Frontend neu deployen.
5. Nutzer ueber den Passwort-Reset-Prozess informieren.
6. Server-Logs und Healthchecks eng monitoren.

Rollback:

- Flag wieder auf `false`
- Frontend nutzt wieder Supabase

Voraussetzung fuer Rollback:

- der alte Pfad ist waehrend des Umschaltfensters noch intakt

## Phase 6: Cleanup nach Stabilisierung

Ziel:

- Nach stabiler Laufzeit wird der Altpfad konsequent entfernt.

Schritte:

1. `@supabase/supabase-js` aus dem Frontend entfernen.
2. `src/supabase.js` loeschen.
3. `src/database.js` loeschen.
4. Alle Feature-Flag-Zweige fuer Altpfade entfernen.
5. Supabase-bezogene Betriebsartefakte abschalten.
6. Alte Daten nur noch fuer einen befristeten Backup-Zeitraum aufbewahren.

Verifikation:

- `npm ls @supabase/supabase-js`
- kein produktiver Frontend-Pfad referenziert mehr `supabase`

## Verifikation je Phase

Phase 0:

- `npm run build` mit aktivem Secure-Backend-Flag und leeren Supabase-Variablen darf nicht crashen

Phase 1:

- `curl https://api.smartbaden.de/api/health` liefert eine gueltige Antwort

Phase 2:

- User-Count und Kernobjekte in neuer Datenbank stimmen mit dem Altbestand ueberein

Phase 3:

- lokaler Browser-Test fuer Login, Chat, Quizduell, Flashcards, Berichtsheft und Forum

Phase 4:

- Preview-/Testdeployment funktioniert fuer Testnutzer stabil

Phase 5:

- Bestandsnutzer koennen Passwort-Reset durchlaufen und wieder arbeiten

Phase 6:

- kein Frontend-Dependency- oder Codepfad haengt mehr produktiv an Supabase

## Zeitabschaetzung

- Phase 0-1: 1 Session
- Phase 2-3: 1 bis 2 Sessions
- Phase 4-5: 1 Session
- Phase 6: 1 Session

## Offene Risiken

- Datenmigration und Feldmapping sind aktuell noch nicht praktisch nachgewiesen.
- Cookie-Domain, CORS und Reverse-Proxy-Verhalten muessen im echten Zielbetrieb getestet werden.
- Der Commit `df7bd38` ist nur Referenzmaterial und kein garantierter Fast-Forward-Fix.
- Solange der Dual-Mode aktiv ist, bleibt die Codebasis komplexer als im Endzustand.
