import { Component, effect, inject, input, output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Asistencia } from '../../models/asistencia.interface';
import { AsistenciaEditarRequest } from '../../models/asistencia-request.interfacace';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-asistencia-editar-form',
  imports: [ReactiveFormsModule],
  templateUrl: './asistencia-editar-form.html',
  styleUrl: './asistencia-editar-form.scss',
})
export class AsistenciaEditarForm {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  readonly asistencia = input<Asistencia | null>(null);
  readonly nombre_titulado = input<string>('');
  readonly guardar = output<AsistenciaEditarRequest>();

  private readonly fb = inject(FormBuilder);

  readonly formulario = this.fb.nonNullable.group({
    asistencia: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(150),
      ],
    ],
    
  });

  cancelar(): void {
    this.router.navigate(['/dashboard/asistencias']);
  }

  constructor() {
    effect(() => {
      const s = this.asistencia();
      if (!s) return;

      this.formulario.patchValue({
        asistencia: s.asistencia,
      });
    });
  }

  enviarFormulario(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.guardar.emit(this.formulario.getRawValue());
  }
}
