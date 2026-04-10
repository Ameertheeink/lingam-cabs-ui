import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pollution } from '../../shared/models/pollution-service.model';


@Injectable({
  providedIn: 'root'
})
export class PollutionService {

  
    private baseUrl = 'http://localhost:8080/api/pollution';
  
    constructor(private http: HttpClient) {}
  
    createPollutionService(data: Pollution): Observable<any> {
      return this.http.post<any>(this.baseUrl, data);
    }
  
    getByVehicleId(vehicleId: number): Observable<any> {
      return this.http.get<any>(`${this.baseUrl}/vehicle/${vehicleId}/latest`);
    }
  
    updatePollutionService(id: number, data: Pollution): Observable<any> {
      return this.http.put<any>(`${this.baseUrl}/${id}`, data);
    }
uploadDocument(id: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file); // 'file' matches @RequestParam in Spring Boot
    return this.http.post<any>(`${this.baseUrl}/${id}/document`, formData);
  }

  // 📥 Download/View File
  // Note: responseType 'blob' is essential for binary files (PDFs/Images)
  downloadDocument(id: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/${id}/document`, {
      responseType: 'blob'
    });
  }
    deletePollutionService(id: number): Observable<any> {
      return this.http.delete(`${this.baseUrl}/${id}`);
    } 

      getByVehicleIdLatest(vehicleId:number):Observable<any>{
    return this.http.get<any>(`${this.baseUrl}/vehicle/${vehicleId}/latest`);
  }

  updateVehicleId(vehicleId: number, data: Pollution): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/vehicle/${vehicleId}`, data);
  }
}
