import { inject, Injectable, Service } from '@angular/core';
import { environment } from '../../../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { LoginRequest } from '../models/login-request.interface';
import { LoginResponse } from '../models/login-response.interface';
@Injectable({
    // ejecute desde la raiz
    providedIn:'root'
})
export class AuthApiService {
    // concexion con la api

    // inyectar httpClient para realizar peticiones http
    private http=inject(HttpClient)

    // url api 
    private readonly apiUrl = environment.API;

    // Post Login
    /**
     * Iniciar sesión.
     *
     * withCredentials permite que el navegador
     * acepte/envíe la cookie HttpOnly refresh_token.
     */
    login(credentials: LoginRequest): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(
         `${this.apiUrl}/login/`,
        credentials,
        {
            withCredentials: true,
        }
        );
    }

    /**
   * Solicita un nuevo access token.
   *
   * No enviamos el refresh token manualmente.
   * Django lo obtiene desde la cookie HttpOnly.
   */
    refreshToken(): Observable<LoginResponse> {
        const csrfToken = this.obtenerCookie('csrftoken');

        console.log('🍪 CSRF cookie:', csrfToken);

        return this.http.post<LoginResponse>(
            `${this.apiUrl}/refresh/`,
            {},
            {
            withCredentials: true,
            headers: csrfToken
                ? {
                    'X-CSRFToken': csrfToken,
                }
                : {},
            },
        );
        }

        private obtenerCookie(nombre: string): string | null {
        const cookies = document.cookie.split(';');

        const cookie = cookies.find((item) =>
            item.trim().startsWith(`${nombre}=`),
        );

        if (!cookie) {
            return null;
        }

        return decodeURIComponent(
            cookie.trim().substring(nombre.length + 1),
        );
        }

     /**
   * Cerrar sesión en el backend.
   */
    logout(): Observable<unknown> {
        return this.http.get(
        `${environment.API}/logout/`,
        {
            withCredentials: true,
        }
        );
    }

    obtenerCsrfToken(): Observable<unknown> {
    return this.http.get(
        `${environment.API}/csrf/`,
        {
        withCredentials: true,
        },
    );
    }

    
    
}
