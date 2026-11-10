import { Component, inject } from '@angular/core';
import { ComunicadosService } from '../../services/comunicados.service';
import { Router } from '@angular/router';
import { ComunicadoRequest } from '../../models/comunicado-request.interface';
import { ComunicadoForm } from '../../components/comunicado-form/comunicado-form';
@Component({
  selector: 'app-crear-comunicado',
  imports: [ComunicadoForm],
  templateUrl: './crear-comunicado.html',
  styleUrl: './crear-comunicado.scss',
})
export class CrearComunicado {
  
  // injectar comucadosService
  private readonly comunicadosService = inject(ComunicadosService);

  // injectar router
  private readonly router = inject(Router);

  // metodo crearComunicado
  crearComunicado(datos: ComunicadoRequest): void {

    // llamamos al metodo crearComunicado: usamos .susbribe para recibir la resopuesta http Post
    this.comunicadosService.crearComunicado(datos).subscribe({
      next: () => {
        console.log('Comunicado creado correctamente');

        // Volver al listado
        this.router.navigate(['/dashboard/comunicados']);
      },

      error: (error) => {
        console.error('Error al crear el comunicado:', error);
      },
    });
  }
}
