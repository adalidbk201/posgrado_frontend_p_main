import { Component, effect, inject, input, output } from '@angular/core';
import { Grado } from '../../models/grado.interface';
import { GradoRequest } from '../../models/grado-request.interface';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-grado-form',
  imports: [ReactiveFormsModule],
  templateUrl: './grado-form.html',
  styleUrl: './grado-form.scss',
})
export class GradoForm {
  // Recibe un grado cuando estamos editando
  readonly grado = input<Grado | null>(null);

  // Envía los datos al componente padre
  readonly guardar = output<GradoRequest>();

  private readonly fb = inject(FormBuilder);

  // crear formulario con dato nombre_sala
  readonly formulario = this.fb.nonNullable.group({
    grado_academico: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(150),
      ],
    ],
    jerarquia: this.fb.control<number | null>(null, [
      Validators.required,
      Validators.min(1),
    ]),

  });


     constructor() {
        effect(() => {
          // Almacenar Grado a editar
          const gradoActual = this.grado();

          if (gradoActual) {
            this.formulario.patchValue({
              grado_academico: gradoActual.grado_academico,
              jerarquia: gradoActual.jerarquia,
            });
          } else {
            this.formulario.reset({
              grado_academico: '',
              jerarquia:null,
            });
          }
        });
      }


  enviarFormulario(): void {
      if (this.formulario.invalid) {
        this.formulario.markAllAsTouched();
        return;
      }
  
      const datos: GradoRequest = this.formulario.getRawValue();
  
      this.guardar.emit(datos);
  }

}
