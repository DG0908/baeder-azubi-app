// English A2 — Lesson 7: Hausordnung & Regeln erklären

export const lessonRules = {
  id: 'english-a2-rules',
  title: 'Hausordnung & Regeln erklären',
  level: 'A2',
  icon: '📋',
  estimatedMinutes: 18,
  intro:
    'Als FAB musst du Regeln freundlich, aber bestimmt durchsetzen — auch bei englischsprachigen Gästen. Hier lernst du, wie du Verbote, Pflichten und Sicherheitsregeln klar, höflich und souverän auf Englisch kommunizierst, ohne dass sich der Gast angegriffen fühlt.',
  sections: [
    {
      type: 'vocab',
      title: 'Höfliche Aufforderungen',
      items: [
        { en: 'Excuse me, sir / madam.', de: 'Entschuldigung, mein Herr / meine Dame.' },
        { en: 'Could you please …?', de: 'Könnten Sie bitte …?' },
        { en: 'Would you mind …?', de: 'Hätten Sie etwas dagegen, …?' },
        { en: "I'm afraid you can't do that here.", de: 'Leider können Sie das hier nicht machen.' },
        { en: "It's not allowed in this area.", de: 'Das ist in diesem Bereich nicht erlaubt.' },
        { en: 'For safety reasons, please …', de: 'Aus Sicherheitsgründen, bitte …' },
        { en: 'Thank you for your understanding.', de: 'Vielen Dank für Ihr Verständnis.' },
      ],
    },
    {
      type: 'vocab',
      title: 'Typische Regeln im Bad',
      items: [
        { en: 'No running.', de: 'Nicht rennen.' },
        { en: 'No diving in shallow water.', de: 'Kein Springen ins flache Wasser.' },
        { en: 'No food or drinks at the pool.', de: 'Kein Essen / Trinken am Becken.' },
        { en: 'No glass containers.', de: 'Keine Glasbehälter.' },
        { en: 'No photography in the changing rooms.', de: 'Kein Fotografieren in den Umkleiden.' },
        { en: 'No mobile phones in the changing rooms.', de: 'Keine Handys in den Umkleiden.' },
        { en: 'No smoking inside the building.', de: 'Im Gebäude nicht rauchen.' },
        { en: 'Children under 8 must be supervised by an adult.', de: 'Kinder unter 8 nur in Begleitung eines Erwachsenen.' },
        { en: 'Please shower before entering the pool.', de: 'Bitte vor dem Schwimmen duschen.' },
        { en: 'Please wear a swimming cap.', de: 'Bitte Badekappe tragen.' },
        { en: 'Lifeguards have the final say.', de: 'Die Aufsicht hat das letzte Wort.' },
      ],
    },
    {
      type: 'dialog',
      title: 'Mini-Dialog: Junge rennt am Beckenrand',
      setting: 'Ein Junge rennt am Beckenrand entlang.',
      lines: [
        { speaker: 'FAB', en: 'Hey, excuse me — could you please walk, not run?', de: 'Hey, Entschuldigung — könntest du bitte gehen, nicht rennen?' },
        { speaker: 'Junge', en: 'Why?', de: 'Warum?' },
        { speaker: 'FAB', en: "The floor is wet and slippery. It's dangerous to run. You could fall.", de: 'Der Boden ist nass und rutschig. Es ist gefährlich zu rennen. Du könntest stürzen.' },
        { speaker: 'Junge', en: 'OK, sorry.', de: 'OK, sorry.' },
        { speaker: 'FAB', en: 'No problem. Thank you!', de: 'Kein Problem. Danke!' },
      ],
    },
    {
      type: 'dialog',
      title: 'Mini-Dialog: Glas am Beckenrand',
      setting: 'Eine Gruppe sitzt am Beckenrand mit einer Glasflasche.',
      lines: [
        { speaker: 'FAB', en: "Excuse me — I'm sorry, but glass is not allowed here.", de: 'Entschuldigung — leider sind Glasflaschen hier nicht erlaubt.' },
        { speaker: 'Gast', en: 'Why not?', de: 'Warum nicht?' },
        { speaker: 'FAB', en: 'For safety reasons. If the bottle breaks, the glass could hurt people barefoot.', de: 'Aus Sicherheitsgründen. Wenn die Flasche bricht, könnten sich barfüßige Gäste verletzen.' },
        { speaker: 'Gast', en: 'Oh, I understand. What can I do?', de: 'Oh, ich verstehe. Was kann ich tun?' },
        { speaker: 'FAB', en: 'You can buy a plastic bottle at the cafeteria — same content, no problem.', de: 'Sie können eine Plastikflasche in der Cafeteria kaufen — gleicher Inhalt, kein Problem.' },
        { speaker: 'Gast', en: 'OK, thanks.', de: 'OK, danke.' },
        { speaker: 'FAB', en: 'Thank you for your understanding.', de: 'Vielen Dank für Ihr Verständnis.' },
      ],
    },
    {
      type: 'dialog',
      title: 'Mini-Dialog: Foto in der Umkleide',
      setting: 'Du siehst, wie jemand in der Umkleide das Handy zückt.',
      lines: [
        { speaker: 'FAB', en: "Excuse me, sir — please put your phone away in the changing room.", de: 'Entschuldigung, mein Herr — Handy bitte in der Umkleide weglegen.' },
        { speaker: 'Gast', en: "I'm just texting!", de: 'Ich schreibe nur eine SMS!' },
        { speaker: 'FAB', en: "I'm sorry, but phones are not allowed here at all — for the privacy of all guests.", de: 'Tut mir leid, aber Handys sind hier komplett verboten — zum Schutz aller Gäste.' },
        { speaker: 'Gast', en: 'OK, sorry.', de: 'OK, tut mir leid.' },
        { speaker: 'FAB', en: 'No problem. You can use your phone in the foyer area.', de: 'Kein Problem. Im Foyer können Sie Ihr Handy benutzen.' },
      ],
    },
    {
      type: 'info',
      variant: 'tip',
      title: 'Souveräne Durchsetzung — die Formel',
      bullets: [
        '1. Höflich ansprechen: „Excuse me, …"',
        '2. Regel nennen: „… is not allowed here."',
        '3. Begründung geben: „For safety reasons / for hygiene / for privacy."',
        '4. Alternative anbieten: „You can … instead."',
        '5. Bedanken: „Thank you for your understanding."',
        'Diese Reihenfolge funktioniert international — Gäste fühlen sich respektiert, nicht ertappt.',
      ],
    },
    {
      type: 'vocab',
      title: 'Eskalation — wenn der Gast nicht hört',
      items: [
        { en: 'Please listen to me.', de: 'Bitte hören Sie mir zu.' },
        { en: 'This is not a request — it is a rule.', de: 'Das ist keine Bitte — das ist eine Regel.' },
        { en: 'If you continue, I will have to ask you to leave.', de: 'Wenn Sie weitermachen, muss ich Sie bitten zu gehen.' },
        { en: 'I will call my manager / supervisor.', de: 'Ich rufe meinen Vorgesetzten.' },
        { en: 'Please leave the pool area now.', de: 'Bitte verlassen Sie jetzt den Beckenbereich.' },
        { en: 'For safety, I have to clear the pool now.', de: 'Aus Sicherheitsgründen muss ich das Becken jetzt räumen.' },
      ],
    },
    {
      type: 'info',
      variant: 'warning',
      title: 'Eskalation — wann?',
      bullets: [
        'Eskaliere langsam — gib mehrere Chancen.',
        'Bei wiederholtem Regelbruch: Vorgesetzte/r holen, Personalanweisung folgen.',
        'Bei Gefährdung anderer (z. B. Sprung in zu flaches Wasser): SOFORT eingreifen — keine lange Diskussion.',
        'Kein Gewalt, keine emotionalen Reaktionen. Bleibe sachlich, ruhig, höflich.',
      ],
    },
    {
      type: 'quick-check',
      title: 'Mini-Quiz',
      questions: [
        {
          q: 'Was ist die höflichste Art, einen Gast aufzufordern, etwas zu unterlassen?',
          options: [
            "Stop that!",
            'Could you please … ?',
            "You can't do that.",
          ],
          correct: 1,
          explanation: '„Could you please … ?" ist immer höflich. Direkte Befehle wirken aggressiv.',
        },
        {
          q: 'Wie sagst du „Aus Sicherheitsgründen"?',
          options: ['Because of safe.', 'For safety reasons.', 'It is dangerous.'],
          correct: 1,
          explanation: '„For safety reasons" ist die Standardbegründung — kurz und klar.',
        },
        {
          q: 'Welche Reihenfolge in der Durchsetzung ist am souveränsten?',
          options: [
            'Sofort drohen, dann erklären.',
            'Höflich ansprechen → Regel nennen → Begründung → Alternative → Danken.',
            'Vorgesetzten holen, ohne den Gast anzusprechen.',
          ],
          correct: 1,
          explanation: 'Die 5-Schritt-Formel funktioniert international. Der Gast fühlt sich respektiert, die Regel wird trotzdem durchgesetzt.',
        },
        {
          q: 'Ein Gast bringt eine Glasflasche ins Bad. Was ist die korrekte Reaktion?',
          options: [
            'Glas einfach wegnehmen.',
            'Höflich erklären, warum verboten, und Plastikflasche aus der Cafeteria anbieten.',
            'Vorgesetzten rufen und Hausverbot drohen.',
          ],
          correct: 1,
          explanation: 'Erst erklären und Alternative anbieten. Drohung erst bei wiederholtem Regelbruch.',
        },
        {
          q: 'Ein Gast fotografiert in der Umkleide. Was sagst du auf Englisch?',
          options: [
            'No photo!',
            "I'm sorry, but phones are not allowed here at all.",
            'Why are you doing that?',
          ],
          correct: 1,
          explanation: '„I\'m sorry, but … not allowed" ist höflich und klar. „No photo!" wirkt unhöflich.',
        },
      ],
    },
  ],
};
