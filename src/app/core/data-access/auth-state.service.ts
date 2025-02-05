import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthStateService {
  private apiUrl = 'https://api.example.com/dashboard';

  constructor(private http: HttpClient) { }

  getDashboardStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/stats`);
  }

  getRecentActivities(): Observable<any> {
    return this.http.get(`${this.apiUrl}/activities`);
  }
}