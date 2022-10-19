import { db } from "~/database";
import type { Package, Order } from "@prisma/client";

export async function removePckgFromOrder(orderId: string, packageId: string) {
  return db.order.update({
    where: { id: orderId },
    data: {
      lineItemPackages: {
        disconnect: {
          id: packageId,
        },
      },
    },
  });
}
