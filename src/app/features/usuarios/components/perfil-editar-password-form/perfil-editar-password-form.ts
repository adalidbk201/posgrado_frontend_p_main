import { Component, effect, inject, output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PasswordPerfil } from '../../models/usuario.request.interface';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-perfil-editar-password-form',
  imports: [ReactiveFormsModule],
  templateUrl: './perfil-editar-password-form.html',
  styleUrl: './perfil-editar-password-form.scss',
})
export class PerfilEditarPasswordForm {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
   
 
  readonly guardar = output<PasswordPerfil>();

  private readonly fb = inject(FormBuilder);

  readonly formulario = this.fb.nonNullable.group({
    contrasena_actual: [
      '',
      [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(150),
      ],
    ],
    contrasena_nueva: [
      '',
      [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(150),
      ],
    ],
    
  });

  cancelar(): void {
    this.router.navigate(['/dashboard/inicio']);
  }

  constructor() {
     
  }

  enviarFormulario(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.guardar.emit(this.formulario.getRawValue());
  }
}
