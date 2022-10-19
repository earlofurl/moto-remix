import { CircleStackIcon } from "@heroicons/react/24/outline";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";

import ActionGrid from "~/components/ActionGrid";
import { requireAuthSession } from "~/modules/auth/guards";
import type { AuthSession } from "~/modules/auth/session.server";

type LoaderData = {
  authSession: AuthSession;
};

export const loader: LoaderFunction = async ({ request }) => {
  const authSession = await requireAuthSession(request, {
    onFailRedirectTo: "/login",
  });

  return json<LoaderData>({ authSession });
};

const actions = [
  {
    title: "Sales Sheets",
    href: "sales-sheets",
    icon: CircleStackIcon,
    iconForeground: "text-teal-700",
    iconBackground: "bg-teal-50",
    description: "Upload sales sheets and get links",
  },
  {
    title: "Retailer Locations",
    href: "locations",
    icon: CircleStackIcon,
    iconForeground: "text-teal-700",
    iconBackground: "bg-teal-50",
    description: "Add and edit retailer locations for the map",
  },
  {
    title: "Product Inventory",
    href: "inventory",
    icon: CircleStackIcon,
    iconForeground: "text-teal-700",
    iconBackground: "bg-teal-50",
    description: "View and edit product inventory",
  },
  {
    title: "Lab Tests",
    href: "lab-tests",
    icon: CircleStackIcon,
    iconForeground: "text-teal-700",
    iconBackground: "bg-teal-50",
    description: "View lab test results",
  },
  {
    title: "Orders",
    href: "orders",
    icon: CircleStackIcon,
    iconForeground: "text-teal-700",
    iconBackground: "bg-teal-50",
    description: "View and edit orders",
  },
];

export default function AdminDashboard(): JSX.Element {
  return (
    <div className="bg-gray-100">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      </div>
      {/* <div>
        DEBUG: Display authSession object
        <p>{JSON.stringify(data)}</p>
      </div> */}
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
