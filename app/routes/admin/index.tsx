import React from "react";
import type { LoaderFunction } from "@remix-run/node";
import { redirect, json } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";

import { requireAuthSession } from "~/modules/auth/guards";
import { AuthSession } from "~/modules/auth/session.server";
import BackendDash from "~/components/layout/BackendDash";
import ActionGrid from "~/components/ActionGrid";
import { LogoutButton } from "~/components";
import { authSession } from "mocks/handlers";

import { DatabaseIcon } from "@heroicons/react/solid";

type LoaderData = {
  authSession: AuthSession;
};

export const loader: LoaderFunction = async ({ request }) => {
  await requireAuthSession(request, { onFailRedirectTo: "/login" });

  return authSession;
};

const actions = [
  {
    title: "Sales Sheets",
    href: "sales-sheets",
    icon: DatabaseIcon,
    iconForeground: "text-teal-700",
    iconBackground: "bg-teal-50",
    description: "Upload sales sheets and get links",
  },
  {
    title: "Retailer Locations",
    href: "retailer-locations",
    icon: DatabaseIcon,
    iconForeground: "text-teal-700",
    iconBackground: "bg-teal-50",
    description: "Add and edit retailer locations for the map",
  },
];

export default function AdminDashboard(): JSX.Element {
  const data = useLoaderData();

  return (
    <div className="bg-gray-100">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      </div>
      <div>
        {/* Display authSession object */}
        <p>{JSON.stringify(data)}</p>
      </div>
      <div className="p-8">
        <ActionGrid actions={actions} />
      </div>
      {/* <div>
        <Link to="locations">Locations</Link>
        <Link to="sales-sheets">Sales Sheets</Link>
      </div> */}
    </div>
  );
}
