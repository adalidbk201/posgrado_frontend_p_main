import { Component, inject } from '@angular/core';
import { AsistenciasService } from '../../services/asistencias.service';
import { Router } from '@angular/router';
import { AsistenciaRequest } from '../../models/asistencia-request.interfacace';
import { AsistenciaForm } from '../../components/asistencia-form/asistencia-form';
import { ToastService } from '../../../../core/services/toast.service';
@Component({
  selector: 'app-crear-asistencia',
  imports: [AsistenciaForm],
  templateUrl: './crear-asistencia.html',
  styleUrl: './crear-asistencia.scss',
})
export class CrearAsistencia {
  /** inyectar toas para notificaiones */
   private toast = inject(ToastService);
  
  // injectar asistenciasService
  private readonly asistenciasService = inject(AsistenciasService);

  // injectar router
  private readonly router = inject(Router);

  // metodo crearAsistencia
  crearAsistencia(evento: {
    datos: AsistenciaRequest;
    id_colacion: string;
  }): void {

    this.asistenciasService.crearAsistencia(
      evento.datos,
      evento.id_colacion
    ).subscribe({
      next: () => {
        console.log('Asistencia creada correctamente');
         //  1. MOSTRAR TOAST DE ÉXITO
          this.toast.exito('Asistencia creada correctamente.'+`${evento.datos.ci}`);
        // this.router.navigate(['/dashboard/asistencias']);
      },
      error: (err) => {
        console.error('Error al crear la asistencia:', err);
        // Extrae el mensaje del backend si existe, sino usa uno por defecto
            const msg = err?.error?.Errores.estado
                    || err?.error?.Message 
                    || err?.message 
                    || 'Error al crear la asistencia.';
            
            this.toast.error(msg);
      },
    });
  }
}
