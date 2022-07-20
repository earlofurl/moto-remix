/*
  Warnings:

  - You are about to drop the column `amount_available` on the `Strain` table. All the data in the column will be lost.
  - You are about to drop the column `sold_out_fall` on the `Strain` table. All the data in the column will be lost.
  - You are about to drop the column `sold_out_summer` on the `Strain` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Strain" DROP COLUMN "amount_available",
DROP COLUMN "sold_out_fall",
DROP COLUMN "sold_out_summer",
ADD COLUMN     "fall_quantity_available" DECIMAL(65,30) NOT NULL DEFAULT 0,
ADD COLUMN     "fall_sold_out" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "light_dep_quantity_available" DECIMAL(65,30) NOT NULL DEFAULT 0,
ADD COLUMN     "light_dep_sold_out" BOOLEAN NOT NULL DEFAULT false;
