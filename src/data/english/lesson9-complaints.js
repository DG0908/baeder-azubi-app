// English B1 — Lesson 9: Beschwerden & schwierige Gespräche

export const lessonComplaints = {
  id: 'english-b1-complaints',
  title: 'Beschwerden & schwierige Gespräche',
  level: 'B1',
  icon: '💬',
  estimatedMinutes: 20,
  intro:
    'Manchmal sind Gäste unzufrieden, aufgebracht oder versuchen, sich Vorteile zu erschleichen. Mit den richtigen Phrasen bleibst du auch unter Druck professionell — von der einfachen Reklamation bis zum Hausverbot. Deeskalation auf Englisch funktioniert wie auf Deutsch: ruhig zuhören, anerkennen, Lösung anbieten.',
  sections: [
    {
      type: 'vocab',
      title: 'Beschwerde annehmen',
      items: [
        { en: 'How can I help you?', de: 'Wie kann ich Ihnen helfen?' },
        { en: "I'm sorry to hear that.", de: 'Tut mir leid, das zu hören.' },
        { en: 'Could you tell me what happened?', de: 'Können Sie mir erzählen, was passiert ist?' },
        { en: 'I understand your frustration.', de: 'Ich verstehe Ihren Ärger.' },
        { en: 'Let me see what I can do.', de: 'Lassen Sie mich sehen, was ich tun kann.' },
        { en: "I'll look into it right away.", de: 'Ich kümmere mich sofort darum.' },
        { en: 'Thank you for letting us know.', de: 'Danke, dass Sie uns Bescheid geben.' },
      ],
    },
    {
      type: 'dialog',
      title: 'Mini-Dialog: Spind kaputt',
      setting: 'Eine Frau kommt aufgebracht zur Rezeption.',
      lines: [
        { speaker: 'Gast', en: "Excuse me, my locker won't open. I can't get to my clothes!", de: 'Entschuldigung, mein Spind geht nicht auf. Ich komme nicht an meine Sachen!' },
        { speaker: 'FAB', en: "I'm sorry to hear that. Which locker number?", de: 'Tut mir leid. Welche Spindnummer?' },
        { speaker: 'Gast', en: 'Number 47.', de: 'Nummer 47.' },
        { speaker: 'FAB', en: 'OK, I have a master key. Let me come with you.', de: 'OK, ich habe einen Generalschlüssel. Ich komme mit Ihnen mit.' },
        { speaker: 'Gast', en: 'Thank you so much. I was getting worried.', de: 'Vielen Dank. Ich hatte mir schon Sorgen gemacht.' },
        { speaker: 'FAB', en: "No problem. Let's go.", de: 'Kein Problem. Gehen wir.' },
      ],
    },
    {
      type: 'vocab',
      title: 'Anerkennen ohne Schuld zu übernehmen',
      items: [
        { en: 'I can see why that is frustrating.', de: 'Ich sehe, warum das frustrierend ist.' },
        { en: 'You are right that this should not happen.', de: 'Sie haben recht, das sollte nicht passieren.' },
        { en: "I'm sorry for the inconvenience.", de: 'Tut mir leid für die Unannehmlichkeit.' },
        { en: 'Let me look into this for you.', de: 'Ich schaue das gleich für Sie nach.' },
        { en: "Unfortunately, that's not something I can change.", de: 'Leider kann ich das nicht ändern.' },
        { en: "I'll talk to my supervisor about this.", de: 'Ich spreche mit meinem Vorgesetzten darüber.' },
      ],
    },
    {
      type: 'dialog',
      title: 'Mini-Dialog: Wasserqualität-Reklamation',
      setting: 'Ein Gast beschwert sich über Augenbrennen.',
      lines: [
        { speaker: 'Gast', en: "The water is burning my eyes. There's way too much chlorine!", de: 'Das Wasser brennt in den Augen. Da ist viel zu viel Chlor drin!' },
        { speaker: 'FAB', en: "I'm sorry to hear that. Actually, the chlorine smell often comes from too LITTLE active chlorine, not too much.", de: 'Tut mir leid. Der Chlorgeruch kommt eigentlich von zu WENIG aktivem Chlor, nicht zu viel.' },
        { speaker: 'Gast', en: "Really? It smells very strong.", de: 'Wirklich? Es riecht sehr stark.' },
        { speaker: 'FAB', en: "Yes, that smell is from chloramines — they form when chlorine reacts with sweat or sunscreen. We measured the values an hour ago and they were within the legal limits.", de: 'Ja, der Geruch kommt von Chloraminen — die entstehen, wenn Chlor mit Schweiß oder Sonnencreme reagiert. Wir haben die Werte vor einer Stunde gemessen, sie waren im erlaubten Bereich.' },
        { speaker: 'Gast', en: "OK, that makes sense. Thanks for explaining.", de: 'OK, das macht Sinn. Danke für die Erklärung.' },
        { speaker: 'FAB', en: "If you'd like, I can show you our official water test results — they're public.", de: 'Wenn Sie möchten, zeige ich Ihnen unsere offiziellen Wasserwerte — die sind öffentlich.' },
      ],
    },
    {
      type: 'vocab',
      title: 'Erstattung & Wiedergutmachung',
      items: [
        { en: 'Can I get a refund?', de: 'Kann ich mein Geld zurückbekommen?' },
        { en: "I'm afraid I cannot refund this.", de: 'Leider kann ich das nicht erstatten.' },
        { en: 'I can offer you a free entry next time.', de: 'Ich kann Ihnen einen Freibesuch beim nächsten Mal anbieten.' },
        { en: 'Let me give you a voucher.', de: 'Ich gebe Ihnen einen Gutschein.' },
        { en: "I'll need to ask my supervisor.", de: 'Ich muss meine/n Vorgesetzte/n fragen.' },
        { en: 'Please fill in this complaint form.', de: 'Bitte füllen Sie dieses Beschwerdeformular aus.' },
        { en: 'We will get back to you within 7 days.', de: 'Wir melden uns innerhalb von 7 Tagen.' },
      ],
    },
    {
      type: 'dialog',
      title: 'Mini-Dialog: Hausverbot androhen',
      setting: 'Ein aggressiver Gast hat wiederholt Regeln gebrochen.',
      lines: [
        { speaker: 'FAB', en: "Sir, this is the third time I've asked you to stop.", de: 'Mein Herr, das ist das dritte Mal, dass ich Sie auffordere aufzuhören.' },
        { speaker: 'Gast', en: "What's the problem? I'm just having fun!", de: 'Was ist das Problem? Ich habe nur Spaß!' },
        { speaker: 'FAB', en: 'Your behaviour is disturbing other guests and creating a safety risk. If you continue, I will have to ask you to leave.', de: 'Ihr Verhalten stört andere Gäste und ist ein Sicherheitsrisiko. Wenn Sie weitermachen, muss ich Sie bitten zu gehen.' },
        { speaker: 'Gast', en: 'You can\'t throw me out. I paid!', de: 'Sie können mich nicht rauswerfen. Ich habe bezahlt!' },
        { speaker: 'FAB', en: 'Yes, we can — it is in our house rules. I can refund your ticket, but you have to leave now.', de: 'Doch, wir können — das steht in der Hausordnung. Ich erstatte Ihr Ticket, aber Sie müssen jetzt gehen.' },
        { speaker: 'FAB', en: 'My supervisor will come and explain the next steps.', de: 'Mein Vorgesetzter kommt gleich und erklärt das weitere Vorgehen.' },
      ],
    },
    {
      type: 'info',
      variant: 'tip',
      title: 'Deeskalation — die LEAP-Methode',
      bullets: [
        'L = Listen — Den Gast ausreden lassen, nicht unterbrechen.',
        'E = Empathy — Mitgefühl zeigen: „I can see why this is frustrating."',
        'A = Acknowledge — Anerkennen, ohne Schuld zu übernehmen: „You are right that this should not happen."',
        'P = Partner — Lösung gemeinsam suchen: „Let me see what I can do."',
        'Funktioniert international — auch unter Druck.',
      ],
    },
    {
      type: 'vocab',
      title: 'Phrasen für die Polizei / Sicherheit rufen',
      items: [
        { en: 'I will call security.', de: 'Ich rufe den Sicherheitsdienst.' },
        { en: 'I will call the police if necessary.', de: 'Ich rufe wenn nötig die Polizei.' },
        { en: 'Please leave the building immediately.', de: 'Bitte verlassen Sie das Gebäude sofort.' },
        { en: 'You are no longer welcome here.', de: 'Sie sind hier nicht mehr willkommen.' },
        { en: 'My manager will handle this.', de: 'Mein Vorgesetzter übernimmt das.' },
      ],
    },
    {
      type: 'info',
      variant: 'warning',
      title: 'Wann eskalieren?',
      bullets: [
        'Bei körperlichen Drohungen: SOFORT Vorgesetzten + Polizei.',
        'Bei Belästigung anderer Gäste: SOFORT eingreifen.',
        'Bei Sicherheitsgefahr (Sprung in flaches Wasser, Gewalt): SOFORT Becken räumen.',
        'Bei verbalen Beleidigungen gegen dich: nicht persönlich nehmen, ruhig bleiben, Vorgesetzten holen.',
        'Niemals allein mit aggressivem Gast — immer Zeugen / zweite Person dazu rufen.',
      ],
    },
    {
      type: 'quick-check',
      title: 'Mini-Quiz',
      questions: [
        {
          q: 'Wie zeigst du Mitgefühl ohne Schuld zu übernehmen?',
          options: [
            "It's all our fault, sorry!",
            'I can see why that is frustrating.',
            "It's not my problem.",
          ],
          correct: 1,
          explanation: '„I can see why that is frustrating" zeigt Empathie ohne juristische Schuldanerkennung.',
        },
        {
          q: 'Welche Reihenfolge entspricht der LEAP-Methode?',
          options: [
            'Listen → Empathy → Acknowledge → Partner',
            'Argue → Refuse → Threaten → Call police',
            'Apologize → Refund → Promise → Forget',
          ],
          correct: 0,
          explanation: 'LEAP = Listen, Empathy, Acknowledge, Partner. Internationale Deeskalations­methode.',
        },
        {
          q: 'Ein Gast verlangt aggressiv eine Erstattung. Was ist deine erste Antwort?',
          options: [
            'No way!',
            "I'll need to ask my supervisor.",
            "Calm down!",
          ],
          correct: 1,
          explanation: 'Niemals direkt ablehnen oder „calm down" sagen — das eskaliert. „I\'ll ask my supervisor" zeigt Servicebereitschaft.',
        },
        {
          q: 'Wie sagst du „Ich rufe die Polizei wenn nötig"?',
          options: [
            'I call police!',
            'I will call the police if necessary.',
            'Police comes!',
          ],
          correct: 1,
          explanation: 'Die volle Phrase wirkt souverän. Drohung mit „if necessary" lässt Tür für Deeskalation offen.',
        },
        {
          q: 'Wann holst du SOFORT den Vorgesetzten?',
          options: [
            'Bei jeder Beschwerde.',
            'Bei körperlichen Drohungen oder Sicherheitsgefahr.',
            'Wenn der Gast unhöflich ist.',
          ],
          correct: 1,
          explanation: 'Bei körperlichen Drohungen / Sicherheitsgefahr immer Vorgesetzte/r + ggf. Polizei. Normale Beschwerden selbst lösen.',
        },
      ],
    },
  ],
};
