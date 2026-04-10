export interface InsuranceReminder {
  vehicleId: number;
  vehicleNumber: string;
  remainingDays: number;
  expiryDate: string;
  status: 'SAFE' | 'DUE_SOON' | 'OVERDUE'; 
}