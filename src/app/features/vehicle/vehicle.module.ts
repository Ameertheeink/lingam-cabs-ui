import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VehicleRoutingModule } from './vehicle-routing.module';
import { VehicleListComponent } from './components/vehicle-list/vehicle-list.component';
import { VehicleDetailsComponent } from './components/vehicle-details/vehicle-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { OilServiceComponent } from './components/oil-service/oil-service.component';
import { TyreComponent } from './components/tyre/tyre/tyre.component';

import { PollutionComponent } from './components/pollution/pollution/pollution.component';
import { FcComponent } from './components/fc/fc/fc.component';
import { RcComponent } from './components/rc/rc/rc.component';
import { InsuranceComponent } from './components/insurance/insurance/insurance.component';

@NgModule({
  declarations: [
    VehicleListComponent,
    VehicleDetailsComponent,
    OilServiceComponent,
    TyreComponent,
    InsuranceComponent,
    PollutionComponent,
    FcComponent,
    RcComponent
  

  ],
  imports: [
    CommonModule,
    VehicleRoutingModule,ReactiveFormsModule,NgbModule,FormsModule
  ]
})
export class VehicleModule { }
