import { Component, effect, inject, input, output } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { Sala } from '../../models/sala.interface';
import { SalaRequest } from '../../models/sala-request.interface';

@Component({
  selector: 'app-sala-form',
  imports: [ReactiveFormsModule],
  templateUrl: './sala-form.html',
  styleUrl: './sala-form.scss',
})
export class SalaForm {
  // Recibe una sala cuando estamos editando
  readonly sala = input<Sala | null>(null);

  // Envía los datos al componente padre
  readonly guardar = output<SalaRequest>();

  private readonly fb = inject(FormBuilder);

  // crear formulario con dato nombre_sala
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
      // Almacenar Sala a editar
      const salaActual = this.sala();

      if (salaActual) {
        this.formulario.patchValue({
          nombre_sala: salaActual.nombre_sala,
        });
      } else {
        this.formulario.reset({
          nombre_sala: '',
        });
      }
    });
  }

  enviarFormulario(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const datos: SalaRequest = this.formulario.getRawValue();

    this.guardar.emit(datos);
  }
}
