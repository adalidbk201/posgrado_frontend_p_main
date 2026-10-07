import { Component, effect, inject, input, output } from '@angular/core';
import { SalaEditarRequest } from '../../models/sala-request.interface';
import { Sala } from '../../models/sala.interface';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
@Component({
  selector: 'app-sala-editar-form',
  imports: [ReactiveFormsModule],
  templateUrl: './sala-editar-form.html',
  styleUrl: './sala-editar-form.scss',
})
export class SalaEditarForm {
  readonly sala = input<Sala | null>(null);
  readonly nombre_sala = input<string>('');
  readonly guardar = output<SalaEditarRequest>();

  private readonly fb = inject(FormBuilder);

  readonly formulario = this.fb.nonNullable.group({
    nombre_sala: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(150),
      ],
    ],
    
  });

  constructor() {
    effect(() => {
      const s = this.sala();
      if (!s) return;

      this.formulario.patchValue({
        nombre_sala: this.nombre_sala(),
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
