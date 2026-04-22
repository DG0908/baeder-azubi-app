// English-Modul — Registry aller Lektionen
// Weitere Lektionen (A2, B1) werden hier nach und nach ergänzt.

import { lessonAlphabet } from './lesson1-alphabet';
import { lessonNumbersTime } from './lesson2-numbers-time';
import { lessonGreetings } from './lesson3-greetings';
import { lessonPoolBasics } from './lesson4-pool-basics';

export const ENGLISH_LESSONS = {
  [lessonAlphabet.id]: lessonAlphabet,
  [lessonNumbersTime.id]: lessonNumbersTime,
  [lessonGreetings.id]: lessonGreetings,
  [lessonPoolBasics.id]: lessonPoolBasics,
};

export const getEnglishLesson = (id) => ENGLISH_LESSONS[id] || null;
