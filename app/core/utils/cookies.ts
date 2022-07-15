import { createCookie } from "@remix-run/node";

export const ageGate = createCookie("age-gate", {
  maxAge: 604_800, // one week
});
