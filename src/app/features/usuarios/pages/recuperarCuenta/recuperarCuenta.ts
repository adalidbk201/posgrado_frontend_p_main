import { Component, inject } from '@angular/core';
import { UsuariosService } from '../../services/usuarios.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RecuperarCuentaRequest } from '../../models/usuario.request.interface';
import { PerfilRecuperarCuentaForm } from '../../components/perfil-recuperar-cuenta-form/perfil-recuperar-cuenta-form';
@Component({
  selector: 'app-recuperar-cuenta',
  imports: [PerfilRecuperarCuentaForm],
  templateUrl: './recuperarCuenta.html',
  styleUrl: './recuperarCuenta.scss',
})
export class RecuperarCuenta {
  
  // injectar salasService
  private readonly usuariosService = inject(UsuariosService);
    // inyectar ActivatedRoute
  private readonly route = inject(ActivatedRoute);
 
  // injectar router
  private readonly router = inject(Router);
  // obtener el email
  readonly correo_electronico = this.route.snapshot.paramMap.get('email');

  // metodo recuperarCuenta
  recuperarCuenta(datos: RecuperarCuentaRequest): void {

    // llamamos al metodo recuperarCuenta: usamos .susbribe para recibir la resopuesta http Post
    this.usuariosService.recuperarCuenta(datos).subscribe({
      next: () => {
        console.log('Si el correo está registrado, recibirás un código de recuperación');

        // Volver al listado
        this.router.navigate(['/dashboard/inicio']);
      },

      error: (error) => {
        console.error('Error al enviar código de recuperación:', error);
      },
    });
  }
}
