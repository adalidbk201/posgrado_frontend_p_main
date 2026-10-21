import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { Asignacion } from '../../models/asignacion.interface';
import { AsignacionRequest } from '../../models/asignacion-request.interface';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Colacion } from '../../../colaciones/models/colacion.interface';
import { ColacionesService } from '../../../colaciones/services/colaciones.service';
import { Persona } from '../../../personas/models/persona.interface';
import { PersonasService } from '../../../personas/services/personas.service';
import { ButacasService } from '../../../butacas/services/butacas.service';
import { SalasService } from '../../../salas/services/salas.service';
import { Butaca } from '../../../butacas/models/butaca.interface';
import { Sala } from '../../../salas/models/sala.interface';
import { Nivel } from '../../../niveles/models/nivel.interface';


@Component({
  selector: 'app-asignacion-form',
  imports: [ReactiveFormsModule],
  templateUrl: './asignacion-form.html',
  styleUrl: './asignacion-form.scss',
})
export class AsignacionForm {
      // =========================================================
    // ASIGNACIÓN Y FORMULARIO
    // =========================================================

    // Recibe una asignación cuando estamos editando.
    readonly asignacion = input<Asignacion | null>(null);

    // Envía los datos al componente padre.
    readonly guardar = output<AsignacionRequest>();

    private readonly fb = inject(FormBuilder);

    readonly formulario = this.fb.nonNullable.group({
    colacion: [
    '',
    [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(50),
    ],
    ],

    titulado: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
      ],
    ],

    butaca: [
      '',
      [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(255),
      ],
    ],

    });

    // =========================================================
    // SELECTOR DE COLACIONES
    // =========================================================

    readonly colaciones = signal<Colacion[]>([]);
    readonly paginaColacion = signal(1);
    readonly busquedaColacion = signal('');
    readonly cargandoMasColaciones = signal(false);

    private readonly colacionesService = inject(ColacionesService);

    readonly colacionesFiltradas = computed(() => {
    const termino = this.busquedaColacion().trim().toLowerCase();

    if (!termino) {
      return this.colaciones();
    }

    return this.colaciones().filter(colacion =>
      colacion.descripcion.toLowerCase().includes(termino)
    );

    });

    private cargarColaciones(pagina: number): void {
    if (this.cargandoMasColaciones()) {
    return;
    }

    this.cargandoMasColaciones.set(true);

    this.colacionesService.getColaciones(pagina, 100).subscribe({
      next: respuesta => {
        const nuevas = respuesta.Data.filas;

        this.colaciones.update(actuales => {
          const idsExistentes = new Set(actuales.map(c => c.id));

          return [
            ...actuales,
            ...nuevas.filter(c => !idsExistentes.has(c.id)),
          ];
        });

        this.paginaColacion.set(pagina);
        this.cargandoMasColaciones.set(false);
      },

      error: error => {
        console.error('Error al cargar colaciones:', error);
        this.cargandoMasColaciones.set(false);
      },
    });

    }

    cargarMasColaciones(): void {
    this.cargarColaciones(this.paginaColacion() + 1);
    }

    // =========================================================
    // COLACIÓN SELECCIONADA Y SALA ASOCIADA
    // =========================================================

    readonly colacionSeleccionadaId = signal<string | null>(null);

    // Obtener el objeto de la colación seleccionada.
    readonly colacionSeleccionada = computed(() => {
    const idColacion = this.colacionSeleccionadaId();

    if (!idColacion) {
      return null;
    }

    return this.colaciones().find(
      colacion => String(colacion.id) === idColacion
    ) ?? null;

    });

    // Obtener automáticamente el ID de la sala de la colación.
    readonly salaSeleccionadoId = computed<string | null>(() => {
    const colacion = this.colacionSeleccionada();

    return colacion?.sala.id
      ? String(colacion.sala.id)
      : null;

    });

    // Ejecutar cuando el usuario cambia de colación.
    alCambiarColacion(idColacion: string): void {
    this.colacionSeleccionadaId.set(idColacion || null);

    // Reiniciar el nivel seleccionado.
    this.nivelSeleccionadoId.set(null);

    // Reiniciar las butacas.
    this.butacas.set([]);

    // Limpiar la butaca del formulario.
    this.formulario.controls.butaca.setValue('');

    // Limpiar el estado de carga.
    this.cargandoButacas.set(false);

    }

    // =========================================================
    // SELECTOR DE TITULADOS MEDIANTE PERSONAS
    // =========================================================

    readonly personas = signal<Persona[]>([]);
    readonly paginaPersona = signal(1);
    readonly busquedaPersona = signal('');
    readonly cargandoMasPersonas = signal(false);

    private readonly personasService = inject(PersonasService);

    readonly personasFiltradas = computed(() => {
    const termino = this.busquedaPersona().trim().toLowerCase();

    if (!termino) {
      return this.personas();
    }

    return this.personas().filter(persona =>
      persona.nombres.toLowerCase().includes(termino)
    );

    });

    private cargarPersonas(pagina: number): void {
    if (this.cargandoMasPersonas()) {
    return;
    }

    this.cargandoMasPersonas.set(true);

    this.personasService.getPersonas(pagina, 100).subscribe({
      next: respuesta => {
        const nuevas = respuesta.Data.filas;

        this.personas.update(actuales => {
          const idsExistentes = new Set(actuales.map(p => p.id));

          return [
            ...actuales,
            ...nuevas.filter(p => !idsExistentes.has(p.id)),
          ];
        });

        this.paginaPersona.set(pagina);
        this.cargandoMasPersonas.set(false);
      },

      error: error => {
        console.error('Error al cargar personas:', error);
        this.cargandoMasPersonas.set(false);
      },
    });

    }

    cargarMasPersonas(): void {
    this.cargarPersonas(this.paginaPersona() + 1);
    }

    // =========================================================
    // SERVICIOS DE SALAS Y BUTACAS
    // =========================================================

    private readonly butacasService = inject(ButacasService);
    private readonly salasService = inject(SalasService);

    // =========================================================
    // BUTACAS
    // =========================================================

    readonly butacas = signal<Butaca[]>([]);
    readonly cargandoButacas = signal(false);

    // =========================================================
    // SALAS
    // =========================================================

    readonly salas = signal<Sala[]>([]);
    readonly paginaSala = signal(1);
    readonly cargandoMasSalas = signal(false);

    // Los niveles se obtienen de la sala asociada a la colación.
    readonly nivelesSala = computed<Nivel[]>(() => {
    const idSala = this.salaSeleccionadoId();

    if (!idSala) {
      return [];
    }

    const sala = this.salas().find(
      s => String(s.id) === idSala
    );

    return sala?.niveles ?? [];

    });

    // =========================================================
    // NIVEL SELECCIONADO
    // =========================================================

    readonly nivelSeleccionadoId = signal<string | null>(null);

    // =========================================================
    // CARGAR SALAS
    // =========================================================

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

    // =========================================================
    // CAMBIAR NIVEL
    // =========================================================

    alCambiarNivel(idNivel: string): void {
    this.nivelSeleccionadoId.set(idNivel || null);

    // Reiniciar las butacas anteriores.
    this.butacas.set([]);

    // Limpiar la butaca seleccionada.
    this.formulario.controls.butaca.setValue('');

    if (!idNivel) {
      return;
    }

    this.cargarButacas(idNivel);

    }

    // =========================================================
    // CARGAR BUTACAS POR NIVEL
    // =========================================================

    private cargarButacas(idNivel: string): void {
    this.cargandoButacas.set(true);
    this.butacas.set([]);

    this.butacasService.getButacas(idNivel, 1, 100).subscribe({
      next: respuesta => {
        // Evitar aplicar una respuesta antigua si el usuario
        // seleccionó otro nivel mientras se realizaba la petición.
        if (this.nivelSeleccionadoId() !== idNivel) {
          return;
        }

        this.butacas.set(respuesta.Data);
        this.cargandoButacas.set(false);
      },

      error: error => {
        console.error('Error al cargar butacas:', error);

        if (this.nivelSeleccionadoId() === idNivel) {
          this.cargandoButacas.set(false);
        }
      },
    });

    }

    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    constructor() {

    // Cargar colaciones.
    this.cargarColaciones(1);

    // Cargar personas.
    this.cargarPersonas(1);

    // Cargar salas y sus niveles.
    this.cargarSalas(1);

    effect(() => {
      const asignacionActual = this.asignacion();

      if (asignacionActual) {

        this.formulario.patchValue({
          colacion: asignacionActual.colacion,
          titulado: asignacionActual.titulado,
          butaca: asignacionActual.butaca,
        });

        // Sincronizar la colación seleccionada al editar.
        this.colacionSeleccionadaId.set(
          asignacionActual.colacion
            ? String(asignacionActual.colacion)
            : null
        );

      } else {

        this.formulario.reset({
          colacion: '',
          titulado: '',
          butaca: '',
        });

        this.colacionSeleccionadaId.set(null);
        this.nivelSeleccionadoId.set(null);
        this.butacas.set([]);
      }
    });

    }

    // =========================================================
    // ENVIAR FORMULARIO
    // =========================================================

    enviarFormulario(): void {
    if (this.formulario.invalid) {
    this.formulario.markAllAsTouched();
    return;
    }

    const datos: AsignacionRequest = this.formulario.getRawValue();

    this.guardar.emit(datos);

    }
}
