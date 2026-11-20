import { Component, inject } from '@angular/core';
import { MencionesService } from '../../services/menciones.service';
import { Router } from '@angular/router';
import { MencionRequest } from '../../models/mencion-request.interface';
import { MencionForm } from '../../components/mencion-form/mencion-form';
import { ToastService } from '../../../../core/services/toast.service';
@Component({
  selector: 'app-crear-mencion',
  imports: [MencionForm],
  templateUrl: './crear-mencion.html',
  styleUrl: './crear-mencion.scss',
})
export class CrearMencion {
  /** inyectar toas para notificaiones */
   private toast = inject(ToastService);
  // injectar mencionesService
  private readonly mencionesService = inject(MencionesService);

  // injectar router
  private readonly router = inject(Router);


   // metodo crearMencion
      crearMencion(datos: MencionRequest): void {
    
        // llamamos al metodo crearMencion: usamos .susbribe para recibir la resopuesta http Post
        this.mencionesService.crearMencion(datos).subscribe({
          next: () => {
            console.log('Mención creada correctamente');
            //  1. MOSTRAR TOAST DE ÉXITO
          this.toast.exito('Mención creada correctamente.');
    
            // Volver al listado
            this.router.navigate(['/dashboard/menciones']);
          },
    
          error: (err) => {
            console.error('Error al crear la mención:', err);
            // Extrae el mensaje del backend si existe, sino usa uno por defecto
            const msg = err?.error.Message
                    || err?.error?.message 
                    || err?.message 
                    || 'Error al crear la mención.';
            
            this.toast.error(msg);
          },
        });
      }


}
