import { Component, inject } from '@angular/core';
import { ColacionesService } from '../../services/colaciones.service';
import { Router } from '@angular/router';
import { ColacionRequest } from '../../models/colacion-request.interface';
import { ColacionForm } from '../../components/colacion-form/colacion-form';
@Component({
  selector: 'app-crear-colacion',
  imports: [ColacionForm],
  templateUrl: './crear-colacion.html',
  styleUrl: './crear-colacion.scss',
})
export class CrearColacion {
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

        // Volver al listado
        this.router.navigate(['/dashboard/colaciones']);
      },

      error: (error) => {
        console.error('Error al crear la colacion:', error);
      },
    });
  }
}
