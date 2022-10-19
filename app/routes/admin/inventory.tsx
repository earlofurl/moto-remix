import type { PackageWithNesting } from "~/types/types";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useCatch, useLoaderData, useNavigate } from "@remix-run/react";
import type { ColumnDef } from "@tanstack/react-table";
import { createColumnHelper } from "@tanstack/react-table";
import BasicGroupingTable from "~/components/tables/BasicGroupingTable";
import { getAllPackagesAvailable } from "~/modules/package/queries/get-packages.server";
import { requireAuthSession } from "~/modules/auth/guards";
import { AuthSession } from "~/modules/auth/session.server";
import PackageTableRowActions from "../../components/tables/PackageTableRowActions";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EllipsisHorizontalIcon,
  PlusIcon,
} from "@heroicons/react/20/solid";
import { Menu, Transition } from "@headlessui/react";
import React, { Fragment } from "react";

type LoaderData = {
  authSession: AuthSession;
  data: Awaited<ReturnType<typeof getAllPackagesAvailable>>;
};

const tableTitle = "Packages";
const tableDescription = "List of all product inventory";
const columnHelper = createColumnHelper<PackageWithNesting>();

export const loader: LoaderFunction = async ({ request }) => {
  const authSession = await requireAuthSession(request);
  const data = await getAllPackagesAvailable();
  return json<LoaderData>({ authSession, data });
};

export default function InventoryPage(): JSX.Element {
  const { authSession, data } = useLoaderData();
  const navigate = useNavigate();

  function handleAddButtonClick() {
    navigate("create-package");
  }

  // Column structure for table
  const columnData: ColumnDef<PackageWithNesting>[] = [
    columnHelper.display({
      id: "actions",
      cell: (props) => <PackageTableRowActions row={props.row} />,
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
        columnHelper.accessor(
          (row: any) => `${row.labTests[0]?.labTest.cbdPercent}`,
          {
            id: "cbd",
            header: () => <span>CBD</span>,
            enableGrouping: false,
            enableColumnFilter: false,
            enableGlobalFilter: false,
            enableSorting: true,
          }
        ),
        columnHelper.accessor(
          (row: any) => `${row.labTests[0]?.labTest.terpenePercent}`,
          {
            id: "terpenes",
            header: () => <span>Terps</span>,
            enableGrouping: false,
            enableColumnFilter: false,
            enableGlobalFilter: false,
            enableSorting: true,
          }
        ),
        columnHelper.accessor(
          (row: any) => `${row.labTests[0]?.labTest.totalCannabinoidsPercent}`,
          {
            id: "totalCannabinoids",
            header: () => <span>Total Cannabinoids</span>,
            enableGrouping: false,
            enableColumnFilter: false,
            enableGlobalFilter: false,
            enableSorting: true,
          }
        ),
      ],
    }),
    columnHelper.group({
      id: "stock",
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
      ],
    }),
  ];

  return (
    <div className="flex h-screen flex-col">
      {/* Page header */}
      <header className="flex flex-none items-center justify-between border-b border-gray-200 py-4 px-6">
        <div>
          <h1 className="text-lg font-semibold leading-6 text-gray-900">
            <span className="sm:hidden">Inventory</span>
            <span className="hidden sm:inline">Inventory</span>
          </h1>
        </div>
        <div className="flex items-center">
          <div className="hidden md:ml-4 md:flex md:items-center">
            <div className="ml-6 h-6 w-px bg-gray-300" />
            <button
              type="button"
              onClick={handleAddButtonClick}
              className="ml-6 inline-flex items-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <PlusIcon
                className="-ml-0.5 mr-2 h-4 w-4"
                aria-hidden="true"
              />
              Create Package
            </button>
          </div>
        </div>
      </header>
      {/* End Page Header */}
      <Outlet />
      <div className="space-y-2">
        <div className="m-2 bg-white shadow sm:overflow-hidden sm:rounded-lg">
          <BasicGroupingTable
            tableTitle={tableTitle}
            tableDescription={tableDescription}
            columnData={columnData}
            tableData={data}
          />
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
    return <div>Packages not found</div>;
  }

  throw new Error(
    `Unexpected caught response with status: ${caught.status as number}`
  );
}
