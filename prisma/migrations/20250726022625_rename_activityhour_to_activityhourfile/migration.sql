/*
  Warnings:

  - You are about to drop the `ActivityHour` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ActivityHour" DROP CONSTRAINT "ActivityHour_projectId_fkey";

-- DropForeignKey
ALTER TABLE "ActivityHour" DROP CONSTRAINT "ActivityHour_userId_fkey";

-- DropTable
DROP TABLE "ActivityHour";

-- CreateTable
CREATE TABLE "ActivityHourFile" (
    "id" TEXT NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "fileNamePrinciple" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "projectId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ActivityHourFile_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ActivityHourFile" ADD CONSTRAINT "ActivityHourFile_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityHourFile" ADD CONSTRAINT "ActivityHourFile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
