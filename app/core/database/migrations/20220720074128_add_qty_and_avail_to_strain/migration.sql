-- AlterTable
ALTER TABLE "Strain" ADD COLUMN     "amount_available" DECIMAL(65,30) NOT NULL DEFAULT 0,
ADD COLUMN     "is_available" BOOLEAN NOT NULL DEFAULT false;
