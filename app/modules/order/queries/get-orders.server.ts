import type { Order } from "@prisma/client";
import { db } from "~/database";

export type { Order } from "@prisma/client";

export function getAllOrders(): Promise<Order[]> {
  return db.order.findMany({
    include: {
      lineItemPackages: {
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
      },
    },
  });
}

export function getOrderById(id: string): Promise<Order> {
  return db.order.findUnique({
    where: {
      id,
    },
    include: {
      lineItemPackages: {
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
      },
    },
  });
}
