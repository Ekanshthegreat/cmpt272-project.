"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import EmergencyTable from "@/components/emergency-table";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Report, EmergencyType, ReportStatus } from "@/types/Report";
import { Separator } from "@/components/ui/separator";

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
      {/* <h1 className="text-3xl font-bold mb-20 text-center">
        EMERGENCY REPORTS
      </h1> */}
      <h1 className="mb-4 mt-16 text-4xl text-center font-extrabold leading-none tracking-tight md:text-5xl lg:text-6xl">
        <mark className="px-2 text-white bg-blue-600 rounded dark:bg-blue-600">
          EMERGENCY
        </mark>{" "}
        REPORTS
      </h1>
      <p className="mb-10 text-lg text-center font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400">
        Reportings of emergencies in the Metro Vancouver area.
      </p>

      <div className="flex justify-center">
        <Separator className="w-1/3" />
      </div>

      {/* Map Section */}

      <AspectRatio ratio={16 / 9} className="dark:bg-muted m-10 shadow-2xl ">
        <Map reports={reportDTOs} onPinClick={handlePinClick} />
      </AspectRatio>

      {/* Emergency Table */}
      <div className="mt-8">
        <EmergencyTable reports={reports} />
      </div>
    </div>
  );
}
