import { Component, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthApiService } from '../../services/auth-api.service';

@Component({
  imports: [
    ReactiveFormsModule,
    RouterLink,
  ],
  selector: 'app-login',
  styleUrl: './login.scss',
  templateUrl: './login.html',
})
export class Login {

  // Servicio para consumir la API de autenticación
  private readonly authApiService = inject(AuthApiService);

  // FormBuilder para crear el formulario
  private readonly fb = inject(FormBuilder);

  // Router para realizar redirecciones
  private readonly router = inject(Router);

  // Formulario de login
  readonly loginForm = this.fb.nonNullable.group({
    usuario: ['', [Validators.required]],
    contrasena: ['', [Validators.required]],
    recordarme: [false],
  });

  // Mostrar u ocultar contraseña
  readonly mostrarContrasena = signal(false);

  // Indica si el login está procesándose
  readonly cargando = signal(false);

  // Mensaje de error
  readonly mensajeError = signal('');

  // Año actual
  readonly anioActual = new Date().getFullYear();

  /**
   * Alterna la visibilidad de la contraseña.
   */
  alternarContrasena(): void {
    this.mostrarContrasena.update(
      (valor) => !valor,
    );
  }

  /**
   * Ejecuta el login.
   */
  realizarLogin(): void {

    // Limpiamos mensajes anteriores
    this.mensajeError.set('');

    // Verificamos si el formulario es inválido
    if (this.loginForm.invalid) {

      this.loginForm.markAllAsTouched();

      return;
    }

    // Evitamos enviar múltiples solicitudes
    if (this.cargando()) {
      return;
    }

    // Obtenemos los valores del formulario
    const datos = this.loginForm.getRawValue();

    // Activamos indicador de carga
    this.cargando.set(true);

    // Realizamos el login
    this.authApiService.login(datos).subscribe({

      next: (respuesta) => {

        console.log('Login correcto');
        console.log(
          'Respuesta del backend:',
          respuesta,
        );

        // Extraemos el access token
        const token = respuesta.Data.access;

        // Guardamos el access token
        localStorage.setItem(
          'access_token',
          token,
        );

        console.log(
          'Token guardado correctamente:',
          token,
        );

        /*
         * Después del login solicitamos a Django
         * que genere la cookie CSRF.
         *
         * Django ejecuta:
         *
         * get_token(request)
         *
         * y crea la cookie:
         *
         * csrftoken
         */
        this.authApiService.obtenerCsrfToken().subscribe({

          next: () => {

            console.log(
              '✅ Token CSRF generado correctamente',
            );

            /*
             * Ya tenemos:
             *
             * access_token
             * refresh_token (HttpOnly)
             * csrftoken
             *
             * Ahora podemos entrar al dashboard.
             */
            this.cargando.set(false);

            this.router.navigate([
              '/dashboard',
            ]);
          },

          error: (error: HttpErrorResponse) => {

            console.error(
              '❌ Error al generar CSRF',
              error,
            );

            /*
             * Si no podemos preparar el CSRF,
             * eliminamos el access token porque
             * la sesión no quedó correctamente preparada.
             */
            localStorage.removeItem(
              'access_token',
            );

            this.cargando.set(false);

            this.mensajeError.set(
              'No se pudo establecer correctamente la sesión.',
            );
          },
        });
      },

      error: (error: HttpErrorResponse) => {

        console.error(
          '❌ Error en login',
        );

        console.error(
          'Status:',
          error.status,
        );

        console.error(
          'Mensaje:',
          error.message,
        );

        console.error(
          'Respuesta del backend:',
          error.error,
        );

        this.cargando.set(false);

        this.mensajeError.set(
          error.error?.Message ??
          'Usuario o contraseña incorrectos.',
        );
      },
    });
  }
}