"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import EmergencyTable from "@/components/emergency-table";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Report, EmergencyType, ReportStatus } from "@/types/Report";

// Dynamically import MapContainer
const Map = dynamic(() => import("@/components/map"), {
  ssr: false, // Prevent server-side rendering
});

interface ReportDTO {
  id: string;
  title: string;
  description: string;
  coordinates: [number, number];
}

function transformReportToDTO(report: Report): ReportDTO | null {
  const { reportId, emergencyType, comments, location } = report;

  if (location.coordinates) {
    const { latitude, longitude } = location.coordinates;
    return {
      id: reportId,
      title: emergencyType,
      description: comments,
      coordinates: [latitude, longitude],
    };
  }

  // Return null if coordinates are missing
  return null;
}

export default function Home() {
  const [reports, setReports] = React.useState<Report[]>([]);
  const [reportDTOs, setReportDTOs] = React.useState<ReportDTO[]>([]);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const storedReports = localStorage.getItem("emergencyReports");
      if (storedReports) {
        setReports(JSON.parse(storedReports));
      } else {
        // Default reports if nothing is in localStorage
        const defaultReports: Report[] = [
          {
            reporterName: "John Doe",
            reporterPhone: "123-456-7890",
            emergencyType: EmergencyType.SHOOTING,
            location: {
              address: "Metrotown",
              coordinates: {
                latitude: 49.2258,
                longitude: -123.0036,
              },
            },
            comments: "A shooting incident was reported at Metrotown.",
            reportId: "1",
            timeDate: new Date(),
            status: ReportStatus.OPEN,
          },
          {
            reporterName: "Jane Doe",
            reporterPhone: "123-456-7890",
            emergencyType: EmergencyType.MEDICAL,
            location: {
              address: "SFU Burnaby",
              coordinates: {
                latitude: 49.2781,
                longitude: -122.9199,
              },
            },
            comments: "A medical emergency occurred at SFU Burnaby.",
            reportId: "2",
            timeDate: new Date(),
            status: ReportStatus.OPEN,
          },
          {
            reporterName: "John Smith",
            reporterPhone: "123-456-7890",
            emergencyType: EmergencyType.OTHER,
            location: {
              address: "SFU Surrey",
              coordinates: {
                latitude: 49.1896,
                longitude: -122.849,
              },
            },
            comments: "An elevator issue reported at SFU Surrey campus.",
            reportId: "3",
            timeDate: new Date(),
            status: ReportStatus.OPEN,
          },
        ];
        setReports(defaultReports);
        localStorage.setItem(
          "emergencyReports",
          JSON.stringify(defaultReports)
        );
      }
    }
  }, []);

  // Update reportDTOs whenever reports change
  React.useEffect(() => {
    const dtos = reports
      .map(transformReportToDTO)
      .filter((dto): dto is ReportDTO => dto !== null);
    setReportDTOs(dtos);
  }, [reports]); // Runs whenever 'reports' changes

  const handlePinClick = (id: string) => {
    alert(`Pin clicked for report ID: ${id}`);
  };

  return (
    <div
      className="container space-y-8 py-8"
      style={{ minHeight: "100vh", overflowY: "auto" }}
    >
      <h1 className="text-xl font-bold mb-4">Emergency Reports</h1>

      {/* Map Section */}
      <AspectRatio ratio={16 / 9} className="bg-muted">
        <Map reports={reportDTOs} onPinClick={handlePinClick} />
      </AspectRatio>

      {/* Emergency Table */}
      <div className="mt-8">
        <EmergencyTable reports={reports} />
      </div>
    </div>
  );
}
