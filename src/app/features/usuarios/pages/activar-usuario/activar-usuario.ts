import { Component, inject } from '@angular/core';
import { UsuariosService } from '../../services/usuarios.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-activar-usuario',
  imports: [],
  templateUrl: './activar-usuario.html',
  styleUrl: './activar-usuario.scss',
})
export class ActivarUsuario {
  // injectar SalasService
  private readonly usuariosService= inject(UsuariosService)

  // inyectar ActivatedRoute
  private readonly route = inject(ActivatedRoute);

  // inyectar Router
  private readonly router = inject(Router);


  // obtener el nombre del usuario de la URL
   readonly usuario = this.route.snapshot.paramMap.get('usuario');
  

  // Creamos un signal que inicialmente no contiene ninguna sala.
//  readonly sala = signal<Sala | null>(null)

  constructor() {
     
    console.log('Nombre Usuario:', this.usuario);

     
  }

}
