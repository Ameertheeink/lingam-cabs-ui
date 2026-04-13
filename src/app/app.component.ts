import { Component, OnInit } from '@angular/core';
import {
  Router,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError
} from '@angular/router';
import { LoaderService } from './shared/services/loader.service';
import { AppConfig } from './config/app.config';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

  constructor(
    private router: Router,
    private loaderService: LoaderService,
    private http: HttpClient
  ) {}

  ngOnInit() {

    // Load API Key from backend
    this.http.get<any>('http://localhost:8080/api/config').subscribe({
      next: (response) => {
        AppConfig.apiKey = response.data.googleApiKey;  // ✅
        console.log('Config loaded successfully');
      },
      error: (err) => {
        console.error('Failed to load config', err);
      }
    });

    // Show loader immediately on app start
    this.loaderService.show();

    this.router.events.subscribe(event => {

      if (event instanceof NavigationStart) {
        this.loaderService.show();
      }

      if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        setTimeout(() => {
          this.loaderService.hide();
        }, 300);
      }

    });

  }
}