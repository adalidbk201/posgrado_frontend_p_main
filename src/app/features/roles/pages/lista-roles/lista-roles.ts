import { Component, effect, inject, signal } from '@angular/core';
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
  // consumir la api de roles

  // inyectar el servicio de roles
  private readonly rolesService = inject(RolesService)

  // crear señal para almacenar las roles
  readonly listRoles= signal<Rol[]>([]);

  // total de roles
  readonly totalRoles= signal(0);

  // llamar metodo getRoles del servicio de roles
  readonly getRoles= rxResource({
    stream:()=>this.rolesService.getRoles(),
  })

  // crear señal terminoBusqeda para almacenar el termino de busqueda
  readonly terminoBusqueda= signal('');

  // llmar metodo getSalaBusqueda del servicio de salas
  readonly getRolBusqueda= rxResource({
    // asingar termino en parmas
    params:()=>({
      // guardar señal en termino
      termino: this.terminoBusqueda().trim(),
    }),

    stream:({params})=>{
      // verificar si termino es vacio
      if(params.termino.length===0){
        // retornar lista de salas
        return this.rolesService.getRoles();
      }
      // retornar rol por termino de busqueda
      return this.rolesService.getRolBusqueda(params.termino);
    }
  })

  // metodo para ejecutar la busqueda
  ejecutarBusqueda(termino:string):void{
    // actualizar señal terminoBusqueda
    this.terminoBusqueda.set(termino)
  }

  constructor(){
    // verificar cambio de señal
    effect(()=>{
      //verificar si getSalas tiene datos
      if(this.getRoles.hasValue()){
        // asignar datos a la señal listRoles
        this.listRoles.set(this.getRoles.value().Data.filas);
        // asignar total de salas
        this.totalRoles.set(this.getRoles.value().Data.total);
      }
    })

    // verificar cambio de señal
    effect(()=>{
      //verificar si getRolBusqueda tiene datos
      if(this.getRolBusqueda.hasValue()){
        // asignar datos a la señal listRoles
        this.listRoles.set(this.getRolBusqueda.value().Data.filas);
        // asignar total de roles
        this.totalRoles.set(this.getRolBusqueda.value().Data.total);
      }
    })
  }

  // Inyectamos Router para navegar entre páginas
  private readonly router = inject(Router);

  // Navegar a la página para crear una rol
  crearRol(): void {
    this.router.navigate(['/dashboard/roles/crear']);
  }

  editarRol(id: string): void {

    // Navegar a la página de edición
    // Enviamos el ID de la rol en la URL
    this.router.navigate(['/dashboard/roles/editar', id]);

  }





  // Metodo Eliminar Rol
  // Signal que almacena el ID del rol seleccionado para eliminar.
  readonly rolEliminarId = signal<string | null>(null);
    // Método que selecciona el rol que se quiere eliminar.
  seleccionarRolEliminar(id: string): void {

    // Guardamos el ID en el signal.
    this.rolEliminarId.set(id);

  }

  // Método que confirma y ejecuta la eliminación.
  confirmarEliminacion(): void {

    // Obtenemos el ID almacenado.
    const id = this.rolEliminarId();

    // Verificamos que exista un ID.
    if (!id) {
      return;
    }

    // Llamamos al servicio para eliminar el rol.
    this.rolesService.eliminarRol(id).subscribe({

      // Se ejecuta cuando la eliminación fue correcta.
      next: () => {

        // Mostramos mensaje de éxito.
        console.log('Rol eliminado correctamente');

        // Recargamos la lista.
        this.getRoles.reload();

        // Recargamos la búsqueda.
        this.getRolBusqueda.reload();

        // Limpiamos el ID seleccionado.
        this.rolEliminarId.set(null);
      },

      // Se ejecuta cuando ocurre un error.
      error: (error) => {

        // Mostramos el error.
        console.error('Error al eliminar el rol:', error);
      },
    });
  }



}
