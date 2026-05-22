import {
  MapContainer,
  TileLayer,
  GeoJSON,
  AttributionControl,
} from "react-leaflet";
import { useTheme } from "@mui/material/styles";

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

  const style = theme.palette.mode === "dark" ? "jawg-dark" : "jawg-sunny";

  return (
    <MapContainer
      ref={mapRef}
      center={[39.8097343, -98.5556199]}
      zoom={4}
      style={{ height: "100vh", width: "100%" }}
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
      <AttributionControl position="topright" />
    </MapContainer>
  );
}
