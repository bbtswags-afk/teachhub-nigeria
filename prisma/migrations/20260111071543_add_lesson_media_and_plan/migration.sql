-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN "lessonPlan" TEXT;

-- CreateTable
CREATE TABLE "LessonMedia" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "lessonId" TEXT NOT NULL,
    CONSTRAINT "LessonMedia_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
