import type { Location, User } from "@prisma/client";
import { db } from "~/database";

type CreateLocationArgs = Pick<
  Location,
  | "name"
  | "address"
  | "city"
  | "state"
  | "zip"
  | "latitude"
  | "longitude"
  | "note"
  | "website"
  | "flower"
  | "prerolls"
  | "pressed_hash"
  | "created_by"
>;

export async function createLocation({
  name,
  address,
  city,
  state,
  zip,
  latitude,
  longitude,
  note,
  website,
  flower,
  prerolls,
  pressed_hash: hash,
  created_by: userId,
}: CreateLocationArgs) {
  return db.location.create({
    data: {
      name,
      address,
      city,
      state,
      zip,
      latitude,
      longitude,
      note,
      website,
      flower,
      prerolls,
      pressed_hash: hash,
      created_by: userId,
    },
  });
}
