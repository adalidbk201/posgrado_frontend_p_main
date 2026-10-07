import { Component, effect, inject, input, output } from '@angular/core';
import {
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
    private readonly personasService = inject(SalasService);
   

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
    numero_nivel: this.fb.control<number | null>(null, [
      Validators.required,
      Validators.min(1),
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
    ]),
    columnas: this.fb.control<number | null>(null, [
      Validators.required,
      Validators.min(1),
    ]),

  });

  constructor() {
    
  }

   enviarFormulario(): void {
      if (this.formulario.invalid || this.formulario.pending) {
        this.formulario.markAllAsTouched();
        return;
      }
  
      const v = this.formulario.getRawValue();
  
      const datos: SalaRequest = {
        nombre_sala: v.nombre_sala,
        niveles: [
          {
            numero_nivel: v.numero_nivel,
            nombre_nivel: v.nombre_nivel,
            filas: v.filas,
            columnas: v.columnas,
          }
        ]
      };
  
      this.guardar.emit(datos);
    }
}
