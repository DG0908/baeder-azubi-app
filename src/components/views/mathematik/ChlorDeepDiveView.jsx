import { useState } from 'react';
import { useApp } from '../../../context/AppContext';

/* ─── Tab data ──────────────────────────────────────────────────────────────── */

const TABS = {
  grundlagen: {
    id: 'grundlagen',
    chip: 'Grundlagen',
    title: 'Was ist Chlor-Dosierung?',
    intro:
      'Chlor toetet Keime im Beckenwasser ab. Damit das funktioniert, muss immer genug Chlor im Wasser sein — aber nicht zu viel! Als Fachangestellte/r musst du berechnen können, wie viel Chlor du ins Becken geben musst. Der wichtigste Trick dabei: 1 mg/L ist dasselbe wie 1 g/m³.',
    motto: '1 mg/L = 1 g/m³ — das ist dein Schluessel.',
    rules: [
      'Chlor desinfiziert das Wasser — es toetet Bakterien, Viren und Pilze ab.',
      'Der Chlorgehalt wird in mg/L (Milligramm pro Liter) gemessen.',
      'Der magische Umrechnungstrick: 1 mg/L ist GENAU dasselbe wie 1 g/m³.',
      'Gemessen wird mit der DPD-Methode (Tablette loest sich auf und faerbt das Wasser rosa).',
      'Es gibt freies Chlor (wirkt noch) und gebundenes Chlor (verbraucht) — zusammen ergibt das Gesamtchlor.'
    ],
    steps: [
      {
        title: '1. Was ist Aktivchlor?',
        text: 'Aktivchlor ist der Anteil im Chlorprodukt, der tatsaechlich desinfiziert. Nicht jedes Produkt ist 100% Aktivchlor — dazu später mehr. Wenn wir "Chlor dosieren" sagen, meinen wir erstmal Aktivchlor.'
      },
      {
        title: '2. Die magische Umrechnung',
        text: '1 mg/L = 1 g/m³. Das heisst: Wenn du den Chlorgehalt um 1 mg/L anheben willst, brauchst du pro Kubikmeter Wasser genau 1 Gramm Aktivchlor. Diesen Trick brauchst du bei JEDER Berechnung!'
      },
      {
        title: '3. Wie misst man Chlor?',
        text: 'Mit einem Photometer und DPD-Tabletten. DPD1 misst freies Chlor, DPD3 misst Gesamtchlor. Die Differenz ist das gebundene Chlor. Der Sollwert liegt meistens bei 0,3–0,6 mg/L freies Chlor.'
      },
      {
        title: '4. Warum ist die Dosierung so wichtig?',
        text: 'Zu wenig Chlor = Keime ueberleben = Gesundheitsgefahr. Zu viel Chlor = Augenreizung, Chlorgeruch, Beschwerden. Die richtige Menge schuetzt die Gaeste und haelt die Wasserqualität.'
      }
    ],
    examples: [
      {
        title: 'Umrechnung verstehen',
        given: 'Ein Becken hat 400 m³ Wasser. Der Chlorgehalt soll um 1 mg/L angehoben werden.',
        question: 'Wie viel Gramm Aktivchlor brauchst du?',
        steps: [
          ['Trick anwenden', '1 mg/L = 1 g/m³'],
          ['Bedeutung', 'Pro m³ Wasser brauchst du 1 g'],
          ['Rechnung', '1 g/m³ × 400 m³ = 400 g'],
          ['Ergebnis', '400 g Aktivchlor für 1 mg/L Anhebung']
        ]
      },
      {
        title: 'Kleiner Chlorwert-Anstieg',
        given: 'Ein Lehrschwimmbecken hat 150 m³. Der Chlorgehalt soll um 0,5 mg/L steigen.',
        question: 'Wie viel Aktivchlor ist nötig?',
        steps: [
          ['Trick anwenden', '0,5 mg/L = 0,5 g/m³'],
          ['Bedeutung', 'Pro m³ brauchst du 0,5 g'],
          ['Rechnung', '0,5 g × 150 m³ = 75 g'],
          ['Ergebnis', '75 g Aktivchlor']
        ]
      },
      {
        title: 'DPD-Messung interpretieren',
        given: 'DPD1 zeigt 0,2 mg/L freies Chlor. Der Sollwert ist 0,5 mg/L.',
        question: 'Um wie viel mg/L muss angehoben werden?',
        steps: [
          ['Ist-Wert', '0,2 mg/L freies Chlor'],
          ['Soll-Wert', '0,5 mg/L freies Chlor'],
          ['Differenz', '0,5 − 0,2 = 0,3 mg/L'],
          ['Ergebnis', 'Der Chlorgehalt muss um 0,3 mg/L angehoben werden']
        ]
      }
    ],
    pitfalls: [
      'mg/L und g/m³ NICHT verwechseln — sie sind zum Glueck gleich viel! 1 mg/L = 1 g/m³.',
      'Freies Chlor und Gesamtchlor sind NICHT dasselbe — dosiert wird nach freiem Chlor.',
      'DPD1 = freies Chlor, DPD3 = Gesamtchlor. Nicht durcheinanderbringen!',
      'Der Chlorbedarf im Becken ist NICHT gleich der Produktmenge — Produkte haben weniger als 100% Wirkstoff.'
    ],
    quiz: {
      question: 'Ein Becken hat 250 m³ Wasser. Du willst den Chlorgehalt um 1 mg/L anheben. Wie viel Gramm Aktivchlor brauchst du?',
      options: ['25 g', '250 g', '2.500 g'],
      correctIndex: 1,
      explanation: '1 mg/L = 1 g/m³. Also: 1 g × 250 m³ = 250 g Aktivchlor.'
    }
  },

  dosierung: {
    id: 'dosierung',
    chip: 'Dosierung',
    title: 'Aktivchlor-Menge berechnen',
    intro:
      'Die Grundformel ist ganz einfach: Aktivchlor in Gramm = Anhebung in mg/L × Beckenvolumen in m³. Weil 1 mg/L = 1 g/m³ ist, multiplizierst du einfach die gewuenschte Anhebung mit dem Volumen. Fertig!',
    motto: 'Aktivchlor (g) = Anhebung (mg/L) × Volumen (m³)',
    rules: [
      'Die Formel lautet: Aktivchlor (g) = Anhebung (mg/L) × Beckenvolumen (m³).',
      'Die Anhebung ist die DIFFERENZ zwischen Soll-Wert und Ist-Wert.',
      'Das Beckenvolumen findest du im Betriebsbuch oder rechnest es aus (Länge × Breite × Tiefe).',
      'Das Ergebnis ist in GRAMM Aktivchlor — noch NICHT die Produktmenge!',
      'Diese Formel funktioniert NUR weil 1 mg/L = 1 g/m³ ist.'
    ],
    steps: [
      {
        title: '1. Anhebung bestimmen',
        text: 'Miss den aktuellen Chlorwert (Ist-Wert) und vergleiche mit dem Sollwert. Die Differenz ist deine Anhebung. Beispiel: Soll 0,5 mg/L, Ist 0,2 mg/L → Anhebung = 0,3 mg/L.'
      },
      {
        title: '2. Beckenvolumen ermitteln',
        text: 'Schau im Betriebsbuch nach oder rechne: Länge × Breite × mittlere Tiefe = Volumen in m³. Ein 25m-Sportbecken mit 6 Bahnen und 1,8 m Tiefe: 25 × 12,5 × 1,8 = 562,5 m³.'
      },
      {
        title: '3. Formel anwenden',
        text: 'Aktivchlor (g) = Anhebung (mg/L) × Volumen (m³). Einfach die zwei Werte multiplizieren. Das Ergebnis sind Gramm Aktivchlor.'
      },
      {
        title: '4. Ergebnis prüfen',
        text: 'Faustformel: Für 0,3 mg/L Anhebung brauchst du pro 100 m³ etwa 30 g Aktivchlor. Liegt dein Ergebnis in dem Bereich? Dann passt es wahrscheinlich.'
      }
    ],
    examples: [
      {
        title: 'Standard-Dosierung Sportbecken',
        given: 'Sportbecken 500 m³. Chlor-Ist: 0,2 mg/L. Chlor-Soll: 0,5 mg/L.',
        question: 'Wie viel Gramm Aktivchlor müssen dosiert werden?',
        steps: [
          ['Anhebung', '0,5 − 0,2 = 0,3 mg/L'],
          ['Formel', 'Aktivchlor = 0,3 mg/L × 500 m³'],
          ['Rechnung', '0,3 × 500 = 150'],
          ['Ergebnis', '150 g Aktivchlor']
        ]
      },
      {
        title: 'Lehrschwimmbecken nachchloren',
        given: 'Lehrschwimmbecken 200 m³. Chlor-Ist: 0,1 mg/L. Chlor-Soll: 0,4 mg/L.',
        question: 'Wie viel Aktivchlor wird benötigt?',
        steps: [
          ['Anhebung', '0,4 − 0,1 = 0,3 mg/L'],
          ['Formel', 'Aktivchlor = 0,3 mg/L × 200 m³'],
          ['Rechnung', '0,3 × 200 = 60'],
          ['Ergebnis', '60 g Aktivchlor']
        ]
      },
      {
        title: 'Grosses Wellenbecken',
        given: 'Wellenbecken 800 m³. Chlor-Ist: 0,3 mg/L. Chlor-Soll: 0,6 mg/L.',
        question: 'Wie viel Aktivchlor braucht man?',
        steps: [
          ['Anhebung', '0,6 − 0,3 = 0,3 mg/L'],
          ['Formel', 'Aktivchlor = 0,3 mg/L × 800 m³'],
          ['Rechnung', '0,3 × 800 = 240'],
          ['Ergebnis', '240 g Aktivchlor']
        ]
      }
    ],
    pitfalls: [
      'NICHT vergessen die Differenz zu bilden — du rechnest mit der ANHEBUNG, nicht mit dem Sollwert!',
      'Das Volumen muss in m³ sein — nicht in Litern! (1 m³ = 1.000 Liter)',
      'Das Ergebnis ist AKTIVCHLOR in Gramm, noch nicht die Menge vom Produkt!',
      'Bei unregelmäßigen Becken: Die MITTLERE Tiefe nehmen, nicht die tiefste Stelle.'
    ],
    quiz: {
      question: 'Becken 300 m³, Ist-Wert 0,15 mg/L, Soll-Wert 0,45 mg/L. Wie viel Gramm Aktivchlor?',
      options: ['45 g', '90 g', '135 g'],
      correctIndex: 1,
      explanation: 'Anhebung: 0,45 − 0,15 = 0,3 mg/L. Aktivchlor = 0,3 × 300 = 90 g.'
    }
  },

  produktmenge: {
    id: 'produktmenge',
    chip: 'Produktmenge',
    title: 'Vom Aktivchlor zur Produktmenge',
    intro:
      'Kein Chlorprodukt ist 100% Aktivchlor! Calciumhypochlorit (Granulat) hat ca. 65% Wirkstoff, Natriumhypochlorit (Flüssigchlor) nur ca. 13%. Du musst also mehr Produkt nehmen als Aktivchlor berechnet wurde. Die Formel: Produktmenge = Aktivchlor ÷ Wirkstoffanteil.',
    motto: 'Produkt = Aktivchlor ÷ Wirkstoffanteil',
    rules: [
      'Calciumhypochlorit (Ca(ClO)₂) hat ca. 65% Aktivchlor (als Dezimalzahl: 0,65).',
      'Natriumhypochlorit (NaClO) hat ca. 13% Aktivchlor (als Dezimalzahl: 0,13).',
      'Die Formel: Produktmenge = Aktivchlor (g) ÷ Wirkstoffanteil (als Dezimalzahl).',
      'Den Wirkstoffanteil findest du auf dem Produktetikett oder im Sicherheitsdatenblatt.',
      'Je niedriger der Wirkstoffanteil, desto MEHR Produkt brauchst du.'
    ],
    steps: [
      {
        title: '1. Aktivchlor-Bedarf kennen',
        text: 'Zuerst berechnest du wie gewohnt den Aktivchlor-Bedarf: Anhebung (mg/L) × Volumen (m³) = Aktivchlor in Gramm.'
      },
      {
        title: '2. Wirkstoffanteil nachschlagen',
        text: 'Schau auf dem Etikett nach: Calciumhypochlorit ca. 65% → 0,65. Natriumhypochlorit ca. 13% → 0,13. Den Prozentwert IMMER in eine Dezimalzahl umrechnen (÷ 100).'
      },
      {
        title: '3. Produktmenge berechnen',
        text: 'Produktmenge = Aktivchlor ÷ Wirkstoffanteil. Beispiel: 150 g Aktivchlor ÷ 0,65 = 230,8 g Calciumhypochlorit.'
      },
      {
        title: '4. Ergebnis prüfen',
        text: 'Die Produktmenge muss IMMER größer sein als die Aktivchlor-Menge (weil kein Produkt 100% hat). Wenn dein Ergebnis kleiner ist, hast du falsch gerechnet!'
      }
    ],
    examples: [
      {
        title: 'Calciumhypochlorit-Granulat',
        given: 'Du brauchst 150 g Aktivchlor. Das Produkt ist Calciumhypochlorit (65% Wirkstoff).',
        question: 'Wie viel Granulat musst du abwiegen?',
        steps: [
          ['Aktivchlor-Bedarf', '150 g'],
          ['Wirkstoffanteil', '65% = 0,65'],
          ['Formel', '150 g ÷ 0,65'],
          ['Ergebnis', '230,8 g ≈ 231 g Calciumhypochlorit']
        ]
      },
      {
        title: 'Natriumhypochlorit-Lösung',
        given: 'Du brauchst 150 g Aktivchlor. Das Produkt ist Natriumhypochlorit (13% Wirkstoff).',
        question: 'Wie viel Flüssigchlor brauchst du?',
        steps: [
          ['Aktivchlor-Bedarf', '150 g'],
          ['Wirkstoffanteil', '13% = 0,13'],
          ['Formel', '150 g ÷ 0,13'],
          ['Ergebnis', '1.153,8 g ≈ 1.154 g (ca. 1,15 kg) Natriumhypochlorit']
        ]
      },
      {
        title: 'Vergleich beider Produkte',
        given: 'Sportbecken 500 m³, Anhebung 0,3 mg/L → 150 g Aktivchlor benötigt.',
        question: 'Wie viel Produkt bei Calciumhypochlorit vs. Natriumhypochlorit?',
        steps: [
          ['Aktivchlor-Bedarf', '150 g (gleich für beide)'],
          ['Calciumhypochlorit', '150 ÷ 0,65 = 231 g Granulat'],
          ['Natriumhypochlorit', '150 ÷ 0,13 = 1.154 g Flüssigchlor'],
          ['Ergebnis', 'Flüssigchlor braucht man ca. 5× so viel wie Granulat!']
        ]
      }
    ],
    pitfalls: [
      'NICHT multiplizieren statt dividieren! Produktmenge ist IMMER größer als Aktivchlor-Menge.',
      'Prozent in Dezimalzahl umrechnen: 65% = 0,65 (nicht 65!). Sonst ist das Ergebnis 100× zu klein.',
      'Verschiedene Hersteller haben leicht unterschiedliche Wirkstoffanteile — immer das Etikett prüfen!',
      'Flüssigchlor (Natriumhypochlorit) hat deutlich weniger Wirkstoff als Granulat — darum braucht man viel mehr davon.'
    ],
    quiz: {
      question: 'Du brauchst 200 g Aktivchlor und hast Calciumhypochlorit (65%). Wie viel Granulat brauchst du?',
      options: ['130 g', '200 g', '308 g'],
      correctIndex: 2,
      explanation: '200 g ÷ 0,65 = 307,7 g ≈ 308 g Calciumhypochlorit.'
    }
  },

  praxis: {
    id: 'praxis',
    chip: 'Praxis',
    title: 'Chlor-Dosierung im Bäderalltag',
    intro:
      'Hier uebst du die komplette Berechnung von Anfang bis Ende: Chlorwert messen, Anhebung bestimmen, Aktivchlor berechnen, Produktmenge ermitteln. Genau so, wie du es jeden Tag im Bad und in der Prüfung brauchst!',
    motto: 'Messen → Rechnen → Dosieren → Kontrollieren.',
    rules: [
      'Im Alltag laeuft die Dosierung meistens automatisch über die Messanlage.',
      'Manuelle Nachdosierung ist nötig bei Störungen, hoher Belastung oder nach der Revision.',
      'Stosschlorung (Schockchlorung) bedeutet: Chlorgehalt auf 1,0–2,0 mg/L anheben.',
      'Nach der Stosschlorung darf NIEMAND ins Wasser, bis der Wert wieder unter 0,6 mg/L ist!',
      'Prüfungsaufgaben kombinieren oft alle Schritte: Anhebung + Aktivchlor + Produktmenge.'
    ],
    steps: [
      {
        title: '1. Messen und Differenz bilden',
        text: 'Miss den Ist-Wert mit DPD1. Bestimme den Soll-Wert (Betriebsanweisung). Bilde die Differenz: Soll − Ist = Anhebung in mg/L.'
      },
      {
        title: '2. Aktivchlor berechnen',
        text: 'Aktivchlor (g) = Anhebung (mg/L) × Beckenvolumen (m³). Das ist die Menge reines Aktivchlor, die ins Wasser muss.'
      },
      {
        title: '3. Produktmenge berechnen',
        text: 'Produktmenge = Aktivchlor (g) ÷ Wirkstoffanteil. Je nach Produkt (Granulat 0,65 oder flüssig 0,13) brauchst du unterschiedlich viel.'
      },
      {
        title: '4. Dosieren und kontrollieren',
        text: 'Produkt abwiegen, dem Wasser zugeben (Dosierschleuse oder Anlage). Nach 30 Minuten Umwaelzung nochmal messen. Liegt der Wert im Soll? Fertig!'
      }
    ],
    examples: [
      {
        title: 'Komplettberechnung: Sportbecken',
        given: 'Sportbecken 500 m³. Ist: 0,2 mg/L. Soll: 0,5 mg/L. Produkt: Calciumhypochlorit (65%).',
        question: 'Wie viel Granulat muss dosiert werden?',
        steps: [
          ['Anhebung', '0,5 − 0,2 = 0,3 mg/L'],
          ['Aktivchlor', '0,3 × 500 = 150 g'],
          ['Produktmenge', '150 ÷ 0,65 = 230,8 g'],
          ['Ergebnis', 'Ca. 231 g Calciumhypochlorit-Granulat dosieren']
        ]
      },
      {
        title: 'Komplettberechnung: Kinderbecken',
        given: 'Kinderbecken 80 m³. Ist: 0,25 mg/L. Soll: 0,55 mg/L. Produkt: Natriumhypochlorit (13%).',
        question: 'Wie viel Flüssigchlor wird benötigt?',
        steps: [
          ['Anhebung', '0,55 − 0,25 = 0,3 mg/L'],
          ['Aktivchlor', '0,3 × 80 = 24 g'],
          ['Produktmenge', '24 ÷ 0,13 = 184,6 g'],
          ['Ergebnis', 'Ca. 185 g (≈ 0,185 kg) Natriumhypochlorit dosieren']
        ]
      },
      {
        title: 'Stosschlorung nach Verunreinigung',
        given: 'Freizeitbecken 600 m³. Ist: 0,3 mg/L. Soll bei Stosschlorung: 1,5 mg/L. Produkt: Calciumhypochlorit (65%).',
        question: 'Wie viel Granulat für die Stosschlorung?',
        steps: [
          ['Anhebung', '1,5 − 0,3 = 1,2 mg/L'],
          ['Aktivchlor', '1,2 × 600 = 720 g'],
          ['Produktmenge', '720 ÷ 0,65 = 1.107,7 g'],
          ['Ergebnis', 'Ca. 1.108 g (≈ 1,1 kg) Calciumhypochlorit — Becken sperren bis Wert unter 0,6 mg/L!']
        ]
      },
      {
        title: 'Tagesroutine: Morgendliche Nachdosierung',
        given: 'Schwimmerbecken 450 m³. Morgenmessung: 0,15 mg/L. Soll: 0,45 mg/L. Produkt: Calciumhypochlorit (65%).',
        question: 'Wie viel Granulat vor Badeöffnung?',
        steps: [
          ['Anhebung', '0,45 − 0,15 = 0,3 mg/L'],
          ['Aktivchlor', '0,3 × 450 = 135 g'],
          ['Produktmenge', '135 ÷ 0,65 = 207,7 g'],
          ['Ergebnis', 'Ca. 208 g Calciumhypochlorit-Granulat dosieren']
        ]
      }
    ],
    pitfalls: [
      'Bei der Stosschlorung: IMMER das Becken sperren! Badegaeste dürfen erst wieder rein, wenn der Wert unter 0,6 mg/L liegt.',
      'In der Prüfung werden oft ALLE drei Schritte abgefragt (Anhebung, Aktivchlor, Produktmenge) — keinen vergessen!',
      'Nicht einfach "nach Gefuehl" dosieren — immer rechnen und messen. Zu viel Chlor ist genauso schlimm wie zu wenig.',
      'Nach dem Dosieren mindestens 30 Minuten warten und dann nachmessen — der Wert braucht Zeit zum Verteilen.'
    ],
    quiz: {
      question: 'Becken 400 m³, Ist 0,1 mg/L, Soll 0,4 mg/L, Calciumhypochlorit (65%). Wie viel Granulat?',
      options: ['120 g', '185 g', '280 g'],
      correctIndex: 1,
      explanation: 'Anhebung: 0,4 − 0,1 = 0,3 mg/L. Aktivchlor: 0,3 × 400 = 120 g. Produkt: 120 ÷ 0,65 = 184,6 g ≈ 185 g.'
    }
  }
};

const TAB_ORDER = ['grundlagen', 'dosierung', 'produktmenge', 'praxis'];

/* ─── Product comparison table ─────────────────────────────────────────────── */

const PRODUCT_COMPARISON = [
  ['Chemischer Name', 'Calciumhypochlorit', 'Natriumhypochlorit'],
  ['Kurzform', 'Ca(ClO)₂', 'NaClO'],
  ['Handelsform', 'Granulat / Tabletten', 'Flüssigkeit'],
  ['Wirkstoffanteil', 'ca. 65%', 'ca. 13%'],
  ['Dezimalzahl', '0,65', '0,13'],
  ['Lagerung', 'Trocken, kuehle Lagerung', 'Dunkel, kuehle Lagerung']
];

/* ─── Shared components ─────────────────────────────────────────────────────── */

function InfoCard({ darkMode, title, children }) {
  return (
    <div className={`rounded-2xl border p-4 ${darkMode ? 'bg-slate-900/75 border-slate-800' : 'bg-white border-gray-200'}`}>
      <h3 className={`text-sm font-bold uppercase tracking-wide mb-3 ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>
        {title}
      </h3>
      {children}
    </div>
  );
}

function StepCards({ steps, darkMode }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {steps.map((step) => (
        <div
          key={step.title}
          className={`rounded-2xl border p-4 ${darkMode ? 'border-slate-800 bg-slate-950/70' : 'border-teal-100 bg-teal-50/60'}`}
        >
          <div className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {step.title}
          </div>
          <p className={`text-sm mt-2 leading-7 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
            {step.text}
          </p>
        </div>
      ))}
    </div>
  );
}

function ExampleCard({ example, darkMode }) {
  return (
    <div className={`rounded-2xl border p-4 ${darkMode ? 'border-slate-800 bg-slate-950/70' : 'border-teal-100 bg-teal-50/40'}`}>
      <div className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        {example.title}
      </div>
      <p className={`text-sm mt-1 leading-6 ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
        {example.given}
      </p>
      <p className={`text-sm font-medium mt-1 ${darkMode ? 'text-teal-300' : 'text-teal-700'}`}>
        {example.question}
      </p>
      <div className="overflow-hidden rounded-xl border mt-3 border-transparent">
        <table className="min-w-full text-sm">
          <tbody>
            {example.steps.map(([label, value]) => (
              <tr key={label} className={`${darkMode ? 'border-slate-800' : 'border-gray-200'} border-b last:border-b-0`}>
                <td className={`px-3 py-2 font-semibold whitespace-nowrap ${darkMode ? 'bg-slate-950/50 text-white' : 'bg-gray-50 text-gray-900'}`}>
                  {label}
                </td>
                <td className={`px-3 py-2 ${darkMode ? 'bg-slate-900/40 text-slate-300' : 'bg-white text-gray-700'}`}>
                  {value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── Main component ────────────────────────────────────────────────────────── */

export default function ChlorDeepDiveView() {
  const { darkMode } = useApp();
  const [activeTab, setActiveTab] = useState('grundlagen');
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [revealedAnswer, setRevealedAnswer] = useState(false);

  const tab = TABS[activeTab] || TABS.grundlagen;
  const isCorrect = selectedAnswer === tab.quiz.correctIndex;

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSelectedAnswer(null);
    setRevealedAnswer(false);
  };

  return (
    <div className="space-y-5">
      {/* ── Hero header ─────────────────────────────────────────────────── */}
      <div className={`rounded-3xl border p-6 ${darkMode ? 'bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 border-slate-800' : 'bg-gradient-to-br from-teal-50 via-white to-emerald-50 border-teal-100'}`}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold ${darkMode ? 'bg-teal-500/15 text-teal-300' : 'bg-teal-100 text-teal-700'}`}>
              <span>MATHEMATIK</span>
              <span>{tab.chip}</span>
            </div>
            <h2 className={`text-3xl font-bold mt-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {tab.title}
            </h2>
            <p className={`text-sm mt-3 leading-7 ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>
              {tab.intro}
            </p>
          </div>
          <div className={`rounded-2xl px-4 py-3 border ${darkMode ? 'bg-slate-950/70 border-slate-800 text-slate-300' : 'bg-white/90 border-teal-100 text-gray-700'}`}>
            <div className="text-xs uppercase tracking-wide opacity-70">Merksatz</div>
            <div className="text-sm font-semibold mt-1">{tab.motto}</div>
          </div>
        </div>
      </div>

      {/* ── Tab navigation ──────────────────────────────────────────────── */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        {TAB_ORDER.map((tabId) => {
          const entry = TABS[tabId];
          const active = tabId === activeTab;
          return (
            <button
              key={tabId}
              type="button"
              onClick={() => handleTabChange(tabId)}
              className={`rounded-2xl border p-4 text-left transition-all ${
                active
                  ? darkMode
                    ? 'border-teal-400 bg-teal-500/10 shadow-lg shadow-teal-900/20'
                    : 'border-teal-300 bg-teal-50 shadow-sm'
                  : darkMode
                    ? 'border-slate-800 bg-slate-900/70 hover:border-slate-700'
                    : 'border-gray-200 bg-white hover:border-teal-200'
              }`}
            >
              <div className={`text-xs font-bold uppercase tracking-wide ${active ? (darkMode ? 'text-teal-300' : 'text-teal-700') : (darkMode ? 'text-slate-400' : 'text-gray-500')}`}>
                {entry.chip}
              </div>
              <div className={`text-sm font-semibold mt-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {entry.title}
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Main content grid ───────────────────────────────────────────── */}
      <div className="grid gap-5 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-5">
          {/* Rules */}
          <InfoCard darkMode={darkMode} title="Regeln auf einen Blick">
            <ul className={`space-y-2 text-sm leading-7 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              {tab.rules.map((rule) => (
                <li key={rule} className="flex gap-2">
                  <span className={`mt-2 h-2 w-2 shrink-0 rounded-full ${darkMode ? 'bg-teal-400' : 'bg-teal-500'}`} />
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </InfoCard>

          {/* Steps */}
          <InfoCard darkMode={darkMode} title="Schritt für Schritt">
            <StepCards steps={tab.steps} darkMode={darkMode} />
          </InfoCard>

          {/* Worked examples */}
          <InfoCard darkMode={darkMode} title="Durchgerechnete Beispiele">
            <div className="space-y-4">
              {tab.examples.map((example) => (
                <ExampleCard key={example.title} example={example} darkMode={darkMode} />
              ))}
            </div>
          </InfoCard>
        </div>

        {/* ── Right sidebar ───────────────────────────────────────────── */}
        <div className="space-y-5">
          {/* Pitfalls */}
          <InfoCard darkMode={darkMode} title="Typische Fehler">
            <ul className={`space-y-2 text-sm leading-7 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              {tab.pitfalls.map((pitfall) => (
                <li key={pitfall} className="flex gap-2">
                  <span className={`mt-2 h-2 w-2 shrink-0 rounded-full ${darkMode ? 'bg-amber-400' : 'bg-amber-500'}`} />
                  <span>{pitfall}</span>
                </li>
              ))}
            </ul>
          </InfoCard>

          {/* Product comparison table (on produktmenge and praxis tabs) */}
          {(activeTab === 'produktmenge' || activeTab === 'praxis') && (
            <InfoCard darkMode={darkMode} title="Vergleich: Chlorprodukte">
              <div className="overflow-hidden rounded-xl border border-transparent">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className={darkMode ? 'border-slate-800' : 'border-gray-200'}>
                      <th className={`px-3 py-2 text-left font-semibold ${darkMode ? 'bg-slate-950/50 text-slate-400' : 'bg-gray-50 text-gray-500'}`} />
                      <th className={`px-3 py-2 text-left font-semibold ${darkMode ? 'bg-teal-900/30 text-teal-300' : 'bg-teal-50 text-teal-700'}`}>
                        Calciumhypochlorit
                      </th>
                      <th className={`px-3 py-2 text-left font-semibold ${darkMode ? 'bg-amber-900/20 text-amber-300' : 'bg-amber-50 text-amber-700'}`}>
                        Natriumhypochlorit
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {PRODUCT_COMPARISON.map(([label, calc, natr]) => (
                      <tr key={label} className={`${darkMode ? 'border-slate-800' : 'border-gray-200'} border-b last:border-b-0`}>
                        <td className={`px-3 py-2 font-semibold whitespace-nowrap ${darkMode ? 'bg-slate-950/50 text-white' : 'bg-gray-50 text-gray-900'}`}>
                          {label}
                        </td>
                        <td className={`px-3 py-2 ${darkMode ? 'bg-slate-900/40 text-slate-300' : 'bg-white text-gray-700'}`}>
                          {calc}
                        </td>
                        <td className={`px-3 py-2 ${darkMode ? 'bg-slate-900/40 text-slate-300' : 'bg-white text-gray-700'}`}>
                          {natr}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </InfoCard>
          )}

          {/* Formula quick-reference (on grundlagen and dosierung tabs) */}
          {(activeTab === 'grundlagen' || activeTab === 'dosierung') && (
            <InfoCard darkMode={darkMode} title="Formel-Spickzettel">
              <div className="space-y-3">
                <div className={`rounded-xl border p-3 ${darkMode ? 'border-teal-500/30 bg-teal-500/10' : 'border-teal-200 bg-teal-50'}`}>
                  <div className={`text-sm font-semibold ${darkMode ? 'text-teal-300' : 'text-teal-700'}`}>
                    Umrechnungstrick
                  </div>
                  <p className={`text-sm mt-1 leading-6 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    1 mg/L = 1 g/m³
                  </p>
                  <p className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                    Diesen Trick brauchst du bei jeder Chlor-Berechnung!
                  </p>
                </div>
                <div className={`rounded-xl border p-3 ${darkMode ? 'border-amber-500/30 bg-amber-500/10' : 'border-amber-200 bg-amber-50'}`}>
                  <div className={`text-sm font-semibold ${darkMode ? 'text-amber-300' : 'text-amber-700'}`}>
                    Dosierformel
                  </div>
                  <p className={`text-sm mt-1 leading-6 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    Aktivchlor (g) = Anhebung (mg/L) × Volumen (m³)
                  </p>
                  <p className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                    Erst Soll − Ist = Anhebung, dann multiplizieren
                  </p>
                </div>
              </div>
            </InfoCard>
          )}

          {/* Mini-Quiz */}
          <InfoCard darkMode={darkMode} title="Mini-Quiz">
            <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {tab.quiz.question}
            </div>
            <div className="mt-4 space-y-2">
              {tab.quiz.options.map((option, index) => {
                const active = selectedAnswer === index;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setSelectedAnswer(index)}
                    className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition-all ${
                      active
                        ? darkMode
                          ? 'border-teal-400 bg-teal-500/10 text-white'
                          : 'border-teal-300 bg-teal-50 text-gray-900'
                        : darkMode
                          ? 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-teal-200'
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              onClick={() => setRevealedAnswer(true)}
              disabled={selectedAnswer === null}
              className={`mt-4 w-full rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                selectedAnswer === null
                  ? 'cursor-not-allowed bg-gray-200 text-gray-400'
                  : darkMode
                    ? 'bg-teal-500 text-white hover:bg-teal-400'
                    : 'bg-teal-600 text-white hover:bg-teal-500'
              }`}
            >
              Antwort prüfen
            </button>
            {revealedAnswer && (
              <div className={`mt-4 rounded-2xl border p-4 text-sm leading-7 ${
                isCorrect
                  ? darkMode
                    ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200'
                    : 'border-emerald-200 bg-emerald-50 text-emerald-800'
                  : darkMode
                    ? 'border-amber-500/40 bg-amber-500/10 text-amber-100'
                    : 'border-amber-200 bg-amber-50 text-amber-800'
              }`}>
                <div className="font-semibold">
                  {isCorrect ? 'Richtig!' : 'Noch nicht ganz.'}
                </div>
                <div>{tab.quiz.explanation}</div>
              </div>
            )}
          </InfoCard>
        </div>
      </div>
    </div>
  );
}
