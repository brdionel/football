import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const Map = ({ location }) => {
  return (
    <MapContainer
      center={[location.lat, location.lng]}
      zoom={13}
      style={{ height: "300px", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={[location.lat, location.lng]}>
        <Popup>Stadium Location</Popup>
      </Marker>
    </MapContainer>
  );
};

export default Map;
