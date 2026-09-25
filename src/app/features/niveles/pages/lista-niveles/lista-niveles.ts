import { Component, computed, inject, signal } from '@angular/core';
import { NivelesService } from '../../services/niveles.service';
import { Router } from '@angular/router';
import { Nivel } from '../../models/nivel.interface';
 

@Component({
  selector: 'app-lista-niveles',
  imports: [],
  templateUrl: './lista-niveles.html',
  styleUrl: './lista-niveles.scss',
})
export class ListaNiveles {
  // inyectar nivelesService
  private readonly nivelesService = inject(NivelesService);

  // inyectar Roter para navegacion entre paginas
  private readonly router = inject(Router);

  // =========================
  // Cargar y filtrar
  // =========================

  // todas los niveles cargados desde el backend (paginado, acumulativo)
  readonly niveles = signal<Nivel[]>([]);

  // página actual cargada
  readonly paginaActual = signal(1);

  // total real de registros que reporta el backend (para saber si hay más páginas)
  readonly totalBackend = signal(0);

  // indica si se está trayendo una página adicional
  readonly cargando = signal(false);

  // texto del buscador
  readonly terminoBuscar = signal('');


  // lista final que se muestra en la tabla, filtrada en el cliente
  // computed crea un signal derivado - resultado depende de terminoBuscar y niveles
  readonly listNiveles = computed(() => {

    // obtener el texto buscado, elimina espacios al prinicipio y final- convierte minuscula
    const termino = this.terminoBuscar().trim().toLowerCase();

    // si no escribio nada devuelve todas los niveles
    if (!termino) return this.niveles();

    // filter recorre todas los niveles y decide cuales deben permanecer
    return this.niveles().filter(n =>

      // construye u ntexto con los datos del nivel para buscar por cualquiera de esos datos
      `${n.nombre_nivel} ${n.filas} ${n.columnas}`
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


  // calcula qué número mostrar como total de niveles.
  readonly totalNiveles = computed(() =>
    this.terminoBuscar().trim() 
    // si hay texto en buscador
    ? this.listNiveles().length 
    // si no hay texto en buscador
    : this.totalBackend()
  );


  constructor() {
    // cargar la primera pagina
    this.cargarNiveles(1);
  }

  private cargarNiveles(pagina: number): void {
    // cuando empieza la peticion -> true 
    this.cargando.set(true);

    // Solicitar datos a Django-Como getPersonas() devuelve un Observable, necesitas suscribirte:
    this.nivelesService.getNiveles(pagina, 100).subscribe({

      next: (respuesta) => {

        // obtener niveles
        const nuevas = respuesta.Data.filas;

        // actualizar señal niveles -> Angular te entrega el valor actual mediante: actual
        this.niveles.update(actual => {

          //          crea un conjunto de los IDs extraidos.
          const idsExistentes = new Set(actual.map(p => p.id));

          // De los niveles nuevos, quédate solamente con aquellas cuyo ID todavía no existe en niveles.
          const sinDuplicar = nuevas.filter(p => !idsExistentes.has(p.id));

          // Agregar las nuevos niveles
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


  cargarMasNiveles(): void {
    this.cargarNiveles(this.paginaActual() + 1);
  }

  

  // =========================
  // NAVEGACIÓN Y ELIMINACIÓN —  
  // =========================

  crearNivel(): void {
    this.router.navigate(['/dashboard/niveles/crear']);
  }

  editarNivel(id: string): void {
    this.router.navigate(['/dashboard/niveles/editar', id]);
  }


  /** Eliminar nivel */
  readonly nivelEliminarId = signal<string | null>(null);

  seleccionarNivelEliminar(id: string): void {
    this.nivelEliminarId.set(id);
  }

  confirmarEliminacion(): void {
    const id = this.nivelEliminarId();
    if (!id) return;

    this.nivelesService.eliminarNivel(id).subscribe({
      next: () => {
        console.log('Nivel eliminado correctamente');
        // recarga desde el inicio para reflejar el borrado
        this.niveles.set([]);
        this.paginaActual.set(0);
        this.cargarNiveles(1);
        this.nivelEliminarId.set(null);
      },
      error: (error) => {
        console.error('Error al eliminar el nivel:', error);
      },
    });
  }
}
