import { Component, inject } from '@angular/core';
import { UsuariosService } from '../../services/usuarios.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RecuperarCuentaRequest } from '../../models/usuario.request.interface';
import { PerfilRecuperarCuentaForm } from '../../components/perfil-recuperar-cuenta-form/perfil-recuperar-cuenta-form';
import { ToastService } from '../../../../core/services/toast.service';
@Component({
  selector: 'app-recuperar-cuenta',
  imports: [PerfilRecuperarCuentaForm],
  templateUrl: './recuperarCuenta.html',
  styleUrl: './recuperarCuenta.scss',
})
export class RecuperarCuenta {
  /** inyectar toas para notificaiones */
   private toast = inject(ToastService);
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
        // notificaion toasd
        this.toast.exito('Si el correo está registrado, recibirás un código de recuperación.');
        // Volver al listado
        this.router.navigate(['/dashboard/inicio']);
      },

      error: (err) => {
        console.error('Error al enviar código de recuperación:', err);
         // Extrae el mensaje del backend si existe, sino usa uno por defecto
            const msg = err?.error?.Errores.estado
                    || err?.error?.message 
                    || err?.message 
                    || 'Error al enviar código de recuperación:';
            
            this.toast.error(msg);
      },
    });
  }
}
