import { Component, effect, inject, signal } from '@angular/core';
import { TituladosService } from '../../services/titulados.service';
import { Titulado } from '../../models/titulado.interface';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  imports: [],
  selector: 'app-lista-titulados',
  styleUrl: './lista-titulados.scss',
  templateUrl: './lista-titulados.html',
})
export class ListaTitulados {
  // consumir la api de titulados
  
  //injectar el servicio de titulados
  private readonly tituladosService = inject(TituladosService);

  //crear señal para almacenar los datos de titulados
  readonly listTitulados = signal<Titulado[]>([]);

  // total titulados
  readonly totalTitulados = signal(0);

  // metodo getAllTitulados para obtener todos los titulados
  readonly getAllTitulados = rxResource({
    stream: () => this.tituladosService.getAllTitulados(),
  });


  // crear señal para almacenar el termino de busqueda
  readonly terminoBuscar = signal('');

  // metodo para buscar titulados por termino
  readonly getTituladosBuscar = rxResource({
    params: () => ({
      termino: this.terminoBuscar().trim(),
    }),


    stream:({ params }) => {
      if (params.termino.length === 0) {
        return this.tituladosService.getAllTitulados();
      }
      return this.tituladosService.getBuscarTitulados(params.termino);
    },
  });

  // metodo para ejecutar la busqueda
  ejecutarBusqueda(termino:string):void{
    // actualizar señal terminoBuscar
    this.terminoBuscar.set(termino)
  }

  constructor() {
    // verificar cambio de señal
    effect(()=>{
      // veriifcar valor de getAllTitulados
      if(this.getAllTitulados.hasValue()){
        // actualizar señal listTitulados con los datos obtenidos
        const respuesta = this.getAllTitulados.value();
        this.listTitulados.set(respuesta.Data.filas);
      }
    })

    // verificar cambio de señal para busqueda
    effect(()=>{
      // veriifcar valor de getTituladosBuscar
      if(this.getTituladosBuscar.hasValue()){
        // actualizar señal listTitulados con los datos obtenidos
        const respuesta = this.getTituladosBuscar.value();
        this.listTitulados.set(respuesta.Data.filas);
      }
    })
    

  }

}
