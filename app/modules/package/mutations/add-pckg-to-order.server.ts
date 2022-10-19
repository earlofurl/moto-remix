import { db } from "~/database";

export async function addPckgToOrder({
  packageId,
  orderId,
}: {
  packageId: string;
  orderId: string;
}) {
  const addPckgToOrder = db.order.update({
    where: { id: orderId },
    data: {
      lineItemPackages: {
        connect: {
          id: packageId,
        },
      },
    },
  });

  const setPckgToLineItem = db.package.update({
    where: { id: packageId },
    data: {
      isLineItem: true,
    },
  });

  await db.$transaction([addPckgToOrder, setPckgToLineItem]);
}
