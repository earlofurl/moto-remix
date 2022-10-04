import { PencilAltIcon, PlusIcon } from "@heroicons/react/outline";

export default function TableRowActions(): JSX.Element {
  return (
    <div className="flex flex-row space-x-2">
      <button
        type="button"
        className="btn btn-sm btn-primary"
      >
        <PencilAltIcon className="h-6 w-auto text-blue-600" />
      </button>
      <button
        type="button"
        className="btn btn-sm btn-primary"
      >
        <PlusIcon className="h-6 w-auto text-green-700" />
      </button>
    </div>
  );
}
