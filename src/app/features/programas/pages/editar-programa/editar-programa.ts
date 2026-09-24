import { Component, inject, signal } from '@angular/core';
import { ProgramasService } from '../../services/programas.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Programa } from '../../models/programa.interface';
import { ProgramaRequest } from '../../models/programa-request.interface';
import { ProgramaForm } from '../../components/programa-form/programa-form';
@Component({
  selector: 'app-editar-programa',
  imports: [ProgramaForm],
  templateUrl: './editar-programa.html',
  styleUrl: './editar-programa.scss',
})
export class EditarPrograma {
  // injectar ProgramasService
  private readonly programasService= inject(ProgramasService);

  // inyectar ActivatedRoute
  private readonly route = inject(ActivatedRoute)

  // inyectar Router
  private readonly router = inject(Router);

  // obtener el id de la URL
  private readonly id = this.route.snapshot.paramMap.get('id');

  // Creamos un signal que inicialmente no contiene ningun Programa.
 readonly programa = signal<Programa | null>(null)

 constructor() {

    // verificar si existe el id
    if (!this.id) {

      console.error('No se encontró el ID del Programa');

      // volver al listado
      this.router.navigate(['/dashboard/programas']);

      return;
    }

    // obtener los datos del programa
    this.obtenerPrograma(this.id);
  }

  // metodo obtenerPrograma
  obtenerPrograma(id: string): void {

    // llamamos al metodo getProgramaPorId
    // usamos subscribe para recibir la respuesta HTTP GET
    this.programasService.getProgramaPorId(id).subscribe({

      // petición correcta
      next: (respuesta) => {

        console.log('Programa obtenido correctamente:', respuesta);

        // guardar los datos del programa
        this.programa.set(respuesta.Data)
        console.log('Programa:', this.programa());
      },

      // si ocurre un error
      error: (error) => {

        console.error('Error al obtener el programa:', error);

        // volver al listado
        this.router.navigate(['/dashboard/programas']);
      },
    });
  }


  // Método que recibirá los datos del formulario.
    actualizarPrograma(datos: ProgramaRequest): void {
  
      // Verificamos que exista el ID.
      if (!this.id) {
        return;
      }
  
      // Actualizamos el programa.
      this.programasService.actualizarParcialPrograma(this.id, datos).subscribe({
  
        // Si la actualización fue correcta.
        next: () => {
  
          // Mostramos mensaje de éxito.
          console.log('Programa actualizado correctamente');
  
          // Volvemos al listado de programas.
          this.router.navigate(['/dashboard/programas']);
        },
  
        // Si ocurrió un error.
        error: (error) => {
          console.error('Error al actualizar el programa:', error);
        },
      });
    }
  


}
