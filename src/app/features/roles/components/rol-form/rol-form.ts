import { Component, effect, inject, input, output } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { Rol } from '../../models/rol.interface';
import { RolRequest } from '../../models/rol-request.interface';

@Component({
  selector: 'app-rol-form',
  imports: [ReactiveFormsModule],
  templateUrl: './rol-form.html',
  styleUrl: './rol-form.scss',
})
export class RolForm {
  // Recibe una rol cuando estamos editando
  readonly rol1 = input<Rol | null>(null);

  // Envía los datos al componente padre
  readonly guardar = output<RolRequest>();

  private readonly fb = inject(FormBuilder);

  // crear formulario con dato nombre_sala
  readonly formulario = this.fb.nonNullable.group({
    rol: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
      ],
    ],
    nombre:[
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100)
      ]
    ],
    descripcion:[
      '',
      [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(255)
      ]
    ]
  });


  constructor() {
    effect(() => {
      // Almacenar Rol a editar
      const rolActual = this.rol1();

      if (rolActual) {
        this.formulario.patchValue({
          rol: rolActual.rol,
          nombre: rolActual.nombre,
          descripcion: rolActual.descripcion,
        });
      } else {
        this.formulario.reset({
          rol: '',
          nombre:'',
          descripcion:'',
        });
      }
    });
  }


  enviarFormulario(): void {
      if (this.formulario.invalid) {
        this.formulario.markAllAsTouched();
        return;
      }
  
      const datos: RolRequest = this.formulario.getRawValue();
  
      this.guardar.emit(datos);
    }


}
