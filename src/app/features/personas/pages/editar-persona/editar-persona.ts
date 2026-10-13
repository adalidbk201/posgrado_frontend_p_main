import { Component, inject, signal } from '@angular/core';
import { PersonaForm } from '../../components/persona-form/persona-form';
import { PersonasService } from '../../services/personas.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Persona } from '../../models/persona.interface';
 
import { ActualizarPerfil, ActualizarPersona } from '../../models/persona-request.interface';
import { PersonaEditarForm } from '../../components/persona-editar-form/persona-editar-form';
@Component({
  selector: 'app-editar-persona',
  imports: [ PersonaEditarForm],
  templateUrl: './editar-persona.html',
  styleUrl: './editar-persona.scss',
})
export class EditarPersona {
  // injectar PersonaService
    private readonly personasService= inject(PersonasService)
  
    // inyectar ActivatedRoute
    private readonly route = inject(ActivatedRoute);
  
    // inyectar Router
    private readonly router = inject(Router);
  
    // obtener el id de la URL
    private readonly id = this.route.snapshot.paramMap.get('id');
  
    
    
  
    // Creamos un signal que inicialmente no contiene ninguna persona .
   readonly persona = signal<Persona | null>(null)
  
  
    constructor() {
      console.log('ID de la persona:', this.id);
       
  
      // verificar si existe el id
      if (!this.id) {
  
        console.error('No se encontró el ID de la persona');
  
        // volver al listado
        this.router.navigate(['/dashboard/personas']);
  
        return;
      }
  
      // obtener los datos de la persona
      this.obtenerPersona(this.id);
    }
  
  
    // metodo obtenerPersona
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
    actualizarDatosPersona(datos: ActualizarPersona): void {
  
      // Verificamos que exista el ID.
      if (!this.id) {
        return;
      }
  
      // Actualizamos la sala.
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
