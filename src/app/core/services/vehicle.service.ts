import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../shared/models/api-response.model';
import { Vehicle } from '../../shared/models/vehicle.model';


@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  private baseUrl = 'http://localhost:8080/api/vehicles';

  constructor(private http: HttpClient) {}

 getVehicles() {
  return this.http.get<ApiResponse<Vehicle[]>>(this.baseUrl);
}


  getVehicleById(id: number) {
  return this.http.get<ApiResponse<Vehicle>>(`${this.baseUrl}/${id}`);
}

// getVehicleImages(id: number) {
//   return this.http.get<ApiResponse<string[]>>(`${this.baseUrl}/${id}/images`);
// }

downloadDocument(vehicleNumber: string) {
  return this.http.get(
    `${this.baseUrl}/${vehicleNumber}/document`,
    { responseType: 'blob' }
  );
}

addVehicle(vehicle: Vehicle) {
  return this.http.post<Vehicle>(this.baseUrl, vehicle);
}
uploadDocument(vehicleNumber: string, file: File) {
  const formData = new FormData();
  formData.append('file', file);

  return this.http.post(
    `${this.baseUrl}/${vehicleNumber}/document`,
    formData
  );
}
deleteVehicle(id: number) {
  return this.http.delete<ApiResponse<any>>(`${this.baseUrl}/${id}`);
}

updateVehicle(id: number, vehicle: Vehicle) {
  return this.http.put<ApiResponse<any>>(`${this.baseUrl}/${id}`, vehicle);
}


// Get images by vehicle id
getVehicleImages(id: number) {
  return this.http.get<ApiResponse<string[]>>(
    `${this.baseUrl}/${id}/images`
  );
}


// Upload image
uploadVehicleImage(id: number, file: File) {
  const formData = new FormData();

  // 🔥 MUST match backend parameter name
  formData.append('files', file);

  return this.http.post<ApiResponse<any>>(
    `${this.baseUrl}/${id}/images`,
    formData
  );
}



// Delete all images
deleteAllVehicleImages(id: number) {
  return this.http.delete<ApiResponse<any>>(
    `${this.baseUrl}/${id}/images`
  );
}



getVehiclesPaginated(page: number, size: number) {
  return this.http.get<ApiResponse<any>>(
    `${this.baseUrl}/paginated?page=${page}&size=${size}`
  );
}

searchVehicles(keyword: string, page: number, size: number) {
  const params = new HttpParams()
    .set('keyword', keyword.trim())
    .set('page', page)
    .set('size', size);

  return this.http.get<ApiResponse<any>>(
    `${this.baseUrl}/search`,
    { params }
  );
}
}
