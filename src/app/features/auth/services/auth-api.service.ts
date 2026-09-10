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
    login(credentials:LoginRequest):Observable<LoginResponse>{
        return this.http.post<LoginResponse>(this.apiUrl, credentials)
    }

    
}
