import { Component, inject } from '@angular/core';
 
import { Router } from '@angular/router';
import { ProgramasService } from '../../services/programas.service';
import { ProgramaRequest } from '../../models/programa-request.interface';
import { ProgramaForm } from '../../components/programa-form/programa-form';
@Component({
  selector: 'app-crear-programa',
  imports: [ProgramaForm],
  templateUrl: './crear-programa.html',
  styleUrl: './crear-programa.scss',
})
export class CrearPrograma {
  // injectar mencionesService
  private readonly programasService = inject(ProgramasService);

  // injectar router
  private readonly router = inject(Router);

  // metodo crearPrograma
      crearPrograma(datos: ProgramaRequest): void {
    
        // llamamos al metodo crearPrograma: usamos .susbribe para recibir la resopuesta http Post
        this.programasService.crearPrograma(datos).subscribe({
          next: () => {
            console.log('Programa creado correctamente');
    
            // Volver al listado
            this.router.navigate(['/dashboard/programas']);
          },
    
          error: (error) => {
            console.error('Error al crear el programa:', error);
          },
        });
      }


}
