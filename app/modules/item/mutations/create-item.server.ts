import type { Item } from "@prisma/client";
import { db } from "~/database";

export type { Item } from "@prisma/client";

export function createItem(): void {
  console.log("Not yet implemented");
}
