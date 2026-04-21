-- Monatsberichte fuer Berichtsheft: Trainer weist Taetigkeit zu -> Azubi schreibt -> Trainer zeichnet gegen.
-- Die bestehenden Tagesberichte (ReportBook/ReportEntry) bleiben unveraendert;
-- Monatsberichte landen in einer eigenen Tabelle neben den Tagesberichten.
CREATE TYPE "MonthlyReportStatus" AS ENUM ('ASSIGNED', 'SUBMITTED', 'SIGNED');

CREATE TABLE "MonthlyReport" (
  "id"                  TEXT NOT NULL,
  "organizationId"      TEXT NOT NULL,
  "azubiId"             TEXT NOT NULL,
  "assignedById"        TEXT NOT NULL,
  "year"                INTEGER NOT NULL,
  "month"               INTEGER NOT NULL,
  "activity"            TEXT NOT NULL,
  "activityDescription" TEXT,
  "content"             TEXT,
  "status"              "MonthlyReportStatus" NOT NULL DEFAULT 'ASSIGNED',
  "submittedAt"         TIMESTAMP(3),
  "signedById"          TEXT,
  "signedAt"            TIMESTAMP(3),
  "trainerFeedback"     TEXT,
  "createdAt"           TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"           TIMESTAMP(3) NOT NULL,

  CONSTRAINT "MonthlyReport_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "MonthlyReport_organizationId_azubiId_year_month_key"
  ON "MonthlyReport"("organizationId", "azubiId", "year", "month");

CREATE INDEX "MonthlyReport_organizationId_azubiId_year_month_idx"
  ON "MonthlyReport"("organizationId", "azubiId", "year", "month");

CREATE INDEX "MonthlyReport_organizationId_status_updatedAt_idx"
  ON "MonthlyReport"("organizationId", "status", "updatedAt");

CREATE INDEX "MonthlyReport_signedById_status_updatedAt_idx"
  ON "MonthlyReport"("signedById", "status", "updatedAt");

ALTER TABLE "MonthlyReport"
  ADD CONSTRAINT "MonthlyReport_organizationId_fkey"
  FOREIGN KEY ("organizationId") REFERENCES "Organization"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "MonthlyReport"
  ADD CONSTRAINT "MonthlyReport_azubiId_fkey"
  FOREIGN KEY ("azubiId") REFERENCES "User"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "MonthlyReport"
  ADD CONSTRAINT "MonthlyReport_assignedById_fkey"
  FOREIGN KEY ("assignedById") REFERENCES "User"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "MonthlyReport"
  ADD CONSTRAINT "MonthlyReport_signedById_fkey"
  FOREIGN KEY ("signedById") REFERENCES "User"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;
