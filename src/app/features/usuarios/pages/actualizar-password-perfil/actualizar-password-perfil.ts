import { Component, inject, signal } from '@angular/core';
import { UsuariosService } from '../../services/usuarios.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuario } from '../../models/usuario.interface';
import { PasswordPerfil } from '../../models/usuario.request.interface';
import { PerfilEditarPasswordForm } from '../../components/perfil-editar-password-form/perfil-editar-password-form';
import { ToastService } from '../../../../core/services/toast.service';
@Component({
  selector: 'app-actualizar-password-perfil',
  imports: [PerfilEditarPasswordForm],
  templateUrl: './actualizar-password-perfil.html',
  styleUrl: './actualizar-password-perfil.scss',
})
export class ActualizarPasswordPerfil {
  /** inyectar toas para notificaiones */
   private toast = inject(ToastService);
   // injectar UsuariosService
  private readonly usuariosService= inject(UsuariosService)

  // inyectar ActivatedRoute
  private readonly route = inject(ActivatedRoute);

  // inyectar Router
  private readonly router = inject(Router);

  // Creamos un signal que inicialmente no contiene ninguna sala.
 readonly usuario = signal<Usuario | null>(null)


  constructor() {
  
  
  }

 


  // Método que recibirá los datos del formulario.
  actualizarPasswordPerfil(datos: PasswordPerfil): void {

     

    // Actualizamos la contraseña.
    this.usuariosService.actualizarParcialPasswordPerfil(datos).subscribe({

      // Si la actualización fue correcta.
      next: () => {

        // Mostramos mensaje de éxito.
        console.log('Contraseña actualizada correctamente');
        // notificaion toasd
        this.toast.exito('Contraseña actualizada correctamente.');

        // Volvemos al listado de salas.
        this.router.navigate(['/dashboard/inicio']);
      },

      // Si ocurrió un error.
      error: (err) => {
        console.error('Error al actualizar la contraseña:', err);
        // Extrae el mensaje del backend si existe, sino usa uno por defecto
            const msg = err?.error?.Errores.contrasena_actual
                    || err?.error?.message 
                    || err?.message 
                    || 'Error al reenviar Correo de activación:';
            
            this.toast.error(msg);
      },
    });
  }


}
