# Verzeichnis von Verarbeitungstätigkeiten (VVT)
## gemäß Art. 30 DSGVO

**Verantwortlicher:** Dennie Gulbinski, Zeitstraße 108, 53721 Siegburg
**Datenschutzkontakt:** Dennie Gulbinski (kontakt@smartbaden.de, Betreff: „Datenschutz") — bearbeitet Anfragen intern mit datenschutzrechtlicher Fachkunde (Weiterbildung u.a. im Bereich Datenschutzbeauftragter). Eine formelle Benennung nach Art. 37 DSGVO erfolgt derzeit nicht; die Erforderlichkeit wird regelmäßig anhand § 38 BDSG sowie Art. 35 DSGVO überprüft.
**Stand:** 03.05.2026 (rev. 3)
**Nächste planmäßige Überprüfung:** November 2026 (halbjährlich)

Dieses Verzeichnis dokumentiert die Verarbeitungstätigkeiten des Betreibers gemäß Art. 30 DSGVO und ist auf Anforderung der Aufsichtsbehörde zur Verfügung zu stellen (Art. 30 Abs. 4 DSGVO).

Das Verzeichnis ist zweigeteilt:
- **Teil A:** Verarbeitungen als **Verantwortlicher** (Art. 30 Abs. 1 DSGVO)
- **Teil B:** Verarbeitungen als **Auftragsverarbeiter** (Art. 30 Abs. 2 DSGVO)

---

# Teil A — Verarbeitungen als Verantwortlicher (Art. 30 Abs. 1 DSGVO)

## A.1 Webseiten-Bereitstellung und Anmeldung

| Feld | Inhalt |
|---|---|
| **Bezeichnung** | Bereitstellung der App und Authentifizierung |
| **Zweck** | Bereitstellung der Bäder-Azubi App, Authentifizierung registrierter Nutzer, Sitzungsmanagement |
| **Rechtsgrundlage** | Art. 6 Abs. 1 lit. b DSGVO (Vertragsdurchführung) |
| **Kategorien betroffener Personen** | Auszubildende, Ausbilder, Administratoren, Endnutzer der App |
| **Kategorien personenbezogener Daten** | Anzeigename, E-Mail-Adresse, gehashtes Passwort, Rolle, Status, Login-Zeitpunkte, IP-Adresse (kurzfristig zur Sitzungsverwaltung), User-Agent, Refresh-Token-Hash, optional Geräte-Trust-Token-Hash |
| **Empfänger** | Hostinger International Ltd. (Hosting); keine Weitergabe an Dritte |
| **Drittlandtransfer** | Nein |
| **Löschfristen** | Bei Konto-Löschung Soft-Deletion; Inaktivitätsroutine nach 22/24 Monaten; Refresh-Token: 7 Tage; Geräte-Trust: 30 Tage |
| **TOMs** | Siehe `docs/datenschutz/TOMs.md` |

## A.2 Lern- und Ausbildungsverwaltung

| Feld | Inhalt |
|---|---|
| **Bezeichnung** | Verwaltung von Lernfortschritt, Quiz, Prüfungssimulator, Berichtsheft, Klausuren, Schwimm-Daten |
| **Zweck** | Digitale Unterstützung der dualen Ausbildung im Bäderbereich, Lernfortschritts-Dokumentation, Prüfungsvorbereitung |
| **Rechtsgrundlage** | Art. 6 Abs. 1 lit. b DSGVO (Vertragsdurchführung); ergänzend Art. 6 Abs. 1 lit. c DSGVO i.V.m. BBiG für Berichtsheft-Pflichten |
| **Kategorien betroffener Personen** | Auszubildende, Ausbilder, Administratoren |
| **Kategorien personenbezogener Daten** | Lernfortschritte, Quiz- und Duell-Ergebnisse, Klausurnoten, Berichtsheft-Einträge, Monatsberichte, Karteikarten, Schwimm-Daten, Prüfungssimulator-Sitzungen |
| **Empfänger** | Innerhalb der App: Nutzer selbst, Ausbilder der zugeordneten Organisation, Administratoren der Organisation; technisch: Hostinger International Ltd. (Hosting) |
| **Drittlandtransfer** | Nein |
| **Löschfristen** | Bei Konto-Löschung Soft-Deletion; Berichtsheft-Daten gemäß BBiG-Aufbewahrung; sonstige Lerndaten bis Konto-Löschung; aggregierte Statistiken bleiben anonymisiert erhalten |
| **TOMs** | Siehe `docs/datenschutz/TOMs.md` |

## A.3 Kommunikation (Chat, Forum, Benachrichtigungen)

| Feld | Inhalt |
|---|---|
| **Bezeichnung** | In-App-Kommunikation und Benachrichtigungen |
| **Zweck** | Kommunikation zwischen Auszubildenden, Ausbildern und Administratoren innerhalb einer Organisation |
| **Rechtsgrundlage** | Art. 6 Abs. 1 lit. b DSGVO (Vertragsdurchführung); Art. 6 Abs. 1 lit. a DSGVO (Einwilligung für Push-Benachrichtigungen) |
| **Kategorien betroffener Personen** | Auszubildende, Ausbilder, Administratoren |
| **Kategorien personenbezogener Daten** | Chat-Nachrichten, Forum-Beiträge, In-App-Benachrichtigungen, Push-Subscriptions (sofern aktiviert) |
| **Empfänger** | Innerhalb der App: andere Nutzer derselben Organisation (für Forum/Chat sichtbar); technisch: Hostinger (Hosting); bei Push-Aktivierung zusätzlich Google LLC / Apple Inc. / Mozilla Foundation (USA) — verschlüsselte Auslieferung mittels VAPID |
| **Drittlandtransfer** | **Ja**, ausschließlich bei Aktivierung von Push-Benachrichtigungen durch den Nutzer (Drittland-Transfer in die USA) |
| **Garantien für Drittlandtransfer** | Art. 49 Abs. 1 lit. a DSGVO (ausdrückliche Einwilligung des Nutzers); Inhalte werden mit VAPID Ende-zu-Ende verschlüsselt |
| **Löschfristen** | Chat- und Forum-Beiträge: bis Löschung durch Nutzer/Admin oder Konto-Soft-Deletion (Forum-Beiträge bleiben für die Diskussionsintegrität erhalten); Push-Subscriptions: bis Widerruf der Einwilligung oder Geräte-Wechsel |
| **TOMs** | Siehe `docs/datenschutz/TOMs.md` |

## A.4 Sicherheit, Audit und Missbrauchserkennung

| Feld | Inhalt |
|---|---|
| **Bezeichnung** | Sicherheits- und Audit-Logging |
| **Zweck** | Protokollierung sicherheitsrelevanter Aktionen, Nachvollziehbarkeit administrativer Vorgänge, Missbrauchserkennung, Sicherstellung der Integrität der Anwendung |
| **Rechtsgrundlage** | Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse: IT-Sicherheit, Missbrauchserkennung, Nachweispflichten) |
| **Kategorien betroffener Personen** | Alle Nutzer (Azubis, Ausbilder, Administratoren) |
| **Kategorien personenbezogener Daten** | Login-Zeitpunkte, IP-Adressen, User-Agent, Aktion-Typ (Login, Logout, Passwortänderung, Rollenänderung, Account-Genehmigung, 2FA-Aktivierung etc.), Audit-Log-Metadaten |
| **Empfänger** | Administratoren der jeweiligen Organisation; technisch Hostinger (Hosting) |
| **Drittlandtransfer** | Nein |
| **Löschfristen** | **Bis zu 3 Jahre** (berechtigtes Interesse Sicherheit); danach automatische Löschung oder Anonymisierung |
| **TOMs** | Siehe `docs/datenschutz/TOMs.md` |

## A.5 Inaktivitätsroutine und Account-Lebenszyklus

| Feld | Inhalt |
|---|---|
| **Bezeichnung** | Automatisierte Inaktivitäts-Erkennung und Konto-Deaktivierung |
| **Zweck** | Datensparsamkeit (Art. 5 Abs. 1 lit. e DSGVO) — automatische Entfernung inaktiver Nutzerkonten |
| **Rechtsgrundlage** | Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse: Datensparsamkeit, Speicherbegrenzung) |
| **Kategorien betroffener Personen** | Inaktive Nutzer |
| **Kategorien personenbezogener Daten** | Letzter Login-Zeitpunkt, E-Mail-Adresse (für Warn-E-Mail) |
| **Empfänger** | Hostinger (Hosting, Mailversand) |
| **Drittlandtransfer** | Nein |
| **Verarbeitungslogik** | Nach 22 Monaten Inaktivität: Warn-E-Mail. Nach 24 Monaten Inaktivität: automatische Soft-Deletion des Kontos. Cron-Job täglich um 03:00 UTC. |
| **Löschfristen** | Soft-Deletion nach 24 Monaten; verknüpfte Inhalte gemäß deren eigenen Aufbewahrungsfristen |
| **TOMs** | Siehe `docs/datenschutz/TOMs.md` |

## A.6 Eltern-/Sorgerechts-Einwilligung bei Minderjährigen (Art. 8 DSGVO)

| Feld | Inhalt |
|---|---|
| **Bezeichnung** | Verifikation der elterlichen Einwilligung für Nutzer unter 16 Jahren |
| **Zweck** | Erfüllung der Einwilligungsanforderung gemäß Art. 8 DSGVO bei Minderjährigen unter 16 Jahren |
| **Rechtsgrundlage** | Art. 8 DSGVO i.V.m. Art. 6 Abs. 1 lit. a DSGVO; Art. 6 Abs. 1 lit. c DSGVO (rechtliche Pflicht zur Altersprüfung) |
| **Kategorien betroffener Personen** | Auszubildende unter 16 Jahren und deren Sorgeberechtigte |
| **Kategorien personenbezogener Daten** | Geburtsdatum (optional; verwendet zur Altersprüfung sowie — sofern der Nutzer das Schwimm-Trainingsmodul aktiv verwendet — zur Berechnung eines altersbedingten Zeitbonus), Status der elterlichen Einwilligung (`NOT_REQUIRED`, `PENDING`, `VERIFIED`, `REJECTED`), Vermerk zur Verifikation, ID des verifizierenden Administrators, Verifikations-Zeitpunkt |
| **Empfänger** | Administratoren der zuordnenden Organisation; technisch Hostinger (Hosting) |
| **Drittlandtransfer** | Nein |
| **Löschfristen** | Bei Vollendung des 16. Lebensjahres oder Konto-Löschung: Status auf `NOT_REQUIRED` gesetzt, Verifikationsvermerk bleibt für Nachweispflichten erhalten |
| **TOMs** | Siehe `docs/datenschutz/TOMs.md` |

---

# Teil B — Verarbeitungen als Auftragsverarbeiter (Art. 30 Abs. 2 DSGVO)

Bei Nutzung der Plattform durch Ausbildungsbetriebe (B2B) ist der jeweilige Betrieb **Verantwortlicher** im Sinne der DSGVO; der Betreiber dieser Plattform ist **Auftragsverarbeiter** nach Art. 28 DSGVO. Folgende Verarbeitungen werden im Auftrag durchgeführt:

## B.1 Verwaltung der Konten und Lerndaten der Azubis und Ausbilder eines Ausbildungsbetriebs

| Feld | Inhalt |
|---|---|
| **Bezeichnung** | App-Betrieb im Auftrag des jeweiligen Ausbildungsbetriebs |
| **Verantwortlicher** | Der jeweilige Ausbildungsbetrieb (siehe Anlage zum AVV) |
| **Auftragsverarbeiter** | Dennie Gulbinski (Betreiber der Bäder-Azubi App) |
| **Zwecke** | Bereitstellung der App, Verwaltung von Konten, Lernfortschritt, Quiz, Berichtsheft, Klausuren, Kommunikation, Sicherheit gemäß Art. 28 Abs. 3 DSGVO |
| **Kategorien betroffener Personen** | Auszubildende, Ausbilder/Trainer, Administratoren des Verantwortlichen |
| **Kategorien personenbezogener Daten** | Kontodaten, Organisationsdaten, Lern- und Ausbildungsdaten, Kommunikationsdaten, technische Daten, Audit-Logs |
| **Empfänger** | Hostinger International Ltd. (Hosting) als Unter-Auftragsverarbeiter; bei Push-Aktivierung Google/Apple/Mozilla — verschlüsselte Inhalte |
| **Drittlandtransfer** | Nur bei Push-Aktivierung durch Nutzer (USA, Art. 49 Abs. 1 lit. a DSGVO) |
| **Löschfristen** | Gemäß § 6 AVV und Weisung des Verantwortlichen |
| **TOMs** | Siehe `docs/datenschutz/TOMs.md` (Anlage 1 zum AVV) |
| **AVV** | Mit jedem Verantwortlichen vor Inbetriebnahme abgeschlossen (`docs/datenschutz/AVV-Vorlage.md`) |

---

# Allgemeine Angaben

## Verantwortlicher

**Dennie Gulbinski**
Zeitstraße 108
53721 Siegburg
E-Mail: kontakt@smartbaden.de

## Datenschutzkontakt

**Dennie Gulbinski** (Verantwortlicher mit datenschutzrechtlicher Fachkunde)
Zeitstraße 108, 53721 Siegburg
E-Mail: kontakt@smartbaden.de (Betreff: „Datenschutz")

Der Verantwortliche verfügt über eine datenschutzrechtliche Weiterbildung, unter anderem im Bereich Datenschutzbeauftragter, und bearbeitet Datenschutzanfragen intern fachkundig. Eine formelle Benennung als Datenschutzbeauftragter im Sinne von Art. 37 DSGVO besteht derzeit nicht. Die Erforderlichkeit einer Benennung wird regelmäßig anhand der Schwellenwerte nach § 38 BDSG sowie der Frage geprüft, ob eine Verarbeitung vorliegt, die eine Datenschutz-Folgenabschätzung nach Art. 35 DSGVO erforderlich macht. Bei Bedarf wird ein externer Datenschutzbeauftragter eingebunden.

## Zuständige Aufsichtsbehörde

**Landesbeauftragte für Datenschutz und Informationsfreiheit Nordrhein-Westfalen (LDI NRW)**
Kavalleriestraße 2-4
40213 Düsseldorf
Telefon: 0211 / 38424-0
E-Mail: poststelle@ldi.nrw.de
Web: https://www.ldi.nrw.de

## Verzeichnis-Verwaltung

Dieses Verzeichnis wird zentral durch den Verantwortlichen geführt und bei wesentlichen Änderungen der Verarbeitungstätigkeiten oder der eingesetzten Auftragsverarbeiter aktualisiert. Versionierung über das Git-Repository des Projekts.

| Datum | Änderung | Autor |
|-------|----------|-------|
| 26.04.2026 | Initialfassung | Dennie Gulbinski |
| 03.05.2026 | DSB-Bestellung formell dokumentiert; Verzahnung mit § 26 BDSG bei B2B-Nutzung präzisiert | Dennie Gulbinski |
| 03.05.2026 (rev. 2) | DSB-Konzept zurückgenommen: nicht formell bestellt, sondern Datenschutzkontakt mit Weiterbildung zum DSB. Externer DSB bei Bedarf | Dennie Gulbinski |
| 03.05.2026 (rev. 3) | „Volljährigkeit"-Begriff durch „Vollendung des 16. Lebensjahres" ersetzt; Geburtsdatum-Zweck (Schwimm-Handicap) transparent ergänzt; Datenschutzkontakt-Beschreibung an Datenschutzerklärung rev. 3 angeglichen | Dennie Gulbinski |

---

*Dieses VVT ist ein internes Pflichtdokument gemäß Art. 30 DSGVO. Es muss der Aufsichtsbehörde auf Anfrage zur Verfügung gestellt werden (Art. 30 Abs. 4 DSGVO), ist aber nicht für die Veröffentlichung gegenüber Endnutzern bestimmt.*
