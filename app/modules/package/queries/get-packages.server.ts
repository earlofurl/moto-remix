import type { Package } from "@prisma/client";
import { db } from "~/database";

export type { Package } from "@prisma/client";

export function getAllPackages(): Promise<Package[]> {
  return db.package.findMany({
    include: {
      tag: true,
      uom: true,
      item: {
        include: {
          itemType: {
            include: {
              uomDefault: {},
            },
          },
          strain: {},
        },
      },
      labTests: {
        include: {
          labTest: {
            select: {
              thcTotalPercent: true,
              cbdPercent: true,
              terpenePercent: true,
              overallPassed: true,
              totalCannabinoidsPercent: true,
              batchCode: true,
              testIdCode: true,
            },
          },
        },
      },
    },
  });
}
