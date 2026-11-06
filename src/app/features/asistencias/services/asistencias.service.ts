import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment';
import { HttpClient, HttpParams } from '@angular/common/http';

import type { Asistencia } from '../models/asistencia.interface';
import type { PaginacionResponse } from '../../../core/models/paginacion-response.interface';
import type { RespuestaApi } from '../../../core/models/respuesta-api.interface';
import { Observable } from 'rxjs';
import { AsistenciaRequest } from '../models/asistencia-request.interfacace';

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
    getAllAsistencias(): Observable<RespuestaApi<PaginacionResponse<Asistencia>>> {
        return this.http.get<
        RespuestaApi<PaginacionResponse<Asistencia>>
        >(this.apiUrl);
    }
    // AHORA — con parámetros opcionales, no rompe otros lugares que ya lo llamen sin argumentos
    getAsistencias(pagina = 1, limite = 100): Observable<RespuestaApi<PaginacionResponse<Asistencia>>> {
        return this.http.get<RespuestaApi<PaginacionResponse<Asistencia>>>(
        `${this.apiUrl}?pagina=${pagina}&limite=${limite}`
        );
    }

    // metood buscar de service
    getPostBuscar(termino: string): Observable<RespuestaApi<PaginacionResponse<Asistencia>>> {
        return this.http.get<RespuestaApi<PaginacionResponse<Asistencia>>>(`${this.apiUrl}?q=${encodeURIComponent(termino)}/`);
    }

    // =========================
    // POST - CREAR
    // =========================
    crearAsistencia(
        datos: AsistenciaRequest,
        idColacion: string
    ): Observable<Asistencia> {

        const params = new HttpParams()
            .set('id_colacion', idColacion);

        return this.http.post<Asistencia>(
            this.apiUrl,
            datos,
            { params }
        );
    }
}
