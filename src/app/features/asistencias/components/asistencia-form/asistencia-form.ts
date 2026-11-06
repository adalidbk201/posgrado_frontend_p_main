import { Component, computed, inject, output, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AsistenciaRequest } from '../../models/asistencia-request.interfacace';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Colacion } from '../../../colaciones/models/colacion.interface';
import { ColacionesService } from '../../../colaciones/services/colaciones.service';

@Component({
  selector: 'app-asistencia-form',
  imports: [ReactiveFormsModule],
  templateUrl: './asistencia-form.html',
  styleUrl: './asistencia-form.scss',
})
export class AsistenciaForm {
   private readonly router = inject(Router);
   private readonly route = inject(ActivatedRoute);
   // Ya no recibe "asistencia" — este formulario es solo para CREAR
    readonly guardar = output<{
        datos: AsistenciaRequest;
        id_colacion: string;
      }>();
  
    private readonly fb = inject(FormBuilder);
     
   

  // crear formulario con dato ci
   // Crea los controles correspondientes a un nivel.
  readonly formulario = this.fb.nonNullable.group({
    colacion: ['', Validators.required],
    ci: [
      '',
      [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(10),
      ],
    ],
  });

      // =========================================================
      // SELECTOR DE COLACIONES
      // =========================================================

      readonly colaciones = signal<Colacion[]>([]);
      readonly paginaColacion = signal(1);
      readonly busquedaColacion = signal('');
      readonly cargandoMasColaciones = signal(false);

      private readonly colacionesService = inject(ColacionesService);

      readonly colacionesFiltradas = computed(() => {
      const termino = this.busquedaColacion().trim().toLowerCase();

      if (!termino) {
        return this.colaciones();
      }

      return this.colaciones().filter(colacion =>
        colacion.descripcion.toLowerCase().includes(termino)
      );

      });

      private cargarColaciones(pagina: number): void {
      if (this.cargandoMasColaciones()) {
      return;
      }

      this.cargandoMasColaciones.set(true);

      this.colacionesService.getColaciones(pagina, 100).subscribe({
        next: respuesta => {
          const nuevas = respuesta.Data.filas;

          this.colaciones.update(actuales => {
            const idsExistentes = new Set(actuales.map(c => c.id));

            return [
              ...actuales,
              ...nuevas.filter(c => !idsExistentes.has(c.id)),
            ];
          });

          this.paginaColacion.set(pagina);
          this.cargandoMasColaciones.set(false);
        },

        error: error => {
          console.error('Error al cargar colaciones:', error);
          this.cargandoMasColaciones.set(false);
        },
      });

      }

      cargarMasColaciones(): void {
      this.cargarColaciones(this.paginaColacion() + 1);
      }
 

  cancelar(): void {
    this.router.navigate(['/dashboard/asistencias']);
  }

  constructor() {
    // Cargar colaciones.
    this.cargarColaciones(1);

  }

  enviarFormulario(): void {
    if (this.formulario.invalid || this.formulario.pending) {
      this.formulario.markAllAsTouched();
      return;
    }

    const v = this.formulario.getRawValue();

    const datos: AsistenciaRequest = {
      ci: v.ci.trim(),
    };

    this.guardar.emit({datos, id_colacion: v.colacion});
  }
}

    