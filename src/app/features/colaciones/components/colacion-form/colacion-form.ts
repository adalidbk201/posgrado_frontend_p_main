import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { Colacion } from '../../models/colacion.interface';
import { ColacionRequest } from '../../models/colacion-request.interface';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SalasService } from '../../../salas/services/salas.service';
import { Sala } from '../../../salas/models/sala.interface';

@Component({
  selector: 'app-colacion-form',
  imports: [ReactiveFormsModule],
  templateUrl: './colacion-form.html',
  styleUrl: './colacion-form.scss',
})
export class ColacionForm {
  // Recibe una colacion cuando estamos editando
  readonly colacion=input<Colacion | null>(null);

  // Envia los datos al componente Padre
  readonly guardar =output<ColacionRequest>();

  private readonly fb = inject(FormBuilder);

   // Crear Formulario con los datos
  readonly formulario=this.fb.nonNullable.group({
    fecha_colacion:[
      '',
      [
        Validators.required,
         
      ]
    ],
    turno:[
      '',
      [
        Validators.required,
       
      ]
    ],
    descripcion:[
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(150),
      ]
    ],
    sala:[
      '',
      [
        Validators.required,
       
      ]
    ],
    
  })

  // =========================
    // SELECTOR DE SALA
    // =========================
    private readonly salasService = inject(SalasService)
    // lista de salas cargada desde el backend (paginada)
    readonly salas = signal<Sala[]>([])

    // página actual del listado de salas
    readonly paginaSala = signal(1);

    // texto escrito en el buscador (filtra del lado del cliente)
    readonly busquedaSala = signal('');

    // indica si se está trayendo una página adicional
    readonly cargandoMasSalas = signal(false);

    // grados visibles en el select, filtradas por el texto de búsqueda
    readonly salasFiltradas = computed(() => {
      const termino = this.busquedaSala().trim().toLowerCase();
      if (!termino) return this.salas();

      return this.salas().filter(s =>
        `${s.estado} ${s.nombre_sala}`
          .toLowerCase()
          .includes(termino)
      );
    });

    // Metodo cargarSalas
     // trae una página de salas y la agrega a la lista, sin duplicar
    private cargarSalas(pagina: number): void {
      this.cargandoMasSalas.set(true);

      this.salasService.getSalas(pagina, 100).subscribe({
        next: (respuesta) => {
          const nuevas = respuesta.Data.filas;

          this.salas.update(actual => {
            const idsExistentes = new Set(actual.map(p => p.id));
            const sinDuplicar = nuevas.filter(p => !idsExistentes.has(p.id));
            return [...actual, ...sinDuplicar];
          });

          this.paginaSala.set(pagina);
          this.cargandoMasSalas.set(false);
        },
        error: () => this.cargandoMasSalas.set(false),
      });
    }

    // botón "cargar más" del template
    cargarMasSalas(): void {
      this.cargarSalas(this.paginaSala() + 1);
    }

    // si estamos editando y el grado asignada no vino en la página cargada,
    // la trae aparte para que el select no se vea vacío
    private asegurarSalaEnLista(idSala: string): void {
      if (!idSala) return;

      const yaExiste = this.salas().some(s => s.id === idSala);
      if (yaExiste) return;

      this.salasService.getSalaPorId(idSala).subscribe({
        next: (respuesta) => {
          this.salas.update(actual => [respuesta.Data, ...actual]);
        },
      });
    }





  constructor(){
     // cargar la primera página de grados al iniciar el formulario
    this.cargarSalas(1);
    effect(()=>{
      // Almacenar Colacion a editar
      const ColacionActual =this.colacion();

      // verificar si hay datos en Colacion Actual
      if(ColacionActual){
        // Almacenar los Valores a Editar en Formulario
        this.formulario.patchValue({

          fecha_colacion: ColacionActual.fecha_colacion,
          turno:ColacionActual.turno,
          descripcion:ColacionActual.descripcion,
          sala:ColacionActual.sala.id

        })

        // asegura que la sala ya asignado aparezca en el select,
        // aunque no esté dentro de la primera página cargada
        this.asegurarSalaEnLista(ColacionActual.sala.id);
      }
      else{
        // Si no hay datos el formulario esta vacio
        this.formulario.reset({
           fecha_colacion:'',
           turno:'',
           descripcion:'',
           sala:'',
        })
      }
    })
  }

  // Metodo Enviar Formulario
  enviarFormulario():void{
    // verificar formulario
    if(this.formulario.invalid){
      // Marcar todos los campos del formulario
      this.formulario.markAllAsTouched();
      return;
    }

    // si no es invalido guardar los datos y emitirlos
    const datos: ColacionRequest= this.formulario.getRawValue();

    this.guardar.emit(datos);
  }




}
