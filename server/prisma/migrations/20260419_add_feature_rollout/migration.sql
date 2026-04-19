-- AlterTable: User gets beta-tester flag and per-user feature overrides
ALTER TABLE "User" ADD COLUMN "isBetaTester" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "User" ADD COLUMN "featureOverrides" JSONB;

-- AlterTable: AppConfig stores per-organization feature rollout stages
ALTER TABLE "AppConfig" ADD COLUMN "featureStages" JSONB NOT NULL DEFAULT '{}';
