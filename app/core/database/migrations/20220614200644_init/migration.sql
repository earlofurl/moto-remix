-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Strain" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "yield_average" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "terp_average_total" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "terp_1" TEXT NOT NULL DEFAULT E'N/A',
    "terp_1_value" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "terp_2" TEXT NOT NULL DEFAULT E'N/A',
    "terp_2_value" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "terp_3" TEXT NOT NULL DEFAULT E'N/A',
    "terp_3_value" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "terp_4" TEXT NOT NULL DEFAULT E'N/A',
    "terp_4_value" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "terp_5" TEXT NOT NULL DEFAULT E'N/A',
    "terp_5_value" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "thc_average" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "total_cannabinoid_average" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "light_dep_2022" BOOLEAN NOT NULL DEFAULT false,
    "fall_harvest_2022" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Strain_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zip" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "note" TEXT NOT NULL DEFAULT E'',
    "flower" BOOLEAN NOT NULL DEFAULT false,
    "prerolls" BOOLEAN NOT NULL DEFAULT false,
    "pressed_hash" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
