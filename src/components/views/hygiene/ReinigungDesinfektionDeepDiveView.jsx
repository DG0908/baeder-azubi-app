import { useState } from 'react';
import { useApp } from '../../../context/AppContext';

const TABS = {
  grundlagen: {
    id: 'grundlagen',
    chip: 'Grundlagen',
    title: 'Reinigung und Desinfektion — was ist der Unterschied?',
    intro:
      'Viele verwechseln Reinigung und Desinfektion. Reinigung entfernt sichtbaren Schmutz, Fett und organische Rückstände — aber tötet keine Keime. Desinfektion reduziert Krankheitserreger auf ein ungefährliches Maß — aber entfernt keinen Schmutz. Im Schwimmbad brauchen wir beides: zuerst reinigen, dann desinfizieren. Denn auf schmutzigen Flächen wirkt ein Desinfektionsmittel nicht richtig!',
    motto: 'Erst reinigen, dann desinfizieren — nie beides gleichzeitig weglassen.',
    rules: [
      'Reinigung = Entfernung von sichtbarem Schmutz, Biofilm und Rückständen. Tötet keine Keime.',
      'Desinfektion = Abtötung oder Inaktivierung von Krankheitserregern auf ein sicheres Maß. Entfernt keinen Schmutz.',
      'Reihenfolge: IMMER erst reinigen, dann desinfizieren. Schmutz blockiert die Wirkung von Desinfektionsmitteln.',
      'Einwirkzeit ist entscheidend: Desinfektionsmittel braucht Zeit. Zu früh abwischen = keine Wirkung.',
      'Vorbenetzung: Flächen immer zuerst mit Wasser anfeuchten — Tenside wirken sonst nur punktuell.',
      'Reinigungsplan und Hygieneplan müssen schriftlich vorliegen und eingehalten werden.',
    ],
    steps: [
      {
        title: '0. Vorbenetzung — der oft vergessene erste Schritt',
        text: 'Vor dem Reinigungsmittel kommt immer das Wasser. Trockene Flächen lassen das Mittel abperlen — die waschaktiven Substanzen (Tenside) können sich nicht gleichmäßig verteilen. Mit feuchtem Mop oder Sprühflasche vorbefeuchten, dann erst Reiniger auftragen. Spart Mittel und verbessert die Wirkung deutlich.',
      },
      {
        title: '1. Reinigung: Was und womit?',
        text: 'Reinigung löst Schmutz, Kalk, Fett, Hautschuppen und Biofilm. Mittel: Allzweckreiniger, alkalische Reiniger (gegen Fett), saure Reiniger (gegen Kalk). Mechanische Unterstützung durch Schrubben, Wischen oder Hochdruckreiniger. Ohne mechanischen Effekt wirken auch gute Mittel oft schlecht.'
      },
      {
        title: '2. Desinfektion: Wie und wie lange?',
        text: 'Nach der Reinigung: Desinfektionsmittel aufbringen und die vorgeschriebene Einwirkzeit einhalten. Einwirkzeiten stehen auf dem Produkt und im Hygieneplan (z.B. 5 Minuten, 15 Minuten). Dann abwischen oder trocknen lassen. Flächendesis werden unverdünnt oder nach Vorschrift verdünnt aufgetragen.'
      },
      {
        title: '3. Typische Bereiche im Schwimmbad',
        text: 'Beckenumgang: Täglich reinigen, rutschhemmend halten. Umkleiden und Duschen: Täglich reinigen, regelmäßig desinfizieren. Toiletten: Mehrmals täglich reinigen und desinfizieren. Rettungsgeräte: Regelmäßig reinigen, bei Benutzung sofort aufbereiten. Handläufe und Türen: Täglich wischen.'
      },
      {
        title: '4. Der Hygieneplan',
        text: 'Der Hygieneplan regelt: Was wird gereinigt/desinfiziert? Womit (Produkt, Konzentration)? Wann und wie oft? Von wem? Mit welcher Einwirkzeit? Der Plan muss schriftlich vorliegen, allen Mitarbeitern bekannt sein und eingehalten werden. Abweichungen müssen dokumentiert werden.'
      }
    ],
    examples: [
      {
        title: 'Duschbereiche nach Betrieb',
        given: 'Nach Betriebsschluss sollen die Duschen gereinigt und desinfiziert werden.',
        question: 'In welcher Reihenfolge und mit welchen Mitteln?',
        steps: [
          ['Schritt 1', 'Groben Schmutz entfernen, Abfluss reinigen'],
          ['Schritt 2', 'Reiniger auftragen, einwirken lassen, schrubben, abspülen'],
          ['Schritt 3', 'Flächendesinfektionsmittel aufbringen — Einwirkzeit einhalten (lt. Plan)'],
          ['Schritt 4', 'Flächen trocknen lassen oder abwischen, Ergebnis dokumentieren']
        ]
      },
      {
        title: 'Rettungsring nach Einsatz',
        given: 'Ein Rettungsring wurde bei einem Notfall benutzt. Was muss jetzt passieren?',
        question: 'Wie wird der Rettungsring aufbereitet?',
        steps: [
          ['Sofort', 'Ring aus dem Verkehr nehmen, reinigen und desinfizieren'],
          ['Reinigung', 'Mit Reiniger und Bürste Verunreinigungen entfernen'],
          ['Desinfektion', 'Mit geeignetem Desinfektionsmittel behandeln, Einwirkzeit abwarten'],
          ['Zurück', 'Ring erst nach vollständiger Aufbereitung wieder einsatzbereit hängen']
        ]
      }
    ],
    pitfalls: [
      'Desinfizieren OHNE vorherige Reinigung ist wirkungslos — Schmutz blockiert den Wirkstoff.',
      'Einwirkzeit ignorieren ist ein häufiger Fehler — zu früh abgewischt = keine Desinfektionswirkung.',
      'Reinigungsmittel und Desinfektionsmittel dürfen NICHT einfach gemischt werden — oft entstehen gefährliche Reaktionen.',
      'Abgenutzte Wischmoppe und Lappen übertragen Keime statt sie zu entfernen — regelmäßig wechseln!'
    ],
    quiz: {
      question: 'Warum muss vor der Desinfektion immer zuerst gereinigt werden?',
      options: [
        'Weil das so im Hygieneplan steht und man sich daran halten muss',
        'Weil Schmutz und organische Rückstände die Wirkung des Desinfektionsmittels blockieren',
        'Weil Desinfektionsmittel teuer ist und man es nicht verschwenden soll'
      ],
      correctIndex: 1,
      explanation: 'Schmutz und organische Substanzen "verbrauchen" das Desinfektionsmittel, bevor es auf Keime wirken kann. Desinfektion auf schmutzigen Flächen ist deshalb wirkungslos oder stark abgeschwächt. Richtige Reihenfolge: reinigen → desinfizieren.'
    }
  },

  mittel: {
    id: 'mittel',
    chip: 'Reinigungsmittel',
    title: 'Welche Mittel gibt es und wann nutze ich was?',
    intro:
      'Nicht jedes Reinigungsmittel passt zu jeder Fläche oder jedem Schmutz. Alkalische Reiniger lösen Fett und Eiweiß. Saure Reiniger lösen Kalk und Urinstein. Neutrale Reiniger sind für allgemeine Reinigung. Desinfektionsmittel gibt es auf Basis von Alkohol, Chlor oder Quats. Das richtige Mittel in der richtigen Konzentration spart Zeit, schont Flächen und ist sicher für Mitarbeiter und Gäste.',
    motto: 'Falsches Mittel kann mehr schaden als nützen — kenne deine Produkte.',
    rules: [
      'Alkalische Reiniger (pH > 8): Lösen Fett, Eiweiß, Hautschuppen. Gut für Umkleiden, Duschen, Beckenrand.',
      'Saure Reiniger (pH < 6): Lösen Kalk, Rost, Urinstein. Gut für Fliesen, Armaturen, WC.',
      'Neutrale Reiniger (pH 6-8): Schonendes Allgemeinreinigen. Für Böden, Glasflächen, empfindliche Oberflächen.',
      'Desinfektionsmittel: Immer nach Hersteller-Angabe verdünnen und Einwirkzeit einhalten.',
      'Konzentration einhalten: Zu wenig = keine Wirkung, zu viel = Schäden an Flächen und Gesundheitsrisiko.'
    ],
    steps: [
      {
        title: '1. Alkalische Reiniger',
        text: 'Wirken durch hohen pH-Wert — "verseifern" Fette und lösen Eiweißverbindungen. Anwendung: Duschbereiche, Umkleiden, Beckenumgang. Achtung: Nicht für Aluminium und empfindliche Metalle — sie greifen die Oberfläche an. Bei hoher Konzentration PSA (Handschuhe, Brille) tragen.'
      },
      {
        title: '2. Saure Reiniger',
        text: 'Wirken durch niedrigen pH-Wert — lösen Kalk, Rost, Urinstein und Wassersteinablagerungen. Anwendung: WC-Keramik, verkalkte Fliesen, Armaturen. Achtung: NICHT auf Marmor oder Naturstein — löst den Stein auf! Nie zusammen mit Chlorreinigern verwenden — es entsteht Chlorgas!'
      },
      {
        title: '3. Desinfektionsmittel richtig anwenden',
        text: 'Es gibt drei Hauptgruppen: Alkohol (schnell, für Hände und Flächen), Chlor (z.B. Natriumhypochlorit, breitwirkend, für Sanitärbereiche), Quats (quartäre Ammoniumverbindungen, für Flächen). Wichtig: Immer laut Herstellerangabe verdünnen, Einwirkzeit einhalten, Belüftung sicherstellen.'
      },
      {
        title: '4. Dosierung und Verdünnung',
        text: 'Zu konzentriert = Schäden an Flächen, Reizungen bei Mitarbeitern und Gästen, teure Verschwendung. Zu verdünnt = keine ausreichende Wirkung, Keime überleben. Dosiergeräte nutzen wenn vorhanden. Verdünnung immer nachmessen — nicht schatzen!'
      }
    ],
    examples: [
      {
        title: 'Hartnäckige Kalkflecken in der Dusche',
        given: 'In der Dusche sind weisse Kalkablagerungen auf den Fliesen, die sich mit normalem Reiniger nicht entfernen lassen.',
        question: 'Welches Mittel ist richtig und was muss beachtet werden?',
        steps: [
          ['Mittel', 'Saurer Reiniger (Kalklöser) — löst Kalkablagerungen chemisch'],
          ['Einwirkzeit', 'Mittel auftragen, einige Minuten einwirken lassen, dann schrubben'],
          ['Achtung', 'Nicht auf Naturstein oder Metall verwenden — Fläche vorher prüfen'],
          ['PSA', 'Schutzhandschuhe und Augenschutz tragen — saure Reiniger reizen Haut']
        ]
      },
      {
        title: 'Desinfektion nach Magenvirus-Fall',
        given: 'Ein Besucher hatte einen Durchfall-Unfall im Umkleidebereich. Wie wird desinfiziert?',
        question: 'Welches Desinfektionsmittel ist geeignet und warum?',
        steps: [
          ['Erreger', 'Magen-Darm-Viren (z.B. Noroviren) erfordern viruzide Desinfektionsmittel'],
          ['Mittel', 'Chlorhaltiges Desinfektionsmittel oder VAH-gelistetes viruzides Präparat (Wirkbereich „begrenzt viruzid PLUS" oder „viruzid")'],
          ['Einwirkzeit', 'Mindestens 15 Minuten, oft länger — laut Hersteller und VAH-Liste'],
          ['Schutz', 'Einweghandschuhe, Schürze, ggf. Mundschutz — danach Hände desinfizieren']
        ]
      }
    ],
    pitfalls: [
      'Saure und chlorhaltige Reiniger NIEMALS mischen — es entsteht giftiges Chlorgas!',
      'Desinfektionsmittel auf nicht gereinigten Flächen = Geldverschwendung und keine Wirkung.',
      'Eigenhändige Verdünnung "nach Gefühl" ist gefährlich — immer mit Messbecher dosieren.',
      'Abgelaufene Desinfektionsmittel verlieren ihre Wirksamkeit — immer Verfallsdatum prüfen!'
    ],
    quiz: {
      question: 'Welcher Reiniger ist geeignet um Kalkablagerungen auf Fliesen zu entfernen?',
      options: [
        'Alkalischer Reiniger — er löst alles',
        'Saurer Reiniger — er löst Kalkablagerungen durch den niedrigen pH-Wert',
        'Neutralreiniger — er ist am schonendsten'
      ],
      correctIndex: 1,
      explanation: 'Saure Reiniger (pH < 6) lösen Kalk chemisch auf, weil Kalziumkarbonat in saurem Milieu reagiert und sich auflöst. Alkalische und neutrale Reiniger haben keinen Effekt auf Kalk.'
    }
  },

  tenside: {
    id: 'tenside',
    chip: 'Tenside & Benetzung',
    title: 'Warum erst benetzen? — Tenside und waschaktive Substanzen',
    intro: 'Bevor du ein Reinigungsmittel aufträgst, solltest du die Fläche immer erst mit Wasser vorbefeuchten (Vorbenetzung). Der Grund liegt in der Chemie: Schmutz auf trockenen Flächen wird vom Reinigungsmittel kaum gelöst, weil sich der Wirkstoff nicht gleichmäßig verteilen kann. Tenside — die waschaktiven Substanzen im Reinigungsmittel — brauchen Wasser als "Träger", um ihren Reinigungseffekt voll zu entfalten.',
    motto: 'Trockene Fläche + Reinigungsmittel = halbe Wirkung. Feuchte Fläche + Reinigungsmittel = volle Wirkung.',
    rules: [
      'Vorbenetzung: Fläche vor dem Reinigungsmittel immer leicht anfeuchten — das senkt die Oberflächenspannung und lässt den Wirkstoff tiefer einziehen.',
      'Tenside = "Tensidum" (lat.: spannen) — sie setzen die Oberflächenspannung des Wassers herab und ermöglichen so das Benetzen von Flächen.',
      'Jedes Tensidmolekül hat einen wasserliebenden (hydrophilen) Kopf und einen fettliebenden (lipophilen) Schwanz.',
      'Der lipophile Schwanz greift Fett und Schmutz an, der hydrophile Kopf hält ihn im Wasser — so wird Schmutz "herausgezogen" und weggespült.',
      'Tenside gibt es in vier Typen: anionisch, kationisch, nichtionisch und amphoter — je nach Einsatzzweck.',
    ],
    steps: [
      {
        title: '1. Vorbenetzung — das Warum',
        text: 'Wasser hat eine hohe Oberflächenspannung: Es "perlt" auf trockenen Flächen ab, statt sich zu verteilen. Schmutz und Biofilm auf Fliesen, Beckenrand oder Duschen haben oft fettartige Anteile, die Wasser abstoßen (hydrophob). Wenn du die Fläche zuerst mit Wasser befeuchtest, legst du eine dünne Schicht, in die das Reinigungsmittel gleichmäßig einziehen kann. Ohne Vorbenetzung bleibt das Mittel in Tropfen liegen — es wirkt nur dort, wo es direkt aufliegt.',
      },
      {
        title: '2. Was sind Tenside?',
        text: 'Tenside sind waschaktive Substanzen — der eigentliche Wirkstoff in Reinigungsmitteln. Der Name kommt von "Tensio" (lat. = Spannung): Sie senken die Grenzflächenspannung zwischen Wasser und Schmutz/Fett. Ein Tensidmolekül besteht aus zwei Teilen: einem hydrophilen (wasserliebenden) Kopf und einem lipophilen (fettliebenden) Schwanz. In der Reinigung ist genau diese Zweiteiligkeit entscheidend.',
      },
      {
        title: '3. Wie wirken Tenside? — Das Mizellen-Prinzip',
        text: 'Wenn Tenside ins Wasser kommen, lagern sich viele Tensidmoleküle zusammen: Die fettliebenden Schwänze zeigen nach innen (zum Schmutz), die wasserliebenden Köpfe nach außen (zum Wasser). Diese Kugeln heißen Mizellen. Die Mizelle "umhüllt" das Fett- oder Schmutzpartikel und zieht es aus der Fläche heraus — beim Abwischen oder Abspülen werden die Mizellen mit dem Schmutz weggespült.',
      },
      {
        title: '4. Typen von Tensiden',
        text: 'Anionische Tenside (negativ geladen): Sehr gute Schaum- und Reinigungswirkung. In den meisten Allzwein- und Badreinigern. Beispiel: Natriumlaurylsulfat (SDS). — Kationische Tenside (positiv geladen): Biozide Wirkung — töten Bakterien ab. Deshalb in Desinfektionsmitteln (Quats). Dürfen NICHT mit anionischen Tensiden gemischt werden! — Nichtionische Tenside (neutral): Schaumarm, gut verträglich, für empfindliche Flächen und Maschinenreiniger. — Amphotere Tenside: Wechseln je nach pH-Wert zwischen positiv und negativ. Gut hautverträglich — in Hand- und Körperreinigern.',
      },
    ],
    examples: [
      {
        title: 'Beckenrand mit Biofilm',
        given: 'Der Beckenrand ist mit einem glitschigen Biofilm (Algen, Hautschuppen, Fett) bedeckt. Du willst ihn reinigen.',
        question: 'Warum erst benetzen, welches Mittel und welcher Schritt-für-Schritt-Ablauf?',
        steps: [
          ['Vorbenetzung', 'Fläche mit Wasser anfeuchten — Biofilm quillt auf, Oberfläche wird zugänglich'],
          ['Mittel', 'Alkalischer Reiniger (Tenside + hoher pH) — löst Fett, Eiweiß und Biofilm'],
          ['Einwirkzeit', '2–5 Min. einwirken lassen — Tenside bilden Mizellen um Schmutzpartikel'],
          ['Schrubben', 'Mechanische Wirkung bricht den Biofilm auf — Tenside spülen ihn weg'],
          ['Abspülen', 'Gründlich mit Wasser nachspülen — Mizellen mit Schmutz weggespült'],
        ],
      },
      {
        title: 'Trockene Kachelwand in der Umkleide',
        given: 'Eine trockene Kachelwand hat Fettfinger und Schmutzflecken. Du sprühst direkt Reiniger drauf.',
        question: 'Was passiert und was wäre besser gewesen?',
        steps: [
          ['Problem', 'Auf trockener Fläche perlt das Mittel ab — Tenside verteilen sich ungleichmäßig'],
          ['Folge', 'Schmutz wird nur an den direkten Auftreffpunkten gelöst, nicht flächig'],
          ['Richtig', 'Zuerst Fläche mit Wasser leicht anfeuchten — dann Reiniger auftragen'],
          ['Ergebnis', 'Tenside verteilen sich gleichmäßig, bilden Mizellen und lösen den Schmutz vollständig'],
        ],
      },
    ],
    pitfalls: [
      'Direkt auf trockene Flächen reinigen halbiert die Wirkung — immer erst vorbefeuchten!',
      'Anionische und kationische Tenside neutralisieren sich gegenseitig — Reiniger und Desinfektionsmittel nie direkt mischen.',
      'Zu viel Tensid = zu viel Schaum = schwer abzuspülen und Rückstände auf der Fläche.',
      'Ohne mechanische Arbeit (Schrubben, Wischen) lösen Tenside den Schmutz zwar, tragen ihn aber nicht ab — Abspülen nicht vergessen!',
    ],
    quiz: {
      question: 'Was ist der Hauptgrund für die Vorbenetzung einer Fläche vor dem Reinigen?',
      options: [
        'Damit das Reinigungsmittel nicht so schnell trocknet',
        'Die Oberflächenspannung wird gesenkt, so dass sich das Reinigungsmittel gleichmäßig verteilt und die Tenside optimal wirken können',
        'Wasser allein reicht schon — das Reinigungsmittel ist dann nur zur Sicherheit',
      ],
      correctIndex: 1,
      explanation: 'Wasser senkt die Oberflächenspannung und macht die Fläche für Tenside zugänglich. Die Tensidmoleküle können sich dann gleichmäßig verteilen, Mizellen um Schmutzpartikel bilden und diese beim Abspülen mitnehmen. Auf trockenen Flächen perlt das Mittel ab und wirkt nur punktuell.',
    },
  },

  ghs: { id: 'ghs', chip: 'GHS-Zeichen' },

  hygieneplan: {
    id: 'hygieneplan',
    chip: 'Hygieneplan',
    title: 'Der Hygieneplan — Pflicht und Praxis',
    intro:
      'Ein Hygieneplan ist keine Empfehlung — er ist Pflicht. Er regelt verbindlich für alle Mitarbeiter, was wann wie oft und womit gereinigt und desinfiziert wird. Im Schwimmbad ist er besonders wichtig, weil viele Menschen auf engem Raum zusammenkommen und Krankheitserreger (Pilze, Viren, Bakterien) sich auf nassen Flächen schnell ausbreiten können. Ein guter Hygieneplan schützt Gäste, Mitarbeiter und den Betrieb.',
    motto: 'Der Hygieneplan steht — er muss auch gelebt werden.',
    rules: [
      'Jeder Betrieb mit öffentlichem Badebetrieb braucht einen schriftlichen Hygieneplan.',
      'Der Plan muss für alle Mitarbeiter zugänglich und verständlich sein — am besten im Aufenthaltsraum ausgehängt.',
      'Kontrollen und Reinigungsnachweise müssen dokumentiert werden (Unterschrift, Datum, Uhrzeit).',
      'Der Plan muss regelmäßig aktualisiert werden — z.B. bei neuen Produkten, Umbau oder geänderten Abläufen.',
      'Bei Nichteinhaltung des Hygieneplans hafte der Betrieb bei Schäden an Gästen oder Mitarbeitern.'
    ],
    steps: [
      {
        title: '1. Was steht im Hygieneplan?',
        text: 'Flächenverzeichnis (was wird gereinigt), Mittelangaben (Produktname, Konzentration), Häufigkeit (täglich, wöchentlich, monatlich), Einwirkzeiten, Verantwortlichkeiten (wer ist zuständig), Dokumentationspflicht (wie wird nachgewiesen).'
      },
      {
        title: '2. Typische Reinigungszyklen',
        text: 'Täglich: Beckenumgang, Duschen, WC, Umkleiden, Handläufe, Schliessflächen. Wöchentlich: Gründliche Reinigung der Filteranlage-Aussenseiten, Rettungsgeräte prüfen. Monatlich: Tiefenreinigung Technikbereiche, Kontrolle Duschköpfe auf Legionellen. Jährlich: Grosse Inspektion, Schimmelpilz-Kontrolle.'
      },
      {
        title: '3. Dokumentation richtig führen',
        text: 'Für jede Reinigungsmaßnahme: Datum, Uhrzeit, Bereiche, verwendetes Mittel, Konzentration, Einwirkzeit, Name des Mitarbeiters. Diese Dokumentation ist im Schadensfall der Beweis, dass der Betrieb seine Pflichten erfüllt hat. Fehlende Dokumentation gilt als nicht durchgeführte Reinigung!'
      },
      {
        title: '4. Sonderfall Legionellen',
        text: 'Legionellen sind Bakterien die im lauwarmen Wasser (25-55 Grad) gedeihen und über Duschwasser eingeatmet werden können — gefährlich für immungeschwächte Personen. Vorbeugung: Warmwasser immer über 60 Grad halten, Kalt-wasser unter 20 Grad, regelmäßige Proben und Duschkopf-Reinigung.'
      }
    ],
    examples: [
      {
        title: 'Hygiene-Kontrolle durch Gesundheitsamt',
        given: 'Das Gesundheitsamt kündigt eine Kontrolle des Hygieneplans und der Dokumentation an.',
        question: 'Was muss vorbereitet sein?',
        steps: [
          ['Hygieneplan', 'Schriftlich, aktuell, unterschrieben von Betriebsleitung'],
          ['Dokumentation', 'Alle Reinigungsnachweise der letzten Monate vollständig'],
          ['Produkte', 'Sicherheitsdatenblätter für alle verwendeten Mittel vorhanden'],
          ['Personal', 'Nachweis über Hygieneschulungen aller Mitarbeiter']
        ]
      },
      {
        title: 'Pilzbefall in der Umkleide',
        given: 'In der Herrenumkleide wird Schimmelpilz an der Wand entdeckt.',
        question: 'Wie wird vorgegangen und was ist im Hygieneplan anzupassen?',
        steps: [
          ['Sofortmaßnahme', 'Bereich sperren, Vorgesetzten informieren, Ursache klären'],
          ['Behandlung', 'Spezielles Anti-Schimmel-Desinfektionsmittel verwenden, Ursache (Feuchtigkeit) beheben'],
          ['Hygieneplan', 'Häufigkeit der Lüftungskontrolle und Feuchtigkeismessung eintragen'],
          ['Präventiv', 'Lüftungszeiten erhöhen, Reinigungshäufigkeit temporär steigern, dokumentieren']
        ]
      }
    ],
    pitfalls: [
      'Hygieneplan im Schrank verstecken reicht nicht — er muss gelebt und dokumentiert werden.',
      'Mitarbeiter die nicht geschult wurden können den Hygieneplan nicht einhalten — Schulungen sind Pflicht.',
      'Eigenprodukte oder Billigmittel ohne Prüfung einsetzen kann die Wirksamkeit zerstören und haftet rechtlich.',
      'Fehlende Dokumentation ist im Rechtsstreit gleichbedeutend mit nicht durchgeführter Reinigung!'
    ],
    quiz: {
      question: 'Welche Wassertemperatur muss Warmwasser mindestens haben um Legionellen zu verhindern?',
      options: [
        'Mindestens 45 Grad Celsius',
        'Mindestens 60 Grad Celsius',
        'Mindestens 80 Grad Celsius'
      ],
      correctIndex: 1,
      explanation: 'Legionellen werden bei Temperaturen über 60 Grad Celsius abgetötet. Warmwasser muss deshalb am Speicher mindestens 60 Grad haben. Die Gefahrenzone für Legionellenwachstum liegt zwischen 25 und 55 Grad.'
    }
  },

  vah_rki: {
    id: 'vah_rki',
    chip: 'VAH- & RKI-Listen',
    title: 'VAH-Liste vs. RKI-Liste — was ist der Unterschied?',
    intro: 'Bei Desinfektionsmitteln tauchen zwei wichtige Listen auf: die VAH-Liste (Verbund für Angewandte Hygiene) und die RKI-Liste (Robert Koch-Institut). Beide listen geprüfte Desinfektionsmittel — aber für verschiedene Zwecke. Verwechslungen können rechtlich und hygienisch fatale Folgen haben.',
    motto: 'VAH = Prophylaxe (Alltag). RKI = Behördlich angeordnete Bekämpfung. Den Unterschied kennen!',
    rules: [
      'VAH-Liste: für die routinemäßige, prophylaktische Desinfektion in Einrichtungen — Standard im Bäderbetrieb.',
      'RKI-Liste: für behördlich angeordnete Bekämpfungsmaßnahmen bei meldepflichtigen Erkrankungen (§18 IfSG).',
      'Für den Alltag im Bad reicht ein VAH-gelistetes Mittel. Bei behördlicher Anordnung muss RKI-gelistet sein.',
      'Nicht jedes VAH-Mittel ist RKI-gelistet — und umgekehrt. Bei Bedarf beides erfragen!',
      'Wirkbereiche beachten: bakterizid, levurozid, fungizid, viruzid, mykobakterizid, sporizid — je nach Erreger.',
    ],
    steps: [
      { title: '1. VAH-Liste — der Alltags-Standard', text: 'Die „Liste der vom VAH zertifizierten Desinfektionsmittel" wird vom Verbund für Angewandte Hygiene e. V. herausgegeben (Nachfolger der alten DGHM-Liste). Sie ist DIE Referenz für die routinemäßige Hygiene in medizinischen, pflegerischen und gewerblichen Einrichtungen — auch Schwimmbäder. Online unter desinfektionsmittel-liste.de einsehbar.' },
      { title: '2. RKI-Liste — der Behörden-Maßstab', text: 'Die „Liste der vom Robert Koch-Institut geprüften und anerkannten Desinfektionsmittel und -verfahren" wird nur dann relevant, wenn das Gesundheitsamt eine behördliche Desinfektion anordnet — etwa bei Cholera, Typhus, viralen hämorrhagischen Fiebern, EHEC-Ausbruch, Krätze­epidemie. Im Alltag des Bäderbetriebs spielt sie selten eine Rolle.' },
      { title: '3. Wirkbereiche verstehen', text: 'Ein Mittel kann unterschiedliche Erregergruppen abtöten. Wichtige Wirkbereiche: bakterizid (Bakterien), levurozid (Hefen), fungizid (Pilze), begrenzt viruzid (behüllte Viren wie Influenza), begrenzt viruzid PLUS (zusätzlich Adeno-/Noro-/Rotaviren), viruzid (alle Viren inkl. unbehüllter), mykobakterizid (Tuberkulose), sporizid (Bakteriensporen wie C. difficile).' },
      { title: '4. Welcher Wirkbereich wofür?', text: 'Im Bad: Routine-Flächendesinfektion meist „bakterizid + levurozid + begrenzt viruzid". Bei Erbrechen-/Stuhlfall: „begrenzt viruzid PLUS" oder „viruzid" wegen Noroviren. Bei Befund von Pilzen (Beckenrand-Schimmel): zusätzlich fungizid. Mykobakterizid und sporizid braucht der Bäderbetrieb selten.' },
    ],
    examples: [
      {
        title: 'Routine-Desinfektion Beckenrand',
        given: 'Tägliche Flächendesinfektion am Beckenrand laut Hygieneplan.',
        question: 'Welches Mittel ist passend?',
        steps: [
          ['Anlass', 'Routine-/Prophylaxe-Desinfektion — kein Erregerausbruch'],
          ['Liste', 'VAH-Liste reicht'],
          ['Wirkbereich', 'Bakterizid + levurozid + begrenzt viruzid genügt'],
          ['Beispiele', 'Quart. Ammoniumverbindungen, Aldehyd-freie Flächendesinfektion'],
        ],
      },
      {
        title: 'Norovirus-Ausbruch',
        given: 'Mehrere Gäste mit akutem Erbrechen, Verdacht auf Norovirus.',
        question: 'Was ändert sich beim Desinfektionsmittel?',
        steps: [
          ['Anlass', 'Erregerausbruch — Noroviren sind unbehüllt, sehr stabil'],
          ['Liste', 'VAH-Liste, aber Wirkbereich strenger'],
          ['Wirkbereich', '„begrenzt viruzid PLUS" oder „viruzid"'],
          ['Beispiele', 'Peressigsäure, hochdosiertes Aktivchlor — laut VAH-Liste'],
          ['Bei behördl. Anordnung', 'RKI-gelistetes Mittel verwenden, Bereich „Viruzid (Norovirus)"'],
        ],
      },
    ],
    pitfalls: [
      'VAH und RKI verwechseln — bei behördlicher Anordnung MUSS es RKI-gelistet sein, sonst rechtswidrig.',
      'Wirkbereich „bakterizid" reicht nicht für virale Ausbrüche — Noroviren brauchen begrenzt viruzid PLUS.',
      'Mittel kaufen ohne Wirknachweis (kein VAH-Eintrag) → keine rechtssichere Hygiene.',
      'Einwirkzeit unterscheidet sich je Wirkbereich — immer auf das Etikett UND die Listenangabe schauen.',
    ],
    quiz: {
      question: 'Welche Liste gilt als Standard für die Routine-Flächendesinfektion im Schwimmbad?',
      options: [
        'RKI-Liste — sie ist die strengste',
        'VAH-Liste — sie ist die richtige für routinemäßige, prophylaktische Desinfektion',
        'Beide gleich — der Unterschied ist nur juristisch'
      ],
      correctIndex: 1,
      explanation: 'Die VAH-Liste ist der Standard für die routinemäßige Desinfektion im Bäderbetrieb. Die RKI-Liste wird nur bei behördlich angeordneten Bekämpfungsmaßnahmen relevant (z. B. Cholera, EHEC-Ausbruch). Beide haben unterschiedliche Zwecke.'
    }
  },

  plan_vorlage: {
    id: 'plan_vorlage',
    chip: 'Hygieneplan-Vorlage',
    title: 'Hygieneplan — Beispielstruktur für ein Schwimmbad',
    intro: 'Ein Hygieneplan ist Pflicht (§ 36 IfSG) und schriftlich vorzuhalten. Er regelt Was, Womit, Wann, Wie oft, Von wem und mit welcher Einwirkzeit — für jeden Bereich des Bades. Die folgende Vorlage zeigt typische Inhalte. Sie muss jedoch IMMER auf den eigenen Betrieb angepasst werden.',
    motto: 'Ein guter Hygieneplan ist konkret, prüfbar und tatsächlich gelebt — kein Aktendeckel-Theater.',
    rules: [
      'Pflicht nach § 36 IfSG — schriftliche Form, Aushang an gut sichtbarer Stelle für Personal.',
      'Festgelegt: WAS (Bereich/Gegenstand), WOMIT (Mittel + Konzentration), WIE (Verfahren), WANN/HÄUFIG (Frequenz), WER (Verantwortlich), WIE LANGE (Einwirkzeit).',
      'Mitarbeiter müssen geschult werden — Schulung schriftlich dokumentieren.',
      'Quittierung der Reinigung im Betriebstagebuch — wer hat wann was gemacht.',
      'Jährliche Überprüfung und Aktualisierung — durch Sachkundigen oder Hygiene­beauftragten.',
      'Gesundheitsamt kann den Plan jederzeit einsehen.',
    ],
    steps: [
      { title: '1. Beckenumgang & Beckenrand', text: 'Reinigung: täglich (z. B. nach Schließung). Mittel: alkalischer Reiniger gebrauchsfertig. Verfahren: Vorbenetzen → Reiniger → mech. Reinigen → Spülen. Anschließend Flächendesinfektion VAH-gelistet, Einwirkzeit nach Hersteller (5–15 Min). Verantwortlich: Reinigungsdienst.' },
      { title: '2. Duschen & Umkleiden', text: 'Reinigung: täglich (nach Schließung). Mittel: alkalisch + sauer alternierend (gegen Fett bzw. Kalk). Desinfektion: täglich oder mehrmals pro Woche je nach Belastung. Duschköpfe: 1× quartalsweise entkalken + desinfizieren (Legionellen­prophylaxe).' },
      { title: '3. Toiletten', text: 'Reinigung: mind. 2× täglich, in Stoßzeiten häufiger. Mittel: WC-Reiniger sauer. Desinfektion: täglich, VAH-gelistet. Sitzbrillen: zusätzlich nach Bedarf. Lappenwechsel und Trennung WC/Wohnbereich.' },
      { title: '4. Rettungsgeräte', text: 'Sichtkontrolle: täglich vor Öffnung. Reinigung: wöchentlich, nach Einsatz sofort. Desinfektion: nach Einsatz oder bei sichtbarer Verschmutzung.' },
      { title: '5. Erste-Hilfe-Raum', text: 'Reinigung: täglich. Desinfektion: nach jedem Einsatz mit Personenkontakt. Liege, Trage, Decken: nach Benutzung sofort. Verbandkasten monatlich Vollständigkeit.' },
      { title: '6. Ruheliegen / Saunabänke', text: 'Bei Mehrfachnutzung: nach jedem Gast Wischdesinfektion empfohlen. Hand­tuchpflicht in der Sauna durchsetzen.' },
      { title: '7. Lüftungsanlagen / Filter', text: 'Reinigung: laut Hersteller (i. d. R. quartalsweise oder halbjährlich). Filterwechsel: nach Vorgabe. Wartungsdokumentation durch Fachfirma.' },
      { title: '8. Spinde & Foyer', text: 'Reinigung: täglich. Desinfektion: wöchentlich oder bei sichtbarer Verschmutzung. Spindkontrolle nach Schließung.' },
    ],
    examples: [
      {
        title: 'Beispieleintrag — Beckenrand',
        given: 'So sieht ein konkreter Eintrag im Hygieneplan aus.',
        question: 'Was steht drin?',
        steps: [
          ['Bereich', 'Beckenumgang Halle (Schwimmer- + Nichtschwimmerbecken)'],
          ['Mittel', 'Reiniger XY (alkalisch, 2 % verdünnt) + Desinfektionsmittel ZZ (gebrauchsfertig, VAH-gelistet)'],
          ['Verfahren', 'Vorbenetzen → Reiniger einwirken → schrubben → spülen → Desinfektion auftragen → 10 Min Einwirkzeit → trocknen lassen'],
          ['Frequenz', 'Täglich, nach Betriebsschluss'],
          ['Verantwortlich', 'Reinigungsdienst, Schichtleiter quittiert'],
          ['Doku', 'Eintrag in Reinigungsbuch + Quittierung'],
        ],
      },
      {
        title: 'Beispieleintrag — Duschköpfe (Legionellen-Prävention)',
        given: 'Quartalsweise Reinigung der Duschköpfe.',
        question: 'Inhalt des Plan-Eintrags?',
        steps: [
          ['Bereich', 'Alle Duschköpfe Damen-/Herren-/Behindertenbad'],
          ['Verfahren', 'Demontage → Entkalkung 30 Min in Essigsäure-Lösung → Spülen → Thermische Desinfektion 70 °C 5 Min → trocknen → Montage'],
          ['Frequenz', 'Quartalsweise (4× jährlich) — letzte Woche Quartalsende'],
          ['Verantwortlich', 'Haustechnik'],
          ['Doku', 'Wartungsplan + Foto-Doku jeder Reihe'],
          ['Begleitend', 'Probenahme Legionellen jährlich (TrinkwV)'],
        ],
      },
    ],
    pitfalls: [
      'Hygieneplan kopiert von einem anderen Betrieb ohne Anpassung — die Realität stimmt dann nicht.',
      'Frequenzen zu eng angesetzt → Plan kann nicht eingehalten werden → Lücken in der Doku.',
      'Verantwortliche nicht benannt → niemand fühlt sich zuständig.',
      'Plan einmal erstellt und nie aktualisiert → veraltet, falsche Mittel, falsche Konzentrationen.',
      'Keine Schulung der Mitarbeiter → Plan wird zwar gedruckt aber nicht gelebt.',
    ],
    quiz: {
      question: 'Was muss ein Hygieneplan mindestens enthalten?',
      options: [
        'Den Namen des Betreibers und das Datum der letzten Renovierung',
        'WAS, WOMIT (mit Konzentration), WIE, WANN, WER, mit welcher EINWIRKZEIT — für jeden Bereich',
        'Ein allgemeines Sauberkeits-Bekenntnis und eine Liste der Reinigungs­mittel'
      ],
      correctIndex: 1,
      explanation: 'Ein Hygieneplan muss konkret und prüfbar sein. Er regelt Bereich für Bereich: Was wird gereinigt/desinfiziert? Mit welchem Mittel in welcher Konzentration? Wie wird das Verfahren ausgeführt? Wann/Wie oft? Von wem? Mit welcher Einwirkzeit?'
    }
  }
};

// ─── GHS-Daten (CLP-Verordnung EG 1272/2008, amtliche Piktogramm-Codes) ────────
// Quelle: ECHA (Europäische Chemikalienagentur), BAuA, GefStoffV Anlage 1
const GHS_INFO = {
  GHS01: { label: 'Explosiv',          symbol: 'Explodierende Bombe',       color: 'bg-orange-50 border-red-600' },
  GHS02: { label: 'Entzündlich',      symbol: 'Flamme',                    color: 'bg-orange-50 border-red-600' },
  GHS03: { label: 'Oxidierend',        symbol: 'Flamme über Kreis',        color: 'bg-orange-50 border-red-600' },
  GHS04: { label: 'Gas u. Druck',      symbol: 'Gasflasche',                color: 'bg-blue-50 border-red-600'   },
  GHS05: { label: 'Aetzend',           symbol: 'Korrosion (Hand/Material)', color: 'bg-red-50 border-red-600'    },
  GHS06: { label: 'Akut giftig',       symbol: 'Totenkopf mit Knochen',     color: 'bg-red-50 border-red-600'    },
  GHS07: { label: 'Gesundheitsschäd.', symbol: 'Ausrufezeichen',           color: 'bg-yellow-50 border-red-600' },
  GHS08: { label: 'Gefahr f. Gesundh.', symbol: 'Gesundheitsgefahr',        color: 'bg-orange-50 border-red-600' },
  GHS09: { label: 'Umweltgefährl.',   symbol: 'Toter Fisch + Baum',        color: 'bg-green-50 border-red-600'  },
};

// Reinigungsmittel nach Kategorie — GHS-Codes nach SDB/CLP, wie auf echten Etiketten
const GHS_CHEMICALS = [
  {
    id: 'alkalisch',
    label: 'Alkalische Reiniger',
    subtitle: 'pH > 8 · gegen Fett, Eiweiß, Biofilm',
    headerColor: 'bg-blue-600',
    chemicals: [
      { name: 'Natriumhydroxid (NaOH)', formula: 'pH-Plus, Ablaugreiniger', ghs: ['GHS05'], note: 'Konzentriert stark ätzend. Schutzbrille + Handschuhe Pflicht.' },
      { name: 'Kaliumhydroxid (KOH)', formula: 'Entfetter, Reiniger', ghs: ['GHS05', 'GHS07'], note: 'Aetzend und reizend. Wie NaOH behandeln.' },
      { name: 'Allgemeiner Alkalireiniger', formula: 'gebrauchsfertig verdünnt', ghs: ['GHS07'], note: 'Verdünnt nur reizend — trotzdem Handschuhe tragen.' },
      { name: 'Ammoniakreiniger (NH₃)', formula: '>5% Ammoniak', ghs: ['GHS05', 'GHS07', 'GHS09'], note: 'Aetzend, reizend, umweltgefährlich. Nicht mit Chlor mischen — giftiges Gas!' },
    ],
  },
  {
    id: 'sauer',
    label: 'Saure Reiniger',
    subtitle: 'pH < 6 · gegen Kalk, Rost, Urinstein',
    headerColor: 'bg-red-600',
    chemicals: [
      { name: 'Salzsäure (HCl)', formula: '10–32% · pH-Minus', ghs: ['GHS05', 'GHS07'], note: 'NIE mit Chlorprodukten mischen — sofort Chlorgas (GHS06)!' },
      { name: 'Phosphorsäure (H₃PO₄)', formula: '25–85%', ghs: ['GHS05'], note: 'Kalkentferner. Maeßig ätzend — trotzdem Schutzbrille!' },
      { name: 'Schwefelsäure (H₂SO₄)', formula: 'konzentriert', ghs: ['GHS05'], note: 'Stark ätzend. Selten in Bädern, aber in Technikbetrieben möglich.' },
      { name: 'Zitronensäure', formula: 'gebrauchsfertig', ghs: ['GHS07'], note: 'Milder Kalkentferner — bei höher Konzentration reizend.' },
    ],
  },
  {
    id: 'neutral',
    label: 'Neutrale Reiniger',
    subtitle: 'pH 6–8 · Allgemeinreinigung, schonend',
    headerColor: 'bg-green-600',
    chemicals: [
      { name: 'Tensid-Allzweckreiniger', formula: 'gebrauchsfertig', ghs: [], note: 'Oft ohne GHS-Pflicht bei niedrigem Tensidgehalt (<5%).' },
      { name: 'Bodenreiniger neutral', formula: 'gebrauchsfertig', ghs: ['GHS07'], note: 'Bei höherem Tensidgehalt als reizend eingestuft.' },
      { name: 'Glasreiniger', formula: 'gebrauchsfertig', ghs: ['GHS07'], note: 'Alkohol- oder tensidhaltig — leicht reizend bei Augenkontakt.' },
    ],
  },
  {
    id: 'desinfektion',
    label: 'Desinfektionsmittel',
    subtitle: 'nach VAH-Liste · gezielt gegen Keime',
    headerColor: 'bg-purple-600',
    chemicals: [
      { name: 'Natriumhypochlorit (NaOCl)', formula: '5–13% · Flüssigchlor', ghs: ['GHS05', 'GHS09'], note: 'Aetzend, umweltgefährlich. Mit Säure → Chlorgas!' },
      { name: 'Calciumhypochlorit Ca(OCl)₂', formula: 'Feststoff · Chlorkalk', ghs: ['GHS03', 'GHS05', 'GHS09'], note: 'OXIDIEREND — nie mit Brennbarem, Oel oder Säure lagern!' },
      { name: 'Chlorgas (Cl₂)', formula: 'Gas unter Druck', ghs: ['GHS04', 'GHS05', 'GHS06', 'GHS09'], note: 'Höchste Gefahr — akut giftig, ätzend, umweltgefährlich.' },
      { name: 'Ethanol / Isopropanol', formula: '70–80% · Hände/Flächen', ghs: ['GHS02', 'GHS07'], note: 'Entflammbar! Nie in Nähe von Chlorgas oder Zündquellen.' },
      { name: 'Quats (QAV)', formula: 'Flächendesinfektion', ghs: ['GHS05', 'GHS07', 'GHS09'], note: 'Nie mit anionischen Tensiden mischen — Wirkungsaufhebung.' },
      { name: 'Peressigsäure (PAA)', formula: '15% · Spezialdesinf.', ghs: ['GHS01', 'GHS02', 'GHS03', 'GHS05', 'GHS07'], note: 'Fünf GHS-Symbole! Höchste Vorsicht — oxidierend UND entzündlich.' },
    ],
  },
];

// ─── GHS-Piktogramm Komponente (Diamantform nach CLP-VO) ─────────────────────
const GHSBadge = ({ code, darkMode }) => {
  const info = GHS_INFO[code];
  if (!info) return null;
  return (
    <div className="flex flex-col items-center gap-0.5" title={`${code}: ${info.symbol}`}>
      {/* Diamant-Form: weiss mit rotem Rand, schwarzer Text — entspricht offiziellem CLP-Piktogramm */}
      <div className="relative w-10 h-10 flex items-center justify-center">
        <div className={`absolute inset-0 rotate-45 rounded-sm border-2 border-red-600 bg-white`} />
        <span className="relative z-10 text-xs font-black text-gray-900 leading-none select-none" style={{ fontSize: '9px' }}>
          {code.replace('GHS', '')}
        </span>
      </div>
      <span className="text-[8px] font-semibold text-center leading-tight max-w-[44px]"
        style={{ color: darkMode ? '#9ca3af' : '#374151' }}>
        {info.label}
      </span>
    </div>
  );
};

// ─── GHS-Chemikalien-Ansicht ──────────────────────────────────────────────────
function GHSChemicals({ darkMode }) {
  const [selected, setSelected] = useState(null);

  if (selected) {
    const chem = selected;
    return (
      <div className="space-y-4">
        <button
          onClick={() => setSelected(null)}
          className={`flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg ${darkMode ? 'text-gray-300 hover:bg-slate-700' : 'text-gray-600 hover:bg-gray-100'}`}
        >
          ← Zurück zur Übersicht
        </button>
        <div className={`rounded-xl p-5 border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
          <p className={`text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{chem.formula}</p>
          <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{chem.name}</h3>

          {/* GHS-Symbole */}
          {chem.ghs.length > 0 ? (
            <div className={`rounded-xl p-4 mb-4 ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
              <p className={`text-xs font-semibold mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                GHS-PIKTOGRAMME (CLP-Verordnung EG 1272/2008)
              </p>
              <div className="flex flex-wrap gap-4">
                {chem.ghs.map(code => (
                  <div key={code} className="flex flex-col items-center gap-2">
                    <GHSBadge code={code} darkMode={darkMode} />
                    <p className={`text-[10px] text-center max-w-[52px] ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {GHS_INFO[code]?.symbol}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className={`rounded-xl p-3 mb-4 text-sm ${darkMode ? 'bg-slate-700 text-gray-400' : 'bg-gray-50 text-gray-500'}`}>
              Kein GHS-Piktogramm erforderlich (unter Einstufungsgrenzen der CLP-VO)
            </div>
          )}

          {/* Hinweis */}
          <div className={`rounded-xl p-3 border-l-4 border-yellow-500 ${darkMode ? 'bg-slate-700' : 'bg-yellow-50'}`}>
            <p className={`text-sm ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{chem.note}</p>
          </div>
        </div>

        {/* GHS-Legende */}
        <div className={`rounded-xl p-4 ${darkMode ? 'bg-slate-700/60' : 'bg-gray-50'}`}>
          <p className={`text-xs font-semibold mb-3 ${darkMode ? 'text-yellow-400' : 'text-yellow-700'}`}>
            ALLE GHS-PIKTOGRAMME (offizielle Codes nach CLP-VO / ECHA)
          </p>
          <div className="grid grid-cols-3 gap-3">
            {Object.entries(GHS_INFO).map(([code, info]) => (
              <div key={code} className={`p-2 rounded-lg flex items-center gap-2 ${darkMode ? 'bg-slate-600' : 'bg-white'}`}>
                <GHSBadge code={code} darkMode={darkMode} />
                <p className={`text-[10px] leading-tight ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{info.symbol}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className={`rounded-xl p-4 border-l-4 border-yellow-500 ${darkMode ? 'bg-slate-800' : 'bg-yellow-50'}`}>
        <h3 className="text-lg font-bold mb-1">GHS-Kennzeichnung nach Reinigungsmitteltyp</h3>
        <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Offizielle Piktogramm-Codes nach CLP-Verordnung (EG) Nr. 1272/2008 · ECHA · BAuA · GefStoffV.
          Tippe auf ein Produkt für Details und vollständige Symbolerklärung.
        </p>
      </div>

      {/* GHS-Legende kompakt */}
      <div className={`rounded-xl p-3 ${darkMode ? 'bg-slate-700/60' : 'bg-gray-50'}`}>
        <p className={`text-xs font-semibold mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          GHS-SYMBOLE (Diamantform · weiss · roter Rand · schwarz — CLP-VO Anhang V)
        </p>
        <div className="flex flex-wrap gap-3">
          {Object.entries(GHS_INFO).map(([code, info]) => (
            <GHSBadge key={code} code={code} darkMode={darkMode} />
          ))}
        </div>
      </div>

      {/* Kategorien */}
      {GHS_CHEMICALS.map(cat => (
        <div key={cat.id} className={`rounded-xl overflow-hidden border ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
          <div className={`${cat.headerColor} px-4 py-2`}>
            <p className="text-white font-bold text-sm">{cat.label}</p>
            <p className="text-white/80 text-xs">{cat.subtitle}</p>
          </div>
          <div className="divide-y divide-gray-100">
            {cat.chemicals.map((chem, i) => (
              <button
                key={i}
                onClick={() => setSelected(chem)}
                className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${
                  darkMode ? 'bg-slate-800 hover:bg-slate-700 divide-slate-700' : 'bg-white hover:bg-gray-50'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{chem.name}</p>
                  <p className={`text-xs mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{chem.formula}</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  {chem.ghs.length === 0 ? (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${darkMode ? 'bg-slate-600 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
                      kein GHS
                    </span>
                  ) : (
                    chem.ghs.map(code => (
                      <GHSBadge key={code} code={code} darkMode={darkMode} />
                    ))
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}

      <p className={`text-xs text-center ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
        Quelle: CLP-Verordnung (EG) 1272/2008 · ECHA Guidance · BAuA · GefStoffV Anlage 1
      </p>
    </div>
  );
}

const TabChip = ({ label, active, onClick, darkMode }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
      active
        ? 'bg-yellow-500 text-white'
        : darkMode
          ? 'bg-slate-700 text-gray-300 hover:bg-slate-600'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
    }`}
  >
    {label}
  </button>
);

const Section = ({ title, children, darkMode }) => (
  <div className={`rounded-xl p-4 ${darkMode ? 'bg-slate-700/60' : 'bg-gray-50'}`}>
    <h4 className={`font-bold mb-3 ${darkMode ? 'text-yellow-400' : 'text-yellow-700'}`}>{title}</h4>
    {children}
  </div>
);

export default function ReinigungDesinfektionDeepDiveView({ onBack }) {
  const { darkMode } = useApp();
  const [activeTab, setActiveTab] = useState('grundlagen');
  const [quizAnswer, setQuizAnswer] = useState(null);
  const tab = TABS[activeTab];

  return (
    <div className={`min-h-screen p-4 space-y-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
      <div className="flex items-center gap-3">
        <button onClick={onBack} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-100'}`}>
          ← Zurück
        </button>
        <div>
          <h2 className="text-xl font-bold">🧼 Reinigung & Desinfektion</h2>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Hygiene & Sicherheit · §3 Nr. 4</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {Object.values(TABS).map(t => (
          <TabChip key={t.id} label={t.chip} active={activeTab === t.id} onClick={() => { setActiveTab(t.id); setQuizAnswer(null); }} darkMode={darkMode} />
        ))}
      </div>

      {activeTab === 'ghs' && <GHSChemicals darkMode={darkMode} />}

      {activeTab !== 'ghs' && (
      <div className={`rounded-xl p-4 border-l-4 border-yellow-500 ${darkMode ? 'bg-slate-800' : 'bg-yellow-50'}`}>
        <h3 className="text-lg font-bold mb-2">{tab.title}</h3>
        <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{tab.intro}</p>
        <p className={`mt-3 text-sm font-semibold italic ${darkMode ? 'text-yellow-400' : 'text-yellow-700'}`}>💡 {tab.motto}</p>
      </div>
      )}

      {activeTab !== 'ghs' && <Section title="📋 Das musst du wissen" darkMode={darkMode}>
        <ul className="space-y-2">
          {tab.rules.map((r, i) => (
            <li key={i} className={`flex gap-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <span className="text-yellow-500 font-bold mt-0.5">•</span><span>{r}</span>
            </li>
          ))}
        </ul>
      </Section>}

      {activeTab !== 'ghs' && <Section title="🔢 Schritt für Schritt" darkMode={darkMode}>
        <div className="space-y-3">
          {tab.steps.map((s, i) => (
            <div key={i} className={`p-3 rounded-lg ${darkMode ? 'bg-slate-600' : 'bg-white'}`}>
              <p className="font-semibold text-sm text-yellow-500">{s.title}</p>
              <p className={`text-sm mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{s.text}</p>
            </div>
          ))}
        </div>
      </Section>}

      {activeTab !== 'ghs' && <Section title="📖 Beispiele aus der Praxis" darkMode={darkMode}>
        <div className="space-y-4">
          {tab.examples.map((ex, i) => (
            <div key={i} className={`p-3 rounded-lg ${darkMode ? 'bg-slate-600' : 'bg-white'}`}>
              <p className="font-bold text-sm text-yellow-500 mb-1">{ex.title}</p>
              <p className={`text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{ex.given}</p>
              <p className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{ex.question}</p>
              <div className="space-y-1">
                {ex.steps.map(([label, text], j) => (
                  <div key={j} className="flex gap-2 text-sm">
                    <span className={`font-semibold min-w-[90px] ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>{label}:</span>
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>}

      {activeTab !== 'ghs' && <Section title="⚠️ Typische Fehler vermeiden" darkMode={darkMode}>
        <ul className="space-y-2">
          {tab.pitfalls.map((p, i) => (
            <li key={i} className={`flex gap-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <span className="text-red-400 font-bold mt-0.5">✗</span><span>{p}</span>
            </li>
          ))}
        </ul>
      </Section>}

      {activeTab !== 'ghs' && <Section title="🧠 Teste dein Wissen" darkMode={darkMode}>
        <p className={`text-sm font-medium mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{tab.quiz.question}</p>
        <div className="space-y-2">
          {tab.quiz.options.map((opt, i) => {
            const isSelected = quizAnswer === i;
            const isCorrect = i === tab.quiz.correctIndex;
            let bg = darkMode ? 'bg-slate-600 hover:bg-slate-500' : 'bg-white hover:bg-gray-50';
            if (quizAnswer !== null) {
              if (isCorrect) bg = 'bg-green-600 text-white';
              else if (isSelected) bg = 'bg-red-500 text-white';
            }
            return (
              <button key={i} onClick={() => quizAnswer === null && setQuizAnswer(i)}
                className={`w-full text-left p-3 rounded-lg text-sm border transition-colors ${bg} ${darkMode ? 'border-slate-500' : 'border-gray-200'}`}>
                {opt}
              </button>
            );
          })}
        </div>
        {quizAnswer !== null && (
          <div className={`mt-3 p-3 rounded-lg text-sm ${quizAnswer === tab.quiz.correctIndex ? 'bg-green-900/30 text-green-300' : 'bg-red-900/30 text-red-300'}`}>
            {quizAnswer === tab.quiz.correctIndex ? '✓ Richtig! ' : '✗ Leider falsch. '}{tab.quiz.explanation}
          </div>
        )}
      </Section>}
    </div>
  );
}
