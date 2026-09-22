import { Component, effect, inject, input, output } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { Usuario } from '../../models/usuario.interface';
import { UsuarioRequest } from '../../models/usuario.request.interface';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-usuario-form',
  imports: [ReactiveFormsModule],
  templateUrl: './usuario-form.html',
  styleUrl: './usuario-form.scss',
})
export class UsuarioForm {
  // recibe un usuario cuando estamos editando
  readonly usuario = input<Usuario | null>(null);
  
  // enviar los datos al componente padre
  readonly guardar = output<UsuarioRequest>();

   private readonly fb = inject(FormBuilder);

  // crear formulario con datos
  readonly formulario = this.fb.nonNullable.group({
    nombre_usuario: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
      ],
    ],
    contrasena:[
      '',
      [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(255),
      ],
    ],
    correo_electronico:[
      '',
      [
        Validators.required,
        Validators.email,
      ]
    ],
    // intentos:[
    //   '',
    //   [
    //     Validators.required,
    //     Validators.pattern('^[0-9]*$')
    //   ],
    // ],
    // codigo_desbloqueo:[
    //   '',
    //   [
    //     Validators.required,
    //     Validators.minLength(6),
    //     Validators.maxLength(100),
    //   ],
    // ],
    // codigo_recuperacion:[
    //   '',
    //   [
    //     Validators.required,
    //     Validators.minLength(6),
    //     Validators.maxLength(100),
    //   ],
    // ],
    // codigo_transaccion:[
    //   '',
    //   [
    //     Validators.required,
    //     Validators.minLength(6),
    //     Validators.maxLength(100),
    //   ],
    // ],
    // codigo_activacion:[
    //   '',
    //   [
    //     Validators.required,
    //     Validators.minLength(6),
    //     Validators.maxLength(100),
    //   ],
    // ],
    // fecha_bloqueo:[
    //   '',
    //   [
    //     Validators.required
    //   ]
    // ],
    url_foto:[
      '',
      [
        Validators.required
      ]
    ],
    persona:[
      '',
      [
        Validators.required
      ]
    ] 

  });


  constructor() {
    effect(() => {
      // Almacenar Usuario a editar
      const usuarioActual = this.usuario();

      if (usuarioActual) {
        this.formulario.patchValue({
          nombre_usuario: usuarioActual.nombre_usuario,
          contrasena:'',
          correo_electronico:usuarioActual.correo_electronico,
          // codigo_desbloqueo:usuarioActual.codigo_desbloqueo,
          // codigo_recuperacion:usuarioActual.codigo_recuperacion,
          // codigo_transaccion:usuarioActual.codigo_transaccion,
          // codigo_activacion:usuarioActual.codigo_activacion,
          // fecha_bloqueo:usuarioActual.fecha_bloqueo,
          url_foto:usuarioActual.url_foto,
          persona:usuarioActual.persona, 
        });
      } else {
          this.formulario.reset({
            nombre_usuario: '',
            contrasena:'',
            correo_electronico:'',
            // codigo_desbloqueo:'',
            // codigo_recuperacion:'',
            // codigo_transaccion:'',
            // codigo_activacion:'',
            // fecha_bloqueo:'',
            url_foto:'',
            persona:'' 
          });
        }
      
      }
    );
  }

  // Metodo Enviar Formulario
    enviarFormulario():void{
      // verificar formulario
      if(this.formulario.invalid){
        // Marcar todos los campos del formulario
        this.formulario.markAllAsTouched();
        return;
      }
  
      // si no es invalido guardar los datos y emitirlos
      const datos: UsuarioRequest= this.formulario.getRawValue();
  
      this.guardar.emit(datos);
    }

}
