import { useState } from 'react';
import { useApp } from '../../../context/AppContext';

// ─── Schilder-Lexikon ────────────────────────────────────────────────────────
// Normen: DIN EN ISO 7010 (Sicherheitszeichen), ASR A1.3 (Arbeitsstättenregel),
//         DGUV Vorschrift 1, DGUV Information 211-010, GefStoffV, BetrSichV
const SIGNS = [
  // VERBOTSSCHILDER — roter Kreis mit Querstrich · ASR A1.3 Abschnitt 4.1
  { id: 'v1', cat: 'verbot', emoji: '🚷', name: 'Zutritt verboten', norm: 'DIN EN ISO 7010 P001 · ASR A1.3', location: 'Technikräume, Chlorraum, Personalräume', meaning: 'Kein Zutritt für Unbefugte. Nur autorisiertes Personal darf diesen Bereich betreten — Gefährdung durch Anlagen oder Chemikalien.', action: 'Unbefugte ansprechen und herausbitten. Tür nach Betreten abschließen. DGUV Vorschrift 1 §4 verpflichtet zur Sicherung gefährlicher Bereiche.' },
  { id: 'v2', cat: 'verbot', emoji: '⬇️', name: 'Springen verboten', norm: 'DIN EN ISO 7010 P019 · ASR A1.3', location: 'Flachstellen, Nichtschwimmerbereiche, Rutschenende', meaning: 'Springen ins Wasser ist verboten — Verletzungsgefahr durch zu geringe Tiefe oder andere Badegäste.', action: 'Badegäste ansprechen. Bei Wiederholung Platzverweis. Tiefenangabe muss daneben angebracht sein.' },
  { id: 'v3', cat: 'verbot', emoji: '🤸', name: 'Kopfsprung verboten', norm: 'Hausordnung · DIN 19643 · ASR A1.3', location: 'Beckenrand, alle Bereiche unter 1,80 m Tiefe', meaning: 'Kopfsprünge erst ab mind. 1,80 m Wassertiefe erlaubt. Bei geringerer Tiefe besteht Lebensgefahr durch Aufprall auf dem Beckenboden.', action: 'Badegast sofort ansprechen — gilt ohne Ausnahme. Fehlende Tiefenangabe = Verletzung der Verkehrssicherungspflicht.' },
  { id: 'v4', cat: 'verbot', emoji: '📷', name: 'Fotografieren verboten', norm: 'DSGVO Art. 6 · §201a StGB · Hausordnung', location: 'Umkleiden, Duschen, Beckenbereich', meaning: 'Schutz der Persönlichkeitsrechte aller Badegäste, besonders Kinder. In Umkleiden und Duschen ist Kameranutzung strafbar.', action: 'Sofort ansprechen. Bei Weigerung Vorgesetzten einschalten. Strafanzeige möglich (§201a StGB).' },
  { id: 'v5', cat: 'verbot', emoji: '🍔', name: 'Essen & Trinken verboten', norm: 'Hausordnung · Hygienerecht', location: 'Beckenrand, Badehalle, Umkleiden', meaning: 'Aus Hygienegründen verboten. Speisereste verschmutzen das Wasser, erhöhen den Keimgehalt und belasten die Wasseraufbereitung.', action: 'Auf den Verzehrbereich (Café/Außenbereich) hinweisen.' },
  { id: 'v6', cat: 'verbot', emoji: '🚬', name: 'Rauchen verboten', norm: 'NiSchG · ArbStättV · Hausordnung', location: 'Gesamtes Gebäude, Umkleiden, Badebereich', meaning: 'Schützt Nichtraucher (Passivrauch) und verhindert Brandgefahr. Gesetzlich vorgeschrieben in Arbeitsstätten (ArbStättV).', action: 'Auf das Rauchverbot hinweisen. Raucherbereich im Außenbereich zeigen falls vorhanden.' },
  { id: 'v7', cat: 'verbot', emoji: '🐕', name: 'Tiere verboten', norm: 'Hausordnung · IfSG §36', location: 'Eingangsbereich, gesamte Anlage', meaning: 'Tiere (außer anerkannte Assistenzhunde) aus Hygiene- und Sicherheitsgründen verboten. Infektionsschutzgesetz schreibt hygienische Anforderungen vor.', action: 'Freundlich aber bestimmt auf das Verbot hinweisen. Ausnahme: anerkannte Assistenzhunde.' },
  { id: 'v8', cat: 'verbot', emoji: '📱', name: 'Mobiltelefon verboten', norm: 'DSGVO Art. 6 · §201a StGB · Hausordnung', location: 'Umkleiden, Duschbereich', meaning: 'Mobiltelefone mit Kamerafunktion in Umkleiden und Duschen verboten — Schutz der Privatsphäre und Würde.', action: 'Sofort ansprechen. Bildaufnahmen in Umkleiden sind strafbar (§201a StGB Verletzung des höchstpersönlichen Lebensbereichs).' },

  // WARNSCHILDER — gelbes Dreieck, schwarzes Symbol · ASR A1.3 Abschnitt 4.2
  { id: 'w1', cat: 'warnung', emoji: '🧊', name: 'Rutschgefahr', norm: 'DIN EN ISO 7010 W011 · ASR A1.3', location: 'Beckenrand, Duschen, nasse Flächen', meaning: 'Nasser, rutschiger Boden — Sturzgefahr, besonders für Kinder und ältere Gäste. Häufigste Unfallursache im Schwimmbad.', action: 'Leitkegel aufstellen. Boden abziehen. Rutschhemmenden Belag prüfen (mind. GS/R10 nach DIN 51130).' },
  { id: 'w2', cat: 'warnung', emoji: '🌊', name: 'Tiefes Wasser', norm: 'DIN EN ISO 7010 W016 · DIN 19643', location: 'Sprungbecken, tiefer Beckenbereich, Übergang', meaning: 'Das Wasser ist hier tief. Nichtschwimmer und schwache Schwimmer dürfen diesen Bereich nicht betreten — Ertrinkungsgefahr.', action: 'Tiefenangabe muss daneben stehen. Nichtschwimmer ansprechen und in flacheren Bereich leiten.' },
  { id: 'w3', cat: 'warnung', emoji: '☠️', name: 'Chlorgas-Gefahr', norm: 'DIN EN ISO 7010 W016 · GefStoffV · DGUV V 1', location: 'Technikraum, Chlorgasraum, Dosierkammer', meaning: 'Chlorgas (Cl₂) kann auftreten — giftig (GHS06), greift Atemwege und Augen an. Lebensgefahr bei hoher Konzentration!', action: 'Nur mit Atemschutz (Vollmaske) betreten. Gasdetektor prüfen. Bei Alarm: Raum verlassen, andere warnen, 112 rufen.' },
  { id: 'w4', cat: 'warnung', emoji: '⚡', name: 'Elektrische Spannung', norm: 'DIN EN ISO 7010 W012 · DGUV V 3', location: 'Technikräume, Schaltkästen, Pumpenbereiche', meaning: 'Lebensgefährliche elektrische Spannung. Berühren oder unbefugtes Öffnen kann tödlich sein.', action: 'Nur Elektrofachkräfte dürfen diese Bereiche öffnen (DGUV Vorschrift 3). Defekte sofort melden.' },
  { id: 'w5', cat: 'warnung', emoji: '🧪', name: 'Ätzende Stoffe', norm: 'DIN EN ISO 7010 W023 · GefStoffV · GHS05', location: 'Chemikalienlager, Dosierstationen, pH-Minus-Lager', meaning: 'Ätzende Chemikalien werden hier gehandhabt oder gelagert. Kontakt verursacht schwere Haut- und Augenschäden.', action: 'PSA anlegen (Handschuhe, Schutzbrille, Schürze) vor Betreten. Betriebsanweisung nach §14 GefStoffV beachten.' },
  { id: 'w6', cat: 'warnung', emoji: '🌡️', name: 'Heiße Oberflächen', norm: 'DIN EN ISO 7010 W017 · ASR A1.3', location: 'Heizungsraum, Warmwasserleitungen, Sauna', meaning: 'Oberflächen können sehr heiß sein — Verbrennungsgefahr beim Anfassen (> 60°C möglich).', action: 'Berühren vermeiden. Im Saunabereich Handtuch auf Holzbänke legen. Isolierung prüfen.' },
  { id: 'w7', cat: 'warnung', emoji: '🦠', name: 'Biogefährdung', norm: 'DIN EN ISO 7010 W009 · BioStoffV', location: 'Erste-Hilfe-Raum, bei Blutkontamination', meaning: 'Biologische Gefährdung durch Blut, Körperflüssigkeiten. Infektionsgefahr (Hepatitis, MRSA, HIV). BioStoffV Schutzmaßnahmen nötig.', action: 'Einmalhandschuhe tragen. Flächen nach KRINKO-Empfehlung desinfizieren (VAH-gelistetes Mittel).' },

  // GEBOTSCHILDER — blauer Kreis, weißes Symbol · ASR A1.3 Abschnitt 4.3
  { id: 'g1', cat: 'gebot', emoji: '🚿', name: 'Vor dem Baden duschen', norm: 'DIN 19643 · IfSG · ASR A1.3', location: 'Eingang zum Beckenbereich, Duschbereich', meaning: 'Pflichtdusche gesetzlich vorgeschrieben (DIN 19643 Abschnitt 4.3). Entfernt Schweiß, Körperpflege, Sonnencreme und Keime — schützt die Wasserqualität.', action: 'Badegäste freundlich auf die Duschpflicht hinweisen. Fehlende Dusche = erhöhter Chemikalienbedarf.' },
  { id: 'g2', cat: 'gebot', emoji: '🦺', name: 'Schwimmhilfe tragen', norm: 'Hausordnung · DGUV V 1 §4', location: 'Nichtschwimmerbereich, Freizeitbecken', meaning: 'Nichtschwimmer müssen in tiefen Bereichen eine Schwimmhilfe tragen — Aufsichtspflicht des Betreibers.', action: 'Nichtschwimmer ohne Schwimmhilfe aus tiefem Bereich bitten. Schwimmhilfen ggf. verleihen.' },
  { id: 'g3', cat: 'gebot', emoji: '🧤', name: 'Schutzhandschuhe tragen', norm: 'DIN EN ISO 7010 M009 · DGUV R 112-189 · GefStoffV', location: 'Chemikalienraum, Dosierstationen, Reinigungsarbeiten', meaning: 'Beim Umgang mit Gefahrstoffen Pflicht — schützt vor chemischen Verätzungen und Hautresorption. Vorgeschrieben in der Betriebsanweisung nach §14 GefStoffV.', action: 'Nitril für Chlorprodukte, Neopren für Säuren. Latexallergie prüfen. DGUV Regel 112-189 (PSA) beachten.' },
  { id: 'g4', cat: 'gebot', emoji: '🥽', name: 'Schutzbrille tragen', norm: 'DIN EN ISO 7010 M004 · DGUV R 112-189', location: 'Chemikaliendosierung, Filterspülung, Säurearbeit', meaning: 'Bei ätzenden Stoffen ist eine dicht schließende Vollsichtbrille Pflicht. Spritzer können irreversible Augenschäden verursachen.', action: 'Vollsichtbrille (dicht anliegend) — normale Brille bietet keinen ausreichenden Schutz! DGUV Regel 112-189.' },
  { id: 'g5', cat: 'gebot', emoji: '😷', name: 'Atemschutz tragen', norm: 'DIN EN ISO 7010 M017 · DGUV R 112-190 · GefStoffV', location: 'Chlorgasraum, Chlorkalkbereich, starke Stäube', meaning: 'Atemschutz vorgeschrieben — schützt vor giftigen Gasen (Chlor, Chlordioxid) oder gesundheitsschädlichem Staub (Chlorkalk).', action: 'Vollschutzmaske mit Filter B (Chlorgas) für Chlorraum. DGUV Regel 112-190 (Atemschutz) beachten.' },
  { id: 'g6', cat: 'gebot', emoji: '1️⃣', name: 'Einzeln benutzen', norm: 'DIN EN 16582 · Hausordnung · DGUV V 1', location: 'Wasserrutschen, Sprunganlagen', meaning: 'Rutsche/Anlage darf nur von einer Person gleichzeitig genutzt werden — Kollisionsgefahr und Aufprall im Auffangbecken.', action: 'Nächste Person erst loslassen wenn vorherige den Auslaufbereich verlassen hat. Aufsicht ist Pflicht.' },

  // RETTUNGSZEICHEN — grünes Rechteck, weißes Symbol · ASR A1.3 + DIN EN 1838
  { id: 'r1', cat: 'rettung', emoji: '🛟', name: 'Rettungsring', norm: 'DIN EN ISO 7010 E017 · ASR A1.3 · DIN EN 13074', location: 'An jedem Becken, Außenanlagen, Stege', meaning: 'Zeigt den Standort des Rettungsrings mit Wurfleinen. Muss immer griffbereit hängen — tägliche Kontrolle Pflicht.', action: 'Täglich prüfen: vorhanden, unbeschädigt, Leine aufgerollt? Fehlendes Gerät sofort ersetzen. DGUV V 1 §4.' },
  { id: 'r2', cat: 'rettung', emoji: '➕', name: 'Erste Hilfe', norm: 'DIN EN ISO 7010 E003 · ASR A1.3 · DGUV V 1 §26', location: 'Erste-Hilfe-Raum, Sanitätsecke, Eingang', meaning: 'Standort des Erste-Hilfe-Materials (Verbandkasten nach DIN 13157, Trage, AED). Im Notfall sofort aufsuchen.', action: 'Verbandkasten monatlich prüfen: vollständig, nicht abgelaufen. AED-Batterie und Pads prüfen. DGUV V 1 §26.' },
  { id: 'r3', cat: 'rettung', emoji: '🚪', name: 'Notausgang / Fluchtweg', norm: 'DIN EN ISO 7010 E001/E002 · ASR A2.3 · ArbStättV', location: 'Alle Ausgänge, Fluchtwege, Treppenhäuser', meaning: 'Zeigt den Fluchtweg im Notfall (ArbStättV Anhang 2.3). Muss immer freigehalten und beleuchtet sein — auch bei Stromausfall (Sicherheitsbeleuchtung).', action: 'Niemals blockieren oder zustellen. Nachleuchtend oder mit Sicherheitsbeleuchtung (EN 1838). Bei Ausfall sofort melden.' },
  { id: 'r4', cat: 'rettung', emoji: '❤️', name: 'Defibrillator (AED)', norm: 'DIN EN ISO 7010 E010 · ASR A1.3', location: 'Eingangsbereich, Aufsichtsraum, zentral zugänglich', meaning: 'Standort des automatischen Defibrillators. Bei Herzstillstand sofort holen und einschalten — AED führt durch die Bedienung.', action: 'Standort auswendig kennen! Monatliche Sichtkontrolle (Betriebsbereitschaft). Jährliche Wartung durch Fachkundigen.' },
  { id: 'r5', cat: 'rettung', emoji: '📞', name: 'Notruftelefon', norm: 'DIN EN ISO 7010 E004 · ArbStättV · DGUV V 1', location: 'Aufsichtsraum, Eingang, Technikraum', meaning: 'Standort des Notruftelefons. Im Notfall: 112 (Feuerwehr/Rettungsdienst) — Adresse, Lage und Art des Notfalls nennen.', action: 'Vollständige Adresse auswendig kennen. DGUV V 1 §26: Notrufeinrichtungen müssen vorhanden und bekannt sein.' },
  { id: 'r6', cat: 'rettung', emoji: '📍', name: 'Sammelstelle', norm: 'DIN EN ISO 7010 E007 · ASR A2.3', location: 'Außenbereich, Parkplatz, Evakuierungsplan', meaning: 'Treffpunkt im Notfall — alle Personen nach Evakuierung hier versammeln und zählen. Im Brandschutz- und Evakuierungskonzept verankert.', action: 'Allen Mitarbeitern und Aushilfen bekannt machen. Bei Alarm: alle zum Sammelplatz führen und Vollständigkeit prüfen.' },

  // BRANDSCHUTZZEICHEN — rotes Rechteck, weißes Symbol · ASR A1.3 Abschnitt 4.4
  { id: 'b1', cat: 'brandschutz', emoji: '🧯', name: 'Feuerlöscher', norm: 'DIN EN ISO 7010 F001 · ASR A1.3 · BetrSichV', location: 'Fluchtwege, Technikräume, Eingangsbereich', meaning: 'Standort des Feuerlöschers. Im Brandfall einsetzen — nur wenn Flucht noch sicher möglich! Selbstschutz geht vor.', action: 'Jährliche Wartung prüfen (Prüfplakette). Druckanzeige im grünen Bereich. Nicht verrücken ohne gleichwertigen Ersatz.' },
  { id: 'b2', cat: 'brandschutz', emoji: '🔔', name: 'Brandmelder / Handauslöser', norm: 'DIN EN ISO 7010 F005 · DIN 14661 · ASR A1.3', location: 'Fluchtwege, alle Stockwerke, Ausgänge', meaning: 'Manuelle Brandmeldeanlage (Druckknopfmelder) — bei echtem Brand Glasscheibe einschlagen und Knopf drücken. Alarmiert automatisch Feuerwehr.', action: 'Nur bei echtem Brand auslösen! Falscher Alarm bindet Einsatzkräfte und kostet Gebühren.' },
  { id: 'b3', cat: 'brandschutz', emoji: '🔧', name: 'Wandhydrant', norm: 'DIN EN ISO 7010 F002 · DIN 14461 · ASR A1.3', location: 'Flure, Treppenhäuser, Zugangspunkte', meaning: 'Standort des Wandhydranten (Löschwasseranschluss) für Feuerwehr oder eingewiesenes Personal zur Erstbrandbekämpfung.', action: 'Nur durch eingewiesenes Personal benutzen. Tür niemals versperren. Jährliche Prüfung nach BetrSichV.' },
];

const SIGN_CATEGORIES = [
  { id: 'alle',       label: 'Alle',        color: 'bg-gray-500' },
  { id: 'verbot',     label: 'Verbote',     color: 'bg-red-600' },
  { id: 'warnung',    label: 'Warnung',     color: 'bg-amber-500' },
  { id: 'gebot',      label: 'Gebot',       color: 'bg-blue-600' },
  { id: 'rettung',    label: 'Rettung',     color: 'bg-green-600' },
  { id: 'brandschutz', label: 'Brandschutz', color: 'bg-red-700' },
];

const SIGN_STYLE = {
  verbot:      { bg: 'bg-red-100',    border: 'border-red-500',   badge: 'bg-red-600 text-white',     shape: '🔴 Kreis+Strich (Verbot)' },
  warnung:     { bg: 'bg-amber-50',   border: 'border-amber-400', badge: 'bg-amber-500 text-white',   shape: '⚠️ Gelbes Dreieck (Warnung)' },
  gebot:       { bg: 'bg-blue-50',    border: 'border-blue-400',  badge: 'bg-blue-600 text-white',    shape: '🔵 Blauer Kreis (Gebot)' },
  rettung:     { bg: 'bg-green-50',   border: 'border-green-400', badge: 'bg-green-600 text-white',   shape: '🟩 Grünes Rechteck (Rettung)' },
  brandschutz: { bg: 'bg-red-50',     border: 'border-red-600',   badge: 'bg-red-700 text-white',     shape: '🟥 Rotes Rechteck (Brandschutz)' },
};

const SIGN_STYLE_DARK = {
  verbot:      { bg: 'bg-red-900/20',    border: 'border-red-700' },
  warnung:     { bg: 'bg-amber-900/20',  border: 'border-amber-600' },
  gebot:       { bg: 'bg-blue-900/20',   border: 'border-blue-600' },
  rettung:     { bg: 'bg-green-900/20',  border: 'border-green-600' },
  brandschutz: { bg: 'bg-red-900/30',    border: 'border-red-700' },
};

// ─── Main tab content (existing 3 tabs) ──────────────────────────────────────
const TABS = {
  grundlagen: {
    id: 'grundlagen',
    chip: 'Grundlagen',
    title: 'Warum sind Schilder so wichtig?',
    intro: 'Im Schwimmbad kommen täglich viele Menschen zusammen — Kinder, Erwachsene, Nichtschwimmer, ältere Gäste. Schilder und Kennzeichnungen sind die erste Schutzlinie. Die rechtliche Grundlage bilden die ASR A1.3 (Technische Regeln für Arbeitsstätten), DIN EN ISO 7010 (internationale Sicherheitszeichen) und die DGUV Vorschrift 1 (Grundsätze der Prävention). Als FaBB musst du alle Schilder kennen, ihre Bedeutung erklären können und deren ordnungsgemäßen Zustand sicherstellen.',
    motto: 'Ein fehlendes Schild kann ein Unfall sein, der nicht passiert wäre.',
    rules: [
      'Rechtsgrundlage: ASR A1.3 "Sicherheits- und Gesundheitsschutzkennzeichnung" + DIN EN ISO 7010 + DGUV Vorschrift 1.',
      'Farbe ist normiert: Rot = Verbot/Brandschutz, Gelb = Warnung, Grün = Rettung/Erste Hilfe, Blau = Gebot.',
      'Alle Schilder müssen gut sichtbar, lesbar und unbeschädigt sein. Verblasste Schilder sind rechtlich wertlos — sofort ersetzen.',
      'Badeordnung und Hausordnung Pflicht: gut sichtbar am Eingang und an den Becken (IfSG, DIN 19643).',
      'Nichtschwimmerbereiche mit Tiefenangaben kennzeichnen — fehlende Angaben verletzen die Verkehrssicherungspflicht.',
    ],
    steps: [
      { title: '1. Die vier Signalfarben', text: 'Rot = Verbot oder Brandschutz (Kreis mit Querstrich). Gelb/Orange = Warnung (Dreieck). Grün = Rettungsweg/Erste Hilfe (Rechteck). Blau = Gebot (Kreis, z.B. Schwimmweste tragen). International genormt!' },
      { title: '2. Verbotsschilder (rot)', text: 'Erkennbar am roten Kreis mit Querstrich. Typisch im Bad: Kein Springen, Kein Kopfsprung, Kein Fotografieren, Kein Essen. Verbote gelten ohne Ausnahme für alle.' },
      { title: '3. Warnschilder (gelb)', text: 'Gelbes Dreieck mit schwarzem Symbol. Im Bad: Rutschgefahr, Wassertiefe, Chlorgas, elektrische Spannung. Bedeutet: Vorsicht, Gefahr ist möglich!' },
      { title: '4. Rettungs- und Gebotsschilder', text: 'Grüne Schilder zeigen Rettungswege, Notausgänge, AED, Erste Hilfe. Blaue Schilder schreiben Verhalten vor: Duschen vor dem Baden, Schutzbrille tragen. Beide sind genauso verbindlich wie Verbotsschilder!' },
    ],
    examples: [
      {
        title: 'Tiefenangaben am Becken',
        given: 'Am Beckenrand hängt ein Schild "1,35 m" und daneben "Kein Kopfsprung".',
        question: 'Was bedeutet das und warum ist es wichtig?',
        steps: [
          ['Tiefenangabe', 'Die Wassertiefe beträgt an dieser Stelle 1,35 m'],
          ['Verbot', 'Kein Kopfsprung — bei dieser Tiefe ist Kopfspringen lebensgefährlich'],
          ['Rechtlich', 'Fehlende Tiefenangaben sind eine Verletzung der Verkehrssicherungspflicht'],
          ['Merke', 'Kopfsprung erst ab mind. 1,80 m Tiefe erlaubt (je nach Anlage)'],
        ],
      },
      {
        title: 'Rettungsring-Standort',
        given: 'An jedem Becken hängt ein grünes Schild mit einem Rettungsring-Symbol.',
        question: 'Was muss daneben sein und warum?',
        steps: [
          ['Sinn', 'Das Schild zeigt wo Rettungsgeräte hängen — damit jeder sie sofort findet'],
          ['Pflicht', 'Rettungsringe und Wurfleinen müssen immer einsatzbereit hängen'],
          ['Kontrolle', 'Tägliche Sichtkontrolle: vorhanden, unbeschädigt, richtig aufgehängt?'],
          ['Fehlt was', 'Sofort Vorgesetzten informieren und Ersatz beschaffen — nicht warten!'],
        ],
      },
    ],
    pitfalls: [
      'Ein Schild das verblasst oder verdeckt ist, gilt rechtlich als NICHT vorhanden — bei einem Unfall haftet der Betreiber.',
      'Verbotsschilder und Gebotsschilder haben die GLEICHE Rechtskraft — beide sind verbindlich.',
      'Tiefenangaben müssen am Beckenrand UND senkrecht zur Wasserfläche sichtbar sein.',
      'Schilder allein reichen nicht — mündliche Hinweise der Aufsicht sind genauso wichtig!',
    ],
    quiz: {
      question: 'Welche Farbe haben Warnschilder und was bedeuten sie?',
      options: ['Rot — etwas ist verboten', 'Gelb — es besteht eine mögliche Gefahr, Vorsicht ist geboten', 'Blau — ein bestimmtes Verhalten ist vorgeschrieben'],
      correctIndex: 1,
      explanation: 'Gelbe Dreiecke sind Warnschilder. Sie signalisieren eine mögliche Gefahr (Rutschgefahr, Chlorgas, Wassertiefe). Rot = Verbot, Blau = Gebot, Grün = Rettung.',
    },
  },

  gefahrstoffkennzeichnung: {
    id: 'gefahrstoffkennzeichnung',
    chip: 'GHS-Symbole',
    title: 'GHS-Piktogramme & Gefahrenkennzeichnung',
    intro: 'Im Schwimmbad arbeiten wir mit Chemikalien wie Chlor, Säuren, Laugen und Flockungsmitteln. Diese Stoffe müssen nach dem GHS-System (Global Harmonisiertes System) gekennzeichnet sein. Die Piktogramme warnen vor den spezifischen Gefahren. Als FaBB musst du sie auf Anhieb erkennen.',
    motto: 'GHS-Piktogramme sind international — sie gelten überall auf der Welt.',
    rules: [
      'GHS = "Globally Harmonised System" — weltweit einheitliche Gefahrstoffkennzeichnung.',
      'GHS-Piktogramme sind rautenförmig (Quadrat auf Spitze), weiß mit rotem Rand und schwarzem Symbol.',
      'Jedes Piktogramm steht für eine Gefahrenklasse: Flamme = entzündlich, Totenkopf = sehr giftig.',
      'Gefahrstoffe haben immer H-Sätze (Hazard = Gefahrenhinweise) und P-Sätze (Precautionary = Sicherheitshinweise).',
      'Sicherheitsdatenblatt (SDB) muss für jeden Gefahrstoff vorliegen und zugänglich sein.',
    ],
    steps: [
      { title: '1. Die wichtigsten GHS-Piktogramme', text: 'GHS01 = Explosiv. GHS02 = Entzündlich (Flamme). GHS04 = Gas unter Druck. GHS05 = Ätzend. GHS06 = Akut giftig (Totenkopf). GHS07 = Gesundheitsschädlich (Ausrufezeichen). GHS08 = Gesundheitsgefahr. GHS09 = Umweltgefährdend.' },
      { title: '2. H-Sätze lesen', text: 'H-Sätze beschreiben die Gefahr: H290 = "Kann für Metalle korrosiv sein." H314 = "Verursacht schwere Verätzungen der Haut und des Auges." H335 = "Kann die Atemwege reizen." 2xx = physikalisch, 3xx = Gesundheit, 4xx = Umwelt.' },
      { title: '3. P-Sätze lesen', text: 'P-Sätze geben Verhaltensanweisungen: P260 = "Staub/Gas nicht einatmen." P280 = "Schutzhandschuhe/Augenschutz tragen." P301+P330+P331 = "Bei Verschlucken: Mund ausspülen, KEIN Erbrechen herbeiführen."' },
      { title: '4. Sicherheitsdatenblatt (SDB)', text: 'Das SDB hat 16 Abschnitte. Wichtigste Abschnitte: 2 (Gefahren), 4 (Erste Hilfe), 5 (Brand), 6 (Unfall), 8 (PSA). Das SDB muss für alle zugänglich sein — im Technikraum oder Büro.' },
    ],
    examples: [
      {
        title: 'Natriumhypochlorit (Flüssigchlor)',
        given: 'Ein Kanister mit Natriumhypochlorit hat GHS05 und GHS09.',
        question: 'Was bedeuten diese Symbole und welche Schutzmaßnahmen sind nötig?',
        steps: [
          ['GHS05 (Ätzung)', 'Ätzend — kann Haut und Augen schwer schädigen'],
          ['GHS09 (Umwelt)', 'Umweltgefährlich — darf NICHT ins Abwasser/Grundwasser'],
          ['PSA', 'Schutzbrille, Schutzhandschuhe (Nitril/Neopren), Schürze tragen'],
          ['Erste Hilfe', 'Bei Hautkontakt sofort mit viel Wasser spülen, Arzt aufsuchen'],
        ],
      },
      {
        title: 'Salzsäure (pH-Minus)',
        given: 'Salzsäure (32%) hat GHS05 (Ätzung) und GHS07 (Ausrufezeichen).',
        question: 'Wie muss dieser Stoff gelagert und gehandhabt werden?',
        steps: [
          ['GHS05', 'Stark ätzend — gefährlich für Haut, Augen und Atemwege'],
          ['GHS07', 'Reizend und gesundheitsschädlich auch bei geringer Konzentration'],
          ['Lagerung', 'Getrennt von Chlorprodukten — Mischung erzeugt Chlorgas!'],
          ['PSA', 'Vollschutzbrille, Säureschutzhandschuhe, ggf. Atemschutz'],
        ],
      },
    ],
    pitfalls: [
      'GHS-Symbole und das alte orange System sind NICHT dasselbe — das alte System ist abgelöst!',
      'Nur ein Symbol bedeutet nicht "weniger gefährlich" — ein einziger Totenkopf reicht für höchste Vorsicht.',
      'Sicherheitsdatenblätter müssen AKTUELL sein — veraltete SDB (älter als 3 Jahre) erneuern.',
      'Gefahrstoffe NIEMALS umfüllen ohne klare Beschriftung des Zielbehälters — Verwechslungen können tödlich sein!',
    ],
    quiz: {
      question: 'Was bedeutet das GHS05-Piktogramm (Ätzung)?',
      options: ['Der Stoff ist leicht entzündlich', 'Der Stoff ist ätzend und kann Haut und Augen schwer schädigen', 'Der Stoff ist umweltgefährlich'],
      correctIndex: 1,
      explanation: 'GHS05 zeigt eine Hand und ein Material das aufgelöst wird — Symbol für ätzende Stoffe. Bei Kontakt sofort mit viel Wasser spülen und Arzt aufsuchen.',
    },
  },

  praxis: {
    id: 'praxis',
    chip: 'Kontrolle & Praxis',
    title: 'Schilder prüfen und instand halten',
    intro: 'Das Anbringen von Schildern ist nur der erste Schritt. Im laufenden Betrieb müssen Schilder regelmäßig kontrolliert, gereinigt und ersetzt werden. Fehlende, beschädigte oder verblasste Schilder müssen sofort gemeldet und behoben werden.',
    motto: 'Kontrolle ist keine Bürokratie — sie schützt Menschenleben.',
    rules: [
      'Regelmäßige Sichtkontrolle aller Schilder — mindestens wöchentlich, besser täglich bei der Öffnungskontrolle.',
      'Beschädigte, verblasste oder fehlende Schilder sofort melden und ersetzen lassen.',
      'Nach Umbauarbeiten: Prüfe ob alle Schilder noch korrekt platziert sind.',
      'Saison-Schilder müssen rechtzeitig ausgetauscht werden.',
      'Jede Meldung dokumentieren — schriftlich, mit Datum und Beschreibung.',
    ],
    steps: [
      { title: '1. Öffnungskontrolle', text: 'Jeden Morgen beim Aufschließen: Sind alle Schilder vorhanden? Nichts abgefallen, verdeckt oder beschädigt? Kurzer Rundgang — aber konsequent jeden Tag. Wenn etwas fehlt: Sofort notieren und melden.' },
      { title: '2. Was tun wenn ein Schild fehlt?', text: 'Erstens: Bereich absperren oder Alternative schaffen (mündlicher Hinweis, Leitkegel) bis das Schild ersetzt ist. Zweitens: Schaden dokumentieren (Ort, Art, Datum). Drittens: Vorgesetzten informieren. NICHT einfach abwarten!' },
      { title: '3. Schilder richtig anbringen', text: 'Höhe: Augenhöhe (ca. 1,60–1,80 m). Rettungswegsschilder müssen auch bei Stromausfall leuchten (Nachleuchtmasse). Nicht durch Gegenstände verdeckt. Für Nassbereiche feuchtigkeitsbeständige Schilder verwenden.' },
      { title: '4. Dokumentation', text: 'Alle Kontrollgänge und festgestellte Mängel ins Betriebsbuch eintragen: Datum, Uhrzeit, was geprüft, was beanstandet, welche Maßnahme eingeleitet. Diese Dokumentation ist im Schadensfall dein Nachweis.' },
    ],
    examples: [
      {
        title: 'Verblasstes Rutschgefahr-Schild',
        given: 'Das Warnschild "Rutschgefahr" am Beckenrand ist durch Chloreinwirkung stark verblasst.',
        question: 'Was tust du konkret?',
        steps: [
          ['Sofortmaßnahme', 'Bereich mit Leitkegeln sichern oder Warnung mündlich weitergeben'],
          ['Dokumentation', 'Schaden ins Betriebsbuch eintragen: Ort, Datum, Zustand'],
          ['Meldung', 'Vorgesetzten informieren und Ersatzschild anfordern'],
          ['Ersetzen', 'Neues Schild anbringen — chlorbeständiges Material wählen'],
        ],
      },
      {
        title: 'Neuer Bereich nach Umbau',
        given: 'Das Bad hat nach Sanierung einen neuen Kleinkinderbereich mit flachem Becken (0,40 m).',
        question: 'Welche Pflichtbeschilderung braucht der neue Bereich?',
        steps: [
          ['Tiefenangabe', '"0,40 m" — deutlich sichtbar am Beckenrand'],
          ['Altersgrenze', '"Nur für Kinder bis X Jahre" oder "Nur unter Aufsicht Erwachsener"'],
          ['Verbote', '"Kein Springen" und "Kein Kopfsprung"'],
          ['Rettung', 'Nächster Rettungsring und AED-Standort ausgeschildert'],
        ],
      },
    ],
    pitfalls: [
      'Mündliche Hinweise ersetzen KEINE Schilder — sie ergänzen sie nur.',
      'Verblasste Schilder sind rechtlich wertlos — ein Schild das man nicht lesen kann, existiert nicht.',
      'Schilder hinter Pflanzen oder Regalen aufhängen ist sinnlos — immer gut sichtbar anbringen.',
      'Nicht warten bis der Chef kommt — wer einen Mangel sieht und ihn nicht meldet, macht sich mitschuldig.',
    ],
    quiz: {
      question: 'Du entdeckst beim Öffnungsrundgang ein fehlendes Verbotsschild. Was ist der erste richtige Schritt?',
      options: [
        'Abwarten bis der Vorgesetzte von selbst kommt',
        'Den Bereich sofort sichern (z.B. Leitkegel), Schaden dokumentieren und Vorgesetzten informieren',
        'Das Schild selbst irgendwo abmalen und aufhängen',
      ],
      correctIndex: 1,
      explanation: 'Erst sichern, dann melden, dann dokumentieren. Der Bereich muss sofort abgesichert werden. Dann schriftliche Dokumentation und Meldung an den Vorgesetzten.',
    },
  },

  betriebsanweisungen: {
    id: 'betriebsanweisungen',
    chip: 'Betriebsanweisungen',
    title: 'Betriebsanweisungen — Typen, Inhalt und Unterschiede',
    intro: 'Eine Betriebsanweisung (BA) ist eine schriftliche, arbeitsplatzbezogene Anweisung für Mitarbeiter — sie erklärt konkret, wie sicher mit einem Gefahrstoff oder Arbeitsmittel umzugehen ist. Im Schwimmbad gibt es mehrere Typen, die sich in Rechtsgrundlage, Pflichtinhalt und Unterweisungsrhythmus unterscheiden. Alle müssen in verständlicher Sprache verfasst, am Arbeitsplatz zugänglich und Grundlage regelmäßiger Unterweisungen sein.',
    motto: 'Ohne Betriebsanweisung, keine Unterweisung — ohne Unterweisung, keine Sicherheit.',
    rules: [
      'Betriebsanweisung Gefahrstoffe: Pflicht für jeden Gefahrstoff nach §14 GefStoffV — 7 Pflichtpunkte, jährliche Unterweisung.',
      'Betriebsanweisung Arbeitsmittel: Pflicht für gefährliche Maschinen/Anlagen nach §12 BetrSichV — bei Einsatz und Änderungen.',
      'Allgemeine Betriebsanweisung: Verhaltensregeln am Arbeitsplatz nach ArbSchG — z.B. Verhalten bei Unfall oder Brand.',
      'Alle BA müssen am Arbeitsplatz ausgehängt oder sofort zugänglich sein — nicht im Büro-Ordner verstecken.',
      'Unterweisung muss dokumentiert werden (Datum, Name, Unterschrift) — ohne Nachweis gilt sie als nicht durchgeführt.',
    ],
    steps: [
      {
        title: '1. Gefahrstoff-Betriebsanweisung (§14 GefStoffV)',
        text: 'Pflicht für JEDEN Gefahrstoff im Betrieb (Chlor, Salzsäure, Natronlauge, Desinfektionsmittel…). 7 Pflichtpunkte: (1) Stoff-/Produktname + GHS-Symbole, (2) Gefahren für Mensch und Umwelt, (3) Schutzmaßnahmen und Verhaltensregeln, (4) Verhalten im Gefahrfall, (5) Erste Hilfe, (6) Instandhaltung/Kontrolle, (7) Entsorgung. Unterweisung: mindestens jährlich + bei Einstellung + bei Produktwechsel. Nachweis durch Unterschrift der Mitarbeiter.',
      },
      {
        title: '2. Arbeitsmittel-Betriebsanweisung (§12 BetrSichV)',
        text: 'Für jedes Arbeitsmittel mit Gefährdungspotenzial: Umwälzpumpen, Dosieranlagen, Hochdruckreiniger, Filteranlagen, Beckenhebeanlage. Pflichtinhalt: Bestimmungsgemäße Verwendung, verbotene Handlungen, Gefährdungen, Schutzmaßnahmen, Verhalten bei Störungen/Unfällen, Instandhaltung. KEIN festes Jahresintervall — Unterweisung bei Einsatz, bei Änderung der Anlage und bei Unfällen.',
      },
      {
        title: '3. Unterschiede auf einen Blick',
        text: 'Gefahrstoff-BA: Stoff-spezifisch · §14 GefStoffV · 7 Pflichtpunkte · jährliche Unterweisung. — Arbeitsmittel-BA: Gerät-spezifisch · §12 BetrSichV · bei Gefährdungsbeurteilung · Unterweisung bei Änderung. — Allgemeine BA: Verhaltensregeln/Organisatorisches · ArbSchG · z.B. Notfallplan, Arbeitszeiten. Der größte Unterschied: Rechtsgrundlage und der Rhythmus der Unterweisung.',
      },
      {
        title: '4. Wer erstellt die Betriebsanweisung?',
        text: 'Verantwortlich ist der Arbeitgeber (Betriebsleiter). In der Praxis: Fachkraft für Arbeitssicherheit (SiFa) erstellt sie gemeinsam mit dem Betriebsleiter. Basis: Sicherheitsdatenblatt (SDB) des Herstellers, Abschnitt 7 (Handhabung) und 8 (PSA). Mustervorlagen: DGUV Information 213-085 (Gefahrstoffe) und Vorlagen der Berufsgenossenschaft.',
      },
    ],
    examples: [
      {
        title: 'BA für Natriumhypochlorit (Flüssigchlor)',
        given: 'Im Chlorraum wird Natriumhypochlorit (NaOCl) für die Wasserdesinfektion eingesetzt.',
        question: 'Was muss die Betriebsanweisung zwingend enthalten?',
        steps: [
          ['Stoff + GHS', 'Natriumhypochlorit, NaOCl — GHS05 (Ätzend), GHS09 (Umwelt)'],
          ['Gefahren', 'Ätzend für Haut/Augen. Kontakt mit Säuren → sofort Chlorgas (GHS06, Lebensgefahr)!'],
          ['PSA', 'Nitrilhandschuhe, Vollsichtbrille, Schürze, bei Leckage: Atemschutz Vollmaske'],
          ['Erste Hilfe', 'Haut/Augen: sofort 15 Min. mit Wasser spülen, dann Arzt'],
          ['Entsorgung', 'Nicht ins Abwasser — neutralisieren, als Sondermüll entsorgen'],
        ],
      },
      {
        title: 'BA für Hochdruckreiniger',
        given: 'Ein Hochdruckreiniger wird für die Beckenrand- und Technikraumpflege eingesetzt.',
        question: 'Was unterscheidet diese BA von der Gefahrstoff-BA?',
        steps: [
          ['Typ', 'Arbeitsmittel-BA nach §12 BetrSichV — nicht nach GefStoffV'],
          ['Gefährdungen', 'Druckstrahl (> 100 bar) → Hautinjektionen, Abpraller, Lärm (> 85 dB)'],
          ['Verbote', 'Niemals auf Personen richten. Nicht ohne PSA. Kein Einsatz im Becken'],
          ['Kein Jahresintervall', 'Unterweisung bei Geräteeinsatz — nicht zwingend jährlich'],
        ],
      },
    ],
    pitfalls: [
      'Eine BA die nur im Ordner liegt hilft niemandem — sie muss am Arbeitsplatz hängen oder sofort greifbar sein.',
      'Jährliche Unterweisung ohne Unterschrift ist nicht nachweisbar — bei Unfällen haftet der Betrieb.',
      'Eine BA für "Chlor allgemein" reicht nicht — Natriumhypochlorit, Calciumhypochlorit und Chlorgas sind verschiedene Stoffe mit eigener BA.',
      'Produktwechsel vergessen: Neues Reinigungsmittel = sofort neue BA erstellen und neu unterweisen!',
    ],
    quiz: {
      question: 'Wie oft muss ein Mitarbeiter laut §14 GefStoffV über eine Gefahrstoff-Betriebsanweisung unterwiesen werden?',
      options: [
        'Einmalig bei der Einstellung reicht aus',
        'Mindestens einmal jährlich sowie bei Änderungen und bei der Einstellung — mit Unterschrift',
        'Nur wenn ein Unfall passiert ist',
      ],
      correctIndex: 1,
      explanation: '§14 Abs. 2 GefStoffV schreibt mindestens jährliche Unterweisung vor — plus sofort bei Einstellung und bei Produktänderungen. Die Unterschrift der Mitarbeiter ist Pflicht: ohne Nachweis gilt die Unterweisung als nicht erfolgt, der Betrieb haftet bei Unfällen.',
    },
  },

  lexikon: {
    id: 'lexikon',
    chip: 'Schilder-Lexikon',
  },
};

// ─── Shared helpers ───────────────────────────────────────────────────────────
const TabChip = ({ label, active, onClick, darkMode }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
      active
        ? 'bg-yellow-500 text-white'
        : darkMode
          ? 'bg-slate-700 text-gray-300 hover:bg-slate-600'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
    }`}
  >
    {label}
  </button>
);

const Section = ({ title, children, darkMode }) => (
  <div className={`rounded-xl p-4 ${darkMode ? 'bg-slate-700/60' : 'bg-gray-50'}`}>
    <h4 className={`font-bold mb-3 ${darkMode ? 'text-yellow-400' : 'text-yellow-700'}`}>{title}</h4>
    {children}
  </div>
);

// ─── Schilder-Lexikon Tab ─────────────────────────────────────────────────────
function SignLexikon({ darkMode }) {
  const [filter, setFilter] = useState('alle');
  const [selected, setSelected] = useState(null);

  const visible = filter === 'alle' ? SIGNS : SIGNS.filter(s => s.cat === filter);

  if (selected) {
    const style = SIGN_STYLE[selected.cat];
    const styleDark = SIGN_STYLE_DARK[selected.cat];
    return (
      <div className="space-y-4">
        <button
          onClick={() => setSelected(null)}
          className={`flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg transition-colors ${darkMode ? 'text-gray-300 hover:bg-slate-700' : 'text-gray-600 hover:bg-gray-100'}`}
        >
          ← Zurück zur Übersicht
        </button>

        {/* Sign detail card */}
        <div className={`rounded-xl p-5 border-2 ${darkMode ? `${styleDark.bg} ${styleDark.border}` : `${style.bg} ${style.border}`}`}>
          {/* Visual sign */}
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-20 h-20 rounded-xl flex items-center justify-center text-4xl border-2 ${darkMode ? styleDark.border : style.border} ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
              {selected.emoji}
            </div>
            <div>
              <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold mb-1 ${style.badge}`}>
                {SIGN_CATEGORIES.find(c => c.id === selected.cat)?.label}
              </span>
              <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selected.name}</h3>
              <p className={`text-xs font-mono mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{selected.norm}</p>
            </div>
          </div>

          {/* Form */}
          <div className={`text-xs mb-3 italic ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Form: {style.shape}
          </div>

          {/* Fields */}
          <div className="space-y-3">
            <div className={`p-3 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-white'}`}>
              <p className={`text-xs font-semibold mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>📍 Typischer Standort im Bad</p>
              <p className={`text-sm ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{selected.location}</p>
            </div>
            <div className={`p-3 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-white'}`}>
              <p className={`text-xs font-semibold mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>💡 Bedeutung</p>
              <p className={`text-sm ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{selected.meaning}</p>
            </div>
            <div className={`p-3 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-white'}`}>
              <p className={`text-xs font-semibold mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>✅ Was tust du als FaBB?</p>
              <p className={`text-sm ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{selected.action}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Intro */}
      <div className={`rounded-xl p-4 border-l-4 border-yellow-500 ${darkMode ? 'bg-slate-800' : 'bg-yellow-50'}`}>
        <h3 className="text-lg font-bold mb-1">Alle Schilder auf einen Blick</h3>
        <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Tippe auf ein Schild um Bedeutung, Standort und deine Aufgabe als FaBB zu sehen.
        </p>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        {SIGN_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setFilter(cat.id)}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
              filter === cat.id
                ? `${cat.color} text-white`
                : darkMode
                  ? 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {cat.label} {filter === cat.id && `(${visible.length})`}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-3">
        {visible.map(sign => {
          const style = SIGN_STYLE[sign.cat];
          const styleDark = SIGN_STYLE_DARK[sign.cat];
          return (
            <button
              key={sign.id}
              onClick={() => setSelected(sign)}
              className={`rounded-xl p-3 border-2 flex flex-col items-center gap-2 text-center transition-all hover:scale-105 active:scale-95 ${
                darkMode ? `${styleDark.bg} ${styleDark.border}` : `${style.bg} ${style.border}`
              }`}
            >
              <span className="text-3xl">{sign.emoji}</span>
              <span className={`text-xs font-semibold leading-tight ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                {sign.name}
              </span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${style.badge}`}>
                {SIGN_CATEGORIES.find(c => c.id === sign.cat)?.label}
              </span>
            </button>
          );
        })}
      </div>

      <p className={`text-center text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
        {visible.length} Schilder · Tippe für Details
      </p>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function BeschilderungDeepDiveView({ onBack }) {
  const { darkMode } = useApp();
  const [activeTab, setActiveTab] = useState('grundlagen');
  const [quizAnswer, setQuizAnswer] = useState(null);

  const tab = TABS[activeTab];
  const isLexikon = activeTab === 'lexikon';

  return (
    <div className={`min-h-screen p-4 space-y-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={onBack} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-100'}`}>
          ← Zurück
        </button>
        <div>
          <h2 className="text-xl font-bold">🪧 Beschilderung & Kennzeichnungen</h2>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Hygiene & Sicherheit · §3 Nr. 4</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {Object.values(TABS).map(t => (
          <TabChip
            key={t.id}
            label={t.chip}
            active={activeTab === t.id}
            onClick={() => { setActiveTab(t.id); setQuizAnswer(null); }}
            darkMode={darkMode}
          />
        ))}
      </div>

      {/* Schilder-Lexikon */}
      {isLexikon && <SignLexikon darkMode={darkMode} />}

      {/* Standard tabs */}
      {!isLexikon && (
        <>
          {/* Intro */}
          <div className={`rounded-xl p-4 border-l-4 border-yellow-500 ${darkMode ? 'bg-slate-800' : 'bg-yellow-50'}`}>
            <h3 className="text-lg font-bold mb-2">{tab.title}</h3>
            <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{tab.intro}</p>
            <p className={`mt-3 text-sm font-semibold italic ${darkMode ? 'text-yellow-400' : 'text-yellow-700'}`}>💡 {tab.motto}</p>
          </div>

          {/* Regeln */}
          <Section title="📋 Das musst du wissen" darkMode={darkMode}>
            <ul className="space-y-2">
              {tab.rules.map((r, i) => (
                <li key={i} className={`flex gap-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <span className="text-yellow-500 font-bold mt-0.5">•</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </Section>

          {/* Schritt für Schritt */}
          <Section title="🔢 Schritt für Schritt" darkMode={darkMode}>
            <div className="space-y-3">
              {tab.steps.map((s, i) => (
                <div key={i} className={`p-3 rounded-lg ${darkMode ? 'bg-slate-600' : 'bg-white'}`}>
                  <p className="font-semibold text-sm text-yellow-500">{s.title}</p>
                  <p className={`text-sm mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{s.text}</p>
                </div>
              ))}
            </div>
          </Section>

          {/* Beispiele */}
          <Section title="📖 Beispiele aus der Praxis" darkMode={darkMode}>
            <div className="space-y-4">
              {tab.examples.map((ex, i) => (
                <div key={i} className={`p-3 rounded-lg ${darkMode ? 'bg-slate-600' : 'bg-white'}`}>
                  <p className="font-bold text-sm text-yellow-500 mb-1">{ex.title}</p>
                  <p className={`text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{ex.given}</p>
                  <p className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{ex.question}</p>
                  <div className="space-y-1">
                    {ex.steps.map(([label, text], j) => (
                      <div key={j} className="flex gap-2 text-sm">
                        <span className={`font-semibold min-w-[90px] ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>{label}:</span>
                        <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>{text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* Fehler vermeiden */}
          <Section title="⚠️ Typische Fehler vermeiden" darkMode={darkMode}>
            <ul className="space-y-2">
              {tab.pitfalls.map((p, i) => (
                <li key={i} className={`flex gap-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <span className="text-red-400 font-bold mt-0.5">✗</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </Section>

          {/* Mini-Quiz */}
          <Section title="🧠 Teste dein Wissen" darkMode={darkMode}>
            <p className={`text-sm font-medium mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{tab.quiz.question}</p>
            <div className="space-y-2">
              {tab.quiz.options.map((opt, i) => {
                const isCorrect = i === tab.quiz.correctIndex;
                let bg = darkMode ? 'bg-slate-600 hover:bg-slate-500' : 'bg-white hover:bg-gray-50';
                if (quizAnswer !== null) {
                  if (isCorrect) bg = 'bg-green-600 text-white';
                  else if (quizAnswer === i) bg = 'bg-red-500 text-white';
                }
                return (
                  <button
                    key={i}
                    onClick={() => quizAnswer === null && setQuizAnswer(i)}
                    className={`w-full text-left p-3 rounded-lg text-sm border transition-colors ${bg} ${darkMode ? 'border-slate-500' : 'border-gray-200'}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
            {quizAnswer !== null && (
              <div className={`mt-3 p-3 rounded-lg text-sm ${quizAnswer === tab.quiz.correctIndex ? 'bg-green-900/30 text-green-300' : 'bg-red-900/30 text-red-300'}`}>
                {quizAnswer === tab.quiz.correctIndex ? '✓ Richtig! ' : '✗ Leider falsch. '}{tab.quiz.explanation}
              </div>
            )}
          </Section>
        </>
      )}
    </div>
  );
}
