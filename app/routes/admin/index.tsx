import React from "react";
import type { LoaderFunction } from "@remix-run/node";
import { redirect, json } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";

import { requireAuthSession } from "~/modules/auth/guards";
import { AuthSession } from "~/modules/auth/session.server";
import Navbar from "~/components/navbar";
import { LogoutButton } from "~/components";
import { authSession } from "mocks/handlers";

type LoaderData = {
  authSession: AuthSession;
};

export const loader: LoaderFunction = async ({ request }) => {
  await requireAuthSession(request, { onFailRedirectTo: "/login" });

  return authSession;
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
        {/* Display authSession object */}
        <p>{JSON.stringify(data)}</p>
      </div>
      <div>
        <Link to="locations">Locations</Link>
        <Link to="sales-sheets">Sales Sheets</Link>
      </div>

      <LogoutButton />
    </div>
  );
}
