import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { ButacasService } from '../../services/butacas.service';
import { ButacaForm } from '../../components/butaca-form/butaca-form';
import { CrearButacaRequest } from '../../models/butaca-request.interface';
import { ToastService } from '../../../../core/services/toast.service';
@Component({
  selector: 'app-crear-butaca',
  imports: [ButacaForm],
  templateUrl: './crear-butaca.html',
  styleUrl: './crear-butaca.scss',
})
export class CrearButaca {
   /** inyectar toas para notificaiones */
   private toast = inject(ToastService);

  private readonly butacasService = inject(ButacasService);
  private readonly router = inject(Router);

  // Crear una butaca
  crearButaca(evento: CrearButacaRequest): void {

    // Enviar el id_nivel y los datos por separado
    this.butacasService.crearButaca(
      evento.id_nivel,
      evento.datos
    ).subscribe({
      next: () => {
        console.log('Butaca creada correctamente');
         //  1. MOSTRAR TOAST DE ÉXITO
          this.toast.exito('Butaca creada correctamente.');

        // Volver al listado
        this.router.navigate(['/dashboard/butacas']);
      },

     error: (err) => {
        console.error('Error al crear la butaca:', err);

        // Extrae el mensaje del backend si existe, sino usa uno por defecto
            const msg = err?.error?.Errores.Message
                    || err?.error?.Message 
                    || err?.message 
                    || 'Error al crear la butaca.';
            
            this.toast.error(msg);
      }
    });
  }
}