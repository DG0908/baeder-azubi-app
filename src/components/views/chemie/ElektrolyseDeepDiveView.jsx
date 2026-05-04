import { useState } from 'react';
import { useApp } from '../../../context/AppContext';

/* --- Tab data ---------------------------------------------------------------- */

const TABS = {
  grundlagen: {
    id: 'grundlagen',
    chip: 'Grundlagen',
    title: 'Was ist Elektrolyse?',
    intro:
      'Stell dir vor, du könntest Chlor einfach selbst herstellen — direkt in deinem Schwimmbad, aus ganz normalem Salz und Strom. Genau das macht die Elektrolyse! Du brauchst keine gefährlichen Chemikalien mehr anliefern zu lassen. Strom fliesst durch Salzwasser, und an den Elektroden entsteht Chlor. Kein LKW mit Gefahrgut, kein Lager für ätzende Stoffe — einfach Salz, Wasser und Strom.',
    motto: 'Aus Salz und Strom wird Chlor — direkt vor Ort.',
    rules: [
      'Elektrolyse = mit elektrischem Strom wird eine chemische Reaktion erzwungen.',
      'Im Schwimmbad: Aus Kochsalz (NaCl) und Wasser wird Chlor hergestellt.',
      'Die Reaktion: 2 NaCl + 2 H2O -> Cl2 + 2 NaOH + H2 (vereinfacht).',
      'Anode (+) = hier entsteht Chlor. Kathode (-) = hier entsteht Wasserstoff.',
      'Vorteil: Kein Transport und keine Lagerung von gefährlichen Chemikalien nötig.'
    ],
    steps: [
      {
        title: '1. Was ist Elektrolyse ueberhaupt?',
        text: 'Elektrolyse bedeutet: Man zwingt eine chemische Reaktion mit Strom. Normalerweise wuerde Salz im Wasser einfach gelöst bleiben. Aber wenn du Strom durchschickst, wird das Salz in seine Bestandteile zerlegt — und dabei entsteht unter anderem Chlor.'
      },
      {
        title: '2. Anode und Kathode',
        text: 'In der Elektrolysezelle gibt es zwei Elektroden: Die Anode (Pluspol) und die Kathode (Minuspol). An der Anode entsteht Chlorgas (Cl2), an der Kathode Wasserstoff (H2). Dazwischen ist die Salzlösung, der sogenannte Elektrolyt.'
      },
      {
        title: '3. Warum ist das für Schwimmbäder super?',
        text: 'Chlorgas ist extrem gefährlich beim Transport. Natriumhypochlorit (flüssiges Chlor) ist ätzend und muss gelagert werden. Mit Elektrolyse stellst du das Chlor direkt vor Ort her — kein Gefahrguttransport, kein grosses Chemikalienlager, mehr Sicherheit für alle.'
      },
      {
        title: '4. Die chemische Reaktion',
        text: 'Vereinfacht: 2 NaCl + 2 H2O -> Cl2 + 2 NaOH + H2. Also: Aus Kochsalz und Wasser entstehen Chlor, Natronlauge und Wasserstoff. Die Natronlauge (NaOH) ist wichtig — sie macht das Wasser basischer, deshalb steigt der pH-Wert!'
      }
    ],
    examples: [
      {
        title: 'Vergleich: Chlor kaufen vs. selbst herstellen',
        given: 'Ein Hallenbad verbraucht ca. 50 kg Chlor pro Monat.',
        question: 'Was sind die Unterschiede zwischen Kauf und Elektrolyse?',
        steps: [
          ['Kauf (NaClO)', 'Kanister werden per LKW geliefert — Gefahrguttransport'],
          ['Lagerung', 'Große Kanister müssen in speziellen Räumen gelagert werden'],
          ['Elektrolyse', 'Nur Salz wird geliefert — kein Gefahrgut, einfache Lagerung'],
          ['Ergebnis', 'Elektrolyse = sicherer, aber höherer Stromverbrauch']
        ]
      },
      {
        title: 'Die Bestandteile einer Elektrolyse',
        given: 'Du sollst einem Kollegen erklären, was bei der Elektrolyse passiert.',
        question: 'Welche Begriffe musst du kennen?',
        steps: [
          ['Elektrolyt', 'Die Salzlösung, durch die der Strom fliesst'],
          ['Anode (+)', 'Der Pluspol — hier entsteht Chlor (Cl2)'],
          ['Kathode (-)', 'Der Minuspol — hier entsteht Wasserstoff (H2)'],
          ['Gleichstrom', 'Es wird Gleichstrom (DC) benötigt, kein Wechselstrom']
        ]
      },
      {
        title: 'Nebenprodukt Natronlauge',
        given: 'Bei der Elektrolyse entsteht neben Chlor auch NaOH (Natronlauge).',
        question: 'Warum ist das wichtig für den Bäderbetrieb?',
        steps: [
          ['Was ist NaOH?', 'Natronlauge — eine Base (Lauge), die den pH-Wert erhöht'],
          ['Auswirkung', 'Der pH-Wert im Becken steigt langsam an'],
          ['Problem', 'Zu hoher pH = Chlor wirkt schlechter (weniger HOCl)'],
          ['Lösung', 'Mehr pH-Senker (Salzsäure oder CO2) dosieren']
        ]
      }
    ],
    pitfalls: [
      'Elektrolyse erzeugt NICHT nur Chlor — auch Natronlauge (NaOH) und Wasserstoff (H2) entstehen als Nebenprodukte!',
      'Wasserstoff ist brennbar und explosiv — bei geschlossenen Anlagen muss die Entlüftung stimmen.',
      'Der pH-Wert steigt durch die Natronlauge-Bildung — das musst du ständig ausgleichen.',
      'Elektrolyse braucht GLEICHSTROM (DC), nicht den normalen Wechselstrom aus der Steckdose.'
    ],
    quiz: {
      question: 'Was entsteht an der Anode (+) bei der Chlorelektrolyse?',
      options: ['Wasserstoff (H2)', 'Chlor (Cl2)', 'Natronlauge (NaOH)'],
      correctIndex: 1,
      explanation: 'An der Anode (Pluspol) entsteht Chlor (Cl2). Wasserstoff entsteht an der Kathode, und Natronlauge bildet sich in der Lösung.'
    }
  },

  prozess: {
    id: 'prozess',
    chip: 'Prozess',
    title: 'Wie funktioniert Chlorelektrolyse?',
    intro:
      'Es gibt verschiedene Arten, wie die Elektrolyse im Schwimmbad eingesetzt wird. Bei der Inline-Elektrolyse wird Salz direkt ins Beckenwasser gegeben. Bei der Side-Stream-Elektrolyse wird eine konzentrierte Salzlösung separat aufbereitet. Und die modernste Variante ist die Membranzellenelektrolyse. Jede hat ihre Vor- und Nachteile.',
    motto: 'Salz lösen, Strom durchschicken, Chlor entsteht.',
    rules: [
      'Inline-Elektrolyse: Salz wird direkt ins Beckenwasser gegeben (Salzgehalt ca. 3-5 g/L).',
      'Side-Stream-Elektrolyse: Eine konzentrierte Sole (ca. 20-30 g/L) wird separat elektrolysiert.',
      'Membranzellenelektrolyse: Modernste Technik — erzeugt direkt Natriumhypochlorit (NaClO).',
      'Salzverbrauch: Ca. 3-4 kg Kochsalz (NaCl) pro kg erzeugtem Chlor.',
      'Der Prozess läuft automatisch — die Steuerung regelt die Chlorproduktion nach Bedarf.'
    ],
    steps: [
      {
        title: '1. Salz lösen',
        text: 'Kochsalz (NaCl) wird in Wasser aufgelöst. Bei Inline-Systemen direkt im Becken (3-5 g/L), bei Side-Stream-Anlagen wird eine konzentrierte Sole (20-30 g/L) in einem separaten Behälter angesetzt.'
      },
      {
        title: '2. Durch die Zelle leiten',
        text: 'Die Salzlösung wird durch die Elektrolysezelle gepumpt. Dort befinden sich die Elektroden (meist Titan mit Spezialbeschichtung). Gleichstrom fliesst durch die Lösung.'
      },
      {
        title: '3. Chlor entsteht',
        text: 'An der Anode entsteht Chlor. Bei der Membranzellenelektrolyse reagiert das Chlor sofort mit der Natronlauge zu Natriumhypochlorit (NaClO) — das ist das gleiche wie im gekauften flüssigen Chlor.'
      },
      {
        title: '4. Ins Becken dosieren',
        text: 'Das erzeugte Chlor (oder NaClO) wird ins Beckenwasser dosiert. Die Steuerung misst ständig den Chlorwert und regelt die Produktion: Zu wenig Chlor = mehr Strom, zu viel Chlor = weniger Strom.'
      }
    ],
    examples: [
      {
        title: 'Inline-Elektrolyse im Freibad',
        given: 'Ein Freibad mit 500 m3 Becken hat eine Inline-Elektrolyseanlage. Salzgehalt: 4 g/L.',
        question: 'Wie viel Salz ist im Becken und wie funktioniert die Desinfektion?',
        steps: [
          ['Salzmenge', '500 m3 x 4 g/L = 2.000 kg = 2 Tonnen Salz im Becken'],
          ['Funktionsweise', 'Beckenwasser fliesst durch die Elektrolysezelle im Umwälzkreislauf'],
          ['Chlorerzeugung', 'Die Zelle erzeugt Chlor direkt aus dem salzigen Beckenwasser'],
          ['Vorteil', 'Einfaches System, keine separate Sole nötig']
        ]
      },
      {
        title: 'Side-Stream-Elektrolyse in der Halle',
        given: 'Ein Hallenbad nutzt Side-Stream-Elektrolyse. In einem 200-L-Tank wird Sole mit 25 g/L angesetzt.',
        question: 'Wie funktioniert dieses System?',
        steps: [
          ['Sole ansetzen', '200 L Wasser + 5 kg Salz = 25 g/L konzentrierte Sole'],
          ['Elektrolyse', 'Nur die Sole wird durch die Zelle gepumpt — nicht das Beckenwasser'],
          ['Produkt', 'Es entsteht konzentriertes NaClO (Natriumhypochlorit)'],
          ['Dosierung', 'Das NaClO wird wie normales Chlor ins Becken dosiert']
        ]
      },
      {
        title: 'Salzverbrauch berechnen',
        given: 'Das Schwimmbad verbraucht 2 kg Chlor pro Tag. Faustformel: 3,5 kg NaCl pro 1 kg Chlor.',
        question: 'Wie viel Salz wird pro Monat verbraucht?',
        steps: [
          ['Pro Tag', '2 kg Chlor x 3,5 = 7 kg Salz pro Tag'],
          ['Pro Monat', '7 kg x 30 Tage = 210 kg Salz pro Monat'],
          ['Kosten', 'Poolsalz kostet ca. 0,20-0,40 Euro/kg = ca. 42-84 Euro/Monat'],
          ['Plus Strom', 'Dazu kommen noch die Stromkosten für die Elektrolyse']
        ]
      }
    ],
    pitfalls: [
      'Inline-Systeme machen das Beckenwasser salzig — manche Badegäste stört das, besonders ab 4-5 g/L.',
      'Side-Stream braucht einen separaten Soletank und eine Dosierpumpe — mehr Technik, aber kein Salz im Becken.',
      'Der Salzverbrauch ist NICHT gleich dem Chlorverbrauch — man braucht ca. 3-4 mal mehr Salz als Chlor.',
      'Bei zu niedrigem Salzgehalt produziert die Zelle weniger Chlor — regelmäßig messen!'
    ],
    quiz: {
      question: 'Was ist der Hauptunterschied zwischen Inline- und Side-Stream-Elektrolyse?',
      options: ['Inline ist teurer als Side-Stream', 'Bei Inline ist das Salz direkt im Beckenwasser, bei Side-Stream wird eine separate Sole elektrolysiert', 'Side-Stream braucht mehr Salz als Inline'],
      correctIndex: 1,
      explanation: 'Bei der Inline-Elektrolyse wird das Salz direkt ins Beckenwasser gegeben (3-5 g/L). Bei der Side-Stream-Elektrolyse wird eine konzentrierte Sole (20-30 g/L) in einem separaten Tank angesetzt und nur diese durch die Zelle geleitet.'
    }
  },

  anlage: {
    id: 'anlage',
    chip: 'Anlage',
    title: 'Aufbau einer Elektrolyseanlage',
    intro:
      'Eine Elektrolyseanlage besteht aus mehreren Komponenten, die zusammenarbeiten. Das Herzstück ist die Elektrolysezelle mit ihren Titanelektroden. Dazu kommen Salztank, Dosierpumpe, Gleichrichter und die Steuerung. Hier lernst du jedes Teil kennen — und vor allem, wie du die Anlage wartest und am Laufen hältst.',
    motto: 'Titanelektroden, Gleichstrom, Sole — das sind die drei Grundzutaten.',
    rules: [
      'Die Elektrolysezelle ist das Herzstück — hier findet die chemische Reaktion statt.',
      'Titanelektroden mit Edelmetallbeschichtung (z.B. Rutheniumoxid) sind Standard.',
      'Der Gleichrichter wandelt Wechselstrom (AC) in Gleichstrom (DC) um.',
      'Wartung: Zelle regelmäßig entkalken (Säurespülung), Salzstand prüfen, Elektroden kontrollieren.',
      'Lebensdauer der Zelle: ca. 8.000-12.000 Betriebsstunden — danach müssen die Elektroden erneuert werden.'
    ],
    steps: [
      {
        title: '1. Salztank / Solebehälter',
        text: 'Hier wird das Kochsalz gelöst und die Sole aufbereitet. Bei Side-Stream-Anlagen ist das ein separater Tank (100-500 Liter). Das Salz wird regelmäßig nachgefüllt. Ein Füllstandssensor meldet, wenn Salz fehlt.'
      },
      {
        title: '2. Elektrolysezelle',
        text: 'Die Zelle besteht aus mehreren Kammern mit Titanelektroden. Die Sole fliesst durch die Kammern, Gleichstrom fliesst durch die Elektroden. An der Anode entsteht Chlor, an der Kathode Wasserstoff. Bei Membranzellenanlagen trennt eine Membran die Kammern.'
      },
      {
        title: '3. Gleichrichter (Netzteil)',
        text: 'Der Gleichrichter wandelt den Wechselstrom aus dem Stromnetz in Gleichstrom um. Ohne Gleichstrom funktioniert keine Elektrolyse. Die Steuerung regelt die Stromstärke — mehr Strom = mehr Chlorproduktion.'
      },
      {
        title: '4. Steuerung und Dosierung',
        text: 'Die Steuerung ueberwacht den Chlorwert im Becken und regelt die Produktion automatisch. Wenn der Chlorwert zu niedrig ist, wird mehr Strom durch die Zelle geschickt. Ein Display zeigt dir alle wichtigen Werte an: Chlorproduktion, Salzgehalt, Betriebsstunden.'
      }
    ],
    examples: [
      {
        title: 'Wartung: Zelle entkalken',
        given: 'Die Chlorproduktion ist in den letzten Wochen gesunken. Die Zelle läuft seit 2.000 Stunden ohne Reinigung.',
        question: 'Was muss gemacht werden?',
        steps: [
          ['Diagnose', 'Kalkablagerungen auf den Elektroden verringern die Leistung'],
          ['Maßnahme', 'Säurespülung: Zelle mit verdünnter Salzsäure (ca. 5-10%) spülen'],
          ['Dauer', 'Ca. 15-30 Minuten einwirken lassen, dann gründlich mit Wasser nachspülen'],
          ['Intervall', 'Alle 500-2.000 Betriebsstunden, je nach Wasserhärte']
        ]
      },
      {
        title: 'Vorteile vs. Nachteile abwägen',
        given: 'Der Betreiber ueberlegt, ob er auf Elektrolyse umstellen soll.',
        question: 'Was spricht dafür, was dagegen?',
        steps: [
          ['Vorteil', 'Keine Gefahrstofflagerung, hohe Betriebssicherheit, gleichmäßige Dosierung'],
          ['Vorteil', 'Kein Gefahrguttransport, weniger Vorschriften für Lagerräume'],
          ['Nachteil', 'Hohe Anschaffungskosten (15.000-50.000 Euro), Stromverbrauch'],
          ['Nachteil', 'Wartung der Zelle nötig, Salzkorrosion an Metallteilen möglich']
        ]
      },
      {
        title: 'Elektrodenlebensdauer planen',
        given: 'Die Elektrolysezelle hat 10.000 Betriebsstunden als Lebensdauer. Das Bad läuft 14 Stunden am Tag.',
        question: 'Wie lange halten die Elektroden?',
        steps: [
          ['Betrieb pro Jahr', '14 h/Tag x 365 Tage = 5.110 Stunden/Jahr'],
          ['Lebensdauer', '10.000 h / 5.110 h = ca. 2 Jahre'],
          ['Kosten', 'Neue Elektroden: ca. 2.000-5.000 Euro je nach Größe'],
          ['Tipp', 'Regelmäßiges Entkalken verlängert die Lebensdauer deutlich!']
        ]
      }
    ],
    pitfalls: [
      'Elektroden NIE mechanisch reinigen (keine Bürste, kein Schaber) — nur Säurespülung! Sonst wird die Beschichtung zerstört.',
      'Salzkorrosion ist ein echtes Problem — alle Metallteile in der Nähe der Anlage müssen korrosionsbeständig sein (Edelstahl, Kunststoff).',
      'Betriebsstundenzähler im Auge behalten — wenn die Zelle am Ende ist, sinkt die Chlorproduktion langsam ab.',
      'Der Gleichrichter braucht trockene Umgebung — Feuchtigkeit und Spritzwasser können ihn zerstören.'
    ],
    quiz: {
      question: 'Wie werden verkalkte Elektrolysezellen gereinigt?',
      options: ['Mit einer Drahtbürste mechanisch schrubben', 'Mit verdünnter Salzsäure spülen (Säurespülung)', 'Mit Hochdruckreiniger abspritzen'],
      correctIndex: 1,
      explanation: 'Elektrolysezellen werden mit verdünnter Salzsäure (5-10%) gespült. NIEMALS mechanisch reinigen — das zerstört die empfindliche Edelmetallbeschichtung der Titanelektroden!'
    }
  },

  praxis: {
    id: 'praxis',
    chip: 'Praxis',
    title: 'Elektrolyse im Bäderalltag',
    intro:
      'Im täglichen Betrieb musst du die Elektrolyseanlage ueberwachen und pflegen. Dazu gehört: Salzgehalt messen, Chlorproduktion kontrollieren und den pH-Wert im Auge behalten. Denn bei der Elektrolyse entsteht Natronlauge als Nebenprodukt — der pH-Wert steigt also ständig. Hier lernst du die wichtigsten Praxis-Tipps.',
    motto: 'Salz prüfen, pH korrigieren, Zelle pflegen — jeden Tag.',
    rules: [
      'Täglich den Salzgehalt im Becken oder Soletank prüfen — zu wenig Salz = zu wenig Chlor.',
      'Der pH-Wert steigt durch NaOH-Bildung bei der Elektrolyse — regelmäßig pH-Senker dosieren.',
      'Salzgehalt im Becken je nach System: 0,5 g/L (kaum spürbar) bis 5 g/L (deutlich salzig).',
      'Betriebsstundenzähler regelmäßig ablesen — rechtzeitig Wartung planen.',
      'Bei Störungen: Zuerst Salzgehalt prüfen, dann Zelle auf Verkalkung checken, dann Gleichrichter.'
    ],
    steps: [
      {
        title: '1. Tägliche Kontrolle',
        text: 'Jeden Morgen: Salzgehalt messen (Refraktometer oder Sensor), Chlorwert prüfen (DPD1), pH-Wert kontrollieren. Die Steuerung zeigt dir ausserdem die aktuelle Chlorproduktion und die Betriebsstunden an.'
      },
      {
        title: '2. pH-Wert korrigieren',
        text: 'Bei Elektrolyse steigt der pH ständig (wegen NaOH). Du brauchst deutlich mehr pH-Senker als bei normaler Chlordosierung. Typisch: pH-Korrektur mit Salzsäure oder CO2-Dosierung. Ziel: pH 7,0-7,4.'
      },
      {
        title: '3. Salzgehalt nachfüllen',
        text: 'Salz geht durch die Elektrolyse verbraucht (ca. 3-4 kg NaCl pro kg Chlor). Ausserdem geht Salz durch Rückspülung und Frischwasserzufuhr verloren. Regelmäßig nachfüllen — NUR Poolsalz oder reines Siedesalz verwenden, kein Streusalz!'
      },
      {
        title: '4. Typische Probleme lösen',
        text: 'Zelle verkalkt = weniger Chlor, Säurespülung nötig. Salzgehalt zu niedrig = Anlage geht in Störung. pH driftet hoch = mehr pH-Senker dosieren. Stromkosten zu hoch = Anlage nur bei Bedarf laufen lassen, nicht dauerhaft.'
      }
    ],
    examples: [
      {
        title: 'Morgenroutine mit Elektrolyseanlage',
        given: 'Du beginnst die Frühschicht. Anlage zeigt: Salzgehalt 2,8 g/L, Chlor 0,3 mg/L, pH 7,6.',
        question: 'Was musst du tun?',
        steps: [
          ['Salzgehalt', '2,8 g/L — am unteren Rand (Soll: 3-5 g/L). Bald nachfüllen!'],
          ['Chlor frei', '0,3 mg/L — gerade noch im Sollbereich (0,3-0,6 mg/L)'],
          ['pH-Wert', '7,6 — zu hoch! pH-Senker dosieren (Ziel: 7,0-7,4)'],
          ['Maßnahme', 'Salz bestellen/nachfüllen, pH-Senker erhöhen, im Betriebsbuch dokumentieren']
        ]
      },
      {
        title: 'Kostenvergleich: Elektrolyse vs. NaClO vs. Chlorgas',
        given: 'Ein Hallenbad mit 800 m3 verbraucht ca. 3 kg Chlor pro Tag.',
        question: 'Was kostet die Desinfektion pro Monat bei verschiedenen Verfahren?',
        steps: [
          ['Chlorgas', 'Ca. 3 Euro/kg x 90 kg/Monat = 270 Euro. ABER: hohe Sicherheitsauflagen, Gaswarnanlage Pflicht'],
          ['NaClO (flüssig)', 'Ca. 1-2 Euro/L x ca. 200 L/Monat = 200-400 Euro. Plus Lager und Transport'],
          ['Elektrolyse', 'Salz: ca. 60-120 Euro + Strom: ca. 150-250 Euro = 210-370 Euro/Monat'],
          ['Fazit', 'Laufende Kosten ähnlich, aber Elektrolyse hat hohe Anschaffungskosten (15.000-50.000 Euro)']
        ]
      },
      {
        title: 'Wann lohnt sich Elektrolyse?',
        given: 'Ein Schwimmbad wird neu gebaut. Der Planer fragt, welches Desinfektionsverfahren empfohlen wird.',
        question: 'In welchen Fällen ist Elektrolyse die beste Wahl?',
        steps: [
          ['Neubau', 'Bei Neubau am günstigsten, weil die Anlage gleich eingeplant wird'],
          ['Sicherheit', 'Wenn Chlorgas zu gefährlich ist (z.B. in der Nähe von Wohnungen)'],
          ['Kein Lager', 'Wenn kein geeigneter Chemikalien-Lagerraum vorhanden ist'],
          ['Sole vorhanden', 'Wenn Sole (z.B. aus einem Solebecken) sowieso vorhanden ist — doppelte Nutzung']
        ]
      }
    ],
    pitfalls: [
      'NIEMALS Streusalz oder Jodsalz verwenden — nur reines Siedesalz oder spezielles Poolsalz. Verunreinigungen zerstören die Elektroden.',
      'Der pH-Wert steigt bei Elektrolyse STAERKER als bei normaler Chlorung — pH-Senker-Verbrauch ist deutlich höher.',
      'Bei niedrigem Salzgehalt geht die Anlage in Störung und produziert KEIN Chlor mehr — dann ist das Becken ungeschützt!',
      'Elektrolyse ersetzt NICHT die regelmäßige Wasseraufbereitung — Filtration, Flockung und pH-Korrektur bleiben genauso wichtig.'
    ],
    quiz: {
      question: 'Die Elektrolyseanlage zeigt Störung. Der Chlorwert sinkt. Was prüfst du ZUERST?',
      options: ['Den Gleichrichter austauschen', 'Den Salzgehalt im Becken/Soletank messen', 'Sofort auf manuelle Chlordosierung umstellen und Techniker rufen'],
      correctIndex: 1,
      explanation: 'Die häufigste Ursache für Störungen ist ein zu niedriger Salzgehalt. Deshalb immer ZUERST den Salzgehalt prüfen. Erst wenn der stimmt, weiter nach Verkalkung oder Gleichrichter-Problemen suchen.'
    }
  }
};

const TAB_ORDER = ['grundlagen', 'prozess', 'anlage', 'praxis'];

/* --- Sidebar reference tables ------------------------------------------------ */

const VERFAHRENSVERGLEICH = [
  ['Eigenschaft', 'Inline', 'Side-Stream', 'Membranzelle'],
  ['Salz im Becken', 'Ja (3-5 g/L)', 'Nein', 'Nein'],
  ['Sole nötig', 'Nein', 'Ja', 'Ja'],
  ['Chlorprodukt', 'Cl2 im Wasser', 'NaClO', 'NaClO'],
  ['Komplexität', 'Einfach', 'Mittel', 'Hoch']
];

const KOSTENUEBERSICHT = [
  ['Posten', 'Richtwert'],
  ['Anschaffung', '15.000-50.000 Euro'],
  ['Salz/Monat', '60-120 Euro'],
  ['Strom/Monat', '150-250 Euro'],
  ['Elektrodentausch', '2.000-5.000 Euro'],
  ['Tausch-Intervall', 'Alle 2-4 Jahre']
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

export default function ElektrolyseDeepDiveView() {
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

          {/* Verfahrensvergleich table (grundlagen and prozess tabs) */}
          {(activeTab === 'grundlagen' || activeTab === 'prozess') && (
            <InfoCard darkMode={darkMode} title="Verfahrensvergleich">
              <div className="overflow-hidden rounded-xl border border-transparent">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className={darkMode ? 'border-slate-800' : 'border-gray-200'}>
                      {VERFAHRENSVERGLEICH[0].map((header) => (
                        <th key={header} className={`px-3 py-2 text-left font-semibold ${darkMode ? 'bg-slate-950/50 text-slate-400' : 'bg-gray-50 text-gray-500'}`}>
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {VERFAHRENSVERGLEICH.slice(1).map(([eigenschaft, inline, sidestream, membran]) => (
                      <tr key={eigenschaft} className={`${darkMode ? 'border-slate-800' : 'border-gray-200'} border-b last:border-b-0`}>
                        <td className={`px-3 py-2 font-semibold whitespace-nowrap ${darkMode ? 'bg-slate-950/50 text-white' : 'bg-gray-50 text-gray-900'}`}>
                          {eigenschaft}
                        </td>
                        <td className={`px-3 py-2 ${darkMode ? 'bg-slate-900/40 text-slate-300' : 'bg-white text-gray-700'}`}>
                          {inline}
                        </td>
                        <td className={`px-3 py-2 ${darkMode ? 'bg-slate-900/40 text-slate-300' : 'bg-white text-gray-700'}`}>
                          {sidestream}
                        </td>
                        <td className={`px-3 py-2 ${darkMode ? 'bg-slate-900/40 text-slate-300' : 'bg-white text-gray-700'}`}>
                          {membran}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </InfoCard>
          )}

          {/* Kostenübersicht table (anlage and praxis tabs) */}
          {(activeTab === 'anlage' || activeTab === 'praxis') && (
            <InfoCard darkMode={darkMode} title="Kostenübersicht">
              <div className="overflow-hidden rounded-xl border border-transparent">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className={darkMode ? 'border-slate-800' : 'border-gray-200'}>
                      {KOSTENUEBERSICHT[0].map((header) => (
                        <th key={header} className={`px-3 py-2 text-left font-semibold ${darkMode ? 'bg-slate-950/50 text-slate-400' : 'bg-gray-50 text-gray-500'}`}>
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {KOSTENUEBERSICHT.slice(1).map(([posten, richtwert]) => (
                      <tr key={posten} className={`${darkMode ? 'border-slate-800' : 'border-gray-200'} border-b last:border-b-0`}>
                        <td className={`px-3 py-2 font-semibold whitespace-nowrap ${darkMode ? 'bg-slate-950/50 text-white' : 'bg-gray-50 text-gray-900'}`}>
                          {posten}
                        </td>
                        <td className={`px-3 py-2 ${darkMode ? 'bg-slate-900/40 text-slate-300' : 'bg-white text-gray-700'}`}>
                          {richtwert}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </InfoCard>
          )}

          {/* Quick reference cards (grundlagen) */}
          {activeTab === 'grundlagen' && (
            <InfoCard darkMode={darkMode} title="Wichtige Begriffe">
              <div className="space-y-3">
                <div className={`rounded-xl border p-3 ${darkMode ? 'border-blue-500/30 bg-blue-500/10' : 'border-blue-200 bg-blue-50'}`}>
                  <div className={`text-sm font-semibold ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                    Anode (+)
                  </div>
                  <p className={`text-sm mt-1 leading-6 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    Der Pluspol — hier entsteht Chlor (Cl2)
                  </p>
                  <p className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                    Eselsbrücke: Anode = A = Anfang der Chlorproduktion
                  </p>
                </div>
                <div className={`rounded-xl border p-3 ${darkMode ? 'border-amber-500/30 bg-amber-500/10' : 'border-amber-200 bg-amber-50'}`}>
                  <div className={`text-sm font-semibold ${darkMode ? 'text-amber-300' : 'text-amber-700'}`}>
                    Kathode (-)
                  </div>
                  <p className={`text-sm mt-1 leading-6 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    Der Minuspol — hier entsteht Wasserstoff (H2)
                  </p>
                  <p className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                    Wasserstoff ist brennbar — Entlüftung wichtig!
                  </p>
                </div>
              </div>
            </InfoCard>
          )}

          {/* Prozess sidebar extras */}
          {activeTab === 'prozess' && (
            <InfoCard darkMode={darkMode} title="Salzgehalt-Richtwerte">
              <div className="space-y-3">
                <div className={`rounded-xl border p-3 ${darkMode ? 'border-blue-500/30 bg-blue-500/10' : 'border-blue-200 bg-blue-50'}`}>
                  <div className={`text-sm font-semibold ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                    Inline-Elektrolyse
                  </div>
                  <p className={`text-sm mt-1 leading-6 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    3-5 g/L Salz im Beckenwasser
                  </p>
                  <p className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                    Zum Vergleich: Meerwasser hat ca. 35 g/L
                  </p>
                </div>
                <div className={`rounded-xl border p-3 ${darkMode ? 'border-amber-500/30 bg-amber-500/10' : 'border-amber-200 bg-amber-50'}`}>
                  <div className={`text-sm font-semibold ${darkMode ? 'text-amber-300' : 'text-amber-700'}`}>
                    Side-Stream-Sole
                  </div>
                  <p className={`text-sm mt-1 leading-6 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    20-30 g/L im Soletank (konzentriert)
                  </p>
                  <p className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                    Kein Salz im Beckenwasser — Badegäste merken nichts
                  </p>
                </div>
              </div>
            </InfoCard>
          )}

          {/* Anlage sidebar extras */}
          {activeTab === 'anlage' && (
            <InfoCard darkMode={darkMode} title="Wartungsintervalle">
              <div className="space-y-3">
                <div className={`rounded-xl border p-3 ${darkMode ? 'border-blue-500/30 bg-blue-500/10' : 'border-blue-200 bg-blue-50'}`}>
                  <div className={`text-sm font-semibold ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                    Säurespülung
                  </div>
                  <p className={`text-sm mt-1 leading-6 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    Alle 500-2.000 Betriebsstunden
                  </p>
                  <p className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                    Bei hartem Wasser häufiger nötig
                  </p>
                </div>
                <div className={`rounded-xl border p-3 ${darkMode ? 'border-amber-500/30 bg-amber-500/10' : 'border-amber-200 bg-amber-50'}`}>
                  <div className={`text-sm font-semibold ${darkMode ? 'text-amber-300' : 'text-amber-700'}`}>
                    Elektrodentausch
                  </div>
                  <p className={`text-sm mt-1 leading-6 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    Nach 8.000-12.000 Betriebsstunden
                  </p>
                  <p className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                    Leistungsabfall ist erstes Anzeichen für Verschleiss
                  </p>
                </div>
              </div>
            </InfoCard>
          )}

          {/* Praxis sidebar extras */}
          {activeTab === 'praxis' && (
            <InfoCard darkMode={darkMode} title="Tagescheck Elektrolyse">
              <div className="space-y-3">
                <div className={`rounded-xl border p-3 ${darkMode ? 'border-blue-500/30 bg-blue-500/10' : 'border-blue-200 bg-blue-50'}`}>
                  <div className={`text-sm font-semibold ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                    Morgens prüfen
                  </div>
                  <p className={`text-sm mt-1 leading-6 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    Salzgehalt, Chlor frei, pH-Wert, Betriebsstunden
                  </p>
                  <p className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                    Alle Werte ins Betriebsbuch eintragen
                  </p>
                </div>
                <div className={`rounded-xl border p-3 ${darkMode ? 'border-amber-500/30 bg-amber-500/10' : 'border-amber-200 bg-amber-50'}`}>
                  <div className={`text-sm font-semibold ${darkMode ? 'text-amber-300' : 'text-amber-700'}`}>
                    pH-Drift beachten
                  </div>
                  <p className={`text-sm mt-1 leading-6 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    pH steigt durch NaOH-Bildung — täglich korrigieren
                  </p>
                  <p className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                    Mehr pH-Senker nötig als bei normaler Chlorung!
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
