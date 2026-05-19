"use client";

import { useJsonData } from "@/hooks/useJsonData";

import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import { statesData, stateAbbvMapping } from "./constants";
import { useMemo, useRef, useState } from "react";

export default function Home() {
  const {
    data: autoData,
    loading: autoLoading,
    error: autoError,
  } = useJsonData("/data/auto_cleaned.json");

  const geoJsonRef = useRef(null);

  const [activeDataFilters, setActiveDataFilters] = useState({
    year: "2023",
    auto: true,
  });

  const [mapColorActiveFilter, setMapColorActiveFilter] = useState("auto");

  const colorScaleMinMax = useMemo(() => {
    if (mapColorActiveFilter === "auto") {
      const values = Object.values(autoData || {}).map((d) => d["2023"]);
      return [Math.min(...values.filter(Boolean)), Math.max(...values)];
    }
    return [0, 50000]; // default min and max values for color scale
  }, [mapColorActiveFilter, autoLoading, autoData]);

  const colorScale = (value: number, max: number) => {
    const scale = [
      colorScaleMinMax[0],
      colorScaleMinMax[0] + (colorScaleMinMax[1] - colorScaleMinMax[0]) * 0.2,
      colorScaleMinMax[0] + (colorScaleMinMax[1] - colorScaleMinMax[0]) * 0.4,
      colorScaleMinMax[0] + (colorScaleMinMax[1] - colorScaleMinMax[0]) * 0.6,
      colorScaleMinMax[0] + (colorScaleMinMax[1] - colorScaleMinMax[0]) * 0.8,
      colorScaleMinMax[1],
    ];
    return value > scale[5]
      ? "#bd0026"
      : value > scale[4]
        ? "#f03b20"
        : value > scale[3]
          ? "#fd8d3c"
          : value > scale[2]
            ? "#feb24c"
            : value > scale[1]
              ? "#fed976"
              : value > scale[0]
                ? "#ffffb2"
                : "grey";
  };

  const geoJsonStyle = (feature) => ({
    fillColor: colorScale(
      autoData
        ? autoData[stateAbbvMapping[feature.properties.name]]["2023"]
        : 0,
      50000,
    ),
    fillOpacity: 0.7,
    color: "black",
    weight: 1,
  });

  const onEachFeatureHandler = (feature: any, layer: any) => {
    const stateName = feature.properties.name;
    const stateAbbv = stateAbbvMapping[stateName];
    const autoInfo = autoData ? autoData[stateAbbv]["2023"] : null;

    layer.on({
      click: () =>
        console.log(
          `clicked on ${stateName} (${stateAbbv}) - Auto Info: ${autoInfo}`,
        ),
      pointerover: () => layer.setStyle({ fillOpacity: 1, weight: 2 }),
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
          style={geoJsonStyle}
        />
      )}
    </MapContainer>
  );
}
