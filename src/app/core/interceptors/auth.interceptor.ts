import {
  HttpErrorResponse,
  HttpInterceptorFn,
} from '@angular/common/http';

import { inject } from '@angular/core';

import {
  BehaviorSubject,
  catchError,
  filter,
  finalize,
  switchMap,
  take,
  throwError,
} from 'rxjs';

import { AuthApiService } from '../../features/auth/services/auth-api.service';
import { AuthService } from '../services/auth.service';

/*
 * Indica si actualmente se está realizando
 * una renovación del access token.
 */
let refreshEnProceso = false;

/*
 * Permite que las peticiones que recibieron 401
 * esperen al nuevo access token.
 */
const nuevoToken$ = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const authService = inject(AuthService);
  const authApiService = inject(AuthApiService);

  /*
   * Rutas que no necesitan Authorization.
   */
  const rutasPublicas = [
    '/api/login/',
    '/api/refresh/',
    '/api/csrf/',
  ];

  const esPublica = rutasPublicas.some((ruta) =>
    req.url.includes(ruta),
  );

  /*
   * Obtenemos el access token actual.
   */
  const token = authService.getToken();

  console.log('========== AUTH INTERCEPTOR ==========');
  console.log('URL:', req.url);
  console.log('Token existe:', !!token);
  console.log('Es ruta pública:', esPublica);

  /*
   * Login, refresh y CSRF:
   *
   * No llevan Authorization.
   *
   * withCredentials permite enviar las cookies
   * que administra el navegador.
   */
  if (esPublica) {

    console.log('➡️ Petición pública');

    return next(
      req.clone({
        withCredentials: true,
      }),
    );
  }

  /*
   * Si no existe access token,
   * dejamos continuar la petición.
   */
  if (!token) {

    console.log('➡️ No existe access token');

    return next(
      req.clone({
        withCredentials: true,
      }),
    );
  }

  /*
   * Agregamos el access token
   * a la petición.
   */
  const reqConToken = req.clone({
    withCredentials: true,

    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  console.log(
    'Authorization:',
    reqConToken.headers.get('Authorization'),
  );

  /*
   * Ejecutamos la petición.
   */
  return next(reqConToken).pipe(

    catchError((error: HttpErrorResponse) => {

      /*
       * Si el error NO es 401,
       * simplemente lo devolvemos.
       */
      if (error.status !== 401) {

        console.log(
          '❌ Error HTTP:',
          error.status,
        );

        return throwError(() => error);
      }

      console.log(
        '⚠️ Access token vencido o inválido',
      );

      /*
       * ------------------------------------------------
       * YA EXISTE UN REFRESH EN PROCESO
       * ------------------------------------------------
       *
       * Otra petición ya está renovando el token.
       *
       * No hacemos otro refresh.
       *
       * Esperamos el nuevo token.
       */
      if (refreshEnProceso) {

        console.log(
          '⏳ Esperando renovación del token...',
        );

        return nuevoToken$.pipe(

          /*
           * Esperamos hasta recibir
           * un nuevo access token.
           */
          filter(
            (nuevoToken): nuevoToken is string =>
              nuevoToken !== null,
          ),

          /*
           * Solo necesitamos el primer
           * nuevo token.
           */
          take(1),

          /*
           * Repetimos la petición original
           * utilizando el nuevo token.
           */
          switchMap((nuevoToken) => {

            console.log(
              '🔄 Reintentando petición con nuevo token',
            );

            const nuevaPeticion = req.clone({
              withCredentials: true,

              setHeaders: {
                Authorization: `Bearer ${nuevoToken}`,
              },
            });

            return next(nuevaPeticion);
          }),
        );
      }

      /*
       * ------------------------------------------------
       * PRIMERA PETICIÓN QUE DETECTA EL 401
       * ------------------------------------------------
       */

      console.log(
        '🔄 Iniciando renovación del access token...',
      );

      refreshEnProceso = true;

      /*
       * Limpiamos el valor anterior.
       *
       * Las demás peticiones esperarán
       * hasta que llegue el nuevo token.
       */
      nuevoToken$.next(null);

      /*
       * Solicitamos un nuevo access token.
       *
       * Django utilizará automáticamente
       * la cookie HttpOnly refresh_token.
       */
      return authApiService.refreshToken().pipe(

        /*
         * Cuando Django devuelve el nuevo token.
         */
        switchMap((respuesta) => {

          const nuevoToken = respuesta.Data.access;

          console.log(
            '✅ Access token renovado correctamente',
          );

          /*
           * Guardamos el nuevo access token.
           */
          authService.guardarToken(nuevoToken);

          /*
           * Avisamos a las demás peticiones
           * que estaban esperando.
           */
          nuevoToken$.next(nuevoToken);

          /*
           * Repetimos la petición que originalmente
           * recibió el error 401.
           */
          const nuevaPeticion = req.clone({
            withCredentials: true,

            setHeaders: {
              Authorization: `Bearer ${nuevoToken}`,
            },
          });

          console.log(
            '🔄 Reintentando petición original...',
          );

          return next(nuevaPeticion);
        }),

        /*
         * Si el refresh falla.
         */
        catchError((refreshError) => {

          console.error(
            '❌ No se pudo renovar el access token',
            refreshError,
          );

          /*
           * Eliminamos el access token.
           */
          authService.limpiarToken();

          /*
           * Liberamos las peticiones que
           * estaban esperando.
           */
          nuevoToken$.next(null);

          /*
           * Devolvemos el error.
           */
          return throwError(() => refreshError);
        }),

        /*
         * MUY IMPORTANTE:
         *
         * Siempre liberamos el estado.
         *
         * Si no hacemos esto, después del primer
         * refresh las siguientes peticiones podrían
         * quedarse esperando indefinidamente.
         */
        finalize(() => {

          console.log(
            '🔓 Finalizó proceso de refresh',
          );

          refreshEnProceso = false;
        }),
      );
    }),
  );

  
    
};