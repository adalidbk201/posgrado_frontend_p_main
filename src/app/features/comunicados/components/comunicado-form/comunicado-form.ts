import { Component, effect, inject, input, output, signal } from '@angular/core';
import { Comunicado } from '../../models/comunicado.interface';
import { ComunicadoRequest } from '../../models/comunicado-request.interface';
import { FormBuilder, Validators } from '@angular/forms';
import { ComunicadosService } from '../../services/comunicados.service';

@Component({
  selector: 'app-comunicado-form',
  imports: [],
  templateUrl: './comunicado-form.html',
  styleUrl: './comunicado-form.scss',
})
export class ComunicadoForm {
  // Recibe un comunicado cuando estamos editando
  readonly comunicado=input<Comunicado | null>(null);

  // Envia los datos al componente Padre
  readonly guardar =output<ComunicadoRequest>();

  private readonly fb = inject(FormBuilder);
  private readonly comunicadosService = inject(ComunicadosService);
  // todas los comunicados cargados una vez, para comparar documentos en memoria
  private readonly todasLasComunicados = signal<Comunicado[]>([]);

  
  // Crear Formulario con los datos
  readonly formulario=this.fb.nonNullable.group({
     foto:[
      '',
      [
        Validators.required,
    
      ]
    ],
    fecha_expiracion:[
      '',
      [
        Validators.required,
        
      ],
       
    ],
    descripcion:[
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(150),
      ]
    ],
    colaciones:[
      [''],
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
      ]
    ],
    
     
  })


  constructor(){
 

    effect(()=>{
      // Almacenar Comunicado a editar
      const ComunicadoActual =this.comunicado();

      // verificar si hay datos en Comunicado Actual
      if(ComunicadoActual){
        // Almacenar los Valores a Editar en Formulario
        this.formulario.patchValue({
          foto:'',
          fecha_expiracion:ComunicadoActual.fecha_expiracion,
          descripcion:ComunicadoActual.descripcion,
          colaciones:[ComunicadoActual.colaciones[0].id],
         
        })
      }
      else{
        // Si no hay datos el formulario esta vacio
        this.formulario.reset({
          foto:'',
          fecha_expiracion:'',
          descripcion:'',
          colaciones:[''],
        })
      }
    })
  }



  // Metodo Enviar Formulario
  enviarFormulario():void{
    // verificar formulario
    if (this.formulario.invalid || this.formulario.pending) {
      this.formulario.markAllAsTouched();
      return;
    }

    // si no es invalido guardar los datos y emitirlos
    const datos: ComunicadoRequest= this.formulario.getRawValue();

    this.guardar.emit(datos);
  }

  
}
