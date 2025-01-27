import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from 'leaflet';

const Map = ({ location }) => {
  const customIcon = new L.Icon({
    iconUrl: '/marker-icon-2x.png', // Ruta del ícono (asegúrate de que esté en la carpeta 'public')
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: '/marker-shadow.png', // Si usas un ícono con sombra
    shadowSize: [41, 41],
  });

  return (
    <MapContainer
      center={[location.lat, location.lng]}
      zoom={13}
      style={{ height: "300px", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={[location.lat, location.lng]} icon={customIcon}>
        <Popup>Stadium Location</Popup>
      </Marker>
    </MapContainer>
  );
};

export default Map;
