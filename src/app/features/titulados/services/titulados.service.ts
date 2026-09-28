import { inject, Injectable, Service } from '@angular/core';
import { environment } from '../../../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { RespuestaApi } from '../../../core/models/respuesta-api.interface';
import { PaginacionResponse } from '../../../core/models/paginacion-response.interface';
import { Titulado } from '../models/titulado.interface';
import { Observable } from 'rxjs';
import { TituladoRequest } from '../models/titulado-request.interface';
@Injectable({
  // ejecutar desde la raiz
  providedIn: 'root'
})
export class TituladosService {
     // conecion con la api

    // inyectar HttpClient para hacer peticiones http
    private readonly http = inject(HttpClient);

    // api url
    private readonly apiUrl = `${environment.API}/titulados/`;

    // metodo para obtener todas los titulados
    getAllTitulados():Observable<RespuestaApi<PaginacionResponse<Titulado>>> {
        return this.http.get<RespuestaApi<PaginacionResponse<Titulado>>>(this.apiUrl);
    }

    // AHORA — con parámetros opcionales, no rompe otros lugares que ya lo llamen sin argumentos
    getTitulados(pagina = 1, limite = 100): Observable<RespuestaApi<PaginacionResponse<Titulado>>> {
        return this.http.get<RespuestaApi<PaginacionResponse<Titulado>>>(
        `${this.apiUrl}?pagina=${pagina}&limite=${limite}`
        );
    }

    //metodo para buscar titulados por termino
    // AHORA
    getBuscarTitulados(termino: string): Observable<RespuestaApi<PaginacionResponse<Titulado>>> {
        return this.http.get<RespuestaApi<PaginacionResponse<Titulado>>>(`${this.apiUrl}?q=${encodeURIComponent(termino)}`);
    }
     
    // =========================
    // GET - POR ID
    getTituladoPorId(id: string): Observable<RespuestaApi<Titulado>> {
    return this.http.get<RespuestaApi<Titulado>>(`${this.apiUrl}${id}/`);
    }

    // =========================
    // POST - CREAR
    crearTitulado(datos: TituladoRequest): Observable<Titulado> {
    return this.http.post<Titulado>(this.apiUrl, datos);
    }

    // =========================
    // PUT - ACTUALIZAR
    actualizarTitulado(id: string,datos: TituladoRequest): Observable<Titulado> {
    return this.http.put<Titulado>(`${this.apiUrl}${id}/`,datos);
    }

    // =========================
    // PATCH - ACTUALIZAR PARCIALMENTE
    actualizarParcialTitulado(id: string,datos: Partial<TituladoRequest>): Observable<Titulado> {
    return this.http.patch<Titulado>(`${this.apiUrl}${id}/`,datos);
    }

    // =========================
    // DELETE - ELIMINAR
    eliminarTitulado(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}${id}/`);
    }



}
