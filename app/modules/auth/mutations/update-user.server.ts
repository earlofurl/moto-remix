import { getSupabase, getSupabaseAdmin } from "~/integrations/supabase";

import { redirect } from "@remix-run/node";
import { mapAuthSession } from "../utils/map-auth-session.server";
import { AuthSession } from "../session.server";

export async function updateUserPassword(token: string, newPassword: string) {
  // const supabase = getSupabase();
  // const { data, error } = await supabase.auth.update({
  //   password: newPassword,
  // });

  console.log(token);

  const { data, error } = await getSupabaseAdmin().auth.api.updateUser(token, {
    password: newPassword,
  });

  if (!data || error) {
    return null;
  }

  return data;
}
