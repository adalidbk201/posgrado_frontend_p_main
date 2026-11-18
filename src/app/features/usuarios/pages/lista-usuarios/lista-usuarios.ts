import { Component, effect, signal, inject, computed } from '@angular/core';
import { UsuariosService } from '../../services/usuarios.service';
import { Usuario } from '../../models/usuario.interface';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { PersonasService } from '../../../personas/services/personas.service';
import { Persona } from '../../../personas/models/persona.interface';
import { ReenviarCorreoActivacionRequest } from '../../models/usuario.request.interface';
import { ToastService } from '../../../../core/services/toast.service';
@Component({
  imports: [],
  selector: 'app-lista-usuarios',
  styleUrl: './lista-usuarios.scss',
  templateUrl: './lista-usuarios.html',
})
export class ListaUsuarios {
  /** inyectar toas para notificaiones */
   private toast = inject(ToastService);
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


    // Reenviar correo de Activación
      readonly reenviarCorreoId = signal<string | null>(null);
      readonly reenviarCorreoUsuario = signal<string | null>(null);

      seleccionarReenviarCorreo(id: string, usuario:string): void {
        this.reenviarCorreoId.set(id);
        this.reenviarCorreoUsuario.set(usuario);
      }
    
      confirmarReenviarCorreo(): void {
        const usuario_id = this.reenviarCorreoId();
        const usuario = this.reenviarCorreoUsuario();
        // Validar antes de construir el objeto
        if (!usuario_id || !usuario) return;

        const datos: ReenviarCorreoActivacionRequest = {
              nombre_usuario: usuario,
              url_foto:''
            };

        
        if (!usuario_id) return;
    
        this.usuariosService.reenviarCorreoActivar(usuario_id,datos).subscribe({
          next: () => {
            console.log('Se reenvio correo de activación');
            // notificaion toasd
            this.toast.exito('Se reenvio un codigo de activación al correo del usuario.');
            this.cerrarModal('modalRestaurar');
            
            // recarga desde el inicio para reflejar el borrado
            this.personas.set([]);
            this.paginaActual.set(0);
            this.cargarPersonas(1);
            this.personaEliminarId.set(null);
          },
          error: (err) => {
            console.error('Error al reenviar Correo de activación:', err);
            // Extrae el mensaje del backend si existe, sino usa uno por defecto
            const msg = err?.error?.Errores.estado
                    || err?.error?.message 
                    || err?.message 
                    || 'Error al reenviar Correo de activación:';
            
            this.toast.error(msg);
          },
        });
      }

    // restaurar password
    // inyectar usuariosService
      private readonly usuariosService=inject(UsuariosService)

      restaurarPassword(usuario_id: string): void {
        this.router.navigate(['/dashboard/usuarios/activar', usuario_id]);
      }

      /** rstarurar contraseña */
      readonly usuarioRestaurarId = signal<string | null>(null);
    
      seleccionarRestaurarPassword(id: string): void {
        this.usuarioRestaurarId.set(id);
      }
      // Señal para manejar la notificación inline (exito o error)
  
      readonly procesando = signal<boolean>(false);

      confirmarRestaurarPassword(): void {
        this.procesando.set(true);
        const id = this.usuarioRestaurarId();
        if (!id) return;
    
        this.usuariosService.restaurarPassword(id).subscribe({
          next: () => {
            console.log('Contraseña restaurada conrrrectamente');
            //  1. MOSTRAR TOAST DE ÉXITO
          this.toast.exito('Se ha enviado una contraseña temporal al correo del usuario.');
          this.cerrarModal('modalRestaurar');

            // recarga desde el inicio para reflejar el borrado
            this.personas.set([]);
            this.paginaActual.set(0);
            this.cargarPersonas(1);
            this.personaEliminarId.set(null);
          },
          error: (err) => {
            console.error('Error al restaurar contraseña:', err);
            //  MOSTRAR TOAST DE ERROR
            // Extrae el mensaje del backend si existe, sino usa uno por defecto
            const msg = err?.error?.Errores.estado
                    || err?.error?.message 
                    || err?.message 
                    || 'No se pudo restaurar la contraseña. Intente nuevamente.';
            
            this.toast.error(msg);
          },
        });
      }


    // subir foto de perfil
    subirFoto(usuario: string): void {
      this.router.navigate(['/dashboard/usuarios/foto-usuario']);
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

    /** ejemlo eliminar  */
    eliminarUsuario(): void {
      // ...
      this.toast.warning('El usuario ha sido eliminado.');
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
