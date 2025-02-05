import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
//import { jwtDecode } from 'jwt-decode';

@Injectable({ providedIn: 'root' })
export class UserService {
  private roles = signal<string[]>([]);
  private permissions = signal<string[]>([]);

  constructor(private http: HttpClient) {}

  loadUserPermissions() {

    this.roles.set(["admin","superadmin"]);
    this.permissions.set(["admin","superadmin"]);
  /*  return this.http.get('/api/user/permissions').pipe(
      tap((response: any) => {
        this.roles.set(response.roles);
        this.permissions.set(response.permissions);
      })
    );*/
  }

  getUserRoles() {
  //   const token = localStorage.getItem('accessToken');
  //   if (!token) return [];
    
  //  const decoded: any = jwtDecode(token);
    return  this.roles || [];
  }

  hasPermission(permission: string) {
    return this.permissions().includes(permission);
  }
}