import { Component, effect, inject, input, output } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { Sala } from '../../models/sala.interface';
import { SalaRequest } from '../../models/sala-request.interface';
import { SalasService } from '../../services/salas.service';

@Component({
  selector: 'app-sala-form',
  imports: [ReactiveFormsModule],
  templateUrl: './sala-form.html',
  styleUrl: './sala-form.scss',
})
export class SalaForm {
   // Ya no recibe "sala" — este formulario es solo para CREAR
    readonly guardar = output<SalaRequest>();
  
    private readonly fb = inject(FormBuilder);
     
   

  // crear formulario con dato nombre_sala
   // Crea los controles correspondientes a un nivel.
  private crearNivelForm() {
    return this.fb.nonNullable.group({
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
          Validators.maxLength(150),
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
    });
  }

  // El formulario comienza con un nivel.
  readonly formulario = this.fb.nonNullable.group({
    nombre_sala: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(150),
      ],
    ],

    niveles: this.fb.array([this.crearNivelForm()]),
  });


  // Acceso directo al FormArray de niveles.
 get niveles() {
  return this.formulario.controls.niveles;
}

  // Agrega otro nivel al formulario.
  agregarNivel(): void {
    this.niveles.push(this.crearNivelForm());
  }

  // Elimina un nivel sin permitir que la sala se quede sin ninguno.
  eliminarNivel(indice: number): void {
    if (this.niveles.length > 1) {
      this.niveles.removeAt(indice);
    }
  }



  constructor() {
    
  }

  enviarFormulario(): void {
    if (this.formulario.invalid || this.formulario.pending) {
      this.formulario.markAllAsTouched();
      return;
    }

    const v = this.formulario.getRawValue();

    const datos: SalaRequest = {
      nombre_sala: v.nombre_sala.trim(),

      niveles: v.niveles.map((nivel) => ({
        numero_nivel: Number(nivel.numero_nivel),
        nombre_nivel: nivel.nombre_nivel.trim(),
        filas: Number(nivel.filas),
        columnas: Number(nivel.columnas),
      })),
    };

    this.guardar.emit(datos);
  }
}
