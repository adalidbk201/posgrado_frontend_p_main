import { Component, inject, signal } from '@angular/core';
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

  // Recibir mensaje de error
  readonly errorMensaje = signal<string | null>(null);


   // metodo crearPersona
    crearPersona(datos: PersonaRequest): void {
      this.errorMensaje.set(null);
      
      // llamamos al metodo crearPersona: usamos .susbribe para recibir la resopuesta http Post
      this.personasService.crearPersona(datos).subscribe({
        next: () => {
          console.log('Persona creada correctamente');
  
          // Volver al listado
          this.router.navigate(['/dashboard/personas']);
        },
  
        error: (error) => {
          console.error('Error al crear la persona:', error);

          // intenta usar el mensaje real del backend; si no viene, usa uno genérico
          const mensajeBackend = error?.error?.Message ?? error?.error?.message ?? error?.error?.detail;

          this.errorMensaje.set(
            mensajeBackend || 'Ya existe una persona registrada con ese número de documento, o algún dato no es válido.'
          );
        },
      });
    }

}
