import { Component, inject, signal } from '@angular/core';
import { MencionesService } from '../../services/menciones.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Mencion } from '../../models/mencion.interface';
import { MencionRequest } from '../../models/mencion-request.interface';
import { MencionForm } from '../../components/mencion-form/mencion-form';
@Component({
  selector: 'app-editar-mencion',
  imports: [MencionForm],
  templateUrl: './editar-mencion.html',
  styleUrl: './editar-mencion.scss',
})
export class EditarMencion {
  // injectar MencionesService
  private readonly mencionesService= inject(MencionesService);

  // inyectar ActivatedRoute
  private readonly route = inject(ActivatedRoute)

  // inyectar Router
  private readonly router = inject(Router);

  // obtener el id de la URL
  private readonly id = Number(this.route.snapshot.paramMap.get('id'));

  // Creamos un signal que inicialmente no contiene ninguna Mencion.
 readonly mencion = signal<Mencion | null>(null)

  constructor() {

    // verificar si existe el id
    if (!this.id) {

      console.error('No se encontró el ID de la Mención');

      // volver al listado
      this.router.navigate(['/dashboard/menciones']);

      return;
    }

    // obtener los datos de la mencion
    this.obtenerMencion(this.id);
  }

  // metodo obtenerSala
  obtenerMencion(id: number): void {

    // llamamos al metodo getPersonaPorId
    // usamos subscribe para recibir la respuesta HTTP GET
    this.mencionesService.getMencionPorId(id).subscribe({

      // petición correcta
      next: (respuesta) => {

        console.log('Mención obtenida correctamente:', respuesta);

        // guardar los datos de la mencion
        this.mencion.set(respuesta.Data)
        console.log('Mención:', this.mencion());
      },

      // si ocurre un error
      error: (error) => {

        console.error('Error al obtener la mención:', error);

        // volver al listado
        this.router.navigate(['/dashboard/menciones']);
      },
    });
  }

  // Método que recibirá los datos del formulario.
  actualizarMencion(datos: MencionRequest): void {

    // Verificamos que exista el ID.
    if (!this.id) {
      return;
    }

    // Actualizamos la mencion.
    this.mencionesService.actualizarParcialMencion(this.id, datos).subscribe({

      // Si la actualización fue correcta.
      next: () => {

        // Mostramos mensaje de éxito.
        console.log('Mención actualizada correctamente');

        // Volvemos al listado de menciones.
        this.router.navigate(['/dashboard/menciones']);
      },

      // Si ocurrió un error.
      error: (error) => {
        console.error('Error al actualizar la mención:', error);
      },
    });
  }



}
