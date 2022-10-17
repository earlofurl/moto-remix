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
          strain: true,
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

export function getAllPackagesAvailable(): Promise<Package[]> {
  return db.package.findMany({
    where: {
      isLineItem: false,
    },
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
          strain: true,
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

export function getAllPackagesOnOrder(orderId: string): Promise<Package[]> {
  return db.package.findMany({
    where: {
      orderId,
    },
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
          strain: true,
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

export function getSinglePackageDetails(id: string) {
  return db.package.findUnique({
    where: { id },
    include: {
      tag: {},
      uom: {},
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
            },
          },
        },
      },
    },
  });
}
