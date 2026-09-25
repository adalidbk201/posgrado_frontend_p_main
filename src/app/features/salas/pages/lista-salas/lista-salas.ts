import { Component, computed, effect, inject, signal } from '@angular/core';
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
  // inyectar salasService
  private readonly salasService = inject(SalasService);

  // inyectar Roter para navegacion entre paginas
  private readonly router = inject(Router);

  // =========================
  // Cargar y filtrar
  // =========================

  // todas las salas cargadas desde el backend (paginado, acumulativo)
  readonly salas = signal<Sala[]>([]);

  // página actual cargada
  readonly paginaActual = signal(1);

  // total real de registros que reporta el backend (para saber si hay más páginas)
  readonly totalBackend = signal(0);

  // indica si se está trayendo una página adicional
  readonly cargando = signal(false);

  // texto del buscador
  readonly terminoBuscar = signal('');


  // lista final que se muestra en la tabla, filtrada en el cliente
  // computed crea un signal derivado - resultado depende de terminoBuscar y salas
  readonly listSalas = computed(() => {

    // obtener el texto buscado, elimina espacios al prinicipio y final- convierte minuscula
    const termino = this.terminoBuscar().trim().toLowerCase();

    // si no escribio nada devuelve todas las salas
    if (!termino) return this.salas();

    // filter recorre todas las salas y decide cuales deben permanecer
    return this.salas().filter(s =>

      // construye un texto con los datos de la sala para buscar por cualquiera de esos datos
      `${s.nombre_sala}`
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


  // calcula qué número mostrar como total de salas.
  readonly totalSalas = computed(() =>
    this.terminoBuscar().trim() 
    // si hay texto en buscador
    ? this.listSalas().length 
    // si no hay texto en buscador
    : this.totalBackend()
  );


  constructor() {
    // cargar la primera pagina
    this.cargarSalas(1);
  }

  private cargarSalas(pagina: number): void {
    // cuando empieza la petiicon -> true 
    this.cargando.set(true);

    // Solicitar datos a Django-Como getSalas() devuelve un Observable, necesitas suscribirte:
    this.salasService.getSalas(pagina, 100).subscribe({

      next: (respuesta) => {

        // obtener salas
        const nuevas = respuesta.Data.filas;

        // actualizar señal salas -> Angular te entrega el valor actual mediante: actual
        this.salas.update(actual => {

          //          crea un conjunto de los IDs extraidos.
          const idsExistentes = new Set(actual.map(p => p.id));

          // De las salas nuevas, quédate solamente con aquellas cuyo ID todavía no existe en salas.
          const sinDuplicar = nuevas.filter(p => !idsExistentes.has(p.id));

          // Agregar las nuevas salas
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


  cargarMasSalas(): void {
    this.cargarSalas(this.paginaActual() + 1);
  }

  

  // =========================
  // NAVEGACIÓN Y ELIMINACIÓN —  
  // =========================

  crearSala(): void {
    this.router.navigate(['/dashboard/salas/crear']);
  }

  editarSala(id: string): void {
    this.router.navigate(['/dashboard/salas/editar', id]);
  }


  /** Eliminar sala */
  readonly salaEliminarId = signal<string | null>(null);

  seleccionarSalaEliminar(id: string): void {
    this.salaEliminarId.set(id);
  }

  confirmarEliminacion(): void {
    const id = this.salaEliminarId();
    if (!id) return;

    this.salasService.eliminarSala(id).subscribe({
      next: () => {
        console.log('Sala eliminada correctamente');
        // recarga desde el inicio para reflejar el borrado
        this.salas.set([]);
        this.paginaActual.set(0);
        this.cargarSalas(1);
        this.salaEliminarId.set(null);
      },
      error: (error) => {
        console.error('Error al eliminar la sala:', error);
      },
    });
  }
}



