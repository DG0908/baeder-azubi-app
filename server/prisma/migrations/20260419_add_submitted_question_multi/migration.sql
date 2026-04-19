-- Enables multi-correct submitted questions.
-- "correct" bleibt bestehen (Single-Choice-Index, wird bei multi=true mit dem ersten Index gespiegelt).
-- Bei multi=true enthaelt "correctIndices" die vollstaendige Menge richtiger Antwort-Indizes.
ALTER TABLE "SubmittedQuestion"
  ADD COLUMN "multi" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "SubmittedQuestion"
  ADD COLUMN "correctIndices" JSONB;
