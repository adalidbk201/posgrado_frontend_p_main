import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment';
import { Observable } from 'rxjs';
import { RespuestaApi } from '../../../core/models/respuesta-api.interface';
import { PaginacionResponse } from '../../../core/models/paginacion-response.interface';
import { Colacion } from '../models/colacion.interface';
import { ColacionRequest } from '../models/colacion-request.interface';

@Injectable({
    // que se ejecute desde al raiz
    providedIn:'root'
})
export class ColacionesService {
    // conecion con la api

    // inyectar HttpClient para hacer peticiones http
    private readonly http = inject(HttpClient);

    // api url
    private readonly apiUrl = `${environment.API}/colaciones/`;

    // metodo para obtener todas las colaciones
    getAllColaciones():Observable<RespuestaApi<PaginacionResponse<Colacion>>> {
        return this.http.get<RespuestaApi<PaginacionResponse<Colacion>>>(this.apiUrl);
    }

    // AHORA — con parámetros opcionales, no rompe otros lugares que ya lo llamen sin argumentos
    getColaciones(pagina = 1, limite = 100): Observable<RespuestaApi<PaginacionResponse<Colacion>>> {
        return this.http.get<RespuestaApi<PaginacionResponse<Colacion>>>(
        `${this.apiUrl}?pagina=${pagina}&limite=${limite}`
        );
    }

    //metodo para buscar colaciones por termino
    // AHORA
    getBuscarColaciones(termino: string): Observable<RespuestaApi<PaginacionResponse<Colacion>>> {
        return this.http.get<RespuestaApi<PaginacionResponse<Colacion>>>(`${this.apiUrl}?q=${encodeURIComponent(termino)}`);
    }

    // =========================
    // GET - POR ID
    getColacionPorId(id: string): Observable<RespuestaApi<Colacion>> {
    return this.http.get<RespuestaApi<Colacion>>(`${this.apiUrl}${id}/`);
    }
    
    // =========================
    // POST - CREAR
    crearColacion(datos: ColacionRequest): Observable<Colacion> {
    return this.http.post<Colacion>(this.apiUrl, datos);
    }

    // =========================
    // PUT - ACTUALIZAR
    actualizarColacion(id: string,datos: ColacionRequest): Observable<Colacion> {
    return this.http.put<Colacion>(`${this.apiUrl}${id}/`,datos);
    }

    // =========================
    // PATCH - ACTUALIZAR PARCIALMENTE
    actualizarParcialColacion(id: string,datos: Partial<ColacionRequest>): Observable<Colacion> {
    return this.http.patch<Colacion>(`${this.apiUrl}${id}/`,datos);
    }

    // =========================
    // DELETE - ELIMINAR
    eliminarColacion(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}${id}/`);
    }
}
