'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import EmergencyTable from '@/components/emergency-table';
import { Separator } from '@/components/ui/separator';
import DetailsCard from '@/components/details-card';
import { Report, EmergencyType, ReportStatus } from '@/types/types';

// Dynamically import MapContainer
const Map = dynamic(() => import('@/components/map'), { ssr: false });

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
  return null; // Return null if coordinates are missing
}

export default function Home() {
  const [reports, setReports] = useState<Report[]>([]);
  const [reportDTOs, setReportDTOs] = useState<ReportDTO[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  useEffect(() => {
    // Load reports from localStorage or initialize default
    if (typeof window !== 'undefined') {
      const storedReports = localStorage.getItem('emergencyReports');
      if (storedReports) {
        setReports(JSON.parse(storedReports));
      } else {
        // Default reports
        const defaultReports: Report[] = [
          {
            reporterName: 'John Doe',
            reporterPhone: '123-456-7890',
            emergencyType: EmergencyType.SHOOTING,
            location: {
              address: 'Metrotown',
              coordinates: { latitude: 49.2258, longitude: -123.0036 },
            },
            comments: 'A shooting incident was reported at Metrotown.',
            reportId: '1',
            timeDate: new Date(),
            status: ReportStatus.OPEN,
          },
          {
            reporterName: 'Jane Doe',
            reporterPhone: '123-456-7890',
            emergencyType: EmergencyType.MEDICAL,
            location: {
              address: 'SFU Burnaby',
              coordinates: { latitude: 49.2781, longitude: -122.9199 },
            },
            comments: 'A medical emergency occurred at SFU Burnaby.',
            reportId: '2',
            timeDate: new Date(),
            status: ReportStatus.OPEN,
          },
          {
            reporterName: 'John Smith',
            reporterPhone: '123-456-7890',
            emergencyType: EmergencyType.OTHER,
            location: {
              address: 'SFU Surrey',
              coordinates: { latitude: 49.1896, longitude: -122.849 },
            },
            comments: 'An elevator issue reported at SFU Surrey campus.',
            reportId: '3',
            timeDate: new Date(),
            status: ReportStatus.OPEN,
          },
        ];
        setReports(defaultReports);
        localStorage.setItem('emergencyReports', JSON.stringify(defaultReports));
      }
    }
  }, []);

  useEffect(() => {
    // Transform reports into DTOs
    const dtos = reports
      .map(transformReportToDTO)
      .filter((dto): dto is ReportDTO => dto !== null); // Type narrowing
    setReportDTOs(dtos);
  }, [reports]);

  const handlePinClick = (id: string) => {
    const report = reports.find((report) => report.reportId === id);
    if (report) {
      setSelectedReport(report);
    }
  };

  const handleReportClick = (id: string) => {
    const report = reports.find((report) => report.reportId === id);
    if (report) {
      setSelectedReport(report);
    }
  };

  const handleReportUpdate = (updatedReports: Report[]) => {
    setReports(updatedReports);
    if (selectedReport) {
      const updatedSelectedReport = updatedReports.find(
        (report) => report.reportId === selectedReport.reportId
      );
      if (updatedSelectedReport) {
        setSelectedReport(updatedSelectedReport);
      }
    }
  };

  return (
    <div className="container space-y-8 py-8" style={{ minHeight: '100vh', overflowY: 'auto' }}>
      <h1 className="mb-4 mt-16 text-4xl text-center font-extrabold leading-none tracking-tight md:text-5xl lg:text-6xl">
        <mark className="px-2 text-white bg-blue-600 rounded dark:bg-blue-600">EMERGENCY</mark>{' '}
        REPORTS
      </h1>
      <p className="mb-10 text-lg text-center font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400">
        Reportings of emergencies in the Metro Vancouver area.
      </p>

      <div className="flex justify-center">
        <Separator className="w-1/3" />
      </div>

      <div className="relative">
        {/* Details Card */}
        {selectedReport && (
          <div className="absolute bottom-16 left-16 shadow-2xl z-[100000] w-1/3">
            <DetailsCard report={selectedReport} />
          </div>
        )}

        {/* Map Section */}
        <AspectRatio ratio={16 / 9} className="dark:bg-muted m-10 shadow-2xl">
          <Map reports={reportDTOs} onPinClick={handlePinClick} highlightedReportId={selectedReport?.reportId} />
        </AspectRatio>
      </div>

      {/* Emergency Table */}
      <div className="mt-8">
        <EmergencyTable
          reports={reports}
          onReportClick={handleReportClick}
          onReportUpdate={handleReportUpdate}
        />
      </div>
    </div>
  );
}