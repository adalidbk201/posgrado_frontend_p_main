import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment';
import { Observable } from 'rxjs';
import { RespuestaApi } from '../../../core/models/respuesta-api.interface';
import { PaginacionResponse } from '../../../core/models/paginacion-response.interface';
import { PerfilPersonalResponse, PerfilResponse, Usuario } from '../models/usuario.interface';
import { FotoPerfilRequest, PasswordPerfil, RecuperarCuentaRequest, UsuarioRequest, ValidarRecuperarRequest } from '../models/usuario.request.interface';
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
    getAllUsuarios():Observable<RespuestaApi<PaginacionResponse<Usuario>>>{
        return this.http.get<RespuestaApi<PaginacionResponse<Usuario>>>(this.api);
    }

    // AHORA — con parámetros opcionales, no rompe otros lugares que ya lo llamen sin argumentos
    getUsuarios(pagina = 1, limite = 100): Observable<RespuestaApi<PaginacionResponse<Usuario>>> {
      return this.http.get<RespuestaApi<PaginacionResponse<Usuario>>>(
        `${this.api}?pagina=${pagina}&limite=${limite}`
      );
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
    // PUT - ACTUALIZAR
    actualizarUsuario(id:string, datos:UsuarioRequest):Observable<Usuario>{
      return this.http.put<Usuario>(`${this.api}${id}/`,datos)
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

  // url subir foto de perfil
    private api2=`${environment.API}/`;
  /** SUBIR IMAGEN DE LA CUENTA */
  subirFotoPerfil(datos: FotoPerfilRequest) {
    const formData = new FormData();
    formData.append('imagen', datos.foto);

    return this.http.post(
      `${this.api2}uploads/profile-photos/`,
      formData
    );
  }

  /** OBTENER DATOS DEL PERFIL */
  obtenerPerfil(): Observable<RespuestaApi<PerfilPersonalResponse>> {
    return this.http.get<RespuestaApi<PerfilPersonalResponse>>(
      `${this.api}perfil/`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        withCredentials: true,
      }
    );
  }

   // =========================
      // PATCH - ACTUALIZAR Contraseña
    actualizarParcialPasswordPerfil(datos: Partial<PasswordPerfil>): Observable<Usuario> {
      return this.http.patch<Usuario>(`${this.api}cuenta/contrasena/`,datos);
    }
  
    // =========================
    // POST - RECUPERAR CUENTA
      recuperarCuenta(datos:RecuperarCuentaRequest):Observable<Usuario>{
        return this.http.post<Usuario>(`${this.api}recuperar/`,datos)
      }
    // =========================
    // POST - VALIDAR RECPERACION
      validarRecuperacionCuenta(datos:ValidarRecuperarRequest):Observable<Usuario>{
        return this.http.post<Usuario>(`${this.api}validar/recuperar/`,datos)
      }

}
