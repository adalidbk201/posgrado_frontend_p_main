import { Component, computed, inject, signal } from '@angular/core';
import { AsignacionesService } from '../../services/asignaciones.service';
import { Router } from '@angular/router';
import { Asignacion } from '../../models/asignacion.interface';
import { ColacionesService } from '../../../colaciones/services/colaciones.service';
import { Colacion } from '../../../colaciones/models/colacion.interface';
import { Butaca } from '../../../butacas/models/butaca.interface';
import { Nivel } from '../../../niveles/models/nivel.interface';
import { Sala } from '../../../salas/models/sala.interface';
import { ButacasService } from '../../../butacas/services/butacas.service';
import { SalasService } from '../../../salas/services/salas.service';

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

  private readonly salasService = inject(SalasService);
  private readonly butacasService = inject(ButacasService);
  readonly butacasNivel = signal<Butaca[]>([]);
  readonly cargandoButacasNivel = signal(false);
  readonly cargandoNiveles = signal(false);

  readonly nivelSeleccionadoId = signal<string>('');
    readonly asignacionesDelNivel = computed(() => {
    const nivelId = this.nivelSeleccionadoId();

    if (!nivelId) return [];

    return this.listAsignaciones().filter(
      asignacion => asignacion.butaca.nivel === nivelId
    );
  });
  
  readonly salaActual = signal<Sala | null>(null);
  readonly nivelesSala = signal<Nivel[]>([]);
  private solicitudNiveles = 0;
  private solicitudButacasNivel = 0;

  alCambiarColacion(id: string): void {
    this.colacionSeleccionada.set(id);

    this.nivelesSala.set([]);
    this.salaActual.set(null);
    this.nivelSeleccionadoId.set('');
    this.butacasNivel.set([]);

    console.log('ID COLACIÓN SELECCIONADA:', id);

    if (!id) {
      console.log('No se seleccionó una colación específica.');
      return;
    }

    this.colacionesService.getColacionPorId(id).subscribe({
      next: respuesta => {
        console.log('RESPUESTA COMPLETA COLACIÓN:', respuesta);
        console.log('DATA COLACIÓN:', respuesta.Data);
        console.log('SALA DE LA COLACIÓN:', respuesta.Data.sala);

        const idSala = respuesta.Data.sala?.id;

        console.log('ID SALA OBTENIDO:', idSala);

        if (idSala) {
          this.cargarNivelesSala(idSala);
        } else {
          console.error('No se encontró el ID de la sala.');
        }
      },
      error: error => {
        console.error('ERROR AL OBTENER COLACIÓN:', error);
      }
    });
  }

   

  private cargarNivelesSala(idSala: string): void {
    this.cargandoNiveles.set(true);

    console.log('CONSULTANDO NIVELES DE LA SALA:', idSala);

    this.salasService.getNivelesDeSala(idSala).subscribe({
      next: respuesta => {
        console.log('RESPUESTA COMPLETA NIVELES:', respuesta);
        console.log('DATA DE LA SALA:', respuesta.Data);
        console.log('NIVELES ENCONTRADOS:', respuesta.Data?.niveles);

        this.salaActual.set(respuesta.Data);
        this.nivelesSala.set(respuesta.Data.niveles ?? []);

        console.log('SEÑAL NIVELES SALA:', this.nivelesSala());

        this.cargandoNiveles.set(false);
      },
      error: error => {
        console.error('ERROR AL CONSULTAR NIVELES:', error);
        this.cargandoNiveles.set(false);
      }
    });
  }

  alCambiarNivel(idNivel: string): void {
    this.nivelSeleccionadoId.set(idNivel);
    this.butacasNivel.set([]);

    const solicitudActual = ++this.solicitudButacasNivel;

    if (!idNivel) return;

    this.cargandoButacasNivel.set(true);

    this.butacasService.getButacas(idNivel, 1, 100).subscribe({
      next: respuesta => {
        if (solicitudActual !== this.solicitudButacasNivel) return;

        this.butacasNivel.set(respuesta.Data);
        this.cargandoButacasNivel.set(false);
      },
      error: error => {
        if (solicitudActual !== this.solicitudButacasNivel) return;

        console.error('Error al cargar butacas del nivel:', error);
        this.cargandoButacasNivel.set(false);
      },
    });
  }


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
    const nivelId = this.nivelSeleccionadoId();

    if (!nivelId) return [];

    const nivel = this.nivelesSala().find(
      nivel => nivel.id === nivelId
    );

    if (!nivel) return [];

    const butacas = this.butacasNivel();
    const asignaciones = this.asignacionesDelNivel();

    // Relacionar cada butaca con su asignación mediante el ID
    const asignacionesPorButaca = new Map(
      asignaciones.map(asignacion => [
        asignacion.butaca.id,
        asignacion,
      ])
    );

    // Relacionar cada posición con su butaca registrada
    const butacasPorPosicion = new Map(
      butacas.map(butaca => [
        `${butaca.fila}-${butaca.columna}`,
        butaca,
      ])
    );

    // Construir todas las filas y columnas configuradas del nivel
    return Array.from({ length: nivel.filas }, (_, indiceFila) => {
      const numeroFila = indiceFila + 1;

      const columnas = Array.from(
        { length: nivel.columnas },
        (_, indiceColumna) => {
          const numeroColumna = indiceColumna + 1;

          const butaca = butacasPorPosicion.get(
            `${numeroFila}-${numeroColumna}`
          ) ?? null;

          const asignacion = butaca
            ? asignacionesPorButaca.get(butaca.id) ?? null
            : null;

          return {
            numero: numeroColumna,
            butaca,
            asignacion,
          };
        }
      );

      return {
        nombre: numeroFila,
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