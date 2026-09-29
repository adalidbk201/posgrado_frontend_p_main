import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment';
import { Observable } from 'rxjs';
import { RespuestaApi } from '../../../core/models/respuesta-api.interface';
import { PaginacionResponse } from '../../../core/models/paginacion-response.interface';
import { Comunicado } from '../models/comunicado.interface';
import { ComunicadoRequest } from '../models/comunicado-request.interface';

@Injectable({
    // se ejecute desde la raiz
    providedIn:'root'
})
export class ComunicadosService {
    // conecion con la api

    // inyectar HttpClient para hacer peticiones http
    private readonly http = inject(HttpClient);

    // api url
    private readonly apiUrl = `${environment.API}/comunicados/`;

    // metodo para obtener todas las personas
    getAllComunicados():Observable<RespuestaApi<PaginacionResponse<Comunicado>>> {
        return this.http.get<RespuestaApi<PaginacionResponse<Comunicado>>>(this.apiUrl);
    }

    // AHORA — con parámetros opcionales, no rompe otros lugares que ya lo llamen sin argumentos
    getComunicados(pagina = 1, limite = 100): Observable<RespuestaApi<PaginacionResponse<Comunicado>>> {
        return this.http.get<RespuestaApi<PaginacionResponse<Comunicado>>>(
        `${this.apiUrl}?pagina=${pagina}&limite=${limite}`
        );
    }

    //metodo para buscar comunicados por termino
    // AHORA
    getBuscarComunicados(termino: string): Observable<RespuestaApi<PaginacionResponse<Comunicado>>> {
        return this.http.get<RespuestaApi<PaginacionResponse<Comunicado>>>(`${this.apiUrl}?q=${encodeURIComponent(termino)}`);
    }

    // =========================
    // GET - POR ID
    getComunicadoPorId(id: string): Observable<RespuestaApi<Comunicado>> {
    return this.http.get<RespuestaApi<Comunicado>>(`${this.apiUrl}${id}/`);
    }

    // =========================
    // POST - CREAR
    crearComunicado(datos: ComunicadoRequest): Observable<Comunicado> {
    return this.http.post<Comunicado>(this.apiUrl, datos);
    }

    // =========================
    // PUT - ACTUALIZAR
    actualizarComunicado(id: string,datos: ComunicadoRequest): Observable<Comunicado> {
    return this.http.put<Comunicado>(`${this.apiUrl}${id}/`,datos);
    }

    // =========================
    // PATCH - ACTUALIZAR PARCIALMENTE
    actualizarParcialComunicado(id: string,datos: Partial<ComunicadoRequest>): Observable<Comunicado> {
    return this.http.patch<Comunicado>(`${this.apiUrl}${id}/`,datos);
    }

    // =========================
    // DELETE - ELIMINAR
    eliminarComunicado(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}${id}/`);
    }
}
