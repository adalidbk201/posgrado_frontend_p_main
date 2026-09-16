import { Component, inject, signal } from '@angular/core';
import { RolesService } from '../../services/roles.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Rol } from '../../models/rol.interface';
import { RolForm } from '../../components/rol-form/rol-form';
import { RolRequest } from '../../models/rol-request.interface';
@Component({
  selector: 'app-editar-rol',
  imports: [RolForm],
  templateUrl: './editar-rol.html',
  styleUrl: './editar-rol.scss',
})
export class EditarRol {
  // inyectar rolesService
  private readonly rolesService=inject(RolesService)

  // inyectar ActivatedRoute
  private readonly route = inject(ActivatedRoute);

  // inyectar Router
  private readonly router = inject(Router);

  // obtener el id de la URL
  private readonly id = this.route.snapshot.paramMap.get('id');

  // Creamos un signal que inicialmente no contiene ningun rol.
  readonly rol = signal<Rol | null>(null)

  
  constructor() {

    // verificar si existe el id
    if (!this.id) {

      console.error('No se encontró el ID del rol');

      // volver al listado
      this.router.navigate(['/dashboard/roles']);

      return;
    }

    // obtener los datos del rol
    this.obtenerRol(this.id);
  }


  // metodo obtenerSala
  obtenerRol(id: string): void {

    // llamamos al metodo getSalaPorId
    // usamos subscribe para recibir la respuesta HTTP GET
    this.rolesService.getRolPorId(id).subscribe({

      // petición correcta
      next: (respuesta) => {

        console.log('Rol obtenida correctamente:', respuesta);

        // guardar los datos de la rol
        this.rol.set(respuesta.Data)
        console.log('Rol:', this.rol());
      },

      // si ocurre un error
      error: (error) => {

        console.error('Error al obtener la sala:', error);

        // volver al listado
        this.router.navigate(['/dashboard/salas']);
      },
    });
  }


  // Método que recibirá los datos del formulario.
    actualizarRol(datos: RolRequest): void {
  
      // Verificamos que exista el ID.
      if (!this.id) {
        return;
      }
  
      // Actualizamos el rol.
      this.rolesService.actualizarParcialRol(this.id, datos).subscribe({
  
        // Si la actualización fue correcta.
        next: () => {
  
          // Mostramos mensaje de éxito.
          console.log('Rol actualizado correctamente');
  
          // Volvemos al listado de roles.
          this.router.navigate(['/dashboard/roles']);
        },
  
        // Si ocurrió un error.
        error: (error) => {
          console.error('Error al actualizar el rol:', error);
        },
      });
    }
  


}
