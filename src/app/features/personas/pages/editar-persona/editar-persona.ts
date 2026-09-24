import { Component, inject, signal } from '@angular/core';
import { PersonaForm } from '../../components/persona-form/persona-form';
import { PersonasService } from '../../services/personas.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Persona } from '../../models/persona.interface';
import { PersonaRequest } from '../../models/persona-request.interface';
@Component({
  selector: 'app-editar-persona',
  imports: [PersonaForm],
  templateUrl: './editar-persona.html',
  styleUrl: './editar-persona.scss',
})
export class EditarPersona {
  // injectar PersonasService
  private readonly personasService= inject(PersonasService);

  // inyectar ActivatedRoute
  private readonly route = inject(ActivatedRoute)

  // inyectar Router
  private readonly router = inject(Router);

  // obtener el id de la URL
  private readonly id = this.route.snapshot.paramMap.get('id');

  // Creamos un signal que inicialmente no contiene ninguna Persona.
 readonly persona = signal<Persona | null>(null)

 constructor() {

    // verificar si existe el id
    if (!this.id) {

      console.error('No se encontró el ID de la Persona');

      // volver al listado
      this.router.navigate(['/dashboard/personas']);

      return;
    }

    // obtener los datos de la persona
    this.obtenerPersona(this.id);
  }

  // metodo obtenerSala
  obtenerPersona(id: string): void {

    // llamamos al metodo getPersonaPorId
    // usamos subscribe para recibir la respuesta HTTP GET
    this.personasService.getPersonaPorId(id).subscribe({

      // petición correcta
      next: (respuesta) => {

        console.log('Persona obtenida correctamente:', respuesta);

        // guardar los datos de la persona
        this.persona.set(respuesta.Data)
        console.log('Persona:', this.persona());
      },

      // si ocurre un error
      error: (error) => {

        console.error('Error al obtener la persona:', error);

        // volver al listado
        this.router.navigate(['/dashboard/personas']);
      },
    });
  }

  // Método que recibirá los datos del formulario.
  actualizarPersona(datos: PersonaRequest): void {

    // Verificamos que exista el ID.
    if (!this.id) {
      return;
    }

    // Actualizamos la persona.
    this.personasService.actualizarParcialPersona(this.id, datos).subscribe({

      // Si la actualización fue correcta.
      next: () => {

        // Mostramos mensaje de éxito.
        console.log('Persona actualizada correctamente');

        // Volvemos al listado de salas.
        this.router.navigate(['/dashboard/personas']);
      },

      // Si ocurrió un error.
      error: (error) => {
        console.error('Error al actualizar la persona:', error);
      },
    });
  }



}
