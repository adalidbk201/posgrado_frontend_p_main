import { Component, effect, inject, signal } from '@angular/core';
import { PersonasService } from '../../services/personas.service';
import { Persona } from '../../models/persona.interface';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

@Component({
  imports: [],
  selector: 'app-lista-personas',
  styleUrl: './lista-personas.scss',
  templateUrl: './lista-personas.html',
})
export class ListaPersonas {
  // consumir la api de personas

  //injectar el servicio de personas
  private readonly personasService = inject(PersonasService);

  //crear señal para almacenar los datos de personas
  readonly listPersonas =signal<Persona[]>([]);

  // total personas
  readonly totalPersonas = signal(0);

  // metodo para obtener todas las personas
  readonly getPersonas =rxResource({
    stream:()=> this.personasService.getAllPersonas(),
  })

  // crear señal para almacenar el termino de busqueda
  readonly terminoBuscar = signal('');

  // metodo para buscar personas por termino
  readonly getPersonasBuscar = rxResource({
    params: () => ({
      termino: this.terminoBuscar().trim(),
    }),
    stream: ({ params }) => {
      if (params.termino.length === 0) {
        return this.personasService.getAllPersonas();
      }
      return this.personasService.getBuscarPersonas(params.termino);
    },
  });

  // metodo para ejecutar la busqueda
  ejecutarBusqueda(termino:string):void{
    // actualizar señal terminoBuscar
    this.terminoBuscar.set(termino)
  }


  constructor(){
    // verificar cambio de señal
    effect(()=>{
      // veriifcar valor de getPersonas
      if(this.getPersonas.hasValue()){
        // actualizar señal listPersonas con los datos obtenidos
        const respuesta = this.getPersonas.value();

        console.log('RESPUESTA COMPLETA:', respuesta);
        console.log('FILAS:', respuesta.Data.filas);
        console.log('TOTAL:', respuesta.Data.total);

        this.listPersonas.set(this.getPersonas.value().Data.filas)
        this.totalPersonas.set(this.getPersonas.value().Data.total)
      }
    })

    // verificar cambio de señal
    effect(()=>{
      // verificar valor de getPersonasBuscar
      if(this.getPersonasBuscar.hasValue()){
        // actualizar señal listPersonas con los datos obtenidos
        this.listPersonas.set(this.getPersonasBuscar.value().Data.filas)
        this.totalPersonas.set(this.getPersonasBuscar.value().Data.total)
      }
    })
  }


   // Inyectamos Router para navegar entre páginas
  private readonly router = inject(Router);
  
  // Navegar a la página para crear una Persona
  crearPersona(): void {
    this.router.navigate(['/dashboard/personas/crear']);
  }

  editarPersona(id: string): void {

    // Navegar a la página de edición
    // Enviamos el ID de la Persona en la URL
    this.router.navigate(['/dashboard/personas/editar', id]);

  }

  // Metodo Eliminar Persona
  // signal que almacena el ID de la Persona para eliminar
  readonly personaEliminarId = signal<string | null>(null);

  // metodo que selecciona la persona a eliminar
   seleccionarPersonaEliminar(id: string): void {

    // Guardamos el ID en el signal.
    this.personaEliminarId.set(id);

  }

  // metodo que conifrma y ejecuta la eliminacion
  confirmarEliminacion(): void {

    // Obtenemos el ID almacenado.
    const id = this.personaEliminarId();

    // Verificamos que exista un ID.
    if (!id) {
      return;
    }

    // Llamamos al servicio para eliminar la sala.
    this.personasService.eliminarPersona(id).subscribe({

      // Se ejecuta cuando la eliminación fue correcta.
      next: () => {

        // Mostramos mensaje de éxito.
        console.log('Sala eliminada correctamente');

        // Recargamos la lista.
        this.getPersonas.reload();

        // Recargamos la búsqueda.
        this.getPersonasBuscar.reload();

        // Limpiamos el ID seleccionado.
        this.personaEliminarId.set(null);
      },

      // Se ejecuta cuando ocurre un error.
      error: (error) => {

        // Mostramos el error.
        console.error('Error al eliminar la persona:', error);
      },
    });
  }



}
