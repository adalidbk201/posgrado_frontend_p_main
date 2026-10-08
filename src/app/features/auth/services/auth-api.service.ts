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
    private apiUrl =`${environment.API}/login/`;

    // Post Login
    /**
     * Iniciar sesión.
     *
     * withCredentials permite que el navegador
     * acepte/envíe la cookie HttpOnly refresh_token.
     */
    login(credentials: LoginRequest): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(
        this.apiUrl,
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
        return this.http.post<LoginResponse>(
        `${environment.API}/refresh/`,
        {},
        {
            withCredentials: true,
        }
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
