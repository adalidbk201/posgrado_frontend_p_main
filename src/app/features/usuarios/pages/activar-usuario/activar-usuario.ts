import { Component, inject } from '@angular/core';
import { UsuariosService } from '../../services/usuarios.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ActivarCuentaRequest } from '../../models/usuario.request.interface';
import { ActivarCuentaForm } from '../../components/activar-cuenta-form/activar-cuenta-form';
@Component({
  selector: 'app-activar-usuario',
  imports: [ActivarCuentaForm],
  templateUrl: './activar-usuario.html',
  styleUrl: './activar-usuario.scss',
})
export class ActivarUsuario {
   
    // injectar usuariosService
    private readonly usuariosService = inject(UsuariosService);
  
    // injectar router
    private readonly router = inject(Router);
    // inyectar ActivatedRoute
    private readonly route = inject(ActivatedRoute);

    


    // obtener el nombre del usuario de la URL
    readonly usuario = this.route.snapshot.paramMap.get('usuario');
    // metodo crearSala
    activarPerfil(datos: ActivarCuentaRequest): void {
  
      // llamamos al metodo activarCuenta: usamos .susbribe para recibir la resopuesta http Post
      this.usuariosService.activarCuenta(datos).subscribe({
        next: () => {
          console.log('Cuenta Activada correctamente');
  
          // Volver al listado
          this.router.navigate(['/login']);
        },
  
        error: (error) => {
          console.error('Error al activar la cuenta:', error);
        },
      });
    }

}
