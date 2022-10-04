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

export function assignTagToPackage({
  packageId,
  tagId,
  isProvisional,
}: {
  packageId: string;
  tagId: string;
  isProvisional: boolean;
}) {
  return db.packageTag.update({
    where: {
      id: tagId,
    },
    data: {
      isAssigned: true,
      isProvisional: isProvisional,
      isActive: true,
      packages: {
        connect: {
          id: packageId,
        },
      },
    },
  });
}

export function updateProvisionalToAssigned({ tagId }: { tagId: string }) {
  return db.packageTag.update({
    where: {
      id: tagId,
    },
    data: {
      isProvisional: false,
    },
  });
}
