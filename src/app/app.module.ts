import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { LoaderComponent } from './shared/loader/loader.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UppercaseDirective } from './shared/directives/uppercase.directive';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { LayoutComponent } from './shared/components/layout/layout.component';
import { OilServiceModalComponent } from './shared/modal/oil-service-modal/oil-service-modal.component';
import { DeleteConfirmComponent } from './shared/modal/delete-confirm/delete-confirm.component';
import { TyreModalComponent } from './shared/modal/tyre-modal/tyre-modal.component';
import { InsuranceModalComponent } from './shared/modal/insurance-modal/insurance-modal.component';
import { OilHistoryComponent } from './shared/modal/oil-history/oil-history.component';
import { TyreHistoryComponent } from './shared/modal/tyre-history/tyre-history.component';
import { ErrorInterceptor } from './core/interceptors/error.interceptor';
import { PollutionModalComponent } from './shared/modal/pollution-modal/pollution-modal.component';
import { FcModalComponent } from './shared/modal/fc-modal/fc-modal.component';
import { RcModalComponent } from './shared/modal/rc-modal/rc-modal.component';




@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SidebarComponent,
    DashboardComponent,
    LoaderComponent,
    UppercaseDirective,
    LayoutComponent,
    OilServiceModalComponent,
    DeleteConfirmComponent,
    TyreModalComponent,
    InsuranceModalComponent,
    OilHistoryComponent,
    TyreHistoryComponent,
    PollutionModalComponent,
    FcModalComponent,
    RcModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,FormsModule,
    NgbModule,
    LoadingBarModule,
    LoadingBarRouterModule,HttpClientModule,ReactiveFormsModule, BrowserAnimationsModule,NgbModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true
    })
    
    
  ],
  providers: [ {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent],
  exports: [UppercaseDirective]
})
export class AppModule { }
