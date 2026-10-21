import { Component, effect, inject, input, output } from '@angular/core';
import { Butaca } from '../../models/butaca.interface';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButacaEditarRequest } from '../../models/butaca-request.interface';

@Component({
  selector: 'app-butaca-editar-form',
  imports: [ReactiveFormsModule],
  templateUrl: './butaca-editar-form.html',
  styleUrl: './butaca-editar-form.scss',
})
export class ButacaEditarForm {
  readonly butaca = input<Butaca | null>(null);
  // readonly nombre_sala = input<string>('');
  readonly guardar = output<ButacaEditarRequest>();

  private readonly fb = inject(FormBuilder);

  readonly formulario = this.fb.nonNullable.group({
    fila: this.fb.control<number | null>(null, [
      Validators.required,
      Validators.min(1),
    ]),
    columna: this.fb.control<number | null>(null, [
      Validators.required,
      Validators.min(1),
    ]),
    codigo_butaca:[
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(150)
      ]
    ],
 
  });

  constructor() {
    effect(() => {
      const b = this.butaca();
      if (!b) return;

      this.formulario.patchValue({
        
        fila: b.fila,
        columna:b.columna,
        codigo_butaca:b.codigo_butaca,

      });
    });
  }

  enviarFormulario(): void {
    console.log('Se ejecutó enviarFormulario()');

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();

      console.log('Formulario inválido:', this.formulario.getRawValue());
      console.log('Errores del formulario:', {
        fila: this.formulario.controls.fila.errors,
        columna: this.formulario.controls.columna.errors,
        codigo_butaca: this.formulario.controls.codigo_butaca.errors,
      });

      return;
    }

    const datos: ButacaEditarRequest = this.formulario.getRawValue();

    console.log('Datos que se enviarán al componente padre:', datos);

    this.guardar.emit(datos);
  }
}
