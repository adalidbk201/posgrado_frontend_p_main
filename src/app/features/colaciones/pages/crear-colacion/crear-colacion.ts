import { Component, inject } from '@angular/core';
import { ColacionesService } from '../../services/colaciones.service';
import { Router } from '@angular/router';
import { ColacionRequest } from '../../models/colacion-request.interface';
import { ColacionForm } from '../../components/colacion-form/colacion-form';
import { ToastService } from '../../../../core/services/toast.service';
@Component({
  selector: 'app-crear-colacion',
  imports: [ColacionForm],
  templateUrl: './crear-colacion.html',
  styleUrl: './crear-colacion.scss',
})
export class CrearColacion {
  /** inyectar toas para notificaiones */
   private toast = inject(ToastService);
  // injectar colacionesService
  private readonly colacionesService = inject(ColacionesService);

  // injectar router
  private readonly router = inject(Router);

    // metodo crearColacion
  crearColacion(datos: ColacionRequest): void {

    // llamamos al metodo crearColacion: usamos .susbribe para recibir la resopuesta http Post
    this.colacionesService.crearColacion(datos).subscribe({
      next: () => {
        console.log('Colación creada correctamente');
              //  1. MOSTRAR TOAST DE ÉXITO
          this.toast.exito('Colación creada correctamente.');

        // Volver al listado
        this.router.navigate(['/dashboard/colaciones']);
      },

      error: (err) => {
        console.error('Error al crear la colacion:', err);
        // Extrae el mensaje del backend si existe, sino usa uno por defecto
            const msg = err?.error?.Errores.estado
                    || err?.error?.Message 
                    || err?.message 
                    || 'Error al crear la colacion.';
            
            this.toast.error(msg);
      },
    });
  }
}
