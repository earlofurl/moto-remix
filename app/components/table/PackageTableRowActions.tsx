import { PencilSquareIcon, PlusIcon } from "@heroicons/react/24/outline";
import { PackageWithNesting } from "~/types/types";
import { useNavigate } from "@remix-run/react";
import { Row } from "@tanstack/react-table";

export default function PackageTableRowActions({
  row,
}: {
  row: Row<PackageWithNesting>;
}): JSX.Element {
  const navigate = useNavigate();

  function handleAddButtonClick() {
    return navigate("create-package", {
      state: { selectedParentPackageId: row.original.id },
    });
  }

  return (
    <div className="flex flex-row space-x-2">
      <button
        type="button"
        className="btn btn-sm btn-primary"
      >
        <PencilSquareIcon className="h-5 w-auto text-blue-600" />
      </button>
      <button
        type="button"
        className="btn btn-sm btn-primary"
        onClick={handleAddButtonClick}
      >
        <PlusIcon className="h-5 w-auto text-green-700" />
      </button>
    </div>
  );
}
