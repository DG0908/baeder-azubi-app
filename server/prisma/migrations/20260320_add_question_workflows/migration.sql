-- CreateEnum
CREATE TYPE "QuestionReportStatus" AS ENUM ('OPEN', 'RESOLVED');

-- CreateTable
CREATE TABLE "SubmittedQuestion" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "approvedById" TEXT,
    "category" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answers" JSONB NOT NULL,
    "correct" INTEGER NOT NULL,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "approvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubmittedQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionReport" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "reportedById" TEXT NOT NULL,
    "resolvedById" TEXT,
    "questionKey" TEXT NOT NULL,
    "questionText" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "note" TEXT,
    "answers" JSONB NOT NULL,
    "status" "QuestionReportStatus" NOT NULL DEFAULT 'OPEN',
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuestionReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SubmittedQuestion_organizationId_approved_createdAt_idx" ON "SubmittedQuestion"("organizationId", "approved", "createdAt");

-- CreateIndex
CREATE INDEX "SubmittedQuestion_userId_approved_createdAt_idx" ON "SubmittedQuestion"("userId", "approved", "createdAt");

-- CreateIndex
CREATE INDEX "SubmittedQuestion_approvedById_approvedAt_idx" ON "SubmittedQuestion"("approvedById", "approvedAt");

-- CreateIndex
CREATE INDEX "QuestionReport_organizationId_status_createdAt_idx" ON "QuestionReport"("organizationId", "status", "createdAt");

-- CreateIndex
CREATE INDEX "QuestionReport_reportedById_createdAt_idx" ON "QuestionReport"("reportedById", "createdAt");

-- CreateIndex
CREATE INDEX "QuestionReport_resolvedById_resolvedAt_idx" ON "QuestionReport"("resolvedById", "resolvedAt");

-- CreateIndex
CREATE INDEX "QuestionReport_organizationId_questionKey_createdAt_idx" ON "QuestionReport"("organizationId", "questionKey", "createdAt");

-- AddForeignKey
ALTER TABLE "SubmittedQuestion" ADD CONSTRAINT "SubmittedQuestion_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubmittedQuestion" ADD CONSTRAINT "SubmittedQuestion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubmittedQuestion" ADD CONSTRAINT "SubmittedQuestion_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionReport" ADD CONSTRAINT "QuestionReport_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionReport" ADD CONSTRAINT "QuestionReport_reportedById_fkey" FOREIGN KEY ("reportedById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionReport" ADD CONSTRAINT "QuestionReport_resolvedById_fkey" FOREIGN KEY ("resolvedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
