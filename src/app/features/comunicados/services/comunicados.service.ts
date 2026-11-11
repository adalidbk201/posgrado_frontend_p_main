import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment';
import { Observable } from 'rxjs';
import { RespuestaApi } from '../../../core/models/respuesta-api.interface';
import { PaginacionResponse } from '../../../core/models/paginacion-response.interface';
import { Comunicado, ComunicadoResponse } from '../models/comunicado.interface';
import { ComunicadoActualizarRequest, ComunicadoRequest } from '../models/comunicado-request.interface';

@Injectable({
    // se ejecute desde la raiz
    providedIn:'root'
})
export class ComunicadosService {
    // conecion con la api

    // inyectar HttpClient para hacer peticiones http
    private readonly http = inject(HttpClient);

    // api url
    private readonly apiUrl = `${environment.API}/comunicados/`;

    // metodo para obtener todas las personas
    getAllComunicados():Observable<RespuestaApi<PaginacionResponse<Comunicado>>> {
        return this.http.get<RespuestaApi<PaginacionResponse<Comunicado>>>(this.apiUrl);
    }

    // AHORA — con parámetros opcionales, no rompe otros lugares que ya lo llamen sin argumentos
    getComunicados(pagina = 1, limite = 100): Observable<RespuestaApi<PaginacionResponse<Comunicado>>> {
        return this.http.get<RespuestaApi<PaginacionResponse<Comunicado>>>(
        `${this.apiUrl}?pagina=${pagina}&limite=${limite}`
        );
    }

    //metodo para buscar comunicados por termino
    // AHORA
    getBuscarComunicados(termino: string): Observable<RespuestaApi<PaginacionResponse<Comunicado>>> {
        return this.http.get<RespuestaApi<PaginacionResponse<Comunicado>>>(`${this.apiUrl}?q=${encodeURIComponent(termino)}`);
    }

    // =========================
    // GET - POR ID
    getComunicadoPorId(id: string): Observable<RespuestaApi<Comunicado>> {
    return this.http.get<RespuestaApi<Comunicado>>(`${this.apiUrl}${id}/`);
    }

    // =========================
    // POST - CREAR
    crearComunicado(datos: ComunicadoRequest): Observable<RespuestaApi<ComunicadoResponse>> {
        const formData = new FormData();

        formData.append('foto', datos.foto);
        formData.append('fecha_expiracion', datos.fecha_expiracion);
        formData.append('descripcion', datos.descripcion);

        datos.colaciones.forEach((id) => {
            formData.append('colaciones', id);
        });

        return this.http.post<RespuestaApi<ComunicadoResponse>>(
            `${this.apiUrl}`,
            formData
        );
    }

    // =========================
    // PUT - ACTUALIZAR
    actualizarComunicado(id: string,datos: ComunicadoRequest): Observable<Comunicado> {
    return this.http.put<Comunicado>(`${this.apiUrl}${id}/`,datos);
    }

    // =========================
    // PATCH - ACTUALIZAR PARCIALMENTE
    actualizarParcialComunicado(
    id: string,
    datos: ComunicadoActualizarRequest
    ) {
    const formData = new FormData();

    // La fotografía es opcional al editar
    if (datos.foto) {
        formData.append('foto', datos.foto);
    }

    formData.append('fecha_expiracion', datos.fecha_expiracion);
    formData.append('descripcion', datos.descripcion);

    // Enviar cada colación por separado
    datos.colaciones.forEach(idColacion => {
        formData.append('colaciones', idColacion);
    });

    return this.http.patch<RespuestaApi<Comunicado>>(
        `${this.apiUrl}${id}/`,
        formData
    );
    }

    // =========================
    // DELETE - ELIMINAR
    eliminarComunicado(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}${id}/`);
    }

    // =========================
    // PATCH - ACTIVAR
    activarComunicado(id: string): Observable<void> {
        return this.http.patch<void>(`${this.apiUrl}${id}/activar/`, {});
    }

    // =========================
    // PATCH - DESACTIVAR
    desactivarComunicado(id: string): Observable<void> {
        return this.http.patch<void>(`${this.apiUrl}${id}/desactivar/`, {});
    }
}
