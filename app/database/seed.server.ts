// No longer necessary to seed user because all auth is handled by Supabase
// Keep this file around in case we need to seed other data in the future

import type { PackageTag } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";

import { SUPABASE_SERVICE_ROLE, SUPABASE_URL } from "~/utils/env";

if (!SUPABASE_URL) {
  throw new Error("SUPABASE_URL is not set");
}

if (!SUPABASE_SERVICE_ROLE) {
  throw new Error("SUPABASE_SERVICE_ROLE is not set");
}

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE, {
  autoRefreshToken: false,
  persistSession: false,
});

const prisma = new PrismaClient();

const generatedTags: Array<PackageTag> = [];
for (let i = 10; i < 100; i++) {
  generatedTags.push({
    id: `0fb460bf-974c-4e44-a7b3-efd41ca8bd27-${i}`,
    tagNumber: `1A4010300016BAD0000145${i}`,
    isAssigned: false,
    isActive: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    isProvisional: false,
  });
}

async function seed() {
  // Create tags
  await prisma.packageTag.createMany({
    data: generatedTags,
  });

  // Create uom entries
  const uomPounds = await prisma.uom.create({
    data: {
      quantityType: "WeightBased",
      name: "Pounds",
      abbreviation: "lb",
    },
  });
  const uomGrams = await prisma.uom.create({
    data: {
      quantityType: "WeightBased",
      name: "Grams",
      abbreviation: "g",
    },
  });
  const uomEach = await prisma.uom.create({
    data: {
      quantityType: "CountBased",
      name: "Each",
      abbreviation: "ea",
    },
  });

  // Create product category entries
  const productCategory1 = await prisma.productCategory.create({
    data: {
      name: "Buds",
    },
  });
  const productCategory2 = await prisma.productCategory.create({
    data: {
      name: "Buds (by strain)",
    },
  });
  const productCategory3 = await prisma.productCategory.create({
    data: {
      name: "Concentrate",
    },
  });
  const productCategory4 = await prisma.productCategory.create({
    data: {
      name: "Concentrate(each)",
    },
  });
  const productCategory5 = await prisma.productCategory.create({
    data: {
      name: "Non-Infused (Plain) Pre-Roll",
    },
  });
  const productCategory6 = await prisma.productCategory.create({
    data: {
      name: "Shake/Trim",
    },
  });
  const productCategory7 = await prisma.productCategory.create({
    data: {
      name: "Shake/Trim (by strain)",
    },
  });
  const productCategory8 = await prisma.productCategory.create({
    data: {
      name: "Waste",
    },
  });

  // Create ItemType entries
  const flowerUnsorted = await prisma.itemType.create({
    data: {
      productForm: "Flower",
      productModifier: "Unsorted",
      uomDefault: {
        connect: {
          id: uomPounds.id,
        },
      },
      productCategory: {
        connect: {
          id: productCategory1.id,
        },
      },
    },
  });
  const flowerA = await prisma.itemType.create({
    data: {
      productForm: "Flower",
      productModifier: "A bud",
      uomDefault: {
        connect: {
          id: uomPounds.id,
        },
      },
      productCategory: {
        connect: {
          id: productCategory1.id,
        },
      },
    },
  });
  const flowerB = await prisma.itemType.create({
    data: {
      productForm: "Flower",
      productModifier: "B bud",
      uomDefault: {
        connect: {
          id: uomPounds.id,
        },
      },
      productCategory: {
        connect: {
          id: productCategory1.id,
        },
      },
    },
  });
  const prerollSingle = await prisma.itemType.create({
    data: {
      productForm: "Preroll",
      productModifier: "Single",
      uomDefault: {
        connect: {
          id: uomEach.id,
        },
      },
      productCategory: {
        connect: {
          id: productCategory5.id,
        },
      },
    },
  });
  const prerollTwoPack = await prisma.itemType.create({
    data: {
      productForm: "Preroll",
      productModifier: "TwoPack",
      uomDefault: {
        connect: {
          id: uomEach.id,
        },
      },
      productCategory: {
        connect: {
          id: productCategory5.id,
        },
      },
    },
  });

  // Create Item entries
  const phkFlower = await prisma.item.create({
    data: {
      itemType: {
        connect: {
          id: flowerUnsorted.id,
        },
      },
      strain: {
        connect: { id: "cl44sol5b00252a66vw8ybk3m" },
      },
    },
  });

  const phkAbud = await prisma.item.create({
    data: {
      itemType: {
        connect: {
          id: flowerA.id,
        },
      },
      strain: {
        connect: { id: "cl44sol5b00252a66vw8ybk3m" },
      },
    },
  });

  const phkBbud = await prisma.item.create({
    data: {
      itemType: {
        connect: {
          id: flowerB.id,
        },
      },
      strain: {
        connect: { id: "cl44sol5b00252a66vw8ybk3m" },
      },
    },
  });

  const phkPRsingle = await prisma.item.create({
    data: {
      itemType: {
        connect: {
          id: prerollSingle.id,
        },
      },
      strain: {
        connect: { id: "cl44sol5b00252a66vw8ybk3m" },
      },
    },
  });

  const phkPRtwoPack = await prisma.item.create({
    data: {
      itemType: {
        connect: {
          id: prerollTwoPack.id,
        },
      },
      strain: {
        connect: { id: "cl44sol5b00252a66vw8ybk3m" },
      },
    },
  });

  const wappaFlower = await prisma.item.create({
    data: {
      itemType: {
        connect: {
          id: flowerUnsorted.id,
        },
      },
      strain: {
        connect: { id: "cl44sp7ji002p2a66m5za210o" },
      },
    },
  });

  const wappaPRsingle = await prisma.item.create({
    data: {
      itemType: {
        connect: {
          id: prerollSingle.id,
        },
      },
      strain: {
        connect: { id: "cl44sp7ji002p2a66m5za210o" },
      },
    },
  });

  const wappaPRtwoPack = await prisma.item.create({
    data: {
      itemType: {
        connect: {
          id: prerollTwoPack.id,
        },
      },
      strain: {
        connect: { id: "cl44sp7ji002p2a66m5za210o" },
      },
    },
  });

  const gmoFlower = await prisma.item.create({
    data: {
      itemType: {
        connect: {
          id: flowerUnsorted.id,
        },
      },
      strain: {
        connect: { id: "cl44snbza000z2a66khnv5m3c" },
      },
    },
  });

  // Create LabTest entries
  const phkLabTest = await prisma.labTest.create({
    data: {
      labFacilityName: "Juniper Analytics LLC",
      testIdCode: "20JA0666.01",
      testPerformedDate: "2020-01-01T00:00:00-05:00",
      batchCode: "22-M-A",
      overallPassed: true,
      testTypeName: "Flower Full Compliance",
      testPassed: true,
      testComment: "This is a comment about Flower Full Compliance",
      thcTotalPercent: 31,
      cbdPercent: 0.012,
      terpenePercent: 3.42,
      delta9ThcPercent: 0,
      delta8ThcPercent: 0,
      cbnPercent: 0,
      cbcPercent: 0,
      cbgPercent: 0,
      cbgAPercent: 0,
      thcVPercent: 0,
      totalCannabinoidsPercent: 34.54,
    },
  });

  const wappaLabTest = await prisma.labTest.create({
    data: {
      labFacilityName: "Juniper Analytics LLC",
      testIdCode: "20JA0420.01",
      testPerformedDate: "2020-01-01T00:00:00-05:00",
      batchCode: "21-B",
      overallPassed: true,
      testTypeName: "Flower Full Compliance",
      testPassed: true,
      testComment: "Wappa Flappa Flame",
      thcTotalPercent: 21.0243,
      cbdPercent: 0.0,
      terpenePercent: 3.42,
      delta9ThcPercent: 0,
      delta8ThcPercent: 0,
      cbnPercent: 0,
      cbcPercent: 0,
      cbgPercent: 0,
      cbgAPercent: 0,
      thcVPercent: 0,
      totalCannabinoidsPercent: 25.02,
    },
  });

  const gmoLabTest = await prisma.labTest.create({
    data: {
      labFacilityName: "Juniper Analytics LLC",
      testIdCode: "20JA0777.02",
      testPerformedDate: "2020-01-01T00:00:00-05:00",
      batchCode: "22-M-C",
      overallPassed: true,
      testTypeName: "Flower Full Compliance",
      testPassed: true,
      testComment:
        "This is a comment about GMOs and their impact on the environment",
      thcTotalPercent: 29.45,
      cbdPercent: 0.022,
      terpenePercent: 1.89,
      delta9ThcPercent: 0,
      delta8ThcPercent: 0,
      cbnPercent: 0,
      cbcPercent: 0,
      cbgPercent: 0,
      cbgAPercent: 0,
      thcVPercent: 0,
      totalCannabinoidsPercent: 33.12,
    },
  });

  // Create Packages entries
  const phkFlowerPackage = await prisma.package.create({
    data: {
      tag: {
        connect: { id: "0fb460bf-974c-4e44-a7b3-efd41ca8bd27-10" },
      },
      quantity: 15,
      notes: "This is a note about Flower",
      labTestingState: "TestPassed",
      item: {
        connect: { id: phkFlower.id },
      },
      labTests: {
        create: [
          {
            labTest: {
              connect: {
                id: phkLabTest.id,
              },
            },
          },
        ],
      },
      uom: {
        connect: { id: uomPounds.id },
      },
    },
  });

  const phkPRtwoPackPackage = await prisma.package.create({
    data: {
      quantity: 50,
      notes: "This is a note about preroll on order",
      labTestingState: "TestPassed",
      item: {
        connect: { id: phkPRtwoPack.id },
      },
      isLineItem: true,
      ppuDefault: 2,
      ppuOnOrder: 2.15,
      totalPackagePriceOnOrder: 107.5,
      labTests: {
        create: [
          {
            labTest: {
              connect: {
                id: phkLabTest.id,
              },
            },
          },
        ],
      },
      uom: {
        connect: { id: uomEach.id },
      },
    },
  });

  const phkPRsinglePackage = await prisma.package.create({
    data: {
      quantity: 100,
      notes: "This is a note about preroll singles on order",
      labTestingState: "TestPassed",
      item: {
        connect: { id: phkPRsingle.id },
      },
      isLineItem: true,
      ppuDefault: 1,
      ppuOnOrder: 1.25,
      totalPackagePriceOnOrder: 125,
      labTests: {
        create: [
          {
            labTest: {
              connect: {
                id: phkLabTest.id,
              },
            },
          },
        ],
      },
      uom: {
        connect: { id: uomEach.id },
      },
    },
  });

  const wappaFlowerPackage = await prisma.package.create({
    data: {
      tag: {
        connect: { id: "0fb460bf-974c-4e44-a7b3-efd41ca8bd27-11" },
      },
      quantity: 15,
      notes: "This is a note about Wappa Flower",
      labTestingState: "TestPassed",
      item: {
        connect: { id: wappaFlower.id },
      },
      labTests: {
        create: [
          {
            labTest: {
              connect: {
                id: wappaLabTest.id,
              },
            },
          },
        ],
      },
      uom: {
        connect: { id: uomPounds.id },
      },
    },
  });

  const gmoFlowerPackage = await prisma.package.create({
    data: {
      tag: {
        connect: { id: "0fb460bf-974c-4e44-a7b3-efd41ca8bd27-12" },
      },
      quantity: 15,
      notes: "This is a note about GMO Flower",
      labTestingState: "TestPassed",
      item: {
        connect: { id: gmoFlower.id },
      },
      labTests: {
        create: [
          {
            labTest: {
              connect: {
                id: gmoLabTest.id,
              },
            },
          },
        ],
      },
      uom: {
        connect: { id: uomPounds.id },
      },
    },
  });

  const phkPRsinglePackage2 = await prisma.package.create({
    data: {
      quantity: 100,
      notes: "This is a note about preroll singles on another order",
      labTestingState: "TestPassed",
      item: {
        connect: { id: phkPRsingle.id },
      },
      isLineItem: true,
      ppuDefault: 1,
      ppuOnOrder: 1.25,
      totalPackagePriceOnOrder: 125,
      labTests: {
        create: [
          {
            labTest: {
              connect: {
                id: phkLabTest.id,
              },
            },
          },
        ],
      },
      uom: {
        connect: { id: uomEach.id },
      },
    },
  });

  const phkPRsinglePackage3 = await prisma.package.create({
    data: {
      quantity: 100,
      notes: "This is a note about preroll singles on order",
      labTestingState: "TestPassed",
      item: {
        connect: { id: phkPRsingle.id },
      },
      isLineItem: true,
      ppuDefault: 1.0,
      ppuOnOrder: 1.25,
      totalPackagePriceOnOrder: 125,
      labTests: {
        create: [
          {
            labTest: {
              connect: {
                id: phkLabTest.id,
              },
            },
          },
        ],
      },
      uom: {
        connect: { id: uomEach.id },
      },
    },
  });

  console.log(`Database has been seeded. 🌱\n`);
}

seed()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
