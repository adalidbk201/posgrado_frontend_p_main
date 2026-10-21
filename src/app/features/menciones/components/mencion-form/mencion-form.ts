import { Component, effect, inject, input, output, signal } from '@angular/core';
import { Mencion } from '../../models/mencion.interface';
import { MencionRequest } from '../../models/mencion-request.interface';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-mencion-form',
  imports: [ReactiveFormsModule],
  templateUrl: './mencion-form.html',
  styleUrl: './mencion-form.scss',
})
export class MencionForm {
   private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  // Signal para detectar modo edición
  readonly esEdicion = signal(false);

  // Recibe una mencion cuando estamos editando
  readonly mencion=input<Mencion | null>(null);

  // Envia los datos al componente Padre
  readonly guardar =output<MencionRequest>();

  private readonly fb = inject(FormBuilder);


  ngOnInit(): void {
    // Detectar si estamos en modo edición
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.esEdicion.set(true);
      this.cargarMencion(id);
    }
  }

  cargarMencion(id: string): void {
    // Implementar lógica para cargar datos de la mención
    console.log('Cargar mención:', id);
  }

  cancelar(): void {
    this.router.navigate(['/dashboard/menciones']);
  }


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
