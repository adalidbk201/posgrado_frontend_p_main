import { Component, inject, output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ValidarRecuperarRequest } from '../../models/usuario.request.interface';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-validar-recuperar-form',
  imports: [ReactiveFormsModule],
  templateUrl: './validar-recuperar-form.html',
  styleUrl: './validar-recuperar-form.scss',
})
export class ValidarRecuperarForm {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
 
    readonly guardar = output<ValidarRecuperarRequest>();
  
    private readonly fb = inject(FormBuilder);
     
  // El formulario  
  readonly formulario = this.fb.nonNullable.group({
     codigo: ['',
        Validators.required,
        Validators.minLength(30),
        Validators.maxLength(100),
     ],
  });

 

  cancelar(): void {
    this.router.navigate(['/dashboard/inicio']);
  }

  constructor() {
    
  }

  enviarFormulario(): void {
    if (this.formulario.invalid || this.formulario.pending) {
      this.formulario.markAllAsTouched();
      return;
    }

    const v = this.formulario.getRawValue();

    const datos: ValidarRecuperarRequest = {
      codigo: v.codigo,

      
    };

    this.guardar.emit(datos);
  }
}
