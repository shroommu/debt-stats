import { Box, Checkbox, MenuItem, Select, Typography } from "@mui/material";

export default function BaseMapControls({
  colorScaleLegendValues,
  dataLabels,
  mapColorActiveFilter,
  setMapColorActiveFilter,
  activeYear,
  setActiveYear,
  activeDataFilters,
  setActiveDataFilters,
  setGeoJsonRefreshKey,
  dataMapping,
}: {
  colorScaleLegendValues: string[];
  dataLabels: { [key: string]: string };
  mapColorActiveFilter: string;
  setMapColorActiveFilter: (value: string) => void;
  activeYear: string;
  setActiveYear: (value: string) => void;
  activeDataFilters: { [key: string]: boolean };
  setActiveDataFilters: (value: { [key: string]: boolean }) => void;
  setGeoJsonRefreshKey: (value: number) => void;
  dataMapping: { [key: string]: any };
}) {
  return (
    <Box
      component="div"
      sx={{ position: "absolute", height: "100vh", width: "100%" }}
    >
      <Box
        component="div"
        sx={{
          position: "absolute",
          top: 10,
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
      <Box
        component="div"
        sx={{
          position: "absolute",
          bottom: 10,
          right: 10,
          zIndex: 1000,
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
              const allFalse = Object.keys(activeDataFilters).reduce(
                (acc: { [key: string]: boolean }, key) => {
                  acc[key] = false;
                  return acc;
                },
                {},
              );
              const newFilters = {
                [e.target.value]: true,
              };
              setActiveDataFilters({ ...allFalse, ...newFilters });
              setGeoJsonRefreshKey(Math.random());
            }}
            style={{ width: "100%" }}
          >
            {Object.keys(dataMapping).map((key) => (
              <MenuItem key={key} value={key}>
                {dataLabels[key as keyof typeof dataLabels]}
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
              setGeoJsonRefreshKey(Math.random());
            }}
            style={{ width: "100%" }}
            MenuProps={{
              anchorOrigin: {
                vertical: "top",
                horizontal: "center",
              },
              transformOrigin: {
                vertical: "bottom",
                horizontal: "center",
              },
            }}
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
                checked={
                  activeDataFilters[key as keyof typeof activeDataFilters]
                }
                onChange={() => {
                  setActiveDataFilters({
                    ...activeDataFilters,
                    [key]:
                      !activeDataFilters[key as keyof typeof activeDataFilters],
                  });
                  setGeoJsonRefreshKey(Math.random());
                }}
                sx={{ p: 0.5, pl: 0 }}
              />
              <Typography sx={{ marginLeft: "5px", fontSize: "0.875rem" }}>
                {dataLabels[key as keyof typeof dataLabels]}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
      <Box
        component="div"
        sx={{
          position: "absolute",
          bottom: 10,
          left: 10,
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          gap: 1,
          p: 2,
          backgroundColor: "white",
          borderRadius: 4,
          boxShadow: 3,
        }}
      >
        <Typography variant="h6" sx={{ fontSize: "1rem" }}>
          Legend
        </Typography>
        <Box component="div" sx={{ display: "flex", alignItems: "center" }}>
          <Box
            component="div"
            sx={{
              width: 20,
              height: 20,
              backgroundColor: "#ffffb2",
              marginRight: 1,
            }}
          />
          <Typography sx={{ fontSize: "0.875rem" }}>
            {`${colorScaleLegendValues[0]} - ${colorScaleLegendValues[1]}`}
          </Typography>
        </Box>
        <Box component="div" sx={{ display: "flex", alignItems: "center" }}>
          <Box
            component="div"
            sx={{
              width: 20,
              height: 20,
              backgroundColor: "#fecc5c",
              marginRight: 1,
            }}
          />
          <Typography sx={{ fontSize: "0.875rem" }}>
            {`${colorScaleLegendValues[1]} - ${colorScaleLegendValues[2]}`}
          </Typography>
        </Box>
        <Box
          component="div"
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Box
            component="div"
            sx={{
              width: 20,
              height: 20,
              backgroundColor: "#fd8d3c",
              marginRight: 1,
            }}
          />
          <Typography sx={{ fontSize: "0.875rem" }}>
            {`${colorScaleLegendValues[2]} - ${colorScaleLegendValues[3]}`}
          </Typography>
        </Box>
        <Box component="div" sx={{ display: "flex", alignItems: "center" }}>
          <Box
            component="div"
            sx={{
              width: 20,
              height: 20,
              backgroundColor: "#f03b20",
              marginRight: 1,
            }}
          />
          <Typography sx={{ fontSize: "0.875rem" }}>
            {`${colorScaleLegendValues[3]} - ${colorScaleLegendValues[4]}`}
          </Typography>
        </Box>
        <Box component="div" sx={{ display: "flex", alignItems: "center" }}>
          <Box
            component="div"
            sx={{
              width: 20,
              height: 20,
              backgroundColor: "#bd0026",
              marginRight: 1,
            }}
          />
          <Typography sx={{ fontSize: "0.875rem" }}>
            {`> ${colorScaleLegendValues[4]}`}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
