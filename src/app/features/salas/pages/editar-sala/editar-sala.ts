import { Component, inject, signal } from '@angular/core';
import { SalaEditarForm } from '../../components/sala-editar-form/sala-editar-form';
import { SalasService } from '../../services/salas.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Sala } from '../../models/sala.interface';
import { SalaEditarRequest } from '../../models/sala-request.interface';
@Component({
  selector: 'app-editar-sala',
  imports: [SalaEditarForm],
  templateUrl: './editar-sala.html',
  styleUrl: './editar-sala.scss',
})
export class EditarSala {
  // injectar SalasService
  private readonly salasService= inject(SalasService)

  // inyectar ActivatedRoute
  private readonly route = inject(ActivatedRoute);

  // inyectar Router
  private readonly router = inject(Router);

  // obtener el id de la URL
  private readonly id = this.route.snapshot.paramMap.get('id');

  // obtener el nombre de la sala de la URL
   readonly nombre_sala = this.route.snapshot.paramMap.get('nombre_sala');
  

  // Creamos un signal que inicialmente no contiene ninguna sala.
 readonly sala = signal<Sala | null>(null)


  constructor() {
    console.log('ID de la sala:', this.id);
    console.log('Nombre de la sala:', this.nombre_sala);

    // verificar si existe el id
    if (!this.id) {

      console.error('No se encontró el ID de la sala');

      // volver al listado
      this.router.navigate(['/dashboard/salas']);

      return;
    }

    // obtener los datos de la sala
    this.obtenerSala(this.id);
  }


  // metodo obtenerSala
  obtenerSala(id: string): void {

    // llamamos al metodo getSalaPorId
    // usamos subscribe para recibir la respuesta HTTP GET
    this.salasService.getNivelesDeSala(id).subscribe({

      // petición correcta
      next: (respuesta) => {

        console.log('Sala obtenida correctamente:', respuesta);

        // guardar los datos de la sala
        this.sala.set(respuesta.Data)
        console.log('Sala:', this.sala());
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
  actualizarSala(datos: SalaEditarRequest): void {

    // Verificamos que exista el ID.
    if (!this.id) {
      return;
    }

    // Actualizamos la sala.
    this.salasService.actualizarParcialSala(this.id, datos).subscribe({

      // Si la actualización fue correcta.
      next: () => {

        // Mostramos mensaje de éxito.
        console.log('Sala actualizada correctamente');

        // Volvemos al listado de salas.
        this.router.navigate(['/dashboard/salas']);
      },

      // Si ocurrió un error.
      error: (error) => {
        console.error('Error al actualizar la sala:', error);
      },
    });
  }



}
