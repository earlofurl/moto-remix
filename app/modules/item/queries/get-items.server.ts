import type { Item } from "@prisma/client";
import { db } from "~/database";

export type { Item } from "@prisma/client";

export async function getAllItems(): Promise<Item[]> {
  return db.item.findMany({
    include: {
      itemType: true,
      strain: true,
    },
  });
}
