import { json, LoaderFunction } from "@remix-run/node";
import { requireAuthSession } from "~/modules/auth/guards";
import { AuthSession } from "~/modules/auth/session.server";
import { Outlet } from "@remix-run/react";

type LoaderData = {
  authSession: AuthSession;
};

export const loader: LoaderFunction = async ({ request }) => {
  const authSession = await requireAuthSession(request);
  return json<LoaderData>({ authSession });
};

export default function OrderIndex(): JSX.Element {
  return (
    <div className="space-y-6 bg-gray-100">
      <Outlet />
    </div>
  );
}
