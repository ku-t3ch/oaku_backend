/*
  Warnings:

  - The `targetUser` column on the `Project` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `participants` column on the `Project` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "documentFiles" TEXT,
DROP COLUMN "targetUser",
ADD COLUMN     "targetUser" INTEGER,
DROP COLUMN "participants",
ADD COLUMN     "participants" INTEGER;
