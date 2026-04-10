import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Insurance } from '../../shared/models/insurance-service.model';

@Injectable({
  providedIn: 'root'
})
export class InsuranceService {

  private baseUrl = 'http://localhost:8080/api/insurance';

  constructor(private http: HttpClient) {}

  createInsuranceService(data: Insurance): Observable<any> {
    return this.http.post<any>(this.baseUrl, data);
  }

  getByVehicleId(vehicleId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/vehicle/${vehicleId}/latest`);
  }

  updateInsuranceService(id: number, data: Insurance): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, data);
  }

  uploadDocument(id: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<any>(`${this.baseUrl}/${id}/document`, formData);
  }

  downloadDocument(id: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/${id}/document`, {
      responseType: 'blob'
    });
  }
  deleteInsuranceService(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  } 
}