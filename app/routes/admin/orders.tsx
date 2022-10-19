import type { Order } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Link,
  Outlet,
  useCatch,
  useLoaderData,
  useNavigate,
} from "@remix-run/react";
import { getAllOrders } from "~/modules/order/queries/get-orders.server";
import { requireAuthSession } from "~/modules/auth/guards";
import { AuthSession } from "~/modules/auth/session.server";
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
import dayjs from "dayjs";
import React from "react";
import Calendar from "react-calendar";

type LoaderData = {
  authSession: AuthSession;
  data: Awaited<ReturnType<typeof getAllOrders>>;
};

function classNames(
  ...classes: readonly (string | undefined)[]
): string | undefined {
  return classes.filter(Boolean).join(" ");
}

export const loader: LoaderFunction = async ({ request }) => {
  const authSession = await requireAuthSession(request);
  const data = await getAllOrders();
  return json<LoaderData>({ authSession, data });
};

export default function OrderPage(): JSX.Element {
  const { authSession, data: orders } = useLoaderData();
  const navigate = useNavigate();
  const [dateValue, setDateValue] = React.useState(new Date());

  function handleAddButtonClick(): undefined {
    navigate("add");
    return undefined;
  }

  return (
    <div>
      <Outlet />
      {/* Page header */}
      <div className="bg-white shadow">
        <div className="lg:max-w-9xl px-4 sm:px-6 lg:mx-auto lg:px-8">
          <div className="py-5 md:flex md:items-center md:justify-between lg:border-t lg:border-gray-200">
            <div className="min-w-0 flex-1">
              {/* Profile */}
              <div className="flex items-center">
                <div>
                  <div className="flex items-center">
                    <h1 className="ml-3 text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:leading-9">
                      View, add, edit, and delete orders.
                    </h1>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 flex space-x-3 md:mt-0 md:ml-4">
              {/*<button*/}
              {/*  type="button"*/}
              {/*  className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"*/}
              {/*>*/}
              {/*  Add many*/}
              {/*</button>*/}
              <button
                type="button"
                onClick={handleAddButtonClick}
                className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
              >
                Add Order
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Page Content */}
      <div className="bg-white px-2 sm:px-3 lg:px-4">
        {/*<h2 className="px-8 text-lg font-semibold text-gray-900">*/}
        {/*  Upcoming Orders*/}
        {/*</h2>*/}
        <div className="min-h-screen lg:grid lg:grid-cols-12 lg:gap-x-16">
          <div className="mt-10 text-center lg:col-start-8 lg:col-end-13 lg:row-start-1 lg:mt-9 xl:col-start-8">
            <div className="flex flex-col">
              <div className="grid grid-cols-7 flex-row pr-4 text-gray-500">
                <main className="col-span-7 flex flex-row gap-px rounded-lg pt-2 ring-1 ring-gray-200">
                  <Calendar
                    onChange={setDateValue}
                    value={dateValue}
                    className="p-4 text-lg leading-10"
                    nextLabel={
                      <ChevronRightIcon className="h-5 w-5 text-gray-500" />
                    }
                    prevLabel={
                      <ChevronLeftIcon className="h-5 w-5 text-gray-500" />
                    }
                    next2Label={
                      <ChevronDoubleRightIcon className="h-5 w-5 text-gray-500" />
                    }
                    prev2Label={
                      <ChevronDoubleLeftIcon className="h-5 w-5 text-gray-500" />
                    }
                    navigationLabel={({
                      label,
                    }: {
                      label: string;
                    }): JSX.Element => (
                      <span className="px-3 text-xl">{label}</span>
                    )}
                  />
                </main>
              </div>
            </div>
          </div>
          <ul className="mt-4 divide-y divide-gray-200 text-sm leading-6 lg:col-span-7 xl:col-span-7">
            {}
            {orders.map((order: Order) => (
              <li
                key={order.id}
                className="py-4"
              >
                <Link
                  to={order.id}
                  className="block rounded-md bg-gradient-to-r from-slate-100 to-white p-4 hover:from-blue-200 hover:to-blue-100"
                >
                  <div className="flex items-center px-4 py-4 sm:px-6">
                    <div className="flex min-w-0 flex-1 items-center">
                      {/* <div className="flex-shrink-0">
                    <img className="h-12 w-12 rounded-full" src={application.applicant.imageUrl} alt="" />
                  </div> */}
                      <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
                        <div>
                          <p className="truncate text-xl font-semibold text-gray-700">
                            {order.customerName ? order.customerName : "-"}
                          </p>
                          {/*<p className="mt-2 flex items-center text-sm text-gray-500">*/}
                          {/*  <LocationMarkerIcon*/}
                          {/*    className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"*/}
                          {/*    aria-hidden="true"*/}
                          {/*  />*/}
                          {/*  <span className="truncate">*/}
                          {/*    {order.customerFacility.addressStreet1*/}
                          {/*      ? order.customerFacility.addressStreet1*/}
                          {/*      : "-"}{" "}*/}
                          {/*    {order.customerFacility.addressCity*/}
                          {/*      ? order.customerFacility.addressCity*/}
                          {/*      : "-"}{" "}*/}
                          {/*    {order.customerFacility.addressState*/}
                          {/*      ? order.customerFacility.addressState*/}
                          {/*      : "-"}*/}
                          {/*  </span>*/}
                          {/*</p>*/}
                        </div>
                        <div className="hidden md:block">
                          <div>
                            <p className="text-sm text-gray-900">
                              Scheduled for{" "}
                              <time
                                className="text-md font-semibold text-gray-700"
                                dateTime={dayjs(
                                  order.scheduledDeliveryDateTime
                                ).format("MMM DD YYYY")}
                              >
                                {dayjs(order.scheduledDeliveryDateTime).format(
                                  "MMM DD YYYY"
                                )}
                              </time>
                            </p>
                            <p className="mt-2 flex items-center text-sm text-gray-500">
                              <QuestionMarkCircleIcon
                                className="mr-1.5 h-5 w-5 flex-shrink-0 text-green-400"
                                aria-hidden="true"
                              />
                              <span
                                className={classNames(
                                  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                                  order.status === "Open"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : order.status === "Packed"
                                    ? "bg-green-100 text-green-800"
                                    : order.status === "Shipped"
                                    ? "bg-blue-100 text-blue-800"
                                    : order.status === "Delivered"
                                    ? "bg-blue-100 text-blue-800"
                                    : order.status === "Cancelled"
                                    ? "bg-red-100 text-red-800"
                                    : order.status === "Paid"
                                    ? "bg-green-100 text-green-800"
                                    : order.status === "Finished"
                                    ? "bg-gray-100 text-gray-800"
                                    : "bg-gray-100 text-gray-900"
                                )}
                              >
                                {order.status}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <ChevronRightIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export function ErrorBoundary({
  error,
}: {
  readonly error: Error;
}): JSX.Element {
  // console.error(error);

  return <div>An unexpected error occurred: {error.message}</div>;
}

export function CatchBoundary(): JSX.Element {
  const caught = useCatch();

  if (caught.status === 404) {
    return <div>Orders not found</div>;
  }

  throw new Error(
    `Unexpected caught response with status: ${caught.status as number}`
  );
}
