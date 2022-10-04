import type { Item, LabTest, Package, PackageTag } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useCatch, useLoaderData, useNavigate } from "@remix-run/react";
import type { ColumnDef } from "@tanstack/react-table";
import { createColumnHelper } from "@tanstack/react-table";
import dayjs from "dayjs";
import BasicGroupingTable from "~/components/BasicGroupingTable";
import { getAllPackages } from "~/modules/package/queries/get-packages.server";
import { requireAuthSession } from "~/modules/auth/guards";
import { AuthSession } from "~/modules/auth/session.server";
import TableRowActions from "../../components/table/RowActions";

type PackageWithNesting = Package & {
  tag: PackageTag;
  labTests: LabTest[];
  item: Item;
};

type LoaderData = {
  authSession: AuthSession;
  data: Awaited<ReturnType<typeof getAllPackages>>;
};

const tableTitle = "Packages";
const tableDescription = "List of all product inventory";
const columnHelper = createColumnHelper<PackageWithNesting>();

export const loader: LoaderFunction = async ({ request }) => {
  const authSession = await requireAuthSession(request);
  const data = await getAllPackages();
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
      cell: (props) => <TableRowActions />,
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
    <>
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
                      View, add, edit, and delete Packages.
                    </h1>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 flex space-x-3 md:mt-0 md:ml-4">
              {/* <button
                type="button"
                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
              >
                Add many
              </button> */}
              <button
                type="button"
                onClick={handleAddButtonClick}
                className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
              >
                Add Package
              </button>
            </div>
          </div>
        </div>
      </div>
      <Outlet />
      <div>
        <BasicGroupingTable
          tableTitle={tableTitle}
          tableDescription={tableDescription}
          columnData={columnData}
          tableData={data}
        />
      </div>
    </>
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
