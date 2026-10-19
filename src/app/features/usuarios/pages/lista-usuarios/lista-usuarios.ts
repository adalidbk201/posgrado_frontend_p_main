import { Component, effect, signal, inject, computed } from '@angular/core';
import { UsuariosService } from '../../services/usuarios.service';
import { Usuario } from '../../models/usuario.interface';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { PersonasService } from '../../../personas/services/personas.service';
import { Persona } from '../../../personas/models/persona.interface';

@Component({
  imports: [],
  selector: 'app-lista-usuarios',
  styleUrl: './lista-usuarios.scss',
  templateUrl: './lista-usuarios.html',
})
export class ListaUsuarios {
  /** LISTAR USUARIOS DESDE PERSONA */
  // inyectar personasService
    private readonly personasService = inject(PersonasService);
  
    // inyectar Roter para navegacion entre paginas
    private readonly router = inject(Router);
  
    // =========================
    // Cargar y filtrar
    // =========================
  
    // todas las personas cargadas desde el backend (paginado, acumulativo)
    readonly personas = signal<Persona[]>([]);
  
    // página actual cargada
    readonly paginaActual = signal(1);
  
    // total real de registros que reporta el backend (para saber si hay más páginas)
    readonly totalBackend = signal(0);
  
    // indica si se está trayendo una página adicional
    readonly cargando = signal(false);
  
    // texto del buscador
    readonly terminoBuscar = signal('');
  
  
    // lista final que se muestra en la tabla, filtrada en el cliente
    // computed crea un signal derivado - resultado depende de terminoBuscar y personas
    readonly listPersonas = computed(() => {
  
      // obtener el texto buscado, elimina espacios al prinicipio y final- convierte minuscula
      const termino = this.terminoBuscar().trim().toLowerCase();
  
      // si no escribio nada devuelve todas las personas
      // filter recorre todas las personas y decide cuales deben permanecer
      const base = !termino
      ? this.personas()
      : this.personas().filter(p =>
          `${p.nombres} ${p.primer_apellido} ${p.segundo_apellido} ${p.nro_documento}`
            .toLowerCase()
            .includes(termino) 
        );
  
      
      // ordena por fecha_creacion descendente (más reciente primero)
      // [...base] crea una copia para no mutar el array del signal original
      return [...base].sort((a, b) =>
        new Date(b.fecha_creacion).getTime() - new Date(a.fecha_creacion).getTime()
      );
  
    });
  
    
  
    // se llama directo desde el (input), sin debounce — el filtro es en memoria, no HTTP
    ejecutarBusqueda(termino: string): void {
      this.terminoBuscar.set(termino);
    }
  
  
    // calcula qué número mostrar como total de personas.
    readonly totalPersonas = computed(() =>
      this.terminoBuscar().trim() 
      // si hay texto en buscador
      ? this.listPersonas().length 
      // si no hay texto en buscador
      : this.totalBackend()
    );
    

     // Método para obtener iniciales del avatar
      getInitials(usuario: string): string {
        return usuario?.substring(0, 2)?.toUpperCase() || 'US';
      }

      // Método para asignar clase CSS según el tipo de rol
      getRoleClass(rol: string): string {
        const roleMap: { [key: string]: string } = {
          'ADMINISTRADOR': 'admin',
          'ESTUDIANTE': 'estudiante',

        };
        return roleMap[rol?.toUpperCase()] || 'default';
      }

  
    constructor() {
      // cargar la primera pagina
      this.cargarPersonas(1);
    }
  
    private cargarPersonas(pagina: number): void {
      // cuando empieza la petiicon -> true 
      this.cargando.set(true);
  
      // Solicitar datos a Django-Como getPersonas() devuelve un Observable, necesitas suscribirte:
      this.personasService.getPersonas(pagina, 100).subscribe({
  
        next: (respuesta) => {
  
          // obtener personas
          const nuevas = respuesta.Data.filas;
  
          // actualizar señal personas -> Angular te entrega el valor actual mediante: actual
          this.personas.update(actual => {
  
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
  
  
    cargarMasPersonas(): void {
      this.cargarPersonas(this.paginaActual() + 1);
    }
    
    
  
    // =========================
    // NAVEGACIÓN Y ELIMINACIÓN —  
    // =========================
  
    crearPersona(): void {
      this.router.navigate(['/dashboard/personas/crear']);
    }
  
    editarPersona(id: string): void {
      this.router.navigate(['/dashboard/personas/editar', id]);
    }
    
    // activar usuario
    activarUsuario(usuario: string): void {
      this.router.navigate(['/dashboard/usuarios/activar', usuario]);
    }
  
    /** Eliminar persona */
    readonly personaEliminarId = signal<string | null>(null);
  
    seleccionarPersonaEliminar(id: string): void {
      this.personaEliminarId.set(id);
    }
  
    confirmarEliminacion(): void {
      const id = this.personaEliminarId();
      if (!id) return;
  
      this.personasService.eliminarPersona(id).subscribe({
        next: () => {
          console.log('Persona eliminada correctamente');
          // recarga desde el inicio para reflejar el borrado
          this.personas.set([]);
          this.paginaActual.set(0);
          this.cargarPersonas(1);
          this.personaEliminarId.set(null);
        },
        error: (error) => {
          console.error('Error al eliminar la persona:', error);
        },
      });
    }
}
