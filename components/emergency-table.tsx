"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/app/login/auth-context";
import { X, CheckCircle } from "lucide-react";
import { Report, ReportStatus } from "@/types/Report";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";

interface EmergencyTableProps {
  reports: Report[];
}

export default function EmergencyTable({ reports }: EmergencyTableProps) {
  const { loggedIn } = useAuth();
  const [emergencies, setEmergencies] = useState<Report[]>(reports);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [emergencyToDelete, setEmergencyToDelete] = useState<string | null>(
    null
  );

  useEffect(() => {
    setEmergencies(reports);
  }, [reports]);

  const handleStatusChange = (id: string) => {
    console.log(`Toggling status for emergency ${id}`);
    const updatedEmergencies = emergencies.map((emergency) =>
      emergency.reportId === id
        ? {
            ...emergency,
            status:
              emergency.status === ReportStatus.OPEN
                ? ReportStatus.CLOSED
                : ReportStatus.OPEN,
          }
        : emergency
    );
    setEmergencies(updatedEmergencies);
    localStorage.setItem(
      "emergencyReports",
      JSON.stringify(updatedEmergencies)
    );
  };

  const handleDelete = (id: string) => {
    const emergency = emergencies.find((e) => e.reportId === id);
    if (emergency) {
      console.log(
        `${
          emergency.status === ReportStatus.CLOSED ? "Clearing" : "Deleting"
        } emergency ${id}`
      );
      // Check if logged in
      if (loggedIn) {
        setEmergencyToDelete(id);
        setShowConfirmDialog(true);
      } else {
        setShowLoginDialog(true);
      }
    }
  };

  const confirmDelete = () => {
    if (emergencyToDelete) {
      const updatedEmergencies = emergencies.filter(
        (e) => e.reportId !== emergencyToDelete
      );
      setEmergencies(updatedEmergencies);
      localStorage.setItem(
        "emergencyReports",
        JSON.stringify(updatedEmergencies)
      );
      setShowConfirmDialog(false);
      setEmergencyToDelete(null);
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Location</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Time Reported</TableHead>
            <TableHead>Status</TableHead>
            {loggedIn && <TableHead>Toggle Status</TableHead>}
            <TableHead>Actions</TableHead>
            {loggedIn && <TableHead></TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {emergencies.map((emergency) => (
            <TableRow key={emergency.reportId}>
              <TableCell>{emergency.location.address}</TableCell>
              <TableCell>{emergency.emergencyType}</TableCell>
              <TableCell>{emergency.timeDate.toLocaleString()}</TableCell>
              <TableCell>{emergency.status}</TableCell>
              {loggedIn && (
                <TableCell>
                  <Switch
                    checked={emergency.status === ReportStatus.CLOSED}
                    onCheckedChange={() =>
                      handleStatusChange(emergency.reportId)
                    }
                  />
                </TableCell>
              )}
              <TableCell>
                <Button
                  variant="ghost"
                  className="text-muted-foreground hover:text-primary"
                >
                  MORE INFO
                </Button>
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(emergency.reportId)}
                  className={
                    emergency.status === ReportStatus.CLOSED
                      ? "text-green-500 hover:text-green-600"
                      : "text-destructive hover:text-destructive"
                  }
                >
                  {emergency.status === ReportStatus.CLOSED ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <X className="h-4 w-4" />
                  )}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Login Required Dialog */}
      <AlertDialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <AlertDialogTrigger asChild>
          <Button className="hidden">Open Dialog</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Login Required</AlertDialogTitle>
            <AlertDialogDescription>
              Please log in to delete emergencies.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Link href="/login">
              <Button>Login</Button>
            </Link>
            <Button onClick={() => setShowLoginDialog(false)}>Cancel</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Confirm Delete Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogTrigger asChild>
          <Button className="hidden">Open Dialog</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this emergency report? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button onClick={confirmDelete}>Yes, Delete</Button>
            <Button onClick={() => setShowConfirmDialog(false)}>Cancel</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
