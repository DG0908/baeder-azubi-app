CREATE TYPE "NotificationType" AS ENUM ('INFO', 'SUCCESS', 'WARNING', 'ERROR');

ALTER TABLE "Duel"
ADD COLUMN "reminderSentAt" TIMESTAMP(3);

CREATE TABLE "AppNotification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL DEFAULT 'INFO',
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AppNotification_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "AppNotification_userId_isRead_createdAt_idx" ON "AppNotification"("userId", "isRead", "createdAt");
CREATE INDEX "AppNotification_createdAt_idx" ON "AppNotification"("createdAt");

ALTER TABLE "AppNotification"
ADD CONSTRAINT "AppNotification_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
