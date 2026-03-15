import { useState } from 'react';
import { useApp } from '../../../context/AppContext';

/* ─── Tab data ──────────────────────────────────────────────────────────────── */

const TABS = {
  grundlagen: {
    id: 'grundlagen',
    chip: 'Grundlagen',
    title: 'Warum desinfizieren wir Beckenwasser?',
    intro:
      'Jeden Tag bringen hunderte Badegaeste Schmutz ins Wasser: Schweiss, Hautschuppen, Sonnencreme, Urin und vieles mehr. In diesem warmen, feuchten Wasser fuehlen sich Keime pudelwohl. Desinfektion bedeutet: Wir toeten diese Keime ab oder machen sie unschaedlich. Die DIN 19643 schreibt vor, dass Beckenwasser hygienisch einwandfrei sein muss. Dafuer brauchen wir Desinfektionsmittel — und das wichtigste ist Chlor.',
    motto: 'Desinfektion = Keime abtoeten, damit niemand krank wird.',
    rules: [
      'Badegaeste bringen Verschmutzungen ins Wasser: Schweiss, Hautschuppen, Sonnencreme, Urin, Bakterien und Viren.',
      'DIN 19643 ist DIE Norm fuer Schwimmbadwasser — sie sagt, wie das Wasser aufbereitet werden muss.',
      'Desinfektion heisst: Keime abtoeten oder unschaedlich machen. Das Wasser muss NICHT steril sein (= komplett keimfrei), aber hygienisch einwandfrei.',
      'Freies Chlor = das Chlor, das noch Keime toeten kann. Gebundenes Chlor = Chlor, das schon mit Schmutz reagiert hat (Chloramine). Gesamtchlor = freies + gebundenes Chlor.',
      'Der Unterschied: Sterilisation toetet ALLE Keime (braucht man im OP). Desinfektion reicht fuers Schwimmbad — es muessen nur die krankmachenden Keime weg.'
    ],
    steps: [
      {
        title: '1. Verschmutzung verstehen',
        text: 'Jeder Badegast bringt ca. 0,5 bis 1 Liter Schweiss pro Stunde ins Wasser. Dazu kommen Hautschuppen, Haare, Sonnencreme und leider auch Urin. All das ist Nahrung fuer Keime.'
      },
      {
        title: '2. Keime kennen',
        text: 'Bakterien (z.B. E. coli, Pseudomonas), Viren (z.B. Norovirus) und Pilze koennen im Wasser sein. Manche machen Durchfall, andere Hautausschlag oder Ohrenentzuendungen.'
      },
      {
        title: '3. Chlorarten unterscheiden',
        text: 'Freies Chlor (HOCl + OCl⁻) ist der Held — es toetet Keime. Gebundenes Chlor (Chloramine) stinkt und reizt die Augen. Gesamtchlor = freies + gebundenes Chlor.'
      },
      {
        title: '4. Messwerte kennen',
        text: 'Freies Chlor: 0,3–0,6 mg/L (Hallenbad), bis 1,2 mg/L (Freibad). Gebundenes Chlor: unter 0,2 mg/L. Diese Werte taeglich messen und dokumentieren!'
      }
    ],
    examples: [
      {
        title: 'Was Badegaeste ins Wasser bringen',
        given: 'Ein Hallenbad hat 500 Besucher am Tag. Jeder bringt im Schnitt verschiedene Verschmutzungen mit.',
        question: 'Welche Stoffe muessen durch Desinfektion unschaedlich gemacht werden?',
        steps: [
          ['Schweiss', 'Ca. 0,5–1 Liter pro Person pro Stunde — enthaelt Harnstoff und Ammoniak'],
          ['Hautschuppen', 'Ca. 50.000 Stueck pro Person — Nahrung fuer Bakterien'],
          ['Sonnencreme', 'Reagiert mit Chlor und verbraucht es — weniger Chlor fuer Keime uebrig'],
          ['Urin', 'Leider Realitaet — Harnstoff reagiert mit Chlor zu stinkenden Chloraminen'],
          ['Keime', 'Bakterien, Viren, Pilze — muessen abgetoetet werden']
        ]
      },
      {
        title: 'Freies vs. gebundenes Chlor',
        given: 'Du misst im Becken: Gesamtchlor = 0,8 mg/L, freies Chlor = 0,5 mg/L.',
        question: 'Wie viel gebundenes Chlor ist im Wasser?',
        steps: [
          ['Gesamtchlor', '0,8 mg/L (gemessen mit DPD3)'],
          ['Freies Chlor', '0,5 mg/L (gemessen mit DPD1)'],
          ['Rechnung', '0,8 − 0,5 = 0,3 mg/L gebundenes Chlor'],
          ['Bewertung', '0,3 mg/L ist UEBER dem Grenzwert von 0,2 mg/L — Massnahme noetig!']
        ]
      },
      {
        title: 'Desinfektion vs. Sterilisation',
        given: 'Im OP muss alles steril sein. Im Schwimmbad reicht Desinfektion.',
        question: 'Was ist der Unterschied?',
        steps: [
          ['Sterilisation', 'Toetet ALLE Keime ab — auch harmlose. Braucht extreme Hitze oder Chemie.'],
          ['Desinfektion', 'Reduziert Keime auf ein ungefaehrliches Mass. Reicht fuers Schwimmbad.'],
          ['Im Bad', 'Chlor desinfiziert — es muessen nicht alle Keime weg, nur die gefaehrlichen.'],
          ['Merke', 'Schwimmbadwasser ist desinfiziert, aber nicht steril. Das ist voellig OK!']
        ]
      }
    ],
    pitfalls: [
      'Gesamtchlor und freies Chlor verwechseln! Gesamtchlor = freies + gebundenes. Nur das FREIE Chlor desinfiziert.',
      'Gebundenes Chlor ueber 0,2 mg/L riecht unangenehm und reizt Augen und Haut — das ist der typische \"Schwimmbadgeruch\".',
      'Viele denken: \"Es riecht nach Chlor = zu viel Chlor\". FALSCH! Es riecht nach GEBUNDENEM Chlor = zu wenig freies Chlor!',
      'Ohne regelmaessige Messung weisst du nicht, ob genug freies Chlor im Wasser ist. Taeglich messen ist Pflicht!'
    ],
    quiz: {
      question: 'Was ist der Unterschied zwischen freiem und gebundenem Chlor?',
      options: [
        'Freies Chlor stinkt, gebundenes Chlor ist geruchlos',
        'Freies Chlor kann noch Keime toeten, gebundenes Chlor hat schon mit Schmutz reagiert',
        'Freies Chlor ist fluessig, gebundenes Chlor ist fest'
      ],
      correctIndex: 1,
      explanation: 'Freies Chlor (HOCl) ist das wirksame Desinfektionsmittel. Gebundenes Chlor (Chloramine) hat bereits mit Verschmutzungen reagiert und kann keine Keime mehr toeten — es stinkt nur noch.'
    }
  },

  chlor: {
    id: 'chlor',
    chip: 'Chlorung',
    title: 'Chlor — der Standard im Schwimmbad',
    intro:
      'Chlor ist seit ueber 100 Jahren DAS Desinfektionsmittel im Schwimmbad. Wenn Chlor ins Wasser kommt, bildet sich Hypochlorsaeure (HOCl) — und die toetet Keime. Aber Chlor wirkt nur richtig, wenn der pH-Wert stimmt! Bei pH 7,0 sind 75 % des Chlors als wirksame HOCl vorhanden. Bei pH 8,0 nur noch 25 %. Deshalb ist der pH-Wert so wichtig.',
    motto: 'Chlor wirkt nur bei richtigem pH-Wert!',
    rules: [
      'Hypochlorsaeure (HOCl) ist das eigentliche Desinfektionsmittel — sie entsteht, wenn Chlor sich in Wasser loest.',
      'Drei Chlorarten im Bad: Natriumhypochlorit (NaClO, fluessig), Calciumhypochlorit (Ca(ClO)₂, Granulat), Chlorgas (Cl₂, nur grosse Baeder).',
      'Sollwerte nach DIN 19643: Freies Chlor 0,3–0,6 mg/L (Hallenbad), bis 1,2 mg/L (Freibad). Gebundenes Chlor IMMER unter 0,2 mg/L.',
      'pH-Abhaengigkeit: Bei pH 7,0 → 75 % HOCl (wirksam). Bei pH 7,5 → 50 %. Bei pH 8,0 → nur 25 %! Deshalb IMMER erst pH korrigieren.',
      'Stosschlorung (Breakpoint-Chlorung): Man gibt extra viel Chlor rein, um gebundenes Chlor (Chloramine) abzubauen. Noetig wenn gebundenes Chlor ueber 0,2 mg/L liegt.'
    ],
    steps: [
      {
        title: '1. Chlor-Art waehlen',
        text: 'Die meisten Baeder verwenden Natriumhypochlorit (NaClO) — das ist fluessig und einfach zu dosieren. Es wird von der Dosieranlage automatisch zugegeben.'
      },
      {
        title: '2. pH-Wert pruefen',
        text: 'BEVOR du Chlor dosierst: Ist der pH-Wert zwischen 6,5 und 7,6? Falls nicht, ERST den pH korrigieren! Chlor bei falschem pH ist Verschwendung.'
      },
      {
        title: '3. Chlorwert messen',
        text: 'Freies Chlor mit DPD1-Tablette messen. Gesamtchlor mit DPD3-Tablette. Gebundenes Chlor = Gesamtchlor minus freies Chlor. Alles dokumentieren!'
      },
      {
        title: '4. Stosschlorung bei Bedarf',
        text: 'Gebundenes Chlor ueber 0,2 mg/L? Dann Stosschlorung: Freies Chlor auf ca. 2 mg/L erhoehen. Die Chloramine werden dabei zerstoert. Danach abwarten, bis freies Chlor wieder im Sollbereich ist.'
      }
    ],
    examples: [
      {
        title: 'Die drei Chlorarten im Vergleich',
        given: 'Im Schwimmbad werden verschiedene Chlorprodukte eingesetzt. Jedes hat Vor- und Nachteile.',
        question: 'Welches Produkt passt zu welchem Bad?',
        steps: [
          ['Natriumhypochlorit (NaClO)', 'Fluessig, 12–15 % Aktivchlor — Standard in den meisten Baedern, einfach zu dosieren'],
          ['Calciumhypochlorit Ca(ClO)₂', 'Granulat/Tabletten, 65–70 % Aktivchlor — fuer kleinere Becken, laenger haltbar'],
          ['Chlorgas (Cl₂)', '100 % Aktivchlor — nur in grossen Baedern, sehr gefaehrlich, braucht spezielle Anlage'],
          ['Wichtig', 'Alle drei bilden im Wasser HOCl — das ist immer der gleiche Wirkstoff!']
        ]
      },
      {
        title: 'Warum der pH-Wert so wichtig ist',
        given: 'Du hast 0,5 mg/L freies Chlor im Becken. Aber wie viel davon WIRKT tatsaechlich?',
        question: 'Wie veraendert der pH-Wert die Wirksamkeit?',
        steps: [
          ['Bei pH 7,0', '75 % als HOCl = 0,38 mg/L wirksames Chlor — OPTIMAL'],
          ['Bei pH 7,5', '50 % als HOCl = 0,25 mg/L wirksames Chlor — noch OK'],
          ['Bei pH 8,0', '25 % als HOCl = 0,13 mg/L wirksames Chlor — zu wenig!'],
          ['Ergebnis', 'Gleiche Chlormenge, aber bei pH 8,0 nur ein Drittel der Wirkung!']
        ]
      },
      {
        title: 'Wann brauche ich eine Stosschlorung?',
        given: 'Montag frueh nach dem Wochenende: Freies Chlor = 0,4 mg/L, Gesamtchlor = 0,9 mg/L.',
        question: 'Ist eine Stosschlorung noetig?',
        steps: [
          ['Gebundenes Chlor', '0,9 − 0,4 = 0,5 mg/L — deutlich ueber 0,2 mg/L!'],
          ['Bedeutung', 'Viel Chlor hat mit Schmutz reagiert → Chloramine → es stinkt'],
          ['Massnahme', 'Stosschlorung: Freies Chlor auf ca. 2 mg/L erhoehen (Breakpoint)'],
          ['Ergebnis', 'Chloramine werden zerstoert, gebundenes Chlor sinkt unter 0,2 mg/L']
        ]
      }
    ],
    pitfalls: [
      'Chlor NIEMALS bei falschem pH-Wert dosieren — erst pH korrigieren, sonst verpufft das Chlor wirkungslos!',
      'Natriumhypochlorit (NaClO) verliert bei Hitze und Licht an Wirkung — kuehl und dunkel lagern!',
      'Stosschlorung heisst NICHT einfach \"mehr Chlor rein\". Man muss den Breakpoint ueberschreiten, sonst wird es schlimmer statt besser.',
      'Chlorgas ist extrem giftig — nur geschultes Personal darf damit arbeiten. Bei Leckage sofort raeumen!'
    ],
    quiz: {
      question: 'Wie viel Prozent des Chlors wirkt als HOCl bei pH 8,0?',
      options: [
        'Ca. 75 % — fast alles wirkt',
        'Ca. 50 % — die Haelfte wirkt',
        'Ca. 25 % — nur ein Viertel wirkt'
      ],
      correctIndex: 2,
      explanation: 'Bei pH 8,0 liegen nur noch ca. 25 % des Chlors als wirksame Hypochlorsaeure (HOCl) vor. Deshalb muss der pH-Wert ZUERST korrigiert werden!'
    }
  },

  alternative: {
    id: 'alternative',
    chip: 'Alternativen',
    title: 'UV, Ozon und weitere Verfahren',
    intro:
      'Chlor allein reicht manchmal nicht. UV-Licht und Ozon sind zusaetzliche Verfahren, die die Wasserqualitaet verbessern. UV-Strahlung zerstoert die DNA von Keimen und baut sogar gebundenes Chlor ab. Ozon ist ein starkes Oxidationsmittel, das viele Schadstoffe zersetzt. Aber beide haben einen Nachteil: Sie wirken nur im Moment — danach ist die Wirkung weg. Deshalb braucht man IMMER noch Chlor als \"Backup\" im Becken.',
    motto: 'UV und Ozon unterstuetzen — aber Chlor bleibt Pflicht.',
    rules: [
      'UV-Desinfektion nutzt UV-C Licht mit 254 nm Wellenlaenge. Das zerstoert die DNA der Keime — sie koennen sich nicht mehr vermehren.',
      'Grosser Vorteil von UV: Es baut gebundenes Chlor (Chloramine) ab! Weniger Gestank, weniger Augenreizung.',
      'Nachteil UV: Keine Depotwirkung. Im Becken selbst wirkt kein UV — deshalb braucht man TROTZDEM freies Chlor.',
      'Ozon (O₃) ist ein sehr starkes Oxidationsmittel. Es baut Trihalomethane (THM) und andere Schadstoffe ab.',
      'Nachteil Ozon: Es ist giftig! Ozon muss KOMPLETT entfernt werden, BEVOR das Wasser ins Becken zurueckfliesst. Ausserdem ist es teuer.'
    ],
    steps: [
      {
        title: '1. UV-Anlage verstehen',
        text: 'Das Wasser fliesst an UV-Lampen vorbei. Die UV-C Strahlung (254 nm) durchdringt die Zellwand der Keime und zerstoert ihre DNA. Die Keime koennen sich nicht mehr teilen = tot.'
      },
      {
        title: '2. Ozon-Anlage verstehen',
        text: 'Ozon wird vor Ort aus Sauerstoff erzeugt (O₂ → O₃). Es wird ins Wasser eingeleitet, reagiert mit Schadstoffen und zerfaellt dann wieder zu Sauerstoff. Aktivkohle entfernt Restozon.'
      },
      {
        title: '3. Elektrolyse kennen',
        text: 'Bei der Salzelektrolyse wird Chlor direkt vor Ort aus Kochsalz (NaCl) erzeugt. Vorteil: Kein Transport von Chlorchemikalien. Wird im eigenen Modul ausfuehrlich behandelt.'
      },
      {
        title: '4. Kombination ist King',
        text: 'Das beste Ergebnis: Chlor + UV als Kombination. Chlor desinfiziert im Becken (Depotwirkung), UV baut gebundenes Chlor ab und toetet resistente Keime. Win-win!'
      }
    ],
    examples: [
      {
        title: 'UV-Desinfektion im Detail',
        given: 'Ein Hallenbad ruested auf UV-Desinfektion um. Das Wasser fliesst nach der Filterung durch eine UV-Kammer.',
        question: 'Was bewirkt die UV-Anlage?',
        steps: [
          ['UV-C bei 254 nm', 'Diese Wellenlaenge zerstoert die DNA von Bakterien und Viren am effektivsten'],
          ['Chloramine abbauen', 'UV zersetzt gebundenes Chlor — weniger Hallenbadgeruch!'],
          ['Legionellen', 'UV toetet auch Legionellen, die im Wasser sein koennen'],
          ['ABER', 'Sobald das Wasser die UV-Kammer verlaesst, wirkt kein UV mehr — Chlor muss weiter desinfizieren']
        ]
      },
      {
        title: 'Ozon als Oxidationsmittel',
        given: 'In grossen Baedern wird oft Ozon eingesetzt, um die Wasserqualitaet zu verbessern.',
        question: 'Wie funktioniert Ozonierung und was sind die Risiken?',
        steps: [
          ['Erzeugung', 'Ozon (O₃) wird aus Sauerstoff erzeugt — braucht viel Energie'],
          ['Wirkung', 'Ozon oxidiert organische Stoffe, baut THM ab, toetet Keime'],
          ['Gefahr', 'Ozon ist giftig! Grenzwert in der Luft: 0,1 mg/m³. Muss vor dem Becken entfernt werden!'],
          ['Entfernung', 'Aktivkohlefilter entfernt Restozon. Erst dann darf das Wasser ins Becken']
        ]
      },
      {
        title: 'Kombination Chlor + UV: Praxisbeispiel',
        given: 'Ein Bad hatte Probleme: Gebundenes Chlor immer ueber 0,3 mg/L, Gaeste beschweren sich ueber Geruch.',
        question: 'Was bringt die Nachruestung mit UV?',
        steps: [
          ['Vorher', 'Gebundenes Chlor: 0,35 mg/L, starker Chlorgeruch, Augenbrennen bei Gaesten'],
          ['Nachruestung', 'UV-Anlage im Wasserkreislauf eingebaut'],
          ['Nachher', 'Gebundenes Chlor: 0,08 mg/L — deutlich unter dem Grenzwert!'],
          ['Ergebnis', 'Kein Geruch mehr, keine Augenbeschwerden, zufriedene Gaeste']
        ]
      }
    ],
    pitfalls: [
      'UV wirkt NUR, solange das Wasser an der Lampe vorbeifliesst. Im Becken selbst gibt es keinen UV-Schutz — Chlor bleibt Pflicht!',
      'Ozon ist extrem giftig — wenn die Aktivkohle versagt, darf das Wasser NICHT ins Becken! Ozon-Messgeraete sind Pflicht.',
      'UV-Lampen verlieren mit der Zeit an Leistung. Sie muessen regelmaessig getauscht werden (je nach Hersteller alle 8.000–12.000 Stunden).',
      'Manche denken: \"Mit UV brauche ich kein Chlor mehr.\" FALSCH! UV hat keine Depotwirkung — ohne Chlor keine Desinfektion im Becken.'
    ],
    quiz: {
      question: 'Warum braucht man trotz UV-Desinfektion immer noch Chlor im Becken?',
      options: [
        'Weil UV-Licht zu teuer ist, um allein zu desinfizieren',
        'Weil UV keine Depotwirkung hat — es wirkt nur in der UV-Kammer, nicht im Becken',
        'Weil UV nur gegen Viren wirkt, nicht gegen Bakterien'
      ],
      correctIndex: 1,
      explanation: 'UV-Licht wirkt nur im Moment des Kontakts. Im Becken selbst gibt es kein UV — dort muss freies Chlor die Desinfektion uebernehmen (Depotwirkung).'
    }
  },

  praxis: {
    id: 'praxis',
    chip: 'Praxis',
    title: 'Desinfektion im Baederalltag',
    intro:
      'Jetzt wird es praktisch: Jeden Morgen misst du die Chlorwerte, dokumentierst sie im Betriebstagebuch und regulierst nach. Hier lernst du den typischen Tagesablauf, was bei Problemen zu tun ist und warum der \"Chlorgeruch\" eigentlich bedeutet, dass zu WENIG freies Chlor vorhanden ist. Ausserdem: Trihalomethane (THM) — was sie sind und warum sie unter 20 Mikrogramm pro Liter bleiben muessen.',
    motto: 'Messen — Dokumentieren — Nachregulieren.',
    rules: [
      'Taeglich messen: DPD1-Tablette = freies Chlor, DPD3-Tablette = Gesamtchlor. Gebundenes Chlor = Gesamtchlor minus freies Chlor.',
      'Zu wenig freies Chlor? Dosierung erhoehen UND pH-Wert pruefen — bei falschem pH wirkt Chlor nicht!',
      'Zu viel gebundenes Chlor (ueber 0,2 mg/L)? Stosschlorung durchfuehren ODER UV-Anlage kontrollieren.',
      'Chlorgeruch ≠ zu viel Chlor! Der typische \"Hallenbadgeruch\" kommt von Chloraminen (= gebundenes Chlor). Das bedeutet: Es ist zu WENIG freies Chlor da!',
      'Trihalomethane (THM) muessen unter 20 Mikrogramm/L bleiben. Sie entstehen, wenn Chlor mit organischen Stoffen reagiert. THM sind krebsverdaechtig!'
    ],
    steps: [
      {
        title: '1. Morgens: Werte messen',
        text: 'Vor Badeoeffnung: Wasserprobe nehmen (nicht am Einlauf!). Freies Chlor (DPD1), Gesamtchlor (DPD3) und pH-Wert messen. Werte ins Betriebstagebuch eintragen.'
      },
      {
        title: '2. Werte bewerten',
        text: 'Freies Chlor 0,3–0,6 mg/L? Gebundenes Chlor unter 0,2 mg/L? pH zwischen 6,5 und 7,6? Alles OK → normaler Betrieb. Abweichung → Massnahme ergreifen.'
      },
      {
        title: '3. Bei Problemen handeln',
        text: 'Freies Chlor zu niedrig: Dosierung erhoehen, pH pruefen. Gebundenes Chlor zu hoch: Stosschlorung oder UV checken. IMMER erst pH, dann Chlor!'
      },
      {
        title: '4. Dokumentation',
        text: 'Betriebstagebuch fuehren: Datum, Uhrzeit, alle Messwerte, durchgefuehrte Massnahmen. Das ist gesetzliche Pflicht und wird bei Kontrollen geprueft!'
      }
    ],
    examples: [
      {
        title: 'Praxis-Szenario: Gaeste beschweren sich ueber Geruch',
        given: 'Mittwochnachmittag, viel Betrieb. Gaeste klagen ueber \"zu viel Chlor\" — Augen brennen, es stinkt.',
        question: 'Was ist wirklich los und was tust du?',
        steps: [
          ['Messung', 'Freies Chlor: 0,2 mg/L (zu wenig!), Gesamtchlor: 0,7 mg/L'],
          ['Gebundenes Chlor', '0,7 − 0,2 = 0,5 mg/L — viel zu hoch!'],
          ['Diagnose', 'Nicht zu viel Chlor, sondern zu WENIG freies Chlor. Der Geruch sind Chloramine!'],
          ['Massnahme', 'Stosschlorung einleiten, pH pruefen, ggf. UV-Anlage kontrollieren']
        ]
      },
      {
        title: 'Praxis-Szenario: Trihalomethane (THM) zu hoch',
        given: 'Die Laboranalyse zeigt: THM-Wert = 28 Mikrogramm/L. Der Grenzwert ist 20 Mikrogramm/L.',
        question: 'Was sind THM und was kannst du tun?',
        steps: [
          ['Was sind THM?', 'Trihalomethane entstehen, wenn Chlor mit organischen Stoffen (Schweiss, Urin) reagiert'],
          ['Warum schlimm?', 'THM sind krebsverdaechtig. Der Grenzwert von 20 Mikrogramm/L darf nicht ueberschritten werden'],
          ['Massnahmen', 'Mehr Frischwasser zufuehren, Aktivkohle einsetzen, UV oder Ozon nachreusten'],
          ['Vorbeugung', 'Gaeste zum Duschen vor dem Schwimmen auffordern — das reduziert organische Belastung!']
        ]
      },
      {
        title: 'Was ins Betriebstagebuch muss',
        given: 'Du fuehrst das Betriebstagebuch fuer das Hallenbad. Was wird dokumentiert?',
        question: 'Welche Eintraege sind Pflicht?',
        steps: [
          ['Messwerte', 'Freies Chlor, Gesamtchlor, pH-Wert, Temperatur — mindestens 2x taeglich'],
          ['Verbrauch', 'Chlor-Verbrauch, Saeure-/Laugeverbrauch, Frischwasserzufuhr'],
          ['Massnahmen', 'Stosschlorung, Filterrueckspuelung, Reparaturen, Stoerungen'],
          ['Besonderheiten', 'Hohe Besucherzahl, Wasserverunreinigung, Beschwerden, Beckensperrung']
        ]
      }
    ],
    pitfalls: [
      '\"Es riecht nach Chlor, also ist genug drin\" — FALSCH! Der Geruch kommt von Chloraminen = zu wenig freies Chlor. Sofort messen!',
      'Wasserprobe NIEMALS am Einlauf nehmen — dort ist das Wasser frisch dosiert und nicht repraesentativ fuer das ganze Becken.',
      'Betriebstagebuch vergessen = Ordnungswidrigkeit! Bei Kontrollen durch das Gesundheitsamt wird es IMMER geprueft.',
      'THM-Werte ignorieren ist gefaehrlich. Wenn der Grenzwert dauerhaft ueberschritten wird, kann das Gesundheitsamt das Bad schliessen!'
    ],
    quiz: {
      question: 'Gaeste beschweren sich ueber starken \"Chlorgeruch\". Was bedeutet das meistens?',
      options: [
        'Es ist zu viel freies Chlor im Wasser — Dosierung runterdrehen',
        'Es ist zu wenig freies Chlor — der Geruch kommt von gebundenem Chlor (Chloraminen)',
        'Der Geruch ist normal und gehoert zum Schwimmbad dazu'
      ],
      correctIndex: 1,
      explanation: 'Der typische \"Chlorgeruch\" kommt nicht von freiem Chlor, sondern von Chloraminen (gebundenes Chlor). Das bedeutet: Es ist zu WENIG wirksames Chlor vorhanden! Massnahme: Stosschlorung und pH pruefen.'
    }
  }
};

const TAB_ORDER = ['grundlagen', 'chlor', 'alternative', 'praxis'];

/* ─── Reference tables for sidebar ─────────────────────────────────────────── */

const SOLLWERTE_TABLE = [
  ['Parameter', 'Sollwert', 'Quelle'],
  ['Freies Chlor (Hallenbad)', '0,3–0,6 mg/L', 'DIN 19643'],
  ['Freies Chlor (Freibad)', '0,3–1,2 mg/L', 'DIN 19643'],
  ['Gebundenes Chlor', '<0,2 mg/L', 'DIN 19643'],
  ['pH-Wert', '6,5–7,6', 'DIN 19643'],
  ['Trihalomethane (THM)', '<20 µg/L', 'TrinkwV/DIN'],
  ['Redox-Spannung', '>750 mV', 'DIN 19643']
];

const CHLOR_VERGLEICH_TABLE = [
  ['Eigenschaft', 'NaClO (fluessig)', 'Ca(ClO)₂ (Granulat)', 'Cl₂ (Gas)'],
  ['Aktivchlor', '12–15 %', '65–70 %', '100 %'],
  ['Handhabung', 'Einfach', 'Mittel', 'Schwierig'],
  ['Lagerung', 'Kuehl, dunkel', 'Trocken', 'Druckflaschen'],
  ['Kosten', 'Mittel', 'Hoeher', 'Niedrig'],
  ['Gefahr', 'Aetzend', 'Brandfoerdernd', 'Sehr giftig']
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

export default function BeckenwasserdesinfektionDeepDiveView() {
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
          <InfoCard darkMode={darkMode} title="Schritt fuer Schritt">
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

          {/* Sollwerte table (on grundlagen and praxis tabs) */}
          {(activeTab === 'grundlagen' || activeTab === 'praxis') && (
            <InfoCard darkMode={darkMode} title="Sollwerte-Tabelle (DIN 19643)">
              <div className="overflow-hidden rounded-xl border border-transparent">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className={darkMode ? 'border-slate-800' : 'border-gray-200'}>
                      <th className={`px-3 py-2 text-left font-semibold ${darkMode ? 'bg-slate-950/50 text-slate-400' : 'bg-gray-50 text-gray-500'}`}>
                        Parameter
                      </th>
                      <th className={`px-3 py-2 text-left font-semibold ${darkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-50 text-blue-700'}`}>
                        Sollwert
                      </th>
                      <th className={`px-3 py-2 text-left font-semibold ${darkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-50 text-blue-700'}`}>
                        Quelle
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {SOLLWERTE_TABLE.slice(1).map(([param, value, source]) => (
                      <tr key={param} className={`${darkMode ? 'border-slate-800' : 'border-gray-200'} border-b last:border-b-0`}>
                        <td className={`px-3 py-2 font-semibold whitespace-nowrap ${darkMode ? 'bg-slate-950/50 text-white' : 'bg-gray-50 text-gray-900'}`}>
                          {param}
                        </td>
                        <td className={`px-3 py-2 ${darkMode ? 'bg-slate-900/40 text-slate-300' : 'bg-white text-gray-700'}`}>
                          {value}
                        </td>
                        <td className={`px-3 py-2 ${darkMode ? 'bg-slate-900/40 text-slate-300' : 'bg-white text-gray-700'}`}>
                          {source}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </InfoCard>
          )}

          {/* Chlor-Vergleich table (on chlor and alternative tabs) */}
          {(activeTab === 'chlor' || activeTab === 'alternative') && (
            <InfoCard darkMode={darkMode} title="Chlor-Vergleich">
              <div className="overflow-hidden rounded-xl border border-transparent">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className={darkMode ? 'border-slate-800' : 'border-gray-200'}>
                      {CHLOR_VERGLEICH_TABLE[0].map((header) => (
                        <th key={header} className={`px-3 py-2 text-left font-semibold ${darkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-50 text-blue-700'}`}>
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {CHLOR_VERGLEICH_TABLE.slice(1).map((row) => (
                      <tr key={row[0]} className={`${darkMode ? 'border-slate-800' : 'border-gray-200'} border-b last:border-b-0`}>
                        <td className={`px-3 py-2 font-semibold whitespace-nowrap ${darkMode ? 'bg-slate-950/50 text-white' : 'bg-gray-50 text-gray-900'}`}>
                          {row[0]}
                        </td>
                        {row.slice(1).map((cell, i) => (
                          <td key={i} className={`px-3 py-2 ${darkMode ? 'bg-slate-900/40 text-slate-300' : 'bg-white text-gray-700'}`}>
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </InfoCard>
          )}

          {/* Quick reference for praxis tab */}
          {activeTab === 'praxis' && (
            <InfoCard darkMode={darkMode} title="Schnell-Check: Probleme loesen">
              <div className="space-y-3">
                <div className={`rounded-xl border p-3 ${darkMode ? 'border-red-500/30 bg-red-500/10' : 'border-red-200 bg-red-50'}`}>
                  <div className={`text-sm font-semibold ${darkMode ? 'text-red-300' : 'text-red-700'}`}>
                    Freies Chlor zu niedrig
                  </div>
                  <p className={`text-sm mt-1 leading-6 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    Dosierung erhoehen + pH-Wert pruefen
                  </p>
                  <p className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                    Bei falschem pH wirkt auch mehr Chlor nicht besser!
                  </p>
                </div>
                <div className={`rounded-xl border p-3 ${darkMode ? 'border-amber-500/30 bg-amber-500/10' : 'border-amber-200 bg-amber-50'}`}>
                  <div className={`text-sm font-semibold ${darkMode ? 'text-amber-300' : 'text-amber-700'}`}>
                    Gebundenes Chlor zu hoch (&gt;0,2 mg/L)
                  </div>
                  <p className={`text-sm mt-1 leading-6 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    Stosschlorung durchfuehren oder UV-Anlage pruefen
                  </p>
                  <p className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                    Breakpoint-Chlorung: freies Chlor auf ca. 2 mg/L erhoehen
                  </p>
                </div>
                <div className={`rounded-xl border p-3 ${darkMode ? 'border-emerald-500/30 bg-emerald-500/10' : 'border-emerald-200 bg-emerald-50'}`}>
                  <div className={`text-sm font-semibold ${darkMode ? 'text-emerald-300' : 'text-emerald-700'}`}>
                    Reihenfolge beachten
                  </div>
                  <p className={`text-sm mt-1 leading-6 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    1. pH korrigieren → 2. Chlor anpassen → 3. Nachmessen → 4. Dokumentieren
                  </p>
                </div>
              </div>
            </InfoCard>
          )}

          {/* HOCl effectiveness for chlor tab */}
          {activeTab === 'chlor' && (
            <InfoCard darkMode={darkMode} title="HOCl-Wirksamkeit nach pH">
              <div className="space-y-3">
                <div className={`rounded-xl border p-3 ${darkMode ? 'border-blue-500/30 bg-blue-500/10' : 'border-blue-200 bg-blue-50'}`}>
                  <div className={`text-sm font-semibold ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                    Wirksames Chlor (HOCl) je nach pH
                  </div>
                  <p className={`text-sm mt-1 leading-6 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    Je niedriger der pH, desto mehr HOCl ist aktiv.
                  </p>
                  <p className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                    pH 7,0 → 75 % HOCl | pH 7,5 → 50 % | pH 8,0 → 25 %
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
              Antwort pruefen
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
