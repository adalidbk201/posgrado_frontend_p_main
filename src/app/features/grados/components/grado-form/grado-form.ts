import { Component, effect, inject, input, output, signal } from '@angular/core';
import { Grado } from '../../models/grado.interface';
import { GradoRequest } from '../../models/grado-request.interface';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-grado-form',
  imports: [ReactiveFormsModule],
  templateUrl: './grado-form.html',
  styleUrl: './grado-form.scss',
})
export class GradoForm {
   private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  // Signal para detectar modo edición
  readonly esEdicion = signal(false);
  ngOnInit(): void {
    // Detectar si estamos en modo edición
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.esEdicion.set(true);
      this.cargarGrado(id);
    }
  }
  cargarGrado(id: string): void {
    // Implementar lógica para cargar datos del grado
    console.log('Cargar grado:', id);
  }
  cancelar(): void {
    this.router.navigate(['/dashboard/grados']);
  }

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
