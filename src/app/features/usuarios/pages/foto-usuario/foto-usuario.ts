import { Component, inject } from '@angular/core';
import { UsuariosService } from '../../services/usuarios.service';
import { Router } from '@angular/router';
import { FotoPerfilRequest } from '../../models/usuario.request.interface';
import { UsuarioFormFoto } from '../../components/usuario-form-foto/usuario-form-foto';
import { ToastService } from '../../../../core/services/toast.service';
@Component({
  selector: 'app-foto-usuario',
  imports: [UsuarioFormFoto],
  templateUrl: './foto-usuario.html',
  styleUrl: './foto-usuario.scss',
})
export class FotoUsuario {
   /** inyectar toas para notificaiones */
   private toast = inject(ToastService);
  
  // injectar usuariosService
  private readonly usuariosService = inject(UsuariosService);

  // injectar router
  private readonly router = inject(Router);

 // Método para subir foto de perfil
  subirFotoPerfil(datos: FotoPerfilRequest): void {

    this.usuariosService.subirFotoPerfil(datos).subscribe({
      next: (respuesta) => {
        console.log('Foto de perfil subida correctamente', respuesta);
          //  1. MOSTRAR TOAST DE ÉXITO
          this.toast.exito('Foto de perfil subida correctamente.');

        this.router.navigate(['/dashboard/inicio']);
      },

      error: (err) => {
        console.error('Error al subir la foto de perfil:', err);
        // Extrae el mensaje del backend si existe, sino usa uno por defecto
            const msg = err?.error?.Errores.estado
                    || err?.error?.message 
                    || err?.message 
                    || 'Error al subir la foto de perfil.';
            
            this.toast.error(msg);
      },
    });
  }
}
