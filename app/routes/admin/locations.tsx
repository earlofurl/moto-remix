import { json, LoaderFunction } from "@remix-run/node";
import { requireAuthSession } from "~/core/auth/guards";
import { AuthSession } from "~/core/auth/session.server";
import Navbar from "~/core/components/navbar";
import { Link, Outlet } from "@remix-run/react";

type LoaderData = {
  authSession: AuthSession;
};

export const loader: LoaderFunction = async ({ request }) => {
  const authSession = await requireAuthSession(request);
  return json<LoaderData>({ authSession });
};

export default function Locations(): JSX.Element {
  return (
    <div className="space-y-6 bg-brand-primary">
      <Outlet />
    </div>
  );
}
