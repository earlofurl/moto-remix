import type { Strain } from "@prisma/client";
import { db } from "~/core/database";

export type { Strain } from "@prisma/client";

export function getAllStrains(): Promise<Strain[]> {
  return db.strain.findMany();
}
