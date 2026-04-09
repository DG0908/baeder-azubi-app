# Notfall-Trainer MVP

## Ziel
Der Notfall-Trainer soll Mitarbeitende und Azubis nicht nur Wissen abfragen lassen, sondern das **richtige Entscheiden unter Zeitdruck** trainieren. Der Fokus liegt auf Priorisierung, Teamkommunikation und typischen Fehlern im Badbetrieb.

## MVP-Scope
- 1 kompletter Pilotfall: `Kollaps am Beckenrand`
- 3 Antworttypen:
  - `single_choice`
  - `ordering`
  - `keyword_input`
- 1 Debrief pro Fall mit:
  - Punktzahl
  - kritischen Fehlern
  - Merksatz
  - haeufigen Fehlentscheidungen

Die erste Datenquelle liegt in [emergencyTrainerScenarios.json](c:/Users/User/baeder-azubi-app/src/data/emergencyTrainerScenarios.json).

## Warum das Modul sinnvoll ist
- trainiert Handlungsprioritaeten statt nur Faktenwissen
- bildet Teamkommunikation und Delegation ab
- ist naeher an realen Einsatzlagen als normale Quizfragen
- liefert Ausbildern spaeter aussagekraeftige Fehlerbilder

## Empfohlener UX-Ablauf
1. `Fallkarte`
   - Titel
   - Schwierigkeitsgrad
   - geschaetzte Dauer
   - Lernziele

2. `Lagebild`
   - kurzer Szenariotext
   - klarer Startbutton
   - Timer sichtbar

3. `Entscheidungsschritte`
   - immer nur ein Schritt pro Screen
   - kurze, klare Antwortoptionen
   - sofortiges Feedback nach jeder Antwort

4. `Debrief`
   - Gesamtscore
   - Bestanden/Nicht bestanden
   - kritische Fehler
   - Handlungsempfehlung
   - Merksatz

## Antworttypen

### Single Choice
Gut fuer:
- erste Prioritaet
- Alarmierungsentscheidung
- Delegation

### Ordering
Gut fuer:
- Reihenfolge von Notruf, AED, HLW
- strukturierte Erstversorgung

### Keyword Input
Gut fuer:
- Notrufinhalt
- Funkmeldung
- kurze Uebergabe

Die Bewertung sollte ueber **Stichwortgruppen** laufen, nicht ueber exakte Wortfolgen.

## Bewertungslogik
- richtige Prioritaet: hohe Gewichtung
- richtige Massnahmenreihenfolge: mittlere Gewichtung
- saubere Uebergabe: kleinere Gewichtung
- kritische Fehler: Fall sofort nicht bestanden

Beispiele fuer kritische Fehler:
- kein Notruf
- keine Wiederbelebung trotz fehlender normaler Atmung
- Eigenschutz/Lagepruefung komplett ausgelassen

## UI-Empfehlung fuer eure App

### Startseite des Moduls
- Kachel `Notfall-Trainer`
- Filter:
  - `Erste Hilfe`
  - `Rettung`
  - `Gefahrstoff`
  - `Organisation`
- Modi:
  - `Blitz-Drill`
  - `Einsatz`
  - `Teamleiter`

### Schrittansicht
- oben:
  - Falltitel
  - Schrittzaehler
  - Timer
- Mitte:
  - Lage oder Frage
  - Antwortmodul
- unten:
  - Button `Antwort pruefen`
  - danach `Weiter`

### Debrief-Ansicht
- Ampelstatus
- Score
- kritische Fehler
- richtige Handlungslogik
- Merksatz
- Button `Noch einmal`

## Technische MVP-Idee

### Phase 1
- statische JSON-Daten aus `src/data/emergencyTrainerScenarios.json`
- keine Datenbank noetig
- lokaler Fortschritt nur in Memory oder Local State

### Phase 2
- gespeicherte Durchlaeufe je Nutzer
- Ausbilder sehen:
  - Fehlerhaeufigkeit
  - Reaktionszeit
  - Bestehensquote

### Phase 3
- Zuweisung von Faellen durch Ausbilder
- Teamleiter-Modus
- Audio-/Bildimpulse

## Nächste sinnvolle 5 Faelle
1. `Kollaps am Beckenrand`
2. `Kind nach Beinahe-Ertrinken`
3. `Krampfanfall in der Umkleide`
4. `Sprungunfall mit HWS-Verdacht`
5. `Chlor-/Reizgasvorfall`

## Fachliche Leitplanken
- Inhalte sind Trainingsfaelle, keine Live-Handlungsanweisung
- muessen zu euren internen Alarm- und Betriebsablaeufen passen
- medizinische Kernschritte sollten auf offiziellen Erste-Hilfe-/HLW-Grundsaetzen basieren

## Referenzen
- DRK Wiederbelebung:
  https://www.drk.de/hilfe-in-deutschland/erste-hilfe/erste-hilfe-massnahmen-zur-wiederbelebung-pruefen-rufen-druecken/
- DRK Herz-Lungen-Wiederbelebung:
  https://www.drk.de/hilfe-in-deutschland/erste-hilfe/herz-lungen-wiederbelebung/
- DLRG Erste Hilfe Ausbildung:
  https://www.dlrg.de/informieren/ausbildung/erste-hilfe/
