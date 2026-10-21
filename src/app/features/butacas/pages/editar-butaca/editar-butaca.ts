import { Component, inject, signal } from '@angular/core';
import { ButacasService } from '../../services/butacas.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Butaca } from '../../models/butaca.interface';
import { ButacaEditarRequest, CrearButacaRequest } from '../../models/butaca-request.interface';
// import { ButacaForm } from '../../components/butaca-form/butaca-form';
import { ButacaEditarForm } from '../../components/butaca-editar-form/butaca-editar-form';
@Component({
  selector: 'app-editar-butaca',
  imports: [ButacaEditarForm],
  templateUrl: './editar-butaca.html',
  styleUrl: './editar-butaca.scss',
})
export class EditarButaca {
   // inyectar butacasService
  private readonly butacasService=inject(ButacasService)

  // inyectar ActivatedRoute
  private readonly route = inject(ActivatedRoute);

  // inyectar Router
  private readonly router = inject(Router);

  // obtener el id de la URL
  private readonly id = this.route.snapshot.paramMap.get('id');
  private readonly id_nivel = this.route.snapshot.paramMap.get('id_nivel');

  // Creamos un signal que inicialmente no contiene ninguna butaca.
  readonly butaca = signal<Butaca | null>(null)

  
  constructor() {

    // verificar si existe el id
    if (!this.id || !this.id_nivel) {

      console.error('No se encontró el ID de la butaca');

      // volver al listado
      this.router.navigate(['/dashboard/butacas']);

      return;
    }

    // obtener los datos de la butaca
    this.obtenerButaca(this.id, this.id_nivel);
  }


  // metodo obtenerButaca
  obtenerButaca(id: string, id_nivel:string): void {

    // llamamos al metodo getButacaPorId
    // usamos subscribe para recibir la respuesta HTTP GET
    this.butacasService.getButacaPorId(id, id_nivel).subscribe({

      // petición correcta
      next: (respuesta) => {

        console.log('Butaca obtenida correctamente:', respuesta);

        // guardar los datos de la rol
        this.butaca.set(respuesta.Data)
        console.log('Butaca:', this.butaca());
      },

      // si ocurre un error
      error: (error) => {

        console.error('Error al obtener la butaca:', error);

        // volver al listado
        this.router.navigate(['/dashboard/butacas']);
      },
    });
  }


  // Método que recibirá los datos del formulario.
    actualizarButaca(datos: ButacaEditarRequest): void {
  
      // Verificamos que exista el ID.
      if (!this.id || !this.id_nivel){
        console.error('Falta el ID de la butaca o el ID del nivel');
        return;
      }
  
      // Actualizamos el rol.
      this.butacasService.actualizarParcialButaca(this.id,this.id_nivel, datos).subscribe({
  
        // Si la actualización fue correcta.
        next: () => {
  
          // Mostramos mensaje de éxito.
          console.log('Butaca actualizado correctamente');
  
          // Volvemos al listado de roles.
          this.router.navigate(['/dashboard/butacas']);
        },
  
        // Si ocurrió un error.
        error: (error) => {
          console.error('Error al actualizar la butaca:', error);
        },
      });
    }
}
