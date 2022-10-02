import type { LabTest } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useCatch, useLoaderData, useNavigate } from "@remix-run/react";
import type { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import BasicTable from "~/components/BasicTable";
import { getAllLabTests } from "~/modules/labTest/queries/get-lab-tests.server";
import { requireAuthSession } from "~/modules/auth/guards";
import { AuthSession } from "~/modules/auth/session.server";

// type LoaderData = Awaited<ReturnType<typeof getAllLabTests>>;
type LoaderData = {
  authSession: AuthSession;
  data: Awaited<ReturnType<typeof getAllLabTests>>;
};

const tableTitle = "Lab Tests";
const tableDescription = "Test Results";

export const loader: LoaderFunction = async ({ request }) => {
  const authSession = await requireAuthSession(request);
  const data = await getAllLabTests();
  return json<LoaderData>({ authSession, data });
};

export default function LabTestsPage(): JSX.Element {
  const { authSession, data } = useLoaderData();
  const navigate = useNavigate();

  function handleAddButtonClick() {
    navigate("add");
  }

  // Column structure for table
  const columnData: readonly ColumnDef<LabTest>[] = [
    {
      id: "id",
      header: "ID",
      accessorKey: "id",
    },
    {
      id: "testName",
      header: "Test Name",
      accessorKey: "testName",
    },
    {
      id: "batch",
      header: "Batch",
      accessorKey: "batchCode",
    },
    {
      id: "thc",
      header: "THC",
      accessorKey: "thcTotalPercent",
    },
    {
      id: "cbd",
      header: "CBD",
      accessorKey: "cbdPercent",
    },
    {
      id: "delta9ThcPercent",
      header: "delta9ThcPercent",
      accessorKey: "delta9ThcPercent",
    },
    {
      id: "delta8ThcPercent",
      header: "delta8ThcPercent",
      accessorKey: "delta8ThcPercent",
    },
    {
      id: "thcVPercent",
      header: "thcVPercent",
      accessorKey: "thcVPercent",
    },
    {
      id: "cbdAPercent",
      header: "cbdAPercent",
      accessorKey: "cbdAPercent",
    },
    {
      id: "cbnPercent",
      header: "cbnPercent",
      accessorKey: "cbnPercent",
    },
    {
      id: "cbgAPercent",
      header: "cbgAPercent",
      accessorKey: "cbgAPercent",
    },
    {
      id: "cbgPercent",
      header: "cbgPercent",
      accessorKey: "cbgPercent",
    },
    {
      id: "cbcPercent",
      header: "cbcPercent",
      accessorKey: "cbcPercent",
    },
    {
      id: "totalCannabinoidsPercent",
      header: "totalCannabinoidsPercent",
      accessorKey: "totalCannabinoidsPercent",
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
                      Test Results
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
    return <div>Tests not found</div>;
  }

  throw new Error(
    `Unexpected caught response with status: ${caught.status as number}`
  );
}
