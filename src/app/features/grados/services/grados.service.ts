import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment';
import { Observable } from 'rxjs';
import { RespuestaApi } from '../../../core/models/respuesta-api.interface';
import { PaginacionResponse } from '../../../core/models/paginacion-response.interface';
import { Grado } from '../models/grado.interface';
import { GradoRequest } from '../models/grado-request.interface';


@Injectable({
    providedIn:'root'
})
export class GradosService {
    // concexion con la api de grados academicos

    // inyecta httpClient par arealizar peticiones http
    private http=inject(HttpClient)

    // rl de la api grados academicos
    private api =`${environment.API}/grados/`

    // obtener todos los grados
    getAllGrados():Observable<RespuestaApi<PaginacionResponse<Grado>>> {
        return this.http.get<RespuestaApi<PaginacionResponse<Grado>>>(this.api);
    }

    // AHORA — con parámetros opcionales, no rompe otros lugares que ya lo llamen sin argumentos
    getGrados(pagina = 1, limite = 100): Observable<RespuestaApi<PaginacionResponse<Grado>>> {
        return this.http.get<RespuestaApi<PaginacionResponse<Grado>>>(
        `${this.api}?pagina=${pagina}&limite=${limite}`
        );
    }

    // obtener una sala por terminos de busqueda
    getGradoBusqueda(termino: string):Observable<RespuestaApi<PaginacionResponse<Grado>>> {
        return this.http.get<RespuestaApi<PaginacionResponse<Grado>>>(`${this.api}?q=${termino}`);
    }

    // =========================
    // GET - POR ID
    getGradoPorId(id: number): Observable<RespuestaApi<Grado>> {
    return this.http.get<RespuestaApi<Grado>>(`${this.api}${id}/`);
    }

    // =========================
    // POST - CREAR
    crearGrado(datos: GradoRequest): Observable<Grado> {
        return this.http.post<Grado>(this.api, datos);
    }

    // =========================
    // PUT - ACTUALIZAR
    actualizarGrado(id: string,datos: GradoRequest): Observable<Grado> {
        return this.http.put<Grado>(`${this.api}${id}/`,datos);
    }

    // =========================
    // PATCH - ACTUALIZAR PARCIALMENTE
    actualizarParcialGrado(id: number,datos: Partial<GradoRequest>): Observable<Grado> {
        return this.http.patch<Grado>(`${this.api}${id}/`,datos);
    }

    // =========================
    // DELETE - ELIMINAR
    eliminarGrado(id: number): Observable<void> {
        return this.http.delete<void>(`${this.api}${id}/`);
    }
    
}
 