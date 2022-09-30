import type { Package } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useCatch, useLoaderData, useNavigate } from "@remix-run/react";
import type { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import BasicTable from "~/components/BasicTable";
import { getAllPackages } from "~/modules/package/queries/get-packages.server";

type LoaderData = Awaited<ReturnType<typeof getAllPackages>>;

const tableTitle = "Packages";
const tableDescription = "List of all product inventory";

export const loader: LoaderFunction = async () => {
  const packages = await getAllPackages();
  return json<LoaderData>(packages);
};

export default function PackagesPage(): JSX.Element {
  const data = useLoaderData();
  const navigate = useNavigate();

  function handleAddButtonClick() {
    navigate("add");
  }

  // Column structure for table
  const columnData: readonly ColumnDef<Package>[] = [
    {
      id: "id",
      header: "ID",
      accessorKey: "id",
    },
    {
      id: "tag",
      header: "Tag",
      accessorFn: (row: any) => (row.tag ? row.tag.tagNumber : "No Tag"),
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
    },
    // {
    //   id: "item",
    //   header: "Item",
    //   accessorFn: (row: any) =>
    //     `${row.item.itemType?.productForm} - ${row.item.itemType?.productModifier} - ${row.item.strain?.name}`,
    // },
    {
      id: "form",
      header: "Form",
      accessorFn: (row: any) => `${row.item.itemType?.productForm}`,
    },
    {
      id: "mod",
      header: "Mod",
      accessorFn: (row: any) => `${row.item.itemType?.productModifier}`,
    },
    {
      id: "strain",
      header: "Strain",
      accessorFn: (row: any) => `${row.item.strain?.name}`,
    },
    {
      id: "testBatch",
      header: "Batch",
      accessorFn: (row: any) => `${row.labTests[0]?.labTest.batchCode}`,
    },
    {
      id: "thc",
      header: "THC",
      accessorFn: (row: any) => `${row.labTests[0]?.labTest.thcTotalPercent}`,
    },
    {
      id: "cbd",
      header: "CBD",
      accessorFn: (row: any) => `${row.labTests[0]?.labTest.cbdPercent}`,
    },
    {
      id: "terpenes",
      header: "Terps",
      accessorFn: (row: any) => `${row.labTests[0]?.labTest.terpenePercent}`,
    },
    {
      id: "totalCannabinoids",
      header: "Total Cannabinoids",
      accessorFn: (row: any) =>
        `${row.labTests[0]?.labTest.totalCannabinoidsPercent}`,
    },
    {
      id: "quantity",
      header: "Quantity",
      accessorKey: "quantity",
    },
    {
      id: "uom",
      header: "UoM",
      accessorFn: (row: any) => row.uom?.name,
    },
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
            {/* <div className="mt-6 flex space-x-3 md:mt-0 md:ml-4">
              <button
                type="button"
                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
              >
                Add many
              </button>
              <button
                type="button"
                onClick={handleAddButtonClick}
                className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
              >
                Add Package
              </button>
            </div> */}
          </div>
        </div>
      </div>
      <Outlet />
      <div>
        <BasicTable
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
