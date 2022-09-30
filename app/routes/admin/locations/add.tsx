import {
  ActionFunction,
  json,
  LoaderFunction,
  redirect,
} from "@remix-run/node";
import { requireAuthSession } from "~/modules/auth/guards";
import { AuthSession, commitAuthSession } from "~/modules/auth/session.server";
import {
  Form,
  Link,
  Links,
  Meta,
  Scripts,
  useCatch,
  useLoaderData,
} from "@remix-run/react";
import Navbar from "~/components/navbar";
import { createLocation } from "~/modules/location/mutations";
import { assertIsPost } from "~/utils/http.server";
import TW404page from "~/components/TW404page";
import React from "react";

type LoaderData = {
  authSession: AuthSession;
};

export const loader: LoaderFunction = async ({ request }) => {
  const authSession = await requireAuthSession(request);
  return json<LoaderData>({ authSession });
};

export const action: ActionFunction = async ({ request }) => {
  assertIsPost(request);
  const authSession = await requireAuthSession(request, {
    onFailRedirectTo: "/login",
  });

  const body = await request.formData();
  // const { name, website, note, address, city, state, zip, latitude, longitude, flower, prerolls, hash, userId } = body.get("data");
  const name = body.get("name") as string;
  const website = body.get("company-website") as string;
  const note = body.get("note") as string;
  const address = body.get("address") as string;
  const city = body.get("city") as string;
  const state = body.get("state") as string;
  const zip = body.get("postal-code") as string;
  const latitude = Number(body.get("latitude"));
  const longitude = Number(body.get("longitude"));
  let flower = body.get("flower") as string | boolean;
  let prerolls = body.get("prerolls") as string | boolean;
  let hash = body.get("hash") as string | boolean;
  const userId = body.get("user_id") as string;

  flower.valueOf() === "on" ? (flower = true) : (flower = false);
  prerolls === "on" ? (prerolls = true) : (prerolls = false);
  hash === "on" ? (hash = true) : (hash = false);

  await createLocation({
    name,
    website,
    note,
    address,
    city,
    state,
    zip,
    latitude,
    longitude,
    flower,
    prerolls,
    pressed_hash: hash,
    created_by: userId,
  });
  return redirect("/admin/locations", {
    headers: {
      "Set-Cookie": await commitAuthSession(request, { authSession }),
    },
  });
};

export default function AddLocation(): JSX.Element {
  const { authSession } = useLoaderData();
  const { userId } = authSession;

  return (
    <div className="space-y-6 bg-gray-100">
      <Form method="post">
        <div className="bg-white px-4 py-5 shadow sm:rounded-lg sm:p-6">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                General
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                General information about the location.
              </p>
            </div>
            <div className="mt-5 md:col-span-2 md:mt-0">
              <div className="grid grid-cols-3 gap-6">
                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    autoComplete="company-name"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div className="col-span-3 sm:col-span-2">
                  <label
                    htmlFor="company-website"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Website
                  </label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500">
                      http://
                    </span>
                    <input
                      type="text"
                      name="company-website"
                      id="company-website"
                      className="block w-full flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="www.example.com"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="notes"
                  className="block text-sm font-medium text-gray-700"
                >
                  Notes
                </label>
                <div className="mt-1">
                  <textarea
                    id="note"
                    name="note"
                    rows={3}
                    className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Write whatever notes you need here..."
                    defaultValue={""}
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Brief description for this location. URLs are hyperlinked.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white px-4 py-5 shadow sm:rounded-lg sm:p-6">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Location Information
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Where to find this location.
              </p>
            </div>
            <div className="mt-5 md:col-span-2 md:mt-0">
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6">
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Street address
                  </label>
                  <input
                    type="text"
                    name="address"
                    id="address"
                    autoComplete="address"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div className="col-span-6 sm:col-span-6 lg:col-span-2">
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-700"
                  >
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    id="city"
                    autoComplete="address-level2"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                  <label
                    htmlFor="state"
                    className="block text-sm font-medium text-gray-700"
                  >
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    id="state"
                    defaultValue="OR"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                  <label
                    htmlFor="postal-code"
                    className="block text-sm font-medium text-gray-700"
                  >
                    ZIP / Postal code
                  </label>
                  <input
                    type="text"
                    name="postal-code"
                    id="postal-code"
                    autoComplete="postal-code"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                  <label
                    htmlFor="latitude"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Latitude
                  </label>
                  <input
                    type="text"
                    name="latitude"
                    id="latitude"
                    autoComplete="latitude"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                  <label
                    htmlFor="longitude"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Longitude
                  </label>
                  <input
                    type="text"
                    name="longitude"
                    id="longitude"
                    autoComplete="longitude"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                  <input
                    type="hidden"
                    name="user_id"
                    id="user_id"
                    value={userId}
                    className="hidden"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white px-4 py-5 shadow sm:rounded-lg sm:p-6">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Products
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Select which products this location offers.
              </p>
            </div>
            <div className="mt-5 md:col-span-2 md:mt-0">
              <fieldset>
                <legend className="sr-only">Products</legend>
                <div
                  className="text-base font-medium text-gray-900"
                  aria-hidden="true"
                >
                  Products
                </div>
                <div className="mt-4 space-y-4">
                  <div className="flex items-start">
                    <div className="flex h-5 items-center">
                      <input
                        id="flower"
                        name="flower"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label
                        htmlFor="flower"
                        className="font-medium text-gray-700"
                      >
                        Flower
                      </label>
                      <p className="text-gray-500">
                        This location carries flower.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex h-5 items-center">
                      <input
                        id="prerolls"
                        name="prerolls"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label
                        htmlFor="prerolls"
                        className="font-medium text-gray-700"
                      >
                        Prerolls
                      </label>
                      <p className="text-gray-500">
                        This location carries prerolls.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex h-5 items-center">
                      <input
                        id="hash"
                        name="hash"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label
                        htmlFor="hash"
                        className="font-medium text-gray-700"
                      >
                        Hash
                      </label>
                      <p className="text-gray-500">
                        This location carries hash.
                      </p>
                    </div>
                  </div>
                </div>
              </fieldset>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          {/*<button*/}
          {/*  type="button"*/}
          {/*  className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"*/}
          {/*>*/}
          {/*  Cancel*/}
          {/*</button>*/}
          <button
            type="submit"
            className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Save
          </button>
        </div>
      </Form>
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }): JSX.Element {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">
        <span
          role="img"
          aria-label="Sad face"
        >
          😢
        </span>
      </h1>
      <p className="text-lg">There was an error: {error.message}</p>
      <div className="mt-6">
        <Link
          to="/"
          className="text-base font-medium text-indigo-600 hover:text-indigo-500"
        >
          Go back home<span aria-hidden="true"> &rarr;</span>
        </Link>
      </div>
    </div>
  );
}

export function CatchBoundary(): JSX.Element {
  const caught = useCatch();
  return (
    <html>
      <head>
        <title>Oops!</title>
        <Meta />
        <Links />
      </head>
      <body>
        <TW404page
          status={caught.status}
          statusText={caught.statusText}
        />
        <Scripts />
      </body>
    </html>
  );
}
