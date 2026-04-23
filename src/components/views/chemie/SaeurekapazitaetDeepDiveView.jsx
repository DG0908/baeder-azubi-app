import { useState } from 'react';
import { useApp } from '../../../context/AppContext';

/* ─── Tab data ──────────────────────────────────────────────────────────────── */

const TABS = {
  grundlagen: {
    id: 'grundlagen',
    chip: 'Grundlagen',
    title: 'Was ist Säurekapazität?',
    intro:
      'Stell dir vor, dein Beckenwasser hat einen eingebauten Schutzschild für den pH-Wert. Genau das ist die Säurekapazität: Sie zeigt, wie gut das Wasser Säure "schlucken" kann, ohne dass der pH-Wert absackt. Je höher die Säurekapazität, desto stabiler bleibt der pH — auch wenn viele Badegaeste im Wasser sind oder Chemikalien dosiert werden. Ohne genuegend Puffer schwankt der pH ständig hin und her.',
    motto: 'Säurekapazität = Airbag für den pH-Wert.',
    rules: [
      'Die Säurekapazität (auch Pufferkapazität genannt) zeigt, wie stabil der pH-Wert des Wassers ist.',
      'Je höher die Säurekapazität, desto mehr Säure kann das Wasser aufnehmen, ohne dass der pH abstuerzt.',
      'Die Einheit ist mmol/L (Millimol pro Liter) — das ist einfach eine Mengenangabe für geloeste Teilchen.',
      'Säurekapazität, Wasserhärte und pH-Wert haengen eng zusammen — aendert sich einer, beeinflusst das die anderen.',
      'Ein guter Puffer im Schwimmbad sorgt dafür, dass die Dosieranlage nicht ständig nachregeln muss.'
    ],
    steps: [
      {
        title: '1. Was ist ein Puffer?',
        text: 'Ein Puffer ist wie ein Stossdaempfer: Er faengt Schwankungen ab. Im Wasser sorgt der Puffer dafür, dass der pH-Wert nicht bei jeder kleinen Veränderung sofort springt.'
      },
      {
        title: '2. Woher kommt der Puffer?',
        text: 'Der Puffer im Wasser besteht hauptsaechlich aus Hydrogencarbonat (HCO₃⁻). Das kommt natuerlich im Leitungswasser vor — je nach Region mehr oder weniger.'
      },
      {
        title: '3. Was stoert den Puffer?',
        text: 'Badegaeste bringen Schweiss, Urin und Kosmetik ein. Chlordosierung veraendert den pH. Frischwasserzufuhr verduennt den Puffer. All das greift die Säurekapazität an.'
      },
      {
        title: '4. Warum ist das wichtig?',
        text: 'Ohne Puffer schwankt der pH ständig. Dann wirkt mal das Chlor nicht richtig, mal werden Augen gereizt. Stabile Säurekapazität = stabile Wasserqualität!'
      }
    ],
    examples: [
      {
        title: 'Vergleich: Wasser mit und ohne Puffer',
        given: 'Zwei Becken mit pH 7,2. In Becken A ist die Säurekapazität hoch (1,5 mmol/L), in Becken B niedrig (0,3 mmol/L). Beide bekommen die gleiche Menge Säure.',
        question: 'Was passiert mit dem pH-Wert?',
        steps: [
          ['Becken A (hoher Puffer)', 'pH sinkt nur leicht auf 7,1 — der Puffer faengt die Säure ab'],
          ['Becken B (niedriger Puffer)', 'pH stuerzt auf 6,5 ab — kein Puffer, keine Bremse'],
          ['Ergebnis', 'Hohe Säurekapazität = stabiler pH, niedrige = pH-Achterbahn']
        ]
      },
      {
        title: 'Puffer im Alltag',
        given: 'Du kennst Puffer auch aus dem Alltag — auch wenn du sie nicht so nennst.',
        question: 'Welche Beispiele gibt es?',
        steps: [
          ['Blut', 'Hat einen Puffer bei pH 7,4 — deshalb schwankt dein Blut-pH kaum'],
          ['Beckenwasser', 'Hydrogencarbonat-Puffer haelt den pH stabil'],
          ['Leitungswasser', 'Hat von Natur aus Puffer — je nach Region mehr oder weniger'],
          ['Destilliertes Wasser', 'Hat KEINEN Puffer — ein Tropfen Säure aendert sofort den pH!']
        ]
      },
      {
        title: 'Einheiten verstehen',
        given: 'Die Säurekapazität wird in mmol/L gemessen. Was bedeutet das?',
        question: 'Wie kann man sich das vorstellen?',
        steps: [
          ['mmol/L', 'Millimol pro Liter — eine winzige Mengeneinheit für geloeste Stoffe'],
          ['1 mmol/L', 'Das Wasser kann 1 Millimol Säure pro Liter aufnehmen, bevor der pH kippt'],
          ['Sollwert Bad', 'Mindestens 0,7 mmol/L, besser über 1,0 mmol/L'],
          ['Zu niedrig?', 'Unter 0,7 mmol/L → pH wird instabil, Handlungsbedarf!']
        ]
      }
    ],
    pitfalls: [
      'Säurekapazität ist NICHT das Gleiche wie der pH-Wert! Der pH sagt dir den aktuellen Stand, die Säurekapazität sagt dir die Stabilitaet.',
      'Weiches Wasser hat oft wenig Puffer — wenn dein Leitungswasser weich ist, musst du den Puffer extra aufbauen.',
      'Nach Stossdesinfektionen sinkt die Säurekapazität oft ab — danach immer nachmessen!',
      'Frischwasser verduennt den Puffer: Nach größerer Frischwasserzufuhr KS4,3-Wert kontrollieren.'
    ],
    quiz: {
      question: 'Was beschreibt die Säurekapazität am besten?',
      options: [
        'Wie sauer das Wasser gerade ist',
        'Wie gut das Wasser Säure abpuffern kann ohne dass der pH absackt',
        'Wie viel Chlor im Wasser geloest ist'
      ],
      correctIndex: 1,
      explanation: 'Die Säurekapazität zeigt, wie viel Säure das Wasser aufnehmen kann, bevor der pH-Wert deutlich sinkt. Sie ist der \"Airbag\" für den pH-Wert.'
    }
  },

  wasserhärte: {
    id: 'wasserhaerte',
    chip: 'Wasserhärte',
    title: 'Hartes und weiches Wasser',
    intro:
      'Wasserhärte — das klingt komisch, aber gemeint ist: Wie viel Kalk ist im Wasser? Genauer gesagt Calcium und Magnesium. Hartes Wasser hat viel Kalk (= viel Calcium), weiches Wasser hat wenig. Beides kann im Schwimmbad Probleme machen: Zu hart → Kalkablagerungen überall. Zu weich → das Wasser greift Metalle und Beton an.',
    motto: 'Hartes Wasser = viel Kalk. Weiches Wasser = wenig Kalk.',
    rules: [
      'Wasserhärte = Menge an Calcium (Ca²⁺) und Magnesium (Mg²⁺) im Wasser. Je mehr, desto härter.',
      'Einheit: °dH (Grad deutsche Härte). Alternativ auch mmol/L. Umrechnung: 1 °dH = 0,1786 mmol/L.',
      'Weich: unter 8,4 °dH. Mittel: 8,4 bis 14 °dH. Hart: über 14 °dH.',
      'DIN 19643 empfiehlt Calciumhärte zwischen 0,9 und 1,6 mmol/L (ca. 5 bis 9 °dH) für Schwimmbecken.',
      'Wasserhärte und Säurekapazität haengen zusammen — hartes Wasser hat meist auch eine höhere Säurekapazität.'
    ],
    steps: [
      {
        title: '1. Wasserhärte messen',
        text: 'Nimm eine Wasserprobe und miss die Gesamthärte mit einem Testkit (Titration mit EDTA) oder Photometer. Ergebnis in °dH oder mmol/L ablesen.'
      },
      {
        title: '2. Wert einordnen',
        text: 'Unter 8,4 °dH = weich. 8,4–14 °dH = mittel. Über 14 °dH = hart. Für das Schwimmbad sind mittlere Werte am besten.'
      },
      {
        title: '3. Probleme erkennen',
        text: 'Kalkraender am Beckenrand? → Wasser zu hart. Gruene Flecken an Kupferleitungen? → Wasser zu weich und aggressiv. Beides schadet der Technik.'
      },
      {
        title: '4. Kalk-Kohlensäure-Gleichgewicht',
        text: 'Im Wasser gibt es ein Gleichgewicht zwischen Kalk und Kohlensäure. Ist es gestoert, faellt Kalk aus (Ablagerungen) oder loest sich Kalk auf (Korrosion).'
      }
    ],
    examples: [
      {
        title: 'Härtegrade im Vergleich',
        given: 'Du bekommst Wasser vom Wasserwerk. Je nach Region ist es unterschiedlich hart.',
        question: 'In welchen Bereich faellt dein Wasser?',
        steps: [
          ['Unter 8,4 °dH', 'Weich — z.B. Schwarzwald, Harz. Wenig Kalk, aber oft wenig Puffer.'],
          ['8,4–14 °dH', 'Mittel — ideal fuers Schwimmbad. Genug Puffer, nicht zu viel Kalk.'],
          ['Über 14 °dH', 'Hart — z.B. Muenchen, Franken. Viel Kalk, Ablagerungen drohen.'],
          ['Über 21 °dH', 'Sehr hart — Kalkprobleme fast garantiert. Enthaertung nötig.']
        ]
      },
      {
        title: 'Probleme bei zu hartem Wasser',
        given: 'Dein Beckenwasser hat 18 °dH Gesamthärte. Der pH-Wert liegt bei 7,4.',
        question: 'Welche Probleme können auftreten?',
        steps: [
          ['Beckenrand', 'Weisse Kalkraender bilden sich, besonders an der Wasserlinie'],
          ['Rohrleitungen', 'Kalk setzt sich in den Rohren ab — Querschnitt wird enger'],
          ['Wärmetauscher', 'Kalkschicht wirkt wie Isolierung — Heizleistung sinkt stark'],
          ['Filter', 'Kalk verstopft die Filterduesen — Spueldruck steigt']
        ]
      },
      {
        title: 'Probleme bei zu weichem Wasser',
        given: 'Dein Beckenwasser hat nur 3 °dH Gesamthärte.',
        question: 'Warum ist das auch nicht gut?',
        steps: [
          ['Korrosion', 'Weiches Wasser ist aggressiv — es loest Metalle und Beton an'],
          ['Kupferleitungen', 'Kupfer loest sich → gruenliche Verfaerbung des Wassers möglich'],
          ['Fugenmoertel', 'Wird angegriffen und broeckelt mit der Zeit'],
          ['Puffer fehlt', 'Weiches Wasser hat meist wenig Säurekapazität → pH-Wert instabil']
        ]
      }
    ],
    pitfalls: [
      'Wasserhärte ist NICHT das Gleiche wie Säurekapazität! Härte = Calcium/Magnesium, Puffer = Hydrogencarbonat. Aber sie haengen zusammen.',
      'Nur die Gesamthärte messen reicht nicht — für die Beurteilung im Bad ist die Calciumhärte wichtiger als die Magnesiumhärte.',
      'Kalkablagerungen kommen nicht nur von hartem Wasser, sondern auch von zu hohem pH-Wert — beides zusammen prüfen!',
      'Nach einer Beckenentleerung und Neubefuellung aendert sich die Wasserhärte — sofort neu messen!'
    ],
    quiz: {
      question: 'Ab welchem Wert gilt Wasser als "hart"?',
      options: [
        'Ab 4 °dH',
        'Ab 8,4 °dH',
        'Ab 14 °dH'
      ],
      correctIndex: 2,
      explanation: 'Ab 14 °dH gilt Wasser als hart. Unter 8,4 °dH ist es weich, dazwischen mittel.'
    }
  },

  'ks-wert': {
    id: 'ks-wert',
    chip: 'KS4,3-Wert',
    title: 'Der Pufferwert fuers Schwimmbad',
    intro:
      'Der KS4,3-Wert ist DIE wichtige Zahl, wenn es um die Säurekapazität im Schwimmbad geht. Das \"KS\" steht für Säurekapazität, die \"4,3\" für den pH-Wert 4,3 — bis dahin wird gemessen, wie viel Säure das Wasser schlucken kann. Je höher der KS4,3-Wert, desto stabiler bleibt dein pH-Wert im Becken.',
    motto: 'KS4,3 mindestens 0,7 mmol/L — besser über 1,0!',
    rules: [
      'KS4,3 bedeutet: Säurekapazität bis pH 4,3. Man misst, wie viel Salzsäure man zugeben muss, bis der pH auf 4,3 faellt.',
      'Sollwert im Schwimmbad: mindestens 0,7 mmol/L. Besser ist ein Wert über 1,0 mmol/L für stabilen Betrieb.',
      'Gemessen wird durch Titration: Du gibst tropfenweise Salzsäure zur Wasserprobe und zahlst, wie viel du brauchst.',
      'Ist der KS4,3 zu niedrig, schwankt der pH-Wert ständig — das Chlor wird instabil und die Dosieranlage kommt nicht hinterher.',
      'Den KS4,3 erhoehst du mit Natriumhydrogencarbonat (NaHCO₃, Natron) — das baut den Puffer wieder auf.'
    ],
    steps: [
      {
        title: '1. KS4,3 verstehen',
        text: 'KS4,3 sagt dir: Wie viel Säure kann mein Beckenwasser vertragen? Die Zahl in mmol/L zeigt die Pufferstärke. Höher = stabiler.'
      },
      {
        title: '2. Messung durchfuehren',
        text: 'Titration: Wasserprobe nehmen, Indikator zugeben. Dann tropfenweise 0,1-molare Salzsäure zugeben bis zum Farbumschlag bei pH 4,3. Verbrauchte Menge ablesen.'
      },
      {
        title: '3. Wert bewerten',
        text: 'Unter 0,7 mmol/L → zu wenig Puffer, Maßnahme nötig! 0,7–1,5 mmol/L → guter Bereich. Über 2,0 mmol/L → sehr stabil, aber auf Kalkausfall achten.'
      },
      {
        title: '4. Bei Bedarf nachsteuern',
        text: 'KS4,3 zu niedrig? Natriumhydrogencarbonat (NaHCO₃) dosieren. Faustregel: ca. 16 g NaHCO₃ pro m³ erhöhen den KS4,3 um ca. 0,1 mmol/L.'
      }
    ],
    examples: [
      {
        title: 'Titration Schritt für Schritt',
        given: 'Du sollst den KS4,3-Wert deines Beckenwassers bestimmen.',
        question: 'Wie gehst du bei der Titration vor?',
        steps: [
          ['Schritt 1', '100 ml Wasserprobe in ein Becherglas abmessen'],
          ['Schritt 2', 'Mischindikator zugeben (zeigt Farbumschlag bei pH 4,3 an)'],
          ['Schritt 3', 'Aus der Buerette tropfenweise 0,1 mol/L Salzsäure zugeben und umruehren'],
          ['Schritt 4', 'Beim Farbumschlag (gruen → rot) stoppen und abgelesenen Verbrauch notieren'],
          ['Ergebnis', 'Verbrauch in ml = KS4,3-Wert in mmol/L (bei 100 ml Probe und 0,1 mol/L HCl)']
        ]
      },
      {
        title: 'KS4,3 zu niedrig — was passiert?',
        given: 'Du misst KS4,3 = 0,3 mmol/L im Sportbecken. Der Sollwert ist mindestens 0,7 mmol/L.',
        question: 'Welche Folgen hat das?',
        steps: [
          ['pH-Stabilitaet', 'Der pH-Wert schwankt bei jeder kleinen Veränderung hin und her'],
          ['Chlor', 'Chlorwirkung wird unberechenbar — mal zu viel, mal zu wenig wirksames Chlor'],
          ['Dosieranlage', 'Regelt ständig nach, kommt aber nicht hinterher → hoher Chemikalienverbrauch'],
          ['Maßnahme', 'NaHCO₃ dosieren: Für Erhoehung um 0,4 mmol/L im 500-m³-Becken → 500 × 0,4 × 160 = 32 kg']
        ]
      },
      {
        title: 'Auch KS8,2 gibt es',
        given: 'Neben dem KS4,3 gibt es auch den KB8,2-Wert (Basekapazität bis pH 8,2).',
        question: 'Was ist der Unterschied?',
        steps: [
          ['KS4,3 (Säurekapazität)', 'Misst, wie viel Säure das Wasser abpuffern kann → wichtigster Wert im Bad'],
          ['KB8,2 (Basekapazität)', 'Misst, wie viel Base das Wasser abpuffern kann → zeigt freie Kohlensäure'],
          ['Praxis im Bad', 'KS4,3 ist der Wert, den du täglich kontrollieren musst'],
          ['Zusammenhang', 'Beide zusammen ergeben ein komplettes Bild der Pufferkapazität des Wassers']
        ]
      }
    ],
    pitfalls: [
      'KS4,3 und pH-Wert NICHT verwechseln! Der pH sagt dir den aktuellen Zustand, der KS4,3 sagt dir die Stabilitaet.',
      'Natriumhydrogencarbonat (NaHCO₃) und Natriumcarbonat (Na₂CO₃) sind NICHT das Gleiche! NaHCO₃ hebt hauptsaechlich den Puffer, Na₂CO₃ hebt stärker den pH.',
      'Bei der Titration genau arbeiten! Jeder Tropfen zu viel verfaelscht das Ergebnis. Langsam titrieren und gut umruehren.',
      'Ein zu hoher KS4,3 (über 2,5 mmol/L) kann auch problematisch sein — Kalkausfaellungen drohen, besonders bei hohem pH.'
    ],
    quiz: {
      question: 'Was bedeutet ein KS4,3-Wert von 0,4 mmol/L im Schwimmbecken?',
      options: [
        'Der Wert ist gut, alles in Ordnung',
        'Der Puffer ist zu niedrig — pH-Schwankungen drohen',
        'Das Wasser hat zu viel Chlor'
      ],
      correctIndex: 1,
      explanation: 'Ein KS4,3 von 0,4 mmol/L liegt unter dem Sollwert von 0,7 mmol/L. Der Puffer ist zu schwach — der pH-Wert wird instabil. NaHCO₃ muss dosiert werden.'
    }
  },

  praxis: {
    id: 'praxis',
    chip: 'Praxis',
    title: 'Wasserhärte und Puffer im Alltag',
    intro:
      'Jetzt wird es praktisch: Wie kontrollierst du Wasserhärte und Säurekapazität im täglichen Badebetrieb? Wie erkennst du Probleme, bevor sie teuer werden? Und wie dosierst du richtig, damit der pH-Wert stabil bleibt? In diesem Abschnitt lernst du die wichtigsten Handgriffe für deinen Arbeitsalltag.',
    motto: 'Messen, bewerten, dosieren — und immer nachmessen!',
    rules: [
      'Täglich messen: pH-Wert, freies Chlor, KS4,3-Wert und (mindestens woechentlich) Wasserhärte.',
      'Kalkraender am Beckenrand = hartes Wasser + zu hoher pH. Beides prüfen und korrigieren!',
      'pH-Schwankungen trotz laufender Dosieranlage = zu wenig Puffer. KS4,3 prüfen und NaHCO₃ nachdosieren.',
      'Alle Werte haengen zusammen: pH, KS4,3, Wasserhärte und Chlor beeinflussen sich gegenseitig.',
      'Immer in kleinen Schritten dosieren und nach 1–2 Stunden nachmessen — nie alles auf einmal reinschuetten!'
    ],
    steps: [
      {
        title: '1. Morgendliche Messung',
        text: 'Vor Badeöffnung: Wasserprobe nehmen (30 cm unter Oberfläche, nicht am Einlauf). pH, Chlor und KS4,3 messen. Werte ins Betriebstagebuch eintragen.'
      },
      {
        title: '2. Probleme erkennen',
        text: 'Kalkraender? → Härte und pH prüfen. pH springt ständig? → KS4,3 zu niedrig. Gruenlicher Schimmer? → Wasser evtl. zu weich, Kupfer loest sich.'
      },
      {
        title: '3. Richtig dosieren',
        text: 'KS4,3 zu niedrig → NaHCO₃ zugeben (ca. 16 g pro m³ für 0,1 mmol/L Erhoehung). Wasser zu hart → Enthaertungsanlage prüfen. pH immer NACH dem Puffer korrigieren.'
      },
      {
        title: '4. Dokumentieren und kontrollieren',
        text: '1–2 Stunden nach Dosierung nachmessen. Alle Werte dokumentieren. Trends beobachten — wenn der KS4,3 ständig absinkt, stimmt etwas Grundsätzliches nicht.'
      }
    ],
    examples: [
      {
        title: 'Dosierung NaHCO₃ berechnen',
        given: 'Sportbecken mit 500 m³. KS4,3 gemessen: 0,5 mmol/L. Sollwert: 1,0 mmol/L. Faustregel: 16 g NaHCO₃ pro m³ erhöhen den KS4,3 um 0,1 mmol/L.',
        question: 'Wie viel NaHCO₃ brauchst du?',
        steps: [
          ['Differenz', '1,0 − 0,5 = 0,5 mmol/L Erhoehung nötig'],
          ['Pro 0,1 mmol/L', '16 g NaHCO₃ pro m³'],
          ['Für 0,5 mmol/L', '5 × 16 g = 80 g pro m³'],
          ['Für 500 m³', '500 × 80 g = 40.000 g = 40 kg NaHCO₃'],
          ['Wichtig', 'Nicht alles auf einmal! In Portionen über den Tag verteilen und nachmessen.']
        ]
      },
      {
        title: 'Praxisszenario: Kalkraender am Beckenrand',
        given: 'Nach dem Wochenende findest du weisse Kalkraender an der Wasserlinie. Du misst: pH 7,6, Wasserhärte 19 °dH, KS4,3 = 1,8 mmol/L.',
        question: 'Was ist die Ursache und was tust du?',
        steps: [
          ['Analyse', 'Wasserhärte mit 19 °dH = zu hart (Soll: unter 14 °dH)'],
          ['Ursache', 'Hohe Calciumhärte + pH am oberen Rand → Kalk faellt aus dem Wasser aus'],
          ['Sofortmaßnahme', 'Kalkraender mechanisch entfernen (saurer Reiniger oder Schwamm)'],
          ['Langfristig', 'Enthaertungsanlage prüfen/einsetzen. pH eher bei 7,0–7,2 halten.']
        ]
      },
      {
        title: 'Praxisszenario: pH springt ständig',
        given: 'Die Dosieranlage zeigt: pH schwankt zwischen 6,8 und 7,5 innerhalb weniger Stunden. Chlorwert ist auch unbeständig. Du misst KS4,3 = 0,3 mmol/L.',
        question: 'Was ist das Problem und wie loest du es?',
        steps: [
          ['Problem', 'KS4,3 mit 0,3 mmol/L viel zu niedrig (Soll: mind. 0,7 mmol/L)'],
          ['Folge', 'Kein Puffer → jede kleine Veränderung lässt den pH stark schwanken'],
          ['Maßnahme', 'NaHCO₃ dosieren. Für 300 m³ Becken: 300 × 0,4 × 160 = 19,2 kg NaHCO₃ nötig'],
          ['Danach', 'pH stabilisiert sich, Chlorwirkung wird gleichmaessiger, Dosieranlage hat weniger Arbeit']
        ]
      }
    ],
    pitfalls: [
      'Nie gleichzeitig pH korrigieren UND Puffer aufbauen — erst den Puffer (NaHCO₃), dann nach 1–2 Stunden den pH nachjustieren.',
      'Ionentauscher zur Enthaertung müssen regelmäßig regeneriert werden — vergisst man das, kommt ploetzlich hartes Wasser durch.',
      'NaHCO₃ nicht direkt ins Becken schuetten! Erst in einem Eimer Wasser aufloesen, dann über die Dosieranlage oder gleichmaessig verteilen.',
      'Alle Werte zusammen betrachten: pH allein sagt nicht genug — immer auch KS4,3 und Wasserhärte im Blick behalten!'
    ],
    quiz: {
      question: 'Im Sportbecken (400 m³) ist der KS4,3 bei 0,4 mmol/L. Du willst auf 1,0 mmol/L kommen. Wie viel NaHCO₃ brauchst du ungefaehr? (Faustregel: 16 g pro m³ pro 0,1 mmol/L)',
      options: [
        'Etwa 10 kg NaHCO₃',
        'Etwa 38 kg NaHCO₃',
        'Etwa 100 kg NaHCO₃'
      ],
      correctIndex: 1,
      explanation: 'Differenz: 1,0 − 0,4 = 0,6 mmol/L. Für 0,6 mmol/L: 6 × 16 g = 96 g pro m³. Für 400 m³: 400 × 96 g = 38.400 g ≈ 38 kg NaHCO₃.'
    }
  }
};

const TAB_ORDER = ['grundlagen', 'wasserhärte', 'ks-wert', 'praxis'];

/* ─── Reference tables for sidebar ─────────────────────────────────────────── */

const HAERTEGRADE_TABLE = [
  ['Bereich', '°dH', 'mmol/L Ca', 'Bewertung'],
  ['Weich', '< 8,4', '< 1,5', 'Wenig Kalk, oft wenig Puffer'],
  ['Mittel', '8,4–14', '1,5–2,5', 'Ideal fuers Schwimmbad'],
  ['Hart', '14–21', '2,5–3,8', 'Kalkablagerungen möglich'],
  ['Sehr hart', '> 21', '> 3,8', 'Enthaertung dringend empfohlen']
];

const SOLLWERTE_TABLE = [
  ['Parameter', 'Sollwert', 'Einheit'],
  ['pH-Wert', '6,5–7,6 (ideal 7,0–7,2)', '—'],
  ['KS4,3 (Säurekapazität)', '≥ 0,7 (besser > 1,0)', 'mmol/L'],
  ['Calciumhärte', '0,9–1,6', 'mmol/L'],
  ['Gesamthärte', '5–14', '°dH'],
  ['Freies Chlor', '0,3–0,6', 'mg/L'],
  ['Gebundenes Chlor', '< 0,2', 'mg/L']
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

export default function SäurekapazitätDeepDiveView() {
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

          {/* Härtegrade table (on grundlagen and wasserhärte tabs) */}
          {(activeTab === 'grundlagen' || activeTab === 'wasserhärte') && (
            <InfoCard darkMode={darkMode} title="Härtegrade-Tabelle">
              <div className="overflow-hidden rounded-xl border border-transparent">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className={darkMode ? 'border-slate-800' : 'border-gray-200'}>
                      {HAERTEGRADE_TABLE[0].map((header) => (
                        <th key={header} className={`px-3 py-2 text-left font-semibold ${darkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-50 text-blue-700'}`}>
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {HAERTEGRADE_TABLE.slice(1).map(([bereich, dh, mmol, bewertung]) => (
                      <tr key={bereich} className={`${darkMode ? 'border-slate-800' : 'border-gray-200'} border-b last:border-b-0`}>
                        <td className={`px-3 py-2 font-semibold whitespace-nowrap ${darkMode ? 'bg-slate-950/50 text-white' : 'bg-gray-50 text-gray-900'}`}>
                          {bereich}
                        </td>
                        <td className={`px-3 py-2 ${darkMode ? 'bg-slate-900/40 text-slate-300' : 'bg-white text-gray-700'}`}>
                          {dh}
                        </td>
                        <td className={`px-3 py-2 ${darkMode ? 'bg-slate-900/40 text-slate-300' : 'bg-white text-gray-700'}`}>
                          {mmol}
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

          {/* Sollwerte table (on ks-wert and praxis tabs) */}
          {(activeTab === 'ks-wert' || activeTab === 'praxis') && (
            <InfoCard darkMode={darkMode} title="Sollwerte-Übersicht (DIN 19643)">
              <div className="overflow-hidden rounded-xl border border-transparent">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className={darkMode ? 'border-slate-800' : 'border-gray-200'}>
                      {SOLLWERTE_TABLE[0].map((header) => (
                        <th key={header} className={`px-3 py-2 text-left font-semibold ${darkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-50 text-blue-700'}`}>
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {SOLLWERTE_TABLE.slice(1).map(([param, soll, einheit]) => (
                      <tr key={param} className={`${darkMode ? 'border-slate-800' : 'border-gray-200'} border-b last:border-b-0`}>
                        <td className={`px-3 py-2 font-semibold whitespace-nowrap ${darkMode ? 'bg-slate-950/50 text-white' : 'bg-gray-50 text-gray-900'}`}>
                          {param}
                        </td>
                        <td className={`px-3 py-2 ${darkMode ? 'bg-slate-900/40 text-slate-300' : 'bg-white text-gray-700'}`}>
                          {soll}
                        </td>
                        <td className={`px-3 py-2 ${darkMode ? 'bg-slate-900/40 text-slate-300' : 'bg-white text-gray-700'}`}>
                          {einheit}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </InfoCard>
          )}

          {/* Quick reference for praxis: Dosierung */}
          {activeTab === 'praxis' && (
            <InfoCard darkMode={darkMode} title="Schnell-Check: Dosierung">
              <div className="space-y-3">
                <div className={`rounded-xl border p-3 ${darkMode ? 'border-blue-500/30 bg-blue-500/10' : 'border-blue-200 bg-blue-50'}`}>
                  <div className={`text-sm font-semibold ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                    KS4,3 erhöhen (NaHCO₃)
                  </div>
                  <p className={`text-sm mt-1 leading-6 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    Ca. 16 g NaHCO₃ pro m³ für 0,1 mmol/L Erhoehung
                  </p>
                  <p className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                    Beispiel: 500 m³ × 0,3 mmol/L × 160 g = 24 kg
                  </p>
                </div>
                <div className={`rounded-xl border p-3 ${darkMode ? 'border-amber-500/30 bg-amber-500/10' : 'border-amber-200 bg-amber-50'}`}>
                  <div className={`text-sm font-semibold ${darkMode ? 'text-amber-300' : 'text-amber-700'}`}>
                    Enthaertung nötig?
                  </div>
                  <p className={`text-sm mt-1 leading-6 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    Bei Gesamthärte über 14 °dH → Ionentauscher einsetzen
                  </p>
                  <p className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                    Ionentauscher tauscht Ca²⁺/Mg²⁺ gegen Na⁺ aus. Regelmäßig regenerieren!
                  </p>
                </div>
                <div className={`rounded-xl border p-3 ${darkMode ? 'border-emerald-500/30 bg-emerald-500/10' : 'border-emerald-200 bg-emerald-50'}`}>
                  <div className={`text-sm font-semibold ${darkMode ? 'text-emerald-300' : 'text-emerald-700'}`}>
                    Reihenfolge
                  </div>
                  <p className={`text-sm mt-1 leading-6 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    1. Puffer aufbauen (NaHCO₃) → 2. pH korrigieren → 3. Chlor anpassen → 4. Nachmessen
                  </p>
                </div>
              </div>
            </InfoCard>
          )}

          {/* Quick reference for ks-wert: Bewertung */}
          {activeTab === 'ks-wert' && (
            <InfoCard darkMode={darkMode} title="KS4,3-Wert Bewertung">
              <div className="space-y-3">
                <div className={`rounded-xl border p-3 ${darkMode ? 'border-red-500/30 bg-red-500/10' : 'border-red-200 bg-red-50'}`}>
                  <div className={`text-sm font-semibold ${darkMode ? 'text-red-300' : 'text-red-700'}`}>
                    Unter 0,7 mmol/L
                  </div>
                  <p className={`text-sm mt-1 leading-6 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    Zu wenig Puffer! pH-Wert instabil. Sofort NaHCO₃ dosieren.
                  </p>
                </div>
                <div className={`rounded-xl border p-3 ${darkMode ? 'border-emerald-500/30 bg-emerald-500/10' : 'border-emerald-200 bg-emerald-50'}`}>
                  <div className={`text-sm font-semibold ${darkMode ? 'text-emerald-300' : 'text-emerald-700'}`}>
                    0,7–1,5 mmol/L
                  </div>
                  <p className={`text-sm mt-1 leading-6 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    Guter Bereich. pH-Wert bleibt stabil. Regelmäßig kontrollieren.
                  </p>
                </div>
                <div className={`rounded-xl border p-3 ${darkMode ? 'border-amber-500/30 bg-amber-500/10' : 'border-amber-200 bg-amber-50'}`}>
                  <div className={`text-sm font-semibold ${darkMode ? 'text-amber-300' : 'text-amber-700'}`}>
                    Über 2,5 mmol/L
                  </div>
                  <p className={`text-sm mt-1 leading-6 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    Sehr hoher Puffer. Achtung: Kalkausfall möglich bei hohem pH!
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
