'use client';

import React from 'react';
import { MapContainer, TileLayer, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface TrafficJam {
  id: number;
  latitude: number;
  longitude: number;
  severity: 'high' | 'medium' | 'low' | string;
}

interface TrafficReportMapProps {
  trafficJams: TrafficJam[];
}

export default function TrafficReportMap({ trafficJams }: TrafficReportMapProps) {
  if (trafficJams.length === 0) return <p>No traffic jams to show on the map.</p>;

  const jam = trafficJams[0];
  const center: [number, number] = [jam.latitude, jam.longitude];

  return (
    <MapContainer
      center={center}
      zoom={14}
      scrollWheelZoom={false}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {trafficJams.map((jam) => (
        <CircleMarker
          key={jam.id}
          center={[jam.latitude, jam.longitude]}
          radius={12}
          pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 0.4 }}
        />
      ))}
    </MapContainer>
  );
}
