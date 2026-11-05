import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { AsignacionesService } from '../../services/asignaciones.service';
import { Asignacion } from '../../models/asignacion.interface';

import { ColacionesService } from '../../../colaciones/services/colaciones.service';
import { Colacion } from '../../../colaciones/models/colacion.interface';

import { SalasService } from '../../../salas/services/salas.service';
import { Sala } from '../../../salas/models/sala.interface';

import { ButacasService } from '../../../butacas/services/butacas.service';
import { Butaca } from '../../../butacas/models/butaca.interface';

import { Nivel } from '../../../niveles/models/nivel.interface';

@Component({
  selector: 'app-lista-asignaciones',
  imports: [],
  templateUrl: './lista-asignaciones.html',
  styleUrl: './lista-asignaciones.scss',
})
export class ListaAsignaciones {

  // =====================================================
  // SERVICIOS
  // =====================================================

  private readonly asignacionesService = inject(AsignacionesService);
  private readonly colacionesService = inject(ColacionesService);
  private readonly salasService = inject(SalasService);
  private readonly butacasService = inject(ButacasService);
  private readonly router = inject(Router);


  // =====================================================
  // COLACIONES
  // =====================================================

  readonly colacion = signal<Colacion | null>(null);
  readonly colaciones = signal<Colacion[]>([]);
  readonly colacionSeleccionada = signal<string>('');

  private solicitudColacion = 0;

  private cargarColaciones(): void {
    this.colacionesService.getColaciones(1, 100).subscribe({
      next: respuesta => {
        this.colaciones.set(respuesta.Data.filas);
      },
      error: error => {
        console.error('Error al cargar las colaciones:', error);
      },
    });
  }

  obtenerColacion(id: string): void {
    this.colacionesService.getColacionPorId(id).subscribe({
      next: respuesta => {
        this.colacion.set(respuesta.Data);
      },
      error: error => {
        console.error('Error al obtener la colación:', error);
        this.router.navigate(['/dashboard/colaciones']);
      },
    });
  }


  // =====================================================
  // SALAS Y NIVELES
  // Se reutiliza el patrón de ListaButacas:
  // getSalas() devuelve las salas con sus niveles anidados.
  // No se utiliza getNivelesDeSala().
  // =====================================================

  readonly salas = signal<Sala[]>([]);
  readonly cargandoSalas = signal(false);

  readonly salaSeleccionadoId = signal<string | null>(null);

  readonly nivelesSala = computed<Nivel[]>(() => {
    const idSala = this.salaSeleccionadoId();

    if (!idSala) return [];

    const sala = this.salas().find(s => s.id === idSala);

    return sala?.niveles ?? [];
  });

  private cargarSalas(pagina: number): void {
    this.cargandoSalas.set(true);

    this.salasService.getSalas(pagina, 100).subscribe({
      next: respuesta => {
        const nuevas = respuesta.Data.filas;

        this.salas.update(actuales => {
          const idsExistentes = new Set(actuales.map(sala => sala.id));

          const sinDuplicar = nuevas.filter(
            sala => !idsExistentes.has(sala.id)
          );

          return [...actuales, ...sinDuplicar];
        });

        this.cargandoSalas.set(false);
      },
      error: error => {
        console.error('Error al cargar las salas:', error);
        this.cargandoSalas.set(false);
      },
    });
  }


  // =====================================================
  // CAMBIAR COLACIÓN
  // Obtiene la sala asociada a la colación seleccionada.
  // =====================================================

  alCambiarColacion(id: string): void {
    this.colacionSeleccionada.set(id);

    // Invalidar solicitudes anteriores de colación.
    const solicitudActual = ++this.solicitudColacion;

    // Limpiar los datos anteriores del plano.
    this.salaSeleccionadoId.set(null);
    this.nivelSeleccionadoId.set('');
    this.butacasNivel.set([]);
    this.cargandoButacasNivel.set(false);

    // Invalidar solicitudes anteriores de butacas.
    this.solicitudButacasNivel++;

    if (!id) return;

    this.colacionesService.getColacionPorId(id).subscribe({
      next: respuesta => {
        // Ignorar respuestas de una colación anterior.
        if (solicitudActual !== this.solicitudColacion) return;

        const idSala = respuesta.Data.sala?.id;

        if (idSala) {
          // Al asignar el ID, nivelesSala() obtiene los niveles
          // desde la sala que ya fue cargada mediante getSalas().
          this.salaSeleccionadoId.set(idSala);
        } else {
          console.error('La colación no tiene una sala asociada.');
        }
      },
      error: error => {
        if (solicitudActual !== this.solicitudColacion) return;

        console.error('Error al obtener la colación:', error);
      },
    });
  }


  // =====================================================
  // NIVEL Y BUTACAS DEL PLANO
  // =====================================================

  readonly nivelSeleccionadoId = signal<string>('');

  readonly butacasNivel = signal<Butaca[]>([]);
  readonly cargandoButacasNivel = signal(false);

  private solicitudButacasNivel = 0;

  // Asignaciones que pertenecen al nivel seleccionado.
  readonly asignacionesDelNivel = computed(() => {
    const nivelId = this.nivelSeleccionadoId();

    if (!nivelId) return [];

    return this.listAsignaciones().filter(
      asignacion => asignacion.butaca?.nivel === nivelId
    );
  });

  alCambiarNivel(idNivel: string): void {
    this.nivelSeleccionadoId.set(idNivel);
    this.butacasNivel.set([]);

    // Invalidar cualquier petición anterior.
    const solicitudActual = ++this.solicitudButacasNivel;

    if (!idNivel) {
      this.cargandoButacasNivel.set(false);
      return;
    }

    this.cargarButacasNivel(idNivel, solicitudActual);
  }

  private cargarButacasNivel(
    idNivel: string,
    solicitudActual: number
  ): void {
    this.cargandoButacasNivel.set(true);
    this.butacasNivel.set([]);

    this.butacasService.getButacas(idNivel, 1, 100).subscribe({
      next: respuesta => {
        // Evitar que una respuesta anterior sobrescriba el nivel actual.
        if (solicitudActual !== this.solicitudButacasNivel) return;

        this.butacasNivel.set(respuesta.Data);
        this.cargandoButacasNivel.set(false);
      },
      error: error => {
        if (solicitudActual !== this.solicitudButacasNivel) return;

        console.error('Error al cargar las butacas del nivel:', error);
        this.cargandoButacasNivel.set(false);
      },
    });
  }


  // =====================================================
  // ASIGNACIONES
  // =====================================================

  readonly asignaciones = signal<Asignacion[]>([]);
  readonly paginaActual = signal(1);
  readonly totalBackend = signal(0);
  readonly cargando = signal(false);
  readonly terminoBuscar = signal('');

  readonly listAsignaciones = computed(() => {
    const termino = this.terminoBuscar().trim().toLowerCase();
    const idColacion = this.colacionSeleccionada();

    return this.asignaciones().filter(asignacion => {

      const coincideColacion =
        !idColacion ||
        asignacion.colacion?.id === idColacion;

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
    const hayFiltro =
      this.terminoBuscar().trim() !== '' ||
      this.colacionSeleccionada() !== '';

    return hayFiltro
      ? this.listAsignaciones().length
      : this.totalBackend();
  });

  constructor() {
    this.cargarAsignaciones(1);
    this.cargarColaciones();

    // Igual que en ListaButacas: cargar salas con sus niveles.
    this.cargarSalas(1);
  }

  private cargarAsignaciones(pagina: number): void {
    this.cargando.set(true);

    this.asignacionesService.getAsignaciones(pagina, 100).subscribe({
      next: respuesta => {
        const nuevas = respuesta.Data.filas;

        this.asignaciones.update(actuales => {
          const idsExistentes = new Set(
            actuales.map(asignacion => asignacion.id)
          );

          const sinDuplicar = nuevas.filter(
            asignacion => !idsExistentes.has(asignacion.id)
          );

          return [...actuales, ...sinDuplicar];
        });

        this.totalBackend.set(respuesta.Data.total);
        this.paginaActual.set(pagina);
        this.cargando.set(false);
      },
      error: error => {
        console.error('Error al cargar las asignaciones:', error);
        this.cargando.set(false);
      },
    });
  }

  cargarMasAsignaciones(): void {
    this.cargarAsignaciones(this.paginaActual() + 1);
  }


  // =====================================================
  // CAMBIAR ENTRE TABLA Y PLANO
  // =====================================================

  readonly vistaActual = signal<'tabla' | 'plano'>('tabla');

  getInitials(nombres: string, primerApellido: string): string {
    const n = nombres?.charAt(0)?.toUpperCase() || '';
    const a = primerApellido?.charAt(0)?.toUpperCase() || '';

    return `${n}${a}`;
  }


  // =====================================================
  // CONSTRUIR LA GRILLA DEL NIVEL SELECCIONADO
  //
  // Cada posición tendrá:
  // - butaca: objeto Butaca o null.
  // - asignacion: objeto Asignacion o null.
  //
  // Esto permite distinguir:
  // - Butaca asignada.
  // - Butaca disponible.
  // - Posición sin butaca registrada.
  // =====================================================

  readonly filasAsignadas = computed(() => {
  const butacas = this.butacasNivel();
  const asignaciones = this.listAsignaciones();
  const idNivel = this.nivelSeleccionadoId();

  if (!idNivel || butacas.length === 0) {
    return [];
  }

  // Obtener solamente las asignaciones del nivel seleccionado.
  const asignacionesDelNivel = asignaciones.filter(
      asignacion => asignacion.butaca.nivel === idNivel
    );

    // Relacionar cada butaca con su asignación mediante el ID.
    const asignacionesPorButaca = new Map(
      asignacionesDelNivel.map(asignacion => [
        asignacion.butaca.id,
        asignacion
      ])
    );

    // Agrupar únicamente las butacas que realmente existen.
    const grupos = new Map<string, Butaca[]>();

    for (const butaca of butacas) {
      const nombreFila = String(butaca.fila);

      if (!grupos.has(nombreFila)) {
        grupos.set(nombreFila, []);
      }

      grupos.get(nombreFila)!.push(butaca);
    }

    // Construir las filas y sus columnas.
    return Array.from(grupos.entries())
      .sort(([filaA], [filaB]) =>
        filaA.localeCompare(filaB, undefined, {
          numeric: true,
          sensitivity: 'base'
        })
      )
      .map(([nombre, butacasFila]) => {

        const ordenadas = [...butacasFila].sort(
          (a, b) => Number(a.columna) - Number(b.columna)
        );

        const porColumna = new Map(
          ordenadas.map(butaca => [
            Number(butaca.columna),
            butaca
          ])
        );

        // La grilla llega solamente hasta la última butaca registrada.
        const maxColumna = Math.max(
          0,
          ...ordenadas.map(butaca => Number(butaca.columna))
        );

        const columnas = Array.from(
          { length: maxColumna },
          (_, indice) => {

            const numeroColumna = indice + 1;
            const butaca = porColumna.get(numeroColumna) ?? null;

            return {
              numero: numeroColumna,
              butaca,
              asignacion: butaca
                ? asignacionesPorButaca.get(butaca.id) ?? null
                : null
            };
          }
        );

        return {
          nombre,
          columnas
        };
      });
  });


  // =====================================================
  // NAVEGACIÓN
  // =====================================================

  crearAsignacion(): void {
    this.router.navigate(['/dashboard/asignaciones/crear']);
  }

  editarAsignacion(id: string): void {
    this.router.navigate(['/dashboard/asignaciones/editar', id]);
  }


  // =====================================================
  // ELIMINAR ASIGNACIÓN
  // =====================================================

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
      error: error => {
        console.error('Error al eliminar la asignación:', error);
      },
    });
  }

  // =====================================================
  // ASIGNACIÓN AUTOMÁTICA DE BUTACAS
  // =====================================================
  readonly asignacionColacionId = signal<string | null>(null);

  asignarAutomaticamenteColacionSeleccionada(id: string): void {
    this.asignacionColacionId.set(id);
  }

  confirmarAsignacionAutomatica(): void {

    const id = this.asignacionColacionId();

    if (!id) return;

    this.asignacionesService.crearAsignacionAutomatica(id).subscribe({

      next: (respuesta) => {

        console.log(respuesta.Message);

        // Limpiar los datos anteriores
        this.asignaciones.set([]);
        this.paginaActual.set(0);

        // Recargar asignaciones de la colación seleccionada
        this.cargarAsignaciones(1);

        // Limpiar identificador temporal
        this.asignacionColacionId.set(null);

      },

      error: (error) => {
        console.error(
          'Error al crear la asignación automática:',
          error
        );
      },

    });
  }

}