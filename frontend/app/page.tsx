"use client";

import { useJsonData } from "@/hooks/useJsonData";

import { statesData, stateAbbvMapping } from "./constants";
import { useMemo, useRef, useState } from "react";
import { Box, Fade, Modal } from "@mui/material";
import BaseMap from "@/components/BaseMap";
import BaseMapControls from "@/components/BaseMapControls";
import StateDetailChart from "@/components/StateDetailChart";

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

  const geoJsonRef = useRef<any>(null);
  const mapRef = useRef<any>(null);

  const defaultBounds = mapRef.current?.getBounds();

  const [activeDataFilters, setActiveDataFilters] = useState<{
    [key: string]: boolean;
  }>({
    auto: false,
    creditCard: false,
    mortgage: false,
    studentLoan: false,
    total: true,
  });
  const [activeYear, setActiveYear] = useState("2025");
  const [mapColorActiveFilter, setMapColorActiveFilter] = useState("total");
  const [geoJsonRefreshKey, setGeoJsonRefreshKey] = useState(0);
  const [selectedState, setSelectedState] = useState("Utah");
  const [showStateDetail, setShowStateDetail] = useState(false);

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
    const values = Object.values(
      dataMapping[mapColorActiveFilter as keyof typeof dataMapping] || {},
    ).map((d: any) => d[activeYear]);
    return [Math.min(...values.filter(Boolean)), Math.max(...values)];
  }, [mapColorActiveFilter, dataMapping, activeYear]);

  const colorScale = (value: number, max: number) => {
    const scale = [
      colorScaleMinMax[0],
      colorScaleMinMax[0] + (colorScaleMinMax[1] - colorScaleMinMax[0]) * 0.2,
      colorScaleMinMax[0] + (colorScaleMinMax[1] - colorScaleMinMax[0]) * 0.4,
      colorScaleMinMax[0] + (colorScaleMinMax[1] - colorScaleMinMax[0]) * 0.6,
      colorScaleMinMax[0] + (colorScaleMinMax[1] - colorScaleMinMax[0]) * 0.8,
      colorScaleMinMax[1],
    ];
    return value >= scale[4]
      ? "#bd0026"
      : value > scale[3]
        ? "#f03b20"
        : value > scale[2]
          ? "#fd8d3c"
          : value > scale[1]
            ? "#fecc5c"
            : value >= scale[0]
              ? "#ffffb2"
              : "grey";
  };

  const colorScaleLegendValues = useMemo(() => {
    const scale = [
      colorScaleMinMax[0],
      colorScaleMinMax[0] + (colorScaleMinMax[1] - colorScaleMinMax[0]) * 0.2,
      colorScaleMinMax[0] + (colorScaleMinMax[1] - colorScaleMinMax[0]) * 0.4,
      colorScaleMinMax[0] + (colorScaleMinMax[1] - colorScaleMinMax[0]) * 0.6,
      colorScaleMinMax[0] + (colorScaleMinMax[1] - colorScaleMinMax[0]) * 0.8,
      colorScaleMinMax[1],
    ];
    return scale.map((val) => `$${val.toLocaleString()}`);
  }, [colorScaleMinMax]);

  const geoJsonStyle = (feature: any) => {
    const filterData =
      dataMapping[mapColorActiveFilter as keyof typeof dataMapping];
    const stateAbbv =
      stateAbbvMapping[
        feature.properties.name as keyof typeof stateAbbvMapping
      ];
    const value =
      filterData && stateAbbv
        ? (filterData?.[stateAbbv as keyof typeof filterData]?.[activeYear] ??
          0)
        : 0;
    return {
      fillColor: colorScale(value, 50000),
      fillOpacity: 0.8,
      color: "black",
      weight: 1,
    };
  };

  const onEachFeatureHandler = (feature: any, layer: any) => {
    const stateName = feature.properties.name as string;
    const stateAbbv =
      stateAbbvMapping[stateName as keyof typeof stateAbbvMapping];
    const autoInfo = autoData
      ? autoData[stateAbbv as keyof typeof autoData][activeYear]
      : null;
    const creditCardInfo = creditCardData
      ? creditCardData[stateAbbv as keyof typeof creditCardData][activeYear]
      : null;
    const mortgageInfo = mortgageData
      ? mortgageData[stateAbbv as keyof typeof mortgageData][activeYear]
      : null;
    const studentLoanInfo = studentLoanData
      ? studentLoanData[stateAbbv as keyof typeof studentLoanData][activeYear]
      : null;
    const totalDebtInfo = totalData
      ? totalData[stateAbbv as keyof typeof totalData][activeYear]
      : null;

    layer.on({
      click: (e: any) => {
        mapRef.current?.flyToBounds(e.target.getBounds(), { duration: 1 });
        setSelectedState(stateName);
        setShowStateDetail(true);
      },
      pointerover: () => layer.setStyle({ fillOpacity: 1, weight: 2 }),
      pointerout: () => geoJsonRef.current?.resetStyle(),
    });

    layer.bindTooltip(
      `<div>
        <p><b>${stateName}</b></p>
        ${activeDataFilters.auto && autoInfo ? `<p>Auto Debt Per Capita: $${(autoInfo as number).toLocaleString()}</p>` : ""}
        ${activeDataFilters.creditCard && creditCardInfo ? `<p>Credit Card Debt Per Capita: $${(creditCardInfo as number).toLocaleString()}</p>` : ""}
        ${activeDataFilters.mortgage && mortgageInfo ? `<p>Mortgage Debt Per Capita: $${(mortgageInfo as number).toLocaleString()}</p>` : ""}
        ${activeDataFilters.studentLoan && studentLoanInfo ? `<p>Student Loan Debt Per Capita: $${(studentLoanInfo as number).toLocaleString()}</p>` : ""}
        ${activeDataFilters.total && totalDebtInfo ? `<p>Total Debt Per Capita: $${(totalDebtInfo as number).toLocaleString()}</p>` : ""}
      </div>`,
      { direction: "top", opacity: 1 },
    );
  };

  const returnToDefaultView = () => {
    setShowStateDetail(false);
    mapRef.current?.flyToBounds(defaultBounds, {
      duration: 1,
    });
  };

  return (
    <Box component="div" sx={{ height: "100svh", width: "100svw" }}>
      <BaseMapControls
        colorScaleLegendValues={colorScaleLegendValues}
        dataLabels={dataLabels}
        dataMapping={dataMapping}
        mapColorActiveFilter={mapColorActiveFilter}
        setMapColorActiveFilter={setMapColorActiveFilter}
        activeYear={activeYear}
        setActiveYear={setActiveYear}
        activeDataFilters={activeDataFilters}
        setActiveDataFilters={setActiveDataFilters}
        setGeoJsonRefreshKey={setGeoJsonRefreshKey}
        hideControls={!showStateDetail}
        mapRef={mapRef}
      />
      <Modal
        component="div"
        open={showStateDetail}
        onClose={() => {
          returnToDefaultView();
        }}
        closeAfterTransition
        aria-labelledby="state-detail-chart-title"
        aria-describedby="state-detail-chart-description"
      >
        <Fade in={showStateDetail} timeout={1000}>
          <Box>
            <StateDetailChart
              data={dataMapping as { [key: string]: any }}
              activeState={selectedState}
              onClose={() => {
                returnToDefaultView();
              }}
              stateAbbv={
                stateAbbvMapping[selectedState as keyof typeof stateAbbvMapping]
              }
            />
          </Box>
        </Fade>
      </Modal>
      <BaseMap
        data={statesData}
        mapRef={mapRef}
        geoJsonRef={geoJsonRef}
        geoJsonRefreshKey={geoJsonRefreshKey}
        geoJsonStyle={geoJsonStyle}
        onEachFeature={onEachFeatureHandler}
        loading={totalLoading}
      />
    </Box>
  );
}
