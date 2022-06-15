import type { Location } from "@prisma/client";
import { Link, useLoaderData } from "@remix-run/react";
import React from "react";
import { ClientOnly } from "remix-utils";
import MapBoxMap from "~/core/components/mapbox-map";
import { getAllLocations } from "~/modules/location/queries";
import Navbar from "~/core/components/navbar";

export function loader(): Promise<Location[]> {
  return getAllLocations();
}

export default function FindUs(): JSX.Element {
  const data = useLoaderData();
  const [first_location] = data;

  return (
    <div className="bg-brand-primary min-h-screen">
      <Navbar />
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
