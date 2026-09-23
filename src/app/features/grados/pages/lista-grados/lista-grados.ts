import { Component, effect, inject, signal } from '@angular/core';
import { GradosService } from '../../services/grados.service';
import { Grado } from '../../models/grado.interface';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lista-grados',
  imports: [],
  templateUrl: './lista-grados.html',
  styleUrl: './lista-grados.scss',
})
export class ListaGrados {
  // consumir la api grados

  // injectar el servicio de grados
  private readonly gradosService=inject(GradosService)

  // crear señal para almacenar las grados
  readonly listGrados= signal<Grado[]>([]);

  // total de grados
  readonly totalGrados= signal(0);

  // llamar metodo getGrados del servicio de grados
  readonly getGrados= rxResource({
    stream:()=>this.gradosService.getGrados(),
  })

  // crear señal terminoBusqeda para almacenar el termino de busqueda
  readonly terminoBusqueda= signal('');

  // llamar metodo getGradoBusqueda del servicio de grados
  readonly getGradoBusqueda= rxResource({
    // asingar termino en parmas
    params:()=>({
      // guardar señal en termino
      termino: this.terminoBusqueda().trim(),
    }),

    stream:({params})=>{
      // verificar si termino es vacio
      if(params.termino.length===0){
        // retornar lista de salas
        return this.gradosService.getGrados();
      }
      // retornar grado por termino de busqueda
      return this.gradosService.getGradoBusqueda(params.termino);
    }
  })

  // metodo para ejecutar la busqueda
  ejecutarBusqueda(termino:string):void{
    // actualizar señal terminoBusqueda
    this.terminoBusqueda.set(termino)
  }

   constructor(){
    // verificar cambio de señal
    effect(()=>{
      //verificar si getGrados tiene datos
      if(this.getGrados.hasValue()){
        // asignar datos a la señal listGrados
        this.listGrados.set(this.getGrados.value().Data.filas);
        // asignar total de grados
        this.totalGrados.set(this.getGrados.value().Data.total);
      }
    })

    // verificar cambio de señal
    effect(()=>{
      //verificar si getGradoBusqueda tiene datos
      if(this.getGradoBusqueda.hasValue()){
        // asignar datos a la señal listGrados
        this.listGrados.set(this.getGradoBusqueda.value().Data.filas);
        // asignar total de grados
        this.totalGrados.set(this.getGradoBusqueda.value().Data.total);
      }
    })
  }


  // Inyectamos Router para navegar entre páginas
  private readonly router = inject(Router);

  // Navegar a la página para crear un grado
  crearGrado(): void {
    this.router.navigate(['/dashboard/grados/crear']);
  }

  editarGrado(id: number): void {

    // Navegar a la página de edición
    // Enviamos el ID del grado en la URL
    this.router.navigate(['/dashboard/grados/editar', id]);

  }



  // Metodo Eliminar Grado
  // Signal que almacena el ID del grado seleccionada para eliminar.
  readonly gradoEliminarId = signal<number | null>(null);
    // Método que selecciona la grado que se quiere eliminar.
  seleccionarGradoEliminar(id: number): void {

    // Guardamos el ID en el signal.
    this.gradoEliminarId.set(id);

  }

  // Método que confirma y ejecuta la eliminación.
  confirmarEliminacion(): void {

    // Obtenemos el ID almacenado.
    const id = this.gradoEliminarId();

    // Verificamos que exista un ID.
    if (!id) {
      return;
    }

    // Llamamos al servicio para eliminar el grado.
    this.gradosService.eliminarGrado(id).subscribe({

      // Se ejecuta cuando la eliminación fue correcta.
      next: () => {

        // Mostramos mensaje de éxito.
        console.log('Grado eliminado correctamente');

        // Recargamos la lista.
        this.getGrados.reload();

        // Recargamos la búsqueda.
        this.getGradoBusqueda.reload();

        // Limpiamos el ID seleccionado.
        this.gradoEliminarId.set(null);
      },

      // Se ejecuta cuando ocurre un error.
      error: (error) => {

        // Mostramos el error.
        console.error('Error al eliminar el grado:', error);
      },
    });
  }


}
