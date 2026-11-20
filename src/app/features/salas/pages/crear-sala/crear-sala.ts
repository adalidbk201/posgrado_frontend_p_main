import { Component, inject } from '@angular/core';
import { SalaForm } from '../../components/sala-form/sala-form';
import { SalaRequest } from '../../models/sala-request.interface';
import { SalasService } from '../../services/salas.service';
import { Router } from '@angular/router';
import { ToastService } from '../../../../core/services/toast.service';
@Component({
  selector: 'app-crear-sala',
  imports: [SalaForm],
  templateUrl: './crear-sala.html',
  styleUrl: './crear-sala.scss',
})

export class CrearSala {
  /** inyectar toas para notificaiones */
   private toast = inject(ToastService);
  
  // injectar salasService
  private readonly salasService = inject(SalasService);

  // injectar router
  private readonly router = inject(Router);

  // metodo crearSala
  crearSala(datos: SalaRequest): void {

    // llamamos al metodo crearSala: usamos .susbribe para recibir la resopuesta http Post
    this.salasService.crearSala(datos).subscribe({
      next: () => {
        console.log('Sala creada correctamente');
         //  1. MOSTRAR TOAST DE ÉXITO
          this.toast.exito('Sala creada correctamente.');

        // Volver al listado
        this.router.navigate(['/dashboard/salas']);
      },

      error: (err) => {
        console.error('Error al crear la sala:', err);
        // Extrae el mensaje del backend si existe, sino usa uno por defecto
            const msg = err?.error?.Errores.estado
                    || err?.error?.Message
                    || err?.message 
                    || 'Error al crear la sala.';
            
            this.toast.error(msg);
      },
    });
  }
}
