export interface PollutionReminder {
  vehicleId: number;
  vehicleNumber: string;
  remainingDays: number;
  expiryDate: string; // ISO format date string
  status: 'SAFE' | 'DUE_SOON' | 'OVERDUE'; // adjust if needed
}