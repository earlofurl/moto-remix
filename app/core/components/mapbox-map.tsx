import React, { useRef, useEffect, useState } from "react";
import Map, { Marker } from "react-map-gl";

export default function MapBoxMap(): JSX.Element {
  return (
    <Map
      initialViewState={{
        latitude: 45.5366464,
        longitude: -122.4202829,
        zoom: 14,
      }}
      style={{ width: 800, height: 600 }}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      mapboxAccessToken="pk.eyJ1IjoiZWFybG9mdXJsIiwiYSI6ImNsNGV3ajNwNjA3bnYzYmszYmU5NGh4ZG0ifQ.4qSxV7W5c3vdXXJXSYsR8g"
    >
      <Marker
        longitude={-122.4202829}
        latitude={45.5366464}
        color="red"
      />
    </Map>
  );
}
