import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VehicleListComponent } from './components/vehicle-list/vehicle-list.component';
import { VehicleDetailsComponent } from './components/vehicle-details/vehicle-details.component';
import { OilServiceComponent } from './components/oil-service/oil-service.component';

const routes: Routes = [
  { path: '', component: VehicleListComponent },
  { path: ':id', component: VehicleDetailsComponent },
    { path: ':id/oil-services', component: OilServiceComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VehicleRoutingModule { }
