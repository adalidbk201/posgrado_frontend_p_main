import { Component, effect,inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

 import { Persona } from '../../models/persona.interface';
 import { PersonaRequest } from '../../models/persona-request.interface';
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

  // Crear Formulario con los datos
  readonly formulario=this.fb.nonNullable.group({
    nro_documento:[
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30),
      ]
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
    expedido:[
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30),
      ]
    ],
    genero:[
      '',
      [
        Validators.required
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
    codigo_verificacion:[
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(10),
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
    ]
  })


  constructor(){
    effect(()=>{
      // Almacenar Persona a editar
      const PersonaActual =this.persona();

      // verificar si hay datos en Persona Actual
      if(PersonaActual){
        // Almacenar los Valores a Editar en Formulario
        this.formulario.patchValue({

          nro_documento: PersonaActual.nro_documento,
          nombres:PersonaActual.nombres,
          primer_apellido:PersonaActual.primer_apellido,
          segundo_apellido:PersonaActual.segundo_apellido,
          expedido:PersonaActual.expedido,
          genero:PersonaActual.genero,
          celular:PersonaActual.celular,
          codigo_verificacion:PersonaActual.codigo_verificacion,
          observacion:PersonaActual.observacion,
          fecha_nacimiento:PersonaActual.fecha_nacimiento,

        })
      }
      else{
        // Si no hay datos el formulario esta vacio
        this.formulario.reset({
          nro_documento: '',
          nombres:'',
          primer_apellido:'',
          segundo_apellido:'',
          expedido:'',
          genero:'',
          celular:'',
          codigo_verificacion:'',
          observacion:'',
          fecha_nacimiento:'',
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
    const datos: PersonaRequest= this.formulario.getRawValue();

    this.guardar.emit(datos);
  }
}
