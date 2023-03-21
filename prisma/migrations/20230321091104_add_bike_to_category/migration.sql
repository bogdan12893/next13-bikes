/*
  Warnings:

  - You are about to drop the `_BikeToCategory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_BikeToCategory" DROP CONSTRAINT "_BikeToCategory_A_fkey";

-- DropForeignKey
ALTER TABLE "_BikeToCategory" DROP CONSTRAINT "_BikeToCategory_B_fkey";

-- DropTable
DROP TABLE "_BikeToCategory";

-- CreateTable
CREATE TABLE "BikeToCategory" (
    "bikeId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BikeToCategory_pkey" PRIMARY KEY ("bikeId","categoryId")
);

-- AddForeignKey
ALTER TABLE "BikeToCategory" ADD CONSTRAINT "BikeToCategory_bikeId_fkey" FOREIGN KEY ("bikeId") REFERENCES "Bike"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BikeToCategory" ADD CONSTRAINT "BikeToCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
