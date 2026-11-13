import { Component, inject } from '@angular/core';
import { UsuariosService } from '../../services/usuarios.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ValidarRecuperarRequest } from '../../models/usuario.request.interface';
import { ValidarRecuperarForm } from '../../components/validar-recuperar-form/validar-recuperar-form';
@Component({
  selector: 'app-validar-recuperacion',
  imports: [ValidarRecuperarForm],
  templateUrl: './validar-recuperacion.html',
  styleUrl: './validar-recuperacion.scss',
})
export class ValidarRecuperacion {
    // injectar salasService
  private readonly usuariosService = inject(UsuariosService);
    // inyectar ActivatedRoute
  private readonly route = inject(ActivatedRoute);
 
  // injectar router
  private readonly router = inject(Router);
 
  
  // metodo validarRecuperacion
  validarRecuperacion(datos: ValidarRecuperarRequest): void {

    // llamamos al metodo validarRecuperacionCuenta: usamos .susbribe para recibir la resopuesta http Post
    this.usuariosService.validarRecuperacionCuenta(datos).subscribe({
      next: () => {
        console.log('Se Recupero la Cuenta');

        // Volver al listado
        this.router.navigate(['/dashboard/inicio']);
      },

      error: (error) => {
        console.error('Fallo al recuperar la cuenta:', error);
      },
    });
  }

}
