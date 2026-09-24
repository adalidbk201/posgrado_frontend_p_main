import { Component, effect, signal, inject, computed } from '@angular/core';
import { UsuariosService } from '../../services/usuarios.service';
import { Usuario } from '../../models/usuario.interface';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

@Component({
  imports: [],
  selector: 'app-lista-usuarios',
  styleUrl: './lista-usuarios.scss',
  templateUrl: './lista-usuarios.html',
})
export class ListaUsuarios {
  // inyectar usuariosService
  private readonly usuariosService = inject(UsuariosService);

  // inyectar Roter para navegacion entre paginas
  private readonly router = inject(Router);

  // =========================
  // Cargar y filtrar
  // =========================

  // todas los usuarios cargados desde el backend (paginado, acumulativo)
  readonly usuarios = signal<Usuario[]>([]);

  // página actual cargada
  readonly paginaActual = signal(1);

  // total real de registros que reporta el backend (para saber si hay más páginas)
  readonly totalBackend = signal(0);

  // indica si se está trayendo una página adicional
  readonly cargando = signal(false);

  // texto del buscador
  readonly terminoBuscar = signal('');


  // lista final que se muestra en la tabla, filtrada en el cliente
  // computed crea un signal derivado - resultado depende de terminoBuscar y usuarios
  readonly listUsuarios = computed(() => {

    // obtener el texto buscado, elimina espacios al prinicipio y final- convierte minuscula
    const termino = this.terminoBuscar().trim().toLowerCase();

    // si no escribio nada devuelve todos los usuarios
    if (!termino) return this.usuarios();

    // filter recorre todos los usuarios y decide cuales deben permanecer
    return this.usuarios().filter(u =>

      // construye un texto con los datos del usuario para buscar por cualquiera de esos datos
      `${u.nombre_usuario} ${u.correo_electronico}`
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


  // calcula qué número mostrar como total de usuarios.
  readonly totalUsuarios = computed(() =>
    this.terminoBuscar().trim() 
    // si hay texto en buscador
    ? this.listUsuarios().length 
    // si no hay texto en buscador
    : this.totalBackend()
  );


  constructor() {
    // cargar la primera pagina
    this.cargarUsuarios(1);
  }

  private cargarUsuarios(pagina: number): void {
    // cuando empieza la petiicon -> true 
    this.cargando.set(true);

    // Solicitar datos a Django-Como getUsuarios() devuelve un Observable, necesitas suscribirte:
    this.usuariosService.getUsuarios(pagina, 100).subscribe({

      next: (respuesta) => {

        // obtener usuarios
        const nuevas = respuesta.Data.filas;

        // actualizar señal usuarios -> Angular te entrega el valor actual mediante: actual
        this.usuarios.update(actual => {

          //          crea un conjunto de los IDs extraidos.
          const idsExistentes = new Set(actual.map(p => p.id));

          // De las personas nuevas, quédate solamente con aquellas cuyo ID todavía no existe en personas.
          const sinDuplicar = nuevas.filter(p => !idsExistentes.has(p.id));

          // Agregar las nuevas personas
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


  cargarMasUsuarios(): void {
    this.cargarUsuarios(this.paginaActual() + 1);
  }

  

  // =========================
  // NAVEGACIÓN Y ELIMINACIÓN —  
  // =========================

  crearUsuario(): void {
    this.router.navigate(['/dashboard/usuarios/crear']);
  }

  editarUsuario(id: string): void {
    this.router.navigate(['/dashboard/usuarios/editar', id]);
  }


  /** Eliminar usuario */
  readonly usuarioEliminarId = signal<string | null>(null);

  seleccionarUsuarioEliminar(id: string): void {
    this.usuarioEliminarId.set(id);
  }

  confirmarEliminacion(): void {
    const id = this.usuarioEliminarId();
    if (!id) return;

    this.usuariosService.eliminarUsuario(id).subscribe({
      next: () => {
        console.log('Usuario eliminado correctamente');
        // recarga desde el inicio para reflejar el borrado
        this.usuarios.set([]);
        this.paginaActual.set(0);
        this.cargarUsuarios(1);
        this.usuarioEliminarId.set(null);
      },
      error: (error) => {
        console.error('Error al eliminar el usuario:', error);
      },
    });
  }

}
