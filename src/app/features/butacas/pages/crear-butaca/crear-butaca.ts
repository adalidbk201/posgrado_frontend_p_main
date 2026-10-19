import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { ButacasService } from '../../services/butacas.service';
import { ButacaForm } from '../../components/butaca-form/butaca-form';
import { CrearButacaRequest } from '../../models/butaca-request.interface';

@Component({
  selector: 'app-crear-butaca',
  imports: [ButacaForm],
  templateUrl: './crear-butaca.html',
  styleUrl: './crear-butaca.scss',
})
export class CrearButaca {

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

        // Volver al listado
        this.router.navigate(['/dashboard/butacas']);
      },

     error: (error) => {
        console.error('Error al crear la butaca:', error);

        console.log('Mensaje:', error.error?.Message);

        console.log(
          'Errores de validación:',
          error.error?.Errores
        );

        console.log(
          'Respuesta completa del backend:',
          JSON.stringify(error.error, null, 2)
        );
      }
    });
  }
}