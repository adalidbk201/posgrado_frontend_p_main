import { Component, computed, inject, signal } from '@angular/core';
import { AsignacionesService } from '../../services/asignaciones.service';
import { Router } from '@angular/router';
import { Asignacion } from '../../models/asignacion.interface';
import { ColacionesService } from '../../../colaciones/services/colaciones.service';
import { Colacion } from '../../../colaciones/models/colacion.interface';

@Component({
  imports: [],
  selector: 'app-lista-asignaciones',
  styleUrl: './lista-asignaciones.scss',
  templateUrl: './lista-asignaciones.html',
})
export class ListaAsignaciones {
  // inyectar asignacionesService
  private readonly asignacionesService = inject(AsignacionesService);

  // inyectar Roter para navegacion entre paginas
  private readonly router = inject(Router);
  
  /** OBTENER  DATOS DE COLACION POR ID*/
  private readonly colacionesService=inject(ColacionesService)
  readonly colacion = signal<Colacion | null>(null)
  // metodo obtenerSala
  obtenerColacion(id: string): void {

    // llamamos al metodo getColacionPorId
    // usamos subscribe para recibir la respuesta HTTP GET
    this.colacionesService.getColacionPorId(id).subscribe({

      // petición correcta
      next: (respuesta) => {

        console.log('Persona obtenida correctamente:', respuesta);

        // guardar los datos de la colacion
        this.colacion.set(respuesta.Data)
        console.log('Persona:', this.colacion());
      },

      // si ocurre un error
      error: (error) => {

        console.error('Error al obtener la persona:', error);

        // volver al listado
        this.router.navigate(['/dashboard/personas']);
      },
    });
  }


  // =========================
  // Cargar y filtrar
  // =========================

  // todas las asignaciones cargadas desde el backend (paginado, acumulativo)
  readonly asignaciones = signal<Asignacion[]>([]);

  // página actual cargada
  readonly paginaActual = signal(1);

  // total real de registros que reporta el backend (para saber si hay más páginas)
  readonly totalBackend = signal(0);

  // indica si se está trayendo una página adicional
  readonly cargando = signal(false);

  // texto del buscador
  readonly terminoBuscar = signal('');


  // lista final que se muestra en la tabla, filtrada en el cliente
  // computed crea un signal derivado - resultado depende de terminoBuscar y asignaciones
  readonly listAsignaciones = computed(() => {

    // obtener el texto buscado, elimina espacios al prinicipio y final- convierte minuscula
    const termino = this.terminoBuscar().trim().toLowerCase();

    // si no escribio nada devuelve todas las asignaciones
    // filter recorre todas las asignaciones y decide cuales deben permanecer
     const base = !termino
    ? this.asignaciones()
    : this.asignaciones().filter(a =>

      // construye un texto con los datos de la asignacion para buscar por cualquiera de esos datos
      `${a.titulado} ${a.colacion} ${a.butaca}`
        // convierte los datos en minuscula
        .toLowerCase()
        // true si encontro el termino , false si no encontro el termino
        .includes(termino)
    );

    // ordena por fecha_creacion descendente (más reciente primero)
    // [...base] crea una copia para no mutar el array del signal original
    return [...base].sort((a, b) =>
      new Date(b.fecha_creacion).getTime() - new Date(a.fecha_creacion).getTime()
    );

  });

  

  // se llama directo desde el (input), sin debounce — el filtro es en memoria, no HTTP
  ejecutarBusqueda(termino: string): void {
    this.terminoBuscar.set(termino);
  }


  // calcula qué número mostrar como total de asignaciones.
  readonly totalAsignaciones = computed(() =>
    this.terminoBuscar().trim() 
    // si hay texto en buscador
    ? this.listAsignaciones().length 
    // si no hay texto en buscador
    : this.totalBackend()
  );


  constructor() {
    // cargar la primera pagina
    this.cargarAsignaciones(1);
  }

  private cargarAsignaciones(pagina: number): void {
    // cuando empieza la petiicon -> true 
    this.cargando.set(true);

    // Solicitar datos a Django-Como getAsignaciones() devuelve un Observable, necesitas suscribirte:
    this.asignacionesService.getAsignaciones(pagina, 100).subscribe({

      next: (respuesta) => {

        // obtener asignaciones
        const nuevas = respuesta.Data.filas;

        // actualizar señal asignaciones -> Angular te entrega el valor actual mediante: actual
        this.asignaciones.update(actual => {

          //          crea un conjunto de los IDs extraidos.
          const idsExistentes = new Set(actual.map(p => p.id));

          // De las asignaciones nuevas, quédate solamente con aquellas cuyo ID todavía no existe en asignaciones.
          const sinDuplicar = nuevas.filter(p => !idsExistentes.has(p.id));

          // Agregar las nuevas asignaciones
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


  cargarMasAsignaciones(): void {
    this.cargarAsignaciones(this.paginaActual() + 1);
  }

  

  // =========================
  // NAVEGACIÓN Y ELIMINACIÓN —  
  // =========================

  crearAsignacion(): void {
    this.router.navigate(['/dashboard/asignaciones/crear']);
  }

  editarAsignacion(id: string): void {
    this.router.navigate(['/dashboard/asignaciones/editar', id]);
  }


  /** Eliminar asignacion */
  readonly asignacionEliminarId = signal<string | null>(null);

  seleccionarAsignacionEliminar(id: string): void {
    this.asignacionEliminarId.set(id);
  }

  confirmarEliminacion(): void {
    const id = this.asignacionEliminarId();
    if (!id) return;

    this.asignacionesService.eliminarAsignacion(id).subscribe({
      next: () => {
        console.log('Asignacion eliminada correctamente');
        // recarga desde el inicio para reflejar el borrado
        this.asignaciones.set([]);
        this.paginaActual.set(0);
        this.cargarAsignaciones(1);
        this.asignacionEliminarId.set(null);
      },
      error: (error) => {
        console.error('Error al eliminar la asignación:', error);
      },
    });
  }
}
