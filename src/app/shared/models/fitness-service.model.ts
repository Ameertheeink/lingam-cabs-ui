export interface Fitness {
  id?: number;              // optional for create
  vehicleId: number;
  issueDate: string;        // ISO string (yyyy-MM-dd)
  expiryDate: string;

  documentUrl?: string;     // for preview/download
  documentType?: string;

  createdAt?: string;
  updatedAt?: string;
}