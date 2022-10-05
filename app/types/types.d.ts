import type {
  Item,
  ItemType,
  Package,
  PackageTag,
  Uom,
  LabTestsOnPackages,
  Strain,
} from "@prisma/client";

export type PackageWithNesting = Package & {
  tag: PackageTag;
  item: ItemWithNesting;
  labTests: LabTestsOnPackages[];
  uom: Uom;
  sourcePackages: PackageWithNesting[];
};

export type ItemWithNesting = Item & {
  itemType: ItemType;
  strain: Strain;
};
