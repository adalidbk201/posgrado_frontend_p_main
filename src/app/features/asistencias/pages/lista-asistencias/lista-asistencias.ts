import { Component, effect, inject, signal } from '@angular/core';
 
import { Observable } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';
import { AsistenciasService } from '../../services/asistencias.service';
import type { Asistencia } from '../../models/asistencia.interface';

@Component({
  imports: [],
  selector: 'app-lista-asistencias',
  styleUrl: './lista-asistencias.scss',
  templateUrl: './lista-asistencias.html',
})
export class ListaAsistencias {
  //  consumir api

  // inyectar servicio 
  private readonly asistenciaService=inject(AsistenciasService);

  // crear  señal list para guardar datos
  readonly listAsist = signal<Asistencia[]>([]);

  // total asistencias
  readonly totalAsistencias = signal(0);

  // llamar al metodo get de service
   readonly getAsistencias = rxResource({
    stream: () => this.asistenciaService.getPost(),
  });

  //--------------------------------------------
  // crear señla temrinobuscar
  readonly terminoBuscar = signal('');

  // metodo get de busqueda
  readonly getAsistBuscar = rxResource({
    params: () => ({
      termino: this.terminoBuscar().trim(),
    }),

    stream: ({ params }) => {
      if (params.termino.length === 0) {
        return this.asistenciaService.getPost();
      }

      return this.asistenciaService.getPostBuscar(params.termino);
    },
  });

  // metodo ejecutar Busqueda
  ejecutarBusqueda(termino:string):void{
    // actualiza señal terminoBuscar
    this.terminoBuscar.set(termino)
  }

  constructor(){
     effect(() => {

    console.log(
      'Estado:',
      this.getAsistencias.status(),
    );

    console.log(
      'Valor:',
      this.getAsistencias.value(),
    );

    console.log(
      'Error:',
      this.getAsistencias.error(),
    );

  });

    //verificar cambios de señal
     effect(() => {
      if (this.getAsistencias.hasValue()) {
        const respuesta = this.getAsistencias.value();

        console.log('RESPUESTA COMPLETA:', respuesta);
        console.log('FILAS:', respuesta.Data.filas);
        console.log('TOTAL:', respuesta.Data.total);

        // Guardar las 10 filas de la página actual
        this.listAsist.set(respuesta.Data.filas);

        // Guardar el total real de registros
        this.totalAsistencias.set(respuesta.Data.total);
      }
    });

    // verificar cambios de señal
    effect(() => {
    // verificar si getAsistBuscar tiene valor
    if (this.getAsistBuscar.hasValue()) {
      // obtener el valor de getAsistBuscar
      const respuesta = this.getAsistBuscar.value();
      console.log('RESPUESTA COMPLETA BUSQUEDA:', respuesta);
      console.log('FILAS BUSQUEDA:', respuesta.Data.filas);
      console.log('TOTAL BUSQUEDA:', respuesta.Data.total);
      this.listAsist.set(respuesta.Data.filas);
      this.totalAsistencias.set(respuesta.Data.total);
    }

    });

  }
}

