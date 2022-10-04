import type { Uom } from "@prisma/client";
import { db } from "~/database";

export type { Uom } from "@prisma/client";

export function getAllUoms(): Promise<Uom[]> {
  return db.uom.findMany();
}
