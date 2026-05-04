import { useState } from 'react';
import { useApp } from '../../../context/AppContext';

/* --- Tab data ---------------------------------------------------------------- */

const TABS = {
  grundlagen: {
    id: 'grundlagen',
    chip: 'Grundlagen',
    title: 'Was sind Redox-Reaktionen?',
    intro:
      'Stell dir einen Staffellauf vor: Ein Läufer gibt den Stab ab, ein anderer nimmt ihn auf. Genau so funktionieren Redox-Reaktionen — nur dass statt Staffelstäben winzige Teilchen (Elektronen) übergeben werden. Einer gibt Elektronen ab, ein anderer nimmt sie auf. Das passiert IMMER gleichzeitig. Und das Beste: Die Desinfektion im Schwimmbad IST eine Redox-Reaktion!',
    motto: 'Einer gibt ab, einer nimmt auf — immer gleichzeitig.',
    rules: [
      'Redox-Reaktion = eine Reaktion, bei der Elektronen von einem Stoff zum anderen wandern.',
      'Oxidation = Elektronen ABGEBEN. Eselsbrücke: OxidAtion = Abgabe.',
      'Reduktion = Elektronen AUFNEHMEN. Der Stoff wird dadurch "reduziert".',
      'Oxidation und Reduktion passieren IMMER gleichzeitig — nie eins ohne das andere.',
      'Im Schwimmbad messen wir die Redox-Spannung in Millivolt (mV) — sie zeigt, wie gut das Wasser desinfiziert.'
    ],
    steps: [
      {
        title: '1. Was sind Elektronen?',
        text: 'Elektronen sind winzig kleine Teilchen mit negativer Ladung. Sie gehören zu jedem Atom dazu. Bei einer Redox-Reaktion wechseln sie den Besitzer — wie beim Tauschen auf dem Schulhof.'
      },
      {
        title: '2. Oxidation = Abgeben',
        text: 'Wenn ein Stoff Elektronen ABGIBT, nennt man das Oxidation. Merkhilfe: OxidAtion — das A steht für Abgabe. Beispiel: Eisen gibt Elektronen ab und rostet.'
      },
      {
        title: '3. Reduktion = Aufnehmen',
        text: 'Wenn ein Stoff Elektronen AUFNIMMT, nennt man das Reduktion. Der Stoff, der die Elektronen bekommt, wird reduziert. Das ist immer der Gegenspieler zur Oxidation.'
      },
      {
        title: '4. Warum ist das im Bad wichtig?',
        text: 'Chlor OXIDIERT Bakterien und Keime — es nimmt ihnen Elektronen weg und zerstört sie dadurch. Die ganze Desinfektion im Schwimmbad basiert auf Redox-Reaktionen! Die Redox-Spannung (mV) zeigt dir, ob genug Desinfektionskraft im Wasser ist.'
      }
    ],
    examples: [
      {
        title: 'Redox im Alltag: Rost',
        given: 'Ein Eisengeländer steht draußen im Regen.',
        question: 'Was passiert bei der Rostbildung?',
        steps: [
          ['Oxidation', 'Eisen (Fe) gibt Elektronen ab: Fe -> Fe2+ + 2e-'],
          ['Reduktion', 'Sauerstoff (O2) nimmt die Elektronen auf'],
          ['Ergebnis', 'Es entsteht Eisenoxid = Rost'],
          ['Merke', 'Oxidation und Reduktion passieren gleichzeitig!']
        ]
      },
      {
        title: 'Redox im Bad: Desinfektion',
        given: 'Chlor wird ins Beckenwasser dosiert. Bakterien sind im Wasser.',
        question: 'Warum sterben die Bakterien ab?',
        steps: [
          ['Oxidationsmittel', 'Chlor (HOCl) ist ein starkes Oxidationsmittel'],
          ['Was passiert', 'Chlor OXIDIERT die Zellwände der Bakterien'],
          ['Wirkung', 'Die Bakterien werden zerstört (desinfiziert)'],
          ['Messung', 'Die Redox-Spannung zeigt die Desinfektionskraft: Soll >750 mV']
        ]
      },
      {
        title: 'Redox-Spannung als Messwert',
        given: 'Die Messanlage zeigt eine Redox-Spannung von 680 mV an.',
        question: 'Was bedeutet das?',
        steps: [
          ['Sollwert', 'Mindestens 750 mV nach DIN 19643'],
          ['Ist-Wert', '680 mV — das ist zu niedrig!'],
          ['Bedeutung', 'Zu wenig Desinfektionskraft im Wasser'],
          ['Maßnahme', 'Chlor-Dosierung erhöhen, bis >750 mV erreicht sind']
        ]
      }
    ],
    pitfalls: [
      'Oxidation und Reduktion NICHT verwechseln: Oxidation = Abgabe, Reduktion = Aufnahme von Elektronen.',
      'Redox-Reaktionen passieren IMMER zu zweit — es kann nie nur Oxidation OHNE Reduktion geben.',
      'Die Redox-Spannung (mV) ist NICHT dasselbe wie der Chlorwert (mg/L) — beides muss stimmen!',
      'Eine hohe Redox-Spannung bedeutet GUTE Desinfektion — nicht verwechseln mit "zu viel".'
    ],
    quiz: {
      question: 'Was passiert bei einer Oxidation?',
      options: ['Ein Stoff nimmt Elektronen auf', 'Ein Stoff gibt Elektronen ab', 'Es werden keine Elektronen uebertragen'],
      correctIndex: 1,
      explanation: 'Oxidation = Elektronen ABGEBEN. Eselsbrücke: OxidAtion — das A steht für Abgabe.'
    }
  },

  oxidation: {
    id: 'oxidation',
    chip: 'Oxidation',
    title: 'Wenn Stoffe Elektronen abgeben',
    intro:
      'Oxidation begegnet dir überall: Ein Apfel wird braun, Eisen rostet, Silber läuft an. Im Schwimmbad ist die Oxidation dein bester Freund — denn Chlor OXIDIERT Keime und macht das Wasser sicher. Die Oxidierbarkeit nach DIN 19643 zeigt dir, wie viel organische Verschmutzung im Wasser ist.',
    motto: 'Chlor oxidiert Keime — das IST die Desinfektion.',
    rules: [
      'Oxidation = ein Stoff gibt Elektronen ab. Der Stoff wird dabei "oxidiert".',
      'Chlor (HOCl) ist das wichtigste Oxidationsmittel im Schwimmbad.',
      'Chlor oxidiert Bakterien, Viren, Pilze und organische Verschmutzungen.',
      'Die Oxidierbarkeit nach DIN 19643: maximal 5 mg/L (KMnO4-Verbrauch) im Beckenwasser.',
      'Gebundenes Chlor (Chloramine) entsteht, wenn Chlor SCHON oxidiert hat — es wirkt kaum noch desinfizierend.'
    ],
    steps: [
      {
        title: '1. Was ist ein Oxidationsmittel?',
        text: 'Ein Oxidationsmittel ist ein Stoff, der ANDERE Stoffe oxidiert — also ihnen Elektronen wegnimmt. Chlor ist ein starkes Oxidationsmittel. Es zerstört Keime, indem es ihre Zellwände oxidiert.'
      },
      {
        title: '2. Oxidation im Bad: Desinfektion',
        text: 'Wenn du Chlor ins Wasser gibst, reagiert es mit Wasser zu Hypochloriger Säure (HOCl). Diese HOCl oxidiert alle Keime und organischen Stoffe im Wasser. Das IST die Desinfektion.'
      },
      {
        title: '3. Oxidierbarkeit messen',
        text: 'Die Oxidierbarkeit zeigt, wie viel organische Verschmutzung im Wasser ist. Gemessen wird sie als KMnO4-Verbrauch (Kaliumpermanganat). Grenzwert: max. 5 mg/L im Beckenwasser. Ist der Wert höher, ist zu viel Schmutz im Wasser.'
      },
      {
        title: '4. Gebundenes Chlor verstehen',
        text: 'Wenn Chlor Harnstoff, Schweiss oder Hautschuppen oxidiert, entstehen Chloramine (gebundenes Chlor). Das riecht unangenehm nach "Hallenbad" und reizt die Augen. Gebundenes Chlor = verbrauchtes Chlor. Grenzwert: max. 0,2 mg/L.'
      }
    ],
    examples: [
      {
        title: 'Oxidation im Alltag: Apfel wird braun',
        given: 'Du schneidest einen Apfel auf und lässt ihn liegen.',
        question: 'Warum wird die Schnittfläche braun?',
        steps: [
          ['Was passiert', 'Sauerstoff aus der Luft oxidiert die Apfloberfläche'],
          ['Oxidation', 'Die Inhaltsstoffe des Apfels geben Elektronen ab'],
          ['Reduktion', 'Sauerstoff (O2) nimmt die Elektronen auf'],
          ['Ergebnis', 'Es entstehen braune Verbindungen (gleiche Reaktion wie Rost!)']
        ]
      },
      {
        title: 'Oxidierbarkeit zu hoch',
        given: 'Die Labormessung ergibt: Oxidierbarkeit = 7,5 mg/L KMnO4-Verbrauch.',
        question: 'Was bedeutet das und was musst du tun?',
        steps: [
          ['Grenzwert', 'Max. 5 mg/L nach DIN 19643'],
          ['Ist-Wert', '7,5 mg/L — deutlich zu hoch!'],
          ['Bedeutung', 'Zu viel organische Verschmutzung im Wasser (Schweiss, Hautschuppen, Urin)'],
          ['Maßnahme', 'Mehr Frischwasser zugeben, Filterleistung prüfen, ggf. Badegäste zum Duschen anhalten']
        ]
      },
      {
        title: 'Gebundenes Chlor berechnen',
        given: 'DPD1-Messung: 0,4 mg/L (freies Chlor). DPD3-Messung: 0,7 mg/L (Gesamtchlor).',
        question: 'Wie viel gebundenes Chlor ist im Wasser?',
        steps: [
          ['Formel', 'Gebundenes Chlor = Gesamtchlor - Freies Chlor'],
          ['Rechnung', '0,7 mg/L - 0,4 mg/L = 0,3 mg/L'],
          ['Grenzwert', 'Max. 0,2 mg/L gebundenes Chlor'],
          ['Bewertung', '0,3 mg/L ist zu hoch — evtl. Stosschlorung nötig!']
        ]
      }
    ],
    pitfalls: [
      'Oxidierbarkeit ist NICHT dasselbe wie der Chlorwert — sie misst die organische Verschmutzung, nicht das Chlor.',
      'Gebundenes Chlor riecht unangenehm — viele denken fälschlicherweise, es sei "zu viel Chlor". In Wahrheit ist es verbrauchtes Chlor.',
      'Die Oxidierbarkeit wird im LABOR gemessen, nicht vor Ort mit dem Photometer.',
      'Hohe Oxidierbarkeit bedeutet: Das Chlor wird schnell verbraucht — du brauchst MEHR Chlor, nicht weniger.'
    ],
    quiz: {
      question: 'Was bedeutet eine Oxidierbarkeit von 7 mg/L KMnO4-Verbrauch im Beckenwasser?',
      options: ['Alles in Ordnung, der Wert ist normal', 'Zu viel organische Verschmutzung — Grenzwert 5 mg/L ueberschritten', 'Der Chlorwert ist zu hoch'],
      correctIndex: 1,
      explanation: 'Die Oxidierbarkeit darf max. 5 mg/L betragen (DIN 19643). 7 mg/L bedeutet: zu viel organische Verschmutzung im Wasser. Maßnahme: mehr Frischwasser, Filterleistung prüfen.'
    }
  },

  reduktion: {
    id: 'reduktion',
    chip: 'Reduktion',
    title: 'Wenn Stoffe Elektronen aufnehmen',
    intro:
      'Die Reduktion ist das Gegenstück zur Oxidation. Im Schwimmbad brauchst du sie zum Beispiel, wenn du ueberschuessiges Chlor wieder entfernen willst. Das Zaubermittel heißt Natriumthiosulfat — es REDUZIERT das Chlor und macht es unschaedlich. Das nennt man Entchlorung oder Dechlorierung.',
    motto: 'Reduktion = Elektronen aufnehmen = das Gegenteil von Oxidation.',
    rules: [
      'Reduktion = ein Stoff nimmt Elektronen AUF. Er wird dabei "reduziert".',
      'Ein Reduktionsmittel gibt selbst Elektronen AB, damit ein anderer Stoff reduziert wird.',
      'Natriumthiosulfat (Na2S2O3) ist das wichtigste Reduktionsmittel im Schwimmbad.',
      'Entchlorung = ueberschuessiges Chlor wird durch ein Reduktionsmittel unschaedlich gemacht.',
      'Oxidationsmittel und Reduktionsmittel sind Gegenspieler — Chlor oxidiert, Thiosulfat reduziert.'
    ],
    steps: [
      {
        title: '1. Was ist ein Reduktionsmittel?',
        text: 'Ein Reduktionsmittel gibt seine eigenen Elektronen AB, damit ein anderer Stoff sie aufnehmen kann. Es "opfert" sich sozusagen. Im Bad ist Natriumthiosulfat das Standardmittel.'
      },
      {
        title: '2. Warum Chlor entfernen?',
        text: 'Es gibt Situationen, in denen zu viel Chlor im Wasser ist: nach einer Stosschlorung, bei einer Havarie (Dosierpanne), oder wenn Wasser in den Kanal abgeleitet wird. Dann muss das Chlor reduziert (entfernt) werden.'
      },
      {
        title: '3. Wie funktioniert Entchlorung?',
        text: 'Natriumthiosulfat gibt Elektronen an das Chlor ab. Das Chlor wird dadurch reduziert und verliert seine Desinfektionswirkung. Es wird quasi "entschärft". Man sagt auch: Das Chlor wird "neutralisiert".'
      },
      {
        title: '4. Oxidation vs. Reduktion',
        text: 'Chlor = Oxidationsmittel (nimmt Elektronen, tötet Keime). Thiosulfat = Reduktionsmittel (gibt Elektronen, entschärft Chlor). Die beiden sind wie Gegenspieler in einem Team — jeder hat seine Aufgabe.'
      }
    ],
    examples: [
      {
        title: 'Entchlorung nach Stosschlorung',
        given: 'Nach einer Stosschlorung ist der Chlorwert bei 1,8 mg/L. Das Bad soll aber öffnen.',
        question: 'Was musst du tun?',
        steps: [
          ['Problem', 'Chlorwert 1,8 mg/L — Badegäste dürfen erst ab <0,6 mg/L ins Wasser'],
          ['Lösung', 'Natriumthiosulfat dosieren — es REDUZIERT das ueberschuessige Chlor'],
          ['Wirkung', 'Thiosulfat gibt Elektronen an Chlor ab, Chlor wird unschaedlich'],
          ['Danach', 'Chlorwert messen — erst öffnen wenn Wert im Sollbereich']
        ]
      },
      {
        title: 'Abwasser in den Kanal leiten',
        given: 'Das Becken wird entleert. Das Wasser enthält noch 0,5 mg/L Chlor.',
        question: 'Darf das Wasser so in den Kanal?',
        steps: [
          ['Vorschrift', 'Chlorhaltiges Wasser darf NICHT direkt in die Kanalisation'],
          ['Lösung', 'Wasser vorher mit Natriumthiosulfat entchloren'],
          ['Reaktion', 'Thiosulfat reduziert Chlor — Chlor verliert seine Wirkung'],
          ['Ergebnis', 'Erst wenn kein freies Chlor mehr nachweisbar ist, darf abgeleitet werden']
        ]
      },
      {
        title: 'Vergleich: Oxidations- und Reduktionsmittel',
        given: 'Im Betrieb werden verschiedene Chemikalien eingesetzt.',
        question: 'Welche sind Oxidationsmittel, welche Reduktionsmittel?',
        steps: [
          ['Oxidationsmittel', 'Chlor (NaClO, Ca(ClO)2), Ozon (O3), Wasserstoffperoxid (H2O2)'],
          ['Reduktionsmittel', 'Natriumthiosulfat (Na2S2O3), Natriumsulfit (Na2SO3)'],
          ['Oxidationsmittel', 'NEHMEN Elektronen weg, ZERSTOEREN Keime'],
          ['Reduktionsmittel', 'GEBEN Elektronen ab, ENTSCHAERFEN Oxidationsmittel']
        ]
      }
    ],
    pitfalls: [
      'Ein Reduktionsmittel wird SELBST oxidiert — es gibt ja seine Elektronen ab. Das verwirrt am Anfang.',
      'Natriumthiosulfat NICHT ueberdosieren — sonst ist gar kein Chlor mehr im Wasser und Keime können sich vermehren.',
      'Nach der Entchlorung IMMER den Chlorwert nachmessen, bevor Badegäste ins Wasser dürfen.',
      'Reduktion heißt NICHT, dass etwas weniger wird — es heißt, dass Elektronen AUFGENOMMEN werden.'
    ],
    quiz: {
      question: 'Welches Mittel wird im Schwimmbad zur Entchlorung (Reduktion von Chlor) eingesetzt?',
      options: ['Calciumhypochlorit', 'Natriumthiosulfat', 'Salzsäure'],
      correctIndex: 1,
      explanation: 'Natriumthiosulfat (Na2S2O3) ist das Standard-Reduktionsmittel im Schwimmbad. Es gibt Elektronen an das Chlor ab und macht es unschaedlich.'
    }
  },

  praxis: {
    id: 'praxis',
    chip: 'Praxis',
    title: 'Redox im Schwimmbad-Alltag',
    intro:
      'Im täglichen Badebetrieb musst du die Redox-Spannung ueberwachen. Sie zeigt dir auf einen Blick, ob das Wasser gut desinfiziert ist. Der Sollwert liegt bei mindestens 750 mV nach DIN 19643. Hier lernst du, wie du den Wert abliest, was er bedeutet und was du tun musst, wenn er nicht stimmt.',
    motto: 'Redox-Spannung >750 mV = Wasser ist gut desinfiziert.',
    rules: [
      'Die Redox-Spannung wird in Millivolt (mV) gemessen — Sollwert: mindestens 750 mV nach DIN 19643.',
      'Zu niedrige Redox-Spannung (<750 mV) = zu wenig Desinfektionskraft — sofort handeln!',
      'Der pH-Wert beeinflusst die Redox-Spannung: Bei hohem pH sinkt die Redox-Spannung.',
      'Die Redox-Spannung muss regelmäßig abgelesen und im Betriebsbuch dokumentiert werden.',
      'Bei der Breakpoint-Chlorung wird so viel Chlor dosiert, dass alles gebundene Chlor zerstört wird.'
    ],
    steps: [
      {
        title: '1. Redox-Spannung ablesen',
        text: 'Die Redox-Spannung wird von der Messanlage automatisch gemessen und angezeigt. Du liest den Wert in mV (Millivolt) ab. Üblich sind Werte zwischen 700 und 850 mV. Unter 750 mV musst du handeln.'
      },
      {
        title: '2. Bei zu niedriger Redox-Spannung',
        text: 'Liegt die Spannung unter 750 mV, ist die Desinfektionskraft zu gering. Maßnahmen: Chlor-Dosierung erhöhen, pH-Wert prüfen (optimal 6,5–7,2), bei starkem Abfall evtl. Stosschlorung durchführen.'
      },
      {
        title: '3. Bei zu hoher Redox-Spannung',
        text: 'Selten, aber möglich: Bei Werten deutlich über 850 mV ist eventuell zu viel Chlor im Wasser. Chlor-Dosierung reduzieren oder mit Natriumthiosulfat entchloren. Chlorwert mit DPD prüfen.'
      },
      {
        title: '4. Breakpoint-Chlorung verstehen',
        text: 'Bei der Breakpoint-Chlorung wird so viel Chlor auf einmal dosiert, dass ALLES gebundene Chlor (Chloramine) zerstört wird. Der "Breakpoint" ist der Punkt, ab dem nur noch freies Chlor steigt. Danach steigt auch die Redox-Spannung wieder deutlich.'
      }
    ],
    examples: [
      {
        title: 'Tagesroutine: Morgendliche Kontrolle',
        given: 'Du beginnst deine Frühschicht. Die Messanlage zeigt: Redox 720 mV, Chlor frei 0,2 mg/L, pH 7,4.',
        question: 'Was musst du tun?',
        steps: [
          ['Redox-Spannung', '720 mV — unter dem Sollwert von 750 mV'],
          ['Chlor frei', '0,2 mg/L — zu niedrig (Soll: 0,3–0,6 mg/L)'],
          ['pH-Wert', '7,4 — etwas zu hoch (optimal: 6,5–7,2), senkt die Redox-Spannung'],
          ['Maßnahme', 'Chlor-Dosierung erhöhen UND pH-Wert senken (Salzsäure). Beides wirkt sich positiv auf die Redox-Spannung aus.']
        ]
      },
      {
        title: 'Redox-Spannung und pH-Wert Zusammenhang',
        given: 'Die Redox-Spannung fällt plötzlich von 780 mV auf 710 mV, obwohl der Chlorwert gleich geblieben ist.',
        question: 'Woran kann das liegen?',
        steps: [
          ['Chlorwert prüfen', 'Chlor frei: 0,4 mg/L — normal'],
          ['pH-Wert prüfen', 'pH: 7,8 — viel zu hoch!'],
          ['Ursache', 'Bei hohem pH-Wert sinkt die Redox-Spannung, weil weniger wirksame Hypochlorige Säure (HOCl) vorhanden ist'],
          ['Maßnahme', 'pH-Wert auf 7,0–7,2 senken — die Redox-Spannung steigt dann von allein wieder']
        ]
      },
      {
        title: 'Stosschlorung bei Verunreinigung',
        given: 'Im Kinderbecken (80 m3) wurde eine Fakalverunreinigung entdeckt. Redox: 650 mV, Chlor frei: 0,1 mg/L.',
        question: 'Welche Schritte sind nötig?',
        steps: [
          ['Sofortmaßnahme', 'Becken räumen und sperren!'],
          ['Stosschlorung', 'Chlorwert auf 1,0–2,0 mg/L anheben (Breakpoint-Chlorung)'],
          ['Abwarten', 'Mindestens 30 Minuten Umwälzung, dann Chlor und Redox messen'],
          ['Freigabe', 'Erst wieder öffnen wenn: Chlor frei 0,3–0,6 mg/L, Redox >750 mV, kein Befund mehr']
        ]
      }
    ],
    pitfalls: [
      'Die Redox-Spannung NICHT als einzigen Wert betrachten — immer zusammen mit Chlor frei und pH-Wert beurteilen.',
      'Bei Fakalverunreinigung reicht normales Nachchloren NICHT — es muss eine Stosschlorung mit Beckensperrung sein!',
      'Die Redox-Sonde muss regelmäßig kalibriert werden — eine falsche Messung ist gefährlich.',
      'Nach der Stosschlorung Becken NICHT öffnen, bis der Chlorwert unter 0,6 mg/L UND Redox >750 mV ist.'
    ],
    quiz: {
      question: 'Die Messanlage zeigt: Redox 710 mV, Chlor frei 0,2 mg/L, pH 7,5. Was ist die wichtigste Maßnahme?',
      options: ['Becken sofort sperren und Stosschlorung durchführen', 'Chlor-Dosierung erhöhen und pH-Wert senken', 'Natriumthiosulfat dosieren um den Chlorwert zu senken'],
      correctIndex: 1,
      explanation: 'Redox 710 mV ist unter dem Sollwert (750 mV), Chlor ist zu niedrig und der pH-Wert zu hoch. Lösung: Mehr Chlor dosieren und pH-Wert senken (Salzsäure). Beides zusammen hebt die Redox-Spannung.'
    }
  }
};

const TAB_ORDER = ['grundlagen', 'oxidation', 'reduktion', 'praxis'];

/* --- Sidebar reference tables ------------------------------------------------ */

const REDOX_RICHTWERTE = [
  ['Messwert', 'Bewertung'],
  ['> 750 mV', 'Gut — ausreichende Desinfektion'],
  ['700–750 mV', 'Grenzwertig — Chlor und pH prüfen'],
  ['< 700 mV', 'Kritisch — sofort handeln!'],
  ['> 850 mV', 'Sehr hoch — Chlorwert prüfen']
];

const OXIDATION_VS_REDUKTION = [
  ['Eigenschaft', 'Oxidation', 'Reduktion'],
  ['Elektronen', 'Abgabe', 'Aufnahme'],
  ['Beispiel Bad', 'Chlor desinfiziert', 'Thiosulfat entchlort'],
  ['Stoff wird...', '...oxidiert', '...reduziert'],
  ['Mittel heißt...', 'Oxidationsmittel', 'Reduktionsmittel']
];

/* --- Shared components ------------------------------------------------------- */

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

/* --- Main component ---------------------------------------------------------- */

export default function RedoxDeepDiveView() {
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
      {/* -- Hero header --------------------------------------------------- */}
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

      {/* -- Tab navigation ------------------------------------------------ */}
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

      {/* -- Main content grid --------------------------------------------- */}
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

        {/* -- Right sidebar ----------------------------------------------- */}
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

          {/* Redox-Richtwerte table (grundlagen and praxis tabs) */}
          {(activeTab === 'grundlagen' || activeTab === 'praxis') && (
            <InfoCard darkMode={darkMode} title="Redox-Spannung Richtwerte">
              <div className="overflow-hidden rounded-xl border border-transparent">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className={darkMode ? 'border-slate-800' : 'border-gray-200'}>
                      {REDOX_RICHTWERTE[0].map((header) => (
                        <th key={header} className={`px-3 py-2 text-left font-semibold ${darkMode ? 'bg-slate-950/50 text-slate-400' : 'bg-gray-50 text-gray-500'}`}>
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {REDOX_RICHTWERTE.slice(1).map(([messwert, bewertung]) => (
                      <tr key={messwert} className={`${darkMode ? 'border-slate-800' : 'border-gray-200'} border-b last:border-b-0`}>
                        <td className={`px-3 py-2 font-semibold whitespace-nowrap ${darkMode ? 'bg-slate-950/50 text-white' : 'bg-gray-50 text-gray-900'}`}>
                          {messwert}
                        </td>
                        <td className={`px-3 py-2 ${darkMode ? 'bg-slate-900/40 text-slate-300' : 'bg-white text-gray-700'}`}>
                          {bewertung}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </InfoCard>
          )}

          {/* Oxidation vs Reduktion comparison (oxidation and reduktion tabs) */}
          {(activeTab === 'oxidation' || activeTab === 'reduktion') && (
            <InfoCard darkMode={darkMode} title="Vergleich: Oxidation vs. Reduktion">
              <div className="overflow-hidden rounded-xl border border-transparent">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className={darkMode ? 'border-slate-800' : 'border-gray-200'}>
                      <th className={`px-3 py-2 text-left font-semibold ${darkMode ? 'bg-slate-950/50 text-slate-400' : 'bg-gray-50 text-gray-500'}`} />
                      <th className={`px-3 py-2 text-left font-semibold ${darkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-50 text-blue-700'}`}>
                        Oxidation
                      </th>
                      <th className={`px-3 py-2 text-left font-semibold ${darkMode ? 'bg-amber-900/20 text-amber-300' : 'bg-amber-50 text-amber-700'}`}>
                        Reduktion
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {OXIDATION_VS_REDUKTION.slice(1).map(([label, ox, red]) => (
                      <tr key={label} className={`${darkMode ? 'border-slate-800' : 'border-gray-200'} border-b last:border-b-0`}>
                        <td className={`px-3 py-2 font-semibold whitespace-nowrap ${darkMode ? 'bg-slate-950/50 text-white' : 'bg-gray-50 text-gray-900'}`}>
                          {label}
                        </td>
                        <td className={`px-3 py-2 ${darkMode ? 'bg-slate-900/40 text-slate-300' : 'bg-white text-gray-700'}`}>
                          {ox}
                        </td>
                        <td className={`px-3 py-2 ${darkMode ? 'bg-slate-900/40 text-slate-300' : 'bg-white text-gray-700'}`}>
                          {red}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </InfoCard>
          )}

          {/* Quick reference (grundlagen and praxis) */}
          {(activeTab === 'grundlagen' || activeTab === 'praxis') && (
            <InfoCard darkMode={darkMode} title="Wichtige Grenzwerte">
              <div className="space-y-3">
                <div className={`rounded-xl border p-3 ${darkMode ? 'border-blue-500/30 bg-blue-500/10' : 'border-blue-200 bg-blue-50'}`}>
                  <div className={`text-sm font-semibold ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                    Redox-Spannung
                  </div>
                  <p className={`text-sm mt-1 leading-6 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    Mindestens 750 mV (DIN 19643)
                  </p>
                  <p className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                    Zeigt die Desinfektionskraft des Wassers
                  </p>
                </div>
                <div className={`rounded-xl border p-3 ${darkMode ? 'border-amber-500/30 bg-amber-500/10' : 'border-amber-200 bg-amber-50'}`}>
                  <div className={`text-sm font-semibold ${darkMode ? 'text-amber-300' : 'text-amber-700'}`}>
                    pH-Wert Einfluss
                  </div>
                  <p className={`text-sm mt-1 leading-6 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    pH 6,5–7,2 = optimale Redox-Wirkung
                  </p>
                  <p className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                    Hoher pH senkt die Redox-Spannung!
                  </p>
                </div>
              </div>
            </InfoCard>
          )}

          {/* Oxidation sidebar extras */}
          {activeTab === 'oxidation' && (
            <InfoCard darkMode={darkMode} title="Grenzwerte Oxidation">
              <div className="space-y-3">
                <div className={`rounded-xl border p-3 ${darkMode ? 'border-blue-500/30 bg-blue-500/10' : 'border-blue-200 bg-blue-50'}`}>
                  <div className={`text-sm font-semibold ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                    Oxidierbarkeit (KMnO4)
                  </div>
                  <p className={`text-sm mt-1 leading-6 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    Max. 5 mg/L im Beckenwasser
                  </p>
                  <p className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                    Zeigt die organische Verschmutzung an
                  </p>
                </div>
                <div className={`rounded-xl border p-3 ${darkMode ? 'border-amber-500/30 bg-amber-500/10' : 'border-amber-200 bg-amber-50'}`}>
                  <div className={`text-sm font-semibold ${darkMode ? 'text-amber-300' : 'text-amber-700'}`}>
                    Gebundenes Chlor
                  </div>
                  <p className={`text-sm mt-1 leading-6 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    Max. 0,2 mg/L (Gesamtchlor - freies Chlor)
                  </p>
                  <p className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                    Entsteht wenn Chlor organische Stoffe oxidiert hat
                  </p>
                </div>
              </div>
            </InfoCard>
          )}

          {/* Reduktion sidebar extras */}
          {activeTab === 'reduktion' && (
            <InfoCard darkMode={darkMode} title="Reduktionsmittel im Bad">
              <div className="space-y-3">
                <div className={`rounded-xl border p-3 ${darkMode ? 'border-blue-500/30 bg-blue-500/10' : 'border-blue-200 bg-blue-50'}`}>
                  <div className={`text-sm font-semibold ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                    Natriumthiosulfat (Na2S2O3)
                  </div>
                  <p className={`text-sm mt-1 leading-6 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    Standard-Entchlorungsmittel im Schwimmbad
                  </p>
                  <p className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                    Reduziert ueberschuessiges Chlor schnell und sicher
                  </p>
                </div>
                <div className={`rounded-xl border p-3 ${darkMode ? 'border-amber-500/30 bg-amber-500/10' : 'border-amber-200 bg-amber-50'}`}>
                  <div className={`text-sm font-semibold ${darkMode ? 'text-amber-300' : 'text-amber-700'}`}>
                    Einsatzfälle
                  </div>
                  <p className={`text-sm mt-1 leading-6 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    Nach Stosschlorung, bei Dosierpanne, vor Abwasserableitung
                  </p>
                  <p className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                    Immer nach der Entchlorung den Chlorwert nachmessen!
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
                    ? 'bg-blue-500 text-white hover:bg-blue-400'
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
