import type { PackageTag } from "@prisma/client";
import { db } from "~/database";

export function getAllPackageTags(): Promise<PackageTag[]> {
  return db.packageTag.findMany();
}

export function getUnassignedPackageTagsLimit20(): Promise<PackageTag[]> {
  return db.packageTag.findMany({
    where: {
      isAssigned: false,
    },
    orderBy: {
      tagNumber: "asc",
    },
    take: 20,
  });
}

export function getAllUnassignedPackageTags(): Promise<PackageTag[]> {
  return db.packageTag.findMany({
    where: {
      isAssigned: false,
    },
  });
}

export function getNextUnassignedPackageTag(): Promise<PackageTag | null> {
  return db.packageTag.findFirst({
    where: {
      isAssigned: false,
    },
  });
}
