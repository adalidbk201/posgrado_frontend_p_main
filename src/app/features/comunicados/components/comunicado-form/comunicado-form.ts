
import { Component, inject, output } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { Router, ActivatedRoute } from '@angular/router';
import { ComunicadoRequest } from '../../models/comunicado-request.interface';
import { Colacion } from '../../../colaciones/models/colacion.interface';
import { ColacionesService } from '../../../colaciones/services/colaciones.service';

@Component({
  selector: 'app-comunicado-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './comunicado-form.html',
  styleUrl: './comunicado-form.scss',
})
export class ComunicadoForm {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  private readonly colacionesService = inject(ColacionesService);
  readonly guardar = output<ComunicadoRequest>();
  colacionesDisponibles: Colacion[] = [];
  cargarColaciones(): void {
    this.colacionesService.getColaciones().subscribe({
      next: (respuesta) => {
        console.log('Respuesta de colaciones:', respuesta);
        this.colacionesDisponibles = respuesta.Data.filas;
        console.log('Respuesta completa:', respuesta);
  console.log('Data:', respuesta.Data);
  console.log('Colaciones:', respuesta.Data.filas);

  this.colacionesDisponibles = respuesta.Data.filas;

  console.log('Colaciones cargadas:', this.colacionesDisponibles);
      },
      error: (error) => {
        console.error('Error al cargar colaciones:', error);
      },
    });
  }

  // Crear el control de una colación.
  private crearColacionForm() {
    return this.fb.nonNullable.control('', Validators.required);
  }

  // Formulario principal.
  readonly formulario = this.fb.group({
    foto: this.fb.control<File | null>(null, Validators.required),

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

  enviarFormulario(): void {
    if (this.formulario.invalid || this.formulario.pending) {
      this.formulario.markAllAsTouched();
      return;
    }

    const v = this.formulario.getRawValue();

    if (!v.foto) {
      return;
    }

    const datos: ComunicadoRequest = {
      foto: v.foto,
      fecha_expiracion: new Date(v.fecha_expiracion).toISOString(),
      descripcion: v.descripcion.trim(),
      colaciones: v.colaciones,
    };

    this.guardar.emit(datos);
  }

  constructor() {
    this.cargarColaciones();
  }
}
