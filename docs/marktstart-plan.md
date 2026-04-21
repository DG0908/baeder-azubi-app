# Marktstart-Plan — Bäder-Azubi-App

> **Zweck:** Vom aktuellen Stand (produktiv für ~12 Azubis, Phase 2 der Marktreife-Roadmap abgeschlossen) zu einem bundesweiten Marktstart — ohne schlechtes Gewissen — und anschließendem kontrollierten Wachstum.
>
> **Abgrenzung zu [marktreife-roadmap.md](marktreife-roadmap.md):** Die Marktreife-Roadmap adressiert Code-/Technik-Schuld. Dieses Dokument adressiert *Go-to-Market*: Betrieb, Recht, Vertrieb, Finanzen, Skalierung.
>
> **Schreibweise:** Jede Phase hat ein **Gate** (messbar, binär). Keine nächste Phase ohne erfülltes Gate der vorherigen.
>
> **Stand:** 2026-04-21 — **Phase A läuft.**

---

## Phase A — Launch-Gate (6–8 Wochen vor Ersteinnahme)

**Ziel:** Keine offene Baustelle, die einem ersten zahlenden Betrieb wehtun könnte.

### A.1 Betriebs-Hygiene (zwingend vor Launch)

| # | Aufgabe | Kritikalität | Zeit | Status |
|---|---|---|---|---|
| A.1.1 | **SMTP produktiv** — Brevo/Mailgun, Domain-DKIM+SPF+DMARC, Bounce-Handling. Einladungs-Mail muss im Posteingang landen, nicht im Spam. | Blocker | 0.5 d | [ ] |
| A.1.2 | **Restore-Drill** — vollständiger DB-Restore auf Staging aus Prod-Backup. Beweis, dass Backups lauffähig sind. Zeit-Stopwatch → RTO dokumentieren. | Blocker | 0.5 d | [ ] |
| A.1.3 | **npm audit fix** — lodash + picomatch (high severity, seit 2026-04-16 offen), Backend-Deploy. | Blocker | 0.5 d | [ ] |
| A.1.4 | **Uptime-Monitoring extern** — UptimeRobot o. ä. alle 60 s gegen `/api/health` + Frontend. Alarm an Handy bei 2 Ausfällen in Serie. | Blocker | 0.5 d | [ ] |
| A.1.5 | **Infra-Monitoring** — Disk-/RAM-Alarme auf VPS (Netdata oder Coolify-built-in), Cert-Expiry-Watch. | Hoch | 0.5 d | [ ] |
| A.1.6 | **Incident-Response-Runbook** — Ein-Seiten-Dokument: „Wenn X down → prüfe Y → Kontakt Z". Papier, nicht Wiki. | Hoch | 0.5 d | [ ] |
| A.1.7 | **Backup-Verifikation automatisiert** — täglicher Cron testet Backup-Integrität (z. B. `pg_restore --list` + Zeilen-Count einer Referenz-Tabelle). Alarm bei Abweichung. | Hoch | 0.5 d | [ ] |

**Gate A.1:** Restore erfolgreich demonstriert, erste Spam-freie Mail aus Prod-SMTP an externe Adresse, Uptime-Alarm bewusst ausgelöst und zugestellt.

### A.2 Recht, Finanzen, Vertragsgrundlage

| # | Aufgabe | Kritikalität | Zeit | Status |
|---|---|---|---|---|
| A.2.1 | **Unternehmensform entschieden** — Kleinunternehmer (§19 UStG, ≤22 k€/Jahr) vs. UG/GmbH. Empfehlung: bei B2B-Kunden direkt UG gründen (Rechnungen mit USt., Haftungsbegrenzung, professionelles Auftreten). | Blocker | Mensch | [ ] |
| A.2.2 | **Impressum auf Firma** — nicht mehr Privatadresse, sondern Geschäftsadresse. Postfach oder Co-Working-Anschrift zulässig. | Blocker | Mensch | [ ] |
| A.2.3 | **AGB + SaaS-Vertrag** — als Text-Vorlage an Fachanwalt. Mindestens: Verfügbarkeits-SLA (z. B. 99 %/Monat), Kündigungsfristen, Preisanpassung, Haftung, Datenhoheit beim Kunden. | Blocker | Anwalt, 1 k€ | [ ] |
| A.2.4 | **AV-Vertrag (DSGVO Art. 28) als Download** — Ausbildungsbetriebe brauchen einen AVV von dir. Template online (activeMind AG, datenschutz.org) anpassen, im Admin-Portal als Download. | Blocker | 1 d + Anwalt-Review | [ ] |
| A.2.5 | **AV-Verträge mit Subprozessoren gesammelt** — Hetzner/VPS-Anbieter, Coolify (falls extern), Sentry, SMTP-Provider, Stripe. Als PDF-Ordner, bei AVV-Anfrage versendbar. | Hoch | 0.5 d | [ ] |
| A.2.6 | **Cyber-Haftpflicht-Versicherung** — Hiscox Cyber, Alte Leipziger o. ä. ca. 600–1500 €/Jahr. Deckt DSGVO-Bußgelder (soweit versicherbar), Datenleck-Response. | Hoch | Mensch, 1 Tag Research | [ ] |
| A.2.7 | **Stripe-Account verifiziert** — Geschäftskonto, Steuer-ID, SEPA + Kreditkarte, Tax-Automation aktiviert (EU-USt.-Handling). | Blocker | 1 d | [ ] |

**Gate A.2:** AVV ist vom eigenen Anwalt oder externen Datenschutzberater freigegeben. AGB unterschriftsreif. Stripe-Test-Zahlung erfolgreich inklusive USt.-korrekter Rechnung.

### A.3 Produkt-Feintuning

| # | Aufgabe | Kritikalität | Zeit | Status |
|---|---|---|---|---|
| A.3.1 | **Tenant-Onboarding-Flow** — Self-Service (Betrieb meldet sich, Admin legt Azubis an) vs. Assisted (du hilfst manuell bei Erst-Einrichtung). Entscheidung: erste 20 Kunden **Assisted**, dann Self-Service nach Learnings. | Blocker | 2 d | [ ] |
| A.3.2 | **Billing-UI** — Plan-Auswahl, Seats, Zahlungsmethode, Rechnungshistorie, Kündigung. Stripe-Billing-Portal nutzen, nicht selbst bauen. | Blocker | 2 d | [ ] |
| A.3.3 | **Preisplan festgelegt** — Empfehlung: Pro-Azubi-Modell (z. B. 9 €/Azubi/Monat, Mindestvertragslaufzeit 12 Monate, Ausbildungsbetriebe mit ≤3 Azubis = 29 €/Monat pauschal). Alternativ pauschal 99 €/Betrieb/Monat. | Blocker | Mensch + Markt-Validierung | [ ] |
| A.3.4 | **Frontend-Tests ≥30 % auf kritischen Flows** — Login, Berichtsheft-Speichern, Monatsbericht-Zuweisen, Duel-Start, Admin-User-Anlegen. Vitest + Playwright. | Hoch | 3 d | [ ] |
| A.3.5 | **Fachliche Gegenlese Fragenkatalog (P4.7)** — Meister Bäderbetriebe reviewt Quiz-Fragen. Bezahlt (200–500 € Honorar), dokumentiert, mit Datum signiert. Marketing-Argument. | Hoch | extern, 1–2 Wochen | [ ] |
| A.3.6 | **Status-Page** — status.smartbaden.de (o. ä.) mit automatischem Heartbeat. Instatus/Statuspage.io (20 €/Monat) oder self-hosted Uptime-Kuma. | Mittel | 0.5 d | [ ] |
| A.3.7 | **Feature-Flags für Risiko-Features** — Duel-Matchmaking, Push, Monthly-Reports können per Admin-Toggle aus. Notfall-Rollback ohne Deploy. | Mittel | 0.5 d | [x] (useFeature vorhanden, Adoption prüfen) |
| A.3.8 | **Datenexport pro Tenant** — Ausbildungsbetrieb muss auf Knopfdruck alle seine Daten (JSON/PDF) ziehen können. DSGVO Art. 20. Backend existiert für User-Export, Tenant-Export noch offen. | Hoch | 1 d | [ ] |

**Gate A.3:** Ein Test-Betrieb (nicht der eigene Heimbetrieb, sondern ein *anderer*) durchläuft End-to-End: Onboarding → Azubis anlegen → Berichtsheft nutzen → bezahlen → kündigen → Daten exportieren. Ohne Bug, ohne manuellen Eingriff.

---

## Phase B — Soft-Launch (Launch-Woche + 2 Wochen Beobachtung)

**Ziel:** 3–5 zahlende Pilot-Betriebe. Kein Presse-Launch. Du *willst* Lücken finden, bevor 50 Betriebe sie finden.

### B.1 Akquise

- **5–10 warme Leads aus deinem Netzwerk** (du bist selbst in der Branche — Ausbilder, Meister-Kollegen, frühere Arbeitgeber).
- **Kein Inbound-Marketing**, keine LinkedIn-Ads, keine Pressemitteilung. Alles nur manuell, persönlich.
- **Pilot-Konditionen:** 50 % Rabatt auf das erste Jahr im Tausch gegen dokumentiertes Feedback + Logo-Erlaubnis (Referenz für später).

### B.2 Betriebs-Disziplin

- **On-Call-Bereitschaft** — du bist in den ersten 14 Tagen unter einer Nummer erreichbar. Nicht 24/7, aber werktags 8–20 Uhr mit ≤2 h Response-Zeit.
- **Täglicher Sentry-Check** — jeden Morgen, erster Handgriff. Error-Budget-Tracking (5 Errors/Tag okay, darüber Eskalation).
- **Wöchentliche Pilot-Calls** — 20 min mit jedem Pilot-Betrieb. „Was hat gestört? Was fehlt? Was war überraschend gut?" — handschriftliche Notizen, nicht CRM.
- **Feature-Freeze** — keine neuen großen Features während Phase B. Nur Bugfixes und UX-Glättungen aus Pilot-Feedback.

### B.3 Kommunikation

- **Changelog öffentlich** (CHANGELOG.md existiert, GitHub-Pages oder Notion-Publish). Jeder Deploy wird dokumentiert.
- **Transparenz bei Ausfällen** — Status-Page + Mail an betroffene Kunden innerhalb 30 min. Lieber öfter kommunizieren als verstecken.

**Gate B:** 3 Pilot-Betriebe zahlen, erneuern nach 4 Wochen ohne Nachlass, geben ihr Logo für Website frei. Sentry: keine unadressierten Errors >24 h alt. Uptime ≥99 %.

---

## Phase C — Kontrolliertes Wachstum (Monat 2–6)

**Ziel:** 20–30 zahlende Betriebe. Self-Service funktioniert. Du bist nicht mehr der Bottleneck für Onboarding.

### C.1 Vertriebs-Maschine

| # | Aufgabe | Zeit | Abhängigkeit |
|---|---|---|---|
| C.1.1 | **Landing-Page mit Case Study** — ein Pilot-Betrieb als Referenz, Zitat Ausbilder, konkrete Zahlen („90 % der Berichtshefte pünktlich"). | 3 d | B abgeschlossen |
| C.1.2 | **SEO-Grundlagen** — Blog-Artikel „Ausbildung Fachangestellter für Bäderbetriebe: Digital dokumentieren", 5–10 Artikel über 3 Monate. Long-Tail-Keywords. | 0.5 d/Artikel | Laufend |
| C.1.3 | **LinkedIn-Präsenz** als Gründer — 2 Posts/Woche über die Branche, nicht über die App. Netzwerkaufbau. | 30 min/Post | Laufend |
| C.1.4 | **Direktansprache über DLRG / BVB** (Berufsverband Bäderbetriebe) — Fachtagungen, Kontakt zu Meister-Ausbildern. Die können 5–20 Betriebe auf einmal empfehlen. | 2 Tagungen/Jahr | Physisch, reise |
| C.1.5 | **Pricing-Page mit Self-Service-Signup** — ohne Sales-Call kaufbar, ab €29/Monat einfacher Plan. | 2 d | A.3.2 |
| C.1.6 | **Onboarding-Automatisierung** — Welcome-Mail-Serie (3 Mails), In-App-Tour (z. B. `react-joyride`), Beispiel-Daten optional. | 3 d | Pilot-Learnings aus B |

### C.2 Skalierungs-Vorbereitung

| # | Aufgabe | Trigger | Zeit |
|---|---|---|---|
| C.2.1 | **Redis-Throttler (P3.7)** — von in-memory auf Redis umstellen. Pflicht vor Multi-Replica. | ab 20 Betrieben / 200 DAU | 0.5 d |
| C.2.2 | **Backend Multi-Replica** — zweite Instanz hinter Traefik/Nginx. Session-Sticky nicht nötig (JWT-basiert). | ab 500 DAU | 1 d |
| C.2.3 | **DB-Query-Monitoring** — Prisma-Query-Logger in Prod (mit Sampling), langsame Queries (>100 ms) in Sentry. | sofort nach B | 0.5 d |
| C.2.4 | **Index-Audit** — `pg_stat_statements` auswerten, fehlende Indices auf häufigen Filter-Feldern ergänzen. Besonders: Berichtsheft-Queries nach azubiId+week, Duel-Matchmaking, AuditLog. | ab 1000 Datensätzen pro Tabelle | 1 d |
| C.2.5 | **CDN für statische Assets** — Cloudflare vor Coolify, 50 GB gratis. | ab 100 DAU | 0.5 d |
| C.2.6 | **Load-Test** — k6 oder Artillery gegen Staging: 100/500/1000 gleichzeitige Login-Requests. Findet Race-Conditions und Connection-Pool-Limits. | vor C.2.2 | 1 d |
| C.2.7 | **Datenbank-Off-Site-Backup** — täglicher `pg_dump` nach S3/Hetzner-Storage-Box in anderer Region. 30 Tage Retention. | sofort nach B | 0.5 d |

### C.3 Produkt-Entwicklung aus Pilot-Feedback

- **Support-Ticket-Cluster analysieren** — die 3 häufigsten Bug/Wunsch-Themen werden priorisiert. Rest ins Backlog.
- **dataService.js-Extraktion opportunistisch fortsetzen** — bei jeder Berichtsheft-/Quiz-/Duel-Berührung. Ziel bis Ende Phase C: ≤800 Zeilen.
- **TypeScript-Migration verbleibender Views** — BerichtsheftView, ProfileView, HomeView, AdminView. Erhöht Wartbarkeit für dich + spätere Team-Mitglieder.
- **Backend-Test-Coverage** auf 80 % aller Service-Module (fehlend: app-config, feature-rollout, swim-*, monthly-reports, badges, invitations).

**Gate C:** 20 zahlende Betriebe ohne Sales-Call onboardet. Durchschnittliche Support-Ticket-Zeit <4 h werktags. Monatliches MRR ≥ 600 € (= 20 × 30 € Minimum).

---

## Phase D — Skalierung & Team (Monat 6–12)

**Ziel:** 100+ zahlende Betriebe. Erste externe Hilfe. Du arbeitest *am* Produkt, nicht nur *im* Produkt.

### D.1 Enterprise-Features (auf Nachfrage, nicht präventiv)

- **SSO für größere Träger** — SAML oder OIDC. Erst bei konkreter Kundenanfrage (meist kommunale Bäder-Betriebe).
- **White-Label-Option** — Logo, Primärfarbe, Domain-Alias. Wer das will, zahlt Enterprise-Plan.
- **Data-Export-API** — Nicht UI-gebunden. REST oder Webhooks für Kunden, die in ihr eigenes LMS ziehen wollen.
- **Audit-Log-Export für Compliance** — PDF-Export pro Tenant, SHA-256-signiert (existiert im Backend → nur UI + Endpoint).

### D.2 Team-Aufbau

- **Triage:** Was kostet dich am meisten Zeit? Support, Entwicklung, Vertrieb? Den größten Block als ersten Hire.
- **Typische Reihenfolge:**
  1. **Werkstudent / Freelance-Support** (ab 30 Kunden) — beantwortet Mails, schult Admins, eskaliert technisches.
  2. **Zweiter Entwickler (Teilzeit)** (ab 50 Kunden / 3 k€ MRR) — fokus Frontend oder Backend, nie beides.
  3. **Vertrieb (Teilzeit, erfolgsbasiert)** (ab 80 Kunden) — wenn Inbound nicht reicht, aber nur mit gutem Produkt.
- **Dokumentation als Onboarding-Voraussetzung** — ein neuer Mitarbeiter muss in 2 Wochen produktiv sein. Setup-Guide, Deploy-Guide, Domain-Einführung.

### D.3 Finanz-Disziplin

- **Monats-Review**: MRR, Churn, CAC, LTV, Burn-Rate, Runway. Eine Tabelle, nicht mehr.
- **Ziel-LTV/CAC ≥3** bevor bezahltes Marketing skaliert wird.
- **Rücklage für 6 Monate Betrieb** auf Firmenkonto, bevor du Gehalt auszahlst.

**Gate D:** 100 zahlende Betriebe, MRR ≥5 k€, mindestens eine externe Person arbeitet regelmäßig mit, durchschnittlicher Churn ≤2 %/Monat.

---

## Quer-Prinzipien (gelten in allen Phasen)

1. **Keine Feature-Ankündigung, bevor gebaut ist.** Vaporware vernichtet Vertrauen.
2. **Keine Rabatte außer im Soft-Launch.** Wer für 50 % nicht kauft, kauft auch für 0 % nicht langfristig.
3. **Jedes Problem, das 3 Kunden melden, wird gelöst. Einzelfälle wandern ins Backlog.**
4. **Transparenz statt Hochglanz.** Public Changelog, öffentliche Status-Page, klare Grenzen in AGB. Lieber konservativ versprechen und übertreffen.
5. **Kein Launch in den Ferien.** Juli/August und Dezember sind tot in der Ausbildungsbranche. Ideal: Februar/März (Semester-Start) oder September (Ausbildungs-Jahrgang-Start).

---

## Risikoregister (monatlich prüfen)

| Risiko | Wahrscheinlichkeit | Impact | Mitigation |
|---|---|---|---|
| DSGVO-Bußgeld durch Datenleck | niedrig | existenziell | Cyber-Versicherung, AVV-Disziplin, Minimum-Datenhaltung |
| Einzel-VPS fällt aus (Hardware, Hoster-Outage) | niedrig | hoch | Phase-C.2.2 Multi-Replica, Off-Site-Backup, Status-Page |
| Burnout Solo-Gründer | mittel | hoch | Werkstudent-Hire bei 30 Kunden, On-Call klar limitiert, Urlaub im Kalender blocken |
| Großkunde springt ab, 20 % MRR weg | mittel | hoch | Kundensatz diversifiziert halten, kein Kunde >15 % MRR |
| Fachlicher Fehler in Quiz-Frage → Azubi fällt Prüfung | niedrig | reputationskritisch | P4.7 Gegenlese, Disclaimer „Keine Prüfungsvorbereitung als Garantie", Feedback-Kanal prominent |
| Wettbewerber (große EdTech) kopiert Feature | mittel | mittel | Branchen-Nähe als Burggraben (Meister-Netzwerk, Fach-Content), nicht Technik |
| Steuerschätzung, weil USt. zu spät gemeldet | niedrig | mittel | Steuerberater ab erster Rechnung, nicht „wenn Zeit ist" |

---

## Check-Rhythmus

- **Täglich (2 min):** Sentry-Check, Uptime-Status, eine Kunden-Mail.
- **Wöchentlich (30 min, Freitag):** Gate-Status aktualisieren, eine Risikozeile neu bewerten, Changelog-Eintrag.
- **Monatlich (2 h):** MRR/Churn-Tabelle, nächste Gate-Prio, Risikoregister, Rücklage-Check.
- **Quartalsweise (1 Tag):** Plan diesem Dokument gegenlesen, Phasenwechsel bewerten, strategische Entscheidungen (neues Feature, neuer Markt, Team).

---

*Autor: Dennie · Stand: 2026-04-21 · Abhängig von [marktreife-roadmap.md](marktreife-roadmap.md) Phase 2 ✓*
