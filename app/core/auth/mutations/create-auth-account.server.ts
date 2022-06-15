import type { User } from "@prisma/client";
import { supabaseAdmin } from "~/core/integrations/supabase/supabase.server";

type UserReturn = Partial<User>;

export async function createAuthAccount(
  email: string,
  password: string
): Promise<UserReturn | null> {
  const { data, error } = await supabaseAdmin.auth.api.createUser({
    email,
    password,
    email_confirm: true, // demo purpose, assert that email is confirmed. For production, check email confirmation
  });

  if (!data || error) {
    return null;
  }

  return data;
}
