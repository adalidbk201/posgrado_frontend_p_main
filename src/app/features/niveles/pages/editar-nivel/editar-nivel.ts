import { Component, inject, signal } from '@angular/core';
import { NivelesService } from '../../services/niveles.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Nivel } from '../../models/nivel.interface';
import { SalasService } from '../../../salas/services/salas.service';
import { NivelRequest } from '../../models/nivel-request.interface';
import { NivelForm } from '../../components/nivel-form/nivel-form';

@Component({
  selector: 'app-editar-nivel',
  imports: [NivelForm],
  templateUrl: './editar-nivel.html',
  styleUrl: './editar-nivel.scss',
})
export class EditarNivel {
   // injectar SalasService
    private readonly nivelesService= inject(NivelesService)
  
    // inyectar ActivatedRoute
    private readonly route = inject(ActivatedRoute);
  
    // inyectar Router
    private readonly router = inject(Router);
  
    // obtener el id de la URL - Datos
     readonly id = this.route.snapshot.paramMap.get('id');
     readonly numero_nivel = Number(this.route.snapshot.paramMap.get('numero_nivel'));
     readonly nombre_nivel = this.route.snapshot.paramMap.get('nombre_nivel');
     readonly filas = Number(this.route.snapshot.paramMap.get('filas'));
     readonly columnas = Number(this.route.snapshot.paramMap.get('columnas'));
     readonly id_sala = this.route.snapshot.paramMap.get('id_sala');
    
  
    // Creamos un signal que inicialmente no contiene ningun nivel.
   readonly nivel = <Nivel | null>(null)
  
  
    constructor() {
      console.log('ID del nivel:', this.id);
      console.log('Nombre del nivel:', this.nombre_nivel);
      console.log('sala del nivel:', this.id_sala);
      // verificar si existe el id
      if (!this.id) {
  
        console.error('No se encontró el ID del nivel');
  
        // volver al listado
        this.router.navigate(['/dashboard/niveles']);
  
        return;
      }
   
    }
  
  
     
  
  
    // Método que recibirá los datos del formulario.
    actualizarNivel(datos: NivelRequest): void {
  
      // Verificamos que exista el ID.
      if (!this.id) {
        return;
      }
  
      // Actualizamos el nivel.
      this.nivelesService.actualizarParcialNivel(this.id, datos).subscribe({
  
        // Si la actualización fue correcta.
        next: () => {
  
          // Mostramos mensaje de éxito.
          console.log('Nivel actualizado correctamente');
  
          // Volvemos al listado de niveles.
          this.router.navigate(['/dashboard/niveles']);
        },
  
        // Si ocurrió un error.
        error: (error) => {
          console.error('Error al actualizar el nivel:', error);
        },
      });
    }
  
  

}
