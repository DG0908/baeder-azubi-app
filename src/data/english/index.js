// English-Modul — Registry aller Lektionen
// Jede Lektion lebt in einer eigenen Datei (lessonN-thema.js) — sauber modular.

import { lessonAlphabet }       from './lesson1-alphabet';
import { lessonNumbersTime }    from './lesson2-numbers-time';
import { lessonGreetings }      from './lesson3-greetings';
import { lessonPoolBasics }     from './lesson4-pool-basics';
import { lessonGuestsTickets }  from './lesson5-guests-tickets';
import { lessonDirections }     from './lesson6-directions';
import { lessonRules }          from './lesson7-rules';
import { lessonFirstAid }       from './lesson8-first-aid';
import { lessonComplaints }     from './lesson9-complaints';
import { lessonTechChemistry }  from './lesson10-tech-chemistry';

export const ENGLISH_LESSONS = {
  [lessonAlphabet.id]:      lessonAlphabet,
  [lessonNumbersTime.id]:   lessonNumbersTime,
  [lessonGreetings.id]:     lessonGreetings,
  [lessonPoolBasics.id]:    lessonPoolBasics,
  [lessonGuestsTickets.id]: lessonGuestsTickets,
  [lessonDirections.id]:    lessonDirections,
  [lessonRules.id]:         lessonRules,
  [lessonFirstAid.id]:      lessonFirstAid,
  [lessonComplaints.id]:    lessonComplaints,
  [lessonTechChemistry.id]: lessonTechChemistry,
};

export const getEnglishLesson = (id) => ENGLISH_LESSONS[id] || null;
