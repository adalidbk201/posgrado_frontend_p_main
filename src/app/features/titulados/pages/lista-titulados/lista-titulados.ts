import { Component, computed, effect, inject, signal } from '@angular/core';
import { TituladosService } from '../../services/titulados.service';
import { Titulado } from '../../models/titulado.interface';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

@Component({
  imports: [],
  selector: 'app-lista-titulados',
  styleUrl: './lista-titulados.scss',
  templateUrl: './lista-titulados.html',
})
export class ListaTitulados {
  // inyectar tituladosService
  private readonly tituladosService = inject(TituladosService);

  // inyectar Roter para navegacion entre paginas
  private readonly router = inject(Router);

  // =========================
  // Cargar y filtrar
  // =========================

  // todos los titulados cargadas desde el backend (paginado, acumulativo)
  readonly titulados = signal<Titulado[]>([]);

  // página actual cargada
  readonly paginaActual = signal(1);

  // total real de registros que reporta el backend (para saber si hay más páginas)
  readonly totalBackend = signal(0);

  // indica si se está trayendo una página adicional
  readonly cargando = signal(false);

  // texto del buscador
  readonly terminoBuscar = signal('');


  // lista final que se muestra en la tabla, filtrada en el cliente
  // computed crea un signal derivado - resultado depende de terminoBuscar y titulados
  readonly listTitulados = computed(() => {

    // obtener el texto buscado, elimina espacios al prinicipio y final- convierte minuscula
    const termino = this.terminoBuscar().trim().toLowerCase();

    // si no escribio nada devuelve todas los titulados
    if (!termino) return this.titulados();

    // filter recorre todas los titulados y decide cuales deben permanecer
    return this.titulados().filter(t =>

      // construye un texto con los datos del titulado para buscar por cualquiera de esos datos
      `${t.grado_posgraduante} ${t.mencion} ${t.mencion}`
        // convierte los datos en minuscula
        .toLowerCase()
        // true si encontro el termino , false si no encontro el termino
        .includes(termino)
    );

  });

  

  // se llama directo desde el (input), sin debounce — el filtro es en memoria, no HTTP
  ejecutarBusqueda(termino: string): void {
    this.terminoBuscar.set(termino);
  }


  // calcula qué número mostrar como total de titulados.
  readonly totalTitulados = computed(() =>
    this.terminoBuscar().trim() 
    // si hay texto en buscador
    ? this.listTitulados().length 
    // si no hay texto en buscador
    : this.totalBackend()
  );


  constructor() {
    // cargar la primera pagina
    this.cargarTitulados(1);
  }

  private cargarTitulados(pagina: number): void {
    // cuando empieza la petiicon -> true 
    this.cargando.set(true);

    // Solicitar datos a Django-Como getTitulados() devuelve un Observable, necesitas suscribirte:
    this.tituladosService.getTitulados(pagina, 100).subscribe({

      next: (respuesta) => {

        // obtener titulados
        const nuevas = respuesta.Data.filas;

        // actualizar señal titulados -> Angular te entrega el valor actual mediante: actual
        this.titulados.update(actual => {

          //          crea un conjunto de los IDs extraidos.
          const idsExistentes = new Set(actual.map(p => p.id));

          // De los titulados nuevos, quédate solamente con aquellas cuyo ID todavía no existe en titulados.
          const sinDuplicar = nuevas.filter(p => !idsExistentes.has(p.id));

          // Agregar los nuevos titulados
          return [...actual, ...sinDuplicar];
        });

        // Guardar el total real de Django
        this.totalBackend.set(respuesta.Data.total);
        // Guardar la página actual
        this.paginaActual.set(pagina);
        // Terminar la carga
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false),
    });
  }


  cargarMasTitulados(): void {
    this.cargarTitulados(this.paginaActual() + 1);
  }

  

  // =========================
  // NAVEGACIÓN Y ELIMINACIÓN —  
  // =========================

  crearTitulado(): void {
    this.router.navigate(['/dashboard/titulados/crear']);
  }

  editarTitulado(id: string): void {
    this.router.navigate(['/dashboard/titulados/editar', id]);
  }


  /** Eliminar titulado */
  readonly tituladoEliminarId = signal<string | null>(null);

  seleccionarTituladoEliminar(id: string): void {
    this.tituladoEliminarId.set(id);
  }

  confirmarEliminacion(): void {
    const id = this.tituladoEliminarId();
    if (!id) return;

    this.tituladosService.eliminarTitulado(id).subscribe({
      next: () => {
        console.log('Titulado eliminado correctamente');
        // recarga desde el inicio para reflejar el borrado
        this.titulados.set([]);
        this.paginaActual.set(0);
        this.cargarTitulados(1);
        this.tituladoEliminarId.set(null);
      },
      error: (error) => {
        console.error('Error al eliminar titulado:', error);
      },
    });
  }

}
