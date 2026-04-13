import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from '../../shared/models/api-response.model';
import { OilReminder } from '../../shared/models/oil-reminder.model';

@Injectable({
  providedIn: 'root'
})
export class ReminderService {
 private baseUrl = 'http://localhost:8080/api';
  constructor(private http:HttpClient) { }

    getOilTopReminder() {
    return this.http.get<ApiResponse<OilReminder>>(
      `${this.baseUrl}/oil-services/reminders/top`
    );

  

    
  }
  getInsuranceReminders() {
    return this.http.get<ApiResponse<any>>(
      `${this.baseUrl}/insurance/reminders/top`
    );
  }

  getTyreServiceReminders() {
    return this.http.get<ApiResponse<any>>(
      `${this.baseUrl}/tyre-services/reminders/top`
    );
  }
  getPollutionReminders() {
    return this.http.get<ApiResponse<any>>(
      `${this.baseUrl}/pollution/reminders/top`
    );
  }
  getFitnessReminders() {
    return this.http.get<ApiResponse<any>>(
      `${this.baseUrl}/fitness-certificates/reminders/top`
    );
  }
  getRemindersByVehicleId(vehicleId: number) {
  return this.http.get<ApiResponse<any>>(
    `${this.baseUrl}/reminders/vehicle/${vehicleId}`
  );
}
getOilReminderByVehicle(vehicleId: number) {
  return this.http.get<ApiResponse<any>>(`${this.baseUrl}/oil-services/reminders/vehicle/${vehicleId}`);
}
getInsuranceReminderByVehicle(vehicleId: number) {
  return this.http.get<ApiResponse<any>>(`${this.baseUrl}/insurance/reminders/vehicle/${vehicleId}`);
}
getTyreReminderByVehicle(vehicleId: number) {
  return this.http.get<ApiResponse<any>>(`${this.baseUrl}/tyre-services/reminders/vehicle/${vehicleId}`);
}
getFitnessReminderByVehicle(vehicleId: number) {
  return this.http.get<ApiResponse<any>>(`${this.baseUrl}/fitness-certificates/reminders/vehicle/${vehicleId}`);
}
getPollutionReminderByVehicle(vehicleId: number) {
  return this.http.get<ApiResponse<any>>(`${this.baseUrl}/pollution/reminders/vehicle/${vehicleId}`);
}
}
