import { Component, inject, signal } from '@angular/core';
import { ColacionesService } from '../../services/colaciones.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Colacion } from '../../models/colacion.interface';
import { ColacionRequest } from '../../models/colacion-request.interface';
import { ColacionForm } from '../../components/colacion-form/colacion-form';
@Component({
  selector: 'app-editar-colacion',
  imports: [ColacionForm],
  templateUrl: './editar-colacion.html',
  styleUrl: './editar-colacion.scss',
})
export class EditarColacion {
   // injectar ColacionesService
  private readonly colacionesService= inject(ColacionesService);

  // inyectar ActivatedRoute
  private readonly route = inject(ActivatedRoute)

  // inyectar Router
  private readonly router = inject(Router);

  // obtener el id de la URL
  private readonly id = this.route.snapshot.paramMap.get('id');

  // Creamos un signal que inicialmente no contiene ninguna Colacion.
 readonly colacion = signal<Colacion | null>(null)

 
 constructor() {

    // verificar si existe el id
    if (!this.id) {

      console.error('No se encontró el ID de la Colación');

      // volver al listado
      this.router.navigate(['/dashboard/colaciones']);

      return;
    }

    // obtener los datos de la colacion
    this.obtenerColacion(this.id);
  }

   // metodo obtenerColacion
  obtenerColacion(id: string): void {

    // llamamos al metodo getColacionPorId
    // usamos subscribe para recibir la respuesta HTTP GET
    this.colacionesService.getColacionPorId(id).subscribe({

      // petición correcta
      next: (respuesta) => {

        console.log('Colación obtenida correctamente:', respuesta);

        // guardar los datos de la colación
        this.colacion.set(respuesta.Data)
        console.log('Colación:', this.colacion());
      },

      // si ocurre un error
      error: (error) => {

        console.error('Error al obtener la colación:', error);

        // volver al listado
        this.router.navigate(['/dashboard/colaciones']);
      },
    });
  }

  // Método que recibirá los datos del formulario.
    actualizarColacion(datos: ColacionRequest): void {
  
      // Verificamos que exista el ID.
      if (!this.id) {
        return;
      }
  
      // Actualizamos la colacion.
      this.colacionesService.actualizarParcialColacion(this.id, datos).subscribe({
  
        // Si la actualización fue correcta.
        next: () => {
  
          // Mostramos mensaje de éxito.
          console.log('Colación actualizada correctamente');
  
          // Volvemos al listado de salas.
          this.router.navigate(['/dashboard/colaciones']);
        },
  
        // Si ocurrió un error.
        error: (error) => {
          console.error('Error al actualizar la colación:', error);
        },
      });
    }

}
