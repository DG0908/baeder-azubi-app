# Übergabe-Briefing für den neuen Chat: smartbaden-Webseite

> Diese Datei in den neuen Chat einbinden (Datei zeigen oder Inhalt einfügen),
> damit Claude direkt den vollen Kontext hat.

---

## Wer du bist (Kurzfassung)

- **Name:** Dennie Gulbinski
- **Adresse:** Zeitstraße 108, 53721 Siegburg
- **E-Mail:** kontakt@smartbaden.de (über Cloudflare → Gmail, siehe unten)
- **Qualifikation:** Meister Bäderbetriebe + Bäderbetriebsmanager + ausgebildeter Datenschutzbeauftragter (DSB), 20 Jahre Berufserfahrung
- **Status:** Kleinunternehmer nach § 19 UStG (Steuernummer folgt nach Gewerbeanmeldung)
- **Sprache:** Deutsch in allen Aktionen, Texten, Antworten

## Marke smartbaden — Doppelregel Schreibweise

- **Im Fließtext:** `smartbaden` — durchgängig kleingeschrieben, ein Wort
- **Im Logo / Banner / Hero:** `SMARTBADEN` — Versalien, „SMART" weiß/dunkel, „BADEN" cyan
- Vergleichbar mit IBM oder dm — Logo darf vom Fließtext abweichen, beides konsistent halten

**Tagline (Hauptaussage):** „Digitale Lösungen für moderne Schwimmbäder"
**Tagline (USP-Variante):** „Praktiker entwickelt für Praktiker. 20 Jahre Bädererfahrung, ausgebildeter DSB, kommunaltauglich."

## Marken-Werte (priorisiert)

1. **Praxisnähe** — Praktiker für Praktiker, aus dem Bäderalltag heraus
2. **Datenschutz** — DSGVO als Architektur, nicht als Aufkleber
3. **Kommunaltauglich** — versteht öffentliche Träger, Vergaberecht, Kameralistik

## Marken-Farben

| Farbe | Hex | Verwendung |
|---|---|---|
| Cyan | `#06b6d4` | Logo-Symbol, Akzente |
| Türkis | `#0891b2` | Übergänge, Gradients |
| Marineblau | `#0c4a6e` | Wortmarke auf hell |
| Dunkelblau | `#0f172a` | Hintergrund dunkle Variante |
| Hellgrau | `#f1f5f9` | Hintergrund helle Variante |

**Hero-Gradient (identisch zur App):**
```css
background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 25%, #0891b2 50%, #0e7490 75%, #155e75 100%);
```

## Banner-Varianten (existieren bereits als KI-generierte PNG)

- **Dunkle Variante** (Hauptidentität, Marketing) — Schwimmbad-Atmosphäre, Logo rechts versetzt, Wasser-Wellen-Effekt
- **Helle Variante** (Dokumenten-Identität, Druck, Behörden) — weißer Hintergrund, dunkelblaues Logo

## Tonalität

- **B2B-Kontakt:** Sie-Form, klar und kurz, keine Werbe-Floskeln, selbstbewusst-nicht-arrogant
- **Persönliche Sektion:** Ich-Form („Ich, Dennie, …"), authentisch, nicht corporate

---

## Drei Standbeine der Marke

| Bereich | Status |
|---|---|
| **Bäder-Azubi-App** | Marktreif, Hauptprodukt, läuft auf `azubi.smartbaden.de` |
| **InfoCenter (lokaler Chatbot)** | Nahezu fertig, lokal mit Schlagwörtern und Tabs für den Kassenbereich |
| **Datenschutz-Dienstleistungen** | Verfügbar (DSFA, AVV, Beratung Videoüberwachung) |

---

## Bestehender Webseiten-Plan

Im Repo `baeder-azubi-app` unter `docs/marketing/`:

- **`website-konzept.md`** — komplettes Sektions-Konzept (Hero, Portfolio, Warum smartbaden, Sicher gebaut, Detail-Sektionen, Über mich, Kontakt, FAQ, Footer) mit fertigen Texten zum Copy-Paste
- **`markenrichtlinie.md`** — verbindliche Marken-Regeln in 9 Sektionen
- **Beide Dokumente werden als Quelle für die neue Webseite genutzt**

---

## Tech-Stack-Empfehlung für die neue Webseite

- **Framework:** Astro (statisch, super schnell, SEO-optimal)
- **Styling:** Tailwind CSS (gleicher Stil wie App)
- **Deployment:** Hostinger Node.js-Webanwendung mit GitHub-Auto-Deploy
- **Domain:** smartbaden.de (DNS bei Cloudflare)

---

## E-Mail-Setup (in Arbeit)

- **Domain:** smartbaden.de
- **DNS:** Cloudflare (kostenlos)
- **Email Routing:** Cloudflare → leitet kontakt@smartbaden.de an private Gmail-Adresse
- **SMTP zum Senden:** Brevo (kostenlos bis 300 Mails/Tag), eingebunden in Gmail „Senden als"
- **Resultat:** kontakt@smartbaden.de empfängt und sendet beides über Gmail-Oberfläche, voll professioneller Auftritt, alles kostenlos

## Compliance-Stand (alles im baeder-azubi-app Repo)

- ✅ Datenschutzerklärung B2B-/Kommunal-tauglich (`src/components/legal/LegalContent.jsx`)
- ✅ AGB B2B (`docs/datenschutz/AGB-B2B.md` + PDF)
- ✅ AVV-Vorlage (`docs/datenschutz/AVV-Vorlage.md` + PDF)
- ✅ TOMs (`docs/datenschutz/TOMs.md` + PDF)
- ✅ VVT (`docs/datenschutz/VVT.md` + PDF)
- ✅ AGB-Akzeptanz bei Registrierung (App)
- ⚠️ Steuernummer im Impressum (folgt nach Gewerbeanmeldung)
- ⚠️ DPMA-Markenanmeldung (vor erstem zahlendem Kunden)
- ⚠️ Berufshaftpflicht IT (vor erstem Pilotkunden)

---

## Workflow-Regeln (wichtig für jeden Commit)

1. **Lint vor Commit:** `npm run lint` — bei Errors fixen, nicht ignorieren
2. **Direkt auf main pushen:** Pre-Launch-Regel, kein PR-Workflow
3. **Nach Commit immer pushen:** läuft nicht automatisch
4. **FAB ist die korrekte Abkürzung:** nicht FABB oder FaBB, vermeiden in allen Texten
5. **Backend nie pushen:** Memory-Regel aus dem Hauptprojekt — gilt hier nicht direkt, da reine Marketing-Webseite, aber Datentrennung beachten

---

## Deine Aufgabe für den neuen Chat

Setze die Webseite `smartbaden.de` neu auf:

1. **Astro-Projekt** initialisieren mit Tailwind
2. **Sektionen** aus `docs/marketing/website-konzept.md` umsetzen (Hero, Portfolio, Warum smartbaden, Sicher gebaut, Detail-Sektionen, Über mich, Kontakt, FAQ, Footer)
3. **Banner-Bilder** integrieren (User legt unter `public/` ab)
4. **Verlinkung zur App** (azubi.smartbaden.de) im Hero und Portfolio
5. **Footer-Links** zu Impressum, Datenschutz, AGB-Download
6. **GitHub-Repo** erstellen und pushen
7. **Hostinger-Deployment** über GitHub-Auto-Deploy
8. **DNS-Cutover** über Cloudflare

Nicht vergessen: Memory wird im neuen Projekt-Ordner neu aufgesetzt. Diese Datei ersetzt das initiale Briefing.

---

*Stand der Übergabe: 26.04.2026*
*Bei Fragen zum vorhergehenden Kontext: alles Relevante steht in den Memory-Files unter `C:\Users\User\.claude\projects\c--Users-User-baeder-azubi-app\memory\` — die wichtigsten Punkte sind in dieser Datei zusammengefasst.*
