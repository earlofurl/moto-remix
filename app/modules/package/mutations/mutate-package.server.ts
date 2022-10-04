import { db } from "~/database";

import type { Package } from "@prisma/client";

export function deletePackage({ id }: Pick<Package, "id">) {
  return db.package.delete({
    where: { id: id },
  });
}

// Transaction to ensure that the package is created and parent package is updated.
export async function createPackage(
  tagId: string,
  sourcePackageId: string,
  inheritedLabTestIds: string,
  itemId: string,
  quantity: number,
  uomId: string,
  newParentQuantity: number
) {
  const createPackage = db.package.create({
    data: {
      quantity: quantity,
      uom: {
        connect: {
          id: uomId,
        },
      },
      tag: {
        connect: {
          id: tagId,
        },
      },
      item: {
        connect: {
          id: itemId,
        },
      },
      sourcePackages: {
        connect: {
          id: sourcePackageId,
        },
      },
      labTests: {
        create: [
          {
            labTestId: inheritedLabTestIds,
            assignedBy: "packageCreation",
          },
        ],
      },
    },
  });

  const updateSourcePackage = db.package.update({
    where: { id: sourcePackageId },
    data: {
      quantity: newParentQuantity,
    },
  });

  const updateTagStatus = db.packageTag.update({
    where: { id: tagId },
    data: {
      isAssigned: true,
    },
  });

  await db.$transaction([createPackage, updateSourcePackage, updateTagStatus]);
}
