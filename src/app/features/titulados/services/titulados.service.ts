import { inject, Injectable, Service } from '@angular/core';
import { environment } from '../../../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { RespuestaApi } from '../../../core/models/respuesta-api.interface';
import { PaginacionResponse } from '../../../core/models/paginacion-response.interface';
import { Titulado } from '../models/titulado.interface';
import { Observable } from 'rxjs';
@Injectable({
  // ejecutar desde la raiz
  providedIn: 'root'
})
export class TituladosService {
    // consumir la api de titulados

    // injectar httpClient para realizar peticiones http
    private readonly httpClient = inject(HttpClient);

    // url de la api de titulados
    private readonly urlApi =`${environment.API}/titulados/`;

    // metodo para obtener todos los titulados
    getAllTitulados():Observable<RespuestaApi<PaginacionResponse<Titulado>>>{
        return this.httpClient.get<RespuestaApi<PaginacionResponse<Titulado>>>(this.urlApi);
    }

    // metodo para buscar titulados por termino
    getBuscarTitulados(termino:string):Observable<RespuestaApi<PaginacionResponse<Titulado>>>{
        return this.httpClient.get<RespuestaApi<PaginacionResponse<Titulado>>>(`${this.urlApi}getBuscarTitulados/${termino}`);
    }
}
