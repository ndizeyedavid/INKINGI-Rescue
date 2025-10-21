'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L, { LatLngExpression } from 'leaflet';

// Dummy data for emergency locations
const emergencies = [
  { id: 1, lat: -1.9441, lng: 30.0619, title: 'Fire at Nyarugenge Market' },
  { id: 2, lat: -1.939, lng: 30.088, title: 'Medical Emergency at CHUK' },
  { id: 3, lat: -1.9706, lng: 30.1044, title: 'Accident near Gikondo' },
];

const RescueMap = () => {
  const position: LatLngExpression = [-1.9441, 30.0619]; // Centered on Kigali

  // Custom icon for markers - moved inside the component
  const icon = L.icon({ 
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      shadowSize: [41, 41]
  });

  return (
    <MapContainer center={position} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {emergencies.map(emergency => (
        <Marker key={emergency.id} position={[emergency.lat, emergency.lng]} icon={icon}>
          <Popup>
            {emergency.title}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default RescueMap;
