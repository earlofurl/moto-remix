// TODO: Fix which dash links get end prop

import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  FolderIcon,
  HomeIcon,
  InboxIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { NavLink, Outlet } from "@remix-run/react";

const navigation = [
  { name: "Dashboard", to: "/admin", icon: HomeIcon },
  {
    name: "Sales Sheets",
    to: "/admin/sales-sheets",
    icon: FolderIcon,
  },
  {
    name: "Locations",
    to: "/admin/locations",
    icon: InboxIcon,
  },
  {
    name: "Inventory",
    to: "/admin/inventory",
    icon: InboxIcon,
  },
  {
    name: "Labs",
    to: "/admin/lab-tests",
    icon: InboxIcon,
  },
  {
    name: "Orders",
    to: "/admin/orders",
    icon: InboxIcon,
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function BackendDash() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <div>
        <Transition.Root
          show={sidebarOpen}
          as={Fragment}
        >
          <Dialog
            as="div"
            className="relative z-40 md:hidden"
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
            </Transition.Child>

            <div className="fixed inset-0 z-40 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-gray-800">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute top-0 right-0 -mr-12 pt-2">
                      <button
                        type="button"
                        className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="h-0 flex-1 overflow-y-auto pt-5 pb-4">
                    <div className="flex flex-shrink-0 items-center px-4">
                      <img
                        className="h-10 w-auto"
                        src="https://res.cloudinary.com/spark-visions/image/upload/q_auto:good,f_auto,h_100,w_100/v1654565806/moto/Moto_Logo_Badge_Dark_x2xjut.png"
                        alt="Moto Perpetuo Farm"
                      />
                    </div>
                    <nav className="mt-5 space-y-1 px-2">
                      {navigation.map((item) => (
                        <NavLink
                          key={item.name}
                          to={item.to}
                          onClick={() => setSidebarOpen(false)}
                          className={({ isActive }) =>
                            classNames(
                              isActive
                                ? "bg-gray-900 text-white"
                                : "text-gray-300 hover:bg-gray-700 hover:text-white",
                              "group flex items-center rounded-md px-2 py-2 text-base font-medium"
                            )
                          }
                          end
                        >
                          <item.icon
                            className="mr-4 h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-300"
                            aria-hidden="true"
                          />
                          {item.name}
                        </NavLink>
                      ))}
                    </nav>
                  </div>

                  <div className="flex flex-shrink-0 bg-gray-700 p-4">
                    <a
                      href="#"
                      className="group block flex-shrink-0"
                    >
                      <div className="flex items-center">
                        {/* <div>
                          <img
                            className="inline-block h-10 w-10 rounded-full"
                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                            alt=""
                          />
                        </div> */}
                        <div className="ml-3">
                          <p className="text-base font-medium text-white">
                            Your Name
                          </p>
                          <p className="text-sm font-medium text-gray-400 group-hover:text-gray-300">
                            View profile
                          </p>
                        </div>
                      </div>
                    </a>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
              <div className="w-14 flex-shrink-0">
                {/* Force sidebar to shrink to fit close icon */}
              </div>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex min-h-0 flex-1 flex-col bg-gray-800">
            <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
              <div className="flex flex-shrink-0 items-center px-4">
                <img
                  className="h-10 w-auto"
                  src="https://res.cloudinary.com/spark-visions/image/upload/q_auto:good,f_auto,h_100,w_100/v1654565806/moto/Moto_Logo_Badge_Dark_x2xjut.png"
                  alt="Moto Perpetuo Farm"
                />
              </div>
              <nav className="mt-5 flex-1 space-y-1 px-2">
                {navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.to}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                      classNames(
                        isActive
                          ? "bg-gray-900 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white",
                        "group flex items-center rounded-md px-2 py-2 text-base font-medium"
                      )
                    }
                    end
                  >
                    <item.icon
                      className="mr-4 h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-300"
                      aria-hidden="true"
                    />
                    {item.name}
                  </NavLink>
                ))}
              </nav>
            </div>
            <div className="flex flex-shrink-0 bg-gray-700 p-4">
              <a
                href="#"
                className="group block w-full flex-shrink-0"
              >
                <div className="flex items-center">
                  {/* <div>
                    <img
                      className="inline-block h-9 w-9 rounded-full"
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      alt=""
                    />
                  </div> */}
                  <div className="ml-3">
                    <p className="text-sm font-medium text-white">Your Name</p>
                    <p className="text-xs font-medium text-gray-300 group-hover:text-gray-200">
                      View profile
                    </p>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
        <div className="flex flex-1 flex-col md:pl-64">
          <div className="sticky top-0 z-10 bg-gray-100 pl-1 pt-1 sm:pl-3 sm:pt-3 md:hidden">
            <button
              type="button"
              className="-ml-0.5 -mt-0.5 inline-flex h-12 w-12 items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon
                className="h-6 w-6"
                aria-hidden="true"
              />
            </button>
          </div>
          <main className="flex-1">
            <div className="py-6">
              {/* <div className="mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-2xl font-semibold text-gray-900">
                  Dashboard
                </h1>
              </div> */}
              <div className="mx-auto px-4 sm:px-6 md:px-8">
                <Outlet />
                {/* /End replace */}
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
