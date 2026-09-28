import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment';
import { Observable } from 'rxjs';
import { RespuestaApi } from '../../../core/models/respuesta-api.interface';
import { PaginacionResponse } from '../../../core/models/paginacion-response.interface';
import { Asignacion } from '../models/asignacion.interface';
import { AsignacionRequest } from '../models/asignacion-request.interface';

@Injectable({
    // Ejecute desde la raiz
    providedIn:'root'
})
export class AsignacionesService {
    // conecion con la api

    // inyectar HttpClient para hacer peticiones http
    private readonly http = inject(HttpClient);

    // api url
    private readonly apiUrl = `${environment.API}/asignacion-butaca/`;
   
    // metodo para obtener todas las asignaciones
    getAllAsignaciones():Observable<RespuestaApi<PaginacionResponse<Asignacion>>> {
        return this.http.get<RespuestaApi<PaginacionResponse<Asignacion>>>(this.apiUrl);
    }

    // AHORA — con parámetros opcionales, no rompe otros lugares que ya lo llamen sin argumentos
    getAsignaciones(pagina = 1, limite = 100): Observable<RespuestaApi<PaginacionResponse<Asignacion>>> {
        return this.http.get<RespuestaApi<PaginacionResponse<Asignacion>>>(
        `${this.apiUrl}?pagina=${pagina}&limite=${limite}`
        );
    }
    
    //metodo para buscar personas por termino
    // AHORA
    getBuscarAsignaciones(termino: string): Observable<RespuestaApi<PaginacionResponse<Asignacion>>> {
        return this.http.get<RespuestaApi<PaginacionResponse<Asignacion>>>(`${this.apiUrl}?q=${encodeURIComponent(termino)}`);
    }

    // =========================
    // GET - POR ID
    getAsignacionPorId(id: string): Observable<RespuestaApi<Asignacion>> {
    return this.http.get<RespuestaApi<Asignacion>>(`${this.apiUrl}${id}/`);
    }

    // =========================
    // POST - CREAR
    crearAsignacion(datos: AsignacionRequest): Observable<Asignacion> {
    return this.http.post<Asignacion>(this.apiUrl, datos);
    }

    // =========================
    // PUT - ACTUALIZAR
    actualizarAsignacion(id: string,datos: AsignacionRequest): Observable<Asignacion> {
    return this.http.put<Asignacion>(`${this.apiUrl}${id}/`,datos);
    }

    // =========================
    // PATCH - ACTUALIZAR PARCIALMENTE
    actualizarParcialAsignacion(id: string,datos: Partial<AsignacionRequest>): Observable<Asignacion> {
    return this.http.patch<Asignacion>(`${this.apiUrl}${id}/`,datos);
    }

    // =========================
    // DELETE - ELIMINAR
    eliminarAsignacion(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}${id}/`);
    }
      




}
