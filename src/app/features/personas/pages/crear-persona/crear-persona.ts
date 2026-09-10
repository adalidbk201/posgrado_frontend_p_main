import { Component, inject } from '@angular/core';
import { PersonaForm } from '../../components/persona-form/persona-form';
import { PersonasService } from '../../services/personas.service';
import { Router } from '@angular/router';
import { PersonaRequest } from '../../models/persona-request.interface';
@Component({
  selector: 'app-crear-persona',
  imports: [PersonaForm],
  templateUrl: './crear-persona.html',
  styleUrl: './crear-persona.scss',
})
export class CrearPersona {
  // injectar personasService
  private readonly personasService = inject(PersonasService);

  // injectar router
  private readonly router = inject(Router);

   // metodo crearSala
    crearPersona(datos: PersonaRequest): void {
  
      // llamamos al metodo crearPersona: usamos .susbribe para recibir la resopuesta http Post
      this.personasService.crearPersona(datos).subscribe({
        next: () => {
          console.log('Persona creada correctamente');
  
          // Volver al listado
          this.router.navigate(['/dashboard/personas']);
        },
  
        error: (error) => {
          console.error('Error al crear la persona:', error);
        },
      });
    }

}
