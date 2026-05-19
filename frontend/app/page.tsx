"use client";

import { useJsonData } from "@/hooks/useJsonData";

import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import Control from "react-leaflet-custom-control";
import { statesData, stateAbbvMapping } from "./constants";
import { useMemo, useRef, useState } from "react";
import { Box, Checkbox, MenuItem, Select, Typography } from "@mui/material";

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
    auto: false,
    creditCard: false,
    mortgage: false,
    studentLoan: false,
    total: true,
  });
  const [activeYear, setActiveYear] = useState("2025");
  const [mapColorActiveFilter, setMapColorActiveFilter] = useState("total");
  const [geoJsonRefreshKey, setGeoJsonRefreshKey] = useState(0);

  const dataMapping = {
    auto: autoData,
    creditCard: creditCardData,
    mortgage: mortgageData,
    studentLoan: studentLoanData,
    total: totalData,
  };

  const dataLabels = {
    auto: "Auto",
    creditCard: "Credit Card",
    mortgage: "Mortgage",
    studentLoan: "Student Loan",
    total: "Total",
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
    const creditCardInfo = creditCardData
      ? creditCardData[stateAbbv][activeYear]
      : null;
    const mortgageInfo = mortgageData
      ? mortgageData[stateAbbv][activeYear]
      : null;
    const studentLoanInfo = studentLoanData
      ? studentLoanData[stateAbbv][activeYear]
      : null;
    const totalDebtInfo = totalData ? totalData[stateAbbv][activeYear] : null;

    layer.on({
      click: (e) => mapRef.current?.fitBounds(e.target.getBounds()),
      pointerover: () => layer.setStyle({ fillOpacity: 1, weight: 2 }),
      pointerout: () => geoJsonRef.current?.resetStyle(),
    });

    layer.bindTooltip(
      `<div>
        <p><b>${stateName}</b></p>
        ${activeDataFilters.auto ? `<p>Auto Debt Per Capita: $${autoInfo.toLocaleString()}</p>` : ""}
        ${activeDataFilters.creditCard ? `<p>Credit Card Debt Per Capita: $${creditCardInfo.toLocaleString()}</p>` : ""}
        ${activeDataFilters.mortgage ? `<p>Mortgage Debt Per Capita: $${mortgageInfo.toLocaleString()}</p>` : ""}
        ${activeDataFilters.studentLoan ? `<p>Student Loan Debt Per Capita: $${studentLoanInfo.toLocaleString()}</p>` : ""}
        ${activeDataFilters.total ? `<p>Total Debt Per Capita: $${totalDebtInfo.toLocaleString()}</p>` : ""}
      </div>`,
      { direction: "top", opacity: 1 },
    );
  };

  return (
    <Box component="div" sx={{ height: "100vh", width: "100%" }}>
      <Box
        component="div"
        sx={{
          position: "absolute",
          top: 20,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          backgroundColor: "white",
          gap: 1,
          p: 2,
          borderRadius: 4,
          boxShadow: 3,
          alignItems: "center",
        }}
      >
        <Typography variant="h5">US Personal Debt Map</Typography>
        <Typography variant="body1" sx={{ fontSize: "0.875rem" }}>
          A map charting trends in personal debt from 2015 to 2025
        </Typography>
      </Box>
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
        <Control position="topright">
          <Box
            component="div"
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              p: 2,
              backgroundColor: "white",
              borderRadius: 4,
              boxShadow: 3,
            }}
          >
            <Box component="div">
              <Typography variant="h6" sx={{ fontSize: "1rem" }}>
                Debt Type
              </Typography>
              <Select
                size="small"
                value={mapColorActiveFilter}
                onChange={(e) => {
                  setMapColorActiveFilter(e.target.value);
                  setActiveDataFilters((prev) => {
                    const allFalse = Object.keys(prev).reduce((acc, key) => {
                      acc[key] = false;
                      return acc;
                    }, {});
                    const newFilters = {
                      [e.target.value]: true,
                    };
                    return { ...allFalse, ...newFilters };
                  });
                  setGeoJsonRefreshKey((prev) => prev + 1);
                }}
                style={{ width: "100%" }}
              >
                {Object.keys(dataMapping).map((key) => (
                  <MenuItem key={key} value={key}>
                    {dataLabels[key]}
                  </MenuItem>
                ))}
              </Select>
            </Box>
            <Box component="div">
              <Typography variant="h6" sx={{ fontSize: "1rem" }}>
                Year
              </Typography>
              <Select
                size="small"
                value={activeYear}
                onChange={(e) => {
                  setActiveYear(e.target.value);
                  setGeoJsonRefreshKey((prev) => prev + 1);
                }}
                style={{ width: "100%" }}
              >
                {[
                  "2015",
                  "2016",
                  "2017",
                  "2018",
                  "2019",
                  "2020",
                  "2021",
                  "2022",
                  "2023",
                  "2024",
                  "2025",
                ].map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </Box>
            <Box component="div">
              <Typography variant="h6" sx={{ fontSize: "1rem" }}>
                Show Debt Detail
              </Typography>
              {Object.keys(activeDataFilters).map((key) => (
                <Box
                  component="div"
                  key={key}
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <Checkbox
                    size="small"
                    checked={activeDataFilters[key]}
                    onChange={() => {
                      setActiveDataFilters((prev) => ({
                        ...prev,
                        [key]: !prev[key],
                      }));
                      setGeoJsonRefreshKey((prev) => prev + 1);
                    }}
                    sx={{ pl: 0 }}
                  />
                  <Typography sx={{ marginLeft: "5px", fontSize: "0.875rem" }}>
                    {dataLabels[key]}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Control>
        {!totalLoading && (
          <GeoJSON
            ref={geoJsonRef}
            key={geoJsonRefreshKey}
            data={statesData}
            onEachFeature={onEachFeatureHandler}
            style={geoJsonStyle}
          />
        )}
      </MapContainer>
    </Box>
  );
}
