-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('STARTER', 'PRO');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "riderType" "AccountType" NOT NULL DEFAULT 'STARTER';
