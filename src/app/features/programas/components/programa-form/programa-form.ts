import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { Programa } from '../../models/programa.interface';
import { ProgramaRequest } from '../../models/programa-request.interface';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { GradosService } from '../../../grados/services/grados.service';
import { Grado } from '../../../grados/models/grado.interface';
import { MencionesService } from '../../../menciones/services/menciones.service';
import { Mencion } from '../../../menciones/models/mencion.interface';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-programa-form',
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './programa-form.html',
  styleUrl: './programa-form.scss',
})
export class ProgramaForm {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  readonly guardar = output<ProgramaRequest>();

  private readonly fb = inject(FormBuilder);

  readonly formulario = this.fb.nonNullable.group({
    nombre_programa: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
      ]
    ],
    grado_academico: [null as number | null, [
      Validators.required,
      Validators.min(1),
    ]],
    menciones: [[] as number[], [
      Validators.required,
      Validators.minLength(1),
    ]],
  });

  // =========================
  // SELECTOR DE GRADO ACADEMICO
  // =========================
  private readonly gradosService = inject(GradosService);
  readonly grados = signal<Grado[]>([]);
  readonly paginaGrado = signal(1);
  readonly busquedaGrado = signal('');
  readonly cargandoMasGrados = signal(false);

  readonly gradosFiltradas = computed(() => {
    const termino = this.busquedaGrado().trim().toLowerCase();
    if (!termino) return this.grados();

    return this.grados().filter(g =>
      `${g.grado_academico} ${g.jerarquia}`
        .toLowerCase()
        .includes(termino)
    );
  });

  private cargarGrados(pagina: number): void {
    this.cargandoMasGrados.set(true);

    this.gradosService.getGrados(pagina, 100).subscribe({
      next: (respuesta) => {
        const nuevas = respuesta.Data.filas;

        this.grados.update(actual => {
          const idsExistentes = new Set(actual.map(p => p.id));
          const sinDuplicar = nuevas.filter(p => !idsExistentes.has(p.id));
          return [...actual, ...sinDuplicar];
        });

        this.paginaGrado.set(pagina);
        this.cargandoMasGrados.set(false);
      },
      error: () => this.cargandoMasGrados.set(false),
    });
  }

  cargarMasGrados(): void {
    this.cargarGrados(this.paginaGrado() + 1);
  }

  // =========================
  // SELECTOR DE MENCIÓN
  // =========================
  private readonly mencionesService = inject(MencionesService);
  readonly menciones = signal<Mencion[]>([]);
  readonly paginaMencion = signal(1);
  readonly busquedaMencion = signal('');
  readonly cargandoMasMenciones = signal(false);

  readonly mencionesFiltradas = computed(() => {
    const termino = this.busquedaMencion().trim().toLowerCase();
    if (!termino) return this.menciones();

    return this.menciones().filter(m =>
      `${m.mencion}`
        .toLowerCase()
        .includes(termino)
    );
  });

  private cargarMenciones(pagina: number): void {
    this.cargandoMasMenciones.set(true);

    this.mencionesService.getMenciones(pagina, 100).subscribe({
      next: (respuesta) => {
        const nuevas = respuesta.Data.filas;

        this.menciones.update(actual => {
          const idsExistentes = new Set(actual.map(p => p.id));
          const sinDuplicar = nuevas.filter(p => !idsExistentes.has(p.id));
          return [...actual, ...sinDuplicar];
        });

        this.paginaMencion.set(pagina);
        this.cargandoMasMenciones.set(false);
      },
      error: () => this.cargandoMasMenciones.set(false),
    });
  }

  cargarMasMenciones(): void {
    this.cargarMenciones(this.paginaMencion() + 1);
  }

   cancelar(): void {
    this.router.navigate(['/dashboard/programas']);
  }

  constructor() {
    this.cargarGrados(1);
    this.cargarMenciones(1);

    // Debug: escuchar cambios
    this.formulario.controls.menciones.valueChanges.subscribe(valores => {
      console.log('Menciones seleccionadas:', valores);
    });
  }

  enviarFormulario(): void {
    if (this.formulario.invalid || this.formulario.pending) {
      this.formulario.markAllAsTouched();
      
      console.log('Formulario inválido');
      console.log('nombre_programa:', this.formulario.controls.nombre_programa.errors);
      console.log('grado_academico:', this.formulario.controls.grado_academico.errors);
      console.log('menciones:', this.formulario.controls.menciones.errors);
      console.log('menciones valor:', this.formulario.controls.menciones.value);
      
      return;
    }

    const v = this.formulario.getRawValue();

    const datos: ProgramaRequest = {
      nombre_programa: v.nombre_programa.trim(),
      grado_academico: v.grado_academico!,
      menciones: v.menciones,
    };

    console.log('DATOS ENVIADOS:', datos);
    this.guardar.emit(datos);
  }


}
