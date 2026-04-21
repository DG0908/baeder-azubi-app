-- Enables custom forum categories that admins can create at runtime.
-- Built-in categories (updates/wuensche/fragen/ausbilder/azubi/nuetzliches) bleiben hart kodiert;
-- nur neue Kategorien landen in dieser Tabelle.
CREATE TABLE "ForumCategorySetting" (
  "id"             TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "createdById"    TEXT NOT NULL,
  "slug"           TEXT NOT NULL,
  "name"           TEXT NOT NULL,
  "icon"           TEXT NOT NULL,
  "colorKey"       TEXT NOT NULL DEFAULT 'slate',
  "description"    TEXT,
  "order"          INTEGER NOT NULL DEFAULT 100,
  "createdAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"      TIMESTAMP(3) NOT NULL,

  CONSTRAINT "ForumCategorySetting_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ForumCategorySetting_organizationId_slug_key"
  ON "ForumCategorySetting"("organizationId", "slug");

CREATE INDEX "ForumCategorySetting_organizationId_order_idx"
  ON "ForumCategorySetting"("organizationId", "order");

ALTER TABLE "ForumCategorySetting"
  ADD CONSTRAINT "ForumCategorySetting_organizationId_fkey"
  FOREIGN KEY ("organizationId") REFERENCES "Organization"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "ForumCategorySetting"
  ADD CONSTRAINT "ForumCategorySetting_createdById_fkey"
  FOREIGN KEY ("createdById") REFERENCES "User"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
