/*
  Warnings:

  - You are about to drop the column `type` on the `Bike` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Bike" DROP COLUMN "type";

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BikeToCategory" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_BikeToCategory_AB_unique" ON "_BikeToCategory"("A", "B");

-- CreateIndex
CREATE INDEX "_BikeToCategory_B_index" ON "_BikeToCategory"("B");

-- AddForeignKey
ALTER TABLE "_BikeToCategory" ADD CONSTRAINT "_BikeToCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "Bike"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BikeToCategory" ADD CONSTRAINT "_BikeToCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
