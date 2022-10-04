import type { ItemType } from "@prisma/client";
import { db } from "~/database";

export type { ItemType } from "@prisma/client";

export async function getAllItemTypes(): Promise<ItemType[]> {
  return db.itemType.findMany();
}
