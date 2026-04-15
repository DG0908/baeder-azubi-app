-- Add unlockedAvatarIds column to User table for admin-grantable sticker avatars
ALTER TABLE "User" ADD COLUMN "unlockedAvatarIds" JSONB;
