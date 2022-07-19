import { json, LoaderFunction } from "@remix-run/node";
import { requireAuthSession } from "~/core/auth/guards";
import { AuthSession } from "~/core/auth/session.server";

type LoaderData = {
  authSession: AuthSession;
};

export const loader: LoaderFunction = async ({ request }) => {
  const authSession = await requireAuthSession(request);
  return json<LoaderData>({ authSession });
};

export default function SalesSheets(): JSX.Element {
  return (
    <div>
      <h1>Sales Sheets</h1>
    </div>
  );
}
