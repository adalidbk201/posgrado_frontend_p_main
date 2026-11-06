import { Component, inject } from '@angular/core';
import { AsistenciasService } from '../../services/asistencias.service';
import { Router } from '@angular/router';
import { AsistenciaRequest } from '../../models/asistencia-request.interfacace';
import { AsistenciaForm } from '../../components/asistencia-form/asistencia-form';

@Component({
  selector: 'app-crear-asistencia',
  imports: [AsistenciaForm],
  templateUrl: './crear-asistencia.html',
  styleUrl: './crear-asistencia.scss',
})
export class CrearAsistencia {
  
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
        this.router.navigate(['/dashboard/asistencias']);
      },
      error: (error) => {
        console.error('Error al crear la asistencia:', error);
      },
    });
  }
}
