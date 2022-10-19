import { Popover, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { useCatch } from "@remix-run/react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React, { Fragment } from "react";

export default function BasicTable({
  tableTitle,
  tableDescription,
  columnData,
  tableData,
}): JSX.Element {
  const columns: readonly ColumnDef<object>[] = React.useMemo(() => {
    return columnData;
  }, [columnData]);

  const data: readonly object[] = React.useMemo(() => {
    return tableData;
  }, [tableData]);

  // const initialState = { hiddenColumns: ["id"] };

  const table = useReactTable({
    data,
    columns,
    initialState: {
      columnVisibility: {
        id: false,
      },
    },
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="px-2 sm:px-3 lg:px-4">
      {/* Table Title Bar */}
      <div className="sm:flex sm:items-center lg:px-2">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">{tableTitle}</h1>
          {/* <p className='mt-2 text-sm text-gray-700'>{tableDescription}</p> */}
        </div>
        <Popover className="relative inline-block text-left">
          <Popover.Button className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100">
            Columns
            <ChevronDownIcon
              className="-mr-1 ml-2 h-5 w-5"
              aria-hidden="true"
            />
          </Popover.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Popover.Panel className="z-60 absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              {/* <div className="grid grid-cols-1">*/}
              {/*  {columns.map((column) => (*/}
              {/*    <div key={column.id} className="text-left text-base">*/}
              {/*      <label className="block text-sm font-medium text-gray-700">*/}
              {/*        <input*/}
              {/*          type="checkbox"*/}
              {/*          /!*{...column.getToggleHiddenProps()}*!/*/}
              {/*        />{" "}*/}
              {/*        {column.id}*/}
              {/*      </label>*/}
              {/*    </div>*/}
              {/*  ))}*/}
              {/*  <br />*/}
              {/* </div>*/}
            </Popover.Panel>
          </Transition>
        </Popover>
      </div>
      {/* Table */}
      <div className="mt-4 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                {/* Table headers */}
                <thead className="bg-gray-50">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                          colSpan={header.colSpan}
                        >
                          <div className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                          </div>
                        </th>
                      ))}
                      {/* Actions Header */}
                      <th
                        scope="col"
                        className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                      >
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  ))}
                </thead>
                {/* Table body */}
                <tbody className="bg-white">
                  {table.getRowModel().rows.map((row) => (
                    <tr
                      // className={row.id % 2 === 0 ? undefined : "bg-gray-50"}
                      className="whitespace-nowrap py-4 pl-4 pr-3 text-right text-sm font-medium text-gray-900 sm:pl-6"
                      key={row.id}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}

                  {/* Edit Button */}
                  {/* <td className="relative inline-flex content-evenly py-3 pl-3 pr-3 sm:pr-6">*/}
                  {/*  <span className="px-1">*/}
                  {/*    <Link*/}
                  {/*      to={`${row.values.id}/edit`}*/}
                  {/*      // className='text-indigo-600 hover:text-indigo-900'*/}
                  {/*    >*/}
                  {/*      <PencilAltIcon className="h-6 w-6 text-blue-500" />*/}
                  {/*    </Link>*/}
                  {/*  </span>*/}
                  {/*  <span className="px-1">*/}
                  {/*    <Link*/}
                  {/*      to={`${row.values.id}/delete`}*/}
                  {/*      // className='text-indigo-600 hover:text-indigo-900'*/}
                  {/*    >*/}
                  {/*      <TrashIcon className="h-6 w-6 text-red-500" />*/}
                  {/*    </Link>*/}
                  {/*  </span>*/}
                  {/*  <span className="px-1">*/}
                  {/*    <Link*/}
                  {/*      to={`${row.values.id}`}*/}
                  {/*      // className='text-indigo-600 hover:text-indigo-900'*/}
                  {/*    >*/}
                  {/*      <ClipboardListIcon className="h-6 w-6 text-green-500" />*/}
                  {/*    </Link>*/}
                  {/*  </span>*/}
                  {/* </td>*/}
                  {/*  </tr>*/}
                  {/* ))}*/}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }): JSX.Element {
  return <div>An unexpected error occurred: {error.message}</div>;
}

export function CatchBoundary(): JSX.Element {
  const caught = useCatch();

  if (caught.status === 404) {
    return <div>Table not found</div>;
  }

  throw new Error(
    `Unexpected caught response with status: ${caught.status as number}`
  );
}
