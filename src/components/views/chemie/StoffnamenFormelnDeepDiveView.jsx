import { useState } from 'react';
import { useApp } from '../../../context/AppContext';

/* ─── Tab data ──────────────────────────────────────────────────────────────── */

const TABS = {
  grundlagen: {
    id: 'grundlagen',
    chip: 'Grundlagen',
    title: 'Was sind Stoffnamen?',
    intro:
      'Jeder Stoff im Schwimmbad hat zwei Namen: einen chemischen Namen und einen Alltagsnamen (Handelsname). Auf dem Kanister steht z.B. "Flüssigchlor" — aber der chemische Name ist "Natriumhypochlorit". Die chemische Formel NaClO ist nur eine Kurzschreibweise für den Namen. Wenn du verstehst, wie Namen und Formeln zusammenhängen, kannst du sofort erkennen, was in einem Produkt steckt.',
    motto: 'Jeder Stoff hat einen Namen UND eine Formel — beides sagt dir, was drin ist.',
    rules: [
      'Jeder chemische Stoff hat einen systematischen Namen (z.B. Natriumhypochlorit) und oft auch einen Handelsnamen (z.B. Flüssigchlor).',
      'Die chemische Formel ist eine Abkürzung für den Namen: NaClO steht für Natrium (Na) + Chlor (Cl) + Sauerstoff (O).',
      'Der Name verraet dir die Bestandteile: "Natrium-hypochlorit" = Natrium + Hypochlorit (eine Chlor-Sauerstoff-Verbindung).',
      'Auf Produktetiketten und Sicherheitsdatenblättern findest du IMMER den chemischen Namen — den musst du lesen können.',
      'Die kleinen Zahlen in Formeln (z.B. H₂O) sagen dir, wie viele Atome von jedem Element dabei sind: H₂O = 2× Wasserstoff + 1× Sauerstoff.'
    ],
    steps: [
      {
        title: '1. Handelsname finden',
        text: 'Auf dem Kanister steht oft ein einfacher Name wie "pH-Senker" oder "Flüssigchlor". Das ist der Handelsname — er sagt dir, wofür das Produkt da ist, aber NICHT genau, was drin ist.'
      },
      {
        title: '2. Chemischen Namen lesen',
        text: 'Im Kleingedruckten oder auf dem Sicherheitsdatenblatt steht der chemische Name, z.B. "Natriumhypochlorit-Lösung 13%". Diesen Namen musst du kennen, weil er dir genau sagt, welcher Stoff drin ist.'
      },
      {
        title: '3. Formel verstehen',
        text: 'Die Formel ist die Kurzform: NaClO. Jeder Buchstabe steht für ein Element: Na = Natrium, Cl = Chlor, O = Sauerstoff. Die Formel sagt dir also genau dasselbe wie der Name — nur kürzer.'
      },
      {
        title: '4. Einsatz zuordnen',
        text: 'Wenn du Name und Formel kennst, weisst du auch den Einsatzbereich. Natriumhypochlorit (NaClO) = Desinfektion. Salzsäure (HCl) = pH-Senkung. So erkennst du sofort, welches Produkt wofür ist.'
      }
    ],
    examples: [
      {
        title: 'Vom Handelsnamen zum chemischen Namen',
        given: 'Auf dem Kanister steht "Flüssigchlor zur Schwimmbaddesinfektion".',
        question: 'Was steckt wirklich drin?',
        steps: [
          ['Handelsname', 'Flüssigchlor'],
          ['Chemischer Name', 'Natriumhypochlorit (NaClO)'],
          ['Formel lesen', 'Na = Natrium, Cl = Chlor, O = Sauerstoff'],
          ['Einsatz', 'Desinfektion des Beckenwassers']
        ]
      },
      {
        title: 'Formel in Einzelteile zerlegen',
        given: 'Die Formel Ca(ClO)₂ steht auf einem Granulat-Eimer.',
        question: 'Was bedeuten die Buchstaben?',
        steps: [
          ['Ca', 'Calcium'],
          ['Cl', 'Chlor'],
          ['O', 'Sauerstoff'],
          ['Zusammen', 'Calciumhypochlorit — ein Chlorgranulat zur Desinfektion']
        ]
      },
      {
        title: 'Name verraet den Inhalt',
        given: 'Du liest "Natriumhydrogencarbonat" auf einer Verpackung.',
        question: 'Welche Elemente stecken drin?',
        steps: [
          ['Natrium', 'Na — ein Metall'],
          ['Hydrogen', 'H — Wasserstoff'],
          ['Carbonat', 'CO₃ — Kohlenstoff + Sauerstoff'],
          ['Formel', 'NaHCO₃ — das ist Backpulver, wird auch zur pH-Anhebung genutzt']
        ]
      }
    ],
    pitfalls: [
      'Handelsname und chemischer Name sind NICHT dasselbe! "Flüssigchlor" klingt nach reinem Chlor, ist aber Natriumhypochlorit-Lösung (nur 13% Wirkstoff).',
      'Die kleinen Zahlen in Formeln NICHT vergessen: H₂SO₄ hat ZWEI Wasserstoff-Atome und VIER Sauerstoff-Atome.',
      'Klammern in Formeln bedeuten: Der Teil in der Klammer kommt mehrfach vor. Ca(OH)₂ hat ZWEI OH-Gruppen.',
      'Nicht alle Stoffe mit "Chlor" im Namen sind Desinfektionsmittel — Natriumchlorid (NaCl) ist einfach nur Kochsalz!'
    ],
    quiz: {
      question: 'Was ist der chemische Name für "Flüssigchlor"?',
      options: ['Calciumhypochlorit', 'Natriumhypochlorit', 'Natriumchlorid'],
      correctIndex: 1,
      explanation: 'Flüssigchlor ist der Handelsname für Natriumhypochlorit (NaClO). Calciumhypochlorit ist Granulat, und Natriumchlorid ist Kochsalz.'
    }
  },

  zuordnung: {
    id: 'zuordnung',
    chip: 'Zuordnung',
    title: 'Name, Formel und Einsatz verbinden',
    intro:
      'Im Schwimmbad brauchst du etwa 12 Chemikalien regelmäßig. Für die Prüfung musst du zu jedem Stoff den Namen, die Formel UND den Einsatz kennen. Der Trick: Lerne die Elementkürzel (Na = Natrium, Cl = Chlor, O = Sauerstoff) — dann kannst du jede Formel lesen wie ein Wort.',
    motto: 'Kenne die Kürzel, dann liest du jede Formel.',
    rules: [
      'Die wichtigsten Elementkürzel: Na = Natrium, Ca = Calcium, Cl = Chlor, O = Sauerstoff, H = Wasserstoff, S = Schwefel, Al = Aluminium, C = Kohlenstoff.',
      'NaClO = Natrium + Chlor + Sauerstoff = Natriumhypochlorit = Flüssigchlor zur Desinfektion.',
      'Ca(ClO)₂ = Calcium + 2× (Chlor + Sauerstoff) = Calciumhypochlorit = Chlorgranulat zur Desinfektion.',
      'HCl = Wasserstoff + Chlor = Salzsäure = pH-Senker.',
      'Wenn du die Formel lesen kannst, vergisst du den Namen nie wieder — weil der Name genau das Gleiche sagt!'
    ],
    steps: [
      {
        title: '1. Elementkürzel lernen',
        text: 'Fang mit den 8 wichtigsten an: Na (Natrium), Ca (Calcium), Cl (Chlor), O (Sauerstoff), H (Wasserstoff), S (Schwefel), Al (Aluminium), C (Kohlenstoff). Diese 8 reichen für fast alle Bäderchemikalien.'
      },
      {
        title: '2. Formel in Kürzel zerlegen',
        text: 'Nimm eine Formel wie NaClO und zerlege sie: Na + Cl + O. Dann uebersetze: Natrium + Chlor + Sauerstoff. Daraus wird der Name: Natrium-hypochlorit (hypo = wenig, chlorit = Chlor-Sauerstoff-Verbindung).'
      },
      {
        title: '3. Einsatz merken',
        text: 'Verbinde jeden Stoff mit seiner Aufgabe: Stoffe mit ClO → Desinfektion. Stoffe mit H am Anfang → Säure → pH-Senkung. Stoffe mit OH → Lauge → pH-Hebung. Stoffe mit SO₄ und Al → Flockung.'
      },
      {
        title: '4. Eselsbrücken nutzen',
        text: 'NaClO: "Na Cl(ar), O(rdentlich) desinfiziert!" — HCl: "H(au) den pH-Wert runter mit Cl(hlor)!" — Erfinde eigene Eselsbrücken, die dir helfen.'
      }
    ],
    examples: [
      {
        title: 'Die 6 wichtigsten Bäderchemikalien',
        given: 'Diese Stoffe brauchst du fast täglich im Schwimmbad.',
        question: 'Ordne Name, Formel und Einsatz zu:',
        steps: [
          ['Natriumhypochlorit', 'NaClO → Flüssige Desinfektion'],
          ['Calciumhypochlorit', 'Ca(ClO)₂ → Granulat-Desinfektion'],
          ['Salzsäure', 'HCl → pH-Senkung'],
          ['Natriumhydrogensulfat', 'NaHSO₄ → pH-Senkung (Alternative)'],
          ['Natriumcarbonat (Soda)', 'Na₂CO₃ → pH-Hebung'],
          ['Aluminiumsulfat', 'Al₂(SO₄)₃ → Flockung']
        ]
      },
      {
        title: 'Weitere wichtige Stoffe',
        given: 'Diese Stoffe begegnen dir seltener, aber du musst sie kennen.',
        question: 'Ordne Name, Formel und Einsatz zu:',
        steps: [
          ['Calciumhydroxid (Kalkhydrat)', 'Ca(OH)₂ → pH-Hebung'],
          ['Natriumhydroxid (Natronlauge)', 'NaOH → pH-Hebung'],
          ['Schwefelsäure', 'H₂SO₄ → pH-Senkung'],
          ['Natriumchlorid (Kochsalz)', 'NaCl → Sole / Elektrolyse'],
          ['Kohlendioxid', 'CO₂ → pH-Senkung (bei Whirlpools)'],
          ['Calciumchlorid', 'CaCl₂ → Härteeinstellung']
        ]
      }
    ],
    pitfalls: [
      'NaClO (Natriumhypochlorit) und NaCl (Natriumchlorid) sehen ähnlich aus — aber das O macht den Unterschied! NaClO desinfiziert, NaCl ist nur Salz.',
      'Ca(ClO)₂ und CaCl₂ nicht verwechseln: Mit O ist es Chlorgranulat (Desinfektion), ohne O ist es Calciumchlorid (Härteeinstellung).',
      'H₂SO₄ (Schwefelsäure) und NaHSO₄ (Natriumhydrogensulfat) sind BEIDE pH-Senker, aber Schwefelsäure ist viel gefährlicher!',
      'Na₂CO₃ (Soda) und NaHCO₃ (Natron/Backpulver) sind NICHT dasselbe — Soda ist stärker basisch.'
    ],
    quiz: {
      question: 'Welche Formel gehört zu Calciumhypochlorit (Chlorgranulat)?',
      options: ['CaCl₂', 'Ca(ClO)₂', 'Ca(OH)₂'],
      correctIndex: 1,
      explanation: 'Ca(ClO)₂ = Calcium + 2× Hypochlorit = Calciumhypochlorit. CaCl₂ ist Calciumchlorid (Salz), Ca(OH)₂ ist Kalkhydrat (Lauge).'
    }
  },

  klassen: {
    id: 'klassen',
    chip: 'Stoffklassen',
    title: 'Welche Gruppen gibt es?',
    intro:
      'Alle Chemikalien im Schwimmbad gehören zu einer von vier großen Gruppen: Säuren, Basen (Laugen), Salze oder Oxide. Wenn du weisst, zu welcher Gruppe ein Stoff gehört, kennst du sofort seine Grundeigenschaften. Der Trick: Schau dir die Formel an — sie verraet die Gruppe!',
    motto: 'H vorne = Säure, OH drin = Base, Metall + Nichtmetall = Salz, O dabei = Oxid.',
    rules: [
      'Säuren erkennst du am H (Wasserstoff) am Anfang der Formel: HCl, H₂SO₄, HNO₃ — sie senken den pH-Wert.',
      'Basen/Laugen erkennst du an der OH-Gruppe in der Formel: NaOH, Ca(OH)₂, KOH — sie heben den pH-Wert.',
      'Salze bestehen aus einem Metall und einem Nichtmetall-Rest: NaCl, CaCl₂, Na₂CO₃ — sie sind meistens neutral.',
      'Oxide erkennst du am O (Sauerstoff) in Verbindung mit einem anderen Element: CO₂, Al₂O₃ — sie entstehen bei Verbrennung.',
      'Manche Stoffe passen in mehrere Kategorien — für die Prüfung reicht die Hauptgruppe.'
    ],
    steps: [
      {
        title: '1. Formel anschauen',
        text: 'Schreib die Formel auf oder lies sie vom Etikett ab. Zum Beispiel: HCl, NaOH, NaCl oder CO₂.'
      },
      {
        title: '2. Auf H, OH oder O prüfen',
        text: 'Beginnt die Formel mit H? → Säure. Steht OH in der Formel? → Base/Lauge. Nur ein O mit anderem Element? → Eventuell Oxid. Metall + Nichtmetall ohne H und OH? → Salz.'
      },
      {
        title: '3. Eigenschaft ableiten',
        text: 'Säure → pH-Wert sinkt, ätzt. Base → pH-Wert steigt, ätzt. Salz → meistens neutral, löst sich in Wasser. Oxid → unterschiedlich, CO₂ macht Wasser sauer.'
      },
      {
        title: '4. Im Bäderkontext einordnen',
        text: 'pH-Senker sind Säuren (HCl, H₂SO₄). pH-Heber sind Basen (NaOH, Na₂CO₃). Desinfektionsmittel sind Salze der hypochlorigen Säure (NaClO, Ca(ClO)₂). Flockungsmittel sind Salze (Al₂(SO₄)₃).'
      }
    ],
    examples: [
      {
        title: 'Säuren im Schwimmbad',
        given: 'Säuren haben ein H am Anfang und senken den pH-Wert.',
        question: 'Welche Säuren kommen im Bad vor?',
        steps: [
          ['HCl', 'Salzsäure → häufigster pH-Senker'],
          ['H₂SO₄', 'Schwefelsäure → starker pH-Senker (seltener verwendet)'],
          ['NaHSO₄', 'Natriumhydrogensulfat → "saures Salz", wirkt wie eine Säure'],
          ['Merkmal', 'Alle haben H (Wasserstoff) — er macht die Säure sauer']
        ]
      },
      {
        title: 'Basen und Laugen im Schwimmbad',
        given: 'Basen haben eine OH-Gruppe und heben den pH-Wert.',
        question: 'Welche Basen kommen im Bad vor?',
        steps: [
          ['NaOH', 'Natronlauge → starke Base zur pH-Hebung'],
          ['Ca(OH)₂', 'Kalkhydrat → wird auch zur Wasserenthärtung genutzt'],
          ['Na₂CO₃', 'Soda → wirkt basisch, obwohl kein OH sichtbar (löst sich basisch)'],
          ['Merkmal', 'OH-Gruppe oder Carbonate → pH-Wert steigt']
        ]
      },
      {
        title: 'Salze und Oxide im Schwimmbad',
        given: 'Salze sind Metall + Nichtmetall, Oxide enthalten Sauerstoff.',
        question: 'Welche kommen im Bad vor?',
        steps: [
          ['NaCl', 'Kochsalz → für Sole und Elektrolyse'],
          ['NaClO', 'Natriumhypochlorit → ein Salz der hypochlorigen Säure (Desinfektion)'],
          ['Al₂(SO₄)₃', 'Aluminiumsulfat → ein Salz zur Flockung'],
          ['CO₂', 'Kohlendioxid → ein Oxid, kann pH senken (Whirlpools)']
        ]
      }
    ],
    pitfalls: [
      'NaHSO₄ sieht aus wie ein Salz (Na am Anfang), wirkt aber wie eine Säure (wegen dem H) — es ist ein "saures Salz".',
      'Na₂CO₃ (Soda) hat kein OH in der Formel, ist aber trotzdem basisch — weil Carbonat in Wasser OH freisetzt.',
      'NaClO ist technisch ein Salz, wird aber als Desinfektionsmittel genutzt — es kommt auf den EINSATZ an, nicht nur auf die Stoffklasse.',
      'CO₂ ist ein Oxid, das in Wasser Kohlensäure bildet (H₂CO₃) — es wirkt also wie eine Säure, obwohl es ein Oxid ist.'
    ],
    quiz: {
      question: 'Zu welcher Stoffklasse gehört Ca(OH)₂ (Kalkhydrat)?',
      options: ['Säure', 'Base/Lauge', 'Salz'],
      correctIndex: 1,
      explanation: 'Ca(OH)₂ enthält die OH-Gruppe — das ist das Erkennungszeichen für eine Base/Lauge. Kalkhydrat hebt den pH-Wert.'
    }
  },

  praxis: {
    id: 'praxis',
    chip: 'Praxis',
    title: 'Stoffe im Bäderalltag',
    intro:
      'Jetzt wird es praktisch! Du lernst, wie du die täglichen Chemikalien anhand ihrer Namen erkennst, was das Sicherheitsdatenblatt dir verraet und wie du typische Prüfungsfragen zu Stoffnamen und Formeln löst. Im Alltag begegnest du den Stoffen auf Kanistern, Säcken und in der Dosieranlage.',
    motto: 'Lies den Namen — und du weisst, was drin ist und was es tut.',
    rules: [
      'pH-Senker: Salzsäure (HCl) oder Natriumhydrogensulfat (NaHSO₄) — beide machen das Wasser saurer.',
      'pH-Heber: Natriumcarbonat/Soda (Na₂CO₃) oder Natronlauge (NaOH) — beide machen das Wasser basischer.',
      'Desinfektion: Natriumhypochlorit (NaClO) als Flüssigkeit oder Calciumhypochlorit (Ca(ClO)₂) als Granulat.',
      'Flockung: Aluminiumsulfat (Al₂(SO₄)₃) oder Polyaluminiumchlorid (PAC) — binden Trübstoffe im Wasser.',
      'Das Sicherheitsdatenblatt (SDB) ist Pflicht für jeden Stoff — es nennt immer den chemischen Namen, Gefahren und Erste-Hilfe-Maßnahmen.'
    ],
    steps: [
      {
        title: '1. Kanister oder Sack lesen',
        text: 'Schau auf das Etikett: Oben steht der Handelsname (z.B. "Chloriliquid"), darunter der chemische Name (z.B. "Natriumhypochlorit-Lösung 13%"). Die Prozentangabe sagt dir die Konzentration.'
      },
      {
        title: '2. Gefahrensymbole erkennen',
        text: 'Die roten Rauten auf dem Etikett warnen dich: Aetzend (Säure/Lauge), Umweltgefährlich (Chlorprodukte), Brandfördernd (starke Oxidationsmittel). Der chemische Name hilft dir, die Gefahr einzuordnen.'
      },
      {
        title: '3. Sicherheitsdatenblatt nutzen',
        text: 'Im SDB findest du: Abschnitt 1 = Name und Verwendung, Abschnitt 2 = Gefahren, Abschnitt 4 = Erste Hilfe, Abschnitt 7 = Lagerung. Der chemische Name steht in Abschnitt 3.'
      },
      {
        title: '4. Im Alltag anwenden',
        text: 'Wenn du einen unbekannten Kanister findest: Lies den chemischen Namen, ordne ihn einer Stoffklasse zu (Säure/Base/Salz), und du weisst sofort, ob er gefährlich ist und wofür er verwendet wird.'
      }
    ],
    examples: [
      {
        title: 'Kanister identifizieren: Natriumhypochlorit',
        given: 'Du siehst einen gelben Kanister mit der Aufschrift "Natriumhypochlorit-Lösung 13%".',
        question: 'Was steckt drin und wofür ist es?',
        steps: [
          ['Chemischer Name', 'Natriumhypochlorit'],
          ['Formel', 'NaClO — Natrium + Chlor + Sauerstoff'],
          ['Stoffklasse', 'Salz der hypochlorigen Säure → Desinfektionsmittel'],
          ['Einsatz', 'Flüssige Desinfektion, 13% Wirkstoff, Rest ist Wasser']
        ]
      },
      {
        title: 'Sack identifizieren: pH-Senker',
        given: 'Ein weisser Sack trägt die Bezeichnung "Natriumhydrogensulfat".',
        question: 'Was ist das und was macht es?',
        steps: [
          ['Chemischer Name', 'Natriumhydrogensulfat'],
          ['Formel', 'NaHSO₄ — Na + H + S + O₄'],
          ['Stoffklasse', 'Saures Salz → wirkt wie Säure'],
          ['Einsatz', 'pH-Senker — macht das Wasser saurer, Alternative zu Salzsäure']
        ]
      },
      {
        title: 'Prüfungsszenario: Unbekannter Kanister',
        given: 'Im Lager steht ein Kanister mit "Aluminiumsulfat-Lösung". Ein Kollege fragt: Was ist das?',
        question: 'Erkläre dem Kollegen, was drin ist.',
        steps: [
          ['Name zerlegen', 'Aluminium + Sulfat (Schwefel-Sauerstoff-Verbindung)'],
          ['Formel', 'Al₂(SO₄)₃'],
          ['Stoffklasse', 'Salz — Metall (Al) + Säure-Rest (SO₄)'],
          ['Einsatz', 'Flockungsmittel — bindet kleine Schmutzpartikel zu größeren Flocken, die der Filter auffängt']
        ]
      }
    ],
    pitfalls: [
      'Niemals verschiedene Chemikalien mischen! Besonders Säure + Chlorprodukt ergibt giftiges Chlorgas!',
      'Die Prozentangabe auf dem Kanister ist NICHT die Dosierung — 13% NaClO heißt: 13% Wirkstoff, 87% Wasser.',
      'Wenn das Etikett fehlt oder unleserlich ist: NICHT raten! Sicherheitsdatenblatt suchen oder Vorgesetzten fragen.',
      'Im Prüfungsfall immer den CHEMISCHEN Namen nennen, nicht den Handelsnamen — "Natriumhypochlorit" statt "Flüssigchlor".'
    ],
    quiz: {
      question: 'Ein Kanister ist beschriftet mit "Natriumhypochlorit-Lösung 13%". Wofür wird dieser Stoff verwendet?',
      options: ['pH-Senkung', 'Flockung', 'Desinfektion'],
      correctIndex: 2,
      explanation: 'Natriumhypochlorit (NaClO) ist das Standard-Flüssigchlor zur Desinfektion des Beckenwassers. Die 13% geben den Wirkstoffanteil an.'
    }
  }
};

const TAB_ORDER = ['grundlagen', 'zuordnung', 'klassen', 'praxis'];

/* ─── Pool chemicals reference table ──────────────────────────────────────── */

const CHEMICALS_REFERENCE = [
  ['Natriumhypochlorit', 'NaClO', 'Desinfektion (flüssig)'],
  ['Calciumhypochlorit', 'Ca(ClO)₂', 'Desinfektion (Granulat)'],
  ['Salzsäure', 'HCl', 'pH-Senkung'],
  ['Natriumhydrogensulfat', 'NaHSO₄', 'pH-Senkung'],
  ['Natriumcarbonat (Soda)', 'Na₂CO₃', 'pH-Hebung'],
  ['Natronlauge', 'NaOH', 'pH-Hebung'],
  ['Aluminiumsulfat', 'Al₂(SO₄)₃', 'Flockung'],
  ['Natriumchlorid', 'NaCl', 'Sole / Elektrolyse']
];

/* ─── Element symbols quick reference ─────────────────────────────────────── */

const ELEMENT_SYMBOLS = [
  ['Na', 'Natrium'],
  ['Ca', 'Calcium'],
  ['Cl', 'Chlor'],
  ['O', 'Sauerstoff'],
  ['H', 'Wasserstoff'],
  ['S', 'Schwefel'],
  ['Al', 'Aluminium'],
  ['C', 'Kohlenstoff']
];

/* ─── Stoffklassen quick reference ────────────────────────────────────────── */

const STOFFKLASSEN_REFERENCE = [
  ['Säuren', 'H am Anfang', 'HCl, H₂SO₄', 'senken pH'],
  ['Basen/Laugen', 'OH in Formel', 'NaOH, Ca(OH)₂', 'heben pH'],
  ['Salze', 'Metall + Rest', 'NaCl, Na₂CO₃', 'meistens neutral'],
  ['Oxide', 'Element + O', 'CO₂, Al₂O₃', 'unterschiedlich']
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

export default function StoffnamenFormelnDeepDiveView() {
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
      <div className={`rounded-3xl border p-6 ${darkMode ? 'bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 border-slate-800' : 'bg-gradient-to-br from-teal-50 via-white to-cyan-50 border-teal-100'}`}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold ${darkMode ? 'bg-teal-500/15 text-teal-300' : 'bg-teal-100 text-teal-700'}`}>
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
          <InfoCard darkMode={darkMode} title="Beispiele und Zuordnungen">
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

          {/* Chemicals reference table (on zuordnung and praxis tabs) */}
          {(activeTab === 'zuordnung' || activeTab === 'praxis') && (
            <InfoCard darkMode={darkMode} title="Spickzettel: Die wichtigsten Bäderchemikalien">
              <div className="overflow-hidden rounded-xl border border-transparent">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className={darkMode ? 'border-slate-800' : 'border-gray-200'}>
                      <th className={`px-3 py-2 text-left font-semibold ${darkMode ? 'bg-slate-950/50 text-slate-400' : 'bg-gray-50 text-gray-500'}`}>
                        Name
                      </th>
                      <th className={`px-3 py-2 text-left font-semibold ${darkMode ? 'bg-teal-900/30 text-teal-300' : 'bg-teal-50 text-teal-700'}`}>
                        Formel
                      </th>
                      <th className={`px-3 py-2 text-left font-semibold ${darkMode ? 'bg-cyan-900/20 text-cyan-300' : 'bg-cyan-50 text-cyan-700'}`}>
                        Einsatz
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {CHEMICALS_REFERENCE.map(([name, formula, use]) => (
                      <tr key={name} className={`${darkMode ? 'border-slate-800' : 'border-gray-200'} border-b last:border-b-0`}>
                        <td className={`px-3 py-2 font-semibold whitespace-nowrap ${darkMode ? 'bg-slate-950/50 text-white' : 'bg-gray-50 text-gray-900'}`}>
                          {name}
                        </td>
                        <td className={`px-3 py-2 font-mono ${darkMode ? 'bg-slate-900/40 text-teal-300' : 'bg-white text-teal-700'}`}>
                          {formula}
                        </td>
                        <td className={`px-3 py-2 ${darkMode ? 'bg-slate-900/40 text-slate-300' : 'bg-white text-gray-700'}`}>
                          {use}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </InfoCard>
          )}

          {/* Element symbols (on grundlagen and zuordnung tabs) */}
          {(activeTab === 'grundlagen' || activeTab === 'zuordnung') && (
            <InfoCard darkMode={darkMode} title="Elementkürzel-Spickzettel">
              <div className="grid grid-cols-2 gap-2">
                {ELEMENT_SYMBOLS.map(([symbol, name]) => (
                  <div
                    key={symbol}
                    className={`rounded-xl border p-3 text-center ${darkMode ? 'border-teal-500/30 bg-teal-500/10' : 'border-teal-200 bg-teal-50'}`}
                  >
                    <div className={`text-lg font-bold font-mono ${darkMode ? 'text-teal-300' : 'text-teal-700'}`}>
                      {symbol}
                    </div>
                    <div className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                      {name}
                    </div>
                  </div>
                ))}
              </div>
            </InfoCard>
          )}

          {/* Stoffklassen overview (on klassen tab) */}
          {activeTab === 'klassen' && (
            <InfoCard darkMode={darkMode} title="Stoffklassen auf einen Blick">
              <div className="overflow-hidden rounded-xl border border-transparent">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className={darkMode ? 'border-slate-800' : 'border-gray-200'}>
                      <th className={`px-3 py-2 text-left font-semibold ${darkMode ? 'bg-slate-950/50 text-slate-400' : 'bg-gray-50 text-gray-500'}`}>
                        Klasse
                      </th>
                      <th className={`px-3 py-2 text-left font-semibold ${darkMode ? 'bg-teal-900/30 text-teal-300' : 'bg-teal-50 text-teal-700'}`}>
                        Erkennbar an
                      </th>
                      <th className={`px-3 py-2 text-left font-semibold ${darkMode ? 'bg-cyan-900/20 text-cyan-300' : 'bg-cyan-50 text-cyan-700'}`}>
                        Beispiele
                      </th>
                      <th className={`px-3 py-2 text-left font-semibold ${darkMode ? 'bg-amber-900/20 text-amber-300' : 'bg-amber-50 text-amber-700'}`}>
                        Wirkung
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {STOFFKLASSEN_REFERENCE.map(([klasse, merkmal, beispiele, wirkung]) => (
                      <tr key={klasse} className={`${darkMode ? 'border-slate-800' : 'border-gray-200'} border-b last:border-b-0`}>
                        <td className={`px-3 py-2 font-semibold whitespace-nowrap ${darkMode ? 'bg-slate-950/50 text-white' : 'bg-gray-50 text-gray-900'}`}>
                          {klasse}
                        </td>
                        <td className={`px-3 py-2 ${darkMode ? 'bg-slate-900/40 text-slate-300' : 'bg-white text-gray-700'}`}>
                          {merkmal}
                        </td>
                        <td className={`px-3 py-2 font-mono text-xs ${darkMode ? 'bg-slate-900/40 text-teal-300' : 'bg-white text-teal-700'}`}>
                          {beispiele}
                        </td>
                        <td className={`px-3 py-2 ${darkMode ? 'bg-slate-900/40 text-slate-300' : 'bg-white text-gray-700'}`}>
                          {wirkung}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
