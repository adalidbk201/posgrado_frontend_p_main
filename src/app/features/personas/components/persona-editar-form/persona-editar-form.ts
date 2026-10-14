import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Persona } from '../../models/persona.interface';
import { ActualizarPerfil, ActualizarPersona } from '../../models/persona-request.interface';
import { Programa } from '../../../programas/models/programa.interface';
import { ProgramasService } from '../../../programas/services/programas.service';

 
@Component({
  selector: 'app-persona-editar-form',
  imports: [ReactiveFormsModule],
  templateUrl: './persona-editar-form.html',
  styleUrl: './persona-editar-form.scss',
})
export class PersonaEditarForm { 
   readonly persona = input<Persona | null>(null);
    
    readonly guardar = output<ActualizarPersona>();

     private readonly programasService = inject(ProgramasService)
  
    private readonly fb = inject(FormBuilder);
  

    // Buscar menciones del programa 
    
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

      // Actualizar el programa seleccionado
      this.programaSeleccionadoId.set(idPrograma || null);

      // Buscar el programa seleccionado
      const programa = this.programas().find(
        p => p.id === idPrograma
      );

      // Actualizar el grado académico asociado al programa
      this.formulario.controls.id_grado.setValue(
        programa?.grado?.id ?? null
      );

      // Limpiar la mención anterior para evitar enviar una
      // mención que pertenezca a otro programa
      this.formulario.controls.id_mencion.reset(null);
    }

    // obtener nombre_grado
    readonly nombreGradoSeleccionado = computed(() => {
    const idPrograma = this.programaSeleccionadoId();

    const programa = this.programas().find(
      p => p.id === idPrograma
    );

    return programa?.grado?.grado_academico ?? '';
  });





    readonly formulario = this.fb.nonNullable.group({
   
    nro_documento: [
      '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(30)],
     
    ],
    nombres: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    
    primer_apellido: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    segundo_apellido: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    celular: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
   
    observacion: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
    correo_electronico: ['', [Validators.required, Validators.email]],
    fecha_nacimiento: ['', [Validators.required]],

     id_grado: this.fb.control<number | null>(null, [
      Validators.required,
      Validators.min(1),
    ]),

    id_mencion: this.fb.control<number | null>(null, [
      Validators.required,
      Validators.min(1),
    ]),
    
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




  
    constructor() {
      this.cargarProgramas(1);
      
      effect(() => {
        const p = this.persona();
        if (!p) return;
        
        // obtener la mencion 
        const titulado = p.titulado;
        const idPrograma = titulado?.programa?.id ?? '';
        const idMencion = titulado?.mencion?.id ?? null;
        const idGrado = titulado?.grado?.id ?? null;
        // Actualizar la señal que determina las menciones visibles
        this.programaSeleccionadoId.set(idPrograma || null);

        
        this.formulario.patchValue({
           nro_documento:p.nro_documento,
           nombres:p.nombres,
           primer_apellido:p.primer_apellido,
           segundo_apellido:p.segundo_apellido,
           celular:p.celular,
           observacion:"",
           fecha_nacimiento:"",
           correo_electronico:p.correo_electronico,
           id_grado:p.titulado.grado.id,
           id_programa:p.titulado.programa.id,
           id_mencion:p.titulado.mencion.id,

        });
      });
    }
  
    enviarFormulario(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const valores = this.formulario.getRawValue();

    const datos: ActualizarPersona = {
      persona: {
        nro_documento: valores.nro_documento,
        nombres: valores.nombres,
        primer_apellido: valores.primer_apellido,
        segundo_apellido: valores.segundo_apellido,
        celular: valores.celular,
        observacion: valores.observacion,
        fecha_nacimiento: valores.fecha_nacimiento,
        correo_electronico: valores.correo_electronico,
      },
      id_grado: valores.id_grado!,
      id_programa: valores.id_programa,
      id_mencion: valores.id_mencion!,
    };

    this.guardar.emit(datos);
  }
}
