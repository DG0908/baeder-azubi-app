import { useState } from 'react';
import { useApp } from '../../../context/AppContext';

// ─── Schilder-Lexikon ────────────────────────────────────────────────────────
const SIGNS = [
  // VERBOTSSCHILDER
  { id: 'v1', cat: 'verbot', emoji: '🚷', name: 'Zutritt verboten', norm: 'ISO 7010 P001', location: 'Technikräume, Personalräume, gesperrte Bereiche', meaning: 'Kein Zutritt für Unbefugte. Dieser Bereich ist ausschließlich autorisiertem Personal zugänglich.', action: 'Bereich nicht betreten. Unbefugte ansprechen und ggf. Vorgesetzten informieren.' },
  { id: 'v2', cat: 'verbot', emoji: '⬇️', name: 'Springen verboten', norm: 'ISO 7010 P019', location: 'Flachstellen, Nichtschwimmerbereiche, Rutschenende', meaning: 'Springen ins Wasser ist verboten — Verletzungsgefahr durch zu geringe Tiefe oder andere Badegäste.', action: 'Badegäste ansprechen. Bei Wiederholung Platzverweis.' },
  { id: 'v3', cat: 'verbot', emoji: '🤸', name: 'Kopfsprung verboten', norm: 'ASR / Hausordnung', location: 'Beckenrand, Bereiche unter 1,80 m Tiefe', meaning: 'Kopfsprünge sind erst ab mind. 1,80 m Wassertiefe erlaubt. Bei geringerer Tiefe besteht Lebensgefahr durch Aufprall auf dem Beckenboden.', action: 'Badegast sofort ansprechen — gilt ohne Ausnahme auch für geübte Schwimmer.' },
  { id: 'v4', cat: 'verbot', emoji: '📷', name: 'Fotografieren verboten', norm: 'DSGVO / Hausordnung', location: 'Umkleiden, Duschen, Beckenbereich', meaning: 'Fotografieren und Filmen ist verboten — Schutz der Persönlichkeitsrechte aller Badegäste, besonders Kinder.', action: 'Sofort ansprechen. In Umkleiden ist Kameranutzung strafbar (§ 201a StGB). Vorgesetzten einschalten.' },
  { id: 'v5', cat: 'verbot', emoji: '🍔', name: 'Essen & Trinken verboten', norm: 'Hausordnung / Hygiene', location: 'Beckenrand, Badehalle, Umkleiden', meaning: 'Aus Hygienegründen verboten. Speisereste verschmutzen das Wasser und fördern Keimwachstum.', action: 'Auf den Verzehrbereich (Cafe/Außenbereich) hinweisen.' },
  { id: 'v6', cat: 'verbot', emoji: '🚬', name: 'Rauchen verboten', norm: 'Hausordnung / NiSchG', location: 'Gesamtes Gebäude, Umkleiden, Badebereich', meaning: 'Schützt Nichtraucher und verhindert Brandgefahr im gesamten Hallenbad.', action: 'Auf das Rauchverbot hinweisen und ggf. Raucherbereich im Außenbereich zeigen.' },
  { id: 'v7', cat: 'verbot', emoji: '🐕', name: 'Tiere verboten', norm: 'Hausordnung', location: 'Eingangsbereich, gesamte Anlage', meaning: 'Tiere (außer anerkannte Assistenzhunde) sind aus Hygiene- und Sicherheitsgründen verboten.', action: 'Freundlich aber bestimmt auf das Verbot hinweisen.' },
  { id: 'v8', cat: 'verbot', emoji: '📱', name: 'Mobiltelefon verboten', norm: 'Hausordnung / DSGVO', location: 'Umkleiden, Duschbereich', meaning: 'Mobiltelefone mit Kamera in Umkleiden und Duschen verboten — Schutz der Privatsphäre.', action: 'Sofort ansprechen. Nutzung in Umkleiden kann strafbar sein.' },

  // WARNSCHILDER
  { id: 'w1', cat: 'warnung', emoji: '🧊', name: 'Rutschgefahr', norm: 'ISO 7010 W011', location: 'Beckenrand, Duschen, nasse Flächen', meaning: 'Nasser Boden — Sturzgefahr, besonders für Kinder und ältere Gäste.', action: 'Leitkegel aufstellen. Boden regelmäßig abziehen. Badegäste auf Gehgeschwindigkeit hinweisen.' },
  { id: 'w2', cat: 'warnung', emoji: '🌊', name: 'Tiefes Wasser', norm: 'ISO 7010 W016', location: 'Sprungbecken, tiefer Beckenbereich', meaning: 'Das Wasser ist hier tief. Nichtschwimmer dürfen diesen Bereich nicht betreten.', action: 'Tiefenangabe muss zusätzlich am Beckenrand angebracht sein. Nichtschwimmer ansprechen.' },
  { id: 'w3', cat: 'warnung', emoji: '☠️', name: 'Chlorgas-Gefahr', norm: 'ISO 7010 / GHS', location: 'Technikraum, Chlorgasraum, Dosierkammer', meaning: 'Chlorgas kann auftreten — giftig, greift Atemwege an. Lebensgefahr bei hoher Konzentration!', action: 'Raum nur mit Atemschutz (Vollmaske) betreten. Gasdetektor prüfen. Bei Alarm sofort evakuieren.' },
  { id: 'w4', cat: 'warnung', emoji: '⚡', name: 'Elektrische Spannung', norm: 'ISO 7010 W012', location: 'Technikräume, Schaltkästen, Pumpenbereiche', meaning: 'Lebensgefährliche elektrische Spannung. Berühren kann tödlich sein.', action: 'Nur Elektrofachkräfte dürfen diese Bereiche öffnen. Defekte sofort melden.' },
  { id: 'w5', cat: 'warnung', emoji: '🧪', name: 'Ätzende Stoffe', norm: 'ISO 7010 W023', location: 'Chemikalienlager, Dosierstationen', meaning: 'Ätzende Chemikalien werden hier gehandhabt oder gelagert. Schutzausrüstung erforderlich.', action: 'PSA anlegen (Handschuhe, Schutzbrille, Schürze) bevor der Bereich betreten wird.' },
  { id: 'w6', cat: 'warnung', emoji: '🌡️', name: 'Heiße Oberflächen', norm: 'ISO 7010 W017', location: 'Heizungsraum, Warmwasserleitungen, Sauna', meaning: 'Oberflächen können sehr heiß sein — Verbrennungsgefahr beim Anfassen.', action: 'Berühren vermeiden. Im Saunabereich Handtuch auf Holzbänke legen.' },
  { id: 'w7', cat: 'warnung', emoji: '🦠', name: 'Biogefährdung', norm: 'ISO 7010 W009', location: 'Erste-Hilfe-Raum, bei Blutkontamination', meaning: 'Biologische Gefährdung z.B. durch Blut oder Körperflüssigkeiten. Infektionsgefahr.', action: 'Einmalhandschuhe tragen. Bereich nach Hygieneplan desinfizieren.' },

  // GEBOTSCHILDER
  { id: 'g1', cat: 'gebot', emoji: '🚿', name: 'Vor dem Baden duschen', norm: 'DIN 19643', location: 'Eingang Beckenbereich, Duschbereich', meaning: 'Pflichtdusche ist gesetzlich vorgeschrieben. Entfernt Schweiß, Körperpflege und Keime vor dem Baden.', action: 'Badegäste freundlich auf die Duschpflicht hinweisen. Kein Betreten ohne Dusche.' },
  { id: 'g2', cat: 'gebot', emoji: '🦺', name: 'Schwimmhilfe tragen', norm: 'Hausordnung', location: 'Nichtschwimmerbereich, Freizeitbecken', meaning: 'Nichtschwimmer müssen in tiefen Bereichen eine Schwimmhilfe oder Schwimmweste tragen.', action: 'Nichtschwimmer ohne Schwimmhilfe aus tiefem Bereich bitten oder begleiten.' },
  { id: 'g3', cat: 'gebot', emoji: '🧤', name: 'Schutzhandschuhe tragen', norm: 'ISO 7010 M009', location: 'Chemikalienraum, Dosierstationen, Reinigung', meaning: 'Beim Umgang mit Chemikalien Pflicht — schützt vor Verätzungen und Hautschäden.', action: 'Nitril oder Neopren für Chlorprodukte. Latexallergie bei Kollegen beachten!' },
  { id: 'g4', cat: 'gebot', emoji: '🥽', name: 'Schutzbrille tragen', norm: 'ISO 7010 M004', location: 'Chemikaliendosierung, Filterspülung', meaning: 'Bei ätzenden Stoffen ist dichte Schutzbrille Pflicht. Spritzer können Erblindung verursachen.', action: 'Vollsichtbrille muss dicht anliegen — normale Brille reicht nicht!' },
  { id: 'g5', cat: 'gebot', emoji: '😷', name: 'Atemschutz tragen', norm: 'ISO 7010 M017', location: 'Chlorgasraum, bei starker Staubentwicklung', meaning: 'Atemschutz vorgeschrieben — schützt vor giftigen Gasen oder gefährlichem Staub.', action: 'Vollschutzmaske für Chlorgasraum. Halbmaske für Staubschutz. Vor Betreten anlegen.' },
  { id: 'g6', cat: 'gebot', emoji: '1️⃣', name: 'Einzeln benutzen', norm: 'DIN 19616 / Hausordnung', location: 'Wasserrutschen, Sprunganlagen', meaning: 'Rutsche oder Anlage darf immer nur von einer Person gleichzeitig genutzt werden.', action: 'Nächste Person erst loslassen wenn vorherige den Auslaufbereich verlassen hat. Aufsicht nötig.' },

  // RETTUNGSZEICHEN
  { id: 'r1', cat: 'rettung', emoji: '🛟', name: 'Rettungsring', norm: 'ISO 7010 E017', location: 'An jedem Becken, Außenanlagen, Stege', meaning: 'Zeigt den Standort des Rettungsrings. Muss immer einsatzbereit am angegebenen Platz hängen.', action: 'Täglich prüfen: vorhanden? Unbeschädigt? Leine aufgerollt? Fehlendes Gerät sofort melden.' },
  { id: 'r2', cat: 'rettung', emoji: '➕', name: 'Erste Hilfe', norm: 'ISO 7010 E003', location: 'Erste-Hilfe-Raum, Sanitätsecke, Eingang', meaning: 'Standort des Erste-Hilfe-Materials (Verbandkasten, Trage, AED). Im Notfall sofort aufsuchen.', action: 'Verbandkasten regelmäßig prüfen (vollständig, nicht abgelaufen). AED-Batterie und Pads prüfen.' },
  { id: 'r3', cat: 'rettung', emoji: '🚪', name: 'Notausgang', norm: 'ISO 7010 E001/E002', location: 'Alle Ausgänge, Fluchtwege, Treppenhäuser', meaning: 'Zeigt den Fluchtweg im Notfall. Muss immer freigehalten und beleuchtet sein (auch bei Stromausfall).', action: 'Niemals blockieren. Nachleuchtend oder beleuchtet — bei Ausfall sofort melden.' },
  { id: 'r4', cat: 'rettung', emoji: '❤️', name: 'Defibrillator (AED)', norm: 'ISO 7010 E010', location: 'Eingangsbereich, Aufsichtsraum, gut sichtbar', meaning: 'Standort des automatischen Defibrillators. Bei Herzstillstand sofort holen — AED erklärt die Bedienung selbst!', action: 'Standort auswendig kennen! Monatlich auf Betriebsbereitschaft prüfen.' },
  { id: 'r5', cat: 'rettung', emoji: '📞', name: 'Notruftelefon', norm: 'ISO 7010 E004', location: 'Aufsichtsraum, Eingang, Technikraum', meaning: 'Standort des Notruftelefons. Im Notfall: 112 wählen (Feuerwehr/Rettungsdienst).', action: 'Notrufnummer 112 kennen. Adresse der Anlage für den Notruf auswendig kennen.' },
  { id: 'r6', cat: 'rettung', emoji: '📍', name: 'Sammelstelle', norm: 'ISO 7010 E007', location: 'Außenbereich, Parkplatz, Evakuierungsplan', meaning: 'Treffpunkt im Notfall — alle Personen nach Evakuierung hier versammeln.', action: 'Allen Mitarbeitern bekannt machen. Bei Alarm alle dorthin führen und Personen zählen.' },

  // BRANDSCHUTZ
  { id: 'b1', cat: 'brandschutz', emoji: '🧯', name: 'Feuerlöscher', norm: 'ISO 7010 F001', location: 'Fluchtwege, Technikräume, Eingangsbereich', meaning: 'Standort des Feuerlöschers. Im Brandfall einsetzen — nur wenn eigene Flucht noch möglich!', action: 'Jährliche Wartung prüfen (Plakette). Druckanzeige im grünen Bereich. Nicht verrücken ohne Ersatz.' },
  { id: 'b2', cat: 'brandschutz', emoji: '🔔', name: 'Brandmelder / Auslöser', norm: 'ISO 7010 F005', location: 'Fluchtwege, alle Stockwerke', meaning: 'Manuelle Brandmeldeanlage — bei echtem Brand Scheibe einschlagen und auslösen. Alarmiert Feuerwehr automatisch.', action: 'Nur bei echtem Brand auslösen. Falscher Alarm kostet Geld und bindet Einsatzkräfte.' },
  { id: 'b3', cat: 'brandschutz', emoji: '🚿', name: 'Wandhydrant', norm: 'ISO 7010 F002', location: 'Flure, Treppenhäuser', meaning: 'Standort des Wandhydranten für Feuerwehr oder eingewiesenes Personal zur Brandbekämpfung.', action: 'Nur durch eingewiesenes Personal benutzen. Tür niemals blockieren oder versperren.' },
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
    intro: 'Im Schwimmbad kommen täglich viele Menschen zusammen — Kinder, Erwachsene, Nichtschwimmer, ältere Gäste. Schilder und Kennzeichnungen sind die erste Schutzlinie: Sie warnen vor Gefahren, zeigen Verbote, weisen Rettungswege aus und informieren über Regeln. Als FaBB musst du alle Schilder kennen, ihre Bedeutung erklären können und sicherstellen, dass sie lesbar, vollständig und korrekt angebracht sind.',
    motto: 'Ein fehlendes Schild kann ein Unfall sein, der nicht passiert wäre.',
    rules: [
      'Sicherheitszeichen sind in der ASR A1.3 (Technische Regeln für Arbeitsstätten) und der ISO 7010 geregelt.',
      'Farbe ist kein Zufall: Rot = Verbot/Gefahr, Gelb = Warnung, Grün = Rettung, Blau = Gebot.',
      'Alle Schilder müssen gut sichtbar, lesbar und unbeschädigt sein. Verblasste Schilder sofort ersetzen.',
      'Badeordnung und Hausordnung müssen gut sichtbar am Eingang und an den Becken ausgehängt sein.',
      'Nichtschwimmerbereiche müssen klar gekennzeichnet sein — mit Tiefenangaben und Warnschildern.',
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
