import { Component, effect, inject, input, output, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Comunicado } from '../../models/comunicado.interface';
import { ComunicadoActualizarRequest, ComunicadoRequest } from '../../models/comunicado-request.interface';
import { FormArray, FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ColacionesService } from '../../../colaciones/services/colaciones.service';
import { Colacion } from '../../../colaciones/models/colacion.interface';
import { environment } from '../../../../../environment/environment';
@Component({
  selector: 'app-comunicado-editar-form',
  imports: [ReactiveFormsModule],
  templateUrl: './comunicado-editar-form.html',
  styleUrl: './comunicado-editar-form.scss',
})
export class ComunicadoEditarForm {
   private readonly router = inject(Router);
   private readonly route = inject(ActivatedRoute);
   readonly comunicado = input<Comunicado | null>(null);
   private readonly colacionesService = inject(ColacionesService);
  readonly guardar = output<ComunicadoActualizarRequest>();

  // Obtener url foto // api url
  readonly urlFoto = `${environment.API}/uploads/comunicados/`;

  readonly colacionesDisponibles = signal<Colacion[]>([]);

  cargarColaciones(): void {
    this.colacionesService.getColaciones().subscribe({
      next: (respuesta) => {
        this.colacionesDisponibles.set(respuesta.Data.filas);

        console.log('COLACIONES DISPONIBLES:',
          this.colacionesDisponibles().map(c => ({
            id: c.id,
            descripcion: c.descripcion
          }))
        );

        console.log('VALORES DEL FORMARRAY:',
          this.colaciones.controls.map(control => control.value)
        );
      },
      error: (error) => console.error('Error al cargar colaciones:', error),
    });
  }
      

  private readonly fb = inject(FormBuilder);

 // Crear el control de una colación.
  private crearColacionForm() {
    return this.fb.nonNullable.control('', Validators.required);
  }

  // Formulario principal.
  readonly formulario = this.fb.group({
    foto: this.fb.control<File | null>(null),

    fecha_expiracion: this.fb.nonNullable.control('', [
      Validators.required,
    ]),

    descripcion: this.fb.nonNullable.control('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(500),
    ]),

    colaciones: this.fb.array([
      this.crearColacionForm(),
    ]),
  });


   colacionSeleccionadaEnOtroSelect(
    idColacion: string,
    indiceActual: number
  ): boolean {
    return this.colaciones.controls.some(
      (control, indice) =>
        indice !== indiceActual && control.value === idColacion
    );
  }

  // Acceso directo al FormArray.
  get colaciones(): FormArray<FormControl<string>> {
    return this.formulario.controls.colaciones;
  }

  // Agregar otra colación.
  agregarColacion(): void {
    this.colaciones.push(this.crearColacionForm());
  }

  // Eliminar una colación.
  eliminarColacion(indice: number): void {
    if (this.colaciones.length > 1) {
      this.colaciones.removeAt(indice);
    }
  }

  // Obtener la fotografía seleccionada.
  seleccionarFoto(event: Event): void {
    const input = event.target as HTMLInputElement;
    const archivo = input.files?.[0] ?? null;

    this.formulario.controls.foto.setValue(archivo);
    this.formulario.controls.foto.markAsTouched();
    this.formulario.controls.foto.updateValueAndValidity();
  }

  cancelar(): void {
    this.router.navigate(['/dashboard/comunicados']);
  }

  private convertirFechaLocal(fecha: string): string {
    const date = new Date(fecha);

    const año = date.getFullYear();
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const dia = String(date.getDate()).padStart(2, '0');
    const horas = String(date.getHours()).padStart(2, '0');
    const minutos = String(date.getMinutes()).padStart(2, '0');

    return `${año}-${mes}-${dia}T${horas}:${minutos}`;
  }


 constructor() {
  this.cargarColaciones();

  effect(() => {
    const comunicado = this.comunicado();

    if (!comunicado) return;

    this.formulario.patchValue({
      descripcion: comunicado.descripcion,
      fecha_expiracion: this.convertirFechaLocal(
        comunicado.fecha_expiracion
      ),
      foto: null,
    });

    this.colaciones.clear();

    comunicado.colaciones.forEach((colacion) => {
      this.colaciones.push(
        this.fb.nonNullable.control(
          colacion.id,
          Validators.required
        )
      );
    });
  });
}

  enviarFormulario(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const valores = this.formulario.getRawValue();

    const datos: ComunicadoActualizarRequest = {
      fecha_expiracion: valores.fecha_expiracion,
      descripcion: valores.descripcion,
      colaciones: valores.colaciones,
    };

    if (valores.foto) {
      datos.foto = valores.foto;
    }

    this.guardar.emit(datos);
  }
}
