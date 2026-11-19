import { Component, inject, signal } from '@angular/core';
import { PersonaForm } from '../../components/persona-form/persona-form';
import { PersonasService } from '../../services/personas.service';
import { Router } from '@angular/router';
import { PersonaRequest } from '../../models/persona-request.interface';
import { ToastService } from '../../../../core/services/toast.service';
@Component({
  selector: 'app-crear-persona',
  imports: [PersonaForm],
  templateUrl: './crear-persona.html',
  styleUrl: './crear-persona.scss',
})
export class CrearPersona {
   /** inyectar toas para notificaiones */
   private toast = inject(ToastService);
  // injectar personasService
  private readonly personasService = inject(PersonasService);

  // injectar router
  private readonly router = inject(Router);

  // Recibir mensaje de error
  readonly errorMensaje = signal<string | null>(null);


   // metodo crearPersona
    crearPersona(datos: Partial<PersonaRequest>): void {
      this.errorMensaje.set(null);
      
      // en creación, el formulario garantiza que viene completo —
      // si tu servicio exige PersonaRequest estricto, castea aquí:
      // llamamos al metodo crearPersona: usamos .susbribe para recibir la resopuesta http Post
      this.personasService.crearPersona(datos as PersonaRequest).subscribe({
        next: () => {
          console.log('Persona creada correctamente');
            //  1. MOSTRAR TOAST DE ÉXITO
          this.toast.exito('Persona creada correctamente.');
  
          // Volver al listado
          this.router.navigate(['/dashboard/personas']);
        },
  
        error: (err) => {
          console.error('Error al crear la persona:', err);
          // Extrae el mensaje del backend si existe, sino usa uno por defecto
            const msg = err?.error?.Errores.error
                    || err?.error?.message 
                    || err?.message 
                    || 'Error al crear la persona.';
            
            this.toast.error(msg);

          // intenta usar el mensaje real del backend; si no viene, usa uno genérico
          const mensajeBackend = err?.error?.Message ?? err?.error?.message ?? err?.error?.detail;

          this.errorMensaje.set(
            mensajeBackend || 'Ya existe una persona registrada con ese número de documento, o algún dato no es válido.'
          );
        },
      });
    }

}
