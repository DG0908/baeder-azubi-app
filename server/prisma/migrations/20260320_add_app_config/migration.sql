CREATE TABLE "AppConfig" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "menuItems" JSONB NOT NULL,
    "themeColors" JSONB NOT NULL,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AppConfig_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "AppConfig_organizationId_key" ON "AppConfig"("organizationId");

ALTER TABLE "AppConfig"
ADD CONSTRAINT "AppConfig_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
