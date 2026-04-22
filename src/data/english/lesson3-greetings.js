// English A1 — Lesson 3: Begrüßung & Smalltalk

export const lessonGreetings = {
  id: 'english-a1-greetings',
  title: 'Begrüßung & Smalltalk',
  level: 'A1',
  icon: '👋',
  estimatedMinutes: 12,
  intro:
    'Der erste Eindruck entscheidet. Mit ein paar höflichen Standard-Floskeln wirkst du an der Kasse oder am Schwimmbeckenrand sofort souverän — egal ob der Gast nur ein Handtuch vergessen hat oder ein echtes Problem schildert.',
  sections: [
    {
      type: 'vocab',
      title: 'Begrüßen und verabschieden',
      items: [
        { en: 'Hello. / Hi.', de: 'Hallo. / Hi.' },
        { en: 'Good morning.', de: 'Guten Morgen. (bis ca. 12 Uhr)' },
        { en: 'Good afternoon.', de: 'Guten Tag. (ab ca. 12 Uhr)' },
        { en: 'Good evening.', de: 'Guten Abend.' },
        { en: 'Goodbye. / Bye.', de: 'Auf Wiedersehen. / Tschüss.' },
        { en: 'Have a nice day.', de: 'Einen schönen Tag noch.' },
        { en: 'See you.', de: 'Bis später.' },
      ],
    },
    {
      type: 'info',
      variant: 'tip',
      title: 'Tageszeit beachten',
      bullets: [
        '„Good night" ist KEINE Begrüßung — das sagt man nur beim Abschied am späten Abend oder vor dem Schlafengehen.',
        '„Good day" wirkt im englischen Kundenkontakt eher förmlich/veraltet — „Hello" oder „Good morning/afternoon" sind natürlicher.',
      ],
    },
    {
      type: 'vocab',
      title: 'Sich vorstellen',
      items: [
        { en: 'My name is Anna.', de: 'Mein Name ist Anna.' },
        { en: "I'm Anna.", de: 'Ich bin Anna.' },
        { en: 'I work at this swimming pool.', de: 'Ich arbeite in diesem Schwimmbad.' },
        { en: "I'm a lifeguard.", de: 'Ich bin Rettungsschwimmer/in (oder: Bademeister/in).' },
        { en: 'I am an apprentice.', de: 'Ich bin Auszubildende/r.' },
        { en: 'How can I help you?', de: 'Wie kann ich Ihnen helfen?' },
      ],
    },
    {
      type: 'vocab',
      title: 'Höflichkeit — die wichtigsten Floskeln',
      items: [
        { en: 'Please.', de: 'Bitte.' },
        { en: 'Thank you. / Thanks.', de: 'Danke.' },
        { en: "You're welcome.", de: 'Gern geschehen.' },
        { en: 'Excuse me, ...', de: 'Entschuldigung, ...' },
        { en: "I'm sorry.", de: 'Es tut mir leid.' },
        { en: 'No problem.', de: 'Kein Problem.' },
        { en: 'Of course.', de: 'Natürlich.' },
        { en: 'Just a moment, please.', de: 'Einen Moment bitte.' },
      ],
    },
    {
      type: 'info',
      variant: 'info',
      title: 'Duzen oder Siezen?',
      bullets: [
        'Englisch hat keine Unterscheidung — „you" ist beides.',
        'Höflich/distanziert wirkt man über Wortwahl: „Could you ..." statt „Can you ...", „please" am Ende, „Sir / Madam" als Anrede (etwas formell, passt zur Kasse).',
        'Mit dem Vornamen reden ist im Englischen normal — keine unhöfliche Respektlosigkeit.',
      ],
    },
    {
      type: 'dialog',
      title: 'Mini-Dialog: Gast kommt an die Kasse',
      setting: 'Samstag Vormittag — eine Touristenfamilie betritt das Bad.',
      lines: [
        { speaker: 'FAB', en: 'Good morning! How can I help you?', de: 'Guten Morgen! Wie kann ich Ihnen helfen?' },
        { speaker: 'Gast', en: 'Hello. Two adults and one child, please.', de: 'Hallo. Zwei Erwachsene und ein Kind, bitte.' },
        { speaker: 'FAB', en: 'How old is the child?', de: 'Wie alt ist das Kind?' },
        { speaker: 'Gast', en: 'She is seven.', de: 'Sie ist sieben.' },
        { speaker: 'FAB', en: 'That will be fourteen euros fifty, please.', de: 'Das macht 14 Euro 50, bitte.' },
        { speaker: 'Gast', en: 'Here you are.', de: 'Bitte schön.' },
        { speaker: 'FAB', en: 'Thank you. Have a nice day!', de: 'Danke. Einen schönen Tag noch!' },
      ],
    },
    {
      type: 'quick-check',
      title: 'Mini-Quiz',
      questions: [
        {
          q: 'Ein Gast kommt um 15 Uhr ins Bad. Welche Begrüßung passt am besten?',
          options: ['Good morning.', 'Good afternoon.', 'Good night.'],
          correct: 1,
          explanation: 'Ab ca. 12 Uhr bis zum Abend passt „Good afternoon". „Good night" ist nur zum Abschied spät abends.',
        },
        {
          q: 'Wie fragst du höflich „Wie kann ich Ihnen helfen?"?',
          options: ['What do you want?', 'How can I help you?', 'What is your problem?'],
          correct: 1,
          explanation: '„How can I help you?" ist der Standard im Kundenkontakt — höflich und offen.',
        },
        {
          q: 'Was ist die neutralste Art, sich vorzustellen?',
          options: ['My name Anna.', "I'm Anna.", 'Me Anna.'],
          correct: 1,
          explanation: '„I\'m Anna" (kurz für „I am Anna") ist idiomatisch. „My name is Anna" geht auch, ist etwas formeller.',
        },
        {
          q: 'Ein Gast sagt „Thank you!" — was antwortest du?',
          options: ["You're welcome.", 'No thank you.', 'Please.'],
          correct: 0,
          explanation: '„You\'re welcome" = „Gern geschehen". „No thank you" würde bedeuten „Nein, danke" — völlig anderer Sinn.',
        },
        {
          q: 'Wie sagst du „Einen Moment bitte" an der Kasse?',
          options: ['One moment, you wait.', 'Just a moment, please.', 'Stop please.'],
          correct: 1,
          explanation: '„Just a moment, please" ist höflich und wird im Kundenkontakt häufig verwendet.',
        },
      ],
    },
  ],
};
