import { Injectable } from '@angular/core';

@Injectable({
    // ejecute desde la raiz
    providedIn: 'root',
})
export class AuthService {

  logout(): void {
    localStorage.removeItem('access_token');
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  estaAutenticado(): boolean {
    return !!this.getToken();
  }
}
