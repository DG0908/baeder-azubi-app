CREATE TYPE "SwimSessionStatus" AS ENUM ('PENDING', 'CONFIRMED', 'REJECTED');

CREATE TABLE "SwimSession" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "distanceMeters" INTEGER NOT NULL,
    "timeMinutes" INTEGER NOT NULL,
    "styleId" TEXT NOT NULL,
    "notes" TEXT,
    "challengeId" TEXT,
    "status" "SwimSessionStatus" NOT NULL DEFAULT 'PENDING',
    "reviewedById" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SwimSession_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "SwimSession_organizationId_status_date_idx" ON "SwimSession"("organizationId", "status", "date");
CREATE INDEX "SwimSession_organizationId_userId_date_idx" ON "SwimSession"("organizationId", "userId", "date");
CREATE INDEX "SwimSession_reviewedById_status_updatedAt_idx" ON "SwimSession"("reviewedById", "status", "updatedAt");

ALTER TABLE "SwimSession"
ADD CONSTRAINT "SwimSession_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "SwimSession"
ADD CONSTRAINT "SwimSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "SwimSession"
ADD CONSTRAINT "SwimSession_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
