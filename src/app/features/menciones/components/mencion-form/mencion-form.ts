import { Component, effect, inject, input, output } from '@angular/core';
import { Mencion } from '../../models/mencion.interface';
import { MencionRequest } from '../../models/mencion-request.interface';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-mencion-form',
  imports: [ReactiveFormsModule],
  templateUrl: './mencion-form.html',
  styleUrl: './mencion-form.scss',
})
export class MencionForm {
  // Recibe una mencion cuando estamos editando
  readonly mencion=input<Mencion | null>(null);

  // Envia los datos al componente Padre
  readonly guardar =output<MencionRequest>();

  private readonly fb = inject(FormBuilder);

  // Crear Formulario con los datos
  readonly formulario=this.fb.nonNullable.group({
    mencion:[
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(150),
      ]
    ],
    
  })


   constructor(){
    effect(()=>{
      // Almacenar Mencion a editar
      const MencionActual =this.mencion();

      // verificar si hay datos en Mencion Actual
      if(MencionActual){
        // Almacenar los Valores a Editar en Formulario
        this.formulario.patchValue({
          mencion:MencionActual.mencion

        })
      }
      else{
        // Si no hay datos el formulario esta vacio
        this.formulario.reset({
          mencion:'',
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
      const datos: MencionRequest= this.formulario.getRawValue();
  
      this.guardar.emit(datos);
    }

}
