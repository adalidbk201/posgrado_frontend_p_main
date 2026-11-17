import { Component, effect, inject, output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PasswordPerfil } from '../../models/usuario.request.interface';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';

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

  // Control de visibilidad de contraseñas
  showActual = false;
  showNueva = false;
  showConfirmar = false;

  // Fortaleza de contraseña
  passwordStrength: 'weak' | 'medium' | 'strong' = 'weak';

  readonly formulario = this.fb.group({
    contrasena_actual: ['', [Validators.required, Validators.minLength(5)]],
    contrasena_nueva: ['', [Validators.required, Validators.minLength(5)]],
    confirmar_password: ['', Validators.required],
  }, { validators: this.passwordMatchValidator });

  // Validador personalizado para verificar que las contraseñas coincidan
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const nueva = control.get('contrasena_nueva');
    const confirmar = control.get('confirmar_password');
    
    if (nueva && confirmar && nueva.value !== confirmar.value) {
      confirmar.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }

  // Verificar fortaleza de contraseña
  checkPasswordStrength(): void {
    const password = this.formulario.controls.contrasena_nueva.value || '';
    
    if (password.length < 5) {
      this.passwordStrength = 'weak';
    } else if (this.hasUpperCase() && this.hasNumber()) {
      this.passwordStrength = 'strong';
    } else {
      this.passwordStrength = 'medium';
    }
  }

  getStrengthText(): string {
    const texts = {
      weak: 'Débil',
      medium: 'Media',
      strong: 'Fuerte'
    };
    return texts[this.passwordStrength];
  }

  hasUpperCase(): boolean {
    const password = this.formulario.controls.contrasena_nueva.value || '';
    return /[A-Z]/.test(password);
  }
 hasNumber(): boolean {
    const password = this.formulario.controls.contrasena_nueva.value || '';
    return /[0-9]/.test(password);
  }

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

    const valor = this.formulario.getRawValue();

    // Construcción explícita garantizando que no hay null
    const datos: PasswordPerfil = {
      contrasena_actual: valor.contrasena_actual ?? '',
      contrasena_nueva: valor.contrasena_nueva ?? '',
    
    };

    this.guardar.emit(datos);
  }
}
