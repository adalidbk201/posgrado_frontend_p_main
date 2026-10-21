import { Component, inject } from '@angular/core';
import { AsignacionesService } from '../../services/asignaciones.service';
import { Router } from '@angular/router';
import { AsignacionRequest } from '../../models/asignacion-request.interface';
import { AsignacionForm } from '../../components/asignacion-form/asignacion-form';
@Component({
  selector: 'app-crear-asignacion',
  imports: [AsignacionForm],
  templateUrl: './crear-asignacion.html',
  styleUrl: './crear-asignacion.scss',
})
export class CrearAsignacion {
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
  
          // Volver al listado
          this.router.navigate(['/dashboard/asignaciones']);
        },
  
        error: (error) => {
          console.error('Error al crear la asignacion:', error);
            console.error('Error al crear la asignación:', error);
            console.error('Estado HTTP:', error.status);
            console.error('Respuesta del backend:', error.error);
        },
      });
    }

}
