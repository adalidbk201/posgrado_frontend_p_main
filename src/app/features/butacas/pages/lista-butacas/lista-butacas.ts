import { Component, computed, effect, inject, signal } from '@angular/core';
import { ButacasService } from '../../services/butacas.service';
import { Router } from '@angular/router';
import { Butaca } from '../../models/butaca.interface';
import { NivelesService } from '../../../niveles/services/niveles.service';
import { Nivel } from '../../../niveles/models/nivel.interface';

@Component({
  selector: 'app-lista-butacas',
  imports: [],
  templateUrl: './lista-butacas.html',
  styleUrl: './lista-butacas.scss',
})
export class ListaButacas {
  // injectar butacasService
  private readonly butacasService = inject(ButacasService);
  // inyectar nivelesService
  private readonly nivelesService = inject(NivelesService);
  // inyectar Router para navegacion entre paginas
  private readonly router = inject(Router);

  // =========================
  // SELECTOR DE NIVEL
  // =========================

  // niveles disponibles para el <select>
  readonly niveles = signal<Nivel[]>([]);

  // nivel actualmente elegido — null = ninguno seleccionado todavía
  readonly nivelSeleccionado = signal<string | null>(null);

  private cargarNiveles(): void {
    this.nivelesService.getNiveles(1, 100).subscribe({
      next: (respuesta) => this.niveles.set(respuesta.Data.filas),
      error: (error) => console.error('Error al cargar niveles:', error),
    });
  }

  onNivelSeleccionado(idNivel: string): void {
    // el <select> entrega string; convertimos a number o null si viene vacío
    const id = idNivel ? idNivel : null;
    this.nivelSeleccionado.set(id);
  }

  // =========================
  // CARGAR Y FILTRAR BUTACAS (solo si hay nivel elegido)
  // =========================

  readonly butacas = signal<Butaca[]>([]);
  readonly paginaActual = signal(1);
  readonly totalBackend = signal(0);
  readonly cargando = signal(false);
  readonly terminoBuscar = signal('');

  readonly listButacas = computed(() => {
    const termino = this.terminoBuscar().trim().toLowerCase();
    if (!termino) return this.butacas();

    return this.butacas().filter(b =>
      `${b.codigo_butaca} ${b.estado_butaca} ${b.fila} ${b.columna}`
        .toLowerCase()
        .includes(termino)
    );
  });

  readonly totalButacas = computed(() =>
    this.terminoBuscar().trim() ? this.listButacas().length : this.totalBackend()
  );

  ejecutarBusqueda(termino: string): void {
    this.terminoBuscar.set(termino);
  }

  constructor() {
    this.cargarNiveles();

    // cada vez que cambia el nivel elegido, se reinicia todo y se recarga desde cero
    effect(() => {
      const idNivel = this.nivelSeleccionado();

      // limpiar estado anterior siempre que cambie el nivel (incluido volver a "ninguno")
      this.butacas.set([]);
      this.paginaActual.set(1);
      this.totalBackend.set(0);
      this.terminoBuscar.set('');

      if (idNivel !== null) {
        this.cargarButacas(idNivel, 1);
      }
    });
  }

  private cargarButacas(idNivel: string, pagina: number): void {
    this.cargando.set(true);

    this.butacasService.getButacas(idNivel, pagina, 100).subscribe({
      next: (respuesta) => {
        const nuevas = respuesta.Data.filas;

        this.butacas.update(actual => {
          const idsExistentes = new Set(actual.map(p => p.id));
          const sinDuplicar = nuevas.filter(p => !idsExistentes.has(p.id));
          return [...actual, ...sinDuplicar];
        });

        this.totalBackend.set(respuesta.Data.total);
        this.paginaActual.set(pagina);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false),
    });
  }

  cargarMasButacas(): void {
    const idNivel = this.nivelSeleccionado();
    if (idNivel === null) return;
    this.cargarButacas(idNivel, this.paginaActual() + 1);
  }

  // =========================
  // NAVEGACIÓN Y ELIMINACIÓN — igual que antes
  // =========================

  crearButaca(): void {
    this.router.navigate(['/dashboard/butacas/crear']);
  }

  editarButaca(id: string): void {
    this.router.navigate(['/dashboard/butacas/editar', id]);
  }

  readonly butacaEliminarId = signal<string | null>(null);

  seleccionarButacaEliminar(id: string): void {
    this.butacaEliminarId.set(id);
  }

  confirmarEliminacion(): void {
    const id = this.butacaEliminarId();
    const idNivel = this.nivelSeleccionado();
    if (!id || idNivel === null) return;

    this.butacasService.eliminarButaca(id).subscribe({
      next: () => {
        console.log('Butaca eliminada correctamente');
        this.butacas.set([]);
        this.paginaActual.set(1);
        this.cargarButacas(idNivel, 1);
        this.butacaEliminarId.set(null);
      },
      error: (error) => {
        console.error('Error al eliminar la butaca:', error);
      },
    });
  }
 
} 
