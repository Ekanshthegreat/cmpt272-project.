'use client';

import { useEffect, useRef } from 'react';
import L, { Map as LeafletMap } from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface ReportDTO {
  id: string;
  title: string;
  description: string;
  coordinates: [number, number];
}

interface MapContainerProps {
  reports: ReportDTO[];
  onPinClick: (id: string) => void;
}

const MapContainer: React.FC<MapContainerProps> = ({ reports, onPinClick }) => {
  const mapRef = useRef<LeafletMap | null>(null);

  useEffect(() => {
    if (!mapRef.current) {
      const map = L.map('map').setView([49.2276, -123.0076], 11);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);
      map.scrollWheelZoom.disable();
      map.on('focus', () => map.scrollWheelZoom.enable());
      map.on('blur', () => map.scrollWheelZoom.disable());
      mapRef.current = map;
    }

    mapRef.current.eachLayer((layer) => {
      if ((layer as L.Layer).options?.pane === 'markerPane') {
        mapRef.current?.removeLayer(layer);
      }
    });

    reports.forEach((report) => {
      const customIcon = L.icon({
        iconUrl: '/images/marker.png', // Ensure the image is in `public/images`
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      });

      // Add marker with popup
      const marker = L.marker(report.coordinates, { icon: customIcon })
        .addTo(mapRef.current!)
        .bindPopup(`<b>${report.title}</b><br>${report.description}`);

      // Add event listener for click
      marker.on('click', () => {
        marker.openPopup();
        //onPinClick(report.id); // Optional: Notify parent component of click
      });
      marker.on('hover', () => {
        marker.openPopup();
        //onPinClick(report.id); // Optional: Notify parent component of click
      });

      // Optional: Close popup on map click
      if (mapRef.current) {
        mapRef.current.on('click', () => {
          marker.closePopup();
        });
      }
    });
  }, [reports, onPinClick]);

  return <div id="map" style={{ height: '100%', width: '100%' }} />;
};

export default MapContainer;
