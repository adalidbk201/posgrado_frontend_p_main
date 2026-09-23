import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment';
import type { Persona } from '../models/persona.interface';
import type { PaginacionResponse } from '../../../core/models/paginacion-response.interface';
import type { RespuestaApi } from '../../../core/models/respuesta-api.interface';
import { Observable } from 'rxjs';
import { PersonaRequest } from '../models/persona-request.interface';
@Injectable({
    // ejecute desde cualquier parte de la aplicacion
    providedIn: 'root',
})
export class PersonasService {
    // conecion con la api

    // inyectar HttpClient para hacer peticiones http
    private readonly http = inject(HttpClient);

    // api url
    private readonly apiUrl = `${environment.API}/personas/`;
    
    // metodo para obtener todas las personas
    getAllPersonas():Observable<RespuestaApi<PaginacionResponse<Persona>>> {
        return this.http.get<RespuestaApi<PaginacionResponse<Persona>>>(this.apiUrl);
    }

    // AHORA — con parámetros opcionales, no rompe otros lugares que ya lo llamen sin argumentos
    getPersonas(pagina = 1, limite = 100): Observable<RespuestaApi<PaginacionResponse<Persona>>> {
      return this.http.get<RespuestaApi<PaginacionResponse<Persona>>>(
        `${this.apiUrl}?pagina=${pagina}&limite=${limite}`
      );
    }

    //metodo para buscar personas por termino
    getBuscarPersonas(termino: string): Observable<RespuestaApi<PaginacionResponse<Persona>>> {
        return this.http.get<RespuestaApi<PaginacionResponse<Persona>>>(`${this.apiUrl}?q=${encodeURIComponent(termino)}/`);
    }

    // =========================
      // GET - POR ID
      getPersonaPorId(id: string): Observable<RespuestaApi<Persona>> {
        return this.http.get<RespuestaApi<Persona>>(`${this.apiUrl}${id}/`);
      }

     // =========================
      // POST - CREAR
      crearPersona(datos: PersonaRequest): Observable<Persona> {
        return this.http.post<Persona>(this.apiUrl, datos);
      }

    // =========================
      // PUT - ACTUALIZAR
      actualizarPersona(id: string,datos: PersonaRequest): Observable<Persona> {
        return this.http.put<Persona>(`${this.apiUrl}${id}/`,datos);
      }
    
    // =========================
      // PATCH - ACTUALIZAR PARCIALMENTE
      actualizarParcialPersona(id: string,datos: Partial<PersonaRequest>): Observable<Persona> {
        return this.http.patch<Persona>(`${this.apiUrl}${id}/`,datos);
      }

    // =========================
    // DELETE - ELIMINAR
    eliminarPersona(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}${id}/`);
    }
      
}
