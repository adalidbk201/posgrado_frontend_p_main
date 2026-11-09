import { Component, inject, signal } from '@angular/core';
import { AsistenciasService } from '../../services/asistencias.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Asistencia } from '../../models/asistencia.interface';
import { AsistenciaEditarRequest } from '../../models/asistencia-request.interfacace';
import { AsistenciaEditarForm } from '../../components/asistencia-editar-form/asistencia-editar-form';
@Component({
  selector: 'app-editar-asistencia',
  imports: [AsistenciaEditarForm],
  templateUrl: './editar-asistencia.html',
  styleUrl: './editar-asistencia.scss',
})
export class EditarAsistencia {
   // injectar AsistenciasService
  private readonly asistenciasService= inject(AsistenciasService)

  // inyectar ActivatedRoute
  private readonly route = inject(ActivatedRoute);

  // inyectar Router
  private readonly router = inject(Router);

  // obtener el id de la URL
  private readonly id = this.route.snapshot.paramMap.get('id');

  // obtener el nombre del titulado de la URL
   readonly nombre_titulado = this.route.snapshot.paramMap.get('nombre');
  

  // Creamos un signal que inicialmente no contiene ninguna asitencia.
  readonly asistencia = signal<Asistencia | null>(null)


  constructor() {
    console.log('ID de la asistencia:', this.id);
    console.log('Nombre del titulado:', this.nombre_titulado);

    // verificar si existe el id
    if (!this.id) {

      console.error('No se encontró el ID de la asistencia');

      // volver al listado
      this.router.navigate(['/dashboard/asistencias']);

      return;
    }

    // obtener los datos de la asistencia
    this.obtenerAsistencia(this.id);
  }


  // metodo obtenerAsistencia
  obtenerAsistencia(id: string): void {

    // llamamos al metodo getAsistenciaPorId
    // usamos subscribe para recibir la respuesta HTTP GET
    this.asistenciasService.getAsistenciaPorId(id).subscribe({

      // petición correcta
      next: (respuesta) => {

        console.log('Asistencia obtenida correctamente:', respuesta);

        // guardar los datos de la asistencia
        this.asistencia.set(respuesta.Data)
        console.log('Asistencia:', this.asistencia());
      },

      // si ocurre un error
      error: (error) => {

        console.error('Error al obtener la asistencia:', error);

        // volver al listado
        this.router.navigate(['/dashboard/asistencias']);
      },
    });
  }


  // Método que recibirá los datos del formulario.
  actualizarAsistencia(datos: AsistenciaEditarRequest): void {

    // Verificamos que exista el ID.
    if (!this.id) {
      return;
    }

    // Actualizamos la asistencia.
    this.asistenciasService.actualizarParcialAsistencia(this.id, datos).subscribe({

      // Si la actualización fue correcta.
      next: () => {

        // Mostramos mensaje de éxito.
        console.log('Asistencia actualizada correctamente');

        // Volvemos al listado de asistencias.
        this.router.navigate(['/dashboard/asistencias']);
      },

      // Si ocurrió un error.
      error: (error) => {
        console.error('Error al actualizar la asistencia:', error);
      },
    });
  }
}
