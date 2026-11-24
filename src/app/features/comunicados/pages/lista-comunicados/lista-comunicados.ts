import { Component, computed, inject, signal } from '@angular/core';
import { ComunicadosService } from '../../services/comunicados.service';
import { Router } from '@angular/router';
import { Comunicado } from '../../models/comunicado.interface';
import { LowerCasePipe } from '@angular/common';
import { environment } from '../../../../../environment/environment';
import { ToastService } from '../../../../core/services/toast.service';
@Component({
  selector: 'app-lista-comunicados',
  imports: [LowerCasePipe],
  templateUrl: './lista-comunicados.html',
  styleUrl: './lista-comunicados.scss',
})
export class ListaComunicados {
   /** inyectar toas para notificaiones */
   private toast = inject(ToastService);
  // inyectar comunicadosService
  private readonly comunicadosService = inject(ComunicadosService);

  // inyectar Roter para navegacion entre paginas
  private readonly router = inject(Router);

  // Obtener url foto // api url
    readonly urlFoto = `${environment.API}/uploads/comunicados/`;

  // =========================
  // Cargar y filtrar
  // =========================

  // todas los comunicados cargados desde el backend (paginado, acumulativo)
  readonly comunicados = signal<Comunicado[]>([]);

  // página actual cargada
  readonly paginaActual = signal(1);

  // total real de registros que reporta el backend (para saber si hay más páginas)
  readonly totalBackend = signal(0);

  // indica si se está trayendo una página adicional
  readonly cargando = signal(false);

  // texto del buscador
  readonly terminoBuscar = signal('');


  // lista final que se muestra en la tabla, filtrada en el cliente
  // computed crea un signal derivado - resultado depende de terminoBuscar y comunicados
  readonly listComunicados = computed(() => {

    // obtener el texto buscado, elimina espacios al prinicipio y final- convierte minuscula
    const termino = this.terminoBuscar().trim().toLowerCase();

    // si no escribio nada devuelve todas los comunicados
    // filter recorre todas los comunicados y decide cuales deben permanecer
    const base = !termino
    ? this.comunicados()
    : this.comunicados().filter(c =>
        `${c.estado_comunicado} ${c.descripcion} ${c.fecha_expiracion}`
          .toLowerCase()
          .includes(termino) 
      );

    
    // ordena por fecha_expiracion descendente (más reciente primero)
    // [...base] crea una copia para no mutar el array del signal original
    return [...base].sort((a, b) =>
      new Date(b.fecha_expiracion).getTime() - new Date(a.fecha_expiracion).getTime()
    );

  });

  

  // se llama directo desde el (input), sin debounce — el filtro es en memoria, no HTTP
  ejecutarBusqueda(termino: string): void {
    this.terminoBuscar.set(termino);
  }


  // calcula qué número mostrar como total de comunicados.
  readonly totalComunicados = computed(() =>
    this.terminoBuscar().trim() 
    // si hay texto en buscador
    ? this.listComunicados().length 
    // si no hay texto en buscador
    : this.totalBackend()
  );


  constructor() {
    // cargar la primera pagina
    this.cargarComunicados(1);
  }

  private cargarComunicados(pagina: number): void {
    // cuando empieza la petiicon -> true 
    this.cargando.set(true);

    // Solicitar datos a Django-Como getComunicados() devuelve un Observable, necesitas suscribirte:
    this.comunicadosService.getComunicados(pagina, 100).subscribe({

      next: (respuesta) => {

        // obtener comunicados
        const nuevas = respuesta.Data.filas;

        // actualizar señal comunicados -> Angular te entrega el valor actual mediante: actual
        this.comunicados.update(actual => {

          //          crea un conjunto de los IDs extraidos.
          const idsExistentes = new Set(actual.map(c => c.id));

          // De los comunicados nuevos, quédate solamente con aquellas cuyo ID todavía no existe en comunicados.
          const sinDuplicar = nuevas.filter(c => !idsExistentes.has(c.id));

          // Agregar los nuevos comunicados
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


  cargarMasComunicados(): void {
    this.cargarComunicados(this.paginaActual() + 1);
  }

  

  // =========================
  // NAVEGACIÓN Y ELIMINACIÓN —  
  // =========================

  crearComunicado(): void {
    this.router.navigate(['/dashboard/comunicados/crear']);
  }

  editarComunicado(id: string): void {
    this.router.navigate(['/dashboard/comunicados/editar', id]);
  }


  /** Eliminar comunicado */
  readonly comunicadoEliminarId = signal<string | null>(null);

  seleccionarComunicadoEliminar(id: string): void {
    this.comunicadoEliminarId.set(id);
  }

  confirmarEliminacion(): void {
    const id = this.comunicadoEliminarId();
    if (!id) return;

    this.comunicadosService.eliminarComunicado(id).subscribe({
      next: () => {
        console.log('Comunicado eliminado correctamente');
        // recarga desde el inicio para reflejar el borrado
        this.comunicados.set([]);
        this.paginaActual.set(0);
        this.cargarComunicados(1);
        this.comunicadoEliminarId.set(null);
      },
      error: (error) => {
        console.error('Error al eliminar el comunicado:', error);
      },
    });
  }

  
  /** Activar comunicado */
  readonly comunicadoActivarId = signal<string | null>(null);

  seleccionarComunicadoActivar(id: string): void {
    this.comunicadoActivarId.set(id);
  }

  /** Desactivar comunicado */
  readonly comunicadoDesactivarId = signal<string | null>(null);
  seleccionarComunicadoDesactivar(id: string): void {
    this.comunicadoDesactivarId.set(id);
  }

  confirmarActivar(): void {
    const id = this.comunicadoActivarId();
    if (!id) return;

    this.comunicadosService.activarComunicado(id).subscribe({
      next: () => {
        console.log('Comunicado activado correctamente');
          //  1. MOSTRAR TOAST DE ÉXITO
          this.toast.exito('Comunicado activado correctamente.');
          this.cerrarModal('modalActivar');
        // recarga desde el inicio para reflejar el borrado
        this.comunicados.set([]);
        this.paginaActual.set(0);
        this.cargarComunicados(1);
        this.comunicadoActivarId.set(null);
      },
      error: (err) => {
        console.error('Error al activar el comunicado:', err);
        // Extrae el mensaje del backend si existe, sino usa uno por defecto
            const msg = err?.error?.Errores.estado
                    || err?.error?.Message 
                    || err?.message 
                    || 'Error al activar el comunicado.';
            
            this.toast.error(msg);
      },
    });
  }

  confirmarDesactivar(): void {
    const id = this.comunicadoDesactivarId();
    if (!id) return;

    this.comunicadosService.desactivarComunicado(id).subscribe({
      next: () => {
        console.log('Comunicado desactivado correctamente');
         //  1. MOSTRAR TOAST DE ÉXITO
          this.toast.exito('Comunicado desactivado correctamente.');
          this.cerrarModal('modalDesactivar');
        // recarga desde el inicio para reflejar el borrado
        this.comunicados.set([]);
        this.paginaActual.set(0);
        this.cargarComunicados(1);
        this.comunicadoDesactivarId.set(null);
      },
      error: (err) => {
        console.error('Error al desactivar el comunicado:', err);
        // Extrae el mensaje del backend si existe, sino usa uno por defecto
            const msg = err?.error?.Errores.estado
                    || err?.error?.Message 
                    || err?.message 
                    || 'Error al desactivar el comunicado.';
            
            this.toast.error(msg);
      },
    });
  }


   /** Cierra el modal de Bootstrap 4 de forma segura */
  cerrarModal(idModal: string): void {
    const modal = document.getElementById(idModal);
    if (!modal) return;

    // 1. Remover clases y atributos que mantienen el modal abierto en Bootstrap 4
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    modal.style.display = 'none';

    // 2. Limpiar el fondo oscuro (backdrop) si se quedó "pegado"
    const backdrops = document.querySelectorAll('.modal-backdrop');
    backdrops.forEach(backdrop => backdrop.remove());

    // 3. Restaurar el scroll normal del cuerpo de la página
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  }

 
}
