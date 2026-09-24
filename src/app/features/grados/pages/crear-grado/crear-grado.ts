import { Component, inject } from '@angular/core';
import { GradosService } from '../../services/grados.service';
import { Router } from '@angular/router';
import { GradoRequest } from '../../models/grado-request.interface';
import { GradoForm } from '../../components/grado-form/grado-form';
 
@Component({
  selector: 'app-crear-grado',
  imports: [GradoForm],
  templateUrl: './crear-grado.html',
  styleUrl: './crear-grado.scss',
})
export class CrearGrado {
  // inyectar gradosService
  private readonly gradosService = inject(GradosService);

   // injectar router
  private readonly router = inject(Router);

  // metodo crearGrado
  crearGrado(datos: GradoRequest): void {

    // llamamos al metodo crearGrado: usamos .susbribe para recibir la resopuesta http Post
    this.gradosService.crearGrado(datos).subscribe({
      next: () => {
        console.log('Grado creado correctamente');

        // Volver al listado
        this.router.navigate(['/dashboard/grados']);
      },

      error: (error) => {
        console.error('Error al crear el grado:', error);
      },
    });
  }


}
