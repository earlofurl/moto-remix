import type { Order } from "@prisma/client";
import invariant from "tiny-invariant";
import dayjs from "dayjs";
import {
  CheckCircleIcon,
  PencilIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { ArrowDownCircleIcon } from "@heroicons/react/24/outline";
import { useLoaderData, useParams } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import React from "react";
import { requireAuthSession } from "~/modules/auth/guards";
import { AuthSession } from "~/modules/auth/session.server";
import { useUoms } from "~/hooks/matches/use-uoms";
import { useOrders } from "~/hooks/matches/use-orders";
import type { ColumnDef } from "@tanstack/react-table";
import { createColumnHelper } from "@tanstack/react-table";
import OrderLineItemTable from "~/components/tables/OrderLineItemTable";
import OrderLineItemTableRowActions from "~/components/tables/OrderLineItemTableRowActions";
import type { PackageWithNesting } from "~/types/types";
import { getAllPackagesOnOrder } from "~/modules/package/queries";
import { getAllOrders } from "~/modules/order/queries";

// TODO: streamline the amount of db calls needed to make a process
// Can likely restructure to pull data using matches.

// TODO: redo ui
// stat cards at top. narrow timeline underneath. table at bottom.

type LoaderData = {
  authSession: AuthSession;
  order: Awaited<ReturnType<typeof getAllOrders>>;
  orderPackages: Awaited<ReturnType<typeof getAllPackagesOnOrder>>;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const authSession = await requireAuthSession(request, {
    onFailRedirectTo: "/login",
  });
  const orders = await getAllOrders();
  const orderPackages = await getAllPackagesOnOrder(params.toString());
  return json<LoaderData>({
    authSession,
    orders,
    orderPackages,
  });
};

const tableTitle = "Line Items";
const tableDescription = "Line items on order";
const columnHelper = createColumnHelper<PackageWithNesting>();

export default function SingleOrderPage() {
  const uoms = useUoms();
  // const orders = useOrders();
  const { orderId } = useParams();
  invariant(orderId, "orderId is required");
  const { orders } = useLoaderData<LoaderData>();
  const orderPackages = useLoaderData<LoaderData>().orderPackages;
  // const data = matches[2]!.data;

  // filter out order objects in data array to get single order that matches id
  function findOrder(orderId: string) {
    return orders.find((order: Order) => order.id === orderId);
  }

  // get items from order, get price and quantity from each item, and sum them
  // function getTotal(order: OrderWithNesting) {
  //   return pipe(
  //     order.lineItemPackages,
  //     A.map((item: any) => item.ppuOnOrder * item.quantity),
  //     A.reduce(0, (acc, curr) => acc + curr)
  //   );
  // }

  const order = findOrder(orderId);

  // const totalPrice = getTotal(order as OrderWithNesting);

  // Column structure for table
  const columnData: ColumnDef<PackageWithNesting>[] = [
    columnHelper.display({
      id: "actions",
      cell: (props) => <OrderLineItemTableRowActions row={props.row} />,
      enableGrouping: false,
      enableColumnFilter: false,
      enableGlobalFilter: false,
      enableSorting: false,
    }),
    columnHelper.group({
      id: "main",
      enableGrouping: false,
      enableColumnFilter: false,
      enableGlobalFilter: false,
      enableSorting: false,
      columns: [
        columnHelper.accessor("id", {
          id: "id",
          header: () => <span>ID</span>,
          enableGrouping: false,
          enableColumnFilter: false,
          enableGlobalFilter: false,
          enableSorting: false,
        }),
        columnHelper.accessor(
          (row: any) => (row.tag ? row.tag.tagNumber : "No Tag"),
          {
            id: "tagNumber",
            header: () => <span>Tag Number</span>,
            cell: (info) => {
              const value = info.getValue() as string;
              if (value === "") {
                return <span>-</span>;
              }
              return (
                <>
                  <span>{value.slice(0, 19)}</span>
                  <span className="fonts font-bold">{value.slice(19, 24)}</span>
                </>
              );
            },
            enableGrouping: false,
            enableColumnFilter: true,
            enableGlobalFilter: false,
            enableSorting: true,
          }
        ),
        columnHelper.accessor(
          (row: any) => `${row.item.itemType?.productForm}`,
          {
            id: "productForm",
            header: () => <span>Form</span>,
            enableGrouping: true,
            enableColumnFilter: true,
            enableGlobalFilter: true,
            enableSorting: true,
          }
        ),
        columnHelper.accessor(
          (row: any) => `${row.item.itemType?.productModifier}`,
          {
            id: "productModifier",
            header: () => <span>Modifier</span>,
            enableGrouping: true,
            enableColumnFilter: true,
            enableGlobalFilter: true,
            enableSorting: true,
          }
        ),
        columnHelper.accessor((row: any) => `${row.item.strain?.name}`, {
          id: "strain",
          header: () => <span>Strain</span>,
          enableGrouping: true,
          enableColumnFilter: true,
          enableGlobalFilter: true,
          enableSorting: true,
        }),
        columnHelper.accessor(
          (row: any) => `${row.labTests[0]?.labTest.batchCode}`,
          {
            id: "testBatch",
            header: () => <span>Batch</span>,
            enableGrouping: true,
            enableColumnFilter: true,
            enableGlobalFilter: true,
            enableSorting: true,
          }
        ),
        columnHelper.accessor((row: any) => `${row.item.strain?.type}`, {
          id: "type",
          header: () => <span>Type</span>,
          enableGrouping: false,
          enableColumnFilter: false,
          enableGlobalFilter: true,
          enableSorting: true,
        }),
      ],
    }),
    columnHelper.group({
      id: "stats",
      enableGrouping: false,
      enableColumnFilter: false,
      enableGlobalFilter: false,
      enableSorting: false,
      columns: [
        columnHelper.accessor(
          (row: any) => `${row.labTests[0]?.labTest.thcTotalPercent}`,
          {
            id: "thc",
            header: () => <span>THC</span>,
            enableGrouping: false,
            enableColumnFilter: false,
            enableGlobalFilter: false,
            enableSorting: true,
          }
        ),
      ],
    }),
    columnHelper.group({
      id: "count",
      enableGrouping: false,
      enableColumnFilter: false,
      enableGlobalFilter: false,
      enableSorting: false,
      columns: [
        columnHelper.accessor("quantity", {
          id: "quantity",
          header: () => <span>Quantity</span>,
          enableGrouping: false,
          enableColumnFilter: false,
          enableGlobalFilter: false,
          enableSorting: true,
        }),
        columnHelper.accessor((row: any) => row.uom?.name, {
          id: "uom",
          header: () => <span>UoM</span>,
          enableGrouping: false,
          enableColumnFilter: false,
          enableGlobalFilter: false,
          enableSorting: true,
        }),
        columnHelper.accessor("ppuOnOrder", {
          id: "ppuOnOrder",
          header: () => <span>PPU</span>,
          cell: (info) => {
            const value = info.getValue();
            if (value === "") {
              return <span>-</span>;
            }
            return (
              <>
                <span>
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(value)}
                </span>
              </>
            );
          },
          enableGrouping: false,
          enableColumnFilter: false,
          enableGlobalFilter: false,
          enableSorting: true,
        }),
        columnHelper.accessor(
          (row: any) => {
            return row.ppuOnOrder * row.quantity;
          },
          {
            id: "lineSubTotal",
            header: () => <span>SubTotal</span>,
            cell: (info) => {
              const value = info.getValue();
              if (value === "") {
                return <span>-</span>;
              }
              return (
                <>
                  <span>
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(value)}
                  </span>
                </>
              );
            },
            enableGrouping: false,
            enableColumnFilter: false,
            enableGlobalFilter: false,
            enableSorting: true,
          }
        ),
      ],
    }),
  ];

  return (
    <>
      <div className="flex h-screen overflow-hidden">
        {/* Content area */}
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden bg-white">
          <div className="lg:relative lg:flex">
            {/* Content */}
            <div className="max-w-9xl mx-auto w-full px-4 py-8 sm:px-6 lg:px-8">
              {/* Page header */}
              <div className="mb-5 sm:flex sm:items-center sm:justify-between">
                {/* Left: Title */}
                <div className="mb-4 sm:mb-0">
                  <h1 className="text-2xl font-bold text-slate-800 md:text-3xl">
                    {order?.customerName}
                  </h1>
                </div>

                {/* Add card button */}
                <button className="btn bg-indigo-500 text-white hover:bg-indigo-600">
                  <svg
                    className="h-4 w-4 shrink-0 fill-current opacity-50"
                    viewBox="0 0 16 16"
                  >
                    <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                  </svg>
                  <span className="xs:block ml-2 hidden">Add Item</span>
                </button>
              </div>

              {/* Filters */}
              <div className="mb-5">
                <ul className="-m-1 flex flex-wrap">
                  <li className="m-1">
                    <button className="inline-flex items-center justify-center rounded-full border border-transparent bg-indigo-500 px-3 py-1 text-sm font-medium leading-5 text-white shadow-sm duration-150 ease-in-out">
                      View All
                    </button>
                  </li>
                  <li className="m-1">
                    <button className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-medium leading-5 text-slate-500 shadow-sm duration-150 ease-in-out hover:border-slate-300">
                      Open Items
                    </button>
                  </li>
                  <li className="m-1">
                    <button className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-medium leading-5 text-slate-500 shadow-sm duration-150 ease-in-out hover:border-slate-300">
                      Completed Items
                    </button>
                  </li>
                </ul>
              </div>

              {/* Line Items */}
              <div className="space-y-2">
                <div className="bg-white shadow sm:overflow-hidden sm:rounded-lg">
                  <OrderLineItemTable
                    tableTitle={tableTitle}
                    tableDescription={tableDescription}
                    columnData={columnData}
                    tableData={order.lineItemPackages}
                  />
                </div>
              </div>
            </div>

            {/* Order Overview Sidebar */}
            <div>
              <div className="no-scrollbar border-t border-slate-200 bg-slate-50 lg:sticky lg:top-16 lg:h-[calc(100vh-64px)] lg:w-[390px] lg:shrink-0 lg:overflow-y-auto lg:overflow-x-hidden lg:border-t-0 lg:border-l">
                <div className="py-8 px-4 lg:px-8">
                  <div className="mx-auto max-w-sm lg:max-w-none">
                    {/* Details */}
                    <div className="mt-6">
                      <div className="mb-1 text-sm font-semibold text-slate-800">
                        Details
                      </div>
                      <ul>
                        <li className="flex items-center justify-between border-b border-slate-200 py-3">
                          <div className="text-sm">Customer Name</div>
                          <div className="ml-2 text-sm font-medium text-slate-800">
                            {order?.customerName}
                          </div>
                        </li>
                        <li className="flex items-center justify-between border-b border-slate-200 py-3">
                          <div className="text-sm">Status</div>
                          <div className="flex items-center whitespace-nowrap">
                            <div className="mr-2 h-2 w-2 rounded-full bg-emerald-500" />
                            <div className="text-sm font-medium text-slate-800">
                              {order?.status}
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>

                    {/* Detail Zone 1 */}
                    <div className="mt-6">
                      <div className="mb-4 text-sm font-semibold text-slate-800">
                        Pack Date
                      </div>
                      <div className="border-b border-slate-200 pb-4">
                        <div className="mb-2 flex justify-between text-sm">
                          <div>
                            {dayjs(order?.scheduledPackDateTime).format(
                              "MMM DD YY"
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Detail Zone 2 */}
                    <div className="mt-6">
                      <div className="mb-4 text-sm font-semibold text-slate-800">
                        Ship Date
                      </div>
                      <div className="border-b border-slate-200 pb-4">
                        <div className="mb-2 flex justify-between text-sm">
                          <div>
                            {dayjs(order?.scheduledShipDateTime).format(
                              "MMM DD YY"
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Edit / Delete */}
                    <div className="mt-6 flex items-center space-x-3">
                      <div className="w-1/2">
                        <button
                          type="button"
                          className="inline-flex items-center rounded-md border border-transparent bg-indigo-500 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                          <PencilIcon
                            className="-ml-0.5 mr-2 h-4 w-4"
                            aria-hidden="true"
                          />
                          Edit Order
                        </button>
                      </div>
                      <div className="w-1/2">
                        <button
                          type="button"
                          className="inline-flex items-center rounded-md border border-transparent bg-red-500 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                          <XMarkIcon
                            className="-ml-0.5 mr-2 h-4 w-4"
                            aria-hidden="true"
                          />
                          Cancel Order
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
