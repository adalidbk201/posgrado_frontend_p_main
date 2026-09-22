import { Component, inject, signal } from '@angular/core';
import { UsuariosService } from '../../services/usuarios.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuario } from '../../models/usuario.interface';
import { UsuarioRequest } from '../../models/usuario.request.interface';
import { UsuarioForm } from '../../components/usuario-form/usuario-form';
@Component({
  selector: 'app-editar-usuario',
  imports: [UsuarioForm],
  templateUrl: './editar-usuario.html',
  styleUrl: './editar-usuario.scss',
})
export class EditarUsuario {
  // injectar usuariosService
  private readonly usuariosService= inject(UsuariosService)

  // inyectar ActivatedRoute
  private readonly route = inject(ActivatedRoute);

  // inyectar Router
  private readonly router = inject(Router);

  // obtener el id de la URL
  private readonly id = this.route.snapshot.paramMap.get('id');

  // Creamos un signal que inicialmente no contiene ninguna sala.
  readonly usuario = signal<Usuario | null>(null)

 
  constructor() {

    // verificar si existe el id
    if (!this.id) {

      console.error('No se encontró el ID del usuario');

      // volver al listado
      this.router.navigate(['/dashboard/usuarios']);

      return;
    }

    // obtener los datos del usuario
    this.obtenerUsuario(this.id);
  }

    // metodo obtenerSala
  obtenerUsuario(id: string): void {

    // llamamos al metodo getUsuarioPorId
    // usamos subscribe para recibir la respuesta HTTP GET
    this.usuariosService.getUsuarioPorId(id).subscribe({

      // petición correcta
      next: (respuesta) => {

        console.log('Usuario obtenido correctamente:', respuesta);

        // guardar los datos del usuario
        this.usuario.set(respuesta.Data)
        console.log('Usuario:', this.usuario());
      },

      // si ocurre un error
      error: (error) => {

        console.error('Error al obtener la usuario:', error);

        // volver al listado
        this.router.navigate(['/dashboard/usuarios']);
      },
    });
  }


  // Método que recibirá los datos del formulario.
    actualizarUsuario(datos: UsuarioRequest): void {
  
      // Verificamos que exista el ID.
      if (!this.id) {
        return;
      }
  
      // Actualizamos el usuario.
      this.usuariosService.actualizarUsuario(this.id, datos).subscribe({
  
        // Si la actualización fue correcta.
        next: () => {
  
          // Mostramos mensaje de éxito.
          console.log('Usuario actualizado correctamente');
  
          // Volvemos al listado de usuarios.
          this.router.navigate(['/dashboard/usuarios']);
        },
  
        // Si ocurrió un error.
        error: (error) => {
          console.error('Error al actualizar el usuario:', error);
        },
      });
    }
  



}
