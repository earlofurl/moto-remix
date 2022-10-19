import type { Order } from "@prisma/client";
import invariant from "tiny-invariant";
import dayjs from "dayjs";
import { CheckCircleIcon } from "@heroicons/react/solid";
import { ArrowCircleDownIcon } from "@heroicons/react/outline";
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
import BasicGroupingTable from "~/components/BasicGroupingTable";
import type { PackageWithNesting } from "~/types/types";
import { getAllPackagesOnOrder } from "~/modules/package/queries";

interface LoaderData {
  authSession: AuthSession;
  orderPackages: Awaited<ReturnType<typeof getAllPackagesOnOrder>>;
}

export const loader: LoaderFunction = async ({ request, params }) => {
  const authSession = await requireAuthSession(request, {
    onFailRedirectTo: "/login",
  });
  const orderPackages = await getAllPackagesOnOrder(params.toString());
  return json<LoaderData>({
    authSession,
    orderPackages,
  });
};

const tableTitle = "Line Items";
const tableDescription = "Line items on order";
const columnHelper = createColumnHelper<PackageWithNesting>();

export default function SingleOrderPage() {
  const uoms = useUoms();
  const orders = useOrders();
  const { orderId } = useParams();
  invariant(orderId, "orderId is required");
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
    // columnHelper.display({
    //   id: "actions",
    //   cell: (props) => <PackageTableRowActions row={props.row} />,
    //   enableGrouping: false,
    //   enableColumnFilter: false,
    //   enableGlobalFilter: false,
    //   enableSorting: false,
    // }),
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
          enableGrouping: true,
          enableColumnFilter: true,
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
      <div className="min-h-full">
        <main className="py-10">
          {/* Page header */}
          <div className="mx-auto max-w-4xl px-4 sm:px-6 md:flex md:items-center md:justify-between md:space-x-5 lg:max-w-7xl lg:px-8">
            <div className="flex items-center space-x-5">
              <div className="flex-shrink-0">
                <div className="relative">
                  {/* <img
                    className='h-16 w-16 rounded-full'
                    src='https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80'
                    alt=''
                  /> */}
                  <span
                    className="absolute inset-0 rounded-full shadow-inner"
                    aria-hidden="true"
                  />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {order?.customerName}
                </h1>
                <p className="text-sm font-medium text-gray-500">
                  Placed on {dayjs(order?.createdAt).format("MMM D, YYYY")}
                </p>
              </div>
            </div>
            <div className="justify-stretch mt-6 flex flex-col-reverse space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-y-0 sm:space-x-3 sm:space-x-reverse md:mt-0 md:flex-row md:space-x-3">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-100"
              >
                Cancel
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-100"
              >
                Advance
              </button>
            </div>
          </div>

          <div className="mx-auto mt-8 max-w-3xl sm:px-6 lg:max-w-full">
            <div className="grid grid-cols-1 flex-col gap-6 lg:grid-cols-3 lg:grid-rows-3">
              {/* Description list*/}
              <section
                aria-labelledby="customer-information-title"
                className="lg:col-span-2 lg:col-start-1 lg:row-span-1 lg:row-start-1"
              >
                <div className="bg-white shadow sm:rounded-lg">
                  <div className="px-4 py-5 sm:px-6">
                    <h2
                      id="applicant-information-title"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      Customer Information
                    </h2>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                      Details
                    </p>
                  </div>
                  <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">
                          Address
                        </dt>
                        {/*<dd className="mt-1 text-sm text-gray-900">*/}
                        {/*  {order?.customerFacility?.addressStreet1}{" "}*/}
                        {/*  {order?.customerFacility?.addressStreet2}*/}
                        {/*  {<br />}*/}
                        {/*  {order?.customerFacility?.addressCity}{" "}*/}
                        {/*  {order?.customerFacility?.addressState}{" "}*/}
                        {/*  {order?.customerFacility?.addressZip}*/}
                        {/*</dd>*/}
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">
                          Email address
                        </dt>
                        {/*<dd className="mt-1 text-sm text-gray-900">*/}
                        {/*  {order?.customerFacility?.contacts[0]?.contact.email}*/}
                        {/*</dd>*/}
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">
                          Phone
                        </dt>
                        {/*<dd className="mt-1 text-sm text-gray-900">*/}
                        {/*  {order?.customerFacility?.contacts[0]?.contact.phone}*/}
                        {/*</dd>*/}
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">
                          Items
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {order?.lineItemPackages?.length}
                        </dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">
                          Order Total
                        </dt>
                        {/*<dd className="mt-1 text-sm text-gray-900">*/}
                        {/*  ${totalPrice}*/}
                        {/*</dd>*/}
                      </div>
                    </dl>
                  </div>
                </div>
              </section>

              {/* Timeline Section */}
              <section
                aria-labelledby="timeline-title"
                className="lg:col-span-1 lg:col-start-3 lg:row-span-1 lg:row-start-1"
              >
                <div className="bg-white px-4 py-5 shadow sm:rounded-lg sm:px-6">
                  <h2
                    id="timeline-title"
                    className="text-lg font-medium text-gray-900"
                  >
                    Timeline
                  </h2>

                  {/* Activity Feed */}
                  <div className="mt-6 flow-root">
                    <ul className="-mb-8">
                      <li>
                        <div className="relative pb-8">
                          <span
                            className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                            aria-hidden="true"
                          />

                          <div className="relative flex space-x-3">
                            <div>
                              <span className="flex h-8 w-8 items-center justify-center rounded-full ring-8 ring-white">
                                <CheckCircleIcon className="text-green-400" />
                              </span>
                            </div>
                            <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                              <div>
                                <p className="text-sm text-gray-500">
                                  Order Placed{" "}
                                </p>
                              </div>
                              <div className="whitespace-nowrap text-right text-sm text-gray-500">
                                {dayjs(order?.createdAt).format(
                                  "MMM D, h:mm a"
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="relative pb-8">
                          <span
                            className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                            aria-hidden="true"
                          />

                          <div className="relative flex space-x-3">
                            <div>
                              <span className="flex h-8 w-8 items-center justify-center rounded-full ring-8 ring-white">
                                {order?.status === "Open" ? (
                                  <ArrowCircleDownIcon />
                                ) : (
                                  <CheckCircleIcon className="text-green-400" />
                                )}
                              </span>
                            </div>
                            <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                              <div>
                                <p className="text-sm text-gray-500">
                                  Scheduled Pack By{" "}
                                </p>
                              </div>
                              <div className="whitespace-nowrap text-right text-sm text-gray-500">
                                {dayjs(order?.scheduledPackDateTime).format(
                                  "ddd MMM D, h:mm a"
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="relative pb-8">
                          <span
                            className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                            aria-hidden="true"
                          />

                          <div className="relative flex space-x-3">
                            <div>
                              <span className="flex h-8 w-8 items-center justify-center rounded-full ring-8 ring-white">
                                {order?.status === "Open" ||
                                order?.status === "Packed" ? (
                                  <ArrowCircleDownIcon />
                                ) : (
                                  <CheckCircleIcon className="text-green-400" />
                                )}
                              </span>
                            </div>
                            <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                              <div>
                                <p className="text-sm text-gray-500">
                                  Scheduled Ship By{" "}
                                </p>
                              </div>
                              <div className="whitespace-nowrap text-right text-sm text-gray-500">
                                {dayjs(order?.scheduledShipDateTime).format(
                                  "ddd MMM D, h:mm a"
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="relative pb-8">
                          <div className="relative flex space-x-3">
                            <div>
                              <span className="flex h-8 w-8 items-center justify-center rounded-full ring-8 ring-white">
                                {order?.status === "Open" ||
                                order?.status === "Packed" ||
                                order?.status === "Shipped" ? (
                                  <ArrowCircleDownIcon />
                                ) : (
                                  <CheckCircleIcon className="text-green-400" />
                                )}
                              </span>
                            </div>
                            <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                              <div>
                                <p className="text-sm text-gray-500">
                                  Scheduled Delivery{" "}
                                </p>
                              </div>
                              <div className="whitespace-nowrap text-right text-sm text-gray-500">
                                {dayjs(order?.scheduledDeliveryDateTime).format(
                                  "ddd MMM D, h:mm a"
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div className="justify-stretch mt-6 flex flex-col">
                    <button
                      type="button"
                      className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Advance
                    </button>
                  </div>
                </div>
              </section>

              {/* Line Item Table */}
              <section
                aria-labelledby="items-title"
                className="space-y-6 lg:col-span-3 lg:row-span-2 lg:row-start-2"
              >
                <div className="bg-white shadow sm:overflow-hidden sm:rounded-lg">
                  <BasicGroupingTable
                    tableTitle={tableTitle}
                    tableDescription={tableDescription}
                    columnData={columnData}
                    tableData={order.lineItemPackages}
                  />
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
