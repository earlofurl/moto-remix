/*
  Warnings:

  - You are about to drop the column `is_available` on the `Strain` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Strain" DROP COLUMN "is_available",
ADD COLUMN     "sold_out_fall" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "sold_out_summer" BOOLEAN NOT NULL DEFAULT false;
