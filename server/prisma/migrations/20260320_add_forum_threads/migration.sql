CREATE TABLE "ForumPost" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "pinned" BOOLEAN NOT NULL DEFAULT false,
    "locked" BOOLEAN NOT NULL DEFAULT false,
    "lastReplyAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ForumPost_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ForumReply" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ForumReply_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ForumPost_organizationId_category_pinned_createdAt_idx" ON "ForumPost"("organizationId", "category", "pinned", "createdAt");
CREATE INDEX "ForumPost_organizationId_category_lastReplyAt_idx" ON "ForumPost"("organizationId", "category", "lastReplyAt");
CREATE INDEX "ForumPost_userId_createdAt_idx" ON "ForumPost"("userId", "createdAt");

CREATE INDEX "ForumReply_postId_createdAt_idx" ON "ForumReply"("postId", "createdAt");
CREATE INDEX "ForumReply_organizationId_createdAt_idx" ON "ForumReply"("organizationId", "createdAt");
CREATE INDEX "ForumReply_userId_createdAt_idx" ON "ForumReply"("userId", "createdAt");

ALTER TABLE "ForumPost"
ADD CONSTRAINT "ForumPost_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "ForumPost"
ADD CONSTRAINT "ForumPost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ForumReply"
ADD CONSTRAINT "ForumReply_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "ForumReply"
ADD CONSTRAINT "ForumReply_postId_fkey" FOREIGN KEY ("postId") REFERENCES "ForumPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ForumReply"
ADD CONSTRAINT "ForumReply_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
