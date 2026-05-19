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
  const {
    data: creditCardData,
    loading: creditCardLoading,
    error: creditCardError,
  } = useJsonData("/data/creditcard_cleaned.json");
  const {
    data: mortgageData,
    loading: mortgageLoading,
    error: mortgageError,
  } = useJsonData("/data/mortgage_cleaned.json");
  const {
    data: studentLoanData,
    loading: studentLoanLoading,
    error: studentLoanError,
  } = useJsonData("/data/studentloan_cleaned.json");
  const {
    data: totalData,
    loading: totalLoading,
    error: totalError,
  } = useJsonData("/data/total_cleaned.json");

  const geoJsonRef = useRef(null);
  const mapRef = useRef(null);

  const [activeDataFilters, setActiveDataFilters] = useState({
    auto: true,
    creditCard: true,
    mortgage: true,
    studentLoan: true,
    total: true,
  });

  const [activeYear, setActiveYear] = useState("2025");

  const [mapColorActiveFilter, setMapColorActiveFilter] = useState("total");

  const dataMapping = {
    auto: autoData,
    creditCard: creditCardData,
    mortgage: mortgageData,
    studentLoan: studentLoanData,
    total: totalData,
  };

  const colorScaleMinMax = useMemo(() => {
    const values = Object.values(dataMapping[mapColorActiveFilter] || {}).map(
      (d) => d[activeYear],
    );
    return [Math.min(...values.filter(Boolean)), Math.max(...values)];
  }, [mapColorActiveFilter, dataMapping, mapColorActiveFilter, activeYear]);

  const colorScale = (value: number, max: number) => {
    const scale = [
      colorScaleMinMax[0],
      colorScaleMinMax[0] + (colorScaleMinMax[1] - colorScaleMinMax[0]) * 0.2,
      colorScaleMinMax[0] + (colorScaleMinMax[1] - colorScaleMinMax[0]) * 0.4,
      colorScaleMinMax[0] + (colorScaleMinMax[1] - colorScaleMinMax[0]) * 0.6,
      colorScaleMinMax[0] + (colorScaleMinMax[1] - colorScaleMinMax[0]) * 0.8,
      colorScaleMinMax[1],
    ];
    return value >= scale[5]
      ? "#bd0026"
      : value > scale[4]
        ? "#f03b20"
        : value > scale[3]
          ? "#fd8d3c"
          : value > scale[2]
            ? "#feb24c"
            : value > scale[1]
              ? "#fed976"
              : value >= scale[0]
                ? "#ffffb2"
                : "grey";
  };

  const geoJsonStyle = (feature) => ({
    fillColor: colorScale(
      dataMapping[mapColorActiveFilter]
        ? dataMapping[mapColorActiveFilter][
            stateAbbvMapping[feature.properties.name]
          ][activeYear]
        : 0,
      50000,
    ),
    fillOpacity: 0.8,
    color: "black",
    weight: 1,
  });

  const onEachFeatureHandler = (feature: any, layer: any) => {
    const stateName = feature.properties.name;
    const stateAbbv = stateAbbvMapping[stateName];
    const autoInfo = autoData ? autoData[stateAbbv][activeYear] : null;
    const totalDebtInfo = totalData ? totalData[stateAbbv][activeYear] : null;

    layer.on({
      click: (e) => mapRef.current?.fitBounds(e.target.getBounds()),
      pointerover: () => layer.setStyle({ fillOpacity: 1, weight: 2 }),
      pointerout: () => geoJsonRef.current?.resetStyle(),
    });

    layer.bindTooltip(
      `<div>
        <p><b>${stateName}</b></p>
        <p>Auto Debt Per Capita: $${autoInfo.toLocaleString()}</p>
        <p>Total Debt Per Capita: $${totalDebtInfo.toLocaleString()}</p>
      </div>`,
      { direction: "top", opacity: 1 },
    );
  };

  return (
    <MapContainer
      ref={mapRef}
      center={[39.8097343, -98.5556199]}
      zoom={4}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {!totalLoading && (
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
