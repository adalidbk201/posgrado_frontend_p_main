import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Service } from '@angular/core';
import { environment } from '../../../../environment/environment';
import { Observable } from 'rxjs';
import { RespuestaApi } from '../../../core/models/respuesta-api.interface';
import { PaginacionResponse } from '../../../core/models/paginacion-response.interface';
import { Mencion } from '../models/mencion.interface';
import { MencionRequest } from '../models/mencion-request.interface';

@Injectable({
    providedIn:'root'
})
export class MencionesService {
    // conecion con la api

    // inyectar HttpClient para hacer peticiones http
    private readonly http = inject(HttpClient);

    // api url
    private readonly apiUrl = `${environment.API}/menciones/`;

    // metodo para obtener todas las personas
    getAllMenciones():Observable<RespuestaApi<PaginacionResponse<Mencion>>> {
        return this.http.get<RespuestaApi<PaginacionResponse<Mencion>>>(this.apiUrl);
    }

    // AHORA — con parámetros opcionales, no rompe otros lugares que ya lo llamen sin argumentos
    getMenciones(pagina = 1, limite = 100): Observable<RespuestaApi<PaginacionResponse<Mencion>>> {
        return this.http.get<RespuestaApi<PaginacionResponse<Mencion>>>(
        `${this.apiUrl}?pagina=${pagina}&limite=${limite}`
        );
    }

    //metodo para buscar personas por termino
    // AHORA
    getBuscarMenciones(termino: string): Observable<RespuestaApi<PaginacionResponse<Mencion>>> {
        return this.http.get<RespuestaApi<PaginacionResponse<Mencion>>>(`${this.apiUrl}?q=${encodeURIComponent(termino)}`);
    }

    // =========================
    // GET - POR ID
    getMencionPorId(id: number): Observable<RespuestaApi<Mencion>> {
    return this.http.get<RespuestaApi<Mencion>>(`${this.apiUrl}${id}/`);
    }

    // =========================
    // POST - CREAR
    crearMencion(datos: MencionRequest): Observable<Mencion> {
    return this.http.post<Mencion>(this.apiUrl, datos);
    }

    // =========================
    // PUT - ACTUALIZAR
    actualizarMencion(id: number,datos: MencionRequest): Observable<Mencion> {
    return this.http.put<Mencion>(`${this.apiUrl}${id}/`,datos);
    }

    // =========================
    // PATCH - ACTUALIZAR PARCIALMENTE
    actualizarParcialMencion(id: number,datos: Partial<MencionRequest>): Observable<Mencion> {
    return this.http.patch<Mencion>(`${this.apiUrl}${id}/`,datos);
    }

    // =========================
    // DELETE - ELIMINAR
    eliminarMencion(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}${id}/`);
    }
}
