# PDF-Versionen der Compliance-Dokumente

Diese PDFs werden aus den Markdown-Quellen in `docs/datenschutz/` automatisiert erzeugt und sind die **versandfertige Form** für Pilotkunden, Datenschutzbeauftragte und Vergabeprüfer.

| Datei | Quelle | Zweck |
|---|---|---|
| `AGB-B2B.pdf` | `../AGB-B2B.md` | Allgemeine Geschäftsbedingungen B2B |
| `AVV-Vorlage.pdf` | `../AVV-Vorlage.md` | Auftragsverarbeitungsvertrag (Art. 28 DSGVO) |
| `TOMs.pdf` | `../TOMs.md` | Technische und organisatorische Maßnahmen (Anlage 1 zum AVV) |
| `VVT.pdf` | `../VVT.md` | Verzeichnis von Verarbeitungstätigkeiten (Art. 30 DSGVO, intern) |

## Bei Markdown-Updates: PDFs neu erzeugen

Skript liegt unter `C:\Users\User\tmp-scripts\md-to-pdf-puppeteer.js`. Aufruf pro Datei:

```bash
cd /c/Users/User/tmp-scripts
node md-to-pdf-puppeteer.js \
  "/c/Users/User/baeder-azubi-app/docs/datenschutz/AGB-B2B.md" \
  "/c/Users/User/baeder-azubi-app/docs/datenschutz/pdf/AGB-B2B.pdf"
```

Oder alle vier auf einmal:

```bash
cd /c/Users/User/tmp-scripts
for f in AGB-B2B AVV-Vorlage TOMs VVT; do
  node md-to-pdf-puppeteer.js \
    "/c/Users/User/baeder-azubi-app/docs/datenschutz/$f.md" \
    "/c/Users/User/baeder-azubi-app/docs/datenschutz/pdf/$f.pdf"
done
```

**Voraussetzungen:**
- Node.js (lokal vorhanden)
- Puppeteer + marked installiert in `tmp-scripts/`
- Bündelt eigene Chromium-Version, kein System-Browser nötig
