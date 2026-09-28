import { Component, computed, inject, signal } from '@angular/core';
import { ColacionesService } from '../../services/colaciones.service';
import { Router } from '@angular/router';
import { Colacion } from '../../models/colacion.interface';

@Component({
  selector: 'app-lista-colaciones',
  imports: [],
  templateUrl: './lista-colaciones.html',
  styleUrl: './lista-colaciones.scss',
})
export class ListaColaciones {
  // inyectar colacionesService
  private readonly colacionesService = inject(ColacionesService);

  // inyectar Roter para navegacion entre colaciones
  private readonly router = inject(Router);

  // =========================
  // Cargar y filtrar
  // =========================

  // todas las colaciones cargadas desde el backend (paginado, acumulativo)
  readonly colaciones = signal<Colacion[]>([]);

  // página actual cargada
  readonly paginaActual = signal(1);

  // total real de registros que reporta el backend (para saber si hay más páginas)
  readonly totalBackend = signal(0);

  // indica si se está trayendo una página adicional
  readonly cargando = signal(false);

  // texto del buscador
  readonly terminoBuscar = signal('');


  // lista final que se muestra en la tabla, filtrada en el cliente
  // computed crea un signal derivado - resultado depende de terminoBuscar y colaciones
  readonly listColaciones = computed(() => {

    // obtener el texto buscado, elimina espacios al prinicipio y final- convierte minuscula
    const termino = this.terminoBuscar().trim().toLowerCase();

    // si no escribio nada devuelve todas las colaciones
    if (!termino) return this.colaciones();

    // filter recorre todas las colaciones y decide cuales deben permanecer
    return this.colaciones().filter(c =>

      // construye u ntexto con los datos de la colacion para buscar por cualquiera de esos datos
      `${c.turno} ${c.descripcion} ${c.estado} ${c.sala.nombre_sala}`
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


  // calcula qué número mostrar como total de colaciones.
  readonly totalColaciones = computed(() =>
    this.terminoBuscar().trim() 
    // si hay texto en buscador
    ? this.listColaciones().length 
    // si no hay texto en buscador
    : this.totalBackend()
  );


  constructor() {
    // cargar la primera pagina
    this.cargarColaciones(1);
  }

  private cargarColaciones(pagina: number): void {
    // cuando empieza la petiicon -> true 
    this.cargando.set(true);

    // Solicitar datos a Django-Como getPersonas() devuelve un Observable, necesitas suscribirte:
    this.colacionesService.getColaciones(pagina, 100).subscribe({

      next: (respuesta) => {

        // obtener colaciones
        const nuevas = respuesta.Data.filas;

        // actualizar señal colaciones -> Angular te entrega el valor actual mediante: actual
        this.colaciones.update(actual => {

          //          crea un conjunto de los IDs extraidos.
          const idsExistentes = new Set(actual.map(p => p.id));

          // De las colaciones nuevas, quédate solamente con aquellas cuyo ID todavía no existe en colaciones.
          const sinDuplicar = nuevas.filter(p => !idsExistentes.has(p.id));

          // Agregar las nuevas colaciones
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


  cargarMasColaciones(): void {
    this.cargarColaciones(this.paginaActual() + 1);
  }

  

  // =========================
  // NAVEGACIÓN Y ELIMINACIÓN —  
  // =========================

  crearColacion(): void {
    this.router.navigate(['/dashboard/colaciones/crear']);
  }

  editarColacion(id: string): void {
    this.router.navigate(['/dashboard/colaciones/editar', id]);
  }


  /** Eliminar colacion */
  readonly colacionEliminarId = signal<string | null>(null);

  seleccionarColacionEliminar(id: string): void {
    this.colacionEliminarId.set(id);
  }

  confirmarEliminacion(): void {
    const id = this.colacionEliminarId();
    if (!id) return;

    this.colacionesService.eliminarColacion(id).subscribe({
      next: () => {
        console.log('Colación eliminada correctamente');
        // recarga desde el inicio para reflejar el borrado
        this.colaciones.set([]);
        this.paginaActual.set(0);
        this.cargarColaciones(1);
        this.colacionEliminarId.set(null);
      },
      error: (error) => {
        console.error('Error al eliminar la colación:', error);
      },
    });
  }
}
