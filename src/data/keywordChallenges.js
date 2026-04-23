const mkGroup = (label, terms) => ({ label, terms });

export const KEYWORD_CHALLENGES = {
  org: [
    {
      type: 'keyword',
      q: 'Nenne mindestens 4 Punkte, die vor Schichtbeginn für die Wasseraufsicht geprüft werden müssen.',
      keywordGroups: [
        mkGroup('Rettungsfähigkeit', ['rettungsfähigkeit', 'rettungsschwimmnachweis']),
        mkGroup('Erste Hilfe', ['erste hilfe', 'ersthelfer', 'hlw']),
        mkGroup('Sichtkontrolle', ['sichtkontrolle', 'sichtkontakt', 'aufsichtsgang']),
        mkGroup('Kommunikation', ['funkgerät', 'sprechfunk', 'kommunikation']),
        mkGroup('Notfallkette', ['notfallplan', 'meldekette', 'alarmplan'])
      ],
      minKeywordGroups: 4,
      answerGuide: 'Vor Schichtbeginn sollten mindestens Rettungsfähigkeit, Erste-Hilfe-Status, Sicht-/Aufsichtsbereiche, Kommunikationsmittel und Notfallkette geprüft werden.'
    },
    {
      type: 'keyword',
      q: 'Welche 4 Inhalte gehören in einen sicheren Öffnungsrundgang im Bad?',
      keywordGroups: [
        mkGroup('Rutschgefahren', ['rutschgefahr', 'nassbereich', 'boden']),
        mkGroup('Rettungsgeräte', ['rettungsring', 'wurfleine', 'rettungsgerät']),
        mkGroup('Fluchtwege', ['fluchtweg', 'notausgang', 'rettungsweg']),
        mkGroup('Technikstatus', ['technik', 'störung', 'anlage']),
        mkGroup('Beckenkontrolle', ['becken', 'wasserstand', 'sichttiefe'])
      ],
      minKeywordGroups: 4,
      answerGuide: 'Typisch sind Boden-/Rutschkontrolle, Rettungsgeräte, Fluchtwege/Notausgaenge, Technikstatus und Beckencheck.'
    },
    {
      type: 'keyword',
      q: 'Nenne 4 Aspekte, die bei der Dienstplanung im Badebetrieb zwingend berücksichtigt werden müssen.',
      keywordGroups: [
        mkGroup('Qualifikation', ['qualifikation', 'rettungsfähigkeit']),
        mkGroup('Arbeitszeitrecht', ['arbeitszeitgesetz', 'ruhezeit', 'schichtdauer']),
        mkGroup('Besucheraufkommen', ['besucherzahlen', 'stosszeiten', 'auslastung']),
        mkGroup('Urlaub/Abwesenheit', ['urlaub', 'krankheit', 'abwesenheit']),
        mkGroup('Mindestbesetzung', ['mindestbesetzung', 'personalstärke'])
      ],
      minKeywordGroups: 4,
      answerGuide: 'Wichtig sind Qualifikation, gesetzliche Zeiten, Auslastung/Stoßzeiten, Abwesenheiten und Mindestbesetzung.'
    },
    {
      type: 'keyword',
      q: 'Welche 4 Punkte sollten in der Haus- und Badeordnung klar geregelt sein?',
      keywordGroups: [
        mkGroup('Sicherheitsregeln', ['sicherheitsregel', 'sprungverbot', 'verhalten']),
        mkGroup('Hygieneregeln', ['duschen', 'hygiene', 'toiletten']),
        mkGroup('Aufsichtsanweisungen', ['aufsicht', 'anweisung', 'folge leisten']),
        mkGroup('Sanktionen', ['hausverweis', 'ausschluss', 'ordnungsmaßnahme']),
        mkGroup('Nutzungszeiten', ['öffnungszeit', 'nutzungszeit', 'schliesszeit'])
      ],
      minKeywordGroups: 4,
      answerGuide: 'Hausordnung: Sicherheits- und Hygieneregeln, Aufsichtsanweisungen, Nutzungszeiten und Sanktionen.'
    },
    {
      type: 'keyword',
      q: 'Nenne 4 Eintraege, die im Betriebstagebuch regelmäßig dokumentiert werden sollten.',
      keywordGroups: [
        mkGroup('Wasserwerte', ['chlor', 'ph', 'redox']),
        mkGroup('Filterbetrieb', ['filterspülung', 'filter', 'rückspülung']),
        mkGroup('Störungen', ['störung', 'reparatur', 'ausfall']),
        mkGroup('Chemikalien', ['chemikalienverbrauch', 'dosierung', 'nachfuellung']),
        mkGroup('Besonderheiten', ['zwischenfall', 'vorfall', 'abweichung'])
      ],
      minKeywordGroups: 4,
      answerGuide: 'Ins Betriebstagebuch gehören u.a. Wasserwerte, Filtervorgaenge, Störungen, Chemikalien und Besonderheiten.'
    }
  ],
  tech: [
    {
      type: 'keyword',
      q: 'Nenne mindestens 4 Punkte für eine stabile Beckenwasseraufbereitung.',
      keywordGroups: [
        mkGroup('Freies Chlor', ['freies chlor', 'chlor']),
        mkGroup('pH-Wert', ['ph', 'ph wert']),
        mkGroup('Umwälzung', ['umwälzung', 'umwälzpumpe', 'volumenstrom']),
        mkGroup('Filtration', ['filter', 'filtration', 'rückspülung']),
        mkGroup('Dokumentation', ['dokumentation', 'protokoll', 'betriebstagebuch'])
      ],
      minKeywordGroups: 4,
      answerGuide: 'Stabil wird es durch korrekten Chlor- und pH-Bereich, passende Umwälzung, Filtration und saubere Dokumentation.'
    },
    {
      type: 'keyword',
      q: 'Welche 4 Ursachen können zu auffaelligen Wasserwerten führen?',
      keywordGroups: [
        mkGroup('Besucherlast', ['hohe besucherzahl', 'auslastung', 'spitzenlast']),
        mkGroup('Dosierung', ['dosieranlage', 'dosierung', 'chemikalie']),
        mkGroup('Filterproblem', ['filterproblem', 'verblockung', 'rückspülung']),
        mkGroup('Messfehler', ['messfehler', 'kuvette', 'reagenz']),
        mkGroup('Hydraulik', ['umwälzung', 'hydraulik', 'stromung'])
      ],
      minKeywordGroups: 4,
      answerGuide: 'Hauefig: hohe Last, Dosierfehler, Filterprobleme, Messfehler oder hydrau­lische Abweichungen.'
    },
    {
      type: 'keyword',
      q: 'Nenne 4 Punkte, die bei der Rückspülung eines Filters zu beachten sind.',
      keywordGroups: [
        mkGroup('Betriebszustand', ['betrieb stoppen', 'anlage sichern', 'umschalten']),
        mkGroup('Spüldauer', ['spüldauer', 'spülzeit']),
        mkGroup('Spülmenge', ['spülwasser', 'spülmenge', 'spülstrom']),
        mkGroup('Nachspülen', ['nachspülen', 'klarspülen']),
        mkGroup('Dokumentation', ['dokumentation', 'eintrag', 'protokoll'])
      ],
      minKeywordGroups: 4,
      answerGuide: 'Sicherer Ablauf: umschalten/sichern, passende Spülzeit/-menge, Nachspülen und Dokumentation.'
    },
    {
      type: 'keyword',
      q: 'Welche 4 Aufgaben übernimmt der Sorptionsfilter im Aufbereitungssystem?',
      keywordGroups: [
        mkGroup('Ozonabbau', ['ozonabbau', 'ozon']),
        mkGroup('Organik', ['organische stoffe', 'adsorption', 'organik']),
        mkGroup('Nebenprodukte', ['nebenprodukte', 'chloramine', 'reaktionsprodukte']),
        mkGroup('Wasserqualität', ['wasserqualität', 'klarheit', 'geruch']),
        mkGroup('Schutz Nachstufe', ['nachgeschaltete stufe', 'schutz'])
      ],
      minKeywordGroups: 4,
      answerGuide: 'Typisch sind Ozonabbau, Bindung organischer Stoffe/Nebenprodukte und Stabilisierung der Wasserqualität.'
    },
    {
      type: 'keyword',
      q: 'Nenne 4 Kernparameter, die bei der täglichen technischen Betriebskontrolle geprüft werden.',
      keywordGroups: [
        mkGroup('Desinfektion', ['chlor', 'desinfektion']),
        mkGroup('pH', ['ph', 'ph wert']),
        mkGroup('Temperatur', ['temperatur', 'wassertemperatur']),
        mkGroup('Umwälzung', ['umwälzung', 'volumenstrom', 'pumpe']),
        mkGroup('Anlagendruck', ['druck', 'differenzdruck', 'filterdruck'])
      ],
      minKeywordGroups: 4,
      answerGuide: 'Zur täglichen Kontrolle gehören u.a. Chlor, pH, Temperatur, Umwälzung und Druckwerte.'
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
      answerGuide: 'Ablauf: Eigenschutz, sichere Rettung/Bergung, Atmung prüfen, Notruf 112, ggf. HLW.'
    },
    {
      type: 'keyword',
      q: 'Welche 4 Punkte gehören zu einer sicheren Aufsicht am Sprungbereich?',
      keywordGroups: [
        mkGroup('Wassertiefe', ['wassertiefe', 'sprungbereich']),
        mkGroup('Freigabe', ['freigabe', 'einzelsprung', 'abstand']),
        mkGroup('Regelverstoesse', ['regelverstoss', 'eingreifen', 'ansprache']),
        mkGroup('Sichtfeld', ['sichtkontakt', 'sichtfeld']),
        mkGroup('Notfallbereitschaft', ['rettungsgerät', 'notfall'])
      ],
      minKeywordGroups: 4,
      answerGuide: 'Sprungaufsicht braucht Tiefenkontrolle, Freigabesystem/Abstaende, lückenloses Sichtfeld und Notfallbereitschaft.'
    },
    {
      type: 'keyword',
      q: 'Nenne 4 Inhalte einer sauberen Einweisung für Schwimmanfaenger.',
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
      q: 'Welche 4 Punkte sind für einen sicheren Start im Wettkampftraining wichtig?',
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
        mkGroup('Bewusstsein', ['bewusstsein', 'reaktion prüfen']),
        mkGroup('Atmung', ['atmung prüfen', 'atemkontrolle']),
        mkGroup('Notruf', ['notruf', '112']),
        mkGroup('Herzdruckmassage', ['herzdruckmassage', '30', 'kompression']),
        mkGroup('Beatmung/AED', ['beatmung', '2', 'aed', 'defibrillator'])
      ],
      minKeywordGroups: 4,
      answerGuide: 'Schema: Reaktion/Atmung prüfen, Notruf, 30:2-Reanimation und AED frueh einsetzen.'
    },
    {
      type: 'keyword',
      q: 'Welche 4 Punkte sind bei einer stabilen Seitenlage wichtig?',
      keywordGroups: [
        mkGroup('Atmung vorhanden', ['atmung', 'bewusstlos aber atmet']),
        mkGroup('Körperlage', ['seitenlage', 'stabile lage']),
        mkGroup('Atemwege', ['atemwege frei', 'kopf überstrecken']),
        mkGroup('Kontrolle', ['regelmäßig kontrollieren', 'atmung beobachten']),
        mkGroup('Notruf', ['notruf', '112'])
      ],
      minKeywordGroups: 4,
      answerGuide: 'Bei vorhandener Atmung: stabile Seitenlage, Atemwege sichern, Notruf und engmaschige Kontrolle.'
    },
    {
      type: 'keyword',
      q: 'Nenne 4 Sofortmaßnahmen bei stark blutender Wunde.',
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
      q: 'Welche 4 Punkte gehören zu einer sauberen AED-Anwendung?',
      keywordGroups: [
        mkGroup('Gerät einschalten', ['aed einschalten', 'gerät einschalten']),
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
      q: 'Nenne 4 Angaben für einen vernuenftigen Notruf aus dem Bad.',
      keywordGroups: [
        mkGroup('Ort', ['wo', 'einsatzort', 'bad']),
        mkGroup('Was passiert', ['was ist passiert', 'notfallart']),
        mkGroup('Wie viele', ['wie viele verletzte', 'anzahl']),
        mkGroup('Wer meldet', ['wer meldet', 'name', 'rückrufnummer']),
        mkGroup('Warten auf Rückfragen', ['nicht auflegen', 'rückfragen'])
      ],
      minKeywordGroups: 4,
      answerGuide: 'Notruf: Ort, Ereignis, Anzahl Betroffene, Melderdaten und Leitung für Rückfragen offen halten.'
    }
  ],
  hygiene: [
    {
      type: 'keyword',
      q: 'Nenne 4 Maßnahmen, um Kreuzkontamination im Nassbereich zu vermeiden.',
      keywordGroups: [
        mkGroup('Bereichstrennung', ['bereichstrennung', 'getrennte utensilien']),
        mkGroup('Handschuhwechsel', ['handschuhwechsel', 'handschuhe wechseln']),
        mkGroup('Reinigungsreihenfolge', ['sauber nach schmutzig', 'reihenfolge']),
        mkGroup('Händehygiene', ['händehygiene', 'händedesinfektion']),
        mkGroup('Dokumentation', ['dokumentation', 'reinigungsplan'])
      ],
      minKeywordGroups: 4,
      answerGuide: 'Vermeidung gelingt durch Bereichstrennung, Handschuhwechsel, korrekte Reihenfolge, Händehygiene und Dokumentation.'
    },
    {
      type: 'keyword',
      q: 'Welche 4 Punkte gehören zur täglichen Hygienekontrolle im Badbetrieb?',
      keywordGroups: [
        mkGroup('Wasserparameter', ['wasserparameter', 'chlor', 'ph']),
        mkGroup('Sichtkontrolle', ['sichtkontrolle', 'sauberkeit']),
        mkGroup('Reinigungsnachweis', ['reinigungsnachweis', 'plan']),
        mkGroup('Zwischenfallmeldung', ['zwischenfall', 'meldung', 'abweichung']),
        mkGroup('Lueftung/Feuchte', ['lueftung', 'feuchtigkeit'])
      ],
      minKeywordGroups: 4,
      answerGuide: 'Täglich: Parameter, Sicht-/Flächenkontrollen, Reinigungsnachweise, Zwischenfaelle und Raumklima.'
    },
    {
      type: 'keyword',
      q: 'Nenne 4 Schritte bei einem hygienischen Zwischenfall im Becken.',
      keywordGroups: [
        mkGroup('Bereich sichern', ['bereich absperren', 'sichern']),
        mkGroup('Meldekette', ['meldekette', 'info an team']),
        mkGroup('Maßnahmenplan', ['maßnahmenplan', 'desinfektion', 'wasserwechsel']),
        mkGroup('Dokumentation', ['dokumentation', 'protokoll']),
        mkGroup('Freigabe', ['freigabe', 'wiedereröffnung'])
      ],
      minKeywordGroups: 4,
      answerGuide: 'Ablauf: absichern, intern melden, nach Plan handeln, dokumentieren und erst nach Freigabe oeffnen.'
    },
    {
      type: 'keyword',
      q: 'Welche 4 Punkte sind für eine wirksame Flächendesinfektion entscheidend?',
      keywordGroups: [
        mkGroup('Vorreinigung', ['vorreinigung', 'schmutz entfernen']),
        mkGroup('Konzentration', ['konzentration', 'dosierung']),
        mkGroup('Einwirkzeit', ['einwirkzeit']),
        mkGroup('Vollständige Benetzung', ['benetzung', 'fläche vollständig']),
        mkGroup('Materialvertraeglichkeit', ['materialvertraeglichkeit'])
      ],
      minKeywordGroups: 4,
      answerGuide: 'Wirksam nur mit Vorreinigung, richtiger Konzentration, Einwirkzeit und vollständiger Benetzung.'
    },
    {
      type: 'keyword',
      q: 'Nenne 4 Gästehinweise, die aus hygienischer Sicht im Bad wichtig sind.',
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
      answerGuide: 'Zu den Wahlgrundsaetzen zählen allgemein, frei, gleich, geheim und unmittelbar.'
    },
    {
      type: 'keyword',
      q: 'Welche 4 Aufgaben hat der Bundestag?',
      keywordGroups: [
        mkGroup('Gesetzgebung', ['gesetze', 'gesetzgebung']),
        mkGroup('Kanzlerwahl', ['kanzler wählen', 'bundeskanzler']),
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
        mkGroup('Tätigkeit', ['tätigkeit', 'aufgaben']),
        mkGroup('Arbeitszeit', ['arbeitszeit']),
        mkGroup('Verguetung', ['lohn', 'gehalt', 'verguetung']),
        mkGroup('Urlaub', ['urlaub']),
        mkGroup('Kuendigung', ['kuendigung', 'frist'])
      ],
      minKeywordGroups: 4,
      answerGuide: 'Sinnvoll geregelt sind Tätigkeit, Arbeitszeit, Verguetung, Urlaub und Kuendigungsfristen.'
    },
    {
      type: 'keyword',
      q: 'Welche 4 Versicherungen gehören zur gesetzlichen Sozialversicherung?',
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
      q: 'Nenne 4 Bereiche, die zum betrieblichen Umweltschutz im Schwimmbad gehören.',
      keywordGroups: [
        mkGroup('Energie', ['energie', 'wärmerueckgewinnung', 'led']),
        mkGroup('Wasser', ['wasser', 'wasser sparen', 'regenwasser', 'umwälzung', 'wassermanagement']),
        mkGroup('Abfall', ['abfall', 'trennung', 'entsorgung']),
        mkGroup('Chemikalien', ['chemikalien', 'dosierung', 'sichere lagerung']),
        mkGroup('Dokumentation', ['dokumentation', 'nachweis'])
      ],
      minKeywordGroups: 4,
      answerGuide: 'Umweltschutz umfasst Energie, Wasser, Abfall, Chemikalienmanagement und Nachweise.'
    },
    {
      type: 'keyword',
      q: 'Welche 4 Aufgaben hat der Bundesrat?',
      keywordGroups: [
        mkGroup('Länder vertreten', ['laender vertreten', 'laenderinteressen', 'bundeslaender']),
        mkGroup('Gesetzgebung', ['gesetzgebung', 'gesetze mitwirken', 'mitwirkung']),
        mkGroup('Verfassungsänderungen', ['verfassungsänderung', 'grundgesetzänderung']),
        mkGroup('Zustimmungsgesetze', ['zustimmungsgesetz', 'zustimmen']),
        mkGroup('Vermittlung', ['vermittlungsausschuss', 'vermitteln'])
      ],
      minKeywordGroups: 4,
      answerGuide: 'Der Bundesrat vertritt die Länder, wirkt an Gesetzen mit, stimmt bei bestimmten Gesetzen und Verfassungsänderungen zu und wirkt in Vermittlungsverfahren mit.'
    },
    {
      type: 'keyword',
      q: 'Nenne 4 Merkmale der sozialen Marktwirtschaft.',
      keywordGroups: [
        mkGroup('Freier Markt', ['freier markt', 'marktwirtschaft', 'wettbewerb']),
        mkGroup('Sozialer Ausgleich', ['sozialer ausgleich', 'soziale sicherung']),
        mkGroup('Staatlicher Rahmen', ['staatlicher rahmen', 'ordnungsrahmen', 'staat']),
        mkGroup('Eigentum/Freiheit', ['privateigentum', 'wirtschaftsfreiheit', 'freiheit']),
        mkGroup('Schutz vor Missbrauch', ['kartellrecht', 'missbrauch', 'aufsicht'])
      ],
      minKeywordGroups: 4,
      answerGuide: 'Soziale Marktwirtschaft verbindet freien Wettbewerb mit staatlichem Ordnungsrahmen und sozialem Ausgleich.'
    },
    {
      type: 'keyword',
      q: 'Welche 4 Punkte sollte eine Lohnabrechnung nachvollziehbar zeigen?',
      keywordGroups: [
        mkGroup('Bruttolohn', ['bruttolohn', 'brutto']),
        mkGroup('Abzuege', ['abzuege', 'steuer', 'sozialbeitraege']),
        mkGroup('Nettolohn', ['nettolohn', 'netto', 'auszahlungsbetrag']),
        mkGroup('Zeitraum', ['abrechnungszeitraum', 'monat', 'zeitraum']),
        mkGroup('Personaldaten', ['name', 'steuerklasse', 'sozialversicherungsnummer'])
      ],
      minKeywordGroups: 4,
      answerGuide: 'Eine Lohnabrechnung sollte Brutto, Abzuege, Netto, Zeitraum und grundlegende Personaldaten klar ausweisen.'
    },
    {
      type: 'keyword',
      q: 'Nenne 4 Rechte oder Aufgaben eines Betriebsrats.',
      keywordGroups: [
        mkGroup('Interessenvertretung', ['interessen vertreten', 'interessenvertretung']),
        mkGroup('Mitbestimmung', ['mitbestimmung', 'mitwirken']),
        mkGroup('Arbeitsbedingungen', ['arbeitsbedingungen', 'arbeitsschutz']),
        mkGroup('Anhoerung', ['anhoerung', 'kuendigung anhoeren']),
        mkGroup('Vermittlung', ['vermitteln', 'konflikte'])
      ],
      minKeywordGroups: 4,
      answerGuide: 'Der Betriebsrat vertritt Beschaeftigteninteressen, wirkt mit, achtet auf Arbeitsbedingungen und wird bei personellen Maßnahmen beteiligt.'
    },
    {
      type: 'keyword',
      q: 'Welche 4 Punkte gehören zur Tarifautonomie?',
      keywordGroups: [
        mkGroup('Gewerkschaften', ['gewerkschaft', 'gewerkschaften']),
        mkGroup('Arbeitgeberseite', ['arbeitgeberverband', 'arbeitgeberseite', 'arbeitgeber']),
        mkGroup('Tarifvertrag', ['tarifvertrag', 'tarif']),
        mkGroup('Ohne Staat aushandeln', ['ohne staat', 'eigenständig aushandeln', 'selbst aushandeln']),
        mkGroup('Arbeitsbedingungen', ['arbeitsbedingungen', 'lohn', 'arbeitszeit'])
      ],
      minKeywordGroups: 4,
      answerGuide: 'Tarifautonomie bedeutet, dass Gewerkschaften und Arbeitgeber Arbeitsbedingungen eigenständig in Tarifvertraegen aushandeln.'
    },
    {
      type: 'keyword',
      q: 'Nenne 4 Begriffe, die zu Brutto- und Nettolohn gehören.',
      keywordGroups: [
        mkGroup('Brutto', ['brutto', 'bruttolohn']),
        mkGroup('Netto', ['netto', 'nettolohn']),
        mkGroup('Steuern', ['steuer', 'lohnsteuer']),
        mkGroup('Sozialbeitraege', ['sozialbeitraege', 'versicherung']),
        mkGroup('Auszahlung', ['auszahlung', 'auszahlungsbetrag'])
      ],
      minKeywordGroups: 4,
      answerGuide: 'Zum Unterschied zwischen Brutto und Netto gehören Bruttolohn, Abzuege wie Steuern und Sozialbeitraege sowie der Auszahlungsbetrag.'
    },
    {
      type: 'keyword',
      q: 'Welche 4 Punkte sind bei einer Kuendigung im Arbeitsverhältnis wichtig?',
      keywordGroups: [
        mkGroup('Schriftform', ['schriftform', 'schriftlich']),
        mkGroup('Frist', ['frist', 'kuendigungsfrist']),
        mkGroup('Probezeit', ['probezeit']),
        mkGroup('Grund', ['grund', 'wichtiger grund']),
        mkGroup('Zugang', ['zugang', 'zugegangen'])
      ],
      minKeywordGroups: 4,
      answerGuide: 'Wichtig sind Schriftform, Fristen, Besonderheiten in der Probezeit, ein möglicher Grund und der nachweisbare Zugang.'
    },
    {
      type: 'keyword',
      q: 'Nenne 4 Elemente, die zu einem funktionierenden Sozialstaat gehören.',
      keywordGroups: [
        mkGroup('Krankenversicherung', ['krankenversicherung']),
        mkGroup('Rentenversicherung', ['rentenversicherung']),
        mkGroup('Arbeitslosenversicherung', ['arbeitslosenversicherung']),
        mkGroup('Pflegeversicherung', ['pflegeversicherung']),
        mkGroup('Unterstützung', ['unterstützung', 'sozialhilfe', 'absicherung'])
      ],
      minKeywordGroups: 4,
      answerGuide: 'Ein Sozialstaat sichert Menschen über Versicherungen und Unterstützungssysteme gegen zentrale Lebensrisiken ab.'
    },
    {
      type: 'keyword',
      q: 'Welche 4 Punkte sind für eine demokratische Gewaltenteilung wichtig?',
      keywordGroups: [
        mkGroup('Legislative', ['legislative', 'gesetzgebung']),
        mkGroup('Exekutive', ['exekutive', 'regierung', 'verwaltung']),
        mkGroup('Judikative', ['judikative', 'gerichte', 'rechtsprechung']),
        mkGroup('Kontrolle', ['kontrolle', 'macht begrenzen']),
        mkGroup('Unabhängigkeit', ['unabhängigkeit', 'getrennt'])
      ],
      minKeywordGroups: 4,
      answerGuide: 'Gewaltenteilung trennt Gesetzgebung, Regierung und Rechtsprechung und begrenzt Macht durch gegenseitige Kontrolle.'
    }
  ],
  math: [
    {
      type: 'keyword',
      q: 'Nenne 4 Rechenschritte, um einen Dreisatz mit Eintrittspreisen sicher zu lösen.',
      keywordGroups: [
        mkGroup('Grundwert notieren', ['grundwert', 'ausgangswert', 'gegeben']),
        mkGroup('Einheitswert bilden', ['einheitswert', 'pro stück', 'durch teilen']),
        mkGroup('Hochrechnen', ['hochrechnen', 'multiplizieren', 'zielmenge']),
        mkGroup('Einheit prüfen', ['einheit', 'euro', 'kontrolle']),
        mkGroup('Plausibilitaet', ['plausibel', 'schätzen', 'gegenprobe'])
      ],
      minKeywordGroups: 4,
      answerGuide: 'Dreisatz: Ausgangsdaten notieren, Einheitswert berechnen, auf Zielmenge hochrechnen und Einheit/Plausibilitaet prüfen.'
    },
    {
      type: 'keyword',
      q: 'Welche 4 Größen brauchst du für die Berechnung eines rechteckigen Beckenvolumens?',
      keywordGroups: [
        mkGroup('Länge', ['länge']),
        mkGroup('Breite', ['breite']),
        mkGroup('Tiefe', ['tiefe']),
        mkGroup('Formel', ['volumen', 'länge mal breite mal tiefe', 'l*b*t']),
        mkGroup('Einheit', ['kubikmeter', 'm3'])
      ],
      minKeywordGroups: 4,
      answerGuide: 'Für Rechteckbecken: Länge, Breite, Tiefe und die Formel V = L * B * T (Ergebnis in m3).'
    },
    {
      type: 'keyword',
      q: 'Nenne 4 typische Kopfrechenstrategien, die im Badebetrieb helfen.',
      keywordGroups: [
        mkGroup('Runden', ['runden', 'überschlag']),
        mkGroup('Aufteilen', ['aufteilen', 'zerlegen']),
        mkGroup('Prozent', ['prozent', '10 prozent', '1 prozent']),
        mkGroup('Einmaleins', ['einmaleins', 'multiplikation']),
        mkGroup('Probe', ['gegenprobe', 'kontrolle', 'rückrechnung'])
      ],
      minKeywordGroups: 4,
      answerGuide: 'Hilfreich sind Überschlag/Runden, Zerlegen, Prozent-Ankerwerte, sicheres Einmaleins und Gegenprobe.'
    },
    {
      type: 'keyword',
      q: 'Welche 4 Schritte sind sinnvoll, wenn du eine Formel nach einer gesuchten Größe umstellst?',
      keywordGroups: [
        mkGroup('Gesuchte markieren', ['gesuchte', 'variable markieren', 'x']),
        mkGroup('Gleiche Operationen', ['beide seiten', 'gleichung', 'operation']),
        mkGroup('Freistellen', ['freistellen', 'isolieren']),
        mkGroup('Einsetzen', ['einsetzen', 'werte einsetzen']),
        mkGroup('Ergebnis prüfen', ['probe', 'einheit', 'kontrollrechnung'])
      ],
      minKeywordGroups: 4,
      answerGuide: 'Gesuchte Größe markieren, mit gleichen Operationen freistellen, Werte einsetzen und per Probe/Einheit kontrollieren.'
    },
    {
      type: 'keyword',
      q: 'Nenne 4 Rechenthemen aus der Ausbildung, die du im Badalltag direkt brauchst.',
      keywordGroups: [
        mkGroup('Dreisatz', ['dreisatz', 'verhältnisrechnung']),
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
      q: 'Nenne 4 mögliche Anzeichen einer akuten Kreislaufproblematik bei Badegaesten.',
      keywordGroups: [
        mkGroup('Schwindel', ['schwindel']),
        mkGroup('Blaesse/kalter Schweiss', ['blaesse', 'kalter schweiss']),
        mkGroup('Uebelkeit', ['uebelkeit', 'erbrechen']),
        mkGroup('Bewusstsein', ['benommen', 'bewusstlos']),
        mkGroup('Puls/Atmung', ['puls', 'atmung'])
      ],
      minKeywordGroups: 4,
      answerGuide: 'Typisch sind Schwindel, Blaesse/kalter Schweiss, Uebelkeit, Bewusstseinseintrübung sowie Puls-/Atmungsauffaelligkeiten.'
    },
    {
      type: 'keyword',
      q: 'Welche 4 Maßnahmen helfen bei der Vorbeugung von Hitzebelastung im Sommerbetrieb?',
      keywordGroups: [
        mkGroup('Trinken', ['trinken', 'flüssigkeit']),
        mkGroup('Sonnenschutz', ['sonnenschutz', 'schatten', 'kopfbedeckung']),
        mkGroup('Pausen', ['pausen', 'abkuehlung']),
        mkGroup('Arbeitsorganisation', ['arbeitsorganisation', 'schichtplanung']),
        mkGroup('Frühwarnzeichen', ['warnzeichen', 'hitzesymptome'])
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
      answerGuide: 'Ruhig lagern/sitzen, Notfallspray unterstützen, Atmung beobachten, ggf. 112 und Person betreuen.'
    },
    {
      type: 'keyword',
      q: 'Welche 4 Faktoren sind für gesundes Rückentraining im Wasser wichtig?',
      keywordGroups: [
        mkGroup('Technik', ['technik', 'körperhaltung']),
        mkGroup('Belastungssteuerung', ['belastung', 'intensitaet']),
        mkGroup('Regelmäßigkeit', ['regelmäßig', 'kontinuitaet']),
        mkGroup('Aufwärmen', ['aufwärmen', 'mobilisation']),
        mkGroup('Schmerzbeachtung', ['schmerz', 'überlastung'])
      ],
      minKeywordGroups: 4,
      answerGuide: 'Rückentraining profitiert von sauberer Technik, dosierter Belastung, Regelmäßigkeit, Aufwärmen und Schmerzbeachtung.'
    },
    {
      type: 'keyword',
      q: 'Nenne 4 Punkte für einen verantwortungsvollen Umgang mit gesundheitlich eingeschraenkten Badegaesten.',
      keywordGroups: [
        mkGroup('Kommunikation', ['kommunikation', 'absprechen']),
        mkGroup('Aufsicht anpassen', ['aufsicht anpassen', 'individuell']),
        mkGroup('Hilfsmittel', ['hilfsmittel', 'unterstützung']),
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
