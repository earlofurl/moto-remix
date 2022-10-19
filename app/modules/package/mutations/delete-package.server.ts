import { db } from "~/database";

import type { Package } from "@prisma/client";

export function deletePackage({ id }: Pick<Package, "id">) {
  return db.package.delete({
    where: { id: id },
  });
}
