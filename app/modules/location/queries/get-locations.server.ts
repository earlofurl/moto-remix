import type { Location } from "@prisma/client";
import { db } from "~/core/database";

export type { Location } from "@prisma/client";

export function getAllLocations(): Promise<Location[]> {
  return db.location.findMany();
}
