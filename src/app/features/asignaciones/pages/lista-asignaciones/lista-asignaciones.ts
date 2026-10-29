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
  // Inyectar servicios
  private readonly asignacionesService = inject(AsignacionesService);
  private readonly router = inject(Router);
  private readonly colacionesService = inject(ColacionesService);

  // Estado de colación
  readonly colacion = signal<Colacion | null>(null);
  readonly colaciones = signal<Colacion[]>([]);
  readonly colacionSeleccionada = signal<string>('');

  private cargarColaciones(): void {
    this.colacionesService.getColaciones(1, 100).subscribe({
      next: (respuesta) => {
        this.colaciones.set(respuesta.Data.filas);
      },
      error: (error) => {
        console.error('Error al cargar las colaciones:', error);
      },
    });
  }

  obtenerColacion(id: string): void {
    this.colacionesService.getColacionPorId(id).subscribe({
      next: (respuesta) => {
        this.colacion.set(respuesta.Data);
      },
      error: (error) => {
        console.error('Error al obtener la colación:', error);
        this.router.navigate(['/dashboard/colaciones']);
      },
    });
  }

  // =========================
  // Cargar y filtrar asignaciones
  // =========================
  readonly asignaciones = signal<Asignacion[]>([]);
  readonly paginaActual = signal(1);
  readonly totalBackend = signal(0);
  readonly cargando = signal(false);
  readonly terminoBuscar = signal('');

  // Lista final filtrada en el cliente
      readonly listAsignaciones = computed(() => {
      const termino = this.terminoBuscar().trim().toLowerCase();
      const idColacion = this.colacionSeleccionada();

      return this.asignaciones().filter(asignacion => {
        // Filtrar por el ID de la colación anidada
        const coincideColacion =
          !idColacion ||
          asignacion.colacion?.id === idColacion;

        // Datos que se utilizarán en la búsqueda
        const nombrePersona = [
          asignacion.persona?.nombres ?? '',
          asignacion.persona?.primer_apellido ?? '',
          asignacion.persona?.segundo_apellido ?? '',
        ].join(' ');

        const texto = [
          nombrePersona,
          asignacion.butaca?.codigo_butaca ?? '',
          asignacion.butaca?.fila ?? '',
          asignacion.butaca?.columna ?? '',
          asignacion.colacion?.turno ?? '',
          asignacion.colacion?.descripcion ?? '',
          asignacion.programa?.nombre_programa ?? '',
        ].join(' ').toLowerCase();

        const coincideBusqueda =
          !termino || texto.includes(termino);

        return coincideColacion && coincideBusqueda;
      });
    });

  ejecutarBusqueda(termino: string): void {
    this.terminoBuscar.set(termino);
  }

  readonly totalAsignaciones = computed(() => {
    const hayFiltro = this.terminoBuscar().trim() !== '' || this.colacionSeleccionada() !== '';
    return hayFiltro ? this.listAsignaciones().length : this.totalBackend();
  });

  constructor() {
    this.cargarAsignaciones(1);
    this.cargarColaciones();
  }

  private cargarAsignaciones(pagina: number): void {
    this.cargando.set(true);

    this.asignacionesService.getAsignaciones(pagina, 100).subscribe({
      next: (respuesta) => {
        const nuevas = respuesta.Data.filas;

        this.asignaciones.update(actual => {
          // Usamos el ID de la asignación para evitar duplicados, no el de la butaca
          const idsExistentes = new Set(actual.map(a => a.id)); 
          const sinDuplicar = nuevas.filter(a => !idsExistentes.has(a.id));
          return [...actual, ...sinDuplicar];
        });

        this.totalBackend.set(respuesta.Data.total);
        this.paginaActual.set(pagina);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false),
    });
  }

  cargarMasAsignaciones(): void {
    this.cargarAsignaciones(this.paginaActual() + 1);
  }

  // =========================
  // VISTA DE TABLA A PLANO
  // =========================
  readonly vistaActual = signal<'tabla' | 'plano'>('tabla');
  readonly cargandoAsignaciones = signal(false);

  getInitials(nombres: string, primerApellido: string): string {
    const n = nombres?.charAt(0)?.toUpperCase() || '';
    const a = primerApellido?.charAt(0)?.toUpperCase() || '';
    return `${n}${a}`;
  }

  // ✅ COMPUTED PARA AGRUPAR ASIGNACIONES POR FILA Y COLUMNA (Para el Plano)
  readonly filasAsignadas = computed(() => {
    const asignaciones = this.listAsignaciones();
    const grupos = new Map<string, any[]>();

    for (const asignacion of asignaciones) {
      const nombreFila = String(asignacion.butaca.fila);

      if (!grupos.has(nombreFila)) {
        grupos.set(nombreFila, []);
      }

      grupos.get(nombreFila)!.push(asignacion);
    }

    return Array.from(grupos.entries())
      .sort(([filaA], [filaB]) =>
        filaA.localeCompare(filaB, undefined, {
          numeric: true,
          sensitivity: 'base',
        })
      )
      .map(([nombre, asignacionesFila]) => {
        const ordenadas = [...asignacionesFila].sort(
          (a, b) => Number(a.butaca.columna) - Number(b.butaca.columna)
        );

        const porColumna = new Map(
          ordenadas.map(asignacion => [Number(asignacion.butaca.columna), asignacion])
        );

        const maxColumna = Math.max(
          0,
          ...ordenadas.map(asignacion => Number(asignacion.butaca.columna))
        );

        const columnas = Array.from(
          { length: maxColumna },
          (_, indice) => {
            const numeroColumna = indice + 1;
            return {
              numero: numeroColumna,
              asignacion: porColumna.get(numeroColumna) ?? null,
            };
          }
        );

        return {
          nombre,
          columnas,
        };
      });
  });

  // =========================
  // NAVEGACIÓN Y ELIMINACIÓN
  // =========================
  crearAsignacion(): void {
    this.router.navigate(['/dashboard/asignaciones/crear']);
  }

  editarAsignacion(id: string): void {
    this.router.navigate(['/dashboard/asignaciones/editar', id]);
  }

  readonly asignacionEliminarId = signal<string | null>(null);

  seleccionarAsignacionEliminar(id: string): void {
    this.asignacionEliminarId.set(id);
  }

  confirmarEliminacion(): void {
    const id = this.asignacionEliminarId();
    if (!id) return;

    this.asignacionesService.eliminarAsignacion(id).subscribe({
      next: () => {
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