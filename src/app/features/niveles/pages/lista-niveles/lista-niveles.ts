import { Component, computed, inject, signal } from '@angular/core';
import { NivelesService } from '../../services/niveles.service';
import { Router } from '@angular/router';
import { Nivel } from '../../models/nivel.interface';
import { SalasService } from '../../../salas/services/salas.service';
import { Sala } from '../../../salas/models/sala.interface';
 

@Component({
  selector: 'app-lista-niveles',
  imports: [],
  templateUrl: './lista-niveles.html',
  styleUrl: './lista-niveles.scss',
})
export class ListaNiveles {
  /** LISTAR NIVELES */
 // inyectar salasService
   private readonly salasService = inject(SalasService);
  private readonly nivelesService = inject(NivelesService);
   // inyectar Roter para navegacion entre paginas
   private readonly router = inject(Router);
 // Función para validar unicidad de IDs
 
   // =========================
   // Cargar y filtrar
   // =========================
 
   // todas las salas cargadas desde el backend (paginado, acumulativo)
   readonly salas = signal<Sala[]>([]);
 
   // página actual cargada
   readonly paginaActual = signal(1);
 
   // total real de registros que reporta el backend (para saber si hay más páginas)
   readonly totalBackend = signal(0);
 
   // indica si se está trayendo una página adicional
   readonly cargando = signal(false);
 
   // texto del buscador
   readonly terminoBuscar = signal('');
 
 
   // lista final que se muestra en la tabla, filtrada en el cliente
   // computed crea un signal derivado - resultado depende de terminoBuscar y salas
   readonly listSalas = computed(() => {
 
     // obtener el texto buscado, elimina espacios al prinicipio y final- convierte minuscula
     const termino = this.terminoBuscar().trim().toLowerCase();
 
     // si no escribio nada devuelve todas las salas
     // filter recorre todas las salas y decide cuales deben permanecer
     const base = !termino
     ? this.salas()
     : this.salas().filter(s =>
 
       // construye un texto con los datos de la sala para buscar por cualquiera de esos datos
       `${s.nombre_sala} ${s.estado} ${s.niveles.map(n => n.nombre_nivel).join(' ')}`
         // convierte los datos en minuscula
         .toLowerCase()
         // true si encontro el termino , false si no encontro el termino
         .includes(termino)
     );
 
     // ordena por fecha_creacion descendente (más reciente primero)
     // [...base] crea una copia para no mutar el array del signal original
     return [...base].sort((a, b) =>
       new Date(b.nombre_sala).getTime() - new Date(a.nombre_sala).getTime()
     );
 
   });
 
   
 
   // se llama directo desde el (input), sin debounce — el filtro es en memoria, no HTTP
   ejecutarBusqueda(termino: string): void {
     this.terminoBuscar.set(termino);
   }
 
 
   // calcula qué número mostrar como total de salas.
   readonly totalSalas = computed(() =>
     this.terminoBuscar().trim() 
     // si hay texto en buscador
     ? this.listSalas().length 
     // si no hay texto en buscador
     : this.totalBackend()
   );
 
   /** CONTAR CANTIDAD TOTAL NIVELES */
   readonly nivelesSalas = computed(() =>
      this.listSalas().flatMap(sala =>
        sala.niveles.map(nivel => ({
          ...nivel,
          nombre_sala: sala.nombre_sala
        }))
      )
    );

   constructor() {
     // cargar la primera pagina
     this.cargarSalas(1);
   }
 
   private cargarSalas(pagina: number): void {
     // cuando empieza la petiicon -> true 
     this.cargando.set(true);
 
     // Solicitar datos a Django-Como getSalas() devuelve un Observable, necesitas suscribirte:
     this.salasService.getSalas(pagina, 100).subscribe({
 
       next: (respuesta) => {
 
         // obtener salas
         const nuevas = respuesta.Data.filas;
 
         // actualizar señal salas -> Angular te entrega el valor actual mediante: actual
         this.salas.update(actual => {
 
           //          crea un conjunto de los IDs extraidos.
           const idsExistentes = new Set(actual.map(p => p.id));
 
           // De las salas nuevas, quédate solamente con aquellas cuyo ID todavía no existe en salas.
           const sinDuplicar = nuevas.filter(p => !idsExistentes.has(p.id));
 
           // Agregar las nuevas salas
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
 
 
   cargarMasSalas(): void {
     this.cargarSalas(this.paginaActual() + 1);
   }
 
   
 
   // =========================
   // NAVEGACIÓN Y ELIMINACIÓN —  
   // =========================
 
   crearSala(): void {
     this.router.navigate(['/dashboard/salas/crear']);
   }
 
   editarNivel(id: string, numero_nivel:number, nombre_nivel:string, filas:number,columnas:number,id_sala:String,nombre_sala:string): void {
     this.router.navigate(['/dashboard/niveles/editar', id,numero_nivel,nombre_nivel,filas,columnas,id_sala,nombre_sala]);
   }
 
 
   /** Eliminar sala */
   readonly nivelEliminarId = signal<string | null>(null);
 
   seleccionarSalaEliminar(id: string): void {
     this.nivelEliminarId.set(id);
   }
 
   confirmarEliminacion(): void {
     const id = this.nivelEliminarId();
     if (!id) return;
 
     this.nivelesService.eliminarNivel(id).subscribe({
       next: () => {
         console.log('Nivel eliminado correctamente');
         // recarga desde el inicio para reflejar el borrado
         this.salas.set([]);
         this.paginaActual.set(0);
         this.cargarSalas(1);
         this.nivelEliminarId.set(null);
       },
       error: (error) => {
         console.error('Error al eliminar el nivel:', error);
       },
     });
   }
}
