import { Component, effect, inject, signal } from '@angular/core';
import { AuthApiService} from '../../services/auth-api.service';
import { HttpErrorResponse } from '@angular/common/http';
import { LoginResponse } from '../../models/login-response.interface';

import { RouterLink } from '@angular/router';

import { rxResource } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  imports: [ReactiveFormsModule, RouterLink],
  selector: 'app-login',
  styleUrl: './login.scss',
  templateUrl: './login.html',
})
export class Login {
  // consumir l api

  // injectar service
  private readonly authApiService= inject(AuthApiService)

  // inyectar  FormBuilder para crear formularios
  private readonly fb = inject(FormBuilder);

  // injectar router para redicciones
  private readonly router = inject(Router);

  // crar el formulario con 2 campos 
  readonly loginForm = this.fb.nonNullable.group({
    usuario: ['', [Validators.required]],
    contrasena: ['', [Validators.required]],
     recordarme: [
      false,
    ],
  });

  /** CREAR SEÑAL */
  readonly mostrarContrasena = signal(false);

  readonly cargando = signal(false);

  readonly mensajeError = signal('');


  readonly anioActual = new Date().getFullYear();
 /** ----------------------------------------- */

  // Metodo Alternar Contraseña 
  alternarContrasena(): void {

    this.mostrarContrasena.update(
      valor => !valor,
    );

  }
 

  // metodo ejecua cuando se envia el formulario
  realizarLogin(): void {

    // verificar si el formulario e invalido
    if (this.loginForm.invalid) {

        // marcar como touched para ver mensaje de validacion
        this.loginForm.markAllAsTouched();
        return;
    }
    
    // obtener los valores del formulario
    const datos = this.loginForm.getRawValue();

    // llamamos al servicio metodo login , enviamos los datos
    this.authApiService.login(datos)

      // suscribe nos permite recibir la respuesta
      .subscribe({

        //next se ejecuta cuando la peticion fue exitosa
        next: (respuesta) => {
          console.log('Login correcto');
          console.log('Respuesta del backend:', respuesta);

          // Extraemos el Access Token
          const token = respuesta.Data.access;

          // Guardamos el token
          localStorage.setItem('access_token', token);

          console.log('Token guardado correctamente:', token);

          // Redirigir al componente Cuenta
          this.router.navigate(['/dashboard']);
          
        },

        error: (error: HttpErrorResponse) => {
          console.error('Status:', error.status);
          console.error('Mensaje:', error.message);
          console.error('Respuesta del backend:', error.error);
        },
      });
  }


}
