
import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { ButacasService } from '../../services/butacas.service';
import { Butaca } from '../../models/butaca.interface';
import { Sala } from '../../../salas/models/sala.interface';
import { SalasService } from '../../../salas/services/salas.service';
import { Nivel } from '../../../niveles/models/nivel.interface';
import { finalize } from 'rxjs';
@Component({
  selector: 'app-lista-butacas',
  imports: [],
  templateUrl: './lista-butacas.html',
  styleUrl: './lista-butacas.scss',
})
export class ListaButacas {
  private readonly butacasService = inject(ButacasService);
  private readonly salasService = inject(SalasService);
  private readonly router = inject(Router);

      // señal para cambiar de vista
      vistaActual = signal<'tabla' | 'plano'>('tabla');
      // =========================
      // ORGANIZAR BUTACAS PARA EL PLANO
      // =========================

      readonly filasButacas = computed(() => {
        const butacas = this.butacas();

        const grupos = new Map<string, Butaca[]>();

        for (const butaca of butacas) {
          const nombreFila = String(butaca.fila);

          if (!grupos.has(nombreFila)) {
            grupos.set(nombreFila, []);
          }

          grupos.get(nombreFila)!.push(butaca);
        }

        return Array.from(grupos.entries())
          .sort(([filaA], [filaB]) =>
            filaA.localeCompare(filaB, undefined, {
              numeric: true,
              sensitivity: 'base',
            })
          )
          .map(([nombre, butacas]) => {
            const ordenadas = [...butacas].sort(
              (a, b) => Number(a.columna) - Number(b.columna)
            );

            const porColumna = new Map(
              ordenadas.map(butaca => [Number(butaca.columna), butaca])
            );

            const maxColumna = Math.max(
              0,
              ...ordenadas.map(butaca => Number(butaca.columna))
            );

            const columnas = Array.from(
              { length: maxColumna },
              (_, indice) => {
                const numeroColumna = indice + 1;

                return {
                  numero: numeroColumna,
                  butaca: porColumna.get(numeroColumna) ?? null,
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
  // BUTACAS
  // =========================

  readonly butacas = signal<Butaca[]>([]);
  readonly cargandoButacas = signal(false);

  // =========================
  // SALAS Y BÚSQUEDA
  // =========================

  readonly salas = signal<Sala[]>([]);
  readonly paginaSala = signal(1);
  readonly busquedaSala = signal('');
  readonly cargandoMasSalas = signal(false);

  readonly salasFiltradas = computed(() => {
    const termino = this.busquedaSala().trim().toLowerCase();

    if (!termino) {
      return this.salas();
    }

    return this.salas().filter(sala =>
      sala.nombre_sala.toLowerCase().includes(termino)
    );
  });

  // =========================
  // SALA Y NIVEL SELECCIONADOS
  // =========================

  readonly salaSeleccionadoId = signal<string | null>(null);
  readonly nivelSeleccionadoId = signal<string | null>(null);

  // Los niveles se obtienen de la sala seleccionada.
  readonly nivelesSala = computed<Nivel[]>(() => {
    const idSala = this.salaSeleccionadoId();

    if (!idSala) {
      return [];
    }

    const sala = this.salas().find(s => s.id === idSala);

    return sala?.niveles ?? [];
  });

  constructor() {
    this.cargarSalas(1);
  }

  // =========================
  // CARGAR SALAS
  // =========================

  private cargarSalas(pagina: number): void {
    if (this.cargandoMasSalas()) {
      return;
    }

    this.cargandoMasSalas.set(true);

    this.salasService.getSalas(pagina, 100).subscribe({
      next: respuesta => {
        const nuevas = respuesta.Data.filas;

        this.salas.update(actuales => {
          const idsExistentes = new Set(actuales.map(s => s.id));

          return [
            ...actuales,
            ...nuevas.filter(s => !idsExistentes.has(s.id)),
          ];
        });

        this.paginaSala.set(pagina);
        this.cargandoMasSalas.set(false);
      },
      error: error => {
        console.error('Error al cargar salas:', error);
        this.cargandoMasSalas.set(false);
      },
    });
  }

  cargarMasSalas(): void {
    this.cargarSalas(this.paginaSala() + 1);
  }

  // =========================
  // CAMBIAR SALA
  // =========================

  alCambiarSala(idSala: string): void {
    this.salaSeleccionadoId.set(idSala || null);

    // Reiniciar el nivel y las butacas anteriores.
    this.nivelSeleccionadoId.set(null);
    this.butacas.set([]);
  }

  // =========================
  // CAMBIAR NIVEL
  // =========================

  alCambiarNivel(idNivel: string): void {
  this.nivelSeleccionadoId.set(idNivel || null);
  this.butacas.set([]);

  if (!idNivel) {
    return;
  }

  this.cargarButacas(idNivel);
}

  // =========================
  // CARGAR BUTACAS POR NIVEL
  // =========================

  


private cargarButacas(idNivel: string): void {
  this.cargandoButacas.set(true);
  this.butacas.set([]);

  this.butacasService.getButacas(idNivel, 1, 100).subscribe({
    next: (respuesta) => {
      console.log('Butacas recibidas:', respuesta.Data);

      // El backend devuelve directamente un arreglo en Data.
      this.butacas.set(respuesta.Data);
      this.cargandoButacas.set(false);
    },
    error: (error) => {
      console.error('Error al cargar butacas:', error);
      this.cargandoButacas.set(false);
    },
  });
}



  // =========================
  // NAVEGACIÓN Y ELIMINACIÓN
  // =========================

  crearButaca(): void {
    this.router.navigate(['/dashboard/butacas/crear']);
  }

  editarButaca(id: string, id_nivel:string): void {
    this.router.navigate(['/dashboard/butacas/editar', id, id_nivel]);
  }

  
  /** Eliminar butaca */
  readonly butacaEliminarId = signal<string | null>(null);

  seleccionarButacaEliminar(id: string): void {
    this.butacaEliminarId.set(id);
  }

  confirmarEliminacion(): void {
  const id = this.butacaEliminarId();

  if (!id) return;

  this.butacasService.eliminarButaca(id).subscribe({
    next: () => {
      console.log('Butaca eliminada correctamente');

      // Quitar la butaca eliminada de la lista actual.
      this.butacas.update(butacas =>
        butacas.filter(butaca => butaca.id !== id)
      );

      // Limpiar el ID seleccionado para eliminar.
      this.butacaEliminarId.set(null);
    },

    error: (error) => {
      console.error('Error al eliminar la butaca:', error);
    },
  });
}





}
