'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from '@/components/ui/button';

interface CoordMapProps {
    center: [number, number];
    zoom: number;
    markerImageUrl: string; // Custom marker image URL
    onMarkerDrop: (latitude: number, longitude: number) => void;
}

const CoordMap: React.FC<CoordMapProps> = ({ center, zoom, markerImageUrl, onMarkerDrop }) => {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const markerRef = useRef<L.Marker | null>(null); // Store the marker
    const [markerPosition, setMarkerPosition] = useState(center); // State for marker position

    useEffect(() => {
        if (mapContainerRef.current) {
            const mapInstance = L.map(mapContainerRef.current).setView(center, zoom);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapInstance);

            const customIcon = L.icon({
                iconUrl: markerImageUrl, // Use the custom marker image URL
                iconSize: [25, 41], // Adjust the size of the icon
                iconAnchor: [12, 41], // Anchor the icon at the bottom center
            });

            // Initialize the marker with draggable enabled
            markerRef.current = L.marker(center, {
                icon: customIcon,
                draggable: true,
            }).addTo(mapInstance);

            // Update the marker position when dragging stops
            markerRef.current.on('dragend', () => {
                const newPos = markerRef.current!.getLatLng();
                setMarkerPosition([newPos.lat, newPos.lng]);
            });

            // Update the marker position when the map is clicked
            mapInstance.on('click', (e) => {
                const { lat, lng } = e.latlng;
                markerRef.current!.setLatLng([lat, lng]);
                setMarkerPosition([lat, lng]);
            });

            // Disable scroll zoom by default, enable it on focus
            mapInstance.scrollWheelZoom.disable();
            mapInstance.on('focus', () => mapInstance.scrollWheelZoom.enable());
            mapInstance.on('blur', () => mapInstance.scrollWheelZoom.disable());

            return () => {
                mapInstance.remove(); // Clean up the map when the component unmounts
            };
        }
    }, [center, zoom, markerImageUrl]);

    return (
        <div>
            <div ref={mapContainerRef} style={{ height: '400px', width: '100%' }} />
            <div className="mt-4">
                <Button
                    onClick={() => {
                        onMarkerDrop(markerPosition[0], markerPosition[1]); // Pass the current marker position
                    }}
                    className="w-full"
                >
                    OK
                </Button>
            </div>
        </div>
    );
};

export default CoordMap;
