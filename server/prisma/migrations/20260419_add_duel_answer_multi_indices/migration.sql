-- Adds server-authoritative field for multi-select duel answers.
-- Existing rows default to empty array; they were single/keyword/whoami.
ALTER TABLE "DuelAnswer"
  ADD COLUMN "selectedOptionIndices" INTEGER[] NOT NULL DEFAULT ARRAY[]::INTEGER[];
