import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { VehicleRegistration } from '../../shared/models/vehicle-registration.model';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
private baseUrl = 'http://localhost:8080/api/vehicle-registrations';
  constructor(private http: HttpClient) { }

createVehicleRegistration(data:VehicleRegistration){
  return this.http.post<any>(this.baseUrl, data); }

getByVehicleId(vehicleId:number){
  return this.http.get<any>(`${this.baseUrl}/vehicle/${vehicleId}/latest`); }

updateVehicleRegistration(id:number, data:VehicleRegistration){
  return this.http.put<any>(`${this.baseUrl}/${id}`, data); }

uploadDocument(id: number, file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<any>(`${this.baseUrl}/${id}/document`, formData);
  }

  downloadDocument(id: number) {
    return this.http.get(`${this.baseUrl}/${id}/document`, {
      responseType: 'blob'
    });
  }

deleteVehicleRegistration(id:number){
  return this.http.delete(`${this.baseUrl}/${id}`); } 


}
