import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  useActionData,
  useCatch,
  useLoaderData,
  useLocation,
  useNavigate,
  useTransition,
} from "@remix-run/react";
import React, { Fragment, useState } from "react";
import { requireAuthSession } from "~/modules/auth/guards";
import { AuthSession } from "~/modules/auth/session.server";
import { getUnassignedPackageTagsLimit20 } from "~/modules/packageTag/queries";
import { assignTagToPackage } from "~/modules/packageTag/mutations";
import SlideInRight from "~/components/layout/SlideInRight";
import { Combobox, Dialog, Listbox, Transition } from "@headlessui/react";
import {
  CheckIcon,
  ChevronUpDownIcon,
  CubeIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { PackageWithNesting } from "~/types/types";
import { PackageTag } from "@prisma/client";

type LoaderData = {
  authSession: AuthSession;
  packageTags: PackageTag[];
};

export const loader: LoaderFunction = async ({ request }) => {
  const authSession = await requireAuthSession(request, {
    onFailRedirectTo: "/login",
  });
  const packageTags = await getUnassignedPackageTagsLimit20();
  return json<LoaderData>({
    authSession,
    packageTags,
  });
};

// Action to assign new tag.
export const action: ActionFunction = async ({ request }) => {
  const body = await request.formData();
  const tagId = JSON.parse(body.get("tag-object") as string).id;
  const packageId = body.get("parent-package-id") as string;
  console.log("tagId", tagId);
  console.log("packageId", packageId);

  const newPackage = await assignTagToPackage({ packageId, tagId });
  return redirect(`/admin/inventory/`);
  //   return null
};

function classNames(...classes: (string | boolean)[]) {
  return classes.filter(Boolean).join(" ");
}

export default function AssignTagSlideIn(): JSX.Element {
  const locationState = useLocation();
  const formRef = React.useRef<HTMLFormElement>(null);
  const nameRef = React.useRef<HTMLInputElement>(null);

  const open = true;
  const navigate = useNavigate();
  const transition = useTransition();
  const actionData = useActionData();
  const { authSession, packageTags } = useLoaderData();

  function onDismiss() {
    navigate("../");
  }

  // selectedParentPackageId is passed by navigate on PackageTableRowActions
  const [selectedParentPackageId, setSelectedParentPackageId] = useState<
    string | null
  >(locationState.state ? locationState.state.selectedParentPackageId : null);

  // for input of the new tag number
  const [selectedPackageTag, setSelectedPackageTag] =
    useState<PackageTag | null>(null);

  const [packageTagQuery, setPackageTagQuery] = useState<string>("");

  // combobox filter for tag number to assign new package
  const filteredTags =
    packageTagQuery === ""
      ? packageTags
      : packageTags.filter((packageTag: PackageTag) => {
          return packageTag.tagNumber
            .toLowerCase()
            .includes(packageTagQuery.toLowerCase());
        });

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

  return (
    <>
      <SlideInRight>
        <Form
          ref={formRef}
          method="post"
          replace
          className="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl"
        >
          <div className="h-0 flex-1 overflow-y-auto">
            {/* SlideIn Header */}
            <div className="bg-indigo-700 py-6 px-4 sm:px-6">
              <div className="flex items-center justify-between">
                <Dialog.Title className="text-lg font-medium text-white">
                  {" "}
                  Assign Tag{" "}
                </Dialog.Title>
                <div className="ml-3 flex h-7 items-center">
                  <button
                    type="button"
                    className="rounded-md bg-indigo-700 text-indigo-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                    onClick={onDismiss}
                  >
                    <span className="sr-only">Close panel</span>
                    <XMarkIcon
                      className="h-6 w-6"
                      aria-hidden="true"
                    />
                  </button>
                </div>
              </div>
              <div className="mt-1">
                <p className="text-sm text-indigo-300">
                  Assign a new tag to the package.
                </p>
              </div>
            </div>
            {/* End SlideIn Header */}
            {/* Form Content */}
            <div className="flex flex-1 flex-col justify-between">
              <div className="divide-y divide-gray-200 px-4 sm:px-6">
                <div className="space-y-6 pt-6 pb-5">
                  <div>
                    <span>Assigning new tag to package: </span>
                    <span>{selectedParentPackageId}</span>
                  </div>
                  <input
                    type="hidden"
                    name="parent-package-id"
                    value={selectedParentPackageId}
                  />
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
                        <ChevronUpDownIcon
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
      </SlideInRight>
    </>
  );
}
