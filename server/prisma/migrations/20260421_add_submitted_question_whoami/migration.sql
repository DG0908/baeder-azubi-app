-- Enables "Was bin ich?" (whoami) submissions alongside multiple-choice.
-- "type" unterscheidet 'multiple' (Standard, MCQ) und 'whoami' (Rate-Aufgabe).
-- Bei type='whoami' enthaelt "answers" genau ein Element (die Loesung) und "clues" fuenf Hinweise.
ALTER TABLE "SubmittedQuestion"
  ADD COLUMN "type" TEXT NOT NULL DEFAULT 'multiple';

ALTER TABLE "SubmittedQuestion"
  ADD COLUMN "clues" JSONB;
