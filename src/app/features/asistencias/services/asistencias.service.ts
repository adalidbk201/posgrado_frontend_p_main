import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment';
import { HttpClient } from '@angular/common/http';

import type { Asistencia } from '../models/asistencia.interface';
import type { PaginacionResponse } from '../../../core/models/paginacion-response.interface';
import type { RespuestaApi } from '../../../core/models/respuesta-api.interface';
import { Observable } from 'rxjs';

@Injectable({
    // ejecute desde la raiz
    providedIn:'root'
})
export class AsistenciasService {
    // conexion con la api

    // inyectar httpClient para realizar petciones http
    private http=inject(HttpClient)

    // apiUrl
    private apiUrl= `${environment.API}/asistencias/`
  
    // metodo get de services
    getPost(): Observable<RespuestaApi<PaginacionResponse<Asistencia>>> {
        return this.http.get<
        RespuestaApi<PaginacionResponse<Asistencia>>
        >(this.apiUrl);
    }

    // metood buscar de service
    getPostBuscar(termino: string): Observable<RespuestaApi<PaginacionResponse<Asistencia>>> {
        return this.http.get<RespuestaApi<PaginacionResponse<Asistencia>>>(`${this.apiUrl}?q=${encodeURIComponent(termino)}/`);
    }
}
