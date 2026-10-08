import { Injectable } from '@angular/core';

@Injectable({
    // ejecute desde la raiz
    providedIn: 'root',
})
export class AuthService {

  /**
   * Guarda el access token actual.
   */
  guardarToken(token: string): void {
    localStorage.setItem('access_token', token);
  }

  /**
   * Elimina el access token local.
   */
  limpiarToken(): void {
    localStorage.removeItem('access_token');
  }

  /**
   * Cierra sesión localmente.
   *
   * La llamada al endpoint /logout/ la haremos
   * desde el componente o servicio correspondiente.
   */
  logout(): void {
    this.limpiarToken();
  }

  /**
   * Obtiene el access token actual.
   */
  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

   /**
   * Verifica si existe un access token.
   */
  estaAutenticado(): boolean {
    return !!this.getToken();
  }

}
