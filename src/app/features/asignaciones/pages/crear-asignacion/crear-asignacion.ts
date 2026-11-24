import { Component, inject } from '@angular/core';
import { AsignacionesService } from '../../services/asignaciones.service';
import { Router } from '@angular/router';
import { AsignacionRequest } from '../../models/asignacion-request.interface';
import { AsignacionForm } from '../../components/asignacion-form/asignacion-form';
import { ToastService } from '../../../../core/services/toast.service';
@Component({
  selector: 'app-crear-asignacion',
  imports: [AsignacionForm],
  templateUrl: './crear-asignacion.html',
  styleUrl: './crear-asignacion.scss',
})
export class CrearAsignacion {
   /** inyectar toas para notificaiones */
   private toast = inject(ToastService);
   // inyectar asignacionService
  private readonly asignacionesService= inject(AsignacionesService)

  // inyectar router
  private readonly router=inject(Router)

  // metodo crearAsignacion
    crearAsignacion(datos: AsignacionRequest): void {
  
      // llamamos al metodo crearAsignacion: usamos .susbribe para recibir la resopuesta http Post
      this.asignacionesService.crearAsignacion(datos).subscribe({
        next: () => {
          console.log('Asignacion creada correctamente');
            //  1. MOSTRAR TOAST DE ÉXITO
          this.toast.exito('Asignacion creada correctamente.');
  
          // Volver al listado
          this.router.navigate(['/dashboard/asignaciones']);
        },
  
        error: (err) => {
          console.error('Error al crear la asignacion:', err);
            console.error('Error al crear la asignación:', err);
            console.error('Estado HTTP:', err.status);
            console.error('Respuesta del backend:', err.error);

            // Extrae el mensaje del backend si existe, sino usa uno por defecto
            const msg = err?.error?.Errores.estado
                    || err?.error?.Message 
                    || err?.message 
                    || 'Error al crear la asignación.';
            
            this.toast.error(msg);
        },
        
      });
    }

}
