import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { forkJoin} from 'rxjs';

import { Persona } from '../../models/persona.interface';
import { PersonaRequest } from '../../models/persona-request.interface';
import { PersonasService } from '../../services/personas.service';
import { MencionesService } from '../../../menciones/services/menciones.service';
import { Mencion } from '../../../menciones/models/mencion.interface';
import { Programa } from '../../../programas/models/programa.interface';
import { ProgramasService } from '../../../programas/services/programas.service';

 

@Component({
  selector: 'app-persona-form',
  imports: [ReactiveFormsModule],
  templateUrl: './persona-form.html',
  styleUrl: './persona-form.scss',
})
export class PersonaForm {
   // Ya no recibe "persona" — este formulario es solo para CREAR
  readonly guardar = output<PersonaRequest>();

  // ID del programa seleccionado
  readonly programaSeleccionadoId = signal<string | null>(null);

  // Obtener únicamente las menciones del programa seleccionado
  readonly mencionesDelPrograma = computed(() => {
    const idPrograma = this.programaSeleccionadoId();

    if (!idPrograma) {
      return [];
    }

    const programa = this.programas().find(
      p => p.id === idPrograma
    );

    return programa?.menciones ?? [];
  });

  // Actualizar las menciones cuando cambia el programa
  alCambiarPrograma(): void {
    const idPrograma = this.formulario.controls.id_programa.value;

    this.programaSeleccionadoId.set(idPrograma || null);

    // Limpiar la mención anterior para evitar enviar una
    // mención que pertenezca a otro programa
    this.formulario.controls.id_mencion.reset(null);
  }

  private readonly fb = inject(FormBuilder);
  private readonly personasService = inject(PersonasService);
  
  private readonly programasService = inject(ProgramasService)

  private readonly todasLasPersonas = signal<Persona[]>([]);

  readonly formulario = this.fb.nonNullable.group({
    pais_documento: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    nro_documento: [
      '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(30)],
      [this.validarDocumentoUnico()],
    ],
    nombres: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    expedido:['', [Validators.required]],
    genero:['',[Validators.required]],
    primer_apellido: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    segundo_apellido: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    celular: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
    correo_electronico: ['', [Validators.required, Validators.email]],
    observacion: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
    fecha_nacimiento: ['', [Validators.required]],

    id_mencion: this.fb.control<number | null>(null, [
      Validators.required,
      Validators.min(1),
    ]),
    id_rol: this.fb.control<number | null>(null, [
      Validators.required,
      Validators.min(1),
    ]),
    fecha_fin: ['', [Validators.required]],
    id_programa:['',[Validators.required]],
  });

   


   // =========================
  // SELECTOR DE Programa
  // =========================
  readonly programas = signal<Programa[]>([]);
  readonly paginaPrograma = signal(1);
  readonly busquedaPrograma = signal('');
  readonly cargandoMasProgramas = signal(false);

  readonly programasFiltradas = computed(() => {
    const termino = this.busquedaPrograma().trim().toLowerCase();
    if (!termino) return this.programas();
    return this.programas().filter(p => `${p.nombre_programa}`.toLowerCase().includes(termino));
  });

  private cargarProgramas(pagina: number): void {
    this.cargandoMasProgramas.set(true);
    this.programasService.getProgramas(pagina, 100).subscribe({
      next: (respuesta) => {
        const nuevas = respuesta.Data.filas;
        this.programas.update(actual => {
          const idsExistentes = new Set(actual.map(m => m.id));
          return [...actual, ...nuevas.filter(m => !idsExistentes.has(m.id))];
        });
        this.paginaPrograma.set(pagina);
        this.cargandoMasProgramas.set(false);
      },
      error: () => this.cargandoMasProgramas.set(false),
    });
  }

  cargarMasProgramas(): void {
    this.cargarProgramas(this.paginaPrograma() + 1);
  }




  // Validar nro documento
  private validarDocumentoUnico(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const valor = (control.value as string)?.trim();
      if (!valor) return of(null);

      const coincidencia = this.todasLasPersonas().find(p => p.nro_documento === valor);
      return of(coincidencia ? { documentoDuplicado: true } : null);
    };
  }







  constructor() {
   
    this.cargarProgramas(1);
    this.cargarTodasLasPersonas();
  }

  private cargarTodasLasPersonas(): void {
    const tamañoPagina = 200;

    this.personasService.getPersonas(1, tamañoPagina).pipe(
      switchMap(primeraRespuesta => {
        const primeraTanda = primeraRespuesta.Data.filas;
        const total = primeraRespuesta.Data.total;
        const totalPaginas = Math.ceil(total / tamañoPagina);

        if (totalPaginas <= 1) return of(primeraTanda);

        const restoDePaginas = Array.from({ length: totalPaginas - 1 }, (_, i) =>
          this.personasService.getPersonas(i + 2, tamañoPagina)
        );

        return forkJoin(restoDePaginas).pipe(
          map(respuestas => [...primeraTanda, ...respuestas.flatMap(r => r.Data.filas)])
        );
      })
    ).subscribe({
      next: (todas) => this.todasLasPersonas.set(todas),
      error: (error) => console.error('Error al cargar personas para validar documento:', error),
    });
  }

  enviarFormulario(): void {
    if (this.formulario.invalid || this.formulario.pending) {
      this.formulario.markAllAsTouched();
      return;
    }

    const v = this.formulario.getRawValue();

    const datos: PersonaRequest = {
      persona: {
        pais_documento: v.pais_documento,
        nro_documento: v.nro_documento,
        nombres: v.nombres,
        primer_apellido: v.primer_apellido,
        segundo_apellido: v.segundo_apellido,
        expedido:v.expedido,
        genero:v.genero,
        celular: v.celular,
        observacion: v.observacion,
        fecha_nacimiento: v.fecha_nacimiento,
        correo_electronico: v.correo_electronico,
      },
      id_mencion: Number(v.id_mencion),
      id_rol: Number(v.id_rol),
      id_programa:v.id_programa,
      fecha_fin: v.fecha_fin,
    };

    console.log('DATOS ENVIADOS:', datos);
    this.guardar.emit(datos);
  }
}
