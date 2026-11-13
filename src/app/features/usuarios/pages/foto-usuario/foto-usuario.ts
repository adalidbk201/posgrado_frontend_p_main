import { Component, inject } from '@angular/core';
import { UsuariosService } from '../../services/usuarios.service';
import { Router } from '@angular/router';
import { FotoPerfilRequest } from '../../models/usuario.request.interface';
import { UsuarioFormFoto } from '../../components/usuario-form-foto/usuario-form-foto';
@Component({
  selector: 'app-foto-usuario',
  imports: [UsuarioFormFoto],
  templateUrl: './foto-usuario.html',
  styleUrl: './foto-usuario.scss',
})
export class FotoUsuario {
  
  // injectar usuariosService
  private readonly usuariosService = inject(UsuariosService);

  // injectar router
  private readonly router = inject(Router);

 // Método para subir foto de perfil
  subirFotoPerfil(datos: FotoPerfilRequest): void {

    this.usuariosService.subirFotoPerfil(datos).subscribe({
      next: (respuesta) => {
        console.log('Foto de perfil subida correctamente', respuesta);

        this.router.navigate(['/dashboard/inicio']);
      },

      error: (error) => {
        console.error('Error al subir la foto de perfil:', error);
      },
    });
  }
}
