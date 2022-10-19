import { db } from "~/database";

// TODO: Possibly add ability to set tag non provisional on assignment
export function assignTagToPackage({
  packageId,
  tagId,
}: {
  packageId: string;
  tagId: string;
}) {
  return db.packageTag.update({
    where: {
      id: tagId,
    },
    data: {
      isAssigned: true,
      isProvisional: true,
      isActive: true,
      assignedPackage: {
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
