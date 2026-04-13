import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { ReminderService } from '../../core/services/reminder.service';
import { InsuranceReminder } from '../../shared/models/insurance-reminder.model';
import { OilReminder } from '../../shared/models/oil-reminder.model';
import { PollutionReminder } from '../../shared/models/pollution-reminder';
import { TyreReminder } from '../../shared/models/tyre-reminder.model';
import { LoaderService } from '../../shared/services/loader.service';
import { FitnessReminder } from '../../shared/models/fitness-reminder';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  oilReminder!: OilReminder;
  tyreReminder!: TyreReminder;
  insuranceReminder!: InsuranceReminder; // can create a specific model later
  pollutionReminder!: PollutionReminder; // can create a specific model later
  fitnessReminder!: FitnessReminder; // can create a specific model later

  constructor(
    private reminderService: ReminderService,
    private loaderService: LoaderService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  /**
   * Load Oil + Tyre reminders together
   */
  loadDashboardData() {

    this.loaderService.show();

    forkJoin({
      oil: this.reminderService.getOilTopReminder(),
      tyre: this.reminderService.getTyreServiceReminders(),
      insurance: this.reminderService.getInsuranceReminders(),
      pollution: this.reminderService.getPollutionReminders(),
      fitness: this.reminderService.getFitnessReminders()

    }).subscribe({

      next: (res) => {

        if (res.oil.success) {
          this.oilReminder = res.oil.data;
        }

        if (res.tyre.success) {
          this.tyreReminder = res.tyre.data;
        }
        if (res.insurance.success) {
          this.insuranceReminder = res.insurance.data;
        }
          if (res.pollution.success) { 
          this.pollutionReminder = res.pollution.data;
           }
            if (res.fitness.success) {  
          this.fitnessReminder = res.fitness.data;
           }


        this.loaderService.hide();
      },

      error: (err) => {
        console.error(err);
        this.loaderService.hide();
      }

    });
  }

  /**
   * Progress calculation for oil reminder
   */
  getProgress(): number {

    if (!this.oilReminder) return 0;

    const max = 5000; // later can come from API
    return ((max - this.oilReminder.remainingKm) / max) * 100;
  }

  hasAnyData(): boolean {
  return !!(this.oilReminder || this.tyreReminder || this.insuranceReminder);
}


}