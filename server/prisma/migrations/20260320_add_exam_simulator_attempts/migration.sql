-- CreateTable
CREATE TABLE "TheoryExamSession" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "keywordMode" BOOLEAN NOT NULL DEFAULT false,
    "questions" JSONB NOT NULL,
    "totalQuestions" INTEGER NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TheoryExamSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TheoryExamAttempt" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "correct" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "percentage" INTEGER NOT NULL,
    "passed" BOOLEAN NOT NULL,
    "timeMs" INTEGER NOT NULL,
    "keywordMode" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TheoryExamAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PracticalExamAttempt" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "examType" TEXT NOT NULL,
    "averageGrade" DOUBLE PRECISION,
    "gradedCount" INTEGER NOT NULL,
    "passed" BOOLEAN,
    "missingTables" INTEGER NOT NULL DEFAULT 0,
    "resultRows" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PracticalExamAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TheoryExamSession_organizationId_userId_completedAt_idx" ON "TheoryExamSession"("organizationId", "userId", "completedAt");

-- CreateIndex
CREATE INDEX "TheoryExamSession_userId_expiresAt_idx" ON "TheoryExamSession"("userId", "expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "TheoryExamAttempt_sessionId_key" ON "TheoryExamAttempt"("sessionId");

-- CreateIndex
CREATE INDEX "TheoryExamAttempt_organizationId_userId_createdAt_idx" ON "TheoryExamAttempt"("organizationId", "userId", "createdAt");

-- CreateIndex
CREATE INDEX "TheoryExamAttempt_organizationId_createdAt_idx" ON "TheoryExamAttempt"("organizationId", "createdAt");

-- CreateIndex
CREATE INDEX "PracticalExamAttempt_organizationId_userId_createdAt_idx" ON "PracticalExamAttempt"("organizationId", "userId", "createdAt");

-- CreateIndex
CREATE INDEX "PracticalExamAttempt_organizationId_createdById_createdAt_idx" ON "PracticalExamAttempt"("organizationId", "createdById", "createdAt");

-- CreateIndex
CREATE INDEX "PracticalExamAttempt_organizationId_examType_createdAt_idx" ON "PracticalExamAttempt"("organizationId", "examType", "createdAt");

-- AddForeignKey
ALTER TABLE "TheoryExamSession" ADD CONSTRAINT "TheoryExamSession_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TheoryExamSession" ADD CONSTRAINT "TheoryExamSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TheoryExamAttempt" ADD CONSTRAINT "TheoryExamAttempt_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TheoryExamAttempt" ADD CONSTRAINT "TheoryExamAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TheoryExamAttempt" ADD CONSTRAINT "TheoryExamAttempt_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "TheoryExamSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PracticalExamAttempt" ADD CONSTRAINT "PracticalExamAttempt_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PracticalExamAttempt" ADD CONSTRAINT "PracticalExamAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PracticalExamAttempt" ADD CONSTRAINT "PracticalExamAttempt_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
