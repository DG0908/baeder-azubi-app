CREATE TABLE "SchoolAttendanceEntry" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "date" TIMESTAMP(3) NOT NULL,
  "startTime" TEXT NOT NULL,
  "endTime" TEXT NOT NULL,
  "teacherSignature" TEXT,
  "trainerSignature" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "SchoolAttendanceEntry_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ExamGrade" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "date" TIMESTAMP(3) NOT NULL,
  "subject" TEXT NOT NULL,
  "topic" TEXT NOT NULL,
  "grade" DOUBLE PRECISION NOT NULL,
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "ExamGrade_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "SchoolAttendanceEntry_organizationId_userId_date_idx"
  ON "SchoolAttendanceEntry"("organizationId", "userId", "date");
CREATE INDEX "SchoolAttendanceEntry_userId_createdAt_idx"
  ON "SchoolAttendanceEntry"("userId", "createdAt");

CREATE INDEX "ExamGrade_organizationId_userId_date_idx"
  ON "ExamGrade"("organizationId", "userId", "date");
CREATE INDEX "ExamGrade_userId_createdAt_idx"
  ON "ExamGrade"("userId", "createdAt");

ALTER TABLE "SchoolAttendanceEntry"
  ADD CONSTRAINT "SchoolAttendanceEntry_organizationId_fkey"
  FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "SchoolAttendanceEntry"
  ADD CONSTRAINT "SchoolAttendanceEntry_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ExamGrade"
  ADD CONSTRAINT "ExamGrade_organizationId_fkey"
  FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "ExamGrade"
  ADD CONSTRAINT "ExamGrade_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
