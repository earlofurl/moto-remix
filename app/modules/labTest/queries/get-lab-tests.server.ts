import type { LabTest } from "@prisma/client";
import { db } from "~/database";

export type { LabTest } from "@prisma/client";

export function getAllLabTests(): Promise<LabTest[]> {
  return db.labTest.findMany();
}
