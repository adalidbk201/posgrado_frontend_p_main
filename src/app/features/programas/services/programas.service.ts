import { inject, Injectable, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environment/environment';
import { Observable } from 'rxjs';
import { PaginacionResponse } from '../../../core/models/paginacion-response.interface';
import { RespuestaApi } from '../../../core/models/respuesta-api.interface';
import { Programa } from '../models/programa.interface';
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

    // método para buscar programas por término
    getBuscarProgramas(termino: string): Observable<RespuestaApi<PaginacionResponse<Programa>>> {
        return this.http.get<RespuestaApi<PaginacionResponse<Programa>>>(`${this.apiUrl}?q=${encodeURIComponent(termino)}/`);
    }

}
