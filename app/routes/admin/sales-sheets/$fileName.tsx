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
        <h1 className="my-2 text-lg font-medium text-gray-900">
          Sales Sheet: {fileName}
        </h1>
      </div>
      <div className="mt-6">
        <h3 className="text-md my-2 text-gray-800">
          Click to copy public URL to clipboard
        </h3>
        <button
          type="button"
          className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          onClick={() => {
            navigator.clipboard.writeText(publicURL);
          }}
        >
          <span className="text-md mt-2 block font-medium text-gray-900">
            {publicURL}
          </span>
        </button>
      </div>
      <div>
        <a
          href={`${publicURL}`}
          className="mt-6 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Download
        </a>
      </div>
    </>
  );
}
