import { z } from "zod";
import libphonenumber from "google-libphonenumber";

const phoneUtil = libphonenumber.PhoneNumberUtil.getInstance();

// Enum for emergency types
export enum EmergencyType {
  FIRE = 'Fire',
  SHOOTING = 'Shooting',
  VEHICLE_ACCIDENT = 'Vehicle Accident',
  MEDICAL = 'Medical',
  OTHER = 'Other'
}

// Enum for report status
export enum ReportStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  CLOSED = 'CLOSED'
}

// Interface for the emergency report
export interface Report {
  // Reporting Person's Info
  reporterName: string;
  reporterPhone: string;

  // Emergency Info
  emergencyType: EmergencyType;

  // Location
  location: {
    address: string;
    placeName?: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };

  // Optional Picture Link
  pictureUrl?: string;

  // Comments
  comments: string;

  // Auto-filled fields
  reportId: string; // Unique identifier for the report
  timeDate: Date; // Time and date when the report was lodged
  status: ReportStatus; // Status of the report
}

export const phoneNumberSchema = z
  .string()
  .min(1, { message: "Mobile number is required" })
  .refine(
    (number) => {
      try {
        const phoneNumber = phoneUtil.parse(number, "CA"); // "CA" for Canada
        return phoneUtil.isValidNumber(phoneNumber);
      } catch (error) {
        return false;
      }
    },
    { message: "Invalid Canadian mobile number" }
  );