import { Form, Link, useLoaderData } from "@remix-run/react";
/* This example requires Tailwind CSS v2.0+ */
import { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import { ChartBarIcon, MenuIcon, XIcon } from "@heroicons/react/outline";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { json, LoaderFunction } from "@remix-run/node";
import { getAuthSession } from "~/core/auth/session.server";

type LoaderData = {
  email?: string;
};

const menuFeatures = [
  {
    name: "For Processors",
    description:
      "See our upcoming harvests of Fresh Frozen material. Data collected in previous years helps you choose the perfect strains.",
    to: "/db/strain-and-processing-data",
    icon: ChartBarIcon,
  },
];

export const loader: LoaderFunction = async ({ request }) => {
  const { email } = (await getAuthSession(request)) ?? {};
  return json<LoaderData>({ email });
};

function classNames(...classes: (string | boolean)[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar(): JSX.Element {
  return (
    <Popover className="relative bg-brand-primary">
      <div className="flex items-center justify-between px-4 py-6 sm:px-6 md:justify-start md:space-x-10">
        <div className="flex justify-start lg:w-0 lg:flex-1">
          <Link to="/#">
            <span className="sr-only">Moto Perpetuo Farm</span>
            <img
              className="h-10 w-auto sm:h-10"
              src="https://res.cloudinary.com/ursine-design/image/upload/q_auto:good,f_auto,h_75,w_75/v1654565806/Moto_Logo_Badge_Dark_x2xjut.png"
              alt="Moto Logo"
            />
          </Link>
        </div>
        <div className="-my-2 -mr-2 md:hidden">
          <Popover.Button className="inline-flex items-center justify-center rounded-md bg-brand-primary p-2 text-gray-800 hover:bg-brand-accent-light/70 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-black">
            <span className="sr-only">Open menu</span>
            <MenuIcon
              className="h-6 w-6"
              aria-hidden="true"
            />
          </Popover.Button>
        </div>
        <Popover.Group
          as="nav"
          className="hidden space-x-10 md:flex"
        >
          <Popover className="relative">
            {({ open }) => (
              <>
                <Popover.Button
                  className={classNames(
                    open ? "text-gray-900" : "text-gray-700",
                    "group inline-flex items-center rounded-md bg-brand-primary text-lg font-semibold hover:text-gray-900 focus:ring-2 focus:ring-black focus:ring-offset-2"
                  )}
                >
                  <span>Information</span>
                  <ChevronDownIcon
                    className={classNames(
                      open ? "text-gray-600" : "text-gray-500",
                      "ml-2 h-5 w-5 group-hover:text-gray-600"
                    )}
                    aria-hidden="true"
                  />
                </Popover.Button>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-200"
                  enterFrom="opacity-0 translate-y-1"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition ease-in duration-150"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 translate-y-1"
                >
                  <Popover.Panel className="absolute z-10 -ml-4 mt-3 w-screen max-w-md transform lg:left-1/2 lg:ml-0 lg:max-w-2xl lg:-translate-x-1/2">
                    <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                      <div className="relative grid gap-6 bg-brand-secondary/80 px-5 py-6 sm:gap-8 sm:p-8 lg:grid-cols-2">
                        {menuFeatures.map((menuFeature) => (
                          <Link
                            key={menuFeature.name}
                            to={menuFeature.to}
                            className="-m-3 flex items-start rounded-lg p-3 font-medium text-gray-100 hover:bg-gray-50 hover:text-gray-900"
                          >
                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-indigo-500 text-white sm:h-12 sm:w-12">
                              <menuFeature.icon
                                className="h-6 w-6"
                                aria-hidden="true"
                              />
                            </div>
                            <div className="ml-4">
                              <p className="text-base font-semibold">
                                {menuFeature.name}
                              </p>
                              <p className="mt-1 text-base">
                                {menuFeature.description}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                      {/*<div className="bg-gray-50 p-5 sm:p-8">*/}
                      {/*  <a*/}
                      {/*    href="#"*/}
                      {/*    className="-m-3 flow-root rounded-md p-3 hover:bg-gray-100"*/}
                      {/*  >*/}
                      {/*    <div className="flex items-center">*/}
                      {/*      <div className="text-base font-medium text-gray-900">*/}
                      {/*        Enterprise*/}
                      {/*      </div>*/}
                      {/*      <span className="ml-3 inline-flex items-center rounded-full bg-indigo-100 px-3 py-0.5 text-xs font-medium leading-5 text-indigo-800">*/}
                      {/*        New*/}
                      {/*      </span>*/}
                      {/*    </div>*/}
                      {/*    <p className="mt-1 text-sm text-gray-500">*/}
                      {/*      Empower your entire team with even more advanced*/}
                      {/*      tools.*/}
                      {/*    </p>*/}
                      {/*  </a>*/}
                      {/*</div>*/}
                    </div>
                  </Popover.Panel>
                </Transition>
              </>
            )}
          </Popover>

          <Link
            to="/find-us"
            className="text-lg font-semibold text-gray-700 hover:text-gray-900"
          >
            Find Us
          </Link>
          <Link
            to="/#about"
            className="text-lg font-semibold text-gray-700 hover:text-gray-900"
          >
            About
          </Link>
          <Link
            to="/#contact"
            className="text-lg font-semibold text-gray-700 hover:text-gray-900"
          >
            Contact Us
          </Link>

          {/*<Popover className="relative">*/}
          {/*  {({ open }) => (*/}
          {/*    <>*/}
          {/*      <Popover.Button*/}
          {/*        className={classNames(*/}
          {/*          open ? "text-gray-900" : "text-gray-500",*/}
          {/*          "group inline-flex items-center rounded-md bg-white text-base font-medium hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"*/}
          {/*        )}*/}
          {/*      >*/}
          {/*        <span>More</span>*/}
          {/*        <ChevronDownIcon*/}
          {/*          className={classNames(*/}
          {/*            open ? "text-gray-600" : "text-gray-400",*/}
          {/*            "ml-2 h-5 w-5 group-hover:text-gray-500"*/}
          {/*          )}*/}
          {/*          aria-hidden="true"*/}
          {/*        />*/}
          {/*      </Popover.Button>*/}

          {/*      <Transition*/}
          {/*        as={Fragment}*/}
          {/*        enter="transition ease-out duration-200"*/}
          {/*        enterFrom="opacity-0 translate-y-1"*/}
          {/*        enterTo="opacity-100 translate-y-0"*/}
          {/*        leave="transition ease-in duration-150"*/}
          {/*        leaveFrom="opacity-100 translate-y-0"*/}
          {/*        leaveTo="opacity-0 translate-y-1"*/}
          {/*      >*/}
          {/*        <Popover.Panel className="absolute left-1/2 z-10 mt-3 w-screen max-w-xs -translate-x-1/2 transform px-2 sm:px-0">*/}
          {/*          <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">*/}
          {/*            <div className="relative grid gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-8">*/}
          {/*              {resources.map((resource) => (*/}
          {/*                <a*/}
          {/*                  key={resource.name}*/}
          {/*                  href={resource.href}*/}
          {/*                  className="-m-3 block rounded-md p-3 hover:bg-gray-50"*/}
          {/*                >*/}
          {/*                  <p className="text-base font-medium text-gray-900">*/}
          {/*                    {resource.name}*/}
          {/*                  </p>*/}
          {/*                  <p className="mt-1 text-sm text-gray-500">*/}
          {/*                    {resource.description}*/}
          {/*                  </p>*/}
          {/*                </a>*/}
          {/*              ))}*/}
          {/*            </div>*/}
          {/*          </div>*/}
          {/*        </Popover.Panel>*/}
          {/*      </Transition>*/}
          {/*    </>*/}
          {/*  )}*/}
          {/*</Popover>*/}
        </Popover.Group>
        <div className="hidden items-center justify-end md:flex md:flex-1 lg:w-0">
          {/*{email ? (*/}
          {/*  <Form*/}
          {/*    method="post"*/}
          {/*    action="/logout"*/}
          {/*  >*/}
          {/*    <button*/}
          {/*      type="submit"*/}
          {/*      className="whitespace-nowrap text-base font-medium text-gray-500 hover:text-gray-900"*/}
          {/*    >*/}
          {/*      Logout*/}
          {/*    </button>*/}
          {/*  </Form>*/}
          {/*) : (*/}
          {/*  <p>Auth Not Found</p>*/}
          {/*)}*/}
        </div>
      </div>

      <Transition
        as={Fragment}
        enter="duration-200 ease-out"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="duration-100 ease-in"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <Popover.Panel
          focus
          className="absolute inset-x-0 top-0 z-10 origin-top-right transform p-2 transition md:hidden"
        >
          <div className="divide-y-2 divide-gray-50 rounded-lg bg-brand-primary shadow-lg ring-1 ring-black ring-opacity-5">
            <div className="px-5 pt-5 pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <img
                    className="h-8 w-auto"
                    src="https://res.cloudinary.com/ursine-design/image/upload/q_auto:good,f_auto,h_75,w_75/v1654565806/Moto_Logo_Badge_Dark_x2xjut.png"
                    alt="Moto Logo"
                  />
                </div>
                <div className="-mr-2">
                  <Popover.Button className="inline-flex items-center justify-center rounded-md bg-brand-accent-light/80 p-2 text-gray-100 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                    <span className="sr-only">Close menu</span>
                    <XIcon
                      className="h-6 w-6"
                      aria-hidden="true"
                    />
                  </Popover.Button>
                </div>
              </div>
              <div className="mt-6">
                <nav className="grid grid-cols-1 gap-7">
                  {menuFeatures.map((menuFeatures) => (
                    <Link
                      key={menuFeatures.name}
                      to={menuFeatures.to}
                      className="-m-3 flex items-center rounded-lg p-3 hover:bg-gray-50"
                    >
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-indigo-500 text-white">
                        <menuFeatures.icon
                          className="h-6 w-6"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="ml-4 text-base font-semibold text-gray-900">
                        {menuFeatures.name}
                      </div>
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
            <div className="py-6 px-5">
              <div className="grid grid-cols-2 gap-4">
                <Link
                  to="/strain-and-processing-data"
                  className="text-base font-semibold text-gray-900 hover:text-gray-700"
                >
                  Info for Processors
                </Link>

                <Link
                  to="/find-us"
                  className="text-base font-semibold text-gray-900 hover:text-gray-700"
                >
                  Find Us
                </Link>

                <Link
                  to="#/about"
                  className="text-base font-semibold text-gray-900 hover:text-gray-700"
                >
                  About
                </Link>

                <Link
                  to="/#contact"
                  className="text-base font-semibold text-gray-900 hover:text-gray-700"
                >
                  Contact Us
                </Link>
              </div>
              <div className="mt-6">
                {/*{email ? (*/}
                {/*  <Form*/}
                {/*    method="post"*/}
                {/*    action="/logout"*/}
                {/*  >*/}
                {/*    <button*/}
                {/*      type="submit"*/}
                {/*      className="whitespace-nowrap text-base font-medium text-gray-500 hover:text-gray-900"*/}
                {/*    >*/}
                {/*      Logout*/}
                {/*    </button>*/}
                {/*  </Form>*/}
                {/*) : null}*/}
              </div>
            </div>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
}

// export default function Navbar(): JSX.Element {
//   const navigationLeft = [
//     { to: "/strain-and-processing-data", name: "Data for Processors" },
//     { to: "/find-us", name: "Find" },
//   ];
//
//   const navigationRight = [
//     { to: "/#contact", name: "Contact" },
//     { to: "/#about", name: "About" },
//   ];
//
//   return (
//     <header className="bg-brand-primary">
//       <nav
//         className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
//         aria-label="Top"
//       >
//         <div className="flex w-full flex-wrap items-center justify-center border-b border-indigo-500 pt-6 lg:border-none">
//           <div className="flex items-center">
//             <div className="space-x-3 sm:space-x-5">
//               {navigationLeft.map((link) => (
//                 <Link
//                   key={link.name}
//                   to={link.to}
//                   className="text-lg font-semibold text-black hover:text-gray-400 sm:text-2xl"
//                 >
//                   {link.name}
//                 </Link>
//               ))}
//             </div>
//             <Link to="/">
//               <span className="sr-only">Moto Perpetuo Farm</span>
//               <img
//                 className="h-10 w-auto px-4"
//                 src="https://res.cloudinary.com/ursine-design/image/upload/q_auto:good,f_auto,h_75,w_75/v1654565806/Moto_Logo_Badge_Dark_x2xjut.png"
//                 alt="moto-logo"
//               />
//             </Link>
//             <div className="space-x-3 sm:space-x-5">
//               {navigationRight.map((link) => (
//                 <Link
//                   key={link.name}
//                   to={link.to}
//                   className="text-lg font-semibold text-black hover:text-gray-400 sm:text-2xl"
//                 >
//                   {link.name}
//                 </Link>
//               ))}
//             </div>
//           </div>
//         </div>
//       </nav>
//     </header>
//   );
// }
