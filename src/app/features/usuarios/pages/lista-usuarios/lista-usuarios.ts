import { Component, effect, signal, inject } from '@angular/core';
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
  // consumir la api usuarios

  // inyectar el servicio de usuarios
  private readonly usuariosService= inject(UsuariosService)

  // crear señal para almacenar Usuarios
  readonly listUsuarios=signal<Usuario[]>([])

  // total de Usuarios
  readonly totalUsuarios=signal(0)

  // llamar metodo getUsuarios del servicio Usuario
  readonly getUsuarios=rxResource({
    stream:()=>this.usuariosService.getUsuarios()
  })

  // crear señal termino busqueda para alamcenar el termino de busqueda
  readonly terminoBusqueda=signal('')

  // llamar al metodo getUsuarioBsqueda del servicio usuario
  readonly getUsuarioBusqueda= rxResource({
    // asignar termino en params
    params:()=>({
      // guardar señal en termino
      termino :this.terminoBusqueda().trim(),
    }),

    stream:({params})=>{
      // verificar si termino es vacio
      if(params.termino.length === 0){
        // retorna lista usuarios
        return this.usuariosService.getUsuarios()
      }
      return this.usuariosService.getUsuarioBusqueda(params.termino)
    }
  })

  // metodo para ejecutar la busqueda
  ejecutarBusqueda(termino:string):void{
    //actualizar señal termino busqueda
    this.terminoBusqueda.set(termino)
  }

  constructor(){
    // verificar cambio de señal
    effect(()=>{
      // verificar si getUsuarios tiene datos
      if(this.getUsuarios.hasValue()){
        // actualizar señal 
        this.listUsuarios.set(this.getUsuarios.value().Data.filas)
        this.totalUsuarios.set(this.getUsuarios.value().Data.total)
      }
    })

    // verificar cambio de señal
    effect(()=>{
      // verificar si getUsuariosBusqueda tiene datos
      if(this.getUsuarioBusqueda.hasValue()){
        // actualizar señal
        this.listUsuarios.set(this.getUsuarioBusqueda.value().Data.filas)
        this.totalUsuarios.set(this.getUsuarioBusqueda.value().Data.total)
      }
    })
  }

  // Inyectamos Router para navegar entre paginas
  private readonly router = inject(Router);

  // navegar a la pagina crear usuario
  crearUsuario():void{
    this.router.navigate(['/dashboard/usuarios/crear'])
  }

  editarUsuario(id:string):void{
    // navegar a la pagina de edicion
    // enviamos el id del usuario en la url
    this.router.navigate(['/dashboard/usuarios/editar', id])
  }



  // Metodo Eliminar usuario
  // Signal que almacena el ID del usuario seleccionada para eliminar.
  readonly usuarioEliminarId = signal<string | null>(null);
  // Método que selecciona el usuario que se quiere eliminar.
  seleccionarUsuarioEliminar(id: string): void {

    // Guardamos el ID en el signal.
    this.usuarioEliminarId.set(id);

  }

  // Método que confirma y ejecuta la eliminación.
  confirmarEliminacion(): void {

    // Obtenemos el ID almacenado.
    const id = this.usuarioEliminarId();

    // Verificamos que exista un ID.
    if (!id) {
      return;
    }

    // Llamamos al servicio para eliminar la usuario.
    this.usuariosService.eliminarUsuario(id).subscribe({

      // Se ejecuta cuando la eliminación fue correcta.
      next: () => {

        // Mostramos mensaje de éxito.
        console.log('Sala eliminada correctamente');

        // Recargamos la lista.
        this.getUsuarios.reload();

        // Recargamos la búsqueda.
        this.getUsuarioBusqueda.reload();

        // Limpiamos el ID seleccionado.
        this.usuarioEliminarId.set(null);
      },

      // Se ejecuta cuando ocurre un error.
      error: (error) => {

        // Mostramos el error.
        console.error('Error al eliminar el usuario:', error);
      },
    });
  }


}
