-- CreateEnum
CREATE TYPE "Status" AS ENUM ('COMPLETED', 'IN_PROGRESS', 'PADDING', 'CANCELED');

-- DropIndex
DROP INDEX "Organization_email_key";

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'PADDING';

-- AlterTable
ALTER TABLE "UserOrganization" ADD COLUMN     "isSuspended" BOOLEAN NOT NULL DEFAULT false;
