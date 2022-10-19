import type { Strain } from "@prisma/client";
import { Link, useLoaderData } from "@remix-run/react";
import type { SortingState } from "@tanstack/react-table";
import {
  Column,
  ColumnDef,
  ColumnFiltersState,
  FilterFn,
  flexRender,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingFn,
  sortingFns,
  Table,
  useReactTable,
} from "@tanstack/react-table";
import { compareItems, rankItem } from "@tanstack/match-sorter-utils";
import { suffix } from "froebel/string";
import React from "react";
import { toCommonCase } from "~/utils/mytools";
import { getAllStrains } from "~/modules/strain/queries/get-strains.server";
import Navbar from "~/components/navbar";
import { CSVLink } from "react-csv";
import {
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/solid";

enum Availability {
  True = "TRUE",
  False = "FALSE",
  SoldOut = "SOLD_OUT",
}

const additionalInv = [
  {
    type: "Flower",
    quantity: 204,
    uom: "lbs",
    varieties: 70,
    varietyType: "batches",
  },
  {
    type: "Hash",
    quantity: 274,
    uom: "grams",
    varieties: 2,
    varietyType: "strains",
  },
  {
    type: "Pre-Rolls",
    quantity: 46000,
    uom: "0.5g joints",
    varieties: 54,
    varietyType: "batches",
  },
];

// Filter and DebouncedInput are at the bottom of the file

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // Store the ranking info
  addMeta(itemRank);

  // Return if the item should be filtered in/out
  return itemRank.passed;
};

const fuzzySort: SortingFn<any> = (rowA, rowB, columnId) => {
  let dir = 0;

  // Only sort by rank if the column has ranking information
  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(
      rowA.columnFiltersMeta[columnId],
      rowB.columnFiltersMeta[columnId]
    );
  }

  // Provide an alphanumeric fallback for when the item ranks are equal
  return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir;
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

// Could add color associated with terpene to object and use that to color the cell
const terpeneClassNames = (value: string) =>
  value.toLowerCase() === "pinene"
    ? "bg-green-200 text-green-800 font-semibold text-lg h-8 w-auto"
    : value.toLowerCase() === "caryophyllene"
    ? "bg-orange-100 text-orange-800 font-semibold text-lg h-8 w-auto"
    : value.toLowerCase() === "myrcene"
    ? "bg-red-100 text-red-800 font-semibold text-lg h-8 w-auto"
    : value.toLowerCase() === "limonene"
    ? "bg-yellow-100 text-yellow-800 font-semibold text-lg h-8 w-auto"
    : value.toLowerCase() === "terpinolene"
    ? "bg-cyan-100 text-cyan-800 font-semibold text-lg h-8 w-auto"
    : value.toLowerCase() === "humulene"
    ? "bg-purple-100 text-purple-800 font-semibold text-lg h-8 w-auto"
    : value.toLowerCase() === "linalool"
    ? "bg-emerald-100 text-emerald-800 font-semibold text-lg h-8 w-auto"
    : value.toLowerCase() === "fenchol"
    ? "bg-pink-100 text-pink-800 font-semibold text-lg h-8 w-auto"
    : value.toLowerCase() === "bisabolol"
    ? "bg-indigo-100 text-indigo-800 font-semibold text-lg h-8 w-auto"
    : "bg-gray-100 text-gray-800";

const terpeneCellColor = (value: string) => {
  return (
    <span
      className={classNames(
        "inline-flex items-center rounded px-2 py-0.5 text-xs font-medium",
        terpeneClassNames(value)
      )}
    >
      {value}
    </span>
  );
};

const checkMark = (value: boolean) => {
  return value ? (
    <span className="flex items-center justify-center">
      <CheckCircleIcon className="h-6 w-6 text-green-500" />
    </span>
  ) : (
    <span />
  );
};

const soldOut = () => {
  return (
    <span className="inline-flex h-8 w-auto items-center rounded bg-red-100 px-2 py-0.5 text-xs text-lg font-medium font-semibold text-red-800">
      Sold Out
    </span>
  );
};

const percentageValue = (value: string): JSX.Element => {
  return <span className="font-bold">{suffix(value, "%")}</span>;
};

const defaultColumns: ColumnDef<Strain>[] = [
  {
    header: "Availability",
    footer: (props) => props.column.id,
    columns: [
      {
        id: "light_dep_availability",
        accessorKey: "light_dep_2022",
        header: () => "Summer 2022",
        cell: (info) => {
          const value = info.getValue();
          if (value === "TRUE") {
            return checkMark(true);
          } else if (value === "FALSE") {
            return checkMark(false);
          } else {
            return soldOut();
          }
        },
        enableColumnFilter: false,
      },
      {
        id: "fall_availability",
        accessorKey: "fall_harvest_2022",
        header: () => "Fall 2022",
        cell: (info) => {
          const value = info.getValue();
          if (value === "TRUE") {
            return checkMark(true);
          } else if (value === "FALSE") {
            return checkMark(false);
          } else {
            return soldOut();
          }
        },
        enableColumnFilter: false,
      },
      {
        id: "quantity_available",
        accessorKey: "quantity_available",
        header: () => "Pounds Available",
        cell: (info) => {
          const value = info.getValue();
          if (value === "0") {
            return null;
          } else {
            return <span className="text-lg font-semibold">{value}</span>;
          }
        },
        enableColumnFilter: false,
        enableMultiSort: true,
      },
    ],
  },
  {
    header: "General",
    footer: (props) => props.column.id,
    columns: [
      {
        header: "Name",
        accessorKey: "name",
        cell: (info) => {
          const value = info.getValue();
          return <span className="font-bold">{value}</span>;
        },
        filterFn: fuzzyFilter,
        sortingFn: fuzzySort,
      },
      {
        accessorKey: "type",
        header: () => "Type",
        cell: (info) => {
          const value = info.getValue() as string;
          return <span className="font-semibold">{toCommonCase(value)}</span>;
        },
      },
    ],
  },
  {
    header: "Information",
    footer: (props) => props.column.id,
    columns: [
      {
        accessorKey: "yield_average",
        header: () => "Avg. Yield (Live Resin)",
        cell: (info) => {
          let value = Number(info.getValue()).toFixed(2);
          return value === "0.00" ? (
            (value = "N/A")
          ) : (
            <span className="font-bold">{percentageValue(value)}</span>
          );
        },
        enableColumnFilter: false,
        enableMultiSort: true,
      },
      {
        header: "Terpenes",
        footer: (props) => props.column.id,
        columns: [
          {
            accessorKey: "terp_1",
            header: () => "Top Terpene",
            cell: (info) => {
              const value = info.getValue();
              return terpeneCellColor(value);
            },
          },
          {
            accessorKey: "terp_2",
            header: () => "2nd Terpene",
            cell: (info) => {
              const value = info.getValue();
              return terpeneCellColor(value);
            },
          },
          {
            accessorKey: "terp_3",
            header: () => "3rd Terpene",
            cell: (info) => {
              const value = info.getValue();
              return terpeneCellColor(value);
            },
          },
          {
            accessorKey: "terp_4",
            header: () => "4th Terpene",
            cell: (info) => {
              const value = info.getValue();
              return terpeneCellColor(value);
            },
          },
          // {
          //   accessorKey: "terp_5",
          //   header: () => "5th Terpene",
          //   cell: (info) => {
          //     const value = info.getValue();
          //     return terpeneCellColor(value);
          //   },
          // },
          {
            accessorKey: "terp_average_total",
            header: () => "Avg Terpenes Extracted",
            cell: (info) => {
              let value = info.getValue().toString();
              return value === "0" ? (value = "N/A") : percentageValue(value);
            },
            enableColumnFilter: false,
          },
        ],
      },

      {
        accessorKey: "thc_average",
        header: () => "Avg THC",
        cell: (info) => {
          let value = info.getValue().toString();
          return value === "0" ? (value = "N/A") : percentageValue(value);
        },
        enableColumnFilter: false,
      },
      {
        accessorKey: "total_cannabinoid_average",
        header: () => "Avg Total Cannabinoids",
        cell: (info) => {
          let value = info.getValue().toString();
          return value === "0" ? (value = "N/A") : percentageValue(value);
        },
        enableColumnFilter: false,
      },
    ],
  },
];

export function loader(): Promise<Strain[]> {
  return getAllStrains();
}

export default function StrainAndProcessingData(): JSX.Element {
  const data = useLoaderData();
  const [columns] = React.useState<typeof defaultColumns>(() => [
    ...defaultColumns,
  ]);
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "quantity_available", desc: true },
    { id: "yield_average", desc: true },
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 50,
  });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      sorting,
      columnFilters,
      globalFilter,
      pagination,
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
  });

  const tableDep = table.getState().columnFilters[0]?.id;

  React.useEffect(() => {
    if (
      table.getState().columnFilters[0]?.id === "name" &&
      table.getState().sorting[0]?.id !== "name"
    ) {
      table.setSorting([{ id: "name", desc: false }]);
    }
  }, [table, tableDep]);

  return (
    <div className="min-h-screen bg-brand-primary">
      <Navbar />

      {/* Hero */}
      <div className="mx-auto max-w-7xl py-2 px-4 sm:py-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Know what you're going to get.
          </h1>
          <h2 className="mx-auto mt-5 max-w-xl pb-2 text-2xl text-gray-500">
            Browse our selection of over 100 strains and find exactly what you
            need. We store and ship on demand.
          </h2>
          <Link
            to="/#contact"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-green-700 px-5 py-3 text-base font-medium text-white hover:bg-green-600"
          >
            Contact Us
          </Link>
        </div>
      </div>
      {/* End Hero*/}

      {/* Additional Inventory */}
      <div className="mx-auto max-w-7xl p-4 shadow ring-black ring-opacity-25">
        <h2 className="text-3xl font-semibold leading-6 text-gray-900">
          Other Inventory Available
        </h2>
        <dl className="mt-5 grid grid-cols-1 divide-y divide-gray-300 overflow-hidden rounded-lg bg-gray-50 shadow md:grid-cols-3 md:divide-y-0 md:divide-x">
          {additionalInv.map((item) => (
            <div
              key={item.type}
              className="px-4 py-5 sm:p-6"
            >
              <dt className="text-lg font-medium text-gray-600">{item.type}</dt>
              <dd className="mt-1 flex items-baseline justify-between md:block lg:flex">
                <div className="flex items-baseline text-3xl font-semibold text-gray-700">
                  {item.quantity}
                  <span className="ml-2 text-sm font-medium text-gray-500">
                    {item.uom}
                  </span>
                </div>

                <div className="text-md inline-flex items-baseline rounded-full px-2.5 py-0.5 font-medium md:mt-2 lg:mt-0">
                  {item.varieties} {item.varietyType}
                </div>
              </dd>
            </div>
          ))}
        </dl>
        {/*<dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">*/}
        {/*  {additionalInv.map((item) => (*/}
        {/*    <div*/}
        {/*      key={item.type}*/}
        {/*      className="overflow-hidden rounded-lg bg-gray-100 px-4 py-5 shadow sm:p-6"*/}
        {/*    >*/}
        {/*      <dt className="truncate text-lg font-medium text-gray-600">*/}
        {/*        {item.type}*/}
        {/*      </dt>*/}
        {/*      <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">*/}
        {/*        {item.quantity}*/}
        {/*      </dd>*/}
        {/*    </div>*/}
        {/*  ))}*/}
        {/*</dl>*/}
      </div>
      {/* End Additional Inventory */}

      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mt-8 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="max-w-screen overflow-x-auto bg-emerald-400 px-4 shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <div className="py-2 sm:px-2 lg:px-4">
                  <div className="sm:flex sm:items-center">
                    <div className="group inline-flex sm:flex-auto">
                      <h1 className="pt-1 text-4xl font-semibold text-gray-900">
                        Fresh Frozen Strain Data
                      </h1>
                      <DebouncedInput
                        value={globalFilter ?? ""}
                        onChange={(value) => setGlobalFilter(String(value))}
                        className="my-1 mx-8 block w-auto rounded-md border-gray-300 py-2 pl-2 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                        placeholder="Search all columns..."
                      />
                      {/*TODO: Currently just exports the entire original data obj. Alter to export just what the table displays */}
                      <CSVLink
                        filename={"MotoStrainData.csv"}
                        data={data}
                        target="_blank"
                        className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        Export to CSV
                      </CSVLink>
                    </div>
                  </div>
                </div>
                <table className="min-w-full divide-y divide-gray-300 rounded ring-1 ring-green-600 ring-opacity-50">
                  <thead className="z-1 bg-emerald-500 shadow-sm ring-1 ring-black ring-opacity-5">
                    {table.getHeaderGroups().map((headerGroup) => (
                      <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <th
                            key={header.id}
                            colSpan={header.colSpan}
                            className="pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                          >
                            <div className="px-3 text-left text-sm font-semibold text-gray-900">
                              {header.isPlaceholder ? null : (
                                <>
                                  <div
                                    {...{
                                      className: header.column.getCanSort()
                                        ? "group inline-flex cursor-pointer select-none"
                                        : "",
                                      onClick:
                                        header.column.getToggleSortingHandler(),
                                    }}
                                  >
                                    {flexRender(
                                      header.column.columnDef.header,
                                      header.getContext()
                                    )}
                                    {{
                                      asc: (
                                        <span className="ml-2 max-h-6 flex-none rounded bg-blue-400/60 text-gray-800 ring-1 ring-gray-500">
                                          <ChevronUpIcon
                                            className="h-6 w-auto"
                                            aria-hidden="true"
                                          />
                                        </span>
                                      ),
                                      desc: (
                                        <span className="ml-2 max-h-6 flex-none rounded bg-blue-400/60 text-gray-800 ring-1 ring-gray-500">
                                          <ChevronDownIcon
                                            className="h-6 w-auto"
                                            aria-hidden="true"
                                          />
                                        </span>
                                      ),
                                    }[header.column.getIsSorted() as string] ??
                                      null}
                                  </div>
                                  <div>
                                    {header.column.getCanFilter() ? (
                                      <div>
                                        <Filter
                                          column={header.column}
                                          table={table}
                                        />
                                      </div>
                                    ) : null}
                                  </div>
                                </>
                              )}
                            </div>
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-gray-50">
                    {table.getRowModel().rows.map((row, rowIdx) => (
                      <tr
                        key={row.id}
                        {...{
                          className:
                            rowIdx % 2 === 0 ? undefined : "bg-gray-100",
                        }}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <td
                            key={cell.id}
                            className="whitespace-nowrap py-4 pl-4 pr-3 text-right text-sm font-medium text-gray-900 sm:pl-6"
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex items-center gap-2 py-2">
                  <button
                    className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    onClick={() => table.setPageIndex(0)}
                    disabled={!table.getCanPreviousPage()}
                    type="button"
                  >
                    {"<< First"}
                  </button>
                  <button
                    className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    type="button"
                  >
                    {"< Prev"}
                  </button>

                  <span className="flex items-center gap-1">
                    <div>Page</div>
                    <strong>
                      {table.getState().pagination.pageIndex + 1} of{" "}
                      {table.getPageCount()}
                    </strong>
                  </span>
                  <button
                    className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    type="button"
                  >
                    {"> Next"}
                  </button>
                  <button
                    className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                    disabled={!table.getCanNextPage()}
                    type="button"
                  >
                    {">> Last"}
                  </button>
                  <span className="flex items-center gap-1">
                    | Go to page:
                    <input
                      type="number"
                      defaultValue={table.getState().pagination.pageIndex + 1}
                      onChange={(e) => {
                        const page = e.target.value
                          ? Number(e.target.value) - 1
                          : 0;
                        table.setPageIndex(page);
                      }}
                      className="block w-16 rounded-md border-gray-300 p-1 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </span>
                  <select
                    value={table.getState().pagination.pageSize}
                    onChange={(e) => {
                      table.setPageSize(Number(e.target.value));
                    }}
                    className="block w-auto rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  >
                    {[20, 50, 100].map((pageSize) => (
                      <option
                        key={pageSize}
                        value={pageSize}
                      >
                        Show {pageSize}
                      </option>
                    ))}
                  </select>
                </div>
                {/*<div>{table.getPrePaginationRowModel().rows.length} Rows</div>*/}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="h-4" />
    </div>
  );
}

function Filter({ column, table }: { column: Column<any>; table: Table<any> }) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id);

  const columnFilterValue = column.getFilterValue();

  const sortedUniqueValues = React.useMemo(
    () =>
      typeof firstValue === "number"
        ? []
        : [...column.getFacetedUniqueValues().keys()].sort(),
    [column.getFacetedUniqueValues()]
  );

  return typeof firstValue === "number" ? (
    <div>
      <div className="flex space-x-2">
        <DebouncedInput
          type="number"
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? "")}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? "")}
          value={(columnFilterValue as [number, number])?.[0] ?? ""}
          onChange={(value) =>
            column.setFilterValue((old: [number, number]) => [value, old?.[1]])
          }
          placeholder={`Min ${
            column.getFacetedMinMaxValues()?.[0]
              ? `(${column.getFacetedMinMaxValues()?.[0]})`
              : ""
          }`}
          className="my-2 block w-auto rounded-md border-gray-300 py-2 pl-2 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
        />
        <DebouncedInput
          type="number"
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? "")}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? "")}
          value={(columnFilterValue as [number, number])?.[1] ?? ""}
          onChange={(value) =>
            column.setFilterValue((old: [number, number]) => [old?.[0], value])
          }
          placeholder={`Max ${
            column.getFacetedMinMaxValues()?.[1]
              ? `(${column.getFacetedMinMaxValues()?.[1]})`
              : ""
          }`}
          className="my-2 block w-auto rounded-md border-gray-300 py-2 pl-2 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
        />
      </div>
      <div className="h-1" />
    </div>
  ) : (
    <>
      <datalist id={column.id + "list"}>
        {sortedUniqueValues.slice(0, 5000).map((value: any) => (
          <option
            value={value}
            key={value}
          />
        ))}
      </datalist>
      <DebouncedInput
        type="text"
        value={(columnFilterValue ?? "") as string}
        onChange={(value) => column.setFilterValue(value)}
        placeholder={`Search... (${column.getFacetedUniqueValues().size})`}
        className="my-2 block w-auto rounded-md border-gray-300 py-2 pl-2 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
        list={column.id + "list"}
      />
      <div className="h-1" />
    </>
  );
}

// A debounced input react component
function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  const [value, setValue] = React.useState(initialValue);

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <input
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}
