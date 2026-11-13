import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RolesService } from '../../../roles/services/roles.service';
import { Router } from '@angular/router';
import { PerfilPersonalResponse, PerfilResponse } from '../../models/usuario.interface';
import { UsuariosService } from '../../services/usuarios.service';
import { environment } from '../../../../../environment/environment';

@Component({
  selector: 'app-perfil-usuario',
  imports: [],
  templateUrl: './perfil-usuario.html',
  styleUrl: './perfil-usuario.scss',
})
export class PerfilUsuario implements OnInit{
  ngOnInit(): void {
    this.cargarPerfil();
  }
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

  actualizarPassword(): void {
    this.router.navigate(['/dashboard/usuarios/actualizarPassword']);
  }

  recuperarCuenta(email: string): void {
    this.router.navigate(['/dashboard/usuarios/recuperarCuenta',email]);
  }

  validarRecuperacion(): void {
    this.router.navigate(['/dashboard/usuarios/validarRecuperacion']);
  }

  // subir foto de perfil
    subirFoto(): void {
      this.router.navigate(['/dashboard/usuarios/foto-usuario']);
    }

    /** Subir Foto */
     /** DATOS DEL PERFIL QUE INICIO SESSION */
    private readonly UsuariosService = inject(UsuariosService);
  
    readonly perfilFoto = signal<PerfilResponse | null>(null);
  
   readonly fotoPerfilUrl = computed(() => {
    const filename = this.perfilFoto()?.url_foto;
  
    const url = filename
      ? `${environment.API}/uploads/profile-photos/${filename}`
      : 'img/user.png';
  
    console.log('URL de fotografía:', url);
  
    return url;
  });
  
    /** CARGAR PERFIL */
    cargarPerfil(): void {
      this.UsuariosService.obtenerPerfil().subscribe({
        next: (respuesta) => {
          console.log('Respuesta completa del perfil:', respuesta);
          console.log('Datos del perfil:', respuesta.Data);
  
          this.perfilFoto.set(respuesta.Data);
        },
        error: (error) => {
          console.error('Error al obtener el perfil:', error);
        },
      });
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
