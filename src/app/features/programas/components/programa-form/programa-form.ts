import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { Programa } from '../../models/programa.interface';
import { ProgramaRequest } from '../../models/programa-request.interface';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { GradosService } from '../../../grados/services/grados.service';
import { Grado } from '../../../grados/models/grado.interface';
import { MencionesService } from '../../../menciones/services/menciones.service';
import { Mencion } from '../../../menciones/models/mencion.interface';

@Component({
  selector: 'app-programa-form',
  imports: [ReactiveFormsModule],
  templateUrl: './programa-form.html',
  styleUrl: './programa-form.scss',
})
export class ProgramaForm {
    // Ya no recibe "programa" — este formulario es solo para CREAR
  // Envia los datos al componente Padre
  readonly guardar =output<ProgramaRequest>();

  private readonly fb = inject(FormBuilder);

  // Crear Formulario con los datos
  readonly formulario=this.fb.nonNullable.group({
    nombre_programa:[
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
      ]
    ],
    grado_academico: this.fb.control<number | null>(null, [
      Validators.required,
      Validators.min(1),
    ]),
    menciones: this.fb.control<number[]>([], [
      Validators.required,
    ]),

  })


   // =========================
    // SELECTOR DE GRADO ACADEMICO
    // =========================
    private readonly gradosService = inject(GradosService)
    // lista de grados cargada desde el backend (paginada)
    readonly grados = signal<Grado[]>([])

    // página actual del listado de grados
    readonly paginaGrado = signal(1);

    // texto escrito en el buscador (filtra del lado del cliente)
    readonly busquedaGrado = signal('');

    // indica si se está trayendo una página adicional
    readonly cargandoMasGrados = signal(false);

    // grados visibles en el select, filtradas por el texto de búsqueda
    readonly gradosFiltradas = computed(() => {
      const termino = this.busquedaGrado().trim().toLowerCase();
      if (!termino) return this.grados();

      return this.grados().filter(g =>
        `${g.grado_academico} ${g.jerarquia}`
          .toLowerCase()
          .includes(termino)
      );
    });

    // Metodo cargarGrados
     // trae una página de grados y la agrega a la lista, sin duplicar
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

    // botón "cargar más" del template
    cargarMasGrados(): void {
      this.cargarGrados(this.paginaGrado() + 1);
    }

    // si estamos editando y el grado asignada no vino en la página cargada,
    // la trae aparte para que el select no se vea vacío
    private asegurarGradoEnLista(idGrado: number): void {
      if (!idGrado) return;

      const yaExiste = this.grados().some(p => p.id === idGrado);
      if (yaExiste) return;

      this.gradosService.getGradoPorId(idGrado).subscribe({
        next: (respuesta) => {
          this.grados.update(actual => [respuesta.Data, ...actual]);
        },
      });
    }


     // =========================
        // SELECTOR DE MENCIÓN
        // =========================
        private readonly mencionesService = inject(MencionesService)
        // lista de menciones cargada desde el backend (paginada)
        readonly menciones = signal<Mencion[]>([])
    
        // página actual del listado de menciones
        readonly paginaMencion = signal(1);
    
        // texto escrito en el buscador (filtra del lado del cliente)
        readonly busquedaMencion = signal('');
    
        // indica si se está trayendo una página adicional
        readonly cargandoMasMenciones = signal(false);
    
        // menciones visibles en el select, filtradas por el texto de búsqueda
        readonly mencionesFiltradas = computed(() => {
          const termino = this.busquedaMencion().trim().toLowerCase();
          if (!termino) return this.menciones();
    
          return this.menciones().filter(m =>
            `${m.mencion}`
              .toLowerCase()
              .includes(termino)
          );
        });
    
        // Metodo cargarMenciones
         // trae una página de menciones y la agrega a la lista, sin duplicar
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
    
        // botón "cargar más" del template
        cargarMasMenciones(): void {
          this.cargarMenciones(this.paginaMencion() + 1);
        }
    
        // si estamos editando y la mencion asignada no vino en la página cargada,
        // la trae aparte para que el select no se vea vacío
        private asegurarMencionEnLista(idMencion: number): void {
          if (!idMencion) return;
    
          const yaExiste = this.menciones().some(p => p.id === idMencion);
          if (yaExiste) return;
    
          this.mencionesService.getMencionPorId(idMencion).subscribe({
            next: (respuesta) => {
              this.menciones.update(actual => [respuesta.Data, ...actual]);
            },
          });
        }
    

    
    

   constructor(){
    // cargar la primera página de grados al iniciar el formulario
    this.cargarGrados(1);
    // cargar la primera página de menciones al iniciar el formulario
    this.cargarMenciones(1);

     
  }

  // Metodo Enviar Formulario
 
    // Método para enviar el formulario de programa
    enviarFormulario(): void {
      // Verificar si el formulario es inválido o tiene validaciones pendientes
      if (this.formulario.invalid || this.formulario.pending) {
        // Mostrar los errores de validación de los campos
        this.formulario.markAllAsTouched();
        return;
      }

      // Obtener los valores actuales del formulario
      const v = this.formulario.getRawValue();

      // Construir el objeto con el formato que espera el backend
      const datos: ProgramaRequest = {
        nombre_programa: v.nombre_programa.trim(),
        grado_academico: v.grado_academico,
        menciones: v.menciones,
      };

      // Mostrar los datos que se enviarán al componente padre
      console.log('DATOS ENVIADOS:', datos);

      // Emitir los datos para que el componente padre los envíe al backend
      this.guardar.emit(datos);
    }
 


}
