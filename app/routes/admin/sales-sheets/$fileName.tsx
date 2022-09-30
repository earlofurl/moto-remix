import { json, LoaderFunction } from "@remix-run/node";
import { useParams } from "@remix-run/react";
import { getSupabaseAdmin } from "~/integrations/supabase"; // TODO: downgrade to client after prototype
import { requireAuthSession } from "~/modules/auth/guards";
import { AuthSession } from "~/modules/auth/session.server";
import { Link, useLoaderData } from "@remix-run/react";

type LoaderData = {
  authSession: AuthSession;
  data: { publicURL: string };
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const authSession = await requireAuthSession(request);
  const supabase = getSupabaseAdmin();
  const fileName = params.fileName as string;

  const { data, error } = supabase.storage
    .from("moto-public")
    .getPublicUrl(`sales-sheets/${fileName}`);
  console.log(data, error);

  return json({ authSession, data, error }, { status: error ? 500 : 200 });
};

export default function SalesSheet(): JSX.Element {
  const data = useLoaderData<LoaderData>();
  const { authSession, data: URLobject } = data;
  const publicURL = URLobject.publicURL;
  const params = useParams();
  const fileName = params.fileName;

  return (
    <>
      <div>
        <h1>Sales Sheet: {fileName}</h1>
      </div>
      <div>
        <h3>Public Link: {publicURL}</h3>
      </div>
      <div>
        <a href={`${publicURL}`}>Download</a>
      </div>
    </>
  );
}
