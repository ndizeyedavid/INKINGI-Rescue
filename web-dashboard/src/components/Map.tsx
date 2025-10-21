'use client';

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const locations = [
  { position: [-1.9441, 30.0619], name: 'Kigali' },
  { position: [-1.9549, 30.0915], name: 'Remera' },
  { position: [-1.9364, 30.0514], name: 'Kiyovu' },
  { position: [-1.9706, 30.1044], name: 'Kicukiro' },
];

const Map = () => {
  const position: [number, number] = [-1.9441, 30.0619]; // Default to Kigali

  const DefaultIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
  });

  return (
    <MapContainer center={position} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {locations.map((location, idx) => (
        <Marker key={idx} position={location.position as [number, number]} icon={DefaultIcon}>
          <Popup>
            Incident Location: {location.name}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;
