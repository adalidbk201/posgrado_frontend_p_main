import { Component, inject } from '@angular/core';
import { UsuarioForm } from '../../components/usuario-form/usuario-form';
import { UsuariosService } from '../../services/usuarios.service';
import { Router } from '@angular/router';
import { UsuarioRequest } from '../../models/usuario.request.interface';
@Component({
  selector: 'app-crear-usuario',
  imports: [UsuarioForm],
  templateUrl: './crear-usuario.html',
  styleUrl: './crear-usuario.scss',
})
export class CrearUsuario {
  // inyectar usuariosService
  private readonly usuariosService=inject(UsuariosService)

  // inyectar router
  private readonly router=inject(Router)

  // metodo crearUsuario
  crearUsuario(datos:UsuarioRequest):void{
      // llamamos al metodo crearSala: usamos .susbribe para recibir la resopuesta http Post
    this.usuariosService.crearUsuario(datos).subscribe({
      next: () => {
        console.log('Usuario creado correctamente');

        // Volver al listado
        this.router.navigate(['/dashboard/usuarios']);
      },

      error: (error) => {
        console.error('Error al crear el usuario:', error);
      },
    });
  }


}
