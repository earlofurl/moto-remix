import type {Location} from "@prisma/client";
import {useLoaderData} from "@remix-run/react";
import React, {useMemo, useState} from "react";
import Map, {Marker, Popup} from "react-map-gl";
import {ClientOnly} from "remix-utils";
import Navbar from "~/components/navbar";
import {getAllLocations} from "~/modules/location/queries";

export async function loader(): Promise<{
    locations: Location[];
    token: string;
}> {
    const token = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

    if (!token) {
        throw new Error("Mapbox access token not found");
    }

    const locations = await getAllLocations();
    return {locations, token};
}

export default function FindUs(): JSX.Element {
    const {locations, token} = useLoaderData();
    const [popupInfo, setPopupInfo] = useState<Location | null>(null);

    const markers = useMemo(
        () =>
            locations.map((location: Location) => (
                <Marker
                    key={location.id}
                    longitude={location.longitude}
                    latitude={location.latitude}
                    anchor="bottom"
                    onClick={(e) => {
                        // If we let the click event propagates to the map, it will immediately close the popup
                        // with `closeOnClick: true`
                        e.originalEvent.stopPropagation();
                        setPopupInfo(location);
                    }}
                />
            )),
        [locations]
    );

    return (
        <div className="bg-brand-primary min-h-screen">
            <Navbar/>
            <div className="relative flex-1 items-center">
                <div
                    className="absolute mx-auto flex w-full justify-center py-16 px-4 sm:px-6 sm:py-24 lg:items-center lg:px-8">
                    <ClientOnly fallback={<p>Loading...</p>}>
                        {() => (
                            <Map
                                initialViewState={{
                                    latitude: 45.507_029_206_092_106,
                                    longitude: -122.660_588_627_871_99,
                                    zoom: 10,
                                }}
                                style={{width: 800, height: 600}}
                                mapStyle="mapbox://styles/mapbox/streets-v11"
                                mapboxAccessToken={token}
                            >
                                {markers}
                                {popupInfo && (
                                    <Popup
                                        anchor="top"
                                        longitude={Number(popupInfo.longitude)}
                                        latitude={Number(popupInfo.latitude)}
                                        onClose={() => { setPopupInfo(null); }}
                                    >
                                        <div>
                                            {popupInfo.name}, {popupInfo.address} |{" "}
                                            <a
                                                target="_new"
                                                href={`https://maps.google.com/?q=${popupInfo.name}%2C${popupInfo.city}%2C${popupInfo.state}`}
                                            >
                                                Google
                                            </a>
                                        </div>
                                    </Popup>
                                )}
                            </Map>
                        )}
                    </ClientOnly>
                </div>
            </div>
        </div>
    );
}
