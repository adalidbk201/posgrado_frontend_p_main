import { Component, computed, effect, inject, input, output, signal } from '@angular/core';

import { ButacaRequest, CrearButacaRequest } from '../../models/butaca-request.interface';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Butaca } from '../../models/butaca.interface';
import { Sala } from '../../../salas/models/sala.interface';
import { SalasService } from '../../../salas/services/salas.service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-butaca-form',
  imports: [ReactiveFormsModule],
  templateUrl: './butaca-form.html',
  styleUrl: './butaca-form.scss',
})
export class ButacaForm {
   
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  // Envía los datos al componente padre
  readonly guardar = output<CrearButacaRequest>();

  private readonly fb = inject(FormBuilder);

 private readonly salasService = inject(SalasService)
 
   // crear formulario con datos butaca
  readonly formulario = this.fb.nonNullable.group({
    fila: this.fb.control<number | null>(null, [
      Validators.required,
      Validators.min(1),
    ]),
    columna: this.fb.control<number | null>(null, [
      Validators.required,
      Validators.min(1),
    ]),
    codigo_butaca:[
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(150)
      ]
    ],
    id_sala:[
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(150)
      ]
    ],
    id_nivel:[
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(150)
      ]
    ]
  });



   constructor() {
    this.cargarSalas(1);
    effect(() => {
     

       
        this.formulario.reset({
          fila: null,
          columna:null,
          codigo_butaca:'',
        });
      
    });
  }


  // =========================
  // SELECTOR DE Sala
  // =========================
  readonly salas = signal<Sala[]>([]);
  readonly paginaSala = signal(1);
  readonly busquedaSala = signal('');
  readonly cargandoMasSalas = signal(false);

  readonly salasFiltradas = computed(() => {
    const termino = this.busquedaSala().trim().toLowerCase();
    if (!termino) return this.salas();
    return this.salas().filter(s => `${s.nombre_sala}`.toLowerCase().includes(termino));
  });

  private cargarSalas(pagina: number): void {
    this.cargandoMasSalas.set(true);
    this.salasService.getSalas(pagina, 100).subscribe({
      next: (respuesta) => {
        const nuevas = respuesta.Data.filas;
        this.salas.update(actual => {
          const idsExistentes = new Set(actual.map(m => m.id));
          return [...actual, ...nuevas.filter(m => !idsExistentes.has(m.id))];
        });
        this.paginaSala.set(pagina);
        this.cargandoMasSalas.set(false);
      },
      error: () => this.cargandoMasSalas.set(false),
    });
  }

  cargarMasSalas(): void {
    this.cargarSalas(this.paginaSala() + 1);
  }


  /** OBTENER LOS NIVELES DE SALA */
  // ID del programa seleccionado
  readonly salaSeleccionadoId = signal<string | null>(null);

  readonly nivelDelSala = computed(() => {
    const idSala = this.salaSeleccionadoId();

    if (!idSala) {
      return [];
    }

    const sala = this.salas().find(
      p => p.id === idSala
    );

    return sala?.niveles ?? [];
  });

  // Actualizar las niveles cuando cambia la sala
  alCambiarSala(): void {
    const idSala = this.formulario.controls.id_sala.value;

    this.salaSeleccionadoId.set(idSala || null);

    // Limpiar nivel anterior para evitar enviar un
    // nivel que pertenezca a otra sala
    this.formulario.controls.id_nivel.reset("");
  }



  cancelar(): void {
    this.router.navigate(['/dashboard/butacas']);
  }

  enviarFormulario(): void {
  if (this.formulario.invalid) {
    this.formulario.markAllAsTouched();
    return;
  }

  const formulario = this.formulario.getRawValue();

  const idNivel = formulario.id_nivel;

  if (!idNivel) {
    this.formulario.controls.id_nivel.markAsTouched();
    return;
  }

  // Construir únicamente los campos que espera el backend
  const datos: ButacaRequest = {
    fila: Number(formulario.fila),
    columna: Number(formulario.columna),
    codigo_butaca: formulario.codigo_butaca
  };

  console.log('Datos que se enviarán:', datos);
  console.log('Nivel seleccionado:', idNivel);

  this.guardar.emit({
    id_nivel: idNivel,
    datos: datos
  });
}


}
