import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment';
import { Observable } from 'rxjs';
import { RespuestaApi } from '../../../core/models/respuesta-api.interface';
import { PaginacionResponse } from '../../../core/models/paginacion-response.interface';
import { Rol } from '../models/rol.interface';
import { RolRequest } from '../models/rol-request.interface';
@Injectable({
    // ejecutar desde la raiz
    providedIn:'root'
})
export class RolesService {
    // conexion con la api roles

    // inyectar httpClinet para realizar peticiones http
    private http=inject(HttpClient)

    // url de la api roles
    private url=`${environment.API}/roles/`

    // obtener todos los roles
    getRoles():Observable<RespuestaApi<PaginacionResponse<Rol>>> {
        return this.http.get<RespuestaApi<PaginacionResponse<Rol>>>(this.url);
    }

    // obtener un rol por terminos de busqueda
    getRolBusqueda(termino: string):Observable<RespuestaApi<PaginacionResponse<Rol>>> {
        return this.http.get<RespuestaApi<PaginacionResponse<Rol>>>(`${this.url}?q=${termino}`);
    }

    // =========================
    // GET - POR ID
    getRolPorId(id: string): Observable<RespuestaApi<Rol>> {
    return this.http.get<RespuestaApi<Rol>>(`${this.url}${id}/`);
    }

    // =========================
    // POST - CREAR
    crearRol(datos: RolRequest): Observable<Rol> {
        return this.http.post<Rol>(this.url, datos);
    }

    // =========================
    // PUT - ACTUALIZAR
    actualizarRol(id: string,datos: RolRequest): Observable<Rol> {
    return this.http.put<Rol>(`${this.url}${id}/`,datos);
    }

    // =========================
    // PATCH - ACTUALIZAR PARCIALMENTE
    actualizarParcialRol(id: string,datos: Partial<RolRequest>): Observable<Rol> {
    return this.http.patch<Rol>(`${this.url}${id}/`,datos);
    }

    // =========================
    // DELETE - ELIMINAR
    eliminarRol(id: string): Observable<void> {
        return this.http.delete<void>(`${this.url}${id}/`);
    }
        

}
