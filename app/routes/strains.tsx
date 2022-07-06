import type { Strain } from "@prisma/client";
import { useLoaderData } from "@remix-run/react";
import type { SortingState } from "@tanstack/react-table";
import {
  createTable,
  getCoreRowModel,
  getSortedRowModel,
  useTableInstance,
} from "@tanstack/react-table";
import { suffix } from "froebel/string";
import React from "react";
import { toCommonCase } from "~/core/utils/mytools";
import { getAllStrains } from "~/modules/strain/queries/get-strains.server";
import Navbar from "~/core/components/navbar";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

// Could add color associated with terpene to object and use that to color the cell
const terpeneClassNames = (value: string) =>
  value.toLowerCase() === "pinene"
    ? "bg-green-200 text-green-800"
    : value.toLowerCase() === "caryophyllene"
    ? "bg-orange-100 text-orange-800"
    : value.toLowerCase() === "myrcene"
    ? "bg-red-100 text-red-800"
    : value.toLowerCase() === "limonene"
    ? "bg-yellow-100 text-yellow-800"
    : value.toLowerCase() === "terpinolene"
    ? "bg-cyan-100 text-cyan-800"
    : value.toLowerCase() === "humulene"
    ? "bg-purple-100 text-purple-800"
    : value.toLowerCase() === "linalool"
    ? "bg-emerald-100 text-emerald-800"
    : value.toLowerCase() === "fenchol"
    ? "bg-pink-100 text-pink-800"
    : value.toLowerCase() === "bisabolol"
    ? "bg-indigo-100 text-indigo-800"
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
      <div className="i-fa6-solid-circle-check h-6 w-6 text-green-500" />
    </span>
  ) : (
    <span />
  );
};

const percentageValue = (value: string): JSX.Element => {
  return <span className="font-medium">{suffix(value, "%")}</span>;
};

const table = createTable().setRowType<Strain>();

const defaultColumns = [
  table.createDataColumn("name", {
    id: "name",
    header: "Name",
    cell: (info) => {
      const value = info.getValue();
      return <span className="font-bold">{value}</span>;
    },
    footer: (props) => props.column.id,
  }),
  table.createDataColumn("type", {
    header: "Type",
    cell: (info) => {
      const value = info.getValue();
      return <span className="font-medium">{toCommonCase(value)}</span>;
    },
    footer: (props) => props.column.id,
  }),
  table.createDataColumn("yield_average", {
    header: "Avg Historical Yield",
    cell: (info) => {
      let value = Number(info.getValue()).toFixed(2);
      return value === "0.00" ? (value = "N/A") : percentageValue(value);
    },
    footer: (props) => props.column.id,
  }),
  table.createDataColumn("terp_1", {
    header: "Top Terpene",
    cell: (info) => {
      const value = info.getValue();
      return terpeneCellColor(value);
    },
    footer: (props) => props.column.id,
  }),
  table.createDataColumn("terp_2", {
    header: "2nd Terpene",
    cell: (info) => {
      const value = info.getValue();
      return terpeneCellColor(value);
    },
    footer: (props) => props.column.id,
  }),
  table.createDataColumn("terp_3", {
    header: "3rd Terpene",
    cell: (info) => {
      const value = info.getValue();
      return terpeneCellColor(value);
    },
    footer: (props) => props.column.id,
  }),
  table.createDataColumn("terp_4", {
    header: "4th Terpene",
    cell: (info) => {
      const value = info.getValue();
      return terpeneCellColor(value);
    },
    footer: (props) => props.column.id,
  }),
  table.createDataColumn("terp_5", {
    header: "5th Terpene",
    cell: (info) => {
      const value = info.getValue();
      return terpeneCellColor(value);
    },
    footer: (props) => props.column.id,
  }),
  table.createDataColumn("thc_average", {
    header: "Avg THC",
    cell: (info) => {
      let value = info.getValue().toString();
      return value === "0" ? (value = "N/A") : percentageValue(value);
    },
    footer: (props) => props.column.id,
  }),
  table.createDataColumn("total_cannabinoid_average", {
    header: "Avg Total Cannabinoids",
    cell: (info) => {
      let value = info.getValue().toString();
      return value === "0" ? (value = "N/A") : percentageValue(value);
    },
    footer: (props) => props.column.id,
  }),
  table.createDataColumn("terp_average_total", {
    header: "Avg Terpenes Extracted",
    cell: (info) => {
      let value = info.getValue().toString();
      return value === "0" ? (value = "N/A") : percentageValue(value);
    },
    footer: (props) => props.column.id,
  }),
  table.createDataColumn("light_dep_2022", {
    header: "Summer 2022",
    cell: (info) => {
      const value = info.getValue();
      return checkMark(value);
    },
    footer: (props) => props.column.id,
  }),
  table.createDataColumn("fall_harvest_2022", {
    header: "Fall 2022",
    cell: (info) => {
      const value = info.getValue();
      return checkMark(value);
    },
    footer: (props) => props.column.id,
  }),
];

export function loader(): Promise<Strain[]> {
  return getAllStrains();
}

export default function Strains(): JSX.Element {
  const data = useLoaderData();
  const [columns] = React.useState<typeof defaultColumns>(() => [
    ...defaultColumns,
  ]);
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "name", desc: false },
  ]);
  const instance = useTableInstance(table, {
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="bg-brand-primary min-h-screen">
      <Navbar />
      <div className="py-4 px-4 sm:px-6 lg:px-8">
        <div className="mt-8 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="z-1 bg-gradient-to-b from-emerald-600 to-emerald-500">
                    {instance.getHeaderGroups().map((headerGroup) => (
                      <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <th
                            key={header.id}
                            colSpan={header.colSpan}
                            className="py-1.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                          >
                            <div className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                              {header.isPlaceholder ? null : (
                                <div
                                  {...{
                                    className: header.column.getCanSort()
                                      ? "cursor-pointer select-none"
                                      : "",
                                    onClick:
                                      header.column.getToggleSortingHandler(),
                                  }}
                                >
                                  {header.renderHeader()}
                                  {{
                                    asc: " 🔼",
                                    desc: " 🔽",
                                  }[header.column.getIsSorted() as string] ??
                                    null}
                                </div>
                              )}
                            </div>
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-gray-50">
                    {instance.getRowModel().rows.map((row) => (
                      <tr key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                          <td
                            key={cell.id}
                            className="whitespace-nowrap py-4 pl-4 pr-3 text-right text-sm font-medium text-gray-900 sm:pl-6"
                          >
                            {cell.renderCell()}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="h-4" />
    </div>
  );
}
// Lil test change
