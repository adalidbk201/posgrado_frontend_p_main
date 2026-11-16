import { Component, effect, inject, input, output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActivarCuentaRequest } from '../../models/usuario.request.interface';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-activar-cuenta-form',
  imports: [ReactiveFormsModule],
  templateUrl: './activar-cuenta-form.html',
  styleUrl: './activar-cuenta-form.scss',
})
export class ActivarCuentaForm {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
 
  readonly guardar = output<ActivarCuentaRequest>();
  readonly usuario = input<string>('');
  private readonly fb = inject(FormBuilder);

 
  // El formulario 
  readonly formulario = this.fb.nonNullable.group({
   
      nombre_usuario: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(150),
        ],
      ],
      codigo: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(150),
        ],
      ],
  });

  

  cancelar(): void {
    if(this.usuario()=='Estudiante'){
      this.router.navigate(['/login']);
    }else{
      this.router.navigate(['/dashboard/usuarios']);
    }
    
  }

  constructor() {

    effect(() => {

      if(this.usuario()!='Estudiante'){

       this.formulario.patchValue({
        nombre_usuario: this.usuario(),
        
      });
    }
    });

    
    
    
  }

  enviarFormulario(): void {
    if (this.formulario.invalid || this.formulario.pending) {
      this.formulario.markAllAsTouched();
      return;
    }

    const v = this.formulario.getRawValue();

    const datos: ActivarCuentaRequest = {
      nombre_usuario: v.nombre_usuario.trim(),
      codigo:v.codigo,
       
    };

    this.guardar.emit(datos);
  }
}
