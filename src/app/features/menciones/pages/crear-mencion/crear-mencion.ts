import { Component, inject } from '@angular/core';
import { MencionesService } from '../../services/menciones.service';
import { Router } from '@angular/router';
import { MencionRequest } from '../../models/mencion-request.interface';
import { MencionForm } from '../../components/mencion-form/mencion-form';
@Component({
  selector: 'app-crear-mencion',
  imports: [MencionForm],
  templateUrl: './crear-mencion.html',
  styleUrl: './crear-mencion.scss',
})
export class CrearMencion {
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
    
            // Volver al listado
            this.router.navigate(['/dashboard/menciones']);
          },
    
          error: (error) => {
            console.error('Error al crear la mención:', error);
          },
        });
      }


}
