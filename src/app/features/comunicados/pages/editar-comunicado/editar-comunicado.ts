import { Component, inject, signal } from '@angular/core';
import { ComunicadosService } from '../../services/comunicados.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Sala } from '../../../salas/models/sala.interface';
import { Comunicado } from '../../models/comunicado.interface';
import { ComunicadoActualizarRequest, ComunicadoRequest } from '../../models/comunicado-request.interface';
import { ComunicadoEditarForm }from '../../components/comunicado-editar-form/comunicado-editar-form';
@Component({
  selector: 'app-editar-comunicado',
  imports: [ComunicadoEditarForm],
  templateUrl: './editar-comunicado.html',
  styleUrl: './editar-comunicado.scss',
})
export class EditarComunicado {
  // injectar ComunicadosService
  private readonly comunicadosService= inject(ComunicadosService)

  // inyectar ActivatedRoute
  private readonly route = inject(ActivatedRoute);

  // inyectar Router
  private readonly router = inject(Router);

  // obtener el id de la URL
  private readonly id = this.route.snapshot.paramMap.get('id');

 
  

  // Creamos un signal que inicialmente no contiene ninguna comunicado.
 readonly comunicado = signal<Comunicado | null>(null)


  constructor() {
    console.log('ID de la comunicado:', this.id);

    // verificar si existe el id
    if (!this.id) {

      console.error('No se encontró el ID de la comunicado');

      // volver al listado
      this.router.navigate(['/dashboard/comunicados']);

      return;
    }

    // obtener los datos de la comunicado
    this.obtenerComunicado(this.id);
  }


  // metodo obtenerComunicado
  obtenerComunicado(id: string): void {

    // llamamos al metodo getSalaPorId
    // usamos subscribe para recibir la respuesta HTTP GET
    this.comunicadosService.getComunicadoPorId(id).subscribe({

      // petición correcta
      next: (respuesta) => {

        console.log('Comunicado obtenido correctamente:', respuesta);

        // guardar los datos de la comunicado
        this.comunicado.set(respuesta.Data)
        console.log('Comunicado:', this.comunicado());
      },

      // si ocurre un error
      error: (error) => {

        console.error('Error al obtener la comunicado:', error);

        // volver al listado
        this.router.navigate(['/dashboard/comunicados']);
      },
    });
  }


  // Método que recibirá los datos del formulario.
  actualizarComunicado(datos: ComunicadoActualizarRequest): void {

    // Verificamos que exista el ID.
    if (!this.id) {
      return;
    }

    // Actualizamos la comunicado.
    this.comunicadosService.actualizarParcialComunicado(this.id, datos).subscribe({

      // Si la actualización fue correcta.
      next: () => {

        // Mostramos mensaje de éxito.
        console.log('Comunicado actualizado correctamente');

        // Volvemos al listado de comunicados.
        this.router.navigate(['/dashboard/comunicados']);
      },

      // Si ocurrió un error.
      error: (error) => {
        console.error('Error al actualizar la comunicado:', error);
      },
    });
  }

}
