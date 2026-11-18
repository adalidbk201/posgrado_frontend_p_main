import { Component, inject, signal } from '@angular/core';
import { UsuariosService } from '../../services/usuarios.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ActivarCuentaRequest } from '../../models/usuario.request.interface';
import { ActivarCuentaForm } from '../../components/activar-cuenta-form/activar-cuenta-form';
import { ToastService } from '../../../../core/services/toast.service';
@Component({
  selector: 'app-activar-usuario',
  imports: [ActivarCuentaForm],
  templateUrl: './activar-usuario.html',
  styleUrl: './activar-usuario.scss',
})
export class ActivarUsuario {
    /** inyectar toas para notificaiones */
   private toast = inject(ToastService);
    // injectar usuariosService
    private readonly usuariosService = inject(UsuariosService);
  
    // injectar router
    private readonly router = inject(Router);
    // inyectar ActivatedRoute
    private readonly route = inject(ActivatedRoute);

    


    // obtener el nombre del usuario de la URL
    readonly usuario = this.route.snapshot.paramMap.get('usuario');

    // Mensaje de activación para estudiantes
    readonly cuentaActivada = signal(false);

    // metodo crearSala
    activarPerfil(datos: ActivarCuentaRequest): void {
  
      // llamamos al metodo activarCuenta: usamos .susbribe para recibir la resopuesta http Post
      this.usuariosService.activarCuenta(datos).subscribe({
        next: () => {
          console.log('Cuenta Activada correctamente');

          //  1. MOSTRAR TOAST DE ÉXITO
          if(this.usuario === 'Estudiante'){

              // Mostrar mensaje en el HTML
              this.cuentaActivada.set(true);

              // Esperar 5 segundos antes de redirigir
              setTimeout(() => {
                this.router.navigate(['/login']);
              }, 5000);

          }else{

            this.toast.exito('Cuenta Activada correctamente.');
             this.router.navigate(['/dashboard/usuarios']);

          } 
          
        },
  
        error: (err) => {
          console.error('Error al activar la cuenta:', err);
          // Extrae el mensaje del backend si existe, sino usa uno por defecto
            const msg = err?.error?.Errores.estado
                    || err?.error?.message 
                    || err?.message 
                    || 'Error al activar la cuenta.';
            this.toast.error(msg);
        },
      });
    }

}
