import { Component, computed, inject, signal } from '@angular/core';
import { MencionesService } from '../../services/menciones.service';
import { Router } from '@angular/router';
import { Mencion } from '../../models/mencion.interface';

@Component({
  selector: 'app-lista-menciones',
  imports: [],
  templateUrl: './lista-menciones.html',
  styleUrl: './lista-menciones.scss',
})
export class ListaMenciones {
   // inyectar mencionesService
  private readonly mencionesService = inject(MencionesService);

  // inyectar Roter para navegacion entre paginas
  private readonly router = inject(Router);

  // =========================
  // Cargar y filtrar
  // =========================

  // todas las menciones cargadas desde el backend (paginado, acumulativo)
  readonly menciones = signal<Mencion[]>([]);

  // página actual cargada
  readonly paginaActual = signal(1);

  // total real de registros que reporta el backend (para saber si hay más páginas)
  readonly totalBackend = signal(0);

  // indica si se está trayendo una página adicional
  readonly cargando = signal(false);

  // texto del buscador
  readonly terminoBuscar = signal('');


  // lista final que se muestra en la tabla, filtrada en el cliente
  // computed crea un signal derivado - resultado depende de terminoBuscar y menciones
  readonly listMenciones = computed(() => {

    // obtener el texto buscado, elimina espacios al prinicipio y final- convierte minuscula
    const termino = this.terminoBuscar().trim().toLowerCase();

    // si no escribio nada devuelve todas las menciones
    if (!termino) return this.menciones();

    // filter recorre todas las menciones y decide cuales deben permanecer
    return this.menciones().filter(m =>

      // construye un texto con los datos de la mencion para buscar por cualquiera de esos datos
      `${m.mencion}`
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


  // calcula qué número mostrar como total de menciones.
  readonly totalMenciones = computed(() =>
    this.terminoBuscar().trim() 
    // si hay texto en buscador
    ? this.listMenciones().length 
    // si no hay texto en buscador
    : this.totalBackend()
  );


  constructor() {
    // cargar la primera pagina
    this.cargarMenciones(1);
  }

  private cargarMenciones(pagina: number): void {
    // cuando empieza la petiicon -> true 
    this.cargando.set(true);

    // Solicitar datos a Django-Como getPersonas() devuelve un Observable, necesitas suscribirte:
    this.mencionesService.getMenciones(pagina, 100).subscribe({

      next: (respuesta) => {

        // obtener menciones
        const nuevas = respuesta.Data.filas;

        // actualizar señal menciones -> Angular te entrega el valor actual mediante: actual
        this.menciones.update(actual => {

          //          crea un conjunto de los IDs extraidos.
          const idsExistentes = new Set(actual.map(p => p.id));

          // De las menciones nuevas, quédate solamente con aquellas cuyo ID todavía no existe en menciones.
          const sinDuplicar = nuevas.filter(p => !idsExistentes.has(p.id));

          // Agregar las nuevas menciones
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


  cargarMasMenciones(): void {
    this.cargarMenciones(this.paginaActual() + 1);
  }

  

  // =========================
  // NAVEGACIÓN Y ELIMINACIÓN —  
  // =========================

  crearMencion(): void {
    this.router.navigate(['/dashboard/menciones/crear']);
  }

  editarMencion(id: number): void {
    this.router.navigate(['/dashboard/menciones/editar', id]);
  }


  /** Eliminar mencion */
  readonly mencionEliminarId = signal<number | null>(null);

  seleccionarMencionEliminar(id: number): void {
    this.mencionEliminarId.set(id);
  }

  confirmarEliminacion(): void {
    const id = this.mencionEliminarId();
    if (!id) return;

    this.mencionesService.eliminarMencion(id).subscribe({
      next: () => {
        console.log('Mencion eliminada correctamente');
        // recarga desde el inicio para reflejar el borrado
        this.menciones.set([]);
        this.paginaActual.set(0);
        this.cargarMenciones(1);
        this.mencionEliminarId.set(null);
      },
      error: (error) => {
        console.error('Error al eliminar la mención:', error);
      },
    });
  }
}
