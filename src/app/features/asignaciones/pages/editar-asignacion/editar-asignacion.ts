import { Component, inject, signal } from '@angular/core';
import { AsignacionesService } from '../../services/asignaciones.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Asignacion } from '../../models/asignacion.interface';
import { AsignacionRequest } from '../../models/asignacion-request.interface';
import { AsignacionEditarForm } from '../../components/asignacion-editar-form/asignacion-editar-form';
@Component({
  selector: 'app-editar-asignacion',
  imports: [AsignacionEditarForm],
  templateUrl: './editar-asignacion.html',
  styleUrl: './editar-asignacion.scss',
})
export class EditarAsignacion {
  // injectar SalasService
  private readonly asignacionService= inject(AsignacionesService)

  // inyectar ActivatedRoute
  private readonly route = inject(ActivatedRoute);

  // inyectar Router
  private readonly router = inject(Router);

  // obtener el id de la URL
  private readonly id = this.route.snapshot.paramMap.get('id');

 
  

  // Creamos un signal que inicialmente no contiene ninguna asignacion.
 readonly asignacion = signal<Asignacion | null>(null)


  constructor() {
    console.log('ID de la asignacion:', this.id);
  

    // verificar si existe el id
    if (!this.id) {

      console.error('No se encontró el ID de la asignacion');

      // volver al listado
      this.router.navigate(['/dashboard/asignaciones']);

      return;
    }

    // obtener los datos de la asignacion
    this.obtenerAsignacion(this.id);
  }


  // metodo obtenerAsignacion
  obtenerAsignacion(id: string): void {

    // llamamos al metodo getAsignacionPorId
    // usamos subscribe para recibir la respuesta HTTP GET
    this.asignacionService.getAsignacionPorId(id).subscribe({

      // petición correcta
      next: (respuesta) => {

        console.log('Asignación obtenida correctamente:', respuesta);

        // guardar los datos de la asignacion
        this.asignacion.set(respuesta.Data)
        console.log('Asignacion:', this.asignacion());
      },

      // si ocurre un error
      error: (error) => {

        console.error('Error al obtener la asignacion:', error);

        // volver al listado
        this.router.navigate(['/dashboard/asignaciones']);
      },
    });
  }


  // Método que recibirá los datos del formulario.
  actualizarAsignacion(datos: AsignacionRequest): void {

    // Verificamos que exista el ID.
    if (!this.id) {
      return;
    }

    // Actualizamos la sala.
    this.asignacionService.actualizarParcialAsignacion(this.id, datos).subscribe({

      // Si la actualización fue correcta.
      next: () => {

        // Mostramos mensaje de éxito.
        console.log('Asignacion actualizada correctamente');

        // Volvemos al listado de salas.
        this.router.navigate(['/dashboard/asignaciones']);
      },

      // Si ocurrió un error.
      error: (error) => {
        console.error('Error al actualizar la asignacion:', error);
      },
    });
  }


}
