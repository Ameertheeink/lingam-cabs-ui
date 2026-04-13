import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    private toastr: ToastrService,
    private router: Router
  ) {}

intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

  return next.handle(req).pipe(
    catchError((error: HttpErrorResponse) => {

      // ✅ Skip toast for reminder APIs — 404 is expected when no reminder
      const silentUrls = [
        '/reminders',
        '/reminders/top',
        '/reminders/vehicle'
      ];

      const isSilent = silentUrls.some(url => req.url.includes(url));

      let errorMessage = 'Something went wrong!';

      if (error.error instanceof ErrorEvent) {
        errorMessage = error.error.message;
      } else {
        switch (error.status) {

          case 400:
            errorMessage = error.error?.message || 'Bad Request';
            break;

          case 401:
            errorMessage = 'Unauthorized - Please login again';
            this.router.navigate(['/login']);
            break;

          case 403:
            errorMessage = 'Access Denied';
            break;

          case 404:
            errorMessage = 'Not Found';
            break;

          case 500:
            errorMessage = 'Internal Server Error';
            break;

          case 0:
            errorMessage = 'Server not reachable (Connection refused)';
            break;

          default:
            errorMessage = `Error: ${error.status}`;
        }
      }

      // ✅ Only show toast if not a silent URL
      if (!isSilent) {
        this.toastr.error(errorMessage);
      }

      console.error('HTTP Error:', error);
      return throwError(() => error);
    })
  );
}
}