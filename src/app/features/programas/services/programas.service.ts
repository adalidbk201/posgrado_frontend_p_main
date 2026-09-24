import { inject, Injectable, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environment/environment';
import { Observable } from 'rxjs';
import { PaginacionResponse } from '../../../core/models/paginacion-response.interface';
import { RespuestaApi } from '../../../core/models/respuesta-api.interface';
import { Programa } from '../models/programa.interface';
import { ProgramaRequest } from '../models/programa-request.interface';
@Injectable({
  providedIn: 'root'
})
export class ProgramasService {
    // conexión con la API de programas

    // inyectar HttpClient para hacer peticiones HTTP
    private readonly http = inject(HttpClient);

    // api url
    private readonly apiUrl = `${environment.API}/programas/`;

    // método para obtener todos los programas
    getAllProgramas():Observable<RespuestaApi<PaginacionResponse<Programa>>> {
        return this.http.get<RespuestaApi<PaginacionResponse<Programa>>>(this.apiUrl);
    }

    // AHORA — con parámetros opcionales, no rompe otros lugares que ya lo llamen sin argumentos
    getProgramas(pagina = 1, limite = 100): Observable<RespuestaApi<PaginacionResponse<Programa>>> {
        return this.http.get<RespuestaApi<PaginacionResponse<Programa>>>(
        `${this.apiUrl}?pagina=${pagina}&limite=${limite}`
        );
    }

   //metodo para buscar personas por termino
    // AHORA
    getBuscarProgramas(termino: string): Observable<RespuestaApi<PaginacionResponse<Programa>>> {
        return this.http.get<RespuestaApi<PaginacionResponse<Programa>>>(`${this.apiUrl}?q=${encodeURIComponent(termino)}`);
    }

    // =========================
    // GET - POR ID
    getProgramaPorId(id: string): Observable<RespuestaApi<Programa>> {
    return this.http.get<RespuestaApi<Programa>>(`${this.apiUrl}${id}/`);
    }

    // =========================
    // POST - CREAR
    crearPrograma(datos: ProgramaRequest): Observable<Programa> {
    return this.http.post<Programa>(this.apiUrl, datos);
    }

    // =========================
    // PUT - ACTUALIZAR
    actualizarPrograma(id: string,datos: ProgramaRequest): Observable<Programa> {
    return this.http.put<Programa>(`${this.apiUrl}${id}/`,datos);
    }

    // =========================
    // PATCH - ACTUALIZAR PARCIALMENTE
    actualizarParcialPrograma(id: string,datos: Partial<ProgramaRequest>): Observable<Programa> {
    return this.http.patch<Programa>(`${this.apiUrl}${id}/`,datos);
    }

    // =========================
    // DELETE - ELIMINAR
    eliminarPrograma(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}${id}/`);
    }
}
