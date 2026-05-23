import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  AttributionControl,
} from "react-leaflet";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function BaseMap({
  data,
  mapRef,
  geoJsonRef,
  geoJsonRefreshKey,
  geoJsonStyle,
  onEachFeature,
  loading,
}: {
  data: any;
  mapRef: any;
  geoJsonRef: any;
  geoJsonRefreshKey: any;
  geoJsonStyle: any;
  onEachFeature: any;
  loading: boolean;
}) {
  const theme = useTheme();
  const deviceIsMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [showZoom, setShowZoom] = useState(false);
  const [showAttribution, setShowAttribution] = useState(false);

  useEffect(() => {
    if (!deviceIsMobile) {
      setShowZoom(true);
      setShowAttribution(true);
    } else {
      setShowZoom(false);
      setShowAttribution(false);
    }
  }, [deviceIsMobile]);

  const style = theme.palette.mode === "dark" ? "jawg-dark" : "jawg-sunny";

  return (
    <MapContainer
      ref={mapRef}
      center={[39.8097343, -98.5556199]}
      zoom={4}
      zoomControl={showZoom}
      style={{ height: "100svh", width: "100svw" }}
      attributionControl={false}
    >
      <TileLayer
        url={`https://tile.jawg.io/${style}/{z}/{x}/{y}{r}.png?access-token=${process.env.NEXT_PUBLIC_JAWG_API_KEY}`}
        attribution='&copy; <a href="https://www.jawg.io/">Jawg</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        crossOrigin={true}
      />
      {!loading && (
        <GeoJSON
          ref={geoJsonRef}
          key={geoJsonRefreshKey}
          data={data as any}
          onEachFeature={onEachFeature}
          style={geoJsonStyle}
        />
      )}
      {showAttribution && <AttributionControl position="topright" />}
    </MapContainer>
  );
}
