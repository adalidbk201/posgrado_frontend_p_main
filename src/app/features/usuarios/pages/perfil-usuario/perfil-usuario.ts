import { Component, computed, inject, signal } from '@angular/core';
import { RolesService } from '../../../roles/services/roles.service';
import { Router } from '@angular/router';
import { PerfilPersonalResponse } from '../../models/usuario.interface';
import { UsuariosService } from '../../services/usuarios.service';

@Component({
  selector: 'app-perfil-usuario',
  imports: [],
  templateUrl: './perfil-usuario.html',
  styleUrl: './perfil-usuario.scss',
})
export class PerfilUsuario {
  //  listar todos los datos del Perfil Logueado
   // inyectar UsuariosService
  private readonly usuariosService = inject(UsuariosService);

  // inyectar Roter para navegacion entre paginas
  private readonly router = inject(Router);

  // =========================
  // Cargar y filtrar
  // =========================

  //  Cargar perfil 
  readonly perfil = signal<PerfilPersonalResponse | null>(null);

 


 
  // Cargar perfil del usuario autenticado
  obtenerDatosPerfil(): void {

    this.usuariosService.obtenerPerfil().subscribe({

      next: (respuesta) => {
          console.log(
            'Datos del perfil:',
            JSON.stringify(respuesta.Data, null, 2)
          );

          this.perfil.set(respuesta.Data);

      },

      error: (error) => {
        console.error('Error al obtener datos del perfil:', error);
      },

    });

  }
   

  

  


  constructor() {
    this.obtenerDatosPerfil()
  }

   
  


   

  // =========================
  // NAVEGACIÓN Y ELIMINACIÓN —  
  // =========================

  crearRol(): void {
    this.router.navigate(['/dashboard/roles/crear']);
  }

  editarRol(id: number): void {
    this.router.navigate(['/dashboard/roles/editar', id]);
  }


  /** Eliminar rol */
  // readonly rolEliminarId = signal<string | null>(null);

  // seleccionarRolEliminar(id: string): void {
  //   this.rolEliminarId.set(id);
  // }

  // confirmarEliminacion(): void {
  //   const id = this.rolEliminarId();
  //   if (!id) return;

  //   this.rolesService.eliminarRol(id).subscribe({
  //     next: () => {
  //       console.log('Rol eliminado correctamente');
  //       // recarga desde el inicio para reflejar el borrado
  //       this.roles.set([]);
  //       this.paginaActual.set(0);
  //       this.cargarRoles(1);
  //       this.rolEliminarId.set(null);
  //     },
  //     error: (error) => {
  //       console.error('Error al eliminar el rol:', error);
  //     },
  //   });
  // }

}
