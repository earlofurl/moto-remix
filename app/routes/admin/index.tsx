import * as React from "react";
import type { LoaderFunction } from "@remix-run/node";
import { redirect, json } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";

import { requireAuthSession } from "~/core/auth/guards";
import { AuthSession } from "~/core/auth/session.server";
import Navbar from "~/core/components/navbar";
import { LogoutButton } from "~/core/components";

type LoaderData = {
  authSession: AuthSession;
};

export const loader: LoaderFunction = async ({ request }) => {
  const authSession = await requireAuthSession(request, {
    onFailRedirectTo: "/login",
  });
  return json<LoaderData>({ authSession });
};

export default function AdminDashboard(): JSX.Element {
  const data = useLoaderData();

  return (
    <div className="bg-brand-primary">
      <Navbar />
      <div>
        <h1>Admin Dashboard</h1>
      </div>
      <div>
        <p>{data.authSession.userId}</p>
        <p>{data.authSession.email}</p>
        <p>{data.authSession.accessToken}</p>
      </div>
      <div>
        <Link to="locations">Locations</Link>
        <Link to="sales-sheets">Sales Sheets</Link>
      </div>

      <LogoutButton />
    </div>
  );
}
