import { useState } from 'react';
import { useApp } from '../../../context/AppContext';

/* ─── Tab data ──────────────────────────────────────────────────────────────── */

const TABS = {
  grundlagen: {
    id: 'grundlagen',
    chip: 'Grundlagen',
    title: 'Was ist der pH-Wert?',
    intro:
      'Der pH-Wert sagt dir, ob eine Flüssigkeit sauer, neutral oder basisch (= alkalisch) ist. Die Skala geht von 0 bis 14. Alles unter 7 ist sauer, genau 7 ist neutral, alles über 7 ist basisch. Im Schwimmbad ist der pH-Wert super wichtig: Nur wenn er stimmt, wirkt das Chlor richtig und die Badegäste bekommen keine Hautprobleme.',
    motto: 'pH 0–6 = sauer, pH 7 = neutral, pH 8–14 = basisch.',
    rules: [
      'Die pH-Skala geht von 0 (stark sauer) bis 14 (stark basisch). 7 ist genau in der Mitte = neutral.',
      'Im Schwimmbad muss der pH-Wert zwischen 6,5 und 7,8 liegen (DIN 19643-1, Praxis meist 6,8–7,4). Ideal ist 7,0 bis 7,2.',
      'Ist der pH zu niedrig (unter 6,5): Die Haut und Augen werden gereizt, Metalle im Becken rosten.',
      'Ist der pH zu hoch (über 7,6): Das Chlor wirkt kaum noch — Keime können sich vermehren!',
      'Du misst den pH-Wert täglich — entweder mit der Messzelle der Dosieranlage oder mit einer Handmessung (DPD/Phenolrot).'
    ],
    steps: [
      {
        title: '1. pH-Wert messen',
        text: 'Nimm eine Wasserprobe aus dem Becken (nicht am Einlauf!). Miss mit Testkit oder Photometer. Ergebnis ablesen und ins Betriebstagebuch eintragen.'
      },
      {
        title: '2. Wert einordnen',
        text: 'Liegt der Wert zwischen 6,5 und 7,8? Dann ist alles in Ordnung. Liegt er ausserhalb, muss korrigiert werden.'
      },
      {
        title: '3. Alltagsbeispiele merken',
        text: 'Zitronensaft hat pH 2 (sehr sauer), reines Wasser hat pH 7 (neutral), Seife hat pH 9 (basisch). Das hilft dir, die Skala einzuschätzen.'
      },
      {
        title: '4. Zusammenhang mit Chlor beachten',
        text: 'Bei pH 7,0 wirkt Chlor etwa 3-mal besser als bei pH 8,0. Deshalb IMMER zuerst den pH korrigieren, dann Chlor nachregeln!'
      }
    ],
    examples: [
      {
        title: 'pH-Skala im Alltag',
        given: 'Hier siehst du typische pH-Werte von bekannten Stoffen.',
        question: 'Welche sind sauer, welche basisch?',
        steps: [
          ['Magensäure', 'pH 1 — stark sauer'],
          ['Zitronensaft', 'pH 2 — sauer'],
          ['Cola', 'pH 3 — sauer'],
          ['Reines Wasser', 'pH 7 — neutral'],
          ['Seife', 'pH 9 — basisch'],
          ['Bleichmittel', 'pH 13 — stark basisch']
        ]
      },
      {
        title: 'pH-Wert im Schwimmbecken',
        given: 'Du misst morgens den pH-Wert im Sportbecken. Das Photometer zeigt pH 7,9.',
        question: 'Ist der Wert in Ordnung?',
        steps: [
          ['Messwert', 'pH 7,9'],
          ['Erlaubter Bereich', 'pH 6,5 bis 7,8 (DIN 19643-1)'],
          ['Bewertung', '7,9 liegt UEBER dem erlaubten Bereich'],
          ['Maßnahme', 'pH muss gesenkt werden (Säure zugeben)']
        ]
      },
      {
        title: 'Warum Chlor bei hohem pH nicht wirkt',
        given: 'Bei pH 7,0 liegt ca. 73 % des Chlors als wirksame Hypochlorsäure (HOCl) vor. Bei pH 8,0 sind es nur noch ca. 22 %.',
        question: 'Was bedeutet das für die Desinfektion?',
        steps: [
          ['pH 7,0', '73 % wirksames Chlor (HOCl)'],
          ['pH 7,5', 'ca. 50 % wirksames Chlor'],
          ['pH 8,0', 'nur 22 % wirksames Chlor'],
          ['Ergebnis', 'Bei pH 8,0 braucht man 3× mehr Chlor für die gleiche Wirkung!']
        ]
      }
    ],
    pitfalls: [
      'pH-Wert und Chlorwert hängen zusammen — IMMER zuerst den pH korrigieren, dann Chlor anpassen!',
      'Wasserprobe nicht am Einlauf nehmen! Dort ist das Wasser frisch dosiert und nicht repräsentativ.',
      'Phenolrot-Tabletten (Handmessung) verfaerben sich bei pH über 8,2 violett — das heißt NICHT \"alles OK\"!',
      'Ein pH-Sprung von 7 auf 8 klingt klein, ist aber eine 10-fache Änderung (logarithmische Skala).'
    ],
    quiz: {
      question: 'Der pH-Wert im Schwimmbecken muss laut DIN 19643 zwischen welchen Werten liegen?',
      options: ['5,0 und 6,5', '6,5 und 7,8', '7,8 und 9,0'],
      correctIndex: 1,
      explanation: 'Laut DIN 19643 muss der pH-Wert zwischen 6,5 und 7,8 liegen. Ideal ist 7,0 bis 7,2.'
    }
  },

  säuren: {
    id: 'säuren',
    chip: 'Säuren',
    title: 'Säuren im Bäderalltag',
    intro:
      'Säuren sind Stoffe, die in Wasser H⁺-Ionen (Wasserstoff-Ionen) abgeben. Du erkennst sie oft daran, dass ihre Formel mit H beginnt, z.B. HCl (Salzsäure). Im Schwimmbad brauchst du Säuren, um den pH-Wert zu senken, wenn er zu hoch ist. Aber Vorsicht: Säuren können Verätzungen verursachen!',
    motto: 'Säuren senken den pH-Wert — Formel beginnt oft mit H.',
    rules: [
      'Säuren geben H⁺-Ionen (Protonen) ab — das macht sie sauer.',
      'Der pH-Wert von Säuren liegt unter 7. Je niedriger, desto stärker die Säure.',
      'Erkennungsmerkmal: Die chemische Formel beginnt oft mit H (HCl, H₂SO₄, HNO₃).',
      'Im Schwimmbad nutzt man Säuren als pH-Senker: Salzsäure (HCl) oder Natriumhydrogensulfat (NaHSO₄).',
      'WICHTIGSTE Sicherheitsregel: Immer Säure ins Wasser giessen, NIE Wasser in Säure! (Merke: Zuerst das Wasser, dann die Säure, sonst geschieht das Ungeheure!)'
    ],
    steps: [
      {
        title: '1. Säure erkennen',
        text: 'Schau auf die Formel: Beginnt sie mit H? Dann ist es wahrscheinlich eine Säure. Beispiele: HCl (Salzsäure), H₂SO₄ (Schwefelsäure).'
      },
      {
        title: '2. Einsatz im Bad',
        text: 'Wenn der pH-Wert zu hoch ist (z.B. pH 7,8), wird Säure zugegeben, um den pH zu senken. Die Dosieranlage macht das oft automatisch.'
      },
      {
        title: '3. Neutralisation verstehen',
        text: 'Säure + Base ergibt Salz + Wasser. Beispiel: HCl + NaOH → NaCl + H₂O. Das ist das Grundprinzip der pH-Korrektur.'
      },
      {
        title: '4. Sicherheit beachten',
        text: 'Schutzbrille, Handschuhe und Schutzkleidung sind Pflicht! Bei Hautkontakt sofort mit viel Wasser spülen. Säuredaempfe nicht einatmen!'
      }
    ],
    examples: [
      {
        title: 'Wichtige Säuren im Schwimmbad',
        given: 'Diese Säuren begegnen dir im Bäderalltag.',
        question: 'Wofür werden sie eingesetzt?',
        steps: [
          ['Salzsäure (HCl)', 'pH-Senker Nr. 1 — wird am häufigsten eingesetzt'],
          ['Schwefelsäure (H₂SO₄)', 'pH-Senker, aber seltener wegen Sulfat-Problematik'],
          ['NaHSO₄', 'Natriumhydrogensulfat — fester pH-Senker, einfacher in der Handhabung'],
          ['Kohlensäure (CO₂)', 'Wird als Gas eingeleitet — besonders schonender pH-Senker']
        ]
      },
      {
        title: 'Neutralisation einfach erklärt',
        given: 'Salzsäure (HCl) trifft auf Natronlauge (NaOH).',
        question: 'Was passiert bei dieser Reaktion?',
        steps: [
          ['Säure', 'HCl gibt H⁺ ab'],
          ['Base', 'NaOH gibt OH⁻ ab'],
          ['Reaktion', 'H⁺ + OH⁻ → H₂O (Wasser)'],
          ['Ergebnis', 'HCl + NaOH → NaCl (Kochsalz) + H₂O (Wasser)']
        ]
      },
      {
        title: 'Warum Säure ins Wasser?',
        given: 'Du musst Salzsäure verdünnen. Wie machst du es richtig?',
        question: 'Welche Reihenfolge ist sicher?',
        steps: [
          ['RICHTIG', 'Zuerst Wasser in den Behälter, DANN Säure langsam dazugiessen'],
          ['FALSCH', 'Wasser auf konzentrierte Säure giessen — es spritzt und kocht!'],
          ['Warum?', 'Säure + Wasser erzeugt Hitze. Bei wenig Wasser kocht es sofort und spritzt!'],
          ['Merksatz', '\"Erst das Wasser, dann die Säure, sonst geschieht das Ungeheure!\"']
        ]
      }
    ],
    pitfalls: [
      'Säuren und Chlor NIEMALS mischen! Es entsteht giftiges Chlorgas — Lebensgefahr!',
      'Salzsäure dampft an der Luft — immer gut lüften und Dämpfe nicht einatmen!',
      'Konzentrierte Säure verursacht sofort Verätzungen. Auch verdünnte Säure kann bei längerem Kontakt die Haut schädigen.',
      'Beim Dosieren immer den Messbecher spülen — Säurereste im Becher verfaelschen die nächste Messung.'
    ],
    quiz: {
      question: 'Was ist die wichtigste Sicherheitsregel beim Verdünnen von Säure?',
      options: [
        'Wasser in die Säure giessen',
        'Säure in das Wasser giessen',
        'Beides gleichzeitig zusammenschütten'
      ],
      correctIndex: 1,
      explanation: 'Immer Säure ins Wasser giessen! Merksatz: \"Erst das Wasser, dann die Säure, sonst geschieht das Ungeheure!\"'
    }
  },

  basen: {
    id: 'basen',
    chip: 'Basen',
    title: 'Basen (Laugen) im Bäderalltag',
    intro:
      'Basen sind das Gegenteil von Säuren: Sie nehmen H⁺-Ionen auf und erhöhen den pH-Wert. Du erkennst sie oft daran, dass ihre Formel OH enthält (z.B. NaOH). Im Schwimmbad brauchst du Basen, um den pH-Wert anzuheben, wenn er zu niedrig ist. Basen fühlen sich seifig an — aber fass sie nie ohne Handschuhe an!',
    motto: 'Basen heben den pH-Wert — enthalten oft OH in der Formel.',
    rules: [
      'Basen nehmen H⁺-Ionen auf (oder geben OH⁻-Ionen ab). Das macht die Lösung basisch/alkalisch.',
      'Der pH-Wert von Basen liegt über 7. Je höher, desto stärker die Base.',
      'Erkennungsmerkmal: Enthalten oft eine OH-Gruppe — z.B. NaOH (Natronlauge), Ca(OH)₂ (Kalkwasser).',
      'Im Schwimmbad nutzt man Basen als pH-Heber: Natriumcarbonat (Na₂CO₃, Soda) ist am gängigsten.',
      'Der KS4,3-Wert (Säurekapazität) sagt dir, wie stabil der pH-Wert ist — je höher, desto schwerer ändert sich der pH.'
    ],
    steps: [
      {
        title: '1. Base erkennen',
        text: 'Schau auf die Formel: Enthält sie OH? Dann ist es wahrscheinlich eine Base. Beispiele: NaOH (Natronlauge), Ca(OH)₂ (Kalkwasser), KOH (Kalilauge).'
      },
      {
        title: '2. Einsatz im Bad',
        text: 'Wenn der pH-Wert zu niedrig ist (z.B. pH 6,3), wird eine Base zugegeben, um den pH zu heben. Meistens wird Natriumcarbonat (Na₂CO₃) verwendet.'
      },
      {
        title: '3. Säurekapazität verstehen',
        text: 'Der KS4,3-Wert (Soll: mindestens 0,7 mmol/l) zeigt die Pufferkapazität des Wassers. Ist er zu niedrig, schwankt der pH ständig hin und her.'
      },
      {
        title: '4. Sicherheit beachten',
        text: 'Laugen sind besonders gefährlich für die Augen! Schutzbrille ist absolute Pflicht. Bei Augenkontakt sofort 15 Minuten mit Wasser spülen!'
      }
    ],
    examples: [
      {
        title: 'Wichtige Basen im Schwimmbad',
        given: 'Diese Basen begegnen dir im Bäderalltag.',
        question: 'Wofür werden sie eingesetzt?',
        steps: [
          ['Natriumcarbonat (Na₂CO₃)', 'pH-Heber Nr. 1 — auch als Soda bekannt, erhöht auch den KS4,3-Wert'],
          ['Natronlauge (NaOH)', 'Starke Base zum pH-Heben, sehr ätzend, erfordert besondere Vorsicht'],
          ['Calciumhydroxid Ca(OH)₂', 'Auch Kalkwasser genannt — kann Trübung verursachen'],
          ['Natriumhydrogencarbonat (NaHCO₃)', 'Schwache Base, stabilisiert den pH-Wert sanft (Natron)']
        ]
      },
      {
        title: 'KS4,3-Wert (Säurekapazität)',
        given: 'Du misst den KS4,3-Wert und erhältst 0,4 mmol/l. Der Sollwert liegt bei mindestens 0,7 mmol/l.',
        question: 'Was bedeutet das und was tust du?',
        steps: [
          ['Messwert', 'KS4,3 = 0,4 mmol/l — zu niedrig'],
          ['Bedeutung', 'Das Wasser hat wenig Puffer — der pH-Wert schwankt leicht'],
          ['Maßnahme', 'Natriumcarbonat (Na₂CO₃) zugeben — das hebt KS4,3 UND pH'],
          ['Ergebnis', 'Stabiler pH-Wert und bessere Wasserqualität']
        ]
      },
      {
        title: 'Laugenverätzung — Erste Hilfe',
        given: 'Ein Kollege bekommt Natronlauge ins Auge.',
        question: 'Was ist sofort zu tun?',
        steps: [
          ['Schritt 1', 'Sofort mit viel Wasser spülen — mindestens 15 Minuten!'],
          ['Schritt 2', 'Auge offen halten, von der Nase weg spülen'],
          ['Schritt 3', 'Notruf 112 — Augenarzt ist notwendig!'],
          ['WICHTIG', 'Laugen sind für Augen GEFAEHRLICHER als Säuren, weil sie tiefer eindringen!']
        ]
      }
    ],
    pitfalls: [
      'Laugen fühlen sich \"seifig\" an — wenn sich deine Haut so anfühlt, hast du schon Lauge dran! Sofort waschen!',
      'Natronlauge (NaOH) ist eine STARKE Base — selbst verdünnt ist sie gefährlich. Nie unterschätzen!',
      'Calciumhydroxid kann das Wasser trüben — nur einsetzen, wenn man weiss was man tut.',
      'KS4,3-Wert zu niedrig? Dann reicht pH-Heben allein nicht — du brauchst speziell Natriumcarbonat für die Pufferkapazität.'
    ],
    quiz: {
      question: 'Welches Mittel wird im Schwimmbad am häufigsten verwendet, um den pH-Wert zu heben?',
      options: [
        'Salzsäure (HCl)',
        'Natriumcarbonat (Na₂CO₃)',
        'Natriumhypochlorit (NaOCl)'
      ],
      correctIndex: 1,
      explanation: 'Natriumcarbonat (Na₂CO₃, Soda) ist der gängigste pH-Heber im Schwimmbad. Es erhöht gleichzeitig den KS4,3-Wert.'
    }
  },

  praxis: {
    id: 'praxis',
    chip: 'Praxis',
    title: 'pH-Korrektur im Schwimmbad',
    intro:
      'Jetzt wird es praktisch: Du misst den pH-Wert, entscheidest ob er zu hoch oder zu niedrig ist, und waehlst das richtige Mittel. In diesem Abschnitt lernst du den typischen Tagesablauf der pH-Kontrolle, Dosierberechnungen und Sicherheitsregeln für den Umgang mit Chemikalien im Schwimmbad.',
    motto: 'Erst messen, dann denken, dann dosieren.',
    rules: [
      'IMMER zuerst den pH-Wert korrigieren, DANN das Chlor anpassen — in dieser Reihenfolge!',
      'pH zu hoch (über 7,6): Säure zugeben — meistens Salzsäure (HCl) oder NaHSO₄.',
      'pH zu niedrig (unter 6,5): Base zugeben — meistens Natriumcarbonat (Na₂CO₃).',
      'Bei pH 7,0 liegt ca. 73 % des Chlors als wirksame Hypochlorsäure vor — bei pH 8,0 nur noch 22 %.',
      'Chemikalien nie mischen! Besonders Säure und Chlor ergibt giftiges Chlorgas — Lebensgefahr!'
    ],
    steps: [
      {
        title: '1. pH-Wert messen',
        text: 'Morgens vor Badeöffnung: Wasserprobe nehmen (nicht am Einlauf!). Mit Photometer oder Testtabletten messen. Wert ins Betriebstagebuch eintragen.'
      },
      {
        title: '2. Ergebnis bewerten',
        text: 'pH zwischen 6,5 und 7,8? Alles OK. Darüber? Säure nötig. Darunter? Base nötig. Dosieranlage prüfen — läuft sie noch richtig?'
      },
      {
        title: '3. Richtiges Mittel dosieren',
        text: 'pH zu hoch → HCl oder NaHSO₄. pH zu niedrig → Na₂CO₃. Menge hängt vom Beckenvolumen und der pH-Abweichung ab.'
      },
      {
        title: '4. Nachmessen und dokumentieren',
        text: 'Etwa 1–2 Stunden nach der Korrektur nochmal messen. Ergebnis dokumentieren. Bei starken Abweichungen auch die Dosieranlage prüfen.'
      }
    ],
    examples: [
      {
        title: 'Praxisbeispiel: pH ist zu hoch',
        given: 'Sportbecken mit 500 m³ Wasserinhalt. Du misst pH 7,8 — Sollwert ist 7,2. Als Faustregel braucht man ca. 10 ml HCl (33 %) pro m³ für eine pH-Senkung um 0,1.',
        question: 'Wie viel Salzsäure musst du ungefaehr dosieren?',
        steps: [
          ['pH-Differenz', '7,8 − 7,2 = 0,6 pH-Punkte Senkung nötig'],
          ['Dosierung pro 0,1 pH', '10 ml HCl (33 %) pro m³'],
          ['Für 0,6 pH-Punkte', '6 × 10 ml = 60 ml pro m³'],
          ['Für 500 m³', '500 × 60 ml = 30.000 ml = 30 Liter HCl'],
          ['Wichtig', 'Das ist ein Richtwert! Nach 1–2 Std. nachmessen und ggf. nachdosieren.']
        ]
      },
      {
        title: 'Praxisbeispiel: pH ist zu niedrig',
        given: 'Nichtschwimmerbecken mit 200 m³. Du misst pH 6,2 — Sollwert ist 7,0. Als Faustregel braucht man ca. 5 g Na₂CO₃ pro m³ für eine pH-Hebung um 0,1.',
        question: 'Wie viel Natriumcarbonat brauchst du ungefaehr?',
        steps: [
          ['pH-Differenz', '7,0 − 6,2 = 0,8 pH-Punkte Hebung nötig'],
          ['Dosierung pro 0,1 pH', '5 g Na₂CO₃ pro m³'],
          ['Für 0,8 pH-Punkte', '8 × 5 g = 40 g pro m³'],
          ['Für 200 m³', '200 × 40 g = 8.000 g = 8 kg Na₂CO₃'],
          ['Wichtig', 'Nicht alles auf einmal zugeben! In Portionen dosieren und nachmessen.']
        ]
      },
      {
        title: 'Wechselwirkung pH und Chlor',
        given: 'Du hast 0,6 mg/l freies Chlor im Becken bei pH 8,0. Dein Chef sagt, du sollst pH auf 7,0 senken.',
        question: 'Was passiert mit der Chlorwirkung?',
        steps: [
          ['Bei pH 8,0', 'Nur ca. 22 % des Chlors ist als HOCl wirksam → 0,13 mg/l effektiv'],
          ['Bei pH 7,0', 'Ca. 73 % des Chlors ist als HOCl wirksam → 0,44 mg/l effektiv'],
          ['Verbesserung', 'Die wirksame Chlormenge verdreifacht sich — ohne extra Chlor zu dosieren!'],
          ['Ergebnis', 'Erst pH korrigieren spart Chlor und verbessert die Desinfektion']
        ]
      }
    ],
    pitfalls: [
      'NIEMALS Säure und Chlor zusammen lagern oder mischen — es entsteht giftiges Chlorgas!',
      'Große pH-Korrekturen nicht auf einmal machen — lieber in kleinen Schritten dosieren und dazwischen messen.',
      'Faustregel-Dosierungen sind NUR Richtwerte. Jedes Beckenwasser ist anders (Pufferkapazität, Temperatur).',
      'Chemikalienbeghälter immer sofort verschliessen. Säuredaempfe greifen Metalle in der Technikzentrale an!'
    ],
    quiz: {
      question: 'Der pH-Wert im Becken ist 7,9. Was tust du?',
      options: [
        'Base (Na₂CO₃) zugeben, um den pH zu heben',
        'Säure (HCl) zugeben, um den pH zu senken',
        'Mehr Chlor dosieren, damit die Desinfektion stimmt'
      ],
      correctIndex: 1,
      explanation: 'pH 7,9 ist zu hoch (Sollbereich 6,5–7,8). Du musst Säure zugeben, um den pH zu senken. Erst danach ggf. Chlor anpassen.'
    }
  }
};

const TAB_ORDER = ['grundlagen', 'säuren', 'basen', 'praxis'];

/* ─── Reference tables for sidebar ─────────────────────────────────────────── */

const PH_SCALE_TABLE = [
  ['pH-Wert', 'Bedeutung', 'Beispiel'],
  ['0–2', 'Stark sauer', 'Magensäure, Batteriesäure'],
  ['3–4', 'Sauer', 'Zitronensaft, Cola'],
  ['5–6', 'Schwach sauer', 'Kaffee, Regen'],
  ['7', 'Neutral', 'Reines Wasser'],
  ['8–9', 'Schwach basisch', 'Seife, Backpulver'],
  ['10–11', 'Basisch', 'Waschmittel'],
  ['12–14', 'Stark basisch', 'Natronlauge, Bleichmittel']
];

const SAFETY_TABLE = [
  ['Symbol', 'Bedeutung', 'Wo im Bad?'],
  ['GHS05 (Aetzend)', 'Verursacht Verätzungen', 'Salzsäure, Natronlauge'],
  ['GHS07 (Achtung)', 'Gesundheitsschädlich', 'Verdünnte Säuren/Basen'],
  ['GHS09 (Umwelt)', 'Umweltgefährlich', 'Chlorprodukte, Säuren'],
  ['GHS06 (Totenkopf)', 'Giftig / Lebensgefahr', 'Chlorgas (bei Verwechslung!)']
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
          className={`rounded-2xl border p-4 ${darkMode ? 'border-slate-800 bg-slate-950/70' : 'border-blue-100 bg-blue-50/60'}`}
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
    <div className={`rounded-2xl border p-4 ${darkMode ? 'border-slate-800 bg-slate-950/70' : 'border-blue-100 bg-blue-50/40'}`}>
      <div className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        {example.title}
      </div>
      <p className={`text-sm mt-1 leading-6 ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
        {example.given}
      </p>
      <p className={`text-sm font-medium mt-1 ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
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

export default function SäurenBasenDeepDiveView() {
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
      <div className={`rounded-3xl border p-6 ${darkMode ? 'bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 border-slate-800' : 'bg-gradient-to-br from-blue-50 via-white to-indigo-50 border-blue-100'}`}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold ${darkMode ? 'bg-blue-500/15 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>
              <span>CHEMIE</span>
              <span>{tab.chip}</span>
            </div>
            <h2 className={`text-3xl font-bold mt-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {tab.title}
            </h2>
            <p className={`text-sm mt-3 leading-7 ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>
              {tab.intro}
            </p>
          </div>
          <div className={`rounded-2xl px-4 py-3 border ${darkMode ? 'bg-slate-950/70 border-slate-800 text-slate-300' : 'bg-white/90 border-blue-100 text-gray-700'}`}>
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
                    ? 'border-blue-400 bg-blue-500/10 shadow-lg shadow-blue-900/20'
                    : 'border-blue-300 bg-blue-50 shadow-sm'
                  : darkMode
                    ? 'border-slate-800 bg-slate-900/70 hover:border-slate-700'
                    : 'border-gray-200 bg-white hover:border-blue-200'
              }`}
            >
              <div className={`text-xs font-bold uppercase tracking-wide ${active ? (darkMode ? 'text-blue-300' : 'text-blue-700') : (darkMode ? 'text-slate-400' : 'text-gray-500')}`}>
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
                  <span className={`mt-2 h-2 w-2 shrink-0 rounded-full ${darkMode ? 'bg-blue-400' : 'bg-blue-500'}`} />
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

          {/* pH Scale table (on grundlagen and praxis tabs) */}
          {(activeTab === 'grundlagen' || activeTab === 'praxis') && (
            <InfoCard darkMode={darkMode} title="pH-Skala Übersicht">
              <div className="overflow-hidden rounded-xl border border-transparent">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className={darkMode ? 'border-slate-800' : 'border-gray-200'}>
                      <th className={`px-3 py-2 text-left font-semibold ${darkMode ? 'bg-slate-950/50 text-slate-400' : 'bg-gray-50 text-gray-500'}`}>
                        pH-Wert
                      </th>
                      <th className={`px-3 py-2 text-left font-semibold ${darkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-50 text-blue-700'}`}>
                        Bedeutung
                      </th>
                      <th className={`px-3 py-2 text-left font-semibold ${darkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-50 text-blue-700'}`}>
                        Beispiel
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {PH_SCALE_TABLE.slice(1).map(([ph, meaning, example]) => (
                      <tr key={ph} className={`${darkMode ? 'border-slate-800' : 'border-gray-200'} border-b last:border-b-0`}>
                        <td className={`px-3 py-2 font-semibold whitespace-nowrap ${darkMode ? 'bg-slate-950/50 text-white' : 'bg-gray-50 text-gray-900'}`}>
                          {ph}
                        </td>
                        <td className={`px-3 py-2 ${darkMode ? 'bg-slate-900/40 text-slate-300' : 'bg-white text-gray-700'}`}>
                          {meaning}
                        </td>
                        <td className={`px-3 py-2 ${darkMode ? 'bg-slate-900/40 text-slate-300' : 'bg-white text-gray-700'}`}>
                          {example}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </InfoCard>
          )}

          {/* Safety symbols table (on säuren and basen tabs) */}
          {(activeTab === 'säuren' || activeTab === 'basen') && (
            <InfoCard darkMode={darkMode} title="Gefahrensymbole (GHS)">
              <div className="overflow-hidden rounded-xl border border-transparent">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className={darkMode ? 'border-slate-800' : 'border-gray-200'}>
                      <th className={`px-3 py-2 text-left font-semibold ${darkMode ? 'bg-slate-950/50 text-slate-400' : 'bg-gray-50 text-gray-500'}`}>
                        Symbol
                      </th>
                      <th className={`px-3 py-2 text-left font-semibold ${darkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-50 text-blue-700'}`}>
                        Bedeutung
                      </th>
                      <th className={`px-3 py-2 text-left font-semibold ${darkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-50 text-blue-700'}`}>
                        Wo im Bad?
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {SAFETY_TABLE.map(([symbol, meaning, location]) => (
                      <tr key={symbol} className={`${darkMode ? 'border-slate-800' : 'border-gray-200'} border-b last:border-b-0`}>
                        <td className={`px-3 py-2 font-semibold whitespace-nowrap ${darkMode ? 'bg-slate-950/50 text-white' : 'bg-gray-50 text-gray-900'}`}>
                          {symbol}
                        </td>
                        <td className={`px-3 py-2 ${darkMode ? 'bg-slate-900/40 text-slate-300' : 'bg-white text-gray-700'}`}>
                          {meaning}
                        </td>
                        <td className={`px-3 py-2 ${darkMode ? 'bg-slate-900/40 text-slate-300' : 'bg-white text-gray-700'}`}>
                          {location}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </InfoCard>
          )}

          {/* Quick reference cards for praxis tab */}
          {activeTab === 'praxis' && (
            <InfoCard darkMode={darkMode} title="Schnell-Check: pH-Korrektur">
              <div className="space-y-3">
                <div className={`rounded-xl border p-3 ${darkMode ? 'border-red-500/30 bg-red-500/10' : 'border-red-200 bg-red-50'}`}>
                  <div className={`text-sm font-semibold ${darkMode ? 'text-red-300' : 'text-red-700'}`}>
                    pH zu hoch (&gt;7,6)
                  </div>
                  <p className={`text-sm mt-1 leading-6 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    Säure zugeben: HCl oder NaHSO₄
                  </p>
                  <p className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                    Faustregel: ca. 10 ml HCl (33 %) pro m³ für 0,1 pH-Senkung
                  </p>
                </div>
                <div className={`rounded-xl border p-3 ${darkMode ? 'border-blue-500/30 bg-blue-500/10' : 'border-blue-200 bg-blue-50'}`}>
                  <div className={`text-sm font-semibold ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                    pH zu niedrig (&lt;6,5)
                  </div>
                  <p className={`text-sm mt-1 leading-6 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    Base zugeben: Na₂CO₃ (Soda)
                  </p>
                  <p className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                    Faustregel: ca. 5 g Na₂CO₃ pro m³ für 0,1 pH-Hebung
                  </p>
                </div>
                <div className={`rounded-xl border p-3 ${darkMode ? 'border-emerald-500/30 bg-emerald-500/10' : 'border-emerald-200 bg-emerald-50'}`}>
                  <div className={`text-sm font-semibold ${darkMode ? 'text-emerald-300' : 'text-emerald-700'}`}>
                    Reihenfolge
                  </div>
                  <p className={`text-sm mt-1 leading-6 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    1. pH korrigieren → 2. Chlor anpassen → 3. Nachmessen
                  </p>
                </div>
              </div>
            </InfoCard>
          )}

          {/* Quick reference for grundlagen: Chlor-Wirksamkeit */}
          {activeTab === 'grundlagen' && (
            <InfoCard darkMode={darkMode} title="Chlor-Wirksamkeit nach pH">
              <div className="space-y-3">
                <div className={`rounded-xl border p-3 ${darkMode ? 'border-blue-500/30 bg-blue-500/10' : 'border-blue-200 bg-blue-50'}`}>
                  <div className={`text-sm font-semibold ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                    Wirksames Chlor (HOCl)
                  </div>
                  <p className={`text-sm mt-1 leading-6 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    Je niedriger der pH, desto mehr Chlor wirkt tatsächlich.
                  </p>
                  <p className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                    pH 7,0 → 73 % HOCl | pH 7,5 → 50 % | pH 8,0 → 22 %
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
                          ? 'border-blue-400 bg-blue-500/10 text-white'
                          : 'border-blue-300 bg-blue-50 text-gray-900'
                        : darkMode
                          ? 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-blue-200'
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
                    ? 'bg-blue-600 text-white hover:bg-blue-500'
                    : 'bg-blue-600 text-white hover:bg-blue-500'
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
