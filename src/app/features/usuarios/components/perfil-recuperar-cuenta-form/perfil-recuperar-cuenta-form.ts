import { Component, effect, inject, input, output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecuperarCuentaRequest } from '../../models/usuario.request.interface';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-perfil-recuperar-cuenta-form',
  imports: [ReactiveFormsModule],
  templateUrl: './perfil-recuperar-cuenta-form.html',
  styleUrl: './perfil-recuperar-cuenta-form.scss',
})
export class PerfilRecuperarCuentaForm {
    private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
 
    readonly guardar = output<RecuperarCuentaRequest>();
  
    private readonly fb = inject(FormBuilder);
    readonly email = input<string>('');
  // El formulario  
  readonly formulario = this.fb.nonNullable.group({
     correo_electronico: ['', [Validators.required, Validators.email]],
  });

 

  cancelar(): void {
    this.router.navigate(['/dashboard/inicio']);
  }

  constructor() {
    // effect(() => {
      

    //   this.formulario.patchValue({
    //     correo_electronico: this.email().trim(),
    //   });

    // });
  }

  enviarFormulario(): void {
    if (this.formulario.invalid || this.formulario.pending) {
      this.formulario.markAllAsTouched();
      return;
    }

    const v = this.formulario.getRawValue();

    const datos: RecuperarCuentaRequest = {
      correo_electronico: v.correo_electronico,

      
    };

    this.guardar.emit(datos);
  }
}
