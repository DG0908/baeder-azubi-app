const mkGroup = (label, terms) => ({ label, terms });

export const KEYWORD_CHALLENGES = {
  org: [
    {
      type: 'keyword',
      q: 'Nenne mindestens 4 Punkte, die vor Schichtbeginn fuer die Wasseraufsicht geprueft werden muessen.',
      keywordGroups: [
        mkGroup('Rettungsfaehigkeit', ['rettungsfaehigkeit', 'rettungsschwimmnachweis']),
        mkGroup('Erste Hilfe', ['erste hilfe', 'ersthelfer', 'hlw']),
        mkGroup('Sichtkontrolle', ['sichtkontrolle', 'sichtkontakt', 'aufsichtsgang']),
        mkGroup('Kommunikation', ['funkgeraet', 'sprechfunk', 'kommunikation']),
        mkGroup('Notfallkette', ['notfallplan', 'meldekette', 'alarmplan'])
      ],
      minKeywordGroups: 4,
      answerGuide: 'Vor Schichtbeginn sollten mindestens Rettungsfaehigkeit, Erste-Hilfe-Status, Sicht-/Aufsichtsbereiche, Kommunikationsmittel und Notfallkette geprueft werden.'
    },
    {
      type: 'keyword',
      q: 'Welche 4 Inhalte gehoeren in einen sicheren Oeffnungsrundgang im Bad?',
      keywordGroups: [
        mkGroup('Rutschgefahren', ['rutschgefahr', 'nassbereich', 'boden']),
        mkGroup('Rettungsgeraete', ['rettungsring', 'wurfleine', 'rettungsgeraet']),
        mkGroup('Fluchtwege', ['fluchtweg', 'notausgang', 'rettungsweg']),
        mkGroup('Technikstatus', ['technik', 'stoerung', 'anlage']),
        mkGroup('Beckenkontrolle', ['becken', 'wasserstand', 'sichttiefe'])
      ],
      minKeywordGroups: 4,
      answerGuide: 'Typisch sind Boden-/Rutschkontrolle, Rettungsgeraete, Fluchtwege/Notausgaenge, Technikstatus und Beckencheck.'
    },
    {
      type: 'keyword',
      q: 'Nenne 4 Aspekte, die bei der Dienstplanung im Badebetrieb zwingend beruecksichtigt werden muessen.',
      keywordGroups: [
        mkGroup('Qualifikation', ['qualifikation', 'rettungsfaehigkeit']),
        mkGroup('Arbeitszeitrecht', ['arbeitszeitgesetz', 'ruhezeit', 'schichtdauer']),
        mkGroup('Besucheraufkommen', ['besucherzahlen', 'stosszeiten', 'auslastung']),
        mkGroup('Urlaub/Abwesenheit', ['urlaub', 'krankheit', 'abwesenheit']),
        mkGroup('Mindestbesetzung', ['mindestbesetzung', 'personalstaerke'])
      ],
      minKeywordGroups: 4,
      answerGuide: 'Wichtig sind Qualifikation, gesetzliche Zeiten, Auslastung/Stosszeiten, Abwesenheiten und Mindestbesetzung.'
    },
    {
      type: 'keyword',
      q: 'Welche 4 Punkte sollten in der Haus- und Badeordnung klar geregelt sein?',
      keywordGroups: [
        mkGroup('Sicherheitsregeln', ['sicherheitsregel', 'sprungverbot', 'verhalten']),
        mkGroup('Hygieneregeln', ['duschen', 'hygiene', 'toiletten']),
        mkGroup('Aufsichtsanweisungen', ['aufsicht', 'anweisung', 'folge leisten']),
        mkGroup('Sanktionen', ['hausverweis', 'ausschluss', 'ordnungsmassnahme']),
        mkGroup('Nutzungszeiten', ['oeffnungszeit', 'nutzungszeit', 'schliesszeit'])
      ],
      minKeywordGroups: 4,
      answerGuide: 'Hausordnung: Sicherheits- und Hygieneregeln, Aufsichtsanweisungen, Nutzungszeiten und Sanktionen.'
    },
    {
      type: 'keyword',
      q: 'Nenne 4 Eintraege, die im Betriebstagebuch regelmaessig dokumentiert werden sollten.',
      keywordGroups: [
        mkGroup('Wasserwerte', ['chlor', 'ph', 'redox']),
        mkGroup('Filterbetrieb', ['filterspuelung', 'filter', 'rueckspuelung']),
        mkGroup('Stoerungen', ['stoerung', 'reparatur', 'ausfall']),
        mkGroup('Chemikalien', ['chemikalienverbrauch', 'dosierung', 'nachfuellung']),
        mkGroup('Besonderheiten', ['zwischenfall', 'vorfall', 'abweichung'])
      ],
      minKeywordGroups: 4,
      answerGuide: 'Ins Betriebstagebuch gehoeren u.a. Wasserwerte, Filtervorgaenge, Stoerungen, Chemikalien und Besonderheiten.'
    }
  ],
  tech: [
    {
      type: 'keyword',
      q: 'Nenne mindestens 4 Punkte fuer eine stabile Beckenwasseraufbereitung.',
      keywordGroups: [
        mkGroup('Freies Chlor', ['freies chlor', 'chlor']),
        mkGroup('pH-Wert', ['ph', 'ph wert']),
        mkGroup('Umwaelzung', ['umwaelzung', 'umwaelzpumpe', 'volumenstrom']),
        mkGroup('Filtration', ['filter', 'filtration', 'rueckspuelung']),
        mkGroup('Dokumentation', ['dokumentation', 'protokoll', 'betriebstagebuch'])
      ],
      minKeywordGroups: 4,
      answerGuide: 'Stabil wird es durch korrekten Chlor- und pH-Bereich, passende Umwaelzung, Filtration und saubere Dokumentation.'
    },
    {
      type: 'keyword',
      q: 'Welche 4 Ursachen koennen zu auffaelligen Wasserwerten fuehren?',
      keywordGroups: [
        mkGroup('Besucherlast', ['hohe besucherzahl', 'auslastung', 'spitzenlast']),
        mkGroup('Dosierung', ['dosieranlage', 'dosierung', 'chemikalie']),
        mkGroup('Filterproblem', ['filterproblem', 'verblockung', 'rueckspuelung']),
        mkGroup('Messfehler', ['messfehler', 'kuvette', 'reagenz']),
        mkGroup('Hydraulik', ['umwaelzung', 'hydraulik', 'stromung'])
      ],
      minKeywordGroups: 4,
      answerGuide: 'Hauefig: hohe Last, Dosierfehler, Filterprobleme, Messfehler oder hydrau­lische Abweichungen.'
    },
    {
      type: 'keyword',
      q: 'Nenne 4 Punkte, die bei der Rueckspuelung eines Filters zu beachten sind.',
      keywordGroups: [
        mkGroup('Betriebszustand', ['betrieb stoppen', 'anlage sichern', 'umschalten']),
        mkGroup('Spueldauer', ['spueldauer', 'spuelzeit']),
        mkGroup('Spuelmenge', ['spuelwasser', 'spuelmenge', 'spuelstrom']),
        mkGroup('Nachspuelen', ['nachspuelen', 'klarspuelen']),
        mkGroup('Dokumentation', ['dokumentation', 'eintrag', 'protokoll'])
      ],
      minKeywordGroups: 4,
      answerGuide: 'Sicherer Ablauf: umschalten/sichern, passende Spuelzeit/-menge, Nachspuelen und Dokumentation.'
    },
    {
      type: 'keyword',
      q: 'Welche 4 Aufgaben uebernimmt der Sorptionsfilter im Aufbereitungssystem?',
      keywordGroups: [
        mkGroup('Ozonabbau', ['ozonabbau', 'ozon']),
        mkGroup('Organik', ['organische stoffe', 'adsorption', 'organik']),
        mkGroup('Nebenprodukte', ['nebenprodukte', 'chloramine', 'reaktionsprodukte']),
        mkGroup('Wasserqualitaet', ['wasserqualitaet', 'klarheit', 'geruch']),
        mkGroup('Schutz Nachstufe', ['nachgeschaltete stufe', 'schutz'])
      ],
      minKeywordGroups: 4,
      answerGuide: 'Typisch sind Ozonabbau, Bindung organischer Stoffe/Nebenprodukte und Stabilisierung der Wasserqualitaet.'
    },
    {
      type: 'keyword',
      q: 'Nenne 4 Kernparameter, die bei der taeglichen technischen Betriebskontrolle geprueft werden.',
      keywordGroups: [
        mkGroup('Desinfektion', ['chlor', 'desinfektion']),
        mkGroup('pH', ['ph', 'ph wert']),
        mkGroup('Temperatur', ['temperatur', 'wassertemperatur']),
        mkGroup('Umwaelzung', ['umwaelzung', 'volumenstrom', 'pumpe']),
        mkGroup('Anlagendruck', ['druck', 'differenzdruck', 'filterdruck'])
      ],
      minKeywordGroups: 4,
      answerGuide: 'Zur taeglichen Kontrolle gehoeren u.a. Chlor, pH, Temperatur, Umwaelzung und Druckwerte.'
    }
  ],
  swim: [
    {
      type: 'keyword',
      q: 'Nenne 4 Schritte bei einer Wasserrettung einer bewusstlosen Person.',
      keywordGroups: [
        mkGroup('Eigensicherung', ['eigensicherung', 'selbstschutz']),
        mkGroup('Ansprechen/Bergen', ['bergen', 'ansprechen', 'rettungsgriff']),
        mkGroup('Atmung', ['atemkontrolle', 'atmung']),
        mkGroup('Notruf', ['notruf', '112']),
        mkGroup('HLW', ['wiederbelebung', 'hlw', 'herzdruckmassage'])
      ],
      minKeywordGroups: 4,
      answerGuide: 'Ablauf: Eigenschutz, sichere Rettung/Bergung, Atmung pruefen, Notruf 112, ggf. HLW.'
    },
    {
      type: 'keyword',
      q: 'Welche 4 Punkte gehoeren zu einer sicheren Aufsicht am Sprungbereich?',
      keywordGroups: [
        mkGroup('Wassertiefe', ['wassertiefe', 'sprungbereich']),
        mkGroup('Freigabe', ['freigabe', 'einzelsprung', 'abstand']),
        mkGroup('Regelverstoesse', ['regelverstoss', 'eingreifen', 'ansprache']),
        mkGroup('Sichtfeld', ['sichtkontakt', 'sichtfeld']),
        mkGroup('Notfallbereitschaft', ['rettungsgeraet', 'notfall'])
      ],
      minKeywordGroups: 4,
      answerGuide: 'Sprungaufsicht braucht Tiefenkontrolle, Freigabesystem/Abstaende, lueckenloses Sichtfeld und Notfallbereitschaft.'
    },
    {
      type: 'keyword',
      q: 'Nenne 4 Inhalte einer sauberen Einweisung fuer Schwimmanfaenger.',
      keywordGroups: [
        mkGroup('Baderegeln', ['baderegel', 'verhalten']),
        mkGroup('Wassergewoehnung', ['wassergewoehnung', 'atmen ins wasser']),
        mkGroup('Sicherheitszone', ['flachwasser', 'stehtiefe', 'sicherheitsbereich']),
        mkGroup('Hilfsmittel', ['schwimmbrett', 'hilfsmittel']),
        mkGroup('Aufsicht', ['aufsicht', 'gruppe', 'abstand'])
      ],
      minKeywordGroups: 4,
      answerGuide: 'Einweisung sollte Regeln, Wassergewoehnung, sicheren Bereich, Hilfsmittel und Aufsichtskonzept abdecken.'
    },
    {
      type: 'keyword',
      q: 'Welche 4 Punkte sind fuer einen sicheren Start im Wettkampftraining wichtig?',
      keywordGroups: [
        mkGroup('Startsignal', ['startsignal', 'kommando']),
        mkGroup('Abstand', ['abstand', 'einzeln starten']),
        mkGroup('Bahnorganisation', ['bahn', 'bahnen', 'ordnung']),
        mkGroup('Technikhinweis', ['technik', 'eintauchen']),
        mkGroup('Aufsicht', ['aufsicht', 'trainer'])
      ],
      minKeywordGroups: 4,
      answerGuide: 'Starttraining: klares Signal, sichere Abstaende, geordnete Bahnen, Technikhinweise und Aufsicht.'
    },
    {
      type: 'keyword',
      q: 'Nenne 4 Kriterien, um eine Schwimmeinheit sinnvoll auszuwerten.',
      keywordGroups: [
        mkGroup('Zeit', ['zeit', 'split', 'sekunden']),
        mkGroup('Technik', ['technik', 'wasserlage', 'zug']),
        mkGroup('Belastung', ['belastung', 'intensitaet', 'puls']),
        mkGroup('Fehleranalyse', ['fehler', 'korrektur', 'feedback']),
        mkGroup('Dokumentation', ['dokumentation', 'trainingstagebuch'])
      ],
      minKeywordGroups: 4,
      answerGuide: 'Aussagekraeftig wird die Auswertung mit Zeitdaten, Technik, Belastung, Fehleranalyse und Doku.'
    }
  ],
  first: [
    {
      type: 'keyword',
      q: 'Nenne mindestens 4 Kernschritte der Reanimation bei Erwachsenen.',
      keywordGroups: [
        mkGroup('Bewusstsein', ['bewusstsein', 'reaktion pruefen']),
        mkGroup('Atmung', ['atmung pruefen', 'atemkontrolle']),
        mkGroup('Notruf', ['notruf', '112']),
        mkGroup('Herzdruckmassage', ['herzdruckmassage', '30', 'kompression']),
        mkGroup('Beatmung/AED', ['beatmung', '2', 'aed', 'defibrillator'])
      ],
      minKeywordGroups: 4,
      answerGuide: 'Schema: Reaktion/Atmung pruefen, Notruf, 30:2-Reanimation und AED frueh einsetzen.'
    },
    {
      type: 'keyword',
      q: 'Welche 4 Punkte sind bei einer stabilen Seitenlage wichtig?',
      keywordGroups: [
        mkGroup('Atmung vorhanden', ['atmung', 'bewusstlos aber atmet']),
        mkGroup('Koerperlage', ['seitenlage', 'stabile lage']),
        mkGroup('Atemwege', ['atemwege frei', 'kopf ueberstrecken']),
        mkGroup('Kontrolle', ['regelmaessig kontrollieren', 'atmung beobachten']),
        mkGroup('Notruf', ['notruf', '112'])
      ],
      minKeywordGroups: 4,
      answerGuide: 'Bei vorhandener Atmung: stabile Seitenlage, Atemwege sichern, Notruf und engmaschige Kontrolle.'
    },
    {
      type: 'keyword',
      q: 'Nenne 4 Sofortmassnahmen bei stark blutender Wunde.',
      keywordGroups: [
        mkGroup('Eigenschutz', ['handschuhe', 'eigensicherung']),
        mkGroup('Druck', ['direkter druck', 'druckverband']),
        mkGroup('Hochlagern', ['hochlagern', 'extremitaet']),
        mkGroup('Notruf', ['notruf', '112']),
        mkGroup('Schockbeobachtung', ['schock', 'beobachten', 'warm halten'])
      ],
      minKeywordGroups: 4,
      answerGuide: 'Wichtig: Eigenschutz, direkter Druck/Druckverband, ggf. hochlagern, Notruf und Schockbeobachtung.'
    },
    {
      type: 'keyword',
      q: 'Welche 4 Punkte gehoeren zu einer sauberen AED-Anwendung?',
      keywordGroups: [
        mkGroup('Geraet einschalten', ['aed einschalten', 'geraet einschalten']),
        mkGroup('Elektroden', ['elektroden', 'pads']),
        mkGroup('Sicherheitsabstand', ['nicht beruehren', 'abstand']),
        mkGroup('Sprachanweisungen', ['sprachanweisung', 'anweisungen folgen']),
        mkGroup('Reanimation fortsetzen', ['reanimation fortsetzen', 'kompression'])
      ],
      minKeywordGroups: 4,
      answerGuide: 'AED: einschalten, Pads korrekt, Sicherheitsabstand bei Analyse/Schock, Anweisungen folgen, HLW fortsetzen.'
    },
    {
      type: 'keyword',
      q: 'Nenne 4 Angaben fuer einen vernuenftigen Notruf aus dem Bad.',
      keywordGroups: [
        mkGroup('Ort', ['wo', 'einsatzort', 'bad']),
        mkGroup('Was passiert', ['was ist passiert', 'notfallart']),
        mkGroup('Wie viele', ['wie viele verletzte', 'anzahl']),
        mkGroup('Wer meldet', ['wer meldet', 'name', 'rueckrufnummer']),
        mkGroup('Warten auf Rueckfragen', ['nicht auflegen', 'rueckfragen'])
      ],
      minKeywordGroups: 4,
      answerGuide: 'Notruf: Ort, Ereignis, Anzahl Betroffene, Melderdaten und Leitung fuer Rueckfragen offen halten.'
    }
  ],
  hygiene: [
    {
      type: 'keyword',
      q: 'Nenne 4 Massnahmen, um Kreuzkontamination im Nassbereich zu vermeiden.',
      keywordGroups: [
        mkGroup('Bereichstrennung', ['bereichstrennung', 'getrennte utensilien']),
        mkGroup('Handschuhwechsel', ['handschuhwechsel', 'handschuhe wechseln']),
        mkGroup('Reinigungsreihenfolge', ['sauber nach schmutzig', 'reihenfolge']),
        mkGroup('Haendehygiene', ['haendehygiene', 'haendedesinfektion']),
        mkGroup('Dokumentation', ['dokumentation', 'reinigungsplan'])
      ],
      minKeywordGroups: 4,
      answerGuide: 'Vermeidung gelingt durch Bereichstrennung, Handschuhwechsel, korrekte Reihenfolge, Haendehygiene und Dokumentation.'
    },
    {
      type: 'keyword',
      q: 'Welche 4 Punkte gehoeren zur taeglichen Hygienekontrolle im Badbetrieb?',
      keywordGroups: [
        mkGroup('Wasserparameter', ['wasserparameter', 'chlor', 'ph']),
        mkGroup('Sichtkontrolle', ['sichtkontrolle', 'sauberkeit']),
        mkGroup('Reinigungsnachweis', ['reinigungsnachweis', 'plan']),
        mkGroup('Zwischenfallmeldung', ['zwischenfall', 'meldung', 'abweichung']),
        mkGroup('Lueftung/Feuchte', ['lueftung', 'feuchtigkeit'])
      ],
      minKeywordGroups: 4,
      answerGuide: 'Taeglich: Parameter, Sicht-/Flaechenkontrollen, Reinigungsnachweise, Zwischenfaelle und Raumklima.'
    },
    {
      type: 'keyword',
      q: 'Nenne 4 Schritte bei einem hygienischen Zwischenfall im Becken.',
      keywordGroups: [
        mkGroup('Bereich sichern', ['bereich absperren', 'sichern']),
        mkGroup('Meldekette', ['meldekette', 'info an team']),
        mkGroup('Massnahmenplan', ['massnahmenplan', 'desinfektion', 'wasserwechsel']),
        mkGroup('Dokumentation', ['dokumentation', 'protokoll']),
        mkGroup('Freigabe', ['freigabe', 'wiedereroeffnung'])
      ],
      minKeywordGroups: 4,
      answerGuide: 'Ablauf: absichern, intern melden, nach Plan handeln, dokumentieren und erst nach Freigabe oeffnen.'
    },
    {
      type: 'keyword',
      q: 'Welche 4 Punkte sind fuer eine wirksame Flaechendesinfektion entscheidend?',
      keywordGroups: [
        mkGroup('Vorreinigung', ['vorreinigung', 'schmutz entfernen']),
        mkGroup('Konzentration', ['konzentration', 'dosierung']),
        mkGroup('Einwirkzeit', ['einwirkzeit']),
        mkGroup('Vollstaendige Benetzung', ['benetzung', 'flaeche vollstaendig']),
        mkGroup('Materialvertraeglichkeit', ['materialvertraeglichkeit'])
      ],
      minKeywordGroups: 4,
      answerGuide: 'Wirksam nur mit Vorreinigung, richtiger Konzentration, Einwirkzeit und vollstaendiger Benetzung.'
    },
    {
      type: 'keyword',
      q: 'Nenne 4 Gaestehinweise, die aus hygienischer Sicht im Bad wichtig sind.',
      keywordGroups: [
        mkGroup('Duschen', ['duschen']),
        mkGroup('Toilettennutzung', ['toilette', 'wc']),
        mkGroup('Bei Krankheit nicht baden', ['krank', 'infekt']),
        mkGroup('Nassbereich-Regeln', ['barfussbereich', 'strassenschuhe']),
        mkGroup('Kinderhygiene', ['windel', 'kinder'])
      ],
      minKeywordGroups: 4,
      answerGuide: 'Typische Hinweise: vorher duschen, Toilette nutzen, bei Infekt nicht baden, Nassbereichsregeln und Kinderhygiene.'
    }
  ],
  pol: [
    {
      type: 'keyword',
      q: 'Nenne 4 Grundsaetze demokratischer Wahlen.',
      keywordGroups: [
        mkGroup('Allgemein', ['allgemein']),
        mkGroup('Frei', ['frei']),
        mkGroup('Gleich', ['gleich']),
        mkGroup('Geheim', ['geheim']),
        mkGroup('Unmittelbar', ['unmittelbar'])
      ],
      minKeywordGroups: 4,
      answerGuide: 'Zu den Wahlgrundsaetzen zaehlen allgemein, frei, gleich, geheim und unmittelbar.'
    },
    {
      type: 'keyword',
      q: 'Welche 4 Aufgaben hat der Bundestag?',
      keywordGroups: [
        mkGroup('Gesetzgebung', ['gesetze', 'gesetzgebung']),
        mkGroup('Kanzlerwahl', ['kanzler waehlen', 'bundeskanzler']),
        mkGroup('Kontrolle Regierung', ['regierung kontrollieren', 'kontrolle']),
        mkGroup('Haushalt', ['haushalt', 'budget']),
        mkGroup('Debatte', ['debatte', 'beratung'])
      ],
      minKeywordGroups: 4,
      answerGuide: 'Bundestag: Gesetze, Kanzlerwahl, Regierungskontrolle, Haushalt und politische Debatte.'
    },
    {
      type: 'keyword',
      q: 'Nenne 4 Punkte, die in einem gueltigen Arbeitsvertrag geregelt sein sollten.',
      keywordGroups: [
        mkGroup('Taetigkeit', ['taetigkeit', 'aufgaben']),
        mkGroup('Arbeitszeit', ['arbeitszeit']),
        mkGroup('Verguetung', ['lohn', 'gehalt', 'verguetung']),
        mkGroup('Urlaub', ['urlaub']),
        mkGroup('Kuendigung', ['kuendigung', 'frist'])
      ],
      minKeywordGroups: 4,
      answerGuide: 'Sinnvoll geregelt sind Taetigkeit, Arbeitszeit, Verguetung, Urlaub und Kuendigungsfristen.'
    },
    {
      type: 'keyword',
      q: 'Welche 4 Versicherungen gehoeren zur gesetzlichen Sozialversicherung?',
      keywordGroups: [
        mkGroup('Krankenversicherung', ['krankenversicherung']),
        mkGroup('Rentenversicherung', ['rentenversicherung']),
        mkGroup('Arbeitslosenversicherung', ['arbeitslosenversicherung']),
        mkGroup('Pflegeversicherung', ['pflegeversicherung']),
        mkGroup('Unfallversicherung', ['unfallversicherung'])
      ],
      minKeywordGroups: 4,
      answerGuide: 'Gesetzliche Sozialversicherung umfasst u.a. Kranken-, Renten-, Arbeitslosen-, Pflege- und Unfallversicherung.'
    },
    {
      type: 'keyword',
      q: 'Nenne 4 Bereiche, die zum betrieblichen Umweltschutz im Schwimmbad gehoeren.',
      keywordGroups: [
        mkGroup('Energie', ['energie', 'waermerueckgewinnung', 'led']),
        mkGroup('Wasser', ['wasser sparen', 'regenwasser', 'umwaelzung']),
        mkGroup('Abfall', ['abfall', 'trennung', 'entsorgung']),
        mkGroup('Chemikalien', ['chemikalien', 'dosierung', 'sichere lagerung']),
        mkGroup('Dokumentation', ['dokumentation', 'nachweis'])
      ],
      minKeywordGroups: 4,
      answerGuide: 'Umweltschutz umfasst Energie, Wasser, Abfall, Chemikalienmanagement und Nachweise.'
    }
  ],
  math: [
    {
      type: 'keyword',
      q: 'Nenne 4 Rechenschritte, um einen Dreisatz mit Eintrittspreisen sicher zu loesen.',
      keywordGroups: [
        mkGroup('Grundwert notieren', ['grundwert', 'ausgangswert', 'gegeben']),
        mkGroup('Einheitswert bilden', ['einheitswert', 'pro stueck', 'durch teilen']),
        mkGroup('Hochrechnen', ['hochrechnen', 'multiplizieren', 'zielmenge']),
        mkGroup('Einheit pruefen', ['einheit', 'euro', 'kontrolle']),
        mkGroup('Plausibilitaet', ['plausibel', 'schaetzen', 'gegenprobe'])
      ],
      minKeywordGroups: 4,
      answerGuide: 'Dreisatz: Ausgangsdaten notieren, Einheitswert berechnen, auf Zielmenge hochrechnen und Einheit/Plausibilitaet pruefen.'
    },
    {
      type: 'keyword',
      q: 'Welche 4 Groessen brauchst du fuer die Berechnung eines rechteckigen Beckenvolumens?',
      keywordGroups: [
        mkGroup('Laenge', ['laenge']),
        mkGroup('Breite', ['breite']),
        mkGroup('Tiefe', ['tiefe']),
        mkGroup('Formel', ['volumen', 'laenge mal breite mal tiefe', 'l*b*t']),
        mkGroup('Einheit', ['kubikmeter', 'm3'])
      ],
      minKeywordGroups: 4,
      answerGuide: 'Fuer Rechteckbecken: Laenge, Breite, Tiefe und die Formel V = L * B * T (Ergebnis in m3).'
    },
    {
      type: 'keyword',
      q: 'Nenne 4 typische Kopfrechenstrategien, die im Badebetrieb helfen.',
      keywordGroups: [
        mkGroup('Runden', ['runden', 'ueberschlag']),
        mkGroup('Aufteilen', ['aufteilen', 'zerlegen']),
        mkGroup('Prozent', ['prozent', '10 prozent', '1 prozent']),
        mkGroup('Einmaleins', ['einmaleins', 'multiplikation']),
        mkGroup('Probe', ['gegenprobe', 'kontrolle', 'rueckrechnung'])
      ],
      minKeywordGroups: 4,
      answerGuide: 'Hilfreich sind Ueberschlag/Runden, Zerlegen, Prozent-Ankerwerte, sicheres Einmaleins und Gegenprobe.'
    },
    {
      type: 'keyword',
      q: 'Welche 4 Schritte sind sinnvoll, wenn du eine Formel nach einer gesuchten Groesse umstellst?',
      keywordGroups: [
        mkGroup('Gesuchte markieren', ['gesuchte', 'variable markieren', 'x']),
        mkGroup('Gleiche Operationen', ['beide seiten', 'gleichung', 'operation']),
        mkGroup('Freistellen', ['freistellen', 'isolieren']),
        mkGroup('Einsetzen', ['einsetzen', 'werte einsetzen']),
        mkGroup('Ergebnis pruefen', ['probe', 'einheit', 'kontrollrechnung'])
      ],
      minKeywordGroups: 4,
      answerGuide: 'Gesuchte Groesse markieren, mit gleichen Operationen freistellen, Werte einsetzen und per Probe/Einheit kontrollieren.'
    },
    {
      type: 'keyword',
      q: 'Nenne 4 Rechenthemen aus der Ausbildung, die du im Badalltag direkt brauchst.',
      keywordGroups: [
        mkGroup('Dreisatz', ['dreisatz', 'verhaeltnisrechnung']),
        mkGroup('Prozentrechnung', ['prozent', 'rabatt', 'zuschlag']),
        mkGroup('Volumen', ['volumen', 'kubikmeter', 'beckeninhalt']),
        mkGroup('Klammer/Potenzen', ['klammer', 'potenz']),
        mkGroup('Gleichungen', ['gleichung', 'formelumstellung'])
      ],
      minKeywordGroups: 4,
      answerGuide: 'Praxisnah sind Dreisatz, Prozentrechnung, Volumenberechnung, sichere Termrechnung und Formelumstellung.'
    }
  ],
  health: [
    {
      type: 'keyword',
      q: 'Nenne 4 moegliche Anzeichen einer akuten Kreislaufproblematik bei Badegaesten.',
      keywordGroups: [
        mkGroup('Schwindel', ['schwindel']),
        mkGroup('Blaesse/kalter Schweiss', ['blaesse', 'kalter schweiss']),
        mkGroup('Uebelkeit', ['uebelkeit', 'erbrechen']),
        mkGroup('Bewusstsein', ['benommen', 'bewusstlos']),
        mkGroup('Puls/Atmung', ['puls', 'atmung'])
      ],
      minKeywordGroups: 4,
      answerGuide: 'Typisch sind Schwindel, Blaesse/kalter Schweiss, Uebelkeit, Bewusstseinseintruebung sowie Puls-/Atmungsauffaelligkeiten.'
    },
    {
      type: 'keyword',
      q: 'Welche 4 Massnahmen helfen bei der Vorbeugung von Hitzebelastung im Sommerbetrieb?',
      keywordGroups: [
        mkGroup('Trinken', ['trinken', 'fluessigkeit']),
        mkGroup('Sonnenschutz', ['sonnenschutz', 'schatten', 'kopfbedeckung']),
        mkGroup('Pausen', ['pausen', 'abkuehlung']),
        mkGroup('Arbeitsorganisation', ['arbeitsorganisation', 'schichtplanung']),
        mkGroup('Fruehwarnzeichen', ['warnzeichen', 'hitzesymptome'])
      ],
      minKeywordGroups: 4,
      answerGuide: 'Vorbeugung: trinken, Sonnenschutz, Abkuehl-/Pausenmanagement, angepasste Schichtplanung und Symptombeobachtung.'
    },
    {
      type: 'keyword',
      q: 'Nenne 4 Punkte, die bei einem Asthma-Notfall im Bad wichtig sind.',
      keywordGroups: [
        mkGroup('Ruhe/Sitzposition', ['beruhigen', 'aufrecht sitzen']),
        mkGroup('Notfallspray', ['notfallspray', 'inhalator']),
        mkGroup('Atmung beobachten', ['atmung beobachten', 'atemnot']),
        mkGroup('Notruf', ['notruf', '112']),
        mkGroup('Keine Alleinlassung', ['nicht allein lassen', 'betreuen'])
      ],
      minKeywordGroups: 4,
      answerGuide: 'Ruhig lagern/sitzen, Notfallspray unterstuetzen, Atmung beobachten, ggf. 112 und Person betreuen.'
    },
    {
      type: 'keyword',
      q: 'Welche 4 Faktoren sind fuer gesundes Rueckentraining im Wasser wichtig?',
      keywordGroups: [
        mkGroup('Technik', ['technik', 'koerperhaltung']),
        mkGroup('Belastungssteuerung', ['belastung', 'intensitaet']),
        mkGroup('Regelmaessigkeit', ['regelmaessig', 'kontinuitaet']),
        mkGroup('Aufwaermen', ['aufwaermen', 'mobilisation']),
        mkGroup('Schmerzbeachtung', ['schmerz', 'ueberlastung'])
      ],
      minKeywordGroups: 4,
      answerGuide: 'Rueckentraining profitiert von sauberer Technik, dosierter Belastung, Regelmaessigkeit, Aufwaermen und Schmerzbeachtung.'
    },
    {
      type: 'keyword',
      q: 'Nenne 4 Punkte fuer einen verantwortungsvollen Umgang mit gesundheitlich eingeschraenkten Badegaesten.',
      keywordGroups: [
        mkGroup('Kommunikation', ['kommunikation', 'absprechen']),
        mkGroup('Aufsicht anpassen', ['aufsicht anpassen', 'individuell']),
        mkGroup('Hilfsmittel', ['hilfsmittel', 'unterstuetzung']),
        mkGroup('Notfallwissen', ['notfallplan', 'vorerkrankung']),
        mkGroup('Respekt/Datenschutz', ['respekt', 'datenschutz', 'diskretion'])
      ],
      minKeywordGroups: 4,
      answerGuide: 'Wichtig sind gute Kommunikation, angepasste Aufsicht, passende Hilfsmittel, Notfallwissen und respektvoller Umgang.'
    }
  ]
};

export const buildKeywordFlashcards = (keywordQuestionsByCategory) => {
  const source = keywordQuestionsByCategory && typeof keywordQuestionsByCategory === 'object'
    ? keywordQuestionsByCategory
    : {};

  const result = {};
  Object.entries(source).forEach(([categoryId, questions]) => {
    const safeQuestions = Array.isArray(questions) ? questions : [];
    result[categoryId] = safeQuestions.map((question, index) => ({
      id: `kw-${categoryId}-${index + 1}`,
      type: 'keyword',
      front: question.q,
      back: question.answerGuide || '',
      keywordGroups: question.keywordGroups || [],
      minKeywordGroups: question.minKeywordGroups
    }));
  });
  return result;
};
