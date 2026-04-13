import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { LayoutComponent } from './shared/components/layout/layout.component';
import { AuthGuard } from './core/guards/auth.guard';  // ✅ add

const routes: Routes = [

  // ✅ Login route added
  {
    path: 'login',
    loadChildren: () =>
      import('./features/auth/auth.module').then(m => m.AuthModule)
  },

  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],  // ✅ guard added
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      {
        path: 'vehicles',
        loadChildren: () =>
          import('./features/vehicle/vehicle.module')
            .then(m => m.VehicleModule)
      }
    ]
  },

  { path: '**', redirectTo: 'login' }  // ✅ fallback added

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }