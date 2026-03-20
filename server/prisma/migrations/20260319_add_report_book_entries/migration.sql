CREATE TYPE "ReportBookStatus" AS ENUM ('DRAFT', 'SUBMITTED');

ALTER TABLE "User"
ADD COLUMN "canSignReports" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "reportBookProfile" JSONB;

CREATE TABLE "ReportBookEntry" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "assignedTrainerId" TEXT,
    "assignedById" TEXT,
    "weekStart" TIMESTAMP(3) NOT NULL,
    "weekEnd" TIMESTAMP(3) NOT NULL,
    "trainingYear" INTEGER NOT NULL,
    "evidenceNumber" INTEGER NOT NULL,
    "entries" JSONB NOT NULL,
    "apprenticeNote" TEXT,
    "trainerNote" TEXT,
    "apprenticeSignature" TEXT,
    "trainerSignature" TEXT,
    "apprenticeSignedAt" TIMESTAMP(3),
    "trainerSignedAt" TIMESTAMP(3),
    "totalHours" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" "ReportBookStatus" NOT NULL DEFAULT 'DRAFT',
    "submittedAt" TIMESTAMP(3),
    "assignedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReportBookEntry_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ReportBookEntry_organizationId_userId_weekStart_key" ON "ReportBookEntry"("organizationId", "userId", "weekStart");
CREATE INDEX "ReportBookEntry_organizationId_userId_status_weekStart_idx" ON "ReportBookEntry"("organizationId", "userId", "status", "weekStart");
CREATE INDEX "ReportBookEntry_organizationId_status_updatedAt_idx" ON "ReportBookEntry"("organizationId", "status", "updatedAt");
CREATE INDEX "ReportBookEntry_assignedTrainerId_status_updatedAt_idx" ON "ReportBookEntry"("assignedTrainerId", "status", "updatedAt");

ALTER TABLE "ReportBookEntry"
ADD CONSTRAINT "ReportBookEntry_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "ReportBookEntry"
ADD CONSTRAINT "ReportBookEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ReportBookEntry"
ADD CONSTRAINT "ReportBookEntry_assignedTrainerId_fkey" FOREIGN KEY ("assignedTrainerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "ReportBookEntry"
ADD CONSTRAINT "ReportBookEntry_assignedById_fkey" FOREIGN KEY ("assignedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
