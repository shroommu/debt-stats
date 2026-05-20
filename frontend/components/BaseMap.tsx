import {
  MapContainer,
  TileLayer,
  GeoJSON,
  AttributionControl,
} from "react-leaflet";

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
  return (
    <MapContainer
      ref={mapRef}
      center={[39.8097343, -98.5556199]}
      zoom={4}
      style={{ height: "100vh", width: "100%" }}
      attributionControl={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
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
