import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { Usuario } from '../../models/usuario.interface';
import { UsuarioRequest } from '../../models/usuario.request.interface';
import { RouterLink } from '@angular/router';
import { Persona } from '../../../personas/models/persona.interface';
import { PersonasService } from '../../../personas/services/personas.service';

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

    // =========================
    // SELECTOR DE PERSONA
    // =========================
    private readonly personasService = inject(PersonasService)
    // lista de personas cargada desde el backend (paginada)
    readonly personas = signal<Persona[]>([])

    // página actual del listado de personas
    readonly paginaPersona = signal(1);

    // texto escrito en el buscador (filtra del lado del cliente)
    readonly busquedaPersona = signal('');

    // indica si se está trayendo una página adicional
    readonly cargandoMasPersonas = signal(false);

    // personas visibles en el select, filtradas por el texto de búsqueda
    readonly personasFiltradas = computed(() => {
      const termino = this.busquedaPersona().trim().toLowerCase();
      if (!termino) return this.personas();

      return this.personas().filter(p =>
        `${p.nombres} ${p.primer_apellido} ${p.segundo_apellido} ${p.nro_documento}`
          .toLowerCase()
          .includes(termino)
      );
    });

    // Metodo cargarPersonas
     // trae una página de personas y la agrega a la lista, sin duplicar
    private cargarPersonas(pagina: number): void {
      this.cargandoMasPersonas.set(true);

      this.personasService.getPersonas(pagina, 100).subscribe({
        next: (respuesta) => {
          const nuevas = respuesta.Data.filas;

          this.personas.update(actual => {
            const idsExistentes = new Set(actual.map(p => p.id));
            const sinDuplicar = nuevas.filter(p => !idsExistentes.has(p.id));
            return [...actual, ...sinDuplicar];
          });

          this.paginaPersona.set(pagina);
          this.cargandoMasPersonas.set(false);
        },
        error: () => this.cargandoMasPersonas.set(false),
      });
    }

    // botón "cargar más" del template
    cargarMasPersonas(): void {
      this.cargarPersonas(this.paginaPersona() + 1);
    }

    // si estamos editando y la persona asignada no vino en la página cargada,
    // la trae aparte para que el select no se vea vacío
    private asegurarPersonaEnLista(idPersona: string): void {
      if (!idPersona) return;

      const yaExiste = this.personas().some(p => p.id === idPersona);
      if (yaExiste) return;

      this.personasService.getPersonaPorId(idPersona).subscribe({
        next: (respuesta) => {
          this.personas.update(actual => [respuesta.Data, ...actual]);
        },
      });
    }



  constructor() {
    // cargar la primera página de personas al iniciar el formulario
    this.cargarPersonas(1);
    effect(() => {
      // Almacenar Usuario a editar
      const usuarioActual = this.usuario();

      if (usuarioActual) {
        this.formulario.patchValue({
          nombre_usuario: usuarioActual.nombre_usuario,
          contrasena:'',
          correo_electronico:usuarioActual.correo_electronico,
          url_foto:usuarioActual.url_foto,
          persona:usuarioActual.persona, 
        });

        // asegura que la persona ya asignada aparezca en el select,
        // aunque no esté dentro de la primera página cargada
        this.asegurarPersonaEnLista(usuarioActual.persona);
        
      } else {
          this.formulario.reset({
            nombre_usuario: '',
            contrasena:'',
            correo_electronico:'',
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
