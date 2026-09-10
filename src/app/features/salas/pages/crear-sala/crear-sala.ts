import { Component, inject } from '@angular/core';
import { SalaForm } from '../../components/sala-form/sala-form';
import { SalaRequest } from '../../models/sala-request.interface';
import { SalasService } from '../../services/salas.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crear-sala',
  imports: [SalaForm],
  templateUrl: './crear-sala.html',
  styleUrl: './crear-sala.scss',
})

export class CrearSala {
  
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

        // Volver al listado
        this.router.navigate(['/dashboard/salas']);
      },

      error: (error) => {
        console.error('Error al crear la sala:', error);
      },
    });
  }
}
