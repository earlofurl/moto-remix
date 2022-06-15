import { PrismaClient } from "@prisma/client";

import { NODE_ENV } from "../utils/env.server";

export type { User, Strain, Location } from "@prisma/client";

let db: PrismaClient;

declare global {
  // eslint-disable-next-line no-var
  var __db__: PrismaClient;
}

// this is needed because in development we don't want to restart
// the server with every change, but we want to make sure we don't
// create a new connection to the DB with every change either.
// in production, we'll have a single connection to the DB.
if (NODE_ENV === "production") {
  db = new PrismaClient();
  db.$connect();
} else {
  if (!global.__db__) {
    global.__db__ = new PrismaClient();
    global.__db__.$connect();
  }
  db = global.__db__;
  db.$connect();
}

export { db };
