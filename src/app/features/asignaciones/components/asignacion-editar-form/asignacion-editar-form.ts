import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  selector: 'app-asignacion-editar-form',
  imports: [ReactiveFormsModule],
  templateUrl: './asignacion-editar-form.html',
  styleUrl: './asignacion-editar-form.scss',
})
export class AsignacionEditarForm {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  readonly asignacion = input<Asignacion | null>(null);
 
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
    nivel: [''],
    
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
      console.log('Cambio de colación:', idColacion);

      // Actualizar el estado y el formulario.
      this.colacionSeleccionadaId.set(idColacion || null);
      this.formulario.controls.colacion.setValue(idColacion);

      // Invalidar respuestas de solicitudes anteriores.
      this.solicitudButacas++;

      // Limpiar las selecciones anteriores.
      this.nivelSeleccionadoId.set(null);

      this.formulario.patchValue({
        nivel: '',
        butaca: ''
      });

      // Vaciar las listas anteriores.
      this.nivelesSala.set([]);
      this.butacas.set([]);
      this.cargandoButacas.set(false);

      if (!idColacion) {
        console.log('Se limpió la selección de colación.');
        return;
      }

      const colacion = this.colaciones().find(
        c => String(c.id) === String(idColacion)
      );

      if (!colacion?.sala?.id) {
        console.error('No se encontró la sala de la colación:', colacion);
        return;
      }

      const idSala = String(colacion.sala.id);

      console.log('Sala de la nueva colación:', idSala);

      this.cargarNivelesSala(idSala);

      console.log('Nivel después del cambio:', this.formulario.controls.nivel.value);
      console.log('Butaca después del cambio:', this.formulario.controls.butaca.value);
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
    readonly nivelesSala = signal<Nivel[]>([]);
    // metodo cargar niveles de sala
    // Cargar niveles desde la sala seleccionada
      // Cargar niveles desde la sala asociada a la colación.
      private cargarNivelesSala(
        idSala: string,
        idNivelInicial?: string,
        idButacaInicial?: string
      ): void {
        const sala = this.salas().find(
          sala => String(sala.id) === String(idSala)
        );

        if (!sala) {
          console.error('No se encontró la sala:', idSala);
          return;
        }

        const niveles: Nivel[] = sala.niveles ?? [];

        this.nivelesSala.set(niveles);

        if (!idNivelInicial) {
          this.nivelSeleccionadoId.set(null);
          this.butacas.set([]);
          this.formulario.controls.butaca.setValue('');
          return;
        }

        const nivelExiste = niveles.some(
          nivel => String(nivel.id) === String(idNivelInicial)
        );

        if (!nivelExiste) {
          console.error('El nivel no pertenece a la sala:', idNivelInicial);
          this.nivelSeleccionadoId.set(null);
          return;
        }

        this.nivelSeleccionadoId.set(idNivelInicial);
        this.formulario.controls.nivel.setValue(idNivelInicial);

        console.log('Nivel seleccionado:', this.nivelSeleccionadoId());
        console.log('Niveles disponibles:', this.nivelesSala());

        this.cargarButacas(idNivelInicial, idButacaInicial);
      }
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
      this.formulario.controls.nivel.setValue(idNivel);

      this.butacas.set([]);
      this.formulario.controls.butaca.setValue('');

      if (!idNivel) {
        return;
      }

      this.cargarButacas(idNivel);
    }

    // =========================================================
    // CARGAR BUTACAS POR NIVEL
    // =========================================================

    private cargarButacas(
      idNivel: string,
      idButacaInicial?: string
    ): void {
      const solicitudActual = ++this.solicitudButacas;

      this.cargandoButacas.set(true);
      this.butacas.set([]);
      this.formulario.controls.butaca.setValue('');

      this.butacasService.getButacas(idNivel, 1, 100).subscribe({
        next: respuesta => {
          // Ignorar respuestas de solicitudes anteriores.
          if (solicitudActual !== this.solicitudButacas) {
            return;
          }

          // Confirmar que el nivel sigue seleccionado.
          if (this.nivelSeleccionadoId() !== idNivel) {
            this.cargandoButacas.set(false);
            return;
          }

          this.butacas.set(respuesta.Data);

          if (
            idButacaInicial &&
            respuesta.Data.some(
              butaca => String(butaca.id) === String(idButacaInicial)
            )
          ) {
            this.formulario.controls.butaca.setValue(idButacaInicial);
          }

          this.cargandoButacas.set(false);
        },

        error: error => {
          if (solicitudActual !== this.solicitudButacas) {
            return;
          }

          console.error('Error al cargar butacas:', error);
          this.butacas.set([]);
          this.formulario.controls.butaca.setValue('');
          this.cargandoButacas.set(false);
        }
      });
    }

  cancelar(): void {
    this.router.navigate(['/dashboard/asignaciones']);
  }

  private inicializacionAplicada = false;
  private solicitudButacas = 0;
  constructor() {
    // Cargar colaciones.
    this.cargarColaciones(1);

    // Cargar personas.
    this.cargarPersonas(1);

    // Cargar salas y sus niveles.
    this.cargarSalas(1);
    
    effect(() => {
      const asignacion = this.asignacion();
      const colaciones = this.colaciones();
      const salas = this.salas();

      if (
        this.inicializacionAplicada ||
        !asignacion ||
        !colaciones.length ||
        !salas.length
      ) {
        return;
      }

      const idColacion = String(asignacion.colacion);

      const colacion = colaciones.find(
        c => String(c.id) === idColacion
      );

      if (!colacion) {
        return;
      }

      const idButaca = String(asignacion.butaca.id);
      const idNivel = String(asignacion.butaca.nivel);
      const idSala = String(colacion.sala.id);

      // Marcar antes de restaurar los datos.
      this.inicializacionAplicada = true;

      this.colacionSeleccionadaId.set(idColacion);

      this.formulario.patchValue({
        colacion: idColacion,
        titulado: String(asignacion.titulado),
        nivel: idNivel,
        butaca: idButaca
      });

      this.cargarNivelesSala(
        idSala,
        idNivel,
        idButaca
      );
    });
  }

    enviarFormulario(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.guardar.emit({
      colacion: this.formulario.controls.colacion.value,
      titulado: this.formulario.controls.titulado.value,
      butaca: this.formulario.controls.butaca.value
    });
  }
}
