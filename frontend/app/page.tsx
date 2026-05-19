"use client";

import { useJsonData } from "@/hooks/useJsonData";

import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import { statesData, stateAbbvMapping } from "./constants";
import { useRef } from "react";

export default function Home() {
  const {
    data: autoData,
    loading: autoLoading,
    error: autoError,
  } = useJsonData("/data/auto_cleaned.json");

  const geoJsonRef = useRef(null);

  const onEachFeatureHandler = (feature: any, layer: any) => {
    const stateName = feature.properties.name;
    const stateAbbv = stateAbbvMapping[stateName];
    const autoInfo = autoData ? autoData[stateAbbv]["2023"] : null;

    layer.on({
      click: () =>
        console.log(
          `clicked on ${stateName} (${stateAbbv}) - Auto Info: ${autoInfo}`,
        ),
      pointerover: () => layer.setStyle({ fillColor: "blue" }),
      pointerout: () => geoJsonRef.current?.resetStyle(),
    });

    layer.bindTooltip(
      `<div>
        <p>${stateName} (${stateAbbv})</p>
        <p>Auto Debt Per Capita: $${autoInfo}.00</p>
      </div>`,
      { direction: "top", opacity: 1 },
    );
  };

  return (
    <MapContainer
      center={[39.8097343, -98.5556199]}
      zoom={4}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {!autoLoading && (
        <GeoJSON
          data={statesData}
          ref={geoJsonRef}
          onEachFeature={onEachFeatureHandler}
          style={{ fillColor: "grey", color: "black", weight: 1 }}
        />
      )}
    </MapContainer>
  );
}
