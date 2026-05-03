# DSFA-Vorabprüfung (Schwellenwertanalyse)
## gemäß Art. 35 DSGVO

**Verarbeitungstätigkeit:** Bäder-Azubi App / smartbaden — Lern- und Ausbildungsplattform für Auszubildende im Bäderbereich
**Verantwortlicher:** Dennie Gulbinski, Zeitstraße 108, 53721 Siegburg
**Datenschutzbeauftragter:** Dennie Gulbinski (freiwillig bestellt, an LDI NRW gemeldet)
**Stand:** 03.05.2026
**Nächste planmäßige Überprüfung:** November 2026 (halbjährlich oder bei wesentlichen Architektur-Änderungen)

Dieses Dokument ist die **Vorabprüfung** im Sinne von Art. 35 DSGVO. Sie dient der internen Einschätzung, ob für die Verarbeitungstätigkeit eine vollständige Datenschutz-Folgenabschätzung erforderlich ist. Sie wird **nicht veröffentlicht**, sondern auf Anfrage der Aufsichtsbehörde vorgelegt.

---

## 1. Beschreibung der Verarbeitung

Die App verarbeitet personenbezogene Daten von Auszubildenden, Ausbildern und Administratoren im Kontext der dualen Ausbildung zum Fachangestellten für Bäderbetriebe (FAB). Verarbeitungen umfassen:

- Konto- und Organisationsdaten
- Lern- und Ausbildungsdaten (Quiz, Prüfungssimulator, Karteikarten)
- Klausurnoten und Schulbesuchsnachweise
- Berichtsheft-Einträge (Pflicht-Dokumentation nach BBiG)
- Schwimm- und Trainings-Daten
- Kommunikationsdaten (Chat, Forum, Push)
- Sicherheits- und Audit-Daten

Detaillierte Beschreibung im VVT (`docs/datenschutz/VVT.md`).

---

## 2. Schwellenwertanalyse nach Risikokriterien

Folgend die Prüfung gemäß Liste der **LDI NRW** zu Art. 35 Abs. 4 DSGVO und den WP-248-Kriterien der Art-29-Datenschutzgruppe (jetzt EDSA).

### Kriterium 1: Auswertung oder Bewertung (Profiling/Scoring)

**Trifft zu:** ⚠️ **Teilweise**

- Lernfortschritte werden ausgewertet, Klausurnoten gespeichert und im Trainer-Dashboard dargestellt.
- **Aber:** Keine **automatisierte Entscheidung** im Sinne von Art. 22 DSGVO. Keine Konsequenzen für Ausbildungsverhältnis oder Prüfungszulassung werden algorithmisch getroffen.
- Bewertungen dienen ausschließlich der Information und der pädagogischen Begleitung.

→ Risikoeinstufung: **niedrig bis mittel** (Profiling-light, ohne Rechtswirkung).

### Kriterium 2: Automatisierte Entscheidungsfindung mit rechtlicher oder ähnlicher Wirkung

**Trifft zu:** ❌ **Nein**

Keine automatisierten Entscheidungen mit rechtlicher Wirkung. Art. 22 DSGVO ist explizit ausgeschlossen.

### Kriterium 3: Systematische Überwachung

**Trifft zu:** ❌ **Nein**

Keine kontinuierliche Erfassung von Standort, Verhalten oder Aktivität außerhalb der App. Kein Tracking, keine Bewegungsdaten.

### Kriterium 4: Vertrauliche oder besondere Datenkategorien (Art. 9 DSGVO)

**Trifft zu:** ❌ **Nein** (strukturell)

Die App ist nicht darauf ausgelegt, besondere Kategorien personenbezogener Daten zu erheben. Nutzer werden in der Datenschutzerklärung darauf hingewiesen, keine Gesundheits- oder anderen sensiblen Angaben in Freitextfelder einzutragen. Eine gezielte Auswertung etwaiger sensibler Angaben findet nicht statt.

### Kriterium 5: Datenverarbeitung in großem Umfang

**Trifft zu:** ❌ **Nein** (initial)

Zielgruppe sind FAB-Azubis in Deutschland (geschätzt 5.000–10.000 Personen jährlich). Im aktuellen Stadium nutzen ~12 Pilotnutzer die App. Auch im Skalierungsfall ist die Größenordnung gering im Vergleich zu den DSGVO-Maßstäben für „großen Umfang" (z.B. Krankenversicherer, Banken).

### Kriterium 6: Verknüpfung oder Zusammenführung von Datensätzen

**Trifft zu:** ❌ **Nein**

Keine Verknüpfung mit externen Datenquellen. Auftragsverarbeiter (Hostinger, Brevo, Cloudflare) verarbeiten ausschließlich technische Daten ohne Profiling.

### Kriterium 7: Schutzbedürftige Personen

**Trifft zu:** ⚠️ **Teilweise**

- Auszubildende stehen in einem **Beschäftigtenverhältnis** mit Abhängigkeit (§ 26 BDSG).
- Minderjährige unter 16 Jahren können Nutzer sein (Art. 8 DSGVO).
- **Aber:** Im B2B-Szenario erfolgt die Verarbeitung auf Grundlage des Beschäftigtendatenschutzes (§ 26 BDSG), nicht auf Einwilligung. Der Ausbildungsbetrieb als Verantwortlicher prüft die Rechtsgrundlage.

→ Risikoeinstufung: **mittel**. Schutzkonzept Minderjährige siehe Datenschutzerklärung Abschnitt 12.

### Kriterium 8: Innovative Nutzung neuer technologischer oder organisatorischer Lösungen

**Trifft zu:** ❌ **Nein**

Die App nutzt etablierte Technologien (REST-API, JWT-Authentifizierung, klassische Drei-Schichten-Architektur). Keine KI-basierten Entscheidungen, keine biometrischen Verfahren, keine IoT-Komponenten.

### Kriterium 9: Verhinderung der Wahrnehmung von Rechten oder Diensten

**Trifft zu:** ❌ **Nein**

Keine Verarbeitung, die die Wahrnehmung von Rechten beeinträchtigt. Die App ist optional, alle Funktionen sind ohne weitere Einschränkungen nutzbar (außer Push, welches ausdrücklich einwilligungsbasiert ist).

---

## 3. Bewertungs-Tabelle

| Kriterium | Trifft zu? | Risiko |
|---|---|---|
| 1. Profiling / Scoring | Teilweise | Niedrig–mittel |
| 2. Automatisierte Entscheidungen | Nein | — |
| 3. Systematische Überwachung | Nein | — |
| 4. Besondere Datenkategorien | Nein | — |
| 5. Großer Umfang | Nein | — |
| 6. Datensatz-Verknüpfung | Nein | — |
| 7. Schutzbedürftige Personen | Teilweise | Mittel |
| 8. Innovative Technologien | Nein | — |
| 9. Verhinderung von Rechten | Nein | — |

**Erfüllte Kriterien:** 2 (teilweise) von 9.

---

## 4. Schlussfolgerung

Nach LDI-NRW-Maßstab ist eine **vollständige Datenschutz-Folgenabschätzung erforderlich, wenn zwei oder mehr Risikokriterien voll erfüllt** sind oder ein einzelnes Kriterium ein hohes Risiko ergibt.

In dieser Vorabprüfung sind **zwei Kriterien teilweise erfüllt** (Profiling-light und schutzbedürftige Personen), beide jedoch durch organisatorische und technische Maßnahmen entschärft:

- **Profiling-light:** Keine Rechtswirkung, ausdrücklicher Ausschluss von Art. 22 DSGVO in der Datenschutzerklärung.
- **Schutzbedürftige Personen:** Im B2B-Kontext liegt die Hauptverantwortung beim Ausbildungsbetrieb. Schutzkonzept Minderjährige (Art. 8 DSGVO) ist in der Datenschutzerklärung dokumentiert. Bestätigung der Volljährigkeit (16+) statt Speicherung des Geburtsdatums (Datenminimierung).

**Ergebnis:** Eine vollständige DSFA nach Art. 35 DSGVO ist **derzeit nicht erforderlich**.

**Begleitende Schutzmaßnahmen** (technisch und organisatorisch) sind in den TOMs (`docs/datenschutz/TOMs.md`) dokumentiert und decken die identifizierten Restrisiken ab:

- Datenminimierung (kein Geburtsdatum, neutrale Push-Inhalte, keine Tracking-Cookies)
- Pseudonymisierung der Audit-Logs
- Default-Deny RBAC, 2FA für Administratoren
- Klare Trennung zwischen Verantwortlichem (B2B-Betrieb) und Auftragsverarbeiter
- Ausdrücklicher Ausschluss von Art. 22 DSGVO

---

## 5. Auslöser für Neubewertung

Eine erneute Vorabprüfung wird durchgeführt bei:

- Einführung **automatisierter Bewertungsfunktionen** mit Konsequenzen für Nutzer (z.B. „Diese Person ist nicht prüfungsreif")
- **Verarbeitung besonderer Datenkategorien** (z.B. Gesundheitsdaten zur Schwimmleistung)
- **Massiver Skalierung** (>10.000 aktive Nutzer)
- **Einsatz von KI/Machine-Learning** für Lernpfad-Empfehlungen oder Prüfungsvorhersagen
- **Übermittlung an Drittländer außerhalb der EU** über die jetzige Push-Konstellation hinaus
- **Wesentliche Änderungen** an den Auftragsverarbeitern, der Architektur oder der Zielgruppe

---

## 6. Verantwortlich für diese Vorabprüfung

**Dennie Gulbinski**
Datenschutzbeauftragter (freiwillig bestellt, an LDI NRW gemeldet)
E-Mail: kontakt@smartbaden.de (Betreff: „Datenschutz")

---

## 7. Änderungs-Historie

| Datum | Änderung | Autor |
|-------|----------|-------|
| 03.05.2026 | Initialfassung der Vorabprüfung | Dennie Gulbinski |

---

*Diese DSFA-Vorabprüfung ist ein internes Compliance-Dokument gemäß Art. 35 DSGVO. Sie wird auf Anforderung der Aufsichtsbehörde vorgelegt, ist aber nicht zur Veröffentlichung gegenüber Endnutzern bestimmt.*
