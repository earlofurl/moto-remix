/*
  Warnings:

  - You are about to drop the column `fall_quantity_available` on the `Strain` table. All the data in the column will be lost.
  - You are about to drop the column `fall_sold_out` on the `Strain` table. All the data in the column will be lost.
  - You are about to drop the column `light_dep_quantity_available` on the `Strain` table. All the data in the column will be lost.
  - You are about to drop the column `light_dep_sold_out` on the `Strain` table. All the data in the column will be lost.
  - The `light_dep_2022` column on the `Strain` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `fall_harvest_2022` column on the `Strain` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Availability" AS ENUM ('TRUE', 'FALSE', 'SOLD_OUT');

-- AlterTable
ALTER TABLE "Strain" DROP COLUMN "fall_quantity_available",
DROP COLUMN "fall_sold_out",
DROP COLUMN "light_dep_quantity_available",
DROP COLUMN "light_dep_sold_out",
ADD COLUMN     "quantity_available" DECIMAL(65,30) NOT NULL DEFAULT 0,
DROP COLUMN "light_dep_2022",
ADD COLUMN     "light_dep_2022" "Availability" NOT NULL DEFAULT 'FALSE',
DROP COLUMN "fall_harvest_2022",
ADD COLUMN     "fall_harvest_2022" "Availability" NOT NULL DEFAULT 'FALSE';
