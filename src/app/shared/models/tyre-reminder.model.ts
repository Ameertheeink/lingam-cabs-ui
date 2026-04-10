export interface TyreReminder {
  vehicleId: number;
  vehicleNumber: string;
  remainingKm: number;
  status: 'SAFE' | 'DUE_SOON' | 'OVERDUE'; // adjust if needed
}