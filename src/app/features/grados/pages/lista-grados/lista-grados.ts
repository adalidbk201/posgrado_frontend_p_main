import { Component, computed, effect, inject, signal } from '@angular/core';
import { GradosService } from '../../services/grados.service';
import { Grado } from '../../models/grado.interface';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lista-grados',
  imports: [],
  templateUrl: './lista-grados.html',
  styleUrl: './lista-grados.scss',
})
export class ListaGrados {
 // inyectar gradosService
  private readonly gradosService = inject(GradosService);

  // inyectar Roter para navegacion entre paginas
  private readonly router = inject(Router);

  // =========================
  // Cargar y filtrar
  // =========================

  // todas los grados cargados desde el backend (paginado, acumulativo)
  readonly grados = signal<Grado[]>([]);

  // página actual cargada
  readonly paginaActual = signal(1);

  // total real de registros que reporta el backend (para saber si hay más páginas)
  readonly totalBackend = signal(0);

  // indica si se está trayendo una página adicional
  readonly cargando = signal(false);

  // texto del buscador
  readonly terminoBuscar = signal('');


  // lista final que se muestra en la tabla, filtrada en el cliente
  // computed crea un signal derivado - resultado depende de terminoBuscar y grados
  readonly listGrados = computed(() => {

    // obtener el texto buscado, elimina espacios al prinicipio y final- convierte minuscula
    const termino = this.terminoBuscar().trim().toLowerCase();

    // si no escribio nada devuelve todas los grados
    if (!termino) return this.grados();

    // filter recorre todas los grados y decide cuales deben permanecer
    return this.grados().filter(g =>

      // construye un texto con los datos del grado para buscar por cualquiera de esos datos
      `${g.grado_academico} ${g.jerarquia}`
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


  // calcula qué número mostrar como total de grados.
  readonly totalGrados = computed(() =>
    this.terminoBuscar().trim() 
    // si hay texto en buscador
    ? this.listGrados().length 
    // si no hay texto en buscador
    : this.totalBackend()
  );


  constructor() {
    // cargar la primera pagina
    this.cargarGrados(1);
  }

  private cargarGrados(pagina: number): void {
    // cuando empieza la petiicon -> true 
    this.cargando.set(true);

    // Solicitar datos a Django-Como getPersonas() devuelve un Observable, necesitas suscribirte:
    this.gradosService.getGrados(pagina, 100).subscribe({

      next: (respuesta) => {

        // obtener grados
        const nuevas = respuesta.Data.filas;

        // actualizar señal grados -> Angular te entrega el valor actual mediante: actual
        this.grados.update(actual => {

          //          crea un conjunto de los IDs extraidos.
          const idsExistentes = new Set(actual.map(p => p.id));

          // De los grados nuevos, quédate solamente con aquellas cuyo ID todavía no existe en grados.
          const sinDuplicar = nuevas.filter(p => !idsExistentes.has(p.id));

          // Agregar los nuevos grados
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


  cargarMasGrados(): void {
    this.cargarGrados(this.paginaActual() + 1);
  }

  

  // =========================
  // NAVEGACIÓN Y ELIMINACIÓN —  
  // =========================

  crearGrado(): void {
    this.router.navigate(['/dashboard/grados/crear']);
  }

  editarGrado(id: number): void {
    this.router.navigate(['/dashboard/grados/editar', id]);
  }


  /** Eliminar grado */
  readonly gradoEliminarId = signal<number | null>(null);

  seleccionarGradoEliminar(id: number): void {
    this.gradoEliminarId.set(id);
  }

  confirmarEliminacion(): void {
    const id = this.gradoEliminarId();
    if (!id) return;

    this.gradosService.eliminarGrado(id).subscribe({
      next: () => {
        console.log('Grado eliminado correctamente');
        // recarga desde el inicio para reflejar el borrado
        this.grados.set([]);
        this.paginaActual.set(0);
        this.cargarGrados(1);
        this.gradoEliminarId.set(null);
      },
      error: (error) => {
        console.error('Error al eliminar el grado:', error);
      },
    });
  }
}
