import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  private startTime: number = 0;

  show() {
    this.startTime = Date.now();
    this.loadingSubject.next(true);
  }

  hide(minDuration: number = 800) {
    const elapsed = Date.now() - this.startTime;
    const remaining = minDuration - elapsed;

    if (remaining > 0) {
      setTimeout(() => {
        this.loadingSubject.next(false);
      }, remaining);
    } else {
      this.loadingSubject.next(false);
    }
  }
}