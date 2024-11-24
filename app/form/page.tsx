'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { EmergencyType, ReportStatus, Report } from '@/types/Report';

export default function ReportEmergency() {
  const router = useRouter();
  const [formData, setFormData] = useState<Omit<Report, 'reportId' | 'timeDate' | 'status'>>({
    reporterName: '',
    reporterPhone: '',
    emergencyType: EmergencyType.OTHER,
    location: {
      address: '',
      placeName: '',
      coordinates: {
        latitude: 0, // Initialize as valid numbers
        longitude: 0, // Initialize as valid numbers
      },
    },
    pictureUrl: '',
    comments: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      location: { ...prev.location, [name]: value },
    }));
  };

  const handleCoordinatesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const parsedValue = parseFloat(value) || 0;
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        coordinates: {
          latitude: name === 'latitude' ? parsedValue : (prev.location.coordinates?.latitude ?? 0),
          longitude: name === 'longitude' ? parsedValue : (prev.location.coordinates?.longitude ?? 0),
        },
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReport: Report = {
      ...formData,
      reportId: uuidv4(),
      timeDate: new Date(),
      status: ReportStatus.OPEN,
    };

    // Get existing reports from localStorage
    const existingReports: Report[] = JSON.parse(localStorage.getItem('emergencyReports') || '[]');

    // Add new report to the array
    const updatedReports = [...existingReports, newReport];

    // Save updated reports back to localStorage
    localStorage.setItem('emergencyReports', JSON.stringify(updatedReports));

    alert('Emergency report submitted successfully!');
    router.push('/'); // Redirect to home page after submission
  };

  return (
    <div className="container py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Report New Emergency</CardTitle>
          <CardDescription>Please fill out the form below to report an emergency.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="reporterName">Your Name</Label>
                <Input
                  id="reporterName"
                  name="reporterName"
                  value={formData.reporterName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="reporterPhone">Your Phone Number</Label>
                <Input
                  id="reporterPhone"
                  name="reporterPhone"
                  value={formData.reporterPhone}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="emergencyType">Nature of Emergency</Label>
                <Select
                  onValueChange={(value) => setFormData(prev => ({ ...prev, emergencyType: value as EmergencyType }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select emergency type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(EmergencyType).map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.location.address}
                  onChange={handleLocationChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="placeName">Place Name (Optional)</Label>
                <Input
                  id="placeName"
                  name="placeName"
                  value={formData.location.placeName}
                  onChange={handleLocationChange}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="latitude">Latitude (Optional)</Label>
                  <Input
                    id="latitude"
                    name="latitude"
                    type="number"
                    step="any"
                    value={formData.location.coordinates?.latitude?.toString() || '0'} // Ensure it's a string
                    onChange={handleCoordinatesChange}
                  />
                </div>
                <div>
                  <Label htmlFor="longitude">Longitude (Optional)</Label>
                  <Input
                    id="longitude"
                    name="longitude"
                    type="number"
                    step="any"
                    value={formData.location.coordinates?.longitude?.toString() || 0} // Ensure it's a string
                    onChange={handleCoordinatesChange}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="pictureUrl">Picture URL (Optional)</Label>
                <Input
                  id="pictureUrl"
                  name="pictureUrl"
                  value={formData.pictureUrl}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="comments">Additional Comments</Label>
                <Textarea
                  id="comments"
                  name="comments"
                  value={formData.comments}
                  onChange={handleInputChange}
                  rows={4}
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button type="submit" onClick={handleSubmit} className="w-full">Submit Report</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
