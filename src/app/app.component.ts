import { Component, OnInit } from '@angular/core';
import {
  Router,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError
} from '@angular/router';
import { LoaderService } from './shared/services/loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

  constructor(
    private router: Router,
    private loaderService: LoaderService
  ) {}

  ngOnInit() {

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

        // small delay to make it visible
        setTimeout(() => {
          this.loaderService.hide();
        }, 300);

      }

    });

  }
}
