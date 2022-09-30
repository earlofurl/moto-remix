-- CreateEnum
CREATE TYPE "QuantityType" AS ENUM ('CountBased', 'WeightBased');

-- CreateEnum
CREATE TYPE "PackageType" AS ENUM ('Product', 'ImmaturePlant', 'VegetativePlant', 'PlantWaste', 'HarvestWaste');

-- CreateEnum
CREATE TYPE "LabTestingState" AS ENUM ('NotSubmitted', 'SubmittedForTesting', 'TestPassed', 'TestFailed');

-- CreateTable
CREATE TABLE "ProductCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ProductCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "description" TEXT,
    "isUsed" BOOLEAN DEFAULT false,
    "itemTypeId" TEXT,
    "strainId" TEXT,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemType" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "productForm" TEXT,
    "productModifier" TEXT,
    "uomDefaultId" TEXT,
    "productCategoryId" TEXT,

    CONSTRAINT "ItemType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PackageTag" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "tagNumber" TEXT NOT NULL,
    "isAssigned" BOOLEAN DEFAULT false,
    "isProvisional" BOOLEAN DEFAULT true,
    "isActive" BOOLEAN DEFAULT false,

    CONSTRAINT "PackageTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Package" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "tagId" TEXT,
    "packageType" "PackageType" NOT NULL DEFAULT 'Product',
    "quantity" DECIMAL(12,5),
    "notes" TEXT,
    "packagedDateTime" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "harvestDateTime" TIMESTAMP(3),
    "labTestingState" "LabTestingState" DEFAULT 'NotSubmitted',
    "labTestingStateDate" TIMESTAMP(3),
    "isTradeSample" BOOLEAN DEFAULT false,
    "isTestingSample" BOOLEAN DEFAULT false,
    "productRequiresRemediation" BOOLEAN DEFAULT false,
    "containsRemediatedProduct" BOOLEAN DEFAULT false,
    "remediationDate" TIMESTAMP(3),
    "receivedDateTime" TIMESTAMP(3),
    "receivedFromManifestNumber" TEXT,
    "receivedFromFacilityLicenseNumber" TEXT,
    "receivedFromFacilityName" TEXT,
    "isOnHold" BOOLEAN DEFAULT false,
    "archivedDate" TIMESTAMP(3),
    "finishedDate" TIMESTAMP(3),
    "itemId" TEXT,
    "provisionalLabel" TEXT,
    "isProvisional" BOOLEAN DEFAULT false,
    "isSold" BOOLEAN DEFAULT false,
    "ppuDefault" MONEY DEFAULT 0,
    "ppuOnOrder" MONEY DEFAULT 0,
    "totalPackagePriceOnOrder" MONEY DEFAULT 0,
    "ppuSoldPrice" MONEY DEFAULT 0,
    "totalSoldPrice" MONEY DEFAULT 0,
    "packagingSuppliesConsumed" BOOLEAN DEFAULT false,
    "isLineItem" BOOLEAN DEFAULT false,
    "uomId" TEXT,

    CONSTRAINT "Package_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LabTest" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "batchCode" TEXT,
    "testIdCode" TEXT,
    "labFacilityName" TEXT,
    "testPerformedDate" TIMESTAMP(3),
    "overallPassed" BOOLEAN,
    "testTypeName" TEXT,
    "testPassed" BOOLEAN DEFAULT false,
    "testComment" TEXT,
    "thcTotalPercent" DECIMAL(9,5),
    "cbdPercent" DECIMAL(9,5),
    "terpenePercent" DECIMAL(9,5),
    "thcAPercent" DECIMAL(9,5),
    "delta9ThcPercent" DECIMAL(9,5),
    "delta8ThcPercent" DECIMAL(9,5),
    "thcVPercent" DECIMAL(9,5),
    "cbdAPercent" DECIMAL(9,5),
    "cbnPercent" DECIMAL(9,5),
    "cbgAPercent" DECIMAL(9,5),
    "cbgPercent" DECIMAL(9,5),
    "cbcPercent" DECIMAL(9,5),
    "totalCannabinoidsPercent" DECIMAL(9,5),

    CONSTRAINT "LabTest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LabTestsOnPackages" (
    "labTestId" TEXT NOT NULL,
    "packageId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedBy" TEXT,

    CONSTRAINT "LabTestsOnPackages_pkey" PRIMARY KEY ("labTestId","packageId")
);

-- CreateTable
CREATE TABLE "Uom" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "quantityType" "QuantityType" NOT NULL DEFAULT 'WeightBased',
    "name" TEXT,
    "abbreviation" TEXT,

    CONSTRAINT "Uom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_SourcePackagesToSuccessor" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductCategory_name_key" ON "ProductCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_SourcePackagesToSuccessor_AB_unique" ON "_SourcePackagesToSuccessor"("A", "B");

-- CreateIndex
CREATE INDEX "_SourcePackagesToSuccessor_B_index" ON "_SourcePackagesToSuccessor"("B");

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_itemTypeId_fkey" FOREIGN KEY ("itemTypeId") REFERENCES "ItemType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_strainId_fkey" FOREIGN KEY ("strainId") REFERENCES "Strain"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemType" ADD CONSTRAINT "ItemType_uomDefaultId_fkey" FOREIGN KEY ("uomDefaultId") REFERENCES "Uom"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemType" ADD CONSTRAINT "ItemType_productCategoryId_fkey" FOREIGN KEY ("productCategoryId") REFERENCES "ProductCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Package" ADD CONSTRAINT "Package_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "PackageTag"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Package" ADD CONSTRAINT "Package_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Package" ADD CONSTRAINT "Package_uomId_fkey" FOREIGN KEY ("uomId") REFERENCES "Uom"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LabTestsOnPackages" ADD CONSTRAINT "LabTestsOnPackages_labTestId_fkey" FOREIGN KEY ("labTestId") REFERENCES "LabTest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LabTestsOnPackages" ADD CONSTRAINT "LabTestsOnPackages_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SourcePackagesToSuccessor" ADD CONSTRAINT "_SourcePackagesToSuccessor_A_fkey" FOREIGN KEY ("A") REFERENCES "Package"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SourcePackagesToSuccessor" ADD CONSTRAINT "_SourcePackagesToSuccessor_B_fkey" FOREIGN KEY ("B") REFERENCES "Package"("id") ON DELETE CASCADE ON UPDATE CASCADE;
