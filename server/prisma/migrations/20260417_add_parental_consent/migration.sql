-- CreateEnum
CREATE TYPE "ParentalConsentStatus" AS ENUM ('NOT_REQUIRED', 'PENDING', 'VERIFIED', 'REJECTED');

-- AlterTable
ALTER TABLE "User" ADD COLUMN "parentalConsentStatus" "ParentalConsentStatus" NOT NULL DEFAULT 'NOT_REQUIRED';
ALTER TABLE "User" ADD COLUMN "parentalConsentNote" TEXT;
ALTER TABLE "User" ADD COLUMN "parentalConsentVerifiedAt" TIMESTAMP(3);
ALTER TABLE "User" ADD COLUMN "parentalConsentVerifiedById" TEXT;
