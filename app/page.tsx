'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import EmergencyTable from '@/components/emergency-table';
import { AspectRatio } from '@/components/ui/aspect-ratio';

// Dynamically import MapContainer
const Map = dynamic(() => import('@/components/map'), {
  ssr: false, // Prevent server-side rendering
});

export default function Home() {
  // Example emergency reports
  const reports = [
    {
      id: '1',
      title: 'Shooting at Metrotown',
      description: 'A shooting incident was reported at Metrotown.',
      coordinates: [49.2258, -123.0036] as [number, number],
    },
    {
      id: '2',
      title: 'Medical Emergency at SFU Burnaby',
      description: 'A medical emergency occurred at SFU Burnaby.',
      coordinates: [49.2781, -122.9199] as [number, number],
    },
    {
      id: '3',
      title: 'Elevator Issue at SFU Surrey',
      description: 'An elevator issue reported at SFU Surrey campus.',
      coordinates: [49.1896, -122.849] as [number, number],
    },
  ];

  const handlePinClick = (id: string) => {
    alert(`Pin clicked for report ID: ${id}`);
  };

  return (
    <div className="container space-y-8 py-8" style={{ minHeight: '100vh', overflowY: 'auto' }}>
      <h1 className="text-xl font-bold mb-4">Emergency Reports</h1>

      {/* Map Section */}
      <AspectRatio ratio={16 / 9} className="bg-muted">
        <Map reports={reports} onPinClick={handlePinClick} />
      </AspectRatio>

      {/* Emergency Table */}
      <div className="mt-8">
        <EmergencyTable />
      </div>
    </div>
  );
}
