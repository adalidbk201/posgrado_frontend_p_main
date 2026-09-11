import { Component, effect, inject, signal } from '@angular/core';
import { SalasService } from '../../services/salas.service';
import { Sala } from '../../models/sala.interface';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';



@Component({
  imports: [],
  selector: 'app-lista-salas',
  styleUrl: './lista-salas.scss',
  templateUrl: './lista-salas.html',
})
export class ListaSalas {
  // consumir la api de salas

  // inyectar el servicio de salas
  private readonly salasService = inject(SalasService);

  // crear señal para almacenar las salas
  readonly listSalas= signal<Sala[]>([]);

  // total de salas
  readonly totalSalas= signal(0);

  // llamar metodo getSalas del servicio de salas
  readonly getSalas= rxResource({
    stream:()=>this.salasService.getSalas(),
  })

  // crear señal terminoBusqeda para almacenar el termino de busqueda
  readonly terminoBusqueda= signal('');

  // llmar metodo getSalaBusqueda del servicio de salas
  readonly getSalaBusqueda= rxResource({
    // asingar termino en parmas
    params:()=>({
      // guardar señal en termino
      termino: this.terminoBusqueda().trim(),
    }),

    stream:({params})=>{
      // verificar si termino es vacio
      if(params.termino.length===0){
        // retornar lista de salas
        return this.salasService.getSalas();
      }
      // retornar sala por termino de busqueda
      return this.salasService.getSalaBusqueda(params.termino);
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
      //verificar si getSalas tiene datos
      if(this.getSalas.hasValue()){
        // asignar datos a la señal listSalas
        this.listSalas.set(this.getSalas.value().Data.filas);
        // asignar total de salas
        this.totalSalas.set(this.getSalas.value().Data.total);
      }
    })

    // verificar cambio de señal
    effect(()=>{
      //verificar si getSalaBusqueda tiene datos
      if(this.getSalaBusqueda.hasValue()){
        // asignar datos a la señal listSalas
        this.listSalas.set(this.getSalaBusqueda.value().Data.filas);
        // asignar total de salas
        this.totalSalas.set(this.getSalaBusqueda.value().Data.total);
      }
    })
  }

  // Inyectamos Router para navegar entre páginas
  private readonly router = inject(Router);

  // Navegar a la página para crear una sala
  crearSala(): void {
    this.router.navigate(['/dashboard/salas/crear']);
  }

  editarSala(id: string): void {

    // Navegar a la página de edición
    // Enviamos el ID de la sala en la URL
    this.router.navigate(['/dashboard/salas/editar', id]);

  }





  // Metodo Eliminar Sala
  // Signal que almacena el ID de la sala seleccionada para eliminar.
  readonly salaEliminarId = signal<string | null>(null);
    // Método que selecciona la sala que se quiere eliminar.
  seleccionarSalaEliminar(id: string): void {

    // Guardamos el ID en el signal.
    this.salaEliminarId.set(id);

  }

  // Método que confirma y ejecuta la eliminación.
  confirmarEliminacion(): void {

    // Obtenemos el ID almacenado.
    const id = this.salaEliminarId();

    // Verificamos que exista un ID.
    if (!id) {
      return;
    }

    // Llamamos al servicio para eliminar la sala.
    this.salasService.eliminarSala(id).subscribe({

      // Se ejecuta cuando la eliminación fue correcta.
      next: () => {

        // Mostramos mensaje de éxito.
        console.log('Sala eliminada correctamente');

        // Recargamos la lista.
        this.getSalas.reload();

        // Recargamos la búsqueda.
        this.getSalaBusqueda.reload();

        // Limpiamos el ID seleccionado.
        this.salaEliminarId.set(null);
      },

      // Se ejecuta cuando ocurre un error.
      error: (error) => {

        // Mostramos el error.
        console.error('Error al eliminar la sala:', error);
      },
    });
  }

}



