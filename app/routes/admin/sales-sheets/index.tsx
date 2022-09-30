import type { FileObject } from "@supabase/storage-js";
import { json, LoaderFunction } from "@remix-run/node";
import { requireAuthSession } from "~/modules/auth/guards";
import { AuthSession } from "~/modules/auth/session.server";
import { getSupabaseAdmin } from "~/integrations/supabase"; // TODO: downgrade to client after prototype
import { Link, useLoaderData } from "@remix-run/react";

type LoaderData = {
  authSession: AuthSession;
  data: FileObject[];
};

export const loader: LoaderFunction = async ({ request }) => {
  const authSession = await requireAuthSession(request);
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.storage
    .from("moto-public")
    .list("sales-sheets", {
      limit: 100,
      offset: 0,
      sortBy: { column: "created_at", order: "asc" },
    });
  console.log(data, error);

  return json({ authSession, data, error }, { status: error ? 500 : 200 });
};

export default function SalesSheetsIndex(): JSX.Element {
  const data = useLoaderData<LoaderData>();
  const { authSession, data: files } = data;

  return (
    <>
      <div>
        <h1>Sales Sheets</h1>
      </div>
      {/* <div>
        <h3>{JSON.stringify(files)}</h3>
      </div> */}
      <div>
        <ul>
          {files.map((file) => (
            <div key={file.name}>
              <Link to={file.name}>{file.name}</Link>
            </div>
          ))}
        </ul>
      </div>
    </>
  );
}
