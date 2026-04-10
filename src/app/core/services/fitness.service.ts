import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Fitness } from '../../shared/models/fitness-service.model';

@Injectable({
  providedIn: 'root'
})
export class FitnessService {

  private baseUrl = 'http://localhost:8080/api/fitness-certificates';

  constructor(private http: HttpClient) {}

  // ✅ CREATE
  createFitness(data: Fitness): Observable<any> {
    return this.http.post<any>(this.baseUrl, data);
  }

  // ✅ GET BY VEHICLE
  getByVehicleId(vehicleId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/vehicle/${vehicleId}`);
  }

  // ✅ UPDATE
  updateFitness(id: number, data: Fitness): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, data);
  }

  // ✅ UPLOAD DOCUMENT (FIXED)
  uploadDocument(id: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<any>(`${this.baseUrl}/${id}/upload`, formData);
  }

  // ✅ DOWNLOAD DOCUMENT
  downloadDocument(id: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/${id}/document`, {
      responseType: 'blob'
    });
  }

  // ✅ DELETE
  deleteFitness(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  // ✅ REMINDERS (NEW)
  getReminders(days: number = 10): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/reminders?days=${days}`);
  }
}