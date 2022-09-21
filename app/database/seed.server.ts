// No longer necessary to seed user because all auth is handled by Supabase
// Keep this file around in case we need to seed other data in the future

import { createAuthAccount } from "~/modules/auth/mutations/create-auth-account.server";

async function seed() {
  const email = "jackthename@gmail.com";
  const password = "superpassword123";

  await createAuthAccount(email, password);

  console.log(`Database has been seeded. 🌱\n`);
  console.log(
    `User added to your database 👇 \n🆔: \n📧: ${email}\n🔑: supabase`
  );
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});

// import { PrismaClient } from "@prisma/client";
// import { createClient } from "@supabase/supabase-js";

// import { SUPABASE_SERVICE_ROLE, SUPABASE_URL } from "../utils/env.server";
// import { createAuthAccount } from '~/modules/auth/mutations';

// if (!SUPABASE_URL) {
//   throw new Error("SUPABASE_URL is not set");
// }

// if (!SUPABASE_SERVICE_ROLE) {
//   throw new Error("SUPABASE_SERVICE_ROLE is not set");
// }

// const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE, {
//   autoRefreshToken: false,
//   persistSession: false,
// });

// const prisma = new PrismaClient();

// const email = "hello@supabase.com";

// const getUserId = async (): Promise<string> => {
//   const existingUserId = await supabaseAdmin.auth.api
//     .listUsers()
//     .then(({ data }) => data?.find((user) => user.email === email)?.id);

//   if (existingUserId) {
//     return existingUserId;
//   }

//   const newUserId = await supabaseAdmin.auth.api
//     .createUser({
//       email,
//       password: "supabase",
//       email_confirm: true,
//     })
//     .then(({ user }) => user?.id);

//   if (newUserId) {
//     return newUserId;
//   }

//   throw new Error("Could not create or get user");
// };

// async function seed() {
//   const id = await getUserId();

//   // cleanup the existing database
//   await prisma.user.delete({ where: { email } }).catch(() => {
//     // no worries if it doesn't exist yet
//   });

//   const user = await prisma.user.create({
//     data: {
//       email,
//       id,
//     },
//   });

//   console.log(`Database has been seeded. 🌱\n`);
//   console.log(
//     `User added to your database 👇 \n🆔: ${user.id}\n📧: ${user.email}\n🔑: supabase`
//   );
// }

// seed()
//   .catch((error) => {
//     console.error(error);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
