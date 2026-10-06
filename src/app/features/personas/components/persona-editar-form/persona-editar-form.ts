import { Component, effect, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { Persona } from '../../models/persona.interface';

// Lo que realmente se puede editar con los datos que devuelve getPersonaPorId.
// Si más adelante el backend expone más campos para edición, se amplía aquí.
export interface PersonaEditarRequest {
  pais_documento: string;
  nro_documento: string;
  nombres: string;
  primer_apellido: string;
  segundo_apellido: string;
  celular: string;
  correo_electronico: string;
}

@Component({
  selector: 'app-persona-editar-form',
  imports: [ReactiveFormsModule],
  templateUrl: './persona-editar-form.html',
  styleUrl: './persona-editar-form.scss',
})
export class PersonaEditarForm { 
  readonly persona = input<Persona | null>(null);
  readonly guardar = output<PersonaEditarRequest>();

  private readonly fb = inject(FormBuilder);

  readonly formulario = this.fb.nonNullable.group({
    pais_documento: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    nro_documento: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
    nombres: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    primer_apellido: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    segundo_apellido: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    celular: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
    correo_electronico: ['', [Validators.required, Validators.email]],
  });

  constructor() {
    effect(() => {
      const p = this.persona();
      if (!p) return;

      this.formulario.patchValue({
        pais_documento: p.expedido,
        nro_documento: p.nro_documento,
        nombres: p.nombres,
        primer_apellido: p.primer_apellido,
        segundo_apellido: p.segundo_apellido,
        celular: p.celular,
        correo_electronico: p.correo_electronico,
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
