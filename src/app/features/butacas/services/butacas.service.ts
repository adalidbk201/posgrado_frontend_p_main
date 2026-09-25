import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Service } from '@angular/core';
import { environment } from '../../../../environment/environment';
import { Observable } from 'rxjs';
import { RespuestaApi } from '../../../core/models/respuesta-api.interface';
import { PaginacionResponse } from '../../../core/models/paginacion-response.interface';
import { Butaca } from '../models/butaca.interface';
import { ButacaRequest } from '../models/butaca-request.interface';

@Injectable({
    // ejecute desde la raiz
    providedIn:'root'
})
export class ButacasService {
    // conecion con la api

    // inyectar HttpClient para hacer peticiones http
    private readonly http = inject(HttpClient);

    // api url
    private readonly apiUrl = `${environment.API}/butacas/`;

    // metodo para obtener todas las butacas
    getAllButacas():Observable<RespuestaApi<PaginacionResponse<Butaca>>> {
        return this.http.get<RespuestaApi<PaginacionResponse<Butaca>>>(this.apiUrl);
    }

    // AHORA — con parámetros opcionales, no rompe otros lugares que ya lo llamen sin argumentos
    getButacas(id_nivel:string, pagina = 1, limite = 100): Observable<RespuestaApi<PaginacionResponse<Butaca>>> {
        return this.http.get<RespuestaApi<PaginacionResponse<Butaca>>>(
        `${this.apiUrl}?id_nivel=${id_nivel}&pagina=${pagina}&limite=${limite}`
        );
    }

    //metodo para buscar personas por termino
    // AHORA
    getBuscarButacas(termino: string): Observable<RespuestaApi<PaginacionResponse<Butaca>>> {
        return this.http.get<RespuestaApi<PaginacionResponse<Butaca>>>(`${this.apiUrl}?q=${encodeURIComponent(termino)}`);
    }

    // =========================
    // GET - POR ID
    getButacaPorId(id: string): Observable<RespuestaApi<Butaca>> {
    return this.http.get<RespuestaApi<Butaca>>(`${this.apiUrl}${id}/`);
    }

    // =========================
    // POST - CREAR
    crearPersona(datos: ButacaRequest): Observable<Butaca> {
    return this.http.post<Butaca>(this.apiUrl, datos);
    }

    // =========================
    // PUT - ACTUALIZAR
    actualizarButaca(id: string,datos: ButacaRequest): Observable<Butaca> {
    return this.http.put<Butaca>(`${this.apiUrl}${id}/`,datos);
    }

    // =========================
    // PATCH - ACTUALIZAR PARCIALMENTE
    actualizarParcialButaca(id: string,datos: Partial<ButacaRequest>): Observable<Butaca> {
    return this.http.patch<Butaca>(`${this.apiUrl}${id}/`,datos);
    }

    // =========================
    // DELETE - ELIMINAR
    eliminarButaca(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}${id}/`);
    }

}
