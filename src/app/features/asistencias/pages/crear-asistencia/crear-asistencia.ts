import { Component, inject } from '@angular/core';
import { AsistenciasService } from '../../services/asistencias.service';
import { Router } from '@angular/router';
import { AsistenciaRequest } from '../../models/asistencia-request.interfacace';

@Component({
  selector: 'app-crear-asistencia',
  imports: [],
  templateUrl: './crear-asistencia.html',
  styleUrl: './crear-asistencia.scss',
})
export class CrearAsistencia {
  
  // injectar asistenciasService
  private readonly asistenciasService = inject(AsistenciasService);

  // injectar router
  private readonly router = inject(Router);

  // metodo crearAsistencia
  crearAsistencia(datos: AsistenciaRequest): void {

    // llamamos al metodo crearAsistencia: usamos .susbribe para recibir la resopuesta http Post
    this.asistenciasService.crearAsistencia(datos).subscribe({
      next: () => {
        console.log('Asistencia creada correctamente');

        // Volver al listado
        this.router.navigate(['/dashboard/asistencias']);
      },

      error: (error) => {
        console.error('Error al crear la asistencia:', error);
      },
    });
  }
}
