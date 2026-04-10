import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Oil } from '../../shared/models/oil-service.model';


@Injectable({
  providedIn: 'root'
})
export class OilServiceService {

  private baseUrl = 'http://localhost:8080/api/oil-services';

  constructor(private http: HttpClient) {}

  // ✅ Create Oil Service
  createOilService(data: Oil): Observable<any> {
    return this.http.post<any>(this.baseUrl, data);
  }

  // ✅ Get by Vehicle ID
  getByVehicleId(vehicleId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/vehicle/${vehicleId}`);
  }
getByVehicleIdLatest(vehicleId: number): Observable<any> {
  return this.http.get<any>(`${this.baseUrl}/vehicle/${vehicleId}/latest`);
}
  // ✅ Get All
  getAll(): Observable<Oil[]> {
    return this.http.get<Oil[]>(this.baseUrl);
  }

  // ✅ Upload Bill
uploadBill(id: number, formData: FormData): Observable<any> {
  return this.http.post<any>(`${this.baseUrl}/${id}/bill`, formData);
}

  // ✅ Download Bill
  downloadBill(id: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/${id}/bill`, {
      responseType: 'blob'
    });
  }

    updateOilService(id: number, data: Oil): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, data);
  }

  // 🔥 ✅ Delete
  deleteOilService(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }
  
  getByVehicleIdPaginated(vehicleId: number, page: number, size: number): Observable<any> {
  return this.http.get(`${this.baseUrl}/vehicle/${vehicleId}/paginated`, {
    params: {
      page: page.toString(),
      size: size.toString()
    }
  });
}
}
