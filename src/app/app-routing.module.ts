import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { LayoutComponent } from './shared/components/layout/layout.component';
const routes: Routes = [

  {
    path: '',
    component: LayoutComponent,
    children: [

      // Default route
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

      // Dashboard
      { path: 'dashboard', component: DashboardComponent },

      // Lazy loaded module
      {
        path: 'vehicles',
        loadChildren: () =>
          import('./features/vehicle/vehicle.module')
            .then(m => m.VehicleModule)
      }

    ]
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
