import { Component, inject } from '@angular/core';
 
import { Router } from '@angular/router';
import { ProgramasService } from '../../services/programas.service';
import { ProgramaRequest } from '../../models/programa-request.interface';
import { ProgramaForm } from '../../components/programa-form/programa-form';
import { ToastService } from '../../../../core/services/toast.service';
@Component({
  selector: 'app-crear-programa',
  imports: [ProgramaForm],
  templateUrl: './crear-programa.html',
  styleUrl: './crear-programa.scss',
})
export class CrearPrograma {
  /** inyectar toas para notificaiones */
   private toast = inject(ToastService);
  // injectar mencionesService
  private readonly programasService = inject(ProgramasService);

  // injectar router
  private readonly router = inject(Router);

  // metodo crearPrograma
      crearPrograma(datos: ProgramaRequest): void {
    
        // llamamos al metodo crearPrograma: usamos .susbribe para recibir la resopuesta http Post
        this.programasService.crearPrograma(datos).subscribe({
          next: () => {
            console.log('Programa creado correctamente');
            //  1. MOSTRAR TOAST DE ÉXITO
            this.toast.exito('Programa creado correctamente.');
    
            // Volver al listado
            this.router.navigate(['/dashboard/programas']);
          },
    
          error: (err) => {
            console.error('Error al crear el programa:', err);
            // Extrae el mensaje del backend si existe, sino usa uno por defecto
            const msg = err?.error.Message
                    || err?.error?.message 
                    || err?.message 
                    || 'Error al crear el programa.';
            
            this.toast.error(msg);
          },
        });
      }


}
