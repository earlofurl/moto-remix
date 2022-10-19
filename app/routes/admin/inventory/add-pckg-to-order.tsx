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
import SlideInRight from "~/components/layout/SlideInRight";
import { Combobox, Dialog, Listbox, Transition } from "@headlessui/react";
import {
  CheckIcon,
  ChevronUpDownIcon,
  CubeIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { getAllOpenOrders } from "~/modules/order/queries";
import { addPckgToOrder } from "~/modules/package/mutations";
import { Package, Order } from "@prisma/client";

type LoaderData = {
  authSession: AuthSession;
  orders: Order[];
};

export const loader: LoaderFunction = async ({ request }) => {
  const authSession = await requireAuthSession(request, {
    onFailRedirectTo: "/login",
  });
  const orders = await getAllOpenOrders();
  return json<LoaderData>({
    authSession,
    orders,
  });
};

// Action to assign add the package to an order
export const action: ActionFunction = async ({ request }) => {
  const body = await request.formData();
  const packageId = body.get("selected-package-id") as string;
  const orderId = body.get("order-select") as string;

  const assignPckg = await addPckgToOrder({ packageId, orderId });
  return redirect(`/admin/inventory/`);
};

function classNames(...classes: (string | boolean)[]) {
  return classes.filter(Boolean).join(" ");
}

export default function AddPckgToOrderSlideIn(): JSX.Element {
  const locationState = useLocation();
  const formRef = React.useRef<HTMLFormElement>(null);
  const nameRef = React.useRef<HTMLInputElement>(null);

  const open = true;
  const navigate = useNavigate();
  const transition = useTransition();
  const actionData = useActionData();
  const { authSession, orders } = useLoaderData();

  function onDismiss() {
    navigate("../");
  }

  // selectedParentPackageId is passed by navigate on PackageTableRowActions
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(
    locationState.state ? locationState.state.selectedPackage : null
  );

  // for input of the new order
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

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
                  Assign Package to Order{" "}
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
                  Assign a package to an order.
                </p>
              </div>
            </div>
            {/* End SlideIn Header */}
            {/* Form Content */}
            <div className="flex flex-1 flex-col justify-between">
              <div className="divide-y divide-gray-200 px-4 sm:px-6">
                <div className="space-y-6 pt-6 pb-5">
                  <div>
                    <span>Assigning package: </span>
                    <span>{JSON.stringify(selectedPackage)}</span>
                  </div>
                  <input
                    type="hidden"
                    name="selected-package-id"
                    value={selectedPackage?.id}
                  />
                  {/* New Order Select */}
                  <div>
                    <label
                      htmlFor="order"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Order
                    </label>
                    {/* TODO: I like the simplicity of native select but not the mobile ui */}
                    <select
                      id="order-select"
                      name="order-select"
                      className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    >
                      <option>Select an order...</option>
                      {orders.map((order: Order) => (
                        <option
                          key={order.id}
                          value={order.id}
                        >
                          {order.customerName}
                        </option>
                      ))}
                    </select>
                  </div>
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
