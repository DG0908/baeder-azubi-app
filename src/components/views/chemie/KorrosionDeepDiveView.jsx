import { useState } from 'react';
import { useApp } from '../../../context/AppContext';

/* --- Tab data ---------------------------------------------------------------- */

const TABS = {
  grundlagen: {
    id: 'grundlagen',
    chip: 'Grundlagen',
    title: 'Was ist Korrosion?',
    intro:
      'Stell dir vor, du lässt ein Fahrrad im Regen stehen. Nach ein paar Wochen ist es rostig. Das ist Korrosion — das Metall wird durch eine chemische Reaktion mit Wasser und Sauerstoff langsam zerstoert. Im Schwimmbad passiert das viel schneller, weil Chlor, Wärme und ständige Feuchtigkeit alles beschleunigen. Korrosion ist einer der teuersten Schaeden im Badebetrieb!',
    motto: 'Korrosion = Metall wird chemisch zerstoert.',
    rules: [
      'Korrosion = Metall wird durch eine chemische Reaktion mit seiner Umgebung zerstoert (meistens durch Wasser, Sauerstoff oder Chlor).',
      'Rost ist die bekannteste Form: Eisen + Wasser + Sauerstoff ergibt Eisenoxid (Rost).',
      'Korrosion ist eine Redox-Reaktion — das Metall gibt Elektronen ab (Oxidation).',
      'Das Schwimmbad ist ein Korrosions-Hotspot: Chlor, Feuchtigkeit, Wärme und Salze greifen Metalle ständig an.',
      'Korrosionsschaeden sind extrem teuer — kaputte Rohre, Armaturen, Beckenteile und Lueftungsanlagen kosten tausende Euro.'
    ],
    steps: [
      {
        title: '1. Was passiert bei Korrosion?',
        text: 'Metall reagiert mit seiner Umgebung — meistens mit Wasser und Sauerstoff. Dabei gibt das Metall Elektronen ab (Oxidation). Es bildet sich eine neue Verbindung, zum Beispiel Rost (Eisenoxid). Das Metall wird dabei Stueck für Stueck aufgeloest.'
      },
      {
        title: '2. Warum rostet Eisen?',
        text: 'Eisen (Fe) gibt Elektronen ab und wird zu Eisen-Ionen (Fe2+). Der Sauerstoff aus der Luft nimmt die Elektronen auf. Zusammen mit Wasser entsteht Eisenoxid — das ist der braune Rost, den jeder kennt. Ohne Wasser kein Rost!'
      },
      {
        title: '3. Warum ist das im Bad so schlimm?',
        text: 'Im Schwimmbad kommen alle Korrosions-Beschleuniger zusammen: Chlor greift Metalle direkt an, die Luft ist ständig feucht, die Temperaturen sind hoch (28-34 Grad), und Chloramine in der Hallenluft sind besonders aggressiv.'
      },
      {
        title: '4. Was kostet Korrosion?',
        text: 'Korrosionsschaeden im Bad sind sehr teuer: Rohrleitungen müssen ausgetauscht werden, Edelstahlgelaender bekommen Loecher, Lueftungsanlagen rosten durch. Ein einziges geplatztes Rohr kann einen Wasserschaden in tausender-Höhe verursachen. Fruehzeitig erkennen spart viel Geld!'
      }
    ],
    examples: [
      {
        title: 'Alltagsbeispiel: Rostiges Fahrrad',
        given: 'Ein Stahlfahrrad steht wochenlang draussen im Regen.',
        question: 'Was passiert chemisch?',
        steps: [
          ['Oxidation', 'Eisen (Fe) gibt Elektronen ab: Fe -> Fe2+ + 2e-'],
          ['Reduktion', 'Sauerstoff (O2) nimmt die Elektronen auf'],
          ['Ergebnis', 'Es entsteht Eisenoxid (Fe2O3) = Rost'],
          ['Merke', 'Ohne Wasser und Sauerstoff kein Rost — deshalb rosten trockene Sachen nicht']
        ]
      },
      {
        title: 'Schwimmbad: Rostflecken am Beckenrand',
        given: 'Am Edelstahl-Beckenrand eines Hallenbades entstehen braune Flecken.',
        question: 'Was ist passiert?',
        steps: [
          ['Ursache', 'Chlorhaltiges Wasser greift die Oberfläche an'],
          ['Problem', 'Eventuell falscher Edelstahl (V2A statt V4A) oder beschaedigte Oberfläche'],
          ['Reaktion', 'Chlorid-Ionen zerstoeren die schuetzende Passivschicht des Edelstahls'],
          ['Maßnahme', 'Flecken reinigen, Ursache klaeren, bei Bedarf Material austauschen']
        ]
      },
      {
        title: 'Korrosionsfaktoren im Schwimmbad',
        given: 'Ein neues Hallenbad hat nach 2 Jahren bereits Korrosionsschaeden an der Lueftung.',
        question: 'Warum so schnell?',
        steps: [
          ['Faktor 1', 'Chloramine verdunsten aus dem Wasser und greifen die Lueftung an'],
          ['Faktor 2', 'Hohe Luftfeuchtigkeit (60-70%) — Metall ist ständig feucht'],
          ['Faktor 3', 'Wärme (28-34 Grad) beschleunigt chemische Reaktionen'],
          ['Lösung', 'Korrosionsbeständige Materialien verwenden (Kunststoff, Edelstahl V4A, Beschichtungen)']
        ]
      }
    ],
    pitfalls: [
      'Korrosion ist NICHT nur Rost — auch Edelstahl, Kupfer und Aluminium können korrodieren, nur anders.',
      'Trockene Metalle rosten NICHT — es braucht IMMER Feuchtigkeit für Korrosion.',
      'Chlor beschleunigt Korrosion massiv — deshalb sind Schwimmbäder besonders betroffen.',
      'Korrosion passiert oft UNSICHTBAR im Inneren von Rohren — wenn man es sieht, ist es oft schon zu spaet.'
    ],
    quiz: {
      question: 'Warum korrodieren Metalle im Schwimmbad besonders schnell?',
      options: ['Weil die Badegaeste die Metalle anfassen', 'Weil Chlor, Feuchtigkeit und Wärme zusammen die Korrosion stark beschleunigen', 'Weil im Schwimmbad nur billiges Metall verwendet wird'],
      correctIndex: 1,
      explanation: 'Im Schwimmbad kommen alle Korrosions-Beschleuniger zusammen: Chlor greift Metalle an, die Luft ist ständig feucht, und die hohen Temperaturen beschleunigen die chemischen Reaktionen. Das macht das Bad zum perfekten Ort für Korrosion.'
    }
  },

  arten: {
    id: 'arten',
    chip: 'Korrosionsarten',
    title: 'Welche Arten gibt es?',
    intro:
      'Korrosion ist nicht gleich Korrosion. Es gibt verschiedene Arten, und jede sieht anders aus und ist unterschiedlich gefährlich. Im Schwimmbad begegnest du vor allem dem Lochfrass bei Edelstahl, der Spaltkorrosion an Dichtungen und der Kontaktkorrosion wenn verschiedene Metalle sich beruehren. Hier lernst du die wichtigsten Arten kennen.',
    motto: 'Nicht jede Korrosion ist Rost — kenne die verschiedenen Arten!',
    rules: [
      'Flächenkorrosion = gleichmaessiger Abtrag der Oberfläche. Sieht man gut, ist aber berechenbar.',
      'Lochfrass (Pitting) = kleine, tiefe Loecher in der Oberfläche. Besonders tueckisch bei Edelstahl in Chlorwasser!',
      'Spaltkorrosion = Korrosion in engen Spalten (Dichtungen, Flansche). Im Spalt fehlt Sauerstoff, das beschleunigt den Angriff.',
      'Kontaktkorrosion = zwei verschiedene Metalle beruehren sich, das unedlere Metall wird zerstoert.',
      'Spannungsrisskorrosion = Risse durch Chloride im Edelstahl. Kann zu ploetzlichem Bruch fuehren — sehr gefährlich!'
    ],
    steps: [
      {
        title: '1. Flächenkorrosion',
        text: 'Die ganze Oberfläche wird gleichmaessig abgetragen. Beispiel: ungestrichener Stahl wird überall rostig. Diese Art ist am wenigsten gefährlich, weil man sie sofort sieht und die Lebensdauer berechnen kann.'
      },
      {
        title: '2. Lochfrass (Pitting)',
        text: 'Kleine, tiefe Loecher fressen sich ins Metall — von aussen sieht man fast nichts! Besonders tueckisch bei Edelstahl in chlorhaltigem Wasser. Die Chlorid-Ionen zerstoeren die Schutzschicht an einzelnen Stellen und fressen sich dann tief ins Material.'
      },
      {
        title: '3. Kontaktkorrosion',
        text: 'Wenn zwei verschiedene Metalle sich beruehren und Feuchtigkeit dazukommt, wird das unedlere Metall zerstoert. Beispiel: Eine Stahlschraube in einem Kupferrohr — der Stahl rostet viel schneller als normal, weil Kupfer "edler" ist.'
      },
      {
        title: '4. Spalt- und Spannungsrisskorrosion',
        text: 'Spaltkorrosion entsteht in engen Spalten (z.B. unter Dichtungen), wo zu wenig Sauerstoff hinkommt. Spannungsrisskorrosion ist noch gefährlicher: Chloride verursachen feine Risse im Edelstahl, die ohne Vorwarnung zum Bruch fuehren können.'
      }
    ],
    examples: [
      {
        title: 'Lochfrass am Edelstahlgelaender',
        given: 'An einem Edelstahl-Treppengelaender im Schwimmerbecken entstehen kleine braune Punkte.',
        question: 'Was ist das und warum passiert das?',
        steps: [
          ['Diagnose', 'Lochfrass (Pitting) — typisch für Edelstahl in Chlorwasser'],
          ['Ursache', 'Chlorid-Ionen zerstoeren die Passivschicht an einzelnen Punkten'],
          ['Wahrscheinlich', 'Falscher Edelstahl verbaut — V2A (1.4301) statt V4A (1.4571)'],
          ['Maßnahme', 'Gelaender durch V4A-Edelstahl (1.4571) ersetzen']
        ]
      },
      {
        title: 'Kontaktkorrosion: Stahl trifft Kupfer',
        given: 'Eine verzinkte Stahlschraube wurde in eine Kupfer-Rohrschelle eingebaut. Nach 6 Monaten ist die Schraube komplett zerfressen.',
        question: 'Was ist passiert?',
        steps: [
          ['Ursache', 'Kontaktkorrosion (galvanische Korrosion)'],
          ['Erklärung', 'Kupfer ist edler als Stahl — der Stahl "opfert" sich und wird zerstoert'],
          ['Feuchtigkeit', 'Wasser bildet den Elektrolyt — ohne Wasser wuerde es nicht passieren'],
          ['Lösung', 'Gleiche Metalle verwenden oder Kunststoff-Isolierung dazwischen setzen']
        ]
      },
      {
        title: 'Gruene Kupferrohre',
        given: 'Die Kupfer-Wasserleitungen im Technikraum zeigen gruene Verfaerbungen.',
        question: 'Ist das gefährlich?',
        steps: [
          ['Was ist das', 'Gruenspan (Kupfercarbonat/Kupferchlorid) — Flächenkorrosion von Kupfer'],
          ['Bewertung', 'Die gruene Schicht schuetzt das Kupfer darunter (Patina)'],
          ['Aber Achtung', 'Bei aggressivem Wasser (pH <7, hohe Chloride) kann Lochfrass entstehen'],
          ['Kontrolle', 'Wandstärke der Rohre regelmäßig prüfen']
        ]
      }
    ],
    pitfalls: [
      'Edelstahl ist NICHT rostfrei — auch Edelstahl korrodiert, besonders in Chlorwasser!',
      'Lochfrass sieht harmlos aus (kleine Punkte), kann aber tief ins Material reichen und zu Leckagen fuehren.',
      'Verschiedene Metalle dürfen NICHT direkt miteinander verbunden werden — sonst droht Kontaktkorrosion.',
      'Spannungsrisskorrosion gibt KEINE Vorwarnung — das Teil kann ohne sichtbare Schaeden ploetzlich brechen.'
    ],
    quiz: {
      question: 'Warum ist Lochfrass (Pitting) bei Edelstahl besonders gefährlich?',
      options: ['Weil er gut sichtbar ist und haesslich aussieht', 'Weil kleine, tiefe Loecher von aussen kaum sichtbar sind, aber das Material durchdringen können', 'Weil er nur bei billigem Stahl vorkommt'],
      correctIndex: 1,
      explanation: 'Lochfrass ist tueckisch, weil man von aussen kaum etwas sieht. Die kleinen Loecher fressen sich tief ins Material und können zu Leckagen fuehren, bevor man das Problem bemerkt. Besonders bei Edelstahl in Chlorwasser verbreitet.'
    }
  },

  schutz: {
    id: 'schutz',
    chip: 'Korrosionsschutz',
    title: 'Wie schuetzen wir Metalle?',
    intro:
      'Korrosion lässt sich nicht komplett verhindern — aber man kann sie stark verlangsamen und kontrollieren. Das Wichtigste: den RICHTIGEN Werkstoff wählen! Im Schwimmbad muss es V4A-Edelstahl (1.4571) sein, nicht der billigere V2A. Dazu kommen Beschichtungen, konstruktive Maßnahmen und die richtige Wasserchemie.',
    motto: 'Der richtige Werkstoff ist der beste Korrosionsschutz!',
    rules: [
      'Materialwahl ist das A und O: Im Chlorbereich immer V4A-Edelstahl (1.4571), NICHT V2A (1.4301)!',
      'Beschichtungen schuetzen: Lack, Pulverbeschichtung, Emaille oder Kunststoffueberzug bilden eine Barriere.',
      'Verzinkung schuetzt Stahl — aber NICHT in chlorhaltiger Atmosphaere (da loest sich das Zink auf).',
      'Kathodischer Schutz: Opferanoden aus Zink schuetzen edlere Metalle (das Zink "opfert" sich).',
      'Wasserchemie beachten: pH unter 7,0 ist aggressiv für Metalle — Wasserhärte und Chlorid-Gehalt kontrollieren.'
    ],
    steps: [
      {
        title: '1. Richtigen Werkstoff wählen',
        text: 'Im Schwimmbad gilt: Alles was mit Chlorwasser oder Chlorluft in Kontakt kommt, muss aus V4A-Edelstahl (1.4571) oder besser sein. V2A (1.4301) reicht NICHT — es bekommt Lochfrass durch Chloride. Für extreme Belastung: Titan oder Kunststoff.'
      },
      {
        title: '2. Beschichtungen aufbringen',
        text: 'Eine Schutzschicht trennt das Metall von der aggressiven Umgebung. Möglichkeiten: Speziallack, Pulverbeschichtung, Emaille, Kunststoffueberzug (z.B. PE, PP). Wichtig: Die Beschichtung muss lueckenlos sein — jede Beschaedigung ist eine Angriffsstelle!'
      },
      {
        title: '3. Konstruktiv richtig bauen',
        text: 'Keine Spalte konstruieren (verhindert Spaltkorrosion). Gute Entwaesserung vorsehen (stehendes Wasser vermeiden). KEINE verschiedenen Metalle direkt verbinden (verhindert Kontaktkorrosion). Alle Stellen müssen für Kontrolle zugaenglich sein.'
      },
      {
        title: '4. Wasserchemie kontrollieren',
        text: 'Der pH-Wert darf nicht unter 7,0 fallen — saures Wasser greift Metalle stark an. Die Wasserhärte sollte nicht zu niedrig sein (weiches Wasser ist aggressiver). Chlorid-Gehalt im Fuellwasser beachten. Bei der Desinfektion nicht ueberdosieren.'
      }
    ],
    examples: [
      {
        title: 'Richtige Materialwahl im Schwimmbecken',
        given: 'Ein neues Schwimmbecken wird geplant. Es sollen Edelstahl-Einbauteile (Duesen, Rinnen, Leitern) eingebaut werden.',
        question: 'Welcher Edelstahl muss verwendet werden?',
        steps: [
          ['Anforderung', 'Kontakt mit Chlorwasser (0,3–0,6 mg/L freies Chlor)'],
          ['V2A (1.4301)', 'NICHT geeignet — bekommt Lochfrass durch Chloride'],
          ['V4A (1.4571)', 'Standard für Schwimmbad-Einbauteile — mit Molybdaen gegen Chloride'],
          ['Merke', 'Im Zweifel IMMER V4A (1.4571) oder höher — V2A spart am falschen Ende']
        ]
      },
      {
        title: 'Opferanoden: Kathodischer Schutz',
        given: 'An einem Warmwasserspeicher (Stahl, emailliert) ist eine Zink- oder Magnesium-Anode angebracht.',
        question: 'Wie funktioniert der Schutz?',
        steps: [
          ['Prinzip', 'Zink ist unedler als Stahl — es gibt seine Elektronen freiwillig ab'],
          ['Wirkung', 'Solange die Opferanode vorhanden ist, wird der Stahl NICHT angegriffen'],
          ['Verschleiss', 'Die Anode loest sich langsam auf (sie "opfert" sich) und muss regelmäßig erneuert werden'],
          ['Wartung', 'Opferanoden alle 1-2 Jahre prüfen und bei Bedarf austauschen']
        ]
      },
      {
        title: 'pH-Wert zu niedrig',
        given: 'Im Hallenbad ist der pH-Wert auf 6,5 gefallen. Die Kupferleitungen zeigen gruenliche Verfaerbungen.',
        question: 'Was passiert und was muss getan werden?',
        steps: [
          ['Problem', 'pH 6,5 ist zu sauer — aggressiv für Kupfer und andere Metalle'],
          ['Wirkung', 'Kupfer loest sich und faerbt das Wasser/Rohre gruen'],
          ['Maßnahme', 'pH-Wert sofort auf 7,0-7,4 anheben (Natronlauge oder Soda)'],
          ['Merke', 'pH unter 7,0 greift nicht nur Metalle an, sondern auch Fugen und Beton']
        ]
      }
    ],
    pitfalls: [
      'V2A und V4A NICHT verwechseln! V2A (1.4301) ist für Chlorwasser NICHT geeignet — immer V4A (1.4571) verwenden.',
      'Verzinkter Stahl haelt in Chloratmosphaere NICHT — das Zink loest sich schnell auf.',
      'Beschichtungen müssen LUECKENLOS sein — eine kleine Beschaedigung reicht, damit Korrosion darunter beginnt.',
      'Verschiedene Metalle NIEMALS direkt verbinden — immer Kunststoff-Isolierung dazwischen setzen.'
    ],
    quiz: {
      question: 'Welcher Edelstahl ist für Schwimmbad-Einbauteile mit Chlorwasser-Kontakt geeignet?',
      options: ['V2A (1.4301) — der reicht für Edelstahl immer aus', 'V4A (1.4571) — mit Molybdaen für Chlorid-Beständigkeit', 'Normaler Baustahl mit Rostschutzfarbe'],
      correctIndex: 1,
      explanation: 'V4A-Edelstahl (1.4571) enthaelt Molybdaen, das die Beständigkeit gegen Chloride deutlich erhoeht. V2A (1.4301) bekommt in Chlorwasser Lochfrass und ist NICHT geeignet. Normaler Stahl wuerde in kuerzester Zeit durchrosten.'
    }
  },

  praxis: {
    id: 'praxis',
    chip: 'Praxis',
    title: 'Korrosionsschutz im Bäderalltag',
    intro:
      'Als Fachangestellte/r für Bäderbetriebe bist du täglich dafür verantwortlich, Korrosionsschaeden frühzeitig zu erkennen und zu verhindern. Die Hallenbadluft mit ihren Chloraminen ist extrem aggressiv — nicht nur für Beckeneinbauteile, sondern auch für Lueftung, Gebäudetechnik und sogar Beton. Hier lernst du die praktischen Maßnahmen für den Alltag.',
    motto: 'Frueh erkennen, richtig handeln — Korrosion ist ein Dauerthema im Bad.',
    rules: [
      'Hallenbadluft ist extrem korrosiv — Chloramine (gebundenes Chlor) verdunsten und greifen alles an, was aus Metall ist.',
      'Materialien im Schwimmbad: Edelstahl 1.4571 (V4A) für Wasserbereich, Titan für Wärmetauscher, Kunststoff/GFK für aggressive Zonen.',
      'Tägliche Kontrolle: Sichtprüfung auf Rostflecken, Verfaerbungen und Ablagerungen ist Pflicht!',
      'Chlorablagerungen regelmäßig entfernen — sonst kann sich die Passivschicht vom Edelstahl nicht neu bilden.',
      'Alle Korrosionsbefunde müssen ins Betriebstagebuch eingetragen werden — Dokumentation ist Pflicht.'
    ],
    steps: [
      {
        title: '1. Tägliche Sichtprüfung',
        text: 'Bei jedem Rundgang auf Korrosionszeichen achten: Rostflecken, braune oder gruene Verfaerbungen, weisse Ablagerungen, Blasenbildung an Beschichtungen. Besonders kritische Stellen: Beckeneinbauteile, Gelaender, Leitern, Lueftungsgitter, Schraubverbindungen.'
      },
      {
        title: '2. Richtige Reinigung',
        text: 'Edelstahl regelmäßig reinigen — Chlor- und Kalkablagerungen entfernen, damit sich die schuetzende Passivschicht neu bilden kann. KEINE Stahlwolle oder aggressive Scheuermittel verwenden! Nur Edelstahlreiniger oder milde Mittel nehmen.'
      },
      {
        title: '3. Typische Fehler vermeiden',
        text: 'Häufigste Fehler: falsches Material verbaut (V2A statt V4A), verschiedene Metalle direkt verbunden (Kontaktkorrosion), pH-Wert zu niedrig, Chlorablagerungen nicht entfernt, beschaedigte Beschichtungen nicht repariert.'
      },
      {
        title: '4. Wartungsplan einhalten',
        text: 'Woechentlich: Sichtprüfung aller Metallteile. Monatlich: Reinigung der Edelstahlteile, Prüfen der Beschichtungen. Jaehrlich: Fachprüfung der Rohrleitungen, Wandstärke-Messung bei kritischen Teilen, Opferanoden prüfen. Alles dokumentieren!'
      }
    ],
    examples: [
      {
        title: 'Korrosion an der Lueftungsanlage',
        given: 'Die Lueftungsanlage im Hallenbad zeigt nach 3 Jahren Rostflecken an den Kanaelen.',
        question: 'Woran liegt das und was muss passieren?',
        steps: [
          ['Ursache', 'Chloramine in der Hallenluft greifen die verzinkten Lueftungskanaele an'],
          ['Problem', 'Verzinkung ist in Chloratmosphaere NICHT ausreichend beständig'],
          ['Sofortmaßnahme', 'Betroffene Stellen dokumentieren, Beschichtung prüfen'],
          ['Langfristig', 'Lueftungskanaele aus Kunststoff oder beschichtetem Edelstahl ersetzen']
        ]
      },
      {
        title: 'Wartungsplan: Was wann prüfen',
        given: 'Du erstellst einen Korrosions-Wartungsplan für dein Schwimmbad.',
        question: 'Welche Pruefroutine ist sinnvoll?',
        steps: [
          ['Woechentlich', 'Sichtprüfung: Gelaender, Leitern, Duesen, Schrauben auf Verfaerbungen prüfen'],
          ['Monatlich', 'Edelstahlteile reinigen, Beschichtungen auf Schaeden prüfen, pH-Wert-Verlauf auswerten'],
          ['Halbjährlich', 'Rohrschellen und Flansche prüfen, Opferanoden kontrollieren'],
          ['Jaehrlich', 'Wandstärke-Messung an Rohren, Lueftungskanaele innen prüfen, Gesamtbericht erstellen']
        ]
      },
      {
        title: 'Notfall: Rohrbruch durch Korrosion',
        given: 'Im Technikraum tritt Wasser aus einem korrodierten Stahlrohr aus.',
        question: 'Was musst du sofort tun?',
        steps: [
          ['Sofort', 'Absperrschieber schliessen, Wasserzufuhr stoppen!'],
          ['Sichern', 'Bereich absperren, Rutschgefahr! Elektrogeräte sichern'],
          ['Melden', 'Betriebsleitung informieren, Installateur rufen'],
          ['Dokumentieren', 'Schaden fotografieren, ins Betriebstagebuch eintragen, Ursache klaeren (falsches Material? Alter?)']
        ]
      }
    ],
    pitfalls: [
      'Chloramine in der Luft werden oft vergessen — sie greifen ALLES an, nicht nur Teile im Wasser!',
      'Edelstahlreinigung NICHT mit Stahlwolle — das zerstoert die Passivschicht und FOERDERT Korrosion.',
      'Beschaedigte Beschichtungen SOFORT reparieren — unter der Blase rostet es weiter, auch wenn es von aussen harmlos aussieht.',
      'Korrosionsbefunde IMMER dokumentieren — ohne Dokumentation kann man den Verlauf nicht beurteilen.'
    ],
    quiz: {
      question: 'Die Lueftungskanaele im Hallenbad zeigen Rost. Woechentliche Sichtprüfung war unauffaellig. Was ist die wahrscheinlichste Ursache?',
      options: ['Zu hoher Chlorwert im Beckenwasser', 'Chloramine in der Hallenluft greifen die verzinkten Kanaele an', 'Die Badegaeste haben die Kanaele beschaedigt'],
      correctIndex: 1,
      explanation: 'Chloramine (gebundenes Chlor) verdunsten aus dem Beckenwasser und reichern sich in der Hallenluft an. Diese aggressive Luft greift verzinkte Lueftungskanaele an. Deshalb müssen Lueftungsanlagen in Hallenbadern aus besonders korrosionsbeständigen Materialien gebaut werden.'
    }
  }
};

const TAB_ORDER = ['grundlagen', 'arten', 'schutz', 'praxis'];

/* --- Sidebar reference tables ------------------------------------------------ */

const MATERIAL_VERGLEICH = [
  ['Material', 'Einsatzbereich', 'Beständigkeit'],
  ['V2A (1.4301)', 'Kueche, Aussen', 'NICHT für Chlor!'],
  ['V4A (1.4571)', 'Becken, Wasser', 'Standard im Bad'],
  ['Titan', 'Wärmetauscher', 'Sehr hoch'],
  ['Kunststoff/GFK', 'Rohre, Kanaele', 'Korrosionsfrei'],
  ['Kupfer', 'Leitungen', 'Gut, aber pH >7,0']
];

const KORROSIONSARTEN_UEBERSICHT = [
  ['Art', 'Erkennungsmerkmal', 'Gefahr'],
  ['Flächenkorrosion', 'Gleichmaessiger Rost', 'Mittel'],
  ['Lochfrass', 'Kleine Punkte/Loecher', 'Hoch!'],
  ['Spaltkorrosion', 'In Spalten/Fugen', 'Hoch'],
  ['Kontaktkorrosion', 'An Verbindungsstellen', 'Mittel-Hoch'],
  ['Spannungsriss', 'Unsichtbare Risse', 'Sehr hoch!']
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

export default function KorrosionDeepDiveView() {
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

          {/* Materialvergleich table (grundlagen and schutz tabs) */}
          {(activeTab === 'grundlagen' || activeTab === 'schutz') && (
            <InfoCard darkMode={darkMode} title="Materialvergleich im Schwimmbad">
              <div className="overflow-hidden rounded-xl border border-transparent">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className={darkMode ? 'border-slate-800' : 'border-gray-200'}>
                      {MATERIAL_VERGLEICH[0].map((header) => (
                        <th key={header} className={`px-3 py-2 text-left font-semibold ${darkMode ? 'bg-slate-950/50 text-slate-400' : 'bg-gray-50 text-gray-500'}`}>
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {MATERIAL_VERGLEICH.slice(1).map(([material, einsatz, beständigkeit]) => (
                      <tr key={material} className={`${darkMode ? 'border-slate-800' : 'border-gray-200'} border-b last:border-b-0`}>
                        <td className={`px-3 py-2 font-semibold whitespace-nowrap ${darkMode ? 'bg-slate-950/50 text-white' : 'bg-gray-50 text-gray-900'}`}>
                          {material}
                        </td>
                        <td className={`px-3 py-2 ${darkMode ? 'bg-slate-900/40 text-slate-300' : 'bg-white text-gray-700'}`}>
                          {einsatz}
                        </td>
                        <td className={`px-3 py-2 ${darkMode ? 'bg-slate-900/40 text-slate-300' : 'bg-white text-gray-700'}`}>
                          {beständigkeit}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </InfoCard>
          )}

          {/* Korrosionsarten overview (arten tab) */}
          {activeTab === 'arten' && (
            <InfoCard darkMode={darkMode} title="Korrosionsarten-Übersicht">
              <div className="overflow-hidden rounded-xl border border-transparent">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className={darkMode ? 'border-slate-800' : 'border-gray-200'}>
                      {KORROSIONSARTEN_UEBERSICHT[0].map((header) => (
                        <th key={header} className={`px-3 py-2 text-left font-semibold ${darkMode ? 'bg-slate-950/50 text-slate-400' : 'bg-gray-50 text-gray-500'}`}>
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {KORROSIONSARTEN_UEBERSICHT.slice(1).map(([art, merkmal, gefahr]) => (
                      <tr key={art} className={`${darkMode ? 'border-slate-800' : 'border-gray-200'} border-b last:border-b-0`}>
                        <td className={`px-3 py-2 font-semibold whitespace-nowrap ${darkMode ? 'bg-slate-950/50 text-white' : 'bg-gray-50 text-gray-900'}`}>
                          {art}
                        </td>
                        <td className={`px-3 py-2 ${darkMode ? 'bg-slate-900/40 text-slate-300' : 'bg-white text-gray-700'}`}>
                          {merkmal}
                        </td>
                        <td className={`px-3 py-2 ${darkMode ? 'bg-slate-900/40 text-slate-300' : 'bg-white text-gray-700'}`}>
                          {gefahr}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </InfoCard>
          )}

          {/* Praxis: Wartungsintervalle */}
          {activeTab === 'praxis' && (
            <InfoCard darkMode={darkMode} title="Wartungsintervalle">
              <div className="space-y-3">
                <div className={`rounded-xl border p-3 ${darkMode ? 'border-blue-500/30 bg-blue-500/10' : 'border-blue-200 bg-blue-50'}`}>
                  <div className={`text-sm font-semibold ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                    Woechentlich
                  </div>
                  <p className={`text-sm mt-1 leading-6 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    Sichtprüfung aller Metallteile auf Verfaerbungen
                  </p>
                </div>
                <div className={`rounded-xl border p-3 ${darkMode ? 'border-blue-500/30 bg-blue-500/10' : 'border-blue-200 bg-blue-50'}`}>
                  <div className={`text-sm font-semibold ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                    Monatlich
                  </div>
                  <p className={`text-sm mt-1 leading-6 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    Edelstahl reinigen, Beschichtungen prüfen
                  </p>
                </div>
                <div className={`rounded-xl border p-3 ${darkMode ? 'border-amber-500/30 bg-amber-500/10' : 'border-amber-200 bg-amber-50'}`}>
                  <div className={`text-sm font-semibold ${darkMode ? 'text-amber-300' : 'text-amber-700'}`}>
                    Jaehrlich
                  </div>
                  <p className={`text-sm mt-1 leading-6 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    Wandstärke-Messung, Lueftung prüfen, Gesamtbericht
                  </p>
                </div>
              </div>
            </InfoCard>
          )}

          {/* Schutz: Quick reference */}
          {activeTab === 'schutz' && (
            <InfoCard darkMode={darkMode} title="Merke: Korrosionsschutz">
              <div className="space-y-3">
                <div className={`rounded-xl border p-3 ${darkMode ? 'border-blue-500/30 bg-blue-500/10' : 'border-blue-200 bg-blue-50'}`}>
                  <div className={`text-sm font-semibold ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                    Aktiver Schutz
                  </div>
                  <p className={`text-sm mt-1 leading-6 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    Opferanoden, kathodischer Schutz, Wasserchemie kontrollieren
                  </p>
                </div>
                <div className={`rounded-xl border p-3 ${darkMode ? 'border-amber-500/30 bg-amber-500/10' : 'border-amber-200 bg-amber-50'}`}>
                  <div className={`text-sm font-semibold ${darkMode ? 'text-amber-300' : 'text-amber-700'}`}>
                    Passiver Schutz
                  </div>
                  <p className={`text-sm mt-1 leading-6 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    Beschichtungen, richtige Materialwahl, konstruktiver Schutz
                  </p>
                </div>
              </div>
            </InfoCard>
          )}

          {/* Grundlagen: Quick info */}
          {activeTab === 'grundlagen' && (
            <InfoCard darkMode={darkMode} title="Korrosionsfaktoren im Bad">
              <div className="space-y-3">
                <div className={`rounded-xl border p-3 ${darkMode ? 'border-blue-500/30 bg-blue-500/10' : 'border-blue-200 bg-blue-50'}`}>
                  <div className={`text-sm font-semibold ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                    Chlor & Chloramine
                  </div>
                  <p className={`text-sm mt-1 leading-6 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    Greifen Metalle direkt an — in Wasser UND Luft
                  </p>
                </div>
                <div className={`rounded-xl border p-3 ${darkMode ? 'border-amber-500/30 bg-amber-500/10' : 'border-amber-200 bg-amber-50'}`}>
                  <div className={`text-sm font-semibold ${darkMode ? 'text-amber-300' : 'text-amber-700'}`}>
                    Feuchtigkeit & Wärme
                  </div>
                  <p className={`text-sm mt-1 leading-6 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    60-70% Luftfeuchte + 28-34 Grad = perfekte Korrosionsbedingungen
                  </p>
                </div>
              </div>
            </InfoCard>
          )}

          {/* Arten: Electrochemical series hint */}
          {activeTab === 'arten' && (
            <InfoCard darkMode={darkMode} title="Spannungsreihe (vereinfacht)">
              <div className="space-y-3">
                <div className={`rounded-xl border p-3 ${darkMode ? 'border-blue-500/30 bg-blue-500/10' : 'border-blue-200 bg-blue-50'}`}>
                  <div className={`text-sm font-semibold ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                    Unedle Metalle (korrodieren zuerst)
                  </div>
                  <p className={`text-sm mt-1 leading-6 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    Zink, Aluminium, Eisen/Stahl
                  </p>
                </div>
                <div className={`rounded-xl border p-3 ${darkMode ? 'border-amber-500/30 bg-amber-500/10' : 'border-amber-200 bg-amber-50'}`}>
                  <div className={`text-sm font-semibold ${darkMode ? 'text-amber-300' : 'text-amber-700'}`}>
                    Edle Metalle (korrodieren zuletzt)
                  </div>
                  <p className={`text-sm mt-1 leading-6 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    Kupfer, Edelstahl, Titan, Gold
                  </p>
                  <p className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                    Bei Kontaktkorrosion wird das unedlere Metall zerstoert!
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
