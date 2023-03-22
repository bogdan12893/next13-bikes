-- DropForeignKey
ALTER TABLE "BikeToCategory" DROP CONSTRAINT "BikeToCategory_bikeId_fkey";

-- AddForeignKey
ALTER TABLE "BikeToCategory" ADD CONSTRAINT "BikeToCategory_bikeId_fkey" FOREIGN KEY ("bikeId") REFERENCES "Bike"("id") ON DELETE CASCADE ON UPDATE CASCADE;
