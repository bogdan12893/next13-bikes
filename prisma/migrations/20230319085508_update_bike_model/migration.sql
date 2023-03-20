/*
  Warnings:

  - You are about to alter the column `brand` on the `Bike` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - Added the required column `updatedAt` to the `Bike` table without a default value. This is not possible if the table is not empty.
  - Made the column `brand` on table `Bike` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Bike" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "brand" SET NOT NULL,
ALTER COLUMN "brand" SET DATA TYPE VARCHAR(255);
