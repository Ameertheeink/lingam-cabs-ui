export interface Oil {
  id: number;
  vehicleId: number;
  lastServiceKm: number;
  serviceIntervalKm: number;
  lastServiceDate: string;
  oilBrand: string;
  oilQuantityLitres: number;
  serviceVendor: string;
  nextDueKm?: number;

  serviceBillPath?: string | null;
  serviceBillName?: string | null;
  serviceBillType?: string | null;

  createdAt?: string;
  updatedAt?: string;
}