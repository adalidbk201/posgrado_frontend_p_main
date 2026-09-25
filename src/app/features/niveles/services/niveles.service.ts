import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment';
import { Observable } from 'rxjs';
import { RespuestaApi } from '../../../core/models/respuesta-api.interface';
import { PaginacionResponse } from '../../../core/models/paginacion-response.interface';
import { Nivel } from '../models/nivel.interface';
import { NivelRequest } from '../models/nivel-request.interface';

@Injectable({
    // ejecute desde la raiz
    providedIn:'root'
})
export class NivelesService {
    // conecion con la api

    // inyectar HttpClient para hacer peticiones http
    private readonly http = inject(HttpClient);

    // api url
    private readonly apiUrl = `${environment.API}/niveles/`;

    // metodo para obtener todas los niveles
    getAllNiveles():Observable<RespuestaApi<PaginacionResponse<Nivel>>> {
        return this.http.get<RespuestaApi<PaginacionResponse<Nivel>>>(this.apiUrl);
    }

    // AHORA — con parámetros opcionales, no rompe otros lugares que ya lo llamen sin argumentos
    getNiveles(pagina = 1, limite = 100): Observable<RespuestaApi<PaginacionResponse<Nivel>>> {
        return this.http.get<RespuestaApi<PaginacionResponse<Nivel>>>(
        `${this.apiUrl}?pagina=${pagina}&limite=${limite}`
        );
    }
    
    //metodo para buscar personas por termino
    // AHORA
    getBuscarNiveles(termino: string): Observable<RespuestaApi<PaginacionResponse<Nivel>>> {
        return this.http.get<RespuestaApi<PaginacionResponse<Nivel>>>(`${this.apiUrl}?q=${encodeURIComponent(termino)}`);
    }

    // =========================
    // GET - POR ID
    getNivelPorId(id: string): Observable<RespuestaApi<Nivel>> {
    return this.http.get<RespuestaApi<Nivel>>(`${this.apiUrl}${id}/`);
    }

    // =========================
    // POST - CREAR
    crearNivel(datos: NivelRequest): Observable<Nivel> {
    return this.http.post<Nivel>(this.apiUrl, datos);
    }

    // =========================
    // PUT - ACTUALIZAR
    actualizarNivel(id: string,datos: NivelRequest): Observable<Nivel> {
    return this.http.put<Nivel>(`${this.apiUrl}${id}/`,datos);
    }

    // =========================
    // PATCH - ACTUALIZAR PARCIALMENTE
    actualizarParcialNivel(id: string,datos: Partial<NivelRequest>): Observable<Nivel> {
    return this.http.patch<Nivel>(`${this.apiUrl}${id}/`,datos);
    }

    // =========================
    // DELETE - ELIMINAR
    eliminarNivel(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}${id}/`);
    }

}
