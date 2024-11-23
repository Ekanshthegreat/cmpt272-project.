'use client';

import { useEffect, useRef } from 'react';
import L, { Map as LeafletMap } from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Report {
  id: string;
  title: string;
  description: string;
  coordinates: [number, number];
}

interface MapContainerProps {
  reports: Report[];
  onPinClick: (id: string) => void;
}

const MapContainer: React.FC<MapContainerProps> = ({ reports, onPinClick }) => {
  const mapRef = useRef<LeafletMap | null>(null);

  useEffect(() => {
    if (!mapRef.current) {
      // Initialize map
      const map = L.map('map').setView([49.2276, -123.0076], 11);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);
      mapRef.current = map;
    }

    // Remove existing markers
    mapRef.current.eachLayer((layer) => {
      if ((layer as L.Layer).options?.pane === 'markerPane') {
        mapRef.current?.removeLayer(layer);
      }
    });

    // Add pins for all reports
    reports.forEach((report) => {
      const marker = L.marker(report.coordinates)
        .addTo(mapRef.current!)
        .bindPopup(`<b>${report.title}</b><br>${report.description}`);
      marker.on('click', () => onPinClick(report.id));
    });
  }, [reports, onPinClick]);

  return <div id="map" style={{ height: '100%', width: '100%' }} />;
};

export default MapContainer;
