"use client";

import { useEffect, useRef } from "react";
import L, { Map as LeafletMap, Marker } from "leaflet";
import "leaflet/dist/leaflet.css";

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
  onVisibleReportsChange: (visibleReports: ReportDTO[]) => void; // New prop
}

const MapContainer: React.FC<MapContainerProps> = ({
  reports,
  onPinClick,
  highlightedReportId,
  onVisibleReportsChange,
}) => {
  const mapRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<Map<string, Marker>>(new Map());
  const prevHighlightedReportIdRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    // Initialize the map if not already done
    if (!mapRef.current) {
      const map = L.map("map").setView([49.2276, -123.0076], 11);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      map.scrollWheelZoom.disable();
      map.on("focus", () => map.scrollWheelZoom.enable());
      map.on("blur", () => map.scrollWheelZoom.disable());
      mapRef.current = map;
    }

    const map = mapRef.current;

    // Add moveend event listener
    const handleMoveEnd = () => {
      const bounds = map.getBounds();
      const visibleReports = reports.filter((report) =>
        bounds.contains(report.coordinates)
      );
      console.log("Visible reports:", visibleReports);
      onVisibleReportsChange(visibleReports);
    };

    map.on("moveend", handleMoveEnd);

    // Cleanup event listener on unmount or when reports change
    return () => {
      map.off("moveend", handleMoveEnd);
    };
  }, [reports, onVisibleReportsChange]);

  useEffect(() => {
    // Remove any existing markers
    markersRef.current.forEach((marker) => {
      mapRef.current?.removeLayer(marker);
    });
    markersRef.current.clear();

    // Add markers for all reports
    reports.forEach((report) => {
      const customIcon = L.icon({
        iconUrl: "/images/marker.png", // Make sure the image exists in `public/images`
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      });

      const marker = L.marker(report.coordinates, { icon: customIcon })
        .addTo(mapRef.current!)
        .bindPopup(`<b>${report.title}</b><br>${report.description}`);

      marker.on("click", () => {
        marker.openPopup();
        onPinClick(report.id);
      });

      markersRef.current.set(report.id, marker);
    });

    // Highlight the selected marker if `highlightedReportId` is provided
    if (
      highlightedReportId &&
      highlightedReportId !== prevHighlightedReportIdRef.current
    ) {
      const selectedMarker = markersRef.current.get(highlightedReportId);
      if (selectedMarker) {
        selectedMarker.openPopup();
        mapRef.current?.setView(selectedMarker.getLatLng(), 13); // Focus on the highlighted marker
      }
      prevHighlightedReportIdRef.current = highlightedReportId;
    }
  }, [reports, onPinClick, highlightedReportId]);

  return <div id="map" style={{ height: "100%", width: "100%" }} />;
};

export default MapContainer;
