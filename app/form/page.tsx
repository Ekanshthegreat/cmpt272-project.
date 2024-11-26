"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { EmergencyType, ReportStatus, Report } from "@/types/Report";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";

import dynamic from "next/dynamic";
import { Modal } from "@/components/ui/modal";
const CMap = dynamic(() => import("@/components/coordMap"), {
  ssr: false,
});

export default function ReportEmergency() {
  const router = useRouter();
  const [formData, setFormData] = useState<
    Omit<Report, "reportId" | "timeDate" | "status">
  >({
    reporterName: "",
    reporterPhone: "",
    emergencyType: EmergencyType.OTHER,
    location: {
      address: "",
      placeName: "",
      coordinates: {
        latitude: 0, // Initialize as valid numbers
        longitude: 0, // Initialize as valid numbers
      },
    },
    pictureUrl: "",
    comments: "",
  });
  const [showDialog, setShowDialog] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      location: { ...prev.location, [name]: value },
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
    const existingReports: Report[] = JSON.parse(
      localStorage.getItem("emergencyReports") || "[]"
    );

    // Add new report to the array
    const updatedReports = [...existingReports, newReport];

    // Save updated reports back to localStorage
    localStorage.setItem("emergencyReports", JSON.stringify(updatedReports));

    setShowDialog(true); // Show the dialog
  };

  const handleDialogClose = () => {
    setShowDialog(false);
    router.push("/"); // Redirect to home page after closing the dialog
  };

  return (
    <div className="container py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Report New Emergency</CardTitle>
          <CardDescription>
            Please fill out the form below to report an emergency.
          </CardDescription>
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
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      emergencyType: value as EmergencyType,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select emergency type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(EmergencyType).map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
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
                    value={formData.location.coordinates?.latitude.toString()}
                    readOnly
                  />
                </div>
                <div>
                  <Label htmlFor="longitude">Longitude (Optional)</Label>
                  <Input
                    id="longitude"
                    name="longitude"
                    type="number"
                    step="any"
                    value={formData.location.coordinates?.longitude.toString()}
                    readOnly
                  />
                </div>
                <div>
                  <Button onClick={() => setShowMap(true)} className="w-full">
                    Pick Location on Map
                  </Button>
                </div>

                <Modal isOpen={showMap} onClose={() => setShowMap(false)}>
                  <div style={{ height: '450px', width: '100%' }}>
                    <CMap
                      onMarkerDrop={(latitude, longitude) => {
                        setFormData((prev) => ({
                          ...prev,
                          location: {
                            ...prev.location,
                            coordinates: { latitude, longitude },
                          },
                        }));
                        setShowMap(false); // Close the modal
                      }}
                      center={[
                        formData.location.coordinates?.latitude || 49.276765, // Default latitude
                        formData.location.coordinates?.longitude || -122.917957, // Default longitude
                      ]}
                      markerImageUrl="/images/marker.png"
                      zoom={13}
                    />
                  </div>
                </Modal>
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
          <Button type="submit" onClick={handleSubmit} className="w-full">
            Submit Report
          </Button>
        </CardFooter>
      </Card>

      {/* Alert Dialog */}
      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogTrigger asChild>
          <Button className="hidden">Open Dialog</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Report Submitted</AlertDialogTitle>
            <AlertDialogDescription>
              Your emergency report has been submitted successfully!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button onClick={handleDialogClose}>OK</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
