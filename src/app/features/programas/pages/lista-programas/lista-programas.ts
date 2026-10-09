import { Component, computed, effect, inject, signal } from '@angular/core';
import { ProgramasService } from '../../services/programas.service';
import { Programa } from '../../models/programa.interface';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

@Component({
  imports: [],
  selector: 'app-lista-programas',
  styleUrl: './lista-programas.scss',
  templateUrl: './lista-programas.html',
})
export class ListaProgramas {
   // inyectar programasService
    private readonly programasService = inject(ProgramasService);
  
    // inyectar Roter para navegacion entre paginas
    private readonly router = inject(Router);
  
    // =========================
    // Cargar y filtrar
    // =========================
  
    // todos los programas cargados desde el backend (paginado, acumulativo)
    readonly programas = signal<Programa[]>([]);
  
    // página actual cargada
    readonly paginaActual = signal(1);
  
    // total real de registros que reporta el backend (para saber si hay más páginas)
    readonly totalBackend = signal(0);
  
    // indica si se está trayendo una página adicional
    readonly cargando = signal(false);
  
    // texto del buscador
    readonly terminoBuscar = signal('');
  
  
    // lista final que se muestra en la tabla, filtrada en el cliente
    // computed crea un signal derivado - resultado depende de terminoBuscar y programas
    readonly listProgramas = computed(() => {
  
      // obtener el texto buscado, elimina espacios al prinicipio y final- convierte minuscula
      const termino = this.terminoBuscar().trim().toLowerCase();
  
      // si no escribio nada devuelve todos los programas
      // filter recorre todos los programas y decide cuales deben permanecer
      const base = !termino
      ? this.programas()
      : this.programas().filter(p =>
          `${p.nombre_programa} ${p.grado.grado_academico} ${p.menciones}`
            .toLowerCase()
            .includes(termino) 
        );
  
      
      // ordena por fecha_creacion descendente (más reciente primero)
      // [...base] crea una copia para no mutar el array del signal original
      return [...base].sort((a, b) =>
        new Date(b.nombre_programa).getTime() - new Date(a.nombre_programa).getTime()
      );
  
    });
  
    
  
    // se llama directo desde el (input), sin debounce — el filtro es en memoria, no HTTP
    ejecutarBusqueda(termino: string): void {
      this.terminoBuscar.set(termino);
    }
  
  
    // calcula qué número mostrar como total de programa.
    readonly totalProgramas = computed(() =>
      this.terminoBuscar().trim() 
      // si hay texto en buscador
      ? this.listProgramas().length 
      // si no hay texto en buscador
      : this.totalBackend()
    );
  
  
    constructor() {
      // cargar la primera pagina
      this.cargarProgramas(1);
    }
  
    private cargarProgramas(pagina: number): void {
      // cuando empieza la petiicon -> true 
      this.cargando.set(true);
  
      // Solicitar datos a Django-Como getProgramas() devuelve un Observable, necesitas suscribirte:
      this.programasService.getProgramas(pagina, 100).subscribe({
  
        next: (respuesta) => {
  
          // obtener programas
          const nuevas = respuesta.Data.filas;
  
          // actualizar señal personas -> Angular te entrega el valor actual mediante: actual
          this.programas.update(actual => {
  
            //          crea un conjunto de los IDs extraidos.
            const idsExistentes = new Set(actual.map(p => p.id));
  
            // De los programas nuevos, quédate solamente con aquellas cuyo ID todavía no existe en programas.
            const sinDuplicar = nuevas.filter(p => !idsExistentes.has(p.id));
  
            // Agregar los nuevos programas
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
  
  
    cargarMasProgramas(): void {
      this.cargarProgramas(this.paginaActual() + 1);
    }
  
    
  
    // =========================
    // NAVEGACIÓN Y ELIMINACIÓN —  
    // =========================
  
    crearPrograma(): void {
      this.router.navigate(['/dashboard/programas/crear']);
    }
  
    editarPrograma(id: string): void {
      this.router.navigate(['/dashboard/programas/editar', id]);
    }
  
  
    /** Eliminar programa */
    readonly programaEliminarId = signal<string | null>(null);
  
    seleccionarProgramaEliminar(id: string): void {
      this.programaEliminarId.set(id);
    }
  
    confirmarEliminacion(): void {
      const id = this.programaEliminarId();
      if (!id) return;
  
      this.programasService.eliminarPrograma(id).subscribe({
        next: () => {
          console.log('Programa eliminado correctamente');
          // recarga desde el inicio para reflejar el borrado
          this.programas.set([]);
          this.paginaActual.set(0);
          this.cargarProgramas(1);
          this.programaEliminarId.set(null);
        },
        error: (error) => {
          console.error('Error al eliminar el programa:', error);
        },
      });
    }
}
