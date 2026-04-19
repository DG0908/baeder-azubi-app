-- Adds server-authoritative fields for keyword/whoami duel answers.
-- Backfills existing single-choice rows: answerType='single', points=CASE WHEN isCorrect THEN 1 ELSE 0 END.
ALTER TABLE "DuelAnswer"
  ADD COLUMN "answerType" TEXT NOT NULL DEFAULT 'single',
  ADD COLUMN "keywordText" TEXT,
  ADD COLUMN "points" INTEGER NOT NULL DEFAULT 0;

UPDATE "DuelAnswer"
SET "points" = CASE WHEN "isCorrect" THEN 1 ELSE 0 END
WHERE "points" = 0;
