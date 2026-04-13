import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

 private apiUrl = 'http://localhost:8080/api/auth';
 private idleTimeout: any;
  private readonly IDLE_TIME = 15 * 60 * 1000; // 15 minutes

  constructor(private http: HttpClient, private router: Router,private ngZone: NgZone) {}


    startIdleTimer() {
    this.resetIdleTimer();

    // Listen to user activity
    ['click', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
      window.addEventListener(event, () => this.resetIdleTimer());
    });
  }

  resetIdleTimer() {
    clearTimeout(this.idleTimeout);

    this.idleTimeout = setTimeout(() => {
      this.ngZone.run(() => {
        this.logout();
        alert('Session expired due to inactivity. Please login again.');
      });
    }, this.IDLE_TIME);
  }

  stopIdleTimer() {
    clearTimeout(this.idleTimeout);
  }


  login(username: string, password: string) {
    return this.http.post<any>(`${this.apiUrl}/login`, { username, password });
  }


  saveToken(data: any) {
  localStorage.setItem('auth_token', data.token);
  localStorage.setItem('auth_username', data.username);
}

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }



getRole(): string {
  return localStorage.getItem('auth_role') || '';
}

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_username');
    this.stopIdleTimer();
    this.router.navigate(['/login']);
  }
  getUsername(): string {
  return localStorage.getItem('auth_username') || 'User';
}

}
