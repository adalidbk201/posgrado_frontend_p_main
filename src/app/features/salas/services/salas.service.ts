import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RespuestaApi } from '../../../core/models/respuesta-api.interface';
import { PaginacionResponse } from '../../../core/models/paginacion-response.interface';
import { Sala } from '../models/sala.interface';
import { SalaRequest } from '../models/sala-request.interface';
@Injectable({
    // ejecutar desde la raiz
    providedIn: 'root'
})
export class SalasService {
    // conexion a la api de salas

    // injectar httpClient para realizar peticiones http
    private http=inject(HttpClient);

    // url de la api de salas
    private url = `${environment.API}/salas/`;

    // obtener todas las salas
    getAllSalas():Observable<RespuestaApi<PaginacionResponse<Sala>>> {
        return this.http.get<RespuestaApi<PaginacionResponse<Sala>>>(this.url);
    }

    // AHORA — con parámetros opcionales, no rompe otros lugares que ya lo llamen sin argumentos
    getSalas(pagina = 1, limite = 100): Observable<RespuestaApi<PaginacionResponse<Sala>>> {
      return this.http.get<RespuestaApi<PaginacionResponse<Sala>>>(
        `${this.url}?pagina=${pagina}&limite=${limite}`
      );
    }
    
    // obtener una sala por terminos de busqueda
    getSalaBusqueda(termino: string):Observable<RespuestaApi<PaginacionResponse<Sala>>> {
        return this.http.get<RespuestaApi<PaginacionResponse<Sala>>>(`${this.url}?q=${termino}`);
    }

  // =========================
  // GET - POR ID
  getSalaPorId(id: string): Observable<RespuestaApi<Sala>> {
    return this.http.get<RespuestaApi<Sala>>(`${this.url}${id}/`);
  }
  
  // =========================
  // POST - CREAR
  crearSala(datos: SalaRequest): Observable<Sala> {
    return this.http.post<Sala>(this.url, datos);
  }

  // =========================
  // PUT - ACTUALIZAR
  actualizarSala(id: string,datos: SalaRequest): Observable<Sala> {
    return this.http.put<Sala>(`${this.url}${id}/`,datos);
  }

  // =========================
  // PATCH - ACTUALIZAR PARCIALMENTE
  actualizarParcialSala(id: string,datos: Partial<SalaRequest>): Observable<Sala> {
    return this.http.patch<Sala>(`${this.url}${id}/`,datos);
  }

  // =========================
  // DELETE - ELIMINAR
  eliminarSala(id: string): Observable<void> {
    return this.http.delete<void>(`${this.url}${id}/`);
  }

}
