'use client';

import { useEffect, useRef } from 'react';
import L, { Map as LeafletMap, Marker } from 'leaflet';
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
  highlightedReportId?: string; // Optional to highlight selected report
}

const MapContainer: React.FC<MapContainerProps> = ({ reports, onPinClick, highlightedReportId }) => {
  const mapRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<Map<string, Marker>>(new Map());

  useEffect(() => {
    // Initialize the map if not already done
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

    // Remove any existing markers
    markersRef.current.forEach((marker) => {
      mapRef.current?.removeLayer(marker);
    });
    markersRef.current.clear();

    // Add markers for all reports
    reports.forEach((report) => {
      const customIcon = L.icon({
        iconUrl: '/images/marker.png', // Make sure the image exists in `public/images`
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      });

      const marker = L.marker(report.coordinates, { icon: customIcon })
        .addTo(mapRef.current!)
        .bindPopup(`<b>${report.title}</b><br>${report.description}`);

      marker.on('click', () => {
        marker.openPopup();
        onPinClick(report.id);
      });

      markersRef.current.set(report.id, marker);
    });

    // Highlight the selected marker if `highlightedReportId` is provided
    if (highlightedReportId) {
      const selectedMarker = markersRef.current.get(highlightedReportId);
      if (selectedMarker) {
        selectedMarker.openPopup();
        mapRef.current?.setView(selectedMarker.getLatLng(), 13); // Focus on the highlighted marker
      }
    }
  }, [reports, onPinClick, highlightedReportId]);

  return <div id="map" style={{ height: '100%', width: '100%' }} />;
};

export default MapContainer;