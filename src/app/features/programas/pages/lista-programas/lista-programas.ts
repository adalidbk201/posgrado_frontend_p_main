import { Component, effect, inject, signal } from '@angular/core';
import { ProgramasService } from '../../services/programas.service';
import { Programa } from '../../models/programa.interface';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  imports: [],
  selector: 'app-lista-programas',
  styleUrl: './lista-programas.scss',
  templateUrl: './lista-programas.html',
})
export class ListaProgramas {
  // consumir la api de programas

  //injectar el servicio de programas
  private readonly programasService = inject(ProgramasService);

  //crear señal para almacenar los datos de programas
  readonly listProgramas = signal<Programa[]>([]);

   // total programas
   readonly totalProgramas = signal(0);

  // metodo para obtener todos los programas
  readonly getProgramas = rxResource({
    stream: () => this.programasService.getAllProgramas(),
  });

  // crear señal para almacenar el termino de busqueda
  readonly terminoBuscar = signal('');

  // metodo para buscar programas por termino
  readonly getProgramasBuscar = rxResource({
    params: () => ({
      termino: this.terminoBuscar().trim(),
    }),
    stream: ({ params }) => {
      if (params.termino.length === 0) {
        return this.programasService.getAllProgramas();
      }
      return this.programasService.getBuscarProgramas(params.termino);
    },
  });

  // metodo para ejecutar la busqueda
  ejecutarBusqueda(termino: string): void {
    // actualizar señal terminoBuscar
    this.terminoBuscar.set(termino);
  }

  
  constructor() {
    // verificar cambio de señal
    effect(() => {
      // veriifcar valor de getProgramas
      if (this.getProgramas.hasValue()) {
        // actualizar señal listProgramas con los datos obtenidos
        const respuesta = this.getProgramas.value();
        this.listProgramas.set(respuesta.Data.filas);
        this.totalProgramas.set(respuesta.Data.total);
      }
    });

    // verificar cambio de señal
    effect(() => {
      // veriifcar valor de getProgramasBuscar
      if (this.getProgramasBuscar.hasValue()) {
        // actualizar señal listProgramas con los datos obtenidos
        const respuesta = this.getProgramasBuscar.value();
        this.listProgramas.set(respuesta.Data.filas);
        this.totalProgramas.set(respuesta.Data.total);
      }
    });

  }

}
