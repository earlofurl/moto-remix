/** @format */

import { Combobox, Dialog, Listbox, Transition } from "@headlessui/react";
import {
  CheckIcon,
  CubeIcon,
  SelectorIcon,
  XIcon,
} from "@heroicons/react/outline";
import type {
  Item,
  ItemType,
  Package,
  PackageTag,
  Uom,
  LabTestsOnPackages,
  Strain,
} from "@prisma/client";
import { json, redirect } from "@remix-run/node";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import {
  Form,
  useActionData,
  useCatch,
  useLoaderData,
  useNavigate,
  useTransition,
} from "@remix-run/react";
import React, { Fragment, useState } from "react";
import convert from "convert";
import { getAllItems } from "~/modules/item/queries/get-items.server";
import { getAllItemTypes } from "~/modules/itemType/queries/get-item-types.server";
import { getUnassignedPackageTagsLimit20 } from "~/modules/packageTag/queries/get-package-tags.server";
import { getAllUoms } from "~/modules/uom/queries/get-uoms.server";
import { getAllPackages } from "~/modules/package/queries/get-packages.server";
import { createPackage } from "~/modules/package/mutations/mutate-package.server";
// import type { ItemWithNesting, PackageWithNesting } from "~/types/types";

type PackageWithNesting = Package & {
  tag: PackageTag;
  item: ItemWithNesting;
  labTests: LabTestsOnPackages[];
  uom: Uom;
  sourcePackages: PackageWithNesting[];
};

type ItemWithNesting = Item & {
  itemType: ItemType;
  strain: Strain;
};

type LoaderData = {
  itemTypes: ItemType[];
  items: Awaited<ReturnType<typeof getAllItems>>;
  packages: Awaited<ReturnType<typeof getAllPackages>>;
  packageTags: PackageTag[];
  uoms: Uom[];
};

type ActionData = {
  errors?: {
    quantity?: string;
    newParentQuantity?: string;
  };
};

export const loader: LoaderFunction = async () => {
  const itemTypes = await getAllItemTypes();
  const packages = await getAllPackages();
  const items = await getAllItems();
  const uoms = await getAllUoms();
  const packageTags = await getUnassignedPackageTagsLimit20();
  return json<LoaderData>({ itemTypes, packages, items, uoms, packageTags });
};

// hidden input forms fields are:
// tag-object
// parent-package-object
// item-object
// uom-object
// new-parent-quantity

// Action to add package to db.
export const action: ActionFunction = async ({ request }) => {
  const body = await request.formData();
  console.log(body);
  const tagId = JSON.parse(body.get("tag-object") as string).id;
  const sourcePackageId = JSON.parse(
    body.get("parent-package-object") as string
  ).id;
  const inheritedLabTestIds = JSON.parse(
    body.get("parent-package-object") as string
  ).labTests[0].labTestId;
  const itemId = JSON.parse(body.get("item-object") as string).id;
  const quantity = parseFloat(body.get("quantity") as string);
  const uomId = JSON.parse(body.get("uom-object") as string).id;
  const newParentQuantity = parseFloat(
    body.get("new-parent-quantity") as string
  );

  if (typeof quantity !== "number" || quantity === null) {
    return json<ActionData>(
      { errors: { quantity: "Quantity of new package is required" } },
      { status: 400 }
    );
  }

  if (typeof newParentQuantity !== "number" || newParentQuantity === null) {
    return json<ActionData>(
      {
        errors: {
          newParentQuantity: "New quantity of parent package is required",
        },
      },
      { status: 400 }
    );
  }

  const newPackage = await createPackage(
    tagId,
    sourcePackageId,
    inheritedLabTestIds,
    itemId,
    quantity,
    uomId,
    newParentQuantity
  );
  return redirect(`/admin/inventory/`);
  //   return null
};

function classNames(...classes: (string | boolean)[]) {
  return classes.filter(Boolean).join(" ");
}

export default function AddPackageSlideIn(): JSX.Element {
  // refs
  const formRef = React.useRef<HTMLFormElement>(null);
  const nameRef = React.useRef<HTMLInputElement>(null);
  const quantityRef = React.useRef<HTMLInputElement>(null);

  const open = true;
  const navigate = useNavigate();
  const transition = useTransition();
  const actionData = useActionData();
  const data = useLoaderData();
  const itemTypes = data.itemTypes;
  const packages = data.packages;
  const items = data.items;
  const uoms = data.uoms;
  // filter package tags to avoid adding a provisional tag to a new package
  const packageTags = data.packageTags;

  const [selectedParentPackage, setSelectedParentPackage] =
    useState<PackageWithNesting | null>(null);
  const [parentQuery, setParentQuery] = useState<string>("");

  const [selectedItem, setSelectedItem] = useState<ItemWithNesting | null>(
    null
  );
  const [itemQuery, setItemQuery] = useState<string>("");

  const [quantity, setQuantity] = useState<number>(0);
  const [selectedUom, setSelectedUom] = useState<Uom>(uoms[0]);

  const [selectedPackageTag, setSelectedPackageTag] =
    useState<PackageTag | null>(null);
  const [packageTagQuery, setPackageTagQuery] = useState<string>("");

  const [newParentQuantity, setNewParentQuantity] = useState<number>(0);

  // when quantity input updates, update newParentQuantity
  React.useEffect(() => {
    if (selectedParentPackage) {
      if (
        selectedParentPackage?.quantity &&
        selectedUom &&
        selectedUom.name !== "Each" &&
        selectedParentPackage?.uom.name !== "Each" &&
        quantityRef.current?.value !== ""
      ) {
        setNewParentQuantity(
          selectedParentPackage?.quantity -
            convert(quantity, selectedUom.name?.toLowerCase()).to(
              selectedParentPackage?.uom.name.toLowerCase()
            )
        );
      } else if (
        selectedParentPackage?.quantity &&
        selectedUom &&
        quantityRef.current?.value !== ""
      ) {
        setNewParentQuantity(selectedParentPackage?.quantity - quantity);
      } else if (selectedParentPackage?.quantity) {
        setNewParentQuantity(selectedParentPackage?.quantity);
      } else {
        setNewParentQuantity(0);
      }
    }
  }, [quantity, selectedParentPackage, selectedUom, convert]);

  // when selectedParentPackage updates, change selectedUom to the uom of the selectedParentPackage
  React.useEffect(() => {
    if (selectedParentPackage) {
      if (selectedParentPackage?.uom) {
        setSelectedUom(selectedParentPackage?.uom);
      }
    }
  }, [selectedParentPackage]);

  // when quantityRef is blank, set quantity to 0
  // React.useEffect(() => {
  //   if (quantityRef.current?.value === '') {
  //     setQuantity(0)
  //   }
  // }, [quantityRef])

  // combobox filter for tag number to assign new package
  const filteredTags =
    packageTagQuery === ""
      ? data.packageTags
      : data.packageTags.filter((packageTag: PackageTag) => {
          return packageTag.tagNumber
            .toLowerCase()
            .includes(packageTagQuery.toLowerCase());
        });

  // combobox filter for parent package to create new package from
  const filteredPackages =
    parentQuery === ""
      ? packages
      : packages.filter((parentPackage: PackageWithNesting) => {
          return parentPackage?.item?.strain?.name
            ?.toLowerCase()
            .includes(parentQuery.toLowerCase());
        });

  // combobox filter for item type of new package
  const filteredItems = selectedParentPackage
    ? items.filter((item: ItemWithNesting) => {
        return item.strain.name
          .toLowerCase()
          .includes(selectedParentPackage.item.strain.name.toLowerCase());
      })
    : items;
  // itemQuery === ""
  //   ? items
  //   : items.filter((queryItem: PackageWithNesting) => {
  //       return queryItem.strain?.name
  //         ?.toLowerCase()
  //         .includes(itemQuery.toLowerCase());
  //     });

  function onDismiss() {
    navigate("/admin/inventory/");
  }

  // Detect when form is submitting
  const isAdding =
    transition.state === "submitting" &&
    transition.submission.formData.get("_action") === "create";

  // Reset form on submit
  React.useEffect(() => {
    if (!isAdding) {
      formRef.current?.reset();
      nameRef.current?.focus();
    }
  }, [isAdding]);

  // Handle form input error
  // React.useEffect(() => {
  //   if (actionData?.errors?.name) {
  //     nameRef.current?.focus()
  //   }
  // }, [actionData])

  return (
    <Transition.Root
      show={open}
      as={Fragment}
    >
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-hidden"
        onClose={onDismiss}
      >
        <div className="absolute inset-0 overflow-hidden">
          <Dialog.Overlay className="absolute inset-0" />

          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-300 sm:duration-700"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-300 sm:duration-700"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <div className="pointer-events-auto w-screen max-w-md">
                {/* Form */}
                <Form
                  ref={formRef}
                  method="post"
                  replace={true}
                  className="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl"
                >
                  {/* Slide Out Header */}
                  <div className="h-0 flex-1 overflow-y-auto">
                    <div className="bg-indigo-700 py-6 px-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <Dialog.Title className="text-lg font-medium text-white">
                          {" "}
                          New Package{" "}
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="rounded-md bg-indigo-700 text-indigo-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                            onClick={onDismiss}
                          >
                            <span className="sr-only">Close panel</span>
                            <XIcon
                              className="h-6 w-6"
                              aria-hidden="true"
                            />
                          </button>
                        </div>
                      </div>
                      <div className="mt-1">
                        <p className="text-sm text-indigo-300">
                          Get started by filling in the information below to
                          create your new package.
                        </p>
                      </div>
                    </div>
                    {/* Form Content */}
                    <div className="flex flex-1 flex-col justify-between">
                      <div className="divide-y divide-gray-200 px-4 sm:px-6">
                        <div className="space-y-6 pt-6 pb-5">
                          <div>
                            {/* Parent Package Select Combobox */}
                            <Combobox
                              as="div"
                              value={selectedParentPackage}
                              onChange={setSelectedParentPackage}
                            >
                              <Combobox.Label className="block text-sm font-medium text-gray-700">
                                Select Parent Package
                              </Combobox.Label>
                              <div className="relative mt-1">
                                <Combobox.Input
                                  className="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                                  onChange={(event) => {
                                    setParentQuery(event.target.value);
                                  }}
                                  displayValue={(
                                    parentPackage: PackageWithNesting
                                  ) =>
                                    parentPackage?.tag?.tagNumber
                                      ? parentPackage?.tag?.tagNumber
                                      : "No package selected"
                                  }
                                />
                                {/* Actual input for ComboBox to avoid having to render selection as ID */}
                                <input
                                  type="hidden"
                                  name="parent-package-object"
                                  value={JSON.stringify(selectedParentPackage)}
                                />
                                {/*  */}
                                <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                                  <SelectorIcon
                                    className="h-5 w-5 text-gray-400"
                                    aria-hidden="true"
                                  />
                                </Combobox.Button>

                                {filteredPackages.length > 0 && (
                                  <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                    {filteredPackages.map(
                                      (
                                        parentPackage: PackageWithNesting,
                                        parentPackageIdx: number
                                      ) => (
                                        <Combobox.Option
                                          key={parentPackageIdx}
                                          value={parentPackage}
                                          className={({ active }) =>
                                            classNames(
                                              "relative cursor-default select-none py-2 pl-3 pr-9",
                                              active
                                                ? "bg-indigo-600 text-white"
                                                : "text-gray-900"
                                            )
                                          }
                                        >
                                          {({ active, selected }) => (
                                            <>
                                              <div className="flex">
                                                <span
                                                  className={classNames(
                                                    "block truncate",
                                                    selected && "font-semibold"
                                                  )}
                                                >
                                                  {
                                                    parentPackage?.item?.strain
                                                      ?.name
                                                  }
                                                </span>
                                                <span
                                                  className={classNames(
                                                    "ml-2 truncate text-gray-500",
                                                    active
                                                      ? "text-indigo-200"
                                                      : "text-gray-500"
                                                  )}
                                                >
                                                  {`${parentPackage?.item?.itemType?.productForm} ${parentPackage?.item?.itemType?.productModifier}`}
                                                </span>
                                                <span
                                                  className={classNames(
                                                    "ml-2 truncate text-gray-500",
                                                    active
                                                      ? "text-indigo-200"
                                                      : "text-gray-500"
                                                  )}
                                                >
                                                  {
                                                    parentPackage?.labTests[0]
                                                      .labTest.batchCode
                                                  }
                                                </span>
                                              </div>
                                              <div className="mt-1 flex">
                                                <span
                                                  className={classNames(
                                                    "ml-2 truncate text-gray-500",
                                                    active
                                                      ? "text-indigo-200"
                                                      : "text-gray-500"
                                                  )}
                                                >
                                                  {
                                                    parentPackage?.tag
                                                      ?.tagNumber
                                                  }
                                                </span>
                                                <span
                                                  className={classNames(
                                                    "ml-2 truncate text-gray-500",
                                                    active
                                                      ? "text-indigo-200"
                                                      : "text-gray-500"
                                                  )}
                                                >
                                                  {`${parentPackage?.labTests[0].labTest.thcTotalPercent}%`}
                                                </span>
                                              </div>

                                              {selected && (
                                                <span
                                                  className={classNames(
                                                    "absolute inset-y-0 right-0 flex items-center pr-4",
                                                    active
                                                      ? "text-white"
                                                      : "text-indigo-600"
                                                  )}
                                                >
                                                  <CheckIcon
                                                    className="h-5 w-5"
                                                    aria-hidden="true"
                                                  />
                                                </span>
                                              )}
                                            </>
                                          )}
                                        </Combobox.Option>
                                      )
                                    )}
                                  </Combobox.Options>
                                )}
                              </div>
                            </Combobox>
                            {/* Selected Parent Package Info Box */}
                            <div>
                              <span>
                                {selectedParentPackage?.item
                                  ? selectedParentPackage?.item.strain.name
                                  : "-"}
                              </span>{" "}
                              <span>
                                {selectedParentPackage?.labTests != null
                                  ? selectedParentPackage?.labTests[0]?.labTest
                                      .batchCode
                                  : "-"}
                              </span>{" "}
                              <span>
                                {selectedParentPackage?.labTests != null
                                  ? selectedParentPackage?.labTests[0]?.labTest
                                      .thcTotalPercent
                                  : "-"}
                                %
                              </span>
                            </div>

                            {/* Item Type Select Combobox */}
                            <Combobox
                              as="div"
                              value={selectedItem}
                              onChange={setSelectedItem}
                            >
                              <Combobox.Label className="block text-sm font-medium text-gray-700">
                                Select Item to Create
                              </Combobox.Label>
                              <div className="relative mt-1">
                                <Combobox.Input
                                  className="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                                  onChange={(event) => {
                                    setItemQuery(event.target.value);
                                  }}
                                  displayValue={(item: Item) =>
                                    item?.strain.name
                                      ? `${item?.itemType.productForm} - ${item?.itemType.productModifier} - ${item?.strain.name}`
                                      : "No item selected"
                                  }
                                />
                                {/* Actual input for ComboBox to avoid having to render selection as ID */}
                                <input
                                  type="hidden"
                                  name="item-object"
                                  value={JSON.stringify(selectedItem)}
                                />
                                {/*  */}
                                <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                                  <SelectorIcon
                                    className="h-5 w-5 text-gray-400"
                                    aria-hidden="true"
                                  />
                                </Combobox.Button>

                                {filteredItems.length > 0 && (
                                  <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                    {filteredItems.map(
                                      (item: Item, itemIdx: number) => (
                                        <Combobox.Option
                                          key={itemIdx}
                                          value={item}
                                          className={({ active }) =>
                                            classNames(
                                              "relative cursor-default select-none py-2 pl-3 pr-9",
                                              active
                                                ? "bg-indigo-600 text-white"
                                                : "text-gray-900"
                                            )
                                          }
                                        >
                                          {({ active, selected }) => (
                                            <>
                                              <div className="flex">
                                                <span
                                                  className={classNames(
                                                    "block truncate",
                                                    selected && "font-semibold"
                                                  )}
                                                >
                                                  {item?.itemType?.productForm}
                                                  {" - "}
                                                  {
                                                    item?.itemType
                                                      ?.productModifier
                                                  }
                                                  {" - "}
                                                  {item?.strain?.name}
                                                </span>
                                              </div>

                                              {selected && (
                                                <span
                                                  className={classNames(
                                                    "absolute inset-y-0 right-0 flex items-center pr-4",
                                                    active
                                                      ? "text-white"
                                                      : "text-indigo-600"
                                                  )}
                                                >
                                                  <CheckIcon
                                                    className="h-5 w-5"
                                                    aria-hidden="true"
                                                  />
                                                </span>
                                              )}
                                            </>
                                          )}
                                        </Combobox.Option>
                                      )
                                    )}
                                  </Combobox.Options>
                                )}
                              </div>
                            </Combobox>
                          </div>

                          {/* Parent quantity remaining tracker */}
                          <div className="flex flex-col items-center justify-center">
                            <span className="text-sm text-gray-700">
                              {" "}
                              Available:{" "}
                            </span>
                            <span className="text-sm text-gray-700">
                              {newParentQuantity}
                            </span>
                            <span className="text-sm text-gray-700">
                              {selectedParentPackage?.uom.name}
                            </span>
                            <input
                              type="hidden"
                              name="new-parent-quantity"
                              value={newParentQuantity}
                            />
                          </div>

                          {/* Quantity Input */}
                          <div className="flex flex-col sm:flex-row">
                            <label
                              htmlFor="quantity"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Enter Quantity
                            </label>
                            <div className="mt-1 flex rounded-md shadow-sm">
                              <div className="relative flex flex-grow items-stretch focus-within:z-10">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                  <CubeIcon
                                    className="h-5 w-5 text-gray-400"
                                    aria-hidden="true"
                                  />
                                </div>
                                <input
                                  type="number"
                                  name="quantity"
                                  id="quantity"
                                  ref={quantityRef}
                                  onChange={(event) => {
                                    setQuantity(parseFloat(event.target.value));
                                  }}
                                  className="block w-full rounded-none rounded-l-md border-gray-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                  placeholder="0.00"
                                  min={0}
                                />
                              </div>
                            </div>
                          </div>
                          {/* Quantity Type Select */}
                          <div className=" flex flex-col sm:flex-row">
                            <Listbox
                              value={selectedUom}
                              onChange={setSelectedUom}
                            >
                              {({ open }) => (
                                <>
                                  <Listbox.Label className="block text-sm font-medium text-gray-700">
                                    UoM
                                  </Listbox.Label>
                                  <div className="relative mt-1 w-full">
                                    <Listbox.Button className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm">
                                      <span className="block truncate">
                                        {selectedUom.name}
                                      </span>
                                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                        <SelectorIcon
                                          className="h-5 w-5 text-gray-400"
                                          aria-hidden="true"
                                        />
                                      </span>
                                    </Listbox.Button>
                                    <input
                                      type="hidden"
                                      name="uom-object"
                                      value={JSON.stringify(selectedUom)}
                                    />

                                    <Transition
                                      show={open}
                                      as={Fragment}
                                      leave="transition ease-in duration-100"
                                      leaveFrom="opacity-100"
                                      leaveTo="opacity-0"
                                    >
                                      <div>
                                        <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                          {uoms.map((uom: Uom) => (
                                            <Listbox.Option
                                              key={uom.id}
                                              className={({ active }) =>
                                                classNames(
                                                  active
                                                    ? "bg-indigo-600 text-white"
                                                    : "text-gray-900",
                                                  "relative cursor-default select-none py-2 pl-3 pr-9"
                                                )
                                              }
                                              value={uom}
                                            >
                                              {({ selected, active }) => (
                                                <>
                                                  <span
                                                    className={classNames(
                                                      selected
                                                        ? "font-semibold"
                                                        : "font-normal",
                                                      "block truncate"
                                                    )}
                                                  >
                                                    {uom.name}
                                                  </span>

                                                  {selected ? (
                                                    <span
                                                      className={classNames(
                                                        active
                                                          ? "text-white"
                                                          : "text-indigo-600",
                                                        "absolute inset-y-0 right-0 flex items-center pr-4"
                                                      )}
                                                    >
                                                      <CheckIcon
                                                        className="h-5 w-5"
                                                        aria-hidden="true"
                                                      />
                                                    </span>
                                                  ) : null}
                                                </>
                                              )}
                                            </Listbox.Option>
                                          ))}
                                        </Listbox.Options>
                                      </div>
                                    </Transition>
                                  </div>
                                </>
                              )}
                            </Listbox>
                          </div>
                          {/* New Package Tag Select */}
                          <Combobox
                            as="div"
                            value={selectedPackageTag}
                            onChange={setSelectedPackageTag}
                          >
                            <Combobox.Label className="block text-sm font-medium text-gray-700">
                              Select New Tag
                            </Combobox.Label>
                            <div className="relative mt-1">
                              <Combobox.Input
                                className="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:bg-gray-300 sm:text-sm"
                                onChange={(event) => {
                                  setPackageTagQuery(event.target.value);
                                }}
                                defaultValue={selectedPackageTag?.tagNumber}
                                displayValue={(packageTag: PackageTag) =>
                                  packageTag?.tagNumber
                                    ? packageTag.tagNumber
                                    : "No tag selected"
                                }
                              />
                              {/* Actual input for ComboBox to avoid having to render selection as ID */}
                              <input
                                type="hidden"
                                name="tag-object"
                                value={JSON.stringify(selectedPackageTag)}
                              />
                              {/*  */}
                              <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                                <SelectorIcon
                                  className="h-5 w-5 text-gray-400"
                                  aria-hidden="true"
                                />
                              </Combobox.Button>

                              {filteredTags.length > 0 && (
                                <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                  {filteredTags.map(
                                    (tag: PackageTag, tagIdx: number) => (
                                      <Combobox.Option
                                        key={tagIdx}
                                        value={tag}
                                        className={({ active }) =>
                                          classNames(
                                            "relative cursor-default select-none py-2 pl-3 pr-9",
                                            active
                                              ? "bg-indigo-600 text-white"
                                              : "text-gray-900"
                                          )
                                        }
                                      >
                                        {({ active, selected }) => (
                                          <>
                                            <span
                                              className={classNames(
                                                "block truncate",
                                                selected && "font-semibold"
                                              )}
                                            >
                                              {tag.tagNumber}
                                            </span>

                                            {selected && (
                                              <span
                                                className={classNames(
                                                  "absolute inset-y-0 right-0 flex items-center pr-4",
                                                  active
                                                    ? "text-white"
                                                    : "text-indigo-600"
                                                )}
                                              >
                                                <CheckIcon
                                                  className="h-5 w-5"
                                                  aria-hidden="true"
                                                />
                                              </span>
                                            )}
                                          </>
                                        )}
                                      </Combobox.Option>
                                    )
                                  )}
                                </Combobox.Options>
                              )}
                            </div>
                          </Combobox>

                          {/* <label className='font-medium text-gray-700'>
                            Provisional?
                          </label>
                          <input
                            id={'is-provisional'}
                            name={'is-provisional'}
                            type='checkbox'
                            defaultChecked={false}
                            className='h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 disabled:bg-gray-300'
                          ></input> */}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-shrink-0 justify-end px-4 py-4">
                    <button
                      type="button"
                      className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      onClick={onDismiss}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isAdding}
                      name="_action"
                      value="create"
                      className="ml-4 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      {isAdding ? <div>Saving...</div> : "Save"}
                    </button>
                  </div>
                </Form>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

export function ErrorBoundary({ error }: { error: Error }): JSX.Element {
  console.error(error);

  return <div>An unexpected error occurred: {error.message}</div>;
}

export function CatchBoundary(): JSX.Element {
  const caught = useCatch();

  if (caught.status === 404) {
    return <div>Not found</div>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
