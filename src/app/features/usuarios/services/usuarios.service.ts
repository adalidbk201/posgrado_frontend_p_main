import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment';
import { Observable } from 'rxjs';
import { RespuestaApi } from '../../../core/models/respuesta-api.interface';
import { PaginacionResponse } from '../../../core/models/paginacion-response.interface';
import { Usuario } from '../models/usuario.interface';
import { UsuarioRequest } from '../models/usuario.request.interface';
@Injectable({
    // ejecute desde la raiz
    providedIn:'root'
})
export class UsuariosService {
    // conexion con la api de usuarios
    
    // inyectar HttpClient para realizar petcioines http
    private http=inject(HttpClient);

    // url de la api usuarios
    private api=`${environment.API}/usuarios/`;

    // Obtener todos los usuarios
    getUsuarios():Observable<RespuestaApi<PaginacionResponse<Usuario>>>{
        return this.http.get<RespuestaApi<PaginacionResponse<Usuario>>>(this.api);
    }

    // Obtener Usuario por termino de busqueda
    getUsuarioBusqueda(termino:string):Observable<RespuestaApi<PaginacionResponse<Usuario>>>{
        return this.http.get<RespuestaApi<PaginacionResponse<Usuario>>>(`${this.api}?q=${termino}`)
    }

    // =========================
      // GET - POR ID
      getUsuarioPorId(id: string): Observable<RespuestaApi<Usuario>> {
        return this.http.get<RespuestaApi<Usuario>>(`${this.api}${id}/`);
      }
    
    // =========================
    // POST - CREAR
      crearUsuario(datos:UsuarioRequest):Observable<Usuario>{
        return this.http.post<Usuario>(this.api,datos)
      }
    
    // =========================
    // PUT - ACTALIZAR
    actualizarUsuario(id:string, datos:UsuarioRequest):Observable<Usuario>{
      return this.http.put<Usuario>(`{this.api}/${id}`,datos)
    }

     // =========================
      // PATCH - ACTUALIZAR PARCIALMENTE
    actualizarParcialUsuario(id: string,datos: Partial<UsuarioRequest>): Observable<Usuario> {
      return this.http.patch<Usuario>(`${this.api}${id}/`,datos);
    }
  
  // =========================
  // DELETE - ELIMINAR
  eliminarUsuario(id: string): Observable<void> {
    return this.http.delete<void>(`${this.api}${id}/`);
  }
}
