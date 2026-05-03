# Hilfe-PDF

Hier liegt die Spielanleitung als PDF, damit sie aus der App per Link erreichbar ist.

**Erwartete Datei:** `spielanleitung.pdf`

**Aufgerufen von:** AppHeader (?-Icon), DesktopSidebar (unten), MobileNav (Mehr-Drawer) — jeweils via `/hilfe/spielanleitung.pdf` in neuem Tab.

## PDF aus der Quelle erzeugen

Die Quelle liegt unter `docs/hilfe/spielanleitung.md`. Konvertierungs-Optionen:

### Variante 1 — Browser (am einfachsten)
1. Markdown in einem beliebigen Viewer öffnen (z. B. VS-Code-Preview, Typora, oder ein Markdown-zu-HTML-Tool).
2. Auf „Drucken" → „Als PDF speichern".
3. PDF unter diesem Namen hier ablegen: `public/hilfe/spielanleitung.pdf`.

### Variante 2 — Pandoc (CLI)
```
pandoc docs/hilfe/spielanleitung.md -o public/hilfe/spielanleitung.pdf --pdf-engine=xelatex -V mainfont="Arial" -V geometry:margin=2cm
```

## Versionierung
Bei größeren Änderungen am Inhalt: alten Dateinamen behalten und Datum/Version intern im PDF aktualisieren — der PWA-Cache holt die neue Datei beim nächsten Update automatisch. Nur wenn du sicher gehen willst, dass alle User sofort die neue Version sehen, im Dateinamen versionieren (`spielanleitung-v2.pdf`) und die drei Links in `AppHeader`, `DesktopSidebar`, `MobileNav` mitziehen.
