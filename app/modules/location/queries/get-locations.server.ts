import type { Location } from "@prisma/client";
import { db } from "~/database";

export type { Location } from "@prisma/client";

export function getAllLocations(): Promise<Location[]> {
  return db.location.findMany();
}
