/*
  Warnings:

  - Added the required column `model` to the `Bike` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Bike" ADD COLUMN     "model" TEXT NOT NULL;
