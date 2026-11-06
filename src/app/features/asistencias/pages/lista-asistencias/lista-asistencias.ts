import { Component, computed, effect, inject, signal } from '@angular/core';
import { ColacionesService } from '../../../colaciones/services/colaciones.service';
import { Colacion } from '../../../colaciones/models/colacion.interface';
import { Observable } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';
import { AsistenciasService } from '../../services/asistencias.service';
import type { Asistencia } from '../../models/asistencia.interface';
import { Router } from '@angular/router';

@Component({
  imports: [],
  selector: 'app-lista-asistencias',
  styleUrl: './lista-asistencias.scss',
  templateUrl: './lista-asistencias.html',
})
export class ListaAsistencias {
   // inyectar asistenciasService
  private readonly asistenciasService = inject(AsistenciasService);

  // inyectar Roter para navegacion entre paginas
  private readonly router = inject(Router);

  // =========================
  // Cargar y filtrar
  // =========================

  // todas las asistencias cargadas desde el backend (paginado, acumulativo)
  readonly asistencias = signal<Asistencia[]>([]);

  // página actual cargada
  readonly paginaActual = signal(1);

  // total real de registros que reporta el backend (para saber si hay más páginas)
  readonly totalBackend = signal(0);

  // indica si se está trayendo una página adicional
  readonly cargando = signal(false);

  // texto del buscador
  readonly terminoBuscar = signal('');


  // lista final que se muestra en la tabla, filtrada en el cliente
  // computed crea un signal derivado - resultado depende de terminoBuscar y roles
  readonly listAsistencias = computed(() => {

  const termino = this.terminoBuscar().trim().toLowerCase();
  const idColacion = this.colacionSeleccionada();

  const base = this.asistencias().filter(asistencia => {

    // FILTRO POR COLACIÓN
    const coincideColacion =
      !idColacion ||
      asistencia.asignacion_butaca.colacion?.id === idColacion;

    // DATOS DE LA PERSONA
    const persona = asistencia.asignacion_butaca.titulado.persona;

    const nombreCompleto = [
      persona.nombres,
      persona.primer_apellido,
      persona.segundo_apellido,
    ].join(' ');

    // TEXTO PARA BUSCAR
    const texto = [
      nombreCompleto,
      persona.nro_documento,
      asistencia.asistencia,
    ].join(' ').toLowerCase();

    const coincideBusqueda =
      !termino || texto.includes(termino);

    return coincideColacion && coincideBusqueda;
  });

  return base;
});

  

  // se llama directo desde el (input), sin debounce — el filtro es en memoria, no HTTP
  ejecutarBusqueda(termino: string): void {
    this.terminoBuscar.set(termino);
  }


  // calcula qué número mostrar como total de asistencias.
  readonly totalAsistencias = computed(() => {
    const hayFiltros =
      this.terminoBuscar().trim() !== '' ||
      this.colacionSeleccionada() !== '';

    return hayFiltros
      ? this.listAsistencias().length
      : this.totalBackend();
  });


  constructor() {
    // cargar la primera pagina
    this.cargarAsistencias(1);

    this.cargarColaciones();
  }

  private cargarAsistencias(pagina: number): void {
    // cuando empieza la peticion -> true 
    this.cargando.set(true);

    // Solicitar datos a Django-Como getPersonas() devuelve un Observable, necesitas suscribirte:
    this.asistenciasService.getAsistencias(pagina, 100).subscribe({

      next: (respuesta) => {

        // obtener asistencias
        const nuevas = respuesta.Data.filas;

        // actualizar señal asistencias -> Angular te entrega el valor actual mediante: actual
        this.asistencias.update(actual => {

          //          crea un conjunto de los IDs extraidos.
          const idsExistentes = new Set(actual.map(p => p.id));

          // De los roles nuevos, quédate solamente con aquellas cuyo ID todavía no existe en roles.
          const sinDuplicar = nuevas.filter(p => !idsExistentes.has(p.id));

          // Agregar las nuevos roles
          return [...actual, ...sinDuplicar];
        });

        // Guardar el total real de Django
        this.totalBackend.set(respuesta.Data.total);
        // Guardar la página actual
        this.paginaActual.set(pagina);
        // Terminar la carga
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false),
    });
  }


  cargarMasAsistencias(): void {
    this.cargarAsistencias(this.paginaActual() + 1);
  }

  /** COLACIONES */
  private readonly colacionesService = inject(ColacionesService);

  // COLACIONES
  readonly colaciones = signal<Colacion[]>([]);
  readonly colacionSeleccionada = signal<string>('');

  private cargarColaciones(): void {
    this.colacionesService.getColaciones(1, 100).subscribe({
      next: respuesta => {
        this.colaciones.set(respuesta.Data.filas);
      },
      error: error => {
        console.error('Error al cargar las colaciones:', error);
      },
    });
  }

  // CAMBIAR COLACIÓN
  alCambiarColacion(id: string): void {
    this.colacionSeleccionada.set(id);
  }


  // Método para asignar clase CSS según el tipo de asistencia
  // getAsistenciaClass(asistencia: string): string {
  //   const asistenciaMap: { [key: string]: string } = {
  //     'ADMINISTRADOR': 'admin',
  //     'ESTUDIANTE': 'estudiante',
  //   };
  //   return asistenciaMap[asistencia?.toUpperCase()] || 'default';
  // }

  

  // =========================
  // NAVEGACIÓN Y ELIMINACIÓN —  
  // =========================

  crearAsistencia(): void {
    this.router.navigate(['/dashboard/asistencias/crear']);
  }

  editarAsistencia(id: number): void {
    this.router.navigate(['/dashboard/asistencias/editar', id]);
  }


  /** Eliminar asistencia */
  // readonly asistenciaEliminarId = signal<string | null>(null);

  // seleccionarAsistenciaEliminar(id: string): void {
  //   this.asistenciaEliminarId.set(id);
  // }

  // confirmarEliminacion(): void {
  //   const id = this.asistenciaEliminarId();
  //   if (!id) return;

  //   this.asistenciasService.eliminarAsistencia(id).subscribe({
  //     next: () => {
  //       console.log('Asistencia eliminada correctamente');
  //       // recarga desde el inicio para reflejar el borrado
  //       this.asistencias.set([]);
  //       this.paginaActual.set(0);
  //       this.cargarAsistencias(1);
  //       this.asistenciaEliminarId.set(null);
  //     },
  //     error: (error) => {
  //       console.error('Error al eliminar la asistencia:', error);
  //     },
  //   });
  // }

}

