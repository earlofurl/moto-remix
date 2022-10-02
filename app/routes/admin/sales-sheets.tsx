import { Outlet } from "@remix-run/react";
import { json, LoaderFunction } from "@remix-run/node";
import { requireAuthSession } from "~/modules/auth/guards";
import { AuthSession } from "~/modules/auth/session.server";

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
      <Outlet />
    </div>
  );
}
