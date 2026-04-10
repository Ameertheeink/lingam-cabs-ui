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

        let errorMessage = 'Something went wrong!';

        if (error.error instanceof ErrorEvent) {
          // 🔹 Client-side error
          errorMessage = error.error.message;
        } else {
          // 🔹 Server-side error
          switch (error.status) {

            case 400:
              errorMessage = 'Bad Request';
              break;

            case 401:
              errorMessage = 'Unauthorized - Please login again';
              this.router.navigate(['/login']);
              break;

            case 403:
              errorMessage = 'Access Denied';
              break;

            case 404:
              errorMessage = 'API Not Found';
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

        // 🔔 Show toast message
        this.toastr.error(errorMessage);

        console.error('HTTP Error:', error);

        return throwError(() => error);
      })
    );
  }
}