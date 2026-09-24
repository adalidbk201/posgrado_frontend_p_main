import { Component, computed, effect, inject, signal } from '@angular/core';
import { RolesService } from '../../services/roles.service';
import { Rol } from '../../models/rol.interface';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lista-roles',
  imports: [],
  templateUrl: './lista-roles.html',
  styleUrl: './lista-roles.scss',
})
export class ListaRoles {
  // inyectar rolesService
  private readonly rolesService = inject(RolesService);

  // inyectar Roter para navegacion entre paginas
  private readonly router = inject(Router);

  // =========================
  // Cargar y filtrar
  // =========================

  // todas los roles cargados desde el backend (paginado, acumulativo)
  readonly roles = signal<Rol[]>([]);

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
  readonly listRoles = computed(() => {

    // obtener el texto buscado, elimina espacios al prinicipio y final- convierte minuscula
    const termino = this.terminoBuscar().trim().toLowerCase();

    // si no escribio nada devuelve todas los roles
    if (!termino) return this.roles();

    // filter recorre todas los roles y decide cuales deben permanecer
    return this.roles().filter(r =>

      // construye un texto con los datos del rol para buscar por cualquiera de esos datos
      `${r.rol} ${r.nombre} ${r.descripcion}`
        // convierte los datos en minuscula
        .toLowerCase()
        // true si encontro el termino , false si no encontro el termino
        .includes(termino)
    );

  });

  

  // se llama directo desde el (input), sin debounce — el filtro es en memoria, no HTTP
  ejecutarBusqueda(termino: string): void {
    this.terminoBuscar.set(termino);
  }


  // calcula qué número mostrar como total de roles.
  readonly totalRoles = computed(() =>
    this.terminoBuscar().trim() 
    // si hay texto en buscador
    ? this.listRoles().length 
    // si no hay texto en buscador
    : this.totalBackend()
  );


  constructor() {
    // cargar la primera pagina
    this.cargarRoles(1);
  }

  private cargarRoles(pagina: number): void {
    // cuando empieza la peticion -> true 
    this.cargando.set(true);

    // Solicitar datos a Django-Como getPersonas() devuelve un Observable, necesitas suscribirte:
    this.rolesService.getRoles(pagina, 100).subscribe({

      next: (respuesta) => {

        // obtener roles
        const nuevas = respuesta.Data.filas;

        // actualizar señal roles -> Angular te entrega el valor actual mediante: actual
        this.roles.update(actual => {

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


  cargarMasRoles(): void {
    this.cargarRoles(this.paginaActual() + 1);
  }

  

  // =========================
  // NAVEGACIÓN Y ELIMINACIÓN —  
  // =========================

  crearRol(): void {
    this.router.navigate(['/dashboard/roles/crear']);
  }

  editarRol(id: number): void {
    this.router.navigate(['/dashboard/roles/editar', id]);
  }


  /** Eliminar rol */
  readonly rolEliminarId = signal<string | null>(null);

  seleccionarRolEliminar(id: string): void {
    this.rolEliminarId.set(id);
  }

  confirmarEliminacion(): void {
    const id = this.rolEliminarId();
    if (!id) return;

    this.rolesService.eliminarRol(id).subscribe({
      next: () => {
        console.log('Rol eliminado correctamente');
        // recarga desde el inicio para reflejar el borrado
        this.roles.set([]);
        this.paginaActual.set(0);
        this.cargarRoles(1);
        this.rolEliminarId.set(null);
      },
      error: (error) => {
        console.error('Error al eliminar el rol:', error);
      },
    });
  }

}
