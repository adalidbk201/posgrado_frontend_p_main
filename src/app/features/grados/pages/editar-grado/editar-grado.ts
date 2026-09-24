import { Component, inject, signal } from '@angular/core';
import { GradosService } from '../../services/grados.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Grado } from '../../models/grado.interface';
import { GradoRequest } from '../../models/grado-request.interface';
import { GradoForm } from '../../components/grado-form/grado-form';
@Component({
  selector: 'app-editar-grado',
  imports: [GradoForm],
  templateUrl: './editar-grado.html',
  styleUrl: './editar-grado.scss',
})
export class EditarGrado {
  // inyectar gradosService
  private readonly gradosService= inject(GradosService)

  // inyectar ActivatedRoute
  private readonly route = inject(ActivatedRoute);

  // inyectar Router
  private readonly router = inject(Router);

   // obtener el id de la URL
  private readonly id = Number(this.route.snapshot.paramMap.get('id'));

   // Creamos un signal que inicialmente no contiene ninguna sala.
 readonly grado = signal<Grado | null>(null)

 constructor() {

    // verificar si existe el id
    if (!this.id) {

      console.error('No se encontró el ID del grado');

      // volver al listado
      this.router.navigate(['/dashboard/grados']);

      return;
    }

    // obtener los datos del grado
    this.obtenerGrado(this.id);
  }



  // metodo obtenerSala
  obtenerGrado(id: number): void {

    // llamamos al metodo getGradoPorId
    // usamos subscribe para recibir la respuesta HTTP GET
    this.gradosService.getGradoPorId(id).subscribe({

      // petición correcta
      next: (respuesta) => {

        console.log('Grado obtenido correctamente:', respuesta);

        // guardar los datos del grado
        this.grado.set(respuesta.Data)
        console.log('Grado:', this.grado());
      },

      // si ocurre un error
      error: (error) => {

        console.error('Error al obtener el grado:', error);

        // volver al listado
        this.router.navigate(['/dashboard/grados']);
      },
    });
  }


  // Método que recibirá los datos del formulario.
    actualizarGrado(datos: GradoRequest): void {
  
      // Verificamos que exista el ID.
      if (!this.id) {
        return;
      }
  
      // Actualizamos la sala.
      this.gradosService.actualizarParcialGrado(this.id, datos).subscribe({
  
        // Si la actualización fue correcta.
        next: () => {
  
          // Mostramos mensaje de éxito.
          console.log('Grado actualizado correctamente');
  
          // Volvemos al listado de grados.
          this.router.navigate(['/dashboard/grados']);
        },
  
        // Si ocurrió un error.
        error: (error) => {
          console.error('Error al actualizar el grado:', error);
        },
      });
    }
  

}
