import { Component, effect, inject, input, output, signal } from '@angular/core';
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

 

@Component({
  selector: 'app-persona-form',
  imports: [ReactiveFormsModule],
  templateUrl: './persona-form.html',
  styleUrl: './persona-form.scss',
})
export class PersonaForm {
  // Recibe una persona cuando estamos editando
  readonly persona=input<Persona | null>(null);

  // Envia los datos al componente Padre
  readonly guardar =output<PersonaRequest>();

  private readonly fb = inject(FormBuilder);
  private readonly personasService = inject(PersonasService);
  // todas las personas cargadas una vez, para comparar documentos en memoria
  private readonly todasLasPersonas = signal<Persona[]>([]);


  // Crear Formulario con los datos
  readonly formulario=this.fb.nonNullable.group({
     pais_documento:[
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
      ]
    ],
    nro_documento:[
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30)
      ],
      [
        this.validarDocumentoUnico()
      ],
    ],
    nombres:[
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
      ]
    ],
    primer_apellido:[
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
      ]
    ],
    segundo_apellido:[
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
      ]
    ],
    celular:[
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20),
      ]
    ],
    observacion:[
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(255),
      ]
    ],
    fecha_nacimiento:[
      '',
      [
        Validators.required
      ]
    ],
    correo_electronico:[
      '',
      [
        Validators.required,
        Validators.email,
      ]
    ],

     id_mencion:[
       '',
       [
         Validators.required,
        
       ]
     ],
     id_rol:[
       '',
       [
         Validators.required
       ]
     ],
    
    fecha_fin:[
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(10),
      ]
    ],
    
    
   
    
     
  })


  // valida en memoria que el nro_documento no esté repetido,
  // ignorando a la propia persona cuando estamos editando
  private validarDocumentoUnico(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const valor = (control.value as string)?.trim();
      if (!valor) return of(null);

      const idActual = this.persona()?.id;

      const coincidencia = this.todasLasPersonas().find(
        p => p.nro_documento === valor && p.id !== idActual
      );

      return of(coincidencia ? { documentoDuplicado: true } : null);
    };
  }


 


  constructor(){
    // cargar personas una sola vez al iniciar el formulario
   this.cargarTodasLasPersonas();

    effect(()=>{
      // Almacenar Persona a editar
      const PersonaActual =this.persona();

      // verificar si hay datos en Persona Actual
      if(PersonaActual){
        // Almacenar los Valores a Editar en Formulario
        this.formulario.patchValue({
          pais_documento:PersonaActual.expedido,
          nro_documento: PersonaActual.nro_documento,
          nombres:PersonaActual.nombres,
          primer_apellido:PersonaActual.primer_apellido,
          segundo_apellido:PersonaActual.segundo_apellido, 
          celular:PersonaActual.celular,
          observacion:'', 
          fecha_nacimiento:'',
          correo_electronico:PersonaActual.correo_electronico,
          id_mencion:'',
          id_rol:'',
          fecha_fin:'',
        })
      }
      else{
        // Si no hay datos el formulario esta vacio
        this.formulario.reset({
          pais_documento:'',
          nro_documento: '',
          nombres:'',
          primer_apellido:'',
          segundo_apellido:'',
          celular:'',
          observacion:'',
          fecha_nacimiento:'',
          correo_electronico:'',
          id_mencion:'',
          id_rol:'',
          fecha_fin:'',
        })
      }
    })
  }

  //pide la página 1 para "descubrir" cuántas páginas hay en total, 
  // y si hace falta más de una, pide todas las restantes a la vez (no una por una) 
  // y las junta en un solo array antes de guardarlas.
  private cargarTodasLasPersonas(): void {
    const tamañoPagina = 200; // tamaño por request; ajusta si tu backend tiene su propio máximo

    // pide la PRIMERA página. Esta respuesta trae, además de los datos,
    // el "total" real de personas que existen — ese dato es la clave
    // para saber cuántas páginas MÁS hacen falta pedir.
    this.personasService.getPersonas(1, tamañoPagina).pipe(
      switchMap(primeraRespuesta => {
        const primeraTanda = primeraRespuesta.Data.filas;
        const total = primeraRespuesta.Data.total;
        const totalPaginas = Math.ceil(total / tamañoPagina);

        // si con la primera página ya alcanza para cubrir el total, no pide más
        if (totalPaginas <= 1) {
          return of(primeraTanda);
        }

        // arma un request por cada página restante (2, 3, 4...) y las junta todas
        const restoDePaginas = Array.from({ length: totalPaginas - 1 }, (_, i) =>
          this.personasService.getPersonas(i + 2, tamañoPagina)
        );

        return forkJoin(restoDePaginas).pipe(
          map(respuestas => [
            ...primeraTanda,
            ...respuestas.flatMap(r => r.Data.filas),
          ])
        );
      })
    ).subscribe({
      next: (todas) => this.todasLasPersonas.set(todas),
      error: (error) => console.error('Error al cargar personas para validar documento:', error),
    });
  }


  // Metodo Enviar Formulario
  enviarFormulario():void{
    // verificar formulario
    if (this.formulario.invalid || this.formulario.pending) {
      this.formulario.markAllAsTouched();
      return;
    }

    // si no es invalido guardar los datos y emitirlos
    // const datos: PersonaRequest= this.formulario.getRawValue();

    // this.guardar.emit(datos);
  }
}
