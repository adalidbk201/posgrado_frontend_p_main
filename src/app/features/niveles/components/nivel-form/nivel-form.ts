import { Component, effect, inject, input, output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Nivel } from '../../models/nivel.interface';
import { NivelRequest } from '../../models/nivel-request.interface';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-nivel-form',
  imports: [ReactiveFormsModule],
  templateUrl: './nivel-form.html',
  styleUrl: './nivel-form.scss',
})
export class NivelForm {
   private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  readonly nivel = input<Nivel | null>(null);

  // obtener valriables entregados
  readonly numero_nivel = input<number>();
  readonly nombre_nivel = input<string>('');
  readonly filas = input<number>();
  readonly columnas = input<number>();
  readonly id_sala = input<string>('');
  readonly nombre_sala = input<string>('');

  readonly guardar = output<NivelRequest>();

  private readonly fb = inject(FormBuilder);

  readonly formulario = this.fb.nonNullable.group({
     numero_nivel: this.fb.control<number | null>(null, [
        Validators.required,
        Validators.min(1),
        Validators.pattern(/^[1-9]\d*$/),
      ]),

      nombre_nivel: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],

      filas: this.fb.control<number | null>(null, [
        Validators.required,
        Validators.min(1),
        Validators.pattern(/^[1-9]\d*$/),
      ]),

      columnas: this.fb.control<number | null>(null, [
        Validators.required,
        Validators.min(1),
        Validators.pattern(/^[1-9]\d*$/),
      ]),

       sala: [''],
    
  });

  cancelar(): void {
    this.router.navigate(['/dashboard/niveles']);
  }

  constructor() {
    effect(() => {
      

      this.formulario.patchValue({
        numero_nivel: this.numero_nivel(),
        nombre_nivel: this.nombre_nivel(),
        filas: this.filas(),
        columnas: this.columnas(),
        sala: this.id_sala(),
      });
    });
  }

  enviarFormulario(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();

        console.log('Errores del formulario:', {
        numero_nivel: this.formulario.controls.numero_nivel.errors,
        nombre_nivel: this.formulario.controls.nombre_nivel.errors,
        filas: this.formulario.controls.filas.errors,
        columnas: this.formulario.controls.columnas.errors,
        sala: this.formulario.controls.sala.errors,
      });

      return;
    }

    this.guardar.emit(this.formulario.getRawValue());
  }
}
