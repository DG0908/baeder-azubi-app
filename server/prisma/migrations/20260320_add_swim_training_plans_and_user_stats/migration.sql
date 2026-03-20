-- CreateTable
CREATE TABLE "SwimTrainingPlan" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "assignedUserId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "units" JSONB NOT NULL,
    "xpReward" INTEGER NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SwimTrainingPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserStats" (
    "userId" TEXT NOT NULL,
    "wins" INTEGER NOT NULL DEFAULT 0,
    "losses" INTEGER NOT NULL DEFAULT 0,
    "draws" INTEGER NOT NULL DEFAULT 0,
    "categoryStats" JSONB,
    "opponents" JSONB,
    "winStreak" INTEGER NOT NULL DEFAULT 0,
    "bestWinStreak" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserStats_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "UserXpEvent" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sourceKey" TEXT NOT NULL,
    "eventKey" TEXT,
    "amount" INTEGER NOT NULL,
    "reason" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserXpEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SwimTrainingPlan_organizationId_isActive_createdAt_idx" ON "SwimTrainingPlan"("organizationId", "isActive", "createdAt");

-- CreateIndex
CREATE INDEX "SwimTrainingPlan_assignedUserId_isActive_createdAt_idx" ON "SwimTrainingPlan"("assignedUserId", "isActive", "createdAt");

-- CreateIndex
CREATE INDEX "SwimTrainingPlan_createdById_createdAt_idx" ON "SwimTrainingPlan"("createdById", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "UserXpEvent_eventKey_key" ON "UserXpEvent"("eventKey");

-- CreateIndex
CREATE INDEX "UserXpEvent_userId_createdAt_idx" ON "UserXpEvent"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "UserXpEvent_organizationId_sourceKey_createdAt_idx" ON "UserXpEvent"("organizationId", "sourceKey", "createdAt");

-- AddForeignKey
ALTER TABLE "SwimTrainingPlan" ADD CONSTRAINT "SwimTrainingPlan_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SwimTrainingPlan" ADD CONSTRAINT "SwimTrainingPlan_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SwimTrainingPlan" ADD CONSTRAINT "SwimTrainingPlan_assignedUserId_fkey" FOREIGN KEY ("assignedUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserStats" ADD CONSTRAINT "UserStats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserXpEvent" ADD CONSTRAINT "UserXpEvent_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserXpEvent" ADD CONSTRAINT "UserXpEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
