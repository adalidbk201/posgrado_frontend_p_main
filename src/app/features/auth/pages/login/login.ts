import { Component, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthApiService } from '../../services/auth-api.service';
import { AuthService } from '../../../../core/services/auth.service';
import { UsuariosService } from '../../../usuarios/services/usuarios.service';
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

  private readonly authService = inject(AuthService);

  private readonly usuariosService = inject(UsuariosService);

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
        console.log('Respuesta del backend:', respuesta);

        // 1. Guardar access token
        const token = respuesta.Data.access;

        this.authService.guardarToken(token);

        // 2. Generar cookie CSRF
        this.authApiService.obtenerCsrfToken().subscribe({

            next: () => {

                console.log('Token CSRF generado correctamente');

                // 3. Obtener datos del perfil
                this.usuariosService.obtenerPerfil().subscribe({

                    next: (respuestaPerfil) => {

                        console.log('Datos del perfil:', respuestaPerfil);

                        // 4. Obtener roles del usuario
                        const roles = respuestaPerfil.Data.roles.map(
                            rol => rol.rol
                        );

                        console.log('Roles del usuario:', roles);

                        // 5. Verificar que tenga un rol reconocido
                        const rolValido = roles.some(
                            rol => ['ADMINISTRADOR', 'ESTUDIANTE'].includes(rol)
                        );

                        if (!rolValido) {

                            this.authService.limpiarToken();

                            this.cargando.set(false);

                            this.mensajeError.set(
                                'El usuario no tiene un rol autorizado para ingresar.'
                            );

                            return;
                        }

                        // 6. Guardar roles en AuthService
                        this.authService.guardarRoles(roles);

                        // 7. Finalizar carga
                        this.cargando.set(false);

                        // 8. Redirigir al perfil
                        this.router.navigate([
                            '/dashboard/perfil'
                        ]);
                    },

                    error: (error: HttpErrorResponse) => {

                        console.error(
                            'Error al obtener el perfil:',
                            error
                        );

                        this.authService.limpiarToken();

                        this.cargando.set(false);

                        this.mensajeError.set(
                            'No se pudieron obtener los datos del perfil.'
                        );
                    }
                });
            },

            error: (error: HttpErrorResponse) => {

                console.error('Error al generar CSRF:', error);

                this.authService.limpiarToken();

                this.cargando.set(false);

                this.mensajeError.set(
                    'No se pudo establecer correctamente la sesión.'
                );
            }
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