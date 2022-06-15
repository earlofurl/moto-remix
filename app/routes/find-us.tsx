import type { Location } from "@prisma/client";
import { Link, useLoaderData } from "@remix-run/react";
import React from "react";
import { ClientOnly } from "remix-utils";
import MapBoxMap from "~/core/components/mapbox-map";
import { getAllLocations } from "~/modules/location/queries";

export function loader(): Promise<Location[]> {
  return getAllLocations();
}

export default function FindUs(): JSX.Element {
  const data = useLoaderData();
  const [first_location] = data;

  return (
    <div className="bg-brand-primary min-h-screen">
      <header>
        <div className="relative flex max-h-16 min-w-full items-center justify-center pt-4 pb-4 md:space-x-6">
          <div className="relative right-40 flex items-center justify-around">
            <div className="flex contents items-center justify-start space-x-10">
              <Link
                to="/strains"
                className="mx-auto text-2xl font-bold"
              >
                Strain Information
              </Link>
              <Link
                to="/find-us"
                className="mx-auto text-2xl font-bold"
              >
                Find Us
              </Link>
            </div>
          </div>
          <div className="absolute mx-auto flex items-center justify-center">
            <div className="from-brand-primary z-1 relative flex contents items-center overflow-visible rounded-full bg-gradient-to-b to-transparent pt-10">
              <Link
                to="/"
                className="font-bold"
              >
                <img
                  src="https://res.cloudinary.com/ursine-design/image/upload/q_auto:good,f_auto/v1654565806/Moto_Logo_Badge_Dark_x2xjut.png"
                  alt="Moto Logo"
                  className="h-24 w-24 rounded-full"
                />
              </Link>
            </div>
          </div>
          <div className="relative left-14 flex items-center justify-around">
            <div className="flex contents items-center justify-start space-x-10">
              <Link
                to="#"
                className="text-2xl font-bold"
              >
                Contact
              </Link>
              <Link
                to="#"
                className="text-2xl font-bold"
              >
                About
              </Link>
            </div>
          </div>
        </div>
      </header>
      <div className="relative flex-1 items-center">
        <div className="absolute mx-auto flex w-full justify-center py-16 px-4 sm:px-6 sm:py-24 lg:items-center lg:px-8">
          <ClientOnly fallback={<p>Loading...</p>}>
            {() => <MapBoxMap />}
          </ClientOnly>
        </div>
      </div>
    </div>
  );
}
